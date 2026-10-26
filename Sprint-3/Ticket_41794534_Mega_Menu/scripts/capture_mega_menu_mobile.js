const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/mobile');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const US_BASE_URL = 'https://mcstaging2.globewest.com';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('📱 TICKET #41794534: MEGA MENU AUTHENTICATED MOBILE VIEWPORT AUDIT (390x844)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  try {
    console.log('▶ Authenticating on US Staging as Trade Customer in mobile viewport...');
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill(US_CREDS.email);
      await page.fill('#pass', US_CREDS.pass);
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2500);
    }
    await clearOverlays(page);

    console.log('▶ Navigating to US Staging Homepage (Logged-in Mobile)...');
    await page.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    // Initial closed state
    await page.screenshot({ path: path.join(OUT_DIR, '01_mobile_header_closed.png'), fullPage: false });

    // Open hamburger menu
    console.log('   Opening Hamburger navigation menu...');
    const hamburgerBtn = page.locator('.action.nav-toggle, [data-action="toggle-nav"], button.nav-toggle').first();
    if (await hamburgerBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await hamburgerBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT_DIR, '02_mobile_drawer_opened.png'), fullPage: false });
      console.log('   📸 Captured opened mobile drawer.');

      // Click "Indoor" category accordion
      const indoorCategory = page.locator('.navigation a:has-text("Indoor"), .nav-sections a:has-text("Indoor")').first();
      if (await indoorCategory.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('   Expanding "Indoor" category...');
        await indoorCategory.click();
        await page.waitForTimeout(1200);
        await page.screenshot({ path: path.join(OUT_DIR, '03_mobile_indoor_expanded.png'), fullPage: false });
      }
    }

    console.log('\n✅ Mobile mega menu capture complete!');
    await page.waitForTimeout(3000);
    await browser.close();
  } catch (err) {
    console.error('Error during mobile mega menu capture:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
