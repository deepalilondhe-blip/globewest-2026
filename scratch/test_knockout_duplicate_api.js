const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Fill Step 1 with user typing and blur
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Deepali');
  await page.fill('#last_name', 'Londhe');
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.locator('#email').blur();
  await page.fill('#mobile_phone', '2125550199');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(2000);

  // Inspect the b2b component state on Step 2
  const compState = await page.evaluate(() => {
    const el = document.querySelector('.b2b-register');
    const comp = ko.dataFor(el);
    return {
      email: comp.email,
      abn: comp.abn,
      emailCheckUrlPath: comp.emailCheckUrlPath,
      activeStep: comp.activeStep,
      countryCode: comp.countryCode,
      businessIdName: comp.businessIdName
    };
  });

  console.log('Knockout Component State on Step 2:', compState);

  // Now type EIN into the input and trigger change & blur
  await page.focus('input[name="ein"], #abn');
  await page.type('input[name="ein"], #abn', '12-3456789', { delay: 100 });
  await page.evaluate(() => {
    const input = document.querySelector('input[name="ein"], #abn');
    if (input) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.locator('input[name="ein"], #abn').blur();
  await page.waitForTimeout(3000);

  // Check state again
  const afterEinState = await page.evaluate(() => {
    const el = document.querySelector('.b2b-register');
    const comp = ko.dataFor(el);
    const modalEl = comp.modal ? comp.modal[0] : null;
    return {
      email: comp.email,
      abn: comp.abn,
      abnEmailValid: comp.abnEmailValid,
      emailCheckMessage: comp.emailCheckMessage,
      modalVisible: comp.modalVisible,
      isModalOpen: modalEl ? modalEl.classList.contains('_show') : false
    };
  });

  console.log('After typing EIN and change event:', afterEinState);

  // If emailCheckUrlPath exists, test direct API call
  const apiTest = await page.evaluate(async () => {
    const el = document.querySelector('.b2b-register');
    const comp = ko.dataFor(el);
    if (!comp.emailCheckUrlPath) return 'no url';
    try {
      const resp = await fetch(comp.emailCheckUrlPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'deepali.londhe@overdose.digital', abn: '12-3456789' })
      });
      const data = await resp.text();
      return { url: comp.emailCheckUrlPath, status: resp.status, data };
    } catch (e) {
      return { error: e.message };
    }
  });

  console.log('Direct API Test Result:', apiTest);

  // Let's also test what happens with a different ABN/EIN via API:
  const apiTestDifferent = await page.evaluate(async () => {
    const el = document.querySelector('.b2b-register');
    const comp = ko.dataFor(el);
    if (!comp.emailCheckUrlPath) return 'no url';
    try {
      const resp = await fetch(comp.emailCheckUrlPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'deepali.londhe@overdose.digital', abn: '99-9999999' })
      });
      const data = await resp.text();
      return { status: resp.status, data };
    } catch (e) {
      return { error: e.message };
    }
  });

  console.log('Direct API Test with Different EIN Result:', apiTestDifferent);

  await browser.close();
})();
