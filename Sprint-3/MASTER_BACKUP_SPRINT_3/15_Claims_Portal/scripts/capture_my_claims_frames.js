const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const PROFILE_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/.figma-chrome-profile');
const BASE_DIR = path.resolve(SCRIPTS_DIR, '..');
const DESKTOP_DIR = path.join(BASE_DIR, 'figma', 'desktop');
const MOBILE_DIR = path.join(BASE_DIR, 'figma', 'mobile');

const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('📸 Capturing My Claims Desktop & Mobile frames...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2584-65044', {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });
  await page.waitForTimeout(8000);

  // Search "desktop/my_account/My Claims"
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(600);
  await page.keyboard.type('desktop/my_account/My Claims');
  await page.waitForTimeout(1500);

  const desktopRow = page.locator('text="desktop/my_account/My Claims"').first();
  if (await desktopRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await desktopRow.click({ force: true });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    console.log('Desktop My Claims URL:', page.url());
    await page.screenshot({ path: path.join(DESKTOP_DIR, '02_FIGMA_DESKTOP_MY_CLAIMS.png') });
    console.log('Saved 02_FIGMA_DESKTOP_MY_CLAIMS.png');
  }

  // Search "mobile/my_account/My Claims"
  await page.keyboard.press('Control+a');
  await page.keyboard.type('mobile/my_account/My Claims');
  await page.waitForTimeout(1500);

  const mobileRow = page.locator('text="mobile/my_account/My Claims"').first();
  if (await mobileRow.isVisible({ timeout: 5000 }).catch(() => false)) {
    await mobileRow.click({ force: true });
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    console.log('Mobile My Claims URL:', page.url());
    await page.screenshot({ path: path.join(MOBILE_DIR, '02_FIGMA_MOBILE_MY_CLAIMS.png') });
    console.log('Saved 02_FIGMA_MOBILE_MY_CLAIMS.png');
  }

  await context.close();
  console.log('🏁 Captured both My Claims frames!');
})();
