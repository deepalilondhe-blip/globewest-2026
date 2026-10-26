const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'desktop');
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
  console.log('🖥️ GLOBEWEST US MY ACCOUNT DASHBOARD - DESKTOP AUDIT');
  console.log('Target: ' + US_BASE + '/customer/account/');
  console.log('Figma Reference: Node 2581-64183 / Frame 620 Specs');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
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

    console.log('📸 Step 3: Capturing Desktop Viewport Screenshot...');
    const vpPath = path.join(SCREENSHOTS_DIR, 'US_Dashboard_Desktop_Viewport.png');
    await page.screenshot({ path: vpPath });
    console.log(`Saved: ${vpPath}`);

    console.log('🔍 Step 4: Inspecting Dashboard Modules against Figma Specs...');
    const auditResults = await page.evaluate(() => {
      // 1. Top Utility Bar
      const utilityBar = document.querySelector('.panel.wrapper, .header-panel, .utility-bar, .top-utility-bar');
      const isUtilityBarVisible = utilityBar ? window.getComputedStyle(utilityBar).display !== 'none' : false;

      // 2. Side Navigation
      const sideNavItems = Array.from(document.querySelectorAll('.block-collapsible-nav li, .nav.items li, .sidebar a'))
        .map(el => el.innerText.trim().replace(/\n+/g, ' '))
        .filter(Boolean);

      // 3. Welcome Block
      const welcomeBlock = document.querySelector('.welcome, .loyalty-block, [class*="welcome"], [class*="tier"]');
      const welcomeText = welcomeBlock ? welcomeBlock.innerText : '';

      // 4. Recent Orders Table
      const orderRows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
        const cells = Array.from(tr.querySelectorAll('td, th')).map(td => td.innerText.trim());
        const statusBadge = tr.querySelector('[class*="status"], .status');
        return {
          order: cells[0] || '',
          date: cells[1] || '',
          status: statusBadge ? statusBadge.innerText.trim() : (cells[2] || ''),
          total: cells[3] || '',
          balance: cells[4] || ''
        };
      });

      // 5. Notification Block
      const hasClaimNotification = document.body.innerText.includes('You can now submit claims online');

      // 6. FAQs
      const faqItems = Array.from(document.querySelectorAll('[class*="faq"] [class*="title"], [class*="accordion"] [class*="title"], .frequently-asked-questions h3'))
        .map(el => el.innerText.trim());

      return {
        isUtilityBarVisible,
        sideNavItems,
        welcomeText: welcomeText.slice(0, 150),
        orderRows,
        hasClaimNotification,
        faqCount: faqItems.length
      };
    });

    console.log('\n--- DOM Audit Findings ---');
    console.log(`• Top Utility Bar Visible: ${auditResults.isUtilityBarVisible} (Figma Frame 620 specifies HIDDEN on Dashboard)`);
    console.log(`• Side Nav Links Count: ${auditResults.sideNavItems.length}`);
    console.log(`• Side Nav Links: ${auditResults.sideNavItems.slice(0, 6).join(' | ')}`);
    console.log(`• Recent Orders Found: ${auditResults.orderRows.length}`);
    console.log(`• Submit Claim Notification Present: ${auditResults.hasClaimNotification}`);
    console.log(`• FAQ Accordion Count: ${auditResults.faqCount}`);

    console.log('\n📜 Step 5: Scrolling through complete Dashboard...');
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    console.log('📸 Step 6: Capturing Desktop Full-Page Screenshot...');
    const fpPath = path.join(SCREENSHOTS_DIR, 'US_Dashboard_Desktop_FullPage.png');
    await page.screenshot({ path: fpPath, fullPage: true });
    console.log(`Saved: ${fpPath}`);

    console.log('\n✅ Desktop Audit Completed Successfully!');
  } catch (err) {
    console.error('❌ Error during desktop audit:', err);
  } finally {
    await browser.close();
  }
})();
