const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const OUT_DIR_DESKTOP = path.join(BASE_DIR, 'screenshots', 'desktop');
const OUT_DIR_MOBILE = path.join(BASE_DIR, 'screenshots', 'mobile');
const COMP_DIR = path.join(BASE_DIR, 'comparison');

[OUT_DIR_DESKTOP, OUT_DIR_MOBILE, COMP_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

const AU_CREDS = {
  email: 'deepalilondhe576@gmail.com',
  pass: 'Deep@123'
};

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function scrollPageFully(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 120);
    });
  });
  await page.waitForTimeout(2000);
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 MANDATORY DUAL-AUTH QA AUDIT: ABOUT US PAGE (TICKET #41794540)');
  console.log('   Baseline: https://mcstaging2.globewest.com.au/about-us (AU Authenticated)');
  console.log('   Target:   https://mcstaging2.globewest.com/about-us    (US Authenticated)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--start-maximized']
  });

  const auditReport = {
    timestamp: new Date().toISOString(),
    ticket: '#41794540 - About Us',
    auBaseline: {},
    usTarget: {}
  };

  // ===========================================================================
  // 1. AU BASELINE (AUTHENTICATED) - DESKTOP & MOBILE
  // ===========================================================================
  console.log('▶ [PHASE 1/2] AUDITING AU BASELINE UNDER AUTHENTICATED STATE...');
  const auContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const auPage = await auContext.newPage();

  console.log('   🔐 Logging in to AU Staging with customer account...');
  await auPage.goto(`${AU_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(2000);
  await clearOverlays(auPage);

  const auEmail = auPage.locator('#email');
  if (await auEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await auEmail.fill(AU_CREDS.email);
    await auPage.fill('#pass', AU_CREDS.pass);
    await auPage.click('#send2');
    await auPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await auPage.waitForTimeout(2500);
    console.log('   ✅ AU Staging Authenticated.');
  }

  // Navigate to AU About Us
  console.log('   👉 Loading AU About Us page...');
  await auPage.goto(`${AU_BASE}/about-us`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(3000);
  await clearOverlays(auPage);
  await scrollPageFully(auPage);

  // Capture AU Desktop
  await auPage.screenshot({ path: path.join(OUT_DIR_DESKTOP, '01_AU_AUTH_desktop_about_us_full.png'), fullPage: true });
  await auPage.screenshot({ path: path.join(OUT_DIR_DESKTOP, '02_AU_AUTH_desktop_about_us_viewport.png'), fullPage: false });
  console.log('   📸 AU Desktop screenshots captured.');

  // Extract AU Data
  const auData = await auPage.evaluate(() => {
    return {
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()).filter(Boolean),
      h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).filter(Boolean),
      h3: Array.from(document.querySelectorAll('h3')).map(e => e.innerText.trim()).filter(Boolean),
      headingsAll: Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(e => ({ tag: e.tagName, text: e.innerText.trim() })).filter(h => h.text.length > 0),
      images: Array.from(document.querySelectorAll('main img, .page-main img')).map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        isPlaceholder: (img.getAttribute('src') || '').includes('/placeholder/default/')
      })),
      sectionsCount: document.querySelectorAll('.widget, .block, section, .row, .column').length
    };
  });
  auditReport.auBaseline.desktop = auData;

  // AU Mobile Viewport
  console.log('   📱 Resizing to Mobile (390x844) on AU...');
  await auPage.setViewportSize({ width: 390, height: 844 });
  await auPage.waitForTimeout(2000);
  await scrollPageFully(auPage);
  await auPage.screenshot({ path: path.join(OUT_DIR_MOBILE, '01_AU_AUTH_mobile_about_us_full.png'), fullPage: true });
  await auPage.screenshot({ path: path.join(OUT_DIR_MOBILE, '02_AU_AUTH_mobile_about_us_viewport.png'), fullPage: false });
  console.log('   📸 AU Mobile screenshots captured.');

  await auContext.close();

  // ===========================================================================
  // 2. US TARGET (AUTHENTICATED) - DESKTOP & MOBILE
  // ===========================================================================
  console.log('\n▶ [PHASE 2/2] AUDITING US TARGET UNDER AUTHENTICATED STATE...');
  const usContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const usPage = await usContext.newPage();

  console.log('   🔐 Logging in to US Staging with Trade Customer account...');
  await usPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(2000);
  await clearOverlays(usPage);

  const usEmail = usPage.locator('#email');
  if (await usEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await usEmail.fill(US_CREDS.email);
    await usPage.fill('#pass', US_CREDS.pass);
    await usPage.click('#send2');
    await usPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await usPage.waitForTimeout(2500);
    console.log('   ✅ US Staging Authenticated.');
  }

  // Navigate to US About Us
  console.log('   👉 Loading US About Us page...');
  await usPage.goto(`${US_BASE}/about-us`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(3000);
  await clearOverlays(usPage);
  await scrollPageFully(usPage);

  // Capture US Desktop
  await usPage.screenshot({ path: path.join(OUT_DIR_DESKTOP, '03_US_AUTH_desktop_about_us_full.png'), fullPage: true });
  await usPage.screenshot({ path: path.join(OUT_DIR_DESKTOP, '04_US_AUTH_desktop_about_us_viewport.png'), fullPage: false });
  console.log('   📸 US Desktop screenshots captured.');

  // Extract US Data
  const usData = await usPage.evaluate(() => {
    return {
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()).filter(Boolean),
      h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).filter(Boolean),
      h3: Array.from(document.querySelectorAll('h3')).map(e => e.innerText.trim()).filter(Boolean),
      headingsAll: Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(e => ({ tag: e.tagName, text: e.innerText.trim() })).filter(h => h.text.length > 0),
      images: Array.from(document.querySelectorAll('main img, .page-main img')).map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        isPlaceholder: (img.getAttribute('src') || '').includes('/placeholder/default/')
      })),
      links: Array.from(document.querySelectorAll('main a, .page-main a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href') || '',
        isAuLeak: (a.getAttribute('href') || '').includes('.com.au')
      })),
      pricingToggleVisible: !!document.querySelector('.pricing-switcher, .gw-price-toggle, .trade-mode-toggle'),
      sectionsCount: document.querySelectorAll('.widget, .block, section, .row, .column').length
    };
  });
  auditReport.usTarget.desktop = usData;

  // US Mobile Viewport
  console.log('   📱 Resizing to Mobile (390x844) on US...');
  await usPage.setViewportSize({ width: 390, height: 844 });
  await usPage.waitForTimeout(2000);
  await scrollPageFully(usPage);
  await usPage.screenshot({ path: path.join(OUT_DIR_MOBILE, '03_US_AUTH_mobile_about_us_full.png'), fullPage: true });
  await usPage.screenshot({ path: path.join(OUT_DIR_MOBILE, '04_US_AUTH_mobile_about_us_viewport.png'), fullPage: false });
  console.log('   📸 US Mobile screenshots captured.');

  await usContext.close();
  await browser.close();

  // Save report JSON
  const auditJsonPath = path.join(BASE_DIR, 'about_us_dual_auth_audit_results.json');
  fs.writeFileSync(auditJsonPath, JSON.stringify(auditReport, null, 2));
  console.log(`\n💾 Saved dual-auth audit data to: ${auditJsonPath}`);
  console.log('========================================================================');
  console.log('🎉 DUAL-AUTH QA AUDIT COMPLETE FOR ABOUT US PAGE!');
  console.log('========================================================================');
})();
