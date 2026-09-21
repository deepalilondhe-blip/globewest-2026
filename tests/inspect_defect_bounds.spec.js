// @ts-check
const { test } = require('@playwright/test');

test('inspect element bounds for all 3 defects', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Search page
  await page.goto('https://mcstaging2.globewest.com/catalogsearch/result/?q=chair', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const searchInfo = await page.evaluate(() => {
    const main = document.querySelector('main#maincontent') || document.querySelector('.columns');
    const rect = main ? main.getBoundingClientRect() : null;
    return {
      mainExists: !!main,
      rect: rect ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height } : null
    };
  });
  console.log('Search Info:', searchInfo);

  // 2. PDP
  await page.goto('https://mcstaging2.globewest.com/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const pdpInfo = await page.evaluate(() => {
    const mainInfo = document.querySelector('.product-info-main');
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const title = document.querySelector('.page-title-wrapper');
    const sku = document.querySelector('.product.attribute.sku, [itemprop="sku"]');
    return {
      mainInfoExists: !!mainInfo,
      priceBoxExists: !!priceBox,
      priceBoxRect: priceBox ? priceBox.getBoundingClientRect() : null,
      titleRect: title ? title.getBoundingClientRect() : null,
      skuRect: sku ? sku.getBoundingClientRect() : null
    };
  });
  console.log('PDP Info:', pdpInfo);

  // 3. PLP
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const plpInfo = await page.evaluate(() => {
    const firstCard = document.querySelector('.product-item');
    const photo = firstCard ? firstCard.querySelector('.product-item-photo') : null;
    const img = firstCard ? firstCard.querySelector('img') : null;
    return {
      firstCardRect: firstCard ? firstCard.getBoundingClientRect() : null,
      photoRect: photo ? photo.getBoundingClientRect() : null,
      imgSrc: img ? img.src : ''
    };
  });
  console.log('PLP Info:', plpInfo);
});
