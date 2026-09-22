const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const EMAIL = 'deepali.londhe@overdose.digital';
const PASS = 'Deepali@$1234';

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.resolve(__dirname, '../../Sprint-3/Ticket_41794529_My_Account_Quotes/figma');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Launching Chrome to authenticate Figma and capture My Quotes design...');
  console.log(`URL  : ${FIGMA_URL}`);
  console.log(`Email: ${EMAIL}`);

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
    console.log('🌐 Navigating to Figma My Quotes URL...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Accept cookies if present
    try {
      const cookieBtn = page.locator('button:has-text("Allow all cookies"), button:has-text("Accept All"), button:has-text("Accept all cookies")').first();
      if (await cookieBtn.isVisible({ timeout: 2000 })) {
        console.log('🍪 Accepting cookies...');
        await cookieBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}

    // Check if login modal is present
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const isLoginVisible = await emailInput.isVisible({ timeout: 4000 }).catch(() => false);

    if (isLoginVisible) {
      console.log('🔐 Login modal detected. Entering credentials...');
      await emailInput.fill(EMAIL);
      await page.waitForTimeout(500);

      // Check if password field is already visible or need to press enter
      let passInput = page.locator('input[type="password"], input[name="password"]').first();
      let hasPass = await passInput.isVisible({ timeout: 2000 }).catch(() => false);

      if (!hasPass) {
        console.log('Pressing Enter to reveal password input...');
        await emailInput.press('Enter');
        await page.waitForTimeout(2000);
        passInput = page.locator('input[type="password"], input[name="password"]').first();
      }

      console.log('Filling password...');
      await passInput.fill(PASS);
      await page.waitForTimeout(500);

      const loginBtn = page.locator('button:has-text("Log in"), button[type="submit"]:has-text("Log in")').first();
      console.log('Clicking "Log in"...');
      await loginBtn.click();

      console.log('⏳ Submitted login. Waiting for Figma workspace to authenticate...');
      await page.waitForTimeout(10000);
    } else {
      console.log('Already authenticated or no login modal.');
    }

    console.log('Waiting for Figma canvas element...');
    await page.waitForSelector('canvas', { timeout: 60000 })
      .then(() => console.log('🎉 CANVAS ELEMENT FOUND!'))
      .catch(() => console.log('⚠️ Canvas wait timed out, proceeding to check page state'));

    // Wait for full design tiles to render
    console.log('Rendering design layers (waiting 15s)...');
    await page.waitForTimeout(15000);

    // Dismiss any banner/dialog
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(1000);

    // Zoom to selection: Shift + 2
    console.log('🔍 Zooming to My Quotes selection (Shift + 2)...');
    await page.keyboard.press('Shift+2').catch(() => {});
    await page.waitForTimeout(4000);

    // Capture Overview
    const shot1 = path.join(OUT_DIR, '01_FIGMA_MY_QUOTES_DESIGN.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log('📸 Saved:', shot1);

    // Zoom to 100%: Shift + 0
    console.log('🔍 Zooming to 100% scale (Shift + 0)...');
    await page.keyboard.press('Shift+0').catch(() => {});
    await page.waitForTimeout(4000);

    const shot2 = path.join(OUT_DIR, '02_FIGMA_MY_QUOTES_100PERCENT.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log('📸 Saved:', shot2);

    // Zoom in a bit more: Equal key twice
    await page.keyboard.press('Equal').catch(() => {});
    await page.waitForTimeout(1500);
    await page.keyboard.press('Equal').catch(() => {});
    await page.waitForTimeout(2000);

    const shot3 = path.join(OUT_DIR, '03_FIGMA_MY_QUOTES_ZOOMED_GRID.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log('📸 Saved:', shot3);

    console.log('✅ Figma My Quotes captures successfully completed!');
    await context.close();
  } catch (err) {
    console.error('❌ Error during Figma capture:', err.message);
    const errShot = path.join(OUT_DIR, 'ERROR_FIGMA_CAPTURE.png');
    await page.screenshot({ path: errShot, fullPage: false }).catch(() => {});
    console.log('Saved error screenshot:', errShot);
    await context.close().catch(() => {});
  }
})();
