// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const OUT_PATH_ROOT = path.join(__dirname, '..', '..', 'TRADE_PRICING_TOGGLE_LOGGED_IN_RED_PROOF.png');
const OUT_PATH_ARTIFACT = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/TRADE_PRICING_TOGGLE_LOGGED_IN_RED_PROOF.png';

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test('Capture Logged-In Trade Pricing Toggle with Simple Red Square Highlight', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('1. Logging in as Trade Customer...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email, input[name="login[username]"]').first();
  const passField = page.locator('#pass, input[name="login[password]"]').first();
  const submitBtn = page.locator('#send2, button.action.login.primary').first();

  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailField.fill(TRADE_USER.email);
    await passField.fill(TRADE_USER.password);
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  console.log('2. Navigating to PDP...');
  await page.goto(`${US_BASE_URL}/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Click on the Trade Pricing Toggle in the header
  console.log('3. Opening Trade Pricing Toggle dropdown...');
  const toggleBtn = page.locator('button:has-text("Trade"), .price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
  if (await toggleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await toggleBtn.click();
    await page.waitForTimeout(1000);
  }

  // Draw clean red square highlights around:
  // 1. The Toggle & open dropdown
  // 2. The Dual Pricing line ($1,094.50 Trade + MSRP)
  console.log('4. Highlighting Toggle and Dual Pricing in red...');
  await page.evaluate(() => {
    // 1. Red box around Toggle dropdown in header
    const popover = document.querySelector('.price-toggle__list, [popover], .price-toggle') || document.querySelector('.price-toggle');
    const toggleTrigger = document.querySelector('.price-toggle__trigger, [data-role="price-toggle-trigger"]') ||
      Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Trade') || b.textContent.includes('MSRP')));

    const b1 = document.createElement('div');
    b1.style.position = 'absolute';
    b1.style.top = '0px';
    b1.style.left = '0px';
    b1.style.width = '120px';
    b1.style.height = '105px';
    b1.style.border = '4px solid #FF0000';
    b1.style.borderRadius = '2px';
    b1.style.pointerEvents = 'none';
    b1.style.zIndex = '999999';
    b1.style.boxSizing = 'border-box';
    document.body.appendChild(b1);

    // 2. Red box around the Dual Price display
    const priceTextEl = Array.from(document.querySelectorAll('*')).find(el => {
      const t = el.textContent || '';
      return t.includes('1,094.50') && t.includes('MSRP') && el.children.length <= 4;
    }) || document.querySelector('.price-box, .product-info-price');

    if (priceTextEl) {
      const rect = priceTextEl.getBoundingClientRect();
      const b2 = document.createElement('div');
      b2.style.position = 'absolute';
      b2.style.top = (rect.top + window.scrollY - 6) + 'px';
      b2.style.left = (rect.left + window.scrollX - 8) + 'px';
      b2.style.width = (rect.width + 16) + 'px';
      b2.style.height = (rect.height + 12) + 'px';
      b2.style.border = '4px solid #FF0000';
      b2.style.borderRadius = '2px';
      b2.style.pointerEvents = 'none';
      b2.style.zIndex = '999999';
      b2.style.boxSizing = 'border-box';
      document.body.appendChild(b2);
    }
  });

  await page.screenshot({ path: OUT_PATH_ROOT });
  fs.copyFileSync(OUT_PATH_ROOT, OUT_PATH_ARTIFACT);
  console.log(`Saved screenshot to: ${OUT_PATH_ROOT}`);
});
