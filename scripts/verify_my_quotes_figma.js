const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const EMAIL = 'deepali.londhe@overdose.digital';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Sprint-3/Ticket_My_Quotes/figma');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Starting Figma Login / Verification for My Quotes...');
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
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    console.log('🌐 Navigating to Figma URL...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Accept cookies if present
    const cookieBtn = page.locator('button:has-text("Allow all cookies"), button:has-text("Accept All"), button:has-text("Accept all cookies")').first();
    if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('🍪 Accepting cookies...');
      await cookieBtn.click();
      await page.waitForTimeout(1000);
    }

    // Check for email input
    console.log('🔍 Looking for email input...');
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[aria-label*="email" i], input').first();
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log(`✏️ Filling email: ${EMAIL}`);
      await emailInput.fill(EMAIL);
      await page.waitForTimeout(800);

      const shot1 = path.join(OUT_DIR, '01_EMAIL_ENTERED.png');
      await page.screenshot({ path: shot1, fullPage: false });
      console.log('📸 Captured 01_EMAIL_ENTERED.png');

      // Click "Continue with email"
      const continueBtn = page.locator('button:has-text("Continue with email"), button[type="submit"]:has-text("Continue"), button:has-text("Continue")').first();
      if (await continueBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('🔘 Clicking "Continue with email"...');
        await continueBtn.click();
        console.log('⏳ Waiting for next screen / auth redirect...');
        await page.waitForTimeout(6000);

        const shot2 = path.join(OUT_DIR, '02_AFTER_CONTINUE.png');
        await page.screenshot({ path: shot2, fullPage: false });
        console.log('📸 Captured 02_AFTER_CONTINUE.png');
      }
    }

    // Check if canvas or password or SSO screen appeared
    console.log('Page Title:', await page.title());
    console.log('Page URL:', page.url());

    const hasCanvas = await page.$('canvas');
    console.log('Canvas Present:', !!hasCanvas);

    if (hasCanvas) {
      console.log('🎉 Canvas loaded! Zooming to selection (Shift+2)...');
      await page.keyboard.press('Shift+2').catch(() => {});
      await page.waitForTimeout(5000);
      const shot3 = path.join(OUT_DIR, '03_FIGMA_CANVAS_LOADED.png');
      await page.screenshot({ path: shot3, fullPage: false });
      console.log('📸 Captured 03_FIGMA_CANVAS_LOADED.png');
    }

    // Keep open a bit for inspection
    await page.waitForTimeout(10000);
    await context.close();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Error during Figma interaction:', err.message);
    await context.close().catch(() => {});
  }
})();
