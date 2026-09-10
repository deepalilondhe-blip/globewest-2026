const { chromium } = require('playwright');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=1-185&p=f&t=j3AhqVjMU1DU4htq-0';
const EMAIL = 'deepali.londhe@overdose.digital';

(async () => {
  console.log('🚀 Launching Google Chrome headed...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
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

  // Fill email
  const emailInput = page.locator('input[type="email"], input[name="email"], input').first();
  await emailInput.fill(EMAIL);
  await page.waitForTimeout(500);

  // Click exact "Continue with email"
  console.log('🔘 Locating exact Continue with email button...');
  const continueEmailBtn = page.locator('button').filter({ hasText: /^Continue with email$/i }).first();
  await continueEmailBtn.evaluate(el => {
    el.style.outline = '4px solid #10B981';
    el.style.boxShadow = '0 0 16px #10B981';
  });
  await page.waitForTimeout(600);
  await continueEmailBtn.click();
  console.log('Clicked Continue with email!');

  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'figma_after_email_click.png' });
  console.log('📸 Captured: figma_after_email_click.png');

  // Let's inspect what elements appeared
  const bodyText = await page.innerText('body');
  console.log('Page excerpt:\n', bodyText.slice(0, 500));

  await page.waitForTimeout(15000);
  await browser.close();
})();
