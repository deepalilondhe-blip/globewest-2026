// @ts-check
/**
 * ============================================================
 * TICKET: Footer Cross-Storefront Audit (Match AU)
 * Test File: tests/ticket-footer.spec.js
 * ============================================================
 *
 * SCOPE:
 *   - Target US URL: https://mcstaging2.globewest.com
 *   - Baseline AU URL: https://mcstaging2.globewest.com.au
 *   - Headed execution with interactive visual neon highlights & badges
 *   - Column 1: Connect with Us, Social Icons, Newsletter Subscribe, Showroom Booking
 *   - Australian Scope Leakage: "AUSTRALIAN OWNED & RUN" continent logo badge
 *   - Domain Leaks: Subscribe Now (globewest.com.au), Shop Outlet (globewestoutlet.com.au), Pinterest (pinterest.com.au)
 *   - Column 2: Products Links (In Stock, Indoor, Outdoor, Living, Dining, Bedroom, Homewares, Lighting, Rugs)
 *   - Column 3: Customer Support Links (How to Buy, Showrooms, Trade, Find a Stockist, Find a Designer, Help Centre, Contact Us, Shop Outlet)
 *   - Column 4: Our Brand Links (About Us, Careers, Inspiration, Press)
 *   - Bottom Bar: Outdated Copyright © 2023 GlobeWest, Privacy Policy, Terms & Conditions, CCPA
 *   - Mobile Viewport Responsiveness (390x844)
 * ============================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_URL = process.env.US_URL || 'https://mcstaging2.globewest.com';
const AU_URL = process.env.AU_URL || 'https://mcstaging2.globewest.com.au';

const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const FOOTER_DIR = path.join(WORKSPACE_DIR, 'Footer');
const US_SCREENSHOTS_DIR = path.join(FOOTER_DIR, 'screenshots', 'us');
const AU_SCREENSHOTS_DIR = path.join(FOOTER_DIR, 'screenshots', 'au');
const SECTIONS_DIR = path.join(FOOTER_DIR, 'screenshots', 'sections');
const COMPARISON_DIR = path.join(FOOTER_DIR, 'comparison');

[US_SCREENSHOTS_DIR, AU_SCREENSHOTS_DIR, SECTIONS_DIR, COMPARISON_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Visual Highlighting Helpers ──────────────────────────────────────────────

/**
 * Highlights an element with a glowing neon border and floating badge tag
 */
