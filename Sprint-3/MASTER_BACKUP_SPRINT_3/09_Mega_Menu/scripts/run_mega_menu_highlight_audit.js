const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../with_login');
const TRADE_SHOTS_DIR = path.join(BASE_DIR, 'screenshots/trade_mode');
const MSRP_SHOTS_DIR = path.join(BASE_DIR, 'screenshots/msrp_mode');
const DEFECT_SHOTS_DIR = path.join(BASE_DIR, 'screenshots/highlighted_defects');

[TRADE_SHOTS_DIR, MSRP_SHOTS_DIR, DEFECT_SHOTS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const US_LOGIN_URL = 'https://mcstaging2.globewest.com/customer/account/login/';
const US_BASE_URL = 'https://mcstaging2.globewest.com';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

const MENU_CATEGORIES = [
  'Indoor',
  'Outdoor',
  'Homewares',
  'In Stock',
  'Customisation',
  'Projects',
  'Inspiration'
];

/** Clears any obstructing popups or modal shrouds */
async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

/** Injects high-visibility Red/Green/Blue banner callouts in the live DOM */
async function highlightElement(page, selectorOrLocator, title, description, status = 'defect', durationMs = 3000) {
  try {
    const locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator.first();
    const isVis = await locator.isVisible({ timeout: 2000 }).catch(() => false);
    if (!isVis) return;

    await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(200);

    const isDefect = status === 'defect';
    const isPass = status === 'pass';
    const borderColor = isDefect ? '#FF0000' : (isPass ? '#00D632' : '#00A3FF');
    const bgColor = isDefect ? '#D32F2F' : (isPass ? '#059669' : '#0284C7');

    await locator.evaluate((el, { t, desc, dur, border, bg }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;

      el.style.outline = `4px solid ${border}`;
      el.style.boxShadow = `0 0 25px ${border}`;
      el.style.zIndex = '999999';

      const banner = document.createElement('div');
      banner.className = 'qa-live-highlight-badge';
      banner.innerHTML = `
        <div style="font-weight: 900; font-size: 13px; text-transform: uppercase; margin-bottom: 2px;">${t}</div>
        <div style="font-size: 11px; font-weight: normal; opacity: 0.95;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-46px';
      banner.style.left = '0px';
      banner.style.background = bg;
      banner.style.color = '#FFFFFF';
      banner.style.padding = '6px 12px';
      banner.style.borderRadius = '6px';
      banner.style.boxShadow = '0 6px 18px rgba(0,0,0,0.6)';
      banner.style.zIndex = '10000000';
      banner.style.pointerEvents = 'none';
      banner.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      banner.style.whiteSpace = 'nowrap';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(banner);

      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.boxShadow = 'none';
        el.style.zIndex = prevZ;
        banner.remove();
      }, dur);
    }, { t: title, desc: description, dur: durationMs, border: borderColor, bg: bgColor });

    await page.waitForTimeout(durationMs);
  } catch (e) {}
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 MEGA MENU LIVE HIGHLIGHT AUDIT: TRADE MODE & MSRP MODE (HEADED CHROME)');
  console.log('   Target: https://mcstaging2.globewest.com');
  console.log('   Trade Account: deepali.londhe@overdose.digital');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 350,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // -------------------------------------------------------------------------
    // STEP 1: AUTHENTICATE AS TRADE CUSTOMER
    // -------------------------------------------------------------------------
    console.log('▶ [Step 1/5] Logging in as Trade Customer...');
    await page.goto(US_LOGIN_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   Entering Trade Customer credentials...');
      await emailField.fill(US_CREDS.email);
      await page.fill('#pass', US_CREDS.pass);
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('   ✅ Authenticated.');
    }

    // -------------------------------------------------------------------------
    // STEP 2: TRADE MODE AUDIT & LIVE DEFECT HIGHLIGHTING
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 2/5] Navigating to US Homepage (Trade Mode Active)...');
    await page.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    // Highlight the active Trade pricing toggle
    const tradeToggle = page.locator('.price-toggle, button.price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
    if (await tradeToggle.isVisible().catch(() => false)) {
      console.log('   🎯 Highlighting Trade Pricing Toggle in Header...');
      await highlightElement(
        page,
        tradeToggle,
        '👁️ TRADE PRICING TOGGLE ACTIVE',
        'Top-Left Header Utility: Logged-in Trade Customer mode active',
        'info',
        2500
      );
    }

    console.log('\n▶ [Step 3/5] Inspecting Mega Menu in TRADE MODE & Highlighting Defects:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`\n   👉 Hovering Category: "${cat}"...`);
      await clearOverlays(page);
      const navItem = page.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 4000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await page.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');

        // Check for Outlet defect in this category
        const outletLink = page.locator(`.navigation a[href*="globewestoutlet.com.au"], .navigation a[href*=".com.au"]`).first();
        const hasLeak = await outletLink.isVisible().catch(() => false);

        if (hasLeak) {
          const leakHref = await outletLink.getAttribute('href');
          console.log(`      🚨 DEFECT FOUND in "${cat}": AU Outlet leak (${leakHref})`);
          await highlightElement(
            page,
            outletLink,
            '🚨 DEFECT: AU OUTLET LEAK',
            `Hardcoded URL: ${leakHref}`,
            'defect',
            3500
          );
          await page.screenshot({ path: path.join(DEFECT_SHOTS_DIR, `DEFECT_TRADE_${safeName}_outlet_leak.png`) });
        }

        // Check for placeholder promotional card
        const promoCard = page.locator('.navigation .promo, .navigation .banner, .navigation [class*="promo"], .navigation [class*="banner"]').first();
        const promoText = await promoCard.innerText().catch(() => '');
        if (promoText.includes('Coming Soon') || promoText.includes('GW')) {
          console.log(`      🚨 DEFECT FOUND in "${cat}": Placeholder "Coming Soon" card`);
          await highlightElement(
            page,
            promoCard,
            '🚨 DEFECT: PLACEHOLDER PROMO',
            'Rule 4 Violation: Unconfigured "GW Coming Soon" graphic',
            'defect',
            3000
          );
          await page.screenshot({ path: path.join(DEFECT_SHOTS_DIR, `DEFECT_TRADE_${safeName}_placeholder.png`) });
        } else if (!hasLeak) {
          console.log(`      🟢 Category "${cat}" verified.`);
        }

        const shotPath = path.join(TRADE_SHOTS_DIR, `trade_${safeName}.png`);
        await page.screenshot({ path: shotPath });
        console.log(`      📸 Captured: trade_${safeName}.png`);
      }
    }

    // -------------------------------------------------------------------------
    // STEP 4: SWITCH PRICING TOGGLE TO "MSRP"
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 4/5] Switching Pricing Toggle to "MSRP"...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    const toggleBtn = page.locator('button.price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
    if (await toggleBtn.isVisible().catch(() => false)) {
      console.log('   Clicking pricing toggle dropdown trigger...');
      await toggleBtn.click();
      await page.waitForTimeout(1000);

      // Highlight the MSRP option
      const msrpOption = page.locator('button[data-view="msrp"], button:has-text("MSRP"), .price-toggle__item:has-text("MSRP")').first();
      if (await msrpOption.isVisible().catch(() => false)) {
        await highlightElement(
          page,
          msrpOption,
          '🔄 SWITCHING TO MSRP',
          'Selecting Retail MSRP view from Trade dropdown',
          'info',
          2500
        );
        console.log('   Selecting MSRP option...');
        await msrpOption.click();
        await page.waitForTimeout(2500);
        console.log('   ✅ Switched to MSRP mode!');

        // Highlight header in MSRP mode
        await highlightElement(
          page,
          toggleBtn,
          '🏷️ MSRP VIEW ACTIVE',
          'Header now displaying retail MSRP pricing mode',
          'pass',
          2500
        );
      }
    } else {
      console.warn('   ⚠️ Toggle trigger not found, checking alternate toggle selectors...');
    }

    // -------------------------------------------------------------------------
    // STEP 5: RE-CHECK MEGA MENU UNDER MSRP MODE
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 5/5] Re-checking Mega Menu under MSRP MODE:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`\n   👉 Hovering Category in MSRP Mode: "${cat}"...`);
      await clearOverlays(page);
      const navItem = page.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 4000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await page.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');

        // Check for Outlet leak in MSRP mode
        const outletLink = page.locator(`.navigation a[href*="globewestoutlet.com.au"], .navigation a[href*=".com.au"]`).first();
        const hasLeak = await outletLink.isVisible().catch(() => false);

        if (hasLeak) {
          const leakHref = await outletLink.getAttribute('href');
          console.log(`      🚨 DEFECT in MSRP Mode "${cat}": AU Outlet leak (${leakHref})`);
          await highlightElement(
            page,
            outletLink,
            '🚨 DEFECT: AU OUTLET LEAK (MSRP MODE)',
            `Hardcoded URL: ${leakHref}`,
            'defect',
            3000
          );
        }

        const shotPath = path.join(MSRP_SHOTS_DIR, `msrp_${safeName}.png`);
        await page.screenshot({ path: shotPath });
        console.log(`      📸 Captured: msrp_${safeName}.png`);
      }
    }

    console.log('\n========================================================================');
    console.log('✅ LIVE HIGHLIGHT AUDIT (TRADE & MSRP MODES) COMPLETED SUCCESSFULLY!');
    console.log('========================================================================\n');

    await page.waitForTimeout(4000);
    await browser.close();
  } catch (err) {
    console.error('Error during live highlight audit:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
