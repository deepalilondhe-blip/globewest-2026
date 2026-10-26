const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const AU_LOCATOR_URL = 'https://mcstaging2.globewest.com.au/locator';
const OUT_DIR = path.resolve(__dirname, '../screenshots/zipcode_search_verification');
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🧪 TESTING POSTCODE / ZIP CODE SEARCH BEHAVIOR (AU VS US)...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  // 1. TEST AU BASELINE WITH POSTCODE 3000
  console.log('\n1. Testing AU Baseline with Postcode 3000 (Melbourne)...');
  const auPage = await context.newPage();
  await auPage.goto(AU_LOCATOR_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await auPage.waitForTimeout(4000);

  // Close overlays
  await auPage.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [class*="klaviyo"], [class*="newsletter"], .modal-popup');
    overlays.forEach(el => el.remove());
  }).catch(() => {});

  const auInput = auPage.locator('input[data-bind*="postCode"]').first();
  await auInput.fill('3000');
  await auPage.waitForTimeout(500);

  // Click search button
  const auSearchBtn = auPage.locator('form.postcode button[type="submit"], .locator__search-submit').first();
  if (await auSearchBtn.isVisible()) {
    await auSearchBtn.click();
  } else {
    await auInput.press('Enter');
  }
  console.log('   Waiting for AU search results to render and map to pan...');
  await auPage.waitForTimeout(5000);

  const auResults = await auPage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .locator__results-item')).map(el => el.innerText.trim());
    return {
      count: cards.length,
      firstCard: cards[0] || 'No cards rendered'
    };
  });
  console.log('   AU Search Results for 3000:', auResults);
  await auPage.screenshot({ path: path.join(OUT_DIR, '01_AU_SEARCH_3000_RESULT.png'), fullPage: true });

  // 2. TEST US STAGING WITH ZIP CODE 90210
  console.log('\n2. Testing US Staging with ZIP Code 90210...');
  const usPage = await context.newPage();
  await usPage.goto(US_LOCATOR_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await usPage.waitForTimeout(4000);

  // Close overlays
  await usPage.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [class*="klaviyo"], [class*="newsletter"], .modal-popup');
    overlays.forEach(el => el.remove());
  }).catch(() => {});

  const usInput = usPage.locator('input[data-bind*="postCode"]').first();
  await usInput.fill('90210');
  await usPage.waitForTimeout(500);

  const usSearchBtn = usPage.locator('form.postcode button[type="submit"], .locator__search-submit').first();
  if (await usSearchBtn.isVisible()) {
    await usSearchBtn.click();
  } else {
    await usInput.press('Enter');
  }
  console.log('   Waiting for US search results...');
  await usPage.waitForTimeout(5000);

  const usResults90210 = await usPage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .locator__results-item')).map(el => el.innerText.trim());
    return {
      count: cards.length,
      firstCard: cards[0] || 'No cards rendered'
    };
  });
  console.log('   US Search Results for 90210:', usResults90210);
  await usPage.screenshot({ path: path.join(OUT_DIR, '02_US_SEARCH_90210_RESULT.png'), fullPage: true });

  // 3. TEST US STAGING WITH STORE'S ACTUAL ZIP CODE 90069
  console.log('\n3. Testing US Staging with Store Exact ZIP 90069 (West Hollywood)...');
  await usInput.fill('90069');
  await usPage.waitForTimeout(500);
  if (await usSearchBtn.isVisible()) {
    await usSearchBtn.click();
  } else {
    await usInput.press('Enter');
  }
  await usPage.waitForTimeout(5000);

  const usResults90069 = await usPage.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .locator__results-item')).map(el => el.innerText.trim());
    return {
      count: cards.length,
      firstCard: cards[0] || 'No cards rendered'
    };
  });
  console.log('   US Search Results for 90069:', usResults90069);
  await usPage.screenshot({ path: path.join(OUT_DIR, '03_US_SEARCH_90069_RESULT.png'), fullPage: true });

  await browser.close();
  console.log('✅ Search testing complete.');
})();
