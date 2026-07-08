// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// List of target pages on GlobeWest staging to audit
const PAGES_TO_TEST = [
  { name: '1_homepage', path: '/' },
  { name: '2_plp', path: '/indoor' },
  { name: '3_pdp', path: '/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass' },
  { name: '4_cart', path: '/checkout/cart/' },
  { name: '5_login', path: '/customer/account/login/' },
  { name: '6_trade', path: '/help-centre/general/trade-registration' },
  { name: '7_search', path: '/catalogsearch/result/?q=sofa' },
  { name: '8_static', path: '/about-us' }
];

test.describe('GlobeWest Automated Lighthouse Audits', () => {

  for (const pageInfo of PAGES_TO_TEST) {
    test(`Perform Lighthouse audit on ${pageInfo.name}`, async ({ browserName }) => {
      // Lighthouse requires a Chromium browser to connect to the debugging port
      test.skip(browserName !== 'chromium', 'Lighthouse audits run only on Chromium browser');

      const { chromium } = require('@playwright/test');
      
      // 1. Launch Chromium with debugging port enabled
      const browser = await chromium.launch({
        args: ['--remote-debugging-port=9222']
      });

      const page = await browser.newPage();
      const baseURL = 'https://mcstaging2.globewest.com.au';
      const targetURL = `${baseURL}${pageInfo.path}`;
      
      // Navigate and let the page load
      await page.goto(targetURL);
      await page.waitForLoadState('domcontentloaded');

      // Dismiss popups if visible to clean the audit state
      const welcomePopupCloseBtn = page.locator('a#lpclose');
      if (await welcomePopupCloseBtn.isVisible()) {
        await welcomePopupCloseBtn.click();
      }

      // 2. Dynamically import Lighthouse to run audits
      const lighthouse = (await import('lighthouse')).default;
      
      console.log(`Running Lighthouse Audit on Staging ${pageInfo.name}...`);
      const result = await lighthouse(targetURL, {
        port: 9222,
        disableStorageReset: true,
        logLevel: 'info',
        output: ['html', 'json'],
        onlyCategories: ['accessibility']
      });

      // 3. Save the Lighthouse reports in a dedicated directory to prevent Playwright cleaning
      const reportDir = path.resolve(__dirname, '../Comparison before and After snapshout');
      if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
      }
      
      const htmlReportPath = path.join(reportDir, `lighthouse-${pageInfo.name}-report.html`);
      const jsonReportPath = path.join(reportDir, `lighthouse-${pageInfo.name}-report.json`);
      const htmlFileUrl = `file:///${htmlReportPath.replace(/\\/g, '/')}`;
      const jsonFileUrl = `file:///${jsonReportPath.replace(/\\/g, '/')}`;

      fs.writeFileSync(htmlReportPath, result.report[0]);
      fs.writeFileSync(jsonReportPath, result.report[1]);

      console.log(`Lighthouse HTML Report saved to: ${htmlFileUrl}`);
      console.log(`Lighthouse JSON Report saved to: ${jsonFileUrl}`);

      // 4. Assert scores
      const accessibilityScore = result.lhr.categories.accessibility.score * 100;

      console.log(`--- Lighthouse Summary for ${pageInfo.name} ---`);
      console.log(`Accessibility Score: ${accessibilityScore}/100`);
      console.log(`-----------------------------------------------`);

      // Verify accessibility meets staging baseline threshold
      expect(accessibilityScore).toBeGreaterThanOrEqual(50);

      await browser.close();
    });
  }
});
