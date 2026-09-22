const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const US_STORE_URL = 'https://mcstaging2.globewest.com';
const QUOTES_URL = `${US_STORE_URL}/gw_quotes/quote/index/`;
const OUT_DIR = path.resolve(__dirname, '../../Sprint-3/Ticket_My_Quotes/screenshots/desktop');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

(async () => {
  console.log('🚀 Launching Chrome to inspect Live My Quotes Page...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Navigate to login
    console.log('Navigating to Trade Login...');
    await page.goto(`${US_STORE_URL}/customer/account/login/`, { timeout: 60000 });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input#email, input[name="login[username]"]').first();
    const passInput = page.locator('input#pass, input[name="login[password]"]').first();
    const loginBtn = page.locator('button#send2, button.action.login.primary').first();

    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Submitting Trade credentials...');
      await emailInput.fill(TRADE_USER.email);
      await passInput.fill(TRADE_USER.password);
      await loginBtn.click();
      await page.waitForTimeout(5000);
      console.log('Logged in. Current URL:', page.url());
    }

    // 2. Navigate to My Quotes
    console.log(`Navigating to My Quotes: ${QUOTES_URL}...`);
    await page.goto(QUOTES_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    console.log('Final URL:', page.url());
    console.log('Page Title:', await page.title());

    // Capture screenshot
    const shotPath = path.join(OUT_DIR, '01_my_quotes_live_page.png');
    await page.screenshot({ path: shotPath, fullPage: true });
    console.log('📸 Captured full page screenshot:', shotPath);

    // Inspect key components on the page
    const pageHeading = await page.locator('h1, .page-title').first().innerText().catch(() => 'N/A');
    console.log('Page Heading:', pageHeading);

    const hasQuotesTable = await page.locator('table, .gw-quotes-grid, #my-quotes-table').first().isVisible().catch(() => false);
    console.log('Has Quotes Grid/Table:', hasQuotesTable);

    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error during My Quotes inspection:', err.message);
    await browser.close().catch(() => {});
  }
})();
