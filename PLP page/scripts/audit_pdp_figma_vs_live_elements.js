const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const LIVE_PDP_URL = 'https://mcstaging2.globewest.com/pearce-marble-2-drawer-bedside-matt-ocean-marble-bone-side-pearce-mar-2dr-matt-ocean-marble-bone';
const OUT_DIR = path.join(__dirname, '../screenshots/micro_ui_audit');

(async () => {
  console.log('🚀 Starting Deep Micro-UI Computed Styles Audit on LIVE PDP (mcstaging2)...');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. GUEST VISIT TO PDP
  console.log(`Navigating to ${LIVE_PDP_URL} (Guest Mode)...`);
  await page.goto(LIVE_PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const guestData = await page.evaluate(() => {
    const csOf = (el) => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        text: el.innerText ? el.innerText.trim() : (el.textContent ? el.textContent.trim() : ''),
        width: Math.round(r.width * 100) / 100,
        height: Math.round(r.height * 100) / 100,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        opacity: cs.opacity,
        backgroundColor: cs.backgroundColor,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        borderRadius: cs.borderRadius
      };
    };

    return {
      title: csOf(document.querySelector('h1.page-title, .product-info-main h1')),
      dimensionsSubtitle: csOf(document.querySelector('.product-dimensions, .product-subtitle, [class*="dimension"], .product-info-main .sku + div, .product-info-main p.dimensions')),
      sku: csOf(document.querySelector('.product.attribute.sku, .sku')),
      priceBox: csOf(document.querySelector('.price-box, .product-info-price, .price-wrapper')),
      addToCartBtn: csOf(document.querySelector('#product-addtocart-button, .action.primary.tocart')),
      addToQuoteBtn: csOf(document.querySelector('.action.addtoquote, [data-action="add-to-quote"]')),
      stockEta: csOf(document.querySelector('.stock, .availability, [class*="stock"], [class*="eta"]')),
      breadcrumbs: csOf(document.querySelector('.breadcrumbs'))
    };
  });

  console.log('Guest PDP Elements:', JSON.stringify(guestData, null, 2));

  // 2. LOG IN AS TRADE CUSTOMER TO INSPECT TRADE PRICING, MSRP, ADD TO CART, AND ETA
  console.log('Logging in as Trade Customer (deepali.londhe@overdose.digital)...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  await page.fill('input#email', 'deepali.londhe@overdose.digital');
  await page.fill('input#pass', 'Deep@123');
  await page.click('button#send2');
  await page.waitForTimeout(5000);

  // Return to PDP as Trade User
  console.log(`Navigating back to PDP as Trade User: ${LIVE_PDP_URL}...`);
  await page.goto(LIVE_PDP_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const tradeData = await page.evaluate(() => {
    const csOf = (el) => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        text: el.innerText ? el.innerText.trim() : (el.textContent ? el.textContent.trim() : ''),
        width: Math.round(r.width * 100) / 100,
        height: Math.round(r.height * 100) / 100,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        opacity: cs.opacity,
        backgroundColor: cs.backgroundColor,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        borderRadius: cs.borderRadius
      };
    };

    // Header pricing toggle
    const toggle = document.querySelector('.price-toggle, [data-role="price-toggle"]');
    const toggleLabel = document.querySelector('.price-toggle .toggle-label, .price-toggle span');

    // Title
    const title = document.querySelector('h1.page-title, .product-info-main h1');
    
    // Check all text nodes or elements around title for dimensions
    const allInfoParagraphs = Array.from(document.querySelectorAll('.product-info-main p, .product-info-main div')).filter(el => {
      const t = el.innerText || '';
      return t.toLowerCase().includes('dimension') || t.toLowerCase().includes('w450') || t.toLowerCase().includes('w') && t.includes('x');
    }).map(csOf);

    // Trade Price & MSRP Price
    const primaryPrice = document.querySelector('.price-wrapper .price, .special-price .price, .price-box .price');
    const msrpPrice = document.querySelector('.msrp-price, [data-label="MSRP"], .old-price .price');
    const fullPriceContainer = document.querySelector('.price-box, .product-info-price');

    // Buttons
    const addToCartBtn = document.querySelector('#product-addtocart-button, .action.primary.tocart');
    const addToQuoteBtn = document.querySelector('.action.addtoquote, [data-action="add-to-quote"]');

    // Stock & ETA
    const stockEta = document.querySelector('.stock, .availability, [class*="stock"], [class*="eta"]');

    return {
      headerToggle: csOf(toggle),
      toggleLabel: csOf(toggleLabel),
      title: csOf(title),
      dimensionsFound: allInfoParagraphs,
      primaryPrice: csOf(primaryPrice),
      msrpPrice: csOf(msrpPrice),
      fullPriceContainer: csOf(fullPriceContainer),
      addToCartBtn: csOf(addToCartBtn),
      addToQuoteBtn: csOf(addToQuoteBtn),
      stockEta: csOf(stockEta)
    };
  });

  console.log('\n📊 TRADE PDP DETAILED COMPUTED STYLES:');
  console.log(JSON.stringify(tradeData, null, 2));

  fs.writeFileSync(path.join(OUT_DIR, 'LIVE_PDP_TRADE_COMPUTED_STYLES.json'), JSON.stringify({ guest: guestData, trade: tradeData }, null, 2));

  // Take high-res screenshot of the right buy box panel
  const buyBox = page.locator('.product-info-main').first();
  if (await buyBox.isVisible()) {
    await buyBox.screenshot({ path: path.join(OUT_DIR, '03_LIVE_PDP_BUY_BOX_CLOSEUP.png') });
  }

  await page.screenshot({ path: path.join(OUT_DIR, '04_LIVE_PDP_FULL_PAGE.png') });
  console.log('Saved PDP screenshots to', OUT_DIR);

  await browser.close();
})();
