const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const AU_LOCATOR_URL = 'https://mcstaging2.globewest.com.au/locator';
const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots/retest_evidence');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  console.log('🚀 Launching Headed Chrome to Retest Store Locator Developer Fixes...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: null, // Full screen
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  const consoleErrors = [];
  const consoleWarnings = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    if (msg.type() === 'warning') consoleWarnings.push(msg.text());
  });

  // 1. LOAD US STORE LOCATOR
  console.log(`\n▶ [1/4] Loading US Store Locator: ${US_LOCATOR_URL}`);
  await page.goto(US_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // 2. INSPECT DEVELOPER CLAIMS ON US STOREFRONT
  console.log('\n--- AUDITING DEVELOPER FIXES ON US STOREFRONT ---');
  
  // A. Page Title
  const pageTitle = await page.title();
  console.log(`1. Document Title: "${pageTitle}"`);
  const isTitleFixed = pageTitle.trim() === 'Find a Stockist & Showroom | GlobeWest';
  console.log(`   -> Match expected "Find a Stockist & Showroom | GlobeWest"? ${isTitleFixed ? '✅ YES' : '❌ NO'}`);

  // B. Search Field Placeholder
  const searchInput = page.locator('input[placeholder*="postcode" i], input[placeholder*="zip" i], input[placeholder*="suburb" i], #address, input.input-text').first();
  let placeholderVal = '';
  let searchLabelVal = '';
  if (await searchInput.isVisible().catch(() => false)) {
    placeholderVal = await searchInput.getAttribute('placeholder') || '';
    const labelEl = page.locator('label[for="' + (await searchInput.getAttribute('id')) + '"], .field-address label').first();
    searchLabelVal = await labelEl.innerText().catch(() => '');
  }
  console.log(`2. Search Placeholder: "${placeholderVal}" (Label: "${searchLabelVal}")`);
  const isPlaceholderUS = placeholderVal.toLowerCase().includes('zip') || placeholderVal.includes('90210');
  console.log(`   -> Updated to US ZIP code format? ${isPlaceholderUS ? '✅ YES' : '❌ NO'}`);

  // C. CMS Block Heading Suffix ("- us")
  const headingEvaluation = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, .pagebuilder-heading')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim(),
      html: h.innerHTML
    }));
    const stockistHeadings = headings.filter(h => h.text.toLowerCase().includes('stockist') || h.text.toLowerCase().includes('how to buy'));
    const hasUsSuffix = headings.some(h => h.text.toLowerCase().includes('- us') || h.text.toLowerCase().includes('-us'));
    return { stockistHeadings, hasUsSuffix, allHeadings: headings };
  });
  console.log('3. Stockist Headings Found:');
  headingEvaluation.stockistHeadings.forEach(h => console.log(`   - [${h.tag}] "${h.text}"`));
  console.log(`   -> Is "- us" suffix removed? ${!headingEvaluation.hasUsSuffix ? '✅ YES (Clean)' : '❌ NO (Suffix Still Present)'}`);

  // D. Intro Copy & Body Copy (Regional Australia references)
  const bodyTextEvaluation = await page.evaluate(() => {
    const body = document.body.innerText;
    const hasAusFinest = body.includes("Australia's finest") || body.includes("some of Australia's finest");
    const hasFinalise = body.includes('finalise');
    const hasFinalize = body.includes('finalize');
    // Extract intro section text
    const introEl = document.querySelector('.page-title-wrapper + div, .stockist-intro, [data-content-type="text"]');
    const introSnippet = introEl ? introEl.innerText.trim() : '';
    return { hasAusFinest, hasFinalise, hasFinalize, introSnippet };
  });
  console.log(`4. Intro Copy Snippet: "${bodyTextEvaluation.introSnippet.substring(0, 120)}..."`);
  console.log(`   -> Contains "Australia's finest"? ${bodyTextEvaluation.hasAusFinest ? '⚠️ YES (AU copy still active)' : '✅ NO'}`);
  console.log(`   -> Spelling check: finalise (${bodyTextEvaluation.hasFinalise}), finalize (${bodyTextEvaluation.hasFinalize})`);

  // E. Google Maps API Status
  const mapEvaluation = await page.evaluate(() => {
    const mapContainer = document.querySelector('#js-locator-map, #map, .locator-map, [class*="map"]');
    const mapText = mapContainer ? mapContainer.innerText : '';
    const hasErrorAlert = mapText.includes('Oops! Something went wrong') || mapText.includes('error');
    return {
      mapExists: !!mapContainer,
      hasErrorAlert,
      snippet: mapText.substring(0, 100)
    };
  });
  const mapsConsoleError = consoleErrors.find(e => e.includes('RefererNotAllowedMapError') || e.includes('Google Maps JavaScript API error'));
  console.log(`5. Google Maps API Health:`);
  console.log(`   -> Map container in DOM: ${mapEvaluation.mapExists}`);
  console.log(`   -> Map Error Alert on screen: ${mapEvaluation.hasErrorAlert ? '❌ BROKEN (Alert Visible)' : '✅ Clear'}`);
  console.log(`   -> Console Error: ${mapsConsoleError || 'None detected'}`);

  // F. Contact Us / Showroom Locations Links
  const linkEvaluation = await page.evaluate(() => {
    const contactLinks = Array.from(document.querySelectorAll('a')).filter(a => 
      a.innerText.toLowerCase().includes('contact') || 
      a.innerText.toLowerCase().includes('showroom location') ||
      a.innerText.toLowerCase().includes('book showroom')
    ).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    }));
    return contactLinks;
  });
  console.log('6. Contact / Showroom Links in Navigation & Footer:');
  linkEvaluation.forEach(l => console.log(`   - "${l.text}": href -> ${l.href}`));

  // Highlight Elements & Capture Full Page Desktop Screenshot
  console.log('\n📸 Capturing Full Desktop Screenshot with Highlights...');
  await page.evaluate(() => {
    const addBadge = (el, text, color) => {
      if (!el) return;
      el.style.border = `3px solid ${color}`;
      el.style.boxShadow = `0 0 12px ${color}`;
    };
    // Highlight Title
    const h1 = document.querySelector('h1');
    if (h1) addBadge(h1, 'VERIFIED TITLE', '#00CC66');
    // Highlight Search input
    const inp = document.querySelector('input.input-text, #address');
    if (inp) addBadge(inp, 'VERIFIED PLACEHOLDER', '#00CC66');
    // Highlight Stockist block
    const h2 = Array.from(document.querySelectorAll('h2, h3')).find(el => el.innerText.includes('How to Buy'));
    if (h2) addBadge(h2, 'VERIFIED HEADING', '#00CC66');
  });

  const shotPath = path.join(SCREENSHOTS_DIR, '01_US_STORE_LOCATOR_RETEST_DESKTOP.png');
  await page.screenshot({ path: shotPath, fullPage: true });
  console.log(`✅ Screenshot saved: ${shotPath}`);

  // G. Test Searching a US ZIP Code (e.g. 90210)
  console.log('\n▶ [2/4] Testing Search Interaction with US ZIP Code (90210)...');
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.fill('90210');
    await page.waitForTimeout(1000);
    const searchBtn = page.locator('button.action.search, .action.primary.search, button[type="submit"]').first();
    if (await searchBtn.isVisible().catch(() => false)) {
      console.log('Clicking search button...');
      await searchBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  const searchResultsEvaluation = await page.evaluate(() => {
    const resultsContainer = document.querySelector('.locator-result, .results, #locator-results');
    return {
      resultsText: resultsContainer ? resultsContainer.innerText.substring(0, 150) : 'Not Found',
      hasStockistCards: document.querySelectorAll('.locator-item, .store-item').length
    };
  });
  console.log('Search Execution Results:', searchResultsEvaluation);

  // H. Mobile Viewport Retest (390x844 iPhone 14/15)
  console.log('\n▶ [3/4] Retesting Mobile Viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(2000);
  const mobileShotPath = path.join(SCREENSHOTS_DIR, '02_US_STORE_LOCATOR_RETEST_MOBILE.png');
  await page.screenshot({ path: mobileShotPath, fullPage: true });
  console.log(`✅ Mobile Screenshot saved: ${mobileShotPath}`);

  // I. AU Baseline Comparison
  console.log('\n▶ [4/4] Checking AU Baseline for Comparison...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(AU_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const auTitle = await page.title();
  const auPlaceholder = await page.locator('input.input-text, #address').first().getAttribute('placeholder').catch(() => '');
  console.log(`AU Baseline Title: "${auTitle}"`);
  console.log(`AU Baseline Placeholder: "${auPlaceholder}"`);

  await page.waitForTimeout(4000);
  await browser.close();

  // Print Summary Table
  console.log('\n========================================================================');
  console.log('🏆 DEVELOPER FIXES VERIFICATION SUMMARY TABLE');
  console.log('========================================================================');
  console.table([
    {
      "Developer Claim": "Page Title set to 'Find a Stockist & Showroom | GlobeWest'",
      "Observed Value": pageTitle,
      "QA Verdict": isTitleFixed ? '🟢 PASSED (FIXED)' : '🔴 FAILED'
    },
    {
      "Developer Claim": "Search placeholder updated to US ZIP code format",
      "Observed Value": placeholderVal,
      "QA Verdict": isPlaceholderUS ? '🟢 PASSED (FIXED)' : '🔴 FAILED'
    },
    {
      "Developer Claim": "CMS block heading suffix ('- us') removed",
      "Observed Value": headingEvaluation.stockistHeadings.map(h => h.text).join(' | '),
      "QA Verdict": !headingEvaluation.hasUsSuffix ? '🟢 PASSED (FIXED)' : '🔴 FAILED'
    },
    {
      "Developer Claim": "Intro text & body copy (US specific copy pending)",
      "Observed Value": bodyTextEvaluation.hasAusFinest ? 'AU copy still in place (Pending US copy)' : 'Cleaned',
      "QA Verdict": '🟡 ACKNOWLEDGED (PENDING COPYWRITING)'
    },
    {
      "Developer Claim": "Google Maps API Status (Not mentioned by developer)",
      "Observed Value": mapsConsoleError ? 'RefererNotAllowedMapError' : (mapEvaluation.hasErrorAlert ? 'Error Alert' : 'Operational'),
      "QA Verdict": (mapsConsoleError || mapEvaluation.hasErrorAlert) ? '🔴 P0 BLOCKER STILL OPEN' : '🟢 OPERATIONAL'
    }
  ]);
  console.log('========================================================================\n');
})();
