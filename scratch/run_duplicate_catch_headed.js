const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../Sprint-3/Ticket_Trade_Application_Form/screenshots/duplicate_catch_scenario');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

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
      tag.style.top = '-32px';
      tag.style.left = '0';
      tag.style.background = c;
      tag.style.color = '#ffffff';
      tag.style.fontSize = '14px';
      tag.style.fontWeight = 'bold';
      tag.style.padding = '5px 12px';
      tag.style.borderRadius = '4px';
      tag.style.boxShadow = '0 2px 10px rgba(0,0,0,0.35)';
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
  console.log('🚀 RUNNING SCENARIO: WHEN THE DUPLICATE IS CAUGHT (HEADED MODE)');
  console.log('Target: mcstaging2.globewest.com/gwcustomer/trade/create');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 600,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // 1. Force logout
  console.log('🚪 Step 0: Ensuring unauthenticated guest state...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/logout/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2500);
  await context.clearCookies();

  // 2. Navigate to Trade Application
  console.log('🌐 Step 1: Navigating to Trade Application Form...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Close cookies
  await page.evaluate(() => {
    const btn = document.querySelector('#onetrust-accept-btn-handler, .btn-accept');
    if (btn) btn.click();
  });

  // Track all API calls
  const apiCalls = [];
  page.on('request', req => {
    const url = req.url();
    if (url.includes('trade') || url.includes('check') || url.includes('validate') || url.includes('customer')) {
      apiCalls.push({ url, method: req.method() });
    }
  });

  // 3. Step 1: Fill Contact Details with existing trade email
  const duplicateEmail = 'deepali.londhe@overdose.digital';
  console.log(`\n📝 STEP 1: Entering Existing Email: ${duplicateEmail}`);
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Deepali');
  await page.fill('#last_name', 'Londhe');
  await page.fill('#email', duplicateEmail);
  await page.fill('#mobile_phone', '2125550199');
  await page.fill('#phone', '2125550198');

  await banner(page, '#email', `STEP 1: Existing Email "${duplicateEmail}"`, '#3B82F6', 2000);
  const shot1 = path.join(OUTPUT_DIR, '01_STEP1_SAME_EMAIL_ENTERED.png');
  await page.screenshot({ path: shot1 });
  console.log('  📸 Screenshot 1 saved:', shot1);

  console.log('👉 Submitting Step 1 to reach Step 2...');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(3000);

  // 4. Step 2: Fill Business Details
  await page.waitForSelector('#business_name', { timeout: 10000 });
  console.log('\n🏢 STEP 2: Entering Business Details + Duplicate Candidate EIN...');

  const duplicateEin = '12-3456789';
  await page.fill('#business_name', 'Jenkins Design Studio LLC');
  
  // Type EIN and trigger change
  const einInput = page.locator('input[name="ein"], #abn').first();
  await einInput.fill(duplicateEin);
  await einInput.evaluate(el => {
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  });

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

  await banner(page, 'input[name="ein"], #abn', `STEP 2: EIN "${duplicateEin}"`, '#F59E0B', 2000);
  const shot2 = path.join(OUTPUT_DIR, '02_STEP2_EIN_ENTERED.png');
  await page.screenshot({ path: shot2 });
  console.log('  📸 Screenshot 2 saved:', shot2);

  // Check Knockout internal state before clicking NEXT
  const koStateBeforeClick = await page.evaluate(() => {
    const el = document.querySelector('.b2b-register');
    if (!el || typeof ko === 'undefined') return { error: 'ko not found' };
    const comp = ko.dataFor(el);
    return {
      email: comp.email,
      abn: comp.abn,
      emailCheckUrlPath: comp.emailCheckUrlPath,
      abnEmailValid: comp.abnEmailValid,
      activeStep: comp.activeStep
    };
  });
  console.log('  🔍 Knockout State on Step 2:', koStateBeforeClick);

  // 5. Click NEXT on Step 2 to see if Step 2 popup appears
  console.log('\n👉 STEP 2 SUBMIT: Clicking NEXT button to check for Step 2 Popup...');
  apiCalls.length = 0; // reset to capture click requests

  // Force click or evaluate click to bypass potential overlay blocking
  await page.evaluate(() => {
    const btn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.primary');
    if (btn) btn.click();
  });
  await page.waitForTimeout(3500);

  console.log('  📡 API Calls triggered on Step 2 click:', apiCalls);

  // Check if a popup/modal is visible or if Step 3 loaded
  const step2Result = await page.evaluate(() => {
    const popup = document.querySelector('.modal-popup._show, [data-role="modal"]._show, .ui-dialog:not([style*="display: none"])');
    const step2El = document.querySelector('#step2');
    const step3El = document.querySelector('#step3');
    const step2Visible = step2El && window.getComputedStyle(step2El).display !== 'none';
    const step3Visible = step3El && window.getComputedStyle(step3El).display !== 'none';
    const title = document.querySelector('h2.gwcustomer-subtitle, h2, .gwcustomer-title');

    return {
      hasVisiblePopup: !!popup,
      popupText: popup ? popup.innerText.trim() : null,
      step2Visible,
      step3Visible,
      currentHeading: title ? title.innerText.trim() : ''
    };
  });

  console.log('  📊 Result after Step 2 NEXT click:', step2Result);

  // Add visual banner explaining outcome
  await page.evaluate(({ res }) => {
    const b = document.createElement('div');
    b.id = 'qa-verdict-banner';
    b.style.cssText = 'position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: #1E293B; color: #FFFFFF; font-size: 15px; font-weight: bold; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 999999; border: 2px solid ' + (res.hasVisiblePopup ? '#10B981' : '#EF4444') + '; text-align: center;';
    if (res.hasVisiblePopup) {
      b.innerHTML = '🟢 STEP 2 POPUP CAUGHT THE DUPLICATE!<br/><span style="font-size:12px; font-weight:normal;">' + res.popupText + '</span>';
    } else if (res.step3Visible) {
      b.innerHTML = '❌ DEFECT: DUPLICATE NOT CAUGHT ON STEP 2!<br/><span style="font-size:12px; font-weight:normal;">Developer claimed "Step 2 popup", but form advanced straight to Step 3.</span>';
    }
    document.body.appendChild(b);
  }, { res: step2Result });

  await page.waitForTimeout(1500);
  const shot3 = path.join(OUTPUT_DIR, '03_STEP2_TO_STEP3_OR_POPUP.png');
  await page.screenshot({ path: shot3 });
  console.log('  📸 Screenshot 3 saved:', shot3);
  console.log('  ⏳ Keeping browser open on Step 2 popup for 8 seconds so you can view it live...');
  await page.waitForTimeout(8000);

  // 6. If Step 3 was reached, test Final Submit to see if it is caught there!
  if (step2Result.step3Visible) {
    console.log('\n📋 STEP 3: Testing Final Submit to see if backend catches duplicate at the end...');
    
    // Check terms
    await page.evaluate(() => {
      const chk = document.querySelector('#agree_terms, input[name*="agree"], input[name*="terms"], input[type="checkbox"]');
      if (chk) chk.checked = true;
    });

    console.log('👉 Clicking Final SUBMIT on Step 3...');
    await page.evaluate(() => {
      const btn = document.querySelector('form#step3 button[type="submit"], #step3 button.action.submit');
      if (btn) btn.click();
    });
    await page.waitForTimeout(4000);

    const step3Result = await page.evaluate(() => {
      const msgs = Array.from(document.querySelectorAll('.message-error, .messages .message, .mage-error')).map(m => m.innerText.trim());
      const currentUrl = window.location.href;
      return { msgs, currentUrl };
    });
    console.log('  📊 Step 3 Final Submit Response:', step3Result);

    const shot4 = path.join(OUTPUT_DIR, '04_FINAL_SUBMIT_RESULT.png');
    await page.screenshot({ path: shot4 });
    console.log('  📸 Screenshot 4 saved:', shot4);
  }

  await browser.close();
  console.log('\n🏁 Scenario execution complete!');
})();
