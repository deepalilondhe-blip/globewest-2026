const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_EXACT_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-12739&p=f&t=7H6mtO9jrDjRty3L-0';
const PROFILE_DIR = path.join(__dirname, '../../GlobeWest 2026/.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../screenshots/figma_comparison');

(async () => {
  console.log('🎨 Launching Chrome with Figma profile to inspect Compare Box dimensions...');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  console.log('Navigating to Figma node 2316-12739...');
  await page.goto(FIGMA_EXACT_URL, { timeout: 60000 });
  await page.waitForTimeout(8000);

  // Press Escape to clear any tooltips/modals
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Zoom to selection with Shift+2
  console.log('Pressing Shift+2 to focus selected frame...');
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(3000);

  // Take screenshot of focused artboard
  await page.screenshot({ path: path.join(OUT_DIR, '01_FIGMA_ARTBOARD_FOCUSED.png') });
  console.log('Saved 01_FIGMA_ARTBOARD_FOCUSED.png');

  // Let's search in layers or click on canvas where Compare is
  // Find text in canvas or search layer
  console.log('Attempting to find Compare layer or click on Compare checkbox...');
  
  // Use Figma search: Cmd/Ctrl + F
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('Compare');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  // Zoom to that search result: Shift + 2
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(2000);

  // Take screenshot showing the selected Compare component with Figma's dimension badges & right inspect panel
  await page.screenshot({ path: path.join(OUT_DIR, '02_FIGMA_COMPARE_SELECTED_SPECS.png') });
  console.log('Saved 02_FIGMA_COMPARE_SELECTED_SPECS.png');

  // Also zoom in further: '+' key a few times to get a close-up
  await page.keyboard.press('+');
  await page.keyboard.press('+');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT_DIR, '03_FIGMA_COMPARE_CLOSEUP_ZOOM.png') });
  console.log('Saved 03_FIGMA_COMPARE_CLOSEUP_ZOOM.png');

  console.log('Keeping open for 15s...');
  await page.waitForTimeout(15000);
  await context.close();
  console.log('Figma inspection completed successfully.');
})();
