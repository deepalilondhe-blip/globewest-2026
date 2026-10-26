const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Launching Google Chrome headed browser for Magento Admin...');
  try {
    const browser = await chromium.launch({
      headless: false,
      channel: 'chrome',
      args: ['--no-sandbox', '--start-maximized']
    });

    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // Fix Magento Staging Media URL Bug:
    // Staging generates captcha at mcstaging2, but renders HTML src pointing to production (globewest.com.au)
    // Production returns 404 placeholder 'GW Coming Soon'. We intercept and route directly to staging!
    await page.route('**/media/captcha/admin/**', async route => {
      const url = route.request().url();
      if (url.includes('https://globewest.com.au/')) {
        const stagingUrl = url.replace('https://globewest.com.au/', 'https://mcstaging2.globewest.com.au/');
        console.log('🔄 Intercepted captcha image and routed to staging:', stagingUrl);
        try {
          const res = await page.request.get(stagingUrl);
          await route.fulfill({
            status: res.status(),
            headers: res.headers(),
            body: await res.body()
          });
          return;
        } catch (e) {
          console.error('Failed to proxy captcha image:', e.message);
        }
      }
      route.continue();
    });

    console.log('📍 Navigating to https://mcstaging2.globewest.com.au/godmode/admin/ ...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Initial fill
    const userField = page.locator('input#username, input[name="login[username]"]').first();
    const passField = page.locator('input#login, input[name="login[password]"]').first();
    const submitBtn = page.locator('button.action-login, button[type="submit"]').first();

    await userField.fill('deepali.londhe@overdose.digital');
    await passField.fill('2Ho770ZEeX7v');

    const captchaField = page.locator('input#captcha, input[name*="captcha"]').first();
    const hasCaptcha = await captchaField.isVisible({ timeout: 2000 }).catch(() => false);

    if (!hasCaptcha) {
      console.log('⚡ Triggering sign-in once to reveal Magento CAPTCHA challenge...');
      await submitBtn.click();
      await page.waitForTimeout(4000);

      // Re-fill credentials after Magento page reload
      await page.locator('input#username, input[name="login[username]"]').first().fill('deepali.londhe@overdose.digital');
      await page.locator('input#login, input[name="login[password]"]').first().fill('2Ho770ZEeX7v');

      // Ensure captcha image src in DOM is rewritten if needed
      await page.evaluate(() => {
        document.querySelectorAll('img[src*="globewest.com.au/media/captcha/"]').forEach(img => {
          img.src = img.src.replace('https://globewest.com.au/', 'https://mcstaging2.globewest.com.au/');
        });
      });

      const captchaInput = page.locator('input#captcha, input[name*="captcha"]').first();
      if (await captchaInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('🎯 CAPTCHA image is now VISIBLE on screen! Focused CAPTCHA input field.');
        await captchaInput.focus();
      }
    } else {
      console.log('🎯 CAPTCHA is already visible on screen.');
      await captchaField.focus();
    }

    console.log('========================================================================');
    console.log('✅ Chrome is ready on your screen with CAPTCHA visible!');
    console.log('   Username: deepali.londhe@overdose.digital (pre-filled)');
    console.log('   Password: •••••••••••• (pre-filled)');
    console.log('   Action: Type the visible letters/numbers into the CAPTCHA box & hit "Sign in".');
    console.log('========================================================================');

    // Keep open indefinitely for user interaction
    await new Promise(() => {});
  } catch (err) {
    console.error('❌ Error opening admin browser:', err.message);
  }
})();
