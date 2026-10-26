const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const OUT_DIR = BASE_DIR; // Place directly in ticket folder for easy attaching!
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'retina_mobile');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const US_BASE = 'https://mcstaging2.globewest.com';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

const PAGES = [
  { id: '404', filename: '01_US_Mobile_404_Page.png', title: '404 Page Not Found', path: '/dfsdfd' },
  { id: 'terms', filename: '02_US_Mobile_Terms_and_Conditions.png', title: 'Terms & Conditions', path: '/terms-and-conditions-page' },
  { id: 'privacy', filename: '03_US_Mobile_Privacy_Policy.png', title: 'Privacy Policy', path: '/privacy-policy' },
  { id: 'contact', filename: '04_US_Mobile_Contact_Us.png', title: 'Contact Us', path: '/contact-us' },
  { id: 'faq', filename: '05_US_Mobile_Help_Centre_FAQ.png', title: 'Help Centre / FAQ', path: '/help-centre' }
];

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('📸 CAPTURING ULTRA HIGH-RES RETINA MOBILE SCREENSHOTS (deviceScaleFactor: 2)');
  console.log('   Zero color highlights, pure authentic mobile view, crystal-clear zoom');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome'
  });

  // Retina context (390x844 with scale factor 2 -> 780x1688 high density pixels)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // 1. Authenticate with Trade account
  console.log('🔐 Authenticating on US Staging...');
  await page.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await clearOverlays(page);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill(US_CREDS.email);
    await page.fill('#pass', US_CREDS.pass);
    await page.click('#send2');
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('✅ Logged in successfully!');
  }

  for (const p of PAGES) {
    console.log(`📸 Capturing: ${p.title} (${p.path})...`);
    await page.goto(`${US_BASE}${p.path}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);
    await clearOverlays(page);

    // Expand accordion on terms for realistic view
    if (p.id === 'terms') {
      await page.evaluate(() => {
        const acc = document.querySelector('button[aria-expanded], div[data-role="collapsible"], .accordion-title');
        if (acc) acc.click();
      });
      await page.waitForTimeout(800);
    }

    // Capture standard viewport (780x1688 retina)
    const outPath = path.join(OUT_DIR, p.filename);
    await page.screenshot({ path: outPath, type: 'png' });
    console.log(`   ✅ Saved: ${p.filename}`);

    // Also capture full page scroll view
    const fullPath = path.join(SCREENSHOTS_DIR, `FULL_${p.filename}`);
    await page.screenshot({ path: fullPath, fullPage: true, type: 'png' });
  }

  await browser.close();
  console.log('\n🎉 All ultra high-resolution mobile screenshots captured successfully!');
})();
