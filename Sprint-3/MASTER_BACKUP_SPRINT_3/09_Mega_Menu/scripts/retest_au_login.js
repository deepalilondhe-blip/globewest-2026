const { chromium } = require('playwright');

(async () => {
  console.log('Testing AU storefront login now...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://mcstaging2.globewest.com.au/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Clear any overlays
  await page.evaluate(() => {
    document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup').forEach(el => el.remove());
  }).catch(() => {});

  console.log('Entering deepali.londhe@overdose.digital / Deep@123...');
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');

  await page.waitForTimeout(5000);

  const url = page.url();
  console.log('Post-login AU URL:', url);

  const messages = await page.locator('.message-error, .message-success, .message-notice, .messages').allInnerTexts().catch(() => []);
  console.log('AU Messages:', messages);

  const isLoggedIn = url.includes('/customer/account') && !url.includes('/login');
  console.log('Is AU Logged In?:', isLoggedIn);

  await page.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/au_login_retest.png' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
