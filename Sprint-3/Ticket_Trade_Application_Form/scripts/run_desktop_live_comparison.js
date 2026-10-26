const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const DESKTOP_DIR = path.join(SCREENSHOTS_DIR, 'desktop');
const DEFECTS_DIR = path.join(SCREENSHOTS_DIR, 'defects');

fs.mkdirSync(DESKTOP_DIR, { recursive: true });
fs.mkdirSync(DEFECTS_DIR, { recursive: true });

// Realistic Test Dummy Data
const DUMMY_DATA = {
  title: 'Ms',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'sarah.jenkins.design.test@example.com',
  usPhone: '2125550199', // Triggers US Phone Regex Validation Defect
  auBypassPhone: '0491570157',
  auBypassLandline: '0395181600',
  businessName: 'Jenkins Design Studio LLC',
  ein: '12-3456789',
  entityName: 'Jenkins Interiors Inc',
  streetAddress: '450 Lexington Ave',
  city: 'New York',
  stateCode: 'NY',
  zipcode: '10017',
  numEmployees: '6',
  bizTypeId: '6', // Designer
  website: 'https://www.jenkinsinteriors-demo.com',
  instagram: '@jenkins_interiors',
  additionalNotes: 'Boutique high-end residential and commercial interior design studio based in New York, NY.'
};

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🖥️ GLOBEWEST QA AUDIT: TRADE APPLICATION FORM (DESKTOP 1440x900 HEADED)');
  console.log('Target: https://mcstaging2.globewest.com/gwcustomer/trade/create');
  console.log('Figma: Globewest USA - External (Node ID: 3226-21024)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('🌐 [1/4] Navigating to US Staging Trade Application Form...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'networkidle' });
  await clearOverlays(page);
  await page.waitForTimeout(1500);

  // STEP 1 AUDIT & POPULATION
  console.log('\n📝 [2/4] STEP 1: Contact Details Audit & Dummy Data Entry');
  console.log('------------------------------------------------------------------------');
  
  await page.selectOption('#title', { value: DUMMY_DATA.title }).catch(async () => {
    await page.selectOption('#title', { label: 'Ms' }).catch(() => {});
  });
  await page.fill('#first_name', DUMMY_DATA.firstName);
  await page.fill('#last_name', DUMMY_DATA.lastName);
  await page.fill('#email', DUMMY_DATA.email);

  console.log(`⚠️ Testing US Phone Validation with US Number: ${DUMMY_DATA.usPhone}`);
  await page.fill('#mobile_phone', DUMMY_DATA.usPhone);
  await page.fill('#phone', DUMMY_DATA.usPhone);
  await page.waitForTimeout(1000);

  // Trigger Validation
  console.log('👉 Attempting submit with US Phone Number to check regex validation...');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(2000);

  // Check Phone Error
  const phoneError = await page.evaluate(() => {
    const mobileErr = document.querySelector('#mobile_phone-error');
    const phoneErr = document.querySelector('#phone-error');
    return {
      mobile: mobileErr ? mobileErr.innerText.trim() : null,
      phone: phoneErr ? phoneErr.innerText.trim() : null
    };
  });

  if (phoneError.mobile || phoneError.phone) {
    console.log('🚨 DEFECT CONFIRMED: US Phone Number Rejected by AU Validation Regex!');
    console.log(`   Actual Mobile Error: "${phoneError.mobile}"`);
    console.log(`   Actual Phone Error:  "${phoneError.phone}"`);
    await page.screenshot({
      path: path.join(DEFECTS_DIR, '01_US_PHONE_VALIDATION_ERROR.png'),
      fullPage: false
    });
    // Bypass Phone Defect using AU-compatible dummy number to proceed to Step 2
    console.log('\n🔄 Applying bypass dummy phone format to unlock Step 2 inspection...');
    await page.fill('#mobile_phone', DUMMY_DATA.auBypassPhone);
    await page.fill('#phone', DUMMY_DATA.auBypassLandline);
    await page.waitForTimeout(1000);
    await page.click('form#step1 button[type="submit"]');
    await page.waitForTimeout(3000);
  } else {
    console.log('🟢 PASS: US Phone Number (2125550199) accepted successfully! Form advanced to Step 2.');
  }

  // STEP 2 AUDIT (FIGMA DIRECT COUNTERPART)
  console.log('\n🏢 [3/4] STEP 2: Business Details Audit & Dummy Data Entry');
  console.log('------------------------------------------------------------------------');
  await page.waitForSelector('#business_name', { timeout: 10000 });
  await clearOverlays(page);

  // Audit Figma Parity against live elements
  const auditStep2 = await page.evaluate(() => {
    const backBtn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toUpperCase().includes('BACK'));
    const stateEl = document.querySelector('#state');
    const empInput = document.querySelector('#number_of_employees');
    const entityInput = document.querySelector('#entity_name');
    const addressLabel = document.querySelector('label[for="head_office_street_address"]') || Array.from(document.querySelectorAll('label')).find(l => l.innerText.toUpperCase().includes('HEAD OFFICE'));
    const spendLabel = Array.from(document.querySelectorAll('label, .legend, span, div')).find(l => l.innerText.toUpperCase().includes('AVERAGE YEARLY SPEND'));
    const signInLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toLowerCase().includes('sign in'));

    return {
      backBtnText: backBtn ? backBtn.innerText.trim() : 'N/A',
      statePlaceholder: stateEl && stateEl.options[0] ? stateEl.options[0].text.trim() : 'N/A',
      empPlaceholder: empInput ? empInput.placeholder : 'N/A',
      entityPlaceholder: entityInput ? entityInput.placeholder : 'N/A',
      addressLabelText: addressLabel ? addressLabel.innerText.trim() : 'N/A',
      spendLabelText: spendLabel ? spendLabel.innerText.trim() : 'N/A',
      signInText: signInLink ? signInLink.innerText.trim() : 'N/A'
    };
  });

  console.log('🔍 FIGMA VS LIVE DISCREPANCY AUDIT:');
  console.log(`   1. Back Button:       Expected: "← BACK"        | Actual: "${auditStep2.backBtnText}"`);
  console.log(`   2. State Dropdown:    Expected: "State ⌵"       | Actual: "${auditStep2.statePlaceholder}"`);
  console.log(`   3. Employees Field:   Expected: "eg. 1"         | Actual: "${auditStep2.empPlaceholder}"`);
  console.log(`   4. Entity Name:       Expected: "...business name" | Actual: "${auditStep2.entityPlaceholder}"`);
  console.log(`   5. Street Address:    Expected: No Asterisk (*) | Actual: "${auditStep2.addressLabelText}"`);
  console.log(`   6. Yearly Spend:      Expected: No Asterisk (*) | Actual: "${auditStep2.spendLabelText}"`);

  // Fill Step 2 with Realistic Dummy Data
  console.log('\n✍️ Populating Step 2 with US Trade Dummy Data...');
  await page.fill('#business_name', DUMMY_DATA.businessName);
  await page.fill('input[name="ein"], #abn', DUMMY_DATA.ein);
  await page.fill('#entity_name', DUMMY_DATA.entityName);
  await page.fill('#head_office_street_address', DUMMY_DATA.streetAddress);
  await page.fill('#suburb', DUMMY_DATA.city);
  
  // Select State
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

  await page.fill('#postcode', DUMMY_DATA.zipcode);
  await page.fill('#number_of_employees', DUMMY_DATA.numEmployees);

  // Select Business Type via Select2/jQuery
  await page.evaluate((val) => {
    const el = document.querySelector('#primary_business_type');
    if (window.jQuery && el) {
      window.jQuery(el).val(val).trigger('change');
    } else if (el) {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, DUMMY_DATA.bizTypeId);

  // Radio: Commercial Projects: Yes
  await page.evaluate(() => {
    const radio = document.querySelector('#commercial-projects-yes, input[name*="commercial"][value="1"], input[name*="commercial"][value="yes"]');
    if (radio) {
      radio.checked = true;
      if (window.jQuery) window.jQuery(radio).trigger('change');
      else radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Radio: Spend: 30k +
  await page.evaluate(() => {
    const radio = document.querySelector('#yearly-spend-30, input[name*="spend"][value*="30"], input[name*="spend"]');
    if (radio) {
      radio.checked = true;
      if (window.jQuery) window.jQuery(radio).trigger('change');
      else radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  await page.waitForTimeout(1500);
  await page.screenshot({
    path: path.join(DESKTOP_DIR, '02_US_TRADE_STEP2_FILLED_DESKTOP.png'),
    fullPage: false
  });
  console.log('📸 Captured filled Step 2: screenshots/desktop/02_US_TRADE_STEP2_FILLED_DESKTOP.png');

  // Advance to Step 3
  console.log('\n👉 Submitting Step 2 to inspect Step 3 (Additional Information)...');
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(5000);

  // STEP 3 AUDIT & DUMMY ENTRY
  console.log('\n📋 [4/4] STEP 3: Additional Information Inspection & Dummy Data Entry');
  console.log('------------------------------------------------------------------------');
  await clearOverlays(page);
  
  const step3Loaded = await page.evaluate(() => {
    const form3 = document.querySelector('form#step3');
    return form3 !== null && form3.offsetParent !== null;
  });

  if (step3Loaded) {
    console.log('✅ Step 3 loaded successfully.');
    await page.fill('input[name*="website"], #website', DUMMY_DATA.website).catch(() => {});
    await page.fill('input[name*="instagram"], textarea[name*="instagram"], #instagram', DUMMY_DATA.instagram).catch(() => {});
    await page.fill('textarea[name*="additional"], #additional_info', DUMMY_DATA.additionalNotes).catch(() => {});
    
    await page.screenshot({
      path: path.join(DESKTOP_DIR, '03_US_TRADE_STEP3_FILLED_DESKTOP.png'),
      fullPage: false
    });
    console.log('📸 Captured filled Step 3: screenshots/desktop/03_US_TRADE_STEP3_FILLED_DESKTOP.png');
    console.log('ℹ️  Step 3 reached! Avoiding final form submission to prevent creating unverified NetSuite entries.');
  }

  console.log('\n========================================================================');
  console.log('🎉 AUDIT COMPLETE: Desktop Headed Demonstration Finished.');
  console.log('========================================================================');
  await page.waitForTimeout(3000);
  await browser.close();
})();
