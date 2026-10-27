const { chromium } = require('../GlobeWest 2026/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Login first as Trade to see all pricing & stock
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');
  await page.waitForTimeout(3000);

  // Navigate to In Stock
  await page.goto('https://mcstaging2.globewest.com/in-stock', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const productLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.product-item-link, a.product.photo'));
    return Array.from(new Set(links.map(a => a.href))).slice(0, 5);
  });

  console.log('In-Stock Product Links:', productLinks);

  for (let i = 0; i < Math.min(productLinks.length, 3); i++) {
    const pUrl = productLinks[i];
    console.log(`\n--- Inspecting Product ${i + 1}: ${pUrl} ---`);
    await page.goto(pUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const pdpInfo = await page.evaluate(() => {
      return {
        title: document.querySelector('h1')?.innerText?.trim(),
        priceHtml: document.querySelector('.price-box, .product-info-price')?.innerText?.trim(),
        hasAddToCart: !!document.querySelector('#product-addtocart-button'),
        addToCartText: document.querySelector('#product-addtocart-button')?.innerText?.trim(),
        hasAddToQuote: !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('quote')),
        addToQuoteText: Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('quote'))?.innerText?.trim(),
        hasNotifyMe: !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('notify')),
        hasWarning: document.body.innerText.includes('Warning!') || document.body.innerText.includes('P65Warnings'),
        saveButton: !!Array.from(document.querySelectorAll('a, button, span')).find(el => el.innerText && el.innerText.trim() === 'SAVE'),
        stockStatus: document.querySelector('.stock.available, .availability, .inventory-status')?.innerText?.trim()
      };
    });

    console.log('Product Info:', JSON.stringify(pdpInfo, null, 2));
    await page.screenshot({ path: `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/pdp_audit_results/in_stock_product_${i + 1}.png`, fullPage: true });
  }

  await browser.close();
})();
