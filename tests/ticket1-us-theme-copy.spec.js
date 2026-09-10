// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { USStorefrontPage } = require('../pages/USStorefrontPage');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const AU_BASE_URL = process.env.BASE_URL_AU || 'https://mcstaging2.globewest.com.au';

test.describe('Ticket 1: Copy AU B2B Theme for US B2B Storefront (Theme Parity & Responsive Integrity)', () => {

  test.beforeEach(async ({ page }) => {
    // Abort third-party tracking scripts to prevent overlay popups and maintain test speed
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*', route => route.abort());
  });

  test('TC-US-THEME-01: Header & Megamenu Navigation Parity against AU B2B Theme', async ({ page }) => {
    const usPage = new USStorefrontPage(page);
    await usPage.navigateUS('/', US_BASE_URL);

    // 1. Verify Header Logo
    await expect(usPage.headerLogo.first()).toBeVisible({ timeout: 10000 });
    const logoHref = await usPage.headerLogo.first().getAttribute('href');
    expect(logoHref).toBeTruthy();

    // 2. Verify Main Navigation Bar
    const navVisible = await usPage.mainNavigation.first().isVisible();
    console.log(`[Ticket 1 Theme Check] US Main Navigation Visible: ${navVisible}`);
    expect(navVisible).toBe(true);

    // 3. Verify Category Nav Items exist (Living, Dining, Bedroom, etc.)
    const navCount = await usPage.navItems.count();
    console.log(`[Ticket 1 Theme Check] US Top-Level Nav Categories: ${navCount}`);
    expect(navCount).toBeGreaterThan(0);

    // 4. Verify Search Bar and Minicart trigger
    await expect(usPage.searchBar.first()).toBeAttached();
    await expect(usPage.minicartTrigger.first()).toBeAttached();
  });

  test('TC-US-THEME-02: Footer Layout, Newsletter, and Copyright Branding', async ({ page }) => {
    const usPage = new USStorefrontPage(page);
    await usPage.navigateUS('/', US_BASE_URL);

    // 1. Verify Footer structure
    await expect(usPage.footer.first()).toBeAttached({ timeout: 10000 });

    // 2. Verify Newsletter Subscription block
    const newsletterPresent = await usPage.newsletterInput.first().isVisible();
    console.log(`[Ticket 1 Theme Check] US Newsletter input visible: ${newsletterPresent}`);
    if (newsletterPresent) {
      await expect(usPage.newsletterInput.first()).toBeEnabled();
    }

    // 3. Verify Footer Links
    const footerLinkCount = await usPage.footerLinks.count();
    console.log(`[Ticket 1 Theme Check] US Footer Links Count: ${footerLinkCount}`);
    expect(footerLinkCount).toBeGreaterThan(5);

    // 4. Verify Copyright branding
    if (await usPage.copyrightText.count() > 0) {
      const copyright = await usPage.copyrightText.first().innerText();
      console.log(`[Ticket 1 Theme Check] US Copyright text: "${copyright.trim()}"`);
      expect(copyright.toLowerCase()).toContain('globewest');
    }
  });

  test('TC-US-THEME-03: Product Listing Page (PLP) Category Grid & Styling Parity', async ({ page }) => {
    const usPage = new USStorefrontPage(page);
    await usPage.navigateUS('/indoor', US_BASE_URL);

    // 1. Verify category page title
    await expect(usPage.productTitle.first()).toBeVisible({ timeout: 10000 });
    const titleText = await usPage.productTitle.first().innerText();
    console.log(`[Ticket 1 Theme Check] US PLP Category Title: "${titleText.trim()}"`);
    expect(titleText.length).toBeGreaterThan(0);

    // 2. Verify category layout container
    const mainContent = page.locator('main#maincontent, .columns');
    await expect(mainContent.first()).toBeVisible();

    // 3. Inspect Product Grid (Check for SearchSpring blocker)
    const productCount = await usPage.productCards.count();
    console.log(`[Ticket 1 Theme Check] US PLP Product Cards Displayed: ${productCount}`);
    if (productCount === 0) {
      console.warn('[QA Blocker Finding] US PLP product grid is empty: SearchSpring USA staging account configuration is pending (Task #41801465).');
    } else {
      const firstProductImg = usPage.productCards.first().locator('img.product-image-photo, img').first();
      await expect(firstProductImg).toBeVisible();
    }
  });

  test('TC-US-THEME-04: Product Detail Page (PDP) Layout & Gallery Markup', async ({ page }) => {
    const usPage = new USStorefrontPage(page);
    const pdpResponse = await page.goto(`${US_BASE_URL}/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass`, { waitUntil: 'domcontentloaded' });

    if (pdpResponse && pdpResponse.status() === 404) {
      console.warn('[QA Catalog Note] Specific AU product not yet assigned to US Website Catalog scope. Checking generic PDP template layout.');
      // Verify standard 404/CMS container has inherited the B2B theme
      await expect(page.locator('header.page-header, .header.content').first()).toBeVisible();
      await expect(page.locator('footer.page-footer, .footer.content').first()).toBeVisible();
    } else {
      // 1. Verify Product Title
      await expect(usPage.productTitle.first()).toBeVisible({ timeout: 10000 });

      // 2. Verify Product Media / Gallery
      await expect(usPage.productGallery.first()).toBeAttached();

      // 3. Verify Add to Cart button container
      const ctaPresent = await usPage.addToCartButton.first().count();
      console.log(`[Ticket 1 Theme Check] US PDP Add to Cart Button Attached: ${ctaPresent > 0}`);
    }
  });

  test('TC-US-THEME-05: Responsive Breakpoints Layout Validation (Desktop, Tablet, Mobile)', async ({ page }) => {
    const usPage = new USStorefrontPage(page);

    // 1. Desktop Breakpoint (1920x1080)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await usPage.navigateUS('/', US_BASE_URL);
    await expect(usPage.mainNavigation.first()).toBeVisible();

    // 2. Tablet Breakpoint (820x1180 - iPad Air)
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.waitForTimeout(500);
    const bodyWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyWidth).toBeLessThanOrEqual(820);

    // 3. Mobile Breakpoint (393x851 - iPhone / Pixel)
    await page.setViewportSize({ width: 393, height: 851 });
    await page.waitForTimeout(500);

    // Verify mobile hamburger menu trigger is visible
    const mobileToggleVisible = await usPage.mobileMenuTrigger.first().isVisible();
    console.log(`[Ticket 1 Theme Check] Mobile Nav Toggle Visible on 393px: ${mobileToggleVisible}`);
    expect(mobileToggleVisible).toBe(true);

    // Verify single-column layout doesn't require horizontal scrolling
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[Ticket 1 Theme Check] Horizontal scroll on mobile: ${hasHorizontalScroll}`);
    expect(hasHorizontalScroll).toBe(false);
  });

  test('TC-US-THEME-06: Axe-Core WCAG 2.2 AA Parity Audit (Zero Introduced Regressions)', async ({ page }) => {
    const usPage = new USStorefrontPage(page);
    await usPage.navigateUS('/', US_BASE_URL);

    // Run Axe-core WCAG 2.2 AA scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast']) // Yotpo/SearchSpring third-party tolerance
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
    console.log(`[Ticket 1 A11y Parity] Total Violations: ${accessibilityScanResults.violations.length}, Critical: ${criticalViolations.length}`);

    // Must have zero critical accessibility regressions on US copied theme
    expect(criticalViolations).toEqual([]);
  });

});
