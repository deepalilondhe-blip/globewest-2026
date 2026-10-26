const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('1. Logging in as US Trade Customer...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  
  const email = page.locator('#email');
  if (await email.isVisible({ timeout: 5000 }).catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
  }

  // Check pages with active FAQ blocks (e.g. Orders, Holds, Dashboard)
  const testPages = [
    'https://mcstaging2.globewest.com/customer/account/',
    'https://mcstaging2.globewest.com/gw_orders/order/index/',
    'https://mcstaging2.globewest.com/gw_orders/hold/index/',
    'https://mcstaging2.globewest.com/gw_quotes/quote/index/'
  ];

  for (const url of testPages) {
    console.log(`\nNavigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const faqInfo = await page.evaluate(() => {
      // Look for FAQ containers
      const containers = Array.from(document.querySelectorAll('[data-content-type="faq"], .frequently-asked-questions, [class*="faq"], [class*="accordion"]'));
      
      const details = containers.map(c => {
        const items = Array.from(c.querySelectorAll('li[data-content-type="faq-item"], .faq-item, .accordion-item, [data-role="collapsible"], .item'));
        return {
          className: c.className,
          dataType: c.getAttribute('data-content-type'),
          itemCount: items.length,
          itemTitles: items.slice(0, 10).map(it => it.innerText.split('\n')[0].trim())
        };
      }).filter(d => d.itemCount > 0);

      return details;
    });

    console.log(`Found FAQ sections:`, JSON.stringify(faqInfo, null, 2));
  }

  await browser.close();
})();
