const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TICKET_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(TICKET_DIR, 'screenshots/mobile');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const AU_BASE = 'https://mcstaging2.globewest.com.au';
const US_BASE = 'https://mcstaging2.globewest.com';

const AU_CREDS = {
  email: 'deepalilondhe576@gmail.com',
  pass: 'Deep@123'
};

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function scrollPageFully(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 150);
    });
  });
  await page.waitForTimeout(2000);
}

(async () => {
  console.log('========================================================================');
  console.log('📱 MOBILE QA AUDIT (AUTHENTICATED DUAL-URL, 390x844): ABOUT US PAGE');
  console.log('========================================================================');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=390,844']
  });

  // 1. AU MOBILE BASELINE (AUTHENTICATED)
  console.log('\n--- Step 1: Auditing AU Mobile Baseline (Authenticated) ---');
  const auContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });
  const auPage = await auContext.newPage();

  console.log('🔐 Logging in to AU Staging...');
  await auPage.goto(`${AU_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(2000);
  await clearOverlays(auPage);

  const auEmail = auPage.locator('#email');
  if (await auEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await auEmail.fill(AU_CREDS.email);
    await auPage.fill('#pass', AU_CREDS.pass);
    await auPage.click('#send2');
    await auPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await auPage.waitForTimeout(2500);
    console.log('✅ AU Staging Authenticated.');
  }

  console.log('👉 Navigating to AU About Us...');
  await auPage.goto(`${AU_BASE}/about-us`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(3000);
  await clearOverlays(auPage);
  await scrollPageFully(auPage);

  await auPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_AU_AUTH_mobile_about_us_full.png'), fullPage: true });
  await auPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_AU_AUTH_mobile_about_us_viewport.png') });
  console.log('📸 AU Authenticated Mobile screenshots captured.');
  await auContext.close();

  // 2. US MOBILE STAGING (AUTHENTICATED)
  console.log('\n--- Step 2: Auditing US Mobile Target (Authenticated) ---');
  const usContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });
  const usPage = await usContext.newPage();

  console.log('🔐 Logging in to US Staging with Trade Customer...');
  await usPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(2000);
  await clearOverlays(usPage);

  const usEmail = usPage.locator('#email');
  if (await usEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await usEmail.fill(US_CREDS.email);
    await usPage.fill('#pass', US_CREDS.pass);
    await usPage.click('#send2');
    await usPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await usPage.waitForTimeout(2500);
    console.log('✅ US Staging Authenticated.');
  }

  console.log('👉 Navigating to US About Us...');
  await usPage.goto(`${US_BASE}/about-us`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(3000);
  await clearOverlays(usPage);
  await scrollPageFully(usPage);

  await usPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_US_AUTH_mobile_about_us_full.png'), fullPage: true });
  await usPage.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_US_AUTH_mobile_about_us_viewport.png') });
  console.log('📸 US Authenticated Mobile screenshots captured.');
  await usContext.close();

  await browser.close();
  console.log('\n🎉 Mobile Dual-Auth Audit Completed Successfully!');
})();
