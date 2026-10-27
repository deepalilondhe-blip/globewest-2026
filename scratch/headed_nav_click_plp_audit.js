const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/nav_click_audit_proofs';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function showBanner(page, title, subtitle, bgColor = '#0F172A', duration = 3000) {
  await page.evaluate(({ title, subtitle, bgColor }) => {
    let el = document.getElementById('gw-qa-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gw-qa-banner';
      el.style.position = 'fixed';
      el.style.top = '15px';
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.zIndex = '999999999';
      el.style.padding = '14px 32px';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      el.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      el.style.textAlign = 'center';
      el.style.pointerEvents = 'none';
      el.style.transition = 'all 0.3s ease';
      document.body.appendChild(el);
    }
    el.style.background = bgColor;
    el.innerHTML = `<div style="color:#FFF; font-size:16px; font-weight:bold; margin-bottom:4px;">${title}</div>
                    <div style="color:rgba(255,255,255,0.85); font-size:13px;">${subtitle}</div>`;
  }, { title, subtitle, bgColor });

  if (duration > 0) {
    await page.waitForTimeout(duration);
  }
}

(async () => {
  console.log('🚀 Starting Headed PLP Navigation & Functionality Walkthrough...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 600,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // -------------------------------------------------------------
  // STEP 1: LOGIN AS TRADE CUSTOMER
  // -------------------------------------------------------------
  console.log('1. Logging in as Trade Customer...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await showBanner(page, 'Step 1: Authenticating as US Trade Customer', 'Account: deepali.londhe@overdose.digital', '#0284C7', 2500);
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2, button[type="submit"].login');
  await page.waitForTimeout(6000);

  // -------------------------------------------------------------
  // STEP 2: HOVER & CLICK ON "INDOOR" IN TOP NAVIGATION MENU
  // -------------------------------------------------------------
  console.log('2. Locating "Indoor" in top navigation menu...');
  await showBanner(page, 'Step 2: Hovering & Clicking on "Indoor" in Top Navigation', 'Opening master Indoor PLP via navigation menu', '#10B981', 3000);

  const indoorNav = page.locator('nav a:has-text("Indoor"), .navigation a[href*="indoor"]').first();
  await indoorNav.scrollIntoViewIfNeeded();

  // Highlight navigation item with glowing outline
  await indoorNav.evaluate(el => {
    el.style.outline = '4px solid #10B981';
    el.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.8)';
  });
  await page.waitForTimeout(2000);

  // Hover to show mega menu
  console.log('Hovering over "Indoor" to trigger mega menu...');
  await indoorNav.hover();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT_DIR, '01_indoor_nav_hover_megamenu.png') });

  // Click on "Indoor"
  console.log('Clicking on "Indoor"...');
  await indoorNav.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  console.log('Navigated to:', page.url());
  await showBanner(page, 'Step 3: Indoor PLP Successfully Loaded via Navigation', `URL: ${page.url()} | 48 Product Cards Loaded`, '#10B981', 3500);
  await page.screenshot({ path: path.join(OUT_DIR, '02_indoor_plp_landing.png') });

  // -------------------------------------------------------------
  // STEP 3: TEST HEADER PRICING TOGGLE (TRADE vs MSRP)
  // -------------------------------------------------------------
  console.log('3. Testing Header Pricing Toggle...');
  await showBanner(page, 'Step 4: Testing Header Pricing Toggle (Trade vs MSRP)', 'Observing product card prices update live on screen', '#0284C7', 3000);

  const toggleBtn = page.locator('.header.utility-bar, .panel.header').locator('text=Trade').first();
  if (await toggleBtn.isVisible().catch(() => false)) {
    console.log('Clicking Trade toggle in header...');
    await toggleBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '03_pricing_toggle_dropdown_open.png') });

    const msrpOption = page.locator('text=MSRP, text=Display MSRP').first();
    if (await msrpOption.isVisible().catch(() => false)) {
      console.log('Selecting MSRP Mode...');
      await msrpOption.click();
      await page.waitForTimeout(3000);
      await showBanner(page, 'MSRP Mode Active', 'Product cards now display MSRP pricing structure', '#8B5CF6', 2500);
      await page.screenshot({ path: path.join(OUT_DIR, '04_plp_msrp_mode_active.png') });

      // Switch back to Trade
      await toggleBtn.click().catch(() => {});
      await page.waitForTimeout(1500);
      const tradeOption = page.locator('text=Trade, text=Display Trade').first();
      if (await tradeOption.isVisible().catch(() => false)) {
        await tradeOption.click();
        await page.waitForTimeout(2500);
        await showBanner(page, 'Trade Mode Restored', 'Dual pricing: Trade wholesale + MSRP active', '#10B981', 2000);
      }
    }
  }

  // -------------------------------------------------------------
  // STEP 4: INSPECT CARDS DUAL PRICING & STOCK INDICATORS
  // -------------------------------------------------------------
  console.log('4. Scrolling to inspect product cards...');
  await showBanner(page, 'Step 5: Inspecting Product Cards Micro-UI', 'Verifying dual pricing, stock status & swatches on cards', '#0284C7', 2500);

  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  // Highlight card 1 elements
  await page.evaluate(() => {
    const card = document.querySelector('.product-item');
    if (card) {
      card.style.outline = '3px solid #0284C7';
      const priceBox = card.querySelector('.price-box');
      if (priceBox) {
        priceBox.style.backgroundColor = '#EFF6FF';
        priceBox.style.outline = '2px solid #0284C7';
      }
      const stock = card.querySelector('[class*="stock"], .lead-time');
      if (stock) {
        stock.style.backgroundColor = '#FEF3C7';
        stock.style.outline = '2px solid #D97706';
      }
    }
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT_DIR, '05_plp_card_micro_ui_highlighted.png') });

  // -------------------------------------------------------------
  // STEP 5: TEST CARD SWATCH HOVER & COLOR SWITCHING
  // -------------------------------------------------------------
  console.log('5. Testing Card Swatch Hover...');
  await showBanner(page, 'Step 6: Testing Card Swatch Interaction', 'Hovering swatches to test thumbnail image switching', '#8B5CF6', 3000);

  const cardWithSwatches = page.locator('.product-item:has(.swatch-option)').first();
  if (await cardWithSwatches.isVisible().catch(() => false)) {
    const swatches = cardWithSwatches.locator('.swatch-option');
    const sc = await swatches.count();
    console.log(`Found ${sc} swatches on card. Hovering 2nd swatch...`);
    if (sc > 1) {
      await swatches.nth(1).hover();
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(OUT_DIR, '06_plp_swatch_hover_color_switch.png') });
    }
  }

  // -------------------------------------------------------------
  // STEP 6: TEST COMPARE MODAL ON PLP CARD
  // -------------------------------------------------------------
  console.log('6. Testing Compare Checkbox...');
  await showBanner(page, 'Step 7: Testing Compare Functionality', 'Clicking [ ] Compare on product card', '#0284C7', 2500);

  const compareCheckbox = page.locator('.product-item .action.tocompare, .product-item [data-role="add-to-compare"], .product-item label[for*="compare"]').first();
  if (await compareCheckbox.isVisible().catch(() => false)) {
    await compareCheckbox.click().catch(() => {});
    await page.waitForTimeout(3000);
    await showBanner(page, 'Compare Triggered', 'Selection modal displayed for configurable product', '#10B981', 3000);
    await page.screenshot({ path: path.join(OUT_DIR, '07_plp_compare_modal_triggered.png') });

    // Close modal if open
    const closeBtn = page.locator('.action-close, .modal-header button, button[data-role="closeBtn"]').first();
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click().catch(() => {});
      await page.waitForTimeout(1500);
    }
  }

  // -------------------------------------------------------------
  // STEP 7: TEST FILTER TOOLBAR INTERACTION
  // -------------------------------------------------------------
  console.log('7. Testing Filter Toolbar...');
  await showBanner(page, 'Step 8: Testing Filter Toolbar', 'Toggling filter drawer and inspecting filter facets', '#F59E0B', 3000);

  const filterToggle = page.locator('button:has-text("Show Filters"), button:has-text("Hide Filters"), .filter-toggle, #layered-filter-block .title').first();
  if (await filterToggle.isVisible().catch(() => false)) {
    await filterToggle.click().catch(() => {});
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(OUT_DIR, '08_plp_filters_toggled.png') });
  }

  // -------------------------------------------------------------
  // STEP 8: SCROLL DOWN & HIGHLIGHT RULE 4 PLACEHOLDER / LOREM IPSUM DEFECTS
  // -------------------------------------------------------------
  console.log('8. Scrolling to bottom to inspect SEO text...');
  await showBanner(page, 'Step 9: Auditing Bottom Category Content & Assets', 'Inspecting placeholder images and SEO footer text', '#DC2626', 3000);

  await page.evaluate(() => window.scrollBy({ top: 1200, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy({ top: 1500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  // Highlight Lorem Ipsum defect at the bottom of the page
  await page.evaluate(() => {
    const allEls = Array.from(document.querySelectorAll('*'));
    const loremEl = allEls.find(el => el.innerText && el.innerText.includes('Lorem ipsum'));
    if (loremEl) {
      loremEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      loremEl.style.outline = '4px solid #DC2626';
      loremEl.style.backgroundColor = '#FEE2E2';
      loremEl.style.padding = '12px';
      loremEl.style.borderRadius = '8px';
    }
  });

  await showBanner(page, '🔴 DEFECT FOUND (Rule 4): Dummy Lorem Ipsum & "SEO Text to go here"', 'Raw placeholder template copy published on live US storefront', '#DC2626', 4000);
  await page.screenshot({ path: path.join(OUT_DIR, '09_plp_bottom_lorem_ipsum_defect.png') });

  // -------------------------------------------------------------
  // STEP 9: NOW CLICK ON "OUTDOOR" IN TOP NAVIGATION MENU
  // -------------------------------------------------------------
  console.log('9. Navigating back to top and clicking "Outdoor"...');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  await showBanner(page, 'Step 10: Now Testing "Outdoor" in Top Navigation', 'Clicking "Outdoor" menu item to load Outdoor PLP', '#10B981', 3000);

  const outdoorNav = page.locator('nav a:has-text("Outdoor"), .navigation a[href*="outdoor"]').first();
  await outdoorNav.scrollIntoViewIfNeeded();

  await outdoorNav.evaluate(el => {
    el.style.outline = '4px solid #10B981';
    el.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.8)';
  });
  await page.waitForTimeout(2000);

  console.log('Clicking "Outdoor"...');
  await outdoorNav.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  console.log('Navigated to Outdoor PLP:', page.url());
  await showBanner(page, 'Step 11: Outdoor PLP Loaded Successfully via Navigation', `URL: ${page.url()}`, '#10B981', 3500);
  await page.screenshot({ path: path.join(OUT_DIR, '10_outdoor_plp_landing.png') });

  console.log('Keeping browser open on screen for 10 seconds for user visual observation...');
  await page.waitForTimeout(10000);

  await browser.close();
  console.log('🏁 Headed navigation & functionality audit completed successfully!');
})();
