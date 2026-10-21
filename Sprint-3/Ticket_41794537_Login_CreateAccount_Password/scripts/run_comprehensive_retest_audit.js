const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const RE_TEST_DIR = path.join(BASE_DIR, 'screenshots', 'retest_evidence');
fs.mkdirSync(RE_TEST_DIR, { recursive: true });

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🕵️ COMPREHENSIVE QA RE-TEST: LOGIN, CREATE ACCOUNT, FORGOT PASSWORD');
  console.log('Testing US Staging vs AU Live/Staging across all 7 items');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  const results = {
    item1_title_dropdown: {},
    item2_title_validation: {},
    item3_remember_me: {},
    item4_recaptcha: {},
    item5_password_focus: {},
    item6_ios_zoom_font_size: {},
    item7_forgot_password_submission: {}
  };

  // --------------------------------------------------------------------------
  // ITEM 1 & 2 & 5 & 6 & 4: CREATE ACCOUNT PAGE ON US STAGING
  // --------------------------------------------------------------------------
  console.log('\n--- 1. Testing US Staging: Create Account ---');
  try {
    await page.goto('https://mcstaging2.globewest.com/customer/account/create/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    // Screenshot initial
    await page.screenshot({ path: path.join(RE_TEST_DIR, 'US_Create_Account_Initial.png') });

    // Item 1: Title Field
    const titleInfo = await page.evaluate(() => {
      const el = document.getElementById('prefix') || document.querySelector('[name="prefix"]');
      if (!el) return { found: false };
      const isSelect = el.tagName.toLowerCase() === 'select';
      const options = isSelect ? Array.from(el.options).map(o => ({ value: o.value, text: o.text.trim() })) : [];
      return {
        found: true,
        tagName: el.tagName.toLowerCase(),
        id: el.id,
        name: el.name,
        isSelect,
        options,
        computedStyles: {
          fontSize: window.getComputedStyle(el).fontSize,
          height: window.getComputedStyle(el).height,
          border: window.getComputedStyle(el).border
        }
      };
    });
    results.item1_title_dropdown.us = titleInfo;
    console.log('US Title field info:', JSON.stringify(titleInfo, null, 2));

    // Item 6: Font sizes on US Create Account
    const fontSizesUS = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      return inputs.map(i => ({
        id: i.id,
        name: i.name,
        type: i.type,
        tagName: i.tagName.toLowerCase(),
        fontSize: window.getComputedStyle(i).fontSize
      }));
    });
    results.item6_ios_zoom_font_size.usCreate = fontSizesUS;

    // Viewport meta
    const viewportMetaUS = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute('content') : null;
    });
    results.item6_ios_zoom_font_size.usViewportMeta = viewportMetaUS;

    // Item 4: reCAPTCHA on US Create Account
    const recaptchaUS = await page.evaluate(() => {
      const recaptchaEl = document.querySelector('.g-recaptcha, [data-sitekey], .recaptcha');
      const textDisclaimer = document.body.innerText.includes('reCAPTCHA') || document.body.innerText.includes('Google Privacy Policy');
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src).filter(s => s.includes('recaptcha'));
      return {
        hasRecaptchaEl: !!recaptchaEl,
        hasDisclaimerText: textDisclaimer,
        scripts
      };
    });
    results.item4_recaptcha.usCreate = recaptchaUS;

    // Item 5: Password focus test on US Create Account
    const passwordFocusTest = await page.evaluate(() => {
      const pwd = document.getElementById('password');
      if (!pwd) return { found: false };
      
      const rect = pwd.getBoundingClientRect();
      const elAtPoint = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
      
      return {
        found: true,
        pwdId: pwd.id,
        pwdType: pwd.type,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        elAtPointTag: elAtPoint ? elAtPoint.tagName : null,
        elAtPointId: elAtPoint ? elAtPoint.id : null,
        elAtPointClass: elAtPoint ? elAtPoint.className : null,
        isClickIntercepted: elAtPoint !== pwd,
        tabIndex: pwd.tabIndex,
        autocomplete: pwd.autocomplete,
        pointerEvents: window.getComputedStyle(pwd).pointerEvents
      };
    });
    results.item5_password_focus.elementInspection = passwordFocusTest;

    // Test actual click on password input
    const pwdBox = await page.$('#password');
    if (pwdBox) {
      await pwdBox.click();
      const activeElementAfterClick = await page.evaluate(() => document.activeElement ? {
        id: document.activeElement.id,
        tagName: document.activeElement.tagName
      } : null);
      results.item5_password_focus.activeElementAfterClick = activeElementAfterClick;
    }

    // Item 2: Submit empty form on US Create Account to check Title validation
    console.log('Submitting empty form on US Create Account to check validation...');
    await page.evaluate(() => {
      const form = document.querySelector('#form-validate, form.form-create-account, form');
      const submitBtn = document.querySelector('button.submit, button[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
      } else if (form) {
        form.submit();
      }
    });
    await page.waitForTimeout(2000);

    // Capture screenshot after submit
    await page.screenshot({ path: path.join(RE_TEST_DIR, 'US_Create_Account_Validation.png') });

    const titleValidationUS = await page.evaluate(() => {
      const prefixEl = document.getElementById('prefix') || document.querySelector('[name="prefix"]');
      if (!prefixEl) return { found: false };
      // Look for error message near prefix
      const parent = prefixEl.closest('.field') || prefixEl.parentElement;
      const errorMsgEl = parent ? parent.querySelector('.mage-error, [generated="true"], .error, [id*="error"]') : null;
      return {
        prefixId: prefixEl.id,
        errorFound: !!errorMsgEl,
        errorText: errorMsgEl ? errorMsgEl.innerText.trim() : null,
        errorClass: errorMsgEl ? errorMsgEl.className : null,
        errorDisplay: errorMsgEl ? window.getComputedStyle(errorMsgEl).display : null,
        fieldClasses: parent ? parent.className : null
      };
    });
    results.item2_title_validation.us = titleValidationUS;
    console.log('US Title validation info:', JSON.stringify(titleValidationUS, null, 2));

  } catch (e) {
    console.error('Error on US Create Account:', e);
  }

  // --------------------------------------------------------------------------
  // ITEM 1 & 2 & 4 & 6: COMPARE WITH AU CREATE ACCOUNT (LIVE & STAGING)
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Testing AU: Create Account ---');
  for (const auUrl of ['https://www.globewest.com.au/customer/account/create/', 'https://mcstaging2.globewest.com.au/customer/account/create/']) {
    try {
      console.log(`Checking AU URL: ${auUrl}`);
      await page.goto(auUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      await clearOverlays(page);

      const titleAU = await page.evaluate(() => {
        const el = document.getElementById('prefix') || document.querySelector('[name="prefix"]');
        if (!el) return { found: false };
        const isSelect = el.tagName.toLowerCase() === 'select';
        const options = isSelect ? Array.from(el.options).map(o => ({ value: o.value, text: o.text.trim() })) : [];
        return {
          found: true,
          tagName: el.tagName.toLowerCase(),
          isSelect,
          options,
          computedStyles: {
            fontSize: window.getComputedStyle(el).fontSize
          }
        };
      });

      const recaptchaAU = await page.evaluate(() => {
        const recaptchaEl = document.querySelector('.g-recaptcha, [data-sitekey], .recaptcha');
        const textDisclaimer = document.body.innerText.includes('reCAPTCHA') || document.body.innerText.includes('Google Privacy Policy');
        return {
          hasRecaptchaEl: !!recaptchaEl,
          hasDisclaimerText: textDisclaimer
        };
      });

      const fontSizesAU = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        return inputs.map(i => ({
          id: i.id,
          name: i.name,
          type: i.type,
          fontSize: window.getComputedStyle(i).fontSize
        }));
      });

      // Submit empty to get AU validation text
      await page.evaluate(() => {
        const submitBtn = document.querySelector('button.submit, button[type="submit"]');
        if (submitBtn) submitBtn.click();
      });
      await page.waitForTimeout(2000);

      const auValidation = await page.evaluate(() => {
        const prefixEl = document.getElementById('prefix') || document.querySelector('[name="prefix"]');
        if (!prefixEl) return { found: false };
        const parent = prefixEl.closest('.field') || prefixEl.parentElement;
        const errorMsgEl = parent ? parent.querySelector('.mage-error, [generated="true"], .error, [id*="error"]') : null;
        return {
          errorFound: !!errorMsgEl,
          errorText: errorMsgEl ? errorMsgEl.innerText.trim() : null
        };
      });

      const key = auUrl.includes('mcstaging2') ? 'auStaging' : 'auLive';
      results.item1_title_dropdown[key] = titleAU;
      results.item2_title_validation[key] = auValidation;
      results.item4_recaptcha[key + 'Create'] = recaptchaAU;
      results.item6_ios_zoom_font_size[key + 'Create'] = fontSizesAU;

      await page.screenshot({ path: path.join(RE_TEST_DIR, `${key}_Create_Account_Validation.png`) });
      break; // AU Live succeeded
    } catch (e) {
      console.warn(`AU capture error on ${auUrl}:`, e.message);
    }
  }

  // --------------------------------------------------------------------------
  // ITEM 3: LOGIN PAGE ON US STAGING (Remember Me Checkbox)
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Testing US Staging: Customer Login ---');
  try {
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    await page.screenshot({ path: path.join(RE_TEST_DIR, 'US_Login_Page.png') });

    const rememberMeUS = await page.evaluate(() => {
      // Check for remember me checkbox or input
      const cb = document.querySelector('input[type="checkbox"][name*="remember"], #remember-me, [id*="remember"]');
      const allCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).map(c => ({
        id: c.id,
        name: c.name,
        checked: c.checked,
        visible: c.offsetParent !== null,
        label: c.closest('label') ? c.closest('label').innerText.trim() : (document.querySelector(`label[for="${c.id}"]`) ? document.querySelector(`label[for="${c.id}"]`).innerText.trim() : '')
      }));

      // Also search text "Remember"
      const bodyTextHasRemember = document.body.innerText.includes('Remember Me') || document.body.innerText.includes('Remember me');

      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('pass');

      return {
        checkboxFound: !!cb,
        cbDetails: cb ? {
          id: cb.id,
          name: cb.name,
          visible: cb.offsetParent !== null,
          computedStyles: {
            display: window.getComputedStyle(cb).display,
            visibility: window.getComputedStyle(cb).visibility
          }
        } : null,
        allCheckboxes,
        bodyTextHasRemember,
        emailFontSize: emailInput ? window.getComputedStyle(emailInput).fontSize : null,
        passFontSize: passInput ? window.getComputedStyle(passInput).fontSize : null
      };
    });
    results.item3_remember_me.us = rememberMeUS;
    console.log('US Remember Me info:', JSON.stringify(rememberMeUS, null, 2));

    // Check reCAPTCHA on US Login
    const recaptchaUSLogin = await page.evaluate(() => {
      const el = document.querySelector('.g-recaptcha, [data-sitekey]');
      const hasText = document.body.innerText.includes('reCAPTCHA');
      return { hasEl: !!el, hasText };
    });
    results.item4_recaptcha.usLogin = recaptchaUSLogin;

  } catch (e) {
    console.error('Error on US Login:', e);
  }

  // Check AU Login for comparison
  console.log('\n--- 4. Testing AU Live: Customer Login ---');
  try {
    await page.goto('https://www.globewest.com.au/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    await page.screenshot({ path: path.join(RE_TEST_DIR, 'AU_Login_Page.png') });

    const rememberMeAU = await page.evaluate(() => {
      const allCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')).map(c => ({
        id: c.id,
        name: c.name,
        visible: c.offsetParent !== null,
        label: c.closest('label') ? c.closest('label').innerText.trim() : (document.querySelector(`label[for="${c.id}"]`) ? document.querySelector(`label[for="${c.id}"]`).innerText.trim() : '')
      }));
      const emailInput = document.getElementById('email');
      const passInput = document.getElementById('pass');
      return {
        allCheckboxes,
        emailFontSize: emailInput ? window.getComputedStyle(emailInput).fontSize : null,
        passFontSize: passInput ? window.getComputedStyle(passInput).fontSize : null
      };
    });
    results.item3_remember_me.au = rememberMeAU;
    console.log('AU Remember Me info:', JSON.stringify(rememberMeAU, null, 2));

    // Check reCAPTCHA on AU Login
    const recaptchaAULogin = await page.evaluate(() => {
      const el = document.querySelector('.g-recaptcha, [data-sitekey]');
      const hasText = document.body.innerText.includes('reCAPTCHA');
      return { hasEl: !!el, hasText };
    });
    results.item4_recaptcha.auLogin = recaptchaAULogin;

  } catch (e) {
    console.error('Error on AU Login:', e);
  }

  // --------------------------------------------------------------------------
  // ITEM 7: FORGOT PASSWORD PAGE (Submission & Delivery Analysis)
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Testing US Staging: Forgot Password ---');
  try {
    await page.goto('https://mcstaging2.globewest.com/customer/account/forgotpassword/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    await page.screenshot({ path: path.join(RE_TEST_DIR, 'US_Forgot_Password_Initial.png') });

    const forgotPassDetails = await page.evaluate(() => {
      const emailInput = document.getElementById('email_address');
      const submitBtn = document.querySelector('button.submit, button[type="submit"]');
      const recaptchaEl = document.querySelector('.g-recaptcha, [data-sitekey]');
      const hasDisclaimer = document.body.innerText.includes('reCAPTCHA');
      return {
        emailFound: !!emailInput,
        emailFontSize: emailInput ? window.getComputedStyle(emailInput).fontSize : null,
        submitBtnFound: !!submitBtn,
        submitBtnText: submitBtn ? submitBtn.innerText.trim() : null,
        hasRecaptcha: !!recaptchaEl,
        hasDisclaimer
      };
    });
    results.item7_forgot_password_submission.details = forgotPassDetails;

    // Fill test email and submit
    console.log('Submitting Forgot Password on US Staging with test email...');
    await page.fill('#email_address', 'deepali.londhe@overdose.digital');
    
    // Listen for response
    const [response] = await Promise.all([
      page.waitForNavigation({ timeout: 15000 }).catch(() => null),
      page.click('button.submit, button[type="submit"]')
    ]);

    await page.waitForTimeout(3000);
    await clearOverlays(page);

    await page.screenshot({ path: path.join(RE_TEST_DIR, 'US_Forgot_Password_Submitted.png') });

    const submissionResult = await page.evaluate(() => {
      const msgSuccess = document.querySelector('.message-success, .messages .message-success, [data-ui-id="message-success"]');
      const msgError = document.querySelector('.message-error, .messages .message-error, [data-ui-id="message-error"]');
      return {
        currentUrl: window.location.href,
        successMsg: msgSuccess ? msgSuccess.innerText.trim() : null,
        errorMsg: msgError ? msgError.innerText.trim() : null
      };
    });
    results.item7_forgot_password_submission.result = submissionResult;
    console.log('US Forgot Password submission result:', JSON.stringify(submissionResult, null, 2));

  } catch (e) {
    console.error('Error on US Forgot Password:', e);
  }

  // Check AU Forgot Password for comparison
  console.log('\n--- 6. Testing AU Live: Forgot Password ---');
  try {
    await page.goto('https://www.globewest.com.au/customer/account/forgotpassword/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    const auForgotPass = await page.evaluate(() => {
      const emailInput = document.getElementById('email_address');
      const recaptchaEl = document.querySelector('.g-recaptcha, [data-sitekey]');
      const hasDisclaimer = document.body.innerText.includes('reCAPTCHA');
      return {
        emailFontSize: emailInput ? window.getComputedStyle(emailInput).fontSize : null,
        hasRecaptcha: !!recaptchaEl,
        hasDisclaimer
      };
    });
    results.item7_forgot_password_submission.auDetails = auForgotPass;
  } catch (e) {
    console.error('Error on AU Forgot Password:', e);
  }

  await browser.close();

  // Save results to JSON file
  fs.writeFileSync(path.join(RE_TEST_DIR, 'audit_retest_results.json'), JSON.stringify(results, null, 2));
  console.log('\n========================================================================');
  console.log('🎉 AUDIT RE-TEST COMPLETE! Results saved to audit_retest_results.json');
  console.log('========================================================================\n');
})();
