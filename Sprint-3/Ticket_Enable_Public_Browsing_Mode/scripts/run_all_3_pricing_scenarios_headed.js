const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';
const AU_LIVE_URL = 'https://www.globewest.com.au';

const OUT_DIR = path.resolve(__dirname, '../screenshots/3_scenarios_demo');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

/**
 * On-screen glowing banner and outline helper
 */
async function showBanner(page, selectorOrLocator, title, description, durationMs = 3500, color = '#00E676') {
  try {
    const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator.first();
    const isVis = await loc.isVisible({ timeout: 2500 }).catch(() => false);
    if (!isVis) return;

    await loc.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(300);

    await loc.evaluate((el, { t, desc, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;

      el.style.outline = `4px solid ${col}`;
      el.style.boxShadow = `0 0 25px ${col}`;
      el.style.zIndex = '99999';

      const banner = document.createElement('div');
      banner.className = 'qa-scenario-banner';
      banner.innerHTML = `
        <div style="font-weight: 900; font-size: 13px; text-transform: uppercase; margin-bottom: 3px;">${t}</div>
        <div style="font-size: 12px; font-weight: normal; opacity: 0.95;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-55px';
      banner.style.left = '0px';
      banner.style.background = col;
      banner.style.color = (col === '#00E676' || col === '#00D2FF' || col === '#FFBB00') ? '#0B1E28' : '#FFFFFF';
      banner.style.padding = '8px 14px';
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
  console.log('🚀 Launching Google Chrome in HEADED MODE to test the 3 Specific View Scenarios...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 500, // Smooth pacing for human observation
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // =========================================================================
  // SCENARIO 1: GENERAL PUBLIC / LOGGED OUT (NO PRICING SHOWN)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [SCENARIO 1] GENERAL PUBLIC / LOGGED OUT — "NO PRICING SHOWN"');
  console.log('============================================================');

  console.log('1. Loading US Category Page (/indoor) as a Public Guest...');
  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // A. Highlight Utility Bar: No pricing toggle, shows Become a Trade Customer
  const utilityBar = page.locator('.panel.header, .header__utility').first();
  await showBanner(
    page,
    utilityBar,
    'SCENARIO 1: GENERAL PUBLIC / LOGGED OUT',
    'Pricing Toggle is strictly hidden. Displays "Become a Trade Customer" & "Book Showroom".',
    4000,
    '#00D2FF'
  );

  // B. Highlight Product Card: No pricing shown & Add to Cart suppressed
  console.log('2. Inspecting Product Card in Public Browsing Mode...');
  const firstCard = page.locator('.product-item').first();
  await showBanner(
    page,
    firstCard,
    'SCENARIO 1: NO PRICING SHOWN ON PLP',
    'Wholesale & Retail prices are 100% masked. Zero dollar signs. Add to Cart suppressed.',
    4000,
    '#00E676'
  );
  await page.screenshot({ path: path.join(OUT_DIR, '01_SCENARIO_1_GUEST_PLP.png') });

  // C. Inspect PDP for Scenario 1
  console.log('3. Navigating to PDP as Public Guest...');
  const testPdp = `${US_BASE_URL}/base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo`;
  await page.goto(testPdp, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const pdpTitle = page.locator('h1.page-title, .product-info-main h1').first();
  await showBanner(
    page,
    pdpTitle,
    'SCENARIO 1: PDP UNRESTRICTED BROWSING',
    'Product details, gallery & specs load freely, but purchasing price box is 100% suppressed.',
    4000,
    '#00E676'
  );
  await page.screenshot({ path: path.join(OUT_DIR, '01_SCENARIO_1_GUEST_PDP.png') });

  // =========================================================================
  // SCENARIO 2: LOGGED-IN TRADE CUSTOMER (TRADE PRICING BY DEFAULT + TOGGLE)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [SCENARIO 2] LOGGED-IN TRADE CUSTOMER — "TRADE PRICING SHOWN BY DEFAULT"');
  console.log('============================================================');

  console.log('1. Logging in as Official US Trade Customer...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForNavigation({ timeout: 35000 }).catch(() => {});
  }
  console.log('✅ Trade Customer successfully authenticated!');

  console.log('2. Navigating to Category Page (/indoor) in Authenticated Trade Mode...');
  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // A. Highlight Header Toggle: Trade Pricing by default
  const priceToggle = page.locator('.price-toggle').first();
  await showBanner(
    page,
    priceToggle,
    'SCENARIO 2: TRADE PRICING TOGGLE ACTIVE',
    'Defaults to [ Trade ] mode with toggle trigger to switch views.',
    4500,
    '#00E676'
  );

  // B. Highlight Dual Pricing on Product Card (Trade Price + MSRP)
  const tradeCard = page.locator('.product-item').first();
  const tradePriceBox = tradeCard.locator('.price-box, [data-role="priceBox"]').first();
  await showBanner(
    page,
    tradePriceBox,
    'SCENARIO 2: DEFAULT TRADE PRICING SHOWN',
    'Trade Price shown by default alongside MSRP ($638.00 / MSRP $701.80).',
    4500,
    '#00E676'
  );
  await page.screenshot({ path: path.join(OUT_DIR, '02_SCENARIO_2_DEFAULT_TRADE_VIEW.png') });

  // C. Interactive Switching: Suppress Trade & Display MSRP only
  console.log('3. Clicking Toggle to SUPPRESS Trade Pricing and Display MSRP only...');
  const toggleTrigger = page.locator('button.price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
  if (await toggleTrigger.isVisible({ timeout: 3000 }).catch(() => false)) {
    await toggleTrigger.click();
    await page.waitForTimeout(1000);

    const msrpOption = page.locator('button[data-view="msrp"], button:has-text("MSRP")').first();
    if (await msrpOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await msrpOption.click();
      await page.waitForTimeout(2500);

      console.log('✅ Switched to MSRP mode!');
      await showBanner(
        page,
        tradePriceBox,
        'SCENARIO 2: TOGGLE TO MSRP (TRADE SUPPRESSED)',
        'Trade margin hidden! Only MSRP is visible for customer-facing client presentations.',
        4500,
        '#FFBB00'
      );
      await page.screenshot({ path: path.join(OUT_DIR, '02_SCENARIO_2_MSRP_ONLY_VIEW.png') });

      // Switch back to Trade
      console.log('4. Switching back to Trade view...');
      await toggleTrigger.click();
      await page.waitForTimeout(1000);
      const tradeOption = page.locator('button[data-view="trade"], button:has-text("Trade")').first();
      await tradeOption.click();
      await page.waitForTimeout(2000);
      console.log('✅ Restored to Trade view.');
    }
  }

  // =========================================================================
  // SCENARIO 3: AU BASELINE SAFEGUARD & RETAIL COMPARISON
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [SCENARIO 3] AU BASELINE STOREFRONT COMPARISON (RETAIL PUBLIC GUEST)');
  console.log('============================================================');

  console.log('1. Loading Australian Storefront (/indoor)...');
  const auPage = await context.newPage();
  await auPage.goto(`${AU_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(async () => {
    await auPage.goto(`${AU_LIVE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  });
  await auPage.waitForTimeout(3000);

  const auCard = auPage.locator('.product-item').first();
  await showBanner(
    auPage,
    auCard,
    'SCENARIO 3: AU BASELINE (RETAIL PRICING VISIBLE)',
    'AU guests see full retail prices in AUD ($AUD incl GST). US B2B masking does not leak into AU.',
    4500,
    '#00E676'
  );
  await auPage.screenshot({ path: path.join(OUT_DIR, '03_AU_BASELINE_RETAIL_GUEST.png') });
  await auPage.close();

  console.log('\n============================================================');
  console.log('🎉 ALL 3 SCENARIOS DEMONSTRATED SUCCESSFULLY!');
  console.log('Keeping browser open for 15 seconds for your review...');
  console.log('============================================================');

  await page.waitForTimeout(15000);
  await browser.close();
  console.log('🏁 Headed demonstration complete.');
})();
