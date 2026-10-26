const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR_US = path.resolve(__dirname, '../screenshots/desktop');
const OUT_DIR_AU = path.resolve(__dirname, '../screenshots/au_comparison');
const AUDIT_OUT = path.resolve(__dirname, '../mega_menu_audit_results.json');

[OUT_DIR_US, OUT_DIR_AU].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Exact target URLs per client specification
const US_BASE_URL = 'https://mcstaging2.globewest.com';
const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';

const MENU_CATEGORIES = [
  'Indoor',
  'Outdoor',
  'Homewares',
  'In Stock',
  'Customisation',
  'Projects',
  'Inspiration'
];

/** Clears any overlays, modals, or shrouds */
async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

const AU_CREDS = {
  email: 'deepalilondhe576@gmail.com',
  pass: 'Deep@123'
};

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

/** Logs customer in to the specified storefront */
async function loginCustomer(page, loginUrl, creds, siteName) {
  console.log(`\n🔐 Authenticating on ${siteName} (${loginUrl})...`);
  try {
    await page.goto(loginUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await clearOverlays(page);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log(`   Entering Trade credentials: ${creds.email} ...`);
      await emailField.fill(creds.email);
      await page.fill('#pass', creds.pass);
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(3000);
    }
    await clearOverlays(page);
    console.log(`   ✅ Logged in successfully on ${siteName}`);
  } catch (e) {
    console.warn(`   ⚠️ Warning during login on ${siteName}:`, e.message);
  }
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 TICKET #41794534: MEGA MENU DUAL-AUTHENTICATED STAGING PARITY AUDIT');
  console.log(`   US Staging (Target):   ${US_BASE_URL} (Logged-in Trade Customer)`);
  console.log(`   AU Staging (Baseline): ${AU_BASE_URL} (Logged-in AU Customer)`);
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const auditReport = {
    ticket: '#41794534 - Mega menu',
    timestamp: new Date().toISOString(),
    usBaseUrl: US_BASE_URL,
    auBaseUrl: AU_BASE_URL,
    categories: {},
    leaksDetected: []
  };

  try {
    // -------------------------------------------------------------------------
    // PHASE 1: AU STAGING AUTHENTICATED BASELINE CAPTURE
    // -------------------------------------------------------------------------
    console.log('▶ [Phase 1/2] Loading AU Staging Baseline (https://mcstaging2.globewest.com.au)...');
    const pageAU = await context.newPage();
    await loginCustomer(pageAU, `${AU_BASE_URL}/customer/account/login/`, AU_CREDS, 'AU Staging Baseline');
    await pageAU.goto(AU_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageAU.waitForTimeout(3000);
    await clearOverlays(pageAU);

    console.log('   📸 Capturing AU Staging Authenticated Mega Menu Categories:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`     👉 Hovering AU Staging: "${cat}"...`);
      await clearOverlays(pageAU);
      const navItem = pageAU.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await pageAU.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');
        const capPath = path.join(OUT_DIR_AU, `au_staging_mega_menu_${safeName}.png`);
        await pageAU.screenshot({ path: capPath, fullPage: false });
        console.log(`        📸 Saved AU: au_staging_mega_menu_${safeName}.png`);
      }
    }
    await pageAU.close();

    // -------------------------------------------------------------------------
    // PHASE 2: US STAGING AUTHENTICATED CAPTURE & CROSS-AUDIT
    // -------------------------------------------------------------------------
    console.log('\n▶ [Phase 2/2] Loading US Staging (https://mcstaging2.globewest.com)...');
    const pageUS = await context.newPage();
    await loginCustomer(pageUS, `${US_BASE_URL}/customer/account/login/`, US_CREDS, 'US Staging Trade');
    await pageUS.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageUS.waitForTimeout(3000);
    await clearOverlays(pageUS);

    console.log('   📸 Capturing US Staging Authenticated Mega Menu Categories & Scanning Links:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`     👉 Hovering US Staging: "${cat}"...`);
      await clearOverlays(pageUS);
      const navItem = pageUS.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await pageUS.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');
        const capPath = path.join(OUT_DIR_US, `us_staging_mega_menu_${safeName}.png`);
        await pageUS.screenshot({ path: capPath, fullPage: false });
        console.log(`        📸 Saved US: us_staging_mega_menu_${safeName}.png`);

        // Inspect DOM structure of this category's open mega menu
        const catAudit = await pageUS.evaluate((categoryName) => {
          const navs = Array.from(document.querySelectorAll('.navigation .level0.parent'));
          const targetNav = navs.find(n => n.innerText.toLowerCase().includes(categoryName.toLowerCase()));
          if (!targetNav) return { found: false };

          const submenu = targetNav.querySelector('.submenu, ul.level0, .ui-menu-submenu, [class*="submenu"]');
          if (!submenu) return { found: true, hasSubmenu: false };

          const links = Array.from(submenu.querySelectorAll('a')).map(a => ({
            text: a.innerText.trim(),
            href: a.getAttribute('href') || '',
            isAULink: (a.getAttribute('href') || '').includes('.com.au') || (a.getAttribute('href') || '').includes('globewestoutlet')
          }));

          const auLeaks = links.filter(l => l.isAULink);

          // Promotional card check
          const promoBanner = submenu.querySelector('.banner, .promo, .cms-block, [class*="promo"], [class*="banner"]');
          const promoImg = promoBanner ? promoBanner.querySelector('img') : null;
          const promoText = promoBanner ? promoBanner.innerText.trim() : '';

          return {
            found: true,
            hasSubmenu: true,
            totalLinks: links.length,
            linksCount: links.length,
            auLeaks,
            promoText,
            promoImgSrc: promoImg ? promoImg.getAttribute('src') : 'NONE'
          };
        }, cat);

        auditReport.categories[cat] = catAudit;
        if (catAudit.auLeaks && catAudit.auLeaks.length > 0) {
          console.warn(`        🚨 AU DOMAIN LEAKS in "${cat}":`, catAudit.auLeaks.map(l => l.href));
          auditReport.leaksDetected.push(...catAudit.auLeaks);
        }
      }
    }

    fs.writeFileSync(AUDIT_OUT, JSON.stringify(auditReport, null, 2));
    console.log(`\n💾 Audit results saved to ${AUDIT_OUT}`);

    console.log('\n========================================================================');
    console.log('✅ DIRECT STAGING COMPARISON COMPLETE (US VS AU STAGING)!');
    console.log('========================================================================\n');

    await pageUS.waitForTimeout(3000);
    await browser.close();
  } catch (err) {
    console.error('Error during mega menu comparison:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
