const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to AU article with blog slider...');
  await page.goto('https://www.globewest.com.au/blog/designer-in-profile/designer-in-profile-studio-yugen', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);

  const sliderLocator = page.locator('.home-page-fresh-ideas, .widget-blog-posts, .blog-widget-recent').first();
  await sliderLocator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  await sliderLocator.screenshot({ path: 'Sprint-3/Ticket_41794542_Blog_Article_Template/screenshots/defects/AU_APPROVED_BLOG_SLIDER.png' });
  console.log('✅ Successfully saved AU_APPROVED_BLOG_SLIDER.png');

  await browser.close();
})();
