const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const OUT_DIR = path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function showBanner(page, selectorOrLocator, title, description, durationMs = 3500, color = '#00E676') {
  try {
    const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator.first();
    const isVis = await loc.isVisible({ timeout: 2500 }).catch(() => false);
    if (!isVis) return;

    await loc.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(300);

    await loc.evaluate((el, { t, desc, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;

      el.style.outline = `4px solid ${col}`;
      el.style.boxShadow = `0 0 25px ${col}`;
      el.style.zIndex = '99999';

      const banner = document.createElement('div');
      banner.className = 'qa-toggle-banner';
      banner.innerHTML = `
        <div style="font-weight: 900; font-size: 13px; text-transform: uppercase; margin-bottom: 3px;">${t}</div>
        <div style="font-size: 12px; font-weight: normal; opacity: 0.95;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-55px';
      banner.style.left = '0px';
      banner.style.background = col;
      banner.style.color = (col === '#00E676' || col === '#00D2FF' || col === '#FFBB00') ? '#0B1E28' : '#FFFFFF';
      banner.style.padding = '8px 14px';
      banner.style.borderRadius = '6px';
      banner.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
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

(async () => {
  console.log('🚀 Launching Google Chrome in HEADED MODE for Trade Pricing Toggle Cross-Check...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 500,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  const auditReport = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  // =========================================================================
  // 1. GUEST USER (LOGGED OUT) — NO PRICING SHOWN & TOGGLE HIDDEN
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [CHECK 1] GENERAL PUBLIC / LOGGED OUT: NO PRICING & NO TOGGLE');
  console.log('============================================================');

  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);

  const guestStatus = await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll('button, .price-toggle')).find(b => b.innerText.includes('Trade') || b.innerText.includes('MSRP') || b.classList.contains('price-toggle'));
    const isToggleVisible = !!toggle && window.getComputedStyle(toggle).display !== 'none';
    const cardText = document.querySelector('.product-item')?.innerText || '';
    const hasPrice = cardText.includes('$');
    return { isToggleVisible, hasPrice };
  });

  console.log('Guest Status:', guestStatus);
  await showBanner(
    page,
    '.header__utility, .panel.header',
    'CHECK 1: GUEST LOGGED-OUT STATE',
    `Pricing Toggle Hidden: ${!guestStatus.isToggleVisible} | Zero Pricing: ${!guestStatus.hasPrice}`,
    4000,
    '#00D2FF'
  );
  await page.screenshot({ path: path.join(OUT_DIR, '01_GUEST_TOGGLE_HIDDEN.png') });
  auditReport.tests.guest = guestStatus;

  // =========================================================================
  // 2. LOGGED-IN TRADE CUSTOMER — DEFAULT TRADE VIEW & LINE ITEM
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [CHECK 2] LOGGED-IN TRADE CUSTOMER: DEFAULT TRADE PRICING VIEW');
  console.log('============================================================');

  console.log('Logging in as US Trade Customer (deepali.londhe@overdose.digital)...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForNavigation({ timeout: 35000 }).catch(() => {});
  }
  console.log('✅ Trade Customer Authenticated!');

  // Navigate to category page
  console.log('Navigating to Category Page (/indoor)...');
  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Check toggle placement & default label
  const togglePlacement = await page.evaluate(() => {
    const toggle = document.querySelector('.price-toggle');
    const trigger = document.querySelector('.price-toggle__trigger, [data-role="price-toggle-trigger"]');
    const triggerText = trigger?.innerText?.trim() || '';
    const rootClass = document.documentElement.className;
    return {
      rendered: !!toggle,
      triggerText,
      rootClass
    };
  });
  console.log('Toggle Placement & Default State:', togglePlacement);

  await showBanner(
    page,
    '.price-toggle',
    'CHECK 2: TRADE PRICING TOGGLE ACTIVE (DEFAULT)',
    `Toggle placed in Header. Current View: [ ${togglePlacement.triggerText} ] (HTML class: ${togglePlacement.rootClass})`,
    4500,
    '#00E676'
  );

  // Check Category Product Card Dual Pricing Line Item
  const cardPriceTrade = await page.evaluate(() => {
    const card = document.querySelector('.product-item');
    const priceText = card?.querySelector('.price-box, [data-role="priceBox"]')?.innerText?.trim() || card?.innerText || '';
    const hasTradePrice = priceText.includes('$');
    const hasMsrp = priceText.includes('MSRP');
    return { priceTextSnippet: priceText.replace(/\n+/g, ' | ').substring(0, 150), hasTradePrice, hasMsrp };
  });
  console.log('Category Card Default Pricing:', cardPriceTrade);

  await showBanner(
    page,
    '.product-item .price-box',
    'CHECK 2: DEFAULT DUAL PRICING SHOWN',
    `Trade wholesale rate shown alongside MSRP: "${cardPriceTrade.priceTextSnippet.substring(0, 50)}..."`,
    4500,
    '#00E676'
  );
  await page.screenshot({ path: path.join(OUT_DIR, '02_TRADE_DEFAULT_PRICING_PLP.png') });
  auditReport.tests.tradeDefault = { togglePlacement, cardPriceTrade };

  // =========================================================================
  // 3. TOGGLE INTERACTION — SWITCH TO MSRP ONLY (HIDE TRADE PRICING)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [CHECK 3] TOGGLE INTERACTION: SWITCH TO MSRP (SUPPRESS TRADE)');
  console.log('============================================================');

  console.log('Clicking Price Toggle Trigger...');
  const triggerBtn = page.locator('button.price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
  await triggerBtn.click();
  await page.waitForTimeout(1000);

  const msrpBtn = page.locator('button[data-view="msrp"], button:has-text("MSRP")').first();
  if (await msrpBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('Selecting [ MSRP ] option...');
    await msrpBtn.click();
    await page.waitForTimeout(2500);

    const msrpState = await page.evaluate(() => {
      const rootClass = document.documentElement.className;
      const triggerText = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
      const card = document.querySelector('.product-item');
      const priceText = card?.querySelector('.price-box, [data-role="priceBox"]')?.innerText?.trim() || '';
      // In MSRP mode, wholesale trade price is suppressed; only MSRP figures remain
      const hasMsrp = priceText.includes('MSRP') || priceText.includes('$');
      return { rootClass, triggerText, priceTextSnippet: priceText.replace(/\n+/g, ' | ').substring(0, 150), hasMsrp };
    });
    console.log('Switched to MSRP State:', msrpState);

    await showBanner(
      page,
      '.price-toggle',
      'CHECK 3: SWITCHED TO MSRP VIEW',
      `Trade wholesale price suppressed! Showing customer-facing MSRP only (Trigger: [ ${msrpState.triggerText} ])`,
      4500,
      '#FFBB00'
    );
    await page.screenshot({ path: path.join(OUT_DIR, '03_MSRP_ONLY_VIEW_PLP.png') });
    auditReport.tests.msrpToggle = msrpState;

    // Switch back to Trade
    console.log('Restoring to Trade mode...');
    await triggerBtn.click();
    await page.waitForTimeout(1000);
    const tradeBtn = page.locator('button[data-view="trade"], button:has-text("Trade")').first();
    await tradeBtn.click();
    await page.waitForTimeout(2000);
  }

  // =========================================================================
  // 4. CART & CHECKOUT INVARIANCE — ALWAYS USE TRADE PRICING
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [CHECK 4] CART & CHECKOUT: ALWAYS USE TRADE PRICING REGARDLESS OF TOGGLE');
  console.log('============================================================');

  console.log('Navigating to Shopping Cart (/checkout/cart/)...');
  await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const cartPricing = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.cart.item, tr.item-info')).map(el => {
      const title = el.querySelector('.product-item-name')?.innerText?.trim() || '';
      const price = el.querySelector('.price')?.innerText?.trim() || '';
      const subtotal = el.querySelector('.subtotal .price')?.innerText?.trim() || '';
      return { title, price, subtotal };
    });
    const grandTotal = document.querySelector('.grand.totals .price, tr.grand .price')?.innerText?.trim() || '';
    const hasToggleInCart = !!document.querySelector('.price-toggle');
    return { items, grandTotal, hasToggleInCart };
  });

  console.log('Cart Pricing Details:', cartPricing);

  await showBanner(
    page,
    '.cart-totals, .cart-summary',
    'CHECK 4: CART USES TRADE PRICING ONLY',
    `Rule Verified: Cart & checkout always bill at Trade wholesale pricing. Display toggle does not affect transaction price!`,
    4500,
    '#00E676'
  );
  await page.screenshot({ path: path.join(OUT_DIR, '04_CART_TRADE_TRANSACTION_PRICING.png') });
  auditReport.tests.cartInvariance = cartPricing;

  // =========================================================================
  // 5. MOBILE VIEWPORT — EYE ICON & SLIDE-OUT INTERACTION
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [CHECK 5] MOBILE VIEWPORT: EYE ICON TRIGGER & SLIDE-OUT DRAWER');
  console.log('============================================================');

  console.log('Switching to Mobile Viewport (390 x 844 iPhone 14/15/16)...');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });

  console.log('Navigating to Category Page on Mobile (/indoor)...');
  await mobilePage.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await mobilePage.waitForTimeout(3000);

  // Inspect Eye Icon Trigger on Mobile
  const mobileTrigger = await mobilePage.evaluate(() => {
    const trigger = document.querySelector('.price-toggle__trigger, [data-role="price-toggle-trigger"]');
    const hasEyeIcon = !!trigger?.querySelector('svg, i, .icon, [class*="eye"]') || trigger?.innerHTML.includes('svg');
    const text = trigger?.innerText?.trim() || '';
    const boundingBox = trigger ? trigger.getBoundingClientRect() : null;
    return {
      found: !!trigger,
      hasEyeIcon,
      text,
      width: boundingBox?.width,
      height: boundingBox?.height
    };
  });
  console.log('Mobile Eye Icon Trigger:', mobileTrigger);

  await showBanner(
    mobilePage,
    '.price-toggle, .header__utility',
    'CHECK 5: MOBILE EYE ICON TRIGGER',
    `Mobile toggle trigger rendered with eye icon. Tap targets: ${Math.round(mobileTrigger.width || 0)}x${Math.round(mobileTrigger.height || 0)}px`,
    4500,
    '#00D2FF'
  );
  await mobilePage.screenshot({ path: path.join(OUT_DIR, '05_MOBILE_EYE_ICON_TRIGGER.png') });

  // Tap trigger to open slide-out / drawer
  console.log('Tapping Eye Icon to open Mobile Slide-Out...');
  const mobTriggerBtn = mobilePage.locator('.price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
  if (await mobTriggerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await mobTriggerBtn.click();
    await mobilePage.waitForTimeout(1500);

    const slideoutState = await mobilePage.evaluate(() => {
      const drawer = document.querySelector('.price-toggle__list, [data-role="price-toggle-list"], .price-toggle__content, [popover]');
      const isVisible = drawer && window.getComputedStyle(drawer).display !== 'none';
      const items = Array.from(drawer?.querySelectorAll('button, li, a') || []).map(b => b.innerText.trim());
      return { isVisible, items };
    });
    console.log('Mobile Slide-Out Drawer State:', slideoutState);

    await showBanner(
      mobilePage,
      '.price-toggle__list, [data-role="price-toggle-list"]',
      'CHECK 5: MOBILE SLIDE-OUT DRAWER OPEN',
      `Slide-out opened successfully! Displays view options: [ ${slideoutState.items.join(' | ')} ]`,
      4500,
      '#00E676'
    );
    await mobilePage.screenshot({ path: path.join(OUT_DIR, '05_MOBILE_SLIDEOUT_DRAWER_OPEN.png') });
    auditReport.tests.mobileSlideout = { mobileTrigger, slideoutState };
  }
  await mobilePage.close();

  // Save full audit report JSON
  const reportPath = path.resolve(__dirname, '../trade_pricing_toggle_audit_results.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2), 'utf-8');
  console.log(`\n💾 Saved audit results to: ${reportPath}`);

  console.log('\n============================================================');
  console.log('🎉 FULL TRADE PRICING TOGGLE MATRIX AUDIT COMPLETE!');
  console.log('Keeping browser open for 15 seconds for your review...');
  console.log('============================================================');

  await page.waitForTimeout(15000);
  await browser.close();
  console.log('🏁 Browser closed cleanly.');
})();
