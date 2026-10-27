const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/pdp_audit_results';

async function auditMultiplePDPs() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const products = [
    {
      name: 'Pearce Marble Nightstand',
      url: 'https://mcstaging2.globewest.com/pearce-marble-2-drawer-bedside-matt-ocean-marble-bone-side-pearce-mar-2dr-matt-ocean-marble-bone'
    },
    {
      name: 'Arturo Accent Chair',
      url: 'https://mcstaging2.globewest.com/arturo-timber-leg-occasional-chair-paloma-chestnut-ch-arturo-tim-occ-paloma-chestnut'
    }
  ];

  // TRADE LOGIN
  const tradeContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const tradePage = await tradeContext.newPage();
  await tradePage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await tradePage.fill('#email', 'deepali.londhe@overdose.digital');
  await tradePage.fill('#pass', 'Deep@123');
  await tradePage.click('#send2');
  await tradePage.waitForTimeout(3000);

  for (let idx = 0; idx < products.length; idx++) {
    const prod = products[idx];
    console.log(`\n========================================`);
    console.log(`AUDITING PRODUCT ${idx + 1}: ${prod.name}`);
    console.log(`URL: ${prod.url}`);

    await tradePage.goto(prod.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await tradePage.waitForTimeout(3000);

    const audit = await tradePage.evaluate(() => {
      const getStyle = (sel) => {
        const el = document.querySelector(sel);
        return el ? window.getComputedStyle(el) : null;
      };

      return {
        title: document.title,
        h1: document.querySelector('h1')?.innerText?.trim(),
        sku: document.querySelector('.sku .value, [itemprop="sku"]')?.innerText?.trim() || document.querySelector('.product-info-stock-sku')?.innerText?.trim(),
        priceBoxText: document.querySelector('.price-box, .product-info-price')?.innerText?.trim(),
        msrpText: document.querySelector('.msrp-price, .old-price, .price-msrp')?.innerText?.trim(),
        tradePricingToggle: document.querySelector('.pricing-mode-toggle, .trade-pricing-switch')?.innerText?.trim(),
        stockEta: document.querySelector('.stock.available, .availability, .eta-status, .inventory-status')?.innerText?.trim(),
        saveButton: {
          present: !!Array.from(document.querySelectorAll('a, button, span')).find(el => el.innerText && el.innerText.trim() === 'SAVE'),
          text: Array.from(document.querySelectorAll('a, button, span')).find(el => el.innerText && el.innerText.trim() === 'SAVE')?.innerText?.trim()
        },
        addToCart: {
          present: !!document.querySelector('#product-addtocart-button'),
          text: document.querySelector('#product-addtocart-button')?.innerText?.trim()
        },
        addToQuote: {
          present: !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('add to quote')),
          text: Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('add to quote'))?.innerText?.trim()
        },
        warningSection: {
          present: document.body.innerText.includes('P65Warnings') || document.body.innerText.includes('Warning!')
        },
        alternativeProducts: {
          heading: document.querySelector('.block.related .block-title, .block.upsell .block-title')?.innerText?.trim(),
          items: Array.from(document.querySelectorAll('.block.related .product-item, .block.upsell .product-item')).map(item => ({
            name: item.querySelector('.product-item-name')?.innerText?.trim(),
            hasPrice: !!item.querySelector('.price-box'),
            price: item.querySelector('.price-box')?.innerText?.trim(),
            hasViewButton: !!item.querySelector('a.action, .tocart, .view'),
            viewButtonText: item.querySelector('a.action, .tocart, .view')?.innerText?.trim(),
            imgSrc: item.querySelector('img')?.src
          }))
        },
        specifications: {
          hasDimensionsImperial: document.body.innerText.includes('″') || document.body.innerText.includes('in'),
          hasDimensionsMetric: document.body.innerText.includes('mm') || document.body.innerText.includes('cm'),
          hasWeightImperial: document.body.innerText.includes('LBS') || document.body.innerText.includes('lbs'),
          hasWeightMetric: document.body.innerText.includes('KG') || document.body.innerText.includes('kg')
        },
        spellingLeaks: {
          colour: document.body.innerText.includes('COLOUR') || document.body.innerText.includes('Colour'),
          customisable: document.body.innerText.includes('Customisable'),
          customisation: document.body.innerText.includes('Customisation'),
          enquire: document.body.innerText.includes('Enquire'),
          kangarooBadge: document.body.innerText.includes('AUSTRALIAN OWNED')
        }
      };
    });

    console.log('AUDIT RESULT:', JSON.stringify(audit, null, 2));

    await tradePage.screenshot({
      path: `${OUT_DIR}/trade_pdp_${idx + 1}_${prod.name.replace(/\s+/g, '_')}.png`,
      fullPage: true
    });
  }

  await browser.close();
}

auditMultiplePDPs().catch(console.error);
