// @ts-check
const { BasePage } = require('./BasePage');

class SearchPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.searchQueryTitle = page.locator('.page-title-wrapper span.base, h1');
    this.searchResultCount = page.locator('.search.results .amount, .toolbar-number');
    this.autocompletePopup = page.locator('div#search_autocomplete, .searchspring-autocomplete');
    this.autocompleteSuggestions = page.locator('.searchspring-suggestion, #search_autocomplete li');
    this.noResultsMessage = page.locator('.message.notice, .search.results .message');
  }

  /**
   * Check if autocomplete suggestion contains key terms
   */
  async getSuggestionsTexts() {
    await this.autocompletePopup.waitFor({ state: 'visible' });
    return this.autocompleteSuggestions.allTextContents();
  }
}

module.exports = { SearchPage };
