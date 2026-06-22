// @ts-check
const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    // Cart/Minicart selectors
    this.cartSummaryItems = page.locator('.cart-summary .product-item');
    this.proceedToCheckoutButton = page.locator('button[data-role="proceed-to-checkout"]');

    // Shipping step selectors
    this.emailInput = page.locator('#customer-email');
    this.firstNameInput = page.locator('input[name="firstname"]');
    this.lastNameInput = page.locator('input[name="lastname"]');
    this.streetAddressInput = page.locator('input[name="street[0]"]');
    this.cityInput = page.locator('input[name="city"]');
    this.postcodeInput = page.locator('input[name="postcode"]');
    this.telephoneInput = page.locator('input[name="telephone"]');
    this.shippingRates = page.locator('.table-checkout-shipping-method input[type="radio"]');
    this.nextButton = page.locator('button.continue.primary');

    // Billing/Payment step selectors
    this.placeOrderButton = page.locator('button.action.primary.checkout');
    this.billingAddressCheckbox = page.locator('input#billing-address-same-as-shipping');

    // Order Success selectors
    this.orderNumber = page.locator('.checkout-success .order-number, p span');
    this.successHeading = page.locator('.page-title-wrapper h1');
  }

  /**
   * Complete shipping details form
   */
  async fillShippingForm(data) {
    await this.emailInput.fill(data.email);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.streetAddressInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.postcodeInput.fill(data.postcode);
    await this.telephoneInput.fill(data.telephone);
  }
}

module.exports = { CheckoutPage };
