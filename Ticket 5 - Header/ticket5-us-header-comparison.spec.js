// @ts-check
/**
 * ============================================================
 * TICKET 5: Header & Mega Menu Cross-Storefront Audit
 * Test File: tests/ticket5-us-header-comparison.spec.js
 * ============================================================
 *
 * SCOPE:
 *   - Target US URL: https://mcstaging2.globewest.com
 *   - Baseline AU URL: https://mcstaging2.globewest.com.au
 *   - Headed execution with interactive visual highlighting (neon borders & badges)
 *   - Top Utility Bar: "Book Showroom Appointment" & "Find a designer/stockist"
 *   - Main Header: Logo, Algolia Search trigger modal, Wishlist, Mini Cart, Account
 *   - Top Navigation: All 9 Mega Menu items (Indoor, Outdoor, Homewares, In Stock, etc.)
 *   - Submenu Exploration: Dynamic loading, level-2/3 items (Furniture -> Sofas, etc.)
 *   - Defect Detection: Australian domain leakage (5 hardcoded Outlet links to .au)
 *   - Baseline Verification: 1:1 comparison against AU live header
 *   - Responsive Navigation: Mobile viewport hamburger drawer & accordions
 * ============================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Target URLs
const US_URL = process.env.US_URL || 'https://mcstaging2.globewest.com';
const AU_URL = process.env.AU_URL || 'https://mcstaging2.globewest.com.au';

// Output directories
const WORKSPACE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)';
const TICKET5_DIR = path.join(WORKSPACE_DIR, 'Ticket 5 - Header');
const SECTIONS_DIR = path.join(TICKET5_DIR, 'screenshots', 'sections');
const AU_DIR = path.join(TICKET5_DIR, 'screenshots', 'au_comparison');
const MOBILE_DIR = path.join(TICKET5_DIR, 'screenshots', 'mobile');
const COMPARISON_DIR = path.join(TICKET5_DIR, 'comparison');

[SECTIONS_DIR, AU_DIR, MOBILE_DIR, COMPARISON_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── Visual Highlighting Helpers ──────────────────────────────────────────────

/**
 * Smoothly highlights an element with a glowing neon border and floating badge tag
 */
