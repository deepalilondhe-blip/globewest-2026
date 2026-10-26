const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots', 'retest');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form, [aria-label="Close dialog"]');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🔍 RETESTING USER-REPORTED DEFECTS (HEADED CHROME)');
  console.log('1. "Previous Article" link 404 error');
  console.log('2. Improper spacing between Block and Article content');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const reportData = {
    previousLinkRetest: [],
    spacingRetest: {}
  };

  // -------------------------------------------------------------
  // PART 1: RETEST PREVIOUS ARTICLE LINK REDIRECTS TO 404
  // -------------------------------------------------------------
  console.log('📌 PART 1: RETESTING "PREVIOUS ARTICLE" 404 DEFECT');
  
  // Let's load the blog index to grab all available articles
  console.log('Loading US Staging Blog Index: https://mcstaging2.globewest.com/blog');
  await page.goto('https://mcstaging2.globewest.com/blog', { timeout: 60000, waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await clearOverlays(page);

  const articleLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.post-holder a, .post-item a, .blog-list a, .post-list a, a[href*="/blog/"]'));
    return Array.from(new Set(links.map(a => a.href)))
      .filter(href => href.includes('/blog/') && !href.endsWith('/blog') && !href.endsWith('/blog/'));
  });

  console.log(`Found ${articleLinks.length} article links:`, articleLinks);

  // We should also check the specific IKOS Home article
  const ikosUrl = 'https://mcstaging2.globewest.com/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated';
  if (!articleLinks.includes(ikosUrl)) {
    articleLinks.unshift(ikosUrl);
  }

  // Iterate over articles and inspect their Previous / Next post links
  for (const articleUrl of articleLinks) {
    console.log(`\n--- Inspecting: ${articleUrl} ---`);
    try {
      await page.goto(articleUrl, { timeout: 60000, waitUntil: 'commit' });
      await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await clearOverlays(page);

      const navInfo = await page.evaluate(() => {
        const title = document.querySelector('h1')?.innerText?.trim() || document.title;
        // Search for previous article links
        const allLinks = Array.from(document.querySelectorAll('a'));
        const prevLinks = allLinks.filter(a => {
          const text = (a.innerText || a.textContent || '').trim().toLowerCase();
          const rel = a.getAttribute('rel') || '';
          const cls = a.className || '';
          return text.includes('previous') || rel === 'prev' || cls.includes('prev');
        }).map(a => ({
          text: a.innerText?.trim(),
          href: a.href,
          className: a.className,
          html: a.outerHTML
        }));

        const nextLinks = allLinks.filter(a => {
          const text = (a.innerText || a.textContent || '').trim().toLowerCase();
          const rel = a.getAttribute('rel') || '';
          const cls = a.className || '';
          return text.includes('next') || rel === 'next' || cls.includes('next');
        }).map(a => ({
          text: a.innerText?.trim(),
          href: a.href,
          className: a.className,
          html: a.outerHTML
        }));

        // Also check if any post-nav container exists
        const postNav = document.querySelector('.post-nav, .post-navigation, .next-prev, .post-bottom');

        return {
          title,
          url: window.location.href,
          hasPostNav: !!postNav,
          postNavHtml: postNav ? postNav.outerHTML : null,
          prevLinks,
          nextLinks
        };
      });

      console.log(`Article: "${navInfo.title}"`);
      console.log(`Previous Links found (${navInfo.prevLinks.length}):`, navInfo.prevLinks);
      console.log(`Next Links found (${navInfo.nextLinks.length}):`, navInfo.nextLinks);

      const itemResult = {
        articleUrl,
        title: navInfo.title,
        prevLinks: navInfo.prevLinks,
        nextLinks: navInfo.nextLinks,
        prevNavResults: []
      };

      // Test each previous link for 404
      for (const pl of navInfo.prevLinks) {
        console.log(`👉 Testing Previous Link URL: ${pl.href}`);
        const testPage = await context.newPage();
        try {
          const response = await testPage.goto(pl.href, { timeout: 45000, waitUntil: 'commit' });
          await testPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
          await testPage.waitForTimeout(2000);

          const status = response ? response.status() : 'unknown';
          const pageDetails = await testPage.evaluate(() => {
            const h1 = document.querySelector('h1')?.innerText?.trim() || '';
            const title = document.title;
            const bodyText = document.body.innerText;
            const is404 = status === 404 ||
              title.includes('404') ||
              h1.includes('404') ||
              bodyText.includes('404 Not Found') ||
              bodyText.includes('Whoops, our bad') ||
              bodyText.includes('Page not found') ||
              window.location.href.includes('/noroute');
            return { h1, title, is404, currentUrl: window.location.href };
          });

          console.log(`   Response Status: ${status}`);
          console.log(`   Is 404 Page? ${pageDetails.is404}`);
          console.log(`   Destination URL: ${pageDetails.currentUrl}`);

          itemResult.prevNavResults.push({
            targetHref: pl.href,
            httpStatus: status,
            is404: pageDetails.is404,
            currentUrl: pageDetails.currentUrl,
            h1: pageDetails.h1
          });

          if (pageDetails.is404) {
            const screenPath = path.join(SCREENSHOTS_DIR, `DEFECT_404_PREVIOUS_ARTICLE_${Date.now()}.png`);
            await testPage.screenshot({ path: screenPath });
            console.log(`   🚨 Captured 404 Screenshot: ${screenPath}`);
            itemResult.screenshot = screenPath;
          }
        } catch (err) {
          console.error(`   ❌ Navigation failed for ${pl.href}:`, err.message);
          itemResult.prevNavResults.push({
            targetHref: pl.href,
            error: err.message
          });
        } finally {
          await testPage.close();
        }
      }

      reportData.previousLinkRetest.push(itemResult);

    } catch (err) {
      console.error(`Failed to inspect article ${articleUrl}:`, err.message);
    }
  }

  // -------------------------------------------------------------
  // PART 2: RETEST SPACING DEFECT (BLOCK VS ARTICLE CONTENT)
  // -------------------------------------------------------------
  console.log('\n📌 PART 2: RETESTING SPACING DEFECT (BLOCK VS ARTICLE CONTENT)');
  console.log(`Loading IKOS Home Article: ${ikosUrl}`);
  
  await page.goto(ikosUrl, { timeout: 60000, waitUntil: 'commit' });
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await clearOverlays(page);

  // Let's inspect the exact layout around the block and article content
  const spacingDetails = await page.evaluate(() => {
    const postHolder = document.querySelector('.post-holder');
    const postContent = document.querySelector('.post-content, .entry-content');
    const freshIdeas = document.querySelector('.home-page-fresh-ideas, [class*="fresh-ideas"]');
    
    // Find where the article editorial content ends
    // In prnt.sc screenshot, there was an image of a round rug on floor:
    const rugImg = document.querySelector('img[src*="rug"], img[src*="portrait"], img[src*="image-portrait3"], img[src*="image-portrait5"]') ||
                    Array.from(document.querySelectorAll('img')).find(img => img.src && (img.src.includes('Stockist_in_profile') || img.src.includes('rug')));

    const rugRow = rugImg ? rugImg.closest('[data-content-type="row"], .row, div') : null;

    // Get computed styles of elements
    function getBox(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        className: el.className,
        rect: { top: r.top, bottom: r.bottom, height: r.height, width: r.width, left: r.left, right: r.right },
        styles: {
          marginTop: s.marginTop,
          marginBottom: s.marginBottom,
          paddingTop: s.paddingTop,
          paddingBottom: s.paddingBottom,
          backgroundColor: s.backgroundColor,
          maxWidth: s.maxWidth,
          display: s.display,
          boxSizing: s.boxSizing
        }
      };
    }

    // Inspect container hierarchy of fresh ideas block
    let freshIdeasParents = [];
    if (freshIdeas) {
      let curr = freshIdeas.parentElement;
      while (curr && curr !== document.body) {
        freshIdeasParents.push({
          tag: curr.tagName,
          className: curr.className,
          styles: {
            padding: window.getComputedStyle(curr).padding,
            margin: window.getComputedStyle(curr).margin,
            background: window.getComputedStyle(curr).backgroundColor,
            maxWidth: window.getComputedStyle(curr).maxWidth,
            width: window.getComputedStyle(curr).width
          }
        });
        curr = curr.parentElement;
      }
    }

    // Check sibling right before freshIdeas
    const prevElem = freshIdeas ? freshIdeas.previousElementSibling : null;

    // Calculate gap between previous content and freshIdeas block
    let gap = null;
    if (prevElem && freshIdeas) {
      const prevRect = prevElem.getBoundingClientRect();
      const fiRect = freshIdeas.getBoundingClientRect();
      gap = fiRect.top - prevRect.bottom;
    }

    return {
      hasFreshIdeas: !!freshIdeas,
      freshIdeasBox: getBox(freshIdeas),
      prevElemBox: getBox(prevElem),
      rugImgBox: getBox(rugImg),
      gapBetweenPrevAndBlock: gap,
      freshIdeasParents
    };
  });

  console.log('Spacing Details:', JSON.stringify(spacingDetails, null, 2));
  reportData.spacingRetest = spacingDetails;

  // Now scroll to the exact area where article content meets the block and capture it
  await page.evaluate(() => {
    const block = document.querySelector('.home-page-fresh-ideas, [class*="fresh-ideas"]');
    if (block) {
      // Scroll so that the junction is in the upper middle
      const rect = block.getBoundingClientRect();
      window.scrollBy(0, rect.top - 200);
    }
  });
  await page.waitForTimeout(2000);

  const junctionLivePath = path.join(SCREENSHOTS_DIR, 'RETEST_BLOCK_SPACING_JUNCTION_LIVE.png');
  await page.screenshot({ path: junctionLivePath });
  console.log(`Saved live junction spacing screenshot: ${junctionLivePath}`);

  // Let's also check AU Live for the equivalent spacing/block placement if available
  console.log('\nLoading AU Live Article for spacing baseline comparison...');
  const auArticleUrl = 'https://www.globewest.com.au/blog/stockist-in-profile/stockist-in-profile-ikos-home';
  try {
    await page.goto(auArticleUrl, { timeout: 60000, waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await clearOverlays(page);

    // Scroll to bottom of article
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight * 0.75);
    });
    await page.waitForTimeout(2000);

    const auJunctionPath = path.join(SCREENSHOTS_DIR, 'AU_BASELINE_ARTICLE_BOTTOM_SPACING.png');
    await page.screenshot({ path: auJunctionPath });
    console.log(`Saved AU baseline bottom spacing: ${auJunctionPath}`);
  } catch (e) {
    console.warn('AU spacing check warning:', e.message);
  }

  // Write full retest results to JSON
  const reportJsonPath = path.join(BASE_DIR, 'retest_verification_data.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(reportData, null, 2));
  console.log(`\n✅ Saved Retest Results JSON: ${reportJsonPath}`);

  await browser.close();
  console.log('========================================================================');
  console.log('🎉 RETEST COMPLETE');
  console.log('========================================================================');
})();
