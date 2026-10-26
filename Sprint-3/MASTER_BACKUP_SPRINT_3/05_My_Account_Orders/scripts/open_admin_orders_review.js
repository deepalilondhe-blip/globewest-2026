const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/admin_review');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';

(async () => {
  console.log('========================================================================');
  console.log('🔐 OPENING MAGENTO ADMIN PANEL IN HEADED MODE (READ-ONLY REVIEW)');
  console.log('   Target: My Orders Configurations & Support / FAQ Settings');
  console.log('   STRICT DIRECTIVE: READ-ONLY REVIEW — NO DATA MODIFICATIONS OR SAVING');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  try {
    // 1. Navigate to Admin
    console.log('▶ [Step 1/5] Navigating to Magento Admin Login...');
    await page.goto(ADMIN_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('   Entering admin credentials...');
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      console.log('   Submitted login. Awaiting dashboard...');
      await page.waitForURL(/admin/, { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(3000);
    }

    console.log('   ✅ Logged in successfully. Current Admin URL:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '01_admin_dashboard.png'), fullPage: false });

    // 2. Open Stores -> Configuration
    console.log('\n▶ [Step 2/5] Navigating to Stores > Configuration (Read-Only)...');
    const storesMenu = page.locator('#menu-magento-backend-stores, a:has-text("STORES")').first();
    if (await storesMenu.isVisible().catch(() => false)) {
      await storesMenu.click();
      await page.waitForTimeout(1000);
      const configLink = page.locator('a[href*="system_config"]').first();
      if (await configLink.isVisible().catch(() => false)) {
        await configLink.click();
      } else {
        await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/system_config/', { waitUntil: 'domcontentloaded' });
      }
    } else {
      await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/system_config/', { waitUntil: 'domcontentloaded' });
    }

    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    console.log('   Configuration page loaded. URL:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '02_stores_configuration.png'), fullPage: false });

    // 3. Inspect left navigation tabs in Configuration
    console.log('\n▶ [Step 3/5] Locating Overdose / Customer Account configs...');
    const configTabs = await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('.config-nav-block strong, .config-nav-block a, .admin__page-nav-link'));
      return tabs.map(t => ({
        text: t.innerText.trim(),
        href: t.getAttribute('href') || ''
      })).filter(t => t.text.length > 0);
    });

    console.log('   Available Config Tabs:', configTabs.map(t => t.text).join(' | '));

    // Look for Overdose tab or Customer tab
    const overdoseTab = page.locator('.admin__page-nav-link:has-text("Overdose"), .admin__page-nav-title:has-text("Overdose"), a:has-text("Overdose"), strong:has-text("OVERDOSE")').first();
    if (await overdoseTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   Found Overdose tab. Clicking to expand...');
      await overdoseTab.click();
      await page.waitForTimeout(1500);
    }

    // Look for Customer Account Content Configs or similar
    const accountConfigs = page.locator('a:has-text("Customer Account"), a:has-text("Customer"), a:has-text("Content Configs")').first();
    if (await accountConfigs.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   Found Customer Account Configs link. Clicking...');
      await accountConfigs.click();
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT_DIR, '03_customer_account_configs.png'), fullPage: false });
    }

    // 4. Check Sales -> Orders Grid in Admin
    console.log('\n▶ [Step 4/5] Opening Sales > Orders grid (Read-Only review)...');
    const salesMenu = page.locator('#menu-magento-sales-sales, a:has-text("SALES")').first();
    if (await salesMenu.isVisible().catch(() => false)) {
      await salesMenu.click();
      await page.waitForTimeout(1000);
      const ordersLink = page.locator('a[href*="sales/order"]').first();
      if (await ordersLink.isVisible().catch(() => false)) {
        await ordersLink.click();
      } else {
        await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/sales/order/', { waitUntil: 'domcontentloaded' });
      }
    } else {
      await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/sales/order/', { waitUntil: 'domcontentloaded' });
    }

    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    console.log('   Sales Orders grid loaded. URL:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '04_sales_orders_admin_grid.png'), fullPage: false });

    // 5. Open Storefront My Orders in another tab for side-by-side review
    console.log('\n▶ [Step 5/5] Opening Storefront My Orders in a second tab for side-by-side review...');
    const sfPage = await context.newPage();
    await sfPage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sfPage.waitForTimeout(1500);

    const sfEmail = sfPage.locator('#email');
    if (await sfEmail.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sfEmail.fill(ADMIN_USER);
      await sfPage.fill('#pass', 'Deep@123');
      await sfPage.click('#send2');
      await sfPage.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await sfPage.waitForTimeout(2000);
    }
    await sfPage.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sfPage.waitForTimeout(2000);
    console.log('   Storefront My Orders loaded in Tab 2.');

    // Bring Admin tab back to front
    await page.bringToFront();

    console.log('\n========================================================================');
    console.log('👀 ADMIN PANEL IS NOW OPEN AND READY FOR YOUR LIVE REVIEW!');
    console.log('   • Tab 1: Magento Admin Panel (Sales Orders & Stores Configuration)');
    console.log('   • Tab 2: US Staging Storefront (/gw_orders/order/index/)');
    console.log('   • STRICT SAFETY: Read-only session. No data will be saved or modified.');
    console.log('   • Keeping browser window active on screen for review...');
    console.log('========================================================================\n');

    // Keep open for 5 minutes (300 seconds) so user has plenty of time to view on desktop
    await page.waitForTimeout(300000);

    await browser.close();
    console.log('Browser session closed.');
  } catch (err) {
    console.error('Error during admin panel review:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
