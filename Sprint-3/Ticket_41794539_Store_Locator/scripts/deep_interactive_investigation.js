const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const AU_LOCATOR_URL = 'https://mcstaging2.globewest.com.au/locator';
const US_LOGIN_URL = 'https://mcstaging2.globewest.com/customer/account/login';
const AU_LOGIN_URL = 'https://mcstaging2.globewest.com.au/customer/account/login';

const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/map_retest_details');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
  console.log('🔬 DEEP INTERACTIVE INVESTIGATION: GOOGLE MAP & STORE LOCATOR');
  console.log('================================================================');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // 1. Inspect Map Script & Initial Parameters
  console.log('\n[PHASE 1] Analyzing US Store Locator Map Initialization...');
  await page.goto(US_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  const mapInitData = await page.evaluate(() => {
    // Check google maps object
    let center = null;
    let zoom = null;
    let markersCount = 0;
    let markerDetails = [];

    // Check script files content
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src || s.innerText);
    
    // Check if any element has data attributes or knockout bindings
    const mapSection = document.querySelector('.locator-map-section, #js-locator-map');
    const koData = window.ko && mapSection ? window.ko.dataFor(mapSection) : null;
    
    // Check computed style of title wrapper and page header
    const header = document.querySelector('.page-header, header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const titleEl = document.querySelector('.page-title-wrapper, h1.page-title, .page-title, h1');
    const titleRect = titleEl ? titleEl.getBoundingClientRect() : null;
    const titleStyle = titleEl ? window.getComputedStyle(titleEl) : null;

    const columnMain = document.querySelector('.column.main, main, #maincontent');
    const mainRect = columnMain ? columnMain.getBoundingClientRect() : null;
    const mainStyle = columnMain ? window.getComputedStyle(columnMain) : null;

    // Check markers in DOM
    const domMarkers = Array.from(document.querySelectorAll('.gm-style [role="button"], .gm-style img[src*="spotlight"]')).map(el => ({
      title: el.getAttribute('title') || el.getAttribute('aria-label') || 'No Title',
      rect: el.getBoundingClientRect()
    }));

    return {
      headerHeight,
      titleText: titleEl ? titleEl.innerText : null,
      titleRect: titleRect ? { top: titleRect.top, bottom: titleRect.bottom, height: titleRect.height } : null,
      titlePaddingTop: titleStyle ? titleStyle.paddingTop : null,
      titleMarginTop: titleStyle ? titleStyle.marginTop : null,
      mainTop: mainRect ? mainRect.top : null,
      mainPaddingTop: mainStyle ? mainStyle.paddingTop : null,
      domMarkersCount: domMarkers.length,
      domMarkers
    };
  });

  console.log('Map & Header DOM Metrics:', mapInitData);

  // 2. Click the Marker on the map if present
  console.log('\n[PHASE 2] Interacting with Map Pin in Los Angeles...');
  const laPin = page.locator('.gm-style [role="button"][title*="Los Angeles" i]').first();
  if (await laPin.isVisible().catch(() => false)) {
    console.log('Los Angeles Pin is visible in viewport! Clicking...');
    await laPin.click({ force: true });
    await page.waitForTimeout(2000);
    const infoWindow = await page.evaluate(() => {
      const iw = document.querySelector('.gm-style-iw, .gm-style-iw-c');
      return iw ? iw.innerText : null;
    });
    console.log('Info Window Text after click:', infoWindow);
  } else {
    console.log('Los Angeles pin not directly clickable or rendered via canvas.');
  }

  // 3. Search Interactions Test
  console.log('\n[PHASE 3] Detailed Search Interaction Audit...');
  const postcodeInp = page.locator('input[placeholder*="90210"], input[placeholder*="3000"], #address, .field-address input').first();
  const storeNameInp = page.locator('input[placeholder*="Start Typing"], #store-name, .field-store input').first();

  // Test 3a: Search US ZIP 90210
  if (await postcodeInp.isVisible().catch(() => false)) {
    console.log('Filling "90210" into search input...');
    await postcodeInp.fill('90210');
    await postcodeInp.press('Enter');
    await page.waitForTimeout(4000);

    const resultsAfter90210 = await page.evaluate(() => {
      const resultItems = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item')).map(el => el.innerText.trim());
      const noResults = document.querySelector('.no-results, .message.info, .empty-result')?.innerText || null;
      return { resultItemsCount: resultItems.length, resultItems: resultItems.slice(0, 5), noResults };
    });
    console.log('Results for "90210":', resultsAfter90210);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_US_SEARCH_90210_RESULTS.png') });
  }

  // Test 3b: Search "Los Angeles"
  if (await postcodeInp.isVisible().catch(() => false)) {
    console.log('Filling "Los Angeles" into search input...');
    await postcodeInp.fill('Los Angeles');
    await postcodeInp.press('Enter');
    await page.waitForTimeout(4000);

    const resultsAfterLA = await page.evaluate(() => {
      const resultItems = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item')).map(el => el.innerText.trim());
      return { resultItemsCount: resultItems.length, resultItems: resultItems.slice(0, 5) };
    });
    console.log('Results for "Los Angeles":', resultsAfterLA);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_US_SEARCH_LOS_ANGELES_RESULTS.png') });
  }

  // Test 3c: Search "Melbourne" or "3000" to see if Australian stores show up on US site!
  if (await postcodeInp.isVisible().catch(() => false)) {
    console.log('Filling "3000" into search input...');
    await postcodeInp.fill('3000');
    await postcodeInp.press('Enter');
    await page.waitForTimeout(4000);

    const resultsAfter3000 = await page.evaluate(() => {
      const resultItems = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item')).map(el => el.innerText.trim());
      return { resultItemsCount: resultItems.length, resultItems: resultItems.slice(0, 5) };
    });
    console.log('Results for "3000":', resultsAfter3000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_US_SEARCH_3000_RESULTS.png') });
  }

  // 4. Authenticated Trade Login Audit
  console.log('\n[PHASE 4] Authenticated State (Trade Customer) Audit...');
  await page.goto(US_LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const emailInput = page.locator('#email');
  const passInput = page.locator('#pass');
  const loginBtn = page.locator('#send2');

  if (await emailInput.isVisible().catch(() => false)) {
    console.log('Logging in with US Trade Account: deepali.londhe@overdose.digital...');
    await emailInput.fill('deepali.londhe@overdose.digital');
    await passInput.fill('Deep@123');
    await loginBtn.click();
    await page.waitForTimeout(6000);
    console.log('Login submitted. Current URL:', page.url());

    // Navigate to /locator
    await page.goto(US_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    const authHeaderEvaluation = await page.evaluate(() => {
      const toggle = document.querySelector('button:has-text("Trade"), button:has-text("MSRP"), .price-toggle');
      const welcome = document.querySelector('.logged-in, .customer-welcome, .greet.welcome');
      return {
        hasPriceToggle: !!toggle,
        toggleText: toggle ? toggle.innerText.trim() : null,
        welcomeText: welcome ? welcome.innerText.trim() : null
      };
    });
    console.log('Authenticated Header State on /locator:', authHeaderEvaluation);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_US_AUTHENTICATED_LOCATOR.png'), fullPage: true });
  }

  // 5. AU Store Locator Markers & Behavior for comparison
  console.log('\n[PHASE 5] Auditing AU Baseline Store Locator...');
  const auPage = await context.newPage();
  await auPage.goto(AU_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await auPage.waitForTimeout(5000);

  const auMarkersData = await auPage.evaluate(() => {
    const titleEl = document.querySelector('.page-title-wrapper, h1.page-title, .page-title, h1');
    const titleRect = titleEl ? titleEl.getBoundingClientRect() : null;
    const header = document.querySelector('.page-header, header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    return {
      headerHeight,
      titleText: titleEl ? titleEl.innerText : null,
      titleRect: titleRect ? { top: titleRect.top, bottom: titleRect.bottom, height: titleRect.height } : null
    };
  });
  console.log('AU Baseline Header & Title Metrics:', auMarkersData);

  // Check AU search for "3000"
  const auSearchInput = auPage.locator('input[placeholder*="3000"], #address, input.input-text').first();
  if (await auSearchInput.isVisible().catch(() => false)) {
    await auSearchInput.fill('3000');
    await auSearchInput.press('Enter');
    await auPage.waitForTimeout(4000);

    const auResults3000 = await auPage.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item')).map(el => el.innerText.trim());
      return { itemsCount: items.length, sample: items.slice(0, 3) };
    });
    console.log('AU Results for "3000":', auResults3000);
    await auPage.screenshot({ path: path.join(OUTPUT_DIR, '05_AU_SEARCH_3000_RESULTS.png') });
  }

  console.log('\n================================================================');
  console.log('DEEP INVESTIGATION COMPLETE.');
  await browser.close();
})();
