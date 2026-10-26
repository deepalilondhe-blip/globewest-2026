const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'live_au_comparison');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const US_BASE = 'https://mcstaging2.globewest.com';
const LIVE_AU_BASE = 'https://www.globewest.com.au';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

const PAGES = [
  { id: '404', name: '404 Page Not Found', usPath: '/dfsdfd', auPath: '/dfsdfd' },
  { id: 'terms', name: 'Terms & Conditions', usPath: '/terms-and-conditions-page', auPath: '/terms-and-conditions-page' },
  { id: 'privacy', name: 'Privacy Policy', usPath: '/privacy-policy', auPath: '/privacy-policy' },
  { id: 'contact', name: 'Contact Us', usPath: '/contact-us', auPath: '/contact' },
  { id: 'faq', name: 'Help Centre / FAQ', usPath: '/help-centre', auPath: '/help-centre' }
];

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 RUNNING HEADED MODE: US STAGING vs LIVE AU (https://www.globewest.com.au/)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // 1. Authenticate on US Staging
  console.log('🔐 [1/6] Logging into US Staging with Trade Customer...');
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
    console.log('✅ Logged into US Staging successfully!');
  }

  // 2. Iterate each page, showing US Staging then Live AU
  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    console.log(`\n------------------------------------------------------------------------`);
    console.log(`👉 [${i + 2}/6] Checking: ${p.name}`);
    console.log(`------------------------------------------------------------------------`);

    // A. Show US Staging
    console.log(`   🔵 Navigating to US Staging: ${US_BASE}${p.usPath}`);
    await page.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `US_${p.id}.png`) });

    const usTitle = await page.title();
    console.log(`      Title: "${usTitle}"`);
    await page.waitForTimeout(3000); // Visual pause for user in headed mode

    // B. Show Live AU
    console.log(`   🟢 Navigating to LIVE AU Production: ${LIVE_AU_BASE}${p.auPath}`);
    await page.goto(`${LIVE_AU_BASE}${p.auPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `LIVE_AU_${p.id}.png`) });

    const auTitle = await page.title();
    console.log(`      Title: "${auTitle}"`);
    await page.waitForTimeout(3000); // Visual pause for user in headed mode
  }

  console.log('\n========================================================================');
  console.log('🎉 HEADED MODE COMPARISON COMPLETED SUCCESSFULLY!');
  console.log('========================================================================');
  await page.waitForTimeout(4000);
  await browser.close();
})();
