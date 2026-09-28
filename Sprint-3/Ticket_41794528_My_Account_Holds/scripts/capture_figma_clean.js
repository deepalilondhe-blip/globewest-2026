const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_DIR = path.resolve(__dirname, '../figma');
fs.mkdirSync(FIGMA_DIR, { recursive: true });

(async () => {
  console.log('Opening Figma with persistent profile...');
  const context = await chromium.launchPersistentContext('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile', {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64185&t=UHKXdUurQ7e08vqM-0', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('canvas', { timeout: 60000 });
  await page.waitForTimeout(6000);

  // Search for desktop/my_account/03_my_Holds
  console.log('Focusing desktop/my_account/03_my_Holds...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('desktop/my_account/03_my_Holds');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape'); // close search
  await page.waitForTimeout(500);
  await page.keyboard.press('Shift+2'); // Zoom to selection
  await page.waitForTimeout(3000);

  // Capture desktop artboard
  await page.screenshot({ path: path.join(FIGMA_DIR, '01_FIGMA_DESKTOP_HOLDS_ARTBOARD.png') });
  console.log('Saved 01_FIGMA_DESKTOP_HOLDS_ARTBOARD.png');

  // Search for mobile/my_account/03_my_holds
  console.log('Focusing mobile/my_account/03_my_holds...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('mobile/my_account/03_my_holds');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(3000);

  // Capture mobile artboard
  await page.screenshot({ path: path.join(FIGMA_DIR, '02_FIGMA_MOBILE_HOLDS_ARTBOARD.png') });
  console.log('Saved 02_FIGMA_MOBILE_HOLDS_ARTBOARD.png');

  await context.close();
  console.log('Figma capture completed cleanly!');
})();
