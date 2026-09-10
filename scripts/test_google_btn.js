const { chromium } = require('playwright');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=1-185&p=f&t=j3AhqVjMU1DU4htq-0';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

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
  console.log('Google button visible:', await googleBtn.isVisible());

  // Listen for popup
  const [popup] = await Promise.all([
    context.waitForEvent('page', { timeout: 10000 }).catch(() => null),
    googleBtn.click()
  ]);

  console.log('Popup opened:', !!popup);
  if (popup) {
    await popup.waitForLoadState().catch(() => {});
    console.log('Popup URL:', popup.url());
    console.log('Popup Title:', await popup.title());
    await popup.screenshot({ path: 'google_popup.png' });
  } else {
    console.log('Page URL after click:', page.url());
    await page.screenshot({ path: 'google_click_page.png' });
  }

  await page.waitForTimeout(10000);
  await browser.close();
})();
