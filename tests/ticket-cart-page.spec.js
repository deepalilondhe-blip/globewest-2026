// @ts-check
/**
 * ============================================================
 * TICKET: Cart Page Audit & Cross-Storefront Comparison (Match AU)
 * Test File: tests/ticket-cart-page.spec.js
 * ============================================================
 *
 * SCOPE:
 *   - Target US URL: https://mcstaging2.globewest.com
 *   - Baseline AU URL: https://mcstaging2.globewest.com.au
 *   - Headed execution with interactive visual neon highlights & badges
 *   - User Authentication: Deepali Londhe (deepalilondhe.qa@gmail.com / Deepa@123)
 *   - 1. User Account Registration & Login (US & AU)
 *   - 2. Empty Cart State (/checkout/cart/ & header mini-cart)
 *   - 3. In-Stock Product PDP: Pricing & "Add to Cart" Button Interaction
 *   - 4. Mini-Cart Drawer / Popup Trigger (Comparison US vs AU)
 *   - 5. Populated Cart Page Table & Controls (Title, SKU, Price, Qty Stepper, Remove)
 *   - 6. Order Summary Block (Subtotal, Shipping Estimator, US State/Zip, Taxes/GST, Grand Total, Checkout CTA)
 *   - 7. Cross-Border Scope Leakage Scan (Australian domains, AUD currency, AU states/postcodes)
 *   - 8. Mobile Viewport Cart Responsiveness (390x844)
 * ============================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_URL = process.env.US_URL || 'https://mcstaging2.globewest.com';
const AU_URL = process.env.AU_URL || 'https://mcstaging2.globewest.com.au';

// User credentials specified by user
const USER_DATA = {
  prefix: 'Ms',
  firstName: 'Deepali',
  lastName: 'Londhe',
  email: 'deepalilondhe.qa@gmail.com',
  password: 'Deepa@123'
};

const ACTIVE_PRODUCT_PATH = '/base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo';

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const CART_DIR = path.join(WORKSPACE_DIR, 'Cart Page');
const US_SCREENSHOTS_DIR = path.join(CART_DIR, 'screenshots', 'us');
const AU_SCREENSHOTS_DIR = path.join(CART_DIR, 'screenshots', 'au');
const SECTIONS_DIR = path.join(CART_DIR, 'screenshots', 'sections');
const COMPARISON_DIR = path.join(CART_DIR, 'comparison');

[US_SCREENSHOTS_DIR, AU_SCREENSHOTS_DIR, SECTIONS_DIR, COMPARISON_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Visual Highlighting Helpers ──────────────────────────────────────────────

/**
 * Highlights an element with a bright neon outline and floating badge tag
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

      // Clean up outline smoothly
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

/**
 * Ensures user is registered or logged in on the specified site
 */
