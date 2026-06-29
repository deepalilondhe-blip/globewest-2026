// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('GlobeWest Automated Lighthouse Audits', () => {

  test('Perform Lighthouse audit on Homepage', async ({ browserName }) => {
    // Lighthouse requires a Chromium browser to connect to the debugging port
    test.skip(browserName !== 'chromium', 'Lighthouse audits run only on Chromium browser');

    const { chromium } = require('@playwright/test');
    
    // 1. Launch Chromium with debugging port enabled
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9222']
    });

    const page = await browser.newPage();
    const baseURL = 'https://mcstaging2.globewest.com.au';
    
    // Navigate and let the page load
    await page.goto(baseURL);
    await page.waitForLoadState('domcontentloaded');

    // Dismiss popups if visible to clean the audit state
    const welcomePopupCloseBtn = page.locator('a#lpclose');
    if (await welcomePopupCloseBtn.isVisible()) {
      await welcomePopupCloseBtn.click();
    }

    // 2. Dynamically import Lighthouse to run audits
    const lighthouse = (await import('lighthouse')).default;
    
    console.log('Running Lighthouse Audit on Staging Homepage...');
    const result = await lighthouse(baseURL, {
      port: 9222,
      disableStorageReset: true,
      logLevel: 'info',
      output: 'html',
      onlyCategories: ['accessibility', 'performance']
    });

    // 3. Save the Lighthouse HTML report
    const reportDir = path.resolve(__dirname, '../playwright-report');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    const reportPath = path.join(reportDir, 'lighthouse-homepage-report.html');
    fs.writeFileSync(reportPath, result.report);
    console.log(`Lighthouse HTML Report saved to: ${reportPath}`);

    // 4. Assert scores
    const accessibilityScore = result.lhr.categories.accessibility.score * 100;
    const performanceScore = result.lhr.categories.performance.score * 100;

    console.log(`--- Lighthouse Summary ---`);
    console.log(`Accessibility Score: ${accessibilityScore}/100`);
    console.log(`Performance Score:   ${performanceScore}/100`);
    console.log(`--------------------------`);

    // Verify accessibility is within acceptable range (> 50 on staging baseline)
    expect(accessibilityScore).toBeGreaterThanOrEqual(50);

    await browser.close();
  });
});
