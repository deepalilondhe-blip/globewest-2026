const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_login_as_customer';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Starting Admin Login as Customer flow...');
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

  // 1. Login to Magento Admin
  console.log('📍 Logging into Magento Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login, button[type="submit"]');
  await page.waitForTimeout(6000);

  // 2. Find All Customers link
  const customersUrl = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/customer/index/index/'));
    return link ? link.href : null;
  });
  console.log('Customers Grid URL:', customersUrl);
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  // 3. Search for "deepali.londhe@overdose.digital"
  console.log('Searching for deepali.londhe@overdose.digital...');
  const searchInput = page.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  // Extract all matching customer rows with exact edit links
  const customers = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr')).filter(r => !r.classList.contains('empty-text') && !r.classList.contains('data-grid-filters'));
    return rows.map(r => {
      const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
      const editAnchor = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
      return {
        id: cells[1],
        name: cells[2],
        email: cells[4],
        group: cells[5],
        website: cells[12],
        editUrl: editAnchor ? editAnchor.href : null
      };
    }).filter(c => c.email && c.email.includes('@'));
  });

  console.log('Filtered Customers Found:\n', JSON.stringify(customers, null, 2));

  // Find the USA Website customer (ID 130725) or the first customer
  const usaCustomer = customers.find(c => c.website && c.website.includes('USA')) || customers[0];
  console.log('\n🎯 Selected Customer for Inspection:', usaCustomer);

  if (!usaCustomer || !usaCustomer.editUrl) {
    console.error('❌ Could not find valid customer edit link.');
    await page.screenshot({ path: path.join(OUT_DIR, 'error_no_customer_edit_url.png') });
    await browser.close();
    return;
  }

  // 4. Navigate to Customer Edit Page
  console.log('📍 Navigating to Customer Edit Page:', usaCustomer.editUrl);
  await page.goto(usaCustomer.editUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  await page.screenshot({ path: path.join(OUT_DIR, '01_customer_edit_view.png') });

  // 4b. Click Account Information tab to update customer group to Trade
  console.log('Clicking Account Information tab...');
  const accountTab = page.locator('a:has-text("Account Information"), [data-ui-id*="tab-customer"]').first();
  await accountTab.click();
  await page.waitForTimeout(3000);

  // Find Group dropdown inside Account Information
  const groupSelect = page.locator('.admin__field:has-text("Group") select, select[name*="group_id"], select[id*="group_id"]').first();
  const isGroupVisible = await groupSelect.isVisible().catch(() => false);
  console.log('Is Group dropdown visible:', isGroupVisible);

  if (isGroupVisible) {
    const options = await groupSelect.evaluate(sel => Array.from(sel.options).map(o => ({ value: o.value, text: o.text.trim() })));
    console.log('Available Group Options:', options);

    const tradeOption = options.find(o => o.text.toLowerCase() === 'trade' || o.text.toLowerCase().includes('trade'));
    if (tradeOption) {
      console.log(`Switching group to "${tradeOption.text}" (value: ${tradeOption.value})...`);
      await groupSelect.selectOption(tradeOption.value);
      await page.waitForTimeout(1000);

      console.log('Saving Customer...');
      await page.click('#save, button[data-ui-id="save-button"]');
      await page.waitForTimeout(8000);

      // Re-search deepali and open edit
      console.log('Re-opening edit page after save...');
      await page.goto(customersUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(5000);
      await searchInput.fill('deepali.londhe@overdose.digital');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(6000);

      const updatedCustomers = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('.data-grid tbody tr')).filter(r => !r.classList.contains('empty-text') && !r.classList.contains('data-grid-filters'));
        return rows.map(r => {
          const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
          const editAnchor = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
          return {
            id: cells[1],
            email: cells[4],
            group: cells[5],
            website: cells[12],
            editUrl: editAnchor ? editAnchor.href : null
          };
        }).filter(c => c.email && c.email.includes('@'));
      });
      const reTarget = updatedCustomers.find(c => c.id === '130725' || (c.website && c.website.includes('USA'))) || updatedCustomers[0];
      console.log('Updated customer record in grid:', reTarget);
      await page.goto(reTarget.editUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(6000);
    }
  }

  // 5. Inspect Actions and "Login as Customer"
  const actions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.page-actions-buttons button, .page-header-actions button, button[id*="customer"]')).map(b => ({
      id: b.id,
      text: b.innerText.trim(),
      dataUiId: b.getAttribute('data-ui-id')
    }));
  });
  console.log('Customer Action Buttons:', JSON.stringify(actions, null, 2));

  const loginBtnInfo = actions.find(a => a.text.toLowerCase().includes('login as customer') || (a.id && a.id.includes('login_as_customer')));

  if (loginBtnInfo) {
    console.log('⚡ Found "Login as Customer"! Clicking:', loginBtnInfo);

    // Set up listener for new window/tab
    const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);

    const sel = loginBtnInfo.id ? `#${loginBtnInfo.id}` : `button:has-text("${loginBtnInfo.text}")`;
    await page.locator(sel).click();
    await page.waitForTimeout(2000);

    // Check for confirmation modal dialog
    const confirmBtn = page.locator('.modal-popup.confirm button.action-primary, button.action-accept, .modal-footer button:has-text("OK")').first();
    if (await confirmBtn.isVisible().catch(() => false)) {
      console.log('Accepting confirmation popup modal...');
      await confirmBtn.click();
    }

    const newPage = await popupPromise;
    const storefrontPage = newPage || page;
    
    // Wait for the login as customer handshake and redirect to complete
    console.log('Waiting for login as customer redirect...');
    await storefrontPage.waitForLoadState('load');
    await storefrontPage.waitForTimeout(6000);

    console.log('📍 Storefront URL after Login as Customer:', storefrontPage.url());
    await storefrontPage.screenshot({ path: path.join(OUT_DIR, '02_storefront_landing.png') });

    // 6. Navigate to PDP to test price visibility
    const pdpUrl = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
    console.log('📍 Navigating to Leon Side Table PDP:', pdpUrl);
    await storefrontPage.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await storefrontPage.waitForTimeout(6000);

    await storefrontPage.screenshot({ path: path.join(OUT_DIR, '03_pdp_price_check.png'), fullPage: true });

    // Inspect PDP
    const audit = await storefrontPage.evaluate(() => {
      const priceBox = document.querySelector('.price-box, .product-info-price');
      const allPrices = Array.from(document.querySelectorAll('.price, [data-price-type], .price-wrapper')).map(el => el.innerText.trim());

      return {
        url: window.location.href,
        headerCustomerName: document.querySelector('.header.content, .panel.header')?.innerText?.trim(),
        productTitle: document.querySelector('h1')?.innerText?.trim(),
        isPriceBoxPresent: !!priceBox,
        priceBoxContent: priceBox ? priceBox.innerText.trim() : null,
        detectedPrices: allPrices,
        isAddCartPresent: !!document.querySelector('#product-addtocart-button'),
        hasTradeLoginCTA: document.body.innerText.includes('Join Trade Program') || document.body.innerText.includes('LOG IN'),
        hasEnquireForEta: document.body.innerText.includes('Enquire for ETA')
      };
    });

    console.log('\n========================================');
    console.log('FINAL RESULT: PRICE VISIBILITY ON PDP:');
    console.log(JSON.stringify(audit, null, 2));
    console.log('========================================');

  } else {
    console.log('❌ "Login as Customer" button NOT found among actions.');
  }

  await browser.close();
})();
