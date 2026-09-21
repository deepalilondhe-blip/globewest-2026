// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'evidence');

test('Capture AU search and specific defect crops', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Capture AU Search Results for chair
  console.log('Capturing AU Search results...');
  await page.goto('https://mcstaging2.globewest.com.au/catalogsearch/result/?q=chair', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '03_AU_SEARCH_RESULTS.png') });

  // 2. Capture US Category Banner crop
  console.log('Capturing US Category Banner...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const usBanner = page.locator('.category-top-view, .page-title-wrapper').first();
  if (await usBanner.isVisible()) {
    await usBanner.screenshot({ path: path.join(EVIDENCE_DIR, 'US_BANNER_CROP.png') });
  }

  // 3. Capture AU Category Banner crop
  console.log('Capturing AU Category Banner...');
  await page.goto('https://mcstaging2.globewest.com.au/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const auBanner = page.locator('.category-top-view, .page-title-wrapper').first();
  if (await auBanner.isVisible()) {
    await auBanner.screenshot({ path: path.join(EVIDENCE_DIR, 'AU_BANNER_CROP.png') });
  }

  console.log('Done capturing defect crops!');
});
