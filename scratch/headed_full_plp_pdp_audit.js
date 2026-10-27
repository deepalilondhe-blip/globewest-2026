const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/full_audit_results';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function showBanner(page, title, subtitle, bgColor = '#0F172A', duration = 2500) {
  await page.evaluate(({ title, subtitle, bgColor }) => {
    let el = document.getElementById('gw-qa-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gw-qa-banner';
      el.style.position = 'fixed';
      el.style.top = '15px';
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.zIndex = '999999999';
      el.style.padding = '12px 28px';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      el.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      el.style.textAlign = 'center';
      el.style.pointerEvents = 'none';
      el.style.transition = 'all 0.3s ease';
      document.body.appendChild(el);
    }
    el.style.background = bgColor;
    el.innerHTML = `<div style="color:#FFF; font-size:16px; font-weight:bold; margin-bottom:4px;">${title}</div>
                    <div style="color:rgba(255,255,255,0.85); font-size:13px;">${subtitle}</div>`;
  }, { title, subtitle, bgColor });

  if (duration > 0) {
    await page.waitForTimeout(duration);
  }
}

(async () => {
  console.log('🚀 Starting Comprehensive PLP & PDP Dual-Auth Headed Audit...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 450,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const report = {
    timestamp: new Date().toISOString(),
    plpTrade: {},
    plpGuest: {},
    pdpTrade: {},
    pdpGuest: {}
  };

  // =========================================================================
  // SECTION 1: PLP WITH LOGGED-IN TRADE ACCOUNT (/indoor)
  // =========================================================================
  console.log('\n=============================================================');
  console.log('PART 1: PLP WITH LOGGED-IN TRADE ACCOUNT (HEADED MODE)');
  console.log('=============================================================');

  const tradeContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const tradePage = await tradeContext.newPage();

  // 1. Login as Trade Customer
  console.log('Logging in as Trade Customer...');
  await tradePage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await showBanner(tradePage, 'Step 1: Logging in as US Trade Customer', 'Account: deepali.londhe@overdose.digital', '#0284C7', 2000);
  await tradePage.fill('#email', 'deepali.londhe@overdose.digital');
  await tradePage.fill('#pass', 'Deep@123');
  await tradePage.click('#send2, button[type="submit"].login');
  await tradePage.waitForTimeout(5000);

  // 2. Navigate to PLP (/indoor)
  const plpUrl = 'https://mcstaging2.globewest.com/indoor';
  console.log('Navigating to PLP:', plpUrl);
  await tradePage.goto(plpUrl, { waitUntil: 'domcontentloaded' });
  await tradePage.waitForTimeout(5000);

  await showBanner(tradePage, 'Step 2: Authenticated PLP Verified (/indoor)', 'Inspecting Trade Dual Pricing, Stock Status & Micro-UI', '#10B981', 3000);
  await tradePage.screenshot({ path: path.join(OUT_DIR, '01_plp_trade_initial.png') });

  // 3. Test Header Pricing Toggle (Trade vs MSRP)
  console.log('Testing Header Pricing Toggle...');
  await showBanner(tradePage, 'Step 3: Testing Header Pricing Toggle', 'Clicking toggle to switch Trade vs MSRP mode', '#0284C7', 2500);

  const toggleInfo = await tradePage.evaluate(() => {
    const toggleBtn = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.trim().startsWith('Trade') && el.offsetParent);
    return { hasToggle: !!toggleBtn, text: toggleBtn ? toggleBtn.innerText.trim() : null };
  });
  console.log('Header Pricing Toggle Info:', toggleInfo);

  // Try clicking toggle
  const toggleEl = tradePage.locator('.header.utility-bar, .panel.header').locator('text=Trade').first();
  if (await toggleEl.isVisible().catch(() => false)) {
    console.log('Clicking Trade toggle...');
    await toggleEl.click();
    await tradePage.waitForTimeout(1500);

    const msrpOption = tradePage.locator('text=MSRP, text=Display MSRP').first();
    if (await msrpOption.isVisible().catch(() => false)) {
      console.log('Selecting MSRP option...');
      await msrpOption.click();
      await tradePage.waitForTimeout(3000);
      await tradePage.screenshot({ path: path.join(OUT_DIR, '02_plp_msrp_mode_active.png') });

      // Switch back to Trade
      await toggleEl.click().catch(() => {});
      await tradePage.waitForTimeout(1000);
      const tradeOption = tradePage.locator('text=Trade, text=Display Trade').first();
      if (await tradeOption.isVisible().catch(() => false)) {
        await tradeOption.click();
        await tradePage.waitForTimeout(2500);
      }
    }
  }

  // 4. Inspect Product Cards Micro-UI on PLP
  console.log('Inspecting PLP Product Cards...');
  const cardData = await tradePage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item, .product-item-info')).slice(0, 12);
    return cards.map((c, idx) => {
      const title = c.querySelector('.product-item-name, .product-item-link')?.innerText.trim();
      const sku = c.querySelector('.sku, [data-sku]')?.innerText.trim();
      const priceBox = c.querySelector('.price-box')?.innerText.trim().replace(/\n+/g, ' ');
      const stockBadge = c.querySelector('.stock-status, .stock, .in-stock, .lead-time, [class*="stock"]')?.innerText.trim();
      
      // Compare checkbox
      const compare = c.querySelector('.action.tocompare, [data-role="add-to-compare"], input[type="checkbox"], label[for*="compare"]');
      const compareStyles = compare ? {
        fontWeight: window.getComputedStyle(compare).fontWeight,
        margin: window.getComputedStyle(compare).margin,
        padding: window.getComputedStyle(compare).padding,
        position: window.getComputedStyle(compare).position,
        top: window.getComputedStyle(compare).top,
        left: window.getComputedStyle(compare).left
      } : null;

      // Badges (Check placement: below photo or overlaid on photo per Rule 2)
      const photoContainer = c.querySelector('.product-item-photo');
      const detailsContainer = c.querySelector('.product-item-details');
      const badges = Array.from(c.querySelectorAll('.badge, .ribbon, .product-badge, .new, .customize, [class*="badge"]')).map(b => ({
        text: b.innerText.trim(),
        borderRadius: window.getComputedStyle(b).borderRadius,
        parentClass: b.parentElement?.className,
        isInsidePhoto: !!(photoContainer && photoContainer.contains(b)),
        isInsideDetails: !!(detailsContainer && detailsContainer.contains(b))
      }));

      // Swatches
      const swatches = Array.from(c.querySelectorAll('.swatch-option')).map(s => ({
        label: s.getAttribute('aria-label') || s.getAttribute('data-option-label'),
        bg: window.getComputedStyle(s).backgroundColor || window.getComputedStyle(s).backgroundImage
      }));

      // Image placeholder check (Rule 4)
      const img = c.querySelector('.product-image-photo, img');
      const imgSrc = img ? img.getAttribute('src') : '';
      const isPlaceholder = imgSrc.includes('/placeholder/default/') || imgSrc.includes('coming_soon') || imgSrc.includes('GW_Coming_Soon');

      return {
        cardIndex: idx,
        title,
        priceBox,
        stockBadge,
        comparePresent: !!compare,
        compareStyles,
        badges,
        swatchCount: swatches.length,
        isPlaceholder,
        imgSrc: imgSrc ? imgSrc.substring(0, 100) : null
      };
    });
  });

  report.plpTrade.cardCount = cardData.length;
  report.plpTrade.cards = cardData;
  console.log(`Captured ${cardData.length} product cards on PLP:`);
  cardData.slice(0, 4).forEach(c => console.log(` Card ${c.cardIndex}: ${c.title} | Price: ${c.priceBox} | Stock: ${c.stockBadge} | Swatches: ${c.swatchCount} | Badges: ${JSON.stringify(c.badges)}`));

  // 5. Test Swatch Interaction on First Card with Swatches
  console.log('Testing Swatch Interaction on Product Card...');
  await showBanner(tradePage, 'Step 4: Testing Card Swatch Hover & Color Switch', 'Hovering swatches to test thumbnail image switching', '#8B5CF6', 2500);

  const cardWithSwatches = tradePage.locator('.product-item:has(.swatch-option)').first();
  if (await cardWithSwatches.isVisible().catch(() => false)) {
    const swatches = cardWithSwatches.locator('.swatch-option');
    const sc = await swatches.count();
    console.log(`Found ${sc} swatches on card. Hovering 2nd swatch...`);
    if (sc > 1) {
      await swatches.nth(1).hover();
      await tradePage.waitForTimeout(2000);
      await tradePage.screenshot({ path: path.join(OUT_DIR, '03_plp_card_swatch_hover.png') });
    }
  }

  // 6. Test Filter Toolbar Interaction
  console.log('Testing Filter Toolbar...');
  await showBanner(tradePage, 'Step 5: Testing Filter & Sort Toolbar', 'Opening filters drawer / selecting filter facets', '#F59E0B', 2500);

  // Look for "Show Filters" or filter toggle
  const filterBtn = tradePage.locator('.filter-toggle, #layered-filter-block, .block-filter .title, [data-role="title"], button:has-text("Show Filters"), button:has-text("Filters")').first();
  if (await filterBtn.isVisible().catch(() => false)) {
    console.log('Clicking Filter button...');
    await filterBtn.click().catch(() => {});
    await tradePage.waitForTimeout(2000);
  }
  await tradePage.screenshot({ path: path.join(OUT_DIR, '04_plp_filters_active.png') });

  // 7. Test Compare Checkbox Interaction
  console.log('Testing Compare functionality...');
  await showBanner(tradePage, 'Step 6: Testing Product Comparison Checkbox', 'Selecting [x] Compare on product card', '#0284C7', 2500);

  const compareCheckbox = tradePage.locator('.product-item .action.tocompare, .product-item [data-role="add-to-compare"], .product-item input[type="checkbox"]').first();
  if (await compareCheckbox.isVisible().catch(() => false)) {
    await compareCheckbox.click().catch(() => {});
    await tradePage.waitForTimeout(3000);
    await tradePage.screenshot({ path: path.join(OUT_DIR, '05_plp_compare_triggered.png') });
  }

  // 8. Test Scroll & Infinite Scroll / Pagination
  console.log('Testing Scroll & Pagination...');
  await showBanner(tradePage, 'Step 7: Scrolling down PLP to inspect layout & catalog assets', 'Checking for broken images or layout shifts', '#10B981', 2500);
  await tradePage.evaluate(() => window.scrollBy({ top: 800, behavior: 'smooth' }));
  await tradePage.waitForTimeout(2000);
  await tradePage.evaluate(() => window.scrollBy({ top: 800, behavior: 'smooth' }));
  await tradePage.waitForTimeout(2000);
  await tradePage.screenshot({ path: path.join(OUT_DIR, '06_plp_trade_scrolled.png') });


  // =========================================================================
  // SECTION 2: PLP WITHOUT LOGIN (LOGGED-OUT / PUBLIC BROWSING MODE)
  // =========================================================================
  console.log('\n=============================================================');
  console.log('PART 2: PLP WITHOUT LOGIN (LOGGED-OUT / PUBLIC BROWSING)');
  console.log('=============================================================');

  const guestContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const guestPage = await guestContext.newPage();

  console.log('Navigating to PLP as Guest:', plpUrl);
  await guestPage.goto(plpUrl, { waitUntil: 'domcontentloaded' });
  await guestPage.waitForTimeout(5000);

  await showBanner(guestPage, 'Step 8: Logged-Out Public Browsing PLP (/indoor)', 'Verifying Wholesale Price Masking & Trade Registration CTAs', '#DC2626', 3000);
  await guestPage.screenshot({ path: path.join(OUT_DIR, '07_plp_guest_public_mode.png') });

  const guestCardData = await guestPage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item, .product-item-info')).slice(0, 8);
    const topBar = document.querySelector('.panel.header, .header.utility-bar')?.innerText.trim().replace(/\n+/g, ' | ');
    const pricingToggle = document.querySelector('.pricing-toggle, [data-role="pricing-toggle"]');

    const cardDetails = cards.map(c => {
      const title = c.querySelector('.product-item-name, .product-item-link')?.innerText.trim();
      const priceText = c.querySelector('.price-box')?.innerText.trim().replace(/\n+/g, ' ');
      const hasPrices = !!(priceText && (priceText.includes('$') || priceText.toLowerCase().includes('trade')));
      return { title, priceText, hasPrices };
    });

    return {
      topBar,
      hasPricingToggle: !!pricingToggle,
      cardCount: cards.length,
      cards: cardDetails
    };
  });

  report.plpGuest = guestCardData;
  console.log('Logged-Out PLP Inspection Results:\n', JSON.stringify(guestCardData, null, 2));


  // =========================================================================
  // SECTION 3: PDP WITH LOGGED-IN TRADE ACCOUNT
  // =========================================================================
  console.log('\n=============================================================');
  console.log('PART 3: PDP WITH LOGGED-IN TRADE ACCOUNT (HEADED MODE)');
  console.log('=============================================================');

  const pdpUrl = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
  console.log('Navigating to PDP as Trade User:', pdpUrl);
  await tradePage.goto(pdpUrl, { waitUntil: 'domcontentloaded' });
  await tradePage.waitForTimeout(5000);

  await showBanner(tradePage, 'Step 9: PDP Trade Customer Verification', 'Dual Pricing ($300 / MSRP $330), [ADD TO CART] & [ADD TO QUOTE]', '#10B981', 3000);
  await tradePage.screenshot({ path: path.join(OUT_DIR, '08_pdp_trade_initial.png') });

  // 1. Inspect PDP Pricing & Action Buttons
  const pdpTradeAudit = await tradePage.evaluate(() => {
    const title = document.querySelector('h1.page-title')?.innerText.trim();
    const priceBox = document.querySelector('.price-box')?.innerText.trim().replace(/\n+/g, ' ');
    const atc = document.querySelector('#product-addtocart-button');
    const atq = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('add to quote'));
    const swatches = Array.from(document.querySelectorAll('.swatch-option')).map(s => s.getAttribute('aria-label') || s.getAttribute('data-option-label'));
    const colourHeading = document.querySelector('.current-swatch, .swatch-attribute.color .swatch-attribute-label')?.innerText.trim().replace(/\n+/g, ' ');
    const warranty = Array.from(document.querySelectorAll('a')).find(a => a.innerText && a.innerText.toLowerCase().includes('warranty'));
    const tabs = Array.from(document.querySelectorAll('.product.data.items .item.title, [data-role="collapsible"]')).map(t => t.innerText.trim());
    const prop65 = document.body.innerText.includes('P65Warnings.ca.gov') || document.body.innerText.includes('California Proposition 65');

    return {
      title,
      priceBox,
      hasAddToCart: !!(atc && atc.offsetParent),
      hasAddToQuote: !!(atq && atq.offsetParent),
      swatches,
      colourHeading,
      warrantyLink: warranty ? warranty.href : null,
      tabs,
      hasProp65Warning: prop65
    };
  });

  report.pdpTrade = pdpTradeAudit;
  console.log('PDP Trade Audit Results:\n', JSON.stringify(pdpTradeAudit, null, 2));

  // 2. Test Swatch Switching on PDP (Click 4th swatch: Tobacco Ash)
  console.log('Testing Swatch Selection on PDP...');
  await showBanner(tradePage, 'Step 10: Testing PDP Swatch Click (Tobacco Ash)', 'Verifying color selection updates SKU & photo', '#8B5CF6', 2500);

  const pdpSwatches = tradePage.locator('.swatch-option');
  if (await pdpSwatches.count() >= 4) {
    await pdpSwatches.nth(3).click();
    await tradePage.waitForTimeout(3000);
    await tradePage.screenshot({ path: path.join(OUT_DIR, '09_pdp_trade_swatch_clicked.png') });
  }

  // 3. Scroll down to inspect Specifications & Tabs
  console.log('Inspecting Lower Specifications...');
  await showBanner(tradePage, 'Step 11: Inspecting Lower Specifications Tab', 'Auditing dimensions, materials, metric unit leaks', '#0284C7', 2500);
  await tradePage.evaluate(() => window.scrollBy({ top: 750, behavior: 'smooth' }));
  await tradePage.waitForTimeout(3000);
  await tradePage.screenshot({ path: path.join(OUT_DIR, '10_pdp_trade_specifications.png') });


  // =========================================================================
  // SECTION 4: PDP WITHOUT LOGIN (LOGGED-OUT GUEST)
  // =========================================================================
  console.log('\n=============================================================');
  console.log('PART 4: PDP WITHOUT LOGIN (LOGGED-OUT GUEST)');
  console.log('=============================================================');

  console.log('Navigating to PDP as Guest User:', pdpUrl);
  await guestPage.goto(pdpUrl, { waitUntil: 'domcontentloaded' });
  await guestPage.waitForTimeout(5000);

  await showBanner(guestPage, 'Step 12: PDP Logged-Out Public Mode', 'Verifying Price Masking & Free Swatches CTA', '#DC2626', 3000);
  await guestPage.screenshot({ path: path.join(OUT_DIR, '11_pdp_guest_initial.png') });

  const pdpGuestAudit = await guestPage.evaluate(() => {
    const priceBox = document.querySelector('.price-box')?.innerText.trim().replace(/\n+/g, ' ');
    const atc = document.querySelector('#product-addtocart-button');
    const atq = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('add to quote'));
    const swatchCTA = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('request free swatch'));
    const etaText = document.body.innerText.includes('Enquire for ETA') || document.body.innerText.includes('ETA');

    return {
      priceBox,
      hasAddToCart: !!(atc && atc.offsetParent),
      hasAddToQuote: !!(atq && atq.offsetParent),
      hasRequestFreeSwatchesCTA: !!swatchCTA,
      swatchCTAText: swatchCTA ? swatchCTA.innerText.trim() : null,
      hasEtaLeaking: etaText
    };
  });

  report.pdpGuest = pdpGuestAudit;
  console.log('PDP Guest Audit Results:\n', JSON.stringify(pdpGuestAudit, null, 2));

  // Save report
  fs.writeFileSync(path.join(OUT_DIR, 'full_plp_pdp_audit_report.json'), JSON.stringify(report, null, 2));

  console.log('\nKeeping browser open for 8 seconds for visual observation...');
  await tradePage.waitForTimeout(8000);

  await browser.close();
  console.log('🏁 Full Headed PLP & PDP Audit completed successfully!');
})();
