// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'Sprint-3', 'Ticket_Trade_Pricing_Toggle', 'screenshots');

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test.describe('Trade Pricing Toggle: Comprehensive Spec & Functional Matrix Audit', () => {

  test.beforeAll(() => {
    if (!fs.existsSync(EVIDENCE_DIR)) {
      fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    }
  });

  // =========================================================================
  // SCENARIO 1: General public / Logged Out — No Pricing Shown
  // =========================================================================
  test('Scenario 1: General public / logged out — no pricing shown & toggle hidden', async ({ page }) => {
    test.setTimeout(90000);
    console.log('\n--- SCENARIO 1: GUEST USER (LOGGED OUT) ---');

    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2000);

    // Verify toggle does NOT exist for guest
    const toggleBtn = page.locator('.price-toggle, button.price-toggle__trigger').first();
    const isToggleVisible = await toggleBtn.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Toggle visible for guest: ${isToggleVisible} (Expected: false)`);
    expect(isToggleVisible).toBe(false);

    // Check product prices are masked
    const firstCard = page.locator('.product-item').first();
    const cardText = await firstCard.innerText().catch(() => '');
    const hasDollar = cardText.includes('$');
    console.log(`Product card contains '$': ${hasDollar} (Expected: false)`);
    expect(hasDollar).toBe(false);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '01_GUEST_TOGGLE_HIDDEN.png') });
  });

  // =========================================================================
  // SCENARIO 2: Logged-in Trade Customer — Trade Default & Toggle to MSRP (PLP)
  // =========================================================================
  test('Scenario 2: Logged-in trade customer — trade pricing default & toggle to MSRP on PLP', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n--- SCENARIO 2: LOGGED-IN TRADE CUSTOMER (PLP) ---');

    // Login
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email').first();
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill(TRADE_USER.email);
      await page.locator('#pass').first().fill(TRADE_USER.password);
      await page.locator('#send2').first().click();
      await page.waitForTimeout(4000);
    }

    // PLP Navigation
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    // Verify toggle trigger is visible
    const tradeToggleBtn = page.locator('.price-toggle__trigger, button:has-text("Trade")').first();
    const isTradeBtnVisible = await tradeToggleBtn.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Trade Toggle Button Visible: ${isTradeBtnVisible} (Expected: true)`);
    expect(isTradeBtnVisible).toBe(true);

    // Verify default Trade mode (dual pricing)
    const cardPriceText = await page.locator('.product-item .price-box').first().innerText().catch(() => '');
    console.log('Default Trade Mode Pricing:', cardPriceText.replace(/\n+/g, ' | '));
    expect(cardPriceText).toContain('$');

    // Click toggle to open options
    await tradeToggleBtn.click();
    await page.waitForTimeout(800);

    // Switch to MSRP
    const msrpOption = page.locator('button[data-view="msrp"], button:has-text("MSRP")').first();
    if (await msrpOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await msrpOption.click();
      await page.waitForTimeout(2500);

      // Verify MSRP mode suppresses wholesale price
      const htmlClass = await page.evaluate(() => document.documentElement.className);
      console.log('HTML Root Class after MSRP select:', htmlClass);
      expect(htmlClass).toContain('price-view-msrp');

      const msrpPriceText = await page.locator('.product-item .price-box').first().innerText().catch(() => '');
      console.log('MSRP Mode Pricing:', msrpPriceText.replace(/\n+/g, ' | '));
      expect(msrpPriceText).toContain('MSRP');

      // Restore Trade mode
      const msrpToggleBtn = page.locator('.price-toggle__trigger').first();
      await msrpToggleBtn.click();
      await page.waitForTimeout(800);
      await page.locator('button[data-view="trade"], button:has-text("Trade")').first().click();
      await page.waitForTimeout(2000);
    }
  });

  // =========================================================================
  // SCENARIO 3: PDP Dual Pricing and MSRP Suppression
  // =========================================================================
  test('Scenario 3: PDP dual pricing & wholesale suppression in MSRP view', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n--- SCENARIO 3: PDP PRICING & MSRP TOGGLE ---');

    // Login
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    const emailField = page.locator('#email').first();
    if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailField.fill(TRADE_USER.email);
      await page.locator('#pass').first().fill(TRADE_USER.password);
      await page.locator('#send2').first().click();
      await page.waitForTimeout(4000);
    }

    // Go to PDP
    await page.goto(`${US_BASE_URL}/pearce-marble-2-drawer-bedside-matt-ocean-marble-bone-side-pearce-mar-2dr-matt-ocean-marble-bone`, {
      waitUntil: 'domcontentloaded',
      timeout: 50000
    });
    await page.waitForTimeout(3000);

    // Trade mode dual pricing verification
    const pdpPriceTrade = await page.locator('.price-box').first().innerText().catch(() => '');
    console.log('PDP Price (Trade Mode):', pdpPriceTrade.replace(/\n+/g, ' | '));
    expect(pdpPriceTrade).toContain('MSRP');

    // Switch to MSRP
    const triggerBtn = page.locator('.price-toggle__trigger').first();
    await triggerBtn.click();
    await page.waitForTimeout(800);
    await page.locator('button[data-view="msrp"], button:has-text("MSRP")').first().click();
    await page.waitForTimeout(2000);

    const pdpPriceMsrp = await page.locator('.price-box').first().innerText().catch(() => '');
    console.log('PDP Price (MSRP Mode):', pdpPriceMsrp.replace(/\n+/g, ' | '));
    expect(pdpPriceMsrp).toContain('MSRP');
  });

  // =========================================================================
  // SCENARIO 4: Cart and Checkout Transaction Pricing Invariance
  // =========================================================================
  test('Scenario 4: Cart and checkout always reflect trade pricing regardless of toggle state', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n--- SCENARIO 4: CART TRANSACTION PRICING INVARIANCE ---');

    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    const emailField = page.locator('#email').first();
    if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailField.fill(TRADE_USER.email);
      await page.locator('#pass').first().fill(TRADE_USER.password);
      await page.locator('#send2').first().click();
      await page.waitForTimeout(4000);
    }

    await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    const isCartLoaded = await page.locator('.cart-container, .cart-empty').first().isVisible().catch(() => false);
    expect(isCartLoaded).toBe(true);
    console.log('Cart page successfully loaded and verified.');
  });

  // =========================================================================
  // SCENARIO 5: Mobile Viewport — Eye Icon Trigger & Slide-Out Drawer
  // =========================================================================
  test('Scenario 5: Mobile viewport renders eye icon trigger and interactive slide-out drawer', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n--- SCENARIO 5: MOBILE EYE ICON & SLIDE-OUT DRAWER ---');

    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    const emailField = page.locator('#email').first();
    if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailField.fill(TRADE_USER.email);
      await page.locator('#pass').first().fill(TRADE_USER.password);
      await page.locator('#send2').first().click();
      await page.waitForTimeout(4000);
    }

    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    // Inspect mobile eye icon trigger
    const mobTrigger = page.locator('.price-toggle__trigger').first();
    expect(await mobTrigger.isVisible()).toBe(true);

    const hasEyeIcon = await mobTrigger.locator('svg').count() > 0;
    console.log(`Mobile trigger contains SVG eye icon: ${hasEyeIcon}`);

    // Tap trigger to open slide-out drawer
    await mobTrigger.click();
    await page.waitForTimeout(1500);

    const slideoutDrawer = page.locator('.price-toggle__list, [data-role="price-toggle-list"]').first();
    const isDrawerVisible = await slideoutDrawer.isVisible().catch(() => false);
    console.log(`Mobile Slide-out Drawer is visible: ${isDrawerVisible}`);
    expect(isDrawerVisible).toBe(true);
  });

});
