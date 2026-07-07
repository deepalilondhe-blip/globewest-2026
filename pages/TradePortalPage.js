// @ts-check
const { BasePage } = require('./BasePage');

class TradePortalPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    // Registration form selectors
    this.companyNameInput = page.locator('input#company_name, input[name="company"], input[placeholder="Business Name"]');
    this.abnInput = page.locator('input#abn, input[name="abn"], input[placeholder="ABN"]'); // Australian Business Number field
    this.tradeCategorySelect = page.locator('select#trade_category, select[name="trade_category"], select[name="primary_business_type"]');
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
    
    // Select option on the hidden Select2 dropdown via Javascript evaluation to bypass Select2 hidden styling
    await this.tradeCategorySelect.evaluate((el, category) => {
      const option = Array.from(el.options).find(opt => opt.text.trim().includes(category) || opt.value === category);
      if (option) {
        el.value = option.value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, data.category);

    if (data.website) {
      await this.websiteInput.fill(data.website);
    }
  }
}

module.exports = { TradePortalPage };
