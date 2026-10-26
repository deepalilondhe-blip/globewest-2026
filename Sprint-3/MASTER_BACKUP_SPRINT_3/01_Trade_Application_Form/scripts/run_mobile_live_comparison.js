const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const MOBILE_DIR = path.join(SCREENSHOTS_DIR, 'mobile');
const DEFECTS_DIR = path.join(SCREENSHOTS_DIR, 'defects');

fs.mkdirSync(MOBILE_DIR, { recursive: true });
fs.mkdirSync(DEFECTS_DIR, { recursive: true });

const DUMMY_DATA = {
  title: 'Ms',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: 'sarah.jenkins.design.test@example.com',
  usPhone: '2125550199',
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
  bizTypeId: '6',
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
  console.log('📱 GLOBEWEST QA AUDIT: TRADE APPLICATION FORM (MOBILE 390x844 HEADED)');
  console.log('Target: https://mcstaging2.globewest.com/gwcustomer/trade/create');
  console.log('Figma: Globewest USA - External (Node ID: 3226-21130)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  console.log('🌐 [1/4] Navigating to US Staging Mobile Form...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'networkidle' });
  await clearOverlays(page);
  await page.waitForTimeout(1500);

  // STEP 1 MOBILE
  console.log('\n📝 [2/4] STEP 1 Mobile Contact Details Dummy Data Entry');
  await page.selectOption('#title', { value: DUMMY_DATA.title }).catch(async () => {
    await page.selectOption('#title', { label: 'Ms' }).catch(() => {});
  });
  await page.fill('#first_name', DUMMY_DATA.firstName);
  await page.fill('#last_name', DUMMY_DATA.lastName);
  await page.fill('#email', DUMMY_DATA.email);

  console.log(`⚠️ Testing US Phone Validation on Mobile: ${DUMMY_DATA.usPhone}`);
  await page.fill('#mobile_phone', DUMMY_DATA.usPhone);
  await page.fill('#phone', DUMMY_DATA.usPhone);
  await page.waitForTimeout(1000);

  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(2000);

  // Check Error
  const hasPhoneError = await page.evaluate(() => {
    const mobileErr = document.querySelector('#mobile_phone-error');
    return mobileErr && mobileErr.offsetParent !== null;
  });

  if (hasPhoneError) {
    console.log('🚨 DEFECT: Mobile Phone Validation rejects US format with AU regex!');
    await page.screenshot({
      path: path.join(DEFECTS_DIR, '02_MOBILE_US_PHONE_VALIDATION_ERROR.png'),
      fullPage: false
    });
  }

  // Bypass
  await page.fill('#mobile_phone', DUMMY_DATA.auBypassPhone);
  await page.fill('#phone', DUMMY_DATA.auBypassLandline);
  await page.waitForTimeout(1000);
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(3000);

  // STEP 2 MOBILE (FIGMA COUNTERPART)
  console.log('\n🏢 [3/4] STEP 2 Mobile Business Details Inspection');
  await page.waitForSelector('#business_name', { timeout: 10000 });
  await clearOverlays(page);

  await page.fill('#business_name', DUMMY_DATA.businessName);
  await page.fill('input[name="ein"], #abn', DUMMY_DATA.ein);
  await page.fill('#entity_name', DUMMY_DATA.entityName);
  await page.fill('#head_office_street_address', DUMMY_DATA.streetAddress);
  await page.fill('#suburb', DUMMY_DATA.city);

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

  await page.evaluate((val) => {
    const el = document.querySelector('#primary_business_type');
    if (window.jQuery && el) {
      window.jQuery(el).val(val).trigger('change');
    } else if (el) {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, DUMMY_DATA.bizTypeId);

  await page.evaluate(() => {
    const radio = document.querySelector('#commercial-projects-yes, input[name*="commercial"][value="1"], input[name*="commercial"][value="yes"]');
    if (radio) {
      radio.checked = true;
      if (window.jQuery) window.jQuery(radio).trigger('change');
      else radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

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
    path: path.join(MOBILE_DIR, '02_US_TRADE_STEP2_FILLED_MOBILE.png'),
    fullPage: false
  });
  console.log('📸 Captured filled Step 2 Mobile: screenshots/mobile/02_US_TRADE_STEP2_FILLED_MOBILE.png');

  // Advance to Step 3
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(5000);

  // STEP 3 MOBILE
  console.log('\n📋 [4/4] STEP 3 Mobile Additional Info Inspection');
  await clearOverlays(page);
  await page.fill('input[name*="website"], #website', DUMMY_DATA.website).catch(() => {});
  await page.fill('input[name*="instagram"], textarea[name*="instagram"], #instagram', DUMMY_DATA.instagram).catch(() => {});
  await page.fill('textarea[name*="additional"], #additional_info', DUMMY_DATA.additionalNotes).catch(() => {});

  await page.screenshot({
    path: path.join(MOBILE_DIR, '03_US_TRADE_STEP3_FILLED_MOBILE.png'),
    fullPage: false
  });
  console.log('📸 Captured filled Step 3 Mobile: screenshots/mobile/03_US_TRADE_STEP3_FILLED_MOBILE.png');

  console.log('\n========================================================================');
  console.log('🎉 AUDIT COMPLETE: Mobile Headed Demonstration Finished.');
  console.log('========================================================================');
  await page.waitForTimeout(3000);
  await browser.close();
})();
