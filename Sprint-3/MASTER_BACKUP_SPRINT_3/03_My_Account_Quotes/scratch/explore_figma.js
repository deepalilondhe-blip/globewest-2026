const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/figma';

(async () => {
  console.log('Connecting and exploring Figma design...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto(FIGMA_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);

  // 1. Zoom to node 2581:64235 and zoom out to show everything around it
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(2000);
  await page.keyboard.press('-');
  await page.waitForTimeout(500);
  await page.keyboard.press('-');
  await page.waitForTimeout(500);
  await page.keyboard.press('-');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '04_FIGMA_ALL_THREE_QUOTES_ITEMS.png') });
  console.log('Captured 04_FIGMA_ALL_THREE_QUOTES_ITEMS.png');

  // 2. Search for "Frame 623" to see if there is another frame
  console.log('Searching for Frame 623...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.type('Frame 623');
  await page.waitForTimeout(1500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '06_FIGMA_FRAME_623.png') });
  console.log('Captured 06_FIGMA_FRAME_623.png');

  // 3. Search for "Quote Details"
  console.log('Searching for Quote Details...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+a');
  await page.keyboard.type('Quote Details');
  await page.waitForTimeout(1500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '07_FIGMA_QUOTE_DETAILS.png') });
  console.log('Captured 07_FIGMA_QUOTE_DETAILS.png');

  // 4. Check if there is any other frame or notes around Quotes in September Changes
  console.log('Switching to September Changes page...');
  const septPage = await page.$('div:has-text("[FINAL] Designs - September Changes")');
  if (septPage) {
    await septPage.click();
    await page.waitForTimeout(3000);
    // search for Quotes
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.press('Control+a');
    await page.keyboard.type('Quotes');
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, '08_FIGMA_SEPTEMBER_CHANGES_QUOTES.png') });
  }

  // 5. Back to Desktop / My Quotes artboard to capture full zoom details
  console.log('Going back to [FINAL] Designs page...');
  const finalDesignsPage = await page.$('div:has-text("[FINAL] Designs")');
  if (finalDesignsPage) {
    await finalDesignsPage.click();
    await page.waitForTimeout(3000);
  }
  await page.goto(FIGMA_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+a');
  await page.keyboard.type('desktop/my_account/02_My Quotes');
  await page.waitForTimeout(1500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, '09_FIGMA_DESKTOP_MY_QUOTES_PERFECT.png') });

  await context.close();
  console.log('Finished exploring Figma!');
})();
