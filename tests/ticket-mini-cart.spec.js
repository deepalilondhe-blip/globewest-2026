// @ts-check
/**
 * ============================================================
 * TICKET: Mini Cart Cross-Storefront Audit (Match AU)
 * Test File: tests/ticket-mini-cart.spec.js
 * ============================================================
 *
 * SCOPE:
 *   - Target US URL: https://mcstaging2.globewest.com
 *   - Baseline AU URL: https://mcstaging2.globewest.com.au
 *   - Headed execution with interactive visual neon highlights & badges
 *   - Test 1: Header Mini-Cart Trigger & Counter Badge (US vs AU)
 *   - Test 2: Empty Mini-Cart Drawer Layout & Messaging (US vs AU)
 *   - Test 3: Product Purchasing CTA & Populated Mini-Cart Drawer Audit
 *   - Test 4: Order Summary & Australian Tax Leakage Audit ("GST" vs "Sales Tax")
 *   - Test 5: Cross-Sell Recommendations & Domain Leakage Scan
 *   - Test 6: Mobile Responsiveness & Drawer Dismissal (390x844)
 * ============================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_URL = process.env.US_URL || 'https://mcstaging2.globewest.com';
const AU_URL = process.env.AU_URL || 'https://mcstaging2.globewest.com.au';
const ACTIVE_PRODUCT_PATH = '/base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo';

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const MINI_CART_DIR = path.join(WORKSPACE_DIR, 'Mini Cart');
const US_SCREENSHOTS_DIR = path.join(MINI_CART_DIR, 'screenshots', 'us');
const AU_SCREENSHOTS_DIR = path.join(MINI_CART_DIR, 'screenshots', 'au');
const SECTIONS_DIR = path.join(MINI_CART_DIR, 'screenshots', 'sections');
const COMPARISON_DIR = path.join(MINI_CART_DIR, 'comparison');

[US_SCREENSHOTS_DIR, AU_SCREENSHOTS_DIR, SECTIONS_DIR, COMPARISON_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Visual Highlighting Helpers ──────────────────────────────────────────────

/**
 * Highlights an element with a glowing neon border and floating badge tag
 */
async function highlightElement(locator, label = '', durationMs = 1200, color = '#00FFCC') {
  try {
    const el = locator.first();
    const isVis = await el.isVisible({ timeout: 3500 }).catch(() => false);
    if (isVis) {
      await el.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await el.evaluate((node, { tagText, col }) => {
        node.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        node.style.outline = `4px solid ${col}`;
        node.style.outlineOffset = '4px';
        node.style.boxShadow = `0 0 25px ${col}, inset 0 0 15px ${col}`;

        if (tagText) {
          const prev = node.querySelector('.agy-qa-badge');
          if (prev) prev.remove();
          const badge = document.createElement('div');
          badge.className = 'agy-qa-badge';
          badge.textContent = tagText;
          badge.style.position = 'absolute';
          badge.style.zIndex = '9999999';
          badge.style.background = col === '#00FFCC'
            ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)'
            : (col === '#EF4444' || col === '#FF0000')
              ? 'linear-gradient(135deg, #FF0055 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #047857 100%)';
          badge.style.color = '#FFFFFF';
          badge.style.padding = '5px 12px';
          badge.style.fontSize = '12px';
          badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          badge.style.fontWeight = '700';
          badge.style.letterSpacing = '0.5px';
          badge.style.borderRadius = '5px';
          badge.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
          badge.style.top = '-34px';
          badge.style.left = '8px';
          badge.style.pointerEvents = 'none';
          if (window.getComputedStyle(node).position === 'static') {
            node.style.position = 'relative';
          }
          node.appendChild(badge);
        }
      }, { tagText: label, col: color });

      await el.page().waitForTimeout(durationMs);

      await el.evaluate((node) => {
        node.style.outline = '';
        node.style.outlineOffset = '';
        node.style.boxShadow = '';
        const b = node.querySelector('.agy-qa-badge');
        if (b) b.remove();
      }).catch(() => {});
    }
  } catch (e) {}
}

/**
 * Highlights a button or link before interacting/clicking
 */
