const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs/all_pages');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🎨 Opening Figma [FINAL] Designs to capture all pages page-wise...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External', { timeout: 120000 });
    console.log('Waiting for canvas...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(8000);
    await page.keyboard.press('Escape');

    // 1. Click on "[FINAL] Designs" in the Pages panel
    console.log('Clicking on "[FINAL] Designs" page...');
    const finalRow = page.locator('text="[FINAL] Designs"').first();
    if (await finalRow.isVisible({ timeout: 4000 }).catch(() => false)) {
      await finalRow.click();
      await page.waitForTimeout(3000);
    }

    // Scroll up in Layers panel to see top layers
    const layersPanel = page.locator('div[role="tree"]').first();

    // Let's get all top-level frames/layers in [FINAL] Designs
    // We can evaluate in page context to find all layer rows in the sidebar
    console.log('Fetching all layer names from the sidebar...');
    
    // Let's click on the first layer: desktop/Category/Show Filters
    const firstLayer = page.locator('text="desktop/Category/Show Filters"').first();
    if (await firstLayer.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('Clicking first layer...');
      await firstLayer.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2'); // Zoom to selection
      await page.waitForTimeout(2000);

      // Now zoom out slightly so we can see adjacent frames clearly (Shift + 0 is 100%, Shift + 1 is fit all)
      // Let's press 'Minus' twice to zoom out comfortable amount
      await page.keyboard.press('Minus');
      await page.waitForTimeout(1000);

      let shot1 = await page.screenshot({ fullPage: false });
      fs.writeFileSync(path.join(OUT_DIR, '01_Category_PLP_Section.png'), shot1);
      fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/01_Category_PLP_Section.png', shot1);
      console.log('📸 Captured 01_Category_PLP_Section.png');
    }

    // Now let's pan right across the canvas or click through layers down the tree!
    // We can press the Down arrow in the layers list!
    // If the layer list is focused, pressing Down arrow selects the next artboard, and Shift+2 zooms to it!
    console.log('\nCycling through layers using keyboard Down arrow + Shift+2...');
    
    // Focus layers list
    const showFilters = page.locator('text="desktop/Category/Show Filters"').first();
    await showFilters.click();
    await page.waitForTimeout(500);

    for (let i = 1; i <= 15; i++) {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(400);
      await page.keyboard.press('Shift+2'); // Zoom to this frame
      await page.waitForTimeout(1500);

      const shot = await page.screenshot({ fullPage: false });
      const fname = `PAGE_FRAME_${i.toString().padStart(2, '0')}.png`;
      fs.writeFileSync(path.join(OUT_DIR, fname), shot);
      fs.writeFileSync(`/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/${fname}`, shot);
      console.log(`📸 Captured ${fname}`);
    }

    console.log('\nAll frames captured! Leaving browser open for 30s so user can view live on screen...');
    await page.waitForTimeout(30000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
    console.log('Done.');
  }
})();
