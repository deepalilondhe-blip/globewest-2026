const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/admin_review');
const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Logging into admin...');
    await page.goto(ADMIN_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForTimeout(5000);
    }

    console.log('Clicking Stores menu...');
    const storesMenu = page.locator('#menu-magento-backend-stores, a:has-text("STORES")').first();
    await storesMenu.click();
    await page.waitForTimeout(1500);

    console.log('Clicking Configuration link...');
    const configLink = page.locator('a:has-text("Configuration")').first();
    await configLink.click();
    await page.waitForTimeout(6000);

    console.log('Current URL on config page:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '10_stores_configuration_real.png') });

    // Extract all tabs in configuration
    const tabs = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.admin__page-nav-item, .config-nav-block strong, .config-nav-block a'));
      return items.map(el => el.innerText.trim()).filter(Boolean);
    });

    console.log('Tabs in Stores > Configuration:', tabs);

    // Now check Content > Blocks
    console.log('Clicking Content menu...');
    const contentMenu = page.locator('#menu-magento-backend-content, a:has-text("CONTENT")').first();
    await contentMenu.click();
    await page.waitForTimeout(1500);

    console.log('Clicking Blocks link...');
    const blocksLink = page.locator('a:has-text("Blocks")').first();
    await blocksLink.click();
    await page.waitForTimeout(6000);

    console.log('Current URL on Blocks page:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '11_cms_blocks_real.png') });

    // Extract CMS Block Titles from the grid
    const blockTitles = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('.data-grid tbody tr'));
      return rows.map(tr => {
        const title = tr.querySelector('.data-grid-cell-content, td:nth-child(3)')?.innerText.trim() || '';
        const iden = tr.querySelector('td:nth-child(4)')?.innerText.trim() || '';
        return { title, iden };
      }).filter(r => r.title.length > 0);
    });
    console.log('CMS Blocks Sample:', blockTitles.slice(0, 15));

    // Now check Content > Pages
    await contentMenu.click();
    await page.waitForTimeout(1500);
    const pagesLink = page.locator('a:has-text("Pages")').first();
    await pagesLink.click();
    await page.waitForTimeout(6000);
    await page.screenshot({ path: path.join(OUT_DIR, '12_cms_pages_real.png') });

    // Now check Customers > All Customers
    console.log('Clicking Customers menu...');
    const custMenu = page.locator('#menu-magento-customer-customer, a:has-text("CUSTOMERS")').first();
    await custMenu.click();
    await page.waitForTimeout(1500);
    const allCustLink = page.locator('a:has-text("All Customers")').first();
    await allCustLink.click();
    await page.waitForTimeout(6000);
    await page.screenshot({ path: path.join(OUT_DIR, '13_all_customers_real.png') });

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
