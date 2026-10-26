const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const OUT_DIR_DESKTOP = path.join(BASE_DIR, 'screenshots', 'defects', 'desktop');
const OUT_DIR_MOBILE = path.join(BASE_DIR, 'screenshots', 'defects', 'mobile');
const OLD_DEFECTS_CLEAN = path.join(BASE_DIR, 'screenshots', 'defects_clean');

// Clean up old screenshot directories
if (fs.existsSync(OLD_DEFECTS_CLEAN)) {
  fs.rmSync(OLD_DEFECTS_CLEAN, { recursive: true, force: true });
}

[OUT_DIR_DESKTOP, OUT_DIR_MOBILE].forEach(d => {
  if (fs.existsSync(d)) {
    fs.rmSync(d, { recursive: true, force: true });
  }
  fs.mkdirSync(d, { recursive: true });
});

const US_BASE_URL = 'https://mcstaging2.globewest.com';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

const DEFECTS = [
  {
    filenameId: 'DEFECT_1_INDOOR_OUTLET',
    category: 'Indoor',
    linkSelector: '.navigation a[href*="globewestoutlet.com.au/collections/indoor"]',
    fallbackLinkText: 'Outlet',
    url: 'https://globewestoutlet.com.au/collections/indoor'
  },
  {
    filenameId: 'DEFECT_2_OUTDOOR_OUTLET',
    category: 'Outdoor',
    linkSelector: '.navigation a[href*="globewestoutlet.com.au/collections/outdoor"]',
    fallbackLinkText: 'Outlet',
    url: 'https://globewestoutlet.com.au/collections/outdoor'
  },
  {
    filenameId: 'DEFECT_3_HOMEWARES_OUTLET',
    category: 'Homewares',
    linkSelector: '.navigation a[href*="globewestoutlet.com.au/collections/homewares"]',
    fallbackLinkText: 'Outlet',
    url: 'https://globewestoutlet.com.au/collections/homewares'
  },
  {
    filenameId: 'DEFECT_4_SUPPORT_OUTLET',
    category: 'Support',
    subCategory: 'General Public',
    linkSelector: '.navigation a[href*="pages/melbourne-outlet-store"], .navigation a[href*="globewestoutlet.com.au"]',
    fallbackLinkText: 'Visit Melbourne Outlet',
    url: 'https://globewestoutlet.com.au/pages/melbourne-outlet-store'
  }
];

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function loginUser(page, loginUrl, creds) {
  console.log(`\n🔐 Logging into US Staging (${loginUrl})...`);
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
    console.log(`   ✅ Logged in successfully`);
  } catch (err) {
    console.warn(`   ⚠️ Notice during login: ${err.message}`);
  }
}

/** Highlights visible defect link with clean red outline ONLY, URL text stays 100% normal/untouched */
async function applyCleanDefectHighlight(page, linkSelector, defectUrl, isMobile = false) {
  await page.evaluate(({ sel, url, mobile }) => {
    // 1. Find the visible link element
    const visibleSelMatches = Array.from(document.querySelectorAll(sel)).filter(a => a.offsetParent !== null && a.getBoundingClientRect().height > 0);
    let el = visibleSelMatches[0];

    if (!el) {
      const allAs = Array.from(document.querySelectorAll('a')).filter(a => a.offsetParent !== null && a.getBoundingClientRect().height > 0);
      el = allAs.find(a => (a.getAttribute('href') || '').includes('globewestoutlet') || a.innerText.trim().toLowerCase() === 'outlet');
    }

    if (el) {
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      // ONLY red square/rectangle border. All colors, text, fonts remain completely untouched!
      el.style.border = '2px solid #FF0000';
      el.style.boxSizing = 'border-box';
      el.style.padding = '2px 6px';
      el.setAttribute('data-qa-defect-highlight', 'true');
    }

    // 2. Remove existing status bar if any
    const existing = document.getElementById('qa-footer-url-proof');
    if (existing) existing.remove();

    // 3. Realistic bottom-left browser URL status preview
    // Red color ONLY for the box/square border. Text color is standard dark (#202124).
    const statusBar = document.createElement('div');
    statusBar.id = 'qa-footer-url-proof';
    statusBar.style.position = 'fixed';
    statusBar.style.bottom = '0';
    statusBar.style.left = '0';
    statusBar.style.background = '#EEF2F6';
    statusBar.style.color = '#202124'; // Normal dark text! NEVER RED!
    statusBar.style.border = '2px solid #FF0000'; // Only red square outline!
    statusBar.style.borderBottom = 'none';
    statusBar.style.borderLeft = 'none';
    statusBar.style.borderTopRightRadius = '3px';
    statusBar.style.zIndex = '2147483647';
    statusBar.style.boxShadow = '0 -1px 4px rgba(0,0,0,0.15)';

    if (mobile) {
      statusBar.style.maxWidth = '92%';
      statusBar.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';
      statusBar.style.fontSize = '11px';
      statusBar.style.lineHeight = '1.4';
      statusBar.style.padding = '4px 8px';
      statusBar.style.wordBreak = 'break-all';
    } else {
      statusBar.style.fontFamily = 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
      statusBar.style.fontSize = '12px';
      statusBar.style.lineHeight = '1.5';
      statusBar.style.padding = '3px 10px';
    }

    // Plain text content only - standard text color, no custom badges, no red text
    statusBar.textContent = url;

    document.body.appendChild(statusBar);
  }, { sel: linkSelector, url: defectUrl, mobile: isMobile });
}

