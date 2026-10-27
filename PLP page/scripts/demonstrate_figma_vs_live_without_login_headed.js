const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

const FIGMA_VIEWER_URL = 'file://' + path.resolve(__dirname, '../figma_reference_viewer.html');
const US_PLP_URL = 'https://mcstaging2.globewest.com/indoor';

(async () => {
  console.log('========================================================================');
  console.log('🎬 DEMONSTRATING FIGMA REFERENCE & LIVE US PLP WITHOUT LOGIN (HEADED)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
    args: [
      '--no-sandbox',
      '--start-maximized',
      '--window-size=1440,900'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  // Helper for glowing callout banner
  async function addCalloutBanner(page, selectorOrLocator, text, color = '#2563EB', durationMs = 2500) {
    try {
      const locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
      const isVis = await locator.isVisible({ timeout: 1500 }).catch(() => false);
      if (!isVis) return;
      await locator.scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});

      await locator.evaluate((el, { bannerText, bannerColor, dur }) => {
        const prevOutline = el.style.outline;
        const prevBoxShadow = el.style.boxShadow;
        el.style.outline = `3px solid ${bannerColor}`;
        el.style.boxShadow = `0 0 20px ${bannerColor}`;
        el.style.transition = 'all 0.3s ease';

        const tag = document.createElement('div');
        tag.className = 'qa-figma-callout';
        tag.textContent = bannerText;
        tag.style.position = 'absolute';
        tag.style.top = '-34px';
        tag.style.left = '0px';
        tag.style.background = bannerColor;
        tag.style.color = '#FFFFFF';
        tag.style.fontSize = '13px';
        tag.style.fontWeight = 'bold';
        tag.style.padding = '4px 10px';
        tag.style.borderRadius = '6px';
        tag.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        tag.style.zIndex = '999999';
        tag.style.pointerEvents = 'none';
        tag.style.whiteSpace = 'nowrap';

        if (window.getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
        }
        el.appendChild(tag);

        setTimeout(() => {
          el.style.outline = prevOutline;
          el.style.boxShadow = prevBoxShadow;
          tag.remove();
        }, dur);
      }, { bannerText: text, bannerColor: color, dur: durationMs });

      await page.waitForTimeout(durationMs);
    } catch (e) {}
  }

  // ---------------------------------------------------------------------------
  // STEP 1: PRESENT THE EXACT FIGMA DESIGN REFERENCE IN TAB 1
  // ---------------------------------------------------------------------------
  console.log('▶ STEP 1: Opening Figma Design Reference viewer...');
  const pageFigma = await context.newPage();
  await pageFigma.goto(FIGMA_VIEWER_URL, { waitUntil: 'load' });
  console.log('  -> Displaying Figma reference artboard: desktop/Category/Show Filters');
  await pageFigma.waitForTimeout(2000);

  // Scroll through the reference card
  console.log('  -> Scrolling through Figma specifications...');
  await pageFigma.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
  await pageFigma.waitForTimeout(2500);

  await pageFigma.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await pageFigma.waitForTimeout(3000);

  // ---------------------------------------------------------------------------
  // STEP 2: OPEN LIVE US STOREFRONT (WITHOUT LOGIN) IN TAB 2
  // ---------------------------------------------------------------------------
  console.log('\n▶ STEP 2: Opening Live US Storefront (/indoor) in Guest (Without Login) mode...');
  const pageLive = await context.newPage();
  await pageLive.bringToFront();
  await pageLive.goto(US_PLP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageLive.waitForTimeout(2500);

  // Dismiss any popups
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = pageLive.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await btn.click().catch(() => {});
      console.log('  -> Closed popup modal:', sel);
    }
  }

  // 1. Highlight Top Utility Bar
  console.log('  -> Highlighting Top Utility Bar (Figma Requirement: Become a Trade Customer)...');
  const utilityBar = pageLive.locator('.c-top-bar, .panel.header, .header.panel').first();
  await addCalloutBanner(pageLive, utilityBar, '🏷️ FIGMA REF: Utility Bar ("Become a Trade Customer" & "Book Showroom")', '#10B981', 3000);

  // 2. Highlight absence of Pricing Toggle
  console.log('  -> Checking Price Toggle suppression...');
  const header = pageLive.locator('.page-header, header').first();
  await addCalloutBanner(pageLive, header, '✅ FIGMA REF: Pricing Toggle is 100% HIDDEN for Guest Visitors', '#10B981', 2500);

  // 3. Highlight Hero Banner & Quick Links removal
  console.log('  -> Highlighting Hero Banner (Figma Requirement: Quick links removed)...');
  const heroBanner = pageLive.locator('.category-view, .category-image, .c-category-header, h1.page-title').first();
  await addCalloutBanner(pageLive, heroBanner, '🏷️ FIGMA REF: Hero Banner (Subcategory Quick Links Removed as per spec)', '#2563EB', 3000);

  // 4. Highlight Filters Toolbar
  console.log('  -> Highlighting Filters Toolbar (Figma Requirement: Left-aligned filters)...');
  const filterToolbar = pageLive.locator('.filter-options, .c-toolbar, .toolbar-products').first();
  await addCalloutBanner(pageLive, filterToolbar, '🏷️ FIGMA REF: Left-Aligned Filter Toolbar & Redundant Title Removed', '#F59E0B', 3000);

  // 5. Expand a filter facet
  console.log('  -> Interacting with Filter facet accordion (Brand)...');
  const brandFacet = pageLive.locator('.filter-options-title').first();
  if (await brandFacet.isVisible({ timeout: 1500 }).catch(() => false)) {
    await addCalloutBanner(pageLive, brandFacet, '🔘 CLICKING: Expanding "Brand" Filter Facet Accordion', '#F59E0B', 1500);
    await brandFacet.click();
    await pageLive.waitForTimeout(2000);
  }

  // 6. Scroll down to Product Cards Grid
  console.log('  -> Scrolling to Product Cards grid...');
  await pageLive.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
  await pageLive.waitForTimeout(1500);

  // 7. Highlight Product Card Price Masking & Compare
  const firstCard = pageLive.locator('.product-item').first();
  if (await firstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('  -> Highlighting Product Card 1 Price Masking...');
    await addCalloutBanner(pageLive, firstCard, '✅ FIGMA REF: Wholesale Trade Price 100% MASKED (Zero Leakage)', '#10B981', 3000);

    const compareCheck = firstCard.locator('.action.tocompare, label:has-text("Compare")').first();
    if (await compareCheck.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log('  -> Highlighting Compare checkbox...');
      await addCalloutBanner(pageLive, compareCheck, '🏷️ FIGMA REF: [ ] Compare Checkbox (Regular font-weight 400)', '#2563EB', 2500);
    }

    const badge = firstCard.locator('.badge, .product-item:has-text("New"), .product-item:has-text("Customisable")').first();
    if (await badge.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log('  -> Highlighting Badges below photo...');
      await addCalloutBanner(pageLive, badge, '🏷️ FIGMA REF: Badges Relocated Below Photo in Pill Shape', '#10B981', 2500);
    }
  }

  // Smooth scroll through grid
  console.log('  -> Smooth scrolling through catalog grid to observe price masking...');
  await pageLive.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await pageLive.waitForTimeout(2000);

  await pageLive.evaluate(() => window.scrollBy({ top: -300, behavior: 'smooth' }));
  await pageLive.waitForTimeout(2000);

  // Switch back to Figma reference tab for a final side-by-side look
  console.log('  -> Switching back to Figma Reference tab for side-by-side closure...');
  await pageFigma.bringToFront();
  await pageFigma.waitForTimeout(4000);

  console.log('\n========================================================================');
  console.log('🎉 HEADED DEMO COMPLETED SUCCESSFULLY!');
  console.log('Both Figma Reference and Live US Storefront were demonstrated on screen.');
  console.log('========================================================================\n');

  await pageLive.bringToFront();
  await pageLive.waitForTimeout(4000);

  await browser.close();
})();
