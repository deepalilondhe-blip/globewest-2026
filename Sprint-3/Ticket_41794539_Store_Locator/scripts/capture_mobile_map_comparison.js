const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const AU_LOCATOR_URL = 'https://mcstaging2.globewest.com.au/locator';
const OUT_DIR = path.resolve(__dirname, '../screenshots/mobile_map_comparison');
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('📱 CAPTURING PIXEL-PERFECT MOBILE SCREENSHOTS (AU VS US)...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Mobile Context: iPhone 14/15/16/17 (390 x 844, scale factor 2)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
  });

  // --- 1. AU BASELINE MOBILE ---
  console.log('1. Navigating to AU Baseline Mobile (/locator)...');
  const auPage = await context.newPage();
  await auPage.goto(AU_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await auPage.waitForTimeout(6000); // Allow Google Map tiles and markers to finish rendering

  // Dismiss any overlays/cookies
  await auPage.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});

  // Full Page AU Mobile
  await auPage.screenshot({ path: path.join(OUT_DIR, 'AU_MOBILE_FULL_PAGE.png'), fullPage: true });
  console.log('   Saved AU_MOBILE_FULL_PAGE.png');

  // Crop / Focus on Map Section on AU
  const auMap = auPage.locator('.locator-map-section, #js-locator-map, [class*="locator-map"]').first();
  if (await auMap.isVisible().catch(() => false)) {
    await auMap.scrollIntoViewIfNeeded();
    await auPage.waitForTimeout(1000);
    // Capture map element
    await auMap.screenshot({ path: path.join(OUT_DIR, 'AU_MOBILE_MAP_ELEMENT.png') });
    console.log('   Saved AU_MOBILE_MAP_ELEMENT.png');

    // Also capture the viewport centered on the map with the controls & search context
    await auPage.screenshot({ path: path.join(OUT_DIR, 'AU_MOBILE_MAP_VIEWPORT.png') });
    console.log('   Saved AU_MOBILE_MAP_VIEWPORT.png');
  }

  // --- 2. US STAGING MOBILE ---
  console.log('\n2. Navigating to US Staging Mobile (/locator)...');
  const usPage = await context.newPage();
  await usPage.goto(US_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await usPage.waitForTimeout(6000); // Allow Google Map tiles and markers to finish rendering

  // Dismiss any overlays/cookies
  await usPage.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});

  // Full Page US Mobile
  await usPage.screenshot({ path: path.join(OUT_DIR, 'US_MOBILE_FULL_PAGE.png'), fullPage: true });
  console.log('   Saved US_MOBILE_FULL_PAGE.png');

  // Crop / Focus on Map Section on US
  const usMap = usPage.locator('.locator-map-section, #js-locator-map, [class*="locator-map"]').first();
  if (await usMap.isVisible().catch(() => false)) {
    await usMap.scrollIntoViewIfNeeded();
    await usPage.waitForTimeout(1000);
    // Capture map element
    await usMap.screenshot({ path: path.join(OUT_DIR, 'US_MOBILE_MAP_ELEMENT.png') });
    console.log('   Saved US_MOBILE_MAP_ELEMENT.png');

    // Also capture the viewport centered on the map with the controls & search context
    await usPage.screenshot({ path: path.join(OUT_DIR, 'US_MOBILE_MAP_VIEWPORT.png') });
    console.log('   Saved US_MOBILE_MAP_VIEWPORT.png');
  }

  console.log('\n✅ All mobile screenshots captured successfully.');
  await browser.close();
})();
