// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const OUT_DIR = path.join(__dirname, '..', '..', 'mobile_audit');

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test('Test Mobile Slide-Out Interaction and MSRP Toggle', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 390, height: 844 });

  console.log('1. Logging in as Trade customer on mobile...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email').first();
  const passField = page.locator('#pass').first();
  const submitBtn = page.locator('#send2').first();

  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailField.fill(TRADE_USER.email);
    await passField.fill(TRADE_USER.password);
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  console.log('2. Navigating to PDP...');
  await page.goto(`${US_BASE_URL}/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Take screenshot before opening
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_01_initial_trade.png') });

  // Click the eye icon trigger in top bar
  console.log('3. Clicking Eye Icon trigger...');
  const trigger = page.locator('.price-toggle__trigger, button:has-text("Trade")').first();
  await trigger.click();
  await page.waitForTimeout(1000);

  // Take screenshot of open slideout drawer
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_02_slideout_open.png') });

  // Click on "MSRP" option inside the slideout drawer
  console.log('4. Selecting MSRP option in slideout drawer...');
  const msrpOption = page.locator('.price-toggle__item:has-text("MSRP"), button:has-text("MSRP"), li:has-text("MSRP")').first();
  await msrpOption.click();
  await page.waitForTimeout(2000);

  // Take screenshot after switching to MSRP
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_03_msrp_selected.png') });

  // Verify prices and classes
  const status = await page.evaluate(() => {
    const rootClass = document.documentElement.className;
    const bodyClass = document.body.className;
    const triggerText = document.querySelector('.price-toggle__trigger')?.textContent?.trim();
    const prices = Array.from(document.querySelectorAll('.price, .price-box')).map(el => el.textContent?.trim()).filter(Boolean);
    return { rootClass, bodyClass, triggerText, prices };
  });

  console.log('Mobile MSRP Status:', JSON.stringify(status, null, 2));
});
