const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';
const TARGET_URL = `${US_BASE}/locator`;
const BASELINE_URL = `${AU_BASE}/locator`;

const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots/exhaustive_retest');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🔬 EXHAUSTIVE DEEP RE-TEST: STORE LOCATOR (#41794539)');
  console.log('Standards: AGENTS.md Rules 1-6 (Micro-CSS, DOM Hierarchy, Dual-Auth, Zero Placeholders)');
  console.log(`US Target: ${TARGET_URL}`);
  console.log(`AU Baseline: ${BASELINE_URL}`);
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 350,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: null, // Full screen desktop
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // Capture all console errors, warnings, and network requests to maps.googleapis.com
  const consoleMessages = [];
  const mapsNetworkRequests = [];
  
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('maps.googleapis.com') || url.includes('google.com/maps')) {
      mapsNetworkRequests.push({
        url,
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });

  // ---------------------------------------------------------------------------
  // PHASE 1: GUEST UNAUTHENTICATED DESKTOP AUDIT (US STOREFRONT)
  // ---------------------------------------------------------------------------
  console.log('▶ [PHASE 1] Navigating to US Store Locator as GUEST...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // 1. Title Tag
  const docTitle = await page.title();
  console.log(`\n1. Document Title: "${docTitle}"`);

  // 2. Micro-CSS Inspection of H1 Heading
  const h1Inspection = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return null;
    const cs = window.getComputedStyle(h1);
    return {
      text: h1.innerText.trim(),
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      margin: cs.margin,
      padding: cs.padding
    };
  });
  console.log('2. H1 Heading Computed Styles:', h1Inspection);

  // 3. Search Form & Postcode/Store Inputs Inspection
  const searchFormsInspection = await page.evaluate(() => {
    const forms = Array.from(document.querySelectorAll('.locator__search-form, form.locator-form, .search-form'));
    const inputs = Array.from(document.querySelectorAll('input.input-text, input[type="number"], input[type="text"]')).filter(i => {
      return i.offsetParent !== null && !i.name.includes('q') && !i.placeholder.includes('Search for products');
    }).map(inp => {
      const cs = window.getComputedStyle(inp);
      const label = document.querySelector(`label[for="${inp.id}"]`) || inp.closest('form')?.querySelector('label');
      return {
        id: inp.id,
        type: inp.type,
        placeholder: inp.placeholder,
        label: label ? label.innerText.trim() : 'NO_LABEL',
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        border: cs.border,
        padding: cs.padding
      };
    });
    return { formCount: forms.length, inputs };
  });
  console.log('3. Search Inputs Inspection:', JSON.stringify(searchFormsInspection, null, 2));

  // 4. Interactive Google Maps Inspection & Error Parsing
  const mapInspection = await page.evaluate(() => {
    const mapEl = document.querySelector('#js-locator-map, #map, .locator-map-section, .locator-map');
    if (!mapEl) return { exists: false };
    const cs = window.getComputedStyle(mapEl);
    const alertBox = mapEl.querySelector('.gm-err-container, [class*="gm-err"], .gm-style');
    const allText = mapEl.innerText;
    return {
      exists: true,
      width: cs.width,
      height: cs.height,
      backgroundColor: cs.backgroundColor,
      hasErrorBox: !!alertBox || allText.includes('Oops! Something went wrong'),
      errorSnippet: allText.substring(0, 200).replace(/\n+/g, ' ')
    };
  });
  console.log('4. Google Maps Canvas Inspection:', mapInspection);

  // 5. CMS Block: "How to Buy with a Stockist" Inspection
  const cmsBlockInspection = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, h3, h4')).find(h => h.innerText.toLowerCase().includes('stockist') || h.innerText.toLowerCase().includes('how to buy'));
    const cs = heading ? window.getComputedStyle(heading) : null;
    
    // Check editorial body paragraphs
    const bodyContainer = heading ? heading.closest('.row, .pagebuilder-column-group, section, div') : document.body;
    const bodyText = bodyContainer ? bodyContainer.innerText : '';
    
    return {
      headingText: heading ? heading.innerText.trim() : 'NOT_FOUND',
      headingFontWeight: cs ? cs.fontWeight : '',
      headingFontSize: cs ? cs.fontSize : '',
      headingFontFamily: cs ? cs.fontFamily : '',
      hasUsSuffix: heading ? heading.innerText.toLowerCase().includes('- us') : false,
      hasAusFinest: bodyText.includes("Australia's finest"),
      hasFinalise: bodyText.includes('finalise'),
      hasFinalize: bodyText.includes('finalize'),
      snippet: bodyText.substring(0, 300).replace(/\n+/g, ' ')
    };
  });
  console.log('5. CMS Block Inspection:', cmsBlockInspection);

  // 6. Test Interactive Search Execution with US ZIP (90210)
  console.log('\n--- TESTING SEARCH INTERACTION (ZIP: 90210) ---');
  const zipInput = page.locator('input[type="number"][placeholder*="90210"], input.input-text[type="number"]').first();
  if (await zipInput.isVisible().catch(() => false)) {
    await zipInput.click();
    await zipInput.fill('90210');
    await page.waitForTimeout(600);
    
    const submitBtn = page.locator('form.postcode button[type="submit"], form.postcode button.action').first();
    if (await submitBtn.isVisible().catch(() => false)) {
      console.log('Clicking ZIP Search button...');
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
  }

  // 7. Check Store Results Container
  const storeResults = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.locator-item, .store-item, .location-item, .locator-result__item'));
    const container = document.querySelector('.locator-result, .locator-results, #locator-results');
    return {
      count: items.length,
      containerText: container ? container.innerText.substring(0, 200).replace(/\n+/g, ' ') : 'NOT_RENDERED'
    };
  });
  console.log('6. Store Locator Search Results:', storeResults);

  // 8. Capture Full Page & Close-up Screenshots (Desktop Guest)
  console.log('📸 Capturing High-Res Desktop Guest Screenshots...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_US_DESKTOP_GUEST_FULLPAGE.png'), fullPage: true });
  
  const mapElement = page.locator('#js-locator-map, .locator-map-section').first();
  if (await mapElement.isVisible().catch(() => false)) {
    await mapElement.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_US_DESKTOP_GOOGLE_MAPS_ERROR.png') });
  }

  // ---------------------------------------------------------------------------
  // PHASE 2: AUTHENTICATED US TRADE CUSTOMER AUDIT
  // ---------------------------------------------------------------------------
  console.log('\n▶ [PHASE 2] Logging in as US Trade Customer (deepali.londhe@overdose.digital)...');
  await page.goto(`${US_BASE}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(5000);
  }

  console.log('Navigating back to Store Locator as Authenticated Trade Customer...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const tradeHeaderInspection = await page.evaluate(() => {
    const toggle = document.querySelector('.price-toggle');
    const toggleVisible = toggle && toggle.offsetParent !== null;
    const toggleText = toggle ? toggle.innerText.replace(/\s+/g, ' ').trim() : '';
    const userGreeting = document.querySelector('.customer-welcome, .logged-in')?.innerText?.trim() || '';
    return { toggleVisible, toggleText, userGreeting };
  });
  console.log('Trade Customer Header on Locator Page:', tradeHeaderInspection);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_US_DESKTOP_TRADE_AUTH_LOCATOR.png'), fullPage: true });

  // ---------------------------------------------------------------------------
  // PHASE 3: MOBILE RESPONSIVE AUDIT (iPhone 14/15 390x844)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [PHASE 3] Auditing Mobile Responsive Layout (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(2000);

  const mobileEvaluation = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const map = document.querySelector('#js-locator-map, #map');
    const inputs = Array.from(document.querySelectorAll('input.input-text[type="number"], input.input-text[type="text"]')).filter(i => i.offsetParent !== null);
    return {
      h1FontSize: h1 ? window.getComputedStyle(h1).fontSize : '',
      mapHeight: map ? window.getComputedStyle(map).height : '',
      inputCount: inputs.length,
      placeholders: inputs.map(i => i.placeholder)
    };
  });
  console.log('Mobile Layout Computed Metrics:', mobileEvaluation);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_US_MOBILE_STORE_LOCATOR_FULLPAGE.png'), fullPage: true });

  // ---------------------------------------------------------------------------
  // PHASE 4: AU BASELINE STOREFRONT AUDIT
  // ---------------------------------------------------------------------------
  console.log('\n▶ [PHASE 4] Navigating to AU Baseline Store Locator...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASELINE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const auBaselineInspection = await page.evaluate(() => {
    const docTitle = document.title;
    const h1 = document.querySelector('h1')?.innerText?.trim() || '';
    const inputs = Array.from(document.querySelectorAll('input.input-text')).filter(i => i.offsetParent !== null && !i.name.includes('q')).map(i => i.placeholder);
    const mapEl = document.querySelector('#js-locator-map, #map');
    const mapText = mapEl ? mapEl.innerText : '';
    const hasError = mapText.includes('Oops! Something went wrong');
    return {
      docTitle,
      h1,
      inputs,
      mapOperational: !hasError && !!mapEl
    };
  });
  console.log('AU Baseline Inspection:', auBaselineInspection);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_AU_BASELINE_DESKTOP_FULLPAGE.png'), fullPage: true });

  await page.waitForTimeout(2000);
  await browser.close();

  // ---------------------------------------------------------------------------
  // COMPILE RESULTS AND CONSOLE LOG ANALYSIS
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log('📊 GOOGLE MAPS API & NETWORK REQUEST SUMMARY');
  console.log('========================================================================');
  console.log('Maps API Network Responses:', mapsNetworkRequests);
  
  const refererErrors = consoleMessages.filter(m => m.text.includes('RefererNotAllowedMapError') || m.text.includes('Google Maps JavaScript API error'));
  console.log('Google Maps Console Errors:', refererErrors);

  // Save audit data to JSON
  const auditReport = {
    timestamp: new Date().toISOString(),
    docTitle,
    isTitleFixed: docTitle.trim() === 'Find a Stockist & Showroom | GlobeWest',
    h1Inspection,
    searchFormsInspection,
    isPlaceholderFixed: searchFormsInspection.inputs.some(i => i.placeholder.includes('90210')),
    mapInspection,
    isMapBroken: mapInspection.hasErrorBox || refererErrors.length > 0,
    cmsBlockInspection,
    isCmsSuffixRemoved: !cmsBlockInspection.hasUsSuffix,
    tradeHeaderInspection,
    mobileEvaluation,
    auBaselineInspection,
    refererErrors,
    mapsNetworkRequests
  };

  const jsonPath = path.resolve(__dirname, '../exhaustive_audit_results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(auditReport, null, 2));
  console.log(`\n💾 Full Exhaustive Audit Data saved to: ${jsonPath}`);

  console.log('\n========================================================================');
  console.log('🏁 EXHAUSTIVE RE-TEST COMPLETE');
  console.log('========================================================================\n');
})();
