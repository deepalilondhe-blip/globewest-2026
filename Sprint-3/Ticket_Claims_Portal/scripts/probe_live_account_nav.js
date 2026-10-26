const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';
const US_CREDS = { email: 'deepali.londhe@overdose.digital', pass: 'Deep@123' };

(async () => {
  console.log('🔐 Authenticating on US Staging to inspect My Account menu links...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Fill login
  if (await page.locator('#email').isVisible()) {
    await page.fill('#email', US_CREDS.email);
    await page.fill('#pass', US_CREDS.pass);
    await page.click('#send2');
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
  }

  console.log('Current URL after login:', page.url());

  // Extract all account navigation links
  const accountLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.block-collapsible-nav a, .account-nav a, .sidebar a, nav a'));
    return links.map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href')
    })).filter(l => l.text && l.href && (l.href.includes('customer') || l.href.includes('account') || l.href.includes('claim') || l.href.includes('sales')));
  });

  console.log('Account navigation links found on live US staging:');
  console.log(JSON.stringify(accountLinks, null, 2));

  // Screenshot live account dashboard
  await page.screenshot({ path: path.join(__dirname, '../screenshots/US_LIVE_ACCOUNT_NAV.png') });

  await browser.close();
})();
