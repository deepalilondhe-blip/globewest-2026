const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const US_URL = 'https://mcstaging2.globewest.com';
const OUT_DIR = path.join(__dirname, '../../Footer_Screenshots_For_Michelle');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  try {
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);

    const RED = '#EB1E1E';
    const BORDER = `3px solid ${RED}`;

    // 1. Close-up: Bottom legal bar with red outline on copyright
    const bottomBar = page.locator('.links-footer-bottom').first();
    if (await bottomBar.isVisible().catch(() => false)) {
      await bottomBar.evaluate(el => {
        el.style.outline = '3px solid #EB1E1E';
        el.style.outlineOffset = '6px';
        el.style.padding = '4px 10px';
      });
      await page.waitForTimeout(500);
      const shot = await bottomBar.screenshot();
      fs.writeFileSync(path.join(OUT_DIR, '01_COPYRIGHT_2026_RED_BOX.png'), shot);
      fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/01_COPYRIGHT_2026_RED_BOX.png', shot);
    }

    // 2. Close-up: Newsletter Subscribe block
    const newsletter = page.locator('.newsletter_custom, .newsletter-custom').first();
    if (await newsletter.isVisible().catch(() => false)) {
      await newsletter.evaluate(el => {
        el.style.outline = '3px solid #EB1E1E';
        el.style.outlineOffset = '6px';
      });
      await page.waitForTimeout(500);
      const shot = await newsletter.screenshot();
      fs.writeFileSync(path.join(OUT_DIR, '02_NEWSLETTER_SUBSCRIBE_RED_BOX.png'), shot);
      fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/02_NEWSLETTER_SUBSCRIBE_RED_BOX.png', shot);
    }

    // 3. Close-up: Showroom block
    const showroom = page.locator('.visit-showroom-footer').first();
    if (await showroom.isVisible().catch(() => false)) {
      await showroom.evaluate(el => {
        el.style.outline = '3px solid #EB1E1E';
        el.style.outlineOffset = '6px';
      });
      await page.waitForTimeout(500);
      const shot = await showroom.screenshot();
      fs.writeFileSync(path.join(OUT_DIR, '03_SHOWROOM_BOOKING_RED_BOX.png'), shot);
      fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/03_SHOWROOM_BOOKING_RED_BOX.png', shot);
    }

    console.log('Saved all close-up proofs with clean red boxes!');
  } finally {
    await browser.close();
  }
})();
