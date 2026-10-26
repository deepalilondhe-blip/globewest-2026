const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';
const OUT_DIR = path.resolve(__dirname, '../screenshots');

(async () => {
  console.log('🚀 Running Cart Invariance Test & AU Baseline Check in HEADED mode...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // 1. Log in to US Storefront
  console.log('Logging in as US Trade customer...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }
  console.log('US Trade customer logged in!');

  // 2. Go to PDP
  const pdpUrl = `${US_BASE_URL}/pearce-marble-2-drawer-bedside-matt-ocean-marble-bone-side-pearce-mar-2dr-matt-ocean-marble-bone`;
  console.log('Navigating to PDP:', pdpUrl);
  await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Switch toggle to MSRP mode
  console.log('Switching toggle to MSRP mode...');
  const triggerBtn = page.locator('.price-toggle__trigger').first();
  await triggerBtn.click();
  await page.waitForTimeout(600);
  await page.locator('button[data-view="msrp"], button:has-text("MSRP")').first().click();
  await page.waitForTimeout(2000);

  // Select Dimension
  console.log('Selecting Dimension from dropdown...');
  const selectDim = page.locator('select[name^="super_attribute"]').first();
  if (await selectDim.isVisible({ timeout: 3000 }).catch(() => false)) {
    const options = await selectDim.locator('option').allInnerTexts();
    console.log('Dimension options:', options);
    // select the first valid option (index 1)
    await selectDim.selectOption({ index: 1 });
    await page.waitForTimeout(1500);
  }

  // Click Add to Cart while in MSRP mode
  console.log('Clicking ADD TO CART...');
  await page.locator('#product-addtocart-button').click();
  await page.waitForTimeout(5000);

  // Go to Cart
  console.log('Navigating to /checkout/cart/ ...');
  await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const cartData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.cart.item, tr.item-info')).map(r => {
      const name = r.querySelector('.product-item-name')?.innerText?.trim() || '';
      const unitPrice = r.querySelector('.col.price .price')?.innerText?.trim() || r.querySelector('.price')?.innerText?.trim() || '';
      const subtotal = r.querySelector('.col.subtotal .price')?.innerText?.trim() || '';
      return { name, unitPrice, subtotal };
    });
    const grandTotal = document.querySelector('.grand.totals .price, tr.grand .price')?.innerText?.trim() || '';
    const toggleInCart = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
    return { rows, grandTotal, toggleInCart };
  });

  console.log('\n============================================================');
  console.log('🛒 CART PRICING VERIFICATION UNDER MSRP VIEW:');
  console.log(JSON.stringify(cartData, null, 2));
  console.log('============================================================');

  await page.screenshot({ path: path.join(OUT_DIR, '08_CART_WITH_ITEM_ACTUAL_PRICING.png') });

  // 3. AU Baseline Check
  console.log('\nChecking AU Baseline Staging for Price Toggle...');
  await page.goto(`${AU_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const auEmail = page.locator('#email');
  if (await auEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await auEmail.fill('deepalilondhe576@gmail.com');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }

  await page.goto(`${AU_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const auStatus = await page.evaluate(() => {
    const toggle = document.querySelector('.price-toggle, [data-role="price-toggle"]');
    const utilityText = document.querySelector('.header__utility, .panel.header')?.innerText || '';
    return {
      hasToggle: !!toggle,
      utilityText: utilityText.replace(/\n+/g, ' | ')
    };
  });
  console.log('AU Baseline Price Toggle Status:', auStatus);
  await page.screenshot({ path: path.join(OUT_DIR, '11_AU_BASELINE_PLP.png') });

  fs.writeFileSync(
    path.resolve(__dirname, '../cart_invariance_and_au_baseline_results.json'),
    JSON.stringify({ cartData, auStatus, timestamp: new Date().toISOString() }, null, 2)
  );

  console.log('🎉 Cart Invariance & AU Baseline Finished!');
  await page.waitForTimeout(3000);
  await browser.close();
})();
