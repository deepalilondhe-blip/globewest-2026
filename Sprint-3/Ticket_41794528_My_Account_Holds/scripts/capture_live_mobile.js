const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/mobile');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 CAPTURING MOBILE LIVE STAGING: TICKET #41794528 (MY ACCOUNT - HOLDS)');
  console.log('   Target: Mobile Viewport 390x844 (iPhone 14/15/16)');
  console.log('========================================================================\n');

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
    // 1. Authenticate as Trade Customer
    console.log('▶ [1/3] Logging in on Mobile...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
      console.log('   ✅ Authenticated on Mobile.');
    }

    // 2. Navigate to Holds
    console.log('\n▶ [2/3] Navigating to My Holds on Mobile (/gw_orders/hold/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/hold/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // 3. Capture Mobile Screenshots
    console.log('\n▶ [3/3] Saving Mobile Screenshots...');
    const fullPath = path.join(OUT_DIR, '01_my_holds_mobile_live_full.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('   📸 Saved Mobile Full Page:', fullPath);

    const vpPath = path.join(OUT_DIR, '02_my_holds_mobile_live_viewport.png');
    await page.screenshot({ path: vpPath, fullPage: false });
    console.log('   📸 Saved Mobile Viewport:', vpPath);

    const tableEl = page.locator('.table-wrapper, .table-orders, .block-orders, .page-main').first();
    if (await tableEl.isVisible().catch(() => false)) {
      const tablePath = path.join(OUT_DIR, '03_my_holds_mobile_table_area.png');
      await tableEl.screenshot({ path: tablePath });
      console.log('   📸 Saved Mobile Table Area:', tablePath);
    }

    await page.waitForTimeout(2000);
    await browser.close();
    console.log('✅ Mobile capture for My Holds completed successfully!');
  } catch (err) {
    console.error('❌ Error during mobile capture:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
