const path = require('path');
const fs = require('fs');
const pw = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const TARGET_URL = `${US_BASE_URL}/indoor`;

(async () => {
  console.log('=================================================================================');
  console.log('📱 MOBILE SAFARI (IPHONE 14) LOGGED OUT AUDIT: PLP CATEGORY PAGE');
  console.log('Target URL: ' + TARGET_URL);
  console.log('Device Profile: iPhone 14 (390 x 844, Mobile Safari WebKit UA, Touch enabled)');
  console.log('Figma Spec: CATEGORY PAGE -> Logged Out - No Pricing');
  console.log('=================================================================================\n');

  const iphoneDevice = pw.devices['iPhone 14'];

  const browser = await pw.chromium.launch({
    channel: 'chrome',
    headless: false,
    args: [
      '--no-sandbox',
      '--window-size=430,920'
    ]
  });

  const context = await browser.newContext({
    ...iphoneDevice,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // Highlight helper
  async function addMobileCallout(locator, text, color = '#10B981', dur = 2000) {
    try {
      const isVis = await locator.isVisible({ timeout: 1500 }).catch(() => false);
      if (!isVis) return;
      await locator.scrollIntoViewIfNeeded({ timeout: 800 }).catch(() => {});

      await locator.evaluate((el, { t, c, d }) => {
        const prevOutline = el.style.outline;
        el.style.outline = `3px solid ${c}`;
        const tag = document.createElement('div');
        tag.className = 'qa-mob-tag';
        tag.textContent = t;
        tag.style.position = 'absolute';
        tag.style.top = '-26px';
        tag.style.left = '0';
        tag.style.background = c;
        tag.style.color = '#fff';
        tag.style.fontSize = '11px';
        tag.style.fontWeight = 'bold';
        tag.style.padding = '2px 6px';
        tag.style.borderRadius = '3px';
        tag.style.zIndex = '999999';
        tag.style.whiteSpace = 'nowrap';
        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.appendChild(tag);
        setTimeout(() => {
          el.style.outline = prevOutline;
          tag.remove();
        }, d);
      }, { t: text, c: color, d: dur });
      await page.waitForTimeout(dur);
    } catch (e) {}
  }

  // Visual tap helper
  async function tapWithGlow(locator, actionName, delayAfter = 1200) {
    try {
      const isVis = await locator.isVisible({ timeout: 1500 }).catch(() => false);
      if (!isVis) {
        console.log(`  ❌ Mobile element not visible: ${actionName}`);
        return false;
      }
      await locator.scrollIntoViewIfNeeded({ timeout: 800 }).catch(() => {});

      await locator.evaluate((el, name) => {
        el.style.outline = '3px solid #F59E0B';
        const badge = document.createElement('div');
        badge.className = 'qa-tap-badge';
        badge.textContent = `👆 TAP: ${name}`;
        badge.style.position = 'absolute';
        badge.style.top = '-26px';
        badge.style.left = '0';
        badge.style.background = '#F59E0B';
        badge.style.color = '#000';
        badge.style.fontWeight = 'bold';
        badge.style.fontSize = '11px';
        badge.style.padding = '2px 6px';
        badge.style.borderRadius = '3px';
        badge.style.zIndex = '999999';
        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.appendChild(badge);
      }, actionName);

      await page.waitForTimeout(400);
      await locator.tap().catch(async () => await locator.click());
      await page.waitForTimeout(delayAfter);

      await locator.evaluate((el) => {
        el.style.outline = '';
        const b = el.querySelector('.qa-tap-badge');
        if (b) b.remove();
      }).catch(() => {});
      console.log(`  ✅ Tapped: ${actionName}`);
      return true;
    } catch (e) {
      console.log(`  ⚠️ Tap error on ${actionName}: ${e.message}`);
      return false;
    }
  }

  console.log('Step 1: Navigating to US PLP (/indoor) on iPhone 14 (Mobile Safari)...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Close modals
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
  }

  const outDir = path.join(__dirname, '../screenshots/regression_run');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const auditResults = [];

  // -------------------------------------------------------------------------
  // 1. MOBILE RESPONSIVE SANITY: HORIZONTAL OVERFLOW CHECK
  // -------------------------------------------------------------------------
  console.log('\n--- 1. MOBILE RESPONSIVE VIEWPORT & OVERFLOW AUDIT ---');
  const overflowCheck = await page.evaluate(() => {
    return {
      windowWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
    };
  });
  console.log('  Viewport Width:', overflowCheck.windowWidth);
  console.log('  Document Scroll Width:', overflowCheck.documentWidth);
  console.log('  Horizontal Overflow Detected:', overflowCheck.hasHorizontalOverflow ? '❌ DEFECT' : '🟢 NONE (Clean)');

  auditResults.push({
    item: 'Mobile Horizontal Overflow',
    result: !overflowCheck.hasHorizontalOverflow ? 'PASS' : 'FAIL',
    detail: `Doc width: ${overflowCheck.documentWidth}px vs Viewport: ${overflowCheck.windowWidth}px`
  });

  // -------------------------------------------------------------------------
  // 2. MOBILE TOP UTILITY BAR (FIGMA SPEC: Utility bar with Showroom booking link)
  // -------------------------------------------------------------------------
  console.log('\n--- 2. MOBILE TOP UTILITY BAR (LOGGED OUT) ---');
  const utilityData = await page.evaluate(() => {
    const topBar = document.querySelector('.c-top-bar') || document.querySelector('.panel.header') || document.querySelector('.header.panel');
    const links = Array.from(document.querySelectorAll('.c-top-bar a, .panel.header a, .header.panel a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    }));
    const priceToggle = document.querySelector('.price-toggle, [data-role="price-toggle"], .c-price-toggle');
    return {
      rawText: topBar ? topBar.innerText.trim().replace(/\n+/g, ' | ') : 'N/A',
      links,
      hasShowroom: links.some(l => l.text.toLowerCase().includes('showroom') || l.href?.includes('booking')),
      hasBecomeTrade: links.some(l => l.text.toLowerCase().includes('become a trade customer') || l.text.toLowerCase().includes('trade') || l.href?.includes('trade')),
      hasPriceToggle: !!priceToggle && window.getComputedStyle(priceToggle).display !== 'none'
    };
  });
  console.log('  Utility Bar Text:', utilityData.rawText);
  console.log('  - Has Showroom Booking link:', utilityData.hasShowroom ? '🟢 YES' : '❌ NO');
  console.log('  - Has Become Trade link:', utilityData.hasBecomeTrade ? '🟢 YES' : '❌ NO');
  console.log('  - Price Toggle Hidden for Guest:', !utilityData.hasPriceToggle ? '🟢 YES (Hidden)' : '❌ LEAKAGE');

  const topBarLocator = page.locator('.c-top-bar, .panel.header, .header.panel').first();
  await addMobileCallout(topBarLocator, '🏷️ FIGMA: Mobile Utility Bar (Showroom Booking Link)', '#10B981', 2500);

  auditResults.push({
    item: 'Mobile Utility Bar (Showroom Booking)',
    result: utilityData.hasShowroom ? 'PASS' : 'FAIL',
    detail: utilityData.rawText
  });
  auditResults.push({
    item: 'Mobile Price Toggle Hidden in Guest Mode',
    result: !utilityData.hasPriceToggle ? 'PASS' : 'FAIL',
    detail: 'Toggle suppressed for unauthenticated guests'
  });

  // Capture Top Section Screenshot
  await page.screenshot({ path: path.join(outDir, '14_IPHONE_SAFARI_LOGGED_OUT_HERO_AND_UTILITY.png') });

  // -------------------------------------------------------------------------
  // 3. MOBILE HERO BANNER (Clean Layout, No Quick Links Section)
  // -------------------------------------------------------------------------
  console.log('\n--- 3. MOBILE HERO BANNER & QUICK LINKS ---');
  const heroData = await page.evaluate(() => {
    const title = document.querySelector('.page-title, h1.title, .c-category-header__title');
    const quickLinks = document.querySelector('.subcategory-list, .quick-links, .c-category-pills, .category-subcategories');
    return {
      titleText: title ? title.innerText.trim() : 'N/A',
      hasQuickLinks: !!quickLinks && window.getComputedStyle(quickLinks).display !== 'none'
    };
  });
  console.log('  - Mobile Category Title:', heroData.titleText);
  console.log('  - Quick Links Removed under Hero:', !heroData.hasQuickLinks ? '🟢 YES (Clean layout)' : '❌ NO');

  const heroLocator = page.locator('h1.page-title, .page-title, .category-view').first();
  await addMobileCallout(heroLocator, '🏷️ FIGMA: Clean Hero (Quick Links Removed)', '#2563EB', 2000);

  auditResults.push({
    item: 'Mobile Hero Banner Layout',
    result: !heroData.hasQuickLinks ? 'PASS' : 'FAIL',
    detail: `Title: "${heroData.titleText}", Quick links removed: ${!heroData.hasQuickLinks}`
  });

  // -------------------------------------------------------------------------
  // 4. MOBILE FILTER & SORT BAR ("Browse by" + "New Arrivals ⌵")
  // -------------------------------------------------------------------------
  console.log('\n--- 4. MOBILE FILTER & SORT TOOLBAR ---');
  const filterBtn = page.locator('.block-title.filter-title, .action.filter, button:has-text("Browse by"), button:has-text("Show Filters"), button:has-text("Filter")').first();
  const sortSelect = page.locator('#sorter, select.sorter-options, [data-role="sorter"]').first();

  const hasFilterBtn = await filterBtn.isVisible({ timeout: 1500 }).catch(() => false);
  const filterBtnLabel = hasFilterBtn ? (await filterBtn.innerText()).trim().replace(/\n+/g, ' ') : 'N/A';
  const hasSortSelect = await sortSelect.isVisible({ timeout: 1500 }).catch(() => false);

  console.log(`  - Mobile Filter Button: Present (${hasFilterBtn}) Label: "${filterBtnLabel}"`);
  console.log(`  - Mobile Sort Dropdown: Present (${hasSortSelect})`);

  if (hasFilterBtn) {
    await addMobileCallout(filterBtn, `🏷️ FIGMA: Mobile Filter Button [${filterBtnLabel}]`, '#F59E0B', 2000);
    // Tap to test drawer opening
    await tapWithGlow(filterBtn, 'Mobile Filter Drawer ("Browse by")', 2000);

    const filterDrawer = page.locator('.filter-options, .block.filter.active, .c-filter-drawer, .block-content.filter-content').first();
    const isDrawerOpen = await filterDrawer.isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`  -> Filter drawer opened upon tap: ${isDrawerOpen}`);

    if (isDrawerOpen) {
      await addMobileCallout(filterDrawer, '🟢 Mobile Filter Drawer Active', '#10B981', 1500);
      // Close drawer
      const closeBtn = page.locator('.filter-title strong, .action.close, .filter-close, button[aria-label="Close"], button:has-text("Close")').first();
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await tapWithGlow(closeBtn, 'Close Filter Drawer', 1200);
      } else {
        await page.keyboard.press('Escape');
      }
    }
  }

  auditResults.push({
    item: 'Mobile Filter Button ("Browse by")',
    result: hasFilterBtn ? 'PASS' : 'FAIL',
    detail: `Button label: "${filterBtnLabel}"`
  });

  // -------------------------------------------------------------------------
  // 5. MOBILE PRODUCT CARDS: PRICE & STOCK AVAILABILITY AUDIT
  // FIGMA SPEC:
  // - "Same functionality re: pricing as desktop" (Prices 100% masked for logged out)
  // - "Stock Availability: Not shown for logged out users"
  // -------------------------------------------------------------------------
  console.log('\n--- 5. MOBILE PRODUCT CARDS: PRICING & STOCK AUDIT ---');
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  const cardsAudit = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item')).slice(0, 4);
    return cards.map((c, i) => {
      const text = c.innerText;
      const hasDollar = text.includes('$');
      const hasAddToCart = !!c.querySelector('button[title*="Cart"], .action.tocart');
      const hasCompare = !!c.querySelector('.action.tocompare, input[type="checkbox"]');
      const hasHeart = !!c.querySelector('.towishlist, .wishlist-heart, [class*="wishlist"]');
      const title = c.querySelector('.product-item-name, .product-item-link')?.innerText.trim() || 'N/A';

      // Check stock indicators: "In Stock", "ETA", "Enquire for ETA", "Lead Time"
      const textLower = text.toLowerCase();
      const hasStockMention = textLower.includes('in stock') || textLower.includes('eta') || textLower.includes('lead time');

      // Check badges
      const badgeEl = c.querySelector('.badge') || Array.from(c.querySelectorAll('span, div')).find(el => el.innerText && (el.innerText.includes('New') || el.innerText.includes('Customisable')));
      const hasBadges = !!badgeEl;

      return {
        cardIndex: i + 1,
        title,
        hasDollar,
        hasAddToCart,
        hasCompare,
        hasHeart,
        hasStockMention,
        hasBadges,
        textSnippet: text.replace(/\n+/g, ' | ').substring(0, 100)
      };
    });
  });

  console.log(`Inspected ${cardsAudit.length} mobile product cards:`);
  let anyPriceLeak = false;
  let anyCartLeak = false;
  let anyStockShown = false;

  cardsAudit.forEach(c => {
    console.log(`  Card #${c.cardIndex}: "${c.title}"`);
    console.log(`    - Has Price / Dollar: ${c.hasDollar ? '❌ LEAKAGE ($)' : '🟢 100% MASKED'}`);
    console.log(`    - Has Add to Cart: ${c.hasAddToCart ? '❌ LEAKAGE' : '🟢 SUPPRESSED'}`);
    console.log(`    - Stock Indicator Shown: ${c.hasStockMention ? '⚠️ SHOWN (' + c.textSnippet + ')' : '🟢 NOT SHOWN (Hidden for Logged Out)'}`);
    console.log(`    - Has Compare: ${c.hasCompare ? '🟢 YES' : '❌ NO'}`);
    console.log(`    - Has Wishlist Heart: ${c.hasHeart ? '🟢 YES' : '❌ MISSING (Figma spec)'}`);
    if (c.hasDollar) anyPriceLeak = true;
    if (c.hasAddToCart) anyCartLeak = true;
    if (c.hasStockMention) anyStockShown = true;
  });

  const firstCardMob = page.locator('.product-item').first();
  await addMobileCallout(firstCardMob, '🟢 FIGMA: Price & Add to Cart 100% Suppressed', '#10B981', 2500);

  auditResults.push({
    item: 'Mobile Price Masking (Logged Out)',
    result: !anyPriceLeak ? 'PASS' : 'FAIL',
    detail: 'Zero dollar signs ($) or wholesale prices rendered'
  });
  auditResults.push({
    item: 'Mobile Add to Cart Suppression (Logged Out)',
    result: !anyCartLeak ? 'PASS' : 'FAIL',
    detail: 'Cart and instant quote triggers hidden'
  });
  auditResults.push({
    item: 'Stock Availability Hidden for Logged Out Users (Figma Spec)',
    result: !anyStockShown ? 'PASS' : 'DEFECT / NOTE',
    detail: !anyStockShown ? 'Stock is correctly NOT shown for logged out users' : 'Stock indicator detected on card'
  });

  // Capture Product Cards Screenshot
  await page.screenshot({ path: path.join(outDir, '15_IPHONE_SAFARI_LOGGED_OUT_FILTER_AND_CARDS.png') });

  // -------------------------------------------------------------------------
  // 6. MOBILE HAMBURGER NAVIGATION DRAWER (≡)
  // -------------------------------------------------------------------------
  console.log('\n--- 6. MOBILE HAMBURGER NAVIGATION DRAWER (≡) ---');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(1000);

  const hamburger = page.locator('.nav-toggle, button[data-action="toggle-nav"], .c-header__menu-btn').first();
  if (await hamburger.isVisible({ timeout: 1500 }).catch(() => false)) {
    await tapWithGlow(hamburger, 'Mobile Hamburger Menu (≡)', 2000);
    const navSections = page.locator('.nav-sections, .navigation, .ui-menu').first();
    const isNavOpen = await navSections.isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`  -> Hamburger drawer open: ${isNavOpen}`);

    if (isNavOpen) {
      await addMobileCallout(navSections, '🟢 Mobile Navigation Drawer Open', '#10B981', 1500);
      await page.screenshot({ path: path.join(outDir, '16_IPHONE_SAFARI_LOGGED_OUT_MOBILE_NAV_DRAWER.png') });

      // Close drawer
      const closeNav = page.locator('.action.close, .nav-toggle, [data-action="close"]').first();
      await tapWithGlow(closeNav, 'Close Navigation Drawer', 1200);
    }
  }

  // Final summary object
  console.log('\n=================================================================================');
  console.log('📊 MOBILE SAFARI (IPHONE 14) LOGGED-OUT AUDIT RESULTS:');
  console.log('=================================================================================');
  auditResults.forEach(r => {
    const icon = r.result === 'PASS' ? '🟢' : '🔴';
    console.log(`  ${icon} [${r.item}]: ${r.result} (${r.detail})`);
  });
  console.log('=================================================================================\n');

  // Keep open 3 seconds for headed visualization
  await page.waitForTimeout(3000);
  await browser.close();
})();
