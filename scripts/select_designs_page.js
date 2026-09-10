const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_NODE_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=1-185&p=f&t=j3AhqVjMU1DU4htq-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const OUT_DIR = '/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/figma_comparison';

(async () => {
  console.log('🎨 Opening Figma with persistent authenticated profile...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto(FIGMA_NODE_URL, { timeout: 60000 });
  await page.waitForTimeout(6000);

  // Dismiss any popups / tooltips
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Locate the "Designs" row in the Pages panel
  console.log('🔍 Locating Designs row in Pages sidebar...');
  const designsRow = page.locator('div:has-text("Designs")').filter({ hasText: /^Designs$/ }).first();
  const box = await designsRow.boundingBox();

  if (box) {
    console.log(`📍 Found Designs row at X: ${box.x}, Y: ${box.y}, W: ${box.width}, H: ${box.height}`);
    // Highlight
    await designsRow.evaluate(el => {
      el.style.outline = '3px solid #10B981';
      el.style.background = '#F3F4F6';
    });
    await page.waitForTimeout(500);

    // Perform native mouse click at center of row
    const clickX = box.x + box.width / 2;
    const clickY = box.y + box.height / 2;
    console.log(`🖱️ Clicking at coordinates (${clickX}, ${clickY})...`);
    await page.mouse.click(clickX, clickY);
    await page.waitForTimeout(5000);
  }

  // Switch from Comments to Properties / Design mode if active
  const propertiesTab = page.locator('button:has-text("Properties"), [data-testid="properties-tab"]').first();
  if (await propertiesTab.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('🔘 Switching to Properties tab...');
    await propertiesTab.click();
    await page.waitForTimeout(1000);
  }

  // Click Zoom dropdown at top right
  console.log('🔍 Clicking Zoom dropdown to select Zoom to fit...');
  const zoomBtn = page.locator('button[aria-label*="Zoom"], [data-testid="zoom-menu"], button:has-text("%")').first();
  if (await zoomBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await zoomBtn.click();
    await page.waitForTimeout(800);
    const fitOption = page.locator('text="Zoom to fit", [role="menuitem"]:has-text("Zoom to fit")').first();
    if (await fitOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('🔘 Clicking Zoom to fit...');
      await fitOption.click();
      await page.waitForTimeout(3000);
    } else {
      await page.keyboard.press('Escape');
    }
  }

  // Also focus canvas and press Shift+1
  const canvas = page.locator('canvas').first();
  if (await canvas.isVisible().catch(() => false)) {
    const cbox = await canvas.boundingBox();
    if (cbox) {
      await page.mouse.click(cbox.x + cbox.width / 2, cbox.y + cbox.height / 2);
      await page.waitForTimeout(500);
      await page.keyboard.press('Shift+1');
      await page.waitForTimeout(2000);
    }
  }

  await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_PAGE_DESIGNS_ACTIVE.png') });
  console.log('📸 Saved: FIGMA_PAGE_DESIGNS_ACTIVE.png');

  // Let's inspect layers to see what artboards exist
  const layerItems = await page.locator('[data-testid*="layer"], .layer-row, [role="treeitem"]').allTextContents().catch(() => []);
  console.log('Found layers:', layerItems.slice(0, 15));

  // If node-id=1-185 is present, let's zoom to selection (Shift+2)
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_PLP_BOARD_ZOOMED.png') });
  console.log('📸 Saved: FIGMA_PLP_BOARD_ZOOMED.png');

  console.log('Keeping Chrome open for 60 seconds on screen...');
  await page.waitForTimeout(60000);
  await context.close();
  console.log('Finished!');
})();
