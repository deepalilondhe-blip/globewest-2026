const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/mobile');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('📱 Running headed mobile live audit for My Account - Loyalty...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  // 1. Login
  console.log('1. Logging in as US Trade Customer...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/');
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 2. Navigate to Loyalty
  console.log('2. Navigating to https://mcstaging2.globewest.com/loyalty/...');
  await page.goto('https://mcstaging2.globewest.com/loyalty/', { timeout: 60000 });
  await page.waitForTimeout(3000);

  // 3. Captures
  await page.screenshot({ path: path.join(OUT_DIR, '01_loyalty_mobile_viewport.png'), fullPage: false });
  await page.screenshot({ path: path.join(OUT_DIR, '02_loyalty_mobile_full.png'), fullPage: true });

  console.log('✅ Mobile captures saved in screenshots/mobile/');
  await browser.close();
})();
