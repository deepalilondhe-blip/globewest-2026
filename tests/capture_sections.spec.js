// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_STORE_URL = process.env.US_STORE_URL || 'https://mcstaging2.globewest.com';
const EVIDENCE_DIR = path.join(__dirname, '..', 'Ticket 4 - Set up the CMS Structure', 'screenshots', 'sections');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

test('Capture and Highlight Each of the 9 Sections', async ({ page }) => {
  test.setTimeout(120000);
  console.log('Navigating to US Storefront:', US_STORE_URL);
  await page.goto(US_STORE_URL, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3500);

  // Define the 9 sections with their selectors and descriptions
  const sections = [
    {
      num: 1,
      id: 'main-us-banner',
      title: 'Section 1: Hero Banner (main-us-banner)',
      location: 'Top of page, below header',
      selector: '.home-page-slider, .home-slider, .js-swiper, [data-content-type="block"]:has(.home-slider)',
      file: 'Section_1_main-us-banner.png'
    },
    {
      num: 2,
      id: 'home-us-video-block-b2b',
      title: 'Section 2: B2B Video Block (home-us-video-block-b2b)',
      location: 'Below Hero Banner',
      selector: '.home-page-video-block, .global-video-block, [class*="video-placeholder"]',
      file: 'Section_2_home-us-video-block-b2b.png'
    },
    {
      num: 3,
      id: 'home-us-category-carousel',
      title: 'Section 3: Category Carousel (home-us-category-carousel)',
      location: 'Below Video Block',
      selector: '.home-category-carousel, [class*="category-carousel"]',
      file: 'Section_3_home-us-category-carousel.png'
    },
    {
      num: 4,
      id: 'global-us-visit-showroom',
      title: 'Section 4: Visit Showroom Promo (global-us-visit-showroom)',
      location: 'Below Category Carousel',
      selector: '.showroom-booking, .global-us-visit-showroom',
      file: 'Section_4_global-us-visit-showroom.png'
    },
    {
      num: 5,
      id: 'homepage_us_recent_articles',
      title: 'Section 5: Recent Articles / Content Hub (homepage_us_recent_articles)',
      location: 'Below Showroom Promo',
      selector: '.blog-widget-recent, .post-list-wrapper',
      file: 'Section_5_homepage_us_recent_articles.png'
    },
    {
      num: 6,
      id: 'insta-us-block-home-page',
      title: 'Section 6: Instagram Social Feed (insta-us-block-home-page)',
      location: 'Below Recent Articles (Note: Feed hidden pending API token)',
      selector: '.insta-us-block-home-page, [data-block-id*="insta"], #instagram-feed',
      file: 'Section_6_insta-us-block-home-page.png'
    },
    {
      num: 7,
      id: 'home-us-page-about-us',
      title: 'Section 7: About Us Brand Story (home-us-page-about-us)',
      location: 'Below Instagram / Mid-bottom section',
      selector: '.home-page-about-us',
      file: 'Section_7_home-us-page-about-us.png'
    },
    {
      num: 8,
      id: 'global-us-find-designer',
      title: 'Section 8: Find a Designer CTA (global-us-find-designer)',
      location: 'Below About Us section',
      selector: '.global-find-designer',
      file: 'Section_8_global-us-find-designer.png'
    },
    {
      num: 9,
      id: 'home-us-seo-text',
      title: 'Section 9: SEO Text Content Block (home-us-seo-text)',
      location: 'Above Footer at very bottom of page',
      selector: '.home-us-seo-text, [data-block-id*="seo-text"], .seo-content',
      file: 'Section_9_home-us-seo-text.png'
    },
  ];

  for (const sec of sections) {
    console.log(`\n📸 Capturing [${sec.num}/9]: ${sec.id}...`);
    const loc = page.locator(sec.selector).first();
    const isVis = await loc.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVis) {
      await loc.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(600);

      // Inject bright highlight outline + floating badge
      await loc.evaluate((node, info) => {
        node.style.outline = '5px solid #FF0055';
        node.style.outlineOffset = '6px';
        node.style.boxShadow = '0 0 35px rgba(255, 0, 85, 0.9), inset 0 0 20px rgba(255, 0, 85, 0.2)';
        
        const badge = document.createElement('div');
        badge.id = 'temp-qa-badge';
        badge.textContent = `${info.title} (${info.location})`;
        badge.style.position = 'absolute';
        badge.style.zIndex = '9999999';
        badge.style.background = 'linear-gradient(135deg, #FF0055 0%, #FF5500 100%)';
        badge.style.color = '#FFFFFF';
        badge.style.padding = '8px 18px';
        badge.style.fontSize = '14px';
        badge.style.fontWeight = '800';
        badge.style.borderRadius = '6px';
        badge.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
        badge.style.top = '-42px';
        badge.style.left = '10px';
        if (window.getComputedStyle(node).position === 'static') {
          node.style.position = 'relative';
        }
        node.appendChild(badge);
      }, sec);

      const outPath = path.join(EVIDENCE_DIR, sec.file);
      await loc.screenshot({ path: outPath }).catch(async () => {
        await page.screenshot({ path: outPath });
      });
      console.log(`  ✅ Saved highlighted screenshot to: ${outPath}`);

      // Clean up outline
      await loc.evaluate((node) => {
        node.style.outline = '';
        node.style.outlineOffset = '';
        node.style.boxShadow = '';
        const b = node.querySelector('#temp-qa-badge');
        if (b) b.remove();
      }).catch(() => {});
    } else {
      console.log(`  ℹ️ Section [${sec.num}/9] ${sec.id} not visibly detected with selector "${sec.selector}".`);
    }
  }
});
