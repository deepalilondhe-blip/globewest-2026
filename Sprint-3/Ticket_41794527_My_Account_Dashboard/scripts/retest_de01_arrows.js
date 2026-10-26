const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

const US_BASE = 'https://mcstaging2.globewest.com';
const US_CREDS = { email: 'deepali.londhe@overdose.digital', pass: 'Deep@123' };
const OUT_DIR = path.resolve(SCRIPTS_DIR, '../retest_results');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('🔍 Retesting DE#01: "Arrows are un-even" on Live US Staging...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Logging in...');
  await page.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  if (await page.locator('#email').isVisible()) {
    await page.fill('#email', US_CREDS.email);
    await page.fill('#pass', US_CREDS.pass);
    await page.click('#send2');
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
  }

  await clearOverlays(page);

  // Navigate to Dashboard
  await page.goto(`${US_BASE}/customer/account/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await clearOverlays(page);

  // Scroll to "My Recent Orders"
  const recentOrdersHeading = page.locator('text="My Recent Orders"').first();
  await recentOrdersHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Take screenshot of the table header
  const tableHeader = page.locator('table, .table-order-items, [class*="recent-orders"], .block-recent-orders').first();
  if (await tableHeader.isVisible()) {
    await tableHeader.screenshot({ path: path.join(OUT_DIR, 'DE01_LIVE_TABLE_CURRENT.png') });
    console.log('Saved DE01_LIVE_TABLE_CURRENT.png');
  }

  // Also capture the entire orders section
  await page.screenshot({ path: path.join(OUT_DIR, 'DE01_LIVE_ORDERS_SECTION_VIEWPORT.png') });

  // Measure exact vertical positions and styles of arrows
  const arrowMetrics = await page.evaluate(() => {
    const ths = Array.from(document.querySelectorAll('table thead th, table th, .table-order-items th'));
    return ths.map(th => {
      const thRect = th.getBoundingClientRect();
      const text = th.innerText.trim();
      const style = window.getComputedStyle(th);
      
      // Look for pseudo elements or child elements containing arrows
      const children = Array.from(th.querySelectorAll('*')).map(c => {
        const cRect = c.getBoundingClientRect();
        const cStyle = window.getComputedStyle(c);
        return {
          tag: c.tagName,
          className: c.className,
          top: cRect.top,
          left: cRect.left,
          height: cRect.height,
          verticalAlign: cStyle.verticalAlign,
          marginTop: cStyle.marginTop
        };
      });

      return {
        headerText: text,
        thTop: Math.round(thRect.top),
        thHeight: Math.round(thRect.height),
        textAlign: style.textAlign,
        verticalAlign: style.verticalAlign,
        padding: style.padding,
        children
      };
    });
  });

  console.log('Arrow Metrics:');
  console.log(JSON.stringify(arrowMetrics, null, 2));

  fs.writeFileSync(path.join(OUT_DIR, 'DE01_arrow_metrics.json'), JSON.stringify(arrowMetrics, null, 2));

  await browser.close();
  console.log('🏁 Retest execution finished!');
})();
