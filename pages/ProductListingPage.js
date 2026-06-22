// @ts-check
const { BasePage } = require('./BasePage');

class ProductListingPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.filterHeader = page.locator('.filter-title, .block-filter-title');
    this.filterOptions = page.locator('.filter-options-item, .filter-options');
    this.sortingSelect = page.locator('select#sorter, .sorter-options');
    this.productGrid = page.locator('.products.grid, .product-items');
    this.productItems = page.locator('.product-item, .product-item-info');
    this.compareButtons = page.locator('.action.tocompare, [data-role="compare-button"]');
    this.paginationLinks = page.locator('.pages-items a, .pagination a');
  }

  /**
   * Get the first product link in the grid
   */
  async getFirstProductLink() {
    return this.productItems.first().locator('a.product-item-link, a.product-photo');
  }

  /**
   * Click a specific filter accordion heading
   * @param {string} filterName
   */
  async toggleFilterGroup(filterName) {
    const filterGroup = this.filterOptions.filter({ hasText: filterName });
    await filterGroup.locator('.filter-options-title').click();
  }
}

module.exports = { ProductListingPage };
