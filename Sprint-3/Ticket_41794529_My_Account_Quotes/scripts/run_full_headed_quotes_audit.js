const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/headed_live_audit';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 STARTING HEADED MODE QA AUDIT: TICKET #41794529 (MY ACCOUNT - QUOTES)');
  console.log('   Strict verification against Figma Node 2581-64348 / Frame 622');
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
    // STEP 2: NAVIGATE TO MY QUOTES & HARD RELOAD
    // -------------------------------------------------------------
    console.log('\n▶ [Step 2/8] Navigating to My Quotes (/gw_quotes/quote/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('   🔄 Executing hard reload to bypass any cached templates...');
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);

    // Initial Desktop Captures
    await page.screenshot({ path: path.join(OUT_DIR, '01_desktop_quotes_full_page.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '02_desktop_quotes_initial_viewport.png'), fullPage: false });
    console.log('   📸 Captured Desktop Full Page & Viewport.');

    // -------------------------------------------------------------
    // STEP 3: STATUS FILTER TABS AUDIT
    // -------------------------------------------------------------
    console.log('\n▶ [Step 3/8] Inspecting Status Filter Tabs (ALL / OPEN / CONVERTED / EXPIRED)...');
    const tabsData = await page.evaluate(() => {
      const tabElements = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter, [class*="filter"] a, [class*="tab"] a, .quote-status-tabs li, .quote-status-tabs a, button[class*="filter"]'));
      return tabElements.map(el => ({
        text: el.innerText.trim().toUpperCase(),
        classes: el.className,
        parentClasses: el.parentElement?.className || '',
        isActive: el.classList.contains('active') || el.classList.contains('is-active') || el.classList.contains('selected') || (el.parentElement && (el.parentElement.classList.contains('active') || el.parentElement.classList.contains('is-active')))
      }));
    });

    console.log('   Tabs Detected:', tabsData);
    const activeTab = tabsData.find(t => t.isActive);
    console.log('   ⭐ Active Tab:', activeTab ? activeTab.text : 'NONE');

    const tabsContainer = page.locator('.account-listing-ui__filters, [class*="filters"], .quote-status-tabs').first();
    if (await tabsContainer.isVisible().catch(() => false)) {
      await tabsContainer.screenshot({ path: path.join(OUT_DIR, '03_status_tabs_container.png') });
      console.log('   📸 Captured Tabs Container.');
    }

    // Test clicking tabs
    const openTabBtn = page.locator('button:has-text("OPEN"), a:has-text("OPEN"), .account-listing-ui__filters__filter:has-text("Open")').first();
    if (await openTabBtn.isVisible().catch(() => false)) {
      console.log('   Clicking "OPEN" tab...');
      await openTabBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(OUT_DIR, '04_open_tab_view.png') });

      // Click back to ALL
      const allTabBtn = page.locator('button:has-text("ALL"), a:has-text("ALL"), .account-listing-ui__filters__filter:has-text("All")').first();
      if (await allTabBtn.isVisible().catch(() => false)) {
        await allTabBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    // -------------------------------------------------------------
    // STEP 4: TABLE HEADERS & COLUMN COPY AUDIT
    // -------------------------------------------------------------
    console.log('\n▶ [Step 4/8] Inspecting Table Headers & Column Copy...');
    const tableAudit = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.innerText.trim().replace(/\n/g, ' '));
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map((tr, idx) => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
        const quoteLink = tr.querySelector('td:first-child a, a[href*="quote_id"]');
        const actionsBtn = tr.querySelector('.action.dropdown, [data-action="customer-order-dropdown"], button[class*="action"], .actions-menu');
        return {
          rowIndex: idx + 1,
          quoteNumberText: cells[0] || 'N/A',
          hasQuoteLink: !!quoteLink,
          quoteLinkHref: quoteLink ? quoteLink.getAttribute('href') : 'NONE',
          dateText: cells[1] || 'N/A',
          expDateText: cells[2] || 'N/A',
          statusText: cells[5] || 'N/A',
          totalText: cells[6] || 'N/A',
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

    console.log('   Headers Found on Live Quotes:', tableAudit.headers);
    console.log('   Total Column Count:', tableAudit.columnCount);

    // Check specific columns
    const hasExpDate = tableAudit.headers.some(h => h.toUpperCase().includes('EXP. DATE'));
    const hasExpiryDate = tableAudit.headers.some(h => h.toUpperCase().includes('EXPIRY DATE'));
    const hasOrderName = tableAudit.headers.some(h => h.toUpperCase().includes('ORDER NAME'));
    const hasQuoteName = tableAudit.headers.some(h => h.toUpperCase().includes('QUOTE NAME'));

    console.log('   🔍 Copy Checks:');
    console.log(`      • Expiry Date Header: "${hasExpiryDate ? 'EXPIRY DATE (Figma Match ✅)' : (hasExpDate ? 'EXP. DATE (Defect 🔴)' : 'NOT_FOUND')}"`);
    console.log(`      • Name Header: "${hasQuoteName ? 'QUOTE NAME (Figma Match ✅)' : (hasOrderName ? 'ORDER NAME (Defect 🔴)' : 'NOT_FOUND')}"`);

    const tableEl = page.locator('table, .table-wrapper, .table-order-items').first();
    if (await tableEl.isVisible().catch(() => false)) {
      await tableEl.screenshot({ path: path.join(OUT_DIR, '05_quotes_table_desktop.png') });
      console.log('   📸 Captured Desktop Quotes Table.');
    }

    // -------------------------------------------------------------
    // STEP 5: FAQ ACCORDION BLOCK AUDIT
    // -------------------------------------------------------------
    console.log('\n▶ [Step 5/8] Inspecting Frequently Asked Questions (FAQ) Module...');
    const faqAudit = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasHeading = bodyText.toLowerCase().includes('frequently asked questions');
      const h3Items = Array.from(document.querySelectorAll('h3, .accordion-title, [data-role="collapsible"], [data-role="title"], .faq-item'))
        .filter(el => el.innerText.toLowerCase().includes('frequently') || el.innerText.toLowerCase().includes('question') || el.closest('[class*="faq"]') !== null);

      return {
        hasHeading,
        faqCount: h3Items.length,
        faqTitles: h3Items.map(el => ({
          text: el.innerText.trim().replace(/\n/g, ' ').substring(0, 80),
          tagName: el.tagName,
          ariaExpanded: el.getAttribute('aria-expanded') || 'none',
          isActive: el.classList.contains('active')
        }))
      };
    });

    console.log('   FAQ Heading Present:', faqAudit.hasHeading);
    console.log('   FAQ Items Detected:', faqAudit.faqCount);

    const h3FaqItems = page.locator('h3:has-text("Frequently asked question content goes here"), .faq-item, [data-role="collapsible"]');
    const faqItemCount = await h3FaqItems.count();

    if (faqItemCount > 0) {
      await h3FaqItems.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT_DIR, '07_faq_initial_state.png') });
      console.log('   📸 Saved FAQ initial state.');

      console.log('   Clicking FAQ #1...');
      await h3FaqItems.first().click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(OUT_DIR, '08_faq_item1_clicked.png') });
      console.log('   📸 Saved FAQ #1 clicked.');

      if (faqItemCount > 1) {
        console.log('   Clicking FAQ #2 to test single-open rule...');
        await h3FaqItems.nth(1).click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(OUT_DIR, '09_faq_item2_clicked.png') });
        console.log('   📸 Saved FAQ #2 clicked.');

        const multiOpenCheck = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('h3')).filter(h => h.innerText.includes('Frequently'));
          return items.map((h, i) => {
            const next = h.nextElementSibling;
            return {
              index: i + 1,
              ariaExpanded: h.getAttribute('aria-expanded'),
              isVisible: next ? (next.offsetHeight > 0 && window.getComputedStyle(next).display !== 'none') : false,
              height: next ? next.offsetHeight : 0
            };
          });
        });
        console.log('   FAQ Multi-Open State:', JSON.stringify(multiOpenCheck, null, 2));
      }
    }

    // -------------------------------------------------------------
    // STEP 6: SUPPORT BLOCK AUDIT
    // -------------------------------------------------------------
    console.log('\n▶ [Step 6/8] Inspecting Support Block ("Need help with a quote?")...');
    const supportBlockEl = page.locator('text=Need help with a quote?, text=Need to change an order?, text=Need help?').first();
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
    // STEP 8: MOBILE VIEWPORT RETEST (390x844)
    // -------------------------------------------------------------
    console.log('\n▶ [Step 8/8] Testing Mobile Viewport (390x844)...');
    const mobPage = await context.newPage();
    await mobPage.setViewportSize({ width: 390, height: 844 });
    await mobPage.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await mobPage.waitForTimeout(3000);

    await mobPage.screenshot({ path: path.join(OUT_DIR, '11_mobile_quotes_full_page.png'), fullPage: true });
    await mobPage.screenshot({ path: path.join(OUT_DIR, '12_mobile_quotes_initial_viewport.png'), fullPage: false });
    console.log('   📸 Captured Mobile Full Page & Viewport.');

    // Save summary log
    const fullSummary = {
      timestamp: new Date().toISOString(),
      ticket: 'Ticket #41794529: My Account - Quotes',
      stagingUrl: 'https://mcstaging2.globewest.com/gw_quotes/quote/index/',
      tabsAudit: {
        activeTab: activeTab ? activeTab.text : 'NONE',
        tabsDetected: tabsData
      },
      tableAudit: {
        headers: tableAudit.headers,
        columnCount: tableAudit.columnCount,
        hasExpDate,
        hasExpiryDate,
        hasOrderName,
        hasQuoteName,
        rowCount: tableAudit.rowCount
      },
      faqAudit,
      sidebarBadges
    };

    fs.writeFileSync(path.resolve(__dirname, '../live_dom_quotes_retest.json'), JSON.stringify(fullSummary, null, 2));
    console.log('\n💾 Audit results saved to live_dom_quotes_retest.json');

    await page.waitForTimeout(2000);
    await mobPage.close();
    await browser.close();
    console.log('========================================================================');
    console.log('✅ HEADED MODE QA AUDIT COMPLETED FOR MY ACCOUNT - QUOTES!');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Error during headed quotes audit:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
