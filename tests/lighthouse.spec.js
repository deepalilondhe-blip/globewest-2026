// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// List of target pages on GlobeWest staging to audit
const PAGES_TO_TEST = [
  { name: '1_homepage', path: '/' },
  { name: '2_plp', path: '/indoor' },
  { name: '3_pdp', path: '/jasper-marble-console-monica-red-marble-cons-jasp-mar' },
  { name: '4_cart', path: '/checkout/cart/' },
  { name: '5_login', path: '/customer/account/login/' },
  { name: '6_trade', path: '/help-centre/general/trade-registration' },
  { name: '7_search', path: '/catalogsearch/result/?q=sofa' },
  { name: '8_static', path: '/blog' },
  { name: '9_blog_detail', path: '/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated' },
  { name: '10_account_dashboard', path: '/customer/account/' }
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
      
      // Block third-party scripts that generate blocking overlay popups and slow down page navigation on staging
      await page.route('**/*listrak*', route => route.abort());
      await page.route('**/*klaviyo*', route => route.abort());
      await page.route('**/*hotjar*', route => route.abort());
      await page.route('**/*google-analytics*', route => route.abort());
      await page.route('**/*yotpo*', route => route.abort());
      await page.route('**/*dotdigital*', route => route.abort());
      await page.route('**/*popover*', route => route.abort());

      const baseURL = 'https://mcstaging.globewest.com.au';
      
      if (pageInfo.name === '4_cart') {
        console.log('Populating cart with Ezra Buffet for Lighthouse Cart Audit...');
        await page.goto(`${baseURL}/ezra-buffet-mocha-oak-buf-ezra`);
        await page.waitForLoadState('domcontentloaded');
        
        // Dismiss popups first to avoid pointer interception
        const closeSelectors = ['a#lpclose', 'button#lpclose', '.action.close', '[aria-label="Close"]'];
        for (const selector of closeSelectors) {
          const closeBtn = page.locator(selector).first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await page.waitForTimeout(500);
          }
        }

        const addToCartBtn = page.locator('#product-addtocart-button, .action.tocart');
        if (await addToCartBtn.isVisible()) {
          await addToCartBtn.click();
          await page.waitForTimeout(5000); // Wait for AJAX addition request to complete
        }
      }

      let targetURL = `${baseURL}${pageInfo.path}`;
      let targetPage = page;
      
      if (pageInfo.name === '10_account_dashboard') {
        console.log('Logging in via Admin for Lighthouse Dashboard Audit...');
        const loginUrl = 'https://mcstaging.globewest.com.au/godmode/customer/index/edit/id/112317/key/3cef45675f154e3048246abb9227c3e3113730cfb1e7b2886b8460a9335c5516/#';
        await page.goto(loginUrl, { timeout: 25000, waitUntil: 'domcontentloaded' });
        
        await page.locator('input#username').fill('deepali_od');
        await page.locator('input#login').fill('xMKbkaep4AQqxfuwbskhqA');
        await page.locator('button.action-login, button:has-text("Sign in")').click();
        await page.waitForURL('**/dashboard/**', { timeout: 15000 });
        
        await page.locator('li#menu-magento-customer-customer > a, a:has-text("Customers")').first().click();
        await page.waitForTimeout(2000);
        await page.locator('a:has-text("All Customers"), .submenu a[href*="customer/index"]').first().click();
        await page.waitForURL('**/customer/index/index/**', { timeout: 15000 });
        
        const customerRow = page.locator('tr.data-row, tr').filter({ hasText: '112317' }).first();
        await customerRow.waitFor({ state: 'visible', timeout: 10000 });
        await customerRow.locator('a.action-menu-item').filter({ hasText: 'Edit' }).first().click();
        await page.waitForURL('**/customer/index/edit/**', { timeout: 25000 });
        await page.waitForTimeout(6000);
        
        const loginBtn = page.locator('button:has-text("Login as Customer"), button[id*="login_as_customer"]').first();
        await loginBtn.click();
        await page.waitForTimeout(3000);
        
        const confirmBtn = page.locator('.modal-popup button:has-text("Login as Customer"), button.action-accept').first();
        
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page'),
          confirmBtn.click()
        ]);
        
        await newPage.waitForLoadState('load');
        await newPage.waitForTimeout(5000);
        
        targetPage = newPage;
        targetURL = newPage.url();
      } else {
        // Navigate and let the page load
        await page.goto(targetURL);
        await page.waitForLoadState('domcontentloaded');
      }

      // Dismiss popups if visible to clean the audit state
      const welcomePopupCloseBtn = targetPage.locator('a#lpclose');
      if (await welcomePopupCloseBtn.isVisible().catch(() => false)) {
        await welcomePopupCloseBtn.click();
      }

      // 1.5 Take page screenshot and attach it directly to the Playwright report
      const screenshot = await targetPage.screenshot();
      await test.info().attach('screenshot', {
        body: screenshot,
        contentType: 'image/png'
      });

      // 2. Dynamically import Lighthouse to run audits
      const lighthouse = (await import('lighthouse')).default;
      
      console.log(`Running Lighthouse Audit on Staging ${pageInfo.name}...`);
      const result = await lighthouse(targetURL, {
        port: 9222,
        disableStorageReset: pageInfo.name === '4_cart' || pageInfo.name === '10_account_dashboard', // Only disable storage reset on Cart/Dashboard to preserve session
        logLevel: 'info',
        output: ['html', 'json'],
        onlyCategories: ['accessibility']
      }, {
        extends: 'lighthouse:default',
        settings: {
          blockedUrlPatterns: [
            '*listrak*',
            '*klaviyo*',
            '*hotjar*',
            '*google-analytics*',
            '*yotpo*',
            '*dotdigital-pages.com*',
            '*r3.dotdigital-pages.com*',
            '*dotdigital*',
            '*popover*',
            '*Dotdigitalgroup_Email*',
            '*emailCapture*'
          ]
        }
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

      // Load baseline score for comparison
      let baselineScoreText = 'No baseline found';
      const baselinePath = path.resolve(__dirname, '../Comparison before and After snapshout/Before', `lighthouse-${pageInfo.name}-report.json`);
      if (fs.existsSync(baselinePath)) {
        try {
          const baselineData = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
          const baselineScore = Math.round(baselineData.categories.accessibility.score * 100);
          const diff = accessibilityScore - baselineScore;
          const diffText = diff >= 0 ? `+${diff}` : `${diff}`;
          baselineScoreText = `${baselineScore}/100 (${diffText} improvement)`;
        } catch (e) {
          baselineScoreText = 'Error reading baseline';
        }
      }

      console.log(`--- Lighthouse Summary for ${pageInfo.name} ---`);
      console.log(`Baseline Score:     ${baselineScoreText}`);
      console.log(`Current Score:      ${accessibilityScore}/100`);
      console.log(`-----------------------------------------------`);

      // Verify accessibility meets staging baseline threshold
      expect(accessibilityScore).toBeGreaterThanOrEqual(50);

      await browser.close();
    });
  }
});
