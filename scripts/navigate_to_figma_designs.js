const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_NODE_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=1-185&p=f&t=j3AhqVjMU1DU4htq-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const SCREENSHOT_DIRS = [
  path.join(WORKSPACE_DIR, 'PLP page', 'screenshots', 'figma_comparison'),
  path.join(WORKSPACE_DIR, 'GlobeWest 2026', 'PLP page', 'screenshots', 'figma_comparison'),
  '/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/figma_comparison'
];

SCREENSHOT_DIRS.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function saveScreenshotAll(page, filename) {
  try {
    const buf = await page.screenshot({ timeout: 5000, fullPage: false });
    SCREENSHOT_DIRS.forEach(d => fs.writeFileSync(path.join(d, filename), buf));
    console.log(`📸 Saved screenshot: ${filename}`);
  } catch (e) {
    console.error(`Screenshot failed for ${filename}:`, e.message);
  }
}

async function highlightAndClick(locator, label, page) {
  try {
    const isVis = await locator.isVisible({ timeout: 3000 }).catch(() => false);
    if (!isVis) return false;
    await locator.evaluate((el, name) => {
      el.style.outline = '4px solid #F59E0B';
      el.style.boxShadow = '0 0 16px #F59E0B';
      el.style.transition = 'all 0.2s ease';
      const badge = document.createElement('div');
      badge.className = 'qa-action-badge';
      badge.textContent = `🔘 CLICK: ${name}`;
      badge.style.position = 'absolute';
      badge.style.top = '-28px';
      badge.style.left = '0';
      badge.style.background = '#F59E0B';
      badge.style.color = '#000';
      badge.style.fontWeight = 'bold';
      badge.style.fontSize = '12px';
      badge.style.padding = '2px 6px';
      badge.style.borderRadius = '3px';
      badge.style.zIndex = '999999';
      badge.style.pointerEvents = 'none';
      if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(badge);
    }, label);
    await page.waitForTimeout(600);
    await locator.click();
    await page.waitForTimeout(600);
    return true;
  } catch (e) {
    return false;
  }
}

(async () => {
  console.log('\n============================================================');
  console.log('🎨 NAVIGATING TO FIGMA "DESIGNS" (ALL FINAL DESIGN) PAGE');
  console.log('============================================================');

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

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log(`🌐 Opening Figma target: ${FIGMA_NODE_URL}`);
  await page.goto(FIGMA_NODE_URL, { timeout: 60000 }).catch(e => console.log('Goto:', e.message));

  console.log('⏳ Waiting 5s for Figma workspace to load...');
  await page.waitForTimeout(5000);

  // Close any comments or sidebars if blocking view
  const commentsTab = page.locator('button:has-text("Comments"), [aria-label="Close comments"]').first();
  // Dismiss blue notification bubble if present
  const blueBubble = page.locator('text="Send reminder", button:has-text("Send reminder")').first();
  if (await blueBubble.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Dismissing reminder bubble...');
    await page.keyboard.press('Escape');
  }

  // Look for "Designs" or "[FINAL] Designs" in the Pages panel
  console.log('🔍 Locating "Designs" page in Pages sidebar...');
  const designsPage = page.locator('text="Designs"').first();
  if (await designsPage.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('🔘 Highlighting and clicking "Designs" page in sidebar...');
    await highlightAndClick(designsPage, 'Designs Page', page);
    await page.waitForTimeout(4000);
  }

  // Zoom to fit all / zoom to selection
  console.log('🔍 Adjusting zoom level to view PLP Category design artboards...');
  // Shift + 1 = Zoom to fit all
  await page.keyboard.press('Shift+1');
  await page.waitForTimeout(2000);

  await saveScreenshotAll(page, 'FIGMA_DESIGNS_OVERVIEW_FIT.png');

  // Let's zoom into the PLP frame
  // Press Shift + 2 to zoom to selected node 1:185
  await page.keyboard.press('Shift+2');
  await page.waitForTimeout(2000);

  await saveScreenshotAll(page, 'FIGMA_PLP_NODE_ZOOMED.png');

  // Zoom in a bit more with '+' (Equal key)
  await page.keyboard.press('Equal');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Equal');
  await page.waitForTimeout(1000);

  await saveScreenshotAll(page, 'FIGMA_PLP_SPEC_ZOOMED_DETAILED.png');
  console.log('✅ Captured Figma PLP live design page at multiple zoom levels!');

  console.log('\nKeeping Chrome open for 60 seconds so you can view it directly on screen...');
  await page.waitForTimeout(60000);
  await context.close();
  console.log('Session completed.');
})();
