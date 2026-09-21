// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const OUT_DIR = path.join(__dirname, '..', '..', 'mobile_audit');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test('Inspect Mobile View Behavior for Trade Pricing Toggle and Eye Icon Slideout', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14/15 mobile viewport

  // 1. Check Guest Mode on Mobile
  console.log('--- 1. Testing Mobile Guest Mode ---');
  await page.goto(`${US_BASE_URL}/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: path.join(OUT_DIR, '01_mobile_guest_pdp.png') });

  const guestInfo = await page.evaluate(() => {
    const utilityBar = document.querySelector('.header-top, .panel.wrapper, .utility-bar, .top-bar');
    const priceToggle = document.querySelector('.price-toggle');
    const eyeIcon = Array.from(document.querySelectorAll('button, [class*="eye"], .price-toggle__trigger')).find(b => b.textContent?.includes('Trade') || b.className.includes('eye') || b.className.includes('price-toggle'));
    const prices = Array.from(document.querySelectorAll('.price, .price-box')).map(p => p.textContent?.trim()).filter(Boolean);
    return {
      utilityBarVisible: utilityBar ? window.getComputedStyle(utilityBar).display !== 'none' : false,
      priceToggleVisible: priceToggle ? window.getComputedStyle(priceToggle).display !== 'none' : false,
      eyeIconFound: !!eyeIcon,
      prices
    };
  });
  console.log('Guest Mobile Info:', JSON.stringify(guestInfo, null, 2));

  // 2. Login on Mobile
  console.log('--- 2. Logging in on Mobile ---');
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

  // 3. Navigate to PDP on Mobile as Logged-In Trade Customer
  console.log('--- 3. Navigating to PDP as Logged-In Trade Customer on Mobile ---');
  await page.goto(`${US_BASE_URL}/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: path.join(OUT_DIR, '02_mobile_trade_logged_in_pdp.png') });

  // 4. Inspect Header & Eye Icon / Toggle on Mobile
  const loggedInInfo = await page.evaluate(() => {
    const toggle = document.querySelector('.price-toggle');
    const trigger = document.querySelector('.price-toggle__trigger, [data-role="price-toggle-trigger"]') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Trade'));
    const allButtons = Array.from(document.querySelectorAll('header button, .header-top button, [class*="toggle"]')).map(b => ({
      class: b.className,
      text: b.textContent?.trim(),
      html: b.outerHTML.substring(0, 100),
      rect: b.getBoundingClientRect()
    }));

    const slideoutElements = Array.from(document.querySelectorAll('[class*="slide"], [class*="drawer"], [class*="modal"], [class*="popup"], [class*="popover"], aside, [role="dialog"]')).map(el => ({
      tag: el.tagName,
      class: el.className,
      id: el.id
    }));

    return {
      hasToggle: !!toggle,
      toggleRect: toggle ? toggle.getBoundingClientRect() : null,
      triggerFound: !!trigger,
      triggerRect: trigger ? trigger.getBoundingClientRect() : null,
      buttons: allButtons,
      slideoutElements
    };
  });
  console.log('Logged In Mobile Info:', JSON.stringify(loggedInInfo, null, 2));

  // 5. Try Clicking the Eye Icon / Trigger on Mobile
  console.log('--- 4. Clicking Eye Icon / Trigger on Mobile ---');
  const trigger = page.locator('.price-toggle__trigger, button:has-text("Trade"), [data-role="price-toggle-trigger"]').first();
  if (await trigger.isVisible({ timeout: 5000 }).catch(() => false)) {
    await trigger.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, '03_mobile_toggle_clicked.png') });

    const openStateInfo = await page.evaluate(() => {
      // Find open drawers, popovers, slideouts
      const activeElements = Array.from(document.querySelectorAll('.active, .open, [aria-hidden="false"], [popover]:popover-open, [class*="slide"], [class*="drawer"], [role="dialog"], .price-toggle__list')).map(el => ({
        tag: el.tagName,
        class: el.className,
        id: el.id,
        text: el.innerText?.substring(0, 150),
        rect: el.getBoundingClientRect()
      }));
      return activeElements;
    });
    console.log('Open state elements on mobile:', JSON.stringify(openStateInfo, null, 2));
  } else {
    console.log('Trigger NOT visible on mobile!');
  }
});
