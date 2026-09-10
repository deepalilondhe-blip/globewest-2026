const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=1-185&p=f&t=j3AhqVjMU1DU4htq-0';
const EMAIL = 'deepali.londhe@overdose.digital';
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
    await page.waitForTimeout(500);
    await locator.click();
    await page.waitForTimeout(400);
    return true;
  } catch (e) {
    return false;
  }
}

(async () => {
  console.log('\n============================================================');
  console.log('🎨 FIGMA INTERACTIVE SESSION LAUNCHER (HEADED MODE)');
  console.log('============================================================');
  console.log(`Target URL : ${FIGMA_URL}`);
  console.log(`Auth Email : ${EMAIL}`);
  console.log(`Profile Dir: ${PROFILE_DIR}`);
  console.log('============================================================\n');

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

  console.log(`🌐 Navigating to Figma file...`);
  await page.goto(FIGMA_URL, { timeout: 60000 }).catch(e => console.log('Navigation:', e.message));
  await page.waitForTimeout(3000);

  // Accept cookies if present
  try {
    const cookieBtn = page.locator('button:has-text("Allow all cookies"), button:has-text("Accept")').first();
    if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await highlightAndClick(cookieBtn, 'Accept Cookies', page);
      await page.waitForTimeout(1000);
    }
  } catch (e) {}

  // Check if Login Modal is present
  const googleBtn = page.locator('button:has-text("Continue with Google")').first();
  const needsLogin = await googleBtn.isVisible({ timeout: 5000 }).catch(() => false);

  if (needsLogin) {
    console.log('🔐 Login modal detected. Pre-filling email and triggering Google SSO...');

    // Also prefill email in the modal input so user can see it
    const modalEmail = page.locator('input[type="email"], input[placeholder*="email" i], input').first();
    if (await modalEmail.isVisible({ timeout: 1500 }).catch(() => false)) {
      await modalEmail.fill(EMAIL);
      console.log(`✏️ Pre-filled ${EMAIL} into modal email input.`);
    }

    console.log('🔘 Highlighting & Clicking "Continue with Google"...');
    const [popup] = await Promise.all([
      context.waitForEvent('page', { timeout: 15000 }).catch(() => null),
      highlightAndClick(googleBtn, 'Continue with Google', page)
    ]);

    if (popup) {
      console.log('✅ Google Authentication Popup opened!');
      await popup.waitForLoadState().catch(() => {});
      await popup.waitForTimeout(2000);

      const emailInput = popup.locator('input[type="email"], #identifierId').first();
      if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
        console.log(`✏️ Typing user email into Google Sign-In: ${EMAIL}`);
        await emailInput.evaluate(el => {
          el.style.outline = '4px solid #10B981';
          el.style.boxShadow = '0 0 16px #10B981';
        });
        await popup.waitForTimeout(400);
        await emailInput.fill(EMAIL);
        await popup.waitForTimeout(500);

        const nextBtn = popup.locator('#identifierNext, button:has-text("Next")').first();
        if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log('🔘 Clicking "Next" in Google authentication popup...');
          await highlightAndClick(nextBtn, 'Next (Google Sign-In)', popup);
          await popup.waitForTimeout(3000);
        }
      }

      console.log('\n============================================================');
      console.log('🔑 GOOGLE PASSWORD / 2FA PROMPT IS NOW DISPLAYED ON SCREEN!');
      console.log(`Account: ${EMAIL}`);
      console.log('Please enter your password or approve 2FA on the opened window.');
      console.log('============================================================\n');
    }
  } else {
    console.log('✅ File opened directly or session is already authenticated!');
  }

  // Monitor for modal disappearance & full Figma canvas readiness
  console.log('⏳ Waiting for authentication completion (waiting up to 180s)...');
  const startWait = Date.now();
  let fileLoaded = false;

  while (Date.now() - startWait < 180000) {
    const isGoogleBtnStillVis = await page.locator('button:has-text("Continue with Google")').first().isVisible({ timeout: 800 }).catch(() => false);
    const hasCanvas = await page.locator('canvas').first().isVisible({ timeout: 800 }).catch(() => false);
    const currentTitle = await page.title().catch(() => '');

    if (!isGoogleBtnStillVis && hasCanvas) {
      console.log(`🎉 Authentication SUCCESS! Figma canvas is fully active (Title: "${currentTitle}")`);
      fileLoaded = true;
      break;
    }
    await page.waitForTimeout(2000);
  }

  if (fileLoaded) {
    await page.waitForTimeout(4000);
    await saveScreenshotAll(page, 'FIGMA_LIVE_FILE_LOADED.png');

    // ------------------------------------------------------------------------
    // User instruction: "got to all Final design option and thenit will show figma design page zoom it"
    // ------------------------------------------------------------------------
    console.log('\n🔍 Searching for "all Final design" option in Figma...');
    const finalDesignOption = page.locator(
      'text="all Final design", text="All Final design", text="all final design", text="Final design", text="Final designs", [data-testid*="page"]:has-text("Final")'
    ).first();

    const optionVis = await finalDesignOption.isVisible({ timeout: 5000 }).catch(() => false);
    if (optionVis) {
      console.log('🔘 Found "all Final design" option! Highlighting & clicking...');
      await highlightAndClick(finalDesignOption, 'all Final design option', page);
      await page.waitForTimeout(3000);
    } else {
      console.log('ℹ️ Looking in Pages panel dropdown...');
      const pagesDropdown = page.locator('[data-testid="page-selector"], .pages-panel, button:has-text("Page 1"), .page-name').first();
      if (await pagesDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
        await highlightAndClick(pagesDropdown, 'Pages Panel', page);
        await page.waitForTimeout(1000);
        const pageItem = page.locator('text="all Final design", text="Final design"').first();
        if (await pageItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await highlightAndClick(pageItem, 'all Final design', page);
          await page.waitForTimeout(3000);
        }
      }
    }

    // Zoom in on design page
    console.log('🔍 Zooming into design page...');
    await page.keyboard.press('Shift+0').catch(() => {});
    await page.waitForTimeout(1000);
    await page.keyboard.press('Equal').catch(() => {});
    await page.waitForTimeout(1000);
    await page.keyboard.press('Equal').catch(() => {});
    await page.waitForTimeout(1000);

    await saveScreenshotAll(page, 'FIGMA_LIVE_ALL_FINAL_DESIGNS.png');
    console.log('✅ Successfully zoomed and captured Figma live design page!');
  } else {
    console.log('ℹ️ Session is still open in Chrome. You can continue interacting.');
    await saveScreenshotAll(page, 'FIGMA_LIVE_CURRENT_STATE.png');
  }

  console.log('\nKeeping Chrome open for 60 seconds for you to inspect...');
  await page.waitForTimeout(60000);
  await context.close();
  console.log('Done!');
})();
