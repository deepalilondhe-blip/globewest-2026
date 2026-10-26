const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../Sprint-3/Ticket_Trade_Application_Form');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots/client_ein_request_test');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function banner(page, selectorOrLocator, text, color = '#10B981', dur = 2000) {
  try {
    const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
    const isVis = await loc.isVisible({ timeout: 1500 }).catch(() => false);
    if (!isVis) return;
    await loc.scrollIntoViewIfNeeded({ timeout: 800 }).catch(() => {});
    await loc.evaluate((el, { t, c, d }) => {
      const prevOutline = el.style.outline;
      el.style.outline = `3px solid ${c}`;
      const tag = document.createElement('div');
      tag.className = 'qa-headed-tag';
      tag.textContent = t;
      tag.style.position = 'absolute';
      tag.style.top = '-28px';
      tag.style.left = '0';
      tag.style.background = c;
      tag.style.color = '#ffffff';
      tag.style.fontSize = '13px';
      tag.style.fontWeight = 'bold';
      tag.style.padding = '4px 10px';
      tag.style.borderRadius = '4px';
      tag.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      tag.style.zIndex = '999999';
      tag.style.whiteSpace = 'nowrap';
      tag.style.pointerEvents = 'none';
      if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(tag);
      setTimeout(() => {
        el.style.outline = prevOutline;
        tag.remove();
      }, d);
    }, { t: text, c: color, d: dur });
    await page.waitForTimeout(dur);
  } catch (e) {}
}

