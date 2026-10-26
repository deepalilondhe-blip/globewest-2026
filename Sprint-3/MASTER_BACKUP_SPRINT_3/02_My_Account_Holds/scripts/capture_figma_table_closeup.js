const { chromium } = require('playwright');
const path = require('path');

const COMP_DIR = path.resolve(__dirname, '../comparison');

(async () => {
  console.log('Opening Figma to capture razor-sharp table headers closeup...');
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

  // Now zoom in 3 times so the table is huge and crisp
  await page.keyboard.press('+');
  await page.keyboard.press('+');
  await page.keyboard.press('+');
  await page.waitForTimeout(2000);

  // Pan down slightly to place the table header right in view
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(2000);

  // Screenshot the viewport showing the crisp Figma table
  await page.screenshot({ path: path.join(COMP_DIR, 'figma_table_zoomed_viewport.png') });
  console.log('Saved figma_table_zoomed_viewport.png');

  await context.close();
})();
