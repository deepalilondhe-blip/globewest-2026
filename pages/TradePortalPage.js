// @ts-check
const { BasePage } = require('./BasePage');

class TradePortalPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    // Registration form selectors
    this.companyNameInput = page.locator('input#company_name, input[name="company"]');
    this.abnInput = page.locator('input#abn, input[name="abn"]'); // Australian Business Number field
    this.tradeCategorySelect = page.locator('select#trade_category, select[name="trade_category"]');
    this.websiteInput = page.locator('input#website, input[name="website"]');
    this.submitApplicationButton = page.locator('button.action.submit, button#submit-trade-app');
    
    // Portal info links
    this.loginPortalLink = page.locator('a[href*="trade/login"], .trade-login-trigger');
    this.pricingGrid = page.locator('.price-box.trade, .trade-price-display');
  }

  /**
   * Submit trade application form
   */
  async fillTradeApplication(data) {
    await this.companyNameInput.fill(data.companyName);
    await this.abnInput.fill(data.abn);
    await this.tradeCategorySelect.selectOption(data.category);
    if (data.website) {
      await this.websiteInput.fill(data.website);
    }
  }
}

module.exports = { TradePortalPage };
