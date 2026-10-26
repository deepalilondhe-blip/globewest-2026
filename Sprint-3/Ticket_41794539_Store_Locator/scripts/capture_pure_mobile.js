const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const AU_LOCATOR_URL = 'https://mcstaging2.globewest.com.au/locator';
const OUT_DIR = path.resolve(__dirname, '../screenshots/mobile_pure_comparison');
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('📱 CAPTURING CLEAN MOBILE AUDIT SCREENSHOTS (AU VS US)...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
  });

  // 1. AU BASELINE MOBILE
  console.log('1. Loading AU Baseline Mobile...');
  const auPage = await context.newPage();
  await auPage.goto(AU_LOCATOR_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await auPage.waitForTimeout(5000);

  // Hide only zendesk / livechat badge without touching page structure
  await auPage.evaluate(() => {
    const chat = document.querySelector('#launcher, .zopim, [data-testid="chat-widget"], #livechat-compact-container');
    if (chat) chat.style.display = 'none';
  }).catch(() => {});

  await auPage.screenshot({ path: path.join(OUT_DIR, '01_AU_MOBILE_FULL.png'), fullPage: true });
  console.log('   Saved 01_AU_MOBILE_FULL.png');

  // Scroll to map and capture mobile viewport centered on the map
  const auMapEl = auPage.locator('#js-locator-map, .locator-map').first();
  if (await auMapEl.isVisible()) {
    await auMapEl.scrollIntoViewIfNeeded();
    await auPage.waitForTimeout(1000);
    await auPage.screenshot({ path: path.join(OUT_DIR, '02_AU_MOBILE_MAP_VIEWPORT.png') });
    console.log('   Saved 02_AU_MOBILE_MAP_VIEWPORT.png');
  }

  // 2. US STAGING MOBILE
  console.log('\n2. Loading US Staging Mobile...');
  const usPage = await context.newPage();
  await usPage.goto(US_LOCATOR_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await usPage.waitForTimeout(5000);

  // Hide only zendesk / livechat badge without touching page structure
  await usPage.evaluate(() => {
    const chat = document.querySelector('#launcher, .zopim, [data-testid="chat-widget"], #livechat-compact-container');
    if (chat) chat.style.display = 'none';
  }).catch(() => {});

  await usPage.screenshot({ path: path.join(OUT_DIR, '03_US_MOBILE_FULL.png'), fullPage: true });
  console.log('   Saved 03_US_MOBILE_FULL.png');

  // Scroll to map and capture mobile viewport centered on the map
  const usMapEl = usPage.locator('#js-locator-map, .locator-map').first();
  if (await usMapEl.isVisible()) {
    await usMapEl.scrollIntoViewIfNeeded();
    await usPage.waitForTimeout(1000);
    await usPage.screenshot({ path: path.join(OUT_DIR, '04_US_MOBILE_MAP_VIEWPORT.png') });
    console.log('   Saved 04_US_MOBILE_MAP_VIEWPORT.png');
  }

  console.log('\n✅ Mobile captures completed!');
  await browser.close();
})();
