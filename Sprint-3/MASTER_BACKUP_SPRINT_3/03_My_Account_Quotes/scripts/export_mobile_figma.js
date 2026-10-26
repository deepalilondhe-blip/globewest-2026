const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/figma';

(async () => {
  console.log('🚀 Exporting Mobile My Quotes Artboard...');

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
    await page.waitForTimeout(6000);

    // Search and select "03_my_holds" (which contains mobile quotes design)
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(500);
    await page.keyboard.type('mobile/my_account/03_my_holds');
    await page.waitForTimeout(1500);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    const exportBtn = page.locator('button:has-text("Export 03_my_holds"), button:has-text("Export")').last();
    if (await exportBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }),
        exportBtn.click()
      ]);
      const zipPath = path.join(OUT_DIR, 'FIGMA_EXPORT_MOBILE.zip');
      await download.saveAs(zipPath);
      console.log('🎉 Successfully downloaded mobile export:', zipPath);
    }

    await context.close();
  } catch (err) {
    console.error(err);
    await context.close().catch(() => {});
  }
})();
