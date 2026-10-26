const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/mobile');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Capturing Mobile Live Staging for My Orders...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  try {
    // Navigate to login
    console.log('Logging in on Mobile...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      console.log('Submitted login credentials...');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(3000);
    }

    // Navigate to Orders
    console.log('Navigating to My Orders page...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Full page screenshot
    const fullPath = path.join(OUT_DIR, '01_my_orders_mobile_live_full.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('📸 Saved Mobile Full Page:', fullPath);

    // Viewport screenshot
    const vpPath = path.join(OUT_DIR, '02_my_orders_mobile_live_viewport.png');
    await page.screenshot({ path: vpPath, fullPage: false });
    console.log('📸 Saved Mobile Viewport:', vpPath);

    // Table / Empty state closeup
    const tableEl = page.locator('.table-wrapper, .table-orders, .block-orders, .page-main').first();
    if (await tableEl.isVisible().catch(() => false)) {
      const tablePath = path.join(OUT_DIR, '03_my_orders_mobile_table_area.png');
      await tableEl.screenshot({ path: tablePath });
      console.log('📸 Saved Mobile Table Area:', tablePath);
    }

    await browser.close();
    console.log('✅ Mobile capture complete for My Orders!');
  } catch (err) {
    console.error('Error:', err);
    await browser.close().catch(() => {});
  }
})();
