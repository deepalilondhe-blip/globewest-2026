// @ts-check
const { BasePage } = require('./BasePage');

class USStorefrontPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // US Storefront Header & Navigation
    this.headerLogo = page.locator('a.logo, .header.content .logo a');
    this.mainNavigation = page.locator('nav.navigation, .navigation[role="navigation"]');
    this.navItems = page.locator('nav.navigation li, .navigation a.level-top');
    this.searchBar = page.locator('input#search, input[name="q"]');
    this.minicartTrigger = page.locator('[data-block="minicart"], a.action.showcart');
    this.userAccountLink = page.locator('header .header.links, a:has-text("Sign In"), a:has-text("Log In")');

    // US Storefront Public Browsing & Price Display
    this.productCards = page.locator('.product-item, .product-item-info');
    this.priceBox = page.locator('.price-box, .price-final_price');
    this.loginForPriceNotice = page.locator('.login-for-price, :has-text("Login for trade pricing"), :has-text("Sign in for pricing")');

    // US Product Detail Page (PDP) Components
    this.productTitle = page.locator('h1.page-title, [data-ui-id="page-title-wrapper"]');
    this.productGallery = page.locator('.fotorama, .product.media, .gallery-placeholder');
    this.swatchOptions = page.locator('.swatch-attribute-options, .swatch-opt');
    this.addToCartButton = page.locator('button#product-addtocart-button, button.tocart');
    this.quantityInput = page.locator('input#qty, input[name="qty"]');

    // US Storefront Footer
    this.footer = page.locator('footer.page-footer, .footer.content');
    this.newsletterInput = page.locator('input#newsletter, input[name="email"]');
    this.newsletterSubmit = page.locator('button.subscribe, button:has-text("Subscribe")');
    this.footerLinks = page.locator('footer.page-footer a');
    this.copyrightText = page.locator('.copyright, small.copyright');

    // Mobile Specific Elements
    this.mobileMenuTrigger = page.locator('.action.nav-toggle, [data-action="toggle-nav"]');
    this.mobileNavDrawer = page.locator('.nav-sections, .navigation.active');
  }

  /**
   * Navigate to a US storefront relative path
   * @param {string} path
   * @param {string} baseURL
   */
  async navigateUS(path = '/', baseURL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com') {
    const targetUrl = path.startsWith('http') ? path : `${baseURL.replace(/\/$/, '')}${path}`;
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    
    // Dismiss common overlays or cookie banners
    try {
      const dismissBtn = this.page.locator('.action-close, #btn-cookie-allow, button.cookie-accept').first();
      if (await dismissBtn.isVisible({ timeout: 1500 })) {
        await dismissBtn.click();
      }
    } catch (_) {}
  }
}

module.exports = { USStorefrontPage };
