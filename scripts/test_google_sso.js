const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Sprint-3/Ticket_My_Quotes/figma');

(async () => {
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--start-maximized'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto(FIGMA_URL, { timeout: 60000 });
  await page.waitForTimeout(3000);

  // Accept cookies
  try {
    const cookieBtn = page.locator('button:has-text("Allow all cookies")').first();
    if (await cookieBtn.isVisible({ timeout: 2000 })) await cookieBtn.click();
  } catch (e) {}

  const googleBtn = page.locator('button:has-text("Continue with Google")').first();
  if (await googleBtn.isVisible({ timeout: 4000 })) {
    console.log('Found Continue with Google. Clicking...');
    const [popup] = await Promise.all([
      context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
      googleBtn.click()
    ]);

    if (popup) {
      console.log('Google Popup opened! URL:', popup.url());
      await popup.waitForTimeout(3000);
      const shot = path.join(OUT_DIR, '04_GOOGLE_POPUP.png');
      await popup.screenshot({ path: shot });
      console.log('Saved 04_GOOGLE_POPUP.png');

      // Check if deepali email is visible in popup
      const accountOption = popup.locator('div:has-text("deepali.londhe@overdose.digital"), [data-email="deepali.londhe@overdose.digital"]').first();
      if (await accountOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('Found overdose account in popup! Clicking it...');
        await accountOption.click();
        await page.waitForTimeout(6000);
      } else {
        console.log('Overdose account not listed automatically in popup.');
        const emailInput = popup.locator('input[type="email"]').first();
        if (await emailInput.isVisible({ timeout: 2000 })) {
          console.log('Popup has email input.');
          await emailInput.fill('deepali.londhe@overdose.digital');
          await popup.locator('button:has-text("Next"), #identifierNext').first().click();
          await popup.waitForTimeout(3000);
          await popup.screenshot({ path: path.join(OUT_DIR, '05_GOOGLE_POPUP_NEXT.png') });
        }
      }
    }
  }

  // Check main page
  await page.waitForTimeout(5000);
  const canvas = await page.$('canvas');
  console.log('Main Page Canvas Present:', !!canvas);
  if (canvas) {
    await page.keyboard.press('Shift+2').catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_MY_QUOTES_AUTHENTICATED.png') });
    console.log('🎉 SAVED FIGMA_MY_QUOTES_AUTHENTICATED.png');
  }

  await page.waitForTimeout(5000);
  await context.close();
})();
