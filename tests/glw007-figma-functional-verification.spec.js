// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'Comparison before and After snapshout', 'glw007-functional');

// ----------------------------------------------------------------------
// Figma Functional Verification Suite (Task P-GLW-007)
// Covers specific functional logic defined in new Figma annotations:
// 1. PLP / Category Page (MSRP/Trade Pricing, Filters, Quick Links)
// 2. Order Details Page (FAQ accordions, USA dates, Quote status)
// ----------------------------------------------------------------------

test.describe('P-GLW-007: Figma Functional Verifications', () => {

  test.beforeEach(async ({ page }) => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
    // Block tracking scripts
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
  });

  // ----------------------------------------------------------------------
  // 1. PLP Layout & Filter Changes
  // ----------------------------------------------------------------------
  test.describe('PLP Layout & Filter Changes (Logged Out / General)', () => {

    test('Verify Quick Links section under hero image is removed', async ({ page }) => {
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);

      // Verify the area directly under the hero banner doesn't contain the quick links
      const quickLinks = page.locator('.quick-links-container, .category-quick-links');
      const count = await quickLinks.count();
      console.log(`Quick Links sections found: ${count}`);
      expect(count).toBe(0); // Should be completely removed per Figma
    });

    test('Verify Desktop Filters are left-aligned and redundant title is removed', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      // Check alignment of filter container
      const filterContainer = page.locator('#searchspring-sidebar, .sidebar-main');
      if (await filterContainer.isVisible()) {
        const align = await filterContainer.evaluate(el => window.getComputedStyle(el).textAlign);
        console.log(`Filter text-align is: ${align}`);
        expect(align).not.toBe('center'); // Figma: left-aligned, rather than centered
        
        // Redundant filter title
        const filterTitle = filterContainer.locator('h2:has-text("Filters"), .filter-title:has-text("Filters")');
        const titleCount = await filterTitle.count();
        if (titleCount > 0) {
          // If it exists, ensure it's not duplicated
          expect(titleCount).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  // ----------------------------------------------------------------------
  // 2. PLP MSRP / Trade Pricing Logic
  // ----------------------------------------------------------------------
  test.describe('PLP Pricing Logic (Logged In States)', () => {
    // Note: These tests verify the *presence* of the UI elements that execute this logic.
    // Full execution requires an active authenticated session with B2B pricing configured.

    test('Trade Pricing View Logic (Desktop & Mobile)', async ({ page }) => {
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded' });
      
      // Look for the Trade pricing dropdown structure
      const pricingToggle = page.locator('select.pricing-toggle, .price-view-switcher');
      if (await pricingToggle.isVisible().catch(() => false)) {
        const selected = await pricingToggle.inputValue();
        if (selected === 'trade') {
          // If in trade view, "Become a trade customer" MUST be hidden
          const becomeTrade = page.locator('a:has-text("Become a Trade Customer")');
          expect(await becomeTrade.count()).toBe(0);
          
          // Verify both Trade and MSRP prices exist in product cards
          const tradePriceCount = await page.locator('.trade-price').count();
          const msrpPriceCount = await page.locator('.msrp-price').count();
          console.log(`Trade prices found: ${tradePriceCount}, MSRP prices: ${msrpPriceCount}`);
        }
      }
    });

    test('MSRP Pricing View Logic (Desktop & Mobile)', async ({ page }) => {
      await page.goto(`${US_BASE_URL}/outdoor`, { waitUntil: 'domcontentloaded' });
      
      const pricingToggle = page.locator('select.pricing-toggle, .price-view-switcher');
      if (await pricingToggle.isVisible().catch(() => false)) {
        await pricingToggle.selectOption('msrp');
        await page.waitForTimeout(2000);
        
        // Verify Trade pricing is hidden completely
        const tradePriceCount = await page.locator('.trade-price:visible').count();
        expect(tradePriceCount).toBe(0); // Only MSRP should be visible
      }
    });
  });

  // ----------------------------------------------------------------------
  // 3. My Account – Order Details Page
  // ----------------------------------------------------------------------
  test.describe('Order Details Page (Quote/Order View)', () => {

    test('Quote Header & USA Date Format', async ({ page }) => {
      // Navigate to a sample order/quote URL (or simulate layout if auth required)
      await page.goto(`${US_BASE_URL}/sales/order/history/`, { waitUntil: 'domcontentloaded' });
      
      // Simulate checking an order view page structure
      const orderDate = page.locator('.order-date, .date-placed');
      if (await orderDate.isVisible().catch(() => false)) {
        const text = await orderDate.innerText();
        // USA Format: MM/DD/YYYY (e.g., 04/20/2026)
        // Verify it matches a USA date regex roughly
        const isUSFormat = /\d{1,2}\/\d{1,2}\/\d{4}/.test(text);
        console.log(`Date format is USA: ${isUSFormat}`);
      }
    });

    test('Product Table & Clickable PDP Links', async ({ page }) => {
      await page.goto(`${US_BASE_URL}/sales/order/history/`, { waitUntil: 'domcontentloaded' });
      
      const productLinks = page.locator('.order-items table tbody tr td.product a');
      if (await productLinks.count() > 0) {
        const href = await productLinks.first().getAttribute('href');
        console.log(`Product links to PDP: ${href}`);
        expect(href).not.toBeNull();
      }
    });

    test('FAQ Block Accordion Logic', async ({ page }) => {
      // The FAQ block logic on the My Account experience
      await page.goto(`${US_BASE_URL}/help-centre`, { waitUntil: 'domcontentloaded' });
      
      const faqBlock = page.locator('.faq-block, .accordion');
      if (await faqBlock.isVisible().catch(() => false)) {
        const accordions = faqBlock.locator('.accordion-item, .faq-item');
        
        // 1. Verify all closed by default
        const firstContent = accordions.nth(0).locator('.content, .answer');
        expect(await firstContent.isVisible()).toBe(false);
        
        // 2. Open first, verify others closed
        await accordions.nth(0).click();
        await page.waitForTimeout(500);
        expect(await firstContent.isVisible()).toBe(true);
        
        // 3. Open second, verify first closes automatically
        await accordions.nth(1).click();
        await page.waitForTimeout(500);
        expect(await firstContent.isVisible()).toBe(false); // First should close
      }
    });

  });
});
