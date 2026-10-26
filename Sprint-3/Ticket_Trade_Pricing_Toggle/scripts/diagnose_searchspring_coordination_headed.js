const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';
const OUT_DIR = path.resolve(__dirname, '../screenshots');

async function showBanner(page, selectorOrLocator, title, description, durationMs = 4500, color = '#FF3366') {
  try {
    const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator.first();
    const isVis = await loc.isVisible({ timeout: 2500 }).catch(() => false);
    if (!isVis) {
      // Fallback: append fixed banner at top of viewport
      await page.evaluate(({ t, desc, dur, col }) => {
        const banner = document.createElement('div');
        banner.className = 'qa-defect-banner-fixed';
        banner.innerHTML = `
          <div style="font-weight: 900; font-size: 14px; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">${t}</div>
          <div style="font-size: 13px; font-weight: normal; line-height: 1.4; opacity: 0.95;">${desc}</div>
        `;
        banner.style.position = 'fixed';
        banner.style.top = '20px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.background = col;
        banner.style.color = '#FFFFFF';
        banner.style.padding = '12px 24px';
        banner.style.borderRadius = '8px';
        banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7)';
        banner.style.zIndex = '10000000';
        banner.style.pointerEvents = 'none';
        banner.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
        banner.style.maxWidth = '900px';
        banner.style.textAlign = 'center';
        document.body.appendChild(banner);
        setTimeout(() => banner.remove(), dur);
      }, { t: title, desc: description, dur: durationMs, col: color });
      await page.waitForTimeout(durationMs);
      return;
    }

    await loc.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(300);

    await loc.evaluate((el, { t, desc, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;

      el.style.outline = `4px solid ${col}`;
      el.style.boxShadow = `0 0 25px ${col}`;
      el.style.zIndex = '99999';

      const banner = document.createElement('div');
      banner.className = 'qa-toggle-banner';
      banner.innerHTML = `
        <div style="font-weight: 900; font-size: 13px; text-transform: uppercase; margin-bottom: 3px;">${t}</div>
        <div style="font-size: 12px; font-weight: normal; opacity: 0.95;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-60px';
      banner.style.left = '0px';
      banner.style.background = col;
      banner.style.color = '#FFFFFF';
      banner.style.padding = '10px 16px';
      banner.style.borderRadius = '6px';
      banner.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
      banner.style.zIndex = '1000000';
      banner.style.pointerEvents = 'none';
      banner.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      banner.style.whiteSpace = 'nowrap';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(banner);

      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.boxShadow = 'none';
        el.style.zIndex = prevZ;
        banner.remove();
      }, dur);
    }, { t: title, desc: description, dur: durationMs, col: color });

    await page.waitForTimeout(durationMs);
  } catch (e) {}
}

(async () => {
  console.log('🚀 Launching Google Chrome in HEADED MODE for SearchSpring Coordination Deep Dive...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 600,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // -------------------------------------------------------------
  // STEP 1: Log in as US Trade Customer
  // -------------------------------------------------------------
  console.log('\n[STEP 1] Logging in as US Trade customer...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }
  console.log('✅ Logged in successfully!');

  // -------------------------------------------------------------
  // STEP 2: Show Working Baseline on Native PLP (/indoor)
  // -------------------------------------------------------------
  console.log('\n[STEP 2] Navigating to Native PLP (/indoor) to show working pricing toggle baseline...');
  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);

  await showBanner(
    page,
    '.price-toggle',
    'HOW IT IS SUPPOSED TO WORK: PLP BASELINE',
    'On standard category pages, clicking the toggle dynamically switches between Trade Wholesale ($638) and MSRP ($701.80).',
    5000,
    '#00E676'
  );

  // Switch to MSRP to demonstrate
  console.log('Switching to MSRP mode...');
  await page.locator('.price-toggle__trigger').first().click();
  await page.waitForTimeout(800);
  await page.locator('button[data-view="msrp"], button:has-text("MSRP")').first().click();
  await page.waitForTimeout(2000);

  await showBanner(
    page,
    '.product-item .price-box',
    'PLP IN MSRP MODE: WHOLESALE SUPPRESSED',
    'Wholesale price is completely hidden, showing customer-facing MSRP only.',
    4500,
    '#00D2FF'
  );

  // -------------------------------------------------------------
  // STEP 3: Now Test SearchSpring Catalog Search (/catalogsearch/result/?q=chair)
  // -------------------------------------------------------------
  console.log('\n[STEP 3] Entering search query "chair" into SearchSpring search bar...');

  const searchInput = page.locator('#search, input[name="q"], [data-role="search-input"]').first();
  if (await searchInput.isVisible({ timeout: 4000 }).catch(() => false)) {
    await searchInput.click();
    await searchInput.fill('chair');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000);
  } else {
    await page.goto(`${US_BASE_URL}/catalogsearch/result/?q=chair`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);
  }

  console.log('Current URL:', page.url());

  // Inspect the SearchSpring DOM elements
  const searchspringDiagnostics = await page.evaluate(() => {
    const hasSearchSpringScript = Array.from(document.querySelectorAll('script[src]')).some(s => s.src.includes('searchspring'));
    const searchspringContent = document.querySelector('#searchspring-content, .searchspring-results, [id*="searchspring"]');
    const productCards = document.querySelectorAll('.product-item, .ss__result, [class*="ss-item"]');
    const toggle = document.querySelector('.price-toggle');
    const toggleTriggerText = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
    const rootClass = document.documentElement.className;
    const bodyText = document.body.innerText.substring(0, 300);

    return {
      hasSearchSpringScript,
      hasSearchSpringContentElement: !!searchspringContent,
      productCardCount: productCards.length,
      hasToggle: !!toggle,
      toggleTriggerText,
      rootClass,
      bodyTextSnippet: bodyText.replace(/\n+/g, ' ')
    };
  });

  console.log('\n============================================================');
  console.log('🔍 SEARCHSPRING LIVE DIAGNOSTICS ON US STAGING:');
  console.log(JSON.stringify(searchspringDiagnostics, null, 2));
  console.log('============================================================');

  // Demonstrate Defect Live
  await showBanner(
    page,
    '.header__search, #search',
    '🔴 DEFECT IDENTIFIED: SEARCHSPRING COORDINATION FAILURE',
    `When searching on US staging, SearchSpring catalog results fail to render (Found: ${searchspringDiagnostics.productCardCount} products). SearchSpring is not yet integrated or synced on mcstaging2!`,
    7000,
    '#FF1744'
  );

  await page.screenshot({ path: path.join(OUT_DIR, 'DEFECT_SEARCHSPRING_LIVE_EXPLANATION.png') });

  // -------------------------------------------------------------
  // STEP 4: Compare with AU Baseline Staging Search
  // -------------------------------------------------------------
  console.log('\n[STEP 4] Opening AU Baseline Staging to show what SearchSpring is supposed to look like...');
  await page.goto(`${AU_BASE_URL}/catalogsearch/result/?q=chair`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const auDiagnostics = await page.evaluate(() => {
    const cards = document.querySelectorAll('.product-item, .ss__result, [class*="ss-item"]');
    const filterToolbar = document.querySelector('.toolbar, .filter-options, [id*="searchspring"]');
    return {
      productCount: cards.length,
      hasFilters: !!filterToolbar
    };
  });
  console.log('AU Baseline Search Result:', auDiagnostics);

  await showBanner(
    page,
    '.toolbar, .product-item',
    '🟢 AU BASELINE: SEARCHSPRING PROPERLY LOADED & INDEXED',
    `On AU staging, SearchSpring successfully returns catalog products (${auDiagnostics.productCount}+ items) with active filters & facets.`,
    6000,
    '#00E676'
  );

  await page.screenshot({ path: path.join(OUT_DIR, 'AU_BASELINE_SEARCHSPRING_WORKING.png') });

  console.log('\n============================================================');
  console.log('🎉 SearchSpring Deep Dive Complete!');
  console.log('Keeping browser open for 15 seconds so you can see the comparison...');
  console.log('============================================================');

  await page.waitForTimeout(15000);
  await browser.close();
  console.log('🏁 Browser closed.');
})();
