const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome',
    args: ['--window-size=1440,900']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const results = {
    previousLinkRetest: {},
    spacingDefectRetest: {},
    allBlogPosts: []
  };

  console.log('--- 1. RETESTING: Previous Article Link 404 Defect ---');
  // First, visit the blog index page
  await page.goto('https://mcstaging2.globewest.com/blog', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Extract all blog post links
  const postLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.post-holder a, .post-item a, .blog-list a, .post-list a, a[href*="/blog/"]'));
    return Array.from(new Set(links.map(a => a.href))).filter(href => href.includes('/blog/') && !href.endsWith('/blog') && !href.endsWith('/blog/'));
  });

  console.log(`Found ${postLinks.length} blog post links on US staging.`);
  results.allBlogPosts = postLinks;

  // Let's test specific articles: IKOS Home and Designer in Profile (Studio Yugen if present)
  for (const postUrl of postLinks) {
    console.log(`\nNavigating to post: ${postUrl}`);
    try {
      const resp = await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(2000);

      const navInfo = await page.evaluate(() => {
        // Find previous / next article elements
        const navElements = Array.from(document.querySelectorAll('.post-bottom, .post-nav, .post-navigation, .next-prev, a.prev, a.next, a[href*="/blog/"]'));
        const prevLinks = Array.from(document.querySelectorAll('a')).filter(a => {
          const text = (a.innerText || a.textContent || '').trim().toLowerCase();
          const rel = a.getAttribute('rel') || '';
          const cls = a.className || '';
          return text.includes('previous') || rel.includes('prev') || cls.includes('prev');
        });
        const nextLinks = Array.from(document.querySelectorAll('a')).filter(a => {
          const text = (a.innerText || a.textContent || '').trim().toLowerCase();
          const rel = a.getAttribute('rel') || '';
          const cls = a.className || '';
          return text.includes('next') || rel.includes('next') || cls.includes('next');
        });

        return {
          title: document.title,
          h1: document.querySelector('h1')?.innerText?.trim(),
          prevLinks: prevLinks.map(a => ({
            text: a.innerText?.trim(),
            href: a.href,
            outerHTML: a.outerHTML
          })),
          nextLinks: nextLinks.map(a => ({
            text: a.innerText?.trim(),
            href: a.href,
            outerHTML: a.outerHTML
          }))
        };
      });

      console.log(`Post: ${navInfo.h1}`);
      console.log(`Previous links found:`, JSON.stringify(navInfo.prevLinks));
      console.log(`Next links found:`, JSON.stringify(navInfo.nextLinks));

      results.previousLinkRetest[postUrl] = {
        h1: navInfo.h1,
        prevLinks: navInfo.prevLinks,
        nextLinks: navInfo.nextLinks
      };

      // If prev links exist, let's test clicking or fetching each href
      for (const pl of navInfo.prevLinks) {
        console.log(`Testing navigation to previous link: ${pl.href}`);
        const testPage = await context.newPage();
        try {
          const prevResp = await testPage.goto(pl.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
          const status = prevResp?.status();
          const is404 = status === 404 || (await testPage.evaluate(() => {
            return document.title.includes('404') || document.body.innerText.includes('404 Not Found') || document.body.innerText.includes('Whoops, our bad');
          }));
          console.log(`Result for ${pl.href}: status = ${status}, is404 = ${is404}`);
          results.previousLinkRetest[postUrl].prevLinkResult = {
            href: pl.href,
            status,
            is404
          };
          if (is404) {
            await testPage.screenshot({
              path: path.join(__dirname, '../screenshots/retest_404_error_page.png'),
              fullPage: false
            });
            console.log('Captured 404 error screenshot!');
          }
        } catch (err) {
          console.log(`Error navigating to previous link ${pl.href}:`, err.message);
          results.previousLinkRetest[postUrl].prevLinkResult = {
            href: pl.href,
            error: err.message
          };
        } finally {
          await testPage.close();
        }
      }

    } catch (err) {
      console.log(`Error visiting post ${postUrl}:`, err.message);
    }
  }

  console.log('\n--- 2. RETESTING: Spacing between Block and Article Content ---');
  // Specifically navigate to the Stockist in Profile | IKOS Home article where dev added the block
  const targetArticle = 'https://mcstaging2.globewest.com/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated';
  await page.goto(targetArticle, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Inspect the layout, the article container, and the block directly below it
  const spacingAnalysis = await page.evaluate(() => {
    const articleContainer = document.querySelector('.post-holder, .blog-post, .post-content, [data-content-type="row"]:has(img[src*="rug"], img[src*="tile"], img[src*="table"])') || document.querySelector('.post-view');
    const freshIdeasBlock = document.querySelector('.home-page-fresh-ideas, [class*="fresh-ideas"]');
    
    // Find all rows or page builder elements in post content
    const allRows = Array.from(document.querySelectorAll('.pagebuilder-content [data-content-type="row"], .entry-content > div, .post-holder > div'));

    // Check elements around the junction
    const articleEndEl = document.querySelector('.post-bottom, .post-nav, .post-content > :last-child, .entry-content > :last-child');
    
    const articleBox = articleContainer ? articleContainer.getBoundingClientRect() : null;
    const blockBox = freshIdeasBlock ? freshIdeasBlock.getBoundingClientRect() : null;

    let computedArticle = null;
    if (articleContainer) {
      const s = window.getComputedStyle(articleContainer);
      computedArticle = {
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        background: s.backgroundColor,
        width: s.width
      };
    }

    let computedBlock = null;
    if (freshIdeasBlock) {
      const s = window.getComputedStyle(freshIdeasBlock);
      computedBlock = {
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        marginTop: s.marginTop,
        marginBottom: s.marginBottom,
        background: s.backgroundColor,
        width: s.width
      };
    }

    // Inspect the exact junction between the last article element and the slider block
    let junctionInfo = [];
    if (freshIdeasBlock) {
      const prevSibling = freshIdeasBlock.previousElementSibling;
      if (prevSibling) {
        const sPrev = window.getComputedStyle(prevSibling);
        junctionInfo.push({
          type: 'prevSibling',
          tagName: prevSibling.tagName,
          className: prevSibling.className,
          marginBottom: sPrev.marginBottom,
          paddingBottom: sPrev.paddingBottom,
          rect: prevSibling.getBoundingClientRect()
        });
      }
      junctionInfo.push({
        type: 'freshIdeasBlock',
        tagName: freshIdeasBlock.tagName,
        className: freshIdeasBlock.className,
        marginTop: window.getComputedStyle(freshIdeasBlock).marginTop,
        paddingTop: window.getComputedStyle(freshIdeasBlock).paddingTop,
        background: window.getComputedStyle(freshIdeasBlock).backgroundColor,
        rect: blockBox
      });
    }

    return {
      articleContainerFound: !!articleContainer,
      computedArticle,
      freshIdeasBlockFound: !!freshIdeasBlock,
      computedBlock,
      junctionInfo,
      distanceBetween: (articleBox && blockBox) ? (blockBox.top - articleBox.bottom) : null
    };
  });

  console.log('Spacing Analysis:', JSON.stringify(spacingAnalysis, null, 2));
  results.spacingDefectRetest = spacingAnalysis;

  // Let's capture high-res screenshots of the junction between article and block
  await page.evaluate(() => {
    const el = document.querySelector('.home-page-fresh-ideas, [class*="fresh-ideas"]');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await page.waitForTimeout(2000);

  const junctionScreenshotPath = path.join(__dirname, '../screenshots/retest_junction_spacing_live.png');
  await page.screenshot({
    path: junctionScreenshotPath,
    fullPage: false
  });
  console.log(`Saved junction spacing screenshot: ${junctionScreenshotPath}`);

  // Also capture full page to examine entire vertical cadence
  const fullPageScreenshotPath = path.join(__dirname, '../screenshots/retest_article_full_page.png');
  await page.screenshot({
    path: fullPageScreenshotPath,
    fullPage: true
  });
  console.log(`Saved full page screenshot: ${fullPageScreenshotPath}`);

  // Save results JSON
  fs.writeFileSync(
    path.join(__dirname, '../retest_defect_verification_results.json'),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
  console.log('Retest script completed successfully.');
})();
