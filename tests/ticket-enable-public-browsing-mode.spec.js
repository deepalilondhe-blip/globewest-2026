// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

/**
 * ============================================================================
 * SPRINT 1 TICKET: Enable Public Browsing Mode (US Storefront)
 * Related Ticket: RRP / Trade Price Toggle
 * 
 * Lead QA: Deepali Londhe (Senior QA Engineer - 5+ Years Experience)
 * Target: https://mcstaging2.globewest.com (US Storefront)
 * Baseline: https://mcstaging2.globewest.com.au (AU Storefront)
 * ============================================================================
 */

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const AU_BASE_URL = process.env.BASE_URL_AU || 'https://mcstaging2.globewest.com.au';
const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'evidence');

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

// Ensure evidence directory exists
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

/**
 * QA Visual Annotation Helper
 */
async function annotateElement(locator, label, borderColor = '#FF0055', durationMs = 1000) {
  try {
    const el = locator.first();
    if (await el.isVisible({ timeout: 2500 }).catch(() => false)) {
      await el.evaluate((node, { text, color }) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.style.outline = `3px solid ${color}`;
        node.style.outlineOffset = '2px';
        node.style.position = (window.getComputedStyle(node).position === 'static') ? 'relative' : node.style.position;

        let tag = node.querySelector('.qa-audit-tag');
        if (!tag) {
          tag = document.createElement('span');
          tag.className = 'qa-audit-tag';
          tag.textContent = text;
          tag.style.position = 'absolute';
          tag.style.top = '-28px';
          tag.style.left = '0';
          tag.style.zIndex = '999999';
          tag.style.backgroundColor = color;
          tag.style.color = '#FFFFFF';
          tag.style.fontSize = '12px';
          tag.style.fontWeight = 'bold';
          tag.style.fontFamily = 'monospace';
          tag.style.padding = '3px 8px';
          tag.style.borderRadius = '3px';
          tag.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
          tag.style.pointerEvents = 'none';
          node.appendChild(tag);
        }
      }, { text: label, color: borderColor });
      await el.page().waitForTimeout(durationMs);
    }
  } catch (err) {
    // Ignore non-fatal annotation failures
  }
}

