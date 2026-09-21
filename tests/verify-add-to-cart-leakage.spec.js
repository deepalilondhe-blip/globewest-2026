// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'evidence');
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin';
const ADMIN_USER = process.env.ADMIN_USER || 'deepali.londhe@overdose.digital';
const ADMIN_PASS = process.env.ADMIN_PASS || '2Ho770ZEeX7v';

test('Headed Audit: Verify Add to Cart / Price Leakage on PDP & Check Admin Category Permissions', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('\n================================================================');
  console.log('1. AUDITING STOREFRONT PDP AS GUEST (HEADED MODE)');
  console.log('================================================================');

  const pdpUrl = 'https://mcstaging2.globewest.com/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak';
  console.log(`Navigating to: ${pdpUrl}`);
  await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Check Price visibility
  const priceBox = page.locator('.price-box, [data-role="priceBox"], .product-info-price').first();
  const priceText = await priceBox.innerText().catch(() => '');
  console.log(`PDP Price Text: "${priceText.replace(/\n/g, ' ')}"`);

  // Check Add to Cart button visibility
  const addToCartBtn = page.locator('#product-addtocart-button, button.action.tocart, button:has-text("Add to Cart")').first();
  const isAddToCartVisible = await addToCartBtn.isVisible({ timeout: 3000 }).catch(() => false);
  console.log(`\n🚨 CRITICAL FINDING: Add to Cart Button Visible to Guest: ${isAddToCartVisible}`);

  // Highlight and capture evidence
  if (isAddToCartVisible) {
    await addToCartBtn.evaluate(el => {
      el.style.outline = '4px solid #FF0055';
      el.style.boxShadow = '0 0 20px #FF0055';
    });
  }
  if (priceText.includes('$')) {
    await priceBox.evaluate(el => {
      el.style.outline = '4px solid #FF0055';
      el.style.boxShadow = '0 0 20px #FF0055';
    });
  }

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'REALTIME_GUEST_ADD_TO_CART_LEAKAGE.png'), fullPage: false });
  console.log(`Saved screenshot: REALTIME_GUEST_ADD_TO_CART_LEAKAGE.png`);

  console.log('\n================================================================');
  console.log('2. CHECKING MAGENTO ADMIN PANEL CATEGORY PERMISSIONS');
  console.log('================================================================');

  // Admin Login
  await page.goto(ADMIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const loginField = page.locator('input#username, input[name="login[username]"]').first();
  if (await loginField.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.log('Authenticating to Magento Admin Panel...');
    await loginField.fill(ADMIN_USER);
    await page.locator('input#login, input[name="login[password]"]').first().fill(ADMIN_PASS);
    await page.locator('button.action-login, button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Navigate to Category Permissions in Stores > Configuration > Catalog > Catalog
  const catPermUrl = `${ADMIN_URL}/system_config/edit/section/catalog/`;
  console.log(`Navigating to Catalog Configuration: ${catPermUrl}`);
  await page.goto(catPermUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  // Take screenshot of Admin Configuration
  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'ADMIN_CATALOG_CONFIG_DEFAULT.png'), fullPage: false });

  // Look for Category Permissions section tab / accordion
  const permTab = page.locator('a#catalog_category_permissions-head, [data-ui-id="catalog-category-permissions-head"], strong:has-text("Category Permissions")').first();
  if (await permTab.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.log('Clicking Category Permissions accordion in Admin...');
    await permTab.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'ADMIN_CATEGORY_PERMISSIONS_TAB.png'), fullPage: false });
  }

  // Check store switcher scope
  const storeSwitcher = page.locator('select#store_switcher, select[name="store_switcher"]').first();
  if (await storeSwitcher.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('Store Switcher detected. Reading options...');
    const options = await storeSwitcher.locator('option').allInnerTexts();
    console.log('Scopes available:', options.map(o => o.trim()));

    // Switch to US Store / Website
    const usOpt = (await storeSwitcher.locator('option').all()).find(async opt => {
      const txt = (await opt.innerText()).toLowerCase();
      return txt.includes('globewest us') || (txt.includes('us') && !txt.includes('australia'));
    });
    if (usOpt) {
      const val = await usOpt.getAttribute('value');
      console.log(`Switching scope to US Website value: ${val}`);
      await storeSwitcher.selectOption({ value: val });
      await page.waitForTimeout(5000);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, 'ADMIN_US_SCOPE_CATEGORY_PERMISSIONS.png'), fullPage: false });
    }
  }

  console.log('Audit completed!');
});
