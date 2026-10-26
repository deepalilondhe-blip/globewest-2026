const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../with_login');
const OUT_DIR_US = path.join(BASE_DIR, 'screenshots/us');
const OUT_DIR_AU = path.join(BASE_DIR, 'screenshots/au');
const AUDIT_OUT = path.join(BASE_DIR, 'logged_in_audit_results.json');

[OUT_DIR_US, OUT_DIR_AU].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const US_LOGIN_URL = 'https://mcstaging2.globewest.com/customer/account/login/';
const AU_LOGIN_URL = 'https://mcstaging2.globewest.com.au/customer/account/login/';
const US_BASE_URL = 'https://mcstaging2.globewest.com';
const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';

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

async function loginSite(page, loginUrl, creds, siteName) {
  console.log(`\n🔐 Logging in to ${siteName} (${loginUrl})...`);
  await page.goto(loginUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await clearOverlays(page);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.log(`   Entering credentials: ${creds.email} ...`);
    await emailField.fill(creds.email);
    await page.fill('#pass', creds.pass);
    await page.waitForTimeout(500);
    await page.click('#send2');
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }
  await clearOverlays(page);
  console.log(`   ✅ Current URL after login on ${siteName}: ${page.url()}`);
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 TICKET #41794534: LOGGED-IN MEGA MENU PARITY AUDIT (HEADED CHROME)');
  console.log('   AU Staging: https://mcstaging2.globewest.com.au (deepalilondhe576@gmail.com)');
  console.log('   US Staging: https://mcstaging2.globewest.com    (deepali.londhe@overdose.digital)');
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
    ticket: '#41794534 - Mega menu (Logged-in Mode)',
    timestamp: new Date().toISOString(),
    auAccount: AU_CREDS.email,
    usAccount: US_CREDS.email,
    auCategories: {},
    usCategories: {},
    leaksDetected: [],
    differences: []
  };

  try {
    // -------------------------------------------------------------------------
    // STEP 1: AU STAGING LOGGED-IN CAPTURE
    // -------------------------------------------------------------------------
    console.log('▶ [Step 1/2] Processing AU Staging Baseline...');
    const pageAU = await context.newPage();
    await loginSite(pageAU, AU_LOGIN_URL, AU_CREDS, 'AU Staging');

    // Go to AU Home
    console.log('   Navigating to AU Homepage...');
    await pageAU.goto(AU_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageAU.waitForTimeout(3000);
    await clearOverlays(pageAU);

    console.log('   📸 Capturing Logged-In AU Mega Menu Categories:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`     👉 Hovering AU Staging: "${cat}"...`);
      await clearOverlays(pageAU);
      const navItem = pageAU.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await pageAU.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');
        const capPath = path.join(OUT_DIR_AU, `au_loggedin_${safeName}.png`);
        await pageAU.screenshot({ path: capPath, fullPage: false });
        console.log(`        📸 Saved AU: au_loggedin_${safeName}.png`);

        const catData = await pageAU.evaluate((categoryName) => {
          const navs = Array.from(document.querySelectorAll('.navigation .level0.parent'));
          const targetNav = navs.find(n => n.innerText.toLowerCase().includes(categoryName.toLowerCase()));
          if (!targetNav) return { found: false };

          const submenu = targetNav.querySelector('.submenu, ul.level0, .ui-menu-submenu, [class*="submenu"]');
          if (!submenu) return { found: true, hasSubmenu: false };

          const links = Array.from(submenu.querySelectorAll('a')).map(a => ({
            text: a.innerText.trim(),
            href: a.getAttribute('href') || ''
          }));

          const promo = submenu.querySelector('.banner, .promo, .cms-block, [class*="promo"], [class*="banner"]');
          return {
            found: true,
            hasSubmenu: true,
            totalLinks: links.length,
            links: links.map(l => l.text).filter(t => t.length > 0),
            promoText: promo ? promo.innerText.trim() : ''
          };
        }, cat);

        auditReport.auCategories[cat] = catData;
      }
    }
    await pageAU.close();

    // -------------------------------------------------------------------------
    // STEP 2: US STAGING LOGGED-IN CAPTURE
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 2/2] Processing US Staging Target...');
    const pageUS = await context.newPage();
    await loginSite(pageUS, US_LOGIN_URL, US_CREDS, 'US Staging');

    // Go to US Home
    console.log('   Navigating to US Homepage...');
    await pageUS.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageUS.waitForTimeout(3000);
    await clearOverlays(pageUS);

    console.log('   📸 Capturing Logged-In US Mega Menu Categories:');
    for (const cat of MENU_CATEGORIES) {
      console.log(`     👉 Hovering US Staging: "${cat}"...`);
      await clearOverlays(pageUS);
      const navItem = pageUS.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (await navItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        await navItem.hover({ force: true });
        await pageUS.waitForTimeout(1500);

        const safeName = cat.toLowerCase().replace(/\s+/g, '_');
        const capPath = path.join(OUT_DIR_US, `us_loggedin_${safeName}.png`);
        await pageUS.screenshot({ path: capPath, fullPage: false });
        console.log(`        📸 Saved US: us_loggedin_${safeName}.png`);

        const catData = await pageUS.evaluate((categoryName) => {
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
          const promo = submenu.querySelector('.banner, .promo, .cms-block, [class*="promo"], [class*="banner"]');

          return {
            found: true,
            hasSubmenu: true,
            totalLinks: links.length,
            links: links.map(l => l.text).filter(t => t.length > 0),
            auLeaks,
            promoText: promo ? promo.innerText.trim() : ''
          };
        }, cat);

        auditReport.usCategories[cat] = catData;
        if (catData.auLeaks && catData.auLeaks.length > 0) {
          console.warn(`        🚨 AU DOMAIN LEAKS in Logged-In "${cat}":`, catData.auLeaks.map(l => l.href));
          auditReport.leaksDetected.push(...catData.auLeaks);
        }
      }
    }

    // -------------------------------------------------------------------------
    // STEP 3: COMPARISON
    // -------------------------------------------------------------------------
    for (const cat of MENU_CATEGORIES) {
      const au = auditReport.auCategories[cat] || {};
      const us = auditReport.usCategories[cat] || {};
      const diff = {
        category: cat,
        auLinkCount: au.totalLinks || 0,
        usLinkCount: us.totalLinks || 0,
        leakCount: (us.auLeaks || []).length,
        match: (au.totalLinks === us.totalLinks) && ((us.auLeaks || []).length === 0)
      };
      auditReport.differences.push(diff);
    }

    fs.writeFileSync(AUDIT_OUT, JSON.stringify(auditReport, null, 2));
    console.log(`\n💾 Logged-In Audit results saved to ${AUDIT_OUT}`);

    console.log('\n========================================================================');
    console.log('📊 LOGGED-IN PARITY SUMMARY:');
    auditReport.differences.forEach(d => {
      const status = d.match ? '✅ PARITY MATCH' : `❌ DEFECT (AU: ${d.auLinkCount} links vs US: ${d.usLinkCount} links, Leaks: ${d.leakCount})`;
      console.log(`   ${d.category.padEnd(16)}: ${status}`);
    });
    console.log('========================================================================\n');

    await pageUS.waitForTimeout(3000);
    await browser.close();
  } catch (err) {
    console.error('Error during logged-in audit:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
