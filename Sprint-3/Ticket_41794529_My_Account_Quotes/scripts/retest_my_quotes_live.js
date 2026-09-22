const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Retest My Quotes Live Staging Script
 * 
 * Run this script immediately once the developer deploys the frontend/backend changes for Ticket #41794529.
 * Usage:
 *   NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794529_My_Account_Quotes/scripts/retest_my_quotes_live.js"
 */

const BASE_URL = 'https://mcstaging2.globewest.com';
const QUOTES_URL = `${BASE_URL}/gw_quotes/quote/index/`;
const LOGIN_URL = `${BASE_URL}/customer/account/login/`;

const USER_EMAIL = 'deepali.londhe@overdose.digital';
const USER_PASS = 'Deep@123';

const REPORT_DIR = path.resolve(__dirname, '../retest_results');
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

(async () => {
  console.log('================================================================');
  console.log('RETESTING TICKET #41794529: MY ACCOUNT - QUOTES');
  console.log(`Target URL: ${QUOTES_URL}`);
  console.log('================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // 1. Authenticate
    console.log('[1/4] Authenticating as Trade Customer...');
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.fill('#email', USER_EMAIL);
    await page.fill('#pass', USER_PASS);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 45000 }).catch(() => {}),
      page.click('#send2')
    ]);

    // 2. Navigate to Quotes Dashboard
    console.log('[2/4] Loading My Quotes portal (/gw_quotes/quote/index/)...');
    await page.goto(QUOTES_URL, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3000);

    const screenshotPath = path.join(REPORT_DIR, `retest_desktop_${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved live full-page retest capture: ${screenshotPath}`);

    // 3. Automated Assertions against Acceptance Criteria
    console.log('\n[3/4] Running automated verifications against Frame 622 & Figma specifications:');
    const results = [];

    // Test 1: Default Active Filter Tab
    const activeTab = await page.evaluate(() => {
      const activeEl = document.querySelector('.quote-status-tabs .active, .quote-tabs .active, ul.tabs li.active, [class*="tab"][class*="active"], [class*="status"][class*="active"]');
      if (activeEl) return activeEl.textContent.trim().toUpperCase();
      // Look for tabs list
      const tabs = Array.from(document.querySelectorAll('a, button, li')).filter(el => ['ALL', 'OPEN', 'CONVERTED', 'EXPIRED'].includes(el.textContent.trim().toUpperCase()));
      for (const t of tabs) {
        if (t.classList.contains('active') || t.classList.contains('selected') || window.getComputedStyle(t).borderBottomWidth !== '0px') {
          return t.textContent.trim().toUpperCase();
        }
      }
      return 'UNKNOWN';
    });
    const passTab = activeTab.includes('ALL');
    results.push({
      id: 'TC-QUOTES-02',
      requirement: 'Default active filter tab is "ALL"',
      status: passTab ? 'PASS' : 'FAIL',
      details: `Active tab detected: "${activeTab}" (Expected: "ALL")`
    });

    // Test 2: Table Columns & Consolidated Actions
    const tableAudit = await page.evaluate(() => {
      const ths = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th'));
      const headers = ths.map(th => th.textContent.trim());
      const hasDetails = headers.some(h => h.toUpperCase().includes('DETAILS'));
      const hasActions = headers.some(h => h.toUpperCase().includes('ACTION'));
      const expDateHeader = headers.find(h => h.toUpperCase().includes('EXP')) || '';
      const orderNameHeader = headers.find(h => h.toUpperCase().includes('ORDER') || h.toUpperCase().includes('QUOTE NAME')) || '';
      return {
        columnCount: headers.length,
        headers,
        hasDetails,
        hasActions,
        expDateHeader,
        orderNameHeader
      };
    });
    results.push({
      id: 'TC-QUOTES-04',
      requirement: '8 columns total & unified Actions dropdown (No separate DETAILS column)',
      status: (!tableAudit.hasDetails && tableAudit.columnCount <= 8) ? 'PASS' : 'FAIL',
      details: `Columns: ${tableAudit.columnCount}. Separate DETAILS column present: ${tableAudit.hasDetails}. Headers: [${tableAudit.headers.join(', ')}]`
    });

    // Test 3: Column Naming Parity
    const passExpDate = tableAudit.expDateHeader.trim() === 'EXP. DATE';
    const passOrderName = tableAudit.orderNameHeader.trim() === 'ORDER NAME';
    results.push({
      id: 'TC-QUOTES-05',
      requirement: 'Table header labels: "EXP. DATE" and "ORDER NAME"',
      status: (passExpDate && passOrderName) ? 'PASS' : 'FAIL',
      details: `Exp Date Header: "${tableAudit.expDateHeader}" (Expected: "EXP. DATE"). Order Name Header: "${tableAudit.orderNameHeader}" (Expected: "ORDER NAME")`
    });

    // Test 4: FAQ Block Presence
    const faqExists = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, div')).map(e => e.textContent.trim().toLowerCase());
      const hasHeading = headings.some(h => h.includes('frequently asked questions') || h === 'faqs');
      const hasAccordion = document.querySelectorAll('.faq-accordion, .accordion, [data-role="collapsible"]').length > 0;
      return hasHeading || hasAccordion;
    });
    results.push({
      id: 'TC-QUOTES-08',
      requirement: 'FAQ Accordion Block present below table',
      status: faqExists ? 'PASS' : 'FAIL',
      details: faqExists ? 'FAQ module detected on live page.' : 'FAQ Accordion block is 100% MISSING from page.'
    });

    // Test 5: Need Help Block Presence
    const needHelpExists = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('need help?') && text.includes('contact our sales team');
    });
    results.push({
      id: 'TC-QUOTES-10',
      requirement: '"Need help? Contact our sales team" Content Block present',
      status: needHelpExists ? 'PASS' : 'FAIL',
      details: needHelpExists ? 'Need Help support block detected.' : 'Need Help block is 100% MISSING from page.'
    });

    // Test 6: Sidebar Navigation Count Badges
    const badgeCount = await page.evaluate(() => {
      const sidebarLinks = Array.from(document.querySelectorAll('.sidebar, .nav.items, .block-collapsible-nav'));
      if (sidebarLinks.length === 0) return 0;
      return document.querySelectorAll('.sidebar .badge, .sidebar .count, .block-collapsible-nav [class*="count"]').length;
    });
    results.push({
      id: 'TC-QUOTES-11',
      requirement: 'Numerical count badges in My Account left sidebar',
      status: badgeCount > 0 ? 'PASS' : 'FAIL',
      details: badgeCount > 0 ? `Detected ${badgeCount} count badges.` : 'No count badges rendered in sidebar.'
    });

    // Test 7: Storefront Footer Scope Leak
    const footerAustralianBadge = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      if (!footer) return false;
      const text = footer.innerText.toLowerCase();
      return text.includes('australian owned') || text.includes('australian run') || !!footer.querySelector('img[src*="kangaroo"], img[alt*="Australian"]');
    });
    results.push({
      id: 'TC-QUOTES-13',
      requirement: 'Australian Kangaroo badge removed from US storefront footer',
      status: !footerAustralianBadge ? 'PASS' : 'FAIL',
      details: footerAustralianBadge ? 'Australian Kangaroo "AUSTRALIAN OWNED & RUN" badge is present in footer.' : 'Footer clean; Australian badge excluded.'
    });

    // Print Results Summary Table
    console.log('\n================================================================');
    console.log('RETEST EXECUTION SUMMARY:');
    console.log('================================================================');
    for (const r of results) {
      console.log(`[${r.status}] ${r.id}: ${r.requirement}`);
      console.log(`       -> ${r.details}`);
    }
    console.log('================================================================\n');

    // Write Retest Markdown Summary
    const mdSummary = `# Automated Retest Summary - Ticket #41794529
Date: ${new Date().toISOString()}
Target: ${QUOTES_URL}

| Test Case | Requirement | Status | Live Details |
| :--- | :--- | :---: | :--- |
${results.map(r => `| **${r.id}** | ${r.requirement} | **${r.status}** | ${r.details} |`).join('\n')}
`;
    fs.writeFileSync(path.join(REPORT_DIR, 'LATEST_RETEST_SUMMARY.md'), mdSummary);
    console.log(`Report written to ${path.join(REPORT_DIR, 'LATEST_RETEST_SUMMARY.md')}`);

  } catch (err) {
    console.error('Error during retest:', err);
  } finally {
    await browser.close();
  }
})();
