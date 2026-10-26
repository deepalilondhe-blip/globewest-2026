const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../with_login');
const AU_SHOTS_DIR = path.join(BASE_DIR, 'screenshots/au_trade_retest');
const US_SHOTS_DIR = path.join(BASE_DIR, 'screenshots/us_trade_retest');

[AU_SHOTS_DIR, US_SHOTS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';
const US_BASE_URL = 'https://mcstaging2.globewest.com';

const AU_CREDS = {
  email: 'deepalilondhe576@gmail.com',
  pass: 'Deep@123'
};

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

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

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

async function loginSite(page, loginUrl, creds, siteName) {
  console.log(`\n🔐 Logging into ${siteName} (${loginUrl})...`);
  await page.goto(loginUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await clearOverlays(page);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.log(`   Entering: ${creds.email} ...`);
    await emailField.fill(creds.email);
    await page.fill('#pass', creds.pass);
    await page.click('#send2');
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }
  await clearOverlays(page);
  console.log(`   ✅ Logged in URL on ${siteName}: ${page.url()}`);
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 AU TRADE GROUP UPDATE & CROSS-STOREFRONT AUDIT (HEADED CHROME)');
  console.log('   Testing AU Staging Trade Toggle vs US Staging Trade & MSRP Toggle');
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

  try {
    // -------------------------------------------------------------------------
    // STEP 1: AU STAGING WITH NEW TRADE GROUP
    // -------------------------------------------------------------------------
    console.log('▶ [Step 1/4] Verifying AU Staging (Trade Customer Group)...');
    const pageAU = await context.newPage();
    await loginSite(pageAU, `${AU_BASE_URL}/customer/account/login/`, AU_CREDS, 'AU Staging');

    // Hard reload homepage to bypass cache
    console.log('   Navigating to AU Homepage and performing hard refresh...');
    await pageAU.goto(AU_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageAU.waitForTimeout(2000);
    await pageAU.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await pageAU.waitForTimeout(3000);
    await clearOverlays(pageAU);

    // Check if Trade Pricing Toggle appears on AU
    console.log('   Checking AU Header for Trade Pricing Toggle...');
    const auToggle = pageAU.locator('.price-toggle, button.price-toggle__trigger, [data-role="price-toggle-trigger"], .trade-toggle, a:has-text("Trade")').first();
    const hasAUToggle = await auToggle.isVisible({ timeout: 3000 }).catch(() => false);
    console.log(`   AU Trade Pricing Toggle Present?: ${hasAUToggle}`);

    if (hasAUToggle) {
      await highlightElement(
        pageAU,
        auToggle,
        '🟢 AU TRADE PRICING TOGGLE DETECTED',
        'AU Header now displays trade pricing controls!',
        'pass',
        3000
      );
    } else {
      console.log('   ℹ️ Note: On AU baseline, Trade Pricing is handled automatically without manual toggle (or toggle selector is custom).');
      // Highlight the header panel state
      const headerPanel = pageAU.locator('.panel.header, .header.panel, header.page-header').first();
      await highlightElement(
        pageAU,
        headerPanel,
        'AU TRADE HEADER INSPECTED',
        'Customer logged in with Trade customer group',
        'info',
        2500
      );
    }

    // Capture AU Trade Mega Menu categories
    console.log('   📸 Capturing AU Mega Menu Categories:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`     👉 Hovering AU: "${cat}"...`);
      await clearOverlays(pageAU);
      const navItem = pageAU.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 4000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await pageAU.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');
        await pageAU.screenshot({ path: path.join(AU_SHOTS_DIR, `au_trade_${safeName}.png`) });
      }
    }
    await pageAU.close();

    // -------------------------------------------------------------------------
    // STEP 2: US STAGING (TRADE MODE AUDIT & LIVE DEFECT HIGHLIGHTING)
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 2/4] Verifying US Staging (Trade Mode Active)...');
    const pageUS = await context.newPage();
    await loginSite(pageUS, `${US_BASE_URL}/customer/account/login/`, US_CREDS, 'US Staging');

    // Hard reload US homepage
    console.log('   Navigating to US Homepage and hard reloading...');
    await pageUS.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageUS.waitForTimeout(2000);
    await pageUS.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await pageUS.waitForTimeout(3000);
    await clearOverlays(pageUS);

    // Highlight US Trade toggle
    const usTradeToggle = pageUS.locator('.price-toggle, button.price-toggle__trigger').first();
    if (await usTradeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await highlightElement(
        pageUS,
        usTradeToggle,
        '👁️ US TRADE PRICING ACTIVE',
        'Toggle set to Trade Mode (Wholesale Pricing)',
        'pass',
        2500
      );
    }

    // Hover and highlight defects in Trade mode
    console.log('   📸 Inspecting US Mega Menu in TRADE Mode with Live Highlights:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`     👉 Hovering US Trade: "${cat}"...`);
      await clearOverlays(pageUS);
      const navItem = pageUS.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 4000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await pageUS.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');

        // Check for Outlet leak
        const outletLink = pageUS.locator(`.navigation a[href*="globewestoutlet.com.au"], .navigation a[href*=".com.au"]`).first();
        if (await outletLink.isVisible().catch(() => false)) {
          const leakHref = await outletLink.getAttribute('href');
          console.log(`        🚨 HIGHLIGHTING DEFECT in "${cat}": AU Outlet Leak (${leakHref})`);
          await highlightElement(
            pageUS,
            outletLink,
            '🚨 DEFECT: AU OUTLET LEAK',
            `Points to AU Domain: ${leakHref}`,
            'defect',
            3000
          );
        }

        await pageUS.screenshot({ path: path.join(US_SHOTS_DIR, `us_trade_${safeName}.png`) });
      }
    }

    // -------------------------------------------------------------------------
    // STEP 3: SWITCH US TO "MSRP" MODE & RE-AUDIT
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 3/4] Switching Pricing Toggle to "MSRP" Mode on US...');
    await pageUS.evaluate(() => window.scrollTo(0, 0));
    await pageUS.waitForTimeout(1000);

    const toggleBtn = pageUS.locator('button.price-toggle__trigger').first();
    if (await toggleBtn.isVisible().catch(() => false)) {
      await toggleBtn.click();
      await pageUS.waitForTimeout(1000);

      const msrpOption = pageUS.locator('button[data-view="msrp"], button:has-text("MSRP")').first();
      if (await msrpOption.isVisible().catch(() => false)) {
        await highlightElement(
          pageUS,
          msrpOption,
          '🔄 SWITCHING TO MSRP VIEW',
          'Selecting Retail MSRP mode from dropdown',
          'info',
          2500
        );
        await msrpOption.click();
        await pageUS.waitForTimeout(2500);

        await highlightElement(
          pageUS,
          toggleBtn,
          '🏷️ MSRP MODE ACTIVE',
          'Header now active in MSRP retail view',
          'pass',
          2500
        );
      }
    }

    // Re-check Mega Menu in MSRP mode
    console.log('   📸 Inspecting US Mega Menu in MSRP Mode with Live Highlights:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`     👉 Hovering US MSRP: "${cat}"...`);
      await clearOverlays(pageUS);
      const navItem = pageUS.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 4000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await pageUS.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');

        const outletLink = pageUS.locator(`.navigation a[href*="globewestoutlet.com.au"], .navigation a[href*=".com.au"]`).first();
        if (await outletLink.isVisible().catch(() => false)) {
          const leakHref = await outletLink.getAttribute('href');
          await highlightElement(
            pageUS,
            outletLink,
            '🚨 DEFECT: AU OUTLET LEAK (MSRP MODE)',
            `Points to AU Domain: ${leakHref}`,
            'defect',
            2500
          );
        }

        await pageUS.screenshot({ path: path.join(US_SHOTS_DIR, `us_msrp_${safeName}.png`) });
      }
    }

    console.log('\n========================================================================');
    console.log('✅ RE-TEST COMPLETE WITH AU TRADE GROUP & US TRADE/MSRP MODES!');
    console.log('========================================================================\n');

    await pageUS.waitForTimeout(3000);
    await browser.close();
  } catch (err) {
    console.error('Error during retest:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
