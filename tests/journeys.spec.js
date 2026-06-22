// @ts-check
const { test, expect } = require('@playwright/test');
const { Homepage } = require('../pages/Homepage');
const { ProductListingPage } = require('../pages/ProductListingPage');
const { ProductDetailPage } = require('../pages/ProductDetailPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { TradePortalPage } = require('../pages/TradePortalPage');
const { StaticPage } = require('../pages/StaticPage');

test.describe('GlobeWest Core User Journey & State Verification', () => {

  test('Verify skip link shifts keyboard focus to main content', async ({ page }) => {
    const homepage = new Homepage(page);
    await homepage.navigate('/');

    // Wait for skip link to be attached to the DOM
    await expect(homepage.skipLink).toBeAttached();

    // Emulate tab key to focus on skip link
    await page.keyboard.press('Tab');
    await expect(homepage.skipLink).toBeFocused();

    // Click skip link and verify focus shifts to main content
    await homepage.skipLink.click();
    await expect(homepage.mainContent).toBeFocused({ timeout: 5000 });
  });

  test('Verify viewport zoom options allow scalability', async ({ page }) => {
    const homepage = new Homepage(page);
    await homepage.navigate('/');

    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    
    // WCAG 2.2 AA Criteria 1.4.4 checklist
    expect(viewportMeta).not.toContain('user-scalable=no');
    expect(viewportMeta).not.toContain('user-scalable=0');
    expect(viewportMeta).not.toContain('maximum-scale=1');
  });

  test('Verify product swatches and buttons focus outline', async ({ page }) => {
    const pdp = new ProductDetailPage(page);
    await pdp.navigate('/sofas-modulars/3-seater/sofa-name.html');

    // Verify quantity decrease/increase and cart buttons have outlines on focus
    const buttons = [pdp.qtyIncreaseButton, pdp.qtyDecreaseButton, pdp.addToCartButton];
    for (const btn of buttons) {
      if (await btn.isVisible()) {
        await pdp.verifyFocusOutline(btn);
      }
    }
  });

  test('Verify Slick & Swiper carousels list semantics', async ({ page }) => {
    const pdp = new ProductDetailPage(page);
    await pdp.navigate('/sofas-modulars/3-seater/sofa-name.html');

    const slidesCount = await pdp.slickSlides.count();
    if (slidesCount > 0) {
      const parentTag = await pdp.slickSlides.first().evaluate(el => el.parentElement?.tagName.toLowerCase());
      expect(['ul', 'ol', 'menu']).toContain(parentTag);
    }
  });

  test('Verify dynamic state changes announce correctly (aria-expanded)', async ({ page }) => {
    const staticPage = new StaticPage(page);
    await staticPage.navigate('/faqs/');

    const faqTriggers = staticPage.faqQuestions;
    if (await faqTriggers.count() > 0) {
      const firstFaq = faqTriggers.first();
      
      // Initially, it should be closed or have a defined aria-expanded state
      const isExpandedBefore = await firstFaq.getAttribute('aria-expanded');
      expect(['true', 'false', null]).toContain(isExpandedBefore);

      // Trigger click to expand
      await firstFaq.click();
      
      // Assert state changes dynamically
      const isExpandedAfter = await firstFaq.getAttribute('aria-expanded');
      expect(isExpandedAfter).toBe('true');
    }
  });

  test('Verify checkout forms have unique accessible names', async ({ page }) => {
    const checkout = new CheckoutPage(page);
    await checkout.navigate('/checkout/');

    // Assert that standard input fields are connected to labels or have aria-labels
    const fields = [checkout.emailInput, checkout.firstNameInput, checkout.lastNameInput, checkout.telephoneInput];
    for (const field of fields) {
      if (await field.isVisible()) {
        const hasLabel = await field.evaluate(el => {
          const hasId = !!el.id;
          const hasAriaLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
          const hasLabelTag = hasId && !!document.querySelector(`label[for="${el.id}"]`);
          const hasParentLabel = el.closest('label') !== null;
          return hasAriaLabel || hasLabelTag || hasParentLabel;
        });
        expect(hasLabel).toBe(true);
      }
    }
  });

  test('Verify Trade Portal business fields and inputs', async ({ page }) => {
    const tradePortal = new TradePortalPage(page);
    await tradePortal.navigate('/trade-portal-registration/');

    if (await tradePortal.companyNameInput.isVisible()) {
      await tradePortal.fillTradeApplication({
        companyName: 'ACME Furnishings Pty Ltd',
        abn: '12 345 678 910',
        category: 'Interior Designer',
        website: 'https://acmefurnishings.com.au'
      });

      await expect(tradePortal.companyNameInput).toHaveValue('ACME Furnishings Pty Ltd');
      await expect(tradePortal.abnInput).toHaveValue('12 345 678 910');
    }
  });
});
