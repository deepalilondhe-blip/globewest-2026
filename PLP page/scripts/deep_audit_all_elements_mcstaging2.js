const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Starting Deep Micro-UI Computed Styles Audit across ALL Elements on mcstaging2...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  const auditData = await page.evaluate(() => {
    const csOf = (el) => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        class: el.className,
        text: el.innerText ? el.innerText.trim() : (el.textContent ? el.textContent.trim() : ''),
        rect: { width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100, top: Math.round(r.top * 100) / 100, left: Math.round(r.left * 100) / 100 },
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

    // 1. Header elements
    const utilityBar = document.querySelector('.header.panel, .utility-bar, .header-utility');
    const becomeTradeLink = document.querySelector('a[href*="trade"], a:has-text("Become a Trade Customer"), a:has-text("Ready to Buy")');
    const showroomLink = document.querySelector('a[href*="booking"], a[href*="showroom"], a:has-text("Showroom")');
    const headerLogo = document.querySelector('.logo img, .logo');
    const searchInput = document.querySelector('input#search, input.input-text[name="q"]');

    // 2. Toolbar & Filters
    const categoryTitle = document.querySelector('.page-title-wrapper h1, h1.page-title');
    const showFiltersBtn = document.querySelector('button.action.filter, button:has-text("Show Filters"), .filter-toggle');
    const filterPills = Array.from(document.querySelectorAll('.filter-options-title, .filter-pill, .ss__facet__header')).slice(0, 4).map(csOf);
    const sorter = document.querySelector('.toolbar-sorter select, select.sorter-options');

    // 3. Product Card Elements (First Card)
    const card = document.querySelector('.product-item');
    const compareLink = card ? card.querySelector('.action.tocompare, .tocompare, .compare') : null;
    const compareText = card ? card.querySelector('.action.tocompare span, .compare span, label[for*="compare"]') : null;
    const wishlistHeart = card ? card.querySelector('.action.towishlist, .wishlist-heart, [class*="wishlist"]') : null;
    const photo = card ? card.querySelector('.product-item-photo, .product-image-container') : null;
    const photoImg = card ? card.querySelector('.product-image-photo, .product-item-photo img') : null;
    
    // Check for dimension subtitle (like W450 x H450mm)
    const subtitleOrDimensions = card ? card.querySelector('.product-item-description, .product-dimensions, .product-subtitle, .product-item-details [class*="dimension"], .product-item-details p') : null;
    
    const badges = card ? Array.from(card.querySelectorAll('.badge, [class*="badge"]')).map(csOf) : [];
    const title = card ? card.querySelector('.product-item-name, .product-item-link') : null;
    const priceBox = card ? card.querySelector('.price-box, .price-wrapper, .price') : null;
    const stockStatus = card ? card.querySelector('.stock, .availability, [class*="stock"], [class*="eta"]') : null;
    const swatches = card ? Array.from(card.querySelectorAll('.swatch-option')).slice(0, 3).map(csOf) : [];

    return {
      header: {
        utilityBar: csOf(utilityBar),
        becomeTradeLink: csOf(becomeTradeLink),
        showroomLink: csOf(showroomLink),
        headerLogo: csOf(headerLogo),
        searchInput: csOf(searchInput)
      },
      category: {
        categoryTitle: csOf(categoryTitle),
        showFiltersBtn: csOf(showFiltersBtn),
        filterPills,
        sorter: csOf(sorter)
      },
      productCard: {
        card: csOf(card),
        compareLink: csOf(compareLink),
        compareText: csOf(compareText),
        wishlistHeart: csOf(wishlistHeart),
        photo: csOf(photo),
        photoImg: csOf(photoImg),
        subtitleOrDimensions: csOf(subtitleOrDimensions),
        badges,
        title: csOf(title),
        priceBox: csOf(priceBox),
        stockStatus: csOf(stockStatus),
        swatches
      }
    };
  });

  const outDir = path.join(__dirname, '../screenshots/micro_ui_audit');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'EXHAUSTIVE_ALL_ELEMENTS_MCSTAGING2.json'), JSON.stringify(auditData, null, 2));
  console.log('Audit data written to EXHAUSTIVE_ALL_ELEMENTS_MCSTAGING2.json');

  await browser.close();
})();
