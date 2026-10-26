const { chromium } = require('playwright');
const path = require('path');
const OUT_DIR = 'Sprint-3/Ticket_41794528_My_Account_Holds/figma';

(async () => {
  const context = await chromium.launchPersistentContext('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile', {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64185&t=UHKXdUurQ7e08vqM-0', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('canvas', { timeout: 60000 });
  await page.waitForTimeout(8000);

  // Search for 'desktop/my_account/03_my_Holds'
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('desktop/my_account/03_my_Holds');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Shift+2'); // Zoom to selection
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT_DIR, '09_FIGMA_DESKTOP_HOLDS_ARTBOARD.png') });

  // Zoom to table specifically
  await page.keyboard.press('+');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '10_FIGMA_DESKTOP_TABLE_CLOSEUP.png') });

  // Search for mobile holds artboard
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('mobile/my_account/03_my_holds');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(OUT_DIR, '11_FIGMA_MOBILE_HOLDS_ARTBOARD.png') });

  await context.close();
  console.log('Saved desktop and mobile holds artboards from Figma!');
})();
