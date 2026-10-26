const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const DEFECTS_DIR = path.join(BASE_DIR, 'screenshots', 'defects');
fs.mkdirSync(DEFECTS_DIR, { recursive: true });

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🖥️ HEADED MODE: CAPTURING RESPONSIVE DEFECT SCREENSHOTS (390x844)');
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

  // --------------------------------------------------------------------------
  // 1. Create Account Page - US Staging Initial View (Title Input Box)
  // --------------------------------------------------------------------------
  console.log('📱 1. Navigating to US Staging Create Account...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/create/', { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await clearOverlays(page);

  // Get bounding rect for Title input
  const titleRect = await page.evaluate(() => {
    const el = document.getElementById('prefix') || document.querySelector('[name="prefix"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  console.log('US Title Rect:', titleRect);

  await page.screenshot({
    path: path.join(DEFECTS_DIR, 'RAW_US_Mobile_Create_Account_Title.png')
  });

  // --------------------------------------------------------------------------
  // 2. Create Account Page - Submit to trigger validation on US Staging
  // --------------------------------------------------------------------------
  console.log('📱 2. Submitting empty form to trigger validation on US Staging...');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button.submit, button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: path.join(DEFECTS_DIR, 'RAW_US_Mobile_Create_Account_Validation.png')
  });

  // Also capture AU Create Account validation for comparison
  console.log('📱 2b. Navigating to AU Live Create Account for validation reference...');
  try {
    await page.goto('https://www.globewest.com.au/customer/account/create/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);
    await page.evaluate(() => {
      const submitBtn = document.querySelector('button.submit, button[type="submit"]');
      if (submitBtn) submitBtn.click();
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(DEFECTS_DIR, 'RAW_AU_Mobile_Create_Account_Validation.png')
    });
  } catch (e) {
    console.warn('AU validation capture note:', e.message);
  }

  // --------------------------------------------------------------------------
  // 3. Create Account Page - Password Field Focus on US Staging
  // --------------------------------------------------------------------------
  console.log('📱 3. Navigating back to US Create Account for Password Focus...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/create/', { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await clearOverlays(page);

  // Scroll to password field
  await page.evaluate(() => {
    const pwd = document.getElementById('password');
    if (pwd) pwd.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(DEFECTS_DIR, 'RAW_US_Mobile_Create_Account_Password.png')
  });

  // --------------------------------------------------------------------------
  // 4. Login Page - US Staging (Missing Remember Me)
  // --------------------------------------------------------------------------
  console.log('📱 4. Navigating to US Staging Login Page...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await clearOverlays(page);

  await page.screenshot({
    path: path.join(DEFECTS_DIR, 'RAW_US_Mobile_Login_RememberMe.png')
  });

  // AU Login reference (Showing Remember Me)
  console.log('📱 4b. Navigating to AU Live Login Page...');
  try {
    await page.goto('https://www.globewest.com.au/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);
    await page.screenshot({
      path: path.join(DEFECTS_DIR, 'RAW_AU_Mobile_Login_RememberMe.png')
    });
  } catch (e) {
    console.warn('AU Login capture note:', e.message);
  }

  await browser.close();
  console.log('\n✅ All Raw Screenshots Captured in Headed Mode!');
})();
