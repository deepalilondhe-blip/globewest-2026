/**
 * Captures clean, high-resolution element screenshots for both US and AU footer components.
 * Highlights US elements with RED border and AU elements with GREEN border.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer';
const US_SECTIONS = path.join(BASE_DIR, 'screenshots', 'us_sections');
const AU_SECTIONS = path.join(BASE_DIR, 'screenshots', 'au_sections');

[US_SECTIONS, AU_SECTIONS].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function styleAndCapture(page, selector, outputPath, isDefect = true, highlightSubSelector = null) {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const col = isDefect ? '#EF4444' : '#10B981';

  await el.evaluate((node, { isDefect, subSel }) => {
    node.style.backgroundColor = '#f7f5f2';
    node.style.padding = '12px 18px';
    node.style.borderRadius = '6px';

    if (subSel) {
      const target = node.querySelector(subSel);
      if (target) {
        target.style.outline = isDefect ? '2px solid #EF4444' : '2px solid #10B981';
        target.style.outlineOffset = '3px';
        target.style.backgroundColor = isDefect ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
        target.style.borderRadius = '3px';
        target.style.padding = '2px 6px';
        target.style.fontWeight = 'bold';
      }
    }
  }, { isDefect, subSel: highlightSubSelector });

  await page.waitForTimeout(300);
  await el.screenshot({ path: outputPath });
  console.log(`[Captured] ${outputPath}`);

  // Clean up
  await el.evaluate((node, { subSel }) => {
    node.style.backgroundColor = '';
    node.style.padding = '';
    node.style.borderRadius = '';
    if (subSel) {
      const target = node.querySelector(subSel);
      if (target) {
        target.style.outline = '';
        target.style.outlineOffset = '';
        target.style.backgroundColor = '';
        target.style.borderRadius = '';
        target.style.padding = '';
        target.style.fontWeight = '';
      }
    }
  }, { subSel: highlightSubSelector }).catch(() => {});
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // ─── US STOREFRONT ───
  console.log('Navigating to US Storefront...');
  const usPage = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await usPage.goto('https://mcstaging2.globewest.com', { waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(2000);

  // Hide sticky header if any
  await usPage.evaluate(() => {
    document.querySelectorAll('.page-header, header, [class*="sticky"]').forEach(el => {
      el.style.display = 'none';
    });
  });

  // Defect 1: Customer Support "Shop Outlet" link in column
  await styleAndCapture(
    usPage,
    '.js-footer-links .box-links:has-text("CUSTOMER SUPPORT")',
    path.join(US_SECTIONS, 'd1_shop_outlet.png'),
    true,
    'a[href*="globewestoutlet"]'
  );

  // Defect 2: Newsletter Subscribe block
  await styleAndCapture(
    usPage,
    '.newsletter-custom__col--left',
    path.join(US_SECTIONS, 'd2_newsletter.png'),
    true,
    'a[href*="subscribe"]'
  );

  // Defect 3: Australian Owned & Run logo
  await styleAndCapture(
    usPage,
    '.design-logo-footer',
    path.join(US_SECTIONS, 'd3_australian_badge.png'),
    true,
    null
  );

  // Defect 4: Social Icons (Pinterest AU)
  await styleAndCapture(
    usPage,
    '.social-links-footer',
    path.join(US_SECTIONS, 'd4_social_links.png'),
    true,
    'a.pinterest'
  );

  // Defect 5: Copyright and legal links
  await styleAndCapture(
    usPage,
    '.links-footer-bottom',
    path.join(US_SECTIONS, 'd5_copyright.png'),
    true,
    'li:first-child'
  );

  await usPage.close();

  // ─── AU BASELINE ───
  console.log('Navigating to AU Storefront...');
  const auPage = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await auPage.goto('https://mcstaging2.globewest.com.au', { waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(2000);

  await auPage.evaluate(() => {
    document.querySelectorAll('.page-header, header, [class*="sticky"]').forEach(el => {
      el.style.display = 'none';
    });
  });

  // Baseline 1: Customer Support (Domestic AU outlet is valid for AU)
  await styleAndCapture(
    auPage,
    '.js-footer-links .box-links:has-text("CUSTOMER SUPPORT")',
    path.join(AU_SECTIONS, 'd1_shop_outlet.png'),
    false,
    'a[href*="globewestoutlet"]'
  );

  // Baseline 2: Newsletter Subscribe block
  await styleAndCapture(
    auPage,
    '.newsletter-custom__col--left',
    path.join(AU_SECTIONS, 'd2_newsletter.png'),
    false,
    'a[href*="subscribe"]'
  );

  // Baseline 3: Australian Owned & Run logo (Expected on AU)
  await styleAndCapture(
    auPage,
    '.design-logo-footer',
    path.join(AU_SECTIONS, 'd3_australian_badge.png'),
    false,
    null
  );

  // Baseline 4: Social Icons
  await styleAndCapture(
    auPage,
    '.social-links-footer',
    path.join(AU_SECTIONS, 'd4_social_links.png'),
    false,
    'a.pinterest'
  );

  // Baseline 5: Copyright and legal links
  await styleAndCapture(
    auPage,
    '.links-footer-bottom',
    path.join(AU_SECTIONS, 'd5_copyright.png'),
    false,
    'li:first-child'
  );

  await auPage.close();
  await browser.close();
  console.log('All element captures completed successfully!');
})();
