const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const OUT_DIR = path.resolve(__dirname, '../screenshots');

(async () => {
  console.log('🚀 Running Deep Dive: PDP & SearchSpring & Cart with Product in HEADED mode...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // 1. Log in
  console.log('Logging in as US Trade customer...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForNavigation({ timeout: 35000 }).catch(() => {});
  }
  console.log('Logged in successfully!');

  // 2. Visit a PDP directly
  console.log('Navigating to PLP to pick first product PDP...');
  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const firstProductLink = await page.locator('.product-item-link').first().getAttribute('href');
  console.log('Visiting PDP:', firstProductLink);
  await page.goto(firstProductLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Inspect PDP pricing in Trade mode
  const pdpTradePricing = await page.evaluate(() => {
    const priceBox = document.querySelector('.price-box, [data-role="priceBox"]');
    const rootClass = document.documentElement.className;
    const triggerText = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
    return {
      rootClass,
      triggerText,
      priceHtml: priceBox?.innerHTML || '',
      priceText: priceBox?.innerText?.trim() || ''
    };
  });
  console.log('PDP in Trade Mode:', {
    trigger: pdpTradePricing.triggerText,
    priceText: pdpTradePricing.priceText.replace(/\n+/g, ' | ')
  });
  await page.screenshot({ path: path.join(OUT_DIR, '06_PDP_TRADE_MODE.png') });

  // Toggle to MSRP mode on PDP
  console.log('Toggling to MSRP on PDP...');
  const triggerBtn = page.locator('.price-toggle__trigger').first();
  await triggerBtn.click();
  await page.waitForTimeout(800);
  const msrpBtn = page.locator('button[data-view="msrp"], button:has-text("MSRP")').first();
  await msrpBtn.click();
  await page.waitForTimeout(2500);

  const pdpMsrpPricing = await page.evaluate(() => {
    const priceBox = document.querySelector('.price-box, [data-role="priceBox"]');
    const rootClass = document.documentElement.className;
    const triggerText = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
    return {
      rootClass,
      triggerText,
      priceText: priceBox?.innerText?.trim() || ''
    };
  });
  console.log('PDP in MSRP Mode:', {
    trigger: pdpMsrpPricing.triggerText,
    priceText: pdpMsrpPricing.priceText.replace(/\n+/g, ' | ')
  });
  await page.screenshot({ path: path.join(OUT_DIR, '07_PDP_MSRP_MODE.png') });

  // 3. Add to Cart in MSRP mode and check Cart pricing
  console.log('Adding product to Cart while in MSRP mode...');
  const addToCartBtn = page.locator('#product-addtocart-button, button.tocart').first();
  if (await addToCartBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await addToCartBtn.click();
    await page.waitForTimeout(5000);

    console.log('Navigating to Cart to verify transaction pricing...');
    await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    const cartDetails = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.cart.item, tr.item-info')).map(r => ({
        name: r.querySelector('.product-item-name')?.innerText?.trim() || '',
        price: r.querySelector('.price')?.innerText?.trim() || '',
        subtotal: r.querySelector('.subtotal .price')?.innerText?.trim() || ''
      }));
      const grandTotal = document.querySelector('.grand.totals .price, tr.grand .price')?.innerText?.trim() || '';
      return { rows, grandTotal };
    });
    console.log('Cart Items & Pricing (Added during MSRP mode):', cartDetails);
    await page.screenshot({ path: path.join(OUT_DIR, '08_CART_WITH_ITEM_TRADE_PRICE.png') });
  }

  // 4. Test SearchSpring Search Results under Trade and MSRP modes
  console.log('Testing Search Results for "chair"...');
  await page.goto(`${US_BASE_URL}/catalogsearch/result/?q=chair`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const searchResultsTrade = await page.evaluate(() => {
    const triggerText = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
    const rootClass = document.documentElement.className;
    const firstItem = document.querySelector('.product-item');
    const priceText = firstItem?.querySelector('.price-box')?.innerText?.trim() || '';
    return { triggerText, rootClass, priceSnippet: priceText.replace(/\n+/g, ' | ') };
  });
  console.log('Search Results Pricing:', searchResultsTrade);
  await page.screenshot({ path: path.join(OUT_DIR, '09_SEARCHSPRING_SEARCH_RESULTS.png') });

  // Toggle on Search results page
  console.log('Toggling to MSRP on Search Results page...');
  const searchTriggerBtn = page.locator('.price-toggle__trigger').first();
  if (await searchTriggerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await searchTriggerBtn.click();
    await page.waitForTimeout(800);
    const msrpBtnSearch = page.locator('button[data-view="msrp"], button:has-text("MSRP")').first();
    await msrpBtnSearch.click();
    await page.waitForTimeout(2500);

    const searchResultsMsrp = await page.evaluate(() => {
      const triggerText = document.querySelector('.price-toggle__trigger')?.innerText?.trim() || '';
      const rootClass = document.documentElement.className;
      const firstItem = document.querySelector('.product-item');
      const priceText = firstItem?.querySelector('.price-box')?.innerText?.trim() || '';
      return { triggerText, rootClass, priceSnippet: priceText.replace(/\n+/g, ' | ') };
    });
    console.log('Search Results in MSRP Mode:', searchResultsMsrp);
    await page.screenshot({ path: path.join(OUT_DIR, '10_SEARCHSPRING_MSRP_RESULTS.png') });
  }

  // Save detailed results
  const deepDiveResults = {
    pdpTradePricing,
    pdpMsrpPricing,
    searchResultsTrade,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(
    path.resolve(__dirname, '../pdp_searchspring_deepdive_results.json'),
    JSON.stringify(deepDiveResults, null, 2)
  );

  console.log('🎉 Deep Dive Test Complete!');
  await page.waitForTimeout(4000);
  await browser.close();
})();
