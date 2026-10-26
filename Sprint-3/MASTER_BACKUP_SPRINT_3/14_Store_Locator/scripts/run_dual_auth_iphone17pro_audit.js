const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const DESKTOP_DIR = path.join(SCREENSHOTS_DIR, 'desktop');
const MOBILE_DIR = path.join(SCREENSHOTS_DIR, 'mobile');
const IPHONE17_DIR = path.join(SCREENSHOTS_DIR, 'iphone17pro');
const DEFECTS_DIR = path.join(SCREENSHOTS_DIR, 'defects');

[SCREENSHOTS_DIR, DESKTOP_DIR, MOBILE_DIR, IPHONE17_DIR, DEFECTS_DIR].forEach(d => {
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

// Precise iPhone 17 Pro Device Profile (Logical: 402x874, DPR: 3.0, iOS 18.2 Safari UA, Touch: true)
const IPHONE_17_PRO = {
  viewport: { width: 402, height: 874 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1'
};

const DESKTOP_PROFILE = {
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
};

async function clearOverlays(page) {
  await page.evaluate(() => {
    const selectors = [
      '#lpshroud', '[id*="Survey"]', '[id*="lp"]', '.modal-popup',
      '.newsletter-modal', '.ui-widget-overlay', '#cookie-status',
      '.klaviyo-close-form', '.modal-custom', '.action-close'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
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
      }, 100);
    });
  });
  await page.waitForTimeout(1500);
}

