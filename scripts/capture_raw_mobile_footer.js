const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  await page.goto('https://mcstaging2.globewest.com', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);

  const footer = page.locator('footer.page-footer, .footer.content').first();
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Take 100% clean screenshot without any injected styles/borders
  const shot = await footer.screenshot();
  const outPath = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer_Live_Inspection/03_RAW_MOBILE_FOOTER.png';
  fs.writeFileSync(outPath, shot);
  console.log('Saved raw mobile footer!');
  await browser.close();
})();
