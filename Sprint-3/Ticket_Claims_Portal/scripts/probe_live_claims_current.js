const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';

(async () => {
  console.log('========================================================================');
  console.log('🚀 LIVE DEEP RETEST: CLAIMS PORTAL (#41794532)');
  console.log('Testing live US staging against Figma Frames 630, 631, & Blueprint');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // 1. LOGIN TO US TRADE ACCOUNT
  console.log('▶ [1/4] Logging in as US Trade Customer (deepali.londhe@overdose.digital)...');
  await page.goto(`${US_BASE}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const email = page.locator('#email');
  if (await email.isVisible({ timeout: 4000 }).catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(5000);
  }

  console.log(`Current Landed URL: ${page.url()}`);

  // 2. INSPECT DASHBOARD CLAIMS ENTRY POINTS & SIDEBAR
  console.log('\n▶ [2/4] Inspecting Account Dashboard & Left Sidebar for Claims links...');
  await page.goto(`${US_BASE}/customer/account/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const sidebarLinks = await page.evaluate(() => {
    const navItems = Array.from(document.querySelectorAll('.sidebar .nav.item a, .account-nav a, a[href*="claim"]'));
    return navItems.map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href'),
      className: a.className
    }));
  });
  console.log('Sidebar / Account Navigation Links related to Claims:');
  const claimsRelated = sidebarLinks.filter(l => l.text.toLowerCase().includes('claim') || l.href?.toLowerCase().includes('claim'));
  console.log(JSON.stringify(claimsRelated.length ? claimsRelated : 'NO_EXPLICIT_CLAIMS_LINK_FOUND', null, 2));

  // Check Dashboard Submit Claim Card
  const dashboardClaimCards = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('a, button')).filter(el => 
      el.innerText.toLowerCase().includes('claim') || 
      el.innerText.toLowerCase().includes('submit claim') ||
      el.innerText.toLowerCase().includes('create claim')
    );
    return buttons.map(b => ({
      text: b.innerText.trim(),
      tagName: b.tagName,
      href: b.getAttribute('href') || '',
      onclick: b.getAttribute('onclick') || ''
    }));
  });
  console.log('Dashboard Claim Action Buttons:');
  console.log(JSON.stringify(dashboardClaimCards, null, 2));

  // 3. PROBE ALL POSSIBLE CLAIMS ROUTES ON US STAGING
  console.log('\n▶ [3/4] Probing all potential Claims URLs on US Staging...');
  const probeUrls = [
    `${US_BASE}/claims`,
    `${US_BASE}/claims/`,
    `${US_BASE}/claims/create`,
    `${US_BASE}/claims/index`,
    `${US_BASE}/gw_sales/claim/`,
    `${US_BASE}/gw_sales/claim/index/`,
    `${US_BASE}/gw_sales/claim/index/status/open/`,
    `${US_BASE}/gw_sales/claim/index/status/pending/`,
    `${US_BASE}/gw_sales/claim/index/status/closed/`,
    `${US_BASE}/gw_sales/claim/create/`,
    `${US_BASE}/sales/claim/index/`,
    `${US_BASE}/customer/account/claims/`
  ];

  const probeResults = [];
  for (const url of probeUrls) {
    console.log(`Probing URL: ${url}`);
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => ({ error: e.message }));
    await page.waitForTimeout(1500);
    const finalUrl = page.url();
    const status = response && response.status ? response.status() : 'Error';
    const title = await page.title();
    const isRedirect = finalUrl !== url;
    
    // Check page content
    const pageInspection = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.innerText?.trim() || '';
      const body = document.body.innerText;
      const hasForm = !!document.querySelector('form.claim-form, form#claim-create, .claims-form');
      const hasTable = !!document.querySelector('.claims-table, table.data-table, #my-claims-table');
      const is404 = body.includes('Page Not Found') || body.includes('404') || h1.includes('404');
      const isDashboard = window.location.pathname === '/customer/account/' || window.location.pathname === '/customer/account';
      return { h1, hasForm, hasTable, is404, isDashboard };
    });

    probeResults.push({
      testedUrl: url,
      finalUrl,
      status,
      title,
      isRedirect,
      pageInspection
    });
    console.log(`   -> Final: ${finalUrl} | Status: ${status} | H1: "${pageInspection.h1}" | Redirect: ${isRedirect ? 'YES' : 'NO'}`);
  }

  // 4. CHECK AU BASELINE FOR CLAIMS STRUCTURE COMPARISON
  console.log('\n▶ [4/4] Checking AU Baseline Claims Structure (mcstaging2.globewest.com.au)...');
  await page.goto(`${AU_BASE}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  const auEmail = page.locator('#email');
  if (await auEmail.isVisible({ timeout: 4000 }).catch(() => false)) {
    await auEmail.fill('deepalilondhe576@gmail.com');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(5000);
  }

  await page.goto(`${AU_BASE}/gw_sales/claim/index/status/open/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  const auClaimsFinalUrl = page.url();
  const auPageInspection = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.innerText?.trim() || '';
    const body = document.body.innerText;
    const hasTable = !!document.querySelector('table');
    return { h1, hasTable, snippet: body.substring(0, 200).replace(/\n+/g, ' ') };
  });
  console.log(`AU Baseline Final URL: ${auClaimsFinalUrl}`);
  console.log('AU Baseline Inspection:', auPageInspection);

  await page.waitForTimeout(3000);
  await browser.close();

  // Save report to JSON
  const outJson = path.resolve(__dirname, '../live_claims_probe_current.json');
  fs.writeFileSync(outJson, JSON.stringify({ timestamp: new Date().toISOString(), probeResults, auPageInspection }, null, 2));
  console.log(`\n💾 Saved live probe results to: ${outJson}`);
  console.log('\n🏁 Probe Finished.');
})();
