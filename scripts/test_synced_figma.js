const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Sprint-3/Ticket_My_Quotes/figma');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Launching with synced Profile 6 (deepali.londhe@overdose.digital)...');
  
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
    console.log('🌐 Navigating to My Quotes Figma node...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    console.log('Initial page title:', await page.title());

    console.log('Waiting for canvas or UI elements...');
    // Wait up to 25 seconds for canvas
    await page.waitForSelector('canvas', { timeout: 45000 })
      .then(() => console.log('🎉 CANVAS FOUND! FIGMA OPENED SUCCESSFULLY!'))
      .catch(() => console.log('No canvas after 45s'));

    await page.waitForTimeout(10000);

    const title = await page.title();
    console.log('Final Page Title:', title);

    // Zoom to selection
    await page.keyboard.press('Shift+2').catch(() => {});
    await page.waitForTimeout(3000);

    const shot = path.join(OUT_DIR, 'FIGMA_MY_QUOTES_SYNCED_RESULT.png');
    await page.screenshot({ path: shot, fullPage: false });
    console.log('Saved screenshot:', shot);

    await context.close();
    console.log('DONE!');
  } catch (err) {
    console.error('Error:', err.message);
    await context.close().catch(() => {});
  }
})();
