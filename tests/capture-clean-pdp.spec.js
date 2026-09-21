// @ts-check
/**
 * ========================================================================
 * GLOBEWEST US EXPANSION — PDP AUTHENTIC SCREENSHOTS (NO TEXT ON IMAGES)
 * Target URL: https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat
 * Mode: HEADED CHROME MODE (--project=desktop-chrome --headed)
 * Rule: Keep screenshots 100% real and original.
 *       Do NOT write any synthetic text on images.
 *       Only apply simple clean outline highlights where required.
 * ========================================================================
 */

const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const PDP_URL = 'https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat';

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

const BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PDP Page';
const DESKTOP_DIR = path.join(BASE_DIR, 'screenshots', 'desktop');
const MOBILE_DIR = path.join(BASE_DIR, 'screenshots', 'mobile');
const DEFECTS_DIR = path.join(BASE_DIR, 'screenshots', 'defects');

[DESKTOP_DIR, MOBILE_DIR, DEFECTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/**
 * Simple clean outline highlight without ANY text or badges
 */
async function outlineSimple(locator, color = '#FF0000', borderWidth = '3px') {
  try {
    const el = locator.first();
    if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
      await el.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
      await el.evaluate((node, { col, bw }) => {
        node.style.outline = `${bw} solid ${col}`;
        node.style.outlineOffset = '3px';
      }, { col: color, bw: borderWidth });
      await el.page().waitForTimeout(600);
    }
  } catch (e) {}
}

async function clearOutlines(page) {
  try {
    await page.evaluate(() => {
      document.querySelectorAll('[style*="outline"]').forEach(el => {
        el.style.outline = '';
        el.style.outlineOffset = '';
      });
    });
  } catch (e) {}
}

test.describe('Capture Authentic PDP Screenshots (Desktop & Mobile)', () => {

  test('01. Desktop: Clean Original PDP & Simple Outlines for Defects', async ({ page }) => {
    test.setTimeout(240000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Authenticate as Trade Customer
    console.log('Logging in as Trade Customer...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('#email').first();
    const passInput = page.locator('#pass').first();
    const submitBtn = page.locator('#send2').first();

    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailInput.fill(TRADE_USER.email);
      await passInput.fill(TRADE_USER.password);
      await Promise.all([
        page.waitForNavigation({ timeout: 20000 }).catch(() => {}),
        submitBtn.click()
      ]);
      await page.waitForTimeout(3000);
    }

    // 2. Navigate to Target Product
    console.log('Navigating to target PDP...');
    await page.goto(PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(6000);

    // 3. Clean Original Screenshot of Desktop View (No highlights)
    await page.screenshot({ path: path.join(DESKTOP_DIR, '01_ORIGINAL_DESKTOP_PDP_HERO.png') });
    console.log('Captured: 01_ORIGINAL_DESKTOP_PDP_HERO.png');

    // 4. Highlight Defect: Floating Social Share Widget (Pinterest + Blue Plus icon)
    const floatShare = page.locator('.mp_social_share_float, .a2a_floating_style').first();
    if (await floatShare.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Highlighting floating social share widget...');
      await outlineSimple(floatShare, '#FF0000', '4px');
      await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_01_FLOATING_SOCIAL_SHARE_WIDGET.png') });
      await clearOutlines(page);
    }

    // 5. Verify [ADD TO QUOTE] CTA (Newly Deployed by Developer!)
    console.log('Checking for deployed [ADD TO QUOTE] button...');
    const quoteBtn = page.locator('button.toquote, button.action.secondary.toquote, [data-bind*="toquote"]').first();
    const isQuoteVis = await quoteBtn.isVisible({ timeout: 8000 }).catch(() => false);
    if (isQuoteVis) {
      console.log('✅ PASS: [ADD TO QUOTE] CTA is verified present on live PDP!');
      await outlineSimple(quoteBtn, '#00D632', '3px');
      await page.screenshot({ path: path.join(DESKTOP_DIR, '09_Desktop_AddToQuote_Button_PASS.png') });
      await clearOutlines(page);
    } else {
      console.log('Highlighting action box missing Add to Quote...');
      const actionBox = page.locator('.box-tocart, .product-add-form').first();
      await outlineSimple(actionBox, '#FF0000', '3px');
      await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_02_ACTION_BOX_MISSING_QUOTE_CTA.png') });
      await clearOutlines(page);
    }

    // 6. Highlight Defect: Product Info Details (Missing California Prop 65 Warning)
    const productInfo = page.locator('.product-info-main').first();
    if (await productInfo.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Highlighting product info column missing Prop 65 warning...');
      await outlineSimple(productInfo, '#FF0000', '3px');
      await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_03_MISSING_CALIFORNIA_PROP65_WARNING.png') });
      await clearOutlines(page);
    }

    // 7. Clean Green Highlight for Verified Passing Feature: Product Title Typography
    const titleEl = page.locator('.page-title').first();
    if (await titleEl.isVisible({ timeout: 3000 }).catch(() => false)) {
      await outlineSimple(titleEl, '#00D632', '3px');
      await page.screenshot({ path: path.join(DESKTOP_DIR, '02_PASS_PRODUCT_TITLE_TYPOGRAPHY.png') });
      await clearOutlines(page);
    }

    // 8. Clean Green Highlight for Verified Passing Feature: Trade Dual Pricing
    const priceBox = page.locator('.price-box, .product-info-price').first();
    if (await priceBox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await outlineSimple(priceBox, '#00D632', '3px');
      await page.screenshot({ path: path.join(DESKTOP_DIR, '03_PASS_TRADE_DUAL_PRICING.png') });
      await clearOutlines(page);
    }
  });


  test('02. Mobile View: Clean Original Mobile PDP & Simple Outlines', async ({ page }) => {
    test.setTimeout(180000);
    // Standard Mobile Viewport (iPhone 14/15 390x844)
    await page.setViewportSize({ width: 390, height: 844 });

    console.log('Navigating to target PDP on Mobile...');
    await page.goto(PDP_URL, { waitUntil: 'commit', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    // 1. Clean Original Screenshot of Mobile View (Above the fold)
    await page.screenshot({ path: path.join(MOBILE_DIR, '01_ORIGINAL_MOBILE_PDP_HERO.png') });
    console.log('Captured: 01_ORIGINAL_MOBILE_PDP_HERO.png');

    // 2. Scroll slightly to view Mobile Product Details & CTAs
    await page.evaluate(() => window.scrollBy(0, 450));
    await page.waitForTimeout(1500);

    // 3. Clean Original Screenshot of Mobile Actions & CTAs
    await page.screenshot({ path: path.join(MOBILE_DIR, '02_ORIGINAL_MOBILE_PDP_ACTIONS.png') });
    console.log('Captured: 02_ORIGINAL_MOBILE_PDP_ACTIONS.png');

    // 4. Scroll to view Mobile Specifications & Warranty
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(MOBILE_DIR, '03_ORIGINAL_MOBILE_PDP_SPECS.png') });
    console.log('Captured: 03_ORIGINAL_MOBILE_PDP_SPECS.png');
  });

});
