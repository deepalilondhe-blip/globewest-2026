const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_EXACT_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-12739&p=f&t=7H6mtO9jrDjRty3L-0';
const US_PLP_URL = 'https://mcstaging2.globewest.com/indoor';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const OUT_DIRS = [
  path.join(WORKSPACE_DIR, 'PLP page', 'screenshots', 'figma_comparison'),
  path.join(WORKSPACE_DIR, 'GlobeWest 2026', 'PLP page', 'screenshots', 'figma_comparison'),
  '/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/figma_comparison'
];

OUT_DIRS.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function savePageScreenshotAll(page, filename) {
  try {
    const buf = await page.screenshot({ timeout: 5000 });
    OUT_DIRS.forEach(d => fs.writeFileSync(path.join(d, filename), buf));
    console.log(`📸 Saved screenshot: ${filename}`);
  } catch (e) {
    console.error(`Error saving ${filename}:`, e.message);
  }
}

async function highlightElement(locator, label, durationMs = 500, color = '#F59E0B') {
  try {
    const isVis = await locator.isVisible({ timeout: 1500 }).catch(() => false);
    if (!isVis) return;
    await locator.scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});
    await locator.evaluate((el, { lbl, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevBoxShadow = el.style.boxShadow;
      el.style.outline = `4px solid ${col}`;
      el.style.boxShadow = `0 0 16px ${col}`;
      el.style.transition = 'all 0.2s ease';

      const tag = document.createElement('div');
      tag.className = 'qa-audit-banner';
      tag.textContent = lbl;
      tag.style.position = 'absolute';
      tag.style.top = '-30px';
      tag.style.left = '0px';
      tag.style.background = col;
      tag.style.color = '#000';
      tag.style.fontSize = '12px';
      tag.style.fontWeight = 'bold';
      tag.style.padding = '3px 8px';
      tag.style.borderRadius = '3px';
      tag.style.zIndex = '999999';
      tag.style.pointerEvents = 'none';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(tag);

      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.boxShadow = prevBoxShadow;
        tag.remove();
      }, dur);
    }, { lbl: label, dur: durationMs, col: color });
    await locator.page().waitForTimeout(durationMs);
  } catch (e) {}
}

async function clickWithHighlight(locator, buttonName, durationMs = 600) {
  try {
    const isVis = await locator.isVisible({ timeout: 2000 }).catch(() => false);
    if (!isVis) return false;
    await locator.scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});

    await locator.evaluate((el, name) => {
      el.style.outline = '4px solid #F59E0B';
      el.style.boxShadow = '0 0 20px #F59E0B';
      el.style.transition = 'all 0.2s ease';

      const badge = document.createElement('div');
      badge.className = 'qa-click-badge';
      badge.textContent = `🔘 CLICKING: ${name}`;
      badge.style.position = 'absolute';
      badge.style.top = '-32px';
      badge.style.left = '0';
      badge.style.background = '#F59E0B';
      badge.style.color = '#000';
      badge.style.fontWeight = 'bold';
      badge.style.fontSize = '12px';
      badge.style.padding = '3px 8px';
      badge.style.borderRadius = '4px';
      badge.style.zIndex = '999999';
      badge.style.pointerEvents = 'none';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(badge);
    }, buttonName);

    await locator.page().waitForTimeout(durationMs);
    await locator.click().catch(() => {});
    await locator.page().waitForTimeout(400);

    await locator.evaluate((el) => {
      el.style.outline = '';
      el.style.boxShadow = '';
      const b = el.querySelector('.qa-click-badge');
      if (b) b.remove();
    }).catch(() => {});
    return true;
  } catch (e) {
    return false;
  }
}