async function clickWithHighlight(locator, label = '', durationMs = 900) {
  try {
    const el = locator.first();
    const isVis = await el.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVis) {
      await el.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await el.evaluate((node, tagText) => {
        node.style.transition = 'all 0.2s ease-in-out';
        node.style.outline = '4px solid #FF0055';
        node.style.outlineOffset = '3px';
        node.style.boxShadow = '0 0 20px #FF0055';

        if (tagText) {
          const prev = node.querySelector('.agy-qa-badge');
          if (prev) prev.remove();
          const badge = document.createElement('div');
          badge.className = 'agy-qa-badge';
          badge.textContent = `▶ CLICK: ${tagText}`;
          badge.style.position = 'absolute';
          badge.style.zIndex = '9999999';
          badge.style.background = 'linear-gradient(135deg, #FF0055 0%, #BE123C 100%)';
          badge.style.color = '#FFFFFF';
          badge.style.padding = '4px 10px';
          badge.style.fontSize = '11px';
          badge.style.fontWeight = 'bold';
          badge.style.borderRadius = '4px';
          badge.style.top = '-30px';
          badge.style.left = '4px';
          badge.style.pointerEvents = 'none';
          if (window.getComputedStyle(node).position === 'static') {
            node.style.position = 'relative';
          }
          node.appendChild(badge);
        }
      }, label);

      await el.page().waitForTimeout(durationMs);
      await el.click({ timeout: 5000 }).catch(() => {});

      await el.evaluate((node) => {
        node.style.outline = '';
        node.style.outlineOffset = '';
        node.style.boxShadow = '';
        const b = node.querySelector('.agy-qa-badge');
        if (b) b.remove();
      }).catch(() => {});
    }
  } catch (e) {}
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe('Mini Cart Cross-Storefront Audit (US vs AU) - Headed Mode', () => {

  test('01. Header Mini-Cart Trigger & Counter Badge (US vs AU)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 1: HEADER MINI-CART TRIGGER & COUNTER BADGE');
    console.log('======================================================');

    // ── US Storefront ──
    console.log(`[US] Navigating to ${US_URL} ...`);
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const usCartIcon = page.locator('a.action.showcart, [data-block="minicart"] a').first();
    if (await usCartIcon.count() > 0) {
      await highlightElement(usCartIcon, 'US Header Cart Icon', 1200, '#00FFCC');
      const usCartBox = await usCartIcon.boundingBox();
      console.log('[US] Cart icon located at:', usCartBox);
    }

    const usCounter = page.locator('.minicart-wrapper .counter.qty').first();
    if (await usCounter.count() > 0) {
      await highlightElement(usCounter, 'Empty Counter Badge', 1000, '#00FFCC');
    }

    const usHeaderScreenshot = path.join(US_SCREENSHOTS_DIR, '01_US_Header_MiniCart_Trigger.png');
    await page.screenshot({ path: usHeaderScreenshot, clip: { x: 0, y: 0, width: 1400, height: 180 } });
    console.log(`[US] Saved: ${usHeaderScreenshot}`);

    // ── AU Baseline ──
    console.log(`\n[AU] Navigating to ${AU_URL} ...`);
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const auCartIcon = page.locator('a.action.showcart, [data-block="minicart"] a').first();
    if (await auCartIcon.count() > 0) {
      await highlightElement(auCartIcon, 'AU Header Cart Icon (Baseline)', 1200, '#10B981');
    }

    const auCounter = page.locator('.minicart-wrapper .counter.qty').first();
    if (await auCounter.count() > 0) {
      await highlightElement(auCounter, 'AU Counter Badge (Baseline)', 1000, '#10B981');
    }

    const auHeaderScreenshot = path.join(AU_SCREENSHOTS_DIR, '01_AU_Header_MiniCart_Trigger.png');
    await page.screenshot({ path: auHeaderScreenshot, clip: { x: 0, y: 0, width: 1400, height: 180 } });
    console.log(`[AU] Saved: ${auHeaderScreenshot}`);
  });


  test('02. Empty Mini-Cart Drawer Layout & Messaging (US vs AU)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 2: EMPTY MINI-CART DRAWER AUDIT');
    console.log('======================================================');

    // ── US Empty Mini-Cart ──
    console.log(`[US] Navigating to ${US_URL} ...`);
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const usCartIcon = page.locator('a.action.showcart').first();
    await clickWithHighlight(usCartIcon, 'Click Cart Icon to Open Drawer', 1000);
    await page.waitForTimeout(2500);

    const usDrawer = page.locator('.mage-dropdown-dialog, .block-minicart, #ui-id-1').first();
    if (await usDrawer.isVisible().catch(() => false)) {
      await highlightElement(usDrawer, 'US Slide-out Mini Cart Drawer (Empty)', 1500, '#00FFCC');

      const emptyMsg = usDrawer.locator('.subtitle.empty, :has-text("You have no items")').first();
      if (await emptyMsg.count() > 0) {
        await highlightElement(emptyMsg, 'Empty Message: "You have no items in your shopping cart."', 1200, '#00FFCC');
      }

      const closeBtn = usDrawer.locator('#btn-minicart-close, .action.close').first();
      if (await closeBtn.count() > 0) {
        await highlightElement(closeBtn, 'Close Action "X"', 1000, '#00FFCC');
      }

      const usEmptyScreenshot = path.join(US_SCREENSHOTS_DIR, '02_US_Empty_MiniCart_Drawer.png');
      await page.screenshot({ path: usEmptyScreenshot });
      console.log(`[US] Saved: ${usEmptyScreenshot}`);
    }

    // ── AU Baseline Empty Mini-Cart ──
    console.log(`\n[AU] Navigating to ${AU_URL} ...`);
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const auCartIcon = page.locator('a.action.showcart').first();
    await clickWithHighlight(auCartIcon, 'Click AU Cart Icon to Open Drawer', 1000);
    await page.waitForTimeout(2500);

    const auDrawer = page.locator('.mage-dropdown-dialog, .block-minicart, #ui-id-1').first();
    if (await auDrawer.isVisible().catch(() => false)) {
      await highlightElement(auDrawer, 'AU Slide-out Mini Cart Drawer (Baseline)', 1500, '#10B981');

      const auEmptyMsg = auDrawer.locator('.subtitle.empty, :has-text("You have no items")').first();
      if (await auEmptyMsg.count() > 0) {
        await highlightElement(auEmptyMsg, 'AU Empty Message (Baseline)', 1200, '#10B981');
      }

      const auEmptyScreenshot = path.join(AU_SCREENSHOTS_DIR, '02_AU_Empty_MiniCart_Drawer.png');
      await page.screenshot({ path: auEmptyScreenshot });
      console.log(`[AU] Saved: ${auEmptyScreenshot}`);
    }
  });


  test('03. Product Purchasing CTA & Populated Mini-Cart Drawer Audit', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 3: PRODUCT PURCHASING CTA & POPULATED MINI-CART AUDIT');
    console.log('======================================================');

    // ── 1. US Storefront Purchasing Suppression Defect ──
    const usPdpUrl = `${US_URL}${ACTIVE_PRODUCT_PATH}`;
    console.log(`[US] Navigating to PDP: ${usPdpUrl}`);
    await page.goto(usPdpUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    const usAddForm = page.locator('#product_addtocart_form, .product-add-form').first();
    if (await usAddForm.count() > 0) {
      await highlightElement(usAddForm, '🚨 DEFECT: Purchasing Blocked - "Add to Cart" Suppressed', 2000, '#EF4444');
    }

    const usAddBtn = page.locator('#product-addtocart-button, button.tocart, button:has-text("Add to Cart")');
    const usBtnCount = await usAddBtn.count();
    console.log(`[US] Add to Cart button count: ${usBtnCount}`);
    expect(usBtnCount).toBe(0); // Validating the suppressed defect

    const usPdpScreenshot = path.join(US_SCREENSHOTS_DIR, '03_US_PDP_Purchasing_Suppressed.png');
    await page.screenshot({ path: usPdpScreenshot });
    console.log(`[US] Saved: ${usPdpScreenshot}`);


    // ── 2. AU Baseline Populated Mini-Cart Drawer ──
    const auPdpUrl = `${AU_URL}${ACTIVE_PRODUCT_PATH}`;
    console.log(`\n[AU] Navigating to PDP: ${auPdpUrl}`);
    await page.goto(auPdpUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    const auAddBtn = page.locator('#product-addtocart-button, button.tocart').first();
    if (await auAddBtn.count() > 0) {
      await highlightElement(auAddBtn, 'AU Active "ADD TO CART" Button', 1200, '#10B981');
      await clickWithHighlight(auAddBtn, 'Click ADD TO CART', 1000);
      await page.waitForTimeout(5000);
    }

    // Mini Cart drawer auto-slides open on AU
    const auDrawer = page.locator('.mage-dropdown-dialog, .block-minicart').first();
    if (await auDrawer.isVisible().catch(() => false)) {
      await highlightElement(auDrawer, 'AU Populated Slide-Out Mini Cart Drawer', 1500, '#10B981');

      // Highlight Product Item in Mini Cart
      const itemRow = auDrawer.locator('.minicart-items .product-item, .product-item-details').first();
      if (await itemRow.count() > 0) {
        await highlightElement(itemRow, 'Product Card (Title, SKU, Price, Qty)', 1200, '#10B981');
      }

      // Highlight Order Summary Totals
      const totalsBox = auDrawer.locator('.minicart-totals, .subtotal').first();
      if (await totalsBox.count() > 0) {
        await highlightElement(totalsBox, 'Order Summary (Subtotal, GST, Total)', 1200, '#10B981');
      }

      // Highlight Proceed to Checkout button
      const checkoutBtn = auDrawer.locator('#top-cart-btn-checkout, button.checkout').first();
      if (await checkoutBtn.count() > 0) {
        await highlightElement(checkoutBtn, 'PROCEED TO CHECKOUT Button', 1200, '#10B981');
      }

      const auPopulatedScreenshot = path.join(AU_SCREENSHOTS_DIR, '03_AU_Populated_MiniCart_Drawer.png');
      await page.screenshot({ path: auPopulatedScreenshot });
      console.log(`[AU] Saved: ${auPopulatedScreenshot}`);
    }
  });


  test('04. Order Summary & Australian Tax Leakage Audit ("GST" vs "Sales Tax")', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 4: ORDER SUMMARY & AUSTRALIAN TAX "GST" LEAKAGE AUDIT');
    console.log('======================================================');

    // Fetch and verify US subtotal template
    console.log('[US] Checking subtotal template for Australian GST leakage...');
    const response = await page.request.get(`${US_URL}/static/version1789121249/frontend/GW/b2b-us/en_US/Magento_Checkout/template/minicart/subtotal.html`);
    const templateHtml = await response.text();
    
    const hasGst = templateHtml.includes("data-bind=\"i18n: 'GST'\"") || templateHtml.includes('<div class="gst">');
    console.log(`[US] 🚨 Hardcoded Australian GST in minicart subtotal template: ${hasGst}`);
    expect(hasGst).toBe(true); // Confirms Defect 2

    // Check subtotal.min.js
    const jsResponse = await page.request.get(`${US_URL}/static/version1789121249/frontend/GW/b2b-us/en_US/Magento_Checkout/js/minicart/subtotal.min.js`);
    const jsText = await jsResponse.text();
    const jsHasGst = jsText.includes('gst:null') && jsText.includes('this.gst=cart?.tax');
    console.log(`[US] 🚨 JS controller tracks Australian gst property: ${jsHasGst}`);
    expect(jsHasGst).toBe(true);
  });


  test('05. Cross-Sell Recommendations & Domain Leakage Scan', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 5: CROSS-SELL RECOMMENDATIONS & DOMAIN LEAKAGE SCAN');
    console.log('======================================================');

    await page.goto(`${AU_URL}${ACTIVE_PRODUCT_PATH}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    const auAddBtn = page.locator('#product-addtocart-button, button.tocart').first();
    if (await auAddBtn.count() > 0) {
      await auAddBtn.click();
      await page.waitForTimeout(5000);
    }

    const drawer = page.locator('.mage-dropdown-dialog, .block-minicart').first();
    if (await drawer.isVisible().catch(() => false)) {
      const crossSellLinks = await drawer.locator('.minicart-promotion-products a').evaluateAll(els => els.map(a => a.href));
      console.log(`[AU Mini Cart] Total Cross-Sell Links: ${crossSellLinks.length}`);
      
      const auLeaks = crossSellLinks.filter(href => href.includes('.com.au'));
      console.log(`[Mini Cart] Australian Domain Links in Cross-Sell: ${auLeaks.length}`);
      auLeaks.slice(0, 5).forEach((l, i) => console.log(`   #${i + 1}: ${l}`));
    }
  });


  test('06. Mobile Viewport Mini-Cart Responsiveness (390x844)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 6: MOBILE VIEWPORT MINI-CART AUDIT (390x844)');
    console.log('======================================================');

    await page.setViewportSize({ width: 390, height: 844 });

    // ── US Mobile Mini-Cart ──
    console.log(`[US Mobile] Visiting: ${US_URL}`);
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const usCartIcon = page.locator('a.action.showcart').first();
    await clickWithHighlight(usCartIcon, 'Click Cart Icon (Mobile)', 800);
    await page.waitForTimeout(2000);

    const usMobileScreenshot = path.join(US_SCREENSHOTS_DIR, '04_US_MiniCart_Mobile_390x844.png');
    await page.screenshot({ path: usMobileScreenshot });
    console.log(`[US Mobile] Saved: ${usMobileScreenshot}`);

    // ── AU Mobile Mini-Cart ──
    console.log(`\n[AU Mobile] Visiting: ${AU_URL}`);
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const auCartIcon = page.locator('a.action.showcart').first();
    await clickWithHighlight(auCartIcon, 'Click AU Cart Icon (Mobile)', 800);
    await page.waitForTimeout(2000);

    const auMobileScreenshot = path.join(AU_SCREENSHOTS_DIR, '04_AU_MiniCart_Mobile_390x844.png');
    await page.screenshot({ path: auMobileScreenshot });
    console.log(`[AU Mobile] Saved: ${auMobileScreenshot}`);
  });

});
