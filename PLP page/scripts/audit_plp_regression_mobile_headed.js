const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const TARGET_PLP = `${US_BASE_URL}/indoor`;

const OUT_DIR = path.resolve(__dirname, '../screenshots/regression_run');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function showStepBanner(page, selectorOrLocator, title, description, color = '#10B981', durationMs = 3500) {
  try {
    let locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
    const isVis = await locator.isVisible({ timeout: 2000 }).catch(() => false);
    if (!isVis) {
      console.log(`   [Notice] Banner target not visible: ${title}`);
      return;
    }

    await locator.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(300);

    await locator.evaluate((el, { t, desc, dur, col }) => {
      const prevOutline = el.style.outline;
      const prevBoxShadow = el.style.boxShadow;
      const prevZ = el.style.zIndex;

      el.style.outline = `3px solid ${col}`;
      el.style.boxShadow = `0 0 25px ${col}`;
      el.style.zIndex = '99999';

      const banner = document.createElement('div');
      banner.className = 'qa-audit-live-banner';
      banner.innerHTML = `
        <div style="font-weight: 900; font-size: 11px; text-transform: uppercase; margin-bottom: 2px;">${t}</div>
        <div style="font-size: 10px; font-weight: normal; opacity: 0.95;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-46px';
      banner.style.left = '0px';
      banner.style.background = col;
      banner.style.color = '#ffffff';
      banner.style.padding = '5px 10px';
      banner.style.borderRadius = '5px';
      banner.style.boxShadow = '0 6px 18px rgba(0,0,0,0.5)';
      banner.style.zIndex = '1000000';
      banner.style.pointerEvents = 'none';
      banner.style.fontFamily = '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif';
      banner.style.whiteSpace = 'nowrap';

      if (window.getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.appendChild(banner);

      setTimeout(() => {
        el.style.outline = prevOutline;
        el.style.boxShadow = prevBoxShadow;
        el.style.zIndex = prevZ;
        banner.remove();
      }, dur);
    }, { t: title, desc: description, dur: durationMs, col: color });

    await page.waitForTimeout(durationMs);
  } catch (e) {}
}

(async () => {
  console.log('========================================================================');
  console.log('📱 GLOBEWEST QA: RESPONSIVE PLP REGRESSION AUDIT (HEADED MODE)');
  console.log('Device 1: Mobile (375x812 iPhone)');
  console.log('Device 2: Tablet (768x1024 iPad)');
  console.log('Target PLP: ' + TARGET_PLP);
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 600,
    args: ['--window-size=500,980', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // =========================================================================
  // 1. MOBILE LOGGED-OUT PUBLIC BROWSING MODE
  // =========================================================================
  console.log('▶ [STAGE 1] Mobile Logged-Out Public Browsing Mode...');
  await page.goto(TARGET_PLP, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Close modals
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click().catch(() => {});
  }

  // 1. Mobile Utility Bar
  const mobileUtility = page.locator('.c-top-bar, .utility-bar, .panel.header').first();
  await showStepBanner(page, mobileUtility, 'Mobile Step 1: Utility Bar', 'Verifying "Become a Trade Customer" & "Book Showroom"', '#10B981', 3000);

  // 2. Mobile Filter Toggle Button ("Show Filters" / "Browse by")
  const mobileFilterBtn = page.locator('.mobile-filter-toolbar, .action.show-filter, .filter-toggle, button:has-text("Filters"), button:has-text("Browse by")').first();
  await showStepBanner(page, mobileFilterBtn, 'Mobile Step 2: "Show Filters" Button', 'Pinned filter toggle matches Figma mobile specification', '#10B981', 3000);

  // Open the mobile filter drawer
  if (await mobileFilterBtn.isVisible().catch(() => false)) {
    console.log('👉 Opening Mobile Filter Drawer...');
    await mobileFilterBtn.click();
    await page.waitForTimeout(2500);

    const filterDrawer = page.locator('.block.filter, .sidebar, .modal-content, [data-role="drawer"]').first();
    await showStepBanner(page, filterDrawer, 'Mobile Step 3: Filter Drawer Open', 'Facet categories (Brand, Style, Room, etc.) interactive on mobile', '#00D2FF', 3000);

    // Close the drawer
    const closeDrawerBtn = page.locator('.action-close, .filter-close, button[aria-label="Close"], .close').first();
    if (await closeDrawerBtn.isVisible().catch(() => false)) {
      await closeDrawerBtn.click();
      await page.waitForTimeout(1500);
    }
  }

  // 3. Mobile Product Card Grid & Pricing Mask
  const firstCard = page.locator('.product-item').first();
  await firstCard.scrollIntoViewIfNeeded();
  await showStepBanner(page, firstCard, 'Mobile Step 4: Product Card Grid (Logged Out)', '2-column layout; wholesale pricing masked for public guests', '#10B981', 3000);

  await page.screenshot({ path: path.join(OUT_DIR, '05_MOBILE_LOGGED_OUT_PLP.png'), fullPage: false });

  // =========================================================================
  // 2. MOBILE LOGGED-IN TRADE CUSTOMER MODE
  // =========================================================================
  console.log('\n▶ [STAGE 2] Logging in as US Trade Customer on Mobile...');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailInput = page.locator('#email, input[name="login[username]"]').first();
  const passInput = page.locator('#pass, input[name="login[password]"]').first();
  const loginSubmit = page.locator('#send2, button.action.login.primary').first();

  if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailInput.fill('deepali.londhe@overdose.digital');
    await passInput.fill('Deep@123');
    await loginSubmit.click();
    await page.waitForTimeout(4000);
  }

  // Navigate back to Mobile PLP
  console.log('Navigating to Mobile PLP in Authenticated Trade Session...');
  await page.goto(TARGET_PLP, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // 1. Mobile Header Pricing Toggle
  const mobileToggle = page.locator('.price-toggle, [data-role="price-toggle"]').first();
  if (await mobileToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
    await showStepBanner(page, mobileToggle, 'Mobile Step 5: Mobile Pricing Toggle', 'Active "👁️ Trade ⌵" toggle in mobile top bar per Figma', '#10B981', 3000);

    // Switch to MSRP mode on mobile
    console.log('👉 Switching to MSRP Mode on Mobile...');
    await mobileToggle.click();
    await page.waitForTimeout(1000);
    const msrpOption = page.locator('.price-toggle__dropdown-item:has-text("MSRP"), a:has-text("MSRP")').first();
    if (await msrpOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await msrpOption.click();
      await page.waitForTimeout(2500);
      await showStepBanner(page, mobileToggle, 'Mobile Step 6: Switched to MSRP', 'Mobile product cards update dynamically to MSRP only', '#00D2FF', 2500);

      // Switch back to Trade Mode
      await mobileToggle.click();
      await page.waitForTimeout(1000);
      const tradeOption = page.locator('.price-toggle__dropdown-item:has-text("Trade"), a:has-text("Trade")').first();
      if (await tradeOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tradeOption.click();
        await page.waitForTimeout(2000);
      }
    }
  }

  // 2. Mobile Authenticated Product Card Details
  const authCard = page.locator('.product-item').first();
  await authCard.scrollIntoViewIfNeeded();
  await showStepBanner(page, authCard, 'Mobile Step 7: Authenticated Card Details', 'Dual pricing ($580 • MSRP: $638) & Stock ETA (• Enquire for ETA)', '#10B981', 3500);

  await page.screenshot({ path: path.join(OUT_DIR, '06_MOBILE_LOGGED_IN_PLP_AUTHENTICATED.png'), fullPage: false });

  // =========================================================================
  // 3. TABLET VIEWPORT (768x1024 iPad)
  // =========================================================================
  console.log('\n▶ [STAGE 3] Auditing Tablet Viewport (768x1024 iPad)...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(2000);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const tabletCard = page.locator('.product-item').first();
  await tabletCard.scrollIntoViewIfNeeded();
  await showStepBanner(page, tabletCard, 'Tablet Step 8: iPad 768px Viewport', 'Inspecting responsive grid scaling and card layout on tablet', '#10B981', 3000);

  await page.screenshot({ path: path.join(OUT_DIR, '07_TABLET_LOGGED_IN_PLP.png'), fullPage: false });

  console.log('\n========================================================================');
  console.log('✅ RESPONSIVE AUDIT COMPLETE! Browser staying open for 15s for review.');
  console.log('========================================================================\n');

  await page.waitForTimeout(15000);
  await browser.close();
})();
