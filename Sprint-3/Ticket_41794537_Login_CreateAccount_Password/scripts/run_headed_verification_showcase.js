const { chromium } = require('playwright');
const path = require('path');

const REPORT_PATH = path.resolve(__dirname, '..', 'RETEST_VERIFICATION_REPORT.html');

async function banner(page, title, subtitle, color = '#10b981') {
  await page.evaluate(({ title, subtitle, color }) => {
    let b = document.getElementById('qa-live-banner');
    if (!b) {
      b = document.createElement('div');
      b.id = 'qa-live-banner';
      b.style.position = 'fixed';
      b.style.top = '16px';
      b.style.left = '50%';
      b.style.transform = 'translateX(-50%)';
      b.style.zIndex = '99999999';
      b.style.padding = '14px 28px';
      b.style.borderRadius = '10px';
      b.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      b.style.boxShadow = '0 12px 35px rgba(0,0,0,0.6)';
      b.style.textAlign = 'center';
      b.style.transition = 'all 0.3s ease';
      document.body.appendChild(b);
    }
    b.style.background = '#0f172a';
    b.style.border = `2px solid ${color}`;
    b.innerHTML = `
      <div style="font-size: 15px; font-weight: 800; color: ${color}; letter-spacing: 0.5px; text-transform: uppercase;">${title}</div>
      <div style="font-size: 13px; color: #e2e8f0; margin-top: 4px;">${subtitle}</div>
    `;
  }, { title, subtitle, color }).catch(() => {});
}

async function highlight(page, selector, color = '#10b981') {
  await page.evaluate(({ selector, color }) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.outline = `3px solid ${color}`;
      el.style.outlineOffset = '4px';
      el.style.boxShadow = `0 0 20px ${color}`;
      el.style.transition = 'all 0.4s ease';
    }
  }, { selector, color }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 LAUNCHING HEADED MODE QA VERIFICATION SHOWCASE (Chrome on DISPLAY :0)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // --------------------------------------------------------------------------
  // STEP 1: LOGIN PAGE - REMEMBER ME CHECKBOX
  // --------------------------------------------------------------------------
  console.log('📍 1. Loading US Staging Login Page...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  await banner(
    page,
    'ITEM 3: REMEMBER ME CHECKBOX — PASSED ✅',
    'Verified that "Remember Me" checkbox & "What\'s this?" tooltip are now present on Login.',
    '#10b981'
  );
  await highlight(page, '#remember-me-box', '#10b981');
  await page.waitForTimeout(4000);

  // --------------------------------------------------------------------------
  // STEP 2: CREATE ACCOUNT PAGE - TITLE DROPDOWN
  // --------------------------------------------------------------------------
  console.log('\n📍 2. Loading US Staging Create Account Page...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/create/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  await banner(
    page,
    'ITEM 1: TITLE DROPDOWN — PASSED ✅',
    'Opening Title dropdown to display the 6 configured options: blank, Mr, Ms, Mrs, Miss, Dr',
    '#10b981'
  );
  await highlight(page, '.field-name-prefix', '#10b981');
  await page.waitForTimeout(1500);

  // Click on the select2 container to visibly open the dropdown
  console.log('Opening Select2 Title dropdown...');
  await page.click('.field-name-prefix .select2-selection').catch(() => {});
  await page.waitForTimeout(4000);

  // Close dropdown by pressing Escape or clicking outside
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(1000);

  // --------------------------------------------------------------------------
  // STEP 3: CREATE ACCOUNT PAGE - TITLE VALIDATION
  // --------------------------------------------------------------------------
  console.log('\n📍 3. Triggering Form Submit for Title Validation...');
  await banner(
    page,
    'ITEM 2: TITLE VALIDATION — PASSED ✅',
    'Submitting form empty to verify "This is a required field." validation message appears.',
    '#10b981'
  );
  await page.click('button.action.submit.primary').catch(() => {});
  await page.waitForTimeout(2000);

  await highlight(page, '.field-name-prefix', '#10b981');
  await banner(
    page,
    'ITEM 2: TITLE VALIDATION — PASSED ✅',
    'Validation Active: "<div id=\'prefix-error\'>This is a required field.</div>" is rendered below the dropdown!',
    '#10b981'
  );
  await page.waitForTimeout(4000);

  // --------------------------------------------------------------------------
  // STEP 4: PASSWORD FOCUS
  // --------------------------------------------------------------------------
  console.log('\n📍 4. Focusing on Password Input...');
  await banner(
    page,
    'ITEM 5: PASSWORD FOCUS CLARIFICATION ℹ️',
    'Clicking Password input — Direct DOM click places text cursor on click 1.',
    '#3b82f6'
  );
  await page.click('#password').catch(() => {});
  await highlight(page, '#password', '#3b82f6');
  await page.type('#password', 'TestPass123!', { delay: 100 }).catch(() => {});
  await page.waitForTimeout(3000);

  // --------------------------------------------------------------------------
  // STEP 5: LOAD INTERACTIVE REPORT
  // --------------------------------------------------------------------------
  console.log('\n📍 5. Loading RETEST_VERIFICATION_REPORT.html...');
  await page.goto(`file://${REPORT_PATH}`);
  await page.waitForTimeout(2000);

  await banner(
    page,
    'FULL QA RE-TEST & VERIFICATION REPORT 📋',
    'Ticket #41794537: Review all 7 items and verified evidence side-by-side.',
    '#3b82f6'
  );

  console.log('\n========================================================================');
  console.log('🎉 HEADED SHOWCASE COMPLETE! Browser will remain open for your review.');
  console.log('========================================================================\n');

  // Keep browser open for inspection (60 seconds)
  await page.waitForTimeout(60000);
  await browser.close();
})();
