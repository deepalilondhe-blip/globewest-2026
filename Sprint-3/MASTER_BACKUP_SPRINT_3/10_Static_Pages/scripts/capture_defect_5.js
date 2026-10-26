const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const DEFECT_DIR = path.join(BASE_DIR, 'DEFECT_SCREENSHOTS');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  // 1. Capture US Staging Contact Us Subheading ("We’d love to help you test")
  const usPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await usPage.goto('https://mcstaging2.globewest.com/contact-us', { waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(2000);
  
  // Find heading element rect
  const usHeading = await usPage.locator('h3:has-text("We’d love to help you")').first();
  await usHeading.scrollIntoViewIfNeeded();
  await usPage.waitForTimeout(500);

  await usPage.screenshot({
    path: path.join(DEFECT_DIR, 'DEFECT_5_US_Contact_Us_Staging_Test_Copy.png'),
    clip: { x: 100, y: 120, width: 800, height: 260 }
  });

  // 2. Capture Live AU Contact Us Subheading ("We’d love to help you")
  const auPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await auPage.goto('https://www.globewest.com.au/contact', { waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(2000);

  const auHeading = await auPage.locator('h3:has-text("We’d love to help you")').first();
  await auHeading.scrollIntoViewIfNeeded();
  await auPage.waitForTimeout(500);

  await auPage.screenshot({
    path: path.join(DEFECT_DIR, 'AU_Contact_Us_Clean_Copy.png'),
    clip: { x: 100, y: 120, width: 800, height: 260 }
  });

  await browser.close();
  console.log('Saved Defect 5 raw captures!');
})();
