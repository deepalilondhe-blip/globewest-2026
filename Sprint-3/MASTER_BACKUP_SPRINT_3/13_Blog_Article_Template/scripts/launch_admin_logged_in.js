const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Launching Google Chrome on desktop for Magento Admin...');
  try {
    const browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      args: ['--no-sandbox', '--start-maximized']
    });

    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // Route captcha if any
    await page.route('**/media/captcha/admin/**', async route => {
      const url = route.request().url();
      if (url.includes('https://globewest.com.au/')) {
        const stagingUrl = url.replace('https://globewest.com.au/', 'https://mcstaging2.globewest.com.au/');
        try {
          const res = await page.request.get(stagingUrl);
          await route.fulfill({ status: res.status(), headers: res.headers(), body: await res.body() });
          return;
        } catch (e) {}
      }
      route.continue();
    });

    console.log('📍 Navigating to https://mcstaging2.globewest.com.au/godmode/admin/ ...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const isAlreadyDashboard = page.url().includes('dashboard') || (await page.locator('#menu-magento-backend-stores').isVisible().catch(() => false));
    if (!isAlreadyDashboard) {
      console.log('✍️ Entering Admin credentials...');
      await page.locator('input#username, input[name="login[username]"]').first().fill('deepali.londhe@overdose.digital');
      await page.locator('input#login, input[name="login[password]"]').first().fill('2Ho770ZEeX7v');

      console.log('🚀 Submitting login...');
      await page.locator('button.action-login, button[type="submit"]').first().click();
      await page.waitForTimeout(6000);
    }

    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    const title = await page.title();
    console.log('📍 Page Title:', title);

    if (currentUrl.includes('dashboard') || (await page.locator('#menu-magento-backend-stores, #menu-magento-backend-dashboard').first().isVisible({ timeout: 5000 }).catch(() => false))) {
      console.log('========================================================================');
      console.log('🎉 SUCCESS! MAGENTO ADMIN DASHBOARD IS LOGGED IN & OPEN ON YOUR SCREEN!');
      console.log('   Current URL:', currentUrl);
      console.log('========================================================================');
    } else {
      console.log('ℹ️ Current page state reached. Browser remains open.');
    }

    // Keep browser alive indefinitely
    await new Promise(() => {});
  } catch (err) {
    console.error('❌ Error launching admin:', err.message);
  }
})();
