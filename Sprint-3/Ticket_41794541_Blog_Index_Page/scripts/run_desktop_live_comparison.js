const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'desktop');
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
  console.log('🖥️ GLOBEWEST AUDIT: TICKET #41794541 - BLOG INDEX PAGE (DESKTOP 1440x900)');
  console.log('Comparing Live AU vs US Staging');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // 1. Capture AU Live Baseline (Desktop)
  console.log(`🌐 [1/2] Loading AU Live Baseline: ${AU_URL}`);
  try {
    await page.goto(AU_URL, { timeout: 60000, waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await clearOverlays(page);
    await page.screenshot({ path: path.join(LIVE_AU_DIR, '01_blog_index_viewport.png'), animations: 'disabled' });
    console.log('   ✅ AU Baseline Desktop captured.');
  } catch (err) {
    console.error('   ❌ AU capture error:', err.message);
  }

  // 2. Capture US Live Staging (Desktop)
  console.log(`🌐 [2/2] Loading US Staging: ${US_URL}`);
  try {
    await page.goto(US_URL, { timeout: 60000, waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await clearOverlays(page);
    await page.screenshot({ path: path.join(US_STAGING_DIR, '01_blog_index_viewport.png'), animations: 'disabled' });
    console.log('   ✅ US Staging Desktop captured.');
  } catch (err) {
    console.error('   ❌ US capture error:', err.message);
  }

  await browser.close();
  console.log('\n🎉 Desktop capture complete!');
})();
