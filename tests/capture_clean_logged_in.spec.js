// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const RAW_SCREENSHOT_PATH = path.join(__dirname, '..', '..', 'Trade_Pricing_Toggle_Screenshots', 'raw_trade_logged_in.png');
const COORDS_PATH = path.join(__dirname, '..', '..', 'Trade_Pricing_Toggle_Screenshots', 'trade_coords.json');

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test('Capture Clean Logged-In Trade PDP and Coords', async ({ page }) => {
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

  // Click on the Trade Pricing Toggle trigger
  console.log('3. Opening Trade Pricing Toggle...');
  const toggleBtn = page.locator('.price-toggle__trigger, button:has-text("Trade"), [data-role="price-toggle-trigger"]').first();
  if (await toggleBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await toggleBtn.click();
    await page.waitForTimeout(1000);
  }

  // Get precise bounding boxes of elements
  const coords = await page.evaluate(() => {
    // 1. Toggle trigger
    const trigger = document.querySelector('.price-toggle__trigger, [data-role="price-toggle-trigger"]') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Trade'));
    const tRect = trigger ? trigger.getBoundingClientRect() : null;

    // 2. Dropdown list / popover
    // find all elements visible with "MSRP" in the toggle area
    const popover = document.querySelector('.price-toggle__list, [popover]:popover-open, .price-toggle__dropdown, .price-toggle ul');
    const pRect = popover ? popover.getBoundingClientRect() : null;

    // 3. Price elements: find the exact text nodes / spans for $1,094.50 and MSRP
    const allSpans = Array.from(document.querySelectorAll('.price, .price-box span, .product-info-price *'));
    const tradePriceSpan = allSpans.find(s => (s.textContent || '').includes('1,094.50') && s.children.length === 0);
    const msrpSpan = allSpans.find(s => (s.textContent || '').includes('2,271.50') && s.children.length === 0);
    
    // Also find the container
    const priceContainer = document.querySelector('.product-info-price, .price-box');

    return {
      trigger: tRect ? { x: tRect.x, y: tRect.y, width: tRect.width, height: tRect.height } : null,
      popover: pRect ? { x: pRect.x, y: pRect.y, width: pRect.width, height: pRect.height } : null,
      tradePrice: tradePriceSpan ? {
        x: tradePriceSpan.getBoundingClientRect().x,
        y: tradePriceSpan.getBoundingClientRect().y,
        width: tradePriceSpan.getBoundingClientRect().width,
        height: tradePriceSpan.getBoundingClientRect().height
      } : null,
      msrpPrice: msrpSpan ? {
        x: msrpSpan.getBoundingClientRect().x,
        y: msrpSpan.getBoundingClientRect().y,
        width: msrpSpan.getBoundingClientRect().width,
        height: msrpSpan.getBoundingClientRect().height
      } : null,
      priceContainer: priceContainer ? {
        x: priceContainer.getBoundingClientRect().x,
        y: priceContainer.getBoundingClientRect().y,
        width: priceContainer.getBoundingClientRect().width,
        height: priceContainer.getBoundingClientRect().height
      } : null
    };
  });

  console.log('Detected coords:', JSON.stringify(coords, null, 2));
  fs.writeFileSync(COORDS_PATH, JSON.stringify(coords, null, 2));

  // Save clean raw screenshot
  await page.screenshot({ path: RAW_SCREENSHOT_PATH });
  console.log(`Saved raw screenshot to: ${RAW_SCREENSHOT_PATH}`);
});
