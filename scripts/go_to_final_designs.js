const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2424-21417&t=hdXl6V9N8rmpfEkt-0';
const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');

const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🎨 Launching Headed Chrome to navigate to [FINAL] Designs in Figma...');
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--start-maximized',
      '--disable-infobars'
    ],
    viewport: null
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    console.log(`🌐 Navigating to Figma: ${FIGMA_URL}`);
    await page.goto(FIGMA_URL, { timeout: 120000 });

    console.log('⏳ Waiting for canvas / page load...');
    await page.waitForSelector('canvas', { timeout: 60000 }).catch(() => console.log('Canvas wait timeout'));
    await page.waitForTimeout(10000);

    // Dismiss any popups / blue notification banners
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(1000);

    // Locate the "[FINAL] Designs" row in the Pages panel
    console.log('🔍 Checking Pages panel...');
    const finalDesignsRow = page.locator('text="[FINAL] Designs"').first();
    if (await finalDesignsRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('Found "[FINAL] Designs" page, clicking it...');
      await finalDesignsRow.click().catch(() => {});
      await page.waitForTimeout(4000);
    }

    // Zoom to fit all in [FINAL] Designs
    console.log('🔍 Pressing Shift+1 to Zoom to Fit All in [FINAL] Designs...');
    await page.keyboard.press('Shift+1');
    await page.waitForTimeout(4000);

    let screenshot1 = await page.screenshot({ fullPage: false });
    fs.writeFileSync(path.join(OUT_DIR, '01_FINAL_DESIGNS_OVERVIEW_FIT.png'), screenshot1);
    fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/01_FINAL_DESIGNS_OVERVIEW_FIT.png', screenshot1);
    console.log('📸 Saved 01_FINAL_DESIGNS_OVERVIEW_FIT.png');

    // List all layers visible in the Layers panel
    const layerNames = await page.$$eval('[data-testid="layer-row"], [class*="layer_row"]', els => els.map(e => e.innerText.trim()).filter(Boolean)).catch(() => []);
    console.log('📋 Visible Layers in [FINAL] Designs:', layerNames);

    // Check if there is any search in Figma or footer layer
    // Let's search inside the file using Ctrl+F / Cmd+F if supported or look at layers
    console.log('Pressing Ctrl+F to search for "Footer" in Figma...');
    await page.keyboard.press('Control+f').catch(() => {});
    await page.waitForTimeout(1000);
    await page.keyboard.type('Footer');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    let screenshotSearch = await page.screenshot({ fullPage: false });
    fs.writeFileSync(path.join(OUT_DIR, '02_FIGMA_SEARCH_FOOTER.png'), screenshotSearch);
    fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/02_FIGMA_SEARCH_FOOTER.png', screenshotSearch);
    console.log('📸 Saved 02_FIGMA_SEARCH_FOOTER.png');

    console.log('\nLeaving Chrome open for 20 seconds...');
    await page.waitForTimeout(20000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
    console.log('Done.');
  }
})();
