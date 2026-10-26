const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64183&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = path.resolve(__dirname, '..', 'figma');

(async () => {
  console.log('🚀 FOCUSING DIRECTLY ON FIGMA DASHBOARD ARTBOARDS...');

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

    // Search for "desktop/my_account/01_dashboard"
    console.log('Searching for "desktop/my_account/01_dashboard"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('desktop/my_account/01_dashboard');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Zoom to selection (Shift+2)
    console.log('Zooming to dashboard artboard (Shift+2)...');
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);

    // Hide UI for clean artboard view
    await page.keyboard.press('Control+Backslash');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_DESKTOP_DASHBOARD_ARTBOARD.png') });
    console.log('📸 Saved FIGMA_DESKTOP_DASHBOARD_ARTBOARD.png');

    // Pan down slightly to see entire lower content
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_DESKTOP_DASHBOARD_LOWER.png') });
    console.log('📸 Saved FIGMA_DESKTOP_DASHBOARD_LOWER.png');

    // Bring UI back
    await page.keyboard.press('Control+Backslash');
    await page.waitForTimeout(1000);

    // Now search for "Frame 620" (Specs & notes)
    console.log('Searching for "Frame 620"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('Frame 620');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_FRAME_620_SPECS.png') });
    console.log('📸 Saved FIGMA_FRAME_620_SPECS.png');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await context.close();
    console.log('Done focusing Figma dashboard.');
  }
})();
