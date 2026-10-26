const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to US Forgot Password...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/forgotpassword/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Fill email
  const testEmail = 'deepali.londhe@overdose.digital';
  console.log(`Entering test email: ${testEmail}`);
  await page.fill('#email_address', testEmail);

  // Submit button
  console.log('Submitting form...');
  const submitBtn = await page.$('form.form-password-forget button[type="submit"], #form-validate button[type="submit"], button.action.submit.primary');
  
  if (submitBtn) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Navigation wait:', e.message)),
      submitBtn.click()
    ]);
  }

  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const successMsg = document.querySelector('.message-success, .messages .message-success, [data-ui-id="message-success"]');
    const errorMsg = document.querySelector('.message-error, .messages .message-error, [data-ui-id="message-error"]');
    return {
      currentUrl: window.location.href,
      successText: successMsg ? successMsg.innerText.trim() : null,
      errorText: errorMsg ? errorMsg.innerText.trim() : null,
      pageTitle: document.title
    };
  });

  console.log('Submission result:', JSON.stringify(result, null, 2));

  await page.screenshot({ path: 'Sprint-3/Ticket_41794537_Login_CreateAccount_Password/screenshots/retest_evidence/Forgot_Password_Result.png' });

  await browser.close();
})();
