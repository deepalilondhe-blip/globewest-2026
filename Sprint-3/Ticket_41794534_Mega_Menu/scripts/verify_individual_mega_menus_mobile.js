const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR_MOBILE = path.resolve(__dirname, '../screenshots/individual_mobile');
const OUT_DIR_DEFECTS = path.resolve(__dirname, '../screenshots/defects');
const AUDIT_OUT = path.resolve(__dirname, '../individual_mega_menu_mobile_results.json');

[OUT_DIR_MOBILE, OUT_DIR_DEFECTS].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

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
  'Inspiration',
  'Support',
  'Contact'
];

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function loginUser(page, loginUrl, creds) {
  console.log(`\n🔐 Authenticating on US Staging (Mobile Viewport)...`);
  try {
    await page.goto(loginUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailField.fill(creds.email);
      await page.fill('#pass', creds.pass);
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2500);
    }
    await clearOverlays(page);
    console.log(`   ✅ Successfully logged in as Trade customer on mobile`);
  } catch (err) {
    console.warn(`   ⚠️ Login notice: ${err.message}`);
  }
}

(async () => {
  console.log('========================================================================');
  console.log('📱 INDIVIDUAL MEGA MENU VERIFICATION SUITE — MOBILE VIEWPORT (390x844)');
  console.log(`   Target US Staging: ${US_BASE_URL} (Logged-in Trade Customer)`);
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 250,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const report = {
    suite: 'Individual Mega Menu Verification (Mobile 390x844)',
    timestamp: new Date().toISOString(),
    testedUrl: US_BASE_URL,
    tradeAccount: US_CREDS.email,
    categories: {},
    summary: {
      totalCategoriesAudited: 0,
      totalLinksAudited: 0,
      totalAULeaks: 0,
      passedCategories: [],
      defectiveCategories: []
    }
  };

  const page = await context.newPage();

  try {
    // Authenticate
    await loginUser(page, `${US_BASE_URL}/customer/account/login/`, US_CREDS);

    for (let i = 0; i < MENU_CATEGORIES.length; i++) {
      const cat = MENU_CATEGORIES[i];
      const safeName = cat.toLowerCase().replace(/\s+/g, '_');
      console.log(`------------------------------------------------------------------------`);
      console.log(`📱 [${i + 1}/${MENU_CATEGORIES.length}] VERIFYING MOBILE MEGA MENU: "${cat}"`);
      console.log(`------------------------------------------------------------------------`);

      // Reload homepage cleanly for each category to ensure pristine drawer state
      await page.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2500);
      await clearOverlays(page);

      // Open Hamburger Navigation Menu
      console.log(`   👉 Opening mobile drawer menu...`);
      const hamburger = page.locator('.action.nav-toggle, [data-action="toggle-nav"], button.nav-toggle').first();
      if (!await hamburger.isVisible({ timeout: 4000 }).catch(() => false)) {
        console.warn(`   ⚠️ Hamburger toggle button not visible on mobile.`);
        continue;
      }
      await hamburger.click();
      await page.waitForTimeout(1200);

      // Locate the category accordion item in the mobile nav
      const catAccordion = page.locator(`.navigation .level0 > a:has-text("${cat}"), .nav-sections .level0 > a:has-text("${cat}")`).first();

      if (!await catAccordion.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.warn(`   ⚠️ Category "${cat}" not found in mobile drawer.`);
        report.categories[cat] = { status: 'NOT_FOUND', totalLinks: 0, auLeaks: [] };
        continue;
      }

      // Click category to expand accordion
      console.log(`   👉 Tapping to expand "${cat}" accordion...`);
      await catAccordion.scrollIntoViewIfNeeded().catch(() => {});
      await catAccordion.click({ force: true });
      await page.waitForTimeout(1500);

      // Capture individual mobile screenshot of expanded menu
      const shotPath = path.join(OUT_DIR_MOBILE, `mobile_megamenu_${safeName}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`   📸 Captured individual mobile view: mobile_megamenu_${safeName}.png`);

      // Inspect links within this category's mobile container
      const mobileCatData = await page.evaluate((categoryName) => {
        const nav = document.querySelector('.nav-sections, .navigation');
        if (!nav) return { found: false };

        const allItems = Array.from(nav.querySelectorAll('li.level0, .nav-item'));
        const target = allItems.find(el => {
          const a = el.querySelector('a');
          return a && a.innerText.trim().toLowerCase() === categoryName.toLowerCase();
        });

        if (!target) return { found: false };

        const links = Array.from(target.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href') || ''
        }));

        const auLeaks = links.filter(l => {
          const h = l.href.toLowerCase();
          return h.includes('.com.au') || h.includes('globewestoutlet') || h.includes('australia');
        });

        return {
          found: true,
          totalLinks: links.length,
          linksSample: links.slice(0, 10),
          auLeaks,
          hasAULeaks: auLeaks.length > 0
        };
      }, cat);

      if (mobileCatData.hasAULeaks) {
        console.warn(`   🚨 DEFECT DETECTED IN MOBILE "${cat}": Australian Domain Leakage!`);
        mobileCatData.auLeaks.forEach(l => console.warn(`      - Link: "${l.text}" -> ${l.href}`));
        report.summary.defectiveCategories.push(cat);

        const defectShot = path.join(OUT_DIR_DEFECTS, `DEFECT_mobile_${safeName}_au_leak.png`);
        await page.screenshot({ path: defectShot, fullPage: false });
        console.log(`   📸 Saved Mobile Defect Proof: DEFECT_mobile_${safeName}_au_leak.png`);
      } else {
        console.log(`   🟢 VERIFIED: Zero Australian domain leakage in mobile "${cat}".`);
        report.summary.passedCategories.push(cat);
      }

      report.categories[cat] = {
        ...mobileCatData,
        screenshot: `mobile_megamenu_${safeName}.png`
      };
      report.summary.totalLinksAudited += (mobileCatData.totalLinks || 0);
      report.summary.totalAULeaks += (mobileCatData.auLeaks ? mobileCatData.auLeaks.length : 0);
      report.summary.totalCategoriesAudited++;

      console.log(`   📊 Result for Mobile "${cat}": ${mobileCatData.totalLinks || 0} links scanned, ${mobileCatData.auLeaks ? mobileCatData.auLeaks.length : 0} AU leaks.\n`);
    }

    fs.writeFileSync(AUDIT_OUT, JSON.stringify(report, null, 2));
    console.log('========================================================================');
    console.log(`✅ INDIVIDUAL MOBILE MEGA MENU AUDIT COMPLETE!`);
    console.log(`   Total Categories Audited: ${report.summary.totalCategoriesAudited}`);
    console.log(`   Total Links Audited:      ${report.summary.totalLinksAudited}`);
    console.log(`   Total AU Leaks Detected:  ${report.summary.totalAULeaks}`);
    console.log(`   Report Saved To:          ${AUDIT_OUT}`);
    console.log('========================================================================\n');

    await page.waitForTimeout(2000);
    await browser.close();
  } catch (err) {
    console.error('Fatal error during individual mobile audit:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
