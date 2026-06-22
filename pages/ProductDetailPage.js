// @ts-check
const { BasePage } = require('./BasePage');

class ProductDetailPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.productGallery = page.locator('.product-media-gallery, .gallery-placeholder');
    this.slickSlides = page.locator('.slick-slide');
    this.swiperSlides = page.locator('.swiper-slide');
    this.colorSwatches = page.locator('.swatch-attribute.color .swatch-option');
    this.quantityInput = page.locator('input#qty, .input-text.qty');
    this.qtyIncreaseButton = page.locator('.qty-increment, button.qty-plus');
    this.qtyDecreaseButton = page.locator('.qty-decrement, button.qty-minus');
    this.addToCartButton = page.locator('button#product-addtocart-button');
    this.wishlistButton = page.locator('.action.towishlist');
    this.tabs = page.locator('.product.info.detailed .data.items .title a');
    this.activeTabContent = page.locator('.product.info.detailed .data.items .content[aria-hidden="false"]');
    this.etaDataSpan = page.locator('.eta-date, .eta-shipping');
  }

  /**
   * Select a color swatch by color code/name
   * @param {string} colorOptionId
   */
  async selectColor(colorOptionId) {
    const swatch = this.colorSwatches.locator(`[option-id="${colorOptionId}"], [id*="${colorOptionId}"]`);
    await swatch.click();
  }

  /**
   * Set custom quantity
   * @param {number} qty
   */
  async setQuantity(qty) {
    await this.quantityInput.fill(qty.toString());
  }
}

module.exports = { ProductDetailPage };
