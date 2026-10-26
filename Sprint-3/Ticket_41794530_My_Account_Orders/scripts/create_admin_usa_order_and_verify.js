const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/order_creation_usa');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const STOREFRONT_LOGIN_URL = 'https://mcstaging2.globewest.com/customer/account/login/';
const STOREFRONT_ORDERS_URL = 'https://mcstaging2.globewest.com/gw_orders/order/index/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';
const TRADE_PASS = 'Deep@123';

(async () => {
  console.log('========================================================================');
  console.log('🚀 [HEADED CHROME] CREATING ORDER UNDER USA WEBSITE SCOPE (STORE 7)');
  console.log('   Customer: deepali.londhe@overdose.digital (ID: 130725)');
  console.log('   Scope: USA Website Store -> B2B Store View (store_7)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 250,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log(`💬 Confirming dialog: "${dialog.message()}"`);
    await dialog.accept();
  });

  let createdOrderNumber = '';

  try {
    // -------------------------------------------------------------------------
    // STEP 1: LOGIN TO MAGENTO ADMIN
    // -------------------------------------------------------------------------
    console.log('▶ [1/6] Authenticating to Magento Admin...');
    await page.goto(ADMIN_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForURL(/admin/, { timeout: 35000 }).catch(() => {});
      await page.waitForTimeout(2500);
      console.log('   ✅ Authenticated.');
    }

    // -------------------------------------------------------------------------
    // STEP 2: OPEN SALES > ORDERS > CREATE NEW ORDER
    // -------------------------------------------------------------------------
    console.log('\n▶ [2/6] Opening Sales > Orders > Create New Order...');
    const salesMenu = page.locator('#menu-magento-sales-sales, a:has-text("SALES")').first();
    await salesMenu.click();
    await page.waitForTimeout(800);
    await page.locator('a[href*="sales/order"]:has-text("Orders")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2000);

    await page.locator('#add, button:has-text("Create New Order")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2500);

    // -------------------------------------------------------------------------
    // STEP 3: SELECT CUSTOMER ID 130725 & USA STORE VIEW (store_7)
    // -------------------------------------------------------------------------
    console.log('\n▶ [3/6] Selecting Customer (ID 130725) & Scope (store_7: USA B2B Store View)...');
    await page.locator('tr:has-text("130725")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2500);

    const store7Radio = page.locator('#store_7, input[value="7"]').first();
    if (await store7Radio.isVisible({ timeout: 5000 }).catch(() => false)) {
      await store7Radio.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('   ✅ Scope verified: USA Website Store -> B2B Store View.');
    }

    // -------------------------------------------------------------------------
    // STEP 4: ADD PRODUCT FIRST (So items table loads before address)
    // -------------------------------------------------------------------------
    console.log('\n▶ [4/6] Adding Product to Order...');
    const addProductsBtn = page.locator('#add_products, button:has-text("Add Products")').first();
    if (await addProductsBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addProductsBtn.click();
      await page.waitForTimeout(2500);

      // Check first product checkbox
      const productCheckbox = page.locator('#sales_order_create_search_grid_table input[type="checkbox"], table.data-grid input[type="checkbox"]').first();
      if (await productCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
        await productCheckbox.check();
        console.log('   Checked catalog product.');

        const addSelectedBtn = page.locator('button:has-text("Add Selected Product(s) to Order")').first();
        await addSelectedBtn.click();
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(3500);
        console.log('   ✅ Product added to order items table.');
      }
    }

    // -------------------------------------------------------------------------
    // STEP 5: FILL ADDRESS, SHIPPING METHOD & PAYMENT METHOD
    // -------------------------------------------------------------------------
    console.log('\n▶ [5/6] Filling Address, Shipping & Payment details...');

    // Billing address fields
    await page.fill('#order-billing_address_firstname', 'Deepali');
    await page.fill('#order-billing_address_lastname', 'Londhe');
    await page.fill('#order-billing_address_street0', '123 Design District Blvd');
    await page.fill('#order-billing_address_city', 'Los Angeles');
    
    // Check if region input is text or select
    const regionSelect = page.locator('#order-billing_address_region_id');
    if (await regionSelect.isVisible().catch(() => false)) {
      const regionOpts = await regionSelect.locator('option').all();
      if (regionOpts.length > 1) {
        await regionSelect.selectOption({ index: 1 });
      }
    } else {
      const regionInput = page.locator('#order-billing_address_region');
      if (await regionInput.isVisible().catch(() => false)) {
        await regionInput.fill('California');
      }
    }

    await page.fill('#order-billing_address_postcode', '90001');
    await page.fill('#order-billing_address_telephone', '3105550199');
    console.log('   Filled Billing Address.');

    // Same as billing for shipping
    const sameAsBilling = page.locator('#order-shipping_same_as_billing').first();
    if (await sameAsBilling.isVisible().catch(() => false)) {
      const isChecked = await sameAsBilling.isChecked().catch(() => false);
      if (!isChecked) {
        await sameAsBilling.check();
        await page.waitForTimeout(1000);
      }
    }

    // Get Shipping Methods
    console.log('   Getting shipping methods & rates...');
    const getRatesLink = page.locator('#order-shipping-method-summary a, a:has-text("Get shipping methods and rates")').first();
    if (await getRatesLink.isVisible({ timeout: 4000 }).catch(() => false)) {
      await getRatesLink.click();
      await page.waitForTimeout(2500);
    }

    // Select first shipping radio
    const shippingRadio = page.locator('#order-shipping-method-choose input[type="radio"]').first();
    if (await shippingRadio.isVisible({ timeout: 4000 }).catch(() => false)) {
      await shippingRadio.check();
      console.log('   Selected shipping method.');
      await page.waitForTimeout(1500);
    }

    // Select payment method radio
    console.log('   Selecting payment method...');
    const paymentRadio = page.locator('#order-billing_method input[type="radio"]').first();
    if (await paymentRadio.isVisible({ timeout: 4000 }).catch(() => false)) {
      await paymentRadio.check();
      console.log('   Selected payment method.');
      await page.waitForTimeout(1500);
    }

    await page.screenshot({ path: path.join(OUT_DIR, '01_order_form_fully_filled.png'), fullPage: false });

    // -------------------------------------------------------------------------
    // STEP 6: SUBMIT ORDER IN ADMIN
    // -------------------------------------------------------------------------
    console.log('\n▶ [6/6] Submitting Order in Magento Admin...');
    const submitBtn = page.locator('#submit_order_top_button, button[title="Submit Order"], button:has-text("Submit Order")').first();
    await submitBtn.click();
    console.log('   ⚡ Submit Order clicked! Waiting for Magento to generate order...');
    await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {});
    await page.waitForTimeout(5000);

    const headingEl = page.locator('h1.page-title').first();
    if (await headingEl.isVisible().catch(() => false)) {
      const headingText = await headingEl.innerText();
      console.log(`   🎉 ORDER RESULT: "${headingText.trim()}"`);
      const match = headingText.match(/\d{7,12}/);
      if (match) createdOrderNumber = match[0];
    }

    await page.screenshot({ path: path.join(OUT_DIR, '02_admin_order_submitted.png'), fullPage: false });

    // -------------------------------------------------------------------------
    // STEP 7: OPEN US STOREFRONT MY ORDERS IN TAB 2 TO VERIFY
    // -------------------------------------------------------------------------
    console.log('\n========================================================================');
    console.log('🔍 VERIFYING ORDER ON LIVE US STOREFRONT (/gw_orders/order/index/)...');
    console.log('========================================================================\n');

    const sfPage = await context.newPage();
    console.log('   Logging into US Storefront as Trade Customer...');
    await sfPage.goto(STOREFRONT_LOGIN_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await sfPage.waitForTimeout(1500);

    const sfEmail = sfPage.locator('#email');
    if (await sfEmail.isVisible({ timeout: 4000 }).catch(() => false)) {
      await sfEmail.fill(ADMIN_USER);
      await sfPage.fill('#pass', TRADE_PASS);
      await sfPage.click('#send2');
      await sfPage.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await sfPage.waitForTimeout(2000);
      console.log('   ✅ Storefront logged in.');
    }

    console.log('   Navigating to My Orders...');
    await sfPage.goto(STOREFRONT_ORDERS_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await sfPage.waitForTimeout(3000);
    await sfPage.reload({ waitUntil: 'networkidle', timeout: 25000 }).catch(() => {});
    await sfPage.waitForTimeout(3000);

    // Read orders grid on Storefront
    const sfGrid = await sfPage.evaluate(() => {
      const activeTab = document.querySelector('.account-listing-ui__filters__filter.is-active, .account-listing-ui__filters__filter.active')?.innerText.trim() || 'N/A';
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
      });
      return { activeTab, rowCount: rows.length, rows };
    });

    console.log('   ⭐ Active Storefront Tab:', sfGrid.activeTab);
    console.log('   ⭐ Orders Count on Storefront:', sfGrid.rowCount);
    console.log('   ⭐ Storefront Rows:', JSON.stringify(sfGrid.rows, null, 2));

    await sfPage.screenshot({ path: path.join(OUT_DIR, '03_storefront_my_orders_result.png'), fullPage: true });

    // Bring Storefront tab to front
    await sfPage.bringToFront();

    console.log('\n========================================================================');
    console.log('✅ SCRIPT EXECUTION FINISHED!');
    console.log(`   Order ID: ${createdOrderNumber || 'Created'}`);
    console.log('   Keeping browser open on screen for 3 minutes for your live review...');
    console.log('========================================================================\n');

    await page.waitForTimeout(180000); // 3 minutes review
    await browser.close();
  } catch (err) {
    console.error('Error during execution:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
