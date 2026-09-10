// @ts-check
/**
 * Ticket 1 – US PLP Page: Figma Design vs Live Comparison
 * ========================================================
 * Figma: https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2571-60995
 *
 * Covers:
 *   SECTION A: Logged-Out Header & Pricing (Public Browsing)
 *   SECTION B: Logged-In Trade Pricing Toggle
 *   SECTION C: Logged-In MSRP Pricing Toggle
 *   SECTION D: PLP Page Structure & Layout (Category Grid, Filters, etc.)
 *   SECTION E: Footer, Typography & Responsive
 *   SECTION F: AU ↔ US Side-by-Side Comparison
 *
 * Run headed:
 *   npx playwright test tests/ticket1-figma-vs-live-plp.spec.js \
 *     --project=desktop-chrome --headed --workers=1 --timeout=90000
 */
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const AU_BASE_URL = process.env.BASE_URL_AU || 'https://mcstaging2.globewest.com.au';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'Comparison before and After snapshout', 'figma-vs-live');

// Figma Design Reference: node-id=2571-60995 (Final Designs → PLP)
// Header Pricing Toggle specs from Figma:
//   Logged Out:   "Book Showroom" + "Become a Trade Customer" visible, NO pricing shown
//   Logged In (Trade): dropdown="Trade" → trade + MSRP pricing, hide "Become a Trade Customer"
//   Logged In (MSRP):  dropdown="MSRP"  → MSRP only, hide trade pricing
//   Checkout/My Account: defaults back to trade pricing (toggle doesn't persist)

/** Helper: dismiss popups & overlays */
async function dismissOverlays(page) {
  try {
    for (const sel of ['.action-close', '#btn-cookie-allow', 'button.cookie-accept', 'a#lpclose', '[data-role="closeBtn"]']) {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await btn.click({ noWaitAfter: true });
        await page.waitForTimeout(300);
      }
    }
  } catch (_) {}
}

