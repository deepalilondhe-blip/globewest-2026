const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const US_CREDS = { email: 'deepali.londhe@overdose.digital', pass: 'Deep@123' };
const OUT_DIR = path.resolve(SCRIPTS_DIR, '../screenshots');

fs.mkdirSync(path.join(OUT_DIR, 'desktop'), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, 'mobile'), { recursive: true });

(async () => {
  console.log('📸 Capturing live US Staging Claims pages...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });

  // 1. Desktop
  const dtContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dtPage = await dtContext.newPage();

  await dtPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await dtPage.waitForTimeout(2000);
  if (await dtPage.locator('#email').isVisible()) {
    await dtPage.fill('#email', US_CREDS.email);
    await dtPage.fill('#pass', US_CREDS.pass);
    await dtPage.click('#send2');
    await dtPage.waitForNavigation({ timeout: 30000 }).catch(() => {});
    await dtPage.waitForTimeout(4000);
  }

  // Go to Open Claims
  console.log('Navigating to live US Open Claims...');
  await dtPage.goto(`${US_BASE}/gw_sales/claim/index/status/open/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await dtPage.waitForTimeout(4000);
  await dtPage.screenshot({ path: path.join(OUT_DIR, 'desktop', 'LIVE_US_DESKTOP_OPEN_CLAIMS.png'), fullPage: true });
  console.log('Saved LIVE_US_DESKTOP_OPEN_CLAIMS.png');

  // Go to base Claims index
  console.log('Navigating to live US Base Claims index...');
  await dtPage.goto(`${US_BASE}/gw_sales/claim/index/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await dtPage.waitForTimeout(4000);
  await dtPage.screenshot({ path: path.join(OUT_DIR, 'desktop', 'LIVE_US_DESKTOP_CLAIMS_INDEX.png'), fullPage: true });
  console.log('Saved LIVE_US_DESKTOP_CLAIMS_INDEX.png');

  // Check if Create Claim button or link exists
  const createClaimLink = await dtPage.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText.toLowerCase().includes('create') && el.innerText.toLowerCase().includes('claim'));
    return btn ? { text: btn.innerText.trim(), href: btn.getAttribute('href') } : null;
  });
  console.log('Create Claim CTA on live page:', createClaimLink);

  if (createClaimLink && createClaimLink.href) {
    await dtPage.goto(createClaimLink.href, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await dtPage.waitForTimeout(4000);
    await dtPage.screenshot({ path: path.join(OUT_DIR, 'desktop', 'LIVE_US_DESKTOP_CREATE_CLAIM.png'), fullPage: true });
    console.log('Saved LIVE_US_DESKTOP_CREATE_CLAIM.png');
  }

  // 2. Mobile View
  const mobContext = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true });
  const mobPage = await mobContext.newPage();

  // Mobile cookies share or login
  await mobPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobPage.waitForTimeout(2000);
  if (await mobPage.locator('#email').isVisible()) {
    await mobPage.fill('#email', US_CREDS.email);
    await mobPage.fill('#pass', US_CREDS.pass);
    await mobPage.click('#send2');
    await mobPage.waitForNavigation({ timeout: 30000 }).catch(() => {});
    await mobPage.waitForTimeout(4000);
  }

  await mobPage.goto(`${US_BASE}/gw_sales/claim/index/status/open/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobPage.waitForTimeout(4000);
  await mobPage.screenshot({ path: path.join(OUT_DIR, 'mobile', 'LIVE_US_MOBILE_OPEN_CLAIMS.png'), fullPage: true });
  console.log('Saved LIVE_US_MOBILE_OPEN_CLAIMS.png');

  await browser.close();
  console.log('🏁 Finished capturing live US Claims pages!');
})();
