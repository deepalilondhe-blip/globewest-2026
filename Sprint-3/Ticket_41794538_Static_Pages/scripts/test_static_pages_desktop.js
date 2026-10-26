const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'desktop');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const AU_BASE = 'https://mcstaging2.globewest.com.au';
const US_BASE = 'https://mcstaging2.globewest.com';

const AU_CREDS = { email: 'deepalilondhe576@gmail.com', pass: 'Deep@123' };
const US_CREDS = { email: 'deepali.londhe@overdose.digital', pass: 'Deep@123' };

const STATIC_PAGES = [
  { id: 'terms', name: 'Terms & Conditions', auPath: '/terms-and-conditions-page', usPath: '/terms-and-conditions-page' },
  { id: 'privacy', name: 'Privacy Policy', auPath: '/privacy-policy', usPath: '/privacy-policy' },
  { id: 'contact', name: 'Contact Us', auPath: '/contact', usPath: '/contact-us' },
  { id: 'faq', name: 'Help Centre / FAQ', auPath: '/help-centre', usPath: '/help-centre' },
  { id: '404', name: '404 Page', auPath: '/non-existent-page-404-test', usPath: '/non-existent-page-404-test' }
];

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
  console.log('🚀 AUDITING STATIC PAGES (DESKTOP 1440x900 - DUAL-AUTH MATRIX)');
  console.log('   Terms, Privacy, Contact, FAQ, 404 (US Target vs AU Baseline)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const auditResults = {
    timestamp: new Date().toISOString(),
    ticket: '#41794538 - Static Pages: Terms, Privacy, Contact, FAQ, 404',
    pages: {}
  };

  // 1. AUDIT AU BASELINE
  console.log('▶ [PHASE 1/2] AUDITING AU BASELINE (AUTHENTICATED)...');
  const auContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const auPage = await auContext.newPage();

  console.log('   🔐 Logging in to AU Staging...');
  await auPage.goto(`${AU_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(2000);
  await clearOverlays(auPage);

  const auEmail = auPage.locator('#email');
  if (await auEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await auEmail.fill(AU_CREDS.email);
    await auPage.fill('#pass', AU_CREDS.pass);
    await auPage.click('#send2');
    await auPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await auPage.waitForTimeout(2000);
    console.log('   ✅ AU Staging Authenticated.');
  }

  for (const p of STATIC_PAGES) {
    console.log(`   👉 Navigating to AU ${p.name} (${p.auPath})...`);
    await auPage.goto(`${AU_BASE}${p.auPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await auPage.waitForTimeout(3000);
    await clearOverlays(auPage);
    await scrollPageFully(auPage);

    const prefix = `AU_${p.id}`;
    await auPage.screenshot({ path: path.join(SCREENSHOTS_DIR, `${prefix}_desktop_viewport.png`) });
    await auPage.screenshot({ path: path.join(SCREENSHOTS_DIR, `${prefix}_desktop_full.png`), fullPage: true });

    const pageData = await auPage.evaluate(() => ({
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()).filter(Boolean),
      h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).filter(Boolean),
      bodyLength: document.body.innerText.length,
      imagesCount: document.querySelectorAll('main img').length,
      brokenImages: Array.from(document.querySelectorAll('main img')).filter(img => !img.complete || img.naturalWidth === 0).length,
      placeholders: Array.from(document.querySelectorAll('main img')).filter(img => (img.getAttribute('src') || '').includes('/placeholder/default/')).length
    }));

    if (!auditResults.pages[p.id]) auditResults.pages[p.id] = {};
    auditResults.pages[p.id].au = pageData;
    console.log(`   📸 Captured AU ${p.name}`);
  }
  await auContext.close();

  // 2. AUDIT US STAGING TARGET
  console.log('\n▶ [PHASE 2/2] AUDITING US STAGING TARGET (AUTHENTICATED)...');
  const usContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const usPage = await usContext.newPage();

  console.log('   🔐 Logging in to US Staging with Trade Account...');
  await usPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(2000);
  await clearOverlays(usPage);

  const usEmail = usPage.locator('#email');
  if (await usEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await usEmail.fill(US_CREDS.email);
    await usPage.fill('#pass', US_CREDS.pass);
    await usPage.click('#send2');
    await usPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await usPage.waitForTimeout(2000);
    console.log('   ✅ US Staging Authenticated.');
  }

  for (const p of STATIC_PAGES) {
    console.log(`   👉 Navigating to US ${p.name} (${p.usPath})...`);
    await usPage.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await usPage.waitForTimeout(3000);
    await clearOverlays(usPage);
    await scrollPageFully(usPage);

    const prefix = `US_${p.id}`;
    await usPage.screenshot({ path: path.join(SCREENSHOTS_DIR, `${prefix}_desktop_viewport.png`) });
    await usPage.screenshot({ path: path.join(SCREENSHOTS_DIR, `${prefix}_desktop_full.png`), fullPage: true });

    const pageData = await usPage.evaluate(() => ({
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()).filter(Boolean),
      h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).filter(Boolean),
      bodyLength: document.body.innerText.length,
      imagesCount: document.querySelectorAll('main img').length,
      brokenImages: Array.from(document.querySelectorAll('main img')).filter(img => !img.complete || img.naturalWidth === 0).length,
      placeholders: Array.from(document.querySelectorAll('main img')).filter(img => (img.getAttribute('src') || '').includes('/placeholder/default/')).length
    }));

    auditResults.pages[p.id].us = pageData;
    console.log(`   📸 Captured US ${p.name}`);
  }
  await usContext.close();

  await browser.close();

  const outPath = path.join(BASE_DIR, 'static_pages_desktop_audit_results.json');
  fs.writeFileSync(outPath, JSON.stringify(auditResults, null, 2));
  console.log(`\n💾 Saved audit results to: ${outPath}`);
  console.log('🎉 Desktop Audit of all 5 static pages completed!');
})();
