const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';
const OUT_DIR = path.resolve(__dirname, '../screenshots/developer_fix_zipcode_label');
fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🔍 VERIFYING DEVELOPER UPDATES ON US STORE LOCATOR...');
  console.log('Target:', US_LOCATOR_URL);

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  await page.goto(US_LOCATOR_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(4000);

  // 1. INSPECT THE ZIP CODE LABEL
  console.log('\n--- 1. VERIFYING LABEL UPDATE ---');
  const labelData = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label, .label, .field label')).map(l => ({
      text: l.innerText.trim(),
      for: l.getAttribute('for'),
      html: l.outerHTML
    }));
    const zipLabel = labels.find(l => l.text.toLowerCase().includes('zip') || l.text.toLowerCase().includes('postcode'));
    return {
      allLabels: labels,
      zipLabel
    };
  });
  console.log('ZIP / Postcode Label Found:', labelData.zipLabel);

  // Take screenshot of search inputs area
  const searchArea = page.locator('.locator__search, .locator-search, form.postcode, .column.main').first();
  await page.screenshot({ path: path.join(OUT_DIR, '01_US_SEARCH_LABEL_VERIFIED.png') });
  console.log('Saved 01_US_SEARCH_LABEL_VERIFIED.png');

  // 2. TEST SEARCH BY STORE NAME: "Los Angeles"
  console.log('\n--- 2. VERIFYING SEARCH BY NAME: "Los Angeles" ---');
  const storeNameInp = page.locator('input[placeholder*="Start Typing"], #store-name, input[data-bind*="storeName"]').first();
  if (await storeNameInp.isVisible()) {
    await storeNameInp.fill('Los Angeles');
    await page.waitForTimeout(500);

    const submitNameBtn = page.locator('form.store-name button[type="submit"], input[data-bind*="storeName"] ~ button, .locator__search-submit').nth(1);
    if (await submitNameBtn.isVisible()) {
      await submitNameBtn.click();
    } else {
      await storeNameInp.press('Enter');
    }
    await page.waitForTimeout(4000);

    const nameResults = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .locator__results-item')).map(c => c.innerText.trim());
      // Check if map center or zoom changed
      return {
        cardsCount: cards.length,
        cards
      };
    });
    console.log('Search by Name "Los Angeles" Results:', nameResults);
    await page.screenshot({ path: path.join(OUT_DIR, '02_SEARCH_BY_NAME_LOS_ANGELES.png') });
    console.log('Saved 02_SEARCH_BY_NAME_LOS_ANGELES.png');
  }

  // 3. TEST SEARCH BY STORE NAME: "GlobeWest"
  console.log('\n--- 3. VERIFYING SEARCH BY NAME: "GlobeWest" ---');
  if (await storeNameInp.isVisible()) {
    await storeNameInp.fill('');
    await storeNameInp.fill('GlobeWest');
    await page.waitForTimeout(500);
    await storeNameInp.press('Enter');
    await page.waitForTimeout(4000);

    const gwResults = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.locator-item, .store-item, .stockist-item, .locator__results-item')).map(c => c.innerText.trim());
      return {
        cardsCount: cards.length,
        cards
      };
    });
    console.log('Search by Name "GlobeWest" Results:', gwResults);
    await page.screenshot({ path: path.join(OUT_DIR, '03_SEARCH_BY_NAME_GLOBEWEST.png') });
    console.log('Saved 03_SEARCH_BY_NAME_GLOBEWEST.png');
  }

  // 4. TEST MOBILE VIEW OF THE NEW LABEL
  console.log('\n--- 4. VERIFYING MOBILE VIEW OF NEW LABEL ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '04_MOBILE_SEARCH_LABEL_VERIFIED.png') });
  console.log('Saved 04_MOBILE_SEARCH_LABEL_VERIFIED.png');

  await browser.close();
  console.log('✅ Retest script finished.');
})();
