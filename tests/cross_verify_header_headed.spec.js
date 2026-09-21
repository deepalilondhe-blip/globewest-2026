// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_URL = 'https://mcstaging2.globewest.com';
const AU_URL = 'https://mcstaging2.globewest.com.au';

const OUT_DIR = path.join(__dirname, '..', '..', 'Header_Cross_Verification');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test('Cross-verify US vs AU Header in Headed Mode', async ({ page }) => {
  test.setTimeout(240000);
  await page.setViewportSize({ width: 1440, height: 900 });

  // ─────────────────────────────────────────────────────────────
  // 1. AU STOREFRONT (BASELINE) - HEADED MODE
  // ─────────────────────────────────────────────────────────────
  console.log('1. Navigating to AU Storefront (Baseline):', AU_URL);
  await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);

  // Capture AU clean header
  const auHeaderScreenshot = path.join(OUT_DIR, '01_AU_Baseline_Header_Raw.png');
  await page.screenshot({
    path: auHeaderScreenshot,
    clip: { x: 0, y: 0, width: 1440, height: 160 }
  });
  console.log('Saved AU Baseline Header screenshot:', auHeaderScreenshot);

  // ─────────────────────────────────────────────────────────────
  // 2. US STOREFRONT (GUEST MODE) - HEADED MODE
  // ─────────────────────────────────────────────────────────────
  console.log('2. Navigating to US Storefront (Guest):', US_URL);
  await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);

  // Capture US Guest clean header
  const usGuestScreenshot = path.join(OUT_DIR, '02_US_Guest_Header_Raw.png');
  await page.screenshot({
    path: usGuestScreenshot,
    clip: { x: 0, y: 0, width: 1440, height: 160 }
  });
  console.log('Saved US Guest Header screenshot:', usGuestScreenshot);

  // ─────────────────────────────────────────────────────────────
  // 3. US STOREFRONT (LOGGED-IN TRADE MODE) - HEADED MODE
  // ─────────────────────────────────────────────────────────────
  console.log('3. Logging in as Trade customer on US Storefront...');
  await page.goto(`${US_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email').first();
  const passField = page.locator('#pass').first();
  const submitBtn = page.locator('#send2').first();

  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill(TRADE_USER.email);
    await passField.fill(TRADE_USER.password);
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  console.log('4. Navigating back to US Storefront as authenticated Trade customer...');
  await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(4000);

  // Get exact bounding box of "Become a Trade Customer" link on US Staging
  const tradeLinkBox = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('.panel.header a, .header-top a, a')).find(a =>
      a.textContent?.trim().toLowerCase() === 'become a trade customer'
    );
    if (link) {
      const r = link.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    }
    return null;
  });

  console.log('US Trade "Become a Trade Customer" Link Box:', tradeLinkBox);

  // Capture US Trade Logged-In clean header
  const usTradeScreenshot = path.join(OUT_DIR, '03_US_Trade_Logged_In_Header_Raw.png');
  await page.screenshot({
    path: usTradeScreenshot,
    clip: { x: 0, y: 0, width: 1440, height: 160 }
  });
  console.log('Saved US Trade Logged-In Header screenshot:', usTradeScreenshot);

  // Save coordinates
  fs.writeFileSync(path.join(OUT_DIR, 'coords.json'), JSON.stringify({ tradeLinkBox }, null, 2));
});
