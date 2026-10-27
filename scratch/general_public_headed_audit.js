const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/general_public_audit';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Phase 1: Updating Customer 130725 to "General Public" in Admin...');

  const adminBrowser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const adminPage = await adminBrowser.newPage({ viewport: { width: 1440, height: 900 } });
  await adminPage.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await adminPage.fill('#username', 'deepali.londhe@overdose.digital');
  await adminPage.fill('#login', '2Ho770ZEeX7v');
  await adminPage.click('button.action-login, button[type="submit"]');
  await adminPage.waitForTimeout(6000);

  const customersUrl = await adminPage.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/customer/index/index/'));
    return link ? link.href : null;
  });
  await adminPage.goto(customersUrl, { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(5000);

  const searchInput = adminPage.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await adminPage.keyboard.press('Enter');
  await adminPage.waitForTimeout(6000);

  // Click edit on 130725 (USA Website)
  await adminPage.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr'));
    for (const r of rows) {
      if (r.innerText.includes('130725') || (r.innerText.includes('deepali.londhe@overdose.digital') && r.innerText.includes('USA'))) {
        const editLink = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
        if (editLink) editLink.click();
      }
    }
  });
  await adminPage.waitForLoadState('domcontentloaded');
  await adminPage.waitForTimeout(6000);

  // Open Account Information
  console.log('Opening Account Information tab...');
  await adminPage.locator('a:has-text("Account Information")').first().click();
  await adminPage.waitForTimeout(3000);

  // Select General Public in UI component
  console.log('Selecting General Public group...');
  const groupWrap = adminPage.locator('div[name="customer[group_id]"]');
  await groupWrap.locator('.admin__action-multiselect').click();
  await adminPage.waitForTimeout(1000);

  const searchBox = groupWrap.locator('input.admin__action-multiselect-search');
  await searchBox.fill('General Public');
  await adminPage.waitForTimeout(1500);

  await adminPage.evaluate(() => {
    const wrap = document.querySelector('div[name="customer[group_id]"]');
    if (!wrap) return false;
    const items = Array.from(wrap.querySelectorAll('.action-menu-item, .admin__action-multiselect-label, li, label, span'));
    const gpItem = items.find(el => el.innerText.trim().toLowerCase() === 'general public');
    if (gpItem) {
      gpItem.click();
      return true;
    }
    return false;
  });
  await adminPage.waitForTimeout(2000);

  // Click Save Customer
  console.log('Saving Customer as General Public...');
  await adminPage.click('#save, button[data-ui-id="save-button"]');
  await adminPage.waitForLoadState('domcontentloaded');
  await adminPage.waitForTimeout(8000);
  console.log('Customer saved as General Public successfully!');

  await adminBrowser.close();

  // -------------------------------------------------------------
  // Phase 2: Launch HEADED Chrome on DISPLAY=:0
  // -------------------------------------------------------------
  console.log('\n🖥️ Phase 2: Launching HEADED Chrome Browser on screen (DISPLAY=:0)...');
  const headedBrowser = await chromium.launch({
    headless: false,
    slowMo: 600,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const headedContext = await headedBrowser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const headedPage = await headedContext.newPage();

  // 1. Log in to US Storefront
  console.log('Logging in to US Storefront with General Public account...');
  await headedPage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await headedPage.fill('#email', 'deepali.londhe@overdose.digital');
  await headedPage.fill('#pass', 'Deep@123');
  await headedPage.click('#send2, button[type="submit"].login');
  await headedPage.waitForTimeout(5000);

  console.log('Logged in! URL:', headedPage.url());
  await headedPage.screenshot({ path: path.join(OUT_DIR, '01_my_account_general_public.png') });

  // 2. Navigate to Leon Side Table PDP
  const pdp1 = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
  console.log('\n📍 Navigating to Leon Side Table PDP (Headed View)...');
  await headedPage.goto(pdp1, { waitUntil: 'domcontentloaded' });
  await headedPage.waitForTimeout(4000);

  // Smooth scroll down to allow visual inspection
  console.log('Scrolling down page for visual inspection...');
  await headedPage.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await headedPage.waitForTimeout(3000);
  await headedPage.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
  await headedPage.waitForTimeout(3000);
  await headedPage.evaluate(() => window.scrollBy({ top: 800, behavior: 'smooth' }));
  await headedPage.waitForTimeout(3000);
  await headedPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await headedPage.waitForTimeout(2000);

  await headedPage.screenshot({ path: path.join(OUT_DIR, '02_leon_general_public_desktop.png'), fullPage: true });

  // Deep Audit of General Public Rules on Leon Side Table
  const audit1 = await headedPage.evaluate(() => {
    const topBar = document.querySelector('.panel.header, .header-panel, .header.utility-bar, .top-bar');
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const allPrices = Array.from(document.querySelectorAll('.price, .price-wrapper, [data-price-type]')).map(p => p.innerText.trim()).filter(Boolean);
    const msrpEl = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('MSRP'));
    const tradeToggle = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.trim() === 'Trade' && el.tagName !== 'SCRIPT');
    const atcBtn = document.querySelector('#product-addtocart-button');
    const quoteBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('add to quote'));
    const joinTradeCTA = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Join Trade Program'));
    const loginCTA = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Log in to view your pricing'));
    const etaEl = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Enquire for ETA'));

    // Check Alternative Products pricing leak
    const altSection = document.querySelector('.alternative-products, .block.related');
    const altPrices = altSection ? Array.from(altSection.querySelectorAll('.price, .price-wrapper, [data-price-type], span')).map(p => p.innerText.trim()).filter(t => t.startsWith('$') || t.includes('MSRP')) : [];

    return {
      pdp: 'Leon Side Table',
      topBarText: topBar ? topBar.innerText.trim().replace(/\n+/g, ' | ') : 'NONE',
      hasTradeToggle: !!tradeToggle,
      isPriceBoxVisible: !!(priceBox && priceBox.innerText.trim()),
      priceBoxText: priceBox ? priceBox.innerText.trim() : 'NONE',
      detectedPricesOnPage: allPrices,
      hasMSRP: !!msrpEl,
      hasAddToCart: !!(atcBtn && atcBtn.offsetParent),
      hasAddToQuote: !!(quoteBtn && quoteBtn.offsetParent),
      hasJoinTradeCTA: !!joinTradeCTA,
      hasLoginPricingCTA: !!loginCTA,
      hasEtaLeak: !!etaEl,
      altProductsPriceLeak: altPrices
    };
  });

  console.log('\n=============================================================');
  console.log('AUDIT RESULT: GENERAL PUBLIC ACCOUNT (LEON SIDE TABLE):');
  console.log(JSON.stringify(audit1, null, 2));
  console.log('=============================================================');

  // 3. Navigate to Amari Planter PDP
  const pdp2 = 'https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat';
  console.log('\n📍 Navigating to Amari Planter PDP (Headed View)...');
  await headedPage.goto(pdp2, { waitUntil: 'domcontentloaded' });
  await headedPage.waitForTimeout(4000);

  await headedPage.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await headedPage.waitForTimeout(3000);
  await headedPage.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await headedPage.waitForTimeout(2000);

  await headedPage.screenshot({ path: path.join(OUT_DIR, '03_amari_general_public_desktop.png'), fullPage: true });

  const audit2 = await headedPage.evaluate(() => {
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const allPrices = Array.from(document.querySelectorAll('.price, .price-wrapper, [data-price-type]')).map(p => p.innerText.trim()).filter(Boolean);
    const msrpEl = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('MSRP'));
    const atcBtn = document.querySelector('#product-addtocart-button');
    const etaEl = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('Enquire for ETA'));
    const altSection = document.querySelector('.alternative-products, .block.related');
    const altPrices = altSection ? Array.from(altSection.querySelectorAll('.price, .price-wrapper, [data-price-type], span')).map(p => p.innerText.trim()).filter(t => t.startsWith('$') || t.includes('MSRP')) : [];

    return {
      pdp: 'Amari Planter',
      isPriceBoxVisible: !!(priceBox && priceBox.innerText.trim()),
      priceBoxText: priceBox ? priceBox.innerText.trim() : 'NONE',
      detectedPricesOnPage: allPrices,
      hasMSRP: !!msrpEl,
      hasAddToCart: !!(atcBtn && atcBtn.offsetParent),
      hasEtaLeak: !!etaEl,
      altProductsPriceLeak: altPrices
    };
  });

  console.log('\n=============================================================');
  console.log('AUDIT RESULT: GENERAL PUBLIC ACCOUNT (AMARI PLANTER):');
  console.log(JSON.stringify(audit2, null, 2));
  console.log('=============================================================');

  // Keep browser open for a few seconds for user visual review
  console.log('Leaving browser open for 6 seconds...');
  await headedPage.waitForTimeout(6000);

  await headedBrowser.close();

  // Save audit report
  fs.writeFileSync(path.join(OUT_DIR, 'general_public_audit_results.json'), JSON.stringify({ audit1, audit2 }, null, 2));
  console.log('🏁 General Public Headed Audit Finished!');
})();
