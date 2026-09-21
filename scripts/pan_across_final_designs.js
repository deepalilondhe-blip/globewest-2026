const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs/panned_pages');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🎨 Launching Figma to pan horizontally across all final designs...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-12739', { timeout: 120000 });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');

    // Click on desktop/Category/Show Filters
    const showFilters = page.locator('text="desktop/Category/Show Filters"').first();
    if (await showFilters.isVisible({ timeout: 4000 }).catch(() => false)) {
      await showFilters.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2'); // Zoom to selection
      await page.waitForTimeout(2000);
    }

    // Zoom out just slightly so we see the full height and context (e.g. 50% zoom)
    await page.keyboard.press('Minus');
    await page.waitForTimeout(1000);

    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();
    const centerX = box ? box.x + box.width / 2 : 700;
    const centerY = box ? box.y + box.height / 2 : 450;

    // Capture first section (PLP / Category)
    let shot = await page.screenshot({ fullPage: false });
    fs.writeFileSync(path.join(OUT_DIR, '01_PLP_CATEGORY.png'), shot);
    fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/01_PLP_CATEGORY.png', shot);
    console.log('📸 Captured 01_PLP_CATEGORY.png');

    // Pan across to the right in 8 steps
    for (let step = 2; step <= 8; step++) {
      console.log(`Panning to section ${step}...`);
      // In Figma canvas, panning horizontally is done with Space + mouse drag or Shift + mouse wheel
      await page.mouse.move(centerX, centerY);
      // Shift + wheel scrolls horizontally!
      await page.keyboard.down('Shift');
      await page.mouse.wheel(0, 1800); // positive wheel with Shift scrolls right
      await page.keyboard.up('Shift');
      await page.waitForTimeout(2000);

      shot = await page.screenshot({ fullPage: false });
      const fname = `SECTION_${step.toString().padStart(2, '0')}.png`;
      fs.writeFileSync(path.join(OUT_DIR, fname), shot);
      fs.writeFileSync(`/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/${fname}`, shot);
      console.log(`📸 Captured ${fname}`);
    }

    console.log('\nLeaving Chrome open for 20 seconds...');
    await page.waitForTimeout(20000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
    console.log('Done.');
  }
})();
