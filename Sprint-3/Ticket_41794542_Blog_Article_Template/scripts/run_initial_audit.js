const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const DT_AU_DIR = path.join(SCREENSHOTS_DIR, 'desktop', 'live_au');
const DT_US_DIR = path.join(SCREENSHOTS_DIR, 'desktop', 'us_staging');
const MB_AU_DIR = path.join(SCREENSHOTS_DIR, 'mobile', 'live_au');
const MB_US_DIR = path.join(SCREENSHOTS_DIR, 'mobile', 'us_staging');
const DEFECTS_DIR = path.join(SCREENSHOTS_DIR, 'defects');

[DT_AU_DIR, DT_US_DIR, MB_AU_DIR, MB_US_DIR, DEFECTS_DIR].forEach(d => fs.mkdirSync(d, { recursive: true }));

const US_URL = 'https://mcstaging2.globewest.com/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated';
const AU_URL = 'https://www.globewest.com.au/blog/stockist-in-profile/stockist-in-profile-ikos-home';

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🕵️ AUDIT: BLOG ARTICLE TEMPLATE — US STAGING VS AU LIVE');
  console.log('US URL:', US_URL);
  console.log('AU URL:', AU_URL);
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox']
  });

  const auditData = {
    us: {},
    au: {},
    discrepancies: []
  };

  // --------------------------------------------------------------------------
  // 1. DESKTOP AUDIT (1440x900)
  // --------------------------------------------------------------------------
  const dtContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dtPage = await dtContext.newPage();

  // AU Desktop Capture
  console.log('🇦🇺 Loading AU Live Blog Article on Desktop...');
  try {
    await dtPage.goto(AU_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await dtPage.waitForTimeout(3000);
    await clearOverlays(dtPage);

    await dtPage.screenshot({ path: path.join(DT_AU_DIR, '01_AU_desktop_article_viewport.png') });
    await dtPage.screenshot({ path: path.join(DT_AU_DIR, '01_AU_desktop_article_fullpage.png'), fullPage: true });

    auditData.au.desktop = await dtPage.evaluate(() => {
      const title = document.querySelector('h1, .page-title, .post-title')?.innerText?.trim();
      const category = document.querySelector('.post-category, .category, .post-info .category')?.innerText?.trim();
      const date = document.querySelector('.post-date, .date, time')?.innerText?.trim();
      
      // Bottom blog slider inspection
      const sliders = Array.from(document.querySelectorAll('.widget-blog-posts, .blog-slider, .owl-carousel, .swiper, [data-content-type="products"], .post-slider, .related-posts, .block-related-posts'));
      const sliderHeadings = Array.from(document.querySelectorAll('h2, h3, .title, .block-title')).map(h => h.innerText.trim()).filter(t => t.toLowerCase().includes('more') || t.toLowerCase().includes('related') || t.toLowerCase().includes('stories') || t.toLowerCase().includes('article') || t.toLowerCase().includes('inspiration'));

      const allLinks = Array.from(document.querySelectorAll('.column.main a')).map(a => a.href);
      const images = Array.from(document.querySelectorAll('.column.main img')).map(img => ({
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        isPlaceholder: img.src.includes('placeholder')
      }));

      return {
        title,
        category,
        date,
        slidersCount: sliders.length,
        sliderHeadings,
        imagesCount: images.length,
        images,
        allLinksCount: allLinks.length
      };
    });
    console.log('AU Article Desktop Info:', JSON.stringify(auditData.au.desktop, null, 2));
  } catch (e) {
    console.error('AU Desktop error:', e.message);
  }

  // US Desktop Capture
  console.log('\n🇺🇸 Loading US Staging Blog Article on Desktop...');
  try {
    await dtPage.goto(US_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await dtPage.waitForTimeout(3000);
    await clearOverlays(dtPage);

    await dtPage.screenshot({ path: path.join(DT_US_DIR, '01_US_desktop_article_viewport.png') });
    await dtPage.screenshot({ path: path.join(DT_US_DIR, '01_US_desktop_article_fullpage.png'), fullPage: true });

    auditData.us.desktop = await dtPage.evaluate(() => {
      const title = document.querySelector('h1, .page-title, .post-title')?.innerText?.trim();
      const category = document.querySelector('.post-category, .category, .post-info .category')?.innerText?.trim();
      const date = document.querySelector('.post-date, .date, time')?.innerText?.trim();

      // Bottom blog slider inspection
      const sliders = Array.from(document.querySelectorAll('.widget-blog-posts, .blog-slider, .owl-carousel, .swiper, [data-content-type="products"], .post-slider, .related-posts, .block-related-posts'));
      const sliderHeadings = Array.from(document.querySelectorAll('h2, h3, .title, .block-title')).map(h => h.innerText.trim()).filter(t => t.toLowerCase().includes('more') || t.toLowerCase().includes('related') || t.toLowerCase().includes('stories') || t.toLowerCase().includes('article') || t.toLowerCase().includes('inspiration'));

      // Check for Australian links or leaks
      const auLinks = Array.from(document.querySelectorAll('a[href*=".com.au"], a[href*="mcstaging2.globewest.com.au"]')).map(a => ({
        href: a.href,
        text: a.innerText.trim()
      }));

      const images = Array.from(document.querySelectorAll('.column.main img')).map(img => ({
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        isPlaceholder: img.src.includes('placeholder')
      }));

      // Find bottom slider element
      const sliderEl = document.querySelector('.widget-blog-posts, .blog-slider, .block-related-posts, [class*="slider"]');

      return {
        title,
        category,
        date,
        slidersCount: sliders.length,
        sliderHeadings,
        sliderExists: !!sliderEl,
        auLinks,
        imagesCount: images.length,
        images
      };
    });
    console.log('US Article Desktop Info:', JSON.stringify(auditData.us.desktop, null, 2));

    // Capture specific bottom slider if exists
    const sliderBox = await dtPage.$('.widget-blog-posts, .blog-slider, .block-related-posts, [class*="slider"]');
    if (sliderBox) {
      await sliderBox.scrollIntoViewIfNeeded();
      await dtPage.waitForTimeout(1000);
      await sliderBox.screenshot({ path: path.join(DT_US_DIR, '02_US_desktop_bottom_slider.png') });
      console.log('✅ Captured US Desktop Bottom Slider');
    }
  } catch (e) {
    console.error('US Desktop error:', e.message);
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE AUDIT (390x844 - iPhone 14)
  // --------------------------------------------------------------------------
  console.log('\n📱 Launching Mobile Context (390x844)...');
  const mbContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15'
  });
  const mbPage = await mbContext.newPage();

  // AU Mobile
  console.log('🇦🇺 Loading AU Live Blog Article on Mobile...');
  try {
    await mbPage.goto(AU_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await mbPage.waitForTimeout(3000);
    await clearOverlays(mbPage);
    await mbPage.screenshot({ path: path.join(MB_AU_DIR, '01_AU_mobile_article_viewport.png') });
    await mbPage.screenshot({ path: path.join(MB_AU_DIR, '01_AU_mobile_article_fullpage.png'), fullPage: true });
  } catch (e) {
    console.error('AU Mobile error:', e.message);
  }

  // US Mobile
  console.log('🇺🇸 Loading US Staging Blog Article on Mobile...');
  try {
    await mbPage.goto(US_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await mbPage.waitForTimeout(3000);
    await clearOverlays(mbPage);
    await mbPage.screenshot({ path: path.join(MB_US_DIR, '01_US_mobile_article_viewport.png') });
    await mbPage.screenshot({ path: path.join(MB_US_DIR, '01_US_mobile_article_fullpage.png'), fullPage: true });
  } catch (e) {
    console.error('US Mobile error:', e.message);
  }

  await browser.close();

  // Write audit results
  fs.writeFileSync(path.join(BASE_DIR, 'article_template_audit_results.json'), JSON.stringify(auditData, null, 2));
  console.log('\n========================================================================');
  console.log('🎉 AUDIT COMPLETE! Data saved to article_template_audit_results.json');
  console.log('========================================================================\n');
})();
