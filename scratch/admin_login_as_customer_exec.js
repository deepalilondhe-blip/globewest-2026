const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_login_as_customer';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Starting Login as Customer inspection...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // 1. Login to Admin
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login, button[type="submit"]');
  await page.waitForTimeout(5000);

  // 2. Extract Customers Grid link and navigate to it
  const customersUrl = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/customer/index/index/'));
    return link ? link.href : null;
  });
  console.log('Customers Grid URL:', customersUrl);

  await page.goto(customersUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  await page.screenshot({ path: path.join(OUT_DIR, '01_customers_grid_loaded.png') });

  // 3. Search for "deepali" in the search box
  console.log('Searching for "deepali"...');
  const searchInput = page.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput.fill('deepali');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  await page.screenshot({ path: path.join(OUT_DIR, '02_customers_search_results.png') });

  // Extract all rows
  const rows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.data-grid tbody tr:not(.empty-text)')).map((r, i) => {
      const tds = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
      const edit = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"], td:last-child a')?.href;
      return { index: i, cells: tds, editUrl: edit };
    });
  });

  console.log('Found Customers:\n', JSON.stringify(rows, null, 2));

  if (rows.length === 0) {
    console.log('No rows returned. Let us clear filters and inspect all first 10 customers.');
    return;
  }

  // Let's find the US customer or the first Deepali account
  const targetCustomer = rows[0];
  console.log('\nSelected Customer for Login:', targetCustomer.cells);
  console.log('Navigating to Customer Edit:', targetCustomer.editUrl);

  if (targetCustomer.editUrl) {
    await page.goto(targetCustomer.editUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } else {
    await page.locator('.data-grid tbody tr:not(.empty-text)').first().locator('a').first().click();
  }
  await page.waitForTimeout(6000);

  await page.screenshot({ path: path.join(OUT_DIR, '03_customer_edit_page.png') });

  // Extract action buttons on the customer edit page
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.page-actions button, .page-actions-buttons button, .page-header-actions button')).map(b => ({
      id: b.id,
      text: b.innerText.trim(),
      onclick: b.getAttribute('onclick'),
      dataUiId: b.getAttribute('data-ui-id')
    }));
  });
  console.log('Customer Action Buttons:', JSON.stringify(buttons, null, 2));

  // Find "Login as Customer" button
  const loginBtnInfo = buttons.find(b => b.text.toLowerCase().includes('login as customer') || (b.id && b.id.includes('login_as_customer')));
  console.log('Login as Customer button info:', loginBtnInfo);

  if (loginBtnInfo) {
    console.log('⚡ Clicking "Login as Customer"...');
    
    // In Magento 2, clicking Login as Customer might show a confirmation modal or open a new window
    // Let's set up popup listener
    const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);

    const btnSelector = loginBtnInfo.id ? `#${loginBtnInfo.id}` : `button:has-text("${loginBtnInfo.text}")`;
    await page.locator(btnSelector).click();
    await page.waitForTimeout(2000);

    // Check if modal confirmation popped up (e.g., "Are you sure you want to login as customer?")
    const modalBtn = page.locator('.action-primary.action-accept, .modal-footer button.action-primary').first();
    if (await modalBtn.isVisible().catch(() => false)) {
      console.log('Modal confirmation appeared, clicking OK/Accept...');
      await modalBtn.click();
    }

    const newPage = await popupPromise;
    const targetPage = newPage || page;
    await targetPage.waitForTimeout(6000);

    console.log('Storefront URL after Login as Customer:', targetPage.url());
    await targetPage.screenshot({ path: path.join(OUT_DIR, '04_storefront_landing.png') });

    // Header inspection
    const headerDetails = await targetPage.evaluate(() => {
      return {
        url: window.location.href,
        headerText: document.querySelector('.panel.header, .header.content')?.innerText?.trim(),
        noticeText: document.querySelector('.messages, .message-notice, .login-as-customer-notice')?.innerText?.trim(),
        pricingToggle: document.querySelector('.pricing-mode-toggle, .trade-pricing-switch')?.innerText?.trim()
      };
    });
    console.log('Header & Session Details:', JSON.stringify(headerDetails, null, 2));

    // 4. Navigate to Leon Side Table PDP
    console.log('\n📍 Navigating to Leon Side Table PDP in this session...');
    const pdpUrl = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
    await targetPage.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await targetPage.waitForTimeout(5000);

    await targetPage.screenshot({ path: path.join(OUT_DIR, '05_pdp_price_check_full.png'), fullPage: true });

    // Deep Price Inspection on PDP
    const priceCheck = await targetPage.evaluate(() => {
      const priceBox = document.querySelector('.price-box, .product-info-price');
      const allPrices = Array.from(document.querySelectorAll('.price, [data-price-type], .price-wrapper, .normal-price, .special-price, .old-price')).map(p => ({
        tag: p.tagName,
        class: p.className,
        text: p.innerText.trim()
      }));

      return {
        h1: document.querySelector('h1')?.innerText?.trim(),
        priceBoxText: priceBox ? priceBox.innerText.trim() : 'PRICE_BOX_NOT_FOUND',
        priceBoxHtml: priceBox ? priceBox.innerHTML : null,
        detectedPrices: allPrices,
        hasAddToCart: !!document.querySelector('#product-addtocart-button'),
        addToCartVisible: !!document.querySelector('#product-addtocart-button')?.offsetParent,
        hasTradeLoginCTA: document.body.innerText.includes('Join Trade Program') || document.body.innerText.includes('LOG IN'),
        enquireForEta: document.body.innerText.includes('Enquire for ETA'),
        stockStatus: document.querySelector('.stock.available, .availability, .eta-status')?.innerText?.trim()
      };
    });

    console.log('\n========================================');
    console.log('FINAL PDP PRICE VISIBILITY RESULT:');
    console.log(JSON.stringify(priceCheck, null, 2));
    console.log('========================================');

  } else {
    console.log('❌ "Login as Customer" button NOT found on customer edit page.');
  }

  await browser.close();
  console.log('Done!');
})();
