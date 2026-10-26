const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    viewport: { width: 393, height: 852 }
  });
  const page = await context.newPage();
  
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');
  await page.waitForURL('**/customer/account/**', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Check header user icon
  const userIcon = page.locator('.header a:has(.icon-user), .header [class*="auth-popup__link"], .header [data-action="customer-menu-toggle"], .header a[href*="customer/account"]').first();
  console.log('User icon found:', await userIcon.getAttribute('href'), await userIcon.getAttribute('class'));
  
  // Try clicking
  await userIcon.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/04_mobile_user_icon_clicked.png') });
  console.log('URL after click:', page.url());
  
  await browser.close();
})();
