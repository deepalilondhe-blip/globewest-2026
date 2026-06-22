// @ts-check
const { BasePage } = require('./BasePage');

class MyAccountPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    // Login form selectors
    this.loginEmailInput = page.locator('input#email');
    this.loginPasswordInput = page.locator('input#pass');
    this.loginSubmitButton = page.locator('button#send2');
    
    // Dashboard selectors
    this.accountNavigation = page.locator('.block-collapsible-nav, ul.nav.items');
    this.contactInfoBlock = page.locator('.box-information, .box-account-info');
    this.addressBookBlock = page.locator('.box-billing-address, .box-shipping-address');
    this.recentOrdersTable = page.locator('#my-orders-table, .table-order-items');
    
    // Address Edit Selectors
    this.addNewAddressButton = page.locator('button.action.add, a.action.add');
    this.streetInput = page.locator('input#street_1');
    this.cityInput = page.locator('input#city');
    this.postcodeInput = page.locator('input#zip');
    this.telephoneInput = page.locator('input#telephone');
    this.saveAddressButton = page.locator('button.action.save');
  }

  /**
   * Perform login operation
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
  }
}

module.exports = { MyAccountPage };
