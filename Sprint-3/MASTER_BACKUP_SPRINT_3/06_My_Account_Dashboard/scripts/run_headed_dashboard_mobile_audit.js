const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'mobile');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const US_BASE = 'https://mcstaging2.globewest.com';
const US_CREDS = { email: 'deepali.londhe@overdose.digital', pass: 'Deep@123' };

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('📱 GLOBEWEST US MY ACCOUNT DASHBOARD - MOBILE AUDIT (390x844)');
  console.log('Target: ' + US_BASE + '/customer/account/');
  console.log('Figma Reference: Node 2581-64183 / Mobile Frame 620 Specs');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
  });

  const page = await context.newPage();

  try {
    console.log('🔐 Step 1: Authenticating Trade Account on US Staging...');
    await page.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await clearOverlays(page);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailField.fill(US_CREDS.email);
      await page.fill('#pass', US_CREDS.pass);
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('✅ Authenticated successfully!');
    }

    console.log('👉 Step 2: Navigating to My Account Dashboard (/customer/account/)...');
    await page.goto(`${US_BASE}/customer/account/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
    await clearOverlays(page);

    console.log('📸 Step 3: Capturing Mobile Viewport Screenshot...');
    const vpPath = path.join(SCREENSHOTS_DIR, 'US_Dashboard_Mobile_Viewport.png');
    await page.screenshot({ path: vpPath });
    console.log(`Saved: ${vpPath}`);

    console.log('🔍 Step 4: Inspecting Mobile Layout against Figma Specs...');
    const auditResults = await page.evaluate(() => {
      const utilityBar = document.querySelector('.panel.wrapper, .header-panel, .utility-bar, .top-utility-bar');
      const isUtilityBarVisible = utilityBar ? window.getComputedStyle(utilityBar).display !== 'none' : false;

      const navSelect = document.querySelector('.block-collapsible-nav, select, [class*="nav-current"]');
      const navText = navSelect ? navSelect.innerText.trim() : '';

      const table = document.querySelector('table');
      const tableHeaders = table ? Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim()) : [];

      return {
        isUtilityBarVisible,
        navText: navText.slice(0, 100),
        tableHeaders
      };
    });

    console.log('\n--- Mobile Findings ---');
    console.log(`• Top Utility Bar Visible: ${auditResults.isUtilityBarVisible} (Figma Frame 620 specifies HIDDEN on Mobile)`);
    console.log(`• Mobile Table Headers: ${auditResults.tableHeaders.join(' | ')}`);

    console.log('\n📜 Step 5: Scrolling through complete Mobile Dashboard...');
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 250;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 80);
      });
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    console.log('📸 Step 6: Capturing Mobile Full-Page Screenshot...');
    const fpPath = path.join(SCREENSHOTS_DIR, 'US_Dashboard_Mobile_FullPage.png');
    await page.screenshot({ path: fpPath, fullPage: true });
    console.log(`Saved: ${fpPath}`);

    console.log('\n✅ Mobile Audit Completed Successfully!');
  } catch (err) {
    console.error('❌ Error during mobile audit:', err);
  } finally {
    await browser.close();
  }
})();
