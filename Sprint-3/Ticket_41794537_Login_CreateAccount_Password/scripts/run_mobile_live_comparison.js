const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'mobile');
const LIVE_AU_DIR = path.join(SCREENSHOTS_DIR, 'live_au');
const US_STAGING_DIR = path.join(SCREENSHOTS_DIR, 'us_staging');

fs.mkdirSync(LIVE_AU_DIR, { recursive: true });
fs.mkdirSync(US_STAGING_DIR, { recursive: true });

const PAGES = [
  {
    name: '01_login_page',
    title: 'Customer Login',
    liveAuUrl: 'https://www.globewest.com.au/customer/account/login/',
    auStagingUrl: 'https://mcstaging2.globewest.com.au/customer/account/login/',
    usStagingUrl: 'https://mcstaging2.globewest.com/customer/account/login/'
  },
  {
    name: '02_create_account_page',
    title: 'Create An Account',
    liveAuUrl: 'https://www.globewest.com.au/customer/account/create/',
    auStagingUrl: 'https://mcstaging2.globewest.com.au/customer/account/create/',
    usStagingUrl: 'https://mcstaging2.globewest.com/customer/account/create/'
  },
  {
    name: '03_forgot_password_page',
    title: 'Forgot Your Password',
    liveAuUrl: 'https://www.globewest.com.au/customer/account/forgotpassword/',
    auStagingUrl: 'https://mcstaging2.globewest.com.au/customer/account/forgotpassword/',
    usStagingUrl: 'https://mcstaging2.globewest.com/customer/account/forgotpassword/'
  }
];

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('📱 GLOBEWEST AUDIT: LOGIN, CREATE ACCOUNT, PASSWORD (MOBILE 390x844)');
  console.log('Comparing Live AU vs US Staging');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
  });

  const page = await context.newPage();

  for (const item of PAGES) {
    console.log(`\n------------------------------------------------------------------------`);
    console.log(`🔍 Testing Section: ${item.title} (${item.name})`);
    console.log(`------------------------------------------------------------------------`);

    // 1. Live AU Capture
    console.log(`🇦🇺 Navigating to Live AU: ${item.liveAuUrl}`);
    try {
      await page.goto(item.liveAuUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await clearOverlays(page);

      const auVpPath = path.join(LIVE_AU_DIR, `${item.name}_viewport.png`);
      const auFpPath = path.join(LIVE_AU_DIR, `${item.name}_fullpage.png`);

      await page.screenshot({ path: auVpPath });
      await page.screenshot({ path: auFpPath, fullPage: true });
      console.log(`   ✅ Saved Live AU Viewport: ${auVpPath}`);
      console.log(`   ✅ Saved Live AU FullPage: ${auFpPath}`);
    } catch (e) {
      console.warn(`   ⚠️ Live AU capture warning for ${item.name}: ${e.message}`);
    }

    // 2. US Staging Capture
    console.log(`🇺🇸 Navigating to US Staging: ${item.usStagingUrl}`);
    try {
      await page.goto(item.usStagingUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await clearOverlays(page);

      const usVpPath = path.join(US_STAGING_DIR, `${item.name}_viewport.png`);
      const usFpPath = path.join(US_STAGING_DIR, `${item.name}_fullpage.png`);

      await page.screenshot({ path: usVpPath });
      await page.screenshot({ path: usFpPath, fullPage: true });
      console.log(`   ✅ Saved US Staging Viewport: ${usVpPath}`);
      console.log(`   ✅ Saved US Staging FullPage: ${usFpPath}`);
    } catch (e) {
      console.warn(`   ⚠️ US Staging capture warning for ${item.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\n========================================================================');
  console.log('🎉 Mobile Audit Completed Successfully!');
  console.log('========================================================================\n');
})();
