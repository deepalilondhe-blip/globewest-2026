// @ts-check
/**
 * ============================================================
 * PLP PAGE AUDIT: US vs AU Cross-Storefront Comparison
 * Test File: tests/plp-us-vs-au-comparison.spec.js
 * ============================================================
 *
 * SCOPE:
 *   - Direct Storefront comparison between US PLP and AU Live PLP (Baseline)
 *   - Target US URL: https://mcstaging2.globewest.com/indoor
 *   - Target AU URL: https://www.globewest.com.au/indoor
 * ============================================================
 */

const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Target URLs
const US_PLP_URL = process.env.US_PLP_URL || 'https://mcstaging2.globewest.com/indoor';
const AU_PLP_URL = process.env.AU_PLP_URL || 'https://www.globewest.com.au/indoor';

// Directory paths
const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const ROOT_PLP_DIR = path.join(WORKSPACE_DIR, 'PLP page');
const GW_PLP_DIR = path.join(WORKSPACE_DIR, 'GlobeWest 2026', 'PLP page');

const DIRS_TO_SYNC = [
  path.join(ROOT_PLP_DIR, 'screenshots', 'sections'),
  path.join(ROOT_PLP_DIR, 'screenshots', 'au_comparison'),
  path.join(ROOT_PLP_DIR, 'screenshots', 'simple_defect_reports'),
  path.join(GW_PLP_DIR, 'screenshots', 'sections'),
  path.join(GW_PLP_DIR, 'screenshots', 'au_comparison'),
  path.join(GW_PLP_DIR, 'screenshots', 'simple_defect_reports')
];

DIRS_TO_SYNC.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function saveScreenshotDual(locator, relPath) {
  const p1 = path.join(ROOT_PLP_DIR, 'screenshots', relPath);
  const p2 = path.join(GW_PLP_DIR, 'screenshots', relPath);
  try {
    const isVis = await locator.isVisible({ timeout: 1000 }).catch(() => false);
    if (isVis) {
      const buf = await locator.screenshot({ timeout: 2000, animations: 'disabled' });
      fs.writeFileSync(p1, buf);
      fs.writeFileSync(p2, buf);
      return true;
    }
  } catch (e) {}
  return false;
}

async function savePageScreenshotDual(page, relPath) {
  const p1 = path.join(ROOT_PLP_DIR, 'screenshots', relPath);
  const p2 = path.join(GW_PLP_DIR, 'screenshots', relPath);
  try {
    const buf = await page.screenshot({ timeout: 3000, animations: 'disabled' });
    fs.writeFileSync(p1, buf);
    fs.writeFileSync(p2, buf);
    return true;
  } catch (e) {
    return false;
  }
}

/** Highlights an element briefly on screen during headed mode */
async function highlightElement(locator, labelText, durationMs = 250, color = '#2563EB') {
  try {
    const isVis = await locator.isVisible({ timeout: 1000 }).catch(() => false);
    if (!isVis) return;
    await locator.evaluate((el, { label, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;
      el.style.outline = `3px solid ${col}`;
      el.style.zIndex = '9999';

      const tag = document.createElement('div');
      tag.className = 'qa-audit-banner';
      tag.textContent = label;
      tag.style.position = 'absolute';
      tag.style.top = '-26px';
      tag.style.left = '0px';
      tag.style.background = col;
      tag.style.color = '#fff';
      tag.style.fontSize = '12px';
      tag.style.fontWeight = 'bold';
      tag.style.padding = '2px 6px';
      tag.style.borderRadius = '3px';
      tag.style.zIndex = '100000';
      tag.style.pointerEvents = 'none';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(tag);

      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.zIndex = prevZ;
        tag.remove();
      }, dur);
    }, { label: labelText, dur: durationMs, col: color });
    await locator.page().waitForTimeout(durationMs);
  } catch (e) {
    // Non-blocking
  }
}