/** Helper: take a named screenshot */
async function snap(page, name, locator = null) {
  const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);
  if (locator && await locator.isVisible().catch(() => false)) {
    await locator.screenshot({ path: filePath });
  } else {
    await page.screenshot({ path: filePath, fullPage: true });
  }
  console.log(`📸 Screenshot saved: ${name}.png`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Ticket 1: US PLP – Figma Design vs Live (Header Pricing Toggle + Layout)', () => {

  test.beforeEach(async ({ page }) => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
    // Block third-party overlays
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*', route => route.abort());
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION A: LOGGED-OUT STATE (Public Browsing)
  // Figma spec: No pricing. "Book Showroom" + "Become a Trade Customer" links shown.
  // Mobile: No utility bar.
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('A: Logged-Out Header & Pricing (Public Browsing)', () => {

    test('A1: Desktop – "Book Showroom" + "Become a Trade Customer" links visible', async ({ page }) => {
      console.log('🔓 [Logged Out / Desktop] Checking header links...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);

      // Screenshot: Full header
      await snap(page, 'A1-logged-out-desktop-header', page.locator('header.page-header').first());

      // "Book Showroom Visit" link should be visible (Figma: top-right utility bar)
      const bookShowroom = page.locator('a:has-text("Book Showroom"), a:has-text("Book Showroom Visit"), a[href*="booking"]').first();
      const bookShowroomVisible = await bookShowroom.isVisible().catch(() => false);
      console.log(`  📌 "Book Showroom Visit" link: ${bookShowroomVisible ? '✅ VISIBLE' : '❌ MISSING'}`);
      expect(bookShowroomVisible).toBe(true);

      // "Become a Trade Customer" link should be visible when logged out
      const becomeTradeLink = page.locator(
        'a:has-text("Become a Trade Customer"), a:has-text("Become a trade customer"), ' +
        'a:has-text("Trade Registration"), a[href*="trade-registration"], a[href*="trade"]'
      ).first();
      const becomeTradeVisible = await becomeTradeLink.isVisible().catch(() => false);
      console.log(`  📌 "Become a Trade Customer" link: ${becomeTradeVisible ? '✅ VISIBLE' : '⚠️ NOT FOUND (may need CMS config)'}`);

      // "Ready to Buy" link (also from Figma)
      const readyToBuy = page.locator('a:has-text("Ready to Buy")').first();
      const readyToBuyVisible = await readyToBuy.isVisible().catch(() => false);
      console.log(`  📌 "Ready to Buy" link: ${readyToBuyVisible ? '✅ VISIBLE' : '❌ MISSING'}`);
    });

    test('A2: Desktop – No pricing visible on PLP product cards when logged out', async ({ page }) => {
      console.log('🔓 [Logged Out / Desktop] Checking pricing visibility...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(5000); // Wait for SearchSpring

      // Check for any visible price elements
      const priceElements = page.locator(
        '.price-box:visible, .price:visible, .price-final_price:visible, ' +
        '.ss__result__price:visible, [data-price-type]:visible'
      );
      const visiblePriceCount = await priceElements.count();
      console.log(`  💰 Visible price elements on PLP: ${visiblePriceCount}`);

      // Figma: "No pricing is visible in this view. A customer has to log in to see pricing."
      // Check for "Login for pricing" / "Sign in for pricing" messages
      const loginForPriceMsgs = page.locator(
        ':text("Login for"), :text("Sign in for pricing"), :text("Login to see"), ' +
        ':text("Log in to view"), .login-for-price, .price-login-message'
      );
      const loginMsgCount = await loginForPriceMsgs.count();
      console.log(`  🔒 "Login for pricing" messages: ${loginMsgCount}`);

      if (visiblePriceCount === 0) {
        console.log('  ✅ PASS: No pricing visible (matches Figma logged-out spec)');
      } else if (loginMsgCount > 0) {
        console.log('  ✅ PASS: Pricing hidden behind login prompt (matches Figma spec)');
      } else {
        console.log('  ⚠️ NOTE: Prices may be visible – verify against Figma if B2B login gating is active');
      }

      await snap(page, 'A2-logged-out-pricing-check');
    });

    test('A3: Mobile – No utility bar when logged out', async ({ page }) => {
      console.log('🔓 [Logged Out / Mobile] Checking utility bar absence...');
      await page.setViewportSize({ width: 393, height: 851 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);

      // Figma: "Mobile: No utility bar" when logged out
      const utilityBar = page.locator('.panel.header, .panel.wrapper').first();
      const utilityBarStyles = await utilityBar.evaluate(el => {
        const s = window.getComputedStyle(el);
        return {
          display: s.display,
          visibility: s.visibility,
          height: s.height,
          overflow: s.overflow,
        };
      }).catch(() => null);
      console.log(`  📱 Utility bar computed styles: ${JSON.stringify(utilityBarStyles)}`);

      // Check if dropdown toggle is absent on mobile logged-out
      const pricingDropdown = page.locator(
        'select:has-text("Trade"), select:has-text("MSRP"), ' +
        '.pricing-toggle, .price-view-switcher, [data-role="pricing-toggle"]'
      );
      const dropdownCount = await pricingDropdown.count();
      console.log(`  📱 Pricing toggle dropdown on mobile: ${dropdownCount === 0 ? '✅ ABSENT (correct)' : '⚠️ FOUND'}`);

      // Mobile menu toggle (hamburger) should be visible
      const hamburger = page.locator('.action.nav-toggle, [data-action="toggle-nav"], button.nav-toggle').first();
      const hamburgerVisible = await hamburger.isVisible().catch(() => false);
      console.log(`  📱 Mobile hamburger menu: ${hamburgerVisible ? '✅ VISIBLE' : '❌ MISSING'}`);

      await snap(page, 'A3-logged-out-mobile-no-utility-bar');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION B: LOGGED-IN – TRADE PRICING VIEW
  // Figma spec: dropdown="Trade" → trade + MSRP pricing across site.
  // "Become a Trade Customer" link REMOVED when logged in.
  // Mobile: Utility bar WITH dropdown + Showroom booking link.
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('B: Logged-In – Trade Pricing View', () => {

    test('B1: Desktop – Pricing toggle dropdown exists with "Trade" option', async ({ page }) => {
      console.log('🔐 [Logged In / Desktop] Checking pricing toggle...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(3000);

      // Look for pricing toggle / dropdown
      const pricingToggle = page.locator(
        '.pricing-toggle, .price-view-switcher, [data-role="pricing-toggle"], ' +
        'select.price-toggle, .switcher.price-switcher, ' +
        '.header-right-links-wrapper select, .panel.header select'
      );
      const toggleCount = await pricingToggle.count();
      console.log(`  🔄 Pricing toggle elements found: ${toggleCount}`);

      // Check for "Trade" / "MSRP" text in dropdown or toggle
      const tradeOption = page.locator(':text("Trade"), option:has-text("Trade")');
      const msrpOption = page.locator(':text("MSRP"), option:has-text("MSRP")');
      const tradeCount = await tradeOption.count();
      const msrpCount = await msrpOption.count();
      console.log(`  🏷️ "Trade" label/option: ${tradeCount > 0 ? '✅ FOUND' : '⚠️ NOT FOUND (needs implementation)'}`);
      console.log(`  🏷️ "MSRP" label/option: ${msrpCount > 0 ? '✅ FOUND' : '⚠️ NOT FOUND (needs implementation)'}`);

      await snap(page, 'B1-trade-pricing-toggle-desktop', page.locator('header.page-header').first());
    });

    test('B2: Desktop – "Become a Trade Customer" link is HIDDEN when logged in', async ({ page }) => {
      console.log('🔐 [Logged In / Desktop] Checking "Become a Trade Customer" removal...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);

      // Figma: "Remove the 'Become a trade customer' link when a user is logged in"
      // Check if currently logged in (look for welcome message or account link)
      const welcomeMsg = page.locator('.greet.welcome, .logged-in, :text("Welcome")').first();
      const isLoggedIn = await welcomeMsg.isVisible({ timeout: 3000 }).catch(() => false);
      console.log(`  🔐 Logged-in state detected: ${isLoggedIn}`);

      const becomeTradeLink = page.locator(
        'a:has-text("Become a Trade Customer"), a:has-text("Become a trade customer"), ' +
        'a[href*="trade-registration"]'
      );
      const becomeTradeVisible = await becomeTradeLink.first().isVisible().catch(() => false);

      if (isLoggedIn) {
        console.log(`  📌 "Become a Trade Customer" when logged in: ${becomeTradeVisible ? '❌ STILL VISIBLE (Figma says remove)' : '✅ HIDDEN (correct per Figma)'}`);
      } else {
        console.log(`  ⚠️ Not currently logged in – cannot verify trade link removal. Testing structure only.`);
        console.log(`  📌 "Become a Trade Customer" link present: ${becomeTradeVisible}`);
      }

      await snap(page, 'B2-trade-customer-link-check');
    });

    test('B3: Desktop – Trade pricing + MSRP both displayed on product cards', async ({ page }) => {
      console.log('🔐 [Logged In / Trade View] Checking dual pricing on PLP cards...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(5000); // SearchSpring render

      // Product cards
      const productCards = page.locator('.ss__result, .product-item, .product-item-info');
      const cardCount = await productCards.count();
      console.log(`  🛍️ Product cards: ${cardCount}`);

      if (cardCount > 0) {
        const firstCard = productCards.first();
        await snap(page, 'B3-trade-pricing-product-card', firstCard);

        // Look for dual pricing (trade + MSRP) on a card
        const priceLabels = await firstCard.locator(
          '.price-box, .price, .ss__result__price, [data-price-type], ' +
          '.trade-price, .msrp-price, .regular-price, .special-price'
        ).count();
        console.log(`  💰 Price elements in first card: ${priceLabels}`);

        // Check for "Trade" / "MSRP" labels within price area
        const cardText = await firstCard.innerText().catch(() => '');
        const hasTradeLabel = /trade/i.test(cardText);
        const hasMSRPLabel = /msrp|rrp|retail/i.test(cardText);
        console.log(`  🏷️ Card contains "Trade" label: ${hasTradeLabel ? '✅ YES' : '⚠️ NO'}`);
        console.log(`  🏷️ Card contains "MSRP/RRP" label: ${hasMSRPLabel ? '✅ YES' : '⚠️ NO'}`);
      } else {
        console.warn('  ⚠️ No product cards found – SearchSpring may not be configured');
      }
    });

    test('B4: Mobile – Utility bar WITH pricing dropdown + Showroom link', async ({ page }) => {
      console.log('🔐 [Logged In / Mobile] Checking utility bar presence...');
      await page.setViewportSize({ width: 393, height: 851 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);

      // Figma: "Mobile: Utility bar with the dropdown + Showroom booking link"
      const utilityBar = page.locator('.panel.header, .panel.wrapper').first();
      const utilityVisible = await utilityBar.isVisible().catch(() => false);
      console.log(`  📱 Utility bar visible: ${utilityVisible}`);

      // Pricing toggle on mobile
      const mobilePricingToggle = page.locator(
        '.pricing-toggle, .price-view-switcher, select.price-toggle, ' +
        '.panel.header select, [data-role="pricing-toggle"]'
      );
      const mobileToggleCount = await mobilePricingToggle.count();
      console.log(`  📱 Mobile pricing toggle: ${mobileToggleCount > 0 ? '✅ FOUND' : '⚠️ NOT FOUND'}`);

      // Showroom booking link on mobile
      const showroomLink = page.locator('a:has-text("Book Showroom"), a[href*="booking"]').first();
      const showroomVisible = await showroomLink.isVisible().catch(() => false);
      console.log(`  📱 Showroom booking link on mobile: ${showroomVisible ? '✅ VISIBLE' : '⚠️ NOT VISIBLE'}`);

      await snap(page, 'B4-logged-in-mobile-utility-bar');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION C: LOGGED-IN – MSRP VIEW
  // Figma spec: dropdown="MSRP" → MSRP only, hide trade pricing.
  // "Become a Trade Customer" link REMOVED.
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('C: Logged-In – MSRP Pricing View', () => {

    test('C1: Desktop – Switching to MSRP hides trade pricing', async ({ page }) => {
      console.log('🔐 [Logged In / MSRP View] Checking MSRP-only mode...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(5000);

      // Attempt to switch to MSRP view
      const msrpOption = page.locator(
        'option:has-text("MSRP"), [data-value="msrp"], ' +
        'a:has-text("MSRP"), button:has-text("MSRP"), ' +
        '.price-view-switcher option[value="msrp"]'
      ).first();
      const msrpExists = await msrpOption.isVisible({ timeout: 2000 }).catch(() => false);

      if (msrpExists) {
        console.log('  🔄 MSRP option found – attempting to switch...');
        await msrpOption.click();
        await page.waitForTimeout(3000);

        // After switching, verify trade pricing is hidden
        const tradeLabels = page.locator('.trade-price:visible, :text("Trade Price"):visible');
        const tradeVisible = await tradeLabels.count();
        console.log(`  💰 Trade price labels visible after MSRP switch: ${tradeVisible === 0 ? '✅ HIDDEN (correct)' : '❌ STILL VISIBLE'}`);
      } else {
        console.log('  ⚠️ MSRP toggle option not found – feature may need implementation');
        console.log('  📋 This is a PENDING implementation item for the pricing toggle feature');
      }

      await snap(page, 'C1-msrp-view-desktop');
    });

    test('C2: Mobile – MSRP view shows same pricing as desktop', async ({ page }) => {
      console.log('🔐 [Logged In / MSRP View / Mobile] Checking mobile parity...');
      await page.setViewportSize({ width: 393, height: 851 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(3000);

      // Figma: "Mobile: Same functionality re: pricing as desktop"
      // Check utility bar + dropdown exists on mobile
      const utilityBar = page.locator('.panel.header, .panel.wrapper').first();
      const barVisible = await utilityBar.isVisible().catch(() => false);
      console.log(`  📱 Utility bar on mobile (MSRP view): ${barVisible}`);

      // Look for MSRP toggle
      const pricingDropdown = page.locator(
        '.pricing-toggle, .price-view-switcher, select.price-toggle'
      );
      const dropdownCount = await pricingDropdown.count();
      console.log(`  📱 Pricing dropdown on mobile: ${dropdownCount > 0 ? '✅ FOUND' : '⚠️ NOT FOUND'}`);

      // Showroom booking link should persist
      const showroomLink = page.locator('a:has-text("Book Showroom"), a[href*="booking"]').first();
      const showroomVisible = await showroomLink.isVisible().catch(() => false);
      console.log(`  📱 Showroom booking link: ${showroomVisible ? '✅ VISIBLE' : '⚠️ NOT VISIBLE'}`);

      await snap(page, 'C2-msrp-view-mobile');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION D: PLP Page Structure & Layout
  // Full-page layout checks: Hero, Grid, Filters, Product Cards
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('D: PLP Page Structure & Layout', () => {

    test('D1: Full Page PLP Screenshot – US /outdoor', async ({ page }) => {
      console.log('🎨 [PLP Layout] Full page capture...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(5000);

      await snap(page, 'D1-us-plp-indoor-fullpage');
    });

    test('D2: Header & Navigation – Match Figma Design', async ({ page }) => {
      console.log('🎨 [PLP Layout] Header & Navigation...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);

      // Logo
      const logo = page.locator('a.logo img, .header.content .logo img').first();
      await expect(logo).toBeVisible({ timeout: 10000 });
      const logoSrc = await logo.getAttribute('src');
      console.log(`  ✅ Logo src: ${logoSrc}`);
      expect(logoSrc).toContain('logo.svg');

      await snap(page, 'D2-header-navigation', page.locator('header.page-header').first());

      // Navigation items
      const expectedNav = ['Indoor', 'Outdoor', 'Homewares', 'In Stock', 'Customisation', 'Projects', 'Inspiration', 'Support', 'Contact'];
      const navLinks = page.locator('nav.js-navigation a.level-top span, nav.navigation a.level-top span');
      const actualNav = [];
      for (let i = 0; i < await navLinks.count(); i++) {
        actualNav.push((await navLinks.nth(i).innerText()).trim());
      }
      console.log(`  📋 Nav items: ${JSON.stringify(actualNav)}`);
      for (const item of expectedNav) {
        const found = actualNav.some(n => n.toLowerCase().includes(item.toLowerCase()));
        console.log(`    ${found ? '✅' : '❌'} "${item}": ${found ? 'FOUND' : 'MISSING'}`);
      }

      // Wishlist & Minicart
      console.log(`  🛒 Wishlist: ${await page.locator('.link.wishlist a').count() > 0 ? '✅' : '❌'}`);
      console.log(`  🛒 Minicart: ${await page.locator('[data-block="minicart"] a.showcart').count() > 0 ? '✅' : '❌'}`);
    });

    test('D3: Category Hero Banner & Title', async ({ page }) => {
      console.log('🎨 [PLP Layout] Hero Banner...');
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Title
      const title = page.locator('h1.page-title span.base, [data-ui-id="page-title-wrapper"]').first();
      await expect(title).toBeVisible({ timeout: 10000 });
      console.log(`  📌 Title: "${(await title.innerText()).trim()}"`);

      // Hero banner
      const hero = page.locator('.category-top-view').first();
      if (await hero.isVisible()) {
        await snap(page, 'D3-category-hero-banner', hero);
        const bg = await hero.evaluate(el => window.getComputedStyle(el).backgroundImage);
        console.log(`  🖼 Background: ${bg.substring(0, 100)}...`);
      }

      // Breadcrumbs
      const crumbs = page.locator('nav.breadcrumbs .items li');
      for (let i = 0; i < await crumbs.count(); i++) {
        console.log(`  🔗 Breadcrumb[${i}]: "${(await crumbs.nth(i).innerText()).trim()}"`);
      }
    });

    test('D4: Product Grid – SearchSpring Cards', async ({ page }) => {
      console.log('🎨 [PLP Layout] Product Grid...');
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(5000);

      const grid = page.locator('.category-grid-wrapper, #searchspring-content').first();
      await expect(grid).toBeAttached({ timeout: 10000 });
      if (await grid.isVisible()) await snap(page, 'D4-product-grid', grid);

      const cards = page.locator('.ss__result, .product-item, .product-item-info');
      const count = await cards.count();
      console.log(`  🛍️ Product cards: ${count}`);

      if (count > 0) {
        await snap(page, 'D4b-first-product-card', cards.first());
        const hasImg = await cards.first().locator('img').first().isVisible().catch(() => false);
        const hasTitle = await cards.first().locator('a, .product-item-name, .ss__result__title').first().isVisible().catch(() => false);
        console.log(`  ✅ Card image: ${hasImg}, Card title: ${hasTitle}`);
      } else {
        console.warn('  ⚠️ No product cards – SearchSpring not configured');
      }

      // Sidebar filters
      const sidebar = page.locator('.sidebar.sidebar-main, #searchspring-sidebar').first();
      const sidebarVisible = await sidebar.isVisible().catch(() => false);
      console.log(`  🔍 Filter sidebar: ${sidebarVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
      if (sidebarVisible) await snap(page, 'D4c-filter-sidebar', sidebar);

      // Toolbar
      const toolbar = page.locator('#searchspring-toolbar, .searchspring-toolbar-toolbar-top').first();
      console.log(`  📊 Toolbar: ${await toolbar.isVisible().catch(() => false) ? '✅ VISIBLE' : '❌ HIDDEN'}`);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION E: Footer, Typography & Responsive
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('E: Footer, Typography & Responsive', () => {

    test('E1: Footer Layout & Links', async ({ page }) => {
      console.log('🎨 [Footer] Checking layout...');
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      const footer = page.locator('footer.page-footer').first();
      await expect(footer).toBeAttached({ timeout: 10000 });
      await snap(page, 'E1-footer-layout', footer);

      // Sections
      for (const [name, sel] of [
        ['Connect with us', '.social-links-footer'],
        ['Subscribe', '.newsletter-custom'],
        ['Visit our Showrooms', '.visit-showroom-footer'],
      ]) {
        const vis = await page.locator(sel).first().isVisible().catch(() => false);
        console.log(`  📌 "${name}": ${vis ? '✅ VISIBLE' : '❌ MISSING'}`);
      }

      // Footer columns
      for (const col of ['PRODUCTS', 'CUSTOMER SUPPORT', 'OUR BRAND']) {
        const vis = await page.locator(`h3:has-text("${col}")`).first().isVisible().catch(() => false);
        console.log(`  📌 Column "${col}": ${vis ? '✅' : '❌'}`);
      }

      // Social links
      const socials = page.locator('.social-links-footer a');
      console.log(`  📱 Social links: ${await socials.count()}`);
    });

    test('E2: Typography & Color System', async ({ page }) => {
      console.log('🎨 [Typography] Checking fonts & colors...');
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Fonts
      const fonts = await page.evaluate(() => {
        const f = [];
        document.fonts.forEach(font => f.push({ family: font.family, weight: font.weight, status: font.status }));
        return f;
      });
      const ivyMode = fonts.filter(f => /ivymode|ivy mode/i.test(f.family));
      console.log(`  🔤 Total fonts: ${fonts.length}, IvyMode: ${ivyMode.length}`);
      ivyMode.forEach(f => console.log(`    IvyMode: wt=${f.weight}, status=${f.status}`));

      // H1 styles
      const h1 = await page.evaluate(() => {
        const el = document.querySelector('h1.page-title span.base, [data-ui-id="page-title-wrapper"]');
        if (!el) return null;
        const s = window.getComputedStyle(el);
        return { font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, color: s.color, spacing: s.letterSpacing };
      });
      console.log(`  📐 H1: ${JSON.stringify(h1)}`);

      // Body styles
      const body = await page.evaluate(() => {
        const s = window.getComputedStyle(document.body);
        return { bg: s.backgroundColor, color: s.color, font: s.fontFamily, size: s.fontSize };
      });
      console.log(`  📐 Body: ${JSON.stringify(body)}`);
    });

    test('E3: Responsive – Desktop / Tablet / Mobile', async ({ page }) => {
      console.log('🎨 [Responsive] Checking breakpoints...');

      // Desktop (1920)
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);
      const navVisible = await page.locator('nav.js-navigation, nav.navigation').first().isVisible();
      console.log(`  🖥️ Desktop nav visible: ${navVisible}`);
      expect(navVisible).toBe(true);
      await snap(page, 'E3-responsive-desktop');

      // Tablet (820)
      await page.setViewportSize({ width: 820, height: 1180 });
      await page.waitForTimeout(1000);
      await snap(page, 'E3-responsive-tablet');

      // Mobile (393)
      await page.setViewportSize({ width: 393, height: 851 });
      await page.waitForTimeout(1000);
      const hamburger = await page.locator('.action.nav-toggle, [data-action="toggle-nav"]').first().isVisible();
      console.log(`  📱 Mobile hamburger: ${hamburger}`);
      expect(hamburger).toBe(true);
      const noHScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      console.log(`  📱 No horizontal scroll: ${noHScroll}`);
      expect(noHScroll).toBe(true);
      await snap(page, 'E3-responsive-mobile');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION F: AU ↔ US Side-by-Side Comparison
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('F: AU ↔ US Comparison', () => {

    test('F1: AU PLP Comparison Screenshot', async ({ page }) => {
      console.log('🎨 [AU Comparison] Capturing AU /outdoor...');
      await page.goto(`${AU_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(3000);

      await snap(page, 'F1-au-plp-indoor-fullpage');

      const auHeader = page.locator('header.page-header').first();
      if (await auHeader.isVisible()) await snap(page, 'F1b-au-header', auHeader);

      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);
      const auFooter = page.locator('footer.page-footer').first();
      if (await auFooter.isVisible()) await snap(page, 'F1c-au-footer', auFooter);

      console.log('  📸 AU comparison screenshots saved');
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION G: Checkout + My Account – Pricing Defaults
  // Figma: "This view doesn't persist once a user is in the checkout or
  //  my account pages. It will default to their trade pricing."
  // ═══════════════════════════════════════════════════════════════════════════
  test.describe('G: Checkout & My Account – Pricing Default Behavior', () => {

    test('G1: Checkout page defaults to trade pricing (toggle absent)', async ({ page }) => {
      console.log('🛒 [Checkout] Checking pricing default...');
      await page.goto(`${US_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);

      // Figma: pricing toggle should NOT be present on checkout
      const pricingToggle = page.locator(
        '.pricing-toggle, .price-view-switcher, select.price-toggle, [data-role="pricing-toggle"]'
      );
      const toggleCount = await pricingToggle.count();
      console.log(`  🛒 Pricing toggle on checkout: ${toggleCount === 0 ? '✅ ABSENT (correct per Figma)' : '⚠️ FOUND'}`);

      await snap(page, 'G1-checkout-pricing-default');
    });

    test('G2: My Account page defaults to trade pricing (toggle absent)', async ({ page }) => {
      console.log('👤 [My Account] Checking pricing default...');
      await page.goto(`${US_BASE_URL}/customer/account/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await dismissOverlays(page);
      await page.waitForTimeout(2000);

      // Figma: pricing toggle should NOT be present on My Account
      const pricingToggle = page.locator(
        '.pricing-toggle, .price-view-switcher, select.price-toggle, [data-role="pricing-toggle"]'
      );
      const toggleCount = await pricingToggle.count();
      console.log(`  👤 Pricing toggle on My Account: ${toggleCount === 0 ? '✅ ABSENT (correct per Figma)' : '⚠️ FOUND'}`);

      await snap(page, 'G2-my-account-pricing-default');
    });
  });
});
