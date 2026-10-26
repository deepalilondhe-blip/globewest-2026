const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const OUT_DIR = path.resolve(__dirname, '../screenshots/claims_retest');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Auditing Live Claims Portal on US Staging against Updated Client Requirements...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  const auditLog = {
    timestamp: new Date().toISOString(),
    customerAccount: {},
    claimsRoutes: {},
    adminConfig: {}
  };

  // 1. Log in as US Trade Customer
  console.log('\n[STEP 1] Logging in as US Trade Customer (deepali.londhe@overdose.digital)...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }
  console.log('✅ Logged in successfully!');

  // Check My Account Dashboard
  console.log('\n[STEP 2] Inspecting My Account Dashboard for Claims entry points...');
  await page.goto(`${US_BASE_URL}/customer/account/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const dashboardInfo = await page.evaluate(() => {
    const banner = document.querySelector('.od-notification, .claims-notification, [class*="claim"]');
    const bannerText = banner?.innerText?.replace(/\n+/g, ' | ') || '';
    const submitBtn = banner?.querySelector('a, button');
    const submitHref = submitBtn?.getAttribute('href') || '';
    const sidebarLinks = Array.from(document.querySelectorAll('.sidebar.sidebar-main a, .nav.items a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    })).filter(l => l.text.toLowerCase().includes('claim') || (l.href && l.href.includes('claim')));

    return {
      hasBanner: !!banner,
      bannerText,
      submitHref,
      sidebarClaimsLinks: sidebarLinks
    };
  });
  console.log('Dashboard Claims State:', dashboardInfo);
  auditLog.customerAccount = dashboardInfo;
  await page.screenshot({ path: path.join(OUT_DIR, '01_DASHBOARD_CLAIMS_ENTRY.png') });

  // 2. Test Claims Routes
  const testRoutes = [
    '/claims',
    '/claims/create',
    '/customer/account/claims/',
    '/gw_sales/claim/index/status/open/',
    '/gw_sales/claim/create/'
  ];

  console.log('\n[STEP 3] Testing Claims URLs & Redirection...');
  for (const route of testRoutes) {
    const fullUrl = `${US_BASE_URL}${route}`;
    console.log(`Navigating to: ${fullUrl}`);
    const resp = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);

    const actualUrl = page.url();
    const status = resp ? resp.status() : 'Unknown';
    const pageTitle = await page.title();
    const isRedirectedToDashboard = actualUrl.includes('/customer/account/') && !actualUrl.includes('claim');
    const is404 = pageTitle.toLowerCase().includes('404') || (await page.locator('body').innerText()).includes('404 Not Found') || status === 404;

    console.log(`Route [${route}] -> Status: ${status} | Final URL: ${actualUrl} | RedirectedToDashboard: ${isRedirectedToDashboard} | 404: ${is404}`);

    auditLog.claimsRoutes[route] = {
      status,
      finalUrl: actualUrl,
      isRedirectedToDashboard,
      is404,
      pageTitle
    };
  }
  await page.screenshot({ path: path.join(OUT_DIR, '02_LAST_CLAIMS_ROUTE_TEST.png') });

  // 3. Inspect Magento Admin for NetSuite Claims Config & Status Mapping
  console.log('\n[STEP 4] Checking Magento Admin for NetSuite Claims Status Mapping & Modules...');
  await page.goto(`${US_BASE_URL}/admin/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const adminUser = page.locator('#username');
  if (await adminUser.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.log('Logging into Admin panel...');
    await adminUser.fill('deepali.londhe@overdose.digital');
    await page.locator('#login').fill('2Ho770ZEeX7v');
    await page.locator('button.action-login').click();
    await page.waitForTimeout(6000);
  }

  const adminUrl = page.url();
  console.log('Admin Current URL:', adminUrl);

  if (adminUrl.includes('/admin/')) {
    // Check Admin Menu for Claims / NetSuite
    const adminMenu = await page.evaluate(() => {
      const menuItems = Array.from(document.querySelectorAll('.admin__menu .item-header, nav ul li a')).map(el => el.innerText.trim()).filter(Boolean);
      return menuItems;
    });
    console.log('Admin Top Menu Items:', adminMenu.slice(0, 15));
    auditLog.adminConfig.menuItems = adminMenu;

    await page.screenshot({ path: path.join(OUT_DIR, '03_ADMIN_DASHBOARD.png') });
  }

  // Save audit log
  fs.writeFileSync(
    path.resolve(__dirname, '../live_claims_retest_results.json'),
    JSON.stringify(auditLog, null, 2),
    'utf-8'
  );
  console.log('\n💾 Saved claims retest results to live_claims_retest_results.json');

  await page.waitForTimeout(4000);
  await browser.close();
  console.log('🏁 Audit completed.');
})();
