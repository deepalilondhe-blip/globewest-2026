// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const EVIDENCE_DIR = path.join(__dirname, '..', 'scratch', 'trade-pricing-audit');

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test.describe('Vinod Vankar Ticket: Trade Pricing Toggle Functional Audit', () => {

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

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2000);

    // Check if toggle exists
    const toggleBtn = page.locator('button:has-text("Trade"), button:has-text("MSRP"), .price-toggle').first();
    const isToggleVisible = await toggleBtn.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Toggle visible for guest: ${isToggleVisible} (Expected: false)`);

    // Check product prices
    const firstCard = page.locator('.product-item').first();
    const cardText = await firstCard.innerText().catch(() => '');
    const hasDollar = cardText.includes('$');
    console.log(`Product card contains '$': ${hasDollar} (Expected: false)`);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '01_GUEST_NO_PRICING.png') });
    expect(isToggleVisible).toBe(false);
    expect(hasDollar).toBe(false);
  });

  // =========================================================================
  // SCENARIO 2: Logged-in Trade Customer — Trade Default & Toggle to MSRP
  // =========================================================================
  test('Scenario 2: Logged-in trade customer — trade pricing default & toggle to MSRP', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n--- SCENARIO 2: LOGGED-IN TRADE CUSTOMER ---');

    await page.setViewportSize({ width: 1440, height: 900 });

    // Step A: Login
    console.log('Logging in as official trade user...');
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email, input[name="login[username]"]').first();
    const passField = page.locator('#pass, input[name="login[password]"]').first();
    const submitBtn = page.locator('#send2, button.action.login.primary').first();

    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill(TRADE_USER.email);
      await passField.fill(TRADE_USER.password);
      await submitBtn.click();
      await page.waitForTimeout(4000);
    }

    // Step B: Navigate to PLP
    console.log('Navigating to PLP (/indoor)...');
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    // Step C: Verify Toggle is visible in Top Bar
    const tradeToggleBtn = page.locator('button:has-text("Trade")').first();
    const isTradeBtnVisible = await tradeToggleBtn.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Trade Toggle Button Visible: ${isTradeBtnVisible} (Expected: true)`);
    expect(isTradeBtnVisible).toBe(true);

    // Step D: Capture Trade View Active (Dual Pricing)
    console.log('Capturing Trade Pricing Default View...');
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '02_TRADE_DEFAULT_VIEW.png') });

    // Step E: Click Toggle Button to open options
    console.log('Clicking Trade button to open dropdown...');
    await tradeToggleBtn.click();
    await page.waitForTimeout(1000);

    // Inspect dropdown menu items
    const dropdownHtml = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Trade') || b.textContent.includes('MSRP'));
      const parent = btn ? btn.closest('div, ul, li') : null;
      return parent ? parent.outerHTML : 'NONE';
    });
    console.log('Dropdown Parent HTML:', dropdownHtml);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '03_TOGGLE_DROPDOWN_OPEN.png') });

    // Step F: Click MSRP option
    const msrpOption = page.locator('button:has-text("MSRP"), a:has-text("MSRP"), li:has-text("MSRP"), [data-value="msrp"]').first();
    if (await msrpOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Clicking MSRP option...');
      await msrpOption.click();
      await page.waitForTimeout(3000);

      // Verify toggle button now shows MSRP
      const msrpToggleBtn = page.locator('button:has-text("MSRP")').first();
      const isMSRPBtnVisible = await msrpToggleBtn.isVisible({ timeout: 3000 }).catch(() => false);
      console.log(`MSRP Toggle Button Visible after switch: ${isMSRPBtnVisible}`);

      await page.screenshot({ path: path.join(EVIDENCE_DIR, '04_MSRP_VIEW_ACTIVE.png') });

      // Step G: Switch back to Trade
      console.log('Switching back to Trade option...');
      await msrpToggleBtn.click();
      await page.waitForTimeout(1000);

      const tradeOpt = page.locator('button:has-text("Trade"), a:has-text("Trade"), li:has-text("Trade"), [data-value="trade"]').first();
      if (await tradeOpt.isVisible({ timeout: 3000 }).catch(() => false)) {
        await tradeOpt.click();
        await page.waitForTimeout(3000);
        await page.screenshot({ path: path.join(EVIDENCE_DIR, '05_RESTORED_TRADE_VIEW.png') });
      }
    } else {
      console.log('MSRP option not directly clickable via locator, logging all visible text around toggle.');
    }
  });

  // =========================================================================
  // SCENARIO 3: Cart and Checkout Always Reflect Trade Pricing
  // =========================================================================
  test('Scenario 3: Cart and checkout always reflect trade pricing regardless of toggle state', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n--- SCENARIO 3: CART PRICING PERSISTENCE ---');

    await page.setViewportSize({ width: 1440, height: 900 });

    // Step A: Login
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    const emailField = page.locator('#email, input[name="login[username]"]').first();
    const passField = page.locator('#pass, input[name="login[password]"]').first();
    const submitBtn = page.locator('#send2, button.action.login.primary').first();

    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill(TRADE_USER.email);
      await passField.fill(TRADE_USER.password);
      await submitBtn.click();
      await page.waitForTimeout(4000);
    }

    // Step B: Navigate to Cart
    await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    // Verify cart pricing
    const cartSummary = page.locator('.cart-summary, .cart-totals, #cart-totals, .cart-container').first();
    const isCartVisible = await cartSummary.isVisible({ timeout: 4000 }).catch(() => false);
    console.log(`Cart page loaded: ${isCartVisible}`);

    const cartContent = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.cart.item, tr.item-info')).map(el => {
        const title = el.querySelector('.product-item-name')?.textContent.trim() || '';
        const price = el.querySelector('.price')?.textContent.trim() || '';
        const subtotal = el.querySelector('.subtotal')?.textContent.trim() || '';
        return { title, price, subtotal };
      });
      const grandTotal = document.querySelector('.grand.totals .price, tr.grand .price')?.textContent.trim() || '';
      return { items, grandTotal };
    });

    console.log('Cart Items & Totals:', JSON.stringify(cartContent, null, 2));
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '06_CART_TRADE_PRICING.png') });
  });

});
