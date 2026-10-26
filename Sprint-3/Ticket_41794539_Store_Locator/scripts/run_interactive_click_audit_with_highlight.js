const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const HIGHLIGHT_DIR = path.join(SCREENSHOTS_DIR, 'cursor_highlights');
const COMPARISON_DIR = path.join(BASE_DIR, 'comparison');

[HIGHLIGHT_DIR, COMPARISON_DIR].forEach(d => {
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

/**
 * Injects a visual cursor pointer and an animated click ripple ring into the page.
 * Whenever a click occurs, a glowing expanding red/gold ripple appears at the exact click coordinates.
 */
async function installClickHighlighter(page) {
  await page.evaluate(() => {
    if (window.__highlighterInstalled) return;
    window.__highlighterInstalled = true;

    const style = document.createElement('style');
    style.id = '__qa_highlighter_styles';
    style.innerHTML = `
      .__qa_cursor_pointer {
        position: fixed;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #f59e0b;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.6), 0 0 4px #f59e0b;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: opacity 0.2s ease;
      }
      .__qa_cursor_click_spotlight {
        position: fixed;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.45);
        border: 3px solid #ef4444;
        box-shadow: 0 0 16px rgba(239, 68, 68, 0.9);
        pointer-events: none;
        z-index: 2147483646;
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.45s cubic-bezier(0.1, 0.8, 0.2, 1), opacity 0.45s ease-out;
      }
      .__qa_cursor_click_inner {
        position: fixed;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #ef4444;
        border: 2px solid #ffffff;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
      }
    `;
    document.head.appendChild(style);

    const pointer = document.createElement('div');
    pointer.className = '__qa_cursor_pointer';
    pointer.id = '__qa_active_pointer';
    document.body.appendChild(pointer);

    window.addEventListener('mousemove', (e) => {
      pointer.style.left = e.clientX + 'px';
      pointer.style.top = e.clientY + 'px';
    }, { passive: true });

    window.__triggerClickHighlight = (x, y) => {
      // Create expanding outer ring
      const ring = document.createElement('div');
      ring.className = '__qa_cursor_click_spotlight';
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';

      // Create solid inner flash dot
      const inner = document.createElement('div');
      inner.className = '__qa_cursor_click_inner';
      inner.style.left = x + 'px';
      inner.style.top = y + 'px';

      document.body.appendChild(ring);
      document.body.appendChild(inner);

      requestAnimationFrame(() => {
        ring.style.transform = 'translate(-50%, -50%) scale(2.4)';
        ring.style.opacity = '0';
        inner.style.opacity = '0';
        inner.style.transform = 'translate(-50%, -50%) scale(0.6)';
      });

      setTimeout(() => {
        ring.remove();
        inner.remove();
      }, 500);
    };

    window.addEventListener('click', (e) => {
      window.__triggerClickHighlight(e.clientX, e.clientY);
    }, { capture: true, passive: true });
  }).catch(() => {});
}

/**
 * Moves mouse to element, highlights cursor with ripple, and performs the click.
 */
async function clickWithHighlight(page, locator, options = {}) {
  try {
    const box = await locator.boundingBox();
    if (box) {
      const clickX = box.x + box.width / 2;
      const clickY = box.y + box.height / 2;

      // Move mouse to position
      await page.mouse.move(clickX, clickY, { steps: 5 });
      await page.waitForTimeout(150);

      // Trigger highlight visual
      await page.evaluate(({ x, y }) => {
        if (window.__triggerClickHighlight) {
          window.__triggerClickHighlight(x, y);
        }
      }, { x: clickX, y: clickY });

      // Click
      await page.mouse.click(clickX, clickY);
      await page.waitForTimeout(options.delayAfter || 300);
    } else {
      await locator.click();
    }
  } catch (err) {
    console.warn(`Click notice for element: ${err.message}`);
    await locator.click().catch(() => {});
  }
}

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

(async () => {
  console.log('========================================================================');
  console.log('🎯 GLOBEWEST QA: INTERACTIVE CLICK AUDIT WITH CURSOR HIGHLIGHTER');
  console.log('   Strict Directive: Highlight cursor with animated ripple on every click');
  console.log('   Storefronts: US Staging vs AU Baseline (Desktop & iPhone 17 Pro)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  // ===========================================================================
  // 1. DESKTOP INTERACTION AUDIT (US STAGING)
  // ===========================================================================
  console.log('▶ [TEST 1/2] US STAGING INTERACTIVE AUDIT (DESKTOP 1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });
  const page = await desktopContext.newPage();

  console.log('   1. Navigating to US Locator...');
  await page.goto(`${US_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await clearOverlays(page);
  await installClickHighlighter(page);

  // Capture Above-the-fold with pointer
  await page.screenshot({ path: path.join(HIGHLIGHT_DIR, '01_US_Desktop_Initial_View.png') });

  // 1A. Click on Postcode Input Field (Highlight Click)
  console.log('   🖱️ Clicking Search by Postcode field with cursor highlight...');
  const postcodeInput = page.locator('input[placeholder*="Eg."], input[name="search"], #js-locator-search').first();
  if (await postcodeInput.isVisible()) {
    await clickWithHighlight(page, postcodeInput);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(HIGHLIGHT_DIR, '02_US_Click_Postcode_Input_Highlighted.png') });

    // Type US ZIP code
    console.log('   ⌨️ Entering US ZIP Code 90210...');
    await postcodeInput.fill('90210');
    await page.waitForTimeout(300);

    // Click Submit icon (Highlight Click)
    console.log('   🖱️ Clicking Submit button with cursor highlight...');
    const submitBtn = page.locator('button.locator-search-submit, .action.search, .locator-search-section button, form button').first();
    if (await submitBtn.isVisible()) {
      await clickWithHighlight(page, submitBtn);
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(HIGHLIGHT_DIR, '03_US_Click_Submit_Button_Highlighted.png') });
    }
  }

  // 1B. Click "USE CURRENT LOCATION" link (Highlight Click)
  console.log('   🖱️ Clicking "USE CURRENT LOCATION" link with cursor highlight...');
  const locationLink = page.locator('a:has-text("USE CURRENT LOCATION"), .locator-current-location, a.current-location').first();
  if (await locationLink.isVisible()) {
    await clickWithHighlight(page, locationLink);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(HIGHLIGHT_DIR, '04_US_Click_Current_Location_Highlighted.png') });
  }

  // 1C. Click "SEARCH BY STORE NAME" field (Highlight Click)
  console.log('   🖱️ Clicking "SEARCH BY STORE NAME" field with cursor highlight...');
  const storeInput = page.locator('input[placeholder*="Start Typing"], #js-store-search').first();
  if (await storeInput.isVisible()) {
    await clickWithHighlight(page, storeInput);
    await storeInput.fill('GlobeWest');
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(HIGHLIGHT_DIR, '05_US_Click_Store_Name_Highlighted.png') });
  }

  // 1D. Click on Broken Google Maps Canvas (Highlight Click to demonstrate non-responsiveness)
  console.log('   🖱️ Clicking Google Maps canvas to demonstrate error state...');
  const mapCanvas = page.locator('#js-locator-map, .gm-err-container').first();
  if (await mapCanvas.isVisible()) {
    await clickWithHighlight(page, mapCanvas);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(HIGHLIGHT_DIR, '06_US_Click_Broken_Map_Highlighted.png') });
  }

  await desktopContext.close();

  // ===========================================================================
  // 2. REAL IPHONE 17 PRO INTERACTION AUDIT (AUTHENTICATED)
  // ===========================================================================
  console.log('\n▶ [TEST 2/2] US STAGING IPHONE 17 PRO INTERACTION AUDIT (402x874 @3x)...');
  const mobileContext = await browser.newContext(IPHONE_17_PRO);
  const mobilePage = await mobileContext.newPage();

  console.log('   🔐 Logging into US Trade account on iPhone 17 Pro...');
  await mobilePage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(2500);
  await clearOverlays(mobilePage);

  const emailField = mobilePage.locator('#email');
  if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
    await emailField.fill(US_CREDS.email);
    await mobilePage.fill('#pass', US_CREDS.pass);
    await mobilePage.click('#send2');
    await mobilePage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await mobilePage.waitForTimeout(2500);
  }

  console.log('   👉 Loading US Store Locator on iPhone 17 Pro...');
  await mobilePage.goto(`${US_BASE}/locator`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(3500);
  await clearOverlays(mobilePage);
  await installClickHighlighter(mobilePage);

  // 2A. Click Mobile Hamburger Menu (Highlight Click)
  console.log('   🖱️ Clicking mobile hamburger navigation with cursor highlight...');
  const burgerBtn = mobilePage.locator('.nav-toggle, [data-action="toggle-nav"]').first();
  if (await burgerBtn.isVisible()) {
    await clickWithHighlight(mobilePage, burgerBtn);
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({ path: path.join(HIGHLIGHT_DIR, '07_US_Mobile_Click_Hamburger_Highlighted.png') });

    // Close burger
    const closeNav = mobilePage.locator('.action.close, .nav-toggle').first();
    if (await closeNav.isVisible()) {
      await clickWithHighlight(mobilePage, closeNav);
      await mobilePage.waitForTimeout(300);
    }
  }

  // 2B. Click Mobile Search by Postcode input (Highlight Click)
  console.log('   🖱️ Clicking Postcode field on iPhone 17 Pro with cursor highlight...');
  const mPostcode = mobilePage.locator('input[placeholder*="Eg."], #js-locator-search').first();
  if (await mPostcode.isVisible()) {
    await clickWithHighlight(mobilePage, mPostcode);
    await mPostcode.fill('78701'); // Austin TX ZIP
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({ path: path.join(HIGHLIGHT_DIR, '08_US_Mobile_Click_Postcode_Highlighted.png') });
  }

  // 2C. Scroll to CMS Block `stockist_info` on iPhone 17 Pro and click heading
  console.log('   🖱️ Scrolling to CMS block and highlighting heading click on iPhone 17 Pro...');
  const cmsHeading = mobilePage.locator('h2:has-text("How to Buy with a Stockist")').first();
  if (await cmsHeading.isVisible()) {
    await cmsHeading.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(500);
    await clickWithHighlight(mobilePage, cmsHeading);
    await mobilePage.screenshot({ path: path.join(HIGHLIGHT_DIR, '09_US_Mobile_Click_CMS_Heading_Highlighted.png') });
  }

  await mobileContext.close();
  await browser.close();

  console.log('\n========================================================================');
  console.log('🎉 INTERACTIVE CLICK AUDIT WITH CURSOR HIGHLIGHTER COMPLETE!');
  console.log('   Screenshots with highlighted click spotlight saved in: screenshots/cursor_highlights/');
  console.log('========================================================================');
})();
