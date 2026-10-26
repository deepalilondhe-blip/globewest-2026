const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DT = path.join(BASE_DIR, 'screenshots', 'desktop');
const SCREENSHOTS_MOB = path.join(BASE_DIR, 'screenshots', 'mobile');
fs.mkdirSync(SCREENSHOTS_DT, { recursive: true });
fs.mkdirSync(SCREENSHOTS_MOB, { recursive: true });

const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';

const US_CREDS = { email: 'deepali.londhe@overdose.digital', pass: 'Deep@123' };
const AU_CREDS = { email: 'deepalilondhe576@gmail.com', pass: 'Deep@123' };

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
  await page.waitForTimeout(1500);
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 AUDITING LIVE US STAGING DASHBOARD (https://mcstaging2.globewest.com/customer/account/)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  // 1. DESKTOP VIEW (1440x900)
  const dtContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dtPage = await dtContext.newPage();

  console.log('🔐 Logging into US Staging with Trade Customer...');
  await dtPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await dtPage.waitForTimeout(2000);
  await clearOverlays(dtPage);

  const emailField = dtPage.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill(US_CREDS.email);
    await dtPage.fill('#pass', US_CREDS.pass);
    await dtPage.click('#send2');
    await dtPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await dtPage.waitForTimeout(2500);
    console.log('✅ Logged in successfully!');
  }

  console.log('👉 Navigating to My Account Dashboard (/customer/account/)...');
  await dtPage.goto(`${US_BASE}/customer/account/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await dtPage.waitForTimeout(3000);
  await clearOverlays(dtPage);

  await dtPage.screenshot({ path: path.join(SCREENSHOTS_DT, 'US_Dashboard_Desktop_Viewport.png') });
  await scrollPageFully(dtPage);
  await dtPage.screenshot({ path: path.join(SCREENSHOTS_DT, 'US_Dashboard_Desktop_FullPage.png'), fullPage: true });
  console.log('📸 Captured Desktop Viewport and FullPage screenshots!');

  // Extract DOM metrics
  const dtData = await dtPage.evaluate(() => {
    const sideNavLinks = Array.from(document.querySelectorAll('.block-collapsible-nav li, .nav.items li, .sidebar a')).map(a => a.innerText.trim()).filter(Boolean);
    const mainHeadings = Array.from(document.querySelectorAll('.column.main h1, .column.main h2, .column.main h3')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim()
    }));
    const hasWelcomeBanner = !!document.querySelector('.welcome, .loyalty-block, [class*="welcome"], [class*="tier"]');
    const hasRecentOrders = !!document.querySelector('.block-recent-orders, .table-order-items, .orders-recent, table');
    const hasEventsPromotions = !!document.querySelector('[class*="promotion"], [class*="event"]');
    const hasFaqs = !!document.querySelector('[class*="faq"], .frequently-asked-questions');
    const hasBookings = !!document.querySelector('[class*="booking"], [class*="appointment"]');
    const hasSubmitClaimNotice = document.body.innerText.includes('You can now submit claims online') || document.body.innerText.includes('submit claims online');

    return {
      title: document.title,
      sideNavLinks,
      mainHeadings,
      hasWelcomeBanner,
      hasRecentOrders,
      hasEventsPromotions,
      hasFaqs,
      hasBookings,
      hasSubmitClaimNotice,
      bodyTextSnippet: document.querySelector('.column.main')?.innerText.slice(0, 800)
    };
  });

  console.log('\n📊 US STAGING DASHBOARD DOM INSPECTION:');
  console.log(JSON.stringify(dtData, null, 2));

  await dtContext.close();

  // 2. MOBILE VIEW (390x844)
  const mobContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
  });
  const mobPage = await mobContext.newPage();

  await mobPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobPage.waitForTimeout(2000);
  await clearOverlays(mobPage);

  if (await mobPage.locator('#email').isVisible({ timeout: 5000 }).catch(() => false)) {
    await mobPage.fill('#email', US_CREDS.email);
    await mobPage.fill('#pass', US_CREDS.pass);
    await mobPage.click('#send2');
    await mobPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await mobPage.waitForTimeout(2000);
  }

  await mobPage.goto(`${US_BASE}/customer/account/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobPage.waitForTimeout(3000);
  await clearOverlays(mobPage);

  await mobPage.screenshot({ path: path.join(SCREENSHOTS_MOB, 'US_Dashboard_Mobile_Viewport.png') });
  await scrollPageFully(mobPage);
  await mobPage.screenshot({ path: path.join(SCREENSHOTS_MOB, 'US_Dashboard_Mobile_FullPage.png'), fullPage: true });
  console.log('📸 Captured Mobile Viewport and FullPage screenshots!');

  await mobContext.close();
  await browser.close();

  fs.writeFileSync(path.join(BASE_DIR, 'live_us_dashboard_inspection.json'), JSON.stringify(dtData, null, 2));
  console.log('🎉 Live US Dashboard capture and inspection completed!');
})();
