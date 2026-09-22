const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const EMAIL = 'deepali.londhe@overdose.digital';
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

  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
  if (await emailInput.isVisible({ timeout: 3000 })) {
    await emailInput.fill(EMAIL);
    await page.waitForTimeout(500);
    console.log('Filled email, pressing Enter...');
    await emailInput.press('Enter');
    await page.waitForTimeout(4000);

    const shot = path.join(OUT_DIR, '02_AFTER_ENTER.png');
    await page.screenshot({ path: shot });
    console.log('Saved 02_AFTER_ENTER.png');
  }

  // Check what buttons or inputs are present now
  const buttons = await page.$$eval('button', els => els.map(b => b.innerText.trim()).filter(Boolean));
  console.log('Buttons visible:', buttons);

  const inputs = await page.$$eval('input', els => els.map(i => ({ type: i.type, name: i.name, placeholder: i.placeholder })));
  console.log('Inputs visible:', inputs);

  await page.waitForTimeout(5000);
  await context.close();
})();
