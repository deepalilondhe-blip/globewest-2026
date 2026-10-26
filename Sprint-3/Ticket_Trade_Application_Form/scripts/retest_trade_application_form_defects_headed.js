const path = require('path');
const fs = require('fs');
const pw = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const TARGET_URL = 'https://mcstaging2.globewest.com/gwcustomer/trade/create';

const DUMMY = {
  title: 'Ms',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: `sarah.jenkins.${Date.now()}@example.com`,
  usPhone: '2125550199', // Valid 10-digit US Phone
  businessName: 'Jenkins Design Studio LLC',
  ein: '12-3456789',
  entityName: 'Jenkins Interiors Inc',
  streetAddress: '450 Lexington Ave',
  validCity: 'New York',
  invalidCity: '99999 INVALID CITY !@#',
  stateCode: 'NY',
  zipcode: '10017',
  numEmployees: '6',
  bizTypeId: '6', // Interior Designer
  invalidInstagram: 'not an instagram handle $$$',
  website: 'https://www.jenkinsinteriors.com'
};

(async () => {
  console.log('========================================================================');
  console.log('🚀 LIVE HEADED RETEST: TRADE APPLICATION FORM DEFECTS VS FIGMA');
  console.log('Target URL: ' + TARGET_URL);
  console.log('Figma Reference: Globewest USA - External -> [FINAL] Designs - September Changes');
  console.log('Artboards: desktop/trade application (3226-21024), mobile/trade application (3226-21130)');
  console.log('========================================================================\n');

  const browser = await pw.chromium.launch({
    channel: 'chrome',
    headless: false,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const outDir = path.resolve(__dirname, '../screenshots/live_retest');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const defectsReport = [];

  // Helper for visual banner
  async function banner(locator, text, color = '#10B981', dur = 2000) {
    try {
      const isVis = await locator.isVisible({ timeout: 1500 }).catch(() => false);
      if (!isVis) return;
      await locator.scrollIntoViewIfNeeded({ timeout: 800 }).catch(() => {});
      await locator.evaluate((el, { t, c, d }) => {
        const prevOutline = el.style.outline;
        el.style.outline = `3px solid ${c}`;
        const tag = document.createElement('div');
        tag.className = 'qa-tag';
        tag.textContent = t;
        tag.style.position = 'absolute';
        tag.style.top = '-30px';
        tag.style.left = '0';
        tag.style.background = c;
        tag.style.color = '#fff';
        tag.style.fontSize = '12px';
        tag.style.fontWeight = 'bold';
        tag.style.padding = '3px 8px';
        tag.style.borderRadius = '4px';
        tag.style.zIndex = '999999';
        tag.style.whiteSpace = 'nowrap';
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

  // Dismiss popups
  async function clearPopups() {
    for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
    }
  }

  // =========================================================================
  // STEP 1 RETEST: US PHONE NUMBER VALIDATION
  // =========================================================================
  console.log('📍 [STEP 1/3] Navigating to Trade Application Form...');
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await clearPopups();
  await page.waitForTimeout(2000);

  console.log('  -> Filling Step 1 fields with US Phone: ' + DUMMY.usPhone);
  await page.selectOption('#title', { value: DUMMY.title }).catch(async () => {
    await page.selectOption('#title', { label: 'Ms' }).catch(() => {});
  });
  await page.fill('#first_name', DUMMY.firstName);
  await page.fill('#last_name', DUMMY.lastName);
  await page.fill('#email', DUMMY.email);

  await page.fill('#mobile_phone', DUMMY.usPhone);
  await page.fill('#phone', DUMMY.usPhone);

  const phoneBox = page.locator('#mobile_phone').first();
  await banner(phoneBox, `Testing US Phone: ${DUMMY.usPhone}`, '#2563EB', 1500);

  console.log('  -> Submitting Step 1 to test phone validation regex...');
  const nextBtnStep1 = page.locator('form#step1 button[type="submit"], #step1 .action.submit, #step1 button:has-text("Next")').first();
  await nextBtnStep1.click();
  await page.waitForTimeout(2500);

  // Check if error occurred on phone
  const phoneError = await page.evaluate(() => {
    const mErr = document.querySelector('#mobile_phone-error');
    const pErr = document.querySelector('#phone-error');
    return (mErr ? mErr.innerText.trim() : null) || (pErr ? pErr.innerText.trim() : null);
  });

  const step2Heading = page.locator('#business_name, label[for="business_name"], h2:has-text("Business Details")').first();
  const reachedStep2 = await step2Heading.isVisible({ timeout: 2000 }).catch(() => false);

  if (phoneError) {
    console.log(`  🔴 DEFECT CONFIRMED: US Phone rejected! Error: "${phoneError}"`);
    defectsReport.push({
      item: 'Step 1: US Phone Number Validation',
      figmaExpected: 'Accept valid 10-digit US phone numbers (e.g. 2125550199)',
      liveActual: `Rejected with error: "${phoneError}"`,
      verdict: 'DEFECT (BLOCKER)'
    });
  } else if (reachedStep2) {
    console.log('  🟢 PASS: US Phone 10-digit number (2125550199) accepted! Advanced to Step 2.');
    defectsReport.push({
      item: 'Step 1: US Phone Number Validation',
      figmaExpected: 'Accept valid 10-digit US phone numbers (e.g. 2125550199)',
      liveActual: 'Accepted cleanly without error; advanced to Step 2',
      verdict: 'RESOLVED / PASS'
    });
  }

  await page.screenshot({ path: path.join(outDir, '01_STEP1_PHONE_VALIDATION_RESULT.png') });

  // If blocked by AU phone, bypass with AU format to test Step 2 defects
  if (!reachedStep2) {
    console.log('  ⚠️ Bypassing Step 1 with AU number to retest Step 2 and Step 3 defects...');
    await page.fill('#mobile_phone', '0491570157');
    await page.fill('#phone', '0395181600');
    await nextBtnStep1.click();
    await page.waitForTimeout(3000);
  }

  // =========================================================================
  // STEP 2 RETEST: INSPECTING ALL KNOWN FIGMA DISCREPANCIES
  // =========================================================================
  console.log('\n📍 [STEP 2/3] Inspecting Step 2 Fields against Figma (Node 3226-21024)...');
  await page.waitForSelector('#business_name', { timeout: 10000 });
  await page.waitForTimeout(1500);

  // A. Back Button Text: "← BACK" vs "← GO BACK"
  const backBtn = page.locator('.action.back, a:has-text("BACK"), a:has-text("GO BACK"), button:has-text("BACK")').first();
  const backText = (await backBtn.innerText().catch(() => '')).trim();
  console.log(`  -> Back CTA Button Text: "${backText}" (Figma Spec: "← BACK")`);
  if (backText.includes('GO BACK')) {
    await banner(backBtn, '🔴 DEFECT: "← GO BACK" instead of "← BACK"', '#EF4444', 2000);
    defectsReport.push({
      item: 'Step 2: Back Button CTA Text',
      figmaExpected: '← BACK',
      liveActual: backText,
      verdict: 'DEFECT'
    });
  } else {
    defectsReport.push({
      item: 'Step 2: Back Button CTA Text',
      figmaExpected: '← BACK',
      liveActual: backText,
      verdict: 'PASS'
    });
  }

  // B. Street Address Label Asterisk: Figma has NO asterisk, Live has asterisk (*)
  const addressLabel = page.locator('label[for="head_office_street_address"], label:has-text("HEAD OFFICE STREET ADDRESS")').first();
  const addressLabelText = (await addressLabel.innerText().catch(() => '')).trim();
  console.log(`  -> Street Address Label: "${addressLabelText}" (Figma Spec: "HEAD OFFICE STREET ADDRESS" - No Asterisk)`);
  if (addressLabelText.includes('*')) {
    await banner(addressLabel, '🔴 DEFECT: Mandatory Asterisk (*) present on optional field', '#EF4444', 2000);
    defectsReport.push({
      item: 'Step 2: Head Office Street Address Asterisk',
      figmaExpected: 'HEAD OFFICE STREET ADDRESS (No asterisk, optional)',
      liveActual: addressLabelText,
      verdict: 'DEFECT'
    });
  } else {
    defectsReport.push({
      item: 'Step 2: Head Office Street Address Asterisk',
      figmaExpected: 'HEAD OFFICE STREET ADDRESS (No asterisk)',
      liveActual: addressLabelText,
      verdict: 'PASS'
    });
  }

  // C. State Dropdown Default Placeholder: Figma has "State ⌵", Live has "Please select ⌵"
  const stateSelect = page.locator('#state, select[name="state"]').first();
  const stateFirstOptionText = await stateSelect.locator('option').first().innerText().catch(() => '');
  console.log(`  -> State Dropdown Placeholder: "${stateFirstOptionText.trim()}" (Figma Spec: "State ⌵")`);
  if (stateFirstOptionText.toLowerCase().includes('please select')) {
    await banner(stateSelect, '🔴 DEFECT: Default placeholder is "Please select" instead of "State"', '#EF4444', 2000);
    defectsReport.push({
      item: 'Step 2: State Dropdown Placeholder',
      figmaExpected: 'State ⌵',
      liveActual: stateFirstOptionText.trim(),
      verdict: 'DEFECT'
    });
  } else {
    defectsReport.push({
      item: 'Step 2: State Dropdown Placeholder',
      figmaExpected: 'State ⌵',
      liveActual: stateFirstOptionText.trim(),
      verdict: 'PASS'
    });
  }

  // D. Number of Employees Placeholder: Figma has "eg. 1", Live has "Number of employees"
  const empInput = page.locator('#number_of_employees').first();
  const empPlaceholder = await empInput.getAttribute('placeholder') || '';
  console.log(`  -> Number of Employees Placeholder: "${empPlaceholder}" (Figma Spec: "eg. 1")`);
  if (empPlaceholder.toLowerCase().includes('number of employees')) {
    await banner(empInput, '🔴 DEFECT: Placeholder is "Number of employees" instead of "eg. 1"', '#EF4444', 2000);
    defectsReport.push({
      item: 'Step 2: Number of Employees Placeholder',
      figmaExpected: 'eg. 1',
      liveActual: empPlaceholder,
      verdict: 'DEFECT'
    });
  } else {
    defectsReport.push({
      item: 'Step 2: Number of Employees Placeholder',
      figmaExpected: 'eg. 1',
      liveActual: empPlaceholder,
      verdict: 'PASS'
    });
  }

  // E. City & State Validation Retest: User question: "invalid city as per state city should be work right ?"
  console.log('\n  -> Retesting City Field Validation with Invalid City: "' + DUMMY.invalidCity + '"...');
  await page.fill('#business_name', DUMMY.businessName);
  await page.fill('input[name="ein"], #abn', DUMMY.ein);
  await page.fill('#entity_name', DUMMY.entityName);
  await page.fill('#head_office_street_address', DUMMY.streetAddress);
  const cityInput = page.locator('#suburb, #city, input[name="city"], input[name="suburb"]').first();
  await cityInput.fill(DUMMY.invalidCity);
  await page.fill('#postcode', DUMMY.zipcode);
  await empInput.fill(DUMMY.numEmployees);

  // Select State NY
  await page.evaluate(() => {
    const s = document.querySelector('#state');
    if (s) { s.value = 'NY'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    const b = document.querySelector('#primary_business_type');
    if (b) { b.value = '6'; b.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  await page.click('input[name="commercial_projects"][value="1"]').catch(() => {});
  await page.click('input[name="average_yearly_spend"][value="under_10k"]').catch(() => {});
  await banner(cityInput, `Testing Invalid City: "${DUMMY.invalidCity}"`, '#F59E0B', 2000);

  await page.screenshot({ path: path.join(outDir, '02_STEP2_FIELDS_AND_INVALID_CITY.png') });

  console.log('  -> Submitting Step 2 with Invalid City to observe if form validates city-state correlation...');
  const nextBtnStep2 = page.locator('form#step2 button[type="submit"], #step2 button:has-text("Next")').first();
  await nextBtnStep2.click();
  await page.waitForTimeout(3500);

  // Check if form accepted invalid city and reached Step 3
  const step3Indicator = page.locator('#website, #instagram, label[for="website"], h2:has-text("Online Details"), h2:has-text("Trade References")').first();
  const reachedStep3 = await step3Indicator.isVisible({ timeout: 2000 }).catch(() => false);
  const cityError = await page.locator('#suburb-error, #city-error').innerText().catch(() => null);

  console.log(`  -> City Error displayed: ${cityError}`);
  console.log(`  -> Advanced to Step 3: ${reachedStep3}`);

  if (reachedStep3 && !cityError) {
    console.log('  🔴 OBSERVATION / DEFECT CONFIRMED: City field accepts arbitrary text and does NOT validate against selected US State!');
    defectsReport.push({
      item: 'Step 2: City & State Correlation Validation',
      figmaExpected: 'Validate that City matches selected State (or valid US municipal name)',
      liveActual: `Form accepted invalid city "${DUMMY.invalidCity}" without error and advanced to Step 3`,
      verdict: 'VALIDATION DEFECT'
    });
  } else {
    defectsReport.push({
      item: 'Step 2: City & State Correlation Validation',
      figmaExpected: 'Validate City against State',
      liveActual: `Rejected with error: "${cityError}"`,
      verdict: 'PASS'
    });
  }

  // =========================================================================
  // STEP 3 RETEST: URL & SOCIAL MEDIA VALIDATION
  // =========================================================================
  if (reachedStep3) {
    console.log('\n📍 [STEP 3/3] Inspecting Step 3 Validation (Website & Instagram)...');
    await page.waitForTimeout(1000);

    const websiteInput = page.locator('#website, input[name="website"]').first();
    const instaInput = page.locator('#instagram, input[name="instagram"]').first();

    if (await instaInput.isVisible().catch(() => false)) {
      console.log('  -> Testing Instagram field with invalid string: "' + DUMMY.invalidInstagram + '"...');
      await instaInput.fill(DUMMY.invalidInstagram);
      await banner(instaInput, `Testing Invalid Instagram: "${DUMMY.invalidInstagram}"`, '#F59E0B', 1500);

      // Attempt submit Step 3
      const submitStep3 = page.locator('form#step3 button[type="submit"]').first();
      await submitStep3.click().catch(() => {});
      await page.waitForTimeout(1500);

      const instaError = await page.locator('#instagram-error').innerText().catch(() => null);
      console.log(`  -> Instagram validation error: ${instaError}`);

      if (!instaError) {
        defectsReport.push({
          item: 'Step 3: Social Media / Instagram Handle Validation',
          figmaExpected: 'Validate proper Instagram handle (@username or URL)',
          liveActual: 'Form accepts arbitrary invalid strings without regex check',
          verdict: 'LOW DEFECT'
        });
      }
    }

    await page.screenshot({ path: path.join(outDir, '03_STEP3_ONLINE_DETAILS.png') });
  }

  // =========================================================================
  // FOOTER & LOCALIZATION CHECK
  // =========================================================================
  console.log('\n📍 Inspecting Footer Localization Leaks on US Trade Form...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);

  const footerText = await page.locator('footer').innerText().catch(() => '');
  const hasAuBadge = footerText.toLowerCase().includes('australian owned') || await page.locator('img[alt*="Australian Owned"], .c-footer__badge').isVisible().catch(() => false);
  console.log(`  -> Footer has "Australian Owned & Run" badge: ${hasAuBadge}`);

  if (hasAuBadge) {
    defectsReport.push({
      item: 'Storefront Footer Localization',
      figmaExpected: 'Clean US brand presentation (No Australian Owned & Run badge)',
      liveActual: 'Leaking "AUSTRALIAN OWNED & RUN" badge in US footer',
      verdict: 'LOCALIZATION LEAK'
    });
  }

  await page.screenshot({ path: path.join(outDir, '04_FOOTER_LOCALIZATION_LEAK.png') });

  // =========================================================================
  // FINAL SUMMARY
  // =========================================================================
  console.log('\n========================================================================');
  console.log('📊 TRADE APPLICATION FORM RETEST AUDIT SUMMARY:');
  console.log('========================================================================');
  console.table(defectsReport);

  fs.writeFileSync(
    path.join(__dirname, '../LIVE_RETEST_TRADE_APPLICATION_REPORT.json'),
    JSON.stringify(defectsReport, null, 2)
  );

  await page.waitForTimeout(4000);
  await browser.close();
})();
