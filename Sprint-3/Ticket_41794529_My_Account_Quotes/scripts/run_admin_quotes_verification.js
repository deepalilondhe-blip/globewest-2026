const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';
const OUT_DIR = path.resolve(__dirname, '../screenshots/admin_review');

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('▶ [Step 1/3] Logging into Magento Admin...');
  await page.goto(ADMIN_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
  const loginInput = page.locator('#username, input[name="login[username]"]');
  if (await loginInput.isVisible().catch(() => false)) {
    await loginInput.fill(ADMIN_USER);
    await page.fill('#login, input[name="login[password]"]', ADMIN_PASS);
    await page.click('button.action-login, button:has-text("Sign in")');
    await page.waitForURL(/admin/, { timeout: 35000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }
  console.log('   ✅ Admin logged in. URL:', page.url());

  // Navigate to Quotes in Admin
  console.log('▶ [Step 2/3] Navigating to NetSuite Quotes in Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/gw_quotes/quote/index/', { timeout: 40000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const screenshotPath = path.join(OUT_DIR, '01_admin_quotes_grid_raw.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('   ✅ Admin Quotes grid screenshot saved:', screenshotPath);

  // Extract columns and records
  const gridInfo = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('th.data-grid-th, th')).map(th => th.innerText.trim()).filter(t => t.length > 0);
    const rowsCount = document.querySelectorAll('tr.data-row').length;
    const title = document.querySelector('.page-title, h1')?.innerText.trim() || document.title;
    return { title, headers, rowsCount };
  });
  console.log('   ℹ️ Grid info:', JSON.stringify(gridInfo, null, 2));

  // Step 3: Check Scope dropdown
  console.log('▶ [Step 3/3] Checking Store View / Scope dropdown...');
  const scopeBtn = page.locator('#store-change-button, button.store-switcher, [data-role="store-view-trigger"]').first();
  if (await scopeBtn.isVisible().catch(() => false)) {
    await scopeBtn.click();
    await page.waitForTimeout(1000);
    const scopeScreen = path.join(OUT_DIR, '02_admin_quotes_scope_dropdown.png');
    await page.screenshot({ path: scopeScreen });
    console.log('   ✅ Scope dropdown screenshot saved:', scopeScreen);
  }

  await browser.close();
  console.log('Admin quotes verification completed.');
})();
