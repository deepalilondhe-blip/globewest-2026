const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(BASE_DIR, 'figma');
const PROFILE_DIR = path.resolve(__dirname, '../../../GlobeWest 2026/.figma-chrome-profile');

fs.mkdirSync(OUT_DIR, { recursive: true });

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) { try { fs.unlinkSync(p); } catch (e) {} }
});

(async () => {
  console.log('🚀 Launching Figma Chrome to inspect all 29 Claims results...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(10000);

  // Search 'Claims'
  await page.keyboard.press('Control+f');
  await page.waitForTimeout(1000);
  await page.keyboard.type('Claims');
  await page.waitForTimeout(1500);

  // Set All pages
  const scopeDropdown = page.locator('text="This page"').first();
  if (await scopeDropdown.isVisible().catch(() => false)) {
    await scopeDropdown.click();
    await page.waitForTimeout(1000);
    const allPagesOption = page.locator('text="All pages"').first();
    if (await allPagesOption.isVisible().catch(() => false)) {
      await allPagesOption.click();
      await page.waitForTimeout(5000);
    }
  }

  // Capture all search results in sidebar
  await page.screenshot({ path: path.join(OUT_DIR, '04_ALL_29_CLAIMS_RESULTS_SIDEBAR.png') });
  console.log('📸 Saved 04_ALL_29_CLAIMS_RESULTS_SIDEBAR.png');

  // Find all clickable result rows
  const resultRows = await page.$$('[role="treeitem"]');
  console.log('Found treeitem elements count:', resultRows.length);

  const parsedItems = [];
  for (let i = 0; i < resultRows.length; i++) {
    const text = await resultRows[i].innerText().catch(() => '');
    const clean = text.replace(/\n/g, ' ').trim();
    if (clean) {
      parsedItems.push({ index: i, text: clean, element: resultRows[i] });
      console.log(`[${i}] "${clean}"`);
    }
  }

  // Iterate through matching items and zoom in
  for (let i = 0; i < Math.min(parsedItems.length, 15); i++) {
    const item = parsedItems[i];
    console.log(`\n👉 Zooming to [${i}] "${item.text}"...`);
    await item.element.click().catch(() => {});
    await page.waitForTimeout(1000);
    await page.keyboard.press('Shift+2'); // Zoom to selection
    await page.waitForTimeout(3000);

    const figmaUrl = page.url();
    console.log(`   URL: ${figmaUrl}`);

    const safeName = item.text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    const shotFile = `05_CLAIM_${i}_${safeName}.png`;
    await page.screenshot({ path: path.join(OUT_DIR, shotFile) });
    console.log(`   📸 Saved: ${shotFile}`);
  }

  await context.close();
  console.log('\n🏁 Finished capturing all Claims frames!');
})();
