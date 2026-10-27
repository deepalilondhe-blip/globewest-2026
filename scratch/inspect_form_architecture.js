const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
  
  const formArchitecture = await page.evaluate(() => {
    const forms = Array.from(document.querySelectorAll('form')).map(f => ({
      id: f.id,
      name: f.name,
      action: f.action,
      method: f.method,
      dataMageInit: f.getAttribute('data-mage-init'),
      dataBind: f.getAttribute('data-bind')
    }));

    const scripts = Array.from(document.querySelectorAll('script[type="text/x-magento-init"]')).map(s => {
      try {
        return JSON.parse(s.textContent);
      } catch(e) {
        return s.textContent.substring(0, 100);
      }
    });

    
    return { forms, scripts };
  });

  console.log('Form Architecture:', JSON.stringify(formArchitecture.forms, null, 2));
  console.log('Magento Init Scripts Count:', formArchitecture.scripts.length);
  const relevantScripts = formArchitecture.scripts.filter(s => JSON.stringify(s).includes('trade') || JSON.stringify(s).includes('gwcustomer') || JSON.stringify(s).includes('abn') || JSON.stringify(s).includes('ein'));
  console.log('Relevant Trade Scripts:', JSON.stringify(relevantScripts, null, 2));

  await browser.close();
})();
