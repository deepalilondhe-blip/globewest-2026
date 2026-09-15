// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'scratch', 'retest-evidence');

/** Helper: smooth scroll and highlight element with high-visibility floating badge */
async function showDefect(page, locator, title, description, durationMs = 3000, color = '#ff0033') {
  try {
    const isVis = await locator.isVisible({ timeout: 2000 }).catch(() => false);
    if (!isVis) return;
    
    // Smooth scroll into view
    await locator.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(400);

    // Inject high-visibility glowing outline and banner
    await locator.evaluate((el, { t, desc, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;
      el.style.outline = `4px solid ${col}`;
      el.style.boxShadow = `0 0 20px ${col}`;
      el.style.zIndex = '99999';

      const banner = document.createElement('div');
      banner.className = 'qa-live-defect-card';
      banner.innerHTML = `
        <div style="font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">
          ${t}
        </div>
        <div style="font-size: 12px; font-weight: normal; opacity: 0.95;">
          ${desc}
        </div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-52px';
      banner.style.left = '0px';
      banner.style.background = col;
      banner.style.color = '#ffffff';
      banner.style.padding = '6px 12px';
      banner.style.borderRadius = '6px';
      banner.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6)';
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

test.describe('Live PLP Defect Walkthrough', () => {
  test('Visually Demonstrate PLP Defects On-Screen', async ({ page }) => {
    test.setTimeout(240000);

    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }

    console.log('\n============================================================');
    console.log('👀 LAUNCHING VISUAL DEFECT WALKTHROUGH ON US STOREFRONT PLP');
    console.log(`URL: ${US_BASE_URL}/indoor`);
    console.log('============================================================\n');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2000);

    // Dismiss any popups or cookie prompts
    for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click().catch(() => {});
      }
    }

    // --- 1. CATEGORY TITLE ---
    console.log('-> Pointing out Category Title (Baseline)...');
    const title = page.locator('h1.page-title, h1').first();
    await showDefect(page, title, '🟢 BASELINE CHECK: Title & Breadcrumbs', 'Category: "Indoor Furniture" (Routes cleanly on US domain)', 2000, '#00e676');

    // --- 2. FILTER TOOLBAR DEFECT ---
    console.log('-> Pointing out Filter Toolbar Defect (Missing Show Filters)...');
    const filterToolbar = page.locator('.sidebar-main, .filter-options, .toolbar-products').first();
    await showDefect(page, filterToolbar, '🔴 DEFECT 1: Missing "Show Filters" Button', 'Figma requires dedicated "Show Filters" button pinned to left edge. Also missing 12 facets vs AU (38 vs 50).', 3000, '#ff9900');

    // --- 3. COMPARE CHECKBOX DEFECT (PADDING & FONT) ---
    console.log('-> Pointing out Compare Checkbox Defect (Padding=0px)...');
    const firstCard = page.locator('.product-item').first();
    const compareElem = firstCard.locator('label:has-text("Compare"), .compare, .action.tocompare').first();
    await showDefect(page, compareElem, '🔴 DEFECT 2: Compare Checkbox Padding & Typography', 'Client Note: Padding is 0px (sits flush to image corner, needs 12-16px inset). Font weight is bolded.', 3500, '#ff0033');

    // --- 4. BADGE PLACEMENT DEFECT ---
    console.log('-> Pointing out Badges Placement Defect (Should be below photo)...');
    const photoContainer = firstCard.locator('.product-item-photo, .product-image-container').first();
    await showDefect(page, photoContainer, '🔴 DEFECT 3: "New" / "Customize" Badge Placement', 'Client Note: Badges must sit BELOW the photo (in details block), not overlaid on the photo edge. Must be pill shape.', 3500, '#ff0033');

    // --- 5. PRICING & STOCK MESSAGING DEFECT ---
    console.log('-> Pointing out Pricing & Stock Messaging Defect...');
    const detailsContainer = firstCard.locator('.product-item-details').first();
    await showDefect(page, detailsContainer, '🔴 DEFECT 4: Missing Pricing & Stock Line', 'Client Note: Dual pricing line ("$1390 • MSRP: $1490") and stock status ("• In Stock (5)") are missing.', 3500, '#ff0033');

    // --- 6. NETSUITE IMAGES / "GW COMING SOON" PLACEHOLDERS ---
    console.log('-> Pointing out NetSuite Image Sync Defect (Placeholders)...');
    const firstRowCards = page.locator('.product-item');
    const count = Math.min(await firstRowCards.count(), 4);
    for (let i = 0; i < count; i++) {
      const card = firstRowCards.nth(i);
      const img = card.locator('.product-image-photo, img').first();
      await showDefect(page, img, `🔴 DEFECT 5: Product Photo ${i+1} Unsynced`, 'Client Note: Showing fallback placeholder ("GW Coming Soon"). NetSuite ERP media sync pending.', 2500, '#ff0033');
    }

    // --- 7. BOTTOM SEO EDITORIAL COPY DEFECT ---
    console.log('-> Pointing out Bottom Category SEO Copy Defect...');
    const seoBlock = page.locator('.category-description, [class*="seo"], .category-cms').last();
    if (await seoBlock.isVisible({ timeout: 2000 }).catch(() => false)) {
      await showDefect(page, seoBlock, '🔴 DEFECT 6: Dummy Placeholder Copy', 'Displays developer placeholder copy: "Sofas SEO Text to go here" (Lorem Ipsum) above footer.', 3500, '#ff0033');
    }

    // Pause briefly so user can view the full screen before test ends
    console.log('-> Defect walkthrough complete. Pausing for final viewing...');
    await page.waitForTimeout(3000);
  });
});
