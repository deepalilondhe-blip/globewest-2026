const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const DESKTOP_DIR = path.join(SCREENSHOTS_DIR, 'desktop');
const DEFECTS_DIR = path.join(SCREENSHOTS_DIR, 'defects');
const HIGHLIGHT_DIR = path.join(SCREENSHOTS_DIR, 'cursor_highlights');

[DESKTOP_DIR, DEFECTS_DIR, HIGHLIGHT_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

/**
 * Injects animated click ripple ring and pointer spotlight into the page.
 */
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
  console.log('🖥️ GLOBEWEST QA AUDIT: STORE LOCATOR (DESKTOP 1440x900 HEADED)');
  console.log('   Feature: Cursor spotlight highlight on every click');
  console.log('Ticket: #41794539 - Store Locator');
  console.log('Target US: https://mcstaging2.globewest.com/locator');
  console.log('Baseline AU: https://www.globewest.com.au/locator');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('1. Navigating to US Live Staging Store Locator (/locator)...');
  await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await clearOverlays(page);
  await installClickHighlighter(page);

  // Full Desktop Overview
  console.log('Capturing Desktop Full Page Overview...');
  await page.screenshot({ path: path.join(DESKTOP_DIR, '01_US_Desktop_Full_Page.png'), fullPage: true });

  // Above the fold
  await page.screenshot({ path: path.join(DESKTOP_DIR, '02_US_Desktop_Above_Fold.png') });

  // Interactive Click on Postcode Input with Highlight
  console.log('🖱️ Clicking Postcode search input with cursor highlight...');
  const postcodeInput = page.locator('input[placeholder*="Eg."], #js-locator-search').first();
  if (await postcodeInput.isVisible()) {
    await clickWithHighlight(page, postcodeInput);
    await postcodeInput.fill('90210');
  }

  // Interactive Click on Submit with Highlight
  const submitBtn = page.locator('button.locator-search-submit, .action.search, form button').first();
  if (await submitBtn.isVisible()) {
    console.log('🖱️ Clicking Submit button with cursor highlight...');
    await clickWithHighlight(page, submitBtn);
  }

  // Close-up: Broken Map Canvas
  console.log('Inspecting and capturing Broken Google Map Canvas...');
  const mapElement = page.locator('#js-locator-map, .locator-map-section').first();
  if (await mapElement.isVisible()) {
    await clickWithHighlight(page, mapElement);
    await mapElement.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_01_US_Broken_Google_Maps.png') });
  }

  // Close-up: Search Forms & Postcode Input
  console.log('Inspecting and capturing Postcode / Store Name Search forms...');
  const searchSection = page.locator('.locator-info-section, .locator-container').first();
  if (await searchSection.isVisible()) {
    await searchSection.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_02_US_AU_Postcode_Input_And_Copy.png') });
  }

  // Close-up: Editorial CMS Block "How to Buy with a Stockist - us"
  console.log('Inspecting and capturing Editorial CMS block...');
  const editorialBlock = page.locator('.find-designer-trade-customer, [data-content-type="row"]').first();
  if (await editorialBlock.isVisible()) {
    await editorialBlock.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await clickWithHighlight(page, editorialBlock.locator('h2').first());
    await editorialBlock.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_03_US_Editorial_Title_Wrap_And_Copy.png') });
  }

  // Close-up: Footer Australian Kangaroo Badge
  console.log('Inspecting and capturing Footer Australian Badge...');
  const footerBadge = page.locator('.page-footer, footer, [class*="footer"]').first();
  if (await footerBadge.isVisible()) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(DEFECTS_DIR, 'DEFECT_04_US_Footer_AU_Kangaroo_Badge.png') });
  }

  console.log('\n2. Navigating to AU Baseline Store Locator (globewest.com.au/locator)...');
  const auPage = await context.newPage();
  await auPage.goto('https://www.globewest.com.au/locator', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await auPage.waitForTimeout(4000);
  await clearOverlays(auPage);
  await installClickHighlighter(auPage);

  console.log('Capturing AU Desktop Full Page Overview...');
  await auPage.screenshot({ path: path.join(DESKTOP_DIR, '03_AU_Baseline_Full_Page.png'), fullPage: true });

  const auMap = auPage.locator('#js-locator-map, .locator-map-section').first();
  if (await auMap.isVisible()) {
    await clickWithHighlight(auPage, auMap);
    await auMap.screenshot({ path: path.join(DEFECTS_DIR, 'BASELINE_01_AU_Working_Interactive_Map.png') });
  }

  const auEditorial = auPage.locator('.find-designer-trade-customer, [data-content-type="row"]').first();
  if (await auEditorial.isVisible()) {
    await auEditorial.scrollIntoViewIfNeeded();
    await auPage.waitForTimeout(1000);
    await auEditorial.screenshot({ path: path.join(DEFECTS_DIR, 'BASELINE_02_AU_Editorial_Section.png') });
  }

  console.log('\n✅ Desktop Store Locator live inspection finished successfully!');
  await browser.close();
})();
