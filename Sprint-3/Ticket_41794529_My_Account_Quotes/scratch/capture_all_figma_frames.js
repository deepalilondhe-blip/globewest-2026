const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/figma';

(async () => {
  console.log('Capturing high-resolution detailed views of all Figma frames and artboards...');
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

  // Function to search in Figma, select, zoom (Shift+2), and take screenshot
  async function captureLayer(searchTerm, fileName, zoomOutCount = 0) {
    console.log(`Searching for "${searchTerm}"...`);
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.press('Control+a');
    await page.keyboard.type(searchTerm);
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape'); // dismiss search box
    await page.waitForTimeout(500);
    await page.keyboard.press('Shift+2'); // zoom to selection
    await page.waitForTimeout(2500);

    for (let i = 0; i < zoomOutCount; i++) {
      await page.keyboard.press('-');
      await page.waitForTimeout(400);
    }

    await page.screenshot({ path: path.join(OUT_DIR, fileName) });
    console.log(`Captured ${fileName}`);
  }

  // 1. Frame 622 (My Quotes Spec)
  await captureLayer('Frame 622', 'FIGMA_HIGHRES_FRAME_622_SPEC.png', 0);

  // 2. Frame 623 (Quote Details Spec)
  await captureLayer('Frame 623', 'FIGMA_HIGHRES_FRAME_623_SPEC.png', 0);

  // 3. Desktop My Quotes artboard
  await captureLayer('desktop/my_account/02_My Quotes', 'FIGMA_HIGHRES_DESKTOP_MY_QUOTES.png', 0);

  // 4. Desktop Quote Details artboard
  await captureLayer('desktop/my_account/03.Quote', 'FIGMA_HIGHRES_DESKTOP_QUOTE_DETAILS.png', 0);

  // 5. Panoramic view showing My Quotes, Frame 622, Frame 623, and Quote Details together
  await page.keyboard.press('-');
  await page.waitForTimeout(400);
  await page.keyboard.press('-');
  await page.waitForTimeout(400);
  await page.keyboard.press('-');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_PANORAMIC_QUOTES_ECOSYSTEM.png') });
  console.log('Captured FIGMA_PANORAMIC_QUOTES_ECOSYSTEM.png');

  await context.close();
  console.log('Completed capturing all Figma frames and artboards!');
})();
