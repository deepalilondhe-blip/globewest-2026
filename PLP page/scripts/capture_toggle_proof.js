// @ts-check
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PLP page/screenshots/proof';
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('🚀 Capturing live proof of missing Trade Pricing Toggle...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Login
  console.log('Logging in as Trade customer...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.fill('#email', 'deepalilondhe.qa@gmail.com');
  await page.fill('#pass', 'Deepa@123');
  await page.click('#send2');
  await page.waitForTimeout(4000);

  // 2. Go to /indoor
  console.log('Navigating to /indoor as logged-in customer...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Dismiss popups
  for (const sel of ['.action-close', '.modal-close', 'button[aria-label="Close"]', '.cookie-close']) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 800 }).catch(() => false)) await btn.click().catch(() => {});
  }

  // 3. Inject Red Callout Banners into DOM
  await page.evaluate(() => {
    // Utility Bar Callout
    const headerPanel = document.querySelector('.header.panel, .panel.header, .page-header');
    if (headerPanel) {
      const banner1 = document.createElement('div');
      banner1.style.cssText = `
        position: absolute;
        top: 8px;
        right: 220px;
        background: #D32F2F;
        color: #FFFFFF;
        border: 2px solid #FFCDD2;
        padding: 6px 14px;
        border-radius: 6px;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
        font-size: 13px;
        font-weight: bold;
        z-index: 999999;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
      `;
      banner1.innerHTML = '🚨 DEFECT: Trade Pricing Toggle Dropdown is MISSING Here';
      headerPanel.style.position = 'relative';
      headerPanel.appendChild(banner1);
    }

    // Product Card Callout
    const firstCard = document.querySelector('.product-item');
    if (firstCard) {
      firstCard.style.outline = '4px solid #D32F2F';
      firstCard.style.outlineOffset = '2px';
      firstCard.style.position = 'relative';

      const banner2 = document.createElement('div');
      banner2.style.cssText = `
        position: absolute;
        bottom: 25px;
        left: 10px;
        right: 10px;
        background: #B71C1C;
        color: #FFFFFF;
        padding: 8px 10px;
        border-radius: 4px;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      `;
      banner2.innerHTML = '🚨 DEFECT: Pricing is BLANK ($0) on Card in Logged-In State';
      firstCard.appendChild(banner2);
    }
  });

  await page.waitForTimeout(500);

  // Capture Header & Top of Grid
  const liveProofPath = path.join(OUT_DIR, 'LIVE_STAGING_TOGGLE_MISSING_RAW.png');
  await page.screenshot({ path: liveProofPath, fullPage: false });
  console.log('✅ Captured live screenshot:', liveProofPath);

  await browser.close();
})();
