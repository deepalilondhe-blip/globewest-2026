const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/desktop');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 CAPTURING DESKTOP LIVE STAGING: TICKET #41794528 (MY ACCOUNT - HOLDS)');
  console.log('   Target URL: https://mcstaging2.globewest.com/gw_orders/hold/index/');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // 1. Authenticate as Trade Customer
    console.log('▶ [1/4] Navigating to Trade Login...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   🔐 Submitting trade credentials (deepali.londhe@overdose.digital)...');
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(2000);
      console.log('   ✅ Authenticated.');
    } else {
      console.log('   ℹ️ Session already active.');
    }

    // 2. Navigate to My Holds
    console.log('\n▶ [2/4] Navigating to My Holds (/gw_orders/hold/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/hold/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('   🔄 Hard reloading to ensure fresh cache/assets...');
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // 3. Capture Screenshots
    console.log('\n▶ [3/4] Capturing Desktop Screenshots...');
    const fullPath = path.join(OUT_DIR, '01_my_holds_desktop_live_full.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('   📸 Saved Desktop Full Page:', fullPath);

    const vpPath = path.join(OUT_DIR, '02_my_holds_desktop_live_viewport.png');
    await page.screenshot({ path: vpPath, fullPage: false });
    console.log('   📸 Saved Desktop Viewport:', vpPath);

    const tableEl = page.locator('.table-wrapper, .table-orders, .block-orders, .page-main').first();
    if (await tableEl.isVisible().catch(() => false)) {
      const tablePath = path.join(OUT_DIR, '03_my_holds_desktop_table_area.png');
      await tableEl.screenshot({ path: tablePath });
      console.log('   📸 Saved Desktop Table Area:', tablePath);
    }

    // 4. Extract Live DOM Audit Data
    console.log('\n▶ [4/4] Inspecting Live DOM for My Holds...');
    const liveAudit = await page.evaluate(() => {
      // Page Heading
      const pageHeading = document.querySelector('h1, .page-title')?.innerText.trim() || 'N/A';

      // Description / sub-heading
      const description = document.querySelector('.page-title-wrapper + div, .column.main > p, .page-description')?.innerText.trim() || 'N/A';

      // Filter Tabs
      const filterElements = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter, [class*="filter"] li, .order-status-tabs a, [class*="tab"] a, .tabs li')).map(el => {
        const comp = window.getComputedStyle(el);
        return {
          text: el.innerText.trim(),
          classes: el.className,
          isActive: el.classList.contains('is-active') || el.classList.contains('active') || el.classList.contains('selected'),
          bg: comp.backgroundColor,
          color: comp.color,
          padding: comp.padding,
          borderRadius: comp.borderRadius
        };
      });

      // Search Bar
      const searchInput = document.querySelector('input[placeholder*="Search"], input[id*="search"], .account-listing-ui__search input');
      const searchParentClass = searchInput ? (searchInput.closest('div')?.className || '') : 'NOT_FOUND';
      const searchPlaceholder = searchInput ? searchInput.getAttribute('placeholder') : 'NONE';

      // Table Headers
      const ths = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.innerText.trim().replace(/\n/g, ' '));

      // Table Rows
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map((tr, idx) => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
        const holdLink = tr.querySelector('td:first-child a, a[href*="hold_id"], a[href*="order_id"]');
        const actionsBtn = tr.querySelector('.action.dropdown, [data-action="customer-order-dropdown"], button[class*="action"], .actions-menu');
        return {
          rowNumber: idx + 1,
          holdIdText: cells[0] || 'N/A',
          hasHoldLink: !!holdLink,
          holdLinkHref: holdLink ? holdLink.getAttribute('href') : 'NONE',
          cells,
          hasActionsDropdown: !!actionsBtn
        };
      });

      const emptyAlert = document.querySelector('.message.info, .message.notice, .table-empty, .alert')?.innerText.trim() || 'None';

      // FAQ block
      const main = document.querySelector('.page-main, #maincontent, .column.main');
      const hasFAQ = main ? (main.innerText.toLowerCase().includes('frequently asked questions') || !!main.querySelector('.faq-accordion, .block-faq')) : false;

      // Support Block ("Need help?" or "Need to change a hold?")
      const supportEls = Array.from(document.querySelectorAll('div, section, p, .block')).filter(el => {
        const t = el.innerText.toLowerCase();
        return (t.includes('need to change') || t.includes('need help') || t.includes('sales administration')) && el.children.length < 5;
      });
      const supportText = supportEls[0]?.innerText.trim() || 'NOT_FOUND';

      // Left Sidebar Count Badges
      const sidebarLinks = Array.from(document.querySelectorAll('.block-collapsible-nav .item a, .account-nav a, .sidebar a'))
        .filter(a => ['Quotes', 'Holds', 'Orders', 'Invoices'].some(term => a.innerText.includes(term)))
        .map(a => {
          const badge = a.querySelector('.badge, .count, [class*="count"]');
          return {
            text: a.innerText.trim().replace(/\n/g, ' '),
            hasBadge: !!badge,
            badgeValue: badge ? badge.innerText.trim() : 'NONE'
          };
        });

      return {
        url: window.location.href,
        pageHeading,
        description,
        filterElements,
        search: {
          present: !!searchInput,
          placeholder: searchPlaceholder,
          parentClass: searchParentClass
        },
        table: {
          headers: ths,
          columnCount: ths.length,
          rowCount: rows.length,
          emptyAlert,
          sampleRow: rows[0] || null
        },
        hasFAQ,
        supportText,
        sidebarLinks
      };
    });

    console.log('\n--- LIVE DOM AUDIT SUMMARY FOR MY HOLDS ---');
    console.log('Heading:', liveAudit.pageHeading);
    console.log('Description:', liveAudit.description);
    console.log('Filter Tabs:', liveAudit.filterElements);
    console.log('Search Bar:', liveAudit.search);
    console.log('Table Headers:', liveAudit.table.headers);
    console.log('Table Column Count:', liveAudit.table.columnCount);
    console.log('Row Count / Empty State:', liveAudit.table.rowCount, '| Alert:', liveAudit.table.emptyAlert);
    console.log('FAQ Block Present:', liveAudit.hasFAQ);
    console.log('Support Block Text:', liveAudit.supportText.substring(0, 120));
    console.log('Sidebar Links:', liveAudit.sidebarLinks);
    console.log('--------------------------------------------\n');

    fs.writeFileSync(path.resolve(__dirname, '../live_dom_holds.json'), JSON.stringify(liveAudit, null, 2));
    console.log('💾 Saved live DOM audit to live_dom_holds.json');

    await page.waitForTimeout(2000);
    await browser.close();
    console.log('✅ Desktop capture for My Holds completed successfully!');
  } catch (err) {
    console.error('❌ Error during desktop capture:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