async function highlightElement(locator, label = '', durationMs = 1200, color = '#00FFCC') {
  try {
    const el = locator.first();
    const isVis = await el.isVisible({ timeout: 3500 }).catch(() => false);
    if (isVis) {
      await el.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await el.evaluate((node, { tagText, col }) => {
        node.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        node.style.outline = `4px solid ${col}`;
        node.style.outlineOffset = '4px';
        node.style.boxShadow = `0 0 25px ${col}, inset 0 0 15px ${col}`;

        if (tagText) {
          const prev = node.querySelector('.agy-qa-badge');
          if (prev) prev.remove();
          const badge = document.createElement('div');
          badge.className = 'agy-qa-badge';
          badge.textContent = tagText;
          badge.style.position = 'absolute';
          badge.style.zIndex = '9999999';
          badge.style.background = col === '#00FFCC'
            ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)'
            : (col === '#EF4444' || col === '#FF0000')
              ? 'linear-gradient(135deg, #FF0055 0%, #DC2626 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #047857 100%)';
          badge.style.color = '#FFFFFF';
          badge.style.padding = '5px 12px';
          badge.style.fontSize = '12px';
          badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          badge.style.fontWeight = '700';
          badge.style.letterSpacing = '0.5px';
          badge.style.borderRadius = '5px';
          badge.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
          badge.style.top = '-34px';
          badge.style.left = '8px';
          badge.style.pointerEvents = 'none';
          if (window.getComputedStyle(node).position === 'static') {
            node.style.position = 'relative';
          }
          node.appendChild(badge);
        }
      }, { tagText: label, col: color });

      await el.page().waitForTimeout(durationMs);

      await el.evaluate((node) => {
        node.style.outline = '';
        node.style.outlineOffset = '';
        node.style.boxShadow = '';
        const b = node.querySelector('.agy-qa-badge');
        if (b) b.remove();
      }).catch(() => {});
    }
  } catch (e) {}
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe('Footer Cross-Storefront Audit (US vs AU) - Headed Mode', () => {

  test('01. Global Footer Layout & Visual Inspection (US vs AU)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 1: FULL FOOTER LAYOUT & BRANDING INSPECTION');
    console.log('======================================================');

    // ── US Footer ──
    console.log(`[US] Navigating to ${US_URL} ...`);
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    // Scroll smoothly to footer
    const usFooter = page.locator('footer, .page-footer, .footer-content').first();
    await usFooter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await highlightElement(usFooter, 'US Storefront Global Footer', 1500, '#00FFCC');

    // Highlight Column 1: Connect & Subscribe
    const usCol1 = page.locator('.footer-content .row > div:first-child, .footer .col-1, .footer [class*="connect"], .footer [class*="subscribe"]').first();
    if (await usCol1.count() > 0) {
      await highlightElement(usCol1, 'Col 1: Connect & Newsletter', 1000, '#00FFCC');
    }

    // Highlight Column 2: Products
    const usCol2 = page.locator('.footer:has-text("PRODUCTS"), .footer [class*="products"]').first();
    if (await usCol2.count() > 0) {
      await highlightElement(usCol2, 'Col 2: Products Catalog', 1000, '#00FFCC');
    }

    // Highlight Column 3: Customer Support
    const usCol3 = page.locator('.footer:has-text("CUSTOMER SUPPORT"), .footer:has-text("SUPPORT")').first();
    if (await usCol3.count() > 0) {
      await highlightElement(usCol3, 'Col 3: Customer Support', 1000, '#00FFCC');
    }

    // Highlight Column 4: Our Brand
    const usCol4 = page.locator('.footer:has-text("OUR BRAND")').first();
    if (await usCol4.count() > 0) {
      await highlightElement(usCol4, 'Col 4: Our Brand', 1000, '#00FFCC');
    }

    // Capture Full US Footer
    const usFooterScreenshot = path.join(US_SCREENSHOTS_DIR, '01_US_Full_Footer.png');
    await usFooter.screenshot({ path: usFooterScreenshot });
    console.log(`[US] Saved: ${usFooterScreenshot}`);


    // ── AU Baseline Footer ──
    console.log(`\n[AU] Navigating to ${AU_URL} ...`);
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const auFooter = page.locator('footer, .page-footer, .footer-content').first();
    await auFooter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await highlightElement(auFooter, 'AU Baseline Global Footer', 1500, '#10B981');

    const auFooterScreenshot = path.join(AU_SCREENSHOTS_DIR, '01_AU_Full_Footer.png');
    await auFooter.screenshot({ path: auFooterScreenshot });
    console.log(`[AU] Saved: ${auFooterScreenshot}`);
  });


  test('02. Deep Australian Scope Leakage Scan in Footer Links', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 2: AUSTRALIAN DOMAIN & SCOPE LEAKAGE AUDIT');
    console.log('======================================================');

    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    const usFooter = page.locator('footer, .page-footer, .footer-content').first();
    await usFooter.scrollIntoViewIfNeeded();

    // 1. Scan all footer links for Australian domains (.com.au)
    const linksData = await page.evaluate(() => {
      const footer = document.querySelector('footer, .page-footer, .footer-content');
      if (!footer) return [];
      return Array.from(footer.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim() || a.getAttribute('aria-label') || a.className,
        href: a.href,
        outerHtml: a.outerHTML.substring(0, 160)
      }));
    });

    console.log(`[US Footer] Total Links: ${linksData.length}`);
    const auDomainLeaks = linksData.filter(l => l.href.includes('.com.au'));
    console.log(`[US Footer] 🚨 Total Australian Domain Leaks Found: ${auDomainLeaks.length}`);

    auDomainLeaks.forEach((l, i) => {
      console.log(`   #${i + 1}: "${l.text}" ➔ ${l.href}`);
    });

    // 2. Highlight Defect: "Subscribe Now." Link Leaking to AU
    const subscribeLink = page.locator('footer a:has-text("Subscribe Now"), footer a[href*="subscribe-to-our-database"]').first();
    if (await subscribeLink.count() > 0) {
      console.log('🚨 Highlight Defect: Newsletter Subscribe link leaks to globewest.com.au');
      await highlightElement(subscribeLink, '🚨 DEFECT: Leaks to globewest.com.au', 2000, '#EF4444');
      const subScreenshot = path.join(SECTIONS_DIR, 'DEFECT_Footer_Newsletter_AU_Leak.png');
      await page.screenshot({ path: subScreenshot });
    }

    // 3. Highlight Defect: "Shop Outlet" Link Leaking to AU Outlet
    const outletLink = page.locator('footer a:has-text("Shop Outlet"), footer a[href*="globewestoutlet.com.au"]').first();
    if (await outletLink.count() > 0) {
      console.log('🚨 Highlight Defect: Shop Outlet link leaks to globewestoutlet.com.au');
      await highlightElement(outletLink, '🚨 DEFECT: Leaks to globewestoutlet.com.au', 2000, '#EF4444');
      const outScreenshot = path.join(SECTIONS_DIR, 'DEFECT_Footer_Shop_Outlet_AU_Leak.png');
      await page.screenshot({ path: outScreenshot });
    }

    // 4. Highlight Defect: "AUSTRALIAN OWNED & RUN" Emblem
    const auOwnedBadge = page.locator('footer :has-text("AUSTRALIAN OWNED"), footer img[alt*="AUSTRALIAN"], footer svg[class*="australia"]').first();
    if (await auOwnedBadge.count() > 0) {
      console.log('🚨 Highlight Defect: Australian Owned & Run badge rendered on US');
      await highlightElement(auOwnedBadge, '🚨 DEFECT: "AUSTRALIAN OWNED & RUN" Logo', 2000, '#EF4444');
      const badgeScreenshot = path.join(SECTIONS_DIR, 'DEFECT_Footer_Australian_Owned_Badge.png');
      await page.screenshot({ path: badgeScreenshot });
    }

    // 5. Highlight Defect: Pinterest Australian Domain
    const pinterestLink = page.locator('footer a[href*="pinterest.com.au"]').first();
    if (await pinterestLink.count() > 0) {
      console.log('🚨 Highlight Defect: Pinterest link routes to pinterest.com.au');
      await highlightElement(pinterestLink, '🚨 DEFECT: pinterest.com.au Locale', 1500, '#EF4444');
    }
  });


  test('03. Outdated Copyright Year & Legal Bar Audit', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 3: COPYRIGHT YEAR & LEGAL BOTTOM BAR AUDIT');
    console.log('======================================================');

    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    const bottomBar = page.locator('footer .copyright, footer [class*="bottom"], footer:has-text("GlobeWest")').last();
    await bottomBar.scrollIntoViewIfNeeded();

    const legalText = await page.evaluate(() => {
      const el = document.querySelector('footer small, footer .copyright, footer .bottom');
      return el ? el.innerText.trim() : document.querySelector('footer').innerText.slice(-200);
    });
    console.log(`[US Footer] Bottom Bar Text: "${legalText.replace(/\n/g, ' ')}"`);

    // Check copyright year
    if (legalText.includes('2023')) {
      console.log('⚠️ DEFECT: Outdated Copyright year "© 2023 GlobeWest" detected!');
      const copyEl = page.locator('footer :has-text("2023")').first();
      await highlightElement(copyEl, '⚠️ DEFECT: Outdated Copyright © 2023', 1800, '#EF4444');
      const copyScreenshot = path.join(SECTIONS_DIR, 'DEFECT_Footer_Outdated_Copyright_2023.png');
      await page.screenshot({ path: copyScreenshot });
    }
  });


  test('04. Mobile Footer Viewport & Accordions (390x844)', async ({ page }) => {
    console.log('\n======================================================');
    console.log('TEST 4: MOBILE FOOTER AUDIT (390x844)');
    console.log('======================================================');

    await page.setViewportSize({ width: 390, height: 844 });

    // US Mobile Footer
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    const usFooter = page.locator('footer, .page-footer, .footer-content').first();
    await usFooter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await highlightElement(usFooter, 'US Mobile Footer Layout', 1200, '#00FFCC');
    const usMobileScreenshot = path.join(US_SCREENSHOTS_DIR, '04_US_Footer_Mobile_390x844.png');
    await page.screenshot({ path: usMobileScreenshot, fullPage: false });
    console.log(`[US Mobile] Saved: ${usMobileScreenshot}`);

    // AU Mobile Footer
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);

    const auFooter = page.locator('footer, .page-footer, .footer-content').first();
    await auFooter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await highlightElement(auFooter, 'AU Baseline Mobile Footer', 1200, '#10B981');
    const auMobileScreenshot = path.join(AU_SCREENSHOTS_DIR, '04_AU_Footer_Mobile_390x844.png');
    await page.screenshot({ path: auMobileScreenshot, fullPage: false });
    console.log(`[AU Mobile] Saved: ${auMobileScreenshot}`);
  });

});
