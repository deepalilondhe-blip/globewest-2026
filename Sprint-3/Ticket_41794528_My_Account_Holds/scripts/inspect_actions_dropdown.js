const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome', slowMo: 300, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Logging in...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/');
  await page.waitForTimeout(2000);

  const email = page.locator('#email');
  if (await email.isVisible().catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await page.fill('#pass', 'Deep@123');
    await page.click('#send2');
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(2500);
  }

  console.log('Navigating to Holds...');
  await page.goto('https://mcstaging2.globewest.com/gw_orders/hold/index/');
  await page.waitForTimeout(3000);

  // 1. Click Actions on Row 1 (Active)
  const actionBtn1 = page.locator('.actions-menu button, button:has-text("Actions"), .action.dropdown').first();
  if (await actionBtn1.isVisible().catch(() => false)) {
    console.log('Clicking Actions dropdown on Active Row 1...');
    await actionBtn1.click();
    await page.waitForTimeout(1000);

    const activeDropdownItems = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.actions-menu.active a, .dropdown-menu a, [class*="action"] li a, ul.dropdown a, .active ul a')).filter(a => a.offsetParent !== null);
      return items.map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') }));
    });
    console.log('Active Hold Actions Dropdown Items:', activeDropdownItems);

    await page.screenshot({ path: path.resolve(__dirname, '../screenshots/desktop/actions_dropdown_active_open.png') });
  }

  // 2. Click INACTIVE tab
  const inactiveBtn = page.locator('.account-listing-ui__filters__filter:has-text("INACTIVE")').first();
  if (await inactiveBtn.isVisible().catch(() => false)) {
    console.log('Switching to INACTIVE tab...');
    await inactiveBtn.click();
    await page.waitForTimeout(2000);

    const actionBtnInactive = page.locator('.actions-menu button, button:has-text("Actions"), .action.dropdown').first();
    if (await actionBtnInactive.isVisible().catch(() => false)) {
      console.log('Clicking Actions dropdown on Inactive Row 1...');
      await actionBtnInactive.click();
      await page.waitForTimeout(1000);

      const inactiveDropdownItems = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.actions-menu.active a, .dropdown-menu a, [class*="action"] li a, ul.dropdown a, .active ul a')).filter(a => a.offsetParent !== null);
        return items.map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') }));
      });
      console.log('Inactive Hold Actions Dropdown Items:', inactiveDropdownItems);

      await page.screenshot({ path: path.resolve(__dirname, '../screenshots/desktop/actions_dropdown_inactive_open.png') });
    }
  }

  await browser.close();
})();
