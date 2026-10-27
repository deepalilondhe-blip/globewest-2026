const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const TARGET_URL = `${US_BASE_URL}/indoor`;

(async () => {
  console.log('========================================================================');
  console.log('🔬 DEEP FORENSIC AUDIT: PLP (CATEGORY PAGE) FIGMA FIDELITY CHECK');
  console.log('URL: ' + TARGET_URL);
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const report = {
    timestamp: new Date().toISOString(),
    sections: {}
  };

  // -------------------------------------------------------------------------
  // 1. PUBLIC GUEST (LOGGED-OUT) INSPECTION
  // -------------------------------------------------------------------------
  console.log('▶ [1/4] AUDITING PUBLIC GUEST (LOGGED-OUT) STATE...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Close modals
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
  }

  // Inspect Top Utility Bar (Logged Out)
  report.sections.utilityBarLoggedOut = await page.evaluate(() => {
    const bar = document.querySelector('.c-top-bar') || document.querySelector('.utility-bar') || document.querySelector('.panel.header');
    const links = Array.from(bar ? bar.querySelectorAll('a') : []).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    }));
    return {
      rendered: !!bar,
      text: bar?.innerText?.trim().replace(/\n+/g, ' | '),
      links
    };
  });
  console.log('  Utility Bar (Logged Out):', report.sections.utilityBarLoggedOut);

  // Inspect Hero Banner & Breadcrumbs
  report.sections.heroBanner = await page.evaluate(() => {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    const title = document.querySelector('.page-title, h1.title, .c-category-header__title');
    const titleStyle = title ? window.getComputedStyle(title) : null;
    const desc = document.querySelector('.category-description, .c-category-header__description');
    const quickLinks = document.querySelector('.subcategory-list, .quick-links, .c-category-pills');

    return {
      breadcrumbs: breadcrumbs ? breadcrumbs.innerText.trim().replace(/\n+/g, ' > ') : 'N/A',
      titleText: title ? title.innerText.trim() : 'N/A',
      titleFontFamily: titleStyle ? titleStyle.fontFamily : 'N/A',
      titleFontSize: titleStyle ? titleStyle.fontSize : 'N/A',
      hasQuickLinksSection: !!quickLinks
    };
  });
  console.log('  Hero Banner & Quick Links:', report.sections.heroBanner);

  // Inspect Filter Toolbar Layout (Logged Out)
  report.sections.filterToolbar = await page.evaluate(() => {
    const toolbar = document.querySelector('.c-toolbar') || document.querySelector('.toolbar-products') || document.querySelector('.toolbar');
    const pills = Array.from(document.querySelectorAll('.filter-options-item, .c-toolbar__item, .c-facet-pill')).map(p => p.innerText.trim().replace(/\n+/g, ' '));
    const sortDropdown = document.querySelector('#sorter, .c-sorter, [data-role="sorter"]');
    const sortLabel = sortDropdown ? (sortDropdown.selectedOptions ? sortDropdown.selectedOptions[0]?.text : sortDropdown.innerText.trim()) : 'N/A';
    const hideFilters = Array.from(document.querySelectorAll('a, button, span')).find(el => el.innerText && el.innerText.trim().toLowerCase() === 'hide filters');
    const filtersHeading = Array.from(document.querySelectorAll('h2, h3, span, div')).find(el => el.innerText && el.innerText.trim() === 'Filters');

    return {
      pillsCount: pills.length,
      pillsList: pills.slice(0, 6),
      sortDefaultOption: sortLabel,
      hasFiltersSidebarHeading: !!filtersHeading,
      hasHideFiltersToggle: !!hideFilters
    };
  });
  console.log('  Filter Toolbar:', report.sections.filterToolbar);

  // Inspect Product Card 1 (Logged Out)
  report.sections.guestCard = await page.evaluate(() => {
    const card = document.querySelector('.product-item');
    if (!card) return { rendered: false };

    const compareLabel = card.querySelector('.action.tocompare') || Array.from(card.querySelectorAll('label, span, a')).find(el => el.innerText && el.innerText.includes('Compare'));
    const compareStyle = compareLabel ? window.getComputedStyle(compareLabel) : null;
    const img = card.querySelector('.product-image-photo, img');
    const imgSrc = img?.getAttribute('src') || '';
    const isPlaceholder = imgSrc.includes('placeholder') || imgSrc.includes('coming-soon');

    const details = card.querySelector('.product-item-details');
    const photo = card.querySelector('.product-item-photo');
    const badge = card.querySelector('.badge, .product-badge, .new-badge, [class*="badge"]');
    const badgeStyle = badge ? window.getComputedStyle(badge) : null;
    const isBadgeInsideDetails = details && badge && details.contains(badge);

    const priceBox = card.querySelector('.price-box, [data-role="priceBox"]');
    const priceText = priceBox ? priceBox.innerText.trim() : '';
    const cardFullText = card.innerText;

    return {
      rendered: true,
      compareFontWeight: compareStyle?.fontWeight,
      comparePadding: compareStyle?.padding,
      compareMargin: compareStyle?.margin,
      imageSrcSnippet: imgSrc.substring(0, 70),
      isPlaceholderImage: isPlaceholder,
      badgeText: badge ? badge.innerText.trim() : 'None',
      badgeBorderRadius: badgeStyle?.borderRadius,
      isBadgeBelowPhoto: isBadgeInsideDetails,
      hasPriceInGuestMode: cardFullText.includes('$')
    };
  });
  console.log('  Guest Product Card 1:', report.sections.guestCard);

  // -------------------------------------------------------------------------
  // 2. AUTHENTICATED TRADE CUSTOMER INSPECTION
  // -------------------------------------------------------------------------
  console.log('\n▶ [2/4] LOGGING IN AS US TRADE CUSTOMER...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }

  // Navigate back to PLP
  console.log('Navigating back to PLP (/indoor) in Authenticated State...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Inspect Authenticated Utility Bar
  report.sections.utilityBarLoggedIn = await page.evaluate(() => {
    const bar = document.querySelector('.c-top-bar') || document.querySelector('.utility-bar') || document.querySelector('.panel.header');
    const toggle = document.querySelector('.price-toggle, [data-role="price-toggle"]');
    const toggleTrigger = document.querySelector('.price-toggle__trigger, [data-role="price-toggle-trigger"]');
    const accountLink = document.querySelector('.customer-welcome, .header.links, a[href*="customer/account"]');
    const showroomLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText && a.innerText.toLowerCase().includes('showroom'));

    return {
      rendered: !!bar,
      hasPriceToggle: !!toggle,
      priceToggleLabel: toggleTrigger ? toggleTrigger.innerText.trim() : 'N/A',
      hasAccountMenu: !!accountLink,
      accountMenuText: accountLink ? accountLink.innerText.trim() : 'N/A',
      showroomLinkText: showroomLink ? showroomLink.innerText.trim() : 'N/A'
    };
  });
  console.log('  Utility Bar (Logged In):', report.sections.utilityBarLoggedIn);

  // Inspect Authenticated Product Cards (Cards 1 to 4)
  report.sections.authCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item')).slice(0, 4);
    return cards.map((c, i) => {
      const title = c.querySelector('.product-item-name, .c-product-card__title')?.innerText.trim() || 'N/A';
      const priceBox = c.querySelector('.price-box, [data-role="priceBox"]');
      const priceText = priceBox ? priceBox.innerText.trim().replace(/\n+/g, ' | ') : 'N/A';
      const stock = c.querySelector('.stock, .availability, [class*="stock"], [class*="inventory"], .c-product-card__stock')?.innerText.trim() || 'N/A';
      const swatches = Array.from(c.querySelectorAll('.swatch-option, .c-swatch')).length;
      const compareBox = c.querySelector('.action.tocompare, input[type="checkbox"].tocompare') || Array.from(c.querySelectorAll('label, span, a')).find(el => el.innerText && el.innerText.includes('Compare'));
      const saveBtn = c.querySelector('.action.towishlist, [data-action="add-to-wishlist"]') || Array.from(c.querySelectorAll('a, button, span')).find(el => el.innerText && el.innerText.includes('Save'));
      const saveText = saveBtn ? (saveBtn.innerText ? saveBtn.innerText.trim() : saveBtn.getAttribute('title')) : 'N/A';

      const fullText = c.innerText;
      const hasTradePrice = fullText.includes('$');
      const hasMsrp = fullText.includes('MSRP');

      return {
        cardIndex: i + 1,
        title,
        priceText,
        stock,
        swatchesCount: swatches,
        hasCompare: !!compareBox,
        actionRight: saveText,
        hasTradePrice,
        hasMsrp
      };
    });
  });
  console.log('  Authenticated Product Cards 1-4:', report.sections.authCards);

  // -------------------------------------------------------------------------
  // 3. TEST TOGGLING TO MSRP MODE
  // -------------------------------------------------------------------------
  console.log('\n▶ [3/4] TESTING HEADER PRICING TOGGLE: SWITCHING TO MSRP MODE...');
  const trigger = page.locator('.price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
  if (await trigger.isVisible({ timeout: 2000 }).catch(() => false)) {
    await trigger.click();
    await page.waitForTimeout(800);
    const msrpOption = page.locator('.price-toggle__dropdown-item:has-text("MSRP"), a:has-text("MSRP")').first();
    if (await msrpOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await msrpOption.click();
      await page.waitForTimeout(2500);

      report.sections.msrpModeCard1 = await page.evaluate(() => {
        const c = document.querySelector('.product-item');
        const priceBox = c?.querySelector('.price-box, [data-role="priceBox"]');
        const pt = priceBox ? priceBox.innerText.trim().replace(/\n+/g, ' | ') : '';
        const rootClass = document.documentElement.className;
        return {
          priceTextInMsrpMode: pt,
          htmlClass: rootClass
        };
      });
      console.log('  MSRP Mode Pricing Card 1:', report.sections.msrpModeCard1);

      // Switch back to Trade
      await trigger.click();
      await page.waitForTimeout(800);
      const tradeOption = page.locator('.price-toggle__dropdown-item:has-text("Trade"), a:has-text("Trade")').first();
      if (await tradeOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tradeOption.click();
        await page.waitForTimeout(2000);
      }
    }
  }

  // -------------------------------------------------------------------------
  // 4. MOBILE VIEWPORT (375x812) INSPECTION
  // -------------------------------------------------------------------------
  console.log('\n▶ [4/4] AUDITING MOBILE VIEWPORT (375x812)...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(2000);

  report.sections.mobile = await page.evaluate(() => {
    const browseByBtn = document.querySelector('.c-toolbar__button, .action.show-filter') || Array.from(document.querySelectorAll('button, a')).find(b => b.innerText && (b.innerText.includes('Browse') || b.innerText.includes('Filter')));
    const grid = document.querySelector('.products.list, .product-items');
    const gridStyle = grid ? window.getComputedStyle(grid) : null;
    const cards = document.querySelectorAll('.product-item');

    return {
      hasBrowseByButton: !!browseByBtn,
      browseByButtonText: browseByBtn ? browseByBtn.innerText.trim() : 'N/A',
      gridColumns: gridStyle ? (gridStyle.gridTemplateColumns || gridStyle.display) : 'N/A',
      firstCardWidth: cards[0] ? cards[0].offsetWidth : 'N/A'
    };
  });
  console.log('  Mobile Viewport Data:', report.sections.mobile);

  // Write full audit JSON
  const outPath = path.resolve(__dirname, '../PLP_DEEP_FORENSIC_AUDIT_DATA.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log('\n✅ Forensic Audit Data saved to: ' + outPath);

  await browser.close();
})();
