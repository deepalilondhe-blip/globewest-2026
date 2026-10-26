const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const PROFILE_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/.figma-chrome-profile');
const OUT_DIR = path.resolve(SCRIPTS_DIR, '../figma');
const DESKTOP_DIR = path.join(OUT_DIR, 'desktop');
const MOBILE_DIR = path.join(OUT_DIR, 'mobile');

const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

fs.mkdirSync(DESKTOP_DIR, { recursive: true });
fs.mkdirSync(MOBILE_DIR, { recursive: true });

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('🎯 CAPTURING ALL FIGMA CLAIMS PORTAL FRAMES...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages()[0] || await context.newPage();

  // Load directly at Frame 630 position
  await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2584-65044', {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });
  await page.waitForTimeout(8000);

  // In Figma canvas, Frame 630 is at center.
  // Click Frame 630 in layers to select it
  const f630 = page.locator('text="Frame 630"').first();
  if (await f630.isVisible().catch(() => false)) {
    await f630.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(2000);
  }

  // Find all sibling/adjacent frames by panning right
  // Frame 630 is at x. desktop/my_account/My Claims is immediately to its right.
  // Let us pan right by pressing Right Arrow while holding Shift, or using canvas drag
  console.log('📸 Capturing Full Spec Notes...');
  await page.screenshot({ path: path.join(OUT_DIR, '01_FIGMA_SPEC_CARD_FRAME_630.png') });

  // Pan to the right (desktop frame)
  // In Figma, space + drag pans the canvas. Or we can click on the frame name in layers if visible.
  console.log('🔍 Looking for desktop/my_account/My Claims in layers...');
  // Let us check all visible layer names in the DOM
  const layerTexts = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('[data-testid*="layer"], [class*="layer_row"], [class*="tree_row"]'));
    return rows.map(r => ({
      text: r.innerText.replace(/\n+/g, ' ').trim(),
      top: r.getBoundingClientRect().top
    }));
  });
  console.log('Visible layer rows:', JSON.stringify(layerTexts.slice(0, 25), null, 2));

  // Let us search layers for "My Claims" or "Claims"
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(800);
  await page.keyboard.type('My Claims');
  await page.waitForTimeout(1500);

  // Take screenshot of search
  await page.screenshot({ path: path.join(OUT_DIR, '02_FIGMA_SEARCH_MY_CLAIMS.png') });

  // Click through search results for "My Claims"
  // Press Enter or click down arrows
  for (let step = 1; step <= 5; step++) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2'); // Zoom to selection
    await page.waitForTimeout(2500);

    const url = page.url();
    console.log(`Step ${step} Selection URL: ${url}`);
    await page.screenshot({ path: path.join(OUT_DIR, `03_MY_CLAIMS_MATCH_${step}.png`) });

    // Also zoom out slightly to see full page context
    await page.keyboard.press('-');
    await page.waitForTimeout(500);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, `04_MY_CLAIMS_MATCH_${step}_ZOOMED_OUT.png`) });
    
    // Zoom back in
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(1000);
  }

  await context.close();
  console.log('✅ Finished capturing Claims frames!');
})();
