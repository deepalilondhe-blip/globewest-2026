// @ts-check
const { BasePage } = require('./BasePage');

class Homepage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.skipLink = page.locator('a.skip-link, a[href="#main-content"]');
    this.mainContent = page.locator('#main-content, main');
    this.mainNavigation = page.locator('nav.navigation, [role="navigation"]');
    this.searchBar = page.locator('input#search, [name="q"]');
    this.miniCartButton = page.locator('a.showcart, button.action.showcart');
    this.socialLinks = page.locator('.footer .social-icons a, .social-links a');
    this.promoBanner = page.locator('.promo-banner, .banner-item');
    this.freshIdeasSection = page.locator('.fresh-ideas, .ideas-grid');
  }

  async clickSkipLink() {
    await this.page.keyboard.press('Tab'); // Set focus to first element (usually skip link)
    await this.skipLink.click();
  }

  /**
   * @param {string} query
   */
  async searchProduct(query) {
    await this.searchBar.fill(query);
    await this.searchBar.press('Enter');
  }
}

module.exports = { Homepage };
