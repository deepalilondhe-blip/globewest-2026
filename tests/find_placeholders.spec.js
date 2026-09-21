// @ts-check
const { test } = require('@playwright/test');

test('find placeholders and inspect PDP', async ({ page }) => {
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-item')).map(card => {
      const img = card.querySelector('img');
      const title = card.querySelector('.product-item-name, .product-item-link');
      return {
        title: title ? title.textContent.trim() : '',
        imgSrc: img ? img.src : '',
        imgAlt: img ? img.alt : ''
      };
    });
  });
  console.log('--- PLP CARDS ---');
  console.log(JSON.stringify(data.slice(0, 5), null, 2));

  // Let's also check a PDP
  await page.goto('https://mcstaging2.globewest.com/henley-side-table', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const pdpData = await page.evaluate(() => {
    const mainImg = document.querySelector('.gallery-placeholder__image, .fotorama__img, .product.media img');
    return {
      title: document.querySelector('.page-title')?.textContent?.trim(),
      imgSrc: mainImg ? mainImg.src : ''
    };
  });
  console.log('--- PDP DATA ---');
  console.log(JSON.stringify(pdpData, null, 2));
});
