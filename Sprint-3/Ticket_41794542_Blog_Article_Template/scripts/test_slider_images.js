const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://mcstaging2.globewest.com/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Scroll directly to .home-page-fresh-ideas
  console.log('Scrolling to fresh ideas...');
  await page.evaluate(() => {
    const el = document.querySelector('.home-page-fresh-ideas');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(3000);

  const imgStatus = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.home-page-fresh-ideas img')).map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: img.clientWidth,
      renderedHeight: img.clientHeight
    }));
    return imgs;
  });
  console.log('Images after scroll:', JSON.stringify(imgStatus, null, 2));

  // Take screenshot of the slider area
  const sliderEl = await page.locator('.home-page-fresh-ideas');
  await sliderEl.screenshot({ path: 'Sprint-3/Ticket_41794542_Blog_Article_Template/screenshots/defects/Fresh_Ideas_Scrolled_Area.png' });
  console.log('Saved Fresh_Ideas_Scrolled_Area.png');

  await browser.close();
})();
