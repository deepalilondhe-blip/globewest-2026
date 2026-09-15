// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const EVIDENCE_DIR = path.join(__dirname, '..', 'scratch', 'trade-official-account-evidence');

const OFFICIAL_TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

/** Helper: smooth scroll and highlight element with high-visibility banner */
async function showDefect(page, locator, title, description, durationMs = 3500, color = '#2563EB') {
  try {
    const isVis = await locator.isVisible({ timeout: 2500 }).catch(() => false);
    if (!isVis) return;

    await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(300);

    await locator.evaluate((el, { t, desc, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;

      el.style.outline = `4px solid ${col}`;
      el.style.boxShadow = `0 0 20px ${col}`;
      el.style.zIndex = '99999';

      const banner = document.createElement('div');
      banner.className = 'qa-toggle-banner';
      banner.innerHTML = `
        <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px;">${t}</div>
        <div style="font-size: 11px; opacity: 0.95;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-52px';
      banner.style.left = '0px';
      banner.style.background = col;
      banner.style.color = '#ffffff';
      banner.style.padding = '6px 12px';
      banner.style.borderRadius = '6px';
      banner.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6)';
      banner.style.zIndex = '1000000';
      banner.style.pointerEvents = 'none';
      banner.style.whiteSpace = 'nowrap';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(banner);

      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.zIndex = prevZ;
        banner.remove();
      }, dur);
    }, { t: title, desc: description, dur: durationMs, col: color });

    await page.waitForTimeout(durationMs);
  } catch (e) {}
}

test.describe('Official Trade Account Verification (deepali.londhe@overdose.digital)', () => {

  test('Login with Official Overdose Trade Account & Verify Price Toggle on PLP', async ({ page }) => {
    test.setTimeout(240000);

    if (!fs.existsSync(EVIDENCE_DIR)) {
      fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
    }

    console.log('\n============================================================');
    console.log('🔐 LOGGING IN WITH OFFICIAL OVERDOSE TRADE ACCOUNT');
    console.log(`Email: ${OFFICIAL_TRADE_USER.email}`);
    console.log(`Target: ${US_BASE_URL}`);
    console.log('============================================================\n');

    await page.setViewportSize({ width: 1440, height: 900 });

    // Step 1: Login
    await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(2000);

    // Dismiss popups
    for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
    }

    const emailField = page.locator('#email, input[name="login[username]"]').first();
    const passField = page.locator('#pass, input[name="login[password]"]').first();
    const submitBtn = page.locator('#send2, button.action.login.primary').first();

    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('Entering official Trade credentials...');
      await emailField.fill(OFFICIAL_TRADE_USER.email);
      await passField.fill(OFFICIAL_TRADE_USER.password);
      await submitBtn.click();
      await page.waitForTimeout(5000);
    }

    const afterLoginUrl = page.url();
    const isLoggedIn = afterLoginUrl.includes('/customer/account') && !afterLoginUrl.includes('/login');
    console.log(`\nLogin Result: ${isLoggedIn ? '✅ LOGGED IN SUCCESSFULLY as deepali.londhe@overdose.digital' : '⚠️ Login redirect: ' + afterLoginUrl}`);

    // Capture My Account Dashboard
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '01_TRADE_ACCOUNT_DASHBOARD.png') });

    // Step 2: Navigate to PLP (/indoor)
    console.log('\nNavigating to /indoor as Trade Customer...');
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 50000 });
    await page.waitForTimeout(3000);

    // Step 3: Scan for Price Toggle
    console.log('Scanning for Price Toggle in Header & Toolbar...');
    const scanResults = await page.evaluate(() => {
      const allSelects = Array.from(document.querySelectorAll('select')).map(s => ({
        html: s.outerHTML.substring(0, 120),
        options: Array.from(s.options).map(o => o.text.trim())
      }));

      const allToggles = Array.from(document.querySelectorAll('[class*="toggle"], [class*="switch"], [data-role*="toggle"]')).map(el => ({
        tag: el.tagName,
        class: el.className,
        text: el.textContent.trim().substring(0, 60)
      }));

      const headerLinks = Array.from(document.querySelectorAll('.header.panel a, .page-header a, .panel.wrapper a')).map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute('href')
      }));

      return { allSelects, allToggles, headerLinks };
    });
    console.log('Toggle Scan:', JSON.stringify(scanResults, null, 2));

    // Look for specific toggle elements
    const toggle = page.locator('select.price-toggle, select.pricing-toggle, .pricing-toggle, .price-view-switcher, select:has(option:has-text("Trade")), select:has(option:has-text("RRP")), select:has(option:has-text("MSRP"))').first();
    const hasToggle = await toggle.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`\nPrice Toggle Dropdown Visible: ${hasToggle}`);

    if (hasToggle) {
      await showDefect(page, toggle, '🟢 TRADE TOGGLE ACTIVE', 'Found Trade Pricing Toggle Dropdown!', 4000, '#00E676');
      
      // Try toggling to RRP/MSRP
      const options = await toggle.locator('option').allTextContents().catch(() => []);
      console.log('Toggle Options:', options);
      if (options.length > 1) {
        console.log('Testing toggle switch to second option...');
        await toggle.selectOption({ index: 1 });
        await page.waitForTimeout(3000);
      }
    } else {
      const topBar = page.locator('.header.panel, .page-header, .header-utility').first();
      await showDefect(page, topBar, '🔴 DEFECT: Trade Pricing Toggle Missing in Header', 'Logged in as Trade customer, but no pricing toggle dropdown found', 4000, '#FF0033');
    }

    // Step 4: Audit Product Card Pricing
    console.log('\nAuditing Product Card Pricing...');
    const firstCard = page.locator('.product-item').first();
    await firstCard.scrollIntoViewIfNeeded();

    const cardPricing = await firstCard.evaluate(card => {
      const priceBox = card.querySelector('.price-box, .price-wrapper, [data-role="priceBox"]');
      const allText = card.textContent.replace(/\s+/g, ' ').trim();
      const details = card.querySelector('.product-item-details');
      return {
        hasPriceBox: !!priceBox,
        priceBoxText: priceBox ? priceBox.textContent.replace(/\s+/g, ' ').trim() : 'NONE',
        cardSnippet: allText.substring(0, 150),
        containsDollar: allText.includes('$')
      };
    });
    console.log('Card Pricing Result:', JSON.stringify(cardPricing, null, 2));

    if (cardPricing.containsDollar) {
      await showDefect(page, firstCard, '🟢 TRADE PRICING VISIBLE', `Rendered: "${cardPricing.priceBoxText}"`, 4000, '#00E676');
    } else {
      await showDefect(page, firstCard, '🔴 DEFECT: Card Pricing Still Blank', 'Logged in as Trade, but no price rendered on product card', 4000, '#FF0033');
    }

    // Capture screenshot of PLP with Trade User
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '02_TRADE_PLP_VIEW.png'), fullPage: false });
    console.log('\n✅ Trade account PLP audit complete! Pausing 4 seconds for viewing...');
    await page.waitForTimeout(4000);
  });
});
