// @ts-check
/**
 * GLW-007 (P-GLW-007) — GlobeWest US Expansion: Category Page (Delivery)
 * ======================================================================
 * Accessibility audit for the US B2B Category Page (Outdoor).
 *
 * Primary target: https://mcstaging2.globewest.com/outdoor
 * Figma reference: Globewest-USA---External (node-id=2317-25096)
 *
 * Coverage:
 *   A. Desktop WCAG 2.2 AA scan (native Magento / SearchSpring mode auto-detected)
 *   B. Mobile (393x851) WCAG 2.2 AA scan
 *   C. Expanded filter panel scan (key interactive category-page component)
 *   D. Evidence: screenshots + machine-readable JSON + Markdown report in docs/
 *
 * Run:
 *   npx playwright test tests/glw007-category-page-a11y.spec.js \
 *     --project=desktop-chrome --workers=1 --timeout=300000
 */
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const path = require('path');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const CATEGORY_PATH = process.env.CATEGORY_PATH || '/outdoor';
const CATEGORY_URL = `${US_BASE_URL}${CATEGORY_PATH}`;

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'Comparison before and After snapshout', 'glw007');
const REPORT_PATH = path.join(__dirname, '..', 'docs', 'GLW007_Category_Page_A11y_Report.md');

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test.describe('GLW-007: US Category Page (Delivery) — Accessibility Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Block third-party tracking/overlay services so scans are deterministic
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*', route => route.abort());
    await page.route('**/*dotdigital*', route => route.abort());
  });

  /** Detect which rendering engine produced the category grid. */
  async function detectRenderingMode(page) {
    return page.evaluate(() => {
      const ssContent = document.querySelector('#searchspring-content');
      const ssToolbar = document.querySelector('#searchspring-toolbar');
      const nativeItems = document.querySelectorAll('li.product-item');
      const nativeToolbar = document.querySelector('#toolbar-amount');
      const searchSpringActive =
        (typeof window.isSearchSpringActive !== 'undefined' && window.isSearchSpringActive) ||
        (ssContent && ssContent.innerHTML.trim().length > 0) ||
        (ssToolbar && ssToolbar.innerHTML.trim().length > 0);
      const productCount = nativeItems.length > 0 ? nativeItems.length :
        Array.from(document.querySelectorAll('#searchspring-content [class*="product"]')).length;
      return {
        mode: searchSpringActive ? 'SearchSpring' : 'Native Magento',
        productCount,
        nativeToolbar: !!nativeToolbar,
        hasSsPlaceholder: !!ssContent,
      };
    });
  }

  /** Wait until the category grid (native or SearchSpring) has rendered products. */
  async function waitForCategoryGrid(page) {
    await page.waitForFunction(() => {
      const native = document.querySelectorAll('li.product-item, .product-item');
      const ss = document.querySelector('#searchspring-content');
      const toolbar = document.querySelector('#toolbar-amount');
      return native.length > 0 || (ss && ss.innerHTML.trim().length > 0) || (toolbar && toolbar.textContent.trim().length > 0);
    }, { timeout: 90000 });
    // Settle lazy-loaded images / deferred widget content
    await page.waitForTimeout(4000);
  }

  /** Dismiss cookie/overlay banners that would pollute the scan. */
  async function dismissOverlays(page) {
    for (const sel of ['.action-close', '#btn-cookie-allow', 'button.cookie-accept', 'a#lpclose', '[data-role="closeBtn"]']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await btn.click({ noWaitAfter: true }).catch(() => {});
        await page.waitForTimeout(400);
      }
    }
  }
/**
   * Run an Axe scan, persist detailed results and append a Markdown report line.
   * @param {import('@playwright/test').Page} page
   * @param {string} scanName
   * @param {string} viewportLabel
   */
  async function runAxeAndReport(page, scanName, viewportLabel) {
    const results = await new AxeBuilder({ page })
      .withTags(AXE_TAGS)
      .exclude('iframe[src*="yotpo.com"]')
      .exclude('.yotpo-widget')
      .analyze();

    const violations = results.violations;
    const counts = {
      critical: violations.filter(v => v.impact === 'critical').length,
      serious: violations.filter(v => v.impact === 'serious').length,
      moderate: violations.filter(v => v.impact === 'moderate').length,
      minor: violations.filter(v => v.impact === 'minor').length,
      total: violations.length,
    };

    // Machine-readable artifact
    const jsonPath = path.join(SCREENSHOTS_DIR, `${scanName}-axe-results.json`);
    fs.writeFileSync(jsonPath, JSON.stringify({
      url: page.url(),
      scannedAt: new Date().toISOString(),
      viewport: viewportLabel,
      counts,
      violations: violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        samples: v.nodes.slice(0, 3).map(n => ({
          target: n.target.slice(0, 3),
          html: (n.html || '').slice(0, 220),
          failureSummary: (n.failureSummary || '').slice(0, 400),
        })),
      })),
    }, null, 2));

    const mode = await detectRenderingMode(page);
    const line = [
      `| ${scanName} | ${viewportLabel} | ${mode.mode} | ${mode.productCount} |`,
      `| ${counts.critical} | ${counts.serious} | ${counts.moderate} | ${counts.minor} | ${counts.total} |`,
    ].join('\n');
    fs.appendFileSync(REPORT_PATH, line + '\n');

    console.log(`[GLW-007] ${scanName} (${viewportLabel}) — ${mode.mode}, ${mode.productCount} products. ` +
      `Critical: ${counts.critical}, Serious: ${counts.serious}, Moderate: ${counts.moderate}, Minor: ${counts.minor}, Total: ${counts.total}`);
    return results;
  }
