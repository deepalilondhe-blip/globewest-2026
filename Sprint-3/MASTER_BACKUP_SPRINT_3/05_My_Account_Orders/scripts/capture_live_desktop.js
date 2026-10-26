const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/desktop');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Capturing Desktop Live Staging for My Orders...');

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
    // 1. Navigate to login
    console.log('Navigating to Trade Login...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      console.log('Submitted login credentials...');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(3000);
    }

    // 2. Navigate to My Orders
    console.log('Navigating to My Orders page (/gw_orders/order/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Save screenshots
    const fullPath = path.join(OUT_DIR, '01_my_orders_desktop_live_full.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('📸 Saved Desktop Full Page:', fullPath);

    const vpPath = path.join(OUT_DIR, '02_my_orders_desktop_live_viewport.png');
    await page.screenshot({ path: vpPath, fullPage: false });
    console.log('📸 Saved Desktop Viewport:', vpPath);

    const tableEl = page.locator('.table-wrapper, .table-orders, .block-orders, .page-main').first();
    if (await tableEl.isVisible().catch(() => false)) {
      const tablePath = path.join(OUT_DIR, '03_my_orders_desktop_table_area.png');
      await tableEl.screenshot({ path: tablePath });
      console.log('📸 Saved Desktop Table Area:', tablePath);
    }

    // 3. Inspect Live DOM State for Orders
    console.log('\n--- LIVE DOM AUDIT RESULTS FOR MY ORDERS ---');
    const liveAudit = await page.evaluate(() => {
      // Heading
      const pageHeading = document.querySelector('h1, .page-title')?.innerText.trim() || 'N/A';

      // Description / sub-heading
      const description = document.querySelector('.page-title-wrapper + div, .column.main > p, .page-description')?.innerText.trim() || 'N/A';

      // Tabs
      const tabs = Array.from(document.querySelectorAll('a, button, li, span'))
        .filter(el => ['ALL', 'OPEN', 'PROCESSING', 'COMPLETE', 'CANCELLED', 'ON HOLD'].includes(el.textContent.trim().toUpperCase()))
        .map(el => ({
          text: el.textContent.trim().toUpperCase(),
          classes: el.className,
          isActive: el.classList.contains('active') || el.classList.contains('selected') || (el.parentElement && el.parentElement.classList.contains('active'))
        }));

      // All tab elements inside listing filters
      const filterElements = Array.from(document.querySelectorAll('.account-listing-ui__filters__filter, [class*="filter"] li, .order-status-tabs a')).map(el => ({
        text: el.textContent.trim(),
        classes: el.className
      }));

      // Table Headers
      const ths = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.textContent.trim());

      // Search Bar
      const searchInput = document.querySelector('input[placeholder*="Search"], input[id*="search"]');
      const searchParentClass = searchInput ? (searchInput.closest('div')?.className || '') : 'NOT_FOUND';

      // Table rows
      const rowCount = document.querySelectorAll('table tbody tr').length;
      const emptyAlert = document.querySelector('.message.info, .message.notice, .table-empty, .alert')?.innerText.trim() || 'None';

      // FAQ in main container
      const main = document.querySelector('.page-main, #maincontent, .column.main');
      const hasFAQ = main ? (main.innerText.toLowerCase().includes('frequently asked questions') || !!main.querySelector('.faq-accordion, .block-faq')) : false;

      // Need Help in main container
      const hasNeedHelp = main ? (main.innerText.toLowerCase().includes('need help?') && main.innerText.toLowerCase().includes('contact our sales team')) : false;

      // Count Badges in Sidebar
      const sidebarBadges = document.querySelectorAll('.sidebar .badge, .sidebar .count, .block-collapsible-nav [class*="count"]').length;

      // Footer Australian Badge
      const footer = document.querySelector('footer');
      const footerText = footer ? footer.innerText : '';
      const hasAusBadge = footerText.toLowerCase().includes('australian owned') || !!(footer && footer.querySelector('img[src*="kangaroo"], img[alt*="Australian"]'));

      return {
        pageHeading,
        description,
        tabs,
        filterElements,
        ths,
        rowCount,
        emptyAlert,
        searchParentClass,
        hasFAQ,
        hasNeedHelp,
        sidebarBadges,
        hasAusBadge
      };
    });

    console.log('Page Heading:', liveAudit.pageHeading);
    console.log('Tabs detected:', JSON.stringify(liveAudit.tabs));
    console.log('Filter Elements:', JSON.stringify(liveAudit.filterElements));
    console.log('Table Headers:', liveAudit.ths);
    console.log('Row Count / Empty State:', liveAudit.rowCount, '| Alert:', liveAudit.emptyAlert);
    console.log('FAQ Block Present in Main:', liveAudit.hasFAQ);
    console.log('Need Help Block Present in Main:', liveAudit.hasNeedHelp);
    console.log('Sidebar Badges Count:', liveAudit.sidebarBadges);
    console.log('Australian Footer Badge Present:', liveAudit.hasAusBadge);
    console.log('---------------------------------------------\n');

    // Save live DOM report to JSON
    fs.writeFileSync(path.resolve(__dirname, '../live_dom_orders.json'), JSON.stringify(liveAudit, null, 2));

    await browser.close();
    console.log('✅ Desktop capture for My Orders complete!');
  } catch (err) {
    console.error('Error during desktop capture:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
