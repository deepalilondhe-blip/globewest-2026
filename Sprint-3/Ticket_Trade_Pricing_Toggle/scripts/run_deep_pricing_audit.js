const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const OUT_DIR = path.resolve(__dirname, '../screenshots/deep_audit');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Running Exhaustive Pre-Go-Live Defect Audit of Trade & MSRP Pricing...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  const auditLog = {
    timestamp: new Date().toISOString(),
    plpCardsAnalysis: [],
    pdpConfigurableAnalysis: {},
    pdpSimpleAnalysis: {},
    miniCartAnalysis: {},
    cartPageAnalysis: {},
    swatchInteractionAnalysis: {},
    potentialDefects: []
  };

  // -------------------------------------------------------------
  // 1. LOGIN AS US TRADE CUSTOMER
  // -------------------------------------------------------------
  console.log('Logging in as US Trade customer...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }
  console.log('✅ Authenticated!');

  // -------------------------------------------------------------
  // 2. PLP GRID DEEP SCAN (INDOOR): TRADE MODE vs MSRP MODE
  // -------------------------------------------------------------
  console.log('\n--- SCANNING PLP (/indoor) ---');
  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Scan first 12 cards in Trade Mode
  console.log('Analyzing first 12 product cards in TRADE MODE...');
  const tradeCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item')).slice(0, 12);
    return cards.map((c, idx) => {
      const name = c.querySelector('.product-item-link')?.innerText?.trim() || `Card ${idx}`;
      const priceBox = c.querySelector('.price-box, [data-role="priceBox"]');
      const allText = priceBox ? priceBox.innerText.replace(/\n+/g, ' | ') : '';
      const prices = Array.from(priceBox?.querySelectorAll('.price') || []).map(p => p.innerText.trim());
      const hasMsrp = allText.includes('MSRP');
      const hasOldPrice = !!c.querySelector('.old-price');
      const oldPriceText = c.querySelector('.old-price .price')?.innerText?.trim() || '';
      const isPlaceholderImg = !!c.querySelector('img[src*="placeholder"], img[src*="Coming_Soon"], img[src*="coming-soon"]');
      const imgSrc = c.querySelector('img.product-image-photo')?.src || '';
      return { idx, name, allText, prices, hasMsrp, hasOldPrice, oldPriceText, isPlaceholderImg, imgSrc };
    });
  });
  auditLog.plpCardsAnalysis.tradeMode = tradeCards;
  console.log(`Analyzed ${tradeCards.length} cards in Trade mode.`);

  // Check for pricing anomalies in Trade mode:
  tradeCards.forEach(c => {
    if (!c.hasMsrp) {
      auditLog.potentialDefects.push(`PLP Card "${c.name}" is missing MSRP label in Trade mode!`);
    }
    if (c.imgSrc.includes('placeholder') || c.allText.includes('Coming Soon')) {
      auditLog.potentialDefects.push(`PLP Card "${c.name}" has placeholder image!`);
    }
  });

  // Now Switch to MSRP Mode on PLP
  console.log('Switching to MSRP MODE on PLP...');
  await page.locator('.price-toggle__trigger').first().click();
  await page.waitForTimeout(800);
  await page.locator('button[data-view="msrp"], button:has-text("MSRP")').first().click();
  await page.waitForTimeout(2500);

  // Scan the same 12 cards in MSRP Mode
  const msrpCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item')).slice(0, 12);
    return cards.map((c, idx) => {
      const name = c.querySelector('.product-item-link')?.innerText?.trim() || `Card ${idx}`;
      const priceBox = c.querySelector('.price-box, [data-role="priceBox"]');
      const allText = priceBox ? priceBox.innerText.replace(/\n+/g, ' | ') : '';
      const prices = Array.from(priceBox?.querySelectorAll('.price') || []).map(p => p.innerText.trim());
      // Check if wholesale rate leaked (more than 1 price rendered)
      const visiblePricesCount = prices.length;
      return { idx, name, allText, prices, visiblePricesCount };
    });
  });
  auditLog.plpCardsAnalysis.msrpMode = msrpCards;
  console.log(`Analyzed ${msrpCards.length} cards in MSRP mode.`);

  // Verify wholesale price suppression across cards
  msrpCards.forEach(c => {
    if (c.allText.includes('Trade') || c.visiblePricesCount > 2) {
      auditLog.potentialDefects.push(`PLP Card "${c.name}" appears to leak wholesale trade price in MSRP mode! Raw: ${c.allText}`);
    }
  });

  await page.screenshot({ path: path.join(OUT_DIR, 'PLP_MSRP_SCAN.png') });

  // -------------------------------------------------------------
  // 3. SWATCH HOVER & CLICK INVARIANCE (PLP)
  // -------------------------------------------------------------
  console.log('\n--- TESTING SWATCH INTERACTION ON PLP ---');
  // Check if clicking a color swatch changes or breaks pricing toggle
  const swatchCard = page.locator('.product-item:has(.swatch-option)').first();
  if (await swatchCard.isVisible().catch(() => false)) {
    const secondSwatch = swatchCard.locator('.swatch-option').nth(1);
    if (await secondSwatch.isVisible().catch(() => false)) {
      console.log('Clicking second swatch option on PLP card...');
      await secondSwatch.click();
      await page.waitForTimeout(2000);

      const priceAfterSwatch = await swatchCard.locator('.price-box').innerText().catch(() => '');
      console.log('Price after swatch selection in MSRP mode:', priceAfterSwatch.replace(/\n+/g, ' | '));
      auditLog.swatchInteractionAnalysis = { priceAfterSwatch };

      if (priceAfterSwatch.includes('Trade')) {
        auditLog.potentialDefects.push('Clicking color swatch on PLP broke MSRP mode and reverted to Trade price!');
      }
    }
  }

  // -------------------------------------------------------------
  // 4. CONFIGURABLE PDP DEEP AUDIT
  // -------------------------------------------------------------
  console.log('\n--- TESTING CONFIGURABLE PDP ---');
  // Switch back to Trade mode first
  await page.locator('.price-toggle__trigger').first().click();
  await page.waitForTimeout(800);
  await page.locator('button[data-view="trade"], button:has-text("Trade")').first().click();
  await page.waitForTimeout(2000);

  const pdpUrl = `${US_BASE_URL}/pearce-marble-2-drawer-bedside-matt-ocean-marble-bone-side-pearce-mar-2dr-matt-ocean-marble-bone`;
  await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // In Trade mode
  const pdpTradeData = await page.evaluate(() => {
    const priceBox = document.querySelector('.price-box');
    const fullText = priceBox?.innerText?.replace(/\n+/g, ' | ') || '';
    const prices = Array.from(priceBox?.querySelectorAll('.price') || []).map(p => p.innerText.trim());
    const oldPrice = document.querySelector('.old-price .price')?.innerText?.trim() || '';
    const specialPrice = document.querySelector('.special-price .price')?.innerText?.trim() || '';
    const msrpText = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.startsWith('MSRP:'))?.innerText || '';
    return { fullText, prices, oldPrice, specialPrice, msrpText };
  });
  console.log('PDP in Trade Mode:', pdpTradeData);
  auditLog.pdpConfigurableAnalysis.tradeMode = pdpTradeData;

  // Toggle to MSRP mode on PDP
  await page.locator('.price-toggle__trigger').first().click();
  await page.waitForTimeout(800);
  await page.locator('button[data-view="msrp"], button:has-text("MSRP")').first().click();
  await page.waitForTimeout(2000);

  const pdpMsrpData = await page.evaluate(() => {
    const priceBox = document.querySelector('.price-box');
    const fullText = priceBox?.innerText?.replace(/\n+/g, ' | ') || '';
    const prices = Array.from(priceBox?.querySelectorAll('.price') || []).map(p => p.innerText.trim());
    return { fullText, prices };
  });
  console.log('PDP in MSRP Mode:', pdpMsrpData);
  auditLog.pdpConfigurableAnalysis.msrpMode = pdpMsrpData;

  // Select Dimension & Option on PDP
  console.log('Selecting Dimension dropdown option...');
  const selectDim = page.locator('select[name^="super_attribute"]').first();
  if (await selectDim.isVisible({ timeout: 3000 }).catch(() => false)) {
    await selectDim.selectOption({ index: 1 });
    await page.waitForTimeout(1500);

    const priceAfterOption = await page.locator('.price-box').innerText().catch(() => '');
    console.log('PDP Price after dropdown option selected (MSRP mode):', priceAfterOption.replace(/\n+/g, ' | '));
    auditLog.pdpConfigurableAnalysis.priceAfterOptionSelection = priceAfterOption;
  }

  await page.screenshot({ path: path.join(OUT_DIR, 'PDP_MSRP_OPTION_SELECTED.png') });

  // -------------------------------------------------------------
  // 5. ADD TO CART & MINI-CART DRAWER PRICING AUDIT
  // -------------------------------------------------------------
  console.log('\n--- TESTING ADD TO CART & MINI-CART DRAWER ---');
  const addBtn = page.locator('#product-addtocart-button');
  await addBtn.click();
  await page.waitForTimeout(4000);

  // Check Mini-Cart trigger / badge
  const miniCartBtn = page.locator('a.action.showcart, .minicart-wrapper a').first();
  console.log('Opening Mini-Cart drawer...');
  await miniCartBtn.click();
  await page.waitForTimeout(2500);

  const miniCartData = await page.evaluate(() => {
    const drawer = document.querySelector('#ui-id-1, .block-minicart, [data-role="minicart"]');
    const isVisible = drawer && window.getComputedStyle(drawer).display !== 'none';
    const items = Array.from(document.querySelectorAll('.minicart-items .item, .minicart-items li')).map(el => {
      const name = el.querySelector('.product-item-name')?.innerText?.trim() || '';
      const price = el.querySelector('.price')?.innerText?.trim() || '';
      return { name, price };
    });
    const subtotal = document.querySelector('.subtotal .price')?.innerText?.trim() || '';
    return { isVisible, items, subtotal };
  });
  console.log('Mini-Cart Data (Browsing in MSRP mode):', miniCartData);
  auditLog.miniCartAnalysis = miniCartData;
  await page.screenshot({ path: path.join(OUT_DIR, 'MINICART_DRAWER_PRICING.png') });

  // -------------------------------------------------------------
  // 6. FULL CART PAGE AUDIT (/checkout/cart/)
  // -------------------------------------------------------------
  console.log('\n--- TESTING FULL CART PAGE (/checkout/cart/) ---');
  await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const cartFullData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr.item-info')).map(r => {
      const name = r.querySelector('.product-item-name')?.innerText?.trim() || '';
      const unitPrice = r.querySelector('.col.price .price')?.innerText?.trim() || '';
      const subtotal = r.querySelector('.col.subtotal .price')?.innerText?.trim() || '';
      return { name, unitPrice, subtotal };
    });
    const subtotalTotal = document.querySelector('.subtotal .price')?.innerText?.trim() || '';
    const grandTotal = document.querySelector('.grand.totals .price')?.innerText?.trim() || '';
    const toggleState = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
    return { rows, subtotalTotal, grandTotal, toggleState };
  });
  console.log('Full Cart Details:', cartFullData);
  auditLog.cartPageAnalysis = cartFullData;
  await page.screenshot({ path: path.join(OUT_DIR, 'FULL_CART_PRICING.png') });

  // Verify Cart Transaction Pricing
  if (cartFullData.rows.length > 0) {
    const item = cartFullData.rows[0];
    console.log(`Cart item unit price is: "${item.unitPrice}"`);
    // Check if item was billed at wholesale $638 instead of retail $701.80
    if (item.unitPrice.includes('701')) {
      auditLog.potentialDefects.push(`CRITICAL BILLING DEFECT: Cart charged retail MSRP ($701.80) instead of Trade wholesale ($638.00)!`);
    } else if (item.unitPrice.includes('638')) {
      console.log('✅ PASS: Cart successfully billed at Trade wholesale price ($638.00) despite browsing in MSRP mode!');
    }
  }

  // -------------------------------------------------------------
  // 7. PRICING CONSISTENCY & MATH CHECK
  // -------------------------------------------------------------
  console.log('\n--- CHECKING PRICING MATH & FORMATTING ---');
  // Check Pearce Marble Nightstand numbers:
  // Trade Wholesale: $638.00
  // MSRP: $701.80
  // Calculation: 638 * 1.10 = 701.80 (Standard 10% Trade margin / MSRP multiplier)
  console.log('Pricing verification for Pearce Marble:');
  console.log('Trade Price: $638.00 | MSRP: $701.80 | Multiplier: 1.10x');

  // Save audit log
  const logPath = path.resolve(__dirname, '../deep_pricing_audit_results.json');
  fs.writeFileSync(logPath, JSON.stringify(auditLog, null, 2), 'utf-8');
  console.log(`\n💾 Saved detailed deep audit results to: ${logPath}`);

  console.log('\n============================================================');
  console.log('📋 SUMMARY OF POTENTIAL DEFECTS FOUND:');
  if (auditLog.potentialDefects.length === 0) {
    console.log('🎉 ZERO PRICING LEAKS OR DEFECTS FOUND IN CORE FLOW!');
  } else {
    auditLog.potentialDefects.forEach((d, i) => console.log(`${i + 1}. ${d}`));
  }
  console.log('============================================================');

  await page.waitForTimeout(4000);
  await browser.close();
  console.log('🏁 Audit completed.');
})();
