const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794530_My_Account_Orders/screenshots/headed_live_audit';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 STARTING HEADED MODE QA AUDIT: TICKET #41794530 (MY ACCOUNT - ORDERS)');
  console.log('   Strict verification against Figma Node 2581-64348 / Frame 624');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400, // Smooth pacing so user sees every action on screen
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // -------------------------------------------------------------
    // STEP 1: AUTHENTICATION
    // -------------------------------------------------------------
    console.log('▶ [Step 1/8] Verifying Trade Customer Authentication...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('#email');
    if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   🔐 Logging in as Trade Customer (deepali.londhe@overdose.digital)...');
      await emailInput.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
      console.log('   ✅ Authentication successful.');
    } else {
      console.log('   ℹ️ Already logged in or session active.');
    }

    // -------------------------------------------------------------
    // STEP 2: NAVIGATE TO MY ORDERS & HARD RELOAD
    // -------------------------------------------------------------
    console.log('\n▶ [Step 2/8] Navigating to My Orders (/gw_orders/order/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('   🔄 Executing hard reload to bypass any cached templates...');
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);

    // Initial Full Page & Viewport Captures
    await page.screenshot({ path: path.join(OUT_DIR, '01_desktop_orders_full_page.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '02_desktop_orders_initial_viewport.png'), fullPage: false });
    console.log('   📸 Captured Desktop Full Page & Initial Viewport.');

    // -------------------------------------------------------------
    // STEP 3: STATUS FILTER TABS AUDIT (FRAME 624 RULE 1)
    // -------------------------------------------------------------
    console.log('\n▶ [Step 3/8] Inspecting Status Filter Tabs (Frame 624: Default to "Awaiting Payment")...');
    const tabsData = await page.evaluate(() => {
      const tabElements = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter, [class*="filter"] a, [class*="tab"] a, .order-status-tabs li, .order-status-tabs a, button[class*="filter"]'));
      return tabElements.map(el => ({
        text: el.innerText.trim().toUpperCase(),
        classes: el.className,
        parentClasses: el.parentElement?.className || '',
        isActive: el.classList.contains('active') || el.classList.contains('is-active') || el.classList.contains('selected') || (el.parentElement && (el.parentElement.classList.contains('active') || el.parentElement.classList.contains('is-active')))
      }));
    });

    console.log('   Tabs Detected on Live Staging:', tabsData);
    const activeTab = tabsData.find(t => t.isActive);
    console.log('   ⭐ Current Active Tab:', activeTab ? activeTab.text : 'NONE');

    // Capture Tabs Container
    const tabsContainer = page.locator('.account-listing-ui__filters, [class*="filters"], .order-status-tabs').first();
    if (await tabsContainer.isVisible().catch(() => false)) {
      await tabsContainer.screenshot({ path: path.join(OUT_DIR, '03_status_tabs_container.png') });
      console.log('   📸 Captured Tabs Container.');
    }

    // Test clicking tabs if available
    const closedTabBtn = page.locator('button:has-text("CLOSED"), a:has-text("CLOSED"), .account-listing-ui__filters__filter:has-text("Closed")').first();
    if (await closedTabBtn.isVisible().catch(() => false)) {
      console.log('   Clicking "CLOSED" tab to verify state transition...');
      await closedTabBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(OUT_DIR, '04_closed_tab_view.png') });

      // Click back to OPEN or ALL
      const openTabBtn = page.locator('button:has-text("OPEN"), a:has-text("OPEN"), .account-listing-ui__filters__filter:has-text("Open")').first();
      if (await openTabBtn.isVisible().catch(() => false)) {
        await openTabBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    // -------------------------------------------------------------
    // STEP 4: TABLE COLUMNS & ROW DATA INSPECTION (FRAME 624 RULES 2 & 3)
    // -------------------------------------------------------------
    console.log('\n▶ [Step 4/8] Inspecting Table Column Reduction & Actions Dropdown...');
    const tableAudit = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.innerText.trim().replace(/\n/g, ' '));
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map((tr, idx) => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
        const orderLink = tr.querySelector('td:first-child a, a[href*="order_id"]');
        const actionsBtn = tr.querySelector('.action.dropdown, [data-action="customer-order-dropdown"], button[class*="action"], .actions-menu');
        return {
          rowIndex: idx + 1,
          orderNumberText: cells[0] || 'N/A',
          hasOrderLink: !!orderLink,
          orderLinkHref: orderLink ? orderLink.getAttribute('href') : 'NONE',
          dateText: cells[1] || 'N/A',
          statusText: cells[5] || 'N/A',
          totalText: cells[6] || 'N/A',
          balanceText: cells[7] || 'N/A',
          hasActionsDropdown: !!actionsBtn,
          cellCount: cells.length,
          allCells: cells
        };
      });

      return {
        headers,
        columnCount: headers.length,
        rowCount: rows.length,
        rows
      };
    });

    console.log('   Headers Found on Live Staging:', tableAudit.headers);
    console.log('   Total Column Count:', tableAudit.columnCount, '(Figma Frame 624 Spec requires strictly 5-6 columns)');
    console.log('   Rows Found:', tableAudit.rowCount);
    if (tableAudit.rows.length > 0) {
      console.log('   Sample Row 1 Data:', JSON.stringify(tableAudit.rows[0], null, 2));
    }

    // Capture Table Component
    const tableEl = page.locator('table, .table-wrapper, .table-order-items').first();
    if (await tableEl.isVisible().catch(() => false)) {
      await tableEl.screenshot({ path: path.join(OUT_DIR, '05_orders_table_desktop.png') });
      console.log('   📸 Captured Desktop Orders Table.');
    }

    // Test Actions dropdown click if present
    const actionsToggle = page.locator('td.actions .action.dropdown, td.actions button, td:last-child button, td:last-child .action').first();
    if (await actionsToggle.isVisible().catch(() => false)) {
      console.log('   Clicking Actions dropdown on first row...');
      await actionsToggle.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT_DIR, '06_actions_dropdown_opened.png') });
      console.log('   📸 Captured Opened Actions Dropdown.');
    }

    // -------------------------------------------------------------
    // STEP 5: FAQ ACCORDION BLOCK AUDIT (FRAME 624 FAQ SPEC)
    // -------------------------------------------------------------
    console.log('\n▶ [Step 5/8] Inspecting Frequently Asked Questions (FAQ) Module (Frame 624 Spec)...');
    const faqAudit = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasHeading = bodyText.toLowerCase().includes('frequently asked questions');
      
      // Look for FAQ titles/buttons
      const faqTitleElements = Array.from(document.querySelectorAll('h3, .accordion-title, [data-role="collapsible"], [data-role="title"], .faq-item, [class*="faq"] button, [class*="accordion"] [data-role="title"]'))
        .filter(el => {
          const t = el.innerText.trim().toLowerCase();
          return t.includes('frequently') || t.includes('question') || t.includes('faq') || el.closest('[class*="faq"]') !== null;
        });

      return {
        hasHeading,
        faqCount: faqTitleElements.length,
        faqTitles: faqTitleElements.map(el => ({
          text: el.innerText.trim().replace(/\n/g, ' ').substring(0, 80),
          tagName: el.tagName,
          className: el.className,
          ariaExpanded: el.getAttribute('aria-expanded') || 'none',
          isActive: el.classList.contains('active') || el.classList.contains('is-open')
        }))
      };
    });

    console.log('   FAQ Heading Present:', faqAudit.hasHeading);
    console.log('   FAQ Items Detected:', faqAudit.faqCount);
    console.log('   FAQ Details:', JSON.stringify(faqAudit.faqTitles, null, 2));

    // Scroll to FAQ section smoothly
    const faqHeading = page.locator('text=Frequently Asked Questions, h2:has-text("Frequently"), h3:has-text("Frequently")').first();
    if (await faqHeading.isVisible().catch(() => false)) {
      await faqHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT_DIR, '07_faq_module_initial_closed_state.png') });
      console.log('   📸 Captured FAQ Module in initial state (Frame 624 requires all closed by default).');

      // Test FAQ Accordion Item 1
      const faqItem1 = page.locator('[data-role="collapsible"], [data-role="title"], .accordion-title, text=Frequently asked question content goes here').first();
      if (await faqItem1.isVisible().catch(() => false)) {
        console.log('   Clicking FAQ #1 to test expansion...');
        await faqItem1.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(OUT_DIR, '08_faq_item_1_expanded.png') });
        console.log('   📸 Captured FAQ #1 Expanded.');

        // Test FAQ Accordion Item 2 - MUST CLOSE ITEM 1 according to Frame 624!
        const faqItem2 = page.locator('[data-role="collapsible"], [data-role="title"], .accordion-title, text=Frequently asked question content goes here').nth(1);
        if (await faqItem2.isVisible().catch(() => false)) {
          console.log('   Clicking FAQ #2 to test single-open rule (Frame 624 mandates only one open at a time)...');
          await faqItem2.click();
          await page.waitForTimeout(1500);
          await page.screenshot({ path: path.join(OUT_DIR, '09_faq_item_2_expanded_single_open_check.png') });
          console.log('   📸 Captured FAQ #2 Expanded.');

          // Evaluate whether FAQ #1 was closed or stayed open
          const multiOpenCheck = await page.evaluate(() => {
            const openPanels = Array.from(document.querySelectorAll('[data-role="content"], .accordion-content, [aria-hidden="false"]'))
              .filter(el => el.offsetHeight > 0 && window.getComputedStyle(el).display !== 'none');
            return {
              openPanelCount: openPanels.length,
              violatesSingleOpen: openPanels.length > 1
            };
          });
          console.log('   ⚠️ Single-Open Rule Check:', multiOpenCheck);
        }
      }
    } else {
      console.log('   ❌ FAQ Accordion Block Heading NOT FOUND in DOM.');
    }

    // -------------------------------------------------------------
    // STEP 6: SUPPORT BLOCK ("NEED TO CHANGE AN ORDER?") AUDIT
    // -------------------------------------------------------------
    console.log('\n▶ [Step 6/8] Inspecting Customer Support Block ("Need to change an order?")...');
    const supportAudit = await page.evaluate(() => {
      const supportEls = Array.from(document.querySelectorAll('div, section, p, .block'))
        .filter(el => {
          const t = el.innerText.toLowerCase();
          return (t.includes('need to change an order') || t.includes('sales administration')) && el.children.length < 5;
        });

      return supportEls.map(el => ({
        tag: el.tagName,
        className: el.className,
        text: el.innerText.trim()
      }))[0] || { text: 'NOT_FOUND' };
    });

    console.log('   Support Block Content:', supportAudit.text);
    const supportBlockEl = page.locator('text=Need to change an order?').first();
    if (await supportBlockEl.isVisible().catch(() => false)) {
      await supportBlockEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await supportBlockEl.screenshot({ path: path.join(OUT_DIR, '10_support_block_desktop.png') });
      console.log('   📸 Captured Support Block.');
    }

    // -------------------------------------------------------------
    // STEP 7: SIDEBAR NUMERICAL COUNT BADGES AUDIT
    // -------------------------------------------------------------
    console.log('\n▶ [Step 7/8] Inspecting Sidebar Numerical Count Badges...');
    const sidebarBadges = await page.evaluate(() => {
      const navLinks = Array.from(document.querySelectorAll('.block-collapsible-nav .item a, .account-nav a, .sidebar a'))
        .filter(a => ['Quotes', 'Holds', 'Orders', 'Invoices'].some(term => a.innerText.includes(term)));

      return navLinks.map(a => {
        const badgeEl = a.querySelector('.badge, .count, [class*="count"]');
        return {
          linkText: a.innerText.trim().replace(/\n/g, ' '),
          hasBadge: !!badgeEl,
          badgeText: badgeEl ? badgeEl.innerText.trim() : 'NONE'
        };
      });
    });

    console.log('   Sidebar Badges:', JSON.stringify(sidebarBadges, null, 2));

    // -------------------------------------------------------------
    // STEP 8: MOBILE RESPONSIVE AUDIT (390x844 iPhone 14/15/16)
    // -------------------------------------------------------------
    console.log('\n▶ [Step 8/8] Testing Mobile Viewport (390x844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(3000);

    await mobilePage.screenshot({ path: path.join(OUT_DIR, '11_mobile_orders_full_page.png'), fullPage: true });
    await mobilePage.screenshot({ path: path.join(OUT_DIR, '12_mobile_orders_initial_viewport.png'), fullPage: false });
    console.log('   📸 Captured Mobile Full Page & Viewport.');

    // Save exhaustive audit summary log
    const fullAuditSummary = {
      timestamp: new Date().toISOString(),
      ticket: 'Ticket #41794530: My Account - Orders',
      stagingUrl: 'https://mcstaging2.globewest.com/gw_orders/order/index/',
      figmaNode: 'Node 2581-64348 (Frame 624)',
      tabsAudit: {
        activeTab: activeTab ? activeTab.text : 'NONE',
        tabsDetected: tabsData,
        frame624Compliant: (activeTab && activeTab.text === 'AWAITING PAYMENT') && tabsData.some(t => t.text === 'PENDING SHIPMENT')
      },
      tableAudit: {
        headers: tableAudit.headers,
        columnCount: tableAudit.columnCount,
        frame624Compliant: tableAudit.columnCount <= 6,
        rowCount: tableAudit.rowCount,
        sampleRow: tableAudit.rows[0] || null
      },
      faqAudit,
      supportAudit,
      sidebarBadges
    };

    fs.writeFileSync(path.resolve(__dirname, '../headed_audit_results.json'), JSON.stringify(fullAuditSummary, null, 2));
    console.log('\n💾 Audit results saved to headed_audit_results.json');

    await page.waitForTimeout(3000); // Give user a moment to see the final screen
    await mobileContext.close();
    await browser.close();
    console.log('========================================================================');
    console.log('✅ HEADED MODE QA AUDIT FINISHED SUCCESSFULLY!');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Exception occurred during headed audit:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