test('A: Desktop WCAG 2.2 AA scan of US Outdoor Category Page', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(CATEGORY_URL, { waitUntil: 'domcontentloaded', timeout: 150000 });
    await dismissOverlays(page);
    await waitForCategoryGrid(page);

    const mode = await detectRenderingMode(page);
    console.log(`[GLW-007] Rendering mode: ${mode.mode}, product cards: ${mode.productCount}`);
    expect(mode.productCount).toBeGreaterThan(0);

    // Essential category-page landmarks must exist
    await expect(page.locator('h1.page-title, .base[data-ui-id="page-title-wrapper"]').first()).toBeVisible();
    await expect(page.locator('nav.breadcrumbs').first()).toBeVisible();
    await expect(page.locator('.product-item, .product-item-info').first()).toBeVisible({ timeout: 60000 });

    const results = await runAxeAndReport(page, 'Outdoor-DT', 'Desktop 1920x1080');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'glw007-outdoor-desktop-fullpage.png'), fullPage: true });

    // Delivery gate: zero critical violations on the category page
    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical, `Critical violations: ${critical.map(v => v.id).join(', ')}`).toEqual([]);
    test.info().attach('Outdoor Desktop Axe JSON',
      { path: path.join(SCREENSHOTS_DIR, 'Outdoor-DT-axe-results.json'), contentType: 'application/json' });
  });

  test('B: Mobile (393x851) WCAG 2.2 AA scan of US Outdoor Category Page', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto(CATEGORY_URL, { waitUntil: 'domcontentloaded', timeout: 150000 });
    await dismissOverlays(page);
    await waitForCategoryGrid(page);

    const mode = await detectRenderingMode(page);
    console.log(`[GLW-007][Mobile] Rendering mode: ${mode.mode}, product cards: ${mode.productCount}`);
    expect(mode.productCount).toBeGreaterThan(0);

    const results = await runAxeAndReport(page, 'Outdoor-Mobile', 'Mobile 393x851');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'glw007-outdoor-mobile-fullpage.png'), fullPage: true });

    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical, `Critical violations: ${critical.map(v => v.id).join(', ')}`).toEqual([]);
    test.info().attach('Outdoor Mobile Axe JSON',
      { path: path.join(SCREENSHOTS_DIR, 'Outdoor-Mobile-axe-results.json'), contentType: 'application/json' });
  });
test('C: Expanded filter panel WCAG 2.2 AA scan', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(CATEGORY_URL, { waitUntil: 'domcontentloaded', timeout: 150000 });
    await dismissOverlays(page);
    await waitForCategoryGrid(page);

    // Open the first collapsed filter (if any) so its options are exposed to assistive tech
    const filterTitles = page.locator('.filter-options-title, .filter-options-item .filter-options-title');
    const filterCount = await filterTitles.count();
    console.log(`[GLW-007] Filter groups found: ${filterCount}`);
    if (filterCount > 0) {
      const firstTitle = filterTitles.first();
      const isExpandable = await firstTitle.evaluate((el) =>
        el.tagName === 'button' ||
        !!el.querySelector('[role="button"]') ||
        el.closest('[data-role="collapsible"]') !== null);
      if (isExpandable) {
        await firstTitle.click().catch(() => {});
        await page.waitForTimeout(1500);
      }
    }

    const results = await runAxeAndReport(page, 'Outdoor-ExpandedFilters', 'Desktop 1920x1080 - Filters Expanded');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'glw007-outdoor-filters-expanded.png'), fullPage: true });

    const critical = results.violations.filter(v => v.impact === 'critical');
    expect(critical, `Critical violations: ${critical.map(v => v.id).join(', ')}`).toEqual([]);
  });
test('D: Search overlay open — WCAG 2.2 AA scan (reproduces critical label defect)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(CATEGORY_URL, { waitUntil: 'domcontentloaded', timeout: 150000 });
    await dismissOverlays(page);
    await waitForCategoryGrid(page);

    // Open the custom search overlay ("od-search") used on the category page header
    const searchTrigger = page.locator('.od-search__trigger, [data-role="search-trigger"], button.search-trigger').first();
    const triggerFound = await searchTrigger.count() > 0;
    console.log(`[GLW-007] Search trigger found: ${triggerFound}`);
    if (triggerFound) {
      await searchTrigger.click().catch(() => {});
      await page.waitForTimeout(1500);
    }

    const results = await runAxeAndReport(page, 'Outdoor-SearchOverlay', 'Desktop 1920x1080 - Search Overlay Open');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'glw007-outdoor-search-overlay.png'), fullPage: true });

    const critical = results.violations.filter(v => v.impact === 'critical');
    console.log(`[GLW-007] Search overlay critical violations: ${critical.map(v => v.id).join(', ') || 'none'}`);
    expect(critical, `Critical violations: ${critical.map(v => v.id).join(', ')}`).toEqual([]);
  });
});