const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, '../.figma-chrome-profile');
const OUT_DIR = path.join(__dirname, '../../Figma_Final_Designs/named_frames');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🎨 Navigating and clicking each named frame in Figma...');
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
    const finalRow = page.locator('text="[FINAL] Designs"').first();
    if (await finalRow.isVisible({ timeout: 4000 }).catch(() => false)) {
      await finalRow.click();
      await page.waitForTimeout(2000);
    }

    const framesToInspect = [
      'Frame 636',
      'Frame 637',
      'Frame 635',
      'Frame 634',
      'Frame 633',
      'Frame 629',
      'Frame 628',
      'Frame 627',
      'Frame 632',
      'Frame 631',
      'Frame 630',
      'Frame 626',
      'Loyalty Program',
      'Frame 625',
      'Frame 624',
      'Order Details Page',
      'My Orders',
      'Frame 623'
    ];

    for (const frameName of framesToInspect) {
      console.log(`\n🔍 Looking for: ${frameName}...`);
      const target = page.locator(`div[role="treeitem"]:has-text("${frameName}")`).first();
      
      const isVis = await target.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVis) {
        console.log(`Clicking ${frameName}...`);
        await target.click({ force: true });
        await page.waitForTimeout(500);
        await page.keyboard.press('Shift+2'); // Zoom to selection
        await page.waitForTimeout(2000);

        const shot = await page.screenshot({ fullPage: false });
        const cleanName = frameName.replace(/\s+/g, '_');
        fs.writeFileSync(path.join(OUT_DIR, `${cleanName}.png`), shot);
        fs.writeFileSync(`/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/${cleanName}.png`, shot);
        console.log(`📸 Saved ${cleanName}.png`);
      } else {
        console.log(`${frameName} not currently visible in sidebar list.`);
      }
    }

    console.log('\nLeaving Chrome open for 20 seconds...');
    await page.waitForTimeout(20000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await context.close();
    console.log('Done.');
  }
})();