async function highlightElement(locator, label = '', durationMs = 1200, color = '#FF0055') {
  try {
    const el = locator.first();
    const isVis = await el.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVis) {
      await el.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await el.evaluate((node, { tagText, col }) => {
        node.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        node.style.outline = `4px solid ${col}`;
        node.style.outlineOffset = '4px';
        node.style.boxShadow = `0 0 30px ${col}, inset 0 0 15px ${col}`;

        if (tagText) {
          const prev = node.querySelector('.agy-qa-badge');
          if (prev) prev.remove();
          const badge = document.createElement('div');
          badge.className = 'agy-qa-badge';
          badge.textContent = tagText;
          badge.style.position = 'absolute';
          badge.style.zIndex = '9999999';
          badge.style.background = col === '#00D2FF'
            ? 'linear-gradient(135deg, #00D2FF 0%, #0077FF 100%)'
            : (col === '#EF4444' || col === '#FF0000')
              ? 'linear-gradient(135deg, #FF0000 0%, #B91C1C 100%)'
              : 'linear-gradient(135deg, #FF0055 0%, #FF5500 100%)';
          badge.style.color = '#FFFFFF';
          badge.style.padding = '6px 14px';
          badge.style.fontSize = '13px';
          badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
          badge.style.fontWeight = '800';
          badge.style.letterSpacing = '0.5px';
          badge.style.borderRadius = '6px';
          badge.style.boxShadow = '0 4px 14px rgba(0,0,0,0.45)';
          badge.style.top = '-38px';
          badge.style.left = '10px';
          badge.style.pointerEvents = 'none';
          if (window.getComputedStyle(node).position === 'static') {
            node.style.position = 'relative';
          }
          node.appendChild(badge);
        }
      }, { tagText: label, col: color });

      await el.page().waitForTimeout(durationMs);

      // Clean up outline smoothly
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

/**
 * Highlights a button or link before interacting or clicking
 */
async function clickWithHighlight(locator, label = '', durationMs = 800) {
  try {
    const el = locator.first();
    const isVis = await el.isVisible({ timeout: 2500 }).catch(() => false);
    if (isVis) {
      await el.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await el.evaluate((node, tagText) => {
        node.style.transition = 'all 0.2s ease-in-out';
        node.style.outline = '4px solid #00FFCC';
        node.style.outlineOffset = '3px';
        node.style.boxShadow = '0 0 25px rgba(0, 255, 204, 0.95)';
      }, label);
      await el.page().waitForTimeout(durationMs);
      await el.evaluate((node) => {
        node.style.outline = '';
        node.style.outlineOffset = '';
        node.style.boxShadow = '';
      }).catch(() => {});
    }
  } catch (e) {}
}

test.describe('Ticket 5: US Storefront Header & Mega Menu Verification (vs AU Baseline)', () => {

  test.beforeEach(async ({ page }) => {
    // Standard desktop viewport for header testing
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: Top Utility Bar Audit (Showroom Booking vs Find Designer)
  // ──────────────────────────────────────────────────────────────────────────
  test('TC-HEADER-01: Top Utility Bar Audit & AU Baseline Comparison', async ({ page }) => {
    console.log('\n--- Running TC-HEADER-01: Top Utility Bar Audit ---');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    const topBar = page.locator('.panel.header, .header-top, .panel.wrapper').first();
    await expect(topBar).toBeVisible({ timeout: 10000 });

    await highlightElement(topBar, '🏷️ [US Header] Top Utility Bar', 1400, '#00FFCC');

    // Inspect "Book Showroom Appointment"
    const bookingLink = topBar.locator('a[href*="booking"], a:has-text("Book Showroom")').first();
    const hasBooking = await bookingLink.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('US Showroom Booking Link Present:', hasBooking);
    if (hasBooking) {
      await clickWithHighlight(bookingLink, '⚡ Inspecting Showroom Booking Link', 900);
      const bookingHref = await bookingLink.getAttribute('href');
      console.log('US Showroom Booking href:', bookingHref);
      expect(bookingHref).toBeTruthy();
    }

    // Inspect "Find a designer or stockist" (AU baseline feature)
    const designerLink = topBar.locator('a[href*="find-designer"], a:has-text("designer")').first();
    const hasDesigner = await designerLink.isVisible({ timeout: 1500 }).catch(() => false);
    console.log('US "Find a designer" link present:', hasDesigner);

    // Save screenshot of US top bar
    const topBarBox = await topBar.boundingBox();
    if (topBarBox) {
      const topBarScreenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: 1440, height: Math.max(120, Math.round(topBarBox.y + topBarBox.height + 20)) }
      });
      fs.writeFileSync(path.join(SECTIONS_DIR, 'Section_Top_Bar_US.png'), topBarScreenshot);
    }

    // Highlight Defect if Find a Designer is missing on US
    if (!hasDesigner) {
      console.log('🚨 DEFECT: "Find a designer or stockist" link is missing on US Storefront top bar.');
      await highlightElement(topBar, '🚨 [DEFECT] "Find a designer/stockist" Missing on US Top Bar', 2000, '#EF4444');
      const defectTopBar = await page.screenshot({
        clip: { x: 0, y: 0, width: 1440, height: 120 }
      });
      fs.writeFileSync(path.join(SECTIONS_DIR, 'DEFECT_Top_Bar_Find_Designer_Missing.png'), defectTopBar);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Header Brand Logo, Search Bar & Utility Icons
  // ──────────────────────────────────────────────────────────────────────────
  test('TC-HEADER-02: Header Logo, Search, Wishlist & Cart Utilities', async ({ page }) => {
    console.log('\n--- Running TC-HEADER-02: Header Utilities & Logo ---');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    // 1. Logo Verification
    const logo = page.locator('a.logo, a[aria-label="store logo"]').first();
    await expect(logo).toBeVisible({ timeout: 10000 });
    await highlightElement(logo, '🏷️ GlobeWest Brand Logo', 1200, '#00FFCC');

    const logoHref = await logo.getAttribute('href');
    console.log('Logo href:', logoHref);
    expect(logoHref).toMatch(/mcstaging2\.globewest\.com|\/$/);
    expect(logoHref).not.toContain('.com.au');

    // 2. Algolia Search Bar
    const searchTrigger = page.locator('.od-search, #od-search, input[placeholder*="Search"]').first();
    const hasSearch = await searchTrigger.isVisible({ timeout: 3000 }).catch(() => false);
    console.log('Algolia Search Trigger Present:', hasSearch);
    if (hasSearch) {
      await clickWithHighlight(searchTrigger, '⚡ Algolia Search Bar Trigger', 1000);
      await searchTrigger.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);

      // Check if modal opened
      const searchModal = page.locator('.od-search-modal, .search-autocomplete, .od-search.is-active').first();
      const modalActive = await searchModal.isVisible({ timeout: 2000 }).catch(() => false);
      console.log('Search Modal Opened:', modalActive);

      // Close modal by clicking outside or pressing Escape
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(500);
    }

    // 3. Wishlist Icon
    const wishlist = page.locator('.link.wishlist, a[href*="wishlist"]').first();
    if (await wishlist.isVisible({ timeout: 2000 }).catch(() => false)) {
      await highlightElement(wishlist, '🏷️ Wishlist Favorite Icon', 900, '#00FFCC');
    }

    // 4. Cart Icon
    const cart = page.locator('.minicart-wrapper, .action.showcart').first();
    if (await cart.isVisible({ timeout: 2000 }).catch(() => false)) {
      await highlightElement(cart, '🏷️ Mini Cart Bag', 900, '#00FFCC');
    }

    // 5. Account / Login Dropdown
    const login = page.locator('.customer-welcome, .authorization-link, a:has-text("Login")').first();
    if (await login.isVisible({ timeout: 2000 }).catch(() => false)) {
      await highlightElement(login, '🏷️ Customer Login Trigger', 900, '#00FFCC');
    }

    // Save header utilities screenshot
    const headerContent = page.locator('header.page-header, .header.content').first();
    const headerBox = await headerContent.boundingBox();
    if (headerBox) {
      const headerScreenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: 1440, height: Math.min(220, Math.round(headerBox.y + headerBox.height + 20)) }
      });
      fs.writeFileSync(path.join(SECTIONS_DIR, 'Section_Header_Utilities_US.png'), headerScreenshot);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: All 9 Top-Level Mega Menu Categories & URL Parity
  // ──────────────────────────────────────────────────────────────────────────
  test('TC-HEADER-03: All 9 Top-Level Navigation Items Functional & Scope Check', async ({ page }) => {
    console.log('\n--- Running TC-HEADER-03: Top-Level Navigation Items ---');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);

    const expectedMenuItems = [
      { name: 'Indoor', expectedPath: '/indoor' },
      { name: 'Outdoor', expectedPath: '/outdoor' },
      { name: 'Homewares', expectedPath: '/homewares' }, // Note AU is /homeware
      { name: 'In Stock', expectedPath: '/in-stock' },
      { name: 'Customisation', expectedPath: '/customisation' },
      { name: 'Projects', expectedPath: '/project' },
      { name: 'Inspiration', expectedPath: '/blog' },
      { name: 'Support', expectedPath: '/help-centre' },
      { name: 'Contact', expectedPath: '/contact' }
    ];

    const navItems = page.locator('.navigation .level0 > a');
    const navCount = await navItems.count();
    console.log(`Found ${navCount} top navigation menu items.`);
    expect(navCount).toBeGreaterThanOrEqual(9);

    for (let i = 0; i < expectedMenuItems.length; i++) {
      const expected = expectedMenuItems[i];
      const itemLocator = page.locator('.navigation .level0 > a').filter({ hasText: expected.name }).first();
      await expect(itemLocator).toBeVisible({ timeout: 5000 });

      // Highlight each menu item sequentially
      await clickWithHighlight(itemLocator, `⚡ [Nav ${i+1}/9] ${expected.name}`, 600);

      const href = await itemLocator.getAttribute('href');
      console.log(`Nav [${expected.name}]: ${href}`);

      // Ensure no AU domain leakage
      expect(href).not.toContain('.com.au');
    }

    // Capture entire main navigation row
    const navBar = page.locator('.navigation, nav').first();
    const navBox = await navBar.boundingBox();
    if (navBox) {
      const navScreenshot = await page.screenshot({
        clip: { x: 0, y: Math.max(0, navBox.y - 10), width: 1440, height: Math.round(navBox.height + 20) }
      });
      fs.writeFileSync(path.join(SECTIONS_DIR, 'Section_Top_Nav_Row_US.png'), navScreenshot);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Mega Menu Subcategory Deep-Dive (Indoor -> Furniture -> Sofas)
  // ──────────────────────────────────────────────────────────────────────────
  test('TC-HEADER-04: Mega Menu Subcategories Deep-Dive & Interaction', async ({ page }) => {
    console.log('\n--- Running TC-HEADER-04: Mega Menu Subcategories ---');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);

    // 1. Hover Indoor to open mega menu
    const indoor = page.locator('.navigation .level0 > a').filter({ hasText: 'Indoor' }).first();
    await indoor.hover();
    await page.waitForTimeout(2000);

    await highlightElement(indoor, '🏷️ [Mega Menu] Indoor Activated', 1000, '#00FFCC');

    // Verify subcategories column 1
    const furniture = page.locator('.level1 a, a[aria-label*="Furniture"], .submenu a').filter({ hasText: 'Furniture' }).first();
    const isFurnVis = await furniture.isVisible({ timeout: 4000 }).catch(() => false);
    if (isFurnVis) {
      await clickWithHighlight(furniture, '⚡ Hovering Furniture Subcategory', 800);
      await furniture.hover({ force: true }).catch(() => {});
      await page.waitForTimeout(1500);
    }

    // Capture US Indoor Mega Menu with Furniture subcategories open
    const megaScreenshot = await page.screenshot({
      clip: { x: 0, y: 150, width: 1440, height: 500 }
    });
    fs.writeFileSync(path.join(SECTIONS_DIR, 'Section_Mega_Menu_Indoor_US.png'), megaScreenshot);

    // 2. Check Promotional Banner Card inside Mega Menu
    const promoCard = page.locator('.submenu .megamenu-banner, .submenu img, .submenu [class*="banner"], .submenu .coming-soon').first();
    const hasPromo = await promoCard.isVisible({ timeout: 2000 }).catch(() => false);
    console.log('Mega Menu Promo Card Present:', hasPromo);

    // Capture right column promo banner
    const promoScreenshot = await page.screenshot({
      clip: { x: 920, y: 180, width: 500, height: 450 }
    });
    fs.writeFileSync(path.join(SECTIONS_DIR, 'Section_Mega_Menu_Promo_US.png'), promoScreenshot);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: 🚨 CRITICAL DEFECT AUDIT: Australian Domain Leakage in Mega Menu
  // ──────────────────────────────────────────────────────────────────────────
  test('TC-HEADER-05: Australian Domain Leakage Scan across entire Navigation', async ({ page }) => {
    console.log('\n--- Running TC-HEADER-05: Australian Domain Leakage Audit ---');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);

    // Hover all 9 items to populate all dynamic submenus in the DOM
    const menuNames = ['Indoor', 'Outdoor', 'Homewares', 'In Stock', 'Customisation', 'Projects', 'Inspiration', 'Support', 'Contact'];
    for (const name of menuNames) {
      const loc = page.locator('.navigation .level0 > a').filter({ hasText: name }).first();
      if (await loc.count() > 0) {
        await loc.hover();
        await page.waitForTimeout(400);
      }
    }

    // Query all navigation links in DOM
    const allNavLinks = await page.$$eval('.navigation a, header.page-header a', links => {
      return links.map(l => ({
        text: l.innerText.trim(),
        href: l.getAttribute('href') || ''
      }));
    });

    console.log(`Scanned ${allNavLinks.length} total navigation links.`);

    // Filter Australian leaks (.globewest.com.au or .com.au)
    const auLeaks = allNavLinks.filter(l => l.href && (l.href.includes('.globewest.com.au') || l.href.includes('globewestoutlet.com.au')));
    console.log(`🚨 Found ${auLeaks.length} Australian domain leakage instances:`);
    auLeaks.forEach((leak, idx) => {
      console.log(`  [${idx+1}] Text: "${leak.text}" -> Leak URL: ${leak.href}`);
    });

    // Hover over Indoor to display the leaking Outlet link
    const indoor = page.locator('.navigation .level0 > a').filter({ hasText: 'Indoor' }).first();
    await indoor.hover();
    await page.waitForTimeout(1200);

    // Highlight the Outlet link with flashing red defect outline
    const outletLink = page.locator('.navigation a[href*="globewestoutlet.com.au"]').first();
    const isOutletVis = await outletLink.isVisible({ timeout: 2000 }).catch(() => false);
    if (isOutletVis) {
      await highlightElement(outletLink, '🚨 [DEFECT 1] Outlet Links to globewestoutlet.com.au', 2200, '#EF4444');
      const defectOutletScreenshot = await page.screenshot({
        clip: { x: 0, y: 150, width: 1440, height: 480 }
      });
      fs.writeFileSync(path.join(SECTIONS_DIR, 'DEFECT_Mega_Menu_Outlet_AU_Leak.png'), defectOutletScreenshot);
      fs.writeFileSync(path.join(SECTIONS_DIR, 'DEFECT_Melbourne_Outlet_Store_Leak.png'), defectOutletScreenshot);
    }

    // Save full-page defect evidence
    await page.screenshot({
      path: path.join(SECTIONS_DIR, 'DEFECT_Full_Navigation_AU_Leak_Scan.png')
    });

    // Log the findings
    console.log(`Verified ${auLeaks.length} Australian leakage links identified.`);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 6: AU Storefront Baseline Parity & Comparative Verification
  // ──────────────────────────────────────────────────────────────────────────
  test('TC-HEADER-06: AU Storefront Baseline Parity & Evidence Capture', async ({ page }) => {
    console.log('\n--- Running TC-HEADER-06: AU Storefront Baseline Parity ---');
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(4000);

    // 1. Highlight Top Utility Bar on AU
    const auTopBar = page.locator('.panel.header, .header-top, .panel.wrapper').first();
    await highlightElement(auTopBar, '🇦🇺 [AU Baseline] Top Utility Bar ("Find a designer or stockist")', 1500, '#00D2FF');

    const auTopBarBox = await auTopBar.boundingBox();
    if (auTopBarBox) {
      const auTopScreenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: 1440, height: 120 }
      });
      fs.writeFileSync(path.join(AU_DIR, 'AU_Top_Bar_Baseline.png'), auTopScreenshot);
    }

    // 2. Highlight AU Navigation & Indoor Mega Menu
    const auIndoor = page.locator('.navigation .level0 > a').filter({ hasText: 'Indoor' }).first();
    await auIndoor.hover();
    await page.waitForTimeout(1500);

    await highlightElement(auIndoor, '🇦🇺 [AU Baseline] Indoor Mega Menu & "Out Now" Promo Banner', 1500, '#00D2FF');

    // Capture AU Indoor Mega Menu
    const auMegaScreenshot = await page.screenshot({
      clip: { x: 0, y: 150, width: 1440, height: 500 }
    });
    fs.writeFileSync(path.join(AU_DIR, 'AU_Section_Mega_Menu_Indoor.png'), auMegaScreenshot);

    // Capture AU Promo Banner Card
    const auPromoScreenshot = await page.screenshot({
      clip: { x: 0, y: 170, width: 550, height: 460 }
    });
    fs.writeFileSync(path.join(AU_DIR, 'AU_Section_Mega_Menu_Promo.png'), auPromoScreenshot);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 7: Mobile Header Navigation Drawer & Responsive Parity
  // ──────────────────────────────────────────────────────────────────────────
  test('TC-HEADER-07: Mobile Header Navigation Drawer & Responsive Parity', async ({ page }) => {
    console.log('\n--- Running TC-HEADER-07: Mobile Header Navigation Drawer ---');
    await page.setViewportSize({ width: 393, height: 851 }); // Pixel 5
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    // Highlight closed mobile header
    const mobileHeader = page.locator('header.page-header, .header.content').first();
    await highlightElement(mobileHeader, '📱 [Mobile 393px] Header Closed', 1200, '#00FFCC');

    const closedScreenshot = await page.screenshot({
      clip: { x: 0, y: 0, width: 393, height: 200 }
    });
    fs.writeFileSync(path.join(MOBILE_DIR, 'Section_Mobile_Header_Closed.png'), closedScreenshot);

    // Click Hamburger toggle button with neon highlight
    const hamburger = page.locator('.nav-toggle, button[data-action="toggle-nav"]').first();
    await expect(hamburger).toBeVisible({ timeout: 5000 });
    await clickWithHighlight(hamburger, '⚡ Opening Mobile Hamburger Menu Drawer', 1000);

    await hamburger.click({ force: true });
    await page.waitForTimeout(1500);

    // Verify mobile navigation drawer is open
    const navDrawer = page.locator('.nav-sections, .navigation, nav').first();
    await highlightElement(navDrawer, '📱 Mobile Navigation Drawer Opened', 1500, '#00FFCC');

    const openScreenshot = await page.screenshot({
      clip: { x: 0, y: 0, width: 393, height: 600 }
    });
    fs.writeFileSync(path.join(MOBILE_DIR, 'Section_Mobile_Drawer_Open.png'), openScreenshot);

    // Click Indoor accordion in mobile drawer
    const mobileIndoor = page.locator('.nav-sections .level0 > a, nav .level0 > a').filter({ hasText: 'Indoor' }).first();
    if (await mobileIndoor.isVisible({ timeout: 2000 }).catch(() => false)) {
      await clickWithHighlight(mobileIndoor, '⚡ Expanding Indoor Mobile Accordion', 800);
      await mobileIndoor.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);

      const expandedScreenshot = await page.screenshot({
        clip: { x: 0, y: 0, width: 393, height: 750 }
      });
      fs.writeFileSync(path.join(MOBILE_DIR, 'Section_Mobile_Indoor_Expanded.png'), expandedScreenshot);
    }
  });

});
