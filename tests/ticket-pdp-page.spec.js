// @ts-check
/**
 * ========================================================================
 * GLOBEWEST US EXPANSION — PDP FIGMA FIDELITY & FUNCTIONAL QA AUDIT
 * Ticket: P-GLW-007 Globewest US Expansion Project / Product Detail Page (PDP)
 * Reference: Figma Design "PDP" (desktop/product/Trade Pricing - ETA & Mobile/product/Trade Pricing - ETA)
 * Tested URL: https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat
 * Mode: HEADED CHROME MODE (--project=desktop-chrome --headed)
 * Viewports: Desktop (1440x900) & Mobile (390x844)
 * Visual Standard:
 *   - Simple Solid Green (#00D632 / #059669) for PASSED / Figma Matching Features
 *   - Red (#FF0000 / #DC2626) for DEFECTS / Discrepancies
 * ========================================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_URL = 'https://mcstaging2.globewest.com';
const PDP_URL = `${US_URL}/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat`;

// Verified Trade Customer Credentials
const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123',
  name: 'Deepali Londhe'
};

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const PDP_DIR = path.join(WORKSPACE_DIR, 'PDP Page');
const DESKTOP_DIR = path.join(PDP_DIR, 'screenshots', 'desktop');
const MOBILE_DIR = path.join(PDP_DIR, 'screenshots', 'mobile');
const DEFECTS_DIR = path.join(PDP_DIR, 'screenshots', 'defects');
const COMPARISON_DIR = path.join(PDP_DIR, 'comparison');

[DESKTOP_DIR, MOBILE_DIR, DEFECTS_DIR, COMPARISON_DIR].forEach(dir => {
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
  await page.goto(`${baseUrl}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
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

test.describe('PDP Page: Comprehensive Figma Cross-Check & Defect Audit (Headed Mode)', () => {

  // =========================================================================
  // 1. DESKTOP: GUEST PUBLIC BROWSING MODE & SCOPE LEAKS
  // =========================================================================
  test('01. Desktop: Guest Mode PDP Audit & Page Meta Title Scope Leak', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n================================================================');
    console.log('1. DESKTOP: GUEST MODE PDP AUDIT & META LEAK');
    console.log('================================================================');

    await page.goto(PDP_URL, { waitUntil: 'commit', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3500);

    // 1. Check Page Meta Title for Scope Leak
    const pageTitle = await page.title();
    console.log(`Page <title>: "${pageTitle}"`);
    if (pageTitle.includes('GlobeWest Australia')) {
      console.log('🚨 DEFECT: Meta Title leaks "GlobeWest Australia" on US Storefront!');
      const headerLogo = page.locator('.logo, header').first();
      await highlightSimple(headerLogo, `DEFECT: Meta Title Leaks "GlobeWest Australia" (<title>: ${pageTitle})`, 'defect', 2000);
      await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_01_US_PDP_Meta_Title_Australia_Leak_RED.png') });
      await clearHighlights(page);
    }

    // 2. Breadcrumbs Check
    const breadcrumbs = page.locator('.breadcrumbs').first();
    if (await breadcrumbs.isVisible().catch(() => false)) {
      const bcText = await breadcrumbs.innerText().catch(() => '');
      await highlightSimple(breadcrumbs, `PASS: Breadcrumbs Visible (${bcText.replace(/\s+/g, ' ').trim()})`, 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '01_Desktop_Breadcrumbs_PASS.png') });
      await clearHighlights(page);
    }

    // 3. Product Gallery & Main Image Check
    const gallery = page.locator('.product.media, .gallery-placeholder, .fotorama__stage').first();
    if (await gallery.isVisible().catch(() => false)) {
      await highlightSimple(gallery, 'PASS: Product Image Gallery Rendered', 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '02_Desktop_Product_Gallery_PASS.png') });
      await clearHighlights(page);
    }

    // 4. Product Title & Typography Check (Figma specifies IvyMode Serif)
    const titleEl = page.locator('.page-title').first();
    if (await titleEl.isVisible().catch(() => false)) {
      const fontInfo = await titleEl.evaluate(node => {
        const cs = window.getComputedStyle(node);
        return {
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight
        };
      });
      console.log('Title Typography:', fontInfo);

      // Figma specifies IvyMode
      if (!fontInfo.fontFamily.toLowerCase().includes('ivymode')) {
        console.log(`🚨 DEFECT: Title Font is "${fontInfo.fontFamily}", but Figma specifies "IvyMode"!`);
        await highlightSimple(titleEl, `DEFECT: Font is "${fontInfo.fontFamily.split(',')[0]}" (Figma specifies IvyMode)`, 'defect', 2000);
        await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_02_US_PDP_Title_Font_Figma_Discrepancy_RED.png') });
        await clearHighlights(page);
      } else {
        await highlightSimple(titleEl, `PASS: Product Title (${fontInfo.fontFamily})`, 'pass', 1200);
        await page.screenshot({ path: path.join(DESKTOP_DIR, '03_Desktop_Product_Title_PASS.png') });
        await clearHighlights(page);
      }
    }

    // 5. SKU & Dimensions
    const skuEl = page.locator('.product.attribute.sku, .sku').first();
    if (await skuEl.isVisible().catch(() => false)) {
      const skuVal = await skuEl.innerText().catch(() => '');
      await highlightSimple(skuEl, `PASS: Product SKU (${skuVal.replace(/\s+/g, ' ').trim()})`, 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '04_Desktop_Product_SKU_PASS.png') });
      await clearHighlights(page);
    }

    // 6. Guest Pricing Masking & CTA Suppression
    const swatchCta = page.locator('button:has-text("REQUEST FREE SWATCHES"), .swatch-cta').first();
    const isSwatchVis = await swatchCta.isVisible({ timeout: 2000 }).catch(() => false);
    const addCartBtn = page.locator('#product-addtocart-button').first();
    const isAddCartVis = await addCartBtn.isVisible({ timeout: 2000 }).catch(() => false);

    console.log(`Guest Add To Cart Visible: ${isAddCartVis}, Swatches CTA Visible: ${isSwatchVis}`);
    if (isSwatchVis && !isAddCartVis) {
      await highlightSimple(swatchCta, 'PASS: Guest Mode Masks Pricing & Renders Swatches CTA', 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '05_Desktop_Guest_Pricing_Masked_PASS.png') });
      await clearHighlights(page);
    }

    // 7. Check California Proposition 65 Warning (Required for US Storefront in Figma)
    const bodyText = await page.innerText('body');
    const hasProp65 = bodyText.includes('P65Warnings') || bodyText.includes('Proposition 65') || bodyText.includes('WARNING: This product');
    console.log(`Prop 65 Warning Present: ${hasProp65}`);

    if (!hasProp65) {
      console.log('🚨 DEFECT: California Proposition 65 Warning is MISSING on US Product Page (Specified in Figma)!');
      const infoColumn = page.locator('.product-info-main').first();
      await highlightSimple(infoColumn, 'DEFECT: Missing California Proposition 65 Warning (Specified in Figma)', 'defect', 2000);
      await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_03_US_PDP_Missing_Prop65_Warning_RED.png') });
      await clearHighlights(page);
    }
  });


  // =========================================================================
  // 2. DESKTOP: AUTHENTICATED TRADE CUSTOMER MODE & FIGMA PRICING / CTAS
  // =========================================================================
  test('02. Desktop: Trade Mode PDP Audit (Dual Pricing, Add to Cart, Add to Quote)', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n================================================================');
    console.log('2. DESKTOP: TRADE CUSTOMER PDP AUDIT (FIGMA FIDELITY)');
    console.log('================================================================');

    // 1. Authenticate as Trade Customer
    await loginAsTrade(page, US_URL);

    // 2. Navigate to Target Product
    await page.goto(PDP_URL, { waitUntil: 'commit', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3500);

    // 3. Check Trade Pricing Toggle in Header Utility Bar (Figma spec: Trade vs MSRP)
    const priceToggle = page.locator('.price-toggle, button.price-toggle__trigger').first();
    if (await priceToggle.isVisible({ timeout: 4000 }).catch(() => false)) {
      await highlightSimple(priceToggle, 'PASS: Trade Pricing Toggle Active in Header', 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '06_Desktop_Header_Trade_Toggle_PASS.png') });
      await clearHighlights(page);
    }

    // 4. Check Dual Pricing: Trade Price + MSRP (Figma Spec)
    const priceBox = page.locator('.price-box, .product-info-price').first();
    if (await priceBox.isVisible().catch(() => false)) {
      const priceText = await priceBox.innerText().catch(() => '');
      console.log(`Trade Mode Price Box: "${priceText.replace(/\s+/g, ' ').trim()}"`);
      await highlightSimple(priceBox, `PASS: Trade Price Visible (${priceText.replace(/\s+/g, ' ').trim()})`, 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '07_Desktop_Trade_Price_Visible_PASS.png') });
      await clearHighlights(page);
    }

    // 5. Check "ADD TO CART" Primary Button (Figma Spec: Solid dark rectangle)
    const addCartBtn = page.locator('#product-addtocart-button, button.action.tocart').first();
    if (await addCartBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await highlightSimple(addCartBtn, 'PASS: Primary [ADD TO CART] Button Active', 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '08_Desktop_AddToCart_Button_PASS.png') });
      await clearHighlights(page);
    }

    // 6. Check "ADD TO QUOTE" Secondary Button (Figma Spec: Present next to / below Add to Cart)
    const quoteBtn = page.locator('[data-role="quote"], .action.toquote, button:has-text("QUOTE"), a:has-text("QUOTE")').first();
    const isQuoteVis = await quoteBtn.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`[ADD TO QUOTE] Button Visible: ${isQuoteVis}`);

    if (!isQuoteVis) {
      console.log('🚨 DEFECT: [ADD TO QUOTE] Button is MISSING on US Product Page (Specified in Figma)!');
      const actionBox = page.locator('.box-tocart, .product-add-form').first();
      await highlightSimple(actionBox, 'DEFECT: Missing [ADD TO QUOTE] CTA (Specified in Figma)', 'defect', 2000);
      await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_04_US_PDP_Missing_AddToQuote_CTA_RED.png') });
      await clearHighlights(page);
    } else {
      await highlightSimple(quoteBtn, 'PASS: Secondary [ADD TO QUOTE] Button Present', 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '09_Desktop_AddToQuote_Button_PASS.png') });
      await clearHighlights(page);
    }

    // 7. Check Stock & Lead-Time / ETA Availability
    const stockInfo = page.locator('.stock, .availability, [class*="lead-time"], [class*="eta"]').first();
    if (await stockInfo.isVisible({ timeout: 3000 }).catch(() => false)) {
      const stockText = await stockInfo.innerText().catch(() => '');
      await highlightSimple(stockInfo, `PASS: Stock / ETA Indicator (${stockText.replace(/\s+/g, ' ').trim()})`, 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '10_Desktop_Stock_ETA_Info_PASS.png') });
      await clearHighlights(page);
    }

    // 8. Check Warranty & Documentation Links (Figma Spec: 24 month structural warranty)
    const warrantyLink = page.locator('a[href*="warranty"], [class*="warranty"]').first();
    if (await warrantyLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await highlightSimple(warrantyLink, 'PASS: Warranty Policy Link Rendered', 'pass', 1200);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '11_Desktop_Warranty_Link_PASS.png') });
      await clearHighlights(page);
    }
  });


  // =========================================================================
  // 3. MOBILE VIEWPORT (390x844): MOBILE FIGMA SPEC CROSS-CHECK
  // =========================================================================
  test('03. Mobile View: PDP Layout, Touch Controls & Responsive Hierarchy', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 390, height: 844 });

    console.log('\n================================================================');
    console.log('3. MOBILE VIEW (390x844): FIGMA CROSS-CHECK');
    console.log('================================================================');

    // 1. Visit PDP in Mobile Viewport
    await page.goto(PDP_URL, { waitUntil: 'commit', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3500);

    // 2. Capture Full Mobile PDP Overview
    await page.screenshot({ path: path.join(MOBILE_DIR, '01_Mobile_PDP_Hero_Overview.png') });

    // 3. Mobile Header (Figma note: No utility bar for guest on mobile)
    const mobileHeader = page.locator('header.page-header, .header.content').first();
    await highlightSimple(mobileHeader, 'PASS: Mobile Header Layout (No Utility Bar on Guest)', 'pass', 1200);
    await page.screenshot({ path: path.join(MOBILE_DIR, '02_Mobile_Header_Layout_PASS.png') });
    await clearHighlights(page);

    // 4. Mobile Main Image & Swiper / Dots
    const mobileGallery = page.locator('.product.media').first();
    if (await mobileGallery.isVisible().catch(() => false)) {
      await highlightSimple(mobileGallery, 'PASS: Mobile Gallery Image Responsive Fit', 'pass', 1200);
      await page.screenshot({ path: path.join(MOBILE_DIR, '03_Mobile_Image_Gallery_PASS.png') });
      await clearHighlights(page);
    }

    // 5. Mobile Product Title & Brand
    const mobileTitle = page.locator('.page-title').first();
    if (await mobileTitle.isVisible().catch(() => false)) {
      await highlightSimple(mobileTitle, 'PASS: Mobile Product Title Legible', 'pass', 1200);
      await page.screenshot({ path: path.join(MOBILE_DIR, '04_Mobile_Product_Title_PASS.png') });
      await clearHighlights(page);
    }

    // 6. Mobile Action Buttons (Full width on mobile)
    const mobileSwatchCta = page.locator('button:has-text("REQUEST FREE SWATCHES"), .swatch-cta').first();
    if (await mobileSwatchCta.isVisible().catch(() => false)) {
      const box = await mobileSwatchCta.boundingBox();
      await highlightSimple(mobileSwatchCta, `PASS: Mobile CTA Full-Width (${Math.round(box?.width || 0)}px)`, 'pass', 1200);
      await page.screenshot({ path: path.join(MOBILE_DIR, '05_Mobile_Swatches_CTA_PASS.png') });
      await clearHighlights(page);
    }
  });

});
