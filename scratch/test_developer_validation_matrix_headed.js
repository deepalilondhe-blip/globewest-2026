const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../Sprint-3/Ticket_Trade_Application_Form');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots/developer_validation_matrix_headed');
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

async function fillStep1(page, email, phone = '2125550199') {
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Sarah');
  await page.fill('#last_name', 'Jenkins');
  await page.fill('#email', email);
  await page.fill('#mobile_phone', phone);
  await page.fill('#phone', phone);
  await banner(page, '#email', `Step 1 Email: ${email}`, '#3B82F6', 1200);
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(2500);
}

async function fillStep2Base(page, businessName, einValue) {
  await page.waitForSelector('#business_name', { timeout: 10000 });
  await page.fill('#business_name', businessName);
  await page.fill('input[name="ein"], #abn', einValue || '');
  await page.fill('#entity_name', 'Test Entity Studio LLC');
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

  await banner(page, 'input[name="ein"], #abn', `EIN: "${einValue || '(EMPTY)'}"`, einValue ? '#3B82F6' : '#F59E0B', 1500);
}

async function submitStep2(page) {
  await page.evaluate(() => {
    const btn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit');
    if (btn) btn.click();
  });
  await page.waitForTimeout(3500);
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 LIVE HEADED TESTING: DEVELOPER DEPLOYED VALIDATION MATRIX');
  console.log('Testing US Staging vs AU Baseline per Developer Specification');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 250,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = {};

  // Helper to run scenario in fresh context
  async function runScenario(scenarioName, testFn) {
    console.log(`\n========================================================================`);
    console.log(`📍 RUNNING: ${scenarioName}`);
    console.log(`========================================================================`);
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    try {
      const res = await testFn(p);
      results[scenarioName] = res;
    } catch(err) {
      console.error(`Error in ${scenarioName}:`, err.message);
      results[scenarioName] = { error: err.message };
    } finally {
      await ctx.close();
    }
  }

  // SCENARIO 1: US - New email, EIN empty -> Expect: ALLOW
  await runScenario('Scenario 1: US - New Email + Empty EIN', async (p) => {
    const email = `test.s1.${Date.now()}@example.com`;
    await p.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
    await fillStep1(p, email);
    await fillStep2Base(p, 'Studio Alpha LLC', '');
    await submitStep2(p);
    const step3 = await p.evaluate(() => document.querySelector('form#step3') !== null && document.querySelector('form#step3').offsetParent !== null);
    await p.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_US_NEW_EMAIL_EMPTY_EIN.png') });
    return { expected: 'Allow', actual: step3 ? 'Allow' : 'Disallow', pass: step3 };
  });

  // SCENARIO 2: US - Same email + same EIN as existing application -> Expect: DISALLOW (Step 2 Popup)
  await runScenario('Scenario 2: US - Same Email + Same EIN (Duplicate Check)', async (p) => {
    // Known email and EIN that exists
    const duplicateEmail = 'deepali.londhe@overdose.digital';
    const duplicateEin = '12-3456789';
    await p.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
    await fillStep1(p, duplicateEmail);
    await fillStep2Base(p, 'Studio Duplicate LLC', duplicateEin);
    await submitStep2(p);

    const check = await p.evaluate(() => {
      const modal = document.querySelector('.modal-popup._show, .modal-custom._show, [class*="modal"]._show');
      const err = document.querySelector('.message-error, .mage-error, #abn-error, #ein-error');
      const step3 = document.querySelector('form#step3');
      return {
        hasModal: modal !== null,
        modalText: modal ? modal.innerText.trim() : null,
        hasError: err !== null,
        errorText: err ? err.innerText.trim() : null,
        step3Active: step3 !== null && step3.offsetParent !== null
      };
    });
    console.log('Scenario 2 Live Feedback:', check);
    await p.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_US_SAME_EMAIL_SAME_EIN.png') });
    return {
      expected: 'Disallow (Step 2 popup or error)',
      actual: check.hasModal ? `Modal: "${check.modalText}"` : (check.hasError ? `Error: "${check.errorText}"` : (check.step3Active ? 'Allowed (Step 3 reached)' : 'Blocked')),
      pass: !check.step3Active
    };
  });

  // SCENARIO 3: US - Same email + DIFFERENT EIN -> Expect: ALLOW
  await runScenario('Scenario 3: US - Same Email + Different EIN', async (p) => {
    const duplicateEmail = 'deepali.londhe@overdose.digital';
    const differentEin = `87-${Math.floor(1000000 + Math.random() * 9000000).toString().substring(0, 7)}`;
    await p.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
    await fillStep1(p, duplicateEmail);
    await fillStep2Base(p, 'Studio Different EIN LLC', differentEin);
    await submitStep2(p);

    const step3 = await p.evaluate(() => document.querySelector('form#step3') !== null && document.querySelector('form#step3').offsetParent !== null);
    await p.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_US_SAME_EMAIL_DIFFERENT_EIN.png') });
    return { expected: 'Allow', actual: step3 ? 'Allow' : 'Disallow', pass: step3 };
  });

  // SCENARIO 4: US - Same email + EMPTY EIN -> Expect: ALLOW
  await runScenario('Scenario 4: US - Same Email + Empty EIN', async (p) => {
    const duplicateEmail = 'deepali.londhe@overdose.digital';
    await p.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
    await fillStep1(p, duplicateEmail);
    await fillStep2Base(p, 'Studio Empty EIN LLC', '');
    await submitStep2(p);

    const step3 = await p.evaluate(() => document.querySelector('form#step3') !== null && document.querySelector('form#step3').offsetParent !== null);
    await p.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_US_SAME_EMAIL_EMPTY_EIN.png') });
    return { expected: 'Allow', actual: step3 ? 'Allow' : 'Disallow', pass: step3 };
  });

  // SCENARIO 5: US - Invalid EIN Format -> Expect: DISALLOW
  await runScenario('Scenario 5: US - Invalid EIN Format', async (p) => {
    const email = `test.invalid.${Date.now()}@example.com`;
    await p.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
    await fillStep1(p, email);
    await fillStep2Base(p, 'Invalid Format Studio LLC', 'NOTAN-EIN123');
    await submitStep2(p);

    const check = await p.evaluate(() => {
      const err = document.querySelector('#abn-error, #ein-error, input[name="ein"] + .mage-error, .modal-popup._show');
      const step3 = document.querySelector('form#step3');
      return {
        hasError: err !== null,
        errorText: err ? err.innerText.trim() : null,
        step3Active: step3 !== null && step3.offsetParent !== null
      };
    });
    await p.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_US_INVALID_EIN_FORMAT.png') });
    return {
      expected: 'Disallow',
      actual: !check.step3Active ? `Blocked with: "${check.errorText}"` : 'Allowed (Unexpected)',
      pass: !check.step3Active
    };
  });

  // SCENARIO 6: AU BASELINE - New Email, Empty ABN -> Expect: DISALLOW (ABN Required)
  await runScenario('Scenario 6: AU - New Email + Empty ABN (ABN Required)', async (p) => {
    const email = `test.au.empty.${Date.now()}@example.com`;
    await p.goto('https://mcstaging2.globewest.com.au/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
    await p.selectOption('#title', { value: 'Ms' }).catch(() => {});
    await p.fill('#first_name', 'Sarah');
    await p.fill('#last_name', 'Jenkins');
    await p.fill('#email', email);
    await p.fill('#mobile_phone', '0491570157');
    await p.fill('#phone', '0395181600');
    await p.click('form#step1 button[type="submit"]');
    await p.waitForTimeout(2500);

    await p.waitForSelector('#business_name', { timeout: 10000 });
    await p.fill('#business_name', 'AU Studio Pty Ltd');
    await p.fill('#abn', ''); // Leave ABN empty
    await p.fill('#entity_name', 'AU Entity Pty Ltd');
    await p.fill('#head_office_street_address', '100 Flinders Lane');
    await p.fill('#suburb', 'Melbourne');
    await p.selectOption('#state', { value: 'VIC' }).catch(() => {});
    await p.fill('#postcode', '3000');
    await p.fill('#number_of_employees', '4');
    await p.selectOption('#primary_business_type', { value: '5' }).catch(() => {});
    await submitStep2(p);

    const check = await p.evaluate(() => {
      const err = document.querySelector('#abn-error, input[name="abn"] + .mage-error');
      const step3 = document.querySelector('form#step3');
      return {
        hasError: err !== null,
        errorText: err ? err.innerText.trim() : null,
        step3Active: step3 !== null && step3.offsetParent !== null
      };
    });
    await p.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_AU_EMPTY_ABN_REQUIRED.png') });
    return {
      expected: 'Disallow (ABN required)',
      actual: check.hasError ? `Blocked: "${check.errorText}"` : (check.step3Active ? 'Allowed' : 'Blocked'),
      pass: !check.step3Active && check.hasError
    };
  });

  // -------------------------------------------------------------------------
  // FINAL SUMMARY REPORT
  // -------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log('📊 DEVELOPER VALIDATION MATRIX TEST REPORT:');
  console.log('========================================================================');
  console.table(results);

  fs.writeFileSync(
    path.join(BASE_DIR, 'DEVELOPER_VALIDATION_MATRIX_TEST_REPORT.json'),
    JSON.stringify(results, null, 2)
  );

  await page.waitForTimeout(3000);
  await browser.close();
})();
