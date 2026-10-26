const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';
const AU_LIVE = 'https://www.globewest.com.au';

const OUT_DIR = path.resolve(__dirname, '../screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Launching Google Chrome in HEADED MODE for Public Browsing Field-by-Field Audit...');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  const auditResults = {
    timestamp: new Date().toISOString(),
    fields: {}
  };

  // =========================================================================
  // FIELD 1: HEADER & UTILITY BAR (US GUEST vs AU GUEST)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [FIELD 1] AUDITING HEADER & UTILITY BAR (US GUEST)');
  console.log('============================================================');

  await page.goto(`${US_BASE}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);

  const usHeader = await page.evaluate(() => {
    const text = document.querySelector('.panel.header, .header__utility, .page-header')?.innerText || '';
    const hasBecomeTrade = text.includes('Become a Trade Customer');
    const hasBookShowroom = text.includes('Book Showroom');
    const hasLogin = text.includes('Sign In') || text.includes('Login') || text.includes('Log In');
    const toggleBtn = Array.from(document.querySelectorAll('button, .price-toggle')).find(b => b.innerText.includes('Trade') || b.innerText.includes('MSRP') || b.classList.contains('price-toggle'));
    const hasPriceToggle = !!toggleBtn;
    return {
      utilityTextSnippet: text.replace(/\n+/g, ' | ').substring(0, 150),
      hasBecomeTrade,
      hasBookShowroom,
      hasLogin,
      hasPriceToggle
    };
  });
  console.log('US Header Inspection:', usHeader);
  await page.screenshot({ path: path.join(OUT_DIR, '01_US_HEADER_GUEST.png') });

  console.log('\n▶ [FIELD 1] AUDITING HEADER & UTILITY BAR (AU GUEST BASELINE)');
  const auPage = await context.newPage();
  await auPage.goto(`${AU_BASE}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(async () => {
    await auPage.goto(`${AU_LIVE}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  });
  await auPage.waitForTimeout(2500);

  const auHeader = await auPage.evaluate(() => {
    const text = document.querySelector('.panel.header, .header__utility, .page-header')?.innerText || '';
    const hasFindStockist = text.includes('Find a Stockist') || text.includes('Find stockist');
    const hasBookShowroom = text.includes('Book Showroom');
    return {
      utilityTextSnippet: text.replace(/\n+/g, ' | ').substring(0, 150),
      hasFindStockist,
      hasBookShowroom
    };
  });
  console.log('AU Header Inspection:', auHeader);
  await auPage.screenshot({ path: path.join(OUT_DIR, '01_AU_HEADER_GUEST.png') });
  await auPage.close();

  auditResults.fields.header = { us: usHeader, au: auHeader };

  // =========================================================================
  // FIELD 2: CATEGORY PLP GRID & PRICE MASKING (/indoor)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [FIELD 2] AUDITING CATEGORY PLP GRID & PRICE MASKING (US GUEST)');
  console.log('============================================================');

  // Scroll smoothly down through products
  await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  const usPlp = await page.evaluate(() => {
    // 1. Check hero banner copy for Australian leak
    const heroText = document.querySelector('.category-view, .category-hero, .category-description, .page-title-wrapper')?.innerText || '';
    const hasAuCopyLeak = heroText.toLowerCase().includes('australian home') || heroText.toLowerCase().includes('australia');

    // 2. Inspect first 8 product cards
    const cards = Array.from(document.querySelectorAll('.product-item, .product-item-info, .ss-item'));
    const inspectedCards = cards.slice(0, 8).map((c, i) => {
      const title = c.querySelector('.product-item-name, .product-item-link')?.innerText?.trim() || `Card ${i+1}`;
      const cardText = c.innerText;
      const hasDollar = cardText.includes('$');
      const hasAddToCart = !!Array.from(c.querySelectorAll('button, .action.tocart')).find(b => b.innerText.includes('Add to Cart') || b.classList.contains('tocart'));
      const imgSrc = c.querySelector('img')?.getAttribute('src') || '';
      const isPlaceholder = imgSrc.includes('/placeholder/default/') || imgSrc.includes('coming-soon') || cardText.includes('Coming Soon');

      return {
        index: i + 1,
        title,
        hasDollar,
        hasAddToCart,
        isPlaceholder,
        imgSrcSnippet: imgSrc.split('/').pop()
      };
    });

    const anyPriceLeak = inspectedCards.some(c => c.hasDollar);
    const anyCartLeak = inspectedCards.some(c => c.hasAddToCart);
    const anyPlaceholders = inspectedCards.some(c => c.isPlaceholder);

    return {
      cardCount: cards.length,
      hasAuCopyLeak,
      heroTextSnippet: heroText.substring(0, 120),
      anyPriceLeak,
      anyCartLeak,
      anyPlaceholders,
      inspectedCards
    };
  });

  console.log(`US PLP Product Count: ${usPlp.cardCount}`);
  console.log(`US PLP Price Leak Detected: ${usPlp.anyPriceLeak} (Must be false)`);
  console.log(`US PLP Add to Cart Leak Detected: ${usPlp.anyCartLeak} (Must be false)`);
  console.log(`US PLP AU Copy Leak Detected: ${usPlp.hasAuCopyLeak} ("${usPlp.heroTextSnippet}")`);
  console.log(`US PLP Placeholders Detected: ${usPlp.anyPlaceholders}`);

  await page.screenshot({ path: path.join(OUT_DIR, '02_US_PLP_GUEST_GRID.png') });
  auditResults.fields.plp = usPlp;

  // =========================================================================
  // FIELD 3: PRODUCT DETAIL PAGE (PDP) GUEST MASKING vs AU BASELINE
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [FIELD 3] AUDITING PDP GUEST MASKING (US GUEST)');
  console.log('============================================================');

  const testPdpSlug = 'base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo';
  await page.goto(`${US_BASE}/${testPdpSlug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const usPdp = await page.evaluate(() => {
    const title = document.querySelector('h1.page-title, .product-info-main h1')?.innerText?.trim();
    const priceEl = document.querySelector('.product-info-price, .price-box, [data-role="priceBox"]');
    const priceText = priceEl?.innerText || '';
    const hasDollar = priceText.includes('$');
    const addCartBtn = document.querySelector('#product-addtocart-button, .action.primary.tocart');
    const isAddCartVisible = addCartBtn && window.getComputedStyle(addCartBtn).display !== 'none';
    const hasSwatchesBtn = !!Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.includes('Swatches') || b.className.includes('swatch'));
    const hasTradeGuidance = document.body.innerText.includes('Trade Login') || document.body.innerText.includes('Become a Trade Customer');

    return {
      title,
      priceBoxRendered: !!priceEl,
      priceText: priceText.trim(),
      hasDollar,
      isAddCartVisible,
      hasSwatchesBtn,
      hasTradeGuidance
    };
  });

  console.log('US PDP Inspection:', usPdp);
  await page.screenshot({ path: path.join(OUT_DIR, '03_US_PDP_GUEST_MASKING.png') });

  // AU PDP Check
  console.log('\n▶ [FIELD 3] AUDITING PDP GUEST BASELINE (AU GUEST)');
  const auPdpPage = await context.newPage();
  await auPdpPage.goto(`${AU_BASE}/${testPdpSlug}`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(async () => {
    await auPdpPage.goto(`${AU_LIVE}/${testPdpSlug}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  });
  await auPdpPage.waitForTimeout(3000);

  const auPdp = await auPdpPage.evaluate(() => {
    const title = document.querySelector('h1.page-title, .product-info-main h1')?.innerText?.trim();
    const priceText = document.querySelector('.product-info-price, .price-box')?.innerText || '';
    const hasDollar = priceText.includes('$');
    const addCartBtn = document.querySelector('#product-addtocart-button, .action.primary.tocart');
    const isAddCartVisible = addCartBtn && window.getComputedStyle(addCartBtn).display !== 'none';
    return { title, priceText: priceText.trim(), hasDollar, isAddCartVisible };
  });

  console.log('AU PDP Baseline Inspection:', auPdp);
  await auPdpPage.screenshot({ path: path.join(OUT_DIR, '03_AU_PDP_GUEST_BASELINE.png') });
  await auPdpPage.close();

  auditResults.fields.pdp = { us: usPdp, au: auPdp };

  // =========================================================================
  // FIELD 4: SEARCHSPRING SEARCH FUNCTIONALITY (?q=chair)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [FIELD 4] AUDITING SEARCHSPRING CATALOG SEARCH (US GUEST)');
  console.log('============================================================');

  await page.goto(`${US_BASE}/catalogsearch/result/?q=chair`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const usSearch = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.product-item, .ss-item, .searchspring-item'));
    const bodyText = document.body.innerText;
    const hasZeroResultsNotice = bodyText.includes('0 items') || bodyText.includes('0 results') || bodyText.includes('We can\'t find products matching the selection');
    const hasProducts = items.length > 0;
    let priceLeak = false;

    if (hasProducts) {
      priceLeak = items.some(it => it.innerText.includes('$'));
    }

    return {
      itemCount: items.length,
      hasZeroResultsNotice,
      priceLeak
    };
  });

  console.log('US Search Results:', usSearch);
  await page.screenshot({ path: path.join(OUT_DIR, '04_US_SEARCHSPRING_CHAIR.png') });
  auditResults.fields.search = usSearch;

  // =========================================================================
  // FIELD 5: DIRECT CART ACCESS (/checkout/cart/)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [FIELD 5] AUDITING DIRECT CART ACCESS FOR GUEST');
  console.log('============================================================');

  await page.goto(`${US_BASE}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const usCart = await page.evaluate(() => {
    const currentUrl = window.location.href;
    const bodyText = document.body.innerText;
    const isCartEmpty = bodyText.includes('You have no items in your shopping cart') || bodyText.includes('Your cart is empty');
    const hasCheckoutBtn = !!Array.from(document.querySelectorAll('button, a, .action.primary.checkout')).find(b => b.innerText.includes('Checkout') || b.classList.contains('checkout'));
    return { currentUrl, isCartEmpty, hasCheckoutBtn };
  });

  console.log('US Guest Cart Access:', usCart);
  await page.screenshot({ path: path.join(OUT_DIR, '05_US_GUEST_CART.png') });
  auditResults.fields.cart = usCart;

  // =========================================================================
  // FIELD 6: AUTHENTICATED TRADE CUSTOMER TRANSFORMATION (DUAL-AUTH MATRIX)
  // =========================================================================
  console.log('\n============================================================');
  console.log('▶ [FIELD 6] AUDITING AUTHENTICATED TRADE CUSTOMER STATE (US TRADE)');
  console.log('============================================================');

  await page.goto(`${US_BASE}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('Logging in as US Trade Customer...');
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForNavigation({ timeout: 35000 }).catch(() => {});
  }

  // Navigate back to PLP (/indoor) under authenticated Trade session
  await page.goto(`${US_BASE}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const usTrade = await page.evaluate(() => {
    const toggle = Array.from(document.querySelectorAll('button, .price-toggle')).find(b => b.innerText.includes('Trade') || b.innerText.includes('MSRP') || b.classList.contains('price-toggle'));
    const isToggleRendered = !!toggle;
    const toggleText = toggle?.innerText || '';
    
    // Check first card for Trade Price
    const firstCard = document.querySelector('.product-item, .ss-item');
    const cardText = firstCard?.innerText || '';
    const hasTradePrice = cardText.includes('$');

    return {
      isToggleRendered,
      toggleText,
      hasTradePrice,
      firstCardSnippet: cardText.replace(/\n+/g, ' | ').substring(0, 140)
    };
  });

  console.log('US Trade Authenticated Transformation:', usTrade);
  await page.screenshot({ path: path.join(OUT_DIR, '06_US_TRADE_AUTHENTICATED_PLP.png') });
  auditResults.fields.tradeAuth = usTrade;

  // Save audit results JSON
  const jsonPath = path.resolve(__dirname, '../field_by_field_audit_results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(auditResults, null, 2), 'utf-8');
  console.log(`\n💾 Saved detailed audit results to: ${jsonPath}`);

  console.log('\n🎉 Headed Audit Complete! Keeping browser open for 15 seconds for your review...');
  await page.waitForTimeout(15000);

  await browser.close();
  console.log('🏁 Browser closed cleanly.');
})();
