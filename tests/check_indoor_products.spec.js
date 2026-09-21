// @ts-check
const { test } = require('@playwright/test');

test('inspect products on indoor', async ({ page }) => {
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const products = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.product-item')).slice(0, 3).map(card => {
      const link = card.querySelector('.product-item-link, a.product-item-photo');
      const img = card.querySelector('img');
      return {
        href: link ? link.href : '',
        img: img ? img.src : '',
        alt: img ? img.alt : ''
      };
    });
  });
  console.log('Products:', JSON.stringify(products, null, 2));
});
