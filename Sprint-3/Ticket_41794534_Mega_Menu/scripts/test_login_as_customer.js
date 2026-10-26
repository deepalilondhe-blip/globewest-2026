const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Logging into Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const loginInput = page.locator('input#username').first();
  if (await loginInput.isVisible().catch(() => false)) {
    await loginInput.fill('deepali.londhe@overdose.digital');
    await page.fill('input#login', '2Ho770ZEeX7v');
    await page.click('button.action-login');
    await page.waitForURL(/admin/, { timeout: 35000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }

  console.log('Navigating directly to Customer 130722 edit page...');
  // Navigate via customer edit
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/customer/index/edit/id/130722/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  console.log('Checking for "Login as Customer" button...');
  const loginAsCustomerBtn = page.locator('button:has-text("Login as Customer"), #login_as_customer').first();
  
  if (await loginAsCustomerBtn.isVisible().catch(() => false)) {
    console.log('Clicking "Login as Customer"...');
    
    // Listen for new page or modal popup
    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
      loginAsCustomerBtn.click()
    ]);

    await page.waitForTimeout(3000);

    // If there is a confirmation modal inside the current page
    const confirmBtn = page.locator('.modal-popup.confirm button.action-primary, .modal-popup button:has-text("OK"), .modal-popup button:has-text("Confirm")').first();
    if (await confirmBtn.isVisible().catch(() => false)) {
      console.log('Confirming modal popup...');
      const [popupPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
        confirmBtn.click()
      ]);
      const targetPage = popupPage || newPage || page;
      await targetPage.waitForTimeout(5000);
      console.log('Current target page URL:', targetPage.url());
      await targetPage.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/au_login_as_customer_success.png' });
    } else if (newPage) {
      console.log('New tab opened! URL:', newPage.url());
      await newPage.waitForTimeout(5000);
      await newPage.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/au_login_as_customer_success.png' });
    }
  }

  await page.waitForTimeout(3000);
  await browser.close();
})();
