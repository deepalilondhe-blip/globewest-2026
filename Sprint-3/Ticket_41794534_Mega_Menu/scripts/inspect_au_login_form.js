const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome', slowMo: 300 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Inspecting login page form...');
  await page.goto('https://mcstaging2.globewest.com.au/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const formDetails = await page.evaluate(() => {
    const form = document.querySelector('form.form-login, #login-form');
    if (!form) return { formFound: false };
    const inputs = Array.from(form.querySelectorAll('input')).map(i => ({
      name: i.name,
      id: i.id,
      type: i.type,
      value: i.value
    }));
    const buttons = Array.from(form.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      id: b.id,
      type: b.type,
      classes: b.className
    }));
    return {
      formFound: true,
      action: form.action,
      method: form.method,
      inputs,
      buttons
    };
  });

  console.log('Login form details:', JSON.stringify(formDetails, null, 2));

  // Now click button properly and wait for navigation
  console.log('Attempting form submit...');
  await page.fill('#email', 'deepalilondhe576@gmail.com');
  await page.fill('#pass', 'Deep@123');
  await page.waitForTimeout(1000);

  const [response] = await Promise.all([
    page.waitForNavigation({ timeout: 20000 }).catch(() => null),
    page.click('#send2, button.action.login.primary')
  ]);

  console.log('Navigation response status:', response ? response.status() : 'None');
  console.log('Final URL:', page.url());

  const messages = await page.locator('.message-error, .message-success, .message-notice, .messages, [data-ui-id*="message"]').allInnerTexts().catch(() => []);
  console.log('Messages after submit:', messages);

  await page.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/au_gmail_submit_result.png' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
