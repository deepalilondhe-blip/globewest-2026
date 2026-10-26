const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to US Create Account...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/create/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Check form element
  const formInfo = await page.evaluate(() => {
    const form = document.querySelector('#form-validate');
    const prefix = document.getElementById('prefix');
    const submitBtn = document.querySelector('button.action.submit.primary');
    return {
      formExists: !!form,
      prefixExists: !!prefix,
      submitBtnExists: !!submitBtn,
      prefixClasses: prefix ? prefix.className : null,
      prefixDataValidate: prefix ? prefix.getAttribute('data-validate') : null
    };
  });
  console.log('Initial form info:', formInfo);

  // Take screenshot before submit
  await page.screenshot({ path: 'Sprint-3/Ticket_41794537_Login_CreateAccount_Password/screenshots/retest_evidence/Before_Submit_Create_Account.png' });

  // Click submit button
  console.log('Clicking submit button...');
  await page.click('button.action.submit.primary');
  await page.waitForTimeout(2000);

  // Inspect what happened after submit
  const afterSubmitInfo = await page.evaluate(() => {
    // Collect all elements with class containing 'mage-error' or 'error'
    const errorEls = Array.from(document.querySelectorAll('.mage-error, [generated="true"], [id*="error"]')).map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className,
      innerText: el.innerText.trim(),
      html: el.outerHTML,
      visible: el.offsetParent !== null,
      rect: el.getBoundingClientRect()
    }));

    // Specific check for #prefix parent and siblings
    const prefix = document.getElementById('prefix');
    const fieldPrefix = prefix ? prefix.closest('.field') : null;
    const select2Container = fieldPrefix ? fieldPrefix.querySelector('.select2-container') : null;

    return {
      errorEls,
      fieldPrefixHTML: fieldPrefix ? fieldPrefix.innerHTML : null,
      fieldPrefixText: fieldPrefix ? fieldPrefix.innerText : null,
      select2Classes: select2Container ? select2Container.className : null
    };
  });

  console.log('After submit error elements:');
  console.dir(afterSubmitInfo.errorEls, { depth: null });
  console.log('\nfieldPrefixText:', afterSubmitInfo.fieldPrefixText);
  console.log('\nfieldPrefixHTML:', afterSubmitInfo.fieldPrefixHTML);

  await page.screenshot({ path: 'Sprint-3/Ticket_41794537_Login_CreateAccount_Password/screenshots/retest_evidence/After_Submit_Create_Account.png', fullPage: true });

  await browser.close();
})();
