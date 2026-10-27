const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch';
const CAPTCHA_IMG_PATH = path.join(SCRATCH_DIR, 'admin_captcha.png');
const SOLUTION_PATH = path.join(SCRATCH_DIR, 'admin_captcha_solution.txt');

(async () => {
  if (fs.existsSync(SOLUTION_PATH)) fs.unlinkSync(SOLUTION_PATH);
  if (fs.existsSync(CAPTCHA_IMG_PATH)) fs.unlinkSync(CAPTCHA_IMG_PATH);

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // Route captcha to staging if needed
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

  // Fill credentials
  await page.locator('#username').fill('deepali.londhe@overdose.digital');
  await page.locator('#login').fill('2Ho770ZEeX7v');

  // Check if captcha is visible
  let captchaImg = page.locator('img#backend_login, img[id*="backend_login"], .field-captcha img:not(.captcha-reload)').first();
  let hasCaptcha = await captchaImg.isVisible({ timeout: 2000 }).catch(() => false);

  if (!hasCaptcha) {
    console.log('⚡ Submitting login credentials...');
    await page.locator('button.action-login, button[type="submit"]').first().click();
    await page.waitForTimeout(4000);
  }

  // Check if logged in directly
  let currentUrl = page.url();
  console.log('Current URL after first submit:', currentUrl);

  hasCaptcha = await captchaImg.isVisible({ timeout: 3000 }).catch(() => false);
  if (hasCaptcha) {
    console.log('⚠️ Captcha required! Capturing captcha image...');
    await captchaImg.screenshot({ path: CAPTCHA_IMG_PATH });
    console.log('CAPTCHA_IMAGE_SAVED: ' + CAPTCHA_IMG_PATH);
    
    // Check if solution provided within 60s
    let solution = '';
    const startTime = Date.now();
    while (Date.now() - startTime < 60000) {
      if (fs.existsSync(SOLUTION_PATH)) {
        solution = fs.readFileSync(SOLUTION_PATH, 'utf8').trim();
        if (solution) break;
      }
      await page.waitForTimeout(1000);
    }

    if (solution) {
      console.log('Entering captcha solution:', solution);
      await page.locator('#username').fill('deepali.londhe@overdose.digital');
      await page.locator('#login').fill('2Ho770ZEeX7v');
      await page.locator('input#captcha, input[name*="captcha"]').first().fill(solution);
      await page.locator('button.action-login, button[type="submit"]').first().click();
      await page.waitForTimeout(5000);
      console.log('URL after captcha submit:', page.url());
    } else {
      console.log('No solution provided in time, saving screenshot of current page.');
    }
  }

  await page.screenshot({ path: path.join(SCRATCH_DIR, 'admin_after_login.png') });
  console.log('Final URL:', page.url());

  // Check if we are on dashboard or admin page
  const pageTitle = await page.title();
  console.log('Admin Page Title:', pageTitle);

  // Check for 2FA or dashboard
  const content = await page.content();
  if (content.includes('Two-Factor Authentication') || content.includes('2FA')) {
    console.log('2FA required on admin!');
  }

  await browser.close();
})();