async function ensureUserLoggedIn(page, baseUrl, isUS = true) {
  const color = isUS ? '#00FFCC' : '#10B981';
  console.log(`\n[${isUS ? 'US' : 'AU'}] Checking Login / Registration status at ${baseUrl}...`);
  
  // 1. Visit Login page
  await page.goto(`${baseUrl}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2000);

  // Attempt login first
  const emailInput = page.locator('#email, input[name="login[username]"]');
  const passInput = page.locator('#pass, input[name="login[password]"]');
  const loginSubmit = page.locator('#send2, button.action.login.primary');

  if (await emailInput.count() > 0 && await emailInput.isVisible()) {
    console.log(`[${isUS ? 'US' : 'AU'}] Attempting login with: ${USER_DATA.email}`);
    await emailInput.fill(USER_DATA.email);
    await passInput.fill(USER_DATA.password);
    await highlightElement(loginSubmit, 'Click Sign In', 800, color);
    await loginSubmit.click();
    await page.waitForTimeout(4000);
  }

  // If redirected to customer dashboard, we are logged in!
  if (page.url().includes('/customer/account') && !page.url().includes('/login') && !page.url().includes('/create')) {
    console.log(`[${isUS ? 'US' : 'AU'}] Successfully logged in as Deepali Londhe!`);
    return true;
  }

  // If login failed or error displayed, go to registration page
  console.log(`[${isUS ? 'US' : 'AU'}] Creating account for Deepali Londhe at ${baseUrl}/customer/account/create/ ...`);
  await page.goto(`${baseUrl}/customer/account/create/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(2500);

  const prefixField = page.locator('#prefix');
  if (await prefixField.count() > 0) {
    await highlightElement(prefixField, 'Title: Ms', 500, color);
    await prefixField.fill(USER_DATA.prefix);
  }

  const fnField = page.locator('#firstname');
  await highlightElement(fnField, 'First Name: Deepali', 500, color);
  await fnField.fill(USER_DATA.firstName);

  const lnField = page.locator('#lastname');
  await highlightElement(lnField, 'Last Name: Londhe', 500, color);
  await lnField.fill(USER_DATA.lastName);

  const emField = page.locator('#email_address');
  await highlightElement(emField, `Email: ${USER_DATA.email}`, 500, color);
  await emField.fill(USER_DATA.email);

  const pwField = page.locator('#password');
  await highlightElement(pwField, 'Password: ••••••••', 500, color);
  await pwField.fill(USER_DATA.password);

  const pwcField = page.locator('#password-confirmation');
  await highlightElement(pwcField, 'Confirm Password: ••••••••', 500, color);
  await pwcField.fill(USER_DATA.password);

  const createBtn = page.locator('#form-validate button.action.submit, #form-validate button[type="submit"]');
  await highlightElement(createBtn, 'Click CREATE ACCOUNT', 900, color);
  await createBtn.click().catch(() => {});
  await page.waitForTimeout(5000);

  console.log(`[${isUS ? 'US' : 'AU'}] Registration submitted. Current URL: ${page.url()}`);
  return true;
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe('Cart Page Cross-Storefront Audit (US vs AU) - Headed Mode', () => {

  test('01. User Login & Account Setup (US vs AU)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 1: USER REGISTRATION & LOGIN FOR CART AUDIT');
    console.log('User: Deepali Londhe (deepalilondhe.qa@gmail.com)');
    console.log('======================================================');

    // US Storefront Login/Registration
    await ensureUserLoggedIn(page, US_URL, true);
    await page.screenshot({ path: path.join(US_SCREENSHOTS_DIR, '00_US_Logged_In_Account.png') });

    // AU Storefront Login/Registration
    await ensureUserLoggedIn(page, AU_URL, false);
    await page.screenshot({ path: path.join(AU_SCREENSHOTS_DIR, '00_AU_Logged_In_Account.png') });
  });


  test('02. Empty Cart State Comparison & Header Mini-Cart (US vs AU)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 2: EMPTY CART STATE & MINI-CART DRAWER AUDIT');
    console.log('======================================================');

    // ── US Empty Cart Page ──
    console.log(`[US] Visiting: ${US_URL}/checkout/cart/`);
    await page.goto(`${US_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const usCartIcon = page.locator('a.action.showcart, [data-block="minicart"] a');
    if (await usCartIcon.count() > 0) {
      await highlightElement(usCartIcon, 'US Header Cart Icon (Empty)', 1200, '#00FFCC');
    }

    const usEmptyContainer = page.locator('.cart-empty, .empty, .column.main:has-text("Empty")');
    if (await usEmptyContainer.count() > 0) {
      await highlightElement(usEmptyContainer, 'US Empty Cart Layout ("My Order")', 1500, '#00FFCC');
    }

    // Capture US Empty Cart screenshot
    const usEmptyScreenshot = path.join(US_SCREENSHOTS_DIR, '01_US_Empty_Cart_Page.png');
    await page.screenshot({ path: usEmptyScreenshot, fullPage: false });
    console.log(`[US] Saved: ${usEmptyScreenshot}`);

    // ── US Mini-Cart Click Trigger ──
    console.log('[US] Testing Header Mini-Cart Trigger Click...');
    if (await usCartIcon.count() > 0) {
      await clickWithHighlight(usCartIcon, 'Click Cart Icon to Open Drawer', 1000);
      await page.waitForTimeout(2000);
      const usMinicartScreenshot = path.join(US_SCREENSHOTS_DIR, '02_US_MiniCart_Drawer.png');
      await page.screenshot({ path: usMinicartScreenshot });
      console.log(`[US] Mini-Cart Screenshot Saved: ${usMinicartScreenshot}`);
    }

    // ── AU Baseline Empty Cart & Mini-Cart ──
    console.log(`\n[AU] Visiting Baseline: ${AU_URL}/checkout/cart/`);
    await page.goto(`${AU_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const auCartIcon = page.locator('a.action.showcart, [data-block="minicart"] a');
    if (await auCartIcon.count() > 0) {
      await highlightElement(auCartIcon, 'AU Header Cart Icon (Baseline)', 1200, '#10B981');
    }

    const auEmptyContainer = page.locator('.cart-empty, .empty, .column.main:has-text("Empty")');
    if (await auEmptyContainer.count() > 0) {
      await highlightElement(auEmptyContainer, 'AU Empty Cart Layout ("My Cart")', 1500, '#10B981');
    }

    const auEmptyScreenshot = path.join(AU_SCREENSHOTS_DIR, '01_AU_Empty_Cart_Baseline.png');
    await page.screenshot({ path: auEmptyScreenshot, fullPage: false });
    console.log(`[AU] Saved: ${auEmptyScreenshot}`);

    // ── AU Mini-Cart Click Trigger ──
    console.log('[AU] Testing AU Baseline Header Mini-Cart Drawer Click...');
    if (await auCartIcon.count() > 0) {
      await clickWithHighlight(auCartIcon, 'Click AU Cart Icon to Open Drawer', 1000);
      await page.waitForTimeout(2000);
      const auMinicartScreenshot = path.join(AU_SCREENSHOTS_DIR, '02_AU_MiniCart_Drawer.png');
      await page.screenshot({ path: auMinicartScreenshot });
      console.log(`[AU] AU Mini-Cart Screenshot Saved: ${auMinicartScreenshot}`);
    }
  });


  test('03. Populated Cart Page Audit (Add Product, Table, Summary, Totals)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 3: POPULATED CART AUDIT (PRODUCT ADDITION & CART TABLE)');
    console.log('======================================================');

    // ── US Storefront: Product Detail Page ──
    const usPdpUrl = `${US_URL}${ACTIVE_PRODUCT_PATH}`;
    console.log(`[US] Navigating to active PDP: ${usPdpUrl}`);
    await page.goto(usPdpUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    // Highlight Product Info & Price
    const usProductTitle = page.locator('.page-title-wrapper h1, h1.page-title').first();
    if (await usProductTitle.count() > 0) {
      await highlightElement(usProductTitle, 'Product Title', 1000, '#00FFCC');
    }

    const usPriceBox = page.locator('.price-box, .product-info-price').first();
    if (await usPriceBox.count() > 0) {
      await highlightElement(usPriceBox, 'Product Price & Trade Tier', 1000, '#00FFCC');
    }

    // Find and highlight Add to Cart button
    const usAddBtn = page.locator('#product-addtocart-button, button.tocart, button:has-text("Add to Cart")').first();
    console.log('[US] Add to Cart Button Count:', await usAddBtn.count());

    if (await usAddBtn.count() > 0) {
      await clickWithHighlight(usAddBtn, 'Add Product to Cart', 1200);
      await page.waitForTimeout(4000);
    }

    // Capture PDP after Add to Cart
    await page.screenshot({ path: path.join(US_SCREENSHOTS_DIR, '03_US_PDP_After_AddToCart.png') });

    // Navigate to US Shopping Cart
    console.log(`[US] Navigating to Cart: ${US_URL}/checkout/cart/`);
    await page.goto(`${US_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    // Highlight Cart Items Table
    const usCartTable = page.locator('#shopping-cart-table, .cart.table-wrapper');
    if (await usCartTable.count() > 0 && await usCartTable.isVisible().catch(() => false)) {
      await highlightElement(usCartTable, 'US Shopping Cart Items Table', 1500, '#00FFCC');

      const usItemRow = page.locator('#shopping-cart-table tbody.cart.item').first();
      if (await usItemRow.count() > 0) {
        await highlightElement(usItemRow, 'Item Details & Pricing', 1000, '#00FFCC');
      }

      const usQtyInput = page.locator('#shopping-cart-table input.qty').first();
      if (await usQtyInput.count() > 0) {
        await highlightElement(usQtyInput, 'Qty Stepper', 800, '#00FFCC');
      }

      const usDeleteBtn = page.locator('#shopping-cart-table a.action.action-delete').first();
      if (await usDeleteBtn.count() > 0) {
        await highlightElement(usDeleteBtn, 'Remove Item Action', 800, '#00FFCC');
      }
    }

    // Highlight Order Summary Block
    const usSummary = page.locator('.cart-summary, #cart-totals');
    if (await usSummary.count() > 0) {
      await highlightElement(usSummary, 'US Order Summary & Shipping Estimator', 1500, '#00FFCC');

      // Expand Shipping and Tax if accordion
      const usShippingHeading = page.locator('#block-shipping-heading, [data-role="title"]:has-text("Estimate")').first();
      if (await usShippingHeading.count() > 0) {
        await clickWithHighlight(usShippingHeading, 'Expand Shipping & Tax Estimator', 800);
        await page.waitForTimeout(1500);

        // Highlight country selector
        const countrySelect = page.locator('select[name="country_id"]');
        if (await countrySelect.count() > 0) {
          await highlightElement(countrySelect, 'Country Selector (US vs AU)', 1000, '#00FFCC');
        }

        // Highlight Zip code input
        const zipInput = page.locator('input[name="postcode"]');
        if (await zipInput.count() > 0) {
          await highlightElement(zipInput, 'US ZIP Code Input', 800, '#00FFCC');
        }
      }

      // Highlight Checkout CTA
      const usCheckoutCta = page.locator('button.action.primary.checkout, [data-role="proceed-to-checkout"]').first();
      if (await usCheckoutCta.count() > 0) {
        await highlightElement(usCheckoutCta, 'Proceed to Checkout CTA', 1200, '#00FFCC');
      }
    }

    // Capture Full US Cart Page Screenshot
    const usFullCartScreenshot = path.join(US_SCREENSHOTS_DIR, '04_US_Populated_Cart_Full.png');
    await page.screenshot({ path: usFullCartScreenshot, fullPage: true });
    console.log(`[US] Saved: ${usFullCartScreenshot}`);


    // ── AU Baseline: Populated Cart Inspection ──
    const auPdpUrl = `${AU_URL}${ACTIVE_PRODUCT_PATH}`;
    console.log(`\n[AU] Navigating to Baseline PDP: ${auPdpUrl}`);
    await page.goto(auPdpUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    const auAddBtn = page.locator('#product-addtocart-button, button.tocart, button:has-text("Add to Cart")').first();
    if (await auAddBtn.count() > 0) {
      await clickWithHighlight(auAddBtn, 'AU Add to Cart Baseline', 1200);
      await page.waitForTimeout(4000);
    }

    console.log(`[AU] Navigating to Baseline Cart: ${AU_URL}/checkout/cart/`);
    await page.goto(`${AU_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    const auSummary = page.locator('.cart-summary, #cart-totals');
    if (await auSummary.count() > 0) {
      await highlightElement(auSummary, 'AU Baseline Order Summary', 1500, '#10B981');
    }

    const auFullCartScreenshot = path.join(AU_SCREENSHOTS_DIR, '04_AU_Populated_Cart_Full.png');
    await page.screenshot({ path: auFullCartScreenshot, fullPage: true });
    console.log(`[AU] Saved: ${auFullCartScreenshot}`);
  });


  test('04. Scope Leakage Scan on Cart Page', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 4: AUSTRALIAN SCOPE LEAKAGE AUDIT IN CART');
    console.log('======================================================');

    await page.goto(`${US_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    // 1. Scan for Australian domain links
    const auDomainLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href*=".com.au"]')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      }));
    });
    console.log(`[US Cart] AU Domain Links Found: ${auDomainLinks.length}`);
    auDomainLinks.forEach((l, i) => console.log(`   #${i + 1}: [${l.text}] -> ${l.href}`));

    // 2. Scan for Australian branding / Australian Owned in footer
    const auOwnedFooter = page.locator('text="AUSTRALIAN OWNED", img[alt*="AUSTRALIAN"], .footer:has-text("AUSTRALIAN")').first();
    if (await auOwnedFooter.count() > 0 && await auOwnedFooter.isVisible().catch(() => false)) {
      console.log('🚨 DEFECT FOUND: Australian Owned & Run badge rendered in US Cart footer!');
      await highlightElement(auOwnedFooter, 'DEFECT: "AUSTRALIAN OWNED & RUN" on US Cart', 2000, '#EF4444');
      await page.screenshot({ path: path.join(SECTIONS_DIR, 'DEFECT_Cart_Footer_AU_Owned_Badge.png') });
    }

    // 3. Scan page title
    const pageTitle = await page.title();
    console.log(`[US Cart] Page Title: "${pageTitle}"`);
    if (pageTitle.includes('Australia') || pageTitle.includes('GlobeWest Australia')) {
      console.log('🚨 DEFECT FOUND: Australian branding in US HTML title tag!');
    }
  });


  test('05. Mobile Cart Viewport Responsiveness (390x844)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 5: MOBILE CART VIEWPORT AUDIT (390x844)');
    console.log('======================================================');

    await page.setViewportSize({ width: 390, height: 844 });

    // US Mobile Cart
    console.log(`[US Mobile] Navigating to ${US_URL}/checkout/cart/ ...`);
    await page.goto(`${US_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const usMobileContainer = page.locator('.cart-container, .columns, .column.main');
    if (await usMobileContainer.count() > 0) {
      await highlightElement(usMobileContainer, 'US Mobile Cart Layout', 1200, '#00FFCC');
    }
    const usMobileScreenshot = path.join(US_SCREENSHOTS_DIR, '05_US_Cart_Mobile_390x844.png');
    await page.screenshot({ path: usMobileScreenshot, fullPage: true });
    console.log(`[US Mobile] Saved: ${usMobileScreenshot}`);

    // AU Mobile Cart Baseline
    console.log(`[AU Mobile] Navigating to ${AU_URL}/checkout/cart/ ...`);
    await page.goto(`${AU_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const auMobileContainer = page.locator('.cart-container, .columns, .column.main');
    if (await auMobileContainer.count() > 0) {
      await highlightElement(auMobileContainer, 'AU Baseline Mobile Cart Layout', 1200, '#10B981');
    }
    const auMobileScreenshot = path.join(AU_SCREENSHOTS_DIR, '05_AU_Cart_Mobile_390x844.png');
    await page.screenshot({ path: auMobileScreenshot, fullPage: true });
    console.log(`[AU Mobile] Saved: ${auMobileScreenshot}`);
  });

});
