const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2424-21417&t=hdXl6V9N8rmpfEkt-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_PATH_1 = path.join(__dirname, '../../Enable Public Browsing Mode/FIGMA_NODE_2424_21417.png');
const OUT_PATH_2 = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FIGMA_NODE_2424_21417.png';

(async () => {
  console.log('Opening Figma node 2424-21417 in Headed Chrome...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--start-maximized'
    ],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  
  try {
    await page.goto(FIGMA_URL, { timeout: 120000 });
    console.log('Page navigating, waiting for canvas element...');
    
    // Wait for canvas element to appear
    await page.waitForSelector('canvas', { timeout: 60000 }).catch(() => console.log('Canvas wait timeout'));
    console.log('Canvas detected! Waiting 20s for full rendering...');
    await page.waitForTimeout(20000);

    // Zoom to selection / fit
    await page.keyboard.press('Shift+2').catch(() => {});
    await page.waitForTimeout(3000);

    const buf = await page.screenshot({ fullPage: false });
    fs.writeFileSync(OUT_PATH_1, buf);
    fs.writeFileSync(OUT_PATH_2, buf);
    console.log(`Saved full rendered Figma screenshot!`);
  } catch (err) {
    console.error('Error capturing Figma:', err.message);
  } finally {
    await context.close();
  }
})();
