const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const EVIDENCE_DIR = path.join(BASE_DIR, 'screenshots', 'defects');
if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  console.log('Navigating to US mobile /locator...');
  await page.goto('https://mcstaging2.globewest.com/locator', { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Clear overlays
  await page.evaluate(() => {
    document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status').forEach(el => el.remove());
  });

  // Annotate both duplicate elements in DOM with prominent red borders and labels
  await page.evaluate(() => {
    const el1 = document.querySelector('.help-text.mobile-only');
    const el2 = document.querySelector('.locator-container > .help-text:not(.mobile-only)');

    if (el1) {
      el1.style.outline = '3px solid #ef4444';
      el1.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
      el1.style.position = 'relative';

      const badge1 = document.createElement('div');
      badge1.innerText = '🔴 DUPLICATE #1: (class="help-text mobile-only" ABOVE MAP)';
      badge1.style.cssText = 'position: absolute; top: -24px; left: 0; background: #ef4444; color: white; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-family: sans-serif; white-space: nowrap; z-index: 1000;';
      el1.appendChild(badge1);
    }

    if (el2) {
      el2.style.outline = '3px solid #ef4444';
      el2.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
      el2.style.position = 'relative';

      const badge2 = document.createElement('div');
      badge2.innerText = '🔴 DUPLICATE #2: (class="help-text" BELOW MAP)';
      badge2.style.cssText = 'position: absolute; top: -24px; left: 0; background: #ef4444; color: white; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-family: sans-serif; white-space: nowrap; z-index: 1000;';
      el2.appendChild(badge2);
    }
  });

  // Capture screenshot showing both duplicates
  const outPath = path.join(EVIDENCE_DIR, 'EVIDENCE_DUPLICATE_DISCLAIMER_MOBILE.png');
  await page.screenshot({
    path: outPath,
    clip: { x: 0, y: 180, width: 402, height: 600 }
  });

  console.log('Saved annotated evidence to:', outPath);
  await browser.close();
})();
