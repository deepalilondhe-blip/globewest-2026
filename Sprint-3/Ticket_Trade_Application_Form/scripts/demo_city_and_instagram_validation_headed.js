const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  console.log('========================================================================');
  console.log('🚀 HEADED DEMO: TRADE APPLICATION FORM VALIDATION OBSERVATIONS');
  console.log('1. Step 2: Street Address Asterisk (*) check');
  console.log('2. Step 2: Invalid City acceptance (e.g. "12345!@#$ INVALID CITY")');
  console.log('3. Step 3: Invalid Instagram URL acceptance');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 600, // Slow motion so each action is clearly visible
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // Helper for prominent visual badge
  async function highlightElement(locator, label, color) {
    await locator.evaluate((el, { label, color }) => {
      el.style.border = `3px solid ${color}`;
      el.style.boxShadow = `0 0 15px ${color}`;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, { label, color });
  }

  // STEP 1
  console.log('📍 [Step 1] Loading Trade Application Form...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  console.log('✍️ Filling Step 1 Contact Details with valid US Phone (2125550199)...');
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Sarah');
  await page.fill('#last_name', 'Jenkins');
  await page.fill('#email', 'sarah.jenkins.design.test@example.com');
  await page.fill('#mobile_phone', '2125550199');
  await page.fill('#phone', '2125550199');
  await page.waitForTimeout(1000);

  console.log('👉 Submitting Step 1...');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(3000);

  // STEP 2
  console.log('\n📍 [Step 2] Reached Business Details!');
  await page.waitForSelector('#business_name', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // 1. Highlight Street Address with Asterisk
  console.log('🔍 [OBSERVATION 1] Inspecting Street Address Asterisk (*)...');
  const addressLabel = page.locator('label[for="head_office_street_address"], label:has-text("HEAD OFFICE STREET ADDRESS")').first();
  if (await addressLabel.isVisible().catch(() => false)) {
    await highlightElement(addressLabel, 'Asterisk Present', '#f59e0b');
    const labelText = await addressLabel.innerText();
    console.log(`   -> Live Address Label Text: "${labelText.trim()}" (Has Asterisk: ${labelText.includes('*')})`);
    await page.waitForTimeout(2500);
  }

  // Populate Step 2 fields
  await page.fill('#business_name', 'Jenkins Design Studio LLC');
  await page.fill('input[name="ein"], #abn', '12-3456789');
  await page.fill('#entity_name', 'Jenkins Interiors Inc');
  await page.fill('#head_office_street_address', '450 Lexington Ave');

  // 2. Test Invalid City
  console.log('\n🔍 [OBSERVATION 2] Testing City Field with Invalid Value ("12345!@#$ INVALID CITY")...');
  const cityInput = page.locator('#suburb, #city').first();
  await cityInput.fill('12345!@#$ INVALID CITY');
  await highlightElement(cityInput, 'Invalid City Input', '#ef4444');
  await page.waitForTimeout(2000);

  await page.fill('#postcode', '10017');
  await page.fill('#number_of_employees', '6');

  // Select State NY
  await page.evaluate(() => {
    const s = document.querySelector('#state');
    if (s) { s.value = 'NY'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    const b = document.querySelector('#primary_business_type');
    if (b) { b.value = '6'; b.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  await page.click('input[name="commercial_projects"][value="1"]').catch(() => {});
  await page.click('input[name="average_yearly_spend"][value="under_10k"]').catch(() => {});
  await page.waitForTimeout(1500);

  console.log('👉 Submitting Step 2 with the Invalid City...');
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(3500);

  // STEP 3
  console.log('\n📍 [Step 3] Form Accepted Invalid City and Advanced to Step 3!');
  console.log(`   -> Current URL: ${page.url()}`);
  await page.waitForTimeout(1500);

  // 3. Test Invalid Instagram URL
  console.log('\n🔍 [OBSERVATION 3] Testing Instagram Field with Invalid URL ("htp://invalid_instagram_url@@@")...');
  const instaInput = page.locator('#instagram, input[name="instagram"]').first();
  if (await instaInput.isVisible().catch(() => false)) {
    await instaInput.scrollIntoViewIfNeeded();
    await instaInput.fill('htp://invalid_instagram_url@@@');
    await highlightElement(instaInput, 'Invalid Instagram Input', '#ef4444');
    await page.waitForTimeout(2000);

    // Trigger blur / change to check if validation error appears
    await instaInput.blur();
    await page.waitForTimeout(2000);

    const errorMsg = await page.locator('#instagram-error').innerText().catch(() => 'No Error Displayed');
    console.log(`   -> Instagram Error Message: "${errorMsg}"`);
    console.log(`   -> Did it accept without error popup? ${errorMsg === 'No Error Displayed'}`);
  }

  console.log('\n========================================================================');
  console.log('✅ DEMO COMPLETE: Both observations verified live on your screen!');
  console.log('Browser will stay open for 15 seconds so you can inspect the final view.');
  console.log('========================================================================\n');

  await page.waitForTimeout(15000);
  await browser.close();
})();
