const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const OUT_DIR_DESKTOP = path.join(BASE_DIR, 'screenshots', 'live_retest', 'desktop');
const OUT_DIR_MOBILE = path.join(BASE_DIR, 'screenshots', 'live_retest', 'mobile');

[OUT_DIR_DESKTOP, OUT_DIR_MOBILE].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const HOLDS_URL = `${US_BASE_URL}/gw_orders/hold/index/`;
const LOGIN_URL = `${US_BASE_URL}/customer/account/login/`;

const CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function highlightElement(page, selectorOrLocator, color = '#2563EB') {
  try {
    const locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
    if (await locator.isVisible({ timeout: 2000 }).catch(() => false)) {
      await locator.evaluate((el, col) => {
        el.style.outline = `3px solid ${col}`;
        el.style.outlineOffset = '2px';
        el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      }, color);
      await page.waitForTimeout(600);
    }
  } catch (e) {}
}

async function removeHighlight(page, selectorOrLocator) {
  try {
    const locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
    await locator.evaluate(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    }).catch(() => {});
  } catch (e) {}
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 COMPREHENSIVE HEADED QA AUDIT: MY ACCOUNT - HOLDS (TICKET #41794528)');
  console.log('   Target URL: https://mcstaging2.globewest.com/gw_orders/hold/index/');
  console.log('   Scope: Hold Count, Table Columns (7 vs 8), Tabs, Search, FAQs, Mobile');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 350,
    args: ['--no-sandbox', '--start-maximized']
  });

  const auditData = {
    timestamp: new Date().toISOString(),
    testedUrl: HOLDS_URL,
    user: CREDS.email,
    desktop: {},
    mobile: {}
  };

  // ===========================================================================
  // 1. DESKTOP VIEWPORT (1440x900)
  // ===========================================================================
  console.log('▶ [PHASE 1/2] RUNNING DESKTOP AUDIT (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await desktopContext.newPage();

  // Login
  console.log('   🔐 Authenticating as Trade Customer...');
  await page.goto(LOGIN_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await clearOverlays(page);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailField.fill(CREDS.email);
    await page.fill('#pass', CREDS.pass);
    await page.click('#send2');
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2500);
    console.log('   ✅ Authenticated.');
  } else {
    console.log('   ℹ️ Session already active.');
  }

  // Navigate to Holds & Hard Reload
  console.log('   👉 Loading My Holds page...');
  await page.goto(HOLDS_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await clearOverlays(page);
  await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Capture full desktop page
  await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '01_desktop_holds_full_page.png'), fullPage: true });
  await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '02_desktop_holds_viewport.png'), fullPage: false });

  // --- ITEM 1: HOLD COUNT INSPECTION ---
  console.log('\n   🔎 [1/6] Inspecting Hold Count...');
  const holdCountData = await page.evaluate(() => {
    // 1. Sidebar Links
    const sidebarItems = Array.from(document.querySelectorAll('.block-collapsible-nav li, .account-nav li, .sidebar li, nav.account-nav a, .account-nav a')).map(el => {
      const text = el.innerText.trim().replace(/\s+/g, ' ');
      const badge = el.querySelector('.badge, .count, [class*="count"], [class*="badge"], span span');
      return {
        fullText: text,
        hasBadge: !!badge,
        badgeText: badge ? badge.innerText.trim() : null
      };
    });

    const holdsSidebar = sidebarItems.find(i => i.fullText.toLowerCase().includes('hold'));

    // 2. Page Title / Subtitle
    const titleEl = document.querySelector('.page-title-wrapper, h1, .account-listing-ui__title');
    const titleText = titleEl ? titleEl.innerText.trim() : '';

    // 3. Status Tabs Counts (e.g. ACTIVE (0), INACTIVE (0))
    const filterTabs = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter')).map(f => f.innerText.trim());

    // 4. Any element with class containing count or hold
    const allCounts = Array.from(document.querySelectorAll('[class*="count"], [class*="badge"]')).map(el => ({
      parent: el.parentElement ? el.parentElement.innerText.trim() : '',
      text: el.innerText.trim(),
      className: el.className
    }));

    return {
      holdsSidebar,
      titleText,
      filterTabs,
      allCounts,
      sidebarItems: sidebarItems.filter(i => ['quote', 'hold', 'order', 'invoice'].some(k => i.fullText.toLowerCase().includes(k)))
    };
  });

  console.log('      Sidebar Holds Item:', holdCountData.holdsSidebar);
  console.log('      Relevant Sidebar Counts:', holdCountData.sidebarItems);
  console.log('      Tabs text:', holdCountData.filterTabs);
  auditData.desktop.holdCount = holdCountData;

  // Highlight and capture sidebar holds link
  const sidebarHoldsLink = page.locator('.account-nav a:has-text("Holds"), .block-collapsible-nav a:has-text("Holds"), li:has-text("Holds")').first();
  if (await sidebarHoldsLink.isVisible().catch(() => false)) {
    await highlightElement(page, sidebarHoldsLink, '#22C55E');
    await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '03_sidebar_holds_count_highlight.png') });
    await removeHighlight(page, sidebarHoldsLink);
  }

  // --- ITEM 2: TABLE COLUMNS & ARCHITECTURE (7 vs 8) ---
  console.log('\n   🔎 [2/6] Inspecting Table Column Reduction (Expected 7 vs Actual)...');
  const tableData = await page.evaluate(() => {
    const thEls = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th'));
    const headers = thEls.map(th => th.innerText.trim().replace(/\s+/g, ' '));
    const hasActions = headers.some(h => h.toUpperCase().includes('ACTION'));
    const hasCustP0 = headers.some(h => h.includes('P0#')); // Check typo P-zero
    const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\s+/g, ' '));
    });
    const emptyState = document.querySelector('.message.info, .table-wrapper .message, .empty');

    return {
      columnCount: headers.length,
      headers,
      hasActions,
      hasCustP0,
      rowCount: rows.length,
      rows,
      emptyMessage: emptyState ? emptyState.innerText.trim() : null
    };
  });

  console.log('      Headers:', tableData.headers);
  console.log('      Column Count:', tableData.columnCount);
  console.log('      Has Actions Column:', tableData.hasActions);
  console.log('      Has Cust P0# Typo:', tableData.hasCustP0);
  auditData.desktop.table = tableData;

  const tableArea = page.locator('.table-wrapper, table, .block-orders').first();
  if (await tableArea.isVisible().catch(() => false)) {
    await highlightElement(page, tableArea, tableData.hasActions ? '#EF4444' : '#22C55E');
    await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '04_table_area_columns.png') });
    await removeHighlight(page, tableArea);
  }

  // --- ITEM 3: STATUS FILTER TABS (ACTIVE vs INACTIVE) ---
  console.log('\n   🔎 [3/6] Inspecting Status Filter Tabs...');
  const tabsData = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter'));
    return tabs.map(tab => {
      const comp = window.getComputedStyle(tab);
      return {
        text: tab.innerText.trim(),
        isActive: tab.classList.contains('is-active') || tab.classList.contains('active'),
        bgColor: comp.backgroundColor,
        color: comp.color,
        fontWeight: comp.fontWeight,
        borderRadius: comp.borderRadius,
        padding: comp.padding
      };
    });
  });
  console.log('      Tabs Data:', tabsData);
  auditData.desktop.tabs = tabsData;

  // Click INACTIVE
  const inactiveBtn = page.locator('.account-listing-ui__filters__filter:has-text("INACTIVE")').first();
  if (await inactiveBtn.isVisible().catch(() => false)) {
    console.log('      Clicking "INACTIVE" tab...');
    await inactiveBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '05_inactive_tab_view.png') });

    // Click back to ACTIVE
    const activeBtn = page.locator('.account-listing-ui__filters__filter:has-text("ACTIVE")').first();
    if (await activeBtn.isVisible().catch(() => false)) {
      console.log('      Clicking back to "ACTIVE" tab...');
      await activeBtn.click();
      await page.waitForTimeout(2000);
    }
  }

  // --- ITEM 4: SEARCH BAR INSPECTION ---
  console.log('\n   🔎 [4/6] Inspecting Search Bar Alignment & Input...');
  const searchInput = page.locator('.account-listing-ui__search input, input[placeholder*="Search"], .search-form input, #search_holds').first();
  if (await searchInput.isVisible().catch(() => false)) {
    await highlightElement(page, searchInput, '#2563EB');
    await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '06_search_bar_desktop.png') });
    await removeHighlight(page, searchInput);
  }

  // --- ITEM 5: FAQ ACCORDION BLOCK ---
  console.log('\n   🔎 [5/6] Inspecting FAQ Accordions (Single-Open Rule)...');
  const faqHeading = page.locator('text=Frequently Asked Questions').first();
  if (await faqHeading.isVisible().catch(() => false)) {
    await faqHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '07_faq_closed_state.png') });

    const faqItems = page.locator('h3:has-text("Frequently asked question content goes here"), [data-role="collapsible"], .accordion-title');
    const faqCount = await faqItems.count();
    if (faqCount >= 2) {
      console.log('      Expanding FAQ #1...');
      await faqItems.nth(0).click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '08_faq_item_1_open.png') });

      console.log('      Clicking FAQ #2 (Verifying single-open collapse)...');
      await faqItems.nth(1).click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '09_faq_item_2_open_item_1_collapsed.png') });
    }
  }

  // --- ITEM 6: CUSTOMER SUPPORT BLOCK ---
  console.log('\n   🔎 [6/6] Inspecting Need Help / Sales Support Block...');
  const supportBlock = page.locator('text=Need help? Contact our sales team, text=Contact our sales team').first();
  if (await supportBlock.isVisible().catch(() => false)) {
    await supportBlock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await highlightElement(page, supportBlock, '#2563EB');
    await page.screenshot({ path: path.join(OUT_DIR_DESKTOP, '10_support_block_desktop.png') });
    await removeHighlight(page, supportBlock);
  }

  await page.close();
  await desktopContext.close();

  // ===========================================================================
  // 2. MOBILE VIEWPORT (390x844)
  // ===========================================================================
  console.log('\n▶ [PHASE 2/2] RUNNING MOBILE AUDIT (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });
  const pageMobile = await mobileContext.newPage();

  // Login on Mobile
  console.log('   🔐 Authenticating on Mobile...');
  await pageMobile.goto(LOGIN_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await pageMobile.waitForTimeout(2000);
  await clearOverlays(pageMobile);

  const emailMobile = pageMobile.locator('#email');
  if (await emailMobile.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailMobile.fill(CREDS.email);
    await pageMobile.fill('#pass', CREDS.pass);
    await pageMobile.click('#send2');
    await pageMobile.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await pageMobile.waitForTimeout(2500);
  }

  // Navigate to Holds
  console.log('   👉 Loading My Holds on Mobile...');
  await pageMobile.goto(HOLDS_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await pageMobile.waitForTimeout(3000);
  await clearOverlays(pageMobile);

  await pageMobile.screenshot({ path: path.join(OUT_DIR_MOBILE, '01_mobile_holds_full_page.png'), fullPage: true });
  await pageMobile.screenshot({ path: path.join(OUT_DIR_MOBILE, '02_mobile_holds_viewport.png'), fullPage: false });

  // Inspect Mobile Hold Count & Navigation
  const mobileData = await pageMobile.evaluate(() => {
    // Check account select/dropdown on mobile (e.g. "Holds" dropdown)
    const selectEl = document.querySelector('select.account-nav, .current-item, .block-collapsible-nav');
    const selectText = selectEl ? selectEl.innerText.trim() : '';

    // Mobile table headers
    const ths = Array.from(document.querySelectorAll('table thead th, th')).map(th => th.innerText.trim());
    return {
      selectText,
      mobileHeaders: ths,
      hasActions: ths.some(h => h.toUpperCase().includes('ACTION'))
    };
  });

  console.log('      Mobile Navigation / Header:', mobileData.selectText);
  console.log('      Mobile Table Headers:', mobileData.mobileHeaders);
  console.log('      Mobile Has Actions Column:', mobileData.hasActions);
  auditData.mobile = mobileData;

  const mobileTableArea = pageMobile.locator('.table-wrapper, table, .page-main').first();
  if (await mobileTableArea.isVisible().catch(() => false)) {
    await pageMobile.screenshot({ path: path.join(OUT_DIR_MOBILE, '03_mobile_holds_table_area.png') });
  }

  await pageMobile.close();
  await mobileContext.close();

  // Save Final Audit Report
  fs.writeFileSync(path.join(BASE_DIR, 'latest_headed_retest_results.json'), JSON.stringify(auditData, null, 2));
  console.log('\n💾 Saved comprehensive audit data to latest_headed_retest_results.json');

  console.log('\n========================================================================');
  console.log('✅ COMPREHENSIVE HEADED AUDIT FINISHED SUCCESSFULLY!');
  console.log('========================================================================\n');

  await browser.close();
})();
