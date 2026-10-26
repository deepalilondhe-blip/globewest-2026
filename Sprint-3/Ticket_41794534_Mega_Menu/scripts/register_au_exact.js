const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/customer_registration');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('Inspecting AU registration page inputs...');
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

  // Clear overlays
  await page.evaluate(() => {
    document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal').forEach(el => el.remove());
  }).catch(() => {});

  await page.screenshot({ path: path.join(OUT_DIR, '01_raw_create_page.png'), fullPage: true });

  const inputs = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('input:not([type="hidden"])'));
    return list.map(i => ({
      id: i.id,
      name: i.name,
      type: i.type,
      placeholder: i.placeholder,
      visible: i.offsetParent !== null,
      formId: i.form ? i.form.id : 'none'
    }));
  });

  console.log('Visible inputs on registration page:', JSON.stringify(inputs.filter(i => i.visible), null, 2));

  // Find the visible form
  const form = page.locator('form#form-validate, form.form-create-account').first();
  if (await form.isVisible().catch(() => false)) {
    console.log('Found main registration form #form-validate!');
    
    // Fill within the visible form explicitly
    await form.locator('input[name="firstname"]').fill('Deepali');
    await form.locator('input[name="lastname"]').fill('Londhe');
    await form.locator('input[name="email"]').fill('deepalilondhe576@gmail.com');
    await form.locator('input[name="password"]').fill('Deep@123');
    await form.locator('input[name="password_confirmation"]').fill('Deep@123');

    // Phone if present
    const phone = form.locator('input[name="telephone"]');
    if (await phone.isVisible().catch(() => false)) {
      await phone.fill('0412345678');
    }

    await page.screenshot({ path: path.join(OUT_DIR, '02_form_filled_clean.png') });

    console.log('Submitting registration form...');
    const submitBtn = form.locator('button[type="submit"]').first();
    await Promise.all([
      page.waitForNavigation({ timeout: 25000 }).catch(() => {}),
      submitBtn.click()
    ]);

    await page.waitForTimeout(4000);
    console.log('Current URL after submit:', page.url());

    const messages = await page.locator('.message-success, .message-error, .messages').allInnerTexts().catch(() => []);
    console.log('Post-submit messages:', messages);

    await page.screenshot({ path: path.join(OUT_DIR, '03_registration_success.png') });
  }

  await page.waitForTimeout(4000);
  await browser.close();
})();
