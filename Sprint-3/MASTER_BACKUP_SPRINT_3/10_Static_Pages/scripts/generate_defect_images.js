const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const DEFECT_DIR = path.join(BASE_DIR, 'DEFECT_SCREENSHOTS');
fs.mkdirSync(DEFECT_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Capturing Defect Proofs...');

  // 1. Help Centre: Empty title & broken banner
  await page.goto('https://mcstaging2.globewest.com/help-centre', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Highlight broken banner or missing title
  await page.screenshot({
    path: path.join(DEFECT_DIR, 'DEFECT_1_US_Help_Centre_Empty_Title_and_Banner.png'),
    clip: { x: 0, y: 0, width: 1440, height: 800 }
  });

  // 2. Contact Us: AU Showrooms & Emails
  await page.goto('https://mcstaging2.globewest.com/contact-us', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(DEFECT_DIR, 'DEFECT_2_US_Contact_Us_AU_Showrooms_Leakage.png'),
    clip: { x: 0, y: 300, width: 1440, height: 850 }
  });

  // 3. Terms & Conditions: AU ACN & Victoria reference
  await page.goto('https://mcstaging2.globewest.com/terms-and-conditions-page', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  // Expand section 1 if needed
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('button, a, div')).find(e => e.innerText && e.innerText.includes('1. Introduction'));
    if (el) el.click();
  });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(DEFECT_DIR, 'DEFECT_3_US_Terms_AU_Company_Entity_ACN_Leakage.png'),
    clip: { x: 0, y: 150, width: 1440, height: 800 }
  });

  // 4. 404 Page: [US] Staging Prefix in title
  await page.goto('https://mcstaging2.globewest.com/non-existent-page-404-test', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: path.join(DEFECT_DIR, 'DEFECT_4_US_404_Page_Staging_Title_Prefix.png'),
    clip: { x: 0, y: 0, width: 1440, height: 600 }
  });

  await browser.close();
  console.log('Saved raw defect captures!');
})();
