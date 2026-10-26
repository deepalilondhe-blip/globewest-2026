const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const contextMob = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    viewport: { width: 393, height: 852 }
  });
  const page = await contextMob.newPage();
  
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');
  await page.waitForURL('**/customer/account/**', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Take screenshot of closed mobile dashboard top
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/02_mobile_dashboard_closed.png') });

  // Click the mobile account nav toggle (MY DASHBOARD dropdown button)
  const acctToggle = page.locator('.js-account-nav-toggle, .account-nav__btn').first();
  if (await acctToggle.isVisible().catch(() => false)) {
    console.log('Clicking mobile account nav toggle...');
    await acctToggle.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.resolve(__dirname, '../screenshots/03_mobile_account_nav_dropdown_open.png') });
    console.log('Mobile account nav dropdown screenshot saved.');
  } else {
    console.log('Mobile account nav toggle not visible, checking header user icon...');
    const userIcon = page.locator('.header .action.od-auth-popup__link, [data-action="customer-menu-toggle"]').first();
    if (await userIcon.isVisible().catch(() => false)) {
      await userIcon.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.resolve(__dirname, '../screenshots/03_mobile_header_account_dropdown_open.png') });
    }
  }

  await browser.close();
  console.log('Done.');
})();