test.describe('Sprint 1 Ticket: Enable Public Browsing Mode QA Verification', () => {

  // =========================================================================
  // TC-01: GUEST USER PLP - Zero Price Exposure & No Add to Cart
  // =========================================================================
  test('TC-01: US Category PLP (/indoor) - Verify Public Browsing Mode for Guests', async ({ page }) => {
    test.setTimeout(90000);
    console.log('\n--- [TC-01] US Category PLP: Guest Browsing Mode ---');

    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    expect(response?.status()).toBeLessThan(400);
    await page.waitForTimeout(3000);

    // 1. Verify Page URL does not redirect to login or restricted landing page
    const currentUrl = page.url();
    console.log(`Current URL loaded: ${currentUrl}`);
    expect(currentUrl).not.toContain('/customer/account/login');

    // 2. Verify Price Toggle is NOT displayed for guest
    const priceToggle = page.locator('.price-toggle, button:has-text("Trade"), button:has-text("MSRP")').first();
    const isToggleVisible = await priceToggle.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Price Toggle Visible to Guest: ${isToggleVisible} (Expected: false)`);
    expect(isToggleVisible).toBe(false);

    // 3. Inspect Product Grid Cards
    const productCards = page.locator('.product-item, .product-item-info, .ss-item');
    const cardCount = await productCards.count();
    console.log(`Found ${cardCount} product cards on PLP.`);
    expect(cardCount).toBeGreaterThan(0);

    // Inspect first 6 cards for any price leaks or Add to Cart buttons
    let priceLeakDetected = false;
    let addToCartDetected = false;

    for (let i = 0; i < Math.min(cardCount, 6); i++) {
      const card = productCards.nth(i);
      const cardText = await card.innerText();

      // Check for dollar sign
      if (cardText.includes('$')) {
        console.error(`[PRICE LEAK] Card #${i + 1} contains '$': ${cardText.substring(0, 80)}...`);
        priceLeakDetected = true;
        await annotateElement(card, 'DEFECT: PRICE VISIBLE TO GUEST', '#FF0055');
      }

      // Check for Add to Cart button
      const toCartBtn = card.locator('button[type="submit"]:has-text("Add to Cart"), .action.tocart, button:has-text("Add to Cart")');
      if (await toCartBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        console.error(`[CART LEAK] Card #${i + 1} has visible Add to Cart button!`);
        addToCartDetected = true;
        await annotateElement(toCartBtn, 'DEFECT: ADD TO CART VISIBLE TO GUEST', '#FF0055');
      }
    }

    // Annotate header utility bar
    const utilityBar = page.locator('.panel.header, .header__utility, .page-header').first();
    await annotateElement(utilityBar, 'PASS: PUBLIC BROWSING MODE ACTIVE (GUEST)', '#00CC66', 500);

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '01_US_PLP_GUEST_BROWSING.png'), fullPage: false });
    
    expect(priceLeakDetected).toBe(false);
    expect(addToCartDetected).toBe(false);
  });

  // =========================================================================
  // TC-02: GUEST USER PDP - Product Detail Page Masking & Trade CTA
  // =========================================================================
  test('TC-02: US PDP - Verify Product Details Accessible but Price/Cart Masked', async ({ page }) => {
    test.setTimeout(90000);
    console.log('\n--- [TC-02] US PDP: Guest Browsing Mode ---');

    await page.setViewportSize({ width: 1440, height: 900 });
    // Go to a known representative product
    const pdpUrl = `${US_BASE_URL}/base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo`;
    await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    // 1. Verify product details render (Title, Gallery, Specs)
    const productTitle = page.locator('h1.page-title, .product-info-main .page-title').first();
    const isTitleVisible = await productTitle.isVisible({ timeout: 5000 }).catch(() => false);
    const titleText = await productTitle.innerText().catch(() => '');
    console.log(`PDP Title: "${titleText}" (Visible: ${isTitleVisible})`);
    expect(isTitleVisible).toBe(true);

    // 2. Check Price Box on PDP
    const priceBox = page.locator('.product-info-price, .price-box, [data-role="priceBox"]').first();
    const isPriceBoxVisible = await priceBox.isVisible({ timeout: 2000 }).catch(() => false);
    let priceText = '';
    if (isPriceBoxVisible) {
      priceText = await priceBox.innerText({ timeout: 2000 }).catch(() => '');
    }
    const hasPrice = priceText.includes('$');
    console.log(`PDP Price Box Visible: ${isPriceBoxVisible} | Price Text: "${priceText.trim()}" (Contains '$': ${hasPrice})`);
    expect(hasPrice).toBe(false);

    // 3. Check Add to Cart button
    const addToCartBtn = page.locator('#product-addtocart-button, button.action.primary.tocart').first();
    const isAddToCartVisible = await addToCartBtn.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Add to Cart Button Visible on PDP: ${isAddToCartVisible} (Expected: false)`);
    expect(isAddToCartVisible).toBe(false);

    // 4. Verify Trade Prompt or CTAs
    const tradePrompt = page.locator('text="Become a Trade Customer", text="Log In", text="Trade", text="Showroom"').first();
    const isTradePromptVisible = await tradePrompt.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Trade Registration/Login Prompt Visible: ${isTradePromptVisible}`);

    await annotateElement(productTitle, 'PASS: PRODUCT BROWSING UNRESTRICTED', '#00CC66', 500);
    if (isPriceBoxVisible) {
      await annotateElement(priceBox, 'PASS: PRICE CONTAINER MASKED', '#00CC66', 500);
    }

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '02_US_PDP_GUEST_BROWSING.png'), fullPage: false });
  });

  // =========================================================================
  // TC-03: SEARCHSPRING INTEGRATION - Search Autocomplete & Results Grid
  // =========================================================================
  test('TC-03: SearchSpring - Verify Search Autocomplete & Results Grid as Guest', async ({ page }) => {
    test.setTimeout(90000);
    console.log('\n--- [TC-03] SearchSpring Autocomplete & Results: Guest Mode ---');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${US_BASE_URL}/catalogsearch/result/?q=chair`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    // Verify Search Results Page loaded
    const currentUrl = page.url();
    console.log(`Search URL: ${currentUrl}`);

    // Inspect search result items
    const searchItems = page.locator('.product-item, .ss-item, .searchspring-item');
    const searchCount = await searchItems.count();
    console.log(`Search Results Item Count: ${searchCount}`);

    let searchPriceLeak = false;
    let searchCartLeak = false;

    if (searchCount > 0) {
      for (let i = 0; i < Math.min(searchCount, 4); i++) {
        const item = searchItems.nth(i);
        const itemText = await item.innerText();

        if (itemText.includes('$')) {
          console.error(`[SEARCHSPRING LEAK] Search Card #${i + 1} contains '$': ${itemText.substring(0, 60)}...`);
          searchPriceLeak = true;
          await annotateElement(item, 'DEFECT: SEARCHSPRING EXPOSES PRICE TO GUEST', '#FF0055');
        }

        const cartBtn = item.locator('.action.tocart, button:has-text("Add to Cart")');
        if (await cartBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          console.error(`[SEARCHSPRING LEAK] Search Card #${i + 1} has visible Add to Cart!`);
          searchCartLeak = true;
          await annotateElement(cartBtn, 'DEFECT: SEARCHSPRING EXPOSES CART TO GUEST', '#FF0055');
        }
      }
    }

    await page.screenshot({ path: path.join(EVIDENCE_DIR, '03_US_SEARCHSPRING_GUEST.png'), fullPage: false });
    expect(searchPriceLeak).toBe(false);
    expect(searchCartLeak).toBe(false);
  });

  // =========================================================================
  // TC-04: AUSTRALIAN BASELINE SAFEGUARD - Regression Safeguard (AU Guest)
  // =========================================================================
  test('TC-04: AU Baseline (/indoor) - Verify Australian Storefront Remains Unrestricted', async ({ page }) => {
    test.setTimeout(90000);
    console.log('\n--- [TC-04] AU Storefront Regression Safeguard ---');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${AU_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    // AU guests MUST see retail prices
    const auCard = page.locator('.product-item').first();
    const auCardText = await auCard.innerText().catch(() => '');
    const auHasPrice = auCardText.includes('$');
    console.log(`AU Card 1 contains '$': ${auHasPrice} (Expected: true - AU is unrestricted)`);

    await annotateElement(auCard, 'AU BASELINE: PRICES VISIBLE & UNRESTRICTED', '#00CC66', 800);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '04_AU_PLP_GUEST_BASELINE.png'), fullPage: false });

    expect(auHasPrice).toBe(true);
  });

  // =========================================================================
  // TC-05: LOGGED-IN TRADE CUSTOMER - Trade Price & Toggle Active
  // =========================================================================
  test('TC-05: Authenticated Trade Mode - Trade Pricing Visible & Toggle Active', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n--- [TC-05] Authenticated Trade Customer Mode ---');

    await page.setViewportSize({ width: 1440, height: 900 });

    // Step A: Login
    console.log('Authenticating as official Trade customer...');
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('#email, input[name="login[username]"]').first();
    const passInput = page.locator('#pass, input[name="login[password]"]').first();
    const submitBtn = page.locator('#send2, button.action.login.primary').first();

    if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailInput.fill(TRADE_USER.email);
      await passInput.fill(TRADE_USER.password);
      await submitBtn.click();
      await page.waitForTimeout(4000);
    }

    // Step B: Navigate to Category
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Step C: Verify Trade Toggle is now visible
    const tradeToggle = page.locator('button:has-text("Trade"), .price-toggle').first();
    const isToggleVisible = await tradeToggle.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Trade Toggle Button Visible for Trade User: ${isToggleVisible} (Expected: true)`);
    expect(isToggleVisible).toBe(true);

    // Step D: Verify Product Card displays Trade Price
    const firstTradeCard = page.locator('.product-item').first();
    const tradeCardText = await firstTradeCard.innerText().catch(() => '');
    const tradeCardHasDollar = tradeCardText.includes('$');
    console.log(`Trade Card contains '$': ${tradeCardHasDollar} (Expected: true)`);
    expect(tradeCardHasDollar).toBe(true);

    await annotateElement(tradeToggle, 'PASS: TRADE PRICING TOGGLE ACTIVE', '#00CC66', 800);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '05_US_TRADE_USER_LOGGED_IN.png'), fullPage: false });
  });

});
