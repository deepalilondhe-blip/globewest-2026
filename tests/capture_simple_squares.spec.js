// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', '..', 'Enable Public Browsing Mode');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

test('Capture 3 simple square highlighted defect screenshots', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 900 });

  // =========================================================================
  // DEFECT 1: SearchSpring Search Returns 0 Results
  // =========================================================================
  console.log('Capturing Defect 1...');
  await page.goto('https://mcstaging2.globewest.com/catalogsearch/result/?q=chair', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Simple red square/rectangle around the empty search results area
  await page.evaluate(() => {
    // Clear any previous outlines
    document.querySelectorAll('*').forEach(el => {
      // @ts-ignore
      if (el.style) el.style.outline = '';
    });

    const box = document.createElement('div');
    box.id = 'defect-highlight-box-1';
    box.style.position = 'absolute';
    box.style.top = '140px';
    box.style.left = '40px';
    box.style.width = '1360px';
    box.style.height = '380px';
    box.style.border = '4px solid #FF0000';
    box.style.borderRadius = '2px';
    box.style.pointerEvents = 'none';
    box.style.zIndex = '999999';
    box.style.boxSizing = 'border-box';
    document.body.appendChild(box);
  });

  const file1 = path.join(OUT_DIR, 'DEFECT_1_SEARCHSPRING_0_RESULTS.png');
  await page.screenshot({ path: file1 });
  console.log('Defect 1 captured.');

  // =========================================================================
  // DEFECT 2: Missing Trade Login Guidance on PDP
  // =========================================================================
  console.log('Capturing Defect 2...');
  await page.goto('https://mcstaging2.globewest.com/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Simple red square/rectangle around the missing price/login action area
  await page.evaluate(() => {
    const sku = document.querySelector('.product.attribute.sku, [itemprop="sku"]');
    const box = document.createElement('div');
    box.id = 'defect-highlight-box-2';
    box.style.position = 'absolute';

    if (sku) {
      const rect = sku.getBoundingClientRect();
      box.style.top = (rect.bottom + window.scrollY + 12) + 'px';
      box.style.left = (rect.left + window.scrollX) + 'px';
      box.style.width = '420px';
      box.style.height = '75px';
    } else {
      box.style.top = '380px';
      box.style.right = '60px';
      box.style.width = '420px';
      box.style.height = '80px';
    }
    box.style.border = '4px solid #FF0000';
    box.style.borderRadius = '2px';
    box.style.pointerEvents = 'none';
    box.style.zIndex = '999999';
    box.style.boxSizing = 'border-box';
    document.body.appendChild(box);
  });

  const file2 = path.join(OUT_DIR, 'DEFECT_2_MISSING_TRADE_LOGIN_GUIDANCE_PDP.png');
  await page.screenshot({ path: file2 });
  console.log('Defect 2 captured.');

  // =========================================================================
  // DEFECT 3: Product Cards Display "GW Coming Soon" Placeholders
  // =========================================================================
  console.log('Capturing Defect 3...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Scroll down slightly so product cards are in full view
  await page.evaluate(() => {
    window.scrollBy(0, 360);
  });
  await page.waitForTimeout(800);

  // Simple square highlight around the placeholder images
  await page.evaluate(() => {
    const photos = document.querySelectorAll('.product-item-photo, .product-image-container');
    if (photos.length >= 2) {
      // Photo 1 square highlight
      const r1 = photos[0].getBoundingClientRect();
      const b1 = document.createElement('div');
      b1.style.position = 'absolute';
      b1.style.top = (r1.top + window.scrollY) + 'px';
      b1.style.left = (r1.left + window.scrollX) + 'px';
      b1.style.width = r1.width + 'px';
      b1.style.height = r1.height + 'px';
      b1.style.border = '4px solid #FF0000';
      b1.style.borderRadius = '2px';
      b1.style.pointerEvents = 'none';
      b1.style.zIndex = '999999';
      b1.style.boxSizing = 'border-box';
      document.body.appendChild(b1);

      // Photo 2 square highlight
      const r2 = photos[1].getBoundingClientRect();
      const b2 = document.createElement('div');
      b2.style.position = 'absolute';
      b2.style.top = (r2.top + window.scrollY) + 'px';
      b2.style.left = (r2.left + window.scrollX) + 'px';
      b2.style.width = r2.width + 'px';
      b2.style.height = r2.height + 'px';
      b2.style.border = '4px solid #FF0000';
      b2.style.borderRadius = '2px';
      b2.style.pointerEvents = 'none';
      b2.style.zIndex = '999999';
      b2.style.boxSizing = 'border-box';
      document.body.appendChild(b2);
    }
  });

  const file3 = path.join(OUT_DIR, 'DEFECT_3_PRODUCT_CARDS_PLACEHOLDER_IMAGES.png');
  await page.screenshot({ path: file3 });
  console.log('Defect 3 captured.');
});
