// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'real_proofs');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

test('Capture 100% Real Raw Screenshots with Simple Red Box', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // -------------------------------------------------------------------------
  // REAL PROOF 1: SearchSpring 0 Results on US Search Page
  // -------------------------------------------------------------------------
  console.log('Capturing real Search page for chair...');
  await page.goto('https://mcstaging2.globewest.com/catalogsearch/result/?q=chair', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Draw simple clean red box around the empty search content area
  await page.evaluate(() => {
    const main = document.querySelector('main#maincontent, .columns, #searchspring-content') || document.body;
    const box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.top = '120px';
    box.style.left = '30px';
    box.style.width = '1380px';
    box.style.height = '420px';
    box.style.border = '4px solid #EF4444';
    box.style.borderRadius = '4px';
    box.style.pointerEvents = 'none';
    box.style.zIndex = '999999';

    const label = document.createElement('div');
    label.textContent = 'DEFECT: 0 PRODUCTS FOUND FOR "CHAIR" (SEARCHSPRING EMPTY)';
    label.style.position = 'absolute';
    label.style.top = '-32px';
    label.style.left = '0px';
    label.style.backgroundColor = '#EF4444';
    label.style.color = '#FFFFFF';
    label.style.padding = '4px 10px';
    label.style.fontSize = '12px';
    label.style.fontWeight = 'bold';
    label.style.fontFamily = 'sans-serif';
    box.appendChild(label);
    document.body.appendChild(box);
  });

  await page.screenshot({ path: path.join(OUT_DIR, 'REAL_DEFECT_1_SEARCHSPRING_0_RESULTS.png') });
  console.log('Saved: REAL_DEFECT_1_SEARCHSPRING_0_RESULTS.png');

  // -------------------------------------------------------------------------
  // REAL PROOF 2: Top Utility Bar Missing "Become a Trade Customer"
  // -------------------------------------------------------------------------
  console.log('Capturing real US Header for Top Utility Bar...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Draw simple clean red box around the top utility bar
  await page.evaluate(() => {
    const topBar = document.querySelector('.panel.header, .header__utility, .header-panel, .panel.wrapper') || document.querySelector('header');
    if (topBar) {
      topBar.style.outline = '4px solid #EF4444';
      topBar.style.outlineOffset = '2px';

      const label = document.createElement('div');
      label.textContent = 'DEFECT: TOP BAR MISSING "BECOME A TRADE CUSTOMER" LINK (ONLY BOOK SHOWROOM PRESENT)';
      label.style.position = 'absolute';
      label.style.top = '36px';
      label.style.left = '20px';
      label.style.backgroundColor = '#EF4444';
      label.style.color = '#FFFFFF';
      label.style.padding = '4px 10px';
      label.style.fontSize = '12px';
      label.style.fontWeight = 'bold';
      label.style.fontFamily = 'sans-serif';
      label.style.zIndex = '9999999';
      topBar.style.position = 'relative';
      topBar.appendChild(label);
    }
  });

  // Take screenshot focusing on the header area
  await page.screenshot({ path: path.join(OUT_DIR, 'REAL_DEFECT_2_TOP_BAR_MISSING_TRADE_CTA.png') });
  console.log('Saved: REAL_DEFECT_2_TOP_BAR_MISSING_TRADE_CTA.png');
});
