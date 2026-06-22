// @ts-check
const { BasePage } = require('./BasePage');

class StaticPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    // Contact Us selectors
    this.contactNameInput = page.locator('input#name');
    this.contactEmailInput = page.locator('input#email');
    this.contactCommentInput = page.locator('textarea#comment');
    this.contactSubmitButton = page.locator('button.action.submit');

    // Showrooms/CMS selectors
    this.cmsContent = page.locator('.cms-content, .column.main');
    this.showroomAddressCards = page.locator('.showroom-card, .location-item');

    // FAQ Accordion selectors
    this.faqQuestions = page.locator('.faq-trigger, .accordion-title');
    this.faqAnswers = page.locator('.faq-content, .accordion-content');
  }

  /**
   * Fill out the Contact Us form
   */
  async fillContactForm(data) {
    await this.contactNameInput.fill(data.name);
    await this.contactEmailInput.fill(data.email);
    await this.contactCommentInput.fill(data.comment);
  }
}

module.exports = { StaticPage };
