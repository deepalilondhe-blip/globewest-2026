const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_EXACT_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-12739&p=f&t=7H6mtO9jrDjRty3L-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');

const OUT_DIR = '/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/figma_comparison';

(async () => {
  console.log('🎨 Launching Chrome to zoom into desktop/Category/Show Filters...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto(FIGMA_EXACT_URL, { timeout: 60000 });
  await page.waitForTimeout(6000);

  // Dismiss blue tooltip with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Locate the layer item: desktop/Category/Show Filters
  console.log('🔍 Locating desktop/Category/Show Filters in Layers list...');
  const layerRow = page.locator('text="desktop/Category/Show Filters"').first();
  const isVis = await layerRow.isVisible({ timeout: 5000 }).catch(() => false);

  if (isVis) {
    console.log('🔘 Found layer! Double-clicking to zoom to frame...');
    const box = await layerRow.boundingBox();
    if (box) {
      await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(3000);
    }
  }

  // Also hit Shift+2 (Zoom to selection)
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(3000);

  // Pan slightly to include the CATEGORY PAGE note on the left if needed
  // Let's capture the zoomed screenshot
  await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png') });
  console.log('📸 Saved: FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png');

  // Copy to workspace screenshot folders
  const wsDir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page/screenshots/figma_comparison';
  if (!fs.existsSync(wsDir)) fs.mkdirSync(wsDir, { recursive: true });
  fs.copyFileSync(path.join(OUT_DIR, 'FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png'), path.join(wsDir, 'FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png'));

  console.log('Keeping open for 45s on screen...');
  await page.waitForTimeout(45000);
  await context.close();
  console.log('Done!');
})();
