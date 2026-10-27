const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  console.log('========================================================================');
  console.log('🎯 HEADED DEMO: FIGMA VS. LIVE "SHOW FILTERS" LOCATION WALKTHROUGH');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 600,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // Create a clean presentation HTML file to show Figma spec first
  const presentationHtmlPath = path.resolve(__dirname, 'show_filters_presentation.html');
  const spotlightImgPath = path.resolve(__dirname, '../screenshots/regression_run/SHOW_FILTERS_FIGMA_VS_LIVE_EXACT_LOCATION.png');

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Figma vs Live - Show Filters Comparison</title>
    <style>
      body {
        margin: 0;
        padding: 24px;
        background: #111827;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .badge-step {
        background: #10B981;
        color: #fff;
        font-weight: 900;
        font-size: 14px;
        padding: 6px 16px;
        border-radius: 9999px;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }
      h1 {
        font-size: 24px;
        margin: 0 0 16px 0;
        text-align: center;
      }
      p {
        font-size: 15px;
        color: #9CA3AF;
        max-width: 900px;
        text-align: center;
        margin-bottom: 24px;
        line-height: 1.5;
      }
      .preview-box {
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #374151;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        max-width: 95%;
      }
      img {
        display: block;
        width: 100%;
        max-width: 1200px;
        height: auto;
      }
    </style>
  </head>
  <body>
    <div class="badge-step">STEP 1: INSPECTING FIGMA SPECIFICATION</div>
    <h1>Where "Show Filters" is in Figma vs. Where it is on Live</h1>
    <p>
      In Figma Frame <strong>2316-12739</strong>, <strong>"Show Filters"</strong> is pinned on the left edge before the filter pills.<br>
      On Live Staging, the toolbar begins directly with <strong>[ Brand ⌵ ]</strong>.
    </p>
    <div class="preview-box">
      <img src="file://${spotlightImgPath}" alt="Comparison">
    </div>
  </body>
  </html>
  `;
  fs.writeFileSync(presentationHtmlPath, htmlContent);

  // STEP 1: Show the side-by-side spotlight first
  console.log('📍 [STEP 1] Displaying Figma vs Live Comparison Card...');
  await page.goto(`file://${presentationHtmlPath}`);
  await page.waitForTimeout(6000);

  // STEP 2: Navigate to Live US Storefront
  console.log('\n📍 [STEP 2] Navigating to Live US Storefront (mcstaging2.globewest.com/indoor)...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Dismiss any popups
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
  }

  // Find the filter toolbar
  const firstPill = page.locator('.c-toolbar, .toolbar, .filter-toolbar, button:has-text("Brand"), select, .filter-options-item, [data-role="title"]').first();
  await firstPill.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Inject a high-visibility animated spotlight on the toolbar showing exactly where it should appear
  console.log('📍 [STEP 3] Highlighting where "Show Filters" SHOULD appear on Live...');
  await page.evaluate(() => {
    // Find the horizontal toolbar
    const toolbar = document.querySelector('.c-toolbar') || document.querySelector('.toolbar-products') || document.querySelector('.toolbar') || document.querySelector('.filter-options');
    if (!toolbar) return;

    toolbar.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Create a container highlight
    const highlightBox = document.createElement('div');
    highlightBox.id = 'qa-show-filters-spotlight';
    highlightBox.style.display = 'inline-flex';
    highlightBox.style.alignItems = 'center';
    highlightBox.style.justifyContent = 'center';
    highlightBox.style.border = '3px dashed #EF4444';
    highlightBox.style.background = 'rgba(239, 68, 68, 0.15)';
    highlightBox.style.color = '#EF4444';
    highlightBox.style.padding = '8px 16px';
    highlightBox.style.marginRight = '14px';
    highlightBox.style.borderRadius = '6px';
    highlightBox.style.fontWeight = 'bold';
    highlightBox.style.fontSize = '14px';
    highlightBox.style.animation = 'pulse 1.5s infinite';
    highlightBox.innerHTML = `
      <span style="text-decoration: underline; margin-right: 6px;">Show Filters</span>
      <span style="font-size: 11px; background: #EF4444; color: #fff; padding: 2px 6px; border-radius: 4px;">WHERE IT SHOULD SHOW PER FIGMA</span>
    `;

    // Floating annotation arrow
    const banner = document.createElement('div');
    banner.style.position = 'absolute';
    banner.style.top = '-55px';
    banner.style.left = '0px';
    banner.style.background = '#EF4444';
    banner.style.color = '#fff';
    banner.style.padding = '8px 14px';
    banner.style.borderRadius = '6px';
    banner.style.fontSize = '13px';
    banner.style.fontWeight = 'bold';
    banner.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
    banner.style.zIndex = '100000';
    banner.innerHTML = '⬇️ IN FIGMA: "Show Filters" is pinned HERE (before the filter pills)';
    highlightBox.style.position = 'relative';
    highlightBox.appendChild(banner);

    // Insert before the first filter child
    const parent = toolbar.querySelector('.filter-options') || toolbar.querySelector('ul') || toolbar;
    parent.insertBefore(highlightBox, parent.firstChild);
  });

  await page.waitForTimeout(4000);

  console.log('\n========================================================================');
  console.log('✅ DEMO COMPLETE: Browser will stay open for 20 seconds so you can see!');
  console.log('========================================================================\n');

  await page.waitForTimeout(20000);
  await browser.close();
})();
