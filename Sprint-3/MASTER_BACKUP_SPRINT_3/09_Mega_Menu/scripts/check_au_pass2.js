const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome', slowMo: 300 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Testing AU storefront login with Deepali@$1234...');
  await page.goto('https://mcstaging2.globewest.com.au/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deepali@$1234');
  await page.click('#send2');
  await page.waitForTimeout(5000);

  console.log('Post-login AU URL:', page.url());
  const messages = await page.locator('.message-error, .message-success, .message-notice, .messages').allInnerTexts().catch(() => []);
  console.log('Messages on AU page:', messages);

  if (page.url().includes('/customer/account') && !page.url().includes('/login')) {
    console.log('🎉 SUCCESS! AU login worked with Deepali@$1234!');
  } else {
    console.log('AU login failed with Deepali@$1234.');
  }

  await browser.close();
})();
