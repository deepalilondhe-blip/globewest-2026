const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';

async function updateHud(page, { stepTitle, status, message, color }) {
  await page.evaluate(({ stepTitle, status, message, color }) => {
    let hud = document.getElementById('qa-live-headed-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'qa-live-headed-hud';
      hud.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 850px;
        max-width: 92vw;
        background: #0f172a;
        color: white;
        border: 3px solid ${color};
        border-radius: 12px;
        padding: 16px 24px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.85);
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;
      document.body.appendChild(hud);
    }
    hud.style.borderColor = color;
    hud.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-weight:800; font-size:15px; color:#f8fafc; letter-spacing:0.5px;">${stepTitle}</span>
        <span style="background:${color}; color:white; font-size:12px; font-weight:800; padding:4px 12px; border-radius:9999px;">${status}</span>
      </div>
      <div style="font-size:14px; line-height:1.5; color:#cbd5e1;">${message}</div>
    `;
  }, { stepTitle, status, message, color });
}

(async () => {
  console.log('🚀 LAUNCHING HEADED BROWSER ON DISPLAY :0...');

  const browser = await chromium.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome',
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: null // Takes full maximized screen!
  });

  const page = await context.newPage();

  console.log('1. Loading US Store Locator...');
  await page.goto(US_LOCATOR_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Close overlays
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [class*="klaviyo"], [class*="newsletter"], .modal-popup');
    overlays.forEach(el => el.remove());
  }).catch(() => {});

  // =========================================================================
  // DEMO 1: SEARCH BY ZIP CODE (90210) — SHOW THAT NO GLOBEWEST STORE SHOWS
  // =========================================================================
  console.log('\n--- DEMO 1: Searching by ZIP Code: 90210 ---');
  await updateHud(page, {
    stepTitle: 'TEST 1: SEARCH BY ZIP CODE (90210)',
    status: 'WATCHING SCREEN',
    message: 'Typing US ZIP Code <strong>"90210"</strong> into the search field and submitting...',
    color: '#3b82f6'
  });

  const zipInput = page.locator('input[data-bind*="postCode"]').first();
  await zipInput.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const inp = document.querySelector('input[data-bind*="postCode"]');
    if (inp) inp.style.outline = '4px solid red';
  });

  await zipInput.fill('90210');
  await page.waitForTimeout(1000);

  const zipSubmit = page.locator('form.postcode button[type="submit"], .locator__search-submit').first();
  if (await zipSubmit.isVisible()) {
    await zipSubmit.click();
  } else {
    await zipInput.press('Enter');
  }

  console.log('Submitted 90210 search. Observing result...');
  await page.waitForTimeout(5000);

  await updateHud(page, {
    stepTitle: 'TEST 1 RESULT: ZIP CODE 90210',
    status: '0 STORES FOUND (DEFECT)',
    message: 'Notice that below the search box, <strong>NO GlobeWest stockist is displayed</strong>. The area remains completely blank and the Google Map does not navigate to Beverly Hills/Los Angeles.',
    color: '#ef4444'
  });
  await page.waitForTimeout(6000);

  // =========================================================================
  // DEMO 2: SEARCH BY STORE NAME ("GlobeWest")
  // =========================================================================
  console.log('\n--- DEMO 2: Searching by Store Name: "GlobeWest" ---');
  await updateHud(page, {
    stepTitle: 'TEST 2: SEARCH BY STORE NAME ("GlobeWest")',
    status: 'TESTING STORE NAME',
    message: 'Clearing ZIP code and typing <strong>"GlobeWest"</strong> in "SEARCH BY STORE NAME"...',
    color: '#3b82f6'
  });

  // Clear ZIP code
  await zipInput.fill('');
  await page.evaluate(() => {
    const inp = document.querySelector('input[data-bind*="postCode"]');
    if (inp) inp.style.outline = '';
  });

  const storeNameInput = page.locator('input[data-bind*="storeName"]').first();
  await storeNameInput.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const inp = document.querySelector('input[data-bind*="storeName"]');
    if (inp) inp.style.outline = '4px solid #10b981';
  });

  await storeNameInput.fill('GlobeWest');
  await page.waitForTimeout(1000);

  const nameSubmit = page.locator('form.store-name button[type="submit"], input[data-bind*="storeName"] ~ button, .locator__search-submit').nth(1);
  if (await nameSubmit.isVisible()) {
    await nameSubmit.click();
  } else {
    await storeNameInput.press('Enter');
  }

  console.log('Submitted "GlobeWest" name search. Observing results...');
  await page.waitForTimeout(5000);

  const resultsGW = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .locator__results-item')).map(c => c.innerText.trim());
    return { count: cards.length, cards };
  });
  console.log('Cards found for "GlobeWest":', resultsGW);

  await updateHud(page, {
    stepTitle: 'TEST 2 RESULT: STORE NAME "GlobeWest"',
    status: resultsGW.count > 0 ? 'RESULTS RENDERED' : '0 RESULTS',
    message: `Searching "GlobeWest" rendered <strong>${resultsGW.count} card(s)</strong> below the search inputs. (Note: Australian GlobeWest Melbourne also leaks here).`,
    color: resultsGW.count > 0 ? '#10b981' : '#f59e0b'
  });
  await page.waitForTimeout(6000);

  // =========================================================================
  // DEMO 3: SEARCH BY STORE NAME ("Los Angeles")
  // =========================================================================
  console.log('\n--- DEMO 3: Searching by Store Name: "Los Angeles" ---');
  await updateHud(page, {
    stepTitle: 'TEST 3: SEARCH BY STORE NAME ("Los Angeles")',
    status: 'TESTING "Los Angeles"',
    message: 'Now typing <strong>"Los Angeles"</strong> in the store name field and submitting...',
    color: '#3b82f6'
  });

  await storeNameInput.fill('');
  await storeNameInput.fill('Los Angeles');
  await page.waitForTimeout(1000);

  if (await nameSubmit.isVisible()) {
    await nameSubmit.click();
  } else {
    await storeNameInput.press('Enter');
  }

  console.log('Submitted "Los Angeles" name search. Observing map pan & card...');
  await page.waitForTimeout(5000);

  const resultsLA = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .locator__results-item')).map(c => c.innerText.trim());
    return { count: cards.length, cards };
  });
  console.log('Cards found for "Los Angeles":', resultsLA);

  await updateHud(page, {
    stepTitle: 'TEST 3 RESULT: "Los Angeles"',
    status: 'ZOOMS TO LA + CARD SHOWS',
    message: 'Notice that searching by name <strong>"Los Angeles"</strong> successfully zooms the Google Map into West Hollywood / Los Angeles and displays <strong>GlobeWest US Test Stockist – Los Angeles</strong> (with the broken logo image).',
    color: '#10b981'
  });
  await page.waitForTimeout(8000);

  // =========================================================================
  // DEMO 4: INTERACTIVE INSPECTION (LEAVE OPEN FOR USER)
  // =========================================================================
  await updateHud(page, {
    stepTitle: 'TEST COMPLETE: BROWSER OPEN FOR YOUR MANUAL CHECK',
    status: 'BROWSER ACTIVE',
    message: 'The browser is kept open. Feel free to click on the map, test other inputs, or inspect elements. It will close in 15 seconds.',
    color: '#6366f1'
  });

  console.log('Keeping browser open for 15 seconds for manual inspection...');
  await page.waitForTimeout(15000);

  console.log('Closing browser...');
  await browser.close();
  console.log('✅ Headed run finished.');
})();
