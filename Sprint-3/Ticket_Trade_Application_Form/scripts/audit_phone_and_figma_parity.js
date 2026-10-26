const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const DESKTOP_DIR = path.join(SCREENSHOTS_DIR, 'desktop');
const MOBILE_DIR = path.join(SCREENSHOTS_DIR, 'mobile');
const DEFECTS_DIR = path.join(SCREENSHOTS_DIR, 'defects');
const COMPARISON_DIR = path.join(BASE_DIR, 'comparison');

[DESKTOP_DIR, MOBILE_DIR, DEFECTS_DIR, COMPARISON_DIR].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🔍 AUDITING TRADE APPLICATION FORM: PHONE VALIDATION & FIGMA PARITY');
  console.log('Target: https://mcstaging2.globewest.com/gwcustomer/trade/create');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('🌐 Loading US Staging Trade Application Form...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'networkidle', timeout: 60000 });
  await clearOverlays(page);
  await page.waitForTimeout(2000);

  // Capture Step 1 initial
  await page.screenshot({ path: path.join(DESKTOP_DIR, '01_LIVE_STEP1_INITIAL.png'), fullPage: false });

  // 1. Inspect Phone Fields Data Attributes & Rules
  console.log('\n📱 Inspecting Mobile Phone & Phone Field DOM Rules:');
  const phoneDomInfo = await page.evaluate(() => {
    const mobile = document.querySelector('#mobile_phone');
    const phone = document.querySelector('#phone');
    return {
      mobile: mobile ? {
        id: mobile.id,
        name: mobile.name,
        placeholder: mobile.placeholder,
        dataValidate: mobile.getAttribute('data-validate'),
        pattern: mobile.getAttribute('pattern'),
        classes: mobile.className
      } : null,
      phone: phone ? {
        id: phone.id,
        name: phone.name,
        placeholder: phone.placeholder,
        dataValidate: phone.getAttribute('data-validate'),
        pattern: phone.getAttribute('pattern'),
        classes: phone.className
      } : null
    };
  });
  console.log('Mobile Phone Field DOM:', JSON.stringify(phoneDomInfo.mobile, null, 2));
  console.log('Phone Field DOM:', JSON.stringify(phoneDomInfo.phone, null, 2));

  // Fill Step 1 Base Details
  await page.selectOption('#title', { value: 'Ms' }).catch(async () => {
    await page.selectOption('#title', { label: 'Ms' }).catch(() => {});
  });
  await page.fill('#first_name', 'Sarah');
  await page.fill('#last_name', 'Jenkins');
  await page.fill('#email', 'sarah.jenkins.design' + Date.now() + '@example.com');

  // TEST SUITE: US & AU PHONE NUMBERS
  const phoneTests = [
    { type: 'Standard US 10-digit', val: '2125550199' },
    { type: 'Formatted US (212) 555-0199', val: '(212) 555-0199' },
    { type: 'US with +1 (+1 212 555 0199)', val: '+1 212 555 0199' },
    { type: 'US with dashes 212-555-0199', val: '212-555-0199' },
    { type: 'Australian Mobile 0491 570 157', val: '0491 570 157' },
    { type: 'Australian Mobile +61 491 570 157', val: '+61 491 570 157' }
  ];

  console.log('\n🧪 Testing Mobile Phone Validation behavior with multiple inputs:');
  const results = [];

  for (const test of phoneTests) {
    console.log(`\n👉 Testing ${test.type} -> "${test.val}"...`);
    await page.fill('#mobile_phone', test.val);
    await page.fill('#phone', test.val).catch(() => {});
    await page.waitForTimeout(500);

    // Trigger validation by clicking Next button
    await page.click('form#step1 button[type="submit"]');
    await page.waitForTimeout(1500);

    const errorMsg = await page.evaluate(() => {
      const mobileErr = document.querySelector('#mobile_phone-error');
      const phoneErr = document.querySelector('#phone-error');
      return {
        mobileError: mobileErr && mobileErr.offsetParent !== null ? mobileErr.innerText.trim() : null,
        phoneError: phoneErr && phoneErr.offsetParent !== null ? phoneErr.innerText.trim() : null
      };
    });

    const isStep2 = await page.evaluate(() => {
      const step2 = document.querySelector('#business_name');
      return step2 && step2.offsetParent !== null;
    });

    results.push({
      input: test.val,
      type: test.type,
      rejected: !!errorMsg.mobileError,
      errorMessage: errorMsg.mobileError,
      advancedToStep2: isStep2
    });

    console.log(`   Result: Rejected = ${!!errorMsg.mobileError} | Error = "${errorMsg.mobileError || 'None (Accepted)'}"`);

    if (errorMsg.mobileError) {
      await page.screenshot({
        path: path.join(DEFECTS_DIR, `PHONE_TEST_${test.type.replace(/[^a-zA-Z0-9]/g, '_')}.png`)
      });
    }

    if (isStep2) {
      console.log('   🎉 Successfully advanced to Step 2 with this number!');
      break;
    }
  }

  // Save phone test audit JSON
  fs.writeFileSync(path.join(BASE_DIR, 'phone_validation_test_results.json'), JSON.stringify(results, null, 2));

  // If not yet in Step 2, bypass with AU dummy to audit Step 2
  const inStep2 = await page.evaluate(() => {
    const step2 = document.querySelector('#business_name');
    return step2 && step2.offsetParent !== null;
  });

  if (!inStep2) {
    console.log('\n🔄 Applying AU mobile bypass to unlock Step 2 inspection...');
    await page.fill('#mobile_phone', '0491570157');
    await page.fill('#phone', '0395181600').catch(() => {});
    await page.click('form#step1 button[type="submit"]');
    await page.waitForTimeout(4000);
  }

  // STEP 2 FIGMA AUDIT
  console.log('\n🏢 AUDITING STEP 2: Business Details');
  await page.waitForSelector('#business_name', { timeout: 15000 });
  await clearOverlays(page);
  await page.screenshot({ path: path.join(DESKTOP_DIR, '02_LIVE_STEP2_INITIAL.png'), fullPage: false });

  const step2Elements = await page.evaluate(() => {
    const backBtn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toUpperCase().includes('BACK'));
    const stateEl = document.querySelector('#state');
    const empInput = document.querySelector('#number_of_employees');
    const entityInput = document.querySelector('#entity_name');
    const bizInput = document.querySelector('#business_name');
    const einInput = document.querySelector('input[name="ein"], #abn');
    const einLabel = document.querySelector('label[for="ein"], label[for="abn"]');
    const addressLabel = document.querySelector('label[for="head_office_street_address"]');
    const cityLabel = document.querySelector('label[for="suburb"]');
    const stateLabel = document.querySelector('label[for="state"]');
    const zipLabel = document.querySelector('label[for="postcode"]');
    const spendLabel = Array.from(document.querySelectorAll('label, .legend, span, div')).find(l => l.innerText.toUpperCase().includes('AVERAGE YEARLY SPEND'));
    const signInLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toLowerCase().includes('sign in'));

    return {
      backBtnText: backBtn ? backBtn.innerText.trim() : null,
      bizLabelText: document.querySelector('label[for="business_name"]') ? document.querySelector('label[for="business_name"]').innerText.trim() : null,
      einLabelText: einLabel ? einLabel.innerText.trim() : null,
      einPlaceholder: einInput ? einInput.placeholder : null,
      entityPlaceholder: entityInput ? entityInput.placeholder : null,
      addressLabelText: addressLabel ? addressLabel.innerText.trim() : null,
      cityLabelText: cityLabel ? cityLabel.innerText.trim() : null,
      stateLabelText: stateLabel ? stateLabel.innerText.trim() : null,
      stateDefaultOption: stateEl && stateEl.options[0] ? stateEl.options[0].text.trim() : null,
      stateOptionCount: stateEl ? stateEl.options.length : 0,
      zipLabelText: zipLabel ? zipLabel.innerText.trim() : null,
      empPlaceholder: empInput ? empInput.placeholder : null,
      spendLabelText: spendLabel ? spendLabel.innerText.trim() : null,
      signInText: signInLink ? signInLink.innerText.trim() : null
    };
  });

  console.log('Step 2 Computed Inspection:', JSON.stringify(step2Elements, null, 2));
  fs.writeFileSync(path.join(BASE_DIR, 'step2_figma_parity_inspection.json'), JSON.stringify(step2Elements, null, 2));

  // Fill Step 2
  await page.fill('#business_name', 'Jenkins Design Studio LLC');
  await page.fill('input[name="ein"], #abn', '12-3456789');
  await page.fill('#entity_name', 'Jenkins Interiors Inc');
  await page.fill('#head_office_street_address', '450 Lexington Ave');
  await page.fill('#suburb', 'New York');

  await page.evaluate(() => {
    const select = document.querySelector('#state');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === 'NY' || select.options[i].text.includes('New York')) {
          select.selectedIndex = i;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          break;
        }
      }
    }
  });

  await page.fill('#postcode', '10017');
  await page.fill('#number_of_employees', '6');

  // Business Type
  await page.evaluate(() => {
    const el = document.querySelector('#primary_business_type');
    if (window.jQuery && el) {
      window.jQuery(el).val('6').trigger('change');
    } else if (el) {
      el.value = '6';
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Radios
  await page.evaluate(() => {
    const radioComm = document.querySelector('#commercial-projects-yes, input[name*="commercial"][value="1"], input[name*="commercial"][value="yes"]');
    if (radioComm) {
      radioComm.checked = true;
      if (window.jQuery) window.jQuery(radioComm).trigger('change');
      else radioComm.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const radioSpend = document.querySelector('#yearly-spend-30, input[name*="spend"][value*="30"], input[name*="spend"]');
    if (radioSpend) {
      radioSpend.checked = true;
      if (window.jQuery) window.jQuery(radioSpend).trigger('change');
      else radioSpend.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(DESKTOP_DIR, '02_LIVE_STEP2_FILLED.png'), fullPage: false });

  // Advance to Step 3
  console.log('\n👉 Submitting Step 2 to inspect Step 3...');
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(5000);

  // STEP 3 AUDIT
  console.log('\n📋 AUDITING STEP 3: Additional Information');
  await clearOverlays(page);
  const inStep3 = await page.evaluate(() => {
    const form3 = document.querySelector('form#step3');
    return form3 && form3.offsetParent !== null;
  });

  if (inStep3) {
    console.log('✅ In Step 3!');
    await page.screenshot({ path: path.join(DESKTOP_DIR, '03_LIVE_STEP3_INITIAL.png'), fullPage: false });
    
    const step3Elements = await page.evaluate(() => {
      const webInput = document.querySelector('input[name*="website"], #website');
      const instaInput = document.querySelector('input[name*="instagram"], textarea[name*="instagram"], #instagram');
      const infoInput = document.querySelector('textarea[name*="additional"], #additional_info');
      const submitBtn = document.querySelector('form#step3 button[type="submit"]');
      const backBtn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toUpperCase().includes('BACK'));

      return {
        hasWebsite: !!webInput,
        hasInstagram: !!instaInput,
        hasAdditionalInfo: !!infoInput,
        submitBtnText: submitBtn ? submitBtn.innerText.trim() : null,
        backBtnText: backBtn ? backBtn.innerText.trim() : null
      };
    });
    console.log('Step 3 Elements:', JSON.stringify(step3Elements, null, 2));
    fs.writeFileSync(path.join(BASE_DIR, 'step3_figma_parity_inspection.json'), JSON.stringify(step3Elements, null, 2));
  }

  await browser.close();
  console.log('\n🏁 Desktop & Phone Audit Completed!');
})();
