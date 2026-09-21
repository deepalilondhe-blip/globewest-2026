const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const US_URL = 'https://mcstaging2.globewest.com';
const OUT_PATH_1 = path.join(__dirname, '../../Footer/comparison/FOOTER_MOBILE_VERIFIED_RED_PROOF.png');
const OUT_PATH_2 = '/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/FOOTER_MOBILE_VERIFIED_RED_PROOF.png';
const OUT_MICHELLE = path.join(__dirname, '../../Footer_Screenshots_For_Michelle/FOOTER_MOBILE_VERIFIED_RED_PROOF.png');

(async () => {
  console.log('📱 Launching Mobile Chrome (390x844) to capture live Mobile Footer...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  try {
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(4000);

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);

    const footer = page.locator('footer.page-footer, .footer.content').first();
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Outline copyright and social links with clean red box
    await page.evaluate(() => {
      const RED = '#EB1E1E';
      const BORDER = `3px solid ${RED}`;

      // Highlight copyright
      const bottom = document.querySelector('.links-footer-bottom');
      if (bottom) {
        bottom.style.outline = BORDER;
        bottom.style.outlineOffset = '4px';
      }

      // Highlight social icons
      const social = document.querySelector('.social-links-footer');
      if (social) {
        social.style.outline = BORDER;
        social.style.outlineOffset = '4px';
      }
    });

    await page.waitForTimeout(1000);

    const shot = await footer.screenshot();
    fs.writeFileSync(OUT_PATH_1, shot);
    fs.writeFileSync(OUT_PATH_2, shot);
    fs.writeFileSync(OUT_MICHELLE, shot);
    console.log('✅ Successfully saved FOOTER_MOBILE_VERIFIED_RED_PROOF.png');

  } finally {
    await browser.close();
  }
})();
