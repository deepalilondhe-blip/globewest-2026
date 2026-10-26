const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3gol0vM1tXCdTk/Globewest-USA---External?node-id=2581-64183&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = path.resolve(__dirname, '..', 'figma');

(async () => {
  console.log('🚀 Loading Figma file and switching to Designs page...');

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
    console.log('Waiting for canvas...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    console.log('Canvas loaded! Waiting 10s for UI...');
    await page.waitForTimeout(10000);

    // Click on coordinates of "Designs" in the left sidebar
    // From 01_FIGMA_ZOOM_FIT.png: Left sidebar is x=0..150. "Cover" is around y=95. "Designs" is around y=155.
    console.log('Clicking "Designs" page at x=80, y=155...');
    await page.mouse.click(80, 155);
    await page.waitForTimeout(6000);

    await page.screenshot({ path: path.join(OUT_DIR, '03_CLICKED_DESIGNS_PAGE.png') });
    console.log('📸 Saved 03_CLICKED_DESIGNS_PAGE.png');

    // Zoom to fit on Designs page
    await page.keyboard.press('Shift+1');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '04_DESIGNS_PAGE_ZOOM_FIT.png') });
    console.log('📸 Saved 04_DESIGNS_PAGE_ZOOM_FIT.png');

    // Search for "Dashboard"
    console.log('Searching for "Dashboard"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('Dashboard');
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Zoom to selection
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '05_DASHBOARD_SELECTION_ZOOM.png') });
    console.log('📸 Saved 05_DASHBOARD_SELECTION_ZOOM.png');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await context.close();
  }
})();