(async () => {
  console.log('========================================================================');
  console.log('📱 GLOBEWEST QA AUDIT: DUAL-AUTH & REAL IPHONE 17 PRO STORE LOCATOR');
  console.log('Ticket: #41794539 - Store Locator');
  console.log('Target US: ' + US_BASE + '/locator');
  console.log('Baseline AU: ' + AU_BASE + '/locator');
  console.log('Specs: iPhone 17 Pro (402x874, 3x Retina, Touch, Safari iOS 18.2)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const auditData = {
    timestamp: new Date().toISOString(),
    ticket: '#41794539 - Store Locator',
    device: 'iPhone 17 Pro (402x874 @3x) + Desktop (1440x900)',
    us: {},
    au: {}
  };

  // ===========================================================================
  // PHASE 1: AU STOREFRONT (AUTHENTICATED & GUEST ON IPHONE 17 PRO & DESKTOP)
  // ===========================================================================
  console.log('▶ [PHASE 1/4] AUDITING AU STOREFRONT (mcstaging2.globewest.com.au)...');

  // 1A. AU Authenticated Session Context
  const auContext = await browser.newContext(DESKTOP_PROFILE);
  const auPage = await auContext.newPage();

  console.log('   🔐 Logging into AU Staging Customer Account (deepalilondhe576@gmail.com)...');
  try {
    await auPage.goto(`${AU_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await auPage.waitForTimeout(3000);
    await clearOverlays(auPage);

    const emailInput = auPage.locator('#email');
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(AU_CREDS.email);
      await auPage.fill('#pass', AU_CREDS.pass);
      await auPage.click('#send2');
      await auPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await auPage.waitForTimeout(3000);
      console.log('   ✅ AU Staging Login Submitted.');
    }
  } catch (err) {
    console.warn('   ⚠️ AU Login notice:', err.message);
  }

  // Navigate to AU Locator Desktop (Auth)
  console.log('   👉 Navigating to AU Locator Desktop (Auth)...');
  await auPage.goto(`${AU_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(4000);
  await clearOverlays(auPage);
  await scrollPageFully(auPage);

  await auPage.screenshot({ path: path.join(DESKTOP_DIR, 'AU_AUTH_Desktop_Full_Page.png'), fullPage: true });
  await auPage.screenshot({ path: path.join(DESKTOP_DIR, 'AU_AUTH_Desktop_Above_Fold.png'), fullPage: false });
  console.log('   📸 AU Desktop screenshots captured.');

  const auDesktopDetails = await auPage.evaluate(() => {
    return {
      title: document.title,
      h1: document.querySelector('h1')?.innerText?.trim() || '',
      stockistInfoBlock: !!document.querySelector('.stockist-info, [data-content-type="row"], .block-static-block'),
      cmsText: document.querySelector('.page-main')?.innerText?.substring(0, 500) || '',
      mapCanvasExists: !!document.querySelector('#js-locator-map, .locator-map-section')
    };
  });
  auditData.au.desktop = auDesktopDetails;

  // Save AU Storage State for iPhone 17 Pro
  const auStorageState = await auContext.storageState();
  await auContext.close();

  // 1B. AU iPhone 17 Pro (Authenticated)
  console.log('   📱 Launching iPhone 17 Pro Context for AU (Authenticated)...');
  const auMobileContext = await browser.newContext({
    ...IPHONE_17_PRO,
    storageState: auStorageState
  });
  const auMobilePage = await auMobileContext.newPage();
  await auMobilePage.goto(`${AU_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auMobilePage.waitForTimeout(4000);
  await clearOverlays(auMobilePage);
  await scrollPageFully(auMobilePage);

  await auMobilePage.screenshot({ path: path.join(IPHONE17_DIR, '01_AU_AUTH_iPhone17Pro_Full_Page.png'), fullPage: true });
  await auMobilePage.screenshot({ path: path.join(IPHONE17_DIR, '02_AU_AUTH_iPhone17Pro_Above_Fold.png'), fullPage: false });
  console.log('   📸 AU iPhone 17 Pro screenshots captured.');
  await auMobileContext.close();

  // ===========================================================================
  // PHASE 2: US STOREFRONT (AUTHENTICATED & GUEST ON IPHONE 17 PRO & DESKTOP)
  // ===========================================================================
  console.log('\n▶ [PHASE 2/4] AUDITING US STOREFRONT (mcstaging2.globewest.com)...');

  // 2A. US Authenticated Session Context (Desktop)
  const usContext = await browser.newContext(DESKTOP_PROFILE);
  const usPage = await usContext.newPage();

  // Track console errors
  const usErrors = [];
  usPage.on('console', msg => {
    if (msg.type() === 'error') usErrors.push(msg.text());
  });
  usPage.on('pageerror', err => usErrors.push(err.message));

  console.log('   🔐 Logging into US Staging Trade Account (deepali.londhe@overdose.digital)...');
  try {
    await usPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await usPage.waitForTimeout(3000);
    await clearOverlays(usPage);

    const emailInput = usPage.locator('#email');
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill(US_CREDS.email);
      await usPage.fill('#pass', US_CREDS.pass);
      await usPage.click('#send2');
      await usPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await usPage.waitForTimeout(3000);
      console.log('   ✅ US Staging Login Submitted.');
    }
  } catch (err) {
    console.warn('   ⚠️ US Login notice:', err.message);
  }

  // Navigate to US Locator Desktop (Auth)
  console.log('   👉 Navigating to US Locator Desktop (Auth)...');
  await usPage.goto(`${US_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(5000);
  await clearOverlays(usPage);
  await scrollPageFully(usPage);

  await usPage.screenshot({ path: path.join(DESKTOP_DIR, 'US_AUTH_Desktop_Full_Page.png'), fullPage: true });
  await usPage.screenshot({ path: path.join(DESKTOP_DIR, 'US_AUTH_Desktop_Above_Fold.png'), fullPage: false });
  console.log('   📸 US Desktop screenshots captured.');

  // Deeply inspect US Locator DOM & CMS block `stockist_info`
  const usDetails = await usPage.evaluate(() => {
    const cmsBlocks = Array.from(document.querySelectorAll('.widget, .block-static-block, [data-content-type="row"], .locator-content, .stockist-info')).map(el => ({
      class: el.className,
      id: el.id,
      text: el.innerText.trim().substring(0, 300)
    }));

    // Find CMS block text specifically
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, .page-title span')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim()
    }));

    const searchInput = document.querySelector('#js-locator-search, input[placeholder*="Eg."], input[name="search"], .locator-search-input');
    const placeholder = searchInput ? searchInput.getAttribute('placeholder') : null;

    const gmAuthFailure = !!document.querySelector('.gm-err-container, [src*="staticmap"]');
    const gmCanvas = document.querySelector('#js-locator-map');
    const gmErrorText = gmCanvas ? gmCanvas.innerText.trim() : '';

    const priceToggle = document.querySelector('.pricing-switcher, .gw-price-toggle, .trade-mode-toggle, [data-role="price-toggle"]');
    const accountDropdown = document.querySelector('.customer-welcome, .header.links .customer-name, .authorization-link');

    const footerText = document.querySelector('footer, .page-footer')?.innerText || '';
    const bodyText = document.body.innerText;

    return {
      title: document.title,
      headings,
      cmsBlocks,
      placeholder,
      gmAuthFailure,
      gmErrorText,
      hasTradeToggle: !!priceToggle,
      tradeToggleText: priceToggle?.innerText?.trim() || '',
      accountGreeting: accountDropdown?.innerText?.trim() || '',
      footerBadgeAustralian: footerText.includes('AUSTRALIAN OWNED & RUN'),
      containsAustraliasFinest: bodyText.includes("Australia's finest"),
      containsFinalise: bodyText.includes('finalise'),
      containsFinalize: bodyText.includes('finalize')
    };
  });

  usDetails.consoleErrors = usErrors;
  auditData.us.desktop = usDetails;

  // Capture Header Close-Up (Showing Trade Login State)
  const headerElem = usPage.locator('header.page-header, .panel.header').first();
  if (await headerElem.isVisible()) {
    await headerElem.screenshot({ path: path.join(DEFECTS_DIR, 'US_AUTH_Header_Trade_State.png') });
  }

  // Capture CMS Block Close-Up (`stockist_info`)
  const cmsBlockElem = usPage.locator('.locator-content, .locator-information, [data-content-type="row"]').first();
  if (await cmsBlockElem.isVisible()) {
    await cmsBlockElem.screenshot({ path: path.join(DEFECTS_DIR, 'US_CMS_Block_Stockist_Info.png') });
  }

  // Save US Storage State for iPhone 17 Pro
  const usStorageState = await usContext.storageState();
  await usContext.close();

  // ===========================================================================
  // PHASE 3: US IPHONE 17 PRO REAL-TIME VIEW (AUTHENTICATED)
  // ===========================================================================
  console.log('\n▶ [PHASE 3/4] AUDITING US IPHONE 17 PRO (AUTHENTICATED)...');
  const usMobileContext = await browser.newContext({
    ...IPHONE_17_PRO,
    storageState: usStorageState
  });
  const usMobilePage = await usMobileContext.newPage();

  console.log('   👉 Loading US Locator on iPhone 17 Pro (402x874 @3x)...');
  await usMobilePage.goto(`${US_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usMobilePage.waitForTimeout(5000);
  await clearOverlays(usMobilePage);
  await scrollPageFully(usMobilePage);

  // iPhone 17 Pro Full Page View
  await usMobilePage.screenshot({ path: path.join(IPHONE17_DIR, '03_US_AUTH_iPhone17Pro_Full_Page.png'), fullPage: true });
  // iPhone 17 Pro Viewport (Above the Fold)
  await usMobilePage.screenshot({ path: path.join(IPHONE17_DIR, '04_US_AUTH_iPhone17Pro_Viewport_Above_Fold.png'), fullPage: false });

  // Scroll to Map Section on iPhone 17 Pro
  const mobileMap = usMobilePage.locator('#js-locator-map, .locator-map-section').first();
  if (await mobileMap.isVisible()) {
    await mobileMap.scrollIntoViewIfNeeded();
    await usMobilePage.waitForTimeout(500);
    await usMobilePage.screenshot({ path: path.join(IPHONE17_DIR, '05_US_AUTH_iPhone17Pro_Map_Section.png'), fullPage: false });
  }

  // Scroll to CMS Block on iPhone 17 Pro
  const mobileCms = usMobilePage.locator('.locator-content, .locator-information').first();
  if (await mobileCms.isVisible()) {
    await mobileCms.scrollIntoViewIfNeeded();
    await usMobilePage.waitForTimeout(500);
    await usMobilePage.screenshot({ path: path.join(IPHONE17_DIR, '06_US_AUTH_iPhone17Pro_CMS_Section.png'), fullPage: false });
  }

  // Mobile Navigation / Trade State in hamburger
  const burger = usMobilePage.locator('.nav-toggle, [data-action="toggle-nav"]').first();
  if (await burger.isVisible()) {
    await burger.click();
    await usMobilePage.waitForTimeout(1000);
    await usMobilePage.screenshot({ path: path.join(IPHONE17_DIR, '07_US_AUTH_iPhone17Pro_Mobile_Nav_Drawer.png'), fullPage: false });
  }

  console.log('   📸 US iPhone 17 Pro screenshots captured.');
  await usMobileContext.close();

  // ===========================================================================
  // PHASE 4: US & AU GUEST ON IPHONE 17 PRO (FOR COMPLETE DUAL-STATE MATRIX)
  // ===========================================================================
  console.log('\n▶ [PHASE 4/4] AUDITING GUEST SESSIONS ON IPHONE 17 PRO...');
  const guestContext = await browser.newContext(IPHONE_17_PRO);
  const guestPage = await guestContext.newPage();

  console.log('   👉 US Guest iPhone 17 Pro...');
  await guestPage.goto(`${US_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await guestPage.waitForTimeout(4000);
  await clearOverlays(guestPage);
  await guestPage.screenshot({ path: path.join(IPHONE17_DIR, '08_US_GUEST_iPhone17Pro_Viewport.png'), fullPage: false });

  console.log('   👉 AU Guest iPhone 17 Pro...');
  await guestPage.goto(`${AU_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await guestPage.waitForTimeout(4000);
  await clearOverlays(guestPage);
  await guestPage.screenshot({ path: path.join(IPHONE17_DIR, '09_AU_GUEST_iPhone17Pro_Viewport.png'), fullPage: false });

  await guestContext.close();
  await browser.close();

  // Save audit data
  const resultJson = path.join(BASE_DIR, 'dual_auth_iphone17pro_results.json');
  fs.writeFileSync(resultJson, JSON.stringify(auditData, null, 2));

  console.log('\n💾 Audit results saved to: ' + resultJson);
  console.log('========================================================================');
  console.log('🎉 DUAL-AUTH & REAL IPHONE 17 PRO AUDIT COMPLETE!');
  console.log('========================================================================');
})();
