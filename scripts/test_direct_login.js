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
  console.log('🚀 Authenticating directly with Figma Email & Password...');
  console.log(`URL     : ${FIGMA_URL}`);
  console.log(`Email   : ${EMAIL}`);
  console.log(`Password: ${PASS.slice(0, 3)}***`);

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--start-maximized'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    console.log('🌐 Loading Figma URL...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Accept cookies
    try {
      const cookieBtn = page.locator('button:has-text("Allow all cookies")').first();
      if (await cookieBtn.isVisible({ timeout: 2000 })) await cookieBtn.click();
    } catch (e) {}

    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    if (await emailInput.isVisible({ timeout: 4000 })) {
      console.log('Filling email...');
      await emailInput.fill(EMAIL);
      await page.waitForTimeout(500);

      // Press Enter to reveal password
      console.log('Revealing password input...');
      await emailInput.press('Enter');
      await page.waitForTimeout(2000);

      let passInput = page.locator('input[type="password"], input[name="password"]').first();
      if (await passInput.isVisible({ timeout: 3000 })) {
        console.log('Filling password...');
        await passInput.fill(PASS);
        await page.waitForTimeout(500);

        const shotBefore = path.join(OUT_DIR, 'STEP1_CREDENTIALS_ENTERED.png');
        await page.screenshot({ path: shotBefore });
        console.log('📸 Saved STEP1_CREDENTIALS_ENTERED.png');

        const loginBtn = page.locator('button:has-text("Log in"), button[type="submit"]:has-text("Log in")').first();
        console.log('Clicking Log in button...');
        await loginBtn.click();

        // Check 3s, 6s, 10s after click
        await page.waitForTimeout(3000);
        await page.screenshot({ path: path.join(OUT_DIR, 'STEP2_AFTER_CLICK_3S.png') });
        console.log('📸 Saved STEP2_AFTER_CLICK_3S.png');

        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(OUT_DIR, 'STEP3_AFTER_CLICK_8S.png') });
        console.log('📸 Saved STEP3_AFTER_CLICK_8S.png');
      }
    }

    console.log('Current URL:', page.url());
    console.log('Current Title:', await page.title());

    // Check for canvas
    console.log('Waiting up to 40s for canvas...');
    const hasCanvas = await page.waitForSelector('canvas', { timeout: 40000 })
      .then(() => true)
      .catch(() => false);

    console.log('Canvas loaded:', hasCanvas);
    if (hasCanvas) {
      console.log('🎉 SUCCESS! Canvas rendered. Zooming to selection (Shift+2)...');
      await page.waitForTimeout(10000);
      await page.keyboard.press('Escape').catch(() => {});
      await page.keyboard.press('Shift+2').catch(() => {});
      await page.waitForTimeout(3000);

      const designShot = path.join(OUT_DIR, '01_FIGMA_MY_QUOTES_DESIGN.png');
      await page.screenshot({ path: designShot });
      console.log('📸 SAVED 01_FIGMA_MY_QUOTES_DESIGN.png!');
    } else {
      console.log('Capturing final page state...');
      await page.screenshot({ path: path.join(OUT_DIR, 'STEP4_FINAL_STATE.png') });
    }

    await page.waitForTimeout(5000);
    await context.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
    await context.close().catch(() => {});
  }
})();
