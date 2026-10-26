const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64185&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794528_My_Account_Holds/figma';

(async () => {
  console.log('🚀 Zooming to Frame 623 (My Holds) in Figma...');

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
    await page.waitForTimeout(8000);

    // Look for Frame 623 in left layer tree
    const frame623 = page.locator('[role="treeitem"]:has-text("Frame 623")').first();
    if (await frame623.isVisible().catch(() => false)) {
      console.log('Found Frame 623 in layer tree, clicking...');
      await frame623.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2'); // Zoom to selection
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT_DIR, '03_FRAME_623_ZOOM.png') });
      console.log('📸 Captured 03_FRAME_623_ZOOM.png');
    } else {
      console.log('Searching via Ctrl+F for Frame 623...');
      await page.keyboard.press('Control+f');
      await page.waitForTimeout(1000);
      await page.keyboard.type('Frame 623');
      await page.waitForTimeout(1500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT_DIR, '03_FRAME_623_ZOOM.png') });
    }

    // Zoom out slightly to see full artboard and notes
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '04_FRAME_623_FULL_VIEW.png') });
    console.log('📸 Captured 04_FRAME_623_FULL_VIEW.png');

    // Zoom out more
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '05_FRAME_623_CONTEXT.png') });

    await context.close();
    console.log('✅ Frame 623 captured!');
  } catch (err) {
    console.error('Error:', err);
    if (context) await context.close().catch(() => {});
  }
})();
