const { test } = require('@playwright/test');

test('Check B2B Login as Customer via Customers Menu on Staging 2', async ({ page }) => {
  await page.route('**/*listrak*', route => route.abort());
  await page.route('**/*klaviyo*', route => route.abort());
  await page.route('**/*hotjar*', route => route.abort());
  await page.route('**/*google-analytics*', route => route.abort());
  await page.route('**/*yotpo*', route => route.abort());

  const loginUrl = 'https://mcstaging2.globewest.com.au/godmode/customer/index/edit/id/112317/key/3cef45675f154e3048246abb9227c3e3113730cfb1e7b2886b8460a9335c5516/#';
  console.log('Navigating to Admin customer edit...');
  await page.goto(loginUrl, { timeout: 40000 });
  await page.waitForLoadState('domcontentloaded');

  const usernameInput = page.locator('input#username');
  if (await usernameInput.isVisible()) {
    console.log('Logging in as deepali_od...');
    await usernameInput.fill('deepali_od');
    await page.locator('input#login').fill('xMKbkaep4AQqxfuwbskhqA');
    await page.locator('button.action-login, button:has-text("Sign in")').click();
    
    console.log('Waiting for URL redirect to dashboard...');
    await page.waitForURL('**/dashboard/**', { timeout: 25000 });
    console.log('URL after login:', page.url());
  }

  // Go to Customers -> All Customers
  console.log('Clicking Customers menu...');
  await page.locator('li#menu-magento-customer-customer > a, a:has-text("Customers")').first().click();
  await page.waitForTimeout(2000);

  console.log('Clicking All Customers submenu...');
  await page.locator('a:has-text("All Customers"), .submenu a[href*="customer/index"]').first().click();
  await page.waitForURL('**/customer/index/index/**', { timeout: 25000 });
  console.log('All Customers grid loaded:', page.url());

  // Click Edit customer row 112317
  console.log('Searching for customer row 112317...');
  const customerRow = page.locator('tr.data-row, tr').filter({ hasText: '112317' }).first();
  await customerRow.waitFor({ state: 'visible', timeout: 15000 });

  console.log('Clicking Edit...');
  await customerRow.locator('a.action-menu-item').filter({ hasText: 'Edit' }).first().click();
  await page.waitForURL('**/customer/index/edit/**', { timeout: 30000 });
  
  // Wait for customer edit form to render
  console.log('Waiting for Edit page fields to settle...');
  await page.waitForTimeout(6000);
  console.log('Current edit page URL:', page.url());

  const loginBtn = page.locator('button:has-text("Login as Customer"), button[id*="login_as_customer"]').first();
  if (await loginBtn.isVisible()) {
    console.log('Clicking Login as Customer button...');
    await loginBtn.click();
    await page.waitForTimeout(3000);

    const confirmBtn = page.locator('.modal-popup button:has-text("Login as Customer"), button.action-accept').first();
    if (await confirmBtn.isVisible()) {
      console.log('Confirming Login as Customer popup...');
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        confirmBtn.click()
      ]);

      await newPage.waitForLoadState('load');
      await newPage.waitForTimeout(5000);
      console.log('New customer tab URL:', newPage.url());

      // Navigate to the Quotes page or Cart page
      console.log('Navigating to Cart page on frontend...');
      await newPage.goto('https://mcstaging2.globewest.com.au/checkout/cart/', { timeout: 30000 });
      await newPage.waitForLoadState('domcontentloaded');
      await newPage.waitForTimeout(4000);

      console.log('--- Logged-in Cart Form Elements ---');
      const cartElements = await newPage.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, textarea, select, label'));
        return inputs.map(el => ({
          tagName: el.tagName,
          id: el.id,
          name: el.getAttribute('name'),
          placeholder: el.getAttribute('placeholder'),
          type: el.getAttribute('type'),
          text: el.innerText.trim(),
          htmlFor: el.getAttribute('for')
        }));
      });
      console.log(JSON.stringify(cartElements, null, 2));
    }
  } else {
    console.log('Login as Customer button is NOT visible!');
  }
});
