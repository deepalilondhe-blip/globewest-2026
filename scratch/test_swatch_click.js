const { chromium } = require('../GlobeWest 2026/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Trade Login
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');
  await page.waitForTimeout(3000);

  // Navigate to Leon Side Table
  await page.goto('https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Check initial state
  console.log('--- Initial State ---');
  let price = await page.evaluate(() => document.querySelector('.price-box, .product-info-price')?.innerText?.trim());
  console.log('Initial Price:', price);

  // Find swatches and click each
  const swatches = await page.locator('.swatch-option');
  const count = await swatches.count();
  console.log('Found swatches:', count);

  for (let i = 0; i < count; i++) {
    const sw = swatches.nth(i);
    const label = await sw.getAttribute('aria-label') || await sw.innerText();
    console.log(`Clicking swatch ${i}: ${label}`);
    await sw.click({ force: true });
    await page.waitForTimeout(1500);

    const afterClick = await page.evaluate(() => {
      return {
        price: document.querySelector('.price-box, .product-info-price')?.innerText?.trim(),
        cartBtn: document.querySelector('#product-addtocart-button')?.innerText?.trim(),
        cartBtnVisible: !!document.querySelector('#product-addtocart-button')?.offsetParent,
        stockStatus: document.querySelector('.stock.available, .availability, .inventory-status, .eta-status')?.innerText?.trim()
      };
    });
    console.log('State after click:', afterClick);
  }

  await page.screenshot({ path: '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/pdp_audit_results/after_swatch_click.png', fullPage: true });

  await browser.close();
})();
