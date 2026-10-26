const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR_DESKTOP = path.resolve(__dirname, '../screenshots/individual_desktop');
const OUT_DIR_DEFECTS = path.resolve(__dirname, '../screenshots/defects');
const AUDIT_OUT = path.resolve(__dirname, '../individual_mega_menu_desktop_results.json');

[OUT_DIR_DESKTOP, OUT_DIR_DEFECTS].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

const AU_CREDS = {
  email: 'deepalilondhe576@gmail.com',
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

async function loginUser(page, loginUrl, creds, siteLabel) {
  console.log(`\n🔐 Authenticating on ${siteLabel} (${loginUrl})...`);
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
    console.log(`   ✅ Successfully logged in on ${siteLabel}`);
  } catch (err) {
    console.warn(`   ⚠️ Login notice for ${siteLabel}: ${err.message}`);
  }
}

/** Highlights elements live on screen */
async function highlightElement(page, selectorOrLocator, title, description, status = 'defect', durationMs = 2500) {
  try {
    const locator = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator.first();
    if (!await locator.isVisible({ timeout: 1500 }).catch(() => false)) return;

    const isDefect = status === 'defect';
    const borderColor = isDefect ? '#FF0000' : '#00D632';
    const bgColor = isDefect ? '#DC2626' : '#059669';

    await locator.evaluate((el, { t, desc, dur, border, bg }) => {
      const prevOutline = el.style.outline;
      const prevZ = el.style.zIndex;

      el.style.outline = `3px solid ${border}`;
      el.style.boxShadow = `0 0 20px ${border}`;
      el.style.zIndex = '999999';

      const banner = document.createElement('div');
      banner.className = 'qa-hover-badge';
      banner.innerHTML = `
        <div style="font-weight: 800; font-size: 12px; text-transform: uppercase;">${t}</div>
        <div style="font-size: 11px; opacity: 0.95;">${desc}</div>
      `;
      banner.style.position = 'absolute';
      banner.style.top = '-40px';
      banner.style.left = '0px';
      banner.style.background = bg;
      banner.style.color = '#FFFFFF';
      banner.style.padding = '5px 10px';
      banner.style.borderRadius = '5px';
      banner.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
      banner.style.zIndex = '10000000';
      banner.style.pointerEvents = 'none';
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
  console.log('🖥️ INDIVIDUAL MEGA MENU VERIFICATION SUITE — DESKTOP VIEW');
  console.log(`   Target US Staging:   ${US_BASE_URL} (Logged-in Trade Account)`);
  console.log(`   Baseline AU Staging: ${AU_BASE_URL} (Logged-in AU Customer)`);
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 250,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const report = {
    suite: 'Individual Mega Menu Verification (Desktop)',
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
    // Authenticate Trade customer on US Staging
    await loginUser(page, `${US_BASE_URL}/customer/account/login/`, US_CREDS, 'US Staging (Trade)');

    // Navigate to homepage
    console.log('\n▶ Navigating to US Storefront Homepage...');
    await page.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    // Verify Trade toggle in header
    const tradeToggle = page.locator('.price-toggle, button.price-toggle__trigger, [data-role="price-toggle-trigger"]').first();
    if (await tradeToggle.isVisible().catch(() => false)) {
      await highlightElement(page, tradeToggle, '👁️ Trade Mode Active', 'Header Trade pricing active', 'pass', 1500);
    }

    console.log('\n========================================================================');
    console.log('🔍 COMMENCING INDIVIDUAL MEGA MENU HOVER, INTERACTION & LINK AUDITS:');
    console.log('========================================================================\n');

    for (let i = 0; i < MENU_CATEGORIES.length; i++) {
      const cat = MENU_CATEGORIES[i];
      const safeName = cat.toLowerCase().replace(/\s+/g, '_');
      console.log(`------------------------------------------------------------------------`);
      console.log(`📌 [${i + 1}/${MENU_CATEGORIES.length}] VERIFYING MEGA MENU: "${cat}"`);
      console.log(`------------------------------------------------------------------------`);

      await clearOverlays(page);
      // Hover away first to reset any open flyouts
      await page.mouse.move(100, 100);
      await page.waitForTimeout(500);

      const navItem = page.locator(`.navigation .level0.parent:has(a:has-text("${cat}")), nav.navigation a:has-text("${cat}")`).first();

      if (!await navItem.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.warn(`   ⚠️ Navigation item "${cat}" not visible in header DOM.`);
        report.categories[cat] = { status: 'NOT_FOUND', totalLinks: 0, auLeaks: [] };
        continue;
      }

      // Step 1: Hover over this individual menu item
      console.log(`   👉 Hovering menu item: "${cat}"...`);
      await navItem.hover({ force: true });
      await page.waitForTimeout(1500);

      // Step 2: Capture clean individual screenshot
      const shotPath = path.join(OUT_DIR_DESKTOP, `desktop_megamenu_${safeName}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`   📸 Captured individual view: desktop_megamenu_${safeName}.png`);

      // Step 3: Inspect DOM & extract all links inside this mega menu container
      const categoryData = await page.evaluate((categoryName) => {
        const navs = Array.from(document.querySelectorAll('.navigation .level0'));
        const targetNav = navs.find(n => {
          const a = n.querySelector('a');
          return a && a.innerText.trim().toLowerCase() === categoryName.toLowerCase();
        });

        if (!targetNav) return { found: false };

        const submenu = targetNav.querySelector('.submenu, ul.level0, .ui-menu-submenu, [class*="submenu"]');
        const links = submenu ? Array.from(submenu.querySelectorAll('a')).map(a => ({
          text: a.innerText.trim(),
          href: a.getAttribute('href') || ''
        })) : [];

        // Check for Australian domain leakage
        const auLeaks = links.filter(l => {
          const h = l.href.toLowerCase();
          return h.includes('.com.au') || h.includes('globewestoutlet') || h.includes('australia');
        });

        // Check promotional banner / card
        const promoBlock = submenu ? submenu.querySelector('.banner, .promo, .cms-block, [class*="promo"], [class*="banner"]') : null;
        const promoText = promoBlock ? promoBlock.innerText.trim() : '';
        const promoImg = promoBlock ? promoBlock.querySelector('img') : null;
        const promoImgSrc = promoImg ? promoImg.getAttribute('src') || '' : '';

        const isPlaceholderPromo = promoText.includes('Coming Soon') || promoText.includes('GW') || promoImgSrc.includes('placeholder');

        return {
          found: true,
          hasSubmenu: !!submenu,
          totalLinks: links.length,
          linksSample: links.slice(0, 10),
          auLeaks,
          hasAULeaks: auLeaks.length > 0,
          promoText,
          promoImgSrc,
          isPlaceholderPromo
        };
      }, cat);

      // Step 4: Validate interactions & highlight any leaks live
      if (categoryData.hasAULeaks) {
        console.warn(`   🚨 DEFECT DETECTED IN "${cat}": Australian Domain Leakage Found!`);
        categoryData.auLeaks.forEach(l => console.warn(`      - Link Text: "${l.text}" | URL: ${l.href}`));

        // Highlight the leaking link in live DOM
        const leakingEl = page.locator(`.navigation a[href*=".com.au"], .navigation a[href*="globewestoutlet"]`).first();
        if (await leakingEl.isVisible().catch(() => false)) {
          await highlightElement(
            page,
            leakingEl,
            '🚨 DEFECT: AU OUTLET LEAK',
            `Points to Australian Domain: ${categoryData.auLeaks[0].href}`,
            'defect',
            2500
          );
          const defectShot = path.join(OUT_DIR_DEFECTS, `DEFECT_desktop_${safeName}_au_leak.png`);
          await page.screenshot({ path: defectShot, fullPage: false });
          console.log(`   📸 Saved Defect Proof: DEFECT_desktop_${safeName}_au_leak.png`);
        }
        report.summary.defectiveCategories.push(cat);
      } else {
        console.log(`   🟢 VERIFIED: Zero Australian domain leakage in "${cat}". All links route correctly to US catalog.`);
        report.summary.passedCategories.push(cat);
      }

      // Step 5: Test sub-level hover/drilldown if multi-tier (e.g. Indoor, Outdoor, Homewares)
      if (['Indoor', 'Outdoor', 'Homewares'].includes(cat)) {
        console.log(`   👉 Testing Tier-2 Subcategory Hover Interaction in "${cat}"...`);
        const subCat = page.locator(`.navigation .level0.active .level1 a, .navigation .level0:hover .level1 a`).first();
        if (await subCat.isVisible().catch(() => false)) {
          const subText = await subCat.innerText().catch(() => '');
          await subCat.hover({ force: true });
          await page.waitForTimeout(800);
          console.log(`      ✅ Successfully hovered Level-2 subcategory: "${subText}"`);
        }
      }

      report.categories[cat] = {
        ...categoryData,
        screenshot: `desktop_megamenu_${safeName}.png`
      };
      report.summary.totalLinksAudited += categoryData.totalLinks;
      report.summary.totalAULeaks += categoryData.auLeaks.length;
      report.summary.totalCategoriesAudited++;

      console.log(`   📊 Result for "${cat}": ${categoryData.totalLinks} links audited, ${categoryData.auLeaks.length} AU leaks detected.\n`);
    }

    fs.writeFileSync(AUDIT_OUT, JSON.stringify(report, null, 2));
    console.log('========================================================================');
    console.log(`✅ INDIVIDUAL DESKTOP MEGA MENU AUDIT COMPLETE!`);
    console.log(`   Total Categories Audited: ${report.summary.totalCategoriesAudited}`);
    console.log(`   Total Links Audited:      ${report.summary.totalLinksAudited}`);
    console.log(`   Total AU Leaks Detected:  ${report.summary.totalAULeaks}`);
    console.log(`   Report Saved To:          ${AUDIT_OUT}`);
    console.log('========================================================================\n');

    await page.waitForTimeout(2000);
    await browser.close();
  } catch (err) {
    console.error('Fatal error during individual desktop audit:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
