const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- Logging in ---');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  const email = page.locator('#email');
  if (await email.isVisible({ timeout: 5000 }).catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
  }

  console.log('--- Navigating to My Orders ---');
  await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Click item #1
  const titles = page.locator('.account-faq-section h3, .account-faq-section [data-role="title"], [data-content-type="faq"] h3');
  const count = await titles.count();
  console.log(`Total live FAQ headers found: ${count}`);

  if (count >= 9) {
    console.log('Clicking FAQ #1...');
    await titles.nth(0).click();
    await page.waitForTimeout(1000);

    const isFirstOpen = await page.evaluate(() => {
      const h3 = document.querySelectorAll('.account-faq-section h3')[0];
      const answer = h3.nextElementSibling;
      return {
        h3Class: h3.className,
        ariaExpanded: h3.getAttribute('aria-expanded'),
        answerDisplay: window.getComputedStyle(answer).display,
        answerHeight: answer.clientHeight
      };
    });
    console.log('FAQ #1 state after click:', isFirstOpen);

    // Now click FAQ #9 (beyond the 8 limit)
    console.log('Clicking FAQ #9 (item beyond 8 limit)...');
    await titles.nth(8).click();
    await page.waitForTimeout(1000);

    const statesAfter9 = await page.evaluate(() => {
      const h3s = document.querySelectorAll('.account-faq-section h3');
      const h3First = h3s[0];
      const answerFirst = h3First.nextElementSibling;
      const h3Ninth = h3s[8];
      const answerNinth = h3Ninth.nextElementSibling;

      return {
        firstFaq: {
          ariaExpanded: h3First.getAttribute('aria-expanded'),
          answerDisplay: window.getComputedStyle(answerFirst).display,
          isOpen: window.getComputedStyle(answerFirst).display !== 'none'
        },
        ninthFaq: {
          ariaExpanded: h3Ninth.getAttribute('aria-expanded'),
          answerDisplay: window.getComputedStyle(answerNinth).display,
          isOpen: window.getComputedStyle(answerNinth).display !== 'none'
        }
      };
    });
    console.log('State after clicking FAQ #9:', statesAfter9);

    // Now click FAQ #10 (another item beyond 8 limit)
    console.log('Clicking FAQ #10...');
    await titles.nth(9).click();
    await page.waitForTimeout(1000);

    const statesAfter10 = await page.evaluate(() => {
      const h3s = document.querySelectorAll('.account-faq-section h3');
      const h3Ninth = h3s[8];
      const answerNinth = h3Ninth.nextElementSibling;
      const h3Tenth = h3s[9];
      const answerTenth = h3Tenth.nextElementSibling;

      return {
        ninthFaq: {
          isOpen: window.getComputedStyle(answerNinth).display !== 'none'
        },
        tenthFaq: {
          isOpen: window.getComputedStyle(answerTenth).display !== 'none'
        }
      };
    });
    console.log('State after clicking FAQ #10 (mutex check):', statesAfter10);

    // Save screenshot of expanded FAQ #10
    const outScreenshot = path.resolve(__dirname, '../screenshots/FAQ_ITEM_10_EXPANDED_MUTEX.png');
    await page.screenshot({ path: outScreenshot, fullPage: true });
    console.log(`Saved screenshot to: ${outScreenshot}`);
  }

  await browser.close();
})();
