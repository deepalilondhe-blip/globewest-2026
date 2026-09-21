const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs/september');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🎨 Inspecting [FINAL] Designs - September Changes and searching for any Footer frames...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-12739', { timeout: 120000 });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');

    // Click on "[FINAL] Designs - September Changes"
    console.log('Clicking on "[FINAL] Designs - September Changes"...');
    const septRow = page.locator('text="[FINAL] Designs - September Changes"').first();
    if (await septRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await septRow.click();
      await page.waitForTimeout(3000);

      // Press Shift+1 to zoom to fit
      await page.keyboard.press('Shift+1');
      await page.waitForTimeout(3000);

      const shot = await page.screenshot({ fullPage: false });
      fs.writeFileSync(path.join(OUT_DIR, '01_SEPTEMBER_CHANGES_OVERVIEW.png'), shot);
      fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/01_SEPTEMBER_CHANGES_OVERVIEW.png', shot);
      console.log('📸 Saved 01_SEPTEMBER_CHANGES_OVERVIEW.png');

      // Check layers in September Changes
      const septLayers = await page.$$eval('div[role="treeitem"]', els => els.map(e => e.innerText.trim()).filter(Boolean));
      console.log('September Changes Layers:', septLayers);
    }

    // Now switch back to [FINAL] Designs
    console.log('Switching back to [FINAL] Designs...');
    const finalRow = page.locator('text="[FINAL] Designs"').first();
    if (await finalRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await finalRow.click();
      await page.waitForTimeout(3000);
    }

    // Let's inspect the canvas for any text containing "footer" or "Footer"
    console.log('Searching for "footer" across entire file or on canvas...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('footer');
    await page.waitForTimeout(2000);

    const searchShot = await page.screenshot({ fullPage: false });
    fs.writeFileSync(path.join(OUT_DIR, '02_FIGMA_FOOTER_SEARCH_PANEL.png'), searchShot);
    fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/02_FIGMA_FOOTER_SEARCH_PANEL.png', searchShot);
    console.log('📸 Saved 02_FIGMA_FOOTER_SEARCH_PANEL.png');

    console.log('\nChrome will remain open for 20 seconds...');
    await page.waitForTimeout(20000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
    console.log('Done.');
  }
})();
