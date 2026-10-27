const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_EXACT_PDP_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2424-21417&p=f&t=7H6mtO9jrDjRty3L-0';
const PROFILE_DIR = path.join(__dirname, '../../GlobeWest 2026/.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../screenshots/figma_deep_inspect');

(async () => {
  console.log('🔍 Inspecting remaining Figma PDP & Header elements...');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto(FIGMA_EXACT_PDP_URL, { timeout: 60000 });
  await page.waitForTimeout(7000);
  await page.keyboard.press('Escape');

  // 1. Search for Title: Tepih Lane
  console.log('Searching for Title: Tepih Lane...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.type('Tepih Lane');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '10_FIGMA_TITLE_PROPERTIES.png') });
  console.log('Saved 10_FIGMA_TITLE_PROPERTIES.png');

  // 2. Search for Stock Notification: Next Shipment
  console.log('Searching for Stock ETA: Next Shipment...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+a');
  await page.keyboard.type('Next Shipment');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '11_FIGMA_STOCK_ETA_PROPERTIES.png') });
  console.log('Saved 11_FIGMA_STOCK_ETA_PROPERTIES.png');

  // 3. Search for ADD TO QUOTE
  console.log('Searching for ADD TO QUOTE...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+a');
  await page.keyboard.type('ADD TO QUOTE');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '12_FIGMA_ADD_TO_QUOTE_PROPERTIES.png') });
  console.log('Saved 12_FIGMA_ADD_TO_QUOTE_PROPERTIES.png');

  // 4. Search for Book Showroom Appointment (Header Utility)
  console.log('Searching for Header: Book Showroom Appointment...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+a');
  await page.keyboard.type('Book Showroom Appointment');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '13_FIGMA_HEADER_UTILITY_PROPERTIES.png') });
  console.log('Saved 13_FIGMA_HEADER_UTILITY_PROPERTIES.png');

  await page.waitForTimeout(2000);
  await context.close();
  console.log('Done!');
})();