(async () => {
  console.log('========================================================================');
  console.log('🧪 LIVE HEADED RETEST: CLIENT EIN & EMAIL VALIDATION LOGIC');
  console.log('Target URL: https://mcstaging2.globewest.com/gwcustomer/trade/create');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // -------------------------------------------------------------------------
  // TEST SCENARIO 1: Step 1 Email Existence Validation Check
  // Test with a known active trade email: deepali.londhe@overdose.digital
  // -------------------------------------------------------------------------
  console.log('📍 [Test 1] Testing Step 1 with a known existing account email...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const existingEmail = 'deepali.londhe@overdose.digital';
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Deepali');
  await page.fill('#last_name', 'Londhe');
  await page.fill('#email', existingEmail);
  await page.fill('#mobile_phone', '2125550199');
  await page.fill('#phone', '2125550199');

  await banner(page, '#email', `Testing Existing Email: ${existingEmail}`, '#F59E0B', 2000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_STEP1_EXISTING_EMAIL.png') });

  console.log('👉 Submitting Step 1 with existing email...');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(3000);

  const step1Result = await page.evaluate(() => {
    const emailErr = document.querySelector('#email-error, .message-error, .mage-error');
    const step2Active = document.querySelector('#business_name') !== null && document.querySelector('#business_name').offsetParent !== null;
    return {
      hasError: emailErr !== null,
      errorMessage: emailErr ? emailErr.innerText.trim() : null,
      advancedToStep2: step2Active
    };
  });

  console.log('Step 1 Existing Email Result:', step1Result);

  // -------------------------------------------------------------------------
  // TEST SCENARIO 2: Step 2 EIN Mandatory Status & Empty EIN Behavior
  // When EIN is empty: Does the form currently allow proceeding?
  // -------------------------------------------------------------------------
  console.log('\n📍 [Test 2] Testing Step 2 with EMPTY EIN (Client Request: EIN should be optional)...');
  await page.waitForSelector('#business_name', { timeout: 10000 });

  // Inspect EIN field attributes (required classes, data-validate, etc.)
  const einFieldInfo = await page.evaluate(() => {
    const el = document.querySelector('input[name="ein"], #ein, #abn, input[name="abn"]');
    const label = document.querySelector('label[for="ein"], label[for="abn"]');
    return {
      tag: el ? el.tagName : null,
      name: el ? el.name : null,
      id: el ? el.id : null,
      className: el ? el.className : null,
      isRequiredClass: el ? el.classList.contains('required-entry') : false,
      dataValidate: el ? el.getAttribute('data-validate') : null,
      ariaRequired: el ? el.getAttribute('aria-required') : null,
      labelHtml: label ? label.innerHTML : null,
      labelText: label ? label.innerText.trim() : null
    };
  });
  console.log('Current Live EIN Field Config:', JSON.stringify(einFieldInfo, null, 2));

  // Fill Step 2 fields BUT LEAVE EIN COMPLETELY EMPTY!
  await page.fill('#business_name', 'Client Request Test Studio LLC');
  await page.fill('input[name="ein"], #abn', ''); // Leave EIN empty!
  await page.fill('#entity_name', 'Client Request Test Inc');
  await page.fill('#head_office_street_address', '100 Broadway');
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

  await page.fill('#postcode', '10005');
  await page.fill('#number_of_employees', '5');

  await banner(page, 'input[name="ein"], #abn', 'TESTING EMPTY EIN (Client Request: Optional)', '#EF4444', 2500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_STEP2_EMPTY_EIN_BEFORE_SUBMIT.png') });

  console.log('👉 Attempting to submit Step 2 with EMPTY EIN...');
  await page.evaluate(() => {
    const btn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit');
    if (btn) btn.click();
  });
  await page.waitForTimeout(3000);

  const emptyEinResult = await page.evaluate(() => {
    const einErr = document.querySelector('#abn-error, #ein-error, input[name="ein"] + .mage-error, input[name="abn"] + .mage-error');
    const step3Active = document.querySelector('form#step3') !== null && document.querySelector('form#step3').offsetParent !== null;
    const allErrors = Array.from(document.querySelectorAll('.mage-error, [id*="-error"]')).filter(e => e.offsetParent !== null).map(e => ({ id: e.id, text: e.innerText.trim() }));

    return {
      einError: einErr ? einErr.innerText.trim() : null,
      step3Active,
      allErrors
    };
  });

  console.log('Step 2 Empty EIN Submission Result:', JSON.stringify(emptyEinResult, null, 2));

  if (emptyEinResult.einError) {
    await banner(page, 'input[name="ein"], #abn', `Blocked: "${emptyEinResult.einError}"`, '#EF4444', 2500);
  } else if (emptyEinResult.step3Active) {
    await banner(page, 'h2, .gwcustomer-subtitle', 'PASS: Step 3 reached with empty EIN!', '#10B981', 2500);
  }
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_STEP2_EMPTY_EIN_SUBMIT_RESULT.png') });

  // -------------------------------------------------------------------------
  // TEST SCENARIO 3: Step 2 with Duplicate EIN & Same Email
  // Client Request: "When EIN is filled in: perform an existence validation to check whether
  // an existing Trade application with the same EIN and same 'Email' already exists or not"
  // -------------------------------------------------------------------------
  console.log('\n📍 [Test 3] Testing Step 2 with EIN: "12-3456789" (Previously submitted EIN)...');
  if (!emptyEinResult.step3Active) {
    // Fill EIN with previously used dummy EIN
    await page.fill('input[name="ein"], #abn', '12-3456789');
    await banner(page, 'input[name="ein"], #abn', 'Filling EIN: 12-3456789', '#3B82F6', 1500);
    
    console.log('👉 Submitting Step 2 with filled EIN...');
    await page.evaluate(() => {
      const btn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit');
      if (btn) btn.click();
    });
    await page.waitForTimeout(4000);

    const filledEinResult = await page.evaluate(() => {
      const einErr = document.querySelector('#abn-error, #ein-error, .message-error');
      const step3Active = document.querySelector('form#step3') !== null && document.querySelector('form#step3').offsetParent !== null;
      const allErrors = Array.from(document.querySelectorAll('.mage-error, [id*="-error"], .message-error')).filter(e => e.offsetParent !== null).map(e => ({ id: e.id, text: e.innerText.trim() }));
      return {
        einError: einErr ? einErr.innerText.trim() : null,
        step3Active,
        allErrors
      };
    });
    console.log('Step 2 Filled EIN Result:', JSON.stringify(filledEinResult, null, 2));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_STEP2_FILLED_EIN_RESULT.png') });
  }

  // Save full diagnostic test results
  const testReport = {
    step1ExistingEmail: step1Result,
    einFieldInfo,
    step2EmptyEin: emptyEinResult,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(BASE_DIR, 'CLIENT_EIN_REQUEST_LIVE_TEST_RESULTS.json'),
    JSON.stringify(testReport, null, 2)
  );

  console.log('\n========================================================================');
  console.log('✅ Client Request Live Diagnostic Test Completed!');
  console.log('========================================================================');

  await page.waitForTimeout(4000);
  await browser.close();
})();
