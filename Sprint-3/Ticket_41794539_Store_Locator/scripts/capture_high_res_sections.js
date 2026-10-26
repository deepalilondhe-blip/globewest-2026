const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const HIGH_RES_DIR = path.join(BASE_DIR, 'screenshots', 'high_res_sections');
if (!fs.existsSync(HIGH_RES_DIR)) fs.mkdirSync(HIGH_RES_DIR, { recursive: true });

async function clearOverlays(page) {
  await page.evaluate(() => {
    const selectors = [
      '#lpshroud', '[id*="Survey"]', '[id*="lp"]', '.modal-popup',
      '.newsletter-modal', '.ui-widget-overlay', '#cookie-status',
      '.klaviyo-close-form', '.modal-custom', '.action-close'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  }).catch(() => {});
}

(async () => {
  console.log('🚀 CAPTURING HIGH-RES SECTIONS FOR AU VS US STORE LOCATOR COMPARISON...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1200']
  });

  // 1. AU BASELINE
  console.log('\n1. Navigating to AU Baseline (mcstaging2.globewest.com.au/locator)...');
  const auPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await auPage.goto('https://mcstaging2.globewest.com.au/locator', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await auPage.waitForTimeout(6000); // Allow Google Maps tiles & pins to render
  await clearOverlays(auPage);

  // AU Hero & Search Section
  const auSearchSec = auPage.locator('.locator-top, .column.main > .locator-container, .page-main').first();
  await auPage.screenshot({
    path: path.join(HIGH_RES_DIR, '01_AU_Hero_Search_Above_Fold.png'),
    clip: { x: 0, y: 80, width: 1440, height: 600 }
  });

  // AU Map Canvas
  const auMap = auPage.locator('#js-locator-map').first();
  if (await auMap.isVisible()) {
    await auMap.scrollIntoViewIfNeeded();
    await auPage.waitForTimeout(1000);
    await auMap.screenshot({ path: path.join(HIGH_RES_DIR, '02_AU_Working_Map_Canvas.png') });
  }

  // AU CMS Block / Lower Section
  await auPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
  await auPage.waitForTimeout(1500);
  await auPage.screenshot({
    path: path.join(HIGH_RES_DIR, '03_AU_CMS_Stockist_Section.png'),
    clip: { x: 0, y: 750, width: 1440, height: 500 }
  });

  await auPage.close();

  // 2. US STOREFRONT
  console.log('\n2. Navigating to US Storefront (mcstaging2.globewest.com/locator)...');
  const usPage = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  await usPage.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await usPage.waitForTimeout(6000);
  await clearOverlays(usPage);

  // US Hero & Search Section
  await usPage.screenshot({
    path: path.join(HIGH_RES_DIR, '01_US_Hero_Search_Above_Fold.png'),
    clip: { x: 0, y: 80, width: 1440, height: 600 }
  });

  // US Broken Map Canvas
  const usMap = usPage.locator('#js-locator-map').first();
  if (await usMap.isVisible()) {
    await usMap.scrollIntoViewIfNeeded();
    await usPage.waitForTimeout(1000);
    await usMap.screenshot({ path: path.join(HIGH_RES_DIR, '02_US_Broken_Map_Canvas.png') });
  }

  // US CMS Block `stockist_info`
  const usCms = usPage.locator('.find-designer-trade-customer, [data-content-type="row"]').first();
  if (await usCms.isVisible()) {
    await usCms.scrollIntoViewIfNeeded();
    await usPage.waitForTimeout(1000);
    await usCms.screenshot({ path: path.join(HIGH_RES_DIR, '03_US_CMS_Stockist_Section.png') });
  }

  // Close-up of Search Inputs on US
  const usSearchInputs = usPage.locator('.locator-search-section, .locator-top').first();
  if (await usSearchInputs.isVisible()) {
    await usSearchInputs.screenshot({ path: path.join(HIGH_RES_DIR, '04_US_Search_Inputs_CloseUp.png') });
  }

  await usPage.close();
  await browser.close();

  console.log('✅ High-res sections captured successfully!');
})();
