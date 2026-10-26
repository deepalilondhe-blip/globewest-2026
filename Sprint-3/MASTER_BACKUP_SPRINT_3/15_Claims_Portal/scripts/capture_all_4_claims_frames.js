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
  console.log('📸 CAPTURING ALL 4 CLAIMS FRAMES (DESKTOP + MOBILE)...');
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

  // 1. Search for "Create Claim" to get the 2 frames
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(600);
  await page.keyboard.type('Create Claim');
  await page.waitForTimeout(1500);

  // Click desktop/my_account/Create Claim
  console.log('👉 Capturing desktop/my_account/Create Claim...');
  const desktopCreateClaim = page.locator('text="desktop/my_account/Create Claim"').first();
  if (await desktopCreateClaim.isVisible({ timeout: 5000 }).catch(() => false)) {
    await desktopCreateClaim.click();
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2'); // Zoom to selection
    await page.waitForTimeout(3000);
    console.log('Desktop Create Claim URL:', page.url());
    await page.screenshot({ path: path.join(DESKTOP_DIR, '01_FIGMA_DESKTOP_CREATE_CLAIM.png') });
  }

  // Click mobile/my_account/Create Claim
  console.log('👉 Capturing mobile/my_account/Create Claim...');
  const mobileCreateClaim = page.locator('text="mobile/my_account/Create Claim"').first();
  if (await mobileCreateClaim.isVisible({ timeout: 5000 }).catch(() => false)) {
    await mobileCreateClaim.click();
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2'); // Zoom to selection
    await page.waitForTimeout(3000);
    console.log('Mobile Create Claim URL:', page.url());
    await page.screenshot({ path: path.join(MOBILE_DIR, '01_FIGMA_MOBILE_CREATE_CLAIM.png') });
  }

  // 2. Search for "My Claims" to get the 2 listing frames
  await page.keyboard.press('Control+a');
  await page.keyboard.type('My Claims');
  await page.waitForTimeout(1500);

  console.log('👉 Capturing desktop/my_account/My Claims...');
  const desktopMyClaims = page.locator('text="desktop/my_account/My Claims"').first();
  if (await desktopMyClaims.isVisible({ timeout: 5000 }).catch(() => false)) {
    await desktopMyClaims.click();
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    console.log('Desktop My Claims URL:', page.url());
    await page.screenshot({ path: path.join(DESKTOP_DIR, '02_FIGMA_DESKTOP_MY_CLAIMS.png') });
  }

  console.log('👉 Capturing mobile/my_account/My Claims...');
  const mobileMyClaims = page.locator('text="mobile/my_account/My Claims"').first();
  if (await mobileMyClaims.isVisible({ timeout: 5000 }).catch(() => false)) {
    await mobileMyClaims.click();
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(3000);
    console.log('Mobile My Claims URL:', page.url());
    await page.screenshot({ path: path.join(MOBILE_DIR, '02_FIGMA_MOBILE_MY_CLAIMS.png') });
  }

  await context.close();
  console.log('🏁 ALL 4 CLAIMS FRAMES CAPTURED SUCCESSFULLY!');
})();