(async () => {
  console.log('\n============================================================');
  console.log('🎯 STEP 1: OPENING FIGMA EXACT SHARED SCREENSHOT NODE');
  console.log(`URL: ${FIGMA_EXACT_URL}`);
  console.log('============================================================\n');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
      '--no-sandbox',
      '--disable-infobars'
    ],
    viewport: null
  });

  const pageFigma = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log('🌐 Loading Figma exact node URL in Chrome...');
  await pageFigma.goto(FIGMA_EXACT_URL, { timeout: 60000 }).catch(e => console.log('Goto note:', e.message));

  console.log('⏳ Waiting 8s for Figma canvas & node to render...');
  await pageFigma.waitForTimeout(8000);

  // Dismiss any tooltips
  await pageFigma.keyboard.press('Escape').catch(() => {});
  await pageFigma.waitForTimeout(500);

  // Check if "[FINAL] Designs" page is selected
  const finalDesignsPage = pageFigma.locator('text="[FINAL] Designs"').first();
  if (await finalDesignsPage.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('📍 [FINAL] Designs page visible in sidebar.');
  }

  // Switch to Properties if Comments tab is active
  const propertiesTab = pageFigma.locator('button:has-text("Properties"), [data-testid="properties-tab"]').first();
  if (await propertiesTab.isVisible({ timeout: 1500 }).catch(() => false)) {
    await clickWithHighlight(propertiesTab, 'Properties Tab', 400);
  }

  // Capture Figma exact shared view screenshot
  await savePageScreenshotAll(pageFigma, 'FIGMA_SHARED_SCREENSHOT_MATCH.png');
  console.log('✅ Reached and captured exact Figma state matching user screenshot!');

  // ==========================================================================
  // STEP 2: OPEN US STOREFRONT PLP FOR LIVE CROSS-CHECK (HEADED MODE)
  // ==========================================================================
  console.log('\n============================================================');
  console.log('🔍 STEP 2: OPENING US STOREFRONT PLP FOR CROSS-CHECK');
  console.log(`URL: ${US_PLP_URL}`);
  console.log('============================================================\n');

  const pagePLP = await context.newPage();
  await pagePLP.setViewportSize({ width: 1440, height: 900 });

  await pagePLP.goto(US_PLP_URL, { timeout: 60000 });
  await pagePLP.waitForLoadState('domcontentloaded').catch(() => {});
  await pagePLP.waitForTimeout(2000);

  // Dismiss popups
  const closeBtn = pagePLP.locator('.action-close, .modal-close, button[aria-label="Close"], .close-modal').first();
  if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await clickWithHighlight(closeBtn, 'Dismiss Popup', 350);
  }

  // 1. Breadcrumbs check
  console.log('🔍 Checking Breadcrumbs...');
  const breadcrumb = pagePLP.locator('.breadcrumbs, .breadcrumb, [aria-label="Breadcrumb"]').first();
  await highlightElement(breadcrumb, '🏷️ Figma Match: Breadcrumb Trail', 400);

  // 2. Hero banner title & description
  console.log('🔍 Checking Hero Banner (Sofas / Category Title)...');
  const heroBanner = pagePLP.locator('.category-view, .page-title-wrapper, .category-image, .category-description').first();
  await highlightElement(heroBanner, '🏷️ Figma Match: Hero Title & Description', 500);

  // 3. Filters Toolbar & Alignment
  console.log('🔍 Checking Filter Toolbar alignment and buttons...');
  const filterToolbar = pagePLP.locator('.filter-options, .block.filter, .toolbar-products').first();
  await highlightElement(filterToolbar, '🏷️ Figma Match: Filter Toolbar (Desktop)', 500);

  // Interactive highlight clicks on filter facets
  const facetPill1 = pagePLP.locator('.filter-options-title, .ss__facet__header, .filter-options-item').first();
  if (await facetPill1.isVisible({ timeout: 1000 }).catch(() => false)) {
    await clickWithHighlight(facetPill1, 'Expand Filter Facet', 500);
  }

  const sortSelect = pagePLP.locator('.toolbar-sorter select, select.sorter-options').first();
  if (await sortSelect.isVisible({ timeout: 1000 }).catch(() => false)) {
    await clickWithHighlight(sortSelect, 'Sort By Dropdown', 400);
  }

  // 4. Product Cards: Badges, Compare Checkbox, and Layout
  console.log('🔍 Checking Product Cards (Compare checkbox, New/Customize badges)...');
  const firstCard = pagePLP.locator('.product-item, .product-item-info').first();
  await firstCard.scrollIntoViewIfNeeded().catch(() => {});
  await highlightElement(firstCard, '🏷️ Figma Match: Product Card Details', 500);

  // Check Compare checkbox
  const compareBox = firstCard.locator('.tocompare, .action.tocompare, input[type="checkbox"][name*="compare"], a[title*="Compare"]').first();
  const hasCompare = await compareBox.isVisible({ timeout: 1000 }).catch(() => false);
  console.log(`  -> Compare option on product card: ${hasCompare ? 'PRESENT' : 'MISSING (Figma specifies Compare checkbox)'}`);

  // Check Badges
  const badges = firstCard.locator('.badge, .product-label, .badge-new, .badge-customisable').first();
  const hasBadges = await badges.isVisible({ timeout: 1000 }).catch(() => false);
  console.log(`  -> Badges on product card: ${hasBadges ? 'PRESENT' : 'NOT FOUND'}`);

  await savePageScreenshotAll(pagePLP, 'US_STOREFRONT_PLP_CROSSCHECK_VIEW.png');

  console.log('\n============================================================');
  console.log('🎉 AUDIT COMPLETE! Keeping browsers open 45s for inspection');
  console.log('============================================================\n');

  await pagePLP.waitForTimeout(45000);
  await context.close();
  console.log('Closed.');
})();
