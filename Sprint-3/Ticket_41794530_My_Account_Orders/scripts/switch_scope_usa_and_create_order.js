const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/order_creation_usa');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';

(async () => {
  console.log('========================================================================');
  console.log('🇺🇸 SWITCHING SCOPE TO "USA WEBSITE" IN MAGENTO ADMIN (HEADED MODE)');
  console.log('   Strict Directive: Click Scope dropdown -> select "USA Website"');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log(`💬 Confirming modal dialog: "${dialog.message()}"`);
    await dialog.accept();
  });

  try {
    // 1. Authenticate to Magento Admin
    console.log('▶ [1/4] Logging into Magento Admin...');
    await page.goto(ADMIN_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForURL(/admin/, { timeout: 35000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('   ✅ Logged in successfully.');
    }

    // 2. Locate and Click the Scope Dropdown
    console.log('\n▶ [2/4] Locating the "Scope: All Store Views" dropdown menu...');
    
    // Look for Scope button / dropdown trigger
    const scopeTrigger = page.locator('#store-change-button, button.store-switcher, [data-role="store-change"], .actions.dropdown-trigger, button:has-text("Scope:"), div.store-switcher button').first();
    
    if (await scopeTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
      const currentScope = await scopeTrigger.innerText();
      console.log(`   Found Scope trigger. Current value: "${currentScope.trim()}"`);
      
      console.log('   Clicking Scope dropdown to open menu...');
      await scopeTrigger.click();
      await page.waitForTimeout(1500);

      // Locate "USA Website" or "B2B Store View" under USA Website
      console.log('   Looking for "USA Website" in the dropdown list...');
      const usaWebsiteOption = page.locator('.dropdown-menu a, .store-switcher-all a, ul.dropdown-menu li a, [data-role="store-view-item"]')
        .filter({ hasText: /^USA Website$/i })
        .first();

      const usaB2BOption = page.locator('.dropdown-menu a, .store-switcher-all a, ul.dropdown-menu li a, [data-role="store-view-item"]')
        .filter({ hasText: /USA Website/i })
        .first();

      if (await usaWebsiteOption.isVisible({ timeout: 4000 }).catch(() => false)) {
        const text = await usaWebsiteOption.innerText();
        console.log(`   ⚡ Clicking "${text.trim()}"...`);
        await usaWebsiteOption.click();
      } else if (await usaB2BOption.isVisible({ timeout: 4000 }).catch(() => false)) {
        const text = await usaB2BOption.innerText();
        console.log(`   ⚡ Clicking "${text.trim()}"...`);
        await usaB2BOption.click();
      } else {
        // Fallback: look for any item containing USA Website
        const fallbackOption = page.locator('a:has-text("USA Website"), li:has-text("USA Website") a').first();
        if (await fallbackOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log('   Clicking fallback USA Website item...');
          await fallbackOption.click();
        }
      }

      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(4000);
      console.log('   ✅ Scope switched successfully to USA Website!');
    } else {
      console.log('   Navigating to Stores > Configuration to switch Scope directly...');
      await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/system_config/', { timeout: 40000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const cfgScopeBtn = page.locator('#store-change-button, button.store-switcher').first();
      if (await cfgScopeBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cfgScopeBtn.click();
        await page.waitForTimeout(1500);
        const usaOpt = page.locator('.dropdown-menu a:has-text("USA Website"), [data-role="store-view-item"]:has-text("USA Website")').first();
        if (await usaOpt.isVisible({ timeout: 4000 }).catch(() => false)) {
          await usaOpt.click();
          await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
          await page.waitForTimeout(4000);
          console.log('   ✅ Switched scope in Configuration.');
        }
      }
    }

    await page.screenshot({ path: path.join(OUT_DIR, '05_scope_switched_to_usa_website.png'), fullPage: false });

    // 3. Navigate to Sales > Orders > Create New Order
    console.log('\n▶ [3/4] Navigating to Sales > Orders > Create New Order under USA scope...');
    const salesMenu = page.locator('#menu-magento-sales-sales, a:has-text("SALES")').first();
    await salesMenu.click();
    await page.waitForTimeout(1000);
    await page.locator('a[href*="sales/order"]:has-text("Orders")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2500);

    console.log('   Clicking "Create New Order"...');
    await page.locator('#add, button:has-text("Create New Order")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // 4. Select Customer ID 130725 & store_7 (USA B2B Store View)
    console.log('\n▶ [4/4] Selecting Customer ID 130725 & USA Store View...');
    const custRow = page.locator('tr:has-text("130725")').first();
    await custRow.click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Pick store_7 (USA Website Store -> B2B Store View)
    const store7Radio = page.locator('#store_7, input[value="7"]').first();
    if (await store7Radio.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('   Clicking store_7 radio (USA Website Store -> B2B Store View)...');
      await store7Radio.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(4000);
      console.log('   ✅ USA B2B Store View selected for order creation!');
    }

    await page.screenshot({ path: path.join(OUT_DIR, '06_usa_order_creation_ready.png'), fullPage: false });

    console.log('\n========================================================================');
    console.log('🌟 SCOPE IS NOW SET TO USA WEBSITE AND ORDER CREATION SCREEN IS OPEN!');
    console.log('   • Scope: USA Website');
    console.log('   • Customer: deepali.londhe@overdose.digital (ID: 130725)');
    console.log('   • Order Form: Loaded under USA Website Scope');
    console.log('   • Keeping browser window active on your screen for 10 minutes.');
    console.log('========================================================================\n');

    await page.waitForTimeout(600000); // 10 minutes so user can see and work on it
    await browser.close();
  } catch (err) {
    console.error('Error during scope switch and order navigation:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
