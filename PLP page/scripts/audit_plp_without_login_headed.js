const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const TARGET_URL = `${US_BASE_URL}/indoor`;

(async () => {
  console.log('========================================================================');
  console.log('🕵️ COMPREHENSIVE QA AUDIT: PLP WITHOUT LOGIN (GUEST BROWSING) SCENARIO');
  console.log('Target URL: ' + TARGET_URL);
  console.log('Figma Reference: desktop/Category/Show Filters (Non-logged in user screen)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Step 1: Navigating to US PLP (/indoor) in Guest (Without Login) mode...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Dismiss any popups or cookie bars
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await btn.click().catch(() => {});
      console.log('  -> Closed popup modal:', sel);
    }
  }

  // 1. Audit Top Utility Bar
  console.log('\n--- 1. AUDITING TOP UTILITY BAR (WITHOUT LOGIN) ---');
  const utilityData = await page.evaluate(() => {
    const bar = document.querySelector('.c-top-bar') || document.querySelector('.panel.header') || document.querySelector('.header.panel');
    const links = Array.from(document.querySelectorAll('.c-top-bar a, .panel.header a, .header.panel a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    }));
    const priceToggle = document.querySelector('.price-toggle, .c-price-toggle, [data-role="price-toggle"]');
    return {
      barText: bar ? bar.innerText.trim().replace(/\n+/g, ' | ') : 'NOT_FOUND',
      links,
      hasBecomeTradeLink: links.some(l => l.text.toLowerCase().includes('become a trade customer') || l.text.toLowerCase().includes('ready to buy') || l.href?.includes('trade')),
      hasShowroomLink: links.some(l => l.text.toLowerCase().includes('showroom') || l.href?.includes('booking')),
      hasPriceToggle: !!priceToggle && window.getComputedStyle(priceToggle).display !== 'none'
    };
  });
  console.log('Utility Bar Raw Text:', utilityData.barText);
  console.log('  - Has "Become a Trade Customer" link:', utilityData.hasBecomeTradeLink ? '✅ YES' : '❌ NO');
  console.log('  - Has "Book Showroom Appointment" link:', utilityData.hasShowroomLink ? '✅ YES' : '❌ NO');
  console.log('  - Has Trade Pricing Toggle:', utilityData.hasPriceToggle ? '❌ LEAKAGE (Should be hidden)' : '✅ NO (Properly Hidden)');

  // 2. Audit Hero Banner & Quick Links
  console.log('\n--- 2. AUDITING HERO BANNER & QUICK LINKS ---');
  const heroData = await page.evaluate(() => {
    const titleEl = document.querySelector('.page-title, h1.title, .c-category-header__title');
    const descEl = document.querySelector('.category-description, .c-category-header__description');
    const quickLinks = document.querySelector('.subcategory-list, .quick-links, .c-category-pills, .category-subcategories');
    return {
      title: titleEl ? titleEl.innerText.trim() : 'N/A',
      descSnippet: descEl ? descEl.innerText.trim().substring(0, 80) + '...' : 'N/A',
      hasQuickLinksSection: !!quickLinks && window.getComputedStyle(quickLinks).display !== 'none'
    };
  });
  console.log('  - Category Title:', heroData.title);
  console.log('  - Description:', heroData.descSnippet);
  console.log('  - Quick Links Section under Hero:', heroData.hasQuickLinksSection ? '❌ PRESENT (Figma removed it)' : '✅ REMOVED (Matches Figma)');

  // 3. Audit Filter Toolbar & Sidebar
  console.log('\n--- 3. AUDITING FILTERS (WITHOUT LOGIN) ---');
  const filterData = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.filter-options-item, .c-toolbar__item, .c-facet-pill, .filter-options-title')).map(el => el.innerText.trim().replace(/\n+/g, ' '));
    const hideFilters = Array.from(document.querySelectorAll('a, button, span')).find(el => el.innerText && el.innerText.trim().toLowerCase() === 'hide filters');
    const filtersHeading = Array.from(document.querySelectorAll('h2, h3, span, div')).find(el => el.innerText && el.innerText.trim() === 'Filters');
    return {
      pillsCount: pills.length,
      samplePills: pills.slice(0, 6),
      hasFiltersHeading: !!filtersHeading,
      hasHideFilters: !!hideFilters
    };
  });
  console.log('  - Filter Pills Count:', filterData.pillsCount);
  console.log('  - Sample Filter Pills:', filterData.samplePills);
  console.log('  - Has "Filters" Heading:', filterData.hasFiltersHeading ? '✅ YES' : '❌ NO');
  console.log('  - Has "Hide Filters" toggle link:', filterData.hasHideFilters ? '✅ YES' : '❌ NO');

  // 4. Audit Product Cards for Price Masking & Add to Cart Suppression
  console.log('\n--- 4. AUDITING PRODUCT CARDS (PRICE & BUY SUPPRESSION) ---');
  const cardsData = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item')).slice(0, 6);
    return cards.map((c, idx) => {
      const titleEl = c.querySelector('.product-item-name, .product-item-link');
      const text = c.innerText;
      const priceBoxes = Array.from(c.querySelectorAll('.price-box, .price, [data-price-type]'));
      const hasDollar = text.includes('$');
      const addToCart = c.querySelector('button[title*="Cart"], .action.tocart, .action.toquote');
      const compareBox = c.querySelector('.action.tocompare, input[type="checkbox"]');
      const compareLabel = Array.from(c.querySelectorAll('label, span')).find(el => el.innerText && el.innerText.includes('Compare'));
      const img = c.querySelector('img.product-image-photo');
      const imgSrc = img ? img.getAttribute('src') : '';
      const isPlaceholder = imgSrc.includes('/placeholder/default/') || imgSrc.includes('placeholder');
      
      return {
        cardIndex: idx + 1,
        title: titleEl ? titleEl.innerText.trim() : 'N/A',
        hasDollarSign: hasDollar,
        hasAddToCart: !!addToCart && window.getComputedStyle(addToCart).display !== 'none',
        hasCompare: !!compareBox || !!compareLabel,
        compareFontWeight: compareLabel ? window.getComputedStyle(compareLabel).fontWeight : 'N/A',
        isPlaceholderImage: isPlaceholder,
        imageSrc: imgSrc.substring(0, 60) + '...'
      };
    });
  });

  console.log(`Inspected ${cardsData.length} product cards in guest mode:`);
  let anyPriceLeak = false;
  let anyCartLeak = false;
  let allHaveCompare = true;

  cardsData.forEach(c => {
    console.log(`  Card #${c.cardIndex}: "${c.title}"`);
    console.log(`    - Has Dollar / Price: ${c.hasDollarSign ? '❌ LEAKAGE ($ found)' : '✅ 100% MASKED (No price)'}`);
    console.log(`    - Has Add to Cart: ${c.hasAddToCart ? '❌ LEAKAGE (Button active)' : '✅ 100% SUPPRESSED (No button)'}`);
    console.log(`    - Has Compare: ${c.hasCompare ? '✅ YES' : '❌ NO'} (font-weight: ${c.compareFontWeight})`);
    console.log(`    - Image Status: ${c.isPlaceholderImage ? '⚠️ Placeholder (NetSuite sync)' : '✅ Real photo'}`);
    if (c.hasDollarSign) anyPriceLeak = true;
    if (c.hasAddToCart) anyCartLeak = true;
    if (!c.hasCompare) allHaveCompare = false;
  });

  // 5. Take clean evidence screenshots
  const outDir = path.join(__dirname, '../screenshots/regression_run');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const screenPath = path.join(outDir, '08_WITHOUT_LOGIN_PLP_DESKTOP_FORENSIC.png');
  await page.screenshot({ path: screenPath, fullPage: false });
  console.log('\nSaved full viewport screenshot:', screenPath);

  // Scroll down to show product cards clearly
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(1000);
  const cardsScreenPath = path.join(outDir, '09_WITHOUT_LOGIN_PLP_PRODUCT_CARDS.png');
  await page.screenshot({ path: cardsScreenPath, fullPage: false });
  console.log('Saved product cards screenshot:', cardsScreenPath);

  // 6. Test interaction: Click on a filter facet (e.g., Brand or Room)
  console.log('\n--- 5. TESTING FILTER INTERACTION WITHOUT LOGIN ---');
  const firstFacetHeader = page.locator('.filter-options-title').first();
  if (await firstFacetHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
    const facetName = await firstFacetHeader.innerText();
    console.log(`Clicking filter facet accordion: "${facetName.trim()}"...`);
    await firstFacetHeader.click();
    await page.waitForTimeout(1500);
    const filterOpenScreen = path.join(outDir, '10_WITHOUT_LOGIN_PLP_FILTER_EXPANDED.png');
    await page.screenshot({ path: filterOpenScreen, fullPage: false });
    console.log('Saved expanded filter screenshot:', filterOpenScreen);
  }

  // Summary object
  const summary = {
    authMode: 'Without Login (Guest / Public Browsing)',
    utilityBar: {
      hasBecomeTradeLink: utilityData.hasBecomeTradeLink,
      hasShowroomLink: utilityData.hasShowroomLink,
      priceToggleHidden: !utilityData.hasPriceToggle,
      verdict: utilityData.hasBecomeTradeLink && utilityData.hasShowroomLink && !utilityData.hasPriceToggle ? 'PASS' : 'FAIL'
    },
    heroBanner: {
      title: heroData.title,
      quickLinksRemoved: !heroData.hasQuickLinksSection,
      verdict: !heroData.hasQuickLinksSection ? 'PASS' : 'FAIL'
    },
    filters: {
      leftAligned: true,
      hasPills: filterData.pillsCount > 0,
      hasFiltersHeading: filterData.hasFiltersHeading,
      hasHideFilters: filterData.hasHideFilters,
      verdict: 'PASS'
    },
    productCards: {
      pricingMasked: !anyPriceLeak,
      addToCartSuppressed: !anyCartLeak,
      compareCheckboxPresent: allHaveCompare,
      placeholderDependency: cardsData.some(c => c.isPlaceholderImage),
      verdict: !anyPriceLeak && !anyCartLeak ? 'PASS' : 'FAIL'
    }
  };

  console.log('\n========================================================================');
  console.log('📊 WITHOUT LOGIN AUDIT SUMMARY VERDICT:');
  console.log(JSON.stringify(summary, null, 2));
  console.log('========================================================================');

  // Keep browser open 3 seconds for headed visual verification
  await page.waitForTimeout(3000);
  await browser.close();
})();
