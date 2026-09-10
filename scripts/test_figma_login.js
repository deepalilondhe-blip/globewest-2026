const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=1-185&p=f&t=j3AhqVjMU1DU4htq-0';
const EMAIL = 'deepali.londhe@overdose.digital';

(async () => {
  console.log('🚀 Launching Google Chrome headed...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: null
  });

  const page = await context.newPage();

  console.log(`🌐 Navigating to Figma: ${FIGMA_URL}`);
  await page.goto(FIGMA_URL, { timeout: 60000 }).catch(e => console.log('Goto note:', e.message));

  console.log('⏳ Waiting for page to load...');
  await page.waitForTimeout(3000);

  // Take initial screenshot
  await page.screenshot({ path: 'figma_step1_initial.png' });
  console.log('📸 Captured initial screenshot: figma_step1_initial.png');

  // Check and accept cookies if present
  try {
    const cookieBtn = page.locator('button:has-text("Allow all cookies"), button:has-text("Accept All"), button:has-text("Accept all cookies")').first();
    if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('🍪 Clicking Allow all cookies...');
      await cookieBtn.evaluate(el => {
        el.style.outline = '4px solid #F59E0B';
        el.style.boxShadow = '0 0 16px #F59E0B';
      });
      await page.waitForTimeout(400);
      await cookieBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {}

  // Look for email input
  console.log('🔍 Looking for email input field...');
  const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], input[aria-label*="email" i], input').first();
  const hasEmail = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);

  if (hasEmail) {
    console.log(`✏️ Typing email: ${EMAIL}`);
    await emailInput.evaluate(el => {
      el.style.outline = '4px solid #10B981';
      el.style.boxShadow = '0 0 16px #10B981';
    });
    await page.waitForTimeout(400);
    await emailInput.fill(EMAIL);
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'figma_step2_email_entered.png' });
    console.log('📸 Captured email entered: figma_step2_email_entered.png');

    // Click "Continue with email" button
    const submitBtn = page.locator('button:has-text("Continue with email"), button[type="submit"]:has-text("Continue"), button:has-text("Log in"), button:has-text("Continue")').first();
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('🔘 Highlighting and clicking Continue with email...');
      await submitBtn.evaluate(el => {
        el.style.outline = '4px solid #F59E0B';
        el.style.boxShadow = '0 0 16px #F59E0B';
      });
      await page.waitForTimeout(600);
      await submitBtn.click();
      console.log('⏳ Clicked continue with email. Waiting 5s for response...');
      await page.waitForTimeout(5000);

      await page.screenshot({ path: 'figma_step3_after_continue.png' });
      console.log('📸 Captured after continue: figma_step3_after_continue.png');
    }
  } else {
    console.log('⚠️ Could not find email input directly. Checking for Google button...');
    const googleBtn = page.locator('button:has-text("Continue with Google"), div[role="button"]:has-text("Google")').first();
    if (await googleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('🔘 Found Continue with Google button. Highlighting...');
      await googleBtn.evaluate(el => {
        el.style.outline = '4px solid #F59E0B';
        el.style.boxShadow = '0 0 16px #F59E0B';
      });
      await page.screenshot({ path: 'figma_step2_google_button.png' });
    }
  }

  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);
  const title = await page.title();
  console.log(`Current Title: ${title}`);

  console.log('Keeping browser open for 15 seconds to observe...');
  await page.waitForTimeout(15000);

  await browser.close();
  console.log('Done!');
})();
