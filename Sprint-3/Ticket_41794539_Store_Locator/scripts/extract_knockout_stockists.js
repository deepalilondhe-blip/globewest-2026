const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_LOCATOR_URL = 'https://mcstaging2.globewest.com/locator';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  console.log('Fetching US Locator page...');
  await page.goto(US_LOCATOR_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(5000);

  // Inspect Knockout data & Stockist data
  const stockistData = await page.evaluate(() => {
    // Check knockout viewmodel
    let koViewModel = null;
    try {
      const koEl = document.querySelector('[data-bind*="scope: \'stockistLocator\'"], .locator-container, [data-role="stockist-locator"]');
      if (window.ko && koEl) {
        koViewModel = window.ko.dataFor(koEl);
      }
    } catch(e) {}

    // Check window variables or Magento customerData
    let stores = [];
    if (window.stockists) stores = window.stockists;
    if (window.stores) stores = window.stores;
    if (window.locatorData) stores = window.locatorData;

    // Check script tags containing json
    const scriptJson = Array.from(document.querySelectorAll('script[type="text/x-magento-init"]')).map(s => {
      try {
        return JSON.parse(s.innerText);
      } catch(e) {
        return s.innerText;
      }
    });

    // Check Google Maps markers info
    // Let's inspect window.google.maps
    return {
      scriptJson,
      hasKo: !!window.ko,
      sampleStores: stores
    };
  });

  console.log('Stockist Init Data:');
  console.log(JSON.stringify(stockistData, null, 2));

  // Let's inspect the Knockout context directly
  const deepKo = await page.evaluate(() => {
    const el = document.querySelector('.page-main') || document.body;
    const allElements = Array.from(document.querySelectorAll('*'));
    let foundVm = null;
    let foundStores = [];

    for (const elem of allElements) {
      if (window.ko && window.ko.dataFor(elem)) {
        const vm = window.ko.dataFor(elem);
        if (vm.stockists || vm.stores || vm.allStores || vm.items || vm.postCode) {
          foundVm = {
            keys: Object.keys(vm),
            hasStockists: !!vm.stockists,
            hasStores: !!vm.stores,
            hasAllStores: !!vm.allStores,
            hasItems: !!vm.items,
            stockistsCount: vm.stockists ? (typeof vm.stockists === 'function' ? vm.stockists().length : vm.stockists.length) : null,
            storesCount: vm.stores ? (typeof vm.stores === 'function' ? vm.stores().length : vm.stores.length) : null,
            allStoresCount: vm.allStores ? (typeof vm.allStores === 'function' ? vm.allStores().length : vm.allStores.length) : null,
            stockistsData: vm.stockists ? (typeof vm.stockists === 'function' ? vm.stockists() : vm.stockists) : null,
            allStoresData: vm.allStores ? (typeof vm.allStores === 'function' ? vm.allStores() : vm.allStores) : null
          };
          break;
        }
      }
    }
    return foundVm;
  });

  console.log('\nDeep Knockout View Model:');
  console.log(JSON.stringify(deepKo, null, 2));

  await browser.close();
})();
