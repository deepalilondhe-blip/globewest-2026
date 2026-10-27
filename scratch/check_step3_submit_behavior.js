const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });

  // Step 1
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Deepali');
  await page.fill('#last_name', 'Londhe');
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#mobile_phone', '2125550199');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(2000);

  // Step 2
  await page.fill('#business_name', 'Jenkins Design Studio LLC');
  await page.fill('input[name="ein"], #abn', '12-3456789');
  await page.fill('#head_office_street_address', '450 Lexington Ave');
  const cityLoc = page.locator('#suburb, #city, input[name="suburb"], input[name="city"]').first();
  await cityLoc.fill('New York');
  await page.evaluate(() => {
    const s = document.querySelector('#state');
    if (s) { s.value = 'NY'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    const b = document.querySelector('#primary_business_type');
    if (b) { b.value = '6'; b.dispatchEvent(new Event('change', { bubbles: true })); }
    const cr = document.querySelector('#commercial-projects-yes, input[name*="commercial"]');
    if (cr) { cr.checked = true; cr.dispatchEvent(new Event('change', { bubbles: true })); }
    const sr = document.querySelector('#yearly-spend-30, input[name*="spend"]');
    if (sr) { sr.checked = true; sr.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await page.fill('#postcode', '10017');
  await page.fill('#number_of_employees', '5');

  console.log('Submitting Step 2...');
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(3000);

  // Step 3
  console.log('Now on Step 3. Filling Step 3 fields...');
  const termsCheckbox = page.locator('#agree_terms, input[name*="agree"], input[name*="terms"], #terms');
  if (await termsCheckbox.isVisible().catch(() => false)) {
    await termsCheckbox.check().catch(() => {});
  } else {
    await page.evaluate(() => {
      const chk = document.querySelector('input[type="checkbox"]');
      if (chk) chk.checked = true;
    });
  }

  // Intercept Step 3 submit
  let submitResponse = null;
  page.on('response', res => {
    if (res.url().includes('trade') || res.url().includes('save') || res.url().includes('create')) {
      submitResponse = { url: res.url(), status: res.status() };
    }
  });

  console.log('Clicking Step 3 Submit...');
  const submitBtn = page.locator('form#step3 button[type="submit"], #step3 button.action.submit').first();
  if (await submitBtn.isVisible().catch(() => false)) {
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  const result = await page.evaluate(() => {
    const errorMessages = Array.from(document.querySelectorAll('.message-error, .messages .message, .mage-error')).map(m => m.innerText.trim());
    const currentUrl = window.location.href;
    return { errorMessages, currentUrl };
  });

  console.log('Step 3 Submit Response URL:', submitResponse);
  console.log('Final Page Result:', result);

  await browser.close();
})();
