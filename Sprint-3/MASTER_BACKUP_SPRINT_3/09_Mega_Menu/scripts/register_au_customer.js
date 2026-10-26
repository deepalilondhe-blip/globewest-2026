const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/customer_registration');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 REGISTERING AU CUSTOMER ACCOUNT IN HEADED CHROME');
  console.log('   Site:     https://mcstaging2.globewest.com.au');
  console.log('   Email:    deepalilondhe576@gmail.com');
  console.log('   Password: Deep@123');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--no-sandbox', '--start-maximized']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    console.log('Navigating to AU Create Account page...');
    await page.goto('https://mcstaging2.globewest.com.au/customer/account/create/', {
      timeout: 60000,
      waitUntil: 'domcontentloaded'
    });
    await page.waitForTimeout(2500);

    // Clear popups/shrouds
    await page.evaluate(() => {
      document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal').forEach(el => el.remove());
    }).catch(() => {});

    // Fill form
    console.log('Entering First Name...');
    const fName = page.locator('#firstname, input[name="firstname"]').first();
    await fName.fill('Deepali');

    console.log('Entering Last Name...');
    const lName = page.locator('#lastname, input[name="lastname"]').first();
    await lName.fill('Londhe');

    console.log('Entering Email (deepalilondhe576@gmail.com)...');
    const emailField = page.locator('#email_address, input[name="email"]').first();
    await emailField.fill('deepalilondhe576@gmail.com');

    console.log('Entering Password (Deep@123)...');
    const passField = page.locator('#password, input[name="password"]').first();
    await passField.fill('Deep@123');

    console.log('Entering Confirm Password (Deep@123)...');
    const confirmPass = page.locator('#password-confirmation, input[name="password_confirmation"]').first();
    await confirmPass.fill('Deep@123');

    // Check if there are other fields like phone or terms
    const phoneField = page.locator('#telephone, input[name="telephone"]').first();
    if (await phoneField.isVisible().catch(() => false)) {
      console.log('Entering phone number...');
      await phoneField.fill('0412345678');
    }

    const termsCheckbox = page.locator('input[type="checkbox"][name*="term"], input[type="checkbox"][name*="agree"]').first();
    if (await termsCheckbox.isVisible().catch(() => false)) {
      await termsCheckbox.check();
    }

    await page.screenshot({ path: path.join(OUT_DIR, '01_form_filled.png') });
    console.log('📸 Form filled screenshot saved.');

    // Submit form
    console.log('Submitting Registration Form...');
    const submitBtn = page.locator('button[type="submit"].action.submit, button.action.submit.primary, button:has-text("Create an Account")').first();
    
    await Promise.all([
      page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}),
      submitBtn.click()
    ]);

    await page.waitForTimeout(4000);

    const currentUrl = page.url();
    console.log(`\nPost-Registration URL: ${currentUrl}`);

    const messages = await page.locator('.message-success, .message-error, .message-notice, .messages, [data-ui-id*="message"]').allInnerTexts().catch(() => []);
    console.log('System Messages:', messages);

    await page.screenshot({ path: path.join(OUT_DIR, '02_registration_result.png') });
    console.log('📸 Registration result screenshot saved.');

    if (currentUrl.includes('/customer/account') && !currentUrl.includes('/create')) {
      console.log('\n🎉 SUCCESS: Customer account successfully created and logged into AU Staging!');
    } else {
      console.log('\nℹ️ Check screenshots for registration state.');
    }

    await page.waitForTimeout(5000);
    await browser.close();
  } catch (err) {
    console.error('Error during registration:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
