const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/headed_live_audit');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 RUNNING FULL HEADED QA AUDIT: TICKET #41794528 (MY ACCOUNT - HOLDS)');
  console.log('   Target URL: https://mcstaging2.globewest.com/gw_orders/hold/index/');
  console.log('   Figma Benchmark: Node 2581-64185 / Frame 621 Spec');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  const auditReport = {
    timestamp: new Date().toISOString(),
    ticket: '#41794528 - My Account - Holds',
    url: 'https://mcstaging2.globewest.com/gw_orders/hold/index/',
    figmaNode: '2581-64185 (Frame 621)',
    results: {}
  };

  try {
    // 1. Trade Login
    console.log('▶ [1/6] Trade Authentication...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
      console.log('   ✅ Authenticated.');
    }

    // 2. Navigate to Holds & Hard Reload
    console.log('\n▶ [2/6] Loading My Holds (/gw_orders/hold/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/hold/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(OUT_DIR, '01_desktop_holds_full_page.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '02_desktop_holds_viewport.png'), fullPage: false });
    console.log('   📸 Captured Desktop Full Page & Initial Viewport.');

    // 3. Inspect Status Tabs
    console.log('\n▶ [3/6] Inspecting Status Filter Tabs (ACTIVE vs INACTIVE)...');
    const tabsData = await page.evaluate(() => {
      const filters = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter'));
      return filters.map(el => {
        const comp = window.getComputedStyle(el);
        return {
          text: el.innerText.trim(),
          isActive: el.classList.contains('is-active') || el.classList.contains('active'),
          classes: el.className,
          bg: comp.backgroundColor,
          color: comp.color,
          padding: comp.padding,
          borderRadius: comp.borderRadius,
          fontWeight: comp.fontWeight
        };
      });
    });

    console.log('   Filter Tabs detected:', tabsData);
    const activeTab = tabsData.find(t => t.isActive);
    auditReport.results.tabs = {
      detected: tabsData,
      activeTab: activeTab ? activeTab.text : 'NONE',
      hasActive: tabsData.some(t => t.text.toUpperCase() === 'ACTIVE'),
      hasInactive: tabsData.some(t => t.text.toUpperCase() === 'INACTIVE')
    };

    // Capture Tabs Container
    const tabsEl = page.locator('.account-listing-ui__filters, .account-listing-ui__filters__wrapper').first();
    if (await tabsEl.isVisible().catch(() => false)) {
      await tabsEl.screenshot({ path: path.join(OUT_DIR, '03_status_tabs_container.png') });
    }

    // Click INACTIVE tab
    const inactiveBtn = page.locator('.account-listing-ui__filters__filter:has-text("INACTIVE")').first();
    if (await inactiveBtn.isVisible().catch(() => false)) {
      console.log('   Clicking "INACTIVE" tab...');
      await inactiveBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(OUT_DIR, '04_inactive_tab_view.png') });

      // Click back to ACTIVE
      const activeBtn = page.locator('.account-listing-ui__filters__filter:has-text("ACTIVE")').first();
      if (await activeBtn.isVisible().catch(() => false)) {
        console.log('   Clicking back to "ACTIVE" tab...');
        await activeBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    // 4. Inspect Table Headers & Columns
    console.log('\n▶ [4/6] Inspecting Table Column Reduction & Header Naming...');
    const tableData = await page.evaluate(() => {
      const ths = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.innerText.trim().replace(/\n/g, ' '));
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map((tr, idx) => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
        const link = tr.querySelector('td:first-child a, a[href*="hold_id"], a[href*="order_id"]');
        const actionsBtn = tr.querySelector('.action.dropdown, [data-action="customer-order-dropdown"], button[class*="action"], .actions-menu');
        return {
          row: idx + 1,
          holdId: cells[0] || 'N/A',
          hasLink: !!link,
          linkHref: link ? link.getAttribute('href') : null,
          cells,
          hasActionsBtn: !!actionsBtn
        };
      });

      return {
        headers: ths,
        columnCount: ths.length,
        hasCustP0Typo: ths.some(h => h.includes('P0#')),
        hasActionsColumn: ths.some(h => h.toUpperCase().includes('ACTION')),
        rows
      };
    });

    console.log('   Headers:', tableData.headers);
    console.log('   Column count:', tableData.columnCount);
    console.log('   Cust P0# Typo detected:', tableData.hasCustP0Typo);
    console.log('   Actions Column present:', tableData.hasActionsColumn);
    auditReport.results.table = tableData;

    const tableEl = page.locator('table, .table-wrapper, .table-orders').first();
    if (await tableEl.isVisible().catch(() => false)) {
      await tableEl.screenshot({ path: path.join(OUT_DIR, '05_holds_table_desktop.png') });
    }

    // 5. Inspect FAQ Accordion Single-Open Rule
    console.log('\n▶ [5/6] Inspecting FAQ Accordion Module & Single-Open Collapse...');
    const faqHeading = page.locator('h2:has-text("Frequently Asked Questions"), text=Frequently Asked Questions').first();
    if (await faqHeading.isVisible().catch(() => false)) {
      await faqHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT_DIR, '06_faq_initial_closed_state.png') });

      const faqItems = page.locator('h3:has-text("Frequently asked question content goes here"), [data-role="collapsible"], .accordion-title');
      const count = await faqItems.count();
      console.log('   FAQ items found:', count);

      if (count >= 2) {
        console.log('   Clicking FAQ Item #1...');
        await faqItems.nth(0).click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(OUT_DIR, '07_faq_item_1_expanded.png') });

        console.log('   Clicking FAQ Item #2 (Testing single-open rule)...');
        await faqItems.nth(1).click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(OUT_DIR, '08_faq_item_2_clicked.png') });

        const faqState = await page.evaluate(() => {
          const lis = Array.from(document.querySelectorAll('h3')).filter(h => h.innerText.includes('Frequently')).map(h => {
            const parent = h.closest('li') || h.parentElement;
            const content = parent.querySelector('p, div, [data-role="content"]');
            return {
              header: h.innerText.trim(),
              isOpen: content ? (content.offsetHeight > 0 && window.getComputedStyle(content).display !== 'none') : false
            };
          });
          const openCount = lis.filter(i => i.isOpen).length;
          return {
            items: lis,
            openCount,
            violatesSingleOpen: openCount > 1
          };
        });

        console.log('   FAQ Single-Open Test Result:', faqState);
        auditReport.results.faq = faqState;
      }
    } else {
      console.log('   ❌ FAQ Heading not found.');
      auditReport.results.faq = { present: false };
    }

    // 6. Inspect Support Block & Contact Details
    console.log('\n▶ [6/6] Inspecting Need Help / Support Block...');
    const supportBlockData = await page.evaluate(() => {
      const allText = document.body.innerText;
      const hasHelpHeading = allText.toLowerCase().includes('need help? contact our sales team') || allText.toLowerCase().includes('need help');
      const hasAusPhone = allText.includes('+613') || allText.includes('9518 1600') || allText.includes('+61 3');
      const hasAusEmail = allText.includes('sales@globewest.com.au');
      const hasUkSpelling = allText.toLowerCase().includes('favourite');

      const helpEl = Array.from(document.querySelectorAll('*')).find(el => el.children.length === 0 && el.innerText.trim().toLowerCase().includes('need help? contact our sales team'));
      const container = helpEl ? helpEl.closest('div, section, .block') : null;

      return {
        hasHelpHeading,
        hasAusPhone,
        hasAusEmail,
        hasUkSpelling,
        containerText: container ? container.innerText.trim() : 'NOT_FOUND'
      };
    });

    console.log('   Support Block Data:', supportBlockData);
    auditReport.results.supportBlock = supportBlockData;

    const supportEl = page.locator('text=Need help? Contact our sales team, text=Contact our sales team').first();
    if (await supportEl.isVisible().catch(() => false)) {
      await supportEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await supportEl.screenshot({ path: path.join(OUT_DIR, '09_support_block_desktop.png') });
    }

    // Save full audit JSON
    fs.writeFileSync(path.resolve(__dirname, '../headed_audit_results.json'), JSON.stringify(auditReport, null, 2));
    console.log('\n💾 Saved audit results to headed_audit_results.json');

    await page.waitForTimeout(2000);
    await browser.close();
    console.log('========================================================================');
    console.log('✅ FULL HEADED QA AUDIT FOR MY HOLDS COMPLETE!');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Error during headed audit:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
