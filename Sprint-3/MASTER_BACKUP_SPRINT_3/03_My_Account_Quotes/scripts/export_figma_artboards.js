const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/figma';

(async () => {
  console.log('🚀 Exporting pristine 2x artboards directly from Figma...');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--window-size=1920,1080'
    ],
    viewport: { width: 1920, height: 1080 },
    acceptDownloads: true
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(8000);

    // Search and select "02_My Quotes"
    console.log('Selecting desktop/my_account/02_My Quotes...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.type('desktop/my_account/02_My Quotes');
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Look for export button in right panel
    console.log('Looking for Export button in right properties panel...');
    const exportBtn = page.locator('button:has-text("Export 02_My Quotes"), button:has-text("Export")').last();
    if (await exportBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Found export button:', await exportBtn.innerText());
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }),
        exportBtn.click()
      ]);
      const downloadPath = path.join(OUT_DIR, 'FIGMA_EXPORT_DESKTOP_MY_QUOTES.png');
      await download.saveAs(downloadPath);
      console.log('🎉 Successfully downloaded pristine Figma export:', downloadPath);
    } else {
      console.log('Export button not clickable directly.');
    }

    // Now select Frame 622 (Specifications)
    console.log('Selecting Frame 622...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.type('Frame 622');
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_SPEC_FRAME_622.png') });
    console.log('📸 Saved Frame 622 spec!');

    // Now let's find mobile artboard for quotes
    console.log('Searching for mobile quotes artboard...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.type('mobile/my_account');
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_MOBILE_MY_QUOTES_SPEC.png') });
    console.log('📸 Saved Mobile Quotes spec!');

    await context.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
    await context.close().catch(() => {});
  }
})();
