const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';
const US_CREDS = { email: 'deepali.londhe@overdose.digital', pass: 'Deep@123' };
const AU_CREDS = { email: 'deepalilondhe576@gmail.com', pass: 'Deep@123' };

const OUT_DIR = path.resolve(SCRIPTS_DIR, '../screenshots');
fs.mkdirSync(path.join(OUT_DIR, 'desktop'), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, 'mobile'), { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🔍 AUDITING LIVE CLAIMS PORTAL ON US STAGING & AU BASELINE');
  console.log('Comparing against Figma Node 2316-15694 (My Claims & Create Claim)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // ----------------------------------------------------------------------
  // 1. US STAGING (DESKTOP AUTHENTICATED)
  // ----------------------------------------------------------------------
  const usContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const usPage = await usContext.newPage();

  console.log('🔐 [US Staging] Logging in with Trade account...');
  await usPage.goto(`${US_BASE}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await usPage.waitForTimeout(2000);
  if (await usPage.locator('#email').isVisible()) {
    await usPage.fill('#email', US_CREDS.email);
    await usPage.fill('#pass', US_CREDS.pass);
    await usPage.click('#send2');
    await usPage.waitForNavigation({ timeout: 30000 }).catch(() => {});
    await usPage.waitForTimeout(4000);
  }

  console.log('📍 Current URL after login:', usPage.url());

  // Check Account Sidebar Navigation for Claims
  const sidebarNav = await usPage.evaluate(() => {
    const navItems = Array.from(document.querySelectorAll('.block-collapsible-nav li, .nav.items li, .account-nav li, [class*="sidebar"] li, nav a, .customer-menu a')).map(el => ({
      text: el.innerText.trim().replace(/\n+/g, ' '),
      href: el.querySelector('a')?.href || el.getAttribute('href') || ''
    }));
    return navItems;
  });
  console.log('US Sidebar Navigation items count:', sidebarNav.length);
  const claimsNavItems = sidebarNav.filter(item => item.text.toLowerCase().includes('claim'));
  console.log('Claims related nav items:', JSON.stringify(claimsNavItems, null, 2));

  // Screenshot My Account Dashboard
  await usPage.screenshot({ path: path.join(OUT_DIR, 'desktop', 'US_01_ACCOUNT_DASHBOARD.png'), fullPage: true });

  // Probe potential Claims URLs
  const potentialUrls = [
    `${US_BASE}/gw_sales/claim/index/status/open/`,
    `${US_BASE}/gw_sales/claim/index/`,
    `${US_BASE}/claims`,
    `${US_BASE}/claims/index`,
    `${US_BASE}/claims/create`,
    `${US_BASE}/gw_sales/claim/create/`
  ];

  const probeResults = [];
  for (const testUrl of potentialUrls) {
    try {
      console.log(`\nProbing URL: ${testUrl}`);
      const resp = await usPage.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await usPage.waitForTimeout(3000);
      const title = await usPage.title();
      const status = resp ? resp.status() : 'No response';
      const finalUrl = usPage.url();
      const h1 = await usPage.$eval('h1, .page-title', el => el.innerText.trim()).catch(() => 'None');
      console.log(` -> Status: ${status} | Title: "${title}" | H1: "${h1}" | Final URL: ${finalUrl}`);

      probeResults.push({ testUrl, status, title, h1, finalUrl });

      if (status === 200 && !finalUrl.includes('login') && !finalUrl.includes('noroute')) {
        const shotName = `US_PROBE_${testUrl.split('/').filter(Boolean).pop()}.png`;
        await usPage.screenshot({ path: path.join(OUT_DIR, 'desktop', shotName), fullPage: true });
        console.log(` 📸 Saved ${shotName}`);
      }
    } catch (e) {
      console.log(` Error probing ${testUrl}: ${e.message}`);
    }
  }

  // Deep inspect the active Claims Page
  console.log('\n--- Deep Inspecting Claims Listing on US Staging ---');
  await usPage.goto(`${US_BASE}/gw_sales/claim/index/status/open/`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await usPage.waitForTimeout(4000);

  const claimsPageData = await usPage.evaluate(() => {
    const data = {};
    data.title = document.title;
    data.h1 = document.querySelector('h1, .page-title')?.innerText?.trim();
    data.bodySnippet = document.body.innerText.slice(0, 1000);

    // Look for Create Claim CTA
    const createBtn = Array.from(document.querySelectorAll('a, button')).find(b => b.innerText.toLowerCase().includes('create') && b.innerText.toLowerCase().includes('claim'));
    data.createClaimBtn = createBtn ? { text: createBtn.innerText.trim(), href: createBtn.getAttribute('href') } : null;

    // Look for status tabs: ALL, OPEN, PENDING, CLOSED
    const tabs = Array.from(document.querySelectorAll('.tabs a, .filter-tabs a, [class*="tab"] a, .status-filters a, .nav-tabs a, .claims-tab a')).map(t => ({
      text: t.innerText.trim(),
      href: t.href,
      isActive: t.classList.contains('active') || t.parentElement?.classList.contains('active')
    }));
    data.statusTabs = tabs;

    // Look for Claims Table
    const table = document.querySelector('table, .table-claims, [class*="claim"] table');
    if (table) {
      const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim().replace(/\n+/g, ' '));
      const rowCount = table.querySelectorAll('tbody tr').length;
      data.table = { headers, rowCount };
    } else {
      data.table = null;
    }

    // Look for FAQs
    const faqContainer = document.querySelector('.faq, .faqs, [class*="faq"], #faq');
    if (faqContainer) {
      const faqItems = Array.from(faqContainer.querySelectorAll('.accordion, .faq-item, dt, [class*="item"]')).map(f => f.innerText.trim().slice(0, 50));
      data.faqs = { count: faqItems.length, samples: faqItems.slice(0, 3) };
    } else {
      data.faqs = null;
    }

    // Look for Need Help Block
    const needHelp = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.toLowerCase().includes('need help') && el.innerText.toLowerCase().includes('sales team'));
    data.hasNeedHelp = !!needHelp;
    data.needHelpSnippet = needHelp ? needHelp.innerText.slice(0, 300) : null;

    // Australian copy leaks
    const fullText = document.body.innerText;
    data.hasAuPhone = fullText.includes('+61') || fullText.includes('9518 1600') || fullText.includes('03 9518');
    data.hasAuEmail = fullText.includes('@globewest.com.au');
    data.hasIncGst = fullText.includes('Inc.GST') || fullText.includes('GST');

    return data;
  });

  console.log('US Claims Page Data:\n', JSON.stringify(claimsPageData, null, 2));

  // Mobile screenshot of US Claims
  console.log('\n📱 [US Staging Mobile 375x812]');
  const usMobPage = await usContext.newPage();
  await usMobPage.setViewportSize({ width: 375, height: 812 });
  await usMobPage.goto(`${US_BASE}/gw_sales/claim/index/status/open/`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await usMobPage.waitForTimeout(4000);
  await usMobPage.screenshot({ path: path.join(OUT_DIR, 'mobile', 'US_MOBILE_OPEN_CLAIMS.png'), fullPage: true });
  console.log('📸 Saved US_MOBILE_OPEN_CLAIMS.png');

  await browser.close();

  // Save audit data
  fs.writeFileSync(path.resolve(SCRIPTS_DIR, '../live_claims_audit.json'), JSON.stringify({ probeResults, claimsPageData }, null, 2));
  console.log('\n🏁 Audit complete! Saved live_claims_audit.json');
})();
