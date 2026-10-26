const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const AU_LOCATOR_URL = 'https://mcstaging2.globewest.com.au/locator';
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/map_retest');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

(async () => {
  console.log('🔍 STARTING STORE LOCATOR & GOOGLE MAP RE-TEST');
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

  // Capture all Google Maps requests and console messages
  const mapRequests = [];
  const consoleMessages = [];
  page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
  page.on('request', req => {
    const url = req.url();
    if (url.includes('maps.googleapis.com') || url.includes('google.com/maps') || url.includes('locator') || url.includes('stockist')) {
      mapRequests.push(url);
    }
  });

  console.log(`\n1. Navigating to US Store Locator: ${US_LOCATOR_URL}`);
  const response = await page.goto(US_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log(`   Response Status: ${response.status()}`);
  await page.waitForTimeout(6000); // Allow Google Maps & markers to load

  // Check script tags for Google Maps API
  const googleScriptTags = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src*="maps.googleapis.com"], script[src*="google.com/maps"]'));
    return scripts.map(s => s.src);
  });
  console.log('\n2. Google Maps Script Tags Detected:', googleScriptTags);

  // Check map configuration and DOM elements
  const mapDetails = await page.evaluate(() => {
    const mapEl = document.querySelector('#js-locator-map, #map, .locator-map, [class*="locator-map"]');
    const result = {
      mapElExists: !!mapEl,
      mapElId: mapEl ? mapEl.id : null,
      mapElClass: mapEl ? mapEl.className : null,
      mapElInnerHTMLSnippet: mapEl ? mapEl.innerHTML.substring(0, 300) : null,
      hasGoogleCanvas: !!(mapEl && mapEl.querySelector('.gm-style')),
      googleErrorAlert: !!document.querySelector('.gm-err-container, .dismissButton'),
      errorText: document.querySelector('.gm-err-message, .gm-err-content')?.innerText || null
    };

    // Check if google maps object is exposed on window or map element
    if (window.google && window.google.maps) {
      result.googleMapsDefined = true;
      result.googleMapsVersion = window.google.maps.version;
    } else {
      result.googleMapsDefined = false;
    }

    return result;
  });
  console.log('\n3. Map DOM Details:', mapDetails);

  // Try to extract map coordinates and center from DOM or internal objects
  const mapCoordinates = await page.evaluate(() => {
    // Check for magento locator config in data-mage-init or x-magento-init
    const scripts = Array.from(document.querySelectorAll('script[type="text/x-magento-init"]'));
    const configs = [];
    for (const s of scripts) {
      if (s.innerText.includes('locator') || s.innerText.includes('map') || s.innerText.includes('stockist')) {
        try {
          configs.push(JSON.parse(s.innerText));
        } catch (e) {
          configs.push(s.innerText.substring(0, 500));
        }
      }
    }

    // Look for canvas / img tile URLs (Google map tiles have coordinates or center info)
    const tileImgs = Array.from(document.querySelectorAll('.gm-style img, #js-locator-map img'))
      .map(img => img.src)
      .filter(src => src.includes('maps.googleapis.com') || src.includes('google.com/maps') || src.includes('vt?'));

    // Check store list items on the page
    const storeCards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .stockist-list li, [class*="store"], [class*="locator"] li')).map(el => el.innerText.trim()).filter(t => t.length > 10 && t.length < 500);

    return {
      configs,
      tileImgsCount: tileImgs.length,
      sampleTileUrls: tileImgs.slice(0, 5),
      storeCardsCount: storeCards.length,
      sampleStoreCards: storeCards.slice(0, 10)
    };
  });
  console.log('\n4. Map Configs & Store Cards:');
  console.log('   Store Cards Count:', mapCoordinates.storeCardsCount);
  console.log('   Sample Store Cards:', mapCoordinates.sampleStoreCards);
  console.log('   Magento Configs:', JSON.stringify(mapCoordinates.configs, null, 2));

  // Check if any center coordinates or lat/lng exist on the window or custom script
  const deepJsCheck = await page.evaluate(() => {
    const info = {};
    for (const key of Object.keys(window)) {
      if (key.toLowerCase().includes('map') || key.toLowerCase().includes('locator')) {
        try {
          info[key] = typeof window[key];
        } catch(e) {}
      }
    }
    // Check if there are markers or store locations in any window variable
    return info;
  });
  console.log('\n5. Window Map Objects:', deepJsCheck);

  // Let's capture map element screenshot and full page screenshot
  const mapEl = page.locator('#js-locator-map, #map, .locator-map').first();
  if (await mapEl.isVisible().catch(() => false)) {
    await mapEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const mapBox = await mapEl.boundingBox();
    console.log('\n6. Map Bounding Box:', mapBox);
    await mapEl.screenshot({ path: path.join(OUTPUT_DIR, '01_US_MAP_ELEMENT.png') });
    console.log('   Saved 01_US_MAP_ELEMENT.png');
  }

  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_US_FULL_PAGE_DESKTOP.png'), fullPage: true });
  console.log('   Saved 02_US_FULL_PAGE_DESKTOP.png');

  // Check search bar & execute search for US ZIP code 90210
  console.log('\n7. Testing Search for US ZIP Code 90210:');
  const searchInput = page.locator('input[placeholder*="postcode" i], input[placeholder*="zip" i], #address, input.input-text').first();
  if (await searchInput.isVisible().catch(() => false)) {
    const ph = await searchInput.getAttribute('placeholder');
    console.log(`   Search placeholder: "${ph}"`);
    await searchInput.fill('90210');
    await page.waitForTimeout(1000);
    
    // Look for search button or press Enter
    const searchBtn = page.locator('button.action.search, button[type="submit"], .action.primary.search').first();
    if (await searchBtn.isVisible().catch(() => false)) {
      await searchBtn.click();
    } else {
      await searchInput.press('Enter');
    }
    await page.waitForTimeout(4000);

    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_US_SEARCH_90210.png'), fullPage: true });
    console.log('   Saved 03_US_SEARCH_90210.png');

    const searchResultSummary = await page.evaluate(() => {
      const resultsEl = document.querySelector('.locator-result, .results, #locator-results, .locator-items');
      const items = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item')).map(el => el.innerText.trim());
      return {
        resultsElText: resultsEl ? resultsEl.innerText.substring(0, 300) : 'None',
        itemsCount: items.length,
        firstThreeItems: items.slice(0, 3)
      };
    });
    console.log('   Search Results for 90210:', searchResultSummary);
  }

  // Mobile Viewport Test (390x844)
  console.log('\n8. Testing Mobile Viewport (390x844):');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(US_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_US_FULL_PAGE_MOBILE.png'), fullPage: true });
  console.log('   Saved 04_US_FULL_PAGE_MOBILE.png');

  // Let's also check AU Store Locator for baseline comparison
  console.log('\n9. Checking AU Baseline Store Locator:');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(AU_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_AU_BASELINE_DESKTOP.png'), fullPage: true });
  console.log('   Saved 05_AU_BASELINE_DESKTOP.png');

  const auMapDetails = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="text/x-magento-init"]'));
    const configs = [];
    for (const s of scripts) {
      if (s.innerText.includes('locator') || s.innerText.includes('map') || s.innerText.includes('stockist')) {
        try { configs.push(JSON.parse(s.innerText)); } catch (e) { configs.push(s.innerText.substring(0, 500)); }
      }
    }
    const storeCards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .stockist-list li')).map(el => el.innerText.trim());
    return {
      configs,
      storeCardsCount: storeCards.length,
      sampleStoreCards: storeCards.slice(0, 5)
    };
  });
  console.log('   AU Map Details:', {
    storeCardsCount: auMapDetails.storeCardsCount,
    sampleStoreCards: auMapDetails.sampleStoreCards
  });

  console.log('\n10. Google Maps Network Requests logged during run:');
  mapRequests.slice(0, 10).forEach(r => console.log('   -', r));

  console.log('\n================================================================');
  console.log('RE-TEST COMPLETE. Reviewing findings...');
  await browser.close();
})();
