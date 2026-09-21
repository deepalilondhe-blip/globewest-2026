// @ts-check
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_FILE_URL = 'https://www.figma.com/design/oSBa3EMR3gol0vM1tXCdTk/Globewest-USA---External?node-id=2317-27241&t=ureBAP5IOX5AzhQ3-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const SCREENSHOT_PATH = path.join(__dirname, '../../PDP Page/figma_crops/01_LIVE_FIGMA_HEADED_CANVAS.png');

(async () => {
  console.log('\n============================================================');
  console.log('🚀 LAUNCHING HEADED FIGMA SESSION FOR DEEPALI LONDHE');
  console.log('============================================================');
  console.log(`Target URL  : ${FIGMA_FILE_URL}`);
  console.log(`Account     : deepali.londhe@overdose.digital`);
  console.log(`Profile Dir : ${PROFILE_DIR}`);
  console.log('============================================================\n');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
      '--no-sandbox',
      '--disable-infobars'
    ],
    viewport: null
  });

  let page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log('Navigating directly to Figma PDP design node...');
  await page.goto(FIGMA_FILE_URL, { timeout: 120000, waitUntil: 'load' }).catch(e => console.log('Navigation:', e.message));

  console.log('Waiting for Figma interface to load (15 seconds)...');
  await page.waitForTimeout(15000);

  // If cookie banner exists, dismiss it
  try {
    const cookieBtn = page.locator('button:has-text("Allow all cookies"), button:has-text("Accept")').first();
    if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(1000);
    }
  } catch (e) {}

  // Check if we are still on the Recents / Dashboard page
  const currentUrl = page.url();
  console.log(`Current URL after initial load: ${currentUrl}`);

  if (currentUrl.includes('/files/') || currentUrl.includes('recents')) {
    console.log('Figma redirected to dashboard. Waiting for file cards to render...');
    await page.waitForTimeout(8000);
    
    // Look for Globewest USA file tile
    const fileCard = page.locator('div, a, span').filter({ hasText: /Globewest USA - External/i }).first();
    if (await fileCard.isVisible({ timeout: 8000 }).catch(() => false)) {
      console.log('Found Globewest file tile! Clicking to enter design editor...');
      const [newPage] = await Promise.all([
        context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
        fileCard.click({ clickCount: 2 }).catch(() => fileCard.click())
      ]);
      if (newPage) {
        page = newPage;
      }
      await page.waitForTimeout(15000);
    } else {
      console.log('Re-navigating directly to design node URL...');
      await page.goto(FIGMA_FILE_URL, { timeout: 120000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(15000);
    }
  }

  // Ensure active page is focused
  const pages = context.pages();
  for (const p of pages) {
    if (p.url().includes('oSBa3EMR3gol0vM1tXCdTk')) {
      page = p;
      await page.bringToFront();
      break;
    }
  }

  console.log(`Final Active URL: ${page.url()}`);
  console.log('Waiting 10s for canvas and layers to settle...');
  await page.waitForTimeout(10000);

  // Click [FINAL] Designs if visible in left panel
  try {
    const finalDesignsTab = page.locator('div, span, [role="treeitem"]').filter({ hasText: /^\[FINAL\] Designs$/i }).first();
    if (await finalDesignsTab.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('Selecting "[FINAL] Designs" in Pages panel...');
      await finalDesignsTab.click();
      await page.waitForTimeout(3000);
    }
  } catch (e) {}

  // Zoom to selection (Shift+2) or fit to screen
  console.log('Centering canvas on PDP frame (Shift+2)...');
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(4000);

  // Save clean screenshot of what is currently on the Figma screen
  await page.screenshot({ path: SCREENSHOT_PATH });
  console.log(`📸 Saved clean Figma screenshot to: ${SCREENSHOT_PATH}`);

  console.log('\n============================================================');
  console.log('✅ FIGMA PDP DESIGN IS NOW FULLY OPEN ON YOUR SCREEN!');
  console.log('URL: ' + page.url());
  console.log('Ready for live side-by-side comparison with mcstaging2.');
  console.log('Keeping session active...');
  console.log('============================================================\n');

  // Keep browser session alive for 4 hours
  await new Promise(resolve => setTimeout(resolve, 14400000));
})();

