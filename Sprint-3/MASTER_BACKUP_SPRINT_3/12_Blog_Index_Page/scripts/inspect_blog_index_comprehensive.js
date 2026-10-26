const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots');
const LIVE_AU_DIR = path.join(SCREENSHOTS_DIR, 'live_au');
const US_STAGING_DIR = path.join(SCREENSHOTS_DIR, 'us_staging');

fs.mkdirSync(LIVE_AU_DIR, { recursive: true });
fs.mkdirSync(US_STAGING_DIR, { recursive: true });

const AU_URL = 'https://www.globewest.com.au/blog';
const US_URL = 'https://mcstaging2.globewest.com/blog';

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form, [aria-label="Close dialog"], .needsclick');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🔍 REAL PLAYWRIGHT AUDIT: BLOG INDEX PAGE (AU LIVE VS US STAGING)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const auditData = {
    timestamp: new Date().toISOString(),
    au: {},
    us: {}
  };

  // --- 1. INSPECT AU LIVE BASELINE ---
  console.log('🌐 Loading AU Live Baseline (Desktop 1440x900):', AU_URL);
  await page.goto(AU_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await clearOverlays(page);

  auditData.au.title = await page.title();
  auditData.au.url = page.url();

  // AU Pagination inspection
  auditData.au.pagination = await page.evaluate(() => {
    const pager = document.querySelector('.toolbar-amount, .pages, .pager, .pagination, [class*="pagination"], [class*="pager"]');
    const amountEl = document.querySelector('.toolbar-amount, [class*="toolbar-amount"], .amount');
    const pageItems = Array.from(document.querySelectorAll('.pages-item, .page, .pages li')).map(el => el.innerText.trim());
    return {
      amountText: amountEl ? amountEl.innerText.trim() : 'NOT FOUND',
      rawPagerText: pager ? pager.innerText.trim() : 'NOT FOUND',
      pageItems: pageItems
    };
  });

  // AU Categories
  auditData.au.categories = await page.evaluate(() => {
    const nav = document.querySelectorAll('.blog-categories-nav a, [class*="categories"] a, .category-list a, .blog-nav a');
    return Array.from(nav).map(a => a.innerText.trim()).filter(Boolean);
  });

  // AU Posts count and sample cards
  auditData.au.posts = await page.evaluate(() => {
    const cards = document.querySelectorAll('.post-item, .blog-post-card, [class*="post-holder"], article, .post-list-item');
    const sample = [];
    cards.forEach((card, idx) => {
      if (idx < 5) {
        const title = card.querySelector('h2, h3, .post-title, [class*="title"]')?.innerText.trim() || '';
        const img = card.querySelector('img');
        sample.push({
          title,
          imgSrc: img ? img.src : 'NO_IMG',
          naturalWidth: img ? img.naturalWidth : 0,
          naturalHeight: img ? img.naturalHeight : 0
        });
      }
    });
    return {
      totalCardsOnPage: cards.length,
      sample
    };
  });

  // AU Hero styling
  auditData.au.hero = await page.evaluate(() => {
    const titleBlock = document.querySelector('.blog-hero-title, [class*="hero"] [class*="title"], .page-title-wrapper');
    return {
      exists: !!titleBlock,
      text: titleBlock ? titleBlock.innerText.trim() : '',
      bgColor: titleBlock ? window.getComputedStyle(titleBlock).backgroundColor : '',
      color: titleBlock ? window.getComputedStyle(titleBlock).color : ''
    };
  });

  // Full page screenshot AU
  await page.screenshot({ path: path.join(LIVE_AU_DIR, '01_desktop_au_full.png'), fullPage: true });
  await page.screenshot({ path: path.join(LIVE_AU_DIR, '02_desktop_au_viewport.png'), fullPage: false });

  // Scroll to pagination and screenshot
  const auPagerEl = page.locator('.toolbar-amount, .pages, .pager').first();
  if (await auPagerEl.isVisible().catch(() => false)) {
    await auPagerEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(LIVE_AU_DIR, '03_desktop_au_pagination.png') });
  }

  // --- 2. INSPECT US STAGING LIVE ---
  console.log('\n🌐 Loading US Live Staging (Desktop 1440x900):', US_URL);
  await page.goto(US_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await clearOverlays(page);

  auditData.us.title = await page.title();
  auditData.us.url = page.url();

  // US Pagination inspection
  auditData.us.pagination = await page.evaluate(() => {
    const pager = document.querySelector('.toolbar-amount, .pages, .pager, .pagination, [class*="pagination"], [class*="pager"]');
    const amountEl = document.querySelector('.toolbar-amount, [class*="toolbar-amount"], .amount');
    const pageItems = Array.from(document.querySelectorAll('.pages-item, .page, .pages li')).map(el => el.innerText.trim());
    return {
      amountText: amountEl ? amountEl.innerText.trim() : 'NOT FOUND',
      rawPagerText: pager ? pager.innerText.trim() : 'NOT FOUND',
      pageItems: pageItems
    };
  });

  // US Categories
  auditData.us.categories = await page.evaluate(() => {
    const nav = document.querySelectorAll('.blog-categories-nav a, [class*="categories"] a, .category-list a, .blog-nav a');
    return Array.from(nav).map(a => a.innerText.trim()).filter(Boolean);
  });

  // US Posts count and sample cards
  auditData.us.posts = await page.evaluate(() => {
    const cards = document.querySelectorAll('.post-item, .blog-post-card, [class*="post-holder"], article, .post-list-item');
    const sample = [];
    cards.forEach((card, idx) => {
      if (idx < 5) {
        const title = card.querySelector('h2, h3, .post-title, [class*="title"]')?.innerText.trim() || '';
        const img = card.querySelector('img');
        sample.push({
          title,
          imgSrc: img ? img.src : 'NO_IMG',
          naturalWidth: img ? img.naturalWidth : 0,
          naturalHeight: img ? img.naturalHeight : 0
        });
      }
    });
    return {
      totalCardsOnPage: cards.length,
      sample
    };
  });

  // US Hero styling
  auditData.us.hero = await page.evaluate(() => {
    const titleBlock = document.querySelector('.blog-hero-title, [class*="hero"] [class*="title"], .page-title-wrapper');
    return {
      exists: !!titleBlock,
      text: titleBlock ? titleBlock.innerText.trim() : '',
      bgColor: titleBlock ? window.getComputedStyle(titleBlock).backgroundColor : '',
      color: titleBlock ? window.getComputedStyle(titleBlock).color : ''
    };
  });

  // Full page screenshot US
  await page.screenshot({ path: path.join(US_STAGING_DIR, '01_desktop_us_full.png'), fullPage: true });
  await page.screenshot({ path: path.join(US_STAGING_DIR, '02_desktop_us_viewport.png'), fullPage: false });

  // Scroll to pagination and screenshot
  const usPagerEl = page.locator('.toolbar-amount, .pages, .pager').first();
  if (await usPagerEl.isVisible().catch(() => false)) {
    await usPagerEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(US_STAGING_DIR, '03_desktop_us_pagination.png') });
  }

  // --- 3. RESPONSIVE MOBILE VIEW (390x844) ---
  console.log('\n📱 Inspecting Mobile Viewports (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();

  // Mobile AU
  await mobilePage.goto(AU_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(3000);
  await clearOverlays(mobilePage);
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_mobile_au_viewport.png') });
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_mobile_au_full.png'), fullPage: true });

  // Mobile US
  await mobilePage.goto(US_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(3000);
  await clearOverlays(mobilePage);
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_mobile_us_viewport.png') });
  await mobilePage.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_mobile_us_full.png'), fullPage: true });

  // Mobile horizontal overflow check
  const overflow = await mobilePage.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  auditData.us.mobileOverflow = overflow;

  await browser.close();

  // Save audit data
  const resultJsonPath = path.join(BASE_DIR, 'blog_index_audit_data.json');
  fs.writeFileSync(resultJsonPath, JSON.stringify(auditData, null, 2), 'utf8');

  console.log('\n========================================================================');
  console.log('📊 AUDIT SUMMARY DATA:');
  console.log('AU Pagination Amount:', auditData.au.pagination);
  console.log('US Pagination Amount:', auditData.us.pagination);
  console.log('AU Categories:', auditData.au.categories);
  console.log('US Categories:', auditData.us.categories);
  console.log('AU Total Cards:', auditData.au.posts.totalCardsOnPage);
  console.log('US Total Cards:', auditData.us.posts.totalCardsOnPage);
  console.log('AU Hero BG:', auditData.au.hero);
  console.log('US Hero BG:', auditData.us.hero);
  console.log('US Mobile Overflow:', auditData.us.mobileOverflow);
  console.log('Audit data saved to:', resultJsonPath);
  console.log('========================================================================');
})();
