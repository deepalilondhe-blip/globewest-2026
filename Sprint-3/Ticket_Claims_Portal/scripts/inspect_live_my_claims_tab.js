const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots/my_claims_live');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  console.log('🚀 Navigating to My Account to Inspect and Click "MY CLAIMS" Option...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 500,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // 1. LOGIN
  console.log('1. Logging in as US Trade Customer (deepali.londhe@overdose.digital)...');
  await page.goto(`${US_BASE}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const email = page.locator('#email');
  if (await email.isVisible({ timeout: 4000 }).catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(5000);
  }

  // 2. DASHBOARD
  console.log('2. Landed on Dashboard: ' + page.url());
  await page.goto(`${US_BASE}/customer/account/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Take screenshot before clicking
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_DASHBOARD_BEFORE_MY_CLAIMS_CLICK.png'), fullPage: true });

  // 3. FIND "MY CLAIMS" OPTION
  console.log('3. Searching for "MY CLAIMS" option...');
  const myClaimsBtn = page.locator('button:has-text("MY CLAIMS"), a:has-text("MY CLAIMS"), .dashboard-tab:has-text("MY CLAIMS"), [data-tab*="claim"]').first();
  
  if (await myClaimsBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('✅ Found "MY CLAIMS" option! Clicking it now...');
    // Highlight it first
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.trim().toUpperCase() === 'MY CLAIMS');
      if (btn) {
        btn.style.outline = '4px solid #00CC66';
        btn.style.boxShadow = '0 0 15px #00CC66';
      }
    });
    await page.waitForTimeout(1000);
    await myClaimsBtn.click();
    await page.waitForTimeout(3000);

    // Screenshot after click
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_AFTER_MY_CLAIMS_CLICK.png'), fullPage: true });
    console.log('📸 Captured screenshot after clicking MY CLAIMS!');
  } else {
    console.log('⚠️ Could not find visible "MY CLAIMS" button/tab with exact text. Scanning all account tabs...');
  }

  // Inspect all elements inside the active tab/card
  const claimsCardInspection = await page.evaluate(() => {
    const activeTab = document.querySelector('.tab-content.active, .account-tab-content, .block-dashboard-orders, .block-dashboard-claims, [id*="claim"]');
    const allText = document.body.innerText;
    
    // Find all links/buttons inside claims section
    const buttons = Array.from(document.querySelectorAll('button, a')).filter(el => {
      const t = el.innerText.trim().toLowerCase();
      return t.includes('claim') || t.includes('submit claim') || t.includes('open claims') || t.includes('closed claims');
    }).map(el => ({
      text: el.innerText.trim(),
      tag: el.tagName,
      href: el.getAttribute('href') || '',
      className: el.className
    }));

    // Check for any table rendered
    const tables = Array.from(document.querySelectorAll('table')).map(t => ({
      headers: Array.from(t.querySelectorAll('th')).map(th => th.innerText.trim()),
      rowCount: t.querySelectorAll('tbody tr').length
    }));

    return {
      buttons,
      tables,
      bodySnippet: allText.substring(0, 500)
    };
  });

  console.log('\nClaims Section Inspection Result:');
  console.log(JSON.stringify(claimsCardInspection, null, 2));

  // 4. TEST SUBMIT CLAIM BUTTON ON DASHBOARD
  console.log('\n4. Testing "SUBMIT CLAIM" button on Dashboard...');
  const submitClaimBtn = page.locator('a:has-text("SUBMIT CLAIM"), button:has-text("SUBMIT CLAIM")').first();
  if (await submitClaimBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    const href = await submitClaimBtn.getAttribute('href');
    console.log(`SUBMIT CLAIM href: "${href}"`);
    console.log('Clicking "SUBMIT CLAIM"...');
    await submitClaimBtn.click();
    await page.waitForTimeout(3000);
    console.log(`URL after clicking SUBMIT CLAIM: ${page.url()}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_AFTER_SUBMIT_CLAIM_CLICK.png') });
  }

  // 5. TEST "OPEN CLAIMS" LINK
  console.log('\n5. Testing "Open Claims" link in dashboard/sidebar...');
  const openClaimsLink = page.locator('a:has-text("Open Claims")').first();
  if (await openClaimsLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    const href = await openClaimsLink.getAttribute('href');
    console.log(`Open Claims href: "${href}"`);
    console.log('Clicking "Open Claims"...');
    await openClaimsLink.click();
    await page.waitForTimeout(4000);
    console.log(`URL after clicking Open Claims: ${page.url()}`);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_AFTER_OPEN_CLAIMS_CLICK.png'), fullPage: true });
  }

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('\n🏁 My Claims live inspection complete.');
})();
