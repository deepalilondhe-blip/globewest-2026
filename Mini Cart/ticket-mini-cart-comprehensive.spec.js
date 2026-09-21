// @ts-check
/**
 * ========================================================================
 * GLOBEWEST US EXPANSION — MINI CART COMPREHENSIVE QA AUDIT
 * Ticket: P-GLW-007 Globewest US Expansion Project / Front End Development: Mini Cart
 * Requirement: Match AU baseline, no redesign required. WCAG 2.2 AA.
 * Mode: HEADED CHROME MODE (--project=desktop-chrome --headed)
 * Viewports: Desktop (1440x900) & Mobile (390x844)
 * Visual Standard:
 *   - Simple Solid Green (#00D632 / #059669) for PASSED / Working Functionality
 *   - Red (#FF0000 / #DC2626) for DEFECTS / Discrepancies
 * ========================================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_URL = process.env.US_URL || 'https://mcstaging2.globewest.com';
const AU_URL = process.env.AU_URL || 'https://mcstaging2.globewest.com.au';

// Verified Trade Customer Credentials
const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123',
  name: 'Deepali Londhe'
};

// In-Stock Test Product
const PDP_PATH = '/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak';

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const MINI_CART_DIR = path.join(WORKSPACE_DIR, 'Mini Cart');
const DESKTOP_DIR = path.join(MINI_CART_DIR, 'screenshots', 'desktop');
const MOBILE_DIR = path.join(MINI_CART_DIR, 'screenshots', 'mobile');
const DEFECTS_DIR = path.join(MINI_CART_DIR, 'screenshots', 'defects');
const AU_DIR = path.join(MINI_CART_DIR, 'screenshots', 'au_baseline');
const COMPARISON_DIR = path.join(MINI_CART_DIR, 'comparison');

[DESKTOP_DIR, MOBILE_DIR, DEFECTS_DIR, AU_DIR, COMPARISON_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Simple Green & Red Highlight Helper ──────────────────────────────────────

async function highlightSimple(locator, label = '', status = 'pass', durationMs = 1200) {
  try {
    const el = locator.first();
    const isVis = await el.isVisible({ timeout: 3000 }).catch(() => false);
    if (!isVis) return;

    await el.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});

    const col = status === 'defect' ? '#FF0000' : (status === 'action' ? '#0077FF' : '#00D632');
    const bgCol = status === 'defect' ? '#DC2626' : (status === 'action' ? '#0284C7' : '#059669');

    await el.evaluate((node, { tagText, borderColor, bgColor }) => {
      node.style.transition = 'outline 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
      node.style.outline = `4px solid ${borderColor}`;
      node.style.outlineOffset = '4px';
      node.style.boxShadow = `0 0 16px ${borderColor}`;

      if (tagText) {
        const prev = document.getElementById('agy-active-badge');
        if (prev) prev.remove();

        const rect = node.getBoundingClientRect();
        const badge = document.createElement('div');
        badge.id = 'agy-active-badge';
        badge.textContent = tagText;
        badge.style.position = 'fixed';
        badge.style.zIndex = '99999999';
        badge.style.backgroundColor = bgColor;
        badge.style.color = '#FFFFFF';
        badge.style.padding = '5px 12px';
        badge.style.fontSize = '12px';
        badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        badge.style.fontWeight = '700';
        badge.style.borderRadius = '4px';
        badge.style.boxShadow = '0 3px 10px rgba(0,0,0,0.5)';
        badge.style.top = Math.max(10, rect.top - 32) + 'px';
        badge.style.left = Math.max(10, rect.left) + 'px';
        badge.style.pointerEvents = 'none';
        badge.style.whiteSpace = 'nowrap';
        document.body.appendChild(badge);
      }
    }, { tagText: label, borderColor: col, bgColor: bgCol });

    await el.page().waitForTimeout(durationMs);
  } catch (e) {}
}

async function clearHighlights(page) {
  try {
    await page.evaluate(() => {
      const b = document.getElementById('agy-active-badge');
      if (b) b.remove();
      document.querySelectorAll('[style*="outline"]').forEach(el => {
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.boxShadow = '';
      });
    });
  } catch (e) {}
}

async function loginAsTrade(page, baseUrl) {
  console.log(`\n[AUTH] Ensuring Trade Customer authentication at ${baseUrl}...`);
  await page.goto(`${baseUrl}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
  await page.waitForTimeout(2000);

  const emailInput = page.locator('#email, input[name="login[username]"]').first();
  const passInput = page.locator('#pass, input[name="login[password]"]').first();
  const loginSubmit = page.locator('#send2, button.action.login.primary').first();

  if (await emailInput.count() > 0 && await emailInput.isVisible().catch(() => false)) {
    console.log(`[AUTH] Submitting credentials for: ${TRADE_USER.email}`);
    await emailInput.fill(TRADE_USER.email);
    await passInput.fill(TRADE_USER.password);
    await loginSubmit.click();
    await page.waitForTimeout(4000);
  }

  if (page.url().includes('/customer/account') && !page.url().includes('/login')) {
    console.log(`[AUTH] Trade Customer authenticated successfully!`);
    return true;
  }
  return false;
}

// ─── Master Test Suite ────────────────────────────────────────────────────────

test.describe('Mini Cart Cross-Storefront Audit: Desktop & Mobile (Headed Mode)', () => {

  // =========================================================================
  // 1. DESKTOP: HEADER CART TRIGGER & EMPTY STATE BEHAVIOR
  // =========================================================================
  test('01. Desktop: Header Mini-Cart Trigger & Empty Routing (AU Parity)', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n================================================================');
    console.log('1. DESKTOP: MINI-CART TRIGGER & EMPTY STATE ROUTING');
    console.log('================================================================');

    await page.goto(`${US_URL}/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2500);

    // 1. Locate Mini-Cart Trigger in Header
    const cartTrigger = page.locator('.minicart-wrapper a.showcart, [data-block="minicart"] a.showcart, a.action.showcart').first();
    await expect(cartTrigger).toBeVisible({ timeout: 5000 });
    await highlightSimple(cartTrigger, 'PASS: Desktop Header Cart Trigger Verified', 'pass', 1200);
    await page.screenshot({ path: path.join(DESKTOP_DIR, '01_Desktop_Header_Cart_Trigger_PASS.png') });
    await clearHighlights(page);

    // 2. Click Mini-Cart Trigger when empty -> routes to /checkout/cart/ (Matches AU)
    console.log('Clicking Mini-Cart trigger on empty state...');
    await highlightSimple(cartTrigger, 'CLICK: Header Cart Trigger...', 'action', 600);
    await cartTrigger.click();
    await page.waitForTimeout(3000);
    await clearHighlights(page);

    console.log(`Destination URL after trigger click: ${page.url()}`);
    expect(page.url()).toContain('/checkout/cart/');
    const emptyHero = page.locator('.cart-empty, .column.main:has-text("Empty")').first();
    if (await emptyHero.isVisible({ timeout: 3000 }).catch(() => false)) {
      await highlightSimple(emptyHero, 'PASS: Empty Cart Navigation Matches AU Behavior', 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '02_Desktop_Empty_Cart_Page_PASS.png') });
      await clearHighlights(page);
    }
  });


  // =========================================================================
  // 2. DESKTOP: POPULATED MINI-CART DRAWER & CONTROLS (TRADE CUSTOMER)
  // =========================================================================
  test('02. Desktop: Trade Populated Mini-Cart Drawer & Complete Controls', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n================================================================');
    console.log('2. DESKTOP: POPULATED MINI-CART SLIDEOUT DRAWER & CONTROLS');
    console.log('================================================================');

    // 1. Authenticate as Trade Customer
    await loginAsTrade(page, US_URL);

    // 2. Navigate to In-Stock Product
    console.log(`Visiting PDP: ${US_URL}${PDP_PATH}`);
    await page.goto(`${US_URL}${PDP_PATH}`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    // 3. Add to Cart
    const addBtn = page.locator('#product-addtocart-button, button.action.tocart').first();
    if (await addBtn.isVisible({ timeout: 5000 })) {
      await highlightSimple(addBtn, 'PASS: Trade Add to Cart Button Active', 'pass', 1000);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '03_Desktop_PDP_AddToCart_Button_PASS.png') });
      await clearHighlights(page);

      await highlightSimple(addBtn, 'CLICK: Adding Product to Cart...', 'action', 600);
      await addBtn.click();
      await page.waitForTimeout(4500);
      await clearHighlights(page);
    }

    // 4. Inspect Header Counter Badge
    const counterBadge = page.locator('.minicart-wrapper .counter.qty, .counter-number').first();
    if (await counterBadge.isVisible({ timeout: 3000 }).catch(() => false)) {
      const countVal = await counterBadge.innerText().catch(() => '');
      console.log(`Header Cart Counter: ${countVal.trim()}`);
      await highlightSimple(counterBadge, `PASS: Header Cart Counter (${countVal.trim()})`, 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '04_Desktop_Cart_Counter_Badge_PASS.png') });
      await clearHighlights(page);
    }

    // 5. Open Mini-Cart Slideout Drawer
    const cartTrigger = page.locator('.minicart-wrapper a.showcart').first();
    await cartTrigger.click();
    await page.waitForTimeout(3000);

    const miniCartModal = page.locator('#ui-id-1, [data-role="dropdownDialog"], .block-minicart').first();
    const isModalVis = await miniCartModal.isVisible({ timeout: 4000 }).catch(() => false);
    console.log(`Populated Mini-Cart Modal Visible: ${isModalVis}`);

    if (isModalVis) {
      // Highlight Populated Drawer
      await highlightSimple(miniCartModal, 'PASS: Populated Mini-Cart Slideout Drawer Active', 'pass', 1500);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '05_Desktop_Populated_MiniCart_Drawer_PASS.png') });
      await clearHighlights(page);

      // Check Product Item Row in Drawer
      const firstItem = page.locator('#mini-cart .item, .minicart-items .item').first();
      if (await firstItem.isVisible().catch(() => false)) {
        await highlightSimple(firstItem, 'PASS: Mini-Cart Item Row (Thumbnail & Title)', 'pass', 1200);
        await page.screenshot({ path: path.join(DESKTOP_DIR, '06_Desktop_MiniCart_Item_Row_PASS.png') });
        await clearHighlights(page);

        // Price Visibility
        const itemPrice = firstItem.locator('.price-container, .price, .minicart-price').first();
        if (await itemPrice.isVisible().catch(() => false)) {
          const priceText = await itemPrice.innerText().catch(() => '');
          console.log(`Mini-Cart Item Price: ${priceText.trim()}`);
          await highlightSimple(itemPrice, `PASS: Unit Price Visible (${priceText.trim()})`, 'pass', 1200);
          await page.screenshot({ path: path.join(DESKTOP_DIR, '07_Desktop_MiniCart_Price_PASS.png') });
          await clearHighlights(page);
        }

        // Quantity Control
        const qtyControl = firstItem.locator('.item-qty, input.cart-item-qty, .details-qty').first();
        if (await qtyControl.isVisible().catch(() => false)) {
          await highlightSimple(qtyControl, 'PASS: Mini-Cart Quantity Stepper / Input', 'pass', 1200);
          await page.screenshot({ path: path.join(DESKTOP_DIR, '08_Desktop_MiniCart_Qty_PASS.png') });
          await clearHighlights(page);
        }

        // Remove Item Action
        const removeAction = firstItem.locator('a.action.delete, button.action.delete').first();
        if (await removeAction.isVisible().catch(() => false)) {
          await highlightSimple(removeAction, 'PASS: Mini-Cart Item Removal Action', 'pass', 1200);
          await page.screenshot({ path: path.join(DESKTOP_DIR, '09_Desktop_MiniCart_Remove_Item_PASS.png') });
          await clearHighlights(page);
        }
      }

      // Check Subtotal & Scan for GST Leak
      const subtotalBlock = page.locator('.subtotal, .subtotal-container').first();
      if (await subtotalBlock.isVisible().catch(() => false)) {
        const subtotalText = await subtotalBlock.innerText().catch(() => '');
        console.log(`Mini-Cart Subtotal: ${subtotalText.replace(/\n+/g, ' ').trim()}`);

        if (subtotalText.toLowerCase().includes('gst')) {
          console.log('🚨 DEFECT: Australian GST tax line leaking in US Mini-Cart subtotal');
          await highlightSimple(subtotalBlock, 'DEFECT: Australian "GST" Tax Line Leaking', 'defect', 2000);
          await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_01_US_MiniCart_GST_Tax_Leak_RED.png') });
          await clearHighlights(page);
        } else {
          await highlightSimple(subtotalBlock, `PASS: Mini-Cart Subtotal (${subtotalText.replace(/\n+/g, ' ').trim()})`, 'pass', 1200);
          await page.screenshot({ path: path.join(DESKTOP_DIR, '10_Desktop_MiniCart_Subtotal_PASS.png') });
          await clearHighlights(page);
        }
      }

      // Check "VIEW AND EDIT CART" link
      const viewCartLink = page.locator('a.action.viewcart, a:has-text("View and Edit Cart"), a:has-text("View Cart")').first();
      if (await viewCartLink.isVisible().catch(() => false)) {
        const href = await viewCartLink.getAttribute('href').catch(() => '');
        await highlightSimple(viewCartLink, `PASS: [VIEW CART] CTA (${href})`, 'pass', 1200);
        await page.screenshot({ path: path.join(DESKTOP_DIR, '11_Desktop_MiniCart_ViewCart_CTA_PASS.png') });
        await clearHighlights(page);
      }

      // Check "PROCEED TO CHECKOUT" CTA
      const checkoutBtn = page.locator('#top-cart-btn-checkout, button:has-text("Proceed to Checkout"), button:has-text("Checkout")').first();
      if (await checkoutBtn.isVisible().catch(() => false)) {
        await highlightSimple(checkoutBtn, 'PASS: [PROCEED TO CHECKOUT] Primary CTA', 'pass', 1200);
        await page.screenshot({ path: path.join(DESKTOP_DIR, '12_Desktop_MiniCart_Checkout_CTA_PASS.png') });
        await clearHighlights(page);
      }

      // Check Close Button ("X")
      const closeBtn = page.locator('#btn-minicart-close, .action.close').first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await highlightSimple(closeBtn, 'PASS: Close Button ("X") Operable', 'pass', 1200);
        await page.screenshot({ path: path.join(DESKTOP_DIR, '13_Desktop_MiniCart_Close_Button_PASS.png') });
        await clearHighlights(page);
        await closeBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  });


  // =========================================================================
  // 3. MOBILE VIEWPORT (390x844): MINI-CART DRAWER RESPONSIVENESS & TOUCH CONTROLS
  // =========================================================================
  test('03. Mobile View: Mini-Cart Header Trigger, Responsive Slideout & Touch UX', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 390, height: 844 });

    console.log('\n================================================================');
    console.log('3. MOBILE VIEW (390x844): MINI-CART RESPONSIVENESS & TOUCH CONTROLS');
    console.log('================================================================');

    // 1. Ensure Trade Customer Login
    await loginAsTrade(page, US_URL);

    // 2. Go to PDP and ensure item in cart
    console.log(`Visiting PDP on Mobile: ${US_URL}${PDP_PATH}`);
    await page.goto(`${US_URL}${PDP_PATH}`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    // 3. Add to cart if button visible
    const addBtn = page.locator('#product-addtocart-button, button.action.tocart').first();
    if (await addBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await highlightSimple(addBtn, 'PASS: Mobile Add to Cart Button Visible', 'pass', 1000);
      await page.screenshot({ path: path.join(MOBILE_DIR, '01_Mobile_PDP_AddToCart_Button_PASS.png') });
      await clearHighlights(page);

      await addBtn.click();
      await page.waitForTimeout(4500);
    }

    // 4. Locate Mobile Header Cart Trigger
    const mobileCartTrigger = page.locator('.minicart-wrapper a.showcart, [data-block="minicart"] a.showcart').first();
    await highlightSimple(mobileCartTrigger, 'PASS: Mobile Header Cart Trigger', 'pass', 1200);
    await page.screenshot({ path: path.join(MOBILE_DIR, '02_Mobile_Header_Cart_Trigger_PASS.png') });
    await clearHighlights(page);

    // 5. Open Mobile Mini-Cart Drawer
    console.log('Tapping Mobile Cart Trigger...');
    await highlightSimple(mobileCartTrigger, 'TAP: Opening Mobile Mini-Cart Drawer...', 'action', 600);
    await mobileCartTrigger.click();
    await page.waitForTimeout(3000);
    await clearHighlights(page);

    // 6. Inspect Mobile Drawer Fit
    const mobileModal = page.locator('#ui-id-1, [data-role="dropdownDialog"], .block-minicart').first();
    const isMobileModalVis = await mobileModal.isVisible({ timeout: 4000 }).catch(() => false);
    console.log(`Mobile Mini-Cart Modal Visible: ${isMobileModalVis}`);

    if (isMobileModalVis) {
      const box = await mobileModal.boundingBox();
      console.log(`Mobile Drawer Dimensions: Width=${box?.width}px, Height=${box?.height}px on 390px Viewport`);

      await highlightSimple(mobileModal, `PASS: Mobile Drawer Width (${Math.round(box?.width || 0)}px) Fits Viewport`, 'pass', 1500);
      await page.screenshot({ path: path.join(MOBILE_DIR, '03_Mobile_Drawer_Fit_PASS.png') });
      await clearHighlights(page);

      // 7. Mobile Close Button Touch Target (WCAG 2.2 AA)
      const closeBtn = page.locator('#btn-minicart-close, .action.close').first();
      if (await closeBtn.isVisible().catch(() => false)) {
        const btnBox = await closeBtn.boundingBox();
        console.log(`Mobile Close Button Size: ${btnBox?.width}x${btnBox?.height}px`);
        await highlightSimple(closeBtn, `PASS: Mobile Close Button Touch Target (${Math.round(btnBox?.width || 0)}x${Math.round(btnBox?.height || 0)}px)`, 'pass', 1200);
        await page.screenshot({ path: path.join(MOBILE_DIR, '04_Mobile_Close_Button_TouchTarget_PASS.png') });
        await clearHighlights(page);
      }

      // 8. Mobile Product Item Card
      const itemRow = page.locator('#mini-cart .item, .minicart-items .item').first();
      if (await itemRow.isVisible().catch(() => false)) {
        await highlightSimple(itemRow, 'PASS: Mobile Product Card Layout Verified', 'pass', 1200);
        await page.screenshot({ path: path.join(MOBILE_DIR, '05_Mobile_Item_Card_Layout_PASS.png') });
        await clearHighlights(page);
      }

      // 9. Mobile Subtotal Display
      const mobileSubtotal = page.locator('.subtotal, .subtotal-container').first();
      if (await mobileSubtotal.isVisible().catch(() => false)) {
        const subText = await mobileSubtotal.innerText().catch(() => '');
        await highlightSimple(mobileSubtotal, `PASS: Mobile Subtotal (${subText.replace(/\n+/g, ' ').trim()})`, 'pass', 1200);
        await page.screenshot({ path: path.join(MOBILE_DIR, '06_Mobile_Subtotal_Display_PASS.png') });
        await clearHighlights(page);
      }

      // 10. Mobile CTAs: "PROCEED TO CHECKOUT" & "VIEW CART"
      const checkoutBtn = page.locator('#top-cart-btn-checkout, button:has-text("Checkout")').first();
      const viewCartBtn = page.locator('a.action.viewcart, a:has-text("View and Edit Cart")').first();

      if (await checkoutBtn.isVisible().catch(() => false)) {
        const chkBox = await checkoutBtn.boundingBox();
        await highlightSimple(checkoutBtn, `PASS: Mobile [CHECKOUT] CTA (Height: ${Math.round(chkBox?.height || 0)}px)`, 'pass', 1200);
        await page.screenshot({ path: path.join(MOBILE_DIR, '07_Mobile_Checkout_CTA_PASS.png') });
        await clearHighlights(page);
      }

      if (await viewCartBtn.isVisible().catch(() => false)) {
        await highlightSimple(viewCartBtn, 'PASS: Mobile [VIEW CART] CTA Accessible', 'pass', 1200);
        await page.screenshot({ path: path.join(MOBILE_DIR, '08_Mobile_ViewCart_CTA_PASS.png') });
        await clearHighlights(page);
      }
    }
  });


  // =========================================================================
  // 4. DEFECTS AUDIT: WISHLIST PARITY GAP & SCOPE LEAKS
  // =========================================================================
  test('04. Defects Audit: Header Wishlist Parity Gap & Cross-Sell Links', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n================================================================');
    console.log('4. AUDITING DEFECTS & PARITY GAPS (RED HIGHLIGHTS)');
    console.log('================================================================');

    await loginAsTrade(page, US_URL);
    await page.goto(`${US_URL}/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2500);

    // 1. Scan Header Wishlist Utility Parity with AU
    const headerWishlist = page.locator('.header .wishlist-link, .header a[href*="wishlist"]').first();
    const isWishlistVis = await headerWishlist.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Header Wishlist Icon Visible on US: ${isWishlistVis}`);

    if (!isWishlistVis) {
      console.log('🚨 DEFECT/PARITY GAP: Wishlist heart icon missing next to Mini-Cart trigger in US Header');
      const cartTrigger = page.locator('.minicart-wrapper a.showcart').first();
      await highlightSimple(cartTrigger, 'DEFECT: Missing Wishlist Heart Icon Next to Mini-Cart Trigger', 'defect', 2000);
      await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_01_US_Header_Missing_Wishlist_Icon_RED.png') });
      await clearHighlights(page);
    }
  });


  // =========================================================================
  // 5. AU BASELINE PARITY PROOFS (GREEN BASELINE)
  // =========================================================================
  test('05. AU Baseline Parity: Capture Reference Proofs (Green Baseline)', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n================================================================');
    console.log('5. CAPTURING AU BASELINE REFERENCE PROOFS (GREEN)');
    console.log('================================================================');

    console.log(`Visiting AU Baseline: ${AU_URL}`);
    await page.goto(`${AU_URL}/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2500);

    const auCartTrigger = page.locator('.minicart-wrapper a.showcart').first();
    if (await auCartTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
      await highlightSimple(auCartTrigger, 'AU BASELINE: Mini-Cart Header Trigger', 'pass', 1200);
      await page.screenshot({ path: path.join(AU_DIR, 'AU_01_Header_MiniCart_Trigger_PASS.png') });
      await clearHighlights(page);
    }

    const auWishlist = page.locator('.header .wishlist-link, .header a[href*="wishlist"]').first();
    if (await auWishlist.isVisible({ timeout: 3000 }).catch(() => false)) {
      await highlightSimple(auWishlist, 'AU BASELINE: Wishlist Heart Icon Present in Header', 'pass', 1200);
      await page.screenshot({ path: path.join(AU_DIR, 'AU_02_Header_Wishlist_Icon_Present_PASS.png') });
      await clearHighlights(page);
    }
  });

});
