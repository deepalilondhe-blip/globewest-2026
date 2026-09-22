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
  console.log('🚀 Starting Google SSO Login for Figma...');
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
    console.log('🌐 Navigating to Figma My Quotes URL...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Accept cookies
    try {
      const cookieBtn = page.locator('button:has-text("Allow all cookies"), button:has-text("Accept All"), button:has-text("Accept all cookies")').first();
      if (await cookieBtn.isVisible({ timeout: 2000 })) {
        await cookieBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}

    // Check if Continue with Google button is present
    const googleBtn = page.locator('button:has-text("Continue with Google"), div[role="button"]:has-text("Continue with Google")').first();
    const isGoogleVisible = await googleBtn.isVisible({ timeout: 4000 }).catch(() => false);

    if (isGoogleVisible) {
      console.log('🔘 Clicking "Continue with Google"...');
      const [popup] = await Promise.all([
        context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
        googleBtn.click()
      ]);

      if (popup) {
        console.log('Google Auth popup opened:', popup.url());
        await popup.waitForLoadState('domcontentloaded').catch(() => {});
        await popup.waitForTimeout(2000);

        // Check if account is listed to click
        const accountChooser = popup.locator(`[data-email="${EMAIL}"], div:has-text("${EMAIL}")`).first();
        if (await accountChooser.isVisible({ timeout: 3000 }).catch(() => false)) {
          console.log(`Selecting listed account: ${EMAIL}...`);
          await accountChooser.click();
          await popup.waitForTimeout(3000);
        } else {
          // Fill email
          const googleEmail = popup.locator('input[type="email"], #identifierId').first();
          if (await googleEmail.isVisible({ timeout: 3000 }).catch(() => false)) {
            console.log(`Entering Google email: ${EMAIL}...`);
            await googleEmail.fill(EMAIL);
            await popup.waitForTimeout(500);

            const nextBtn = popup.locator('#identifierNext, button:has-text("Next")').first();
            console.log('Clicking Next on email...');
            await nextBtn.click();
            await popup.waitForTimeout(4000);
          }
        }

        // Fill password
        const googlePass = popup.locator('input[type="password"], input[name="Passwd"], input[name="password"]').first();
        if (await googlePass.isVisible({ timeout: 5000 }).catch(() => false)) {
          console.log('Entering Google password...');
          await googlePass.fill(PASS);
          await popup.waitForTimeout(500);

          const passNext = popup.locator('#passwordNext, button:has-text("Next")').first();
          console.log('Clicking Next on password...');
          await passNext.click();
          console.log('Submitted Google password. Waiting for auth redirect...');
          await popup.waitForTimeout(6000);
        } else {
          console.log('Password field not immediately visible (might be SSO redirect or 2FA prompt)...');
        }
      }
    } else {
      console.log('Continue with Google button not visible (already authenticated or custom modal).');
    }

    // Wait for main Figma page to reach canvas
    console.log('Waiting for Figma workspace canvas to load...');
    const hasCanvas = await page.waitForSelector('canvas', { timeout: 60000 })
      .then(() => true)
      .catch(() => false);

    console.log('Figma Canvas Loaded:', hasCanvas);
    console.log('Current Page Title:', await page.title());

    if (hasCanvas) {
      console.log('🎉 CANVAS ACTIVE! Rendering design artboards (waiting 15s)...');
      await page.waitForTimeout(15000);

      // Dismiss any popups
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(1000);

      // Zoom to selection (Shift + 2)
      console.log('🔍 Zooming to My Quotes selection (Shift + 2)...');
      await page.keyboard.press('Shift+2').catch(() => {});
      await page.waitForTimeout(4000);

      const shot1 = path.join(OUT_DIR, '01_FIGMA_MY_QUOTES_DESIGN.png');
      await page.screenshot({ path: shot1, fullPage: false });
      console.log('📸 Saved:', shot1);

      // Zoom to 100% (Shift + 0)
      console.log('🔍 Zooming to 100% scale (Shift + 0)...');
      await page.keyboard.press('Shift+0').catch(() => {});
      await page.waitForTimeout(4000);

      const shot2 = path.join(OUT_DIR, '02_FIGMA_MY_QUOTES_100PERCENT.png');
      await page.screenshot({ path: shot2, fullPage: false });
      console.log('📸 Saved:', shot2);

      // Zoom in a bit more
      await page.keyboard.press('Equal').catch(() => {});
      await page.waitForTimeout(1500);
      await page.keyboard.press('Equal').catch(() => {});
      await page.waitForTimeout(2000);

      const shot3 = path.join(OUT_DIR, '03_FIGMA_MY_QUOTES_ZOOMED_GRID.png');
      await page.screenshot({ path: shot3, fullPage: false });
      console.log('📸 Saved:', shot3);

      console.log('🎉 SUCCESS: All My Quotes Figma artboards captured!');
    } else {
      console.log('⚠️ Canvas not reached within 60s. Capturing current state screenshot...');
      const fallbackShot = path.join(OUT_DIR, 'FIGMA_CURRENT_AUTH_STATE.png');
      await page.screenshot({ path: fallbackShot, fullPage: false });
      console.log('Saved fallback:', fallbackShot);
    }

    // Keep window open for 30 seconds so Deepali can view or interact if 2FA prompt appears
    console.log('Keeping window visible for 30s...');
    await page.waitForTimeout(30000);
    await context.close();
    console.log('Browser session closed.');
  } catch (err) {
    console.error('Error during Google login:', err.message);
    await context.close().catch(() => {});
  }
})();