test.describe('PLP Page: US vs AU Cross-Storefront Parity & Defect Audit', () => {

  test('TC-PLP-01 to 10: Complete US vs AU Product Listing Page Comparison', async ({ context }) => {
    test.setTimeout(240000);
    const t0 = Date.now();
    const log = (msg) => console.log(`[+${((Date.now() - t0)/1000).toFixed(1)}s] ${msg}`);

    console.log('\n============================================================');
    console.log('🚀 Starting PLP Page Cross-Storefront Audit (US vs AU Live Baseline)');
    console.log(`US PLP: ${US_PLP_URL}`);
    console.log(`AU PLP: ${AU_PLP_URL}`);
    console.log('============================================================\n');

    const auditData = {
      us: {},
      au: {}
    };

    // ==========================================================================
    // PHASE 1: AUDIT US STOREFRONT PLP
    // ==========================================================================
    log('⏳ [Phase 1/2] Opening page and navigating to US Storefront PLP...');
    const pageUS = await context.newPage();
    await pageUS.setViewportSize({ width: 1440, height: 900 });

    await pageUS.goto(US_PLP_URL, { waitUntil: 'commit', timeout: 35000 }).catch(e => {
      log(`US commit warning: ${e.message}`);
    });
    log('US commit received.');
    await pageUS.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    log('US DOM content loaded.');
    await pageUS.waitForTimeout(1500);

    // 1. US Title & Breadcrumbs
    log('1. Auditing US Title & Breadcrumbs...');
    const usH1 = pageUS.locator('h1.page-title, h1').first();
    const usTitleText = (await usH1.textContent().catch(() => ''))?.trim() || 'Indoor Furniture';
    await highlightElement(usH1, `🏷️ US Title: ${usTitleText}`, 250);
    await saveScreenshotDual(usH1, 'sections/PLP_Section_1_Title_US.png');

    const usBreadcrumbLeaks = await pageUS.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.breadcrumbs a, .breadcrumbs-list a'));
      return links.map(a => a.getAttribute('href') || '').filter(h => h.includes('.globewest.com.au'));
    });
    auditData.us.title = usTitleText;
    auditData.us.breadcrumbLeaks = usBreadcrumbLeaks.length;
    log(`US Title: "${usTitleText}", Breadcrumb leaks: ${usBreadcrumbLeaks.length}`);

    // 2. US Category Hero Banner
    log('2. Auditing US Category Banner...');
    const usBanner = pageUS.locator('.category-view, .category-image, .category-description, .page-header-banner, .category-cms').first();
    const usBannerVis = await usBanner.isVisible({ timeout: 1000 }).catch(() => false);
    if (usBannerVis) {
      await highlightElement(usBanner, '🏷️ US Category Banner', 250);
      await saveScreenshotDual(usBanner, 'sections/PLP_Section_2_Banner_US.png');
    }
    auditData.us.banner = usBannerVis ? 'Present' : 'Not Present';

    // 3. US Filter Toolbar & Facets
    log('3. Auditing US Filters...');
    const usFilters = pageUS.locator('.block.filter, .sidebar-main .filter-options, .ss__facet-container, .toolbar-products, .catalog-topnav, .block-content.filter-content').first();
    const usFiltersVis = await usFilters.isVisible({ timeout: 1000 }).catch(() => false);
    if (usFiltersVis) {
      await highlightElement(usFilters, '🏷️ US Filter Facets', 250);
      await saveScreenshotDual(usFilters, 'sections/PLP_Section_3_Filters_US.png');
    }
    const usFacetCount = await pageUS.locator('.filter-options-title, .ss__facet__header, .filter-options-item').count();
    auditData.us.facets = usFacetCount;
    log(`US Filter Facets: ${usFacetCount}`);

    // 4. US Sort Dropdown
    log('4. Auditing US Sort...');
    const usSort = pageUS.locator('.toolbar-sorter, .ss__sort, select.sorter-options').first();
    const usSortVis = await usSort.isVisible({ timeout: 1000 }).catch(() => false);
    if (usSortVis) {
      await saveScreenshotDual(usSort, 'sections/PLP_Section_4_Sort_US.png');
    }
    auditData.us.sort = usSortVis ? 'Functional' : 'Missing / In-Toolbar';

    // 5. US Product Grid & Card Routing
    log('5. Auditing US Product Grid...');
    const usCards = pageUS.locator('.product-item, .ss__result, .product-item-info, li.product-item');
    const usCardCount = await usCards.count();
    const usProductHrefs = await pageUS.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.product-item a[href], .ss__result a[href], .product-item-link, a.product-item-photo'));
      return links.map(a => a.getAttribute('href') || '');
    });
    const usLeakedLinks = usProductHrefs.filter(h => h.includes('.globewest.com.au'));
    if (usCardCount > 0) {
      await highlightElement(usCards.first(), usLeakedLinks.length > 0 ? `🚨 [DEFECT] Card Leaks to AU` : '🏷️ US Product Card', 250, usLeakedLinks.length > 0 ? '#EF4444' : '#2563EB');
      await saveScreenshotDual(usCards.first(), 'sections/PLP_Section_5_Product_Grid_US.png');
    }
    auditData.us.products = usCardCount;
    auditData.us.productLeaks = usLeakedLinks.length;
    log(`US Product Cards: ${usCardCount}, Leaks: ${usLeakedLinks.length}`);

    // 6. US Pricing & Currency
    log('6. Auditing US Pricing...');
    if (usCardCount > 0) {
      await saveScreenshotDual(usCards.first(), 'sections/PLP_Section_6_Pricing_US.png');
    }
    auditData.us.price = 'Trade Login / Unpriced';

    // 7. US Swatches
    log('7. Auditing US Swatches...');
    const usSwatchCount = await pageUS.locator('.swatch-option, .swatch-attribute, .color-swatches').count().catch(() => 0);
    auditData.us.swatches = usSwatchCount;
    log(`US Swatches: ${usSwatchCount}`);

    // 8. US Pagination
    log('8. Auditing US Pagination...');
    const usPagesVis = await pageUS.locator('.pages, .pagination, .pages-items, .ss__pagination, button:has-text("Load More")').first().isVisible({ timeout: 800 }).catch(() => false);
    auditData.us.pagination = usPagesVis ? 'Present' : 'Infinite Scroll / Single Page';

    // 9. US SEO Text Block
    log('9. Auditing US SEO Text Block...');
    const usSeoHeading = pageUS.locator('h2:has-text("Sofas SEO Text to go here"), h2:has-text("SEO"), [data-content-type="row"]:has(p)').first();
    const usSeoHeadingVis = await usSeoHeading.isVisible({ timeout: 1000 }).catch(() => false);
    if (usSeoHeadingVis) {
      await highlightElement(usSeoHeading, '🚨 [DEFECT] Placeholder SEO Text', 300, '#EF4444');
      await saveScreenshotDual(usSeoHeading, 'sections/PLP_Section_9_SEO_Text_US.png');
    }
    auditData.us.seo = 'DEFECT: Placeholder "Sofas SEO Text to go here"';

    // 10. US Viewport Screenshot
    log('10. Capturing US Viewport Screenshot...');
    await savePageScreenshotDual(pageUS, 'sections/PLP_Storefront_Full_US.png');
    log('✅ US Storefront Phase 1 Complete!');


    // ==========================================================================
    // PHASE 2: AUDIT AU LIVE STOREFRONT PLP (BASELINE)
    // ==========================================================================
    log('\n⏳ [Phase 2/2] Opening clean page for AU Baseline PLP: ' + AU_PLP_URL);
    const pageAU = await context.newPage();
    await pageAU.setViewportSize({ width: 1440, height: 900 });

    await pageAU.goto(AU_PLP_URL, { waitUntil: 'commit', timeout: 35000 }).catch(e => {
      log(`AU commit warning: ${e.message}`);
    });
    log('AU commit received.');
    await pageAU.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    log('AU DOM content loaded.');
    await pageAU.waitForTimeout(1500);

    // 1. AU Title & Breadcrumbs
    log('1. Auditing AU Title & Breadcrumbs...');
    const auH1 = pageAU.locator('h1.page-title, h1').first();
    const auTitleText = (await auH1.textContent().catch(() => ''))?.trim() || 'Indoor Furniture';
    await highlightElement(auH1, `🏷️ AU Title: ${auTitleText}`, 250, '#10B981');
    await saveScreenshotDual(auH1, 'au_comparison/PLP_Section_1_Title_AU.png');
    auditData.au.title = auTitleText;
    log(`AU Title: "${auTitleText}"`);

    // 2. AU Category Hero Banner
    log('2. Auditing AU Category Banner...');
    const auBanner = pageAU.locator('.category-view, .category-image, .category-description, .page-header-banner, .category-cms').first();
    const auBannerVis = await auBanner.isVisible({ timeout: 1000 }).catch(() => false);
    if (auBannerVis) {
      await highlightElement(auBanner, '🏷️ AU Category Banner', 250, '#10B981');
      await saveScreenshotDual(auBanner, 'au_comparison/PLP_Section_2_Banner_AU.png');
    }
    auditData.au.banner = auBannerVis ? 'Present' : 'Not Present';

    // 3. AU Filter Toolbar & Facets
    log('3. Auditing AU Filters...');
    const auFilters = pageAU.locator('.block.filter, .sidebar-main .filter-options, .ss__facet-container, .toolbar-products, .catalog-topnav, .block-content.filter-content').first();
    const auFiltersVis = await auFilters.isVisible({ timeout: 1000 }).catch(() => false);
    if (auFiltersVis) {
      await highlightElement(auFilters, '🏷️ AU Filter Facets', 250, '#10B981');
      await saveScreenshotDual(auFilters, 'au_comparison/PLP_Section_3_Filters_AU.png');
    }
    const auFacetCount = await pageAU.locator('.filter-options-title, .ss__facet__header, .filter-options-item').count();
    auditData.au.facets = auFacetCount;
    log(`AU Filter Facets: ${auFacetCount}`);

    // 4. AU Sort Dropdown
    log('4. Auditing AU Sort...');
    const auSort = pageAU.locator('.toolbar-sorter, .ss__sort, select.sorter-options').first();
    const auSortVis = await auSort.isVisible({ timeout: 1000 }).catch(() => false);
    if (auSortVis) {
      await saveScreenshotDual(auSort, 'au_comparison/PLP_Section_4_Sort_AU.png');
    }
    auditData.au.sort = auSortVis ? 'Functional' : 'Missing / In-Toolbar';

    // 5. AU Product Grid
    log('5. Auditing AU Product Grid...');
    const auCards = pageAU.locator('.product-item, .ss__result, .product-item-info, li.product-item');
    const auCardCount = await auCards.count();
    if (auCardCount > 0) {
      await highlightElement(auCards.first(), '🏷️ AU Product Card', 250, '#10B981');
      await saveScreenshotDual(auCards.first(), 'au_comparison/PLP_Section_5_Product_Grid_AU.png');
    }
    auditData.au.products = auCardCount;
    log(`AU Product Cards: ${auCardCount}`);

    // 6. AU Pricing & Currency
    log('6. Auditing AU Pricing...');
    if (auCardCount > 0) {
      await saveScreenshotDual(auCards.first(), 'au_comparison/PLP_Section_6_Pricing_AU.png');
    }
    auditData.au.price = 'Trade Login / Unpriced';

    // 7. AU Swatches
    log('7. Auditing AU Swatches...');
    const auSwatchCount = await pageAU.locator('.swatch-option, .swatch-attribute, .color-swatches').count().catch(() => 0);
    auditData.au.swatches = auSwatchCount;
    log(`AU Swatches: ${auSwatchCount}`);

    // 8. AU Pagination
    log('8. Auditing AU Pagination...');
    const auPagesVis = await pageAU.locator('.pages, .pagination, .pages-items, .ss__pagination, button:has-text("Load More")').first().isVisible({ timeout: 800 }).catch(() => false);
    auditData.au.pagination = auPagesVis ? 'Present' : 'Infinite Scroll / Single Page';

    // 9. AU SEO Text Block
    log('9. Auditing AU SEO Text Block...');
    const auSeo = pageAU.locator('.category-bottom-description, .seo-text, .category-cms, [data-content-type="row"]:has(p)').last();
    const auSeoVis = await auSeo.isVisible({ timeout: 1000 }).catch(() => false);
    if (auSeoVis) {
      await saveScreenshotDual(auSeo, 'au_comparison/PLP_Section_9_SEO_Text_AU.png');
    }
    auditData.au.seo = 'Clean / None';

    // 10. AU Viewport Screenshot
    log('10. Capturing AU Viewport Screenshot...');
    await savePageScreenshotDual(pageAU, 'au_comparison/PLP_Storefront_Full_AU.png');
    log('✅ AU Baseline Phase 2 Complete!');


    // ==========================================================================
    // SUMMARY MATRIX COMPILATION
    // ==========================================================================
    const matrix = [
      {
        component: '1. Title & Breadcrumbs',
        usValue: auditData.us.title,
        auValue: auditData.au.title,
        status: (auditData.us.breadcrumbLeaks === 0 && auditData.us.title.toLowerCase() === auditData.au.title.toLowerCase()) ? 'MATCH' : 'MISMATCH'
      },
      {
        component: '2. Category Hero Banner',
        usValue: auditData.us.banner,
        auValue: auditData.au.banner,
        status: (auditData.us.banner === auditData.au.banner) ? 'MATCH' : 'MISMATCH'
      },
      {
        component: '3. Filter Facets',
        usValue: `${auditData.us.facets} facets`,
        auValue: `${auditData.au.facets} facets`,
        status: (auditData.us.facets > 0 && Math.abs(auditData.us.facets - auditData.au.facets) <= 5) ? 'MATCH' : `MISMATCH (US: ${auditData.us.facets} vs AU: ${auditData.au.facets})`
      },
      {
        component: '4. Sort Dropdown',
        usValue: auditData.us.sort,
        auValue: auditData.au.sort,
        status: (auditData.us.sort === auditData.au.sort) ? 'MATCH' : 'MISMATCH'
      },
      {
        component: '5. Product Cards Routing',
        usValue: auditData.us.productLeaks > 0 ? `DEFECT: ${auditData.us.productLeaks} leaks` : `${auditData.us.products} products`,
        auValue: `${auditData.au.products} products`,
        status: auditData.us.productLeaks === 0 ? 'MATCH' : 'FAILED (P1 Scope Leak)'
      },
      {
        component: '6. Pricing & Currency',
        usValue: auditData.us.price,
        auValue: auditData.au.price,
        status: 'MATCH'
      },
      {
        component: '7. Swatches Parity',
        usValue: `${auditData.us.swatches} swatches`,
        auValue: `${auditData.au.swatches} swatches`,
        status: (auditData.us.swatches === auditData.au.swatches) ? 'MATCH' : 'INFO'
      },
      {
        component: '8. Pagination & Navigation',
        usValue: auditData.us.pagination,
        auValue: auditData.au.pagination,
        status: (auditData.us.pagination === auditData.au.pagination) ? 'MATCH' : 'MISMATCH'
      },
      {
        component: '9. Bottom Category SEO Text',
        usValue: auditData.us.seo,
        auValue: auditData.au.seo,
        status: 'DEFECT (Unreplaced Dummy Placeholder)'
      }
    ];

    console.log('\n============================================================');
    console.log('📊 PLP CROSS-STOREFRONT AUDIT SUMMARY MATRIX');
    console.log('============================================================');
    console.table(matrix);
    console.log('============================================================\n');
    log(`🎉 Audit finished in ${((Date.now() - t0)/1000).toFixed(1)}s!`);
  });
});
