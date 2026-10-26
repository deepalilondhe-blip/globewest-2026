const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64183&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = path.resolve(__dirname, '..', 'figma');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 CAPTURING FIGMA DASHBOARD FRAME (node-id=2581-64183)');
  console.log('========================================================================\n');

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
    console.log('🌐 Opening Figma URL:', FIGMA_URL);
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });

    console.log('⏳ Waiting for canvas to render...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    console.log('🎉 Canvas found! Streaming design content (12s)...');
    await page.waitForTimeout(12000);

    // Zoom to selection (Shift+2) to focus directly on node 2581-64183
    console.log('🔍 Zooming to selected node (Shift+2)...');
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(4000);

    const selectPath = path.join(OUT_DIR, '01_FIGMA_DASHBOARD_NODE_2581_64183.png');
    await page.screenshot({ path: selectPath });
    console.log('📸 Saved:', selectPath);

    // Zoom out slightly (press '-' twice) for broader context
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.keyboard.press('-');
    await page.waitForTimeout(1500);

    const fullPath = path.join(OUT_DIR, '02_FIGMA_DASHBOARD_FULL_VIEW.png');
    await page.screenshot({ path: fullPath });
    console.log('📸 Saved:', fullPath);

    // Hide UI (Ctrl+\) for clean presentation screenshot
    await page.keyboard.press('Control+Backslash');
    await page.waitForTimeout(2000);

    const cleanPath = path.join(OUT_DIR, '03_FIGMA_DASHBOARD_CLEAN_ARTBOARD.png');
    await page.screenshot({ path: cleanPath });
    console.log('📸 Saved:', cleanPath);

  } catch (err) {
    console.error('Error during Figma capture:', err.message);
  } finally {
    await context.close();
    console.log('Figma capture session finished.');
  }
})();
