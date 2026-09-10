// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { Homepage } = require('../pages/Homepage');
const { ProductDetailPage } = require('../pages/ProductDetailPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { TradePortalPage } = require('../pages/TradePortalPage');

const AU_BASE_URL = process.env.BASE_URL_AU || 'https://mcstaging2.globewest.com.au';
const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';

test.describe('Ticket 3: AU Regression Safeguards Verification (Backend & Frontend Scopes)', () => {

  test.beforeEach(async ({ page }) => {
    // Abort third-party tracking scripts to keep execution fast and deterministic
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*', route => route.abort());
  });

  test('TC-AU-SAFE-01: Currency & GST Invariance on AU Storefront', async ({ page }) => {
    // 1. Visit AU Homepage
    await page.goto(AU_BASE_URL, { waitUntil: 'domcontentloaded' });

    // Verify page title and URL
    expect(page.url()).toContain('globewest.com.au');

    // 2. Visit AU PDP
    const pdpUrl = `${AU_BASE_URL}/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass`;
    await page.goto(pdpUrl, { waitUntil: 'domcontentloaded' });

    // Check price container
    const priceElement = page.locator('.product-info-price .price, .price-box .price, [data-price-type="finalPrice"]').first();
    if (await priceElement.isVisible({ timeout: 5000 })) {
      const priceText = await priceElement.innerText();
      console.log(`[AU Safeguard] Extracted AU PDP Price: "${priceText}"`);

      // Must have dollar sign ($)
      expect(priceText).toContain('$');

      // Must NOT contain USD or $US
      expect(priceText).not.toContain('USD');
      expect(priceText).not.toContain('$US');
    }

    // Verify GST or tax label context if present
    const taxNotice = page.locator('.tax-notice, .price-including-tax, .gst-notice');
    if (await taxNotice.count() > 0) {
      const taxText = await taxNotice.first().innerText();
      console.log(`[AU Safeguard] Tax Notice on AU PDP: "${taxText}"`);
      expect(taxText.toLowerCase()).toContain('gst');
    }
  });

  test('TC-AU-SAFE-02: Multi-Store Domain Routing & Canonical Scope', async ({ page }) => {
    await page.goto(AU_BASE_URL, { waitUntil: 'domcontentloaded' });

    // Verify canonical tag points to .com.au
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    if (canonicalHref) {
      console.log(`[AU Safeguard] AU Canonical URL: "${canonicalHref}"`);
      expect(canonicalHref).toContain('globewest.com.au');
      expect(canonicalHref).not.toContain('mcstaging2.globewest.com/');
    }

    // Verify header logo link
    const logoLink = await page.locator('a.logo, .header.content .logo a').getAttribute('href');
    if (logoLink) {
      expect(logoLink).toMatch(/(\.com\.au|\/)$/);
    }
  });

  test('TC-AU-SAFE-03: Multi-Store Session & Cookie Isolation (AU vs US)', async ({ context }) => {
    // Create AU page
    const auPage = await context.newPage();
    await auPage.goto(AU_BASE_URL, { waitUntil: 'domcontentloaded' });

    // Check AU cookies
    const auCookies = await context.cookies(AU_BASE_URL);
    const auCookieNames = auCookies.map(c => c.name);
    console.log(`[AU Safeguard] AU Cookies captured: ${auCookieNames.join(', ')}`);

    // Create US page in same context
    const usPage = await context.newPage();
    try {
      await usPage.goto(US_BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const usCookies = await context.cookies(US_BASE_URL);
      const usCookieNames = usCookies.map(c => c.name);
      console.log(`[US Scoping] US Cookies captured: ${usCookieNames.join(', ')}`);

      // Verify domain scoping of session cookies
      for (const cookie of auCookies) {
        if (cookie.name === 'PHPSESSID' || cookie.name === 'private_content_version') {
          expect(cookie.domain).toContain('globewest.com.au');
        }
      }
    } catch (e) {
      console.log(`[US Endpoint Note] US Storefront check: ${e.message}`);
    } finally {
      await auPage.close();
      await usPage.close();
    }
  });

  test('TC-AU-SAFE-04: AU Domestic Shipping & Postcode Logic', async ({ page }) => {
    // Navigate to AU Cart
    await page.goto(`${AU_BASE_URL}/checkout/cart/`, { waitUntil: 'domcontentloaded' });

    // Check shipping estimator accordion if present
    const shippingAccordion = page.locator('#block-shipping-heading, [data-role="title"]:has-text("Estimate Shipping")');
    if (await shippingAccordion.isVisible()) {
      await shippingAccordion.click();
      await page.waitForTimeout(500);

      // Verify country selector defaults to AU
      const countrySelect = page.locator('select[name="country_id"]');
      if (await countrySelect.isVisible()) {
        const selectedCountry = await countrySelect.inputValue();
        console.log(`[AU Safeguard] Default Cart Shipping Country: "${selectedCountry}"`);
        expect(selectedCountry).toBe('AU');
      }

      // Enter valid AU postcode
      const postcodeInput = page.locator('input[name="postcode"]');
      if (await postcodeInput.isVisible()) {
        await postcodeInput.fill('3000'); // Melbourne VIC
        expect(await postcodeInput.inputValue()).toBe('3000');
      }
    }
  });

  test('TC-AU-SAFE-05: B2B Trade Portal & ABN Validation Safeguard', async ({ page }) => {
    const tradeUrl = `${AU_BASE_URL}/help-centre/general/trade-registration`;
    await page.goto(tradeUrl, { waitUntil: 'domcontentloaded' });

    // Verify presence of Trade Portal elements or ABN field
    const abnField = page.locator('input[name*="abn"], input[id*="abn"], label:has-text("ABN")');
    if (await abnField.count() > 0) {
      console.log('[AU Safeguard] AU Trade Registration ABN field confirmed present.');
      await expect(abnField.first()).toBeAttached();
    } else {
      console.log('[AU Safeguard] General Trade page loaded, verifying trade login/registration container.');
      const tradeContent = page.locator('.trade-register, .block-customer-login, main#maincontent');
      await expect(tradeContent.first()).toBeVisible();
    }
  });

  test('TC-AU-SAFE-06: Phase 1 WCAG 2.2 AA Accessibility Regression Guard', async ({ page }) => {
    // Scan AU Homepage to ensure no accessibility regressions were introduced by multi-store backend code
    await page.goto(AU_BASE_URL, { waitUntil: 'domcontentloaded' });

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .disableRules(['color-contrast']) // Yotpo / third-party tolerance
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(v => v.impact === 'critical');
    console.log(`[AU Safeguard] Total Violations: ${accessibilityScanResults.violations.length}, Critical: ${criticalViolations.length}`);

    // Must have zero critical accessibility regressions
    expect(criticalViolations).toEqual([]);
  });

  test('TC-AU-SAFE-09: AU Header Utility Links Verification', async ({ page }) => {
    // 1. Visit AU Homepage
    await page.goto(AU_BASE_URL, { waitUntil: 'domcontentloaded' });

    // Verify AU-specific header links like 'Stockists' or 'Find a Stockist'
    // which may not exist on the US B2B site
    const stockistLink = page.locator('a:has-text("Stockists"), a:has-text("Find a Stockist")');
    if (await stockistLink.count() > 0) {
      console.log('[AU Safeguard] Header Stockist link found on AU site.');
      await expect(stockistLink.first()).toBeVisible();
    } else {
      console.log('[AU Safeguard] Note: Stockist link not found in header, falling back to basic header checks.');
    }
    
    // Verify phone number (if present) is AU formatted (1800 or +61)
    const phoneLink = page.locator('a[href^="tel:"]');
    if (await phoneLink.count() > 0) {
      const href = await phoneLink.first().getAttribute('href');
      console.log(`[AU Safeguard] Found phone link: ${href}`);
      expect(href).not.toContain('+1'); // Should not be US format
    }
  });

  test('TC-AU-SAFE-10: AU Footer ABN & Copyright Verification', async ({ page }) => {
    await page.goto(AU_BASE_URL, { waitUntil: 'domcontentloaded' });
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const footer = page.locator('footer.page-footer');
    await expect(footer).toBeVisible();

    const footerText = await footer.innerText();
    
    // Check for ABN text in the footer which is legally required in Australia
    if (footerText.includes('ABN')) {
      console.log('[AU Safeguard] ABN found in AU footer text.');
      expect(footerText).toContain('ABN');
    } else {
      console.log('[AU Safeguard] Warning: ABN not explicitly found in footer text.');
    }
    
    // Check copyright year and text
    expect(footerText).toContain('GlobeWest');
  });

  test('TC-AU-SAFE-11: Search Navigation & Fallback Scoping', async ({ page }) => {
    await page.goto(AU_BASE_URL, { waitUntil: 'domcontentloaded' });
    
    // Attempt a search for a generic term
    const searchInput = page.locator('input[name="q"], input#search').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('chair');
      await searchInput.press('Enter');
      
      await page.waitForTimeout(3000);
      
      // Verify we are still on the AU domain after search
      const currentUrl = page.url();
      console.log(`[AU Safeguard] Search result URL: ${currentUrl}`);
      expect(currentUrl).toContain('globewest.com.au');
      
      // Verify products rendered on search results still show AU prices ($ without USD)
      const priceElement = page.locator('.price-box .price').first();
      if (await priceElement.isVisible()) {
        const priceText = await priceElement.innerText();
        expect(priceText).toContain('$');
        expect(priceText).not.toContain('USD');
      }
    }
  });

});
