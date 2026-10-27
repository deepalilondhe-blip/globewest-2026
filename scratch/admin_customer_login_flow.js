const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch';
const OUT_DIR = path.join(SCRATCH_DIR, 'admin_login_as_customer');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Launching Google Chrome for Admin Customer Inspection...');
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

  // 1. Admin Login
  console.log('📍 Navigating to Magento Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  await page.locator('#username').fill('deepali.londhe@overdose.digital');
  await page.locator('#login').fill('2Ho770ZEeX7v');
  await page.locator('button.action-login, button[type="submit"]').first().click();
  await page.waitForTimeout(6000);

  console.log('Admin Dashboard URL:', page.url());
  await page.screenshot({ path: path.join(OUT_DIR, '01_admin_dashboard.png') });

  // 2. Navigate to Customers -> All Customers
  console.log('📍 Navigating to Customers Menu...');
  // Magento menu: #menu-magento-customer-customer or direct navigation
  const customersUrl = await page.evaluate(() => {
    const el = document.querySelector('li#menu-magento-customer-customer a, a[href*="customer/index"]');
    return el ? el.href : null;
  });
  console.log('Customers URL from menu:', customersUrl);

  if (customersUrl) {
    await page.goto(customersUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
  } else {
    // Click on Customers menu on left rail
    await page.click('li#menu-magento-customer-customer > a');
    await page.waitForTimeout(1000);
    const subItem = page.locator('.item-customer-manage a, a:has-text("All Customers")').first();
    await subItem.click();
  }
  await page.waitForTimeout(6000);

  console.log('Customers Grid URL:', page.url());
  await page.screenshot({ path: path.join(OUT_DIR, '02_customers_grid.png') });

  // 3. Search for Deepali
  console.log('🔍 Searching for "Deepali" in Customers Grid...');
  const searchInput = page.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchInput.fill('Deepali');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
  } else {
    // Try column filters
    console.log('Trying filter button...');
    const filterBtn = page.locator('button[data-action="grid-filter-expand"]').first();
    if (await filterBtn.isVisible().catch(() => false)) {
      await filterBtn.click();
      await page.waitForTimeout(1000);
      const nameInput = page.locator('input[name="name"], input[name="email"]').first();
      await nameInput.fill('deepali');
      await page.locator('button[data-action="grid-filter-apply"]').first().click();
      await page.waitForTimeout(5000);
    }
  }

  await page.screenshot({ path: path.join(OUT_DIR, '03_customers_search_results.png') });

  // Extract all matching customer rows
  const customerRows = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr:not(.empty-text)'));
    return rows.map((r, i) => {
      const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
      const editLink = r.querySelector('a.action-menu-item, a[href*="customer/edit"], td:last-child a')?.href;
      return { index: i, text: cells.join(' | '), editLink };
    });
  });

  console.log('Found Customers matching Deepali:\n', JSON.stringify(customerRows, null, 2));

  if (customerRows.length === 0) {
    console.log('No customer found directly with keyword "Deepali". Let us check grid filters.');
  } else {
    // 4. Click Edit on the first matching customer or US customer
    console.log('👉 Navigating to Customer Edit for:', customerRows[0].text);
    if (customerRows[0].editLink) {
      await page.goto(customerRows[0].editLink, { timeout: 60000, waitUntil: 'domcontentloaded' });
    } else {
      await page.locator('.data-grid tbody tr:not(.empty-text)').first().locator('a').first().click();
    }
    await page.waitForTimeout(6000);

    console.log('Customer Edit URL:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '04_customer_edit_view.png') });

    // Extract customer details: Group, Website, Email
    const custInfo = await page.evaluate(() => {
      return {
        name: document.querySelector('.page-title')?.innerText?.trim(),
        group: document.querySelector('[data-ui-id="adminhtml-customer-edit-tabs-content-tab-customer-customer-group-id"] option[selected], select[name="customer[group_id]"] option:checked')?.innerText?.trim(),
        website: document.querySelector('[data-ui-id="adminhtml-customer-edit-tabs-content-tab-customer-website-id"] option[selected], select[name="customer[website_id]"] option:checked')?.innerText?.trim(),
        topButtons: Array.from(document.querySelectorAll('.page-actions-buttons button, .page-actions button')).map(b => b.innerText.trim())
      };
    });
    console.log('Customer Details in Admin:', JSON.stringify(custInfo, null, 2));

    // 5. Look for "Login as Customer" button
    console.log('🔍 Checking for "Login as Customer" button...');
    const loginAsCustBtn = page.locator('button#login_as_customer, button:has-text("Login as Customer"), button[data-ui-id*="login-as-customer"]').first();
    const hasLoginAsCust = await loginAsCustBtn.isVisible({ timeout: 5000 }).catch(() => false);
    console.log('Has "Login as Customer" button:', hasLoginAsCust);

    if (hasLoginAsCust) {
      console.log('⚡ Clicking "Login as Customer"...');
      
      // Set up handler for popup/new page if it opens in a new tab
      const [newPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
        loginAsCustBtn.click()
      ]);

      const targetPage = newPage || page;
      await targetPage.waitForTimeout(6000);
      console.log('Storefront URL after Login as Customer:', targetPage.url());
      await targetPage.screenshot({ path: path.join(OUT_DIR, '05_storefront_after_login_as_customer.png') });

      // Check header account state
      const headerState = await targetPage.evaluate(() => {
        return {
          headerText: document.querySelector('.header.content, .panel.header')?.innerText?.trim(),
          pricingToggle: document.querySelector('.pricing-mode-toggle, .trade-pricing-switch')?.innerText?.trim()
        };
      });
      console.log('Storefront Header State:', JSON.stringify(headerState, null, 2));

      // 6. Navigate to PDP in this session to check price visibility
      console.log('📍 Navigating to Leon Side Table PDP in Customer Session...');
      await targetPage.goto('https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue', { timeout: 60000, waitUntil: 'domcontentloaded' });
      await targetPage.waitForTimeout(5000);

      await targetPage.screenshot({ path: path.join(OUT_DIR, '06_pdp_price_check_desktop.png'), fullPage: true });

      const pdpPriceDetails = await targetPage.evaluate(() => {
        return {
          pageTitle: document.title,
          h1: document.querySelector('h1')?.innerText?.trim(),
          priceBox: document.querySelector('.price-box, .product-info-price')?.innerText?.trim(),
          allPriceElements: Array.from(document.querySelectorAll('.price, [data-price-type], .price-wrapper')).map(el => el.innerText.trim()),
          addToCartBtn: document.querySelector('#product-addtocart-button')?.innerText?.trim(),
          stockStatus: document.querySelector('.stock.available, .availability, .eta-status')?.innerText?.trim(),
          isUnpricedOrMasked: document.body.innerText.includes('Trade Login Required') || document.body.innerText.includes('Join Trade Program')
        };
      });
      console.log('=== PDP PRICE CHECK RESULT ===\n', JSON.stringify(pdpPriceDetails, null, 2));

    } else {
      console.log('Could not find Login as Customer button. Checking all buttons:', custInfo.topButtons);
    }
  }

  await browser.close();
  console.log('🏁 Process complete.');
})();
