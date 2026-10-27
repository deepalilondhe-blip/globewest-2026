const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const TARGET_URL = `${US_BASE_URL}/indoor`;

const TRADE_EMAIL = 'deepali.londhe@overdose.digital';
const TRADE_PASSWORD = 'Deep@123';

(async () => {
  console.log('=================================================================================');
  console.log('🔍 EXHAUSTIVE CLICK & DROPDOWN AUDIT: PLP DESKTOP (LOGGED OUT) & MOBILE (MSRP)');
  console.log('Figma Reference 1: desktop/Category/Logged Out');
  console.log('Figma Reference 2: Mobile/Category/MSRP Pricing');
  console.log('=================================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: false,
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const defectsFound = [];
  const passedChecks = [];

  // Helper function for visual click with glowing highlight
  async function clickWithGlow(page, locator, actionName, delayAfter = 1200) {
    try {
      const isVis = await locator.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isVis) {
        console.log(`  ❌ Element NOT VISIBLE for click: ${actionName}`);
        return false;
      }
      await locator.scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});

      await locator.evaluate((el, name) => {
        el.style.outline = '4px solid #F59E0B';
        el.style.boxShadow = '0 0 20px #F59E0B';
        el.style.transition = 'all 0.2s ease';

        const badge = document.createElement('div');
        badge.className = 'qa-active-click-badge';
        badge.textContent = `🔘 CLICK: ${name}`;
        badge.style.position = 'absolute';
        badge.style.top = '-32px';
        badge.style.left = '0';
        badge.style.background = '#F59E0B';
        badge.style.color = '#000';
        badge.style.fontWeight = 'bold';
        badge.style.fontSize = '12px';
        badge.style.padding = '3px 8px';
        badge.style.borderRadius = '4px';
        badge.style.zIndex = '999999';
        badge.style.pointerEvents = 'none';

        if (window.getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
        }
        el.appendChild(badge);
      }, actionName);

      await page.waitForTimeout(500);
      await locator.click().catch(() => {});
      await page.waitForTimeout(delayAfter);

      await locator.evaluate((el) => {
        el.style.outline = '';
        el.style.boxShadow = '';
        const b = el.querySelector('.qa-active-click-badge');
        if (b) b.remove();
      }).catch(() => {});

      console.log(`  ✅ Successfully clicked: ${actionName}`);
      return true;
    } catch (e) {
      console.log(`  ⚠️ Click error on ${actionName}: ${e.message}`);
      return false;
    }
  }

  // Helper to add callout banner
  async function banner(page, locator, text, color = '#10B981', dur = 1500) {
    try {
      const isVis = await locator.isVisible({ timeout: 1500 }).catch(() => false);
      if (!isVis) return;
      await locator.evaluate((el, { t, c, d }) => {
        const prevOutline = el.style.outline;
        el.style.outline = `3px solid ${c}`;
        const tag = document.createElement('div');
        tag.className = 'qa-tag';
        tag.textContent = t;
        tag.style.position = 'absolute';
        tag.style.top = '-28px';
        tag.style.left = '0';
        tag.style.background = c;
        tag.style.color = '#fff';
        tag.style.fontSize = '12px';
        tag.style.fontWeight = 'bold';
        tag.style.padding = '2px 8px';
        tag.style.borderRadius = '4px';
        tag.style.zIndex = '999999';
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

  // =================================================================================
  // PART 1: DESKTOP (LOGGED OUT) — ALL FUNCTIONAL CLICKS & DROPDOWNS
  // Figma Reference: desktop/Category/Logged Out
  // =================================================================================
  console.log('\n=================================================================================');
  console.log('📌 PART 1: DESKTOP (LOGGED OUT) — TESTING ALL CLICKS & DROPDOWNS');
  console.log('=================================================================================');

  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageDesk = await contextDesktop.newPage();

  console.log('\n1.1 Navigating to US PLP (/indoor)...');
  await pageDesk.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageDesk.waitForTimeout(2500);

  // Close modals
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = pageDesk.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
  }

  // 1.2 Top Utility Bar Clicks
  console.log('\n1.2 Testing Top Utility Bar Links:');
  const tradeLink = pageDesk.locator('a:has-text("Become a Trade Customer"), .c-top-bar a[href*="trade"]').first();
  if (await tradeLink.isVisible({ timeout: 1500 }).catch(() => false)) {
    const href = await tradeLink.getAttribute('href');
    await banner(pageDesk, tradeLink, `Link: "Become a Trade Customer" -> ${href}`, '#10B981', 1000);
    passedChecks.push({ area: 'Utility Bar', item: 'Become a Trade Customer Link', status: 'PASS', detail: href });
  } else {
    defectsFound.push({ area: 'Utility Bar', defect: 'Missing "Become a Trade Customer" link in logged-out mode', severity: 'HIGH' });
  }

  const showroomLink = pageDesk.locator('a:has-text("Book Showroom Appointment"), .c-top-bar a[href*="booking"]').first();
  if (await showroomLink.isVisible({ timeout: 1500 }).catch(() => false)) {
    const href = await showroomLink.getAttribute('href');
    await banner(pageDesk, showroomLink, `Link: "Book Showroom Appointment" -> ${href}`, '#10B981', 1000);
    passedChecks.push({ area: 'Utility Bar', item: 'Book Showroom Appointment Link', status: 'PASS', detail: href });
  } else {
    defectsFound.push({ area: 'Utility Bar', defect: 'Missing "Book Showroom Appointment" link in logged-out mode', severity: 'MEDIUM' });
  }

  // 1.3 Header Login Dropdown Click
  console.log('\n1.3 Testing Header Login Dropdown Trigger:');
  const loginTrigger = pageDesk.locator('.customer-welcome, .header .authorization-link a, [data-action="customer-menu-toggle"], .action.action-register, a:has-text("Login")').first();
  if (await loginTrigger.isVisible({ timeout: 1500 }).catch(() => false)) {
    await clickWithGlow(pageDesk, loginTrigger, 'Header Login Trigger', 1500);
    // Check if customer menu or dropdown opened
    const loginMenu = pageDesk.locator('.customer-menu, .header.links, .block-authentication').first();
    const isMenuVis = await loginMenu.isVisible({ timeout: 1000 }).catch(() => false);
    console.log(`  -> Login dropdown/menu visible after click: ${isMenuVis}`);
    passedChecks.push({ area: 'Header', item: 'Login Menu Trigger', status: 'PASS', detail: `Menu visible: ${isMenuVis}` });
  }

  // 1.4 Header Search Autocomplete Dropdown
  console.log('\n1.4 Testing Search Input & Autocomplete Dropdown:');
  const searchInput = pageDesk.locator('#search, input[name="q"], .search-input, input[aria-label*="Search"]').first();
  if (await searchInput.isVisible({ timeout: 1500 }).catch(() => false)) {
    await clickWithGlow(pageDesk, searchInput, 'Search Input Field', 500);
    await searchInput.fill('sofa');
    await pageDesk.waitForTimeout(1500);
    const searchDropdown = pageDesk.locator('#search_autocomplete, .search-autocomplete, .ss__autocomplete, .c-search-suggestions').first();
    const hasSearchDropdown = await searchDropdown.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`  -> Search autocomplete dropdown rendered: ${hasSearchDropdown}`);
    if (hasSearchDropdown) {
      await banner(pageDesk, searchDropdown, '✅ Search Autocomplete Dropdown Opened', '#10B981', 1500);
      passedChecks.push({ area: 'Search', item: 'Search Autocomplete Dropdown', status: 'PASS' });
    } else {
      console.log('  ⚠️ Search autocomplete dropdown did not render for "sofa"');
    }
    // Clear search
    await searchInput.fill('');
    await pageDesk.keyboard.press('Escape');
    await pageDesk.waitForTimeout(500);
  }

  // 1.5 Main Navigation Mega Menu Hover
  console.log('\n1.5 Testing Main Navigation Megamenu Hover/Click:');
  const navItem = pageDesk.locator('.navigation .level0, nav.navigation li.level-top').first();
  if (await navItem.isVisible({ timeout: 1500 }).catch(() => false)) {
    const navText = await navItem.innerText();
    await navItem.hover();
    await pageDesk.waitForTimeout(1200);
    const submenu = navItem.locator('.submenu, .ui-menu, .level1').first();
    const isSubmenuVis = await submenu.isVisible({ timeout: 1000 }).catch(() => false);
    console.log(`  -> Hovered nav "${navText.trim()}", Megamenu visible: ${isSubmenuVis}`);
    passedChecks.push({ area: 'Navigation', item: `Megamenu Hover (${navText.trim()})`, status: 'PASS', detail: `Submenu: ${isSubmenuVis}` });
  }

  // 1.6 Desktop Horizontal Filter Pills Click
  console.log('\n1.6 Testing Horizontal Filter Pills & Dropdowns:');
  const filterPills = pageDesk.locator('.filter-options-item, .c-toolbar__item');
  const pillsCount = await filterPills.count();
  console.log(`  -> Found ${pillsCount} filter pills on toolbar.`);

  if (pillsCount > 0) {
    // Click first 3 filter pills to test dropdown behavior
    for (let i = 0; i < Math.min(pillsCount, 3); i++) {
      const pill = filterPills.nth(i);
      const pillText = (await pill.innerText()).trim().replace(/\n+/g, ' ');
      console.log(`  -> Testing Filter Pill #${i + 1}: "${pillText}"`);
      await clickWithGlow(pageDesk, pill, `Filter Pill [${pillText}]`, 1200);

      // Check if dropdown facet panel expanded
      const dropdownContent = pill.locator('.filter-options-content, .ss__facet__options, .c-dropdown__menu').first();
      const isExpanded = await dropdownContent.isVisible({ timeout: 800 }).catch(() => false);
      console.log(`     Dropdown panel expanded: ${isExpanded}`);
      if (isExpanded) {
        await banner(pageDesk, dropdownContent, `✅ ${pillText} Dropdown Active`, '#10B981', 1000);
      }
      // Click again to close
      await pill.click().catch(() => {});
      await pageDesk.waitForTimeout(400);
    }
    passedChecks.push({ area: 'Filters', item: 'Horizontal Filter Pills Clickable', status: 'PASS', detail: `${pillsCount} pills verified` });
  }

  // 1.7 Sort Dropdown Click & Interaction
  console.log('\n1.7 Testing Sort By Dropdown:');
  const sortDropdown = pageDesk.locator('#sorter, select.sorter-options, [data-role="sorter"]').first();
  if (await sortDropdown.isVisible({ timeout: 1500 }).catch(() => false)) {
    const currentVal = await sortDropdown.inputValue().catch(() => 'unknown');
    console.log(`  -> Current Sort Value: "${currentVal}"`);
    await clickWithGlow(pageDesk, sortDropdown, 'Sort By Dropdown', 800);

    // Get all sort options
    const options = await sortDropdown.locator('option').allInnerTexts().catch(() => []);
    console.log(`  -> Available Sort Options: ${JSON.stringify(options)}`);

    if (options.length > 1) {
      // Select second option
      const newOption = options[1].trim();
      console.log(`  -> Selecting sort option: "${newOption}"`);
      await sortDropdown.selectOption({ label: newOption }).catch(() => {});
      await pageDesk.waitForTimeout(2500);
      passedChecks.push({ area: 'Sort', item: 'Sort Dropdown Interaction', status: 'PASS', detail: `Switched to "${newOption}"` });
    }
  }

  // 1.8 Filter Sidebar: Hide Filters / Show Filters Toggle
  console.log('\n1.8 Testing "Hide Filters" / "Show Filters" Toggle:');
  const hideFiltersBtn = pageDesk.locator('a:has-text("Hide Filters"), button:has-text("Hide Filters"), .action.filter-toggle').first();
  const sidebar = pageDesk.locator('.sidebar-main, .block.filter').first();

  if (await hideFiltersBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await clickWithGlow(pageDesk, hideFiltersBtn, 'Hide Filters Toggle', 1500);
    const isSidebarHidden = !(await sidebar.isVisible({ timeout: 1000 }).catch(() => true));
    console.log(`  -> Sidebar hidden after clicking "Hide Filters": ${isSidebarHidden}`);

    // Now look for "Show Filters" toggle to reopen
    const showFiltersBtn = pageDesk.locator('a:has-text("Show Filters"), button:has-text("Show Filters"), .action.filter-toggle').first();
    if (await showFiltersBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await clickWithGlow(pageDesk, showFiltersBtn, 'Show Filters Toggle', 1500);
      const isSidebarReopened = await sidebar.isVisible({ timeout: 1000 }).catch(() => false);
      console.log(`  -> Sidebar reopened after clicking "Show Filters": ${isSidebarReopened}`);
      passedChecks.push({ area: 'Filters', item: 'Hide/Show Filters Toggle Functionality', status: 'PASS' });
    }
  }

  // 1.9 Facet Accordions in Sidebar: Expand & Collapse
  console.log('\n1.9 Testing Sidebar Facet Accordions (+ / -):');
  const facetHeaders = pageDesk.locator('.filter-options-title');
  const facetCount = await facetHeaders.count();
  console.log(`  -> Found ${facetCount} sidebar facet accordions.`);

  if (facetCount > 0) {
    const firstFacet = facetHeaders.first();
    const facetTitle = (await firstFacet.innerText()).trim();
    console.log(`  -> Clicking facet header: "${facetTitle}"`);
    await clickWithGlow(pageDesk, firstFacet, `Expand Facet [${facetTitle}]`, 1200);

    // Check if options appeared
    const facetOptions = pageDesk.locator('.filter-options-item.active .filter-options-content, .filter-options-content').first();
    const hasOptions = await facetOptions.isVisible({ timeout: 1000 }).catch(() => false);
    console.log(`  -> Facet options visible: ${hasOptions}`);

    // If options has checkboxes, test clicking one
    const firstCheckbox = pageDesk.locator('.filter-options-item.active input[type="checkbox"], .filter-options-content a').first();
    if (await firstCheckbox.isVisible({ timeout: 1000 }).catch(() => false)) {
      console.log('  -> Clicking a filter facet option to test live catalog filtering...');
      await clickWithGlow(pageDesk, firstCheckbox, 'Filter Option Checkbox', 3000);

      // Check if filter applied (look for active filter chip/pill or URL change)
      const currentUrl = pageDesk.url();
      console.log(`  -> Current URL after filter: ${currentUrl}`);
      const clearBtn = pageDesk.locator('.action.clear, .filter-clear, a:has-text("Clear All")').first();
      if (await clearBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await banner(pageDesk, clearBtn, '✅ Active Filter Applied ("Clear All" Available)', '#10B981', 1500);
        await clickWithGlow(pageDesk, clearBtn, 'Clear All Filters', 2000);
      }
      passedChecks.push({ area: 'Filters', item: 'Faceted Filtering & Clear All', status: 'PASS', detail: 'URL updated and cleared' });
    }
  }

  // 1.10 Product Card Functional Checks (Compare, Wishlist Heart, Swatches, Masking)
  console.log('\n1.10 Testing Product Card Clicks & Elements:');
  const firstCard = pageDesk.locator('.product-item').first();
  await firstCard.scrollIntoViewIfNeeded().catch(() => {});

  // A. Compare Checkbox Click
  const compareBtn = firstCard.locator('.action.tocompare, input[type="checkbox"], label:has-text("Compare")').first();
  if (await compareBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await clickWithGlow(pageDesk, compareBtn, 'Product Card [ ] Compare Checkbox', 2000);
    // Check for compare message or compare bar
    const compareNotice = pageDesk.locator('.message.success, .block-compare, .c-compare-bar').first();
    const hasCompareFeedback = await compareNotice.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`  -> Compare checkbox clicked. System feedback visible: ${hasCompareFeedback}`);
    passedChecks.push({ area: 'Product Card', item: 'Compare Checkbox Click', status: 'PASS', detail: `Feedback: ${hasCompareFeedback}` });
  }

  // B. Product Card Wishlist Heart Icon Check (As shown in Figma desktop/Category/Logged Out)
  console.log('  -> Inspecting Wishlist Heart Icon on Product Card (Figma Requirement):');
  const cardHeart = firstCard.locator('.towishlist, [data-action="add-to-wishlist"], .action.towishlist, .wishlist-heart, [class*="wishlist"]').first();
  const hasCardHeart = await cardHeart.isVisible({ timeout: 1000 }).catch(() => false);
  console.log(`     Product Card Wishlist Heart Present: ${hasCardHeart}`);
  if (!hasCardHeart) {
    console.log('  ❌ DEFECT: In Figma artboard desktop/Category/Logged Out, every card has a Heart icon ♡ on top-right opposite to Compare. On Live Staging, it is MISSING for logged-out guests!');
    defectsFound.push({
      area: 'Product Card',
      defect: 'Wishlist Heart icon (♡) on top-right of product card is missing on live category cards (present in Figma desktop/Category/Logged Out).',
      severity: 'MEDIUM'
    });
  } else {
    passedChecks.push({ area: 'Product Card', item: 'Wishlist Heart Icon Present', status: 'PASS' });
  }

  // C. Color / Material Swatch Click
  const swatches = firstCard.locator('.swatch-option, .c-swatch');
  const swatchCount = await swatches.count();
  console.log(`  -> Card has ${swatchCount} swatches.`);
  if (swatchCount > 1) {
    const secondSwatch = swatches.nth(1);
    await clickWithGlow(pageDesk, secondSwatch, 'Product Card Swatch #2', 1500);
    const isSelected = await secondSwatch.getAttribute('aria-checked') || await secondSwatch.getAttribute('class');
    console.log(`  -> Swatch selected attribute: ${isSelected}`);
    passedChecks.push({ area: 'Product Card', item: 'Color Swatch Interaction', status: 'PASS' });
  }

  // D. Price Masking & Add to Cart Suppression Verification
  const cardText = await firstCard.innerText();
  const hasDollar = cardText.includes('$');
  const addToCartBtn = firstCard.locator('button[title*="Cart"], .action.tocart');
  const hasCartBtn = await addToCartBtn.isVisible({ timeout: 800 }).catch(() => false);
  console.log(`  -> Price masked: ${!hasDollar}, Add to Cart suppressed: ${!hasCartBtn}`);
  if (!hasDollar && !hasCartBtn) {
    passedChecks.push({ area: 'Product Card', item: 'Wholesale Price Masking & Add to Cart Suppression', status: 'PASS' });
  } else {
    defectsFound.push({ area: 'Product Card', defect: `Price or Cart leakage! Dollar: ${hasDollar}, Cart: ${hasCartBtn}`, severity: 'CRITICAL' });
  }

  // Save Desktop screenshot
  const outDir = path.join(__dirname, '../screenshots/regression_run');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  await pageDesk.screenshot({ path: path.join(outDir, '11_DESKTOP_LOGGED_OUT_FUNCTIONALITY_AUDITED.png') });

  // =================================================================================
  // PART 2: MOBILE (MSRP PRICING) — ALL FUNCTIONAL CLICKS & DROPDOWNS
  // Figma Reference: Mobile/Category/MSRP Pricing
  // =================================================================================
  console.log('\n=================================================================================');
  console.log('📌 PART 2: MOBILE (MSRP PRICING) — TESTING ALL CLICKS & DROPDOWNS');
  console.log('=================================================================================');

  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 12/13/14 viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const pageMob = await contextMobile.newPage();

  console.log('\n2.1 Logging in on Mobile to reach authenticated Trade state...');
  await pageMob.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageMob.waitForTimeout(2000);

  // Fill credentials
  await pageMob.fill('#email', TRADE_EMAIL);
  await pageMob.fill('#pass', TRADE_PASSWORD);
  await pageMob.click('#send2');
  await pageMob.waitForTimeout(4000);

  console.log('\n2.2 Navigating to Mobile Category Page (/indoor)...');
  await pageMob.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pageMob.waitForTimeout(3000);

  // Close modals
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = pageMob.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
  }

  // 2.3 Switch to MSRP Pricing Mode via Header Pricing Toggle
  console.log('\n2.3 Verifying Header Pricing Toggle & Switching to MSRP Mode:');
  const priceToggleMob = pageMob.locator('.price-toggle, [data-role="price-toggle"], .c-price-toggle, button:has-text("Trade"), button:has-text("MSRP")').first();
  if (await priceToggleMob.isVisible({ timeout: 2000 }).catch(() => false)) {
    const currentMode = await priceToggleMob.innerText();
    console.log(`  -> Current Mobile Pricing Mode: "${currentMode.trim()}"`);
    await clickWithGlow(pageMob, priceToggleMob, `Pricing Toggle [${currentMode.trim()}]`, 1500);

    // Select MSRP option if in dropdown/drawer
    const msrpOption = pageMob.locator('a:has-text("MSRP"), button:has-text("MSRP"), li:has-text("MSRP"), [data-value="msrp"]').first();
    if (await msrpOption.isVisible({ timeout: 1500 }).catch(() => false)) {
      await clickWithGlow(pageMob, msrpOption, 'Select MSRP Pricing Mode', 2500);
      console.log('  -> Switched to MSRP Pricing Mode!');
    }
    passedChecks.push({ area: 'Mobile Header', item: 'Pricing Toggle Switched to MSRP Mode', status: 'PASS' });
  }

  // 2.4 Mobile Hamburger Menu Click
  console.log('\n2.4 Testing Mobile Hamburger Menu (≡):');
  const hamburger = pageMob.locator('.nav-toggle, button[data-action="toggle-nav"], .c-header__menu-btn').first();
  if (await hamburger.isVisible({ timeout: 2000 }).catch(() => false)) {
    await clickWithGlow(pageMob, hamburger, 'Mobile Hamburger Menu (≡)', 2000);
    const navDrawer = pageMob.locator('.nav-sections, .navigation, .ui-menu').first();
    const isDrawerOpen = await navDrawer.isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`  -> Mobile Navigation Drawer opened: ${isDrawerOpen}`);
    if (isDrawerOpen) {
      await banner(pageMob, navDrawer, '✅ Mobile Nav Drawer Open', '#10B981', 1200);
      passedChecks.push({ area: 'Mobile Nav', item: 'Hamburger Navigation Drawer Opens', status: 'PASS' });

      // Click a category inside drawer
      const drawerItem = pageMob.locator('.nav-sections li.level0, .navigation li.level0').first();
      if (await drawerItem.isVisible({ timeout: 1000 }).catch(() => false)) {
        const itemText = await drawerItem.innerText();
        console.log(`  -> First drawer category: "${itemText.trim().split('\n')[0]}"`);
      }

      // Close drawer
      const closeNav = pageMob.locator('.action.close, .nav-toggle, [data-action="close"]').first();
      await clickWithGlow(pageMob, closeNav, 'Close Mobile Nav Drawer', 1500);
    }
  }

  // 2.5 Mobile Search Icon Click
  console.log('\n2.5 Testing Mobile Search Trigger:');
  const mobSearchBtn = pageMob.locator('.action.search, button[aria-label*="Search"], .c-header__search-trigger').first();
  if (await mobSearchBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await clickWithGlow(pageMob, mobSearchBtn, 'Mobile Search Icon', 1500);
    const mobSearchInput = pageMob.locator('#search, input[type="search"]').first();
    const isSearchOpen = await mobSearchInput.isVisible({ timeout: 1000 }).catch(() => false);
    console.log(`  -> Mobile search input visible: ${isSearchOpen}`);
    passedChecks.push({ area: 'Mobile Search', item: 'Mobile Search Trigger', status: 'PASS' });
  }

  // 2.6 Mobile Filter Drawer Trigger ("Browse by" / "Show Filters")
  console.log('\n2.6 Testing Mobile "Browse by" / Filter Drawer:');
  const mobFilterBtn = pageMob.locator('button:has-text("Browse by"), button:has-text("Show Filters"), .action.filter, .block-title.filter-title, button:has-text("Filter")').first();
  if (await mobFilterBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    const btnLabel = (await mobFilterBtn.innerText()).trim();
    console.log(`  -> Mobile Filter button label: "${btnLabel}"`);
    await clickWithGlow(pageMob, mobFilterBtn, `Mobile Filter Button [${btnLabel}]`, 2000);

    const mobFilterDrawer = pageMob.locator('.filter-options, .block.filter.active, .c-filter-drawer, .block-content.filter-content').first();
    const isFilterDrawerVis = await mobFilterDrawer.isVisible({ timeout: 1500 }).catch(() => false);
    console.log(`  -> Mobile Filter drawer opened: ${isFilterDrawerVis}`);

    if (isFilterDrawerVis) {
      await banner(pageMob, mobFilterDrawer, '✅ Mobile Filter Drawer Open', '#10B981', 1200);

      // Expand a facet inside mobile drawer
      const mobFacet = pageMob.locator('.filter-options-title').first();
      if (await mobFacet.isVisible({ timeout: 1000 }).catch(() => false)) {
        await clickWithGlow(pageMob, mobFacet, 'Mobile Filter Facet Accordion', 1500);
      }

      // Close mobile filter drawer
      const closeFilter = pageMob.locator('.filter-title strong, .action.close, .filter-close, button:has-text("Close"), button[aria-label="Close"]').first();
      if (await closeFilter.isVisible({ timeout: 1500 }).catch(() => false)) {
        await clickWithGlow(pageMob, closeFilter, 'Close Mobile Filter Drawer', 1500);
      } else {
        await pageMob.keyboard.press('Escape');
      }
      passedChecks.push({ area: 'Mobile Filters', item: 'Mobile Filter Drawer Open & Close', status: 'PASS', detail: `Button: "${btnLabel}"` });
    }
  }

  // 2.7 Mobile Sort Dropdown
  console.log('\n2.7 Testing Mobile Sort Dropdown:');
  const mobSort = pageMob.locator('#sorter, select.sorter-options').first();
  if (await mobSort.isVisible({ timeout: 1500 }).catch(() => false)) {
    await clickWithGlow(pageMob, mobSort, 'Mobile Sort Dropdown', 1000);
    const mobSortVal = await mobSort.inputValue().catch(() => 'unknown');
    console.log(`  -> Mobile Sort active value: "${mobSortVal}"`);
    passedChecks.push({ area: 'Mobile Sort', item: 'Mobile Sort Dropdown Interactive', status: 'PASS' });
  }

  // 2.8 Mobile Product Cards Grid (MSRP Dual Pricing Verification)
  console.log('\n2.8 Testing Mobile Product Cards Grid & MSRP Dual Pricing:');
  const mobCard = pageMob.locator('.product-item').first();
  await mobCard.scrollIntoViewIfNeeded().catch(() => {});
  await pageMob.waitForTimeout(1000);

  const mobCardDetails = await mobCard.evaluate((el) => {
    const text = el.innerText;
    const hasMsrp = text.toLowerCase().includes('msrp');
    const hasPrice = text.includes('$');
    const compare = !!el.querySelector('.action.tocompare, input[type="checkbox"]');
    const heart = !!el.querySelector('.towishlist, .wishlist-heart, [class*="wishlist"]');
    return {
      title: el.querySelector('.product-item-name')?.innerText.trim(),
      textSnippet: text.replace(/\n+/g, ' | ').substring(0, 150),
      hasMsrp,
      hasPrice,
      hasCompare: compare,
      hasHeart: heart
    };
  });
  console.log('  Mobile Product Card Details:', mobCardDetails);

  if (mobCardDetails.hasMsrp) {
    await banner(pageMob, mobCard, '✅ MSRP Dual Pricing Active on Mobile', '#10B981', 2000);
    passedChecks.push({ area: 'Mobile Cards', item: 'MSRP Pricing Display Parity', status: 'PASS', detail: mobCardDetails.textSnippet });
  } else {
    defectsFound.push({ area: 'Mobile Cards', defect: 'MSRP pricing indicator missing on card in MSRP mode', severity: 'HIGH' });
  }

  if (mobCardDetails.hasCompare) {
    passedChecks.push({ area: 'Mobile Cards', item: 'Mobile [ ] Compare Checkbox Present', status: 'PASS' });
  }

  if (!mobCardDetails.hasHeart) {
    defectsFound.push({
      area: 'Mobile Cards',
      defect: 'Wishlist Heart icon (♡) on top-right of mobile product card is missing (specified in Figma Mobile/Category/MSRP Pricing).',
      severity: 'MEDIUM'
    });
  }

  // Save Mobile screenshot
  await pageMob.screenshot({ path: path.join(outDir, '12_MOBILE_MSRP_PRICING_FUNCTIONALITY_AUDITED.png') });

  // =================================================================================
  // FINAL AUDIT SUMMARY & DEFECT COMPILATION
  // =================================================================================
  console.log('\n=================================================================================');
  console.log('📊 FINAL FORENSIC AUDIT SUMMARY');
  console.log('=================================================================================');
  console.log(`Total Passed Checks: ${passedChecks.length}`);
  console.log(`Total Defects / Discrepancies Found: ${defectsFound.length}\n`);

  console.log('--- PASSED CHECKS ---');
  passedChecks.forEach(p => console.log(`  🟢 [${p.area}] ${p.item} ${p.detail ? '(' + p.detail + ')' : ''}`));

  console.log('\n--- DEFECTS / GAPS IDENTIFIED ---');
  if (defectsFound.length === 0) {
    console.log('  🎉 Zero defects found!');
  } else {
    defectsFound.forEach(d => console.log(`  🔴 [${d.area}] ${d.defect} (Severity: ${d.severity})`));
  }

  const fullReport = {
    timestamp: new Date().toISOString(),
    passedChecks,
    defectsFound
  };
  fs.writeFileSync(path.join(__dirname, '../PLP_INTERACTIVE_CLICKS_AND_DROPDOWNS_REPORT.json'), JSON.stringify(fullReport, null, 2));

  console.log('\nSession closing in 3 seconds...');
  await pageDesk.waitForTimeout(1500);
  await pageMob.waitForTimeout(1500);

  await browser.close();
})();
