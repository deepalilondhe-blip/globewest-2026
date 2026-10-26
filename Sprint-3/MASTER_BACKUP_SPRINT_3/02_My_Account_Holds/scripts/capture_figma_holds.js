const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64185&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794528_My_Account_Holds/figma';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 CAPTURING FIGMA SPECIFICATIONS FOR MY HOLDS (NODE 2581-64185)');
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
    console.log('🌐 Navigating to Figma node 2581-64185...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });

    console.log('⏳ Waiting for canvas to render...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    console.log('🎉 Canvas found! Streaming Figma design content...');
    await page.waitForTimeout(14000);

    // Close any modal or popups
    try {
      const closeButtons = await page.$$('button[aria-label="Close"], [data-testid="modal-close-button"], [aria-label*="close" i]');
      for (const btn of closeButtons) {
        if (await btn.isVisible()) {
          await btn.click().catch(() => {});
          await page.waitForTimeout(500);
        }
      }
    } catch (e) {}

    // Zoom to fit or zoom to 100%
    console.log('🔍 Adjusting Figma view...');
    await page.keyboard.press('Shift+1'); // Zoom to fit
    await page.waitForTimeout(3000);

    const fitPath = path.join(OUT_DIR, '01_FIGMA_ZOOM_FIT.png');
    await page.screenshot({ path: fitPath });
    console.log('📸 Saved:', fitPath);

    // Press Shift+2 to zoom to selected node (2581-64185)
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(4000);
    const selectedPath = path.join(OUT_DIR, '02_FIGMA_SELECTED_NODE_ZOOM.png');
    await page.screenshot({ path: selectedPath });
    console.log('📸 Saved:', selectedPath);

    // Extract any visible text / layer names from Figma DOM if present
    const figmaDom = await page.evaluate(() => {
      const layers = Array.from(document.querySelectorAll('[role="treeitem"], [data-testid*="layer"]')).map(el => el.innerText.trim().replace(/\n/g, ' '));
      return {
        layersCount: layers.length,
        sampleLayers: layers.slice(0, 30)
      };
    });
    console.log('Figma layers detected:', figmaDom);

    await page.waitForTimeout(3000);
    await context.close();
    console.log('✅ Figma capture completed successfully!');
  } catch (err) {
    console.error('❌ Error capturing Figma:', err);
    if (context) await context.close().catch(() => {});
  }
})();
