const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/figma';

(async () => {
  console.log('🚀 Checking Figma session and zooming to My Quotes artboards...');
  console.log(`Profile: ${PROFILE_DIR}`);

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
    console.log('🌐 Navigating to Figma node 2581-64235...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });

    console.log('⏳ Waiting for canvas to render...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    console.log('🎉 Canvas found! Waiting 12s for Figma design content to stream...');
    await page.waitForTimeout(12000);

    // Initial capture
    const initialPath = path.join(OUT_DIR, '08_FIGMA_LOADED_STATE.png');
    await page.screenshot({ path: initialPath });
    console.log('📸 Saved:', initialPath);

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

    // Find all layers in the left sidebar
    const treeItems = await page.$$eval('[role="treeitem"]', els => 
      els.map((el, i) => ({
        index: i,
        text: el.innerText.trim().replace(/\n/g, ' '),
        ariaSelected: el.getAttribute('aria-selected')
      }))
    );
    console.log('Tree items count:', treeItems.length);
    console.log('Sample tree items:', JSON.stringify(treeItems.slice(0, 25), null, 2));

    // Look specifically for "My Quotes" or "Frame 622" or "Quote Details"
    const targetLayers = ['My Quotes', 'Frame 622', 'Quote Details Page', 'Quote Details'];
    for (const target of targetLayers) {
      console.log(`\n🔎 Searching for layer matching: "${target}"...`);
      const item = page.locator(`[role="treeitem"]:has-text("${target}")`).first();
      if (await item.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log(`🎯 Found "${target}"! Clicking it...`);
        await item.click();
        await page.waitForTimeout(1000);

        // Zoom to selection
        console.log(`Zooming to selection (Shift+2)...`);
        await page.keyboard.press('Shift+2');
        await page.waitForTimeout(4000);

        const safeName = target.replace(/[^a-zA-Z0-9_-]/g, '_');
        const shotPath = path.join(OUT_DIR, `09_FIGMA_ZOOM_${safeName}.png`);
        await page.screenshot({ path: shotPath });
        console.log('📸 Saved:', shotPath);

        // Also let's try zooming out slightly (Shift+1 or - key) if it's too close, or capture canvas
        await page.keyboard.press('-');
        await page.waitForTimeout(1500);
        const shotSlightZoomOut = path.join(OUT_DIR, `10_FIGMA_${safeName}_ZOOM_OUT.png`);
        await page.screenshot({ path: shotSlightZoomOut });
        console.log('📸 Saved slight zoom out:', shotSlightZoomOut);
      }
    }

    // Capture the entire canvas viewport without sidebars if possible, or toggle UI (Ctrl+\)
    console.log('Toggling UI to capture full design canvas (Ctrl+\\)...');
    await page.keyboard.press('Control+\\');
    await page.waitForTimeout(3000);
    const fullCanvasPath = path.join(OUT_DIR, '11_FIGMA_CANVAS_NO_UI.png');
    await page.screenshot({ path: fullCanvasPath });
    console.log('📸 Saved full canvas no UI:', fullCanvasPath);

    // Toggle UI back
    await page.keyboard.press('Control+\\');
    await page.waitForTimeout(1000);

    console.log('Keeping open for 5s...');
    await page.waitForTimeout(5000);
    await context.close();
    console.log('✅ Finished capture successfully!');
  } catch (err) {
    console.error('❌ Error during Figma capture:', err);
    await page.screenshot({ path: path.join(OUT_DIR, 'ERROR_STATE.png') }).catch(() => {});
    await context.close().catch(() => {});
  }
})();
