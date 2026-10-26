const { chromium } = require('playwright');
const path = require('path');

const COMP_DIR = path.resolve(__dirname, '../comparison');

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
  await page.waitForTimeout(6000);

  // Search for desktop/my_account/03_my_Holds
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('desktop/my_account/03_my_Holds');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.keyboard.press('Shift+2'); // Zoom to artboard
  await page.waitForTimeout(2000);

  // Zoom in 2 times
  await page.keyboard.press('+');
  await page.keyboard.press('+');
  await page.waitForTimeout(1500);

  // Pan up towards top of artboard (ArrowUp)
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('ArrowUp');
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(COMP_DIR, 'figma_table_crisp_view.png') });
  console.log('Saved figma_table_crisp_view.png');

  await context.close();
})();
