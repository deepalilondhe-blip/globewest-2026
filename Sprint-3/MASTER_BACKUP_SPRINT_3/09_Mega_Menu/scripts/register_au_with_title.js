const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/customer_registration');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 REGISTERING AU CUSTOMER ACCOUNT (WITH TITLE & POPUP DISMISSAL)');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://mcstaging2.globewest.com.au/customer/account/create/', {
    timeout: 60000,
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(3000);

  // 1. Remove all newsletter/survey popups and overlays
  console.log('Clearing popups and shrouds...');
  await page.evaluate(() => {
    // Remove newsletter popup, overlay, lp shroud
    const popups = document.querySelectorAll('[class*="newsletter"], [id*="newsletter"], .modal-popup, .ui-widget-overlay, [class*="shroud"], [class*="popup"], [id*="klaviyo"]');
    popups.forEach(p => p.remove());
    // Also remove any backdrop
    document.querySelectorAll('.modals-wrapper, .ui-widget-overlay').forEach(el => el.remove());
  }).catch(() => {});
  await page.waitForTimeout(1000);

  const form = page.locator('form#form-validate').first();

  // 2. Select Title (Prefix)
  console.log('Selecting Title...');
  const titleSelect = form.locator('select#prefix, select[name="prefix"]').first();
  if (await titleSelect.isVisible().catch(() => false)) {
    await titleSelect.selectOption({ label: 'Miss' }).catch(async () => {
      await titleSelect.selectOption({ index: 1 });
    });
    console.log('Title selected.');
  }

  // 3. Fill First & Last Name
  console.log('Filling Name...');
  await form.locator('input[name="firstname"]').fill('Deepali');
  await form.locator('input[name="lastname"]').fill('Londhe');

  // 4. Fill Email
  console.log('Filling Email: deepalilondhe576@gmail.com...');
  await form.locator('input[name="email"]').fill('deepalilondhe576@gmail.com');

  // 5. Fill Password & Confirm
  console.log('Filling Password: Deep@123...');
  await form.locator('input[name="password"]').fill('Deep@123');
  await form.locator('input[name="password_confirmation"]').fill('Deep@123');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '04_perfect_form_ready.png') });

  // 6. Submit using DOM click and force to bypass any live chat popovers
  console.log('Clicking CREATE ACCOUNT button...');
  await page.evaluate(() => {
    // Remove any shroud or popup that might intercept
    document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup').forEach(el => el.remove());
    const btn = document.querySelector('form#form-validate button[type="submit"]');
    if (btn) btn.click();
  });

  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(5000);

  console.log('Post-submit URL:', page.url());
  const messages = await page.locator('.message-success, .message-error, .messages').allInnerTexts().catch(() => []);
  console.log('Post-submit messages:', messages);

  await page.screenshot({ path: path.join(OUT_DIR, '05_perfect_form_submitted.png') });

  const isLoggedIn = page.url().includes('/customer/account') && !page.url().includes('/create');
  console.log('Is successfully registered and logged in?:', isLoggedIn);

  await page.waitForTimeout(4000);
  await browser.close();
})();
