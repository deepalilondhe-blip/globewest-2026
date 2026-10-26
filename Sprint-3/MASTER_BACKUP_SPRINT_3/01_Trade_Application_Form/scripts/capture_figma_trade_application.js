const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_Trade_Application_Form/figma';

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('🚀 Launching Chrome to capture Figma Trade Application artboards...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--window-size=1920,1080'
    ],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    console.log('Opening Figma file at September changes or node 2316-12739...');
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-12739', { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');

    // Switch to September Changes
    console.log('Clicking "[FINAL] Designs - September Changes"...');
    const septRow = page.locator('text="[FINAL] Designs - September Changes"').first();
    if (await septRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await septRow.click();
      await page.waitForTimeout(4000);
    }

    // Now look for "desktop/trade application" in treeitem
    console.log('Looking for "desktop/trade application" layer...');
    const desktopItem = page.locator('[role="treeitem"]:has-text("desktop/trade application")').first();
    if (await desktopItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      await desktopItem.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2'); // Zoom to selection
      await page.waitForTimeout(3000);
      const urlDesktop = page.url();
      console.log('Desktop URL in Figma:', urlDesktop);
      await page.screenshot({ path: path.join(OUT_DIR, '01_FIGMA_DESKTOP_TRADE_APPLICATION.png') });
      console.log('Saved 01_FIGMA_DESKTOP_TRADE_APPLICATION.png');
    } else {
      console.log('Searching layer via Ctrl+F...');
      await page.keyboard.press('Control+f');
      await page.waitForTimeout(500);
      await page.keyboard.type('desktop/trade application');
      await page.waitForTimeout(2000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2');
      await page.waitForTimeout(3000);
      console.log('Desktop URL via search:', page.url());
      await page.screenshot({ path: path.join(OUT_DIR, '01_FIGMA_DESKTOP_TRADE_APPLICATION.png') });
    }

    // Now look for "mobile/trade application"
    console.log('Looking for "mobile/trade application" layer...');
    const mobileItem = page.locator('[role="treeitem"]:has-text("mobile/trade application")').first();
    if (await mobileItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      await mobileItem.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2'); // Zoom to selection
      await page.waitForTimeout(3000);
      const urlMobile = page.url();
      console.log('Mobile URL in Figma:', urlMobile);
      await page.screenshot({ path: path.join(OUT_DIR, '02_FIGMA_MOBILE_TRADE_APPLICATION.png') });
      console.log('Saved 02_FIGMA_MOBILE_TRADE_APPLICATION.png');
    } else {
      await page.keyboard.press('Control+f');
      await page.waitForTimeout(500);
      await page.keyboard.press('Control+a');
      await page.keyboard.type('mobile/trade application');
      await page.waitForTimeout(2000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2');
      await page.waitForTimeout(3000);
      console.log('Mobile URL via search:', page.url());
      await page.screenshot({ path: path.join(OUT_DIR, '02_FIGMA_MOBILE_TRADE_APPLICATION.png') });
    }

    // Check if there are any specs or annotation frames next to trade application
    console.log('Capturing surrounding area to check for spec frames or notes...');
    await page.keyboard.press('-');
    await page.waitForTimeout(500);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '03_FIGMA_TRADE_APPLICATION_SURROUNDING.png') });

  } catch (err) {
    console.error('Error during Figma capture:', err);
  } finally {
    await context.close();
    console.log('Figma capture script complete.');
  }
})();
