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
  console.log('🚀 Connecting to Figma to extract all Trade Application frames...');
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
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=3044-10923', { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');

    // Pan / zoom out slightly to see all adjacent trade frames
    await page.keyboard.press('Shift+2'); // Zoom to selection
    await page.waitForTimeout(2000);

    // Capture the exact mobile selection
    await page.screenshot({ path: path.join(OUT_DIR, '01_FIGMA_MOBILE_TRADE_APP_CLOSEUP.png') });
    console.log('Saved 01_FIGMA_MOBILE_TRADE_APP_CLOSEUP.png');

    // Pan left to see desktop trade application
    // Let us press Shift+1 to see all frames in September Changes, then find exact layer coordinates
    // Or let us click the desktop/trade application in layers
    const layers = await page.$$eval('[role="treeitem"]', items => items.map(i => ({
      text: i.innerText.trim(),
      id: i.id || ''
    })));
    console.log('Visible layers:', layers.filter(l => l.text.toLowerCase().includes('trade') || l.text.toLowerCase().includes('desktop')));

    // Let us click directly on the desktop/trade application treeitem
    const desktopItem = page.locator('[role="treeitem"]:has-text("desktop/trade application")').first();
    if (await desktopItem.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Found desktop/trade application in tree!');
      await desktopItem.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2');
      await page.waitForTimeout(3000);
      console.log('Desktop Trade App URL:', page.url());
      await page.screenshot({ path: path.join(OUT_DIR, '02_FIGMA_DESKTOP_TRADE_APP_CLOSEUP.png') });
      console.log('Saved 02_FIGMA_DESKTOP_TRADE_APP_CLOSEUP.png');
    }

    // Now let us zoom out a bit (Shift+0 for 100%, or '-' 2 times) to capture both desktop and mobile side by side in Figma
    await page.keyboard.press('-');
    await page.waitForTimeout(500);
    await page.keyboard.press('-');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '03_FIGMA_TRADE_BOTH_VIEWPORT.png') });
    console.log('Saved 03_FIGMA_TRADE_BOTH_VIEWPORT.png');

    // Check if there are other trade pages or steps in [FINAL] Designs or earlier
    // Let us switch to "[FINAL] Designs" page to see if trade application was originally there
    const finalDesigns = page.locator('text="[FINAL] Designs"').first();
    if (await finalDesigns.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Checking [FINAL] Designs page...');
      await finalDesigns.click();
      await page.waitForTimeout(3000);
      
      // search for "trade application"
      await page.keyboard.press('Control+f');
      await page.waitForTimeout(500);
      await page.keyboard.type('trade application');
      await page.waitForTimeout(2000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(OUT_DIR, '04_FIGMA_FINAL_DESIGNS_TRADE_SEARCH.png') });
      console.log('Saved 04_FIGMA_FINAL_DESIGNS_TRADE_SEARCH.png, URL:', page.url());
    }

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await context.close();
    console.log('Done!');
  }
})();
