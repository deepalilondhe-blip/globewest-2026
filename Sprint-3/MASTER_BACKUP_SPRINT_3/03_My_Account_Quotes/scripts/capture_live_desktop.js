const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/desktop');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Capturing Desktop Live Staging for My Quotes...');

  let browser;
  try {
    browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      args: ['--no-sandbox', '--start-maximized']
    });
  } catch (e) {
    console.log('Falling back to default chromium...');
    browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--start-maximized']
    });
  }

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

    // 2. Navigate to Quotes
    console.log('Navigating to My Quotes page...');
    await page.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);

    // Save screenshots
    const fullPath = path.join(OUT_DIR, '01_my_quotes_desktop_live_full.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('📸 Saved Desktop Full Page:', fullPath);

    const vpPath = path.join(OUT_DIR, '02_my_quotes_desktop_live_viewport.png');
    await page.screenshot({ path: vpPath, fullPage: false });
    console.log('📸 Saved Desktop Viewport:', vpPath);

    const tableEl = page.locator('.table-wrapper, .table-quotes, .block-quotes, .page-main').first();
    if (await tableEl.isVisible().catch(() => false)) {
      const tablePath = path.join(OUT_DIR, '03_my_quotes_desktop_table_area.png');
      await tableEl.screenshot({ path: tablePath });
      console.log('📸 Saved Desktop Table Area:', tablePath);
    }

    // Also update 01_my_quotes_live_staging.png for direct comparison
    const stagingPath = path.join(OUT_DIR, '01_my_quotes_live_staging_latest.png');
    await page.screenshot({ path: stagingPath, fullPage: true });

    // 3. Inspect Live DOM State for Deployment Verification
    console.log('\n--- LIVE DOM AUDIT RESULTS ---');
    const liveAudit = await page.evaluate(() => {
      // Tabs
      const tabs = Array.from(document.querySelectorAll('a, button, li, span'))
        .filter(el => ['ALL', 'OPEN', 'CONVERTED', 'EXPIRED'].includes(el.textContent.trim().toUpperCase()))
        .map(el => ({
          text: el.textContent.trim().toUpperCase(),
          classes: el.className,
          isActive: el.classList.contains('active') || el.classList.contains('selected') || (el.parentElement && el.parentElement.classList.contains('active'))
        }));

      // Table Headers
      const ths = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.textContent.trim());

      // Search Bar Position
      const searchInput = document.querySelector('input[placeholder*="Search"], input[id*="search"], .search-form, .block-search');
      const searchParentClass = searchInput ? (searchInput.closest('div')?.className || '') : 'NOT_FOUND';

      // FAQ
      const bodyText = document.body.innerText;
      const hasFAQ = bodyText.toLowerCase().includes('frequently asked questions') || !!document.querySelector('.faq-accordion, .accordion, [data-role="collapsible"]');

      // Need Help
      const hasNeedHelp = bodyText.toLowerCase().includes('need help?') && bodyText.toLowerCase().includes('contact our sales team');

      // Count Badges in Sidebar
      const sidebarBadges = document.querySelectorAll('.sidebar .badge, .sidebar .count, .block-collapsible-nav [class*="count"]').length;

      // Footer Australian Badge
      const footer = document.querySelector('footer');
      const footerText = footer ? footer.innerText : '';
      const hasAusBadge = footerText.toLowerCase().includes('australian owned') || !!(footer && footer.querySelector('img[src*="kangaroo"], img[alt*="Australian"]'));

      return {
        tabs,
        ths,
        searchParentClass,
        hasFAQ,
        hasNeedHelp,
        sidebarBadges,
        hasAusBadge
      };
    });

    console.log('Tabs detected:', JSON.stringify(liveAudit.tabs));
    console.log('Table Headers:', liveAudit.ths);
    console.log('FAQ Block Present:', liveAudit.hasFAQ);
    console.log('Need Help Block Present:', liveAudit.hasNeedHelp);
    console.log('Sidebar Badges Count:', liveAudit.sidebarBadges);
    console.log('Australian Footer Badge Present:', liveAudit.hasAusBadge);
    console.log('------------------------------\n');

    await browser.close();
    console.log('✅ Desktop capture complete!');
  } catch (err) {
    console.error('Error during desktop capture:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
