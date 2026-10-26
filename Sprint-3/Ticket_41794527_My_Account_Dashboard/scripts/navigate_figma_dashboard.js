const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3gol0vM1tXCdTk/Globewest-USA---External?node-id=2581-64183&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = path.resolve(__dirname, '..', 'figma');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 NAVIGATING TO FIGMA DASHBOARD FRAME (NODE 2581-64183)...');

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
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);

    // Click "Designs" page in left sidebar
    const designsPage = page.locator('text="Designs"').first();
    if (await designsPage.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('👉 Switching to "Designs" page in Figma sidebar...');
      await designsPage.click();
      await page.waitForTimeout(8000);
    }

    // Now press Ctrl+F to find node or "Dashboard"
    console.log('🔍 Searching for "Dashboard" or "2581-64183"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('Dashboard');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Zoom to selection
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '03_FIGMA_DASHBOARD_SELECTED.png') });
    console.log('📸 Captured 03_FIGMA_DASHBOARD_SELECTED.png');

    // Zoom out slightly to see complete frame context
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '04_FIGMA_DASHBOARD_FULL_VIEW.png') });
    console.log('📸 Captured 04_FIGMA_DASHBOARD_FULL_VIEW.png');

    // Hide UI (Ctrl+\) for clean presentation screenshot
    await page.keyboard.press('Control+Backslash');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '05_FIGMA_DASHBOARD_CLEAN_SPEC.png') });
    console.log('📸 Captured 05_FIGMA_DASHBOARD_CLEAN_SPEC.png');

  } catch (err) {
    console.error('Error during Figma capture:', err);
  } finally {
    await context.close();
    console.log('Figma capture completed.');
  }
})();
