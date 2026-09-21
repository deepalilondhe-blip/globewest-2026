const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs');

(async () => {
  console.log('Inspecting all 5 search results for "Footer" in Figma...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    // Open [FINAL] Designs directly
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2424-21417', { timeout: 120000 });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');

    // Click on [FINAL] Designs if not active
    const finalRow = page.locator('text="[FINAL] Designs"').first();
    if (await finalRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      await finalRow.click();
      await page.waitForTimeout(2000);
    }

    // Search for Footer
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('Footer');
    await page.waitForTimeout(2000);

    // Find search result items in the search panel
    const results = page.locator('[data-testid="search-result-item"], [class*="search_result"], div[role="listitem"], div[role="treeitem"]');
    const count = await results.count();
    console.log('Search results count:', count);

    // Press down arrow or click next result
    for (let i = 1; i <= 5; i++) {
      console.log(`Navigating to result ${i}...`);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.keyboard.press('Shift+2'); // Zoom to selected
      await page.waitForTimeout(2000);

      const shot = await page.screenshot({ fullPage: false });
      const filename = `FIGMA_FOOTER_RESULT_${i}.png`;
      fs.writeFileSync(path.join(OUT_DIR, filename), shot);
      fs.writeFileSync(`/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/${filename}`, shot);
      console.log(`Saved ${filename}`);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
  }
})();
