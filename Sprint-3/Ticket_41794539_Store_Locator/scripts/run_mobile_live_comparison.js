const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const MOBILE_DIR = path.join(SCREENSHOTS_DIR, 'mobile');
const DEFECTS_DIR = path.join(SCREENSHOTS_DIR, 'defects');

fs.mkdirSync(MOBILE_DIR, { recursive: true });
fs.mkdirSync(DEFECTS_DIR, { recursive: true });

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function installClickHighlighter(page) {
  await page.evaluate(() => {
    if (window.__highlighterInstalled) return;
    window.__highlighterInstalled = true;

    const style = document.createElement('style');
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
    document.body.appendChild(pointer);

    window.addEventListener('mousemove', (e) => {
      pointer.style.left = e.clientX + 'px';
      pointer.style.top = e.clientY + 'px';
    }, { passive: true });

    window.__triggerClickHighlight = (x, y) => {
      const ring = document.createElement('div');
      ring.className = '__qa_cursor_click_spotlight';
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';

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

async function clickWithHighlight(page, locator, options = {}) {
  try {
    const box = await locator.boundingBox();
    if (box) {
      const clickX = box.x + box.width / 2;
      const clickY = box.y + box.height / 2;
      await page.mouse.move(clickX, clickY, { steps: 5 });
      await page.waitForTimeout(150);
      await page.evaluate(({ x, y }) => {
        if (window.__triggerClickHighlight) window.__triggerClickHighlight(x, y);
      }, { x: clickX, y: clickY });
      await page.mouse.click(clickX, clickY);
      await page.waitForTimeout(options.delayAfter || 300);
    } else {
      await locator.click();
    }
  } catch (err) {
    await locator.click().catch(() => {});
  }
}

(async () => {
  console.log('========================================================================');
  console.log('📱 GLOBEWEST QA AUDIT: STORE LOCATOR (IPHONE 17 PRO 402x874 @3x)');
  console.log('   Feature: Cursor spotlight highlight on every click');
  console.log('Ticket: #41794539 - Store Locator');
  console.log('Target US: https://mcstaging2.globewest.com/locator');
  console.log('Baseline AU: https://mcstaging2.globewest.com.au/locator');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  console.log('1. Navigating to US Live Mobile Store Locator (/locator)...');
  await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await clearOverlays(page);
  await installClickHighlighter(page);

  // Full Mobile Page Overview
  console.log('Capturing US Mobile Full Page Overview...');
  await page.screenshot({ path: path.join(MOBILE_DIR, '01_US_Mobile_Full_Page.png'), fullPage: true });

  // Above the fold
  await page.screenshot({ path: path.join(MOBILE_DIR, '02_US_Mobile_Above_Fold.png') });

  // Click on Mobile Postcode Input with Highlight
  console.log('🖱️ Clicking Postcode search input on iPhone 17 Pro with cursor highlight...');
  const postcodeInput = page.locator('input[placeholder*="Eg."], #js-locator-search').first();
  if (await postcodeInput.isVisible()) {
    await clickWithHighlight(page, postcodeInput);
    await postcodeInput.fill('78701');
  }

  // Mobile Map Broken
  const mapElement = page.locator('#js-locator-map, .locator-map-section').first();
  if (await mapElement.isVisible()) {
    await mapElement.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await clickWithHighlight(page, mapElement);
    await mapElement.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_05_US_Mobile_Broken_Map.png') });
  }

  // Mobile Editorial CMS block
  const editorial = page.locator('.find-designer-trade-customer, [data-content-type="row"]').first();
  if (await editorial.isVisible()) {
    await editorial.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await clickWithHighlight(page, editorial.locator('h2').first());
    await editorial.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_06_US_Mobile_Editorial_Section.png') });
  }

  console.log('\n2. Navigating to AU Baseline Mobile Store Locator (mcstaging2.globewest.com.au/locator)...');
  const auPage = await context.newPage();
  await auPage.goto('https://mcstaging2.globewest.com.au/locator', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await auPage.waitForTimeout(4000);
  await clearOverlays(auPage);
  await installClickHighlighter(auPage);

  console.log('Capturing AU Mobile Full Page Overview...');
  await auPage.screenshot({ path: path.join(MOBILE_DIR, '03_AU_Mobile_Full_Page.png'), fullPage: true });

  const auMap = auPage.locator('#js-locator-map, .locator-map-section').first();
  if (await auMap.isVisible()) {
    await auMap.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await clickWithHighlight(auPage, auMap);
    await auMap.screenshot({ path: path.join(DEFECTS_DIR, 'BASELINE_03_AU_Mobile_Working_Map.png') });
  }

  console.log('\n✅ Mobile iPhone 17 Pro Store Locator inspection complete!');
  await browser.close();
})();
