const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64183&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = path.resolve(__dirname, '..', 'figma');

(async () => {
  console.log('🚀 CAPTURING CLOSE-UP OF FIGMA DASHBOARD ARTBOARD & SPECS...');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--window-size=1920,1080'
    ],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(10000);

    // Zoom to node (Shift+2)
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);

    // Zoom out twice to see the artboards below "Dashboard"
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);

    // Pan down (drag or mouse wheel)
    console.log('Panning down to artboard...');
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '04_FIGMA_DASHBOARD_PAN_DOWN.png') });
    console.log('📸 Saved 04_FIGMA_DASHBOARD_PAN_DOWN.png');

    // Pan right towards desktop artboard
    await page.mouse.wheel(400, 0);
    await page.waitForTimeout(2000);

    // Zoom in once (+)
    await page.keyboard.press('+');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(OUT_DIR, '05_FIGMA_DESKTOP_DASHBOARD_ARTBOARD.png') });
    console.log('📸 Saved 05_FIGMA_DESKTOP_DASHBOARD_ARTBOARD.png');

    // Pan down to see lower section of dashboard (Orders, Quotes, Promotions)
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '06_FIGMA_DESKTOP_DASHBOARD_LOWER.png') });
    console.log('📸 Saved 06_FIGMA_DESKTOP_DASHBOARD_LOWER.png');

    // Pan left to see Mobile artboard and Frame 620 notes
    await page.mouse.wheel(-800, -450);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '07_FIGMA_FRAME620_SPECS_AND_MOBILE.png') });
    console.log('📸 Saved 07_FIGMA_FRAME620_SPECS_AND_MOBILE.png');

  } catch (err) {
    console.error('Error during Figma capture:', err);
  } finally {
    await context.close();
    console.log('Figma capture completed.');
  }
})();
