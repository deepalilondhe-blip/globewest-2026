const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2424-21417&t=hdXl6V9N8rmpfEkt-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_PATH = path.join(__dirname, '../../Enable Public Browsing Mode/FIGMA_PDP_100PERCENT.png');
const ARTIFACT_PATH = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FIGMA_PDP_100PERCENT.png';

(async () => {
  console.log('Capturing Figma PDP at 100% scale...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  
  try {
    await page.goto(FIGMA_URL, { timeout: 90000 });
    await page.waitForSelector('canvas', { timeout: 60000 });
    console.log('Canvas loaded, waiting 15s for full render...');
    await page.waitForTimeout(15000);

    // Zoom into selection
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(2000);

    // Zoom to 100%
    await page.keyboard.press('Shift+0');
    await page.waitForTimeout(2500);

    await page.screenshot({ path: OUT_PATH });
    fs.copyFileSync(OUT_PATH, ARTIFACT_PATH);
    console.log('Saved 100% scale Figma PDP screenshot!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
  }
})();
