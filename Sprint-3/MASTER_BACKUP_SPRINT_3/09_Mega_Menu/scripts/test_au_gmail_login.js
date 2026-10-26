const { chromium } = require('playwright');

(async () => {
  console.log('Testing AU login with deepalilondhe576@gmail.com / Deep@123...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://mcstaging2.globewest.com.au/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Clear overlays
  await page.evaluate(() => {
    document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup').forEach(el => el.remove());
  }).catch(() => {});

  console.log('Filling form with deepalilondhe576@gmail.com...');
  await page.fill('#email', 'deepalilondhe576@gmail.com');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');

  await page.waitForTimeout(6000);

  const url = page.url();
  console.log('Post-login AU URL:', url);

  const messages = await page.locator('.message-error, .message-success, .message-notice, .messages').allInnerTexts().catch(() => []);
  console.log('AU Messages:', messages);

  const isLoggedIn = url.includes('/customer/account') && !url.includes('/login');
  console.log('Is AU Logged In?:', isLoggedIn);

  await page.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/au_gmail_login_test.png' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
