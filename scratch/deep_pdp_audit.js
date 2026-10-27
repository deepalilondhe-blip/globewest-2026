const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/pdp_audit_results';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runPDPAudit() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const testProducts = [
    {
      name: 'Leon Side Table (Configurable/Color options)',
      url: 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue',
      auUrl: 'https://mcstaging2.globewest.com.au/catalogsearch/result/?q=leon+side+table'
    },
    {
      name: 'Tepih Cushion (Figma Baseline product)',
      url: 'https://mcstaging2.globewest.com/tepih-lane-cushion-sof-cape-1s-tsbk-sdcsl',
      auUrl: 'https://mcstaging2.globewest.com.au/catalogsearch/result/?q=tepih+lane'
    }
  ];

  // 1. GUEST DESKTOP & MOBILE AUDIT
  console.log('=== STEP 1: GUEST DESKTOP AUDIT ===');
  const guestContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const guestPage = await guestContext.newPage();
  
  await guestPage.goto(testProducts[0].url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await guestPage.waitForTimeout(3000);
  await guestPage.screenshot({ path: `${ARTIFACT_DIR}/01_us_guest_desktop.png`, fullPage: true });

  const guestDesktopDetails = await guestPage.evaluate(() => {
    return {
      title: document.title,
      h1: document.querySelector('h1')?.innerText?.trim(),
      breadcrumbs: Array.from(document.querySelectorAll('.breadcrumbs li, .breadcrumb li')).map(el => el.innerText.trim()),
      dimensionsBlock: document.querySelector('.swatch-attribute.dimensions, .swatch-attribute-dimensions, .product-info-dimensions')?.outerHTML,
      dimensionsComputed: (() => {
        const el = document.querySelector('.swatch-option.text, .swatch-attribute.dimensions .swatch-option, .dimensions .swatch-option');
        if (!el) return null;
        const style = window.getComputedStyle(el);
        return {
          border: style.border,
          borderRadius: style.borderRadius,
          padding: style.padding,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight
        };
      })(),
      colourLabel: document.querySelector('.swatch-attribute.color .swatch-attribute-label, .swatch-attribute.colour .swatch-attribute-label')?.innerText?.trim(),
      allPageLabels: Array.from(document.querySelectorAll('label, .swatch-attribute-label, h2, h3, h4, .title')).map(el => el.innerText.trim()),
      alternativeProducts: {
        heading: document.querySelector('.block.related .block-title, .block.upsell .block-title, .alternative-products-heading')?.innerText?.trim(),
        itemCount: document.querySelectorAll('.block.related .product-item, .block.upsell .product-item').length,
        viewButtons: Array.from(document.querySelectorAll('.block.related a.action, .block.upsell a.action, .block.related .tocart, .block.upsell .tocart')).map(el => ({
          text: el.innerText.trim(),
          computed: {
            position: window.getComputedStyle(el).position,
            alignSelf: window.getComputedStyle(el).alignSelf,
            fontSize: window.getComputedStyle(el).fontSize,
            fontWeight: window.getComputedStyle(el).fontWeight
          }
        }))
      },
      tabs: Array.from(document.querySelectorAll('.data.item.title a, .product.data.items .data.item.title')).map(el => el.innerText.trim()),
      metaDescription: document.querySelector('meta[name="description"]')?.content
    };
  });
  console.log('Guest Desktop Details:', JSON.stringify(guestDesktopDetails, null, 2));

  // GUEST MOBILE AUDIT
  console.log('=== STEP 2: GUEST MOBILE AUDIT (375x812) ===');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(testProducts[0].url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await mobilePage.waitForTimeout(3000);
  await mobilePage.screenshot({ path: `${ARTIFACT_DIR}/02_us_guest_mobile.png`, fullPage: true });

  // 2. TRADE AUTHENTICATED AUDIT
  console.log('=== STEP 3: US TRADE ACCOUNT LOGIN ===');
  const tradeContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const tradePage = await tradeContext.newPage();
  
  await tradePage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await tradePage.waitForTimeout(2000);
  
  await tradePage.fill('#email', 'deepali.londhe@overdose.digital');
  await tradePage.fill('#pass', 'Deep@123');
  await tradePage.click('#send2');
  await tradePage.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => console.log('Nav after login timed out or completed'));
  await tradePage.waitForTimeout(3000);

  console.log('Trade logged in URL:', tradePage.url());
  await tradePage.screenshot({ path: `${ARTIFACT_DIR}/03_us_trade_account_dashboard.png` });

  // Navigate to PDP as Trade
  console.log('=== STEP 4: US TRADE LOGGED IN PDP AUDIT ===');
  await tradePage.goto(testProducts[0].url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await tradePage.waitForTimeout(3000);
  await tradePage.screenshot({ path: `${ARTIFACT_DIR}/04_us_trade_desktop_pdp.png`, fullPage: true });

  const tradePdpDetails = await tradePage.evaluate(() => {
    return {
      pricingHeaderToggle: document.querySelector('.pricing-mode-toggle, .trade-pricing-switch, .price-toggle, .utility-trade-toggle')?.innerText?.trim() || 'NOT_FOUND',
      priceBoxText: document.querySelector('.price-box, .product-info-price')?.innerText?.trim(),
      hasAddToCart: !!document.querySelector('#product-addtocart-button, .action.tocart.primary'),
      addToCartText: document.querySelector('#product-addtocart-button, .action.tocart.primary')?.innerText?.trim(),
      hasAddToQuote: !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('quote')),
      addToQuoteText: Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('quote'))?.innerText?.trim(),
      hasSaveButton: !!Array.from(document.querySelectorAll('button, a, span')).find(el => el.innerText && el.innerText.toLowerCase().includes('save')),
      etaStockBox: document.querySelector('.stock.available, .availability, .eta-status, .inventory-status, .product-info-stock-sku')?.innerText?.trim(),
      downloadBrochure: !!Array.from(document.querySelectorAll('a, button')).find(el => el.innerText && el.innerText.toLowerCase().includes('brochure')),
      warrantyText: Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('structural warranty'))?.innerText?.trim(),
      warningBox: Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('P65Warnings'))?.innerText?.trim() || 'NOT_FOUND',
      alternativeProductsTitle: document.querySelector('.block.related .block-title, .block.upsell .block-title')?.innerText?.trim()
    };
  });
  console.log('Trade PDP Details:', JSON.stringify(tradePdpDetails, null, 2));

  // Also test mobile view for trade
  console.log('=== STEP 5: US TRADE MOBILE PDP AUDIT ===');
  const tradeMobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  const tradeMobilePage = await tradeMobileContext.newPage();
  // copy cookies from tradeContext
  const cookies = await tradeContext.cookies();
  await tradeMobileContext.addCookies(cookies);
  await tradeMobilePage.goto(testProducts[0].url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await tradeMobilePage.waitForTimeout(3000);
  await tradeMobilePage.screenshot({ path: `${ARTIFACT_DIR}/05_us_trade_mobile_pdp.png`, fullPage: true });

  // 3. AU BASELINE AUDIT
  console.log('=== STEP 6: AU BASELINE AUDIT ===');
  const auContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const auPage = await auContext.newPage();
  try {
    await auPage.goto('https://mcstaging2.globewest.com.au/leon-side-table-powder-blue-lto-leon-x-powder-blue', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await auPage.waitForTimeout(3000);
    await auPage.screenshot({ path: `${ARTIFACT_DIR}/06_au_baseline_desktop.png`, fullPage: true });
    const auTitle = await auPage.title();
    console.log('AU Page Title:', auTitle);
  } catch (e) {
    console.log('AU direct PDP nav failed, trying AU search or home:', e.message);
  }

  await browser.close();
  console.log('=== AUDIT COMPLETE ===');
}

runPDPAudit().catch(err => console.error('Fatal error in runPDPAudit:', err));
