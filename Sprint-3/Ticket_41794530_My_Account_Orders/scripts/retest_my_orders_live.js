const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const RETEST_DIR = path.resolve(__dirname, '../retest_results');
if (!fs.existsSync(RETEST_DIR)) fs.mkdirSync(RETEST_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 RUNNING COMPREHENSIVE HEADED QA RETEST: TICKET #41794530');
  console.log('   Target: My Account - Orders (https://mcstaging2.globewest.com/gw_orders/order/index/)');
  console.log('   Figma Benchmark: Node 2581-64348 / Frame 624 Spec');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300, // Smooth pacing so user visually tracks every interaction
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  const report = {
    timestamp: new Date().toISOString(),
    ticket: '#41794530 - My Account - Orders',
    url: 'https://mcstaging2.globewest.com/gw_orders/order/index/',
    testResults: {}
  };

  try {
    // =========================================================================
    // STEP 1: AUTHENTICATION AS TRADE CUSTOMER
    // =========================================================================
    console.log('▶ [Step 1/7] Trade Customer Authentication...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('#email');
    if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   🔐 Submitting trade credentials (deepali.londhe@overdose.digital)...');
      await emailInput.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
      console.log('   ✅ Authenticated successfully.');
    } else {
      console.log('   ℹ️ Existing session active.');
    }

    // =========================================================================
    // STEP 2: LOAD MY ORDERS WITH HARD RELOAD
    // =========================================================================
    console.log('\n▶ [Step 2/7] Navigating to My Orders & Hard Reloading...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(RETEST_DIR, '01_desktop_retest_full_page.png'), fullPage: true });
    await page.screenshot({ path: path.join(RETEST_DIR, '02_desktop_retest_viewport.png'), fullPage: false });
    console.log('   📸 Captured Desktop Full Page & Initial Viewport.');

    // =========================================================================
    // STEP 3: STATUS FILTER TABS AUDIT (FRAME 624 RULE 1)
    // =========================================================================
    console.log('\n▶ [Step 3/7] Retesting Status Filter Tabs...');
    const tabsData = await page.evaluate(() => {
      const filters = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter'));
      return filters.map(el => {
        const computed = window.getComputedStyle(el);
        return {
          text: el.innerText.trim(),
          isActive: el.classList.contains('is-active') || el.classList.contains('active'),
          classes: el.className,
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          borderRadius: computed.borderRadius,
          padding: computed.padding,
          fontWeight: computed.fontWeight
        };
      });
    });

    console.log('   Filter Tabs Detected:', tabsData);
    const defaultTab = tabsData.find(t => t.isActive);
    const hasAwaitingPayment = tabsData.some(t => t.text.toLowerCase().includes('awaiting payment'));
    const hasPendingShipment = tabsData.some(t => t.text.toLowerCase().includes('pending shipment'));
    const hasDispatched = tabsData.some(t => t.text.toLowerCase().includes('dispatched'));
    const hasClosed = tabsData.some(t => t.text.toLowerCase().includes('closed'));
    const isDefaultAwaitingPayment = defaultTab && defaultTab.text.toLowerCase().includes('awaiting payment');

    report.testResults.statusTabs = {
      status: (isDefaultAwaitingPayment && hasAwaitingPayment && hasPendingShipment && hasDispatched && hasClosed) ? 'PASS' : 'FAIL',
      defaultTab: defaultTab ? defaultTab.text : 'NONE',
      tabs: tabsData,
      isDefaultAwaitingPayment,
      hasRequiredFourTabs: (hasAwaitingPayment && hasPendingShipment && hasDispatched && hasClosed)
    };
    console.log(`   ⭐ Status Tabs Verdict: ${report.testResults.statusTabs.status}`);

    const tabsContainer = page.locator('.account-listing-ui__filters, .account-listing-ui__filters__wrapper').first();
    if (await tabsContainer.isVisible().catch(() => false)) {
      await tabsContainer.screenshot({ path: path.join(RETEST_DIR, '03_retest_status_tabs_container.png') });
      console.log('   📸 Captured Status Tabs Container.');
    }

    // Test clicking tabs
    const pendingTab = page.locator('.account-listing-ui__filters__filter:has-text("Pending Shipment")').first();
    if (await pendingTab.isVisible().catch(() => false)) {
      console.log('   Clicking "Pending Shipment" tab...');
      await pendingTab.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(RETEST_DIR, '04_retest_pending_shipment_tab.png') });
    }

    const awaitingTab = page.locator('.account-listing-ui__filters__filter:has-text("Awaiting Payment")').first();
    if (await awaitingTab.isVisible().catch(() => false)) {
      console.log('   Clicking back to "Awaiting Payment" tab...');
      await awaitingTab.click();
      await page.waitForTimeout(2000);
    }

    // =========================================================================
    // STEP 4: TABLE COLUMNS AUDIT (FRAME 624 RULE 2 & 3)
    // =========================================================================
    console.log('\n▶ [Step 4/7] Retesting Table Column Reduction & Headers...');
    const tableData = await page.evaluate(() => {
      const ths = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.innerText.trim());
      const hasDetails = ths.some(h => h.toUpperCase().includes('DETAILS'));
      const hasCustPo = ths.some(h => h.toUpperCase().includes('CUST PO'));
      const hasOrderName = ths.some(h => h.toUpperCase().includes('ORDER NAME'));
      const hasClientName = ths.some(h => h.toUpperCase().includes('CLIENT NAME'));
      
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map((tr, idx) => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
        const orderLink = tr.querySelector('td:first-child a, a[href*="order_id"]');
        const actionsBtn = tr.querySelector('.action.dropdown, [data-action="customer-order-dropdown"], button[class*="action"], .actions-menu');
        return {
          row: idx + 1,
          cells,
          hasOrderLink: !!orderLink,
          orderLinkHref: orderLink ? orderLink.getAttribute('href') : null,
          hasActionsBtn: !!actionsBtn
        };
      });

      return {
        headers: ths,
        columnCount: ths.length,
        hasDetails,
        hasCustPo,
        hasOrderName,
        hasClientName,
        rows
      };
    });

    console.log('   Headers detected:', tableData.headers);
    console.log('   Column count:', tableData.columnCount, '(Figma Spec: 5-6 columns)');
    const tableColumnsPass = tableData.columnCount <= 6 && !tableData.hasDetails && !tableData.hasCustPo && !tableData.hasOrderName && !tableData.hasClientName;

    report.testResults.tableColumns = {
      status: tableColumnsPass ? 'PASS' : 'FAIL',
      columnCount: tableData.columnCount,
      headers: tableData.headers,
      unwantedColumnsPresent: {
        hasDetails: tableData.hasDetails,
        hasCustPo: tableData.hasCustPo,
        hasOrderName: tableData.hasOrderName,
        hasClientName: tableData.hasClientName
      },
      rows: tableData.rows
    };
    console.log(`   ⭐ Table Columns Verdict: ${report.testResults.tableColumns.status}`);

    const tableEl = page.locator('table, .table-wrapper, .table-order-items').first();
    if (await tableEl.isVisible().catch(() => false)) {
      await tableEl.screenshot({ path: path.join(RETEST_DIR, '05_retest_table_structure.png') });
      console.log('   📸 Captured Orders Table Component.');
    }

    // =========================================================================
    // STEP 5: FAQ ACCORDION BLOCK AUDIT & SINGLE-OPEN CHECK (FRAME 624 FAQ SPEC)
    // =========================================================================
    console.log('\n▶ [Step 5/7] Retesting Frequently Asked Questions (FAQ) Module & Single-Open Collapse...');
    const faqHeading = page.locator('text=Frequently Asked Questions, h2:has-text("Frequently"), h3:has-text("Frequently")').first();
    
    if (await faqHeading.isVisible().catch(() => false)) {
      await faqHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(RETEST_DIR, '06_retest_faq_initial_closed_state.png') });

      // Click FAQ item 1
      const faqItem1 = page.locator('[data-role="collapsible"], [data-role="title"], .accordion-title, text=Frequently asked question content goes here').first();
      console.log('   Clicking FAQ Item #1...');
      await faqItem1.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(RETEST_DIR, '07_retest_faq_item_1_expanded.png') });

      // Click FAQ item 2
      const faqItem2 = page.locator('[data-role="collapsible"], [data-role="title"], .accordion-title, text=Frequently asked question content goes here').nth(1);
      console.log('   Clicking FAQ Item #2 (Must collapse Item #1 per Frame 624 rule)...');
      await faqItem2.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(RETEST_DIR, '08_retest_faq_item_2_expanded.png') });

      // Check how many items are open
      const faqOpenCheck = await page.evaluate(() => {
        const panels = Array.from(document.querySelectorAll('[data-role="content"], .accordion-content, [aria-hidden="false"]'));
        const visiblePanels = panels.filter(el => {
          const s = window.getComputedStyle(el);
          return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetHeight > 0;
        });

        const titles = Array.from(document.querySelectorAll('[data-role="collapsible"], [data-role="title"], .accordion-title, h3'))
          .filter(el => el.innerText.toLowerCase().includes('frequently asked question'));

        const activeTitles = titles.filter(el => el.classList.contains('active') || el.classList.contains('is-open') || el.getAttribute('aria-expanded') === 'true');

        return {
          visiblePanelCount: visiblePanels.length,
          activeTitleCount: activeTitles.length,
          violatesSingleOpen: visiblePanels.length > 1 || activeTitles.length > 1
        };
      });

      console.log('   FAQ Single-Open Evaluation:', faqOpenCheck);
      const faqPass = !faqOpenCheck.violatesSingleOpen && faqOpenCheck.visiblePanelCount === 1;

      report.testResults.faqSingleOpen = {
        status: faqPass ? 'PASS' : 'FAIL (Defect: Multiple open simultaneously)',
        visiblePanels: faqOpenCheck.visiblePanelCount,
        activeTitles: faqOpenCheck.activeTitleCount,
        violatesSingleOpen: faqOpenCheck.violatesSingleOpen
      };
      console.log(`   ⭐ FAQ Single-Open Verdict: ${report.testResults.faqSingleOpen.status}`);
    } else {
      console.log('   ❌ FAQ Section Not Found!');
      report.testResults.faqSingleOpen = { status: 'FAIL (FAQ not found)' };
    }

    // =========================================================================
    // STEP 6: SUPPORT BLOCK ("NEED TO CHANGE AN ORDER?") AUDIT
    // =========================================================================
    console.log('\n▶ [Step 6/7] Retesting Customer Support Block & Strikethrough Line Glitch...');
    const supportBlockData = await page.evaluate(() => {
      const allText = document.body.innerText;
      const hasSupportHeading = allText.toLowerCase().includes('need to change an order');
      const hasAusPhone = allText.includes('+613') || allText.includes('9518 1600') || allText.includes('+61 3');
      const hasAusEmail = allText.includes('sales@globewest.com.au');
      const hasUsPhone = allText.includes('1-800') || allText.includes('800') || allText.includes('+1');
      const hasUsEmail = allText.includes('sales@globewest.com') && !allText.includes('.com.au');

      const supportHeadingEl = Array.from(document.querySelectorAll('*')).find(el => el.children.length === 0 && el.innerText.trim().toLowerCase() === 'need to change an order?');
      const container = supportHeadingEl ? supportHeadingEl.closest('div, section, .block') : null;

      let hasHrOverlap = false;
      let containerText = '';
      if (container) {
        containerText = container.innerText.trim();
        const hr = container.querySelector('hr');
        if (hr) {
          const hrRect = hr.getBoundingClientRect();
          const p = container.querySelector('p');
          if (p) {
            const pRect = p.getBoundingClientRect();
            // Check if hr overlaps vertically with text
            hasHrOverlap = !(hrRect.bottom < pRect.top || hrRect.top > pRect.bottom);
          }
        }
      }

      return {
        hasSupportHeading,
        hasAusPhone,
        hasAusEmail,
        hasUsPhone,
        hasUsEmail,
        hasHrOverlap,
        containerText
      };
    });

    console.log('   Support Block Data:', supportBlockData);
    const supportBlockEl = page.locator('text=Need to change an order?').first();
    if (await supportBlockEl.isVisible().catch(() => false)) {
      await supportBlockEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await supportBlockEl.screenshot({ path: path.join(RETEST_DIR, '09_retest_support_block.png') });
      console.log('   📸 Captured Support Block.');
    }

    report.testResults.supportBlock = {
      status: (!supportBlockData.hasAusPhone && !supportBlockData.hasAusEmail && !supportBlockData.hasHrOverlap) ? 'PASS' : 'FAIL (Defect: AU info leak or Line overlap)',
      hasAusPhone: supportBlockData.hasAusPhone,
      hasAusEmail: supportBlockData.hasAusEmail,
      hasUsPhone: supportBlockData.hasUsPhone,
      hasUsEmail: supportBlockData.hasUsEmail,
      hasHrOverlap: supportBlockData.hasHrOverlap,
      snippet: supportBlockData.containerText.substring(0, 200)
    };
    console.log(`   ⭐ Support Block Verdict: ${report.testResults.supportBlock.status}`);

    // =========================================================================
    // STEP 7: SIDEBAR NUMERICAL COUNT BADGES AUDIT
    // =========================================================================
    console.log('\n▶ [Step 7/7] Retesting Sidebar Numerical Count Badges...');
    const sidebarBadges = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item a, .account-nav a, .sidebar a'))
        .filter(a => ['Quotes', 'Holds', 'Orders', 'Invoices'].some(term => a.innerText.includes(term)));

      return items.map(a => {
        const countSpan = a.querySelector('.count, .badge, [class*="count"]');
        const text = a.innerText.trim();
        const hasNumberInText = /\(\d+\)|\[\d+\]|\d+/.test(text.replace(/^[a-zA-Z\s&]+/, ''));
        return {
          title: text,
          hasBadgeElement: !!countSpan,
          badgeContent: countSpan ? countSpan.innerText.trim() : null,
          hasNumber: hasNumberInText
        };
      });
    });

    console.log('   Sidebar Items Detected:', sidebarBadges);
    const anyBadgeFound = sidebarBadges.some(b => b.hasBadgeElement || b.hasNumber);
    report.testResults.sidebarBadges = {
      status: anyBadgeFound ? 'PASS' : 'FAIL (Zero count badges rendered)',
      items: sidebarBadges
    };
    console.log(`   ⭐ Sidebar Badges Verdict: ${report.testResults.sidebarBadges.status}`);

    // Capture sidebar
    const sidebarEl = page.locator('.sidebar, .block-collapsible-nav').first();
    if (await sidebarEl.isVisible().catch(() => false)) {
      await sidebarEl.screenshot({ path: path.join(RETEST_DIR, '10_retest_sidebar_navigation.png') });
      console.log('   📸 Captured Sidebar Navigation.');
    }

    // =========================================================================
    // SAVE STRUCTURED JSON REPORT
    // =========================================================================
    fs.writeFileSync(path.join(RETEST_DIR, 'retest_orders_report.json'), JSON.stringify(report, null, 2));
    console.log('\n💾 Saved exhaustive retest results to retest_orders_report.json');

    await page.waitForTimeout(4000); // Allow user to view final on-screen headed state
    await browser.close();
    console.log('========================================================================');
    console.log('✅ COMPREHENSIVE HEADED QA RETEST COMPLETED SUCCESSFULLY!');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Retest failed with error:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
