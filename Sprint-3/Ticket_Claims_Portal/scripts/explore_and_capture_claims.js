const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const PROFILE_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/.figma-chrome-profile');
const OUT_DIR = path.resolve(SCRIPTS_DIR, '../figma');

const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, 'desktop'), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, 'mobile'), { recursive: true });

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) {
    try { fs.unlinkSync(p); } catch (e) {}
  }
});

(async () => {
  console.log('========================================================================');
  console.log('🚀 FIGMA DEEP EXPLORATION & CAPTURE: CLAIMS PORTAL');
  console.log('File: Globewest USA - External');
  console.log('========================================================================\n');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1920,1080'],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    console.log('🌐 Opening Figma document...');
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External', {
      timeout: 120000,
      waitUntil: 'domcontentloaded'
    });

    console.log('⏳ Waiting for canvas...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // First, let us list all pages in this document!
    console.log('📑 Inspecting all document pages...');
    // Click page selector or dropdown
    const pageNav = page.locator('[data-testid*="page-menu"], [class*="pages_panel"], [class*="pageList"], button:has-text("thumbnail")').first();
    if (await pageNav.isVisible().catch(() => false)) {
      await pageNav.click();
      await page.waitForTimeout(1000);
    }

    // Now search for "Claims"
    console.log('🔍 Searching for "Claims"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('Claims');
    await page.waitForTimeout(1500);

    // Switch to "All pages"
    const scopeDropdown = page.locator('text="This page"').first();
    if (await scopeDropdown.isVisible().catch(() => false)) {
      console.log('🔄 Switching search scope from "This page" to "All pages"...');
      await scopeDropdown.click();
      await page.waitForTimeout(1000);
      const allPagesOption = page.locator('text="All pages"').first();
      if (await allPagesOption.isVisible().catch(() => false)) {
        await allPagesOption.click();
        await page.waitForTimeout(4000);
      }
    }

    // Capture the search sidebar
    await page.screenshot({ path: path.join(OUT_DIR, '01_SEARCH_ALL_PAGES.png') });
    console.log('📸 Captured 01_SEARCH_ALL_PAGES.png');

    // Let us expand all collapsible result sections
    console.log('📂 Expanding all sections in search results...');
    const collapsedSections = page.locator('[role="treeitem"][aria-expanded="false"]');
    const collapsedCount = await collapsedSections.count();
    console.log(`Found ${collapsedCount} collapsed sections. Expanding them...`);
    for (let c = 0; c < collapsedCount; c++) {
      try {
        await collapsedSections.nth(c).click();
        await page.waitForTimeout(500);
      } catch (e) {}
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, '02_ALL_RESULTS_EXPANDED.png') });

    // Now collect all tree items in the sidebar
    const allItems = await page.evaluate(() => {
      const treeitems = Array.from(document.querySelectorAll('[role="treeitem"]'));
      return treeitems.map((el, i) => {
        const text = el.innerText.replace(/\n+/g, ' | ').trim();
        const isSelected = el.getAttribute('aria-selected') === 'true';
        const isExpanded = el.getAttribute('aria-expanded');
        return { index: i, text, isSelected, isExpanded };
      });
    });

    console.log(`\n📋 Found ${allItems.length} tree items in search sidebar:`);
    allItems.forEach(item => {
      console.log(`  [${item.index}] "${item.text}" (expanded: ${item.isExpanded})`);
    });

    // Write the list to a JSON file for reference
    fs.writeFileSync(path.join(OUT_DIR, 'claims_search_treeitems.json'), JSON.stringify(allItems, null, 2));

    // Now let us click and zoom each matching item!
    const treeLocators = page.locator('[role="treeitem"]');
    const totalCount = await treeLocators.count();

    const capturedFrames = [];

    for (let i = 0; i < totalCount; i++) {
      const itemLoc = treeLocators.nth(i);
      const text = await itemLoc.innerText().catch(() => '');
      const cleanText = text.replace(/\n+/g, ' ').trim();

      // Skip section headers like "Components 2" or "Design Round 02 24" if they are just page names
      const isHeader = cleanText.match(/\b\d+\s*$/) && (cleanText.includes('Design Round') || cleanText.includes('Components') || cleanText.includes('FINAL'));
      
      console.log(`\n======================================================`);
      console.log(`👉 Item [${i + 1}/${totalCount}]: "${cleanText}"`);

      try {
        await itemLoc.click({ timeout: 5000 });
        await page.waitForTimeout(800);
        await page.keyboard.press('Shift+2'); // Zoom to selection
        await page.waitForTimeout(3000);

        const currentUrl = page.url();
        console.log(`   🔗 Figma URL: ${currentUrl}`);

        const safeName = cleanText.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
        const fileName = `FRAME_${String(i + 1).padStart(2, '0')}_${safeName}.png`;
        const filePath = path.join(OUT_DIR, fileName);

        await page.screenshot({ path: filePath });
        console.log(`   📸 Saved screenshot: ${fileName}`);

        capturedFrames.push({
          index: i + 1,
          name: cleanText,
          url: currentUrl,
          file: fileName
        });
      } catch (err) {
        console.log(`   ⚠️ Could not click/capture item ${i + 1}: ${err.message}`);
      }
    }

    fs.writeFileSync(path.join(OUT_DIR, 'captured_claims_frames.json'), JSON.stringify(capturedFrames, null, 2));
    console.log('\n✅ All Claims frames captured!');

  } catch (error) {
    console.error('❌ Error during Figma capture:', error);
  } finally {
    await context.close();
  }
})();
