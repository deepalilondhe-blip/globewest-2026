const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_EXACT_PDP_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2424-21417&p=f&t=7H6mtO9jrDjRty3L-0';
const PROFILE_DIR = path.join(__dirname, '../../GlobeWest 2026/.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../screenshots/figma_deep_inspect');

(async () => {
  console.log('🔍 Launching headed Chrome to inspect Figma Node 2424-21417 (desktop/product/Trade Pricing - ETA)...');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  console.log('Navigating to Figma node 2424-21417...');
  await page.goto(FIGMA_EXACT_PDP_URL, { timeout: 60000 });
  await page.waitForTimeout(8000);

  // Clear tooltips
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Zoom to selection with Shift+2
  console.log('Pressing Shift+2 to zoom to PDP frame...');
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(3000);

  await page.screenshot({ path: path.join(OUT_DIR, '05_FIGMA_PDP_FRAME_ZOOMED.png') });
  console.log('Saved 05_FIGMA_PDP_FRAME_ZOOMED.png');

  // Let's zoom into the Buy Box (Title, Price, Dimensions, CTA)
  // Let's press '+' twice to get close
  await page.keyboard.press('+');
  await page.waitForTimeout(1000);
  await page.keyboard.press('+');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(OUT_DIR, '06_FIGMA_PDP_BUY_BOX_ZOOMED.png') });
  console.log('Saved 06_FIGMA_PDP_BUY_BOX_ZOOMED.png');

  // In Figma, let's click on the text 'W450' to select it and show its properties in the right inspector panel!
  // Let's use search to select W450
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('W450');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  // Take screenshot showing W450 selected with right panel properties
  await page.screenshot({ path: path.join(OUT_DIR, '07_FIGMA_W450_DIMENSIONS_PROPERTIES.png') });
  console.log('Saved 07_FIGMA_W450_DIMENSIONS_PROPERTIES.png');

  // Next, let's search for the Price: '$115'
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  // Select all in search and type $115
  await page.keyboard.press('Control+a');
  await page.keyboard.type('$115');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(OUT_DIR, '08_FIGMA_PRICE_PROPERTIES.png') });
  console.log('Saved 08_FIGMA_PRICE_PROPERTIES.png');

  // Next, let's search for 'Add to cart'
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+a');
  await page.keyboard.type('Add to cart');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(OUT_DIR, '09_FIGMA_ADD_TO_CART_PROPERTIES.png') });
  console.log('Saved 09_FIGMA_ADD_TO_CART_PROPERTIES.png');

  console.log('Keeping open for 15s...');
  await page.waitForTimeout(15000);
  await context.close();
  console.log('Figma deep element inspection complete.');
})();
