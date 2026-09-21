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

test('Capture Logged-In Trade Pricing Toggle with exact red box', async ({ page }) => {
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

  // Click on the Trade Pricing Toggle in the header so the dropdown shows Trade / MSRP
  console.log('3. Inspecting Trade Pricing Toggle...');
  const toggleBtn = page.locator('.price-toggle__trigger, button:has-text("Trade"), [data-role="price-toggle-trigger"]').first();
  if (await toggleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await toggleBtn.click();
    await page.waitForTimeout(1000);
  }

  // Get exact bounding boxes
  const toggleBox = await page.evaluate(() => {
    // Look for the toggle container or popover
    const popover = document.querySelector('.price-toggle__list, [popover]:popover-open, .price-toggle');
    const trigger = document.querySelector('.price-toggle__trigger, [data-role="price-toggle-trigger"]') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Trade'));
    
    let rect;
    if (popover && popover.getBoundingClientRect().height > 20) {
      const pRect = popover.getBoundingClientRect();
      const tRect = trigger ? trigger.getBoundingClientRect() : pRect;
      const top = Math.min(pRect.top, tRect.top);
      const left = Math.min(pRect.left, tRect.left);
      const right = Math.max(pRect.right, tRect.right);
      const bottom = Math.max(pRect.bottom, tRect.bottom);
      rect = { x: left, y: top, width: right - left, height: bottom - top };
    } else if (trigger) {
      rect = trigger.getBoundingClientRect();
    }
    return rect ? { x: rect.x || rect.left, y: rect.y || rect.top, width: rect.width, height: rect.height } : null;
  });

  console.log('Toggle bounding box:', toggleBox);

  // Find exact price element
  const priceBox = await page.evaluate(() => {
    // Look for element containing $1,094 or price-box
    const allEls = Array.from(document.querySelectorAll('*'));
    // Find smallest element containing $1,094
    const candidates = allEls.filter(el => {
      const text = el.innerText || el.textContent || '';
      return text.includes('1,094') && (text.includes('MSRP') || text.includes('2,271'));
    });
    // Sort by length of text ascending to get the most specific container
    candidates.sort((a, b) => (a.innerText || a.textContent || '').length - (b.innerText || b.textContent || '').length);
    const target = candidates[0] || document.querySelector('.product-info-price, .price-box');
    if (target) {
      const r = target.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height, text: (target.innerText || target.textContent || '').trim() };
    }
    return null;
  });

  console.log('Price bounding box:', priceBox);

  // Draw clean red outlines
  await page.evaluate(({ tBox, pBox }) => {
    if (tBox) {
      const el = document.createElement('div');
      el.id = 'qa-highlight-toggle';
      el.style.position = 'fixed';
      el.style.left = `${Math.max(0, tBox.x - 4)}px`;
      el.style.top = `${Math.max(0, tBox.y - 4)}px`;
      el.style.width = `${tBox.width + 8}px`;
      el.style.height = `${tBox.height + 8}px`;
      el.style.border = '3px solid #E53935'; // simple clean red
      el.style.borderRadius = '4px';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '9999999';
      el.style.boxSizing = 'border-box';
      document.body.appendChild(el);
    }

    if (pBox) {
      const el = document.createElement('div');
      el.id = 'qa-highlight-price';
      el.style.position = 'absolute';
      el.style.left = `${Math.max(0, pBox.x - 8)}px`;
      el.style.top = `${Math.max(0, pBox.y - 6)}px`;
      el.style.width = `${pBox.width + 16}px`;
      el.style.height = `${pBox.height + 12}px`;
      el.style.border = '3px solid #E53935'; // simple clean red
      el.style.borderRadius = '4px';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '9999999';
      el.style.boxSizing = 'border-box';
      document.body.appendChild(el);
    }
  }, { tBox: toggleBox, pBox: priceBox });

  await page.waitForTimeout(500);

  // Take the screenshot
  await page.screenshot({ path: OUT_PATH_ROOT });
  fs.copyFileSync(OUT_PATH_ROOT, OUT_PATH_ARTIFACT);
  console.log(`Saved screenshot to: ${OUT_PATH_ROOT}`);
});
