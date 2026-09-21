// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const PDP_URL = `${US_BASE_URL}/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak`;
const PLP_URL = `${US_BASE_URL}/indoor`;

const OUT_DIR = path.join(__dirname, '..', '..', 'Enable Public Browsing Mode', 'figma_cross_verification');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

test('Full Cross-Verification of Figma Sticky Note Requirements', async ({ browser }) => {
  test.setTimeout(300000);

  const results = {
    loggedOutDesktop: {},
    loggedOutMobile: {},
    loggedInTradeDesktop: {},
    loggedInMSRPDesktop: {},
    loggedInMobile: {},
    checkoutAndAccount: {},
    stockAndDates: {}
  };

  // =========================================================================
  // 1. LOGGED OUT - DESKTOP (1440x900)
  // Figma Spec:
  // - Book showroom + Become a Trade Customer links are displayed.
  // - No pricing is visible in this view. A customer has to log in to see pricing.
  // =========================================================================
  console.log('\n--- 1. AUDITING LOGGED OUT (DESKTOP) ---');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageDesk = await desktopContext.newPage();

  // Test on PLP
  await pageDesk.goto(PLP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageDesk.waitForTimeout(3000);

  const plpDeskCheck = await pageDesk.evaluate(() => {
    const text = document.body.innerText;
    const topBar = document.querySelector('.panel.header, .header__utility, .header-panel, header');
    const hasBecomeTrade = text.includes('Become a Trade Customer') || text.includes('Ready to Buy');
    const hasBookShowroom = text.includes('Book Showroom');
    const pricesFound = Array.from(document.querySelectorAll('.price, .price-box, [data-price-type]'))
      .map(el => el.textContent?.trim())
      .filter(t => t && t.includes('$'));
    return {
      hasBecomeTrade,
      hasBookShowroom,
      pricesFoundOnPLP: pricesFound.length
    };
  });
  results.loggedOutDesktop.plp = plpDeskCheck;

  // Test on PDP
  await pageDesk.goto(PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageDesk.waitForTimeout(3000);

  const pdpDeskCheck = await pageDesk.evaluate(() => {
    const text = document.body.innerText;
    const hasBecomeTrade = text.includes('Become a Trade Customer') || text.includes('Ready to Buy');
    const hasBookShowroom = text.includes('Book Showroom');
    const pricesInMain = Array.from(document.querySelectorAll('.product-info-main .price, .product-info-price'))
      .map(el => el.textContent?.trim())
      .filter(t => t && t.includes('$'));
    const addToCart = document.querySelector('#product-addtocart-button, .action.tocart.primary');
    return {
      hasBecomeTrade,
      hasBookShowroom,
      pricesInMainCount: pricesInMain.length,
      addToCartPresent: !!addToCart && window.getComputedStyle(addToCart).display !== 'none'
    };
  });
  results.loggedOutDesktop.pdp = pdpDeskCheck;

  // Take screenshot of Desktop PDP Logged Out
  await pageDesk.screenshot({ path: path.join(OUT_DIR, '01_DESKTOP_LOGGED_OUT_PDP.png') });

  // =========================================================================
  // 2. LOGGED OUT - MOBILE (390x844 - iPhone 14)
  // Figma Spec:
  // - Mobile: No utility bar
  // =========================================================================
  console.log('\n--- 2. AUDITING LOGGED OUT (MOBILE) ---');
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const pageMob = await mobileContext.newPage();

  await pageMob.goto(PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageMob.waitForTimeout(3000);

  const mobCheck = await pageMob.evaluate(() => {
    const utilityBar = document.querySelector('.panel.header, .header__utility, .header-panel');
    const isUtilityVisible = utilityBar ? window.getComputedStyle(utilityBar).display !== 'none' : false;
    return {
      utilityBarExists: !!utilityBar,
      isUtilityVisible
    };
  });
  results.loggedOutMobile = mobCheck;

  await pageMob.screenshot({ path: path.join(OUT_DIR, '02_MOBILE_LOGGED_OUT_PDP.png') });

  // =========================================================================
  // 3. LOGGED IN - TRADE PRICING VIEW (DESKTOP)
  // Figma Spec:
  // - If dropdown shows "Trade", showcase customer's trade pricing + MSRP pricing
  // - Remove "Become a Trade Customer" link when user is logged in
  // =========================================================================
  console.log('\n--- 3. AUDITING LOGGED IN (TRADE VIEW) ---');
  await pageDesk.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageDesk.waitForTimeout(2000);

  const emailField = pageDesk.locator('#email, input[name="login[username]"]').first();
  const passField = pageDesk.locator('#pass, input[name="login[password]"]').first();
  const submitBtn = pageDesk.locator('#send2, button.action.login.primary').first();

  if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await passField.fill('Deep@123');
    await submitBtn.click();
    await pageDesk.waitForTimeout(4000);
  }

  await pageDesk.goto(PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageDesk.waitForTimeout(3000);

  const tradeDeskCheck = await pageDesk.evaluate(() => {
    const text = document.body.innerText;
    const hasBecomeTrade = text.includes('Become a Trade Customer');
    
    // Check Pricing Toggle in Header
    const toggle = document.querySelector('.pricing-toggle, .trade-toggle, [data-role="pricing-toggle"]') || document.querySelector('.header__utility');
    const toggleText = toggle ? toggle.innerText : '';
    
    // Check Trade Price & MSRP
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const priceText = priceBox ? priceBox.innerText : '';
    
    const addToCart = document.querySelector('#product-addtocart-button, .action.tocart.primary');
    const qty = document.querySelector('#qty, input[name="qty"]');

    return {
      becomeTradeRemoved: !hasBecomeTrade,
      toggleFound: !!toggle,
      toggleText,
      priceText,
      hasTradeAndMSRP: priceText.includes('MSRP') || priceText.includes('$'),
      addToCartVisible: !!addToCart && window.getComputedStyle(addToCart).display !== 'none',
      qtyVisible: !!qty
    };
  });
  results.loggedInTradeDesktop = tradeDeskCheck;

  await pageDesk.screenshot({ path: path.join(OUT_DIR, '03_DESKTOP_LOGGED_IN_TRADE_VIEW.png') });

  // =========================================================================
  // 4. LOGGED IN - MSRP VIEW (DESKTOP)
  // Figma Spec:
  // - If dropdown shows "MSRP", showcase MSRP only and hide customer's trade pricing
  // =========================================================================
  console.log('\n--- 4. AUDITING LOGGED IN (MSRP VIEW) ---');
  // Click MSRP Toggle if present
  const msrpOption = pageDesk.locator('text="MSRP", [data-price-view="msrp"], button:has-text("MSRP")').first();
  const msrpVis = await msrpOption.isVisible({ timeout: 2000 }).catch(() => false);
  if (msrpVis) {
    await msrpOption.click().catch(() => {});
    await pageDesk.waitForTimeout(2500);
  }

  const msrpDeskCheck = await pageDesk.evaluate(() => {
    const htmlClass = document.documentElement.className;
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const priceText = priceBox ? priceBox.innerText : '';
    return {
      htmlClass,
      priceText
    };
  });
  results.loggedInMSRPDesktop = msrpDeskCheck;

  await pageDesk.screenshot({ path: path.join(OUT_DIR, '04_DESKTOP_LOGGED_IN_MSRP_VIEW.png') });

  // =========================================================================
  // 5. IN STOCK & DATES FORMAT (USA FORMAT)
  // Figma Spec:
  // - Ensure display of dates is in correct format for USA
  // - Display stock available + any buffer logic
  // - Next shipment line to display amount coming and timing
  // =========================================================================
  console.log('\n--- 5. AUDITING STOCK & DATES (USA FORMAT) ---');
  const stockCheck = await pageDesk.evaluate(() => {
    const stockEl = document.querySelector('.stock.available, .availability, [class*="stock"], .product-info-stock');
    const stockText = stockEl ? stockEl.innerText : '';
    const etaText = document.body.innerText.match(/ETA[\s\S]{0,40}/i)?.[0] || '';
    return {
      stockText,
      etaText
    };
  });
  results.stockAndDates = stockCheck;

  console.log('\n============================================================');
  console.log('FINAL AUDIT RESULTS AGAINST FIGMA STICKY NOTE:');
  console.log('============================================================');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.join(OUT_DIR, 'FIGMA_STICKY_NOTE_AUDIT_REPORT.json'),
    JSON.stringify(results, null, 2)
  );

  await desktopContext.close();
  await mobileContext.close();
});
