const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const OUT_PATH = path.resolve(__dirname, '../screenshots/zipcode_search_verification/US_DESKTOP_ZIPCODE_SEARCH.png');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 780 }
  });

  console.log('Navigating to US locator...');
  await page.goto(US_LOCATOR_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Close overlays
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [class*="klaviyo"], [class*="newsletter"], .modal-popup');
    overlays.forEach(el => el.remove());
  }).catch(() => {});

  const inp = page.locator('input[data-bind*="postCode"]').first();
  await inp.fill('90210');
  await page.waitForTimeout(500);

  // Press enter / click search to trigger search
  await inp.press('Enter');
  await page.waitForTimeout(4000);

  // Draw red rectangle around 90210 input to match user AU screenshot style!
  await page.evaluate(() => {
    const field = document.querySelector('input[data-bind*="postCode"]');
    if (field) {
      field.style.outline = '3px solid red';
      field.style.outlineOffset = '2px';
    }
  });

  await page.screenshot({ path: OUT_PATH });
  console.log('Saved US search screenshot to:', OUT_PATH);

  await browser.close();
})();
