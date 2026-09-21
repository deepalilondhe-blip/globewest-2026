// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT_DIR_1 = path.join(__dirname, '..', '..', 'Enable Public Browsing Mode');
const OUT_DIR_2 = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'real_proofs');

if (!fs.existsSync(OUT_DIR_1)) fs.mkdirSync(OUT_DIR_1, { recursive: true });
if (!fs.existsSync(OUT_DIR_2)) fs.mkdirSync(OUT_DIR_2, { recursive: true });

test('Capture 3 Defect Screenshots with Simple Red Highlight Only', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 900 });

  // ---------------------------------------------------------------------------
  // DEFECT 1: SearchSpring Search Returns No Results (/catalogsearch/result/?q=chair)
  // ---------------------------------------------------------------------------
  console.log('Capturing Defect 1: SearchSpring 0 Results...');
  await page.goto('https://mcstaging2.globewest.com/catalogsearch/result/?q=chair', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);

  // Clean red border outlining the empty search results area
  await page.evaluate(() => {
    const main = document.querySelector('main#maincontent, .columns, #searchspring-content') || document.querySelector('.main');
    if (main) {
      // @ts-ignore
      main.style.outline = '4px solid #EF4444';
      // @ts-ignore
      main.style.outlineOffset = '-4px';
    }
  });

  const file1_1 = path.join(OUT_DIR_1, 'DEFECT_1_SEARCHSPRING_0_RESULTS.png');
  const file1_2 = path.join(OUT_DIR_2, 'DEFECT_1_SEARCHSPRING_0_RESULTS.png');
  await page.screenshot({ path: file1_1 });
  fs.copyFileSync(file1_1, file1_2);
  console.log('Saved Defect 1.');

  // ---------------------------------------------------------------------------
  // DEFECT 2: Missing Trade Login Guidance on PDP
  // ---------------------------------------------------------------------------
  console.log('Capturing Defect 2: Missing Trade Login Guidance on PDP...');
  await page.goto('https://mcstaging2.globewest.com/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);

  // Red outline highlighting the missing price & trade login area
  await page.evaluate(() => {
    // Target the price/actions area under the SKU
    const skuElem = document.querySelector('.product.attribute.sku, [itemprop="sku"]');
    const colorElem = document.querySelector('.swatch-opt, .product-options-wrapper, [class*="colour"]');
    
    // Create an exact red outline box over the empty action area
    const box = document.createElement('div');
    box.style.position = 'absolute';
    if (skuElem) {
      const rect = skuElem.getBoundingClientRect();
      box.style.top = (rect.bottom + window.scrollY + 10) + 'px';
      box.style.left = (rect.left + window.scrollX) + 'px';
      box.style.width = '420px';
      box.style.height = '70px';
    } else {
      box.style.top = '360px';
      box.style.right = '80px';
      box.style.width = '420px';
      box.style.height = '80px';
    }
    box.style.border = '4px solid #EF4444';
    box.style.borderRadius = '4px';
    box.style.pointerEvents = 'none';
    box.style.zIndex = '999999';
    document.body.appendChild(box);
  });

  const file2_1 = path.join(OUT_DIR_1, 'DEFECT_2_MISSING_TRADE_LOGIN_GUIDANCE_PDP.png');
  const file2_2 = path.join(OUT_DIR_2, 'DEFECT_2_MISSING_TRADE_LOGIN_GUIDANCE_PDP.png');
  await page.screenshot({ path: file2_1 });
  fs.copyFileSync(file2_1, file2_2);
  console.log('Saved Defect 2.');

  // ---------------------------------------------------------------------------
  // DEFECT 3: Product Cards Display "GW Coming Soon" Placeholders
  // ---------------------------------------------------------------------------
  console.log('Capturing Defect 3: Product Cards Display Coming Soon Placeholders...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3500);

  // Scroll down slightly so the product cards are centered and visible in full
  await page.evaluate(() => {
    window.scrollBy(0, 360);
  });
  await page.waitForTimeout(1000);

  // Simple red border around the product card showing placeholder image
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.product-item');
    if (cards.length > 0) {
      // @ts-ignore
      cards[0].style.outline = '4px solid #EF4444';
      // @ts-ignore
      cards[0].style.outlineOffset = '4px';
      if (cards[1]) {
        // @ts-ignore
        cards[1].style.outline = '4px solid #EF4444';
        // @ts-ignore
        cards[1].style.outlineOffset = '4px';
      }
    }
  });

  const file3_1 = path.join(OUT_DIR_1, 'DEFECT_3_PRODUCT_CARDS_PLACEHOLDER_IMAGES.png');
  const file3_2 = path.join(OUT_DIR_2, 'DEFECT_3_PRODUCT_CARDS_PLACEHOLDER_IMAGES.png');
  await page.screenshot({ path: file3_1 });
  fs.copyFileSync(file3_1, file3_2);
  console.log('Saved Defect 3.');
});
