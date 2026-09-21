// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', '..', 'Enable Public Browsing Mode');
const ARTIFACT_DIR = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c';

test('Capture pixel-perfect simple square defect 3 screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to US indoor PLP...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Scroll down so the product cards are in prime viewport focus
  await page.evaluate(() => {
    window.scrollBy(0, 360);
  });
  await page.waitForTimeout(1000);

  // Outline ONLY the exact square photo displaying "GW Coming Soon"
  await page.evaluate(() => {
    const firstImg = document.querySelector('.product-item .product-image-photo') || document.querySelector('.product-item img');
    if (firstImg) {
      const rect = firstImg.getBoundingClientRect();
      const box = document.createElement('div');
      box.id = 'defect3-clean-square';
      box.style.position = 'absolute';
      box.style.top = (rect.top + window.scrollY) + 'px';
      box.style.left = (rect.left + window.scrollX) + 'px';
      box.style.width = rect.width + 'px';
      box.style.height = rect.height + 'px';
      box.style.border = '4px solid #FF0000';
      box.style.borderRadius = '2px';
      box.style.pointerEvents = 'none';
      box.style.zIndex = '999999';
      box.style.boxSizing = 'border-box';
      document.body.appendChild(box);
    }
  });

  const file1 = path.join(OUT_DIR, 'DEFECT_3_PRODUCT_CARDS_PLACEHOLDER_IMAGES.png');
  const file2 = path.join(ARTIFACT_DIR, 'DEFECT_3_PRODUCT_CARDS_PLACEHOLDER_IMAGES.png');

  await page.screenshot({ path: file1 });
  fs.copyFileSync(file1, file2);
  console.log('Saved pixel-perfect Defect 3 screenshot!');
});
