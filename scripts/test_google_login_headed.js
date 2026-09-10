const { chromium } = require('playwright');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=1-185&p=f&t=j3AhqVjMU1DU4htq-0';
const EMAIL = 'deepali.londhe@overdose.digital';

(async () => {
  console.log('🚀 Launching Google Chrome headed with stealth options...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
      '--no-sandbox',
      '--disable-infobars'
    ]
  });

  const context = await browser.newContext({
    viewport: null,
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  console.log(`🌐 Navigating to Figma: ${FIGMA_URL}`);
  await page.goto(FIGMA_URL, { timeout: 60000 });
  await page.waitForTimeout(3000);

  // Accept cookies
  try {
    const cookieBtn = page.locator('button:has-text("Allow all cookies")').first();
    if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {}

  // Look for Continue with Google button
  const googleBtn = page.locator('button:has-text("Continue with Google")').first();
  console.log('🔘 Locating Continue with Google button...');
  await googleBtn.evaluate(el => {
    el.style.outline = '4px solid #F59E0B';
    el.style.boxShadow = '0 0 16px #F59E0B';
  });
  await page.waitForTimeout(800);

  console.log('🔘 Clicking Continue with Google...');
  const [popup] = await Promise.all([
    context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
    googleBtn.click()
  ]);

  if (!popup) {
    console.log('❌ Popup did not open');
    await browser.close();
    return;
  }

  console.log('✅ Google OAuth popup opened!');
  await popup.waitForLoadState().catch(() => {});
  await popup.waitForTimeout(2000);

  // Check for email input in Google popup
  const googleEmailInput = popup.locator('input[type="email"], #identifierId').first();
  const isEmailVis = await googleEmailInput.isVisible({ timeout: 5000 }).catch(() => false);

  if (isEmailVis) {
    console.log(`✏️ Typing Google Email: ${EMAIL}`);
    await googleEmailInput.evaluate(el => {
      el.style.outline = '4px solid #10B981';
      el.style.boxShadow = '0 0 16px #10B981';
    });
    await popup.waitForTimeout(500);
    await googleEmailInput.fill(EMAIL);
    await popup.waitForTimeout(600);

    const nextBtn = popup.locator('#identifierNext, button:has-text("Next")').first();
    console.log('🔘 Clicking Next in Google popup...');
    await nextBtn.evaluate(el => {
      el.style.outline = '4px solid #F59E0B';
      el.style.boxShadow = '0 0 16px #F59E0B';
    });
    await popup.waitForTimeout(600);
    await nextBtn.click();
    await popup.waitForTimeout(4000);

    await popup.screenshot({ path: 'google_popup_after_next.png' });
    console.log('📸 Captured: google_popup_after_next.png');
    console.log('Popup URL now:', popup.url());
  }

  // Keep open so user can see it or complete authentication
  console.log('⏳ Browser will remain open for 60 seconds on screen for login/MFA if required...');
  await page.waitForTimeout(60000);

  await browser.close();
  console.log('Finished!');
})();
