const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- Step 1: Login ---');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const email = page.locator('#email');
  if (await email.isVisible({ timeout: 5000 }).catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
  }

  console.log('--- Step 2: Navigate to My Orders (has active FAQ block) ---');
  await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Check existing FAQ accordion
  const faqAnalysis = await page.evaluate(() => {
    // Look for accordion titles and contents
    const faqContainer = document.querySelector('[data-content-type="faq"], .account-faq-section, .frequently-asked-questions, .block-faq, [class*="faq"]');
    if (!faqContainer) return { found: false };

    const items = Array.from(faqContainer.querySelectorAll('[data-role="collapsible"], .faq-item, li[data-content-type="faq-item"], .accordion-item'));
    return {
      found: true,
      containerTag: faqContainer.tagName,
      containerClass: faqContainer.className,
      itemCount: items.length,
      items: items.map((it, idx) => ({
        index: idx + 1,
        title: it.querySelector('[data-role="title"], h3, .title, summary')?.innerText?.trim() || it.innerText.split('\n')[0].trim()
      }))
    };
  });

  console.log('Existing FAQ Container Analysis:', JSON.stringify(faqAnalysis, null, 2));

  // Now, test injecting additional FAQ items up to 10 FAQs (exceeding the 8 FAQ limit)
  console.log('--- Step 3: Injecting FAQ items #6, #7, #8, #9, #10 to test > 8 limit ---');
  const injectResult = await page.evaluate(() => {
    const faqList = document.querySelector('[data-content-type="faq"], .account-faq-section ul, .frequently-asked-questions ul, [class*="faq"] ul, .accordion');
    if (!faqList) return { injected: false, reason: 'No FAQ list element found' };

    const existingItems = faqList.querySelectorAll('li, [data-role="collapsible"], .faq-item');
    if (existingItems.length === 0) return { injected: false, reason: 'No existing item template found' };

    const templateItem = existingItems[0];
    const initialCount = existingItems.length;

    // Clone and add items until we have 10 items
    for (let i = initialCount + 1; i <= 10; i++) {
      const clone = templateItem.cloneNode(true);
      clone.setAttribute('data-faq-test-index', i.toString());
      
      const titleEl = clone.querySelector('[data-role="title"], h3, .title, summary') || clone;
      const contentEl = clone.querySelector('[data-role="content"], .content, p, [data-element="answer"]');
      
      if (titleEl) titleEl.innerText = `Test Question ${i}: Can we add more than 8 FAQ items? (Figma Max Spec = 8)`;
      if (contentEl) contentEl.innerText = `Test Answer ${i}: This answer validates whether the accordion component supports more than 8 FAQs and whether the single-open mutex behavior persists.`;
      
      // Ensure initial collapsed state
      clone.setAttribute('aria-expanded', 'false');
      if (contentEl) contentEl.style.display = 'none';

      faqList.appendChild(clone);
    }

    const newTotal = faqList.querySelectorAll('li, [data-role="collapsible"], .faq-item').length;
    return { injected: true, initialCount, newTotal };
  });

  console.log('Injection Result:', JSON.stringify(injectResult, null, 2));

  // Take screenshot of 10 FAQs in the DOM
  const outScreenshot = path.resolve(__dirname, '../screenshots/TEST_MORE_THAN_8_FAQS.png');
  await page.screenshot({ path: outScreenshot, fullPage: true });
  console.log(`Saved screenshot to: ${outScreenshot}`);

  // Test expanding item #9 and item #10 to check mutex behavior
  console.log('--- Step 4: Testing Mutex & Expand Behavior on Item #9 and #10 ---');
  const mutexResult = await page.evaluate(() => {
    const item9 = document.querySelector('[data-faq-test-index="9"]');
    const item10 = document.querySelector('[data-faq-test-index="10"]');
    if (!item9 || !item10) return { mutexTested: false };

    const title9 = item9.querySelector('[data-role="title"], h3, .title, summary') || item9;
    const title10 = item10.querySelector('[data-role="title"], h3, .title, summary') || item10;

    // Click item 9
    title9.click();
    const item9Open = item9.getAttribute('aria-expanded') === 'true' || item9.classList.contains('active');

    // Click item 10
    title10.click();
    const item10Open = item10.getAttribute('aria-expanded') === 'true' || item10.classList.contains('active');
    const item9ClosedAfter10 = item9.getAttribute('aria-expanded') !== 'true' && !item9.classList.contains('active');

    return {
      mutexTested: true,
      item9Opened: item9Open,
      item10Opened: item10Open,
      item9AutoCollapsed: item9ClosedAfter10,
      singleOpenEnforced: item10Open && item9ClosedAfter10
    };
  });

  console.log('Mutex Test Result:', JSON.stringify(mutexResult, null, 2));

  await browser.close();
})();
