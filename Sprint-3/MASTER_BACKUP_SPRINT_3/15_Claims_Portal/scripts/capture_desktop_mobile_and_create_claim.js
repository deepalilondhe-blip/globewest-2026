const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const PROFILE_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/.figma-chrome-profile');
const BASE_DIR = path.resolve(SCRIPTS_DIR, '..');
const DESKTOP_DIR = path.join(BASE_DIR, 'figma', 'desktop');
const MOBILE_DIR = path.join(BASE_DIR, 'figma', 'mobile');

const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

fs.mkdirSync(DESKTOP_DIR, { recursive: true });
fs.mkdirSync(MOBILE_DIR, { recursive: true });

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('🚀 High-Res Standalone Capture for Desktop, Mobile & Create Claim frames...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages()[0] || await context.newPage();

  // Load directly at My Claims frame
  await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2584-65044', {
    waitUntil: 'domcontentloaded',
    timeout: 90000
  });
  await page.waitForTimeout(8000);

  // Close search/focus canvas
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 1. Select desktop/my_account/My Claims
  const desktopLayer = page.locator('text="desktop/my_account/My Claims"').first();
  if (await desktopLayer.isVisible().catch(() => false)) {
    console.log('Selecting desktop/my_account/My Claims...');
    await desktopLayer.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Shift+2'); // Zoom to selection
    await page.waitForTimeout(3000);

    const desktopUrl = page.url();
    console.log('Desktop URL:', desktopUrl);
    await page.screenshot({ path: path.join(DESKTOP_DIR, 'FIGMA_DESKTOP_MY_CLAIMS_FULL.png') });
    console.log('📸 Saved FIGMA_DESKTOP_MY_CLAIMS_FULL.png');
  }

  // 2. Select mobile/my_account/My Claims
  const mobileLayer = page.locator('text="mobile/my_account/My Claims"').first();
  if (await mobileLayer.isVisible().catch(() => false)) {
    console.log('Selecting mobile/my_account/My Claims...');
    await mobileLayer.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Shift+2'); // Zoom to selection
    await page.waitForTimeout(3000);

    const mobileUrl = page.url();
    console.log('Mobile URL:', mobileUrl);
    await page.screenshot({ path: path.join(MOBILE_DIR, 'FIGMA_MOBILE_MY_CLAIMS_FULL.png') });
    console.log('📸 Saved FIGMA_MOBILE_MY_CLAIMS_FULL.png');
  }

  // 3. Search for "Create Claim" or "create claims" on this page
  console.log('🔍 Checking if Create Claim page exists...');
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(800);
  await page.keyboard.type('Create Claim');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(BASE_DIR, 'figma', '12_SEARCH_CREATE_CLAIM.png') });

  await context.close();
  console.log('🏁 Completed!');
})();
