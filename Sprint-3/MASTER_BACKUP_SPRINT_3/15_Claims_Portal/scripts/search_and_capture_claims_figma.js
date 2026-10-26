const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(BASE_DIR, 'figma');
const PROFILE_DIR = path.resolve(__dirname, '../../GlobeWest 2026/.figma-chrome-profile');

fs.mkdirSync(OUT_DIR, { recursive: true });

['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('========================================================================');
  console.log('🎨 SEARCHING & CAPTURING FIGMA DESIGNS: CLAIMS / CLAIMS PORTAL');
  console.log('Figma File: Globewest USA - External');
  console.log('========================================================================\n');

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
    console.log('🌐 Opening Figma master design file...');
    await page.goto('https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External', {
      timeout: 120000,
      waitUntil: 'domcontentloaded'
    });

    console.log('⏳ Waiting for canvas to initialize...');
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(6000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Capture initial overview
    await page.screenshot({ path: path.join(OUT_DIR, '00_FIGMA_INITIAL_LOAD.png') });
    console.log('📸 Captured 00_FIGMA_INITIAL_LOAD.png');

    // 1. Search for "Claims" using Figma Search (Ctrl + F)
    console.log('🔍 Triggering Figma Global Search for "Claims"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('Claims');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000);

    await page.screenshot({ path: path.join(OUT_DIR, '01_FIGMA_SEARCH_CLAIMS.png') });
    console.log('📸 Captured 01_FIGMA_SEARCH_CLAIMS.png');

    // Check search results in sidebar
    const results = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[role="treeitem"], [data-testid*="search"], [class*="searchResult"], [class*="tree_row"]'));
      return items.map(el => ({
        text: el.innerText.trim(),
        role: el.getAttribute('role'),
        ariaSelected: el.getAttribute('aria-selected')
      })).filter(i => i.text.length > 0 && i.text.length < 100);
    });
    console.log('Found Search Results in DOM:', JSON.stringify(results.slice(0, 15), null, 2));

    // Also check page list to see all Figma pages in this document
    console.log('\n📄 Checking Figma Document Pages...');
    const pagesList = await page.evaluate(() => {
      const pageElements = Array.from(document.querySelectorAll('[data-testid*="page"], [class*="page-row"], [class*="page_row"], [role="treeitem"]'));
      return pageElements.map(el => el.innerText.trim()).filter(t => t.length > 0 && t.length < 50);
    });
    console.log('Available Document Pages/Items (sample):', pagesList.slice(0, 20));

    // Try finding specific treeitem containing "claims"
    const claimsTreeitems = page.locator('[role="treeitem"]:has-text("claim"), [role="treeitem"]:has-text("Claim")');
    const count = await claimsTreeitems.count();
    console.log(`\n🎯 Found ${count} tree items matching "claim":`);

    for (let i = 0; i < Math.min(count, 8); i++) {
      const item = claimsTreeitems.nth(i);
      const text = await item.innerText().catch(() => '');
      console.log(`\n👉 Inspecting Claim Item ${i + 1}: "${text}"`);
      await item.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(1000);
      await page.keyboard.press('Shift+2'); // Zoom to selection
      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      console.log(`   Figma URL: ${currentUrl}`);

      const filename = `02_FIGMA_CLAIM_MATCH_${i + 1}_${text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.png`;
      await page.screenshot({ path: path.join(OUT_DIR, filename) });
      console.log(`   📸 Captured: ${filename}`);
    }

    // Also check "[FINAL] Designs - September Changes" page if not already checked
    console.log('\n🔍 Switching to "[FINAL] Designs - September Changes" to inspect Claims frames...');
    const septPage = page.locator('text="[FINAL] Designs - September Changes"').first();
    if (await septPage.isVisible({ timeout: 5000 }).catch(() => false)) {
      await septPage.click();
      await page.waitForTimeout(4000);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);

      // Search Claims in September page
      await page.keyboard.press('Control+f');
      await page.waitForTimeout(1000);
      await page.keyboard.type('Claims');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);

      await page.screenshot({ path: path.join(OUT_DIR, '03_FIGMA_SEPTEMBER_SEARCH_CLAIMS.png') });
      console.log('📸 Captured 03_FIGMA_SEPTEMBER_SEARCH_CLAIMS.png');

      const septMatches = page.locator('[role="treeitem"]:has-text("claim"), [role="treeitem"]:has-text("Claim")');
      const septCount = await septMatches.count();
      console.log(`🎯 Found ${septCount} items on September Changes page matching "claim"`);
      for (let j = 0; j < Math.min(septCount, 6); j++) {
        const item = septMatches.nth(j);
        const text = await item.innerText().catch(() => '');
        console.log(`👉 September Claim Item ${j + 1}: "${text}"`);
        await item.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1000);
        await page.keyboard.press('Shift+2');
        await page.waitForTimeout(3000);

        const currentUrl = page.url();
        console.log(`   Figma URL: ${currentUrl}`);
        const filename = `04_FIGMA_SEPT_CLAIM_${j + 1}_${text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}.png`;
        await page.screenshot({ path: path.join(OUT_DIR, filename) });
        console.log(`   📸 Captured: ${filename}`);
      }
    }

    console.log('\n🏁 Figma Claims search and capture completed successfully!');
  } catch (err) {
    console.error('❌ Error during Figma capture:', err.message);
  } finally {
    await context.close();
  }
})();
