const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_trade_group_test';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Starting Customer 130725 Trade Group Change & PDP Verification...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  // 1. Admin Login
  console.log('Logging into Magento Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login, button[type="submit"]');
  await page.waitForTimeout(6000);

  // 2. Customers Grid
  const customersUrl = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/customer/index/index/'));
    return link ? link.href : null;
  });
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  // Search customer
  const searchInput = page.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  // Click edit on 130725 (USA Website)
  const clicked = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr'));
    for (const r of rows) {
      if (r.innerText.includes('130725') || (r.innerText.includes('deepali.londhe@overdose.digital') && r.innerText.includes('USA'))) {
        const editLink = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
        if (editLink) {
          editLink.click();
          return true;
        }
      }
    }
    return false;
  });
  console.log('Clicked edit link for customer 130725:', clicked);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(6000);

  // 3. Click Account Information
  console.log('Opening Account Information tab...');
  await page.locator('a:has-text("Account Information")').first().click();
  await page.waitForTimeout(3000);

  // Click on Group dropdown
  console.log('Opening Group dropdown UI component...');
  const groupWrap = page.locator('div[name="customer[group_id]"]');
  await groupWrap.locator('.admin__action-multiselect').click();
  await page.waitForTimeout(1000);

  // Type Trade in the search box
  console.log('Searching for "Trade" in group options...');
  const searchBox = groupWrap.locator('input.admin__action-multiselect-search');
  await searchBox.fill('Trade');
  await page.waitForTimeout(1500);

  // Capture dropdown options screenshot
  await page.screenshot({ path: path.join(OUT_DIR, '01_dropdown_trade_search.png') });

  // Find and click Trade option
  const tradeOptionClicked = await page.evaluate(() => {
    const wrap = document.querySelector('div[name="customer[group_id]"]');
    if (!wrap) return false;
    const items = Array.from(wrap.querySelectorAll('.action-menu-item, .admin__action-multiselect-label, li, label, span'));
    const tradeItem = items.find(el => el.innerText.trim().toLowerCase() === 'trade' || el.innerText.trim() === 'Trade');
    if (tradeItem) {
      tradeItem.click();
      return true;
    }
    return false;
  });
  console.log('Trade option clicked:', tradeOptionClicked);
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(OUT_DIR, '02_trade_selected.png') });

  // 4. Click Save Customer
  console.log('Saving Customer...');
  await page.click('#save, button[data-ui-id="save-button"]');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(8000);

  const saveNotice = await page.locator('.message-success, .messages').innerText().catch(() => 'No message');
  console.log('Save result notice:', saveNotice.trim());
  await page.screenshot({ path: path.join(OUT_DIR, '03_after_save.png') });

  // 5. Re-open customer 130725 and Click Login as Customer
  console.log('Re-locating customer 130725 to perform Login as Customer...');
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  const searchInput2 = page.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput2.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr'));
    for (const r of rows) {
      if (r.innerText.includes('130725') || (r.innerText.includes('deepali.londhe@overdose.digital') && r.innerText.includes('USA'))) {
        const editLink = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
        if (editLink) editLink.click();
      }
    }
  });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(6000);

  // Click Login as Customer
  console.log('⚡ Clicking "Login as Customer"...');
  const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
  await page.click('#login_as_customer, button[data-ui-id="login-as-customer-button"]');
  await page.waitForTimeout(2000);

  const confirmBtn = page.locator('.modal-popup.confirm button.action-primary, button.action-accept, .modal-footer button:has-text("OK")').first();
  if (await confirmBtn.isVisible().catch(() => false)) {
    console.log('Accepting confirmation popup modal...');
    await confirmBtn.click();
  }

  const newPage = await popupPromise;
  const storefrontPage = newPage || page;
  console.log('Waiting for storefront redirect...');
  await storefrontPage.waitForLoadState('load');
  await storefrontPage.waitForTimeout(6000);

  console.log('Storefront URL:', storefrontPage.url());
  await storefrontPage.screenshot({ path: path.join(OUT_DIR, '04_storefront_landing.png') });

  // 6. Navigate to Leon Side Table PDP
  const pdpUrl = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
  console.log('📍 Navigating to PDP:', pdpUrl);
  await storefrontPage.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await storefrontPage.waitForTimeout(6000);

  await storefrontPage.screenshot({ path: path.join(OUT_DIR, '05_pdp_trade_result.png'), fullPage: true });

  // 7. Audit Price and Trade Controls
  const pdpState = await storefrontPage.evaluate(() => {
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const prices = Array.from(document.querySelectorAll('.price, [data-price-type], .price-wrapper, .old-price, .special-price')).map(p => ({
      class: p.className,
      text: p.innerText.trim()
    }));

    const addToCartBtn = document.querySelector('#product-addtocart-button');
    const addToQuoteBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('add to quote'));

    return {
      currentUrl: window.location.href,
      headerText: document.querySelector('.header.content, .panel.header')?.innerText?.trim(),
      pricingToggle: document.querySelector('.pricing-mode-toggle, .trade-pricing-switch, .price-toggle, .utility-trade-toggle')?.innerText?.trim() || 'NOT_FOUND',
      productTitle: document.querySelector('h1')?.innerText?.trim(),
      priceBoxText: priceBox ? priceBox.innerText.trim() : 'NONE',
      detectedPrices: prices,
      hasAddToCart: !!addToCartBtn,
      addToCartVisible: !!(addToCartBtn && addToCartBtn.offsetParent),
      hasAddToQuote: !!addToQuoteBtn,
      stockStatus: document.querySelector('.stock.available, .availability, .eta-status')?.innerText?.trim(),
      tradeCTAPresent: document.body.innerText.includes('Join Trade Program')
    };
  });

  console.log('\n========================================');
  console.log('PDP TRADE AUDIT VERIFICATION:');
  console.log(JSON.stringify(pdpState, null, 2));
  console.log('========================================');

  await browser.close();
  console.log('🏁 Completed successfully!');
})();
