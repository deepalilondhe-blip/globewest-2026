const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const US_URL = 'https://mcstaging2.globewest.com';
const OUT_PATH_1 = path.join(__dirname, '../../Footer/comparison/FOOTER_VERIFIED_SIMPLE_RED_PROOF.png');
const OUT_PATH_2 = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FOOTER_VERIFIED_SIMPLE_RED_PROOF.png';
const OUT_DIR_MICHELLE = path.join(__dirname, '../../Footer_Screenshots_For_Michelle');
if (!fs.existsSync(OUT_DIR_MICHELLE)) fs.mkdirSync(OUT_DIR_MICHELLE, { recursive: true });

(async () => {
  console.log('🚀 Launching Chrome to capture Footer with simple red highlights...');
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
    await page.waitForTimeout(5000);

    // Scroll to footer
    console.log('Scrolling to footer...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);

    const footer = page.locator('footer.page-footer, .footer.content').first();
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Apply simple, clean red rectangular borders directly on verified items
    console.log('Applying clean red outlines to verified items...');
    await page.evaluate(() => {
      const RED = '#EB1E1E';
      const BORDER = `3px solid ${RED}`;

      // 1. Social links
      const social = document.querySelector('.social-links-footer');
      if (social) {
        social.style.outline = BORDER;
        social.style.outlineOffset = '6px';
        social.style.borderRadius = '2px';
      }

      // 2. Newsletter Subscribe block
      const newsletter = document.querySelector('.newsletter_custom, .newsletter-custom');
      if (newsletter) {
        newsletter.style.outline = BORDER;
        newsletter.style.outlineOffset = '6px';
        newsletter.style.borderRadius = '2px';
      }

      // 3. Visit Showroom
      const showroom = document.querySelector('.visit-showroom-footer');
      if (showroom) {
        showroom.style.outline = BORDER;
        showroom.style.outlineOffset = '6px';
        showroom.style.borderRadius = '2px';
      }

      // 4. Bottom legal bar / Copyright
      const bottom = document.querySelector('.links-footer-bottom');
      if (bottom) {
        bottom.style.outline = BORDER;
        bottom.style.outlineOffset = '6px';
        bottom.style.borderRadius = '2px';
      }
    });

    await page.waitForTimeout(1000);

    // Capture the entire footer section
    console.log('Capturing full footer screenshot with red highlights...');
    const footerShot = await footer.screenshot();

    fs.writeFileSync(OUT_PATH_1, footerShot);
    fs.writeFileSync(OUT_PATH_2, footerShot);
    fs.writeFileSync(path.join(OUT_DIR_MICHELLE, 'FOOTER_VERIFIED_SIMPLE_RED_PROOF.png'), footerShot);
    console.log('✅ Successfully saved FOOTER_VERIFIED_SIMPLE_RED_PROOF.png!');

    // Also capture focused close-up of Bottom Legal Bar (Copyright 2026)
    const bottomBar = page.locator('.links-footer-bottom').first();
    if (await bottomBar.isVisible().catch(() => false)) {
      const bottomShot = await bottomBar.screenshot();
      const bottomOut = path.join(OUT_DIR_MICHELLE, 'FOOTER_COPYRIGHT_2026_RED_PROOF.png');
      fs.writeFileSync(bottomOut, bottomShot);
      fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FOOTER_COPYRIGHT_2026_RED_PROOF.png', bottomShot);
      console.log('✅ Successfully saved FOOTER_COPYRIGHT_2026_RED_PROOF.png!');
    }

    // Keep open for 10s
    await page.waitForTimeout(10000);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
    console.log('Finished.');
  }
})();
