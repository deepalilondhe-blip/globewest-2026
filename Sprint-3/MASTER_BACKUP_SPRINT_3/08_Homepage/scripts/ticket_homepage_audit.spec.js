// @ts-check
/**
 * ==============================================================================
 * GLOBEWEST QA AUTOMATION — TICKET #41794519: HOMEPAGE (US EXPANSION)
 * Developer: Vinod Vankar (@VinodV)
 * QA Lead: Deepali Londhe (@DeepaliL)
 * Spec: ticket-homepage-audit.spec.js
 * ==============================================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_STORE_URL = process.env.US_STORE_URL || 'https://mcstaging2.globewest.com';
const AU_STORE_URL = process.env.AU_STORE_URL || 'https://mcstaging2.globewest.com.au';

const TICKET_DIR = path.resolve(__dirname, '..', '..', 'Sprint-3', 'Ticket_41794519_Homepage');
const DESKTOP_DIR = path.join(TICKET_DIR, 'screenshots', 'desktop');
const MOBILE_DIR  = path.join(TICKET_DIR, 'screenshots', 'mobile');
const DEFECT_DIR  = path.join(TICKET_DIR, 'screenshots', 'defects');
const COMP_DIR    = path.join(TICKET_DIR, 'comparison');
const AU_BASE_DIR = path.join(COMP_DIR, 'au_baseline');

[DESKTOP_DIR, MOBILE_DIR, DEFECT_DIR, COMP_DIR, AU_BASE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test.describe('Ticket #41794519: US Homepage Comprehensive QA Audit', () => {

  // ============================================================================
  // TEST 1: DESKTOP STOREFRONT AUDIT & CMS SECTION INSPECTION (1440x900)
  // ============================================================================
  test('TC-HP-01 to 08: Desktop Homepage Structure, CMS Sections & Visual Hierarchy', async ({ page }) => {
    test.setTimeout(240000);
    console.log('\n======================================================');
    console.log('🚀 RUNNING TEST 1: DESKTOP US HOMEPAGE STRUCTURE AUDIT');
    console.log('======================================================');

    await page.setViewportSize({ width: 1440, height: 900 });

    console.log(`Navigating to US Homepage: ${US_STORE_URL}/`);
    await page.goto(`${US_STORE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    // 1. Title Verification
    const pageTitle = await page.title();
    console.log(`📄 Page Title: "${pageTitle}"`);
    const titleIsClean = !pageTitle.toLowerCase().includes('australia');
    console.log(`Title Check (Zero Australia Leak): ${titleIsClean}`);

    // 2. Full Desktop Screenshot
    console.log('📸 Capturing Full Desktop Homepage screenshot...');
    await page.screenshot({ path: path.join(DESKTOP_DIR, '01_desktop_homepage_full.png'), fullPage: true });

    // 3. Header & Utility Bar
    const utilityBar = page.locator('.panel.wrapper, .header-top, .top-utility-bar').first();
    if (await utilityBar.isVisible().catch(() => false)) {
      await utilityBar.screenshot({ path: path.join(DESKTOP_DIR, '02_desktop_utility_bar.png') });
    }

    // 4. Hero Banner Slider (`main-us-banner` / `.home-page-slider`)
    console.log('\n--- Auditing Section 1: Hero Banner Slider ---');
    const heroSlider = page.locator('.home-page-slider, .js-swiper.home-slider, [data-content-type="slide"]').first();
    const heroVisible = await heroSlider.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Hero Banner Slider Visible: ${heroVisible}`);

    if (heroVisible) {
      await heroSlider.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await heroSlider.screenshot({ path: path.join(DESKTOP_DIR, '03_hero_banner_slider.png') });

      // Inspect CTA Links in Hero Banner
      const heroLinks = await heroSlider.locator('a').evaluateAll(links => 
        links.map(a => ({ text: a.textContent?.trim(), href: a.getAttribute('href') }))
      );
      console.log('Hero Banner Links:', JSON.stringify(heroLinks, null, 2));

      // Check for AU Domain Leakage in Hero Banner
      const auHeroLinks = heroLinks.filter(l => l.href && (l.href.includes('.com.au') || l.href.includes('globewest.com.au')));
      if (auHeroLinks.length > 0) {
        console.log('🚨 DEFECT: Hero Banner contains Australian domain links:', auHeroLinks);
      } else {
        console.log('✅ PASS: Zero AU domain leaks in Hero Banner links.');
      }
    }

    // 5. Category Carousel (`home-us-category-carousel` / `.home-category-carousel`)
    console.log('\n--- Auditing Section 2: Category Carousel ---');
    const catCarousel = page.locator('.home-category-carousel, [data-content-type="row"]:has(.category-item)').first();
    const catVisible = await catCarousel.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Category Carousel Visible: ${catVisible}`);

    if (catVisible) {
      await catCarousel.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await catCarousel.screenshot({ path: path.join(DESKTOP_DIR, '04_category_carousel.png') });

      const catCards = await catCarousel.locator('a').evaluateAll(links => 
        links.map(a => ({ text: a.textContent?.replace(/\s+/g, ' ').trim(), href: a.getAttribute('href') }))
      );
      console.log(`Category Carousel Cards count: ${catCards.length}`);
      console.log('Sample cards:', catCards.slice(0, 5));

      const auCatLinks = catCards.filter(l => l.href && l.href.includes('.com.au'));
      if (auCatLinks.length > 0) {
        console.log('🚨 DEFECT: Category Carousel links leak to AU domain:', auCatLinks);
      } else {
        console.log('✅ PASS: Category Carousel links route to US store.');
      }
    }

    // 6. About Us Brand Story (`home-us-page-about-us` / `.home-page-about-us`)
    console.log('\n--- Auditing Section 3: About Us Brand Story ---');
    const aboutUs = page.locator('.home-page-about-us, [data-content-type="row"]:has-text("About us")').first();
    const aboutVisible = await aboutUs.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`About Us Block Visible: ${aboutVisible}`);

    if (aboutVisible) {
      await aboutUs.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await aboutUs.screenshot({ path: path.join(DESKTOP_DIR, '05_about_us_brand_story.png') });

      const aboutText = await aboutUs.innerText().catch(() => '');
      console.log(`About Us text snippet: "${aboutText.slice(0, 150)}..."`);
    }

    // 7. B2B Video Block (`home-us-video-block-b2b` / `.home-page-video-block`)
    console.log('\n--- Auditing Section 4: B2B Video Block ---');
    const videoBlock = page.locator('.global-video-block, .home-page-video-block, [data-content-type="video"]').first();
    const videoVisible = await videoBlock.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Video Block Visible: ${videoVisible}`);

    if (videoVisible) {
      await videoBlock.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await videoBlock.screenshot({ path: path.join(DESKTOP_DIR, '06_b2b_video_block.png') });
    }

    // 8. Recent Articles / Fresh Ideas Journal (`homepage_us_recent_articles` / `.home-page-fresh-ideas`)
    console.log('\n--- Auditing Section 5: Recent Articles / Fresh Ideas ---');
    const journalBlock = page.locator('.home-page-fresh-ideas, [data-content-type="row"]:has-text("Content hub"), [data-content-type="row"]:has-text("Fresh Ideas")').first();
    const journalVisible = await journalBlock.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Journal / Fresh Ideas Block Visible: ${journalVisible}`);

    if (journalVisible) {
      await journalBlock.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await journalBlock.screenshot({ path: path.join(DESKTOP_DIR, '07_recent_articles_journal.png') });

      const journalText = await journalBlock.innerText().catch(() => '');
      console.log(`Journal text snippet: "${journalText.slice(0, 200)}..."`);
      if (journalText.includes('Post testing (Duplicate)') || journalText.toLowerCase().includes('dummy')) {
        console.log('🚨 DEFECT: Journal block contains staging dummy placeholder copy: "Post testing (Duplicate)"');
      }
    }

    // 9. Instagram Feed (`insta-us-block-home-page` / `.yotpo-home-insta`)
    console.log('\n--- Auditing Section 6: Instagram Feed ---');
    const instaBlock = page.locator('.yotpo-home-insta, [data-content-type="row"]:has-text("Instagram"), [data-content-type="row"]:has-text("@Globewest")').first();
    const instaVisible = await instaBlock.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Instagram Feed Block Visible: ${instaVisible}`);

    if (instaVisible) {
      await instaBlock.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await instaBlock.screenshot({ path: path.join(DESKTOP_DIR, '08_instagram_feed.png') });

      const instaImages = await instaBlock.locator('img').count();
      console.log(`Instagram rendered images count: ${instaImages}`);
    }

    // 10. SEO Text Block (`home-us-seo-text`)
    console.log('\n--- Auditing Section 7: SEO Content Block ---');
    const seoBlock = page.locator('.home-us-seo-text, [data-content-type="row"]:has-text("Distinctive Living")').first();
    const seoVisible = await seoBlock.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`SEO Content Block Visible: ${seoVisible}`);

    if (seoVisible) {
      await seoBlock.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await seoBlock.screenshot({ path: path.join(DESKTOP_DIR, '09_seo_text_block.png') });
    }

    // 11. Full Storefront AU Scope Leakage Audit across all Links
    console.log('\n--- Auditing All Page Links for AU Redirections ---');
    const allLinks = await page.locator('a[href]').evaluateAll(links => 
      links.map(a => ({
        text: a.textContent?.replace(/\s+/g, ' ').trim() || '',
        href: a.getAttribute('href') || ''
      }))
    );
    console.log(`Total hyperlinks on US Homepage: ${allLinks.length}`);

    const leakedAuLinks = allLinks.filter(l => 
      l.href.includes('globewest.com.au') || 
      l.href.includes('mcstaging2.globewest.com.au') ||
      l.href.includes('.com.au')
    );

    console.log(`Total AU Leaked Links found: ${leakedAuLinks.length}`);
    if (leakedAuLinks.length > 0) {
      console.log('🚨 Sample AU Leaked Links:', leakedAuLinks.slice(0, 10));
    }

    // 12. Placeholder Image Audit
    console.log('\n--- Auditing Images for NetSuite/Catalog Placeholders ---');
    const allImages = await page.locator('img[src]').evaluateAll(imgs => 
      imgs.map(i => ({
        src: i.getAttribute('src') || '',
        alt: i.getAttribute('alt') || '',
        naturalWidth: i.naturalWidth,
        naturalHeight: i.naturalHeight
      }))
    );
    console.log(`Total Images on US Homepage: ${allImages.length}`);
    const placeholders = allImages.filter(i => 
      i.src.includes('/placeholder/default/') || 
      i.src.includes('coming-soon') || 
      i.naturalWidth === 0
    );
    console.log(`Placeholder or Broken Images count: ${placeholders.length}`);

    // 13. Horizontal Scroll Overflow Check
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });
    console.log(`Desktop Overflow Check: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}, hasOverflow=${overflow.hasOverflow}`);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ============================================================================
  // TEST 2: MOBILE VIEWPORT RESPONSIVENESS & TOUCH LAYOUT (390x844 iPhone 14/15)
  // ============================================================================
  test('TC-HP-09: Mobile Responsive Viewport & Touch Layout Inspection', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n======================================================');
    console.log('📱 RUNNING TEST 2: MOBILE VIEWPORT AUDIT (390x844)');
    console.log('======================================================');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${US_STORE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Full Mobile Screenshot
    console.log('📸 Capturing Full Mobile Homepage screenshot...');
    await page.screenshot({ path: path.join(MOBILE_DIR, '01_mobile_homepage_full.png'), fullPage: true });

    // Mobile Header & Hamburger
    const mobileHeader = page.locator('.page-header').first();
    if (await mobileHeader.isVisible().catch(() => false)) {
      await mobileHeader.screenshot({ path: path.join(MOBILE_DIR, '02_mobile_header_nav.png') });
    }

    // Mobile Hero Banner
    const mobileHero = page.locator('.home-page-slider, .js-swiper.home-slider').first();
    if (await mobileHero.isVisible().catch(() => false)) {
      await mobileHero.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await mobileHero.screenshot({ path: path.join(MOBILE_DIR, '03_mobile_hero_banner.png') });
    }

    // Mobile Category Carousel
    const mobileCat = page.locator('.home-category-carousel').first();
    if (await mobileCat.isVisible().catch(() => false)) {
      await mobileCat.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await mobileCat.screenshot({ path: path.join(MOBILE_DIR, '04_mobile_category_carousel.png') });
    }

    // Mobile About Us
    const mobileAbout = page.locator('.home-page-about-us').first();
    if (await mobileAbout.isVisible().catch(() => false)) {
      await mobileAbout.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await mobileAbout.screenshot({ path: path.join(MOBILE_DIR, '05_mobile_about_us.png') });
    }

    // Mobile Video Block
    const mobileVideo = page.locator('.home-page-video-block, .global-video-block').first();
    if (await mobileVideo.isVisible().catch(() => false)) {
      await mobileVideo.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await mobileVideo.screenshot({ path: path.join(MOBILE_DIR, '06_mobile_video_block.png') });
    }

    // Mobile Horizontal Scroll Overflow Assertion
    const mobileOverflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });
    console.log(`Mobile Overflow Check: scrollWidth=${mobileOverflow.scrollWidth}, clientWidth=${mobileOverflow.clientWidth}, hasOverflow=${mobileOverflow.hasOverflow}`);
    expect(mobileOverflow.hasOverflow).toBe(false);
  });

  // ============================================================================
  // TEST 3: DUAL-AUTH MATRIX AUDIT (GUEST VS LOGGED-IN TRADE CUSTOMER)
  // ============================================================================
  test('TC-HP-10 & 11: Dual-Auth Matrix (Guest Public Mode vs Logged-In Trade Customer)', async ({ page }) => {
    test.setTimeout(240000);
    console.log('\n======================================================');
    console.log('🔐 RUNNING TEST 3: DUAL-AUTH MATRIX (GUEST VS TRADE)');
    console.log('======================================================');

    await page.setViewportSize({ width: 1440, height: 900 });

    // Step A: Guest State
    console.log('Step A: Checking Guest (Logged Out) State on US Homepage...');
    await page.goto(`${US_STORE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    const guestToggle = page.locator('button:has-text("Trade"), button:has-text("MSRP"), .price-toggle').first();
    const guestToggleVisible = await guestToggle.isVisible({ timeout: 2000 }).catch(() => false);
    console.log(`Guest State: Trade Pricing Toggle Visible = ${guestToggleVisible} (Expected: false)`);
    expect(guestToggleVisible).toBe(false);

    // Step B: Login as Trade Customer
    console.log('Step B: Authenticating Trade Customer...');
    await page.goto(`${US_STORE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input#email, input[name="login[username]"]').first();
    const passInput = page.locator('input#pass, input[name="login[password]"]').first();
    const loginBtn = page.locator('button#send2, button.action.login.primary').first();

    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill(TRADE_USER.email);
      await passInput.fill(TRADE_USER.password);
      await loginBtn.click();
      await page.waitForTimeout(5000);
      console.log('Logged in. Current URL:', page.url());
    }

    // Step C: Navigate to Homepage in Authenticated State
    console.log('Step C: Navigating to Homepage under Trade Session...');
    await page.goto(`${US_STORE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(DESKTOP_DIR, '10_authenticated_trade_homepage.png'), fullPage: false });

    const authToggle = page.locator('button:has-text("Trade"), button:has-text("MSRP"), .price-toggle').first();
    const authToggleVisible = await authToggle.isVisible({ timeout: 4000 }).catch(() => false);
    console.log(`Authenticated State: Trade Pricing Toggle Visible = ${authToggleVisible}`);
  });

  // ============================================================================
  // TEST 4: AU BASELINE PARITY CAPTURE
  // ============================================================================
  test('TC-HP-12: AU Baseline Live Capture for Red/Green Comparison', async ({ page }) => {
    test.setTimeout(180000);
    console.log('\n======================================================');
    console.log('🇦🇺 RUNNING TEST 4: AU BASELINE STOREFRONT CAPTURE');
    console.log('======================================================');

    await page.setViewportSize({ width: 1440, height: 900 });

    try {
      console.log(`Navigating to AU Baseline: ${AU_STORE_URL}/`);
      await page.goto(`${AU_STORE_URL}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(3000);

      await page.screenshot({ path: path.join(AU_BASE_DIR, 'au_homepage_full.png'), fullPage: true });

      const auHero = page.locator('.home-page-slider, .js-swiper.home-slider').first();
      if (await auHero.isVisible().catch(() => false)) {
        await auHero.screenshot({ path: path.join(AU_BASE_DIR, 'au_hero_banner.png') });
      }

      const auCat = page.locator('.home-category-carousel').first();
      if (await auCat.isVisible().catch(() => false)) {
        await auCat.screenshot({ path: path.join(AU_BASE_DIR, 'au_category_carousel.png') });
      }

      const auAbout = page.locator('.home-page-about-us').first();
      if (await auAbout.isVisible().catch(() => false)) {
        await auAbout.screenshot({ path: path.join(AU_BASE_DIR, 'au_about_us.png') });
      }

      const auJournal = page.locator('.home-page-fresh-ideas').first();
      if (await auJournal.isVisible().catch(() => false)) {
        await auJournal.screenshot({ path: path.join(AU_BASE_DIR, 'au_fresh_ideas.png') });
      }

      const auInsta = page.locator('.yotpo-home-insta').first();
      if (await auInsta.isVisible().catch(() => false)) {
        await auInsta.screenshot({ path: path.join(AU_BASE_DIR, 'au_instagram_feed.png') });
      }
      console.log('✅ AU Baseline screenshots captured successfully.');
    } catch (e) {
      console.log('⚠️ Note on AU baseline capture:', e.message);
    }
  });

});
