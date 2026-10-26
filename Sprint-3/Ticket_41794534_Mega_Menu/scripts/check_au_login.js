const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  console.log('Navigating to AU login page...');
  await page.goto('https://mcstaging2.globewest.com.au/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  console.log('Filling AU login form...');
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');

  await page.waitForTimeout(5000);

  const url = page.url();
  console.log('Post-login AU URL:', url);

  const messages = await page.locator('.message-error, .message-success, .message-notice, .messages').allInnerTexts().catch(() => []);
  console.log('Messages on AU page:', messages);

  const headerUser = await page.locator('.customer-welcome, .header .greet, .welcome, .customer-name').allInnerTexts().catch(() => []);
  console.log('Header user info:', headerUser);

  await page.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/au_login_attempt.png' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
