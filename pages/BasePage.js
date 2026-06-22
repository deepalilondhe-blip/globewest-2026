// @ts-check
const { expect } = require('@playwright/test');

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path relative to the baseURL
   * @param {string} path
   */
  async navigate(path = '/') {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Capture a screenshot for audit evidence
   * @param {string} name
   */
  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  /**
   * Verify an element is visible and has a non-empty focus outline when focused
   * @param {import('@playwright/test').Locator} locator
   */
  async verifyFocusOutline(locator) {
    await locator.focus();
    const outline = await locator.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.outlineStyle !== 'none' && style.outlineWidth !== '0px';
    });
    expect(outline).toBe(true);
  }
}

module.exports = { BasePage };
