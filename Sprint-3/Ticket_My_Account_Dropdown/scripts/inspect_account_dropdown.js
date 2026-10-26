const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  
  // 1. Desktop Audit
  console.log('--- DESKTOP AUDIT (1440x900) ---');
  const contextDesk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageDesk = await contextDesk.newPage();
  
  await pageDesk.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pageDesk.fill('#email', 'deepali.londhe@overdose.digital');
  await pageDesk.fill('#pass', 'Deep@123');
  await pageDesk.click('#send2');
  await pageDesk.waitForURL('**/customer/account/**', { timeout: 30000 }).catch(() => {});
  await pageDesk.waitForTimeout(3000);
  
  // Locate My Account trigger
  const trigger = pageDesk.locator('.js-account-dropdown-menu-trigger, a:has-text("My Account")').first();
  console.log('Trigger found. Clicking trigger to open dropdown...');
  await trigger.click();
  await pageDesk.waitForTimeout(1500);
  
  // Take screenshot of open dropdown
  const deskScreenshotPath = path.resolve(__dirname, '../screenshots/01_desktop_account_dropdown_open.png');
  await pageDesk.screenshot({ path: deskScreenshotPath });
  console.log('Desktop screenshot saved:', deskScreenshotPath);
  
  // Extract desktop dropdown data
  const deskData = await pageDesk.evaluate(() => {
    const menu = document.querySelector('.js-account-dropdown-menu, .account-dropdown-menu, .account-dropdown');
    if (!menu) return { error: 'Dropdown menu not found in DOM' };
    
    const items = Array.from(menu.querySelectorAll('a, li, .nav.item')).map(el => ({
      text: el.innerText ? el.innerText.trim().replace(/\n/g, ' ') : '',
      href: el.getAttribute('href') || (el.querySelector('a') ? el.querySelector('a').getAttribute('href') : null),
      tag: el.tagName,
      className: el.className
    })).filter(i => i.text.length > 0);
    
    const computed = window.getComputedStyle(menu);
    return {
      isVisible: menu.offsetParent !== null || computed.display !== 'none',
      display: computed.display,
      backgroundColor: computed.backgroundColor,
      boxShadow: computed.boxShadow,
      borderRadius: computed.borderRadius,
      items: items
    };
  });
  console.log('Desktop Dropdown Data:', JSON.stringify(deskData, null, 2));
  fs.writeFileSync(path.resolve(__dirname, '../screenshots/desktop_dropdown_dom.json'), JSON.stringify(deskData, null, 2));

  // 2. Mobile Audit
  console.log('\n--- MOBILE AUDIT (iPhone 14 Pro 393x852) ---');
  const contextMob = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    viewport: { width: 393, height: 852 }
  });
  const pageMob = await contextMob.newPage();
  
  await pageMob.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pageMob.fill('#email', 'deepali.londhe@overdose.digital');
  await pageMob.fill('#pass', 'Deep@123');
  await pageMob.click('#send2');
  await pageMob.waitForURL('**/customer/account/**', { timeout: 30000 }).catch(() => {});
  await pageMob.waitForTimeout(3000);
  
  // Click hamburger or account menu on mobile
  const burger = pageMob.locator('.nav-toggle, button.action.nav-toggle, [data-action="toggle-nav"]').first();
  if (await burger.isVisible().catch(() => false)) {
    console.log('Clicking mobile hamburger menu...');
    await burger.click();
    await pageMob.waitForTimeout(1500);
  }
  
  const mobScreenshotPath = path.resolve(__dirname, '../screenshots/02_mobile_account_nav_open.png');
  await pageMob.screenshot({ path: mobScreenshotPath });
  console.log('Mobile screenshot saved:', mobScreenshotPath);
  
  // Check account select toggle on mobile dashboard
  const acctToggle = pageMob.locator('.js-account-nav-toggle, .account-nav__btn').first();
  if (await acctToggle.isVisible().catch(() => false)) {
    console.log('Clicking mobile account nav toggle...');
    await acctToggle.click();
    await pageMob.waitForTimeout(1000);
    await pageMob.screenshot({ path: path.resolve(__dirname, '../screenshots/03_mobile_account_dropdown_toggle_open.png') });
  }

  await browser.close();
  console.log('Audit completed successfully.');
})();
