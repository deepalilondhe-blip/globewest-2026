const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../Sprint-3/Ticket_Trade_Application_Form');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots/step_by_step');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('🌐 1. Navigating to Trade Application...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Fill Step 1
  console.log('✍️ 2. Filling Step 1...');
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Sarah');
  await page.fill('#last_name', 'Jenkins');
  await page.fill('#email', `sarah.jenkins.${Date.now()}@example.com`);
  await page.fill('#mobile_phone', '2125550199');
  await page.fill('#phone', '2125550199');

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_STEP1_FILLED.png') });

  console.log('👉 3. Submitting Step 1...');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(3000);

  // Inspect Step 2
  console.log('🏢 4. Reached Step 2. Inspecting fields...');
  await page.waitForSelector('#business_name', { timeout: 10000 });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_STEP2_INITIAL.png') });

  // Get detailed computed styles for Step 2
  const step2Audit = await page.evaluate(() => {
    const nextBtn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit');
    const backBtn = document.querySelector('.steps__action--back, a.back');
    const bizInput = document.querySelector('#business_name');
    const einInput = document.querySelector('#abn, #ein, input[name="abn"], input[name="ein"]');
    const addressInput = document.querySelector('#head_office_street_address');
    const addressLabel = document.querySelector('label[for="head_office_street_address"]');
    const spendLabel = Array.from(document.querySelectorAll('label, .legend, div.label')).find(l => l.innerText.toUpperCase().includes('AVERAGE YEARLY SPEND'));
    const signIn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toLowerCase().includes('sign in'));

    return {
      nextBtn: nextBtn ? {
        text: nextBtn.innerText.trim(),
        width: nextBtn.offsetWidth,
        height: nextBtn.offsetHeight,
        borderRadius: window.getComputedStyle(nextBtn).borderRadius,
        backgroundColor: window.getComputedStyle(nextBtn).backgroundColor,
        color: window.getComputedStyle(nextBtn).color,
        fontSize: window.getComputedStyle(nextBtn).fontSize,
        fontWeight: window.getComputedStyle(nextBtn).fontWeight,
        letterSpacing: window.getComputedStyle(nextBtn).letterSpacing
      } : null,
      backBtn: backBtn ? {
        text: backBtn.innerText.trim(),
        innerHTML: backBtn.innerHTML,
        color: window.getComputedStyle(backBtn).color,
        fontSize: window.getComputedStyle(backBtn).fontSize,
        textDecoration: window.getComputedStyle(backBtn).textDecoration
      } : null,
      addressLabel: addressLabel ? addressLabel.innerText.trim() : null,
      spendLabel: spendLabel ? spendLabel.innerText.trim() : null,
      signIn: signIn ? {
        text: signIn.innerText.trim(),
        parentText: signIn.parentElement.innerText.trim(),
        color: window.getComputedStyle(signIn).color,
        textDecoration: window.getComputedStyle(signIn).textDecoration
      } : null,
      inputHeight: bizInput ? bizInput.offsetHeight : null,
      inputBorderRadius: bizInput ? window.getComputedStyle(bizInput).borderRadius : null,
      inputBorderColor: bizInput ? window.getComputedStyle(bizInput).borderColor : null
    };
  });

  console.log('Step 2 Computed Styles:', JSON.stringify(step2Audit, null, 2));

  // Fill Step 2
  console.log('✍️ 5. Filling Step 2...');
  await page.fill('#business_name', 'Jenkins Design Studio LLC');
  await page.fill('input[name="ein"], #abn', '12-3456789');
  await page.fill('#entity_name', 'Jenkins Interiors Inc');
  await page.fill('#head_office_street_address', '450 Lexington Ave');
  
  // Fill City
  const cityLoc = page.locator('#suburb, #city, input[name="suburb"], input[name="city"]').first();
  await cityLoc.fill('New York');

  // Select State NY
  await page.evaluate(() => {
    const s = document.querySelector('#state');
    if (s) { s.value = 'NY'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    const b = document.querySelector('#primary_business_type');
    if (b) { b.value = '6'; b.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  await page.fill('#postcode', '10017');
  await page.fill('#number_of_employees', '6');

  // Radio buttons via evaluate to avoid opacity 0 actionability waits
  await page.evaluate(() => {
    const commRadio = document.querySelector('#commercial-projects-yes, input[name*="commercial"][value="1"], input[id*="commercial"]');
    if (commRadio) {
      commRadio.checked = true;
      commRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const spendRadio = document.querySelector('#yearly-spend-30, input[name*="spend"][value*="30"], input[name*="spend"]');
    if (spendRadio) {
      spendRadio.checked = true;
      spendRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_STEP2_FILLED.png') });

  console.log('👉 6. Submitting Step 2...');
  await page.evaluate(() => {
    const btn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit, #step2 button');
    if (btn) btn.click();
  });
  await page.waitForTimeout(4000);

  // Check what is on screen now
  const afterStep2State = await page.evaluate(() => {
    const currentUrl = window.location.href;
    const errors = Array.from(document.querySelectorAll('.mage-error, [id*="-error"], .message-error')).filter(e => e.offsetParent !== null).map(e => e.innerText.trim());
    const step3Visible = document.querySelector('form#step3') !== null && document.querySelector('form#step3').offsetParent !== null;
    const h2s = Array.from(document.querySelectorAll('h2, .gwcustomer-subtitle')).map(h => h.innerText.trim());
    const activeStep = document.querySelector('.step-count, .current-step, .wizard-step');

    return {
      currentUrl,
      errors,
      step3Visible,
      h2s,
      activeStep: activeStep ? activeStep.innerText.trim() : null,
      pageTextSnippet: document.body.innerText.substring(0, 500)
    };
  });

  console.log('After Step 2 Submit State:', JSON.stringify(afterStep2State, null, 2));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_AFTER_STEP2_SUBMIT.png') });

  await page.waitForTimeout(4000);
  await browser.close();
})();
