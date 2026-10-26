const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/figma';

(async () => {
  console.log('🚀 Panning and zooming to full Desktop & Mobile My Quotes artboards in Figma...');

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

    // Click canvas
    const canvas = await page.$('canvas');
    const box = await canvas.boundingBox();
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    // In Figma, let's search in layers for "02_My Quotes" or "Quotes"
    // Press Ctrl+F (or Cmd+F) to search in Figma
    console.log('Searching for "02_My Quotes" in Figma search...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('02_My Quotes');
    await page.waitForTimeout(2000);

    // Let's capture what search shows
    await page.screenshot({ path: path.join(OUT_DIR, '12_FIGMA_SEARCH_RESULTS.png') });

    // Press Enter to go to first result
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    // Press Shift+2 to zoom to it
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '13_FIGMA_DESKTOP_QUOTES_ZOOM.png') });

    // Press Shift+1 to see context, or '-' to zoom out slightly
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '14_FIGMA_DESKTOP_QUOTES_CONTEXT.png') });

    // Let's now search for mobile quotes
    console.log('Searching for "mobile" quotes in Figma search...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    // select all text in search and replace
    await page.keyboard.press('Control+a');
    await page.keyboard.type('mobile/my_account');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '15_FIGMA_MOBILE_SEARCH.png') });

    // Press Enter to cycle to mobile quotes
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '16_FIGMA_MOBILE_FIRST_RESULT.png') });

    // Search specifically for "mobile" and "quotes"
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Control+a');
    await page.keyboard.type('02_my_quotes');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '17_FIGMA_MOBILE_MY_QUOTES_ZOOM.png') });

    // Now let's pan right onto desktop/my_account/02_My Quotes and capture the full artboard
    // We can also pan by dragging on canvas with Spacebar
    console.log('Panning to ensure we have the complete desktop table and header...');
    // Search again for "desktop/my_account/02_My Quotes"
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.press('Control+a');
    await page.keyboard.type('desktop/my_account/02_My Quotes');
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape'); // close search bar
    await page.waitForTimeout(500);
    await page.keyboard.press('Shift+2'); // zoom to desktop artboard
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '18_FIGMA_DESKTOP_ARTBOARD_PERFECT.png') });

    // Zoom into table area specifically
    // scroll down slightly
    await page.mouse.move(centerX, centerY);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '19_FIGMA_DESKTOP_TABLE_CLOSEUP.png') });

    // Scroll down to pagination and footer if any
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '20_FIGMA_DESKTOP_FOOTER_CLOSEUP.png') });

    await context.close();
    console.log('🎉 Done capturing Figma artboards!');
  } catch (err) {
    console.error('Error:', err);
    await context.close().catch(() => {});
  }
})();
