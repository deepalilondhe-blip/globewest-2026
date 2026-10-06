const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'mobile');
const LIVE_AU_DIR = path.join(SCREENSHOTS_DIR, 'live_au');
const US_STAGING_DIR = path.join(SCREENSHOTS_DIR, 'us_staging');

fs.mkdirSync(LIVE_AU_DIR, { recursive: true });
fs.mkdirSync(US_STAGING_DIR, { recursive: true });

const AU_URL = 'https://www.globewest.com.au/blog';
const US_URL = 'https://mcstaging2.globewest.com/blog';

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form, [aria-label="Close dialog"]');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('📱 GLOBEWEST AUDIT: TICKET #41794541 - BLOG INDEX PAGE (MOBILE 390x844)');
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

  // 1. Capture AU Live Baseline (Mobile)
  console.log(`🌐 [1/2] Loading AU Live Baseline (Mobile): ${AU_URL}`);
  try {
    await page.goto(AU_URL, { timeout: 60000, waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await clearOverlays(page);
    await page.screenshot({ path: path.join(LIVE_AU_DIR, '01_blog_index_viewport.png'), timeout: 60000 });
    console.log('   ✅ AU Baseline Mobile captured.');
  } catch (err) {
    console.error('   ❌ AU Mobile capture error:', err.message);
  }

  // 2. Capture US Live Staging (Mobile)
  console.log(`🌐 [2/2] Loading US Staging (Mobile): ${US_URL}`);
  try {
    await page.goto(US_URL, { timeout: 60000, waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await clearOverlays(page);
    await page.screenshot({ path: path.join(US_STAGING_DIR, '01_blog_index_viewport.png'), timeout: 60000 });
    console.log('   ✅ US Staging Mobile captured.');
  } catch (err) {
    console.error('   ❌ US Mobile capture error:', err.message);
  }

  await browser.close();
  console.log('\n🎉 Mobile capture complete!');
})();
