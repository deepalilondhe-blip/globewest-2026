const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'mobile_live_comparison');
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

async function smoothScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;
        if (total >= 1500 || total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 150);
    });
  });
  await page.waitForTimeout(1000);
}

(async () => {
  console.log('========================================================================');
  console.log('📱 RUNNING HEADED RESPONSIVE MOBILE TESTING (390x844 iPhone 14/15)');
  console.log('   All 5 Features: 404, Terms, Privacy, Contact, FAQ');
  console.log('   US Staging vs Live AU Production');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=430,950']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  // 1. Authenticate on US Staging
  console.log('🔐 [1/6] Logging into US Staging with Trade Customer (Mobile)...');
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

  // 2. Iterate each page on Mobile
  for (let i = 0; i < PAGES.length; i++) {
    const p = PAGES[i];
    console.log(`\n------------------------------------------------------------------------`);
    console.log(`👉 [${i + 2}/6] Mobile Testing: ${p.name}`);
    console.log(`------------------------------------------------------------------------`);

    // A. US Staging Mobile
    console.log(`   🔵 US Staging Mobile: ${US_BASE}${p.usPath}`);
    await page.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);

    // Interactive mobile check
    if (p.id === 'terms') {
      console.log('      👉 Tapping accordion panel to test mobile expansion...');
      await page.evaluate(() => {
        const acc = document.querySelector('button[aria-expanded], div[data-role="collapsible"], .accordion-title');
        if (acc) acc.click();
      });
      await page.waitForTimeout(1000);
    }

    await smoothScroll(page);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `US_mobile_${p.id}.png`) });

    const usOverflow = await page.evaluate(() => ({
      scrollWidth: document.body.scrollWidth,
      clientWidth: window.innerWidth,
      hasOverflow: document.body.scrollWidth > window.innerWidth
    }));
    console.log(`      Layout Check: scrollWidth=${usOverflow.scrollWidth}px, innerWidth=${usOverflow.clientWidth}px, overflow=${usOverflow.hasOverflow}`);
    await page.waitForTimeout(2500); // Visual pause for user

    // B. Live AU Mobile
    console.log(`   🟢 Live AU Production Mobile: ${LIVE_AU_BASE}${p.auPath}`);
    await page.goto(`${LIVE_AU_BASE}${p.auPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);
    await smoothScroll(page);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `LIVE_AU_mobile_${p.id}.png`) });

    const auOverflow = await page.evaluate(() => ({
      scrollWidth: document.body.scrollWidth,
      clientWidth: window.innerWidth,
      hasOverflow: document.body.scrollWidth > window.innerWidth
    }));
    console.log(`      Layout Check: scrollWidth=${auOverflow.scrollWidth}px, innerWidth=${auOverflow.clientWidth}px, overflow=${auOverflow.hasOverflow}`);
    await page.waitForTimeout(2500); // Visual pause for user
  }

  console.log('\n========================================================================');
  console.log('🎉 HEADED RESPONSIVE MOBILE TESTING COMPLETED SUCCESSFULLY!');
  console.log('========================================================================');
  await page.waitForTimeout(3000);
  await browser.close();
})();
