const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'desktop');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  console.log('Auditing specific 404 URL: /dfsdfd on US vs AU...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  // 1. AU Baseline
  const auPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const auRes = await auPage.goto('https://mcstaging2.globewest.com.au/dfsdfd', { waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(2000);
  const auData = await auPage.evaluate((status) => {
    return {
      status,
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()).filter(Boolean),
      h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).filter(Boolean),
      bodyText: document.querySelector('.column.main, main')?.innerText.trim()
    };
  }, auRes.status());

  await auPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'AU_404_dfsdfd_desktop.png') });

  // 2. US Target Desktop
  const usPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const usRes = await usPage.goto('https://mcstaging2.globewest.com/dfsdfd', { waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(2000);
  const usData = await usPage.evaluate((status) => {
    return {
      status,
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()).filter(Boolean),
      h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).filter(Boolean),
      bodyText: document.querySelector('.column.main, main')?.innerText.trim()
    };
  }, usRes.status());

  await usPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'US_404_dfsdfd_desktop.png') });

  // 3. US Target Mobile
  const mobPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobPage.goto('https://mcstaging2.globewest.com/dfsdfd', { waitUntil: 'domcontentloaded' });
  await mobPage.waitForTimeout(2000);
  await mobPage.screenshot({ path: path.join(BASE_DIR, 'screenshots', 'mobile', 'US_404_dfsdfd_mobile.png') });

  await browser.close();

  console.log('=== 404 AUDIT RESULTS FOR /dfsdfd ===');
  console.log('AU Baseline:', JSON.stringify(auData, null, 2));
  console.log('US Staging Target:', JSON.stringify(usData, null, 2));
})();
