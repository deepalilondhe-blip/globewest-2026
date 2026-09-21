const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs/footer_spec_cards');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🎨 Launching Figma to find, zoom in, and read ALL FOOTER specification cards...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized', '--no-sandbox'],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External', { timeout: 120000 });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');

    // Click [FINAL] Designs
    console.log('Selecting [FINAL] Designs...');
    const finalRow = page.locator('text="[FINAL] Designs"').first();
    if (await finalRow.isVisible({ timeout: 4000 }).catch(() => false)) {
      await finalRow.click();
      await page.waitForTimeout(2000);
    }

    // Search for "footer"
    console.log('Searching for "footer"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(800);
    await page.keyboard.type('footer');
    await page.waitForTimeout(2000);

    // Let's get the search results list in the sidebar
    // In Figma, search results appear under the search input
    const searchResultLocators = page.locator('div[class*="search_result"], div[role="treeitem"], div[role="listitem"]').filter({ hasText: /footer/i });
    const count = await searchResultLocators.count();
    console.log(`Found ${count} search result elements for "footer"`);

    // Let's cycle through by pressing Enter repeatedly and zooming with Shift+2!
    for (let i = 1; i <= 6; i++) {
      console.log(`\nNavigating to search result #${i}...`);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Zoom to selection
      console.log('Zooming to selection (Shift+2)...');
      await page.keyboard.press('Shift+2');
      await page.waitForTimeout(2000);

      // Also zoom out slightly by 1-2 steps to see the entire card and surrounding context
      await page.keyboard.press('Minus');
      await page.waitForTimeout(1000);

      const shot = await page.screenshot({ fullPage: false });
      const fname = `FIGMA_FOOTER_SPEC_CARD_${i}.png`;
      fs.writeFileSync(path.join(OUT_DIR, fname), shot);
      fs.writeFileSync(`/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/${fname}`, shot);
      console.log(`📸 Saved ${fname}`);
    }

    console.log('\nLeaving Chrome open for 25 seconds for visual review...');
    await page.waitForTimeout(25000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
    console.log('Done.');
  }
})();
