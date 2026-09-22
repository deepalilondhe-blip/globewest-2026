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
  console.log('🚀 Executing Google SSO Login Flow...');
  console.log(`Email   : ${EMAIL}`);
  console.log(`Password: ${PASS.slice(0, 3)}***`);

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
    console.log('🌐 Loading Figma...');
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Accept cookies
    try {
      const cookieBtn = page.locator('button:has-text("Allow all cookies")').first();
      if (await cookieBtn.isVisible({ timeout: 2000 })) await cookieBtn.click();
    } catch (e) {}

    const googleBtn = page.locator('button:has-text("Continue with Google")').first();
    console.log('Waiting for "Continue with Google" button...');
    await googleBtn.waitFor({ state: 'visible', timeout: 8000 });

    console.log('🔘 Clicking "Continue with Google"...');
    const [popup] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }),
      googleBtn.click()
    ]);

    console.log('Popup URL:', popup.url());
    await popup.waitForLoadState('domcontentloaded');
    await popup.waitForTimeout(2000);

    const shot1 = path.join(OUT_DIR, 'POPUP_01_EMAIL_SCREEN.png');
    await popup.screenshot({ path: shot1 });
    console.log('📸 Saved:', shot1);

    // Check if account already listed
    const accountOption = popup.locator(`[data-email="${EMAIL}"], div:has-text("${EMAIL}")`).first();
    if (await accountOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Clicking listed account...');
      await accountOption.click();
      await popup.waitForTimeout(3000);
    } else {
      // Type email
      const emailInput = popup.locator('input[type="email"], #identifierId').first();
      console.log('Typing email into Google popup...');
      await emailInput.fill(EMAIL);
      await popup.waitForTimeout(500);

      console.log('Clicking Next on email...');
      const nextBtn = popup.locator('#identifierNext, button:has-text("Next")').first();
      await nextBtn.click();
      console.log('Clicked Next. Waiting for password screen...');
    }

    // Wait and inspect what happens after Next
    await popup.waitForTimeout(3000);
    const shot2 = path.join(OUT_DIR, 'POPUP_02_AFTER_EMAIL_3S.png');
    await popup.screenshot({ path: shot2 });
    console.log('📸 Saved:', shot2);

    console.log('Popup URL now:', popup.url());
    console.log('Popup Title now:', await popup.title());

    // Look for password field with multiple selectors
    const passInput = popup.locator('input[type="password"], input[name="Passwd"], input[name="password"]').first();
    const hasPass = await passInput.isVisible({ timeout: 6000 }).catch(() => false);
    console.log('Password input visible:', hasPass);

    if (hasPass) {
      console.log('Entering password...');
      await passInput.fill(PASS);
      await popup.waitForTimeout(500);

      const shotPass = path.join(OUT_DIR, 'POPUP_03_PASSWORD_ENTERED.png');
      await popup.screenshot({ path: shotPass });
      console.log('📸 Saved:', shotPass);

      console.log('Clicking Next on password...');
      const passNext = popup.locator('#passwordNext, button:has-text("Next")').first();
      await passNext.click();
      console.log('Submitted password. Waiting for auth redirect...');
      await popup.waitForTimeout(6000);

      const shotAfterPass = path.join(OUT_DIR, 'POPUP_04_AFTER_PASS_SUBMIT.png');
      await popup.screenshot({ path: shotAfterPass }).catch(() => {});
      console.log('📸 Saved:', shotAfterPass);
    } else {
      console.log('Dumping popup page text:');
      const bodyText = await popup.innerText('body').catch(() => 'N/A');
      console.log('Popup Body Text:\n', bodyText.slice(0, 500));
    }

    // Wait for main Figma page
    console.log('Waiting up to 45s for main Figma page to render canvas...');
    const hasCanvas = await page.waitForSelector('canvas', { timeout: 45000 })
      .then(() => true)
      .catch(() => false);

    console.log('Canvas loaded:', hasCanvas);
    if (hasCanvas) {
      console.log('🎉 Canvas loaded! Waiting 15s to render design...');
      await page.waitForTimeout(15000);
      await page.keyboard.press('Escape').catch(() => {});
      await page.keyboard.press('Shift+2').catch(() => {});
      await page.waitForTimeout(3000);

      const shotFinal = path.join(OUT_DIR, '01_FIGMA_MY_QUOTES_DESIGN.png');
      await page.screenshot({ path: shotFinal });
      console.log('📸 SAVED 01_FIGMA_MY_QUOTES_DESIGN.png!');
    } else {
      const shotMain = path.join(OUT_DIR, 'MAIN_PAGE_FINAL_STATE.png');
      await page.screenshot({ path: shotMain });
      console.log('Saved main page state:', shotMain);
    }

    console.log('Keeping open for 20s...');
    await page.waitForTimeout(20000);
    await context.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error during Google flow:', err.message);
    await context.close().catch(() => {});
  }
})();
