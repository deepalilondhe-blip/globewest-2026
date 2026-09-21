const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs/layers');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🎨 Launching Figma to inspect Layers and zoom into frames...');
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
    console.log('Waiting for canvas to load...');
    await page.waitForSelector('canvas', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(10000);
    await page.keyboard.press('Escape');

    // Get all visible layer rows
    console.log('Reading layer rows...');
    const rows = await page.$$eval('[class*="layer_row--"], [data-testid="layer-row"], div[role="treeitem"]', els => {
      return els.map(el => {
        const text = el.innerText ? el.innerText.trim() : '';
        const rect = el.getBoundingClientRect();
        return { text, x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, visible: rect.width > 0 && rect.height > 0 };
      });
    });

    console.log(`Found ${rows.length} layer elements in DOM.`);
    rows.filter(r => r.text && r.visible).forEach((r, idx) => console.log(`${idx}: ${r.text.replace(/\n/g, ' ')}`));

    // Let's click on the first few layers and zoom
    const targetNames = [
      'desktop/Category/Show Filters',
      'desktop/product/Trade Pricing - ETA',
      'Order Details Page',
      'My Orders'
    ];

    for (const name of targetNames) {
      console.log(`\n🔍 Looking for layer: "${name}"...`);
      const row = page.locator(`div[role="treeitem"]:has-text("${name}"), div:has-text("${name}")`).last();
      if (await row.isVisible({ timeout: 4000 }).catch(() => false)) {
        console.log(`Found "${name}", clicking...`);
        await row.click();
        await page.waitForTimeout(1000);
        console.log('Pressing Shift+2 to zoom into selection...');
        await page.keyboard.press('Shift+2');
        await page.waitForTimeout(3000);

        const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
        const buf = await page.screenshot({ fullPage: false });
        fs.writeFileSync(path.join(OUT_DIR, `${cleanName}_ZOOMED.png`), buf);
        fs.writeFileSync(`/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/${cleanName}_ZOOMED.png`, buf);
        console.log(`📸 Saved ${cleanName}_ZOOMED.png`);
      } else {
        console.log(`Layer "${name}" not immediately visible in viewport.`);
      }
    }

    console.log('\nKeeping Chrome open for 25 seconds for visual inspection...');
    await page.waitForTimeout(25000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
    console.log('Done.');
  }
})();
