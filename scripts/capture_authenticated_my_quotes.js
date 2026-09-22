const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.resolve(__dirname, '../../Sprint-3/Ticket_41794529_My_Account_Quotes/figma');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Connecting to Figma with authenticated profile...');
  console.log(`Target: ${FIGMA_URL}`);

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--start-maximized'
    ],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    console.log('🌐 Navigating to My Quotes Figma node...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Check cookies
    try {
      const cookieBtn = page.locator('button:has-text("Allow all cookies")').first();
      if (await cookieBtn.isVisible({ timeout: 2000 })) await cookieBtn.click();
    } catch (e) {}

    console.log('Waiting for Figma canvas element...');
    const hasCanvas = await page.waitForSelector('canvas', { timeout: 45000 })
      .then(() => true)
      .catch(() => false);

    console.log('Canvas Loaded:', hasCanvas);
    console.log('Page Title:', await page.title());
    console.log('Page URL:', page.url());

    if (hasCanvas) {
      console.log('🎉 CANVAS ACTIVE! Waiting 15s for high-res vector rendering...');
      await page.waitForTimeout(15000);

      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(1000);

      // Shift + 2: Zoom to selection
      console.log('🔍 Zooming to selection (Shift + 2)...');
      await page.keyboard.press('Shift+2').catch(() => {});
      await page.waitForTimeout(4000);

      const shot1 = path.join(OUT_DIR, '01_FIGMA_MY_QUOTES_DESIGN.png');
      await page.screenshot({ path: shot1, fullPage: false });
      console.log('📸 SAVED 01_FIGMA_MY_QUOTES_DESIGN.png');

      // Shift + 0: Zoom to 100%
      console.log('🔍 Zooming to 100% scale (Shift + 0)...');
      await page.keyboard.press('Shift+0').catch(() => {});
      await page.waitForTimeout(4000);

      const shot2 = path.join(OUT_DIR, '02_FIGMA_MY_QUOTES_100PERCENT.png');
      await page.screenshot({ path: shot2, fullPage: false });
      console.log('📸 SAVED 02_FIGMA_MY_QUOTES_100PERCENT.png');

      // Zoom in a bit more with '+' (Equal)
      await page.keyboard.press('Equal').catch(() => {});
      await page.waitForTimeout(1500);
      await page.keyboard.press('Equal').catch(() => {});
      await page.waitForTimeout(2000);

      const shot3 = path.join(OUT_DIR, '03_FIGMA_MY_QUOTES_ZOOMED_GRID.png');
      await page.screenshot({ path: shot3, fullPage: false });
      console.log('📸 SAVED 03_FIGMA_MY_QUOTES_ZOOMED_GRID.png');

      console.log('🎉 All Figma My Quotes captures completed successfully!');
    } else {
      console.log('⚠️ Canvas not found, capturing current page state...');
      const fallbackShot = path.join(OUT_DIR, 'FIGMA_PAGE_STATE.png');
      await page.screenshot({ path: fallbackShot });
      console.log('Saved fallback:', fallbackShot);
    }

    await page.waitForTimeout(5000);
    await context.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
    await context.close().catch(() => {});
  }
})();
