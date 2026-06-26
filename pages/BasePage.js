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
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    try {
      // Dismiss welcome newsletter popup if visible
      const welcomePopupCloseBtn = this.page.locator('a#lpclose');
      if (await welcomePopupCloseBtn.isVisible()) {
        await welcomePopupCloseBtn.click();
        await this.page.waitForTimeout(500);
      }
      
      // Dismiss cookie banner if visible
      const cookieAcceptBtn = this.page.locator('#btn-cookie-allow, button.cookie-accept');
      if (await cookieAcceptBtn.isVisible()) {
        await cookieAcceptBtn.click();
        await this.page.waitForTimeout(500);
      }
    } catch (e) {
      console.warn("Popup dismissal failed or timed out:", e.message);
    }
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
