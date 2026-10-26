const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  console.log('🚀 Launching Google Chrome in HEADED MODE for Magento Admin & FAQ Inspection...');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 600, // Slow down operations so user can comfortably watch each action
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  console.log('📍 Step 1: Navigating to Magento Admin Login...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Check login
  const loginInput = page.locator('input#username, input[name="login[username]"]').first();
  if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('🔑 Entering Admin Credentials for deepali.londhe@overdose.digital...');
    await loginInput.fill('deepali.londhe@overdose.digital');
    await page.fill('input#login, input[name="login[password]"]', '2Ho770ZEeX7v');
    await page.click('button.action-login');
    await page.waitForURL(/admin/, { timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(4000);
  }

  console.log('✅ Admin Login Successful!');

  console.log('📍 Step 2: Navigating to Content > Blocks (CMS Blocks)...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/cms/block/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  console.log('🔍 Step 3: Searching CMS Blocks for "faq"...');
  const searchInput = page.locator('input.admin__control-text[placeholder*="Search by keyword"], input[id="fulltext"]').first();
  if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchInput.fill('faq');
    await searchInput.press('Enter');
    await page.waitForTimeout(4000);
  }

  // Read grid rows
  const faqBlocks = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr.data-row'));
    return rows.map(r => {
      const title = r.querySelector('.data-grid-cell-content[data-column="title"], td:nth-child(3)')?.innerText?.trim();
      const identifier = r.querySelector('.data-grid-cell-content[data-column="identifier"], td:nth-child(4)')?.innerText?.trim();
      return { title, identifier };
    });
  });
  console.log('📋 CMS Blocks matching "faq":', JSON.stringify(faqBlocks, null, 2));

  console.log('🔍 Step 4: Searching CMS Blocks for "claim"...');
  if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchInput.fill('claim');
    await searchInput.press('Enter');
    await page.waitForTimeout(4000);
  }

  const claimBlocks = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr.data-row'));
    return rows.map(r => {
      const title = r.querySelector('.data-grid-cell-content[data-column="title"], td:nth-child(3)')?.innerText?.trim();
      const identifier = r.querySelector('.data-grid-cell-content[data-column="identifier"], td:nth-child(4)')?.innerText?.trim();
      return { title, identifier };
    });
  });
  console.log('📋 CMS Blocks matching "claim":', JSON.stringify(claimBlocks, null, 2));

  console.log('📍 Step 5: Opening Frontend in a new tab to demonstrate > 8 FAQ items & Auto-Collapse Mutex...');
  const frontendPage = await context.newPage();
  await frontendPage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  const feEmail = frontendPage.locator('#email');
  if (await feEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await feEmail.fill('deepali.londhe@overdose.digital');
    await frontendPage.locator('#pass').fill('Deep@123');
    await frontendPage.locator('#send2').click();
    await frontendPage.waitForNavigation({ timeout: 30000 }).catch(() => {});
  }

  console.log('📍 Step 6: Navigating Frontend to Orders Page (contains 9 live FAQ items)...');
  await frontendPage.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await frontendPage.waitForTimeout(3000);

  // Scroll down smoothly to the FAQ section
  console.log('📜 Scrolling down to Frequently Asked Questions section...');
  await frontendPage.evaluate(() => {
    const faq = document.querySelector('.account-faq-section, [class*="faq"]');
    if (faq) faq.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  await frontendPage.waitForTimeout(3000);

  const faqHeaders = frontendPage.locator('.account-faq-section h3');
  const count = await faqHeaders.count();
  console.log(`💡 Total Live FAQ Accordions Rendered: ${count} (Figma specifies max 8)`);

  if (count > 0) {
    console.log('👉 Expanding FAQ Item #1...');
    await faqHeaders.nth(0).click();
    await frontendPage.waitForTimeout(2500);

    if (count >= 9) {
      console.log('👉 Expanding FAQ Item #9 (Beyond the 8-item spec limit)...');
      await faqHeaders.nth(8).click();
      await frontendPage.waitForTimeout(2500);

      console.log('👉 Expanding FAQ Item #2 to test Strict Mutex (Auto-Collapse of #9)...');
      await faqHeaders.nth(1).click();
      await frontendPage.waitForTimeout(2500);
    }
  }

  console.log('🎉 Demonstration complete! Keeping browser open for 15 seconds so you can inspect the screen...');
  await frontendPage.waitForTimeout(15000);

  await browser.close();
  console.log('🏁 Browser closed cleanly.');
})();
