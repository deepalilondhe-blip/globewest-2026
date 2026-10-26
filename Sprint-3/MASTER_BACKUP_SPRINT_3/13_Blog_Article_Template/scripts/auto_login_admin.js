const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = path.resolve(__dirname, '../../../scratch');
const CAPTCHA_IMG_PATH = path.join(SCRATCH_DIR, 'active_captcha.png');
const SOLUTION_PATH = path.join(SCRATCH_DIR, 'captcha_solution.txt');

if (!fs.existsSync(SCRATCH_DIR)) fs.mkdirSync(SCRATCH_DIR, { recursive: true });

(async () => {
  // Clear any previous solution
  if (fs.existsSync(SOLUTION_PATH)) fs.unlinkSync(SOLUTION_PATH);
  if (fs.existsSync(CAPTCHA_IMG_PATH)) fs.unlinkSync(CAPTCHA_IMG_PATH);

  console.log('🚀 Launching headed Chrome for Automated Magento Admin Login...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // Route captcha to staging
  await page.route('**/media/captcha/admin/**', async route => {
    const url = route.request().url();
    if (url.includes('https://globewest.com.au/')) {
      const stagingUrl = url.replace('https://globewest.com.au/', 'https://mcstaging2.globewest.com.au/');
      try {
        const res = await page.request.get(stagingUrl);
        await route.fulfill({
          status: res.status(),
          headers: res.headers(),
          body: await res.body()
        });
        return;
      } catch (e) {
        console.error('Failed to proxy captcha:', e.message);
      }
    }
    route.continue();
  });

  console.log('📍 Navigating to Magento Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Check if already logged in
  if (page.url().includes('dashboard') || (await page.locator('#menu-magento-backend-stores').isVisible().catch(() => false))) {
    console.log('🎉 Already logged in to Admin Dashboard!');
    await new Promise(() => {});
    return;
  }

  // Initial fill
  await page.locator('input#username, input[name="login[username]"]').first().fill('deepali.londhe@overdose.digital');
  await page.locator('input#login, input[name="login[password]"]').first().fill('2Ho770ZEeX7v');

  let captchaInput = page.locator('input#captcha, input[name*="captcha"]').first();
  let hasCaptcha = await captchaInput.isVisible({ timeout: 2000 }).catch(() => false);

  if (!hasCaptcha) {
    console.log('⚡ Clicking Sign In to trigger CAPTCHA challenge...');
    await page.locator('button.action-login, button[type="submit"]').first().click();
    await page.waitForTimeout(4000);
  }

  // In a loop, solve CAPTCHA until logged in
  for (let attempt = 1; attempt <= 5; attempt++) {
    console.log(`\n--- CAPTCHA ATTEMPT #${attempt} ---`);

    // Ensure credentials filled
    await page.locator('input#username, input[name="login[username]"]').first().fill('deepali.londhe@overdose.digital');
    await page.locator('input#login, input[name="login[password]"]').first().fill('2Ho770ZEeX7v');

    // Wait for captcha image
    const captchaImg = page.locator('img#backend_login, img[id*="backend_login"], .field-captcha img:not(.captcha-reload)').first();
    await captchaImg.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForTimeout(1000);

    // Screenshot the captcha element
    if (fs.existsSync(SOLUTION_PATH)) fs.unlinkSync(SOLUTION_PATH);
    await captchaImg.screenshot({ path: CAPTCHA_IMG_PATH });
    console.log('📸 Saved fresh CAPTCHA image to:', CAPTCHA_IMG_PATH);
    console.log('WAITING_FOR_CAPTCHA_SOLUTION');

    // Poll for solution file
    let solution = '';
    const startTime = Date.now();
    while (Date.now() - startTime < 60000) {
      if (fs.existsSync(SOLUTION_PATH)) {
        solution = fs.readFileSync(SOLUTION_PATH, 'utf8').trim();
        if (solution) break;
      }
      await page.waitForTimeout(500);
    }

    if (!solution) {
      console.error('❌ Timeout waiting for CAPTCHA solution file.');
      break;
    }

    console.log(`✍️ Entering solved CAPTCHA: "${solution}" ...`);
    captchaInput = page.locator('input#captcha, input[name*="captcha"]').first();
    await captchaInput.fill(solution);

    console.log('🚀 Submitting login form...');
    await page.locator('button.action-login, button[type="submit"]').first().click();
    await page.waitForTimeout(5000);

    // Check if logged in
    const currentUrl = page.url();
    console.log('📍 Current URL after submit:', currentUrl);

    const isDashboard = currentUrl.includes('dashboard') || (await page.locator('#menu-magento-backend-stores, #menu-magento-backend-dashboard, .page-title:has-text("Dashboard")').first().isVisible({ timeout: 5000 }).catch(() => false));

    if (isDashboard) {
      console.log('🎉 SUCCESS! MAGENTO ADMIN LOGGED IN SUCCESSFULLY!');
      console.log('   Dashboard URL:', currentUrl);
      console.log('   Browser will remain OPEN on your desktop screen.');
      // Keep alive indefinitely
      await new Promise(() => {});
      return;
    }

    // Check error message
    const errorText = await page.locator('.message-error, .message.error').allInnerTexts().catch(() => []);
    console.log('⚠️ Error message on page:', errorText);

    // If still on login, wait and retry
    await page.waitForTimeout(2000);
  }

  console.log('❌ Could not complete login after multiple attempts.');
})();
