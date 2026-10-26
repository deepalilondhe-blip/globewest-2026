const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64348&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = path.resolve(__dirname, '../figma');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Clean lock files
['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('🚀 Launching Chrome to capture Figma My Orders (Node 2581-64348)...');

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
    console.log('Navigating to Figma node 2581-64348...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 60000 });
    console.log('Waiting for canvas to render...');
    await page.waitForTimeout(10000);

    // Initial capture of the opened node
    await page.screenshot({ path: path.join(OUT_DIR, '01_FIGMA_NODE_2581-64348_INITIAL.png') });
    console.log('📸 Captured initial node screenshot.');

    // Zoom to selection (Shift+2)
    console.log('Zooming to selection (Shift+2)...');
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '02_FIGMA_ZOOM_SELECTION.png') });

    // Search for My Orders desktop artboard
    console.log('Searching for Orders in Figma layers...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.type('Orders');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '03_FIGMA_SEARCH_ORDERS.png') });

    // Search for Frame 623 or adjacent spec frames
    await page.keyboard.press('Control+a');
    await page.keyboard.type('Frame 62');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '04_FIGMA_SEARCH_FRAME_SPEC.png') });

    // Zoom out slightly to see the surrounding context
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '05_FIGMA_CONTEXT_VIEW.png') });

    // Try zooming to 100% or fit view
    await page.keyboard.press('Shift+0'); // 100% zoom
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '06_FIGMA_100_PERCENT.png') });

    // Zoom to selection again
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '07_FIGMA_ORDERS_ARTBOARD.png') });

    await context.close();
    console.log('✅ Figma capture completed successfully!');
  } catch (err) {
    console.error('Error during Figma capture:', err);
    await context.close().catch(() => {});
  }
})();
