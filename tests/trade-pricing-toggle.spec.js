// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const EVIDENCE_DIR = path.join(__dirname, '..', 'scratch', 'trade-pricing-toggle-evidence');

const USER_DATA = {
  firstName: 'Deepali',
  lastName: 'Londhe',
  email: 'deepalilondhe.qa@gmail.com',
  password: 'Deepa@123'
};

/** Helper: smooth scroll and highlight element with high-visibility banner */
async function highlight(page, locator, title, description, durationMs = 2500, color = '#2563EB') {
  try {
    const isVis = await locator.isVisible({ timeout: 2000 }).catch(() => false);
    if (!isVis) return;

    await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(300);

    await locator.evaluate((el, { t, desc, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;

      el.style.outline = `3px solid ${col}`;
      el.style.zIndex = '99999';

      const banner = document.createElement('div');
      banner.className = 'qa-toggle-banner';
      banner.innerHTML = `
        <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px;">${t}</div>
        <div style="font-size: 11px; opacity: 0.9;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-48px';
      banner.style.left = '0px';
      banner.style.background = col;
      banner.style.color = '#ffffff';
      banner.style.padding = '5px 10px';
      banner.style.borderRadius = '5px';
      banner.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
      banner.style.zIndex = '1000000';
      banner.style.pointerEvents = 'none';
      banner.style.whiteSpace = 'nowrap';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(banner);

      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.zIndex = prevZ;
        banner.remove();
      }, dur);
    }, { t: title, desc: description, dur: durationMs, col: color });

    await page.waitForTimeout(durationMs);
  } catch (e) {}
}

test.describe('Trade Pricing Toggle Verification (Developer Deployment Audit)', () => {

  test.beforeAll(() => {
    if (!fs.existsSync(EVIDENCE_DIR)) {
      fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    }
  });

  // --------------------------------------------------------------------------
  // SCENARIO 1: GENERAL PUBLIC / LOGGED OUT (NO PRICING SHOWN)
  // --------------------------------------------------------------------------
  test('Scenario 1: General Public / Logged Out — No Pricing Shown', async ({ page }) => {
    test.setTimeout(90000);
    console.log('\n============================================================');
    console.log('🌐 SCENARIO 1: LOGGED-OUT GUEST USER PRICING AUDIT');
    console.log('============================================================');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    // Dismiss popups
    for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
    }

    // 1. Verify Pricing Toggle is NOT visible for logged-out public
    const toggle = page.locator('.pricing-toggle, .price-view-switcher, [data-role="pricing-toggle"], select.price-toggle, .switcher.price-switcher').first();
    const isToggleVisible = await toggle.isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`1. Pricing Toggle visible for guest: ${isToggleVisible} (Expected: false)`);

    // 2. Verify Product Card Pricing is suppressed
    const firstCard = page.locator('.product-item').first();
    const priceBox = firstCard.locator('.price-box, .price-wrapper, [data-role="priceBox"]').first();
    const isPriceVisible = await priceBox.isVisible({ timeout: 1500 }).catch(() => false);
    const priceText = isPriceVisible ? (await priceBox.textContent()).trim() : '';

    console.log(`2. Product card price box visible: ${isPriceVisible}, text: "${priceText}"`);
    const isPriceMasked = !isPriceVisible || priceText === '' || priceText.includes('Trade Login') || priceText.includes('Unpriced');
    console.log(`   -> Price suppressed successfully: ${isPriceMasked}`);

    // 3. Highlight result
    if (isPriceMasked && !isToggleVisible) {
      await highlight(page, firstCard, '🟢 SCENARIO 1 PASS: Price Suppressed', 'Logged out guest cannot see wholesale price; toggle hidden', 2500, '#00E676');
    } else {
      await highlight(page, firstCard, '🔴 SCENARIO 1 DEFECT: Price Visible', `Price leaked or toggle visible: "${priceText}"`, 3000, '#FF0033');
    }

    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'SCENARIO_1_GUEST_PRICING.png') });
  });

  // --------------------------------------------------------------------------
  // SCENARIO 2: LOGGED-IN TRADE CUSTOMER (TRADE PRICING & TOGGLE TO RRP/MSRP)
  // --------------------------------------------------------------------------
  test('Scenario 2: Logged-in Trade Customer — Toggle Functionality & Dual View', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n============================================================');
    console.log('🔐 SCENARIO 2: LOGGED-IN TRADE CUSTOMER & PRICE TOGGLE');
    console.log('============================================================');

    await page.setViewportSize({ width: 1440, height: 900 });

    // Step A: Login
    console.log('Logging in as Trade Customer...');
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email, input[name="login[username]"]').first();
    const passField = page.locator('#pass, input[name="login[password]"]').first();
    const submitBtn = page.locator('#send2, button.action.login.primary').first();

    if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailField.fill(USER_DATA.email);
      await passField.fill(USER_DATA.password);
      await submitBtn.click();
      await page.waitForTimeout(4000);
    }

    const isLoggedIn = page.url().includes('/customer/account') && !page.url().includes('/login');
    console.log(`Login status: ${isLoggedIn ? '✅ Logged In' : '⚠️ Login pending'}`);

    // Step B: Navigate to Category
    console.log('Navigating to /indoor as logged-in customer...');
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    // Step C: Search for Pricing Toggle
    console.log('Auditing Price Toggle in Header / Top Bar / Toolbar...');
    const toggleCandidates = [
      'select.price-toggle',
      'select.pricing-toggle',
      '.price-view-switcher select',
      '[data-role="pricing-toggle"] select',
      '[data-role="pricing-toggle"]',
      '.pricing-toggle',
      '.price-toggle',
      '.switcher-pricing',
      '.header .switcher',
      '.panel.header .switcher',
      'button:has-text("Trade")',
      'button:has-text("MSRP")',
      'a:has-text("Trade")',
      'a:has-text("MSRP")',
      'select:has(option:has-text("Trade"))',
      'select:has(option:has-text("MSRP"))',
      'select:has(option:has-text("RRP"))'
    ];

    let foundToggle = null;
    let toggleSelectorUsed = '';

    for (const sel of toggleCandidates) {
      const loc = page.locator(sel).first();
      if (await loc.isVisible({ timeout: 800 }).catch(() => false)) {
        foundToggle = loc;
        toggleSelectorUsed = sel;
        console.log(`🎯 FOUND PRICING TOGGLE via selector: "${sel}"`);
        break;
      }
    }

    if (!foundToggle) {
      console.log('⚠️ Standard selectors not visible. Checking full DOM for toggle options ("Trade", "RRP", "MSRP")...');
      const toggleInfo = await page.evaluate(() => {
        const selects = Array.from(document.querySelectorAll('select'));
        const matching = selects.map(s => ({
          html: s.outerHTML.substring(0, 100),
          options: Array.from(s.options).map(o => o.text.trim())
        })).filter(s => s.options.some(opt => opt.includes('Trade') || opt.includes('MSRP') || opt.includes('RRP')));

        const allButtons = Array.from(document.querySelectorAll('button, a, div[class*="toggle"], div[class*="switch"]'))
          .filter(el => {
            const t = el.textContent.trim();
            return t === 'Trade' || t === 'MSRP' || t === 'RRP' || t.includes('Price:');
          })
          .map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim() }));

        return { matchingSelects: matching, matchingButtons: allButtons };
      });
      console.log('DOM Toggle Scan Result:', JSON.stringify(toggleInfo, null, 2));
    }

    // Step D: Inspect Product Card Pricing
    console.log('Auditing Product Card Pricing under logged-in state...');
    const firstCard = page.locator('.product-item').first();
    await firstCard.scrollIntoViewIfNeeded();

    const priceDetails = await firstCard.evaluate(card => {
      const priceBox = card.querySelector('.price-box, .price-wrapper, [data-role="priceBox"]');
      const allText = card.textContent;
      const details = card.querySelector('.product-item-details');
      return {
        hasPriceBox: !!priceBox,
        priceBoxText: priceBox ? priceBox.textContent.trim() : '',
        detailsText: details ? details.textContent.trim().replace(/\s+/g, ' ').substring(0, 150) : '',
        containsDollar: allText.includes('$'),
        containsMSRP: allText.includes('MSRP'),
        containsTrade: allText.includes('Trade')
      };
    });
    console.log('Product Card Price Info:', JSON.stringify(priceDetails, null, 2));

    // Step E: Highlight on Screen
    if (foundToggle) {
      await highlight(page, foundToggle, '🟢 TOGGLE FOUND', `Selector: ${toggleSelectorUsed}`, 3000, '#00E676');
    } else {
      const headerArea = page.locator('.header.panel, .page-header, .header-utility').first();
      await highlight(page, headerArea, '🔴 DEFECT: Pricing Toggle Not Rendered', 'Vinod deployed toggle, but element is missing in DOM for customer account', 3500, '#FF0033');
    }

    if (priceDetails.containsDollar) {
      await highlight(page, firstCard, '🟢 Price Displayed', `Found: "${priceDetails.priceBoxText}"`, 3000, '#00E676');
    } else {
      await highlight(page, firstCard, '🔴 DEFECT: Pricing Missing on Card', 'Logged in as Trade, but no price rendered on product card', 3500, '#FF0033');
    }

    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'SCENARIO_2_LOGGED_IN_TOGGLE.png') });
  });

  // --------------------------------------------------------------------------
  // SCENARIO 3: CART & CHECKOUT (ALWAYS REFLECTS TRADE PRICING)
  // --------------------------------------------------------------------------
  test('Scenario 3: Cart & Checkout — Verify Trade Pricing Persistence', async ({ page }) => {
    test.setTimeout(120000);
    console.log('\n============================================================');
    console.log('🛒 SCENARIO 3: CART PRICING PERSISTENCE AUDIT');
    console.log('============================================================');

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    const cartSummary = page.locator('.cart-summary, .cart.totals, #cart-totals').first();
    const isCartVisible = await cartSummary.isVisible({ timeout: 3000 }).catch(() => false);
    const cartText = isCartVisible ? await cartSummary.textContent() : '';

    console.log(`Cart Totals Visible: ${isCartVisible}`);
    if (isCartVisible) {
      console.log(`Cart Totals Text: ${cartText.replace(/\s+/g, ' ').trim().substring(0, 100)}`);
      await highlight(page, cartSummary, '🛒 Cart Totals', 'Inspecting cart pricing calculation', 2500, '#00D2FF');
    } else {
      console.log('Cart is empty or redirecting.');
    }

    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'SCENARIO_3_CART_PRICING.png') });
  });

});