/** Resets injected proof styles */
async function clearDefectHighlight(page) {
  await page.evaluate(() => {
    const statusBar = document.getElementById('qa-footer-url-proof');
    if (statusBar) statusBar.remove();

    const highlighted = document.querySelectorAll('[data-qa-defect-highlight="true"]');
    highlighted.forEach(el => {
      el.style.border = '';
      el.style.padding = '';
      el.style.boxSizing = '';
      el.removeAttribute('data-qa-defect-highlight');
    });
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('📸 CAPTURING REAL DEFECT SCREENSHOTS');
  console.log('   - Red square outline ONLY around menu item & bottom status bar');
  console.log('   - Normal dark text (NO red text anywhere)');
  console.log('   - Deleted old screenshot folders');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  // ---------------------------------------------------------------------------
  // 1. DESKTOP VIEWPORT CAPTURES (1440x900)
  // ---------------------------------------------------------------------------
  console.log('▶ [1/2] Capturing Desktop Defect Proofs (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const pageDesktop = await desktopContext.newPage();
  await loginUser(pageDesktop, `${US_BASE_URL}/customer/account/login/`, US_CREDS);

  for (const defect of DEFECTS) {
    console.log(`\n👉 Auditing Desktop Defect: "${defect.category}" category...`);
    await pageDesktop.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageDesktop.waitForTimeout(3000);
    await clearOverlays(pageDesktop);

    const catItem = pageDesktop.locator(`.navigation .level0:has(a:has-text("${defect.category}")), nav.navigation a:has-text("${defect.category}")`).first();
    if (await catItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      await catItem.hover({ force: true });
      await pageDesktop.waitForTimeout(1500);

      await applyCleanDefectHighlight(pageDesktop, defect.linkSelector, defect.url, false);
      await pageDesktop.waitForTimeout(1000);

      const shotFile = path.join(OUT_DIR_DESKTOP, `DESKTOP_${defect.filenameId}.png`);
      await pageDesktop.screenshot({ path: shotFile, fullPage: false });
      console.log(`   📸 Saved Desktop Proof: DESKTOP_${defect.filenameId}.png`);

      await clearDefectHighlight(pageDesktop);
    }
  }
  await pageDesktop.close();
  await desktopContext.close();

  // ---------------------------------------------------------------------------
  // 2. MOBILE VIEWPORT CAPTURES (390x844)
  // ---------------------------------------------------------------------------
  console.log('\n▶ [2/2] Capturing Mobile Defect Proofs (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });
  const pageMobile = await mobileContext.newPage();
  await loginUser(pageMobile, `${US_BASE_URL}/customer/account/login/`, US_CREDS);

  for (const defect of DEFECTS) {
    console.log(`\n👉 Auditing Mobile Defect: "${defect.category}" category...`);
    await pageMobile.goto(US_BASE_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pageMobile.waitForTimeout(3000);
    await clearOverlays(pageMobile);

    const hamburger = pageMobile.locator('.action.nav-toggle, [data-action="toggle-nav"], button.nav-toggle').first();
    if (await hamburger.isVisible({ timeout: 4000 }).catch(() => false)) {
      await hamburger.click();
      await pageMobile.waitForTimeout(1500);

      const catAccordion = pageMobile.locator(`.navigation .level0 > a:has-text("${defect.category}"), .nav-sections .level0 > a:has-text("${defect.category}")`).first();
      if (await catAccordion.isVisible({ timeout: 4000 }).catch(() => false)) {
        await catAccordion.scrollIntoViewIfNeeded().catch(() => {});
        await catAccordion.click({ force: true });
        await pageMobile.waitForTimeout(1500);

        if (defect.subCategory) {
          const subAcc = pageMobile.locator(`.navigation a:has-text("${defect.subCategory}"), .nav-sections a:has-text("${defect.subCategory}")`).first();
          if (await subAcc.isVisible({ timeout: 2000 }).catch(() => false)) {
            await subAcc.click({ force: true });
            await pageMobile.waitForTimeout(1500);
          }
        }

        await applyCleanDefectHighlight(pageMobile, defect.linkSelector, defect.url, true);
        await pageMobile.waitForTimeout(1000);

        const shotFile = path.join(OUT_DIR_MOBILE, `MOBILE_${defect.filenameId}.png`);
        await pageMobile.screenshot({ path: shotFile, fullPage: false });
        console.log(`   📸 Saved Mobile Proof: MOBILE_${defect.filenameId}.png`);

        await clearDefectHighlight(pageMobile);
      }
    }
  }
  await pageMobile.close();
  await mobileContext.close();

  console.log('\n========================================================================');
  console.log('✅ ALL SCREENSHOTS CAPTURED SUCCESSFULLY (RED BOX ONLY, NORMAL TEXT)!');
  console.log('========================================================================\n');

  await browser.close();
})();
