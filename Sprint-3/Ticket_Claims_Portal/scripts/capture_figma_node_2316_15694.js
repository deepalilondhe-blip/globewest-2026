const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

const BASE_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(BASE_DIR, 'figma');
const PROFILE_DIR = path.resolve(__dirname, '../../../GlobeWest 2026/.figma-chrome-profile');

fs.mkdirSync(OUT_DIR, { recursive: true });

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('========================================================================');
  console.log('🎨 CAPTURING FIGMA NODE: 2316-15694 (Claims Portal)');
  console.log('Target URL: https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-15694');
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
    console.log('🌐 Opening Figma at node 2316-15694...');
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-15694&t=UHKXdUurQ7e08vqM-0', {
      timeout: 120000,
      waitUntil: 'domcontentloaded'
    });

    console.log('⏳ Waiting for Figma canvas to load...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(10000);

    // Press Escape to clear overlays
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Initial view screenshot
    const initPath = path.join(OUT_DIR, 'FIGMA_NODE_2316_15694_INITIAL.png');
    await page.screenshot({ path: initPath });
    console.log(`📸 Initial screenshot saved: ${initPath}`);

    // Zoom to selection: Shift + 2
    console.log('🔍 Zooming directly to selected node (Shift + 2)...');
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(4000);

    // Capture zoomed to selection
    const zoomPath = path.join(OUT_DIR, 'FIGMA_NODE_2316_15694_ZOOMED.png');
    await page.screenshot({ path: zoomPath });
    console.log(`📸 Zoomed selection screenshot saved: ${zoomPath}`);

    // Zoom out slightly to see full frame: Shift + 1 or Ctrl + -
    console.log('🔍 Zooming out slightly to capture full frame context...');
    await page.keyboard.press('Control+-');
    await page.waitForTimeout(1500);
    const fitPath = path.join(OUT_DIR, 'FIGMA_NODE_2316_15694_FULL_FRAME.png');
    await page.screenshot({ path: fitPath });
    console.log(`📸 Full frame screenshot saved: ${fitPath}`);

    // Also extract whatever UI text or layer name is visible in Figma top bar / layers panel
    const info = await page.evaluate(() => {
      const title = document.title;
      const selectedLayer = document.querySelector('[class*="selected"], [aria-selected="true"], [data-testid*="layer"]')?.innerText;
      return { title, selectedLayer };
    });
    console.log('Figma page info:', info);

  } catch (err) {
    console.error('❌ Error during Figma capture:', err);
  } finally {
    await context.close();
    console.log('🏁 Figma capture session closed.');
  }
})();
