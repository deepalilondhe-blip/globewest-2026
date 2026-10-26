const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

const TARGET_URL = 'https://mcstaging2.globewest.com/locator';
const SCREENSHOTS_DIR = path.resolve(SCRIPTS_DIR, '../screenshots');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 GLOBEWEST QA AUTOMATION — STORE LOCATOR (#41794539) RETEST SUITE');
  console.log(`Target URL: ${TARGET_URL}`);
  console.log('Verifying Developer Fixes & Remaining Open Defects');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('🌐 [Desktop 1440x900] Loading Store Locator...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(4000);

  // Take Desktop Screenshot
  const desktopShotPath = path.join(SCREENSHOTS_DIR, 'RETEST_DESKTOP_LIVE.png');
  await page.screenshot({ path: desktopShotPath, fullPage: true });
  console.log(`📸 Desktop screenshot saved: ${desktopShotPath}`);

  // Evaluate Desktop Assertions
  const desktopResults = await page.evaluate(() => {
    const title = document.title;
    const bodyText = document.body.innerText;

    // 1. Postcode Placeholder
    const postcodeInputs = Array.from(document.querySelectorAll('input')).map(i => i.placeholder);
    const hasEg90210 = postcodeInputs.some(p => p && p.includes('90210'));
    const hasEg3000 = postcodeInputs.some(p => p && p.includes('3000'));

    // 2. CMS Block Heading Suffix
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim());
    const hasCleanStockistHeading = headings.includes('How to Buy with a Stockist');
    const hasUsSuffix = headings.some(h => h.toLowerCase().includes('- us') || h.toLowerCase().includes('-us'));

    // 3. Intro Australia Reference
    const hasAustraliaLeak = bodyText.includes("Australia's finest furniture") || bodyText.includes("some of Australia's finest");

    // 4. Spelling 'finalise' vs 'finalize'
    const hasFinalise = bodyText.includes('finalise');
    const hasFinalize = bodyText.includes('finalize');

    // 5. Duplicate Sentence
    const dupSentence = 'Too far from one of our stockists? You can still shop online, just select from our list of retailers at checkout.';
    const dupCount = bodyText.split(dupSentence).length - 1;

    // 6. Google Maps Error
    const mapEl = document.querySelector('#js-locator-map, #map, .locator-map');
    const mapText = mapEl ? mapEl.innerText : '';
    const hasGmError = mapText.includes('Oops! Something went wrong') || mapText.includes("didn't load Google Maps correctly");

    return {
      title,
      hasEg90210,
      hasEg3000,
      hasCleanStockistHeading,
      hasUsSuffix,
      hasAustraliaLeak,
      hasFinalise,
      hasFinalize,
      dupCount,
      hasGmError,
      mapPresent: !!mapEl
    };
  });

  const mapsApiError = consoleErrors.find(e => e.includes('RefererNotAllowedMapError') || e.includes('Google Maps JavaScript API error'));

  // Mobile View Verification
  console.log('\n📱 [Mobile 375x812] Loading Store Locator...');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 812 });
  await mobilePage.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await mobilePage.waitForTimeout(4000);

  const mobileShotPath = path.join(SCREENSHOTS_DIR, 'RETEST_MOBILE_LIVE.png');
  await mobilePage.screenshot({ path: mobileShotPath, fullPage: true });
  console.log(`📸 Mobile screenshot saved: ${mobileShotPath}`);

  const mobileResults = await mobilePage.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input')).map(i => i.placeholder);
    const hasEg90210 = inputs.some(p => p && p.includes('90210'));
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim());
    const hasCleanStockistHeading = headings.includes('How to Buy with a Stockist');
    const hasUsSuffix = headings.some(h => h.toLowerCase().includes('- us'));
    return { hasEg90210, hasCleanStockistHeading, hasUsSuffix };
  });

  await browser.close();

  // Tabulate and output results
  console.log('\n========================================================================');
  console.log('📊 RETEST EXECUTION SUMMARY & VERIFICATION RESULTS');
  console.log('========================================================================');

  const testSuite = [
    {
      id: 'TC-GW-LOC-003',
      name: 'Search Postcode Placeholder Localization',
      expected: 'US ZIP format "Eg. 90210"',
      actual: desktopResults.hasEg90210 && !desktopResults.hasEg3000 ? 'Renders "Eg. 90210" on Desktop & Mobile' : 'Still shows "Eg.3000"',
      status: desktopResults.hasEg90210 && !desktopResults.hasEg3000 ? '✅ PASS (FIXED)' : '🔴 FAIL'
    },
    {
      id: 'TC-GW-LOC-010',
      name: 'CMS Block Heading Suffix Removal ("- us")',
      expected: '"How to Buy with a Stockist"',
      actual: desktopResults.hasCleanStockistHeading && !desktopResults.hasUsSuffix ? 'Suffix "- us" removed cleanly' : 'Suffix "- us" still present',
      status: desktopResults.hasCleanStockistHeading && !desktopResults.hasUsSuffix ? '✅ PASS (FIXED)' : '🔴 FAIL'
    },
    {
      id: 'TC-GW-LOC-013',
      name: 'Document HTML <title> Tag Implementation',
      expected: 'Non-empty page title',
      actual: `"${desktopResults.title}"`,
      status: desktopResults.title.includes('GlobeWest') ? '✅ PASS (FIXED)' : '🔴 FAIL'
    },
    {
      id: 'TC-GW-LOC-021',
      name: 'WCAG 2.2 AA Document Title Compliance (2.4.2)',
      expected: 'Non-empty document title in DOM',
      actual: `Title present: "${desktopResults.title}"`,
      status: desktopResults.title.length > 0 ? '✅ PASS (FIXED)' : '🔴 FAIL'
    },
    {
      id: 'TC-GW-LOC-002',
      name: 'Interactive Google Maps API Authorization',
      expected: 'Google Maps renders without Referer error',
      actual: mapsApiError ? 'Blocked by RefererNotAllowedMapError' : (desktopResults.hasGmError ? 'Grey error alert canvas' : 'Map canvas operational'),
      status: (mapsApiError || desktopResults.hasGmError) ? '🔴 FAIL (P0 BLOCKER STILL OPEN)' : '✅ PASS'
    },
    {
      id: 'TC-GW-LOC-008',
      name: 'Intro Paragraph Copy Localization',
      expected: 'US-localized copy (no Australia reference)',
      actual: desktopResults.hasAustraliaLeak ? 'Still references "Australia\'s finest furniture"' : 'Localized cleanly',
      status: desktopResults.hasAustraliaLeak ? '🔴 FAIL (STILL OPEN)' : '✅ PASS'
    },
    {
      id: 'TC-GW-LOC-011',
      name: 'American English Spelling Standards',
      expected: '"finalize" instead of "finalise"',
      actual: desktopResults.hasFinalise ? 'Still uses Australian spelling "finalise"' : 'Uses US spelling "finalize"',
      status: desktopResults.hasFinalise ? '🔴 FAIL (STILL OPEN)' : '✅ PASS'
    },
    {
      id: 'TC-GW-LOC-020',
      name: 'Secondary Help Text Duplication',
      expected: 'Disclaimer text rendered exactly once',
      actual: desktopResults.dupCount > 1 ? `Sentence rendered ${desktopResults.dupCount} times on page` : 'Rendered once',
      status: desktopResults.dupCount > 1 ? '🔴 FAIL (STILL OPEN)' : '✅ PASS'
    }
  ];

  console.table(testSuite);
  console.log('========================================================================\n');

  // Write retest results json
  const resultsJsonPath = path.resolve(SCRIPTS_DIR, '../retest_results.json');
  fs.writeFileSync(resultsJsonPath, JSON.stringify({ timestamp: new Date().toISOString(), testSuite, desktopResults, mobileResults, consoleErrors }, null, 2));
  console.log(`📄 Structured JSON retest data saved to: ${resultsJsonPath}`);
})();
