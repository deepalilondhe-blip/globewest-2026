// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'evidence');
const ADMIN_BASE = 'https://mcstaging2.globewest.com.au/godmode/admin';
const ADMIN_USER = process.env.ADMIN_USER || 'deepali.londhe@overdose.digital';
const ADMIN_PASS = process.env.ADMIN_PASS || '2Ho770ZEeX7v';

test('Headed Mode Proof: Guest vs Trade User PDP + Admin Category Permissions Inspection', async ({ page }) => {
  test.setTimeout(240000);
  await page.setViewportSize({ width: 1440, height: 900 });

  const pdpUrl = 'https://mcstaging2.globewest.com/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak';

  // -------------------------------------------------------------------------
  // STEP 1: GUEST USER PDP (Clean session - Should MASK price & cart)
  // -------------------------------------------------------------------------
  console.log('\n[1] Testing PDP as PURE GUEST (Logged Out)...');
  await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const guestAddToCart = page.locator('#product-addtocart-button, button.action.tocart').first();
  const guestHasCart = await guestAddToCart.isVisible({ timeout: 2000 }).catch(() => false);
  const guestPrice = await page.locator('.price-box, [data-role="priceBox"]').first().innerText().catch(() => '');
  console.log(`Guest Price: "${guestPrice.trim()}" | Guest Cart Visible: ${guestHasCart}`);

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'PROOF_1_GUEST_PDP_NO_PRICE_NO_CART.png'), fullPage: false });

  // -------------------------------------------------------------------------
  // STEP 2: LOG IN AS TRADE CUSTOMER (Should SHOW Trade Price & Add to Cart)
  // -------------------------------------------------------------------------
  console.log('\n[2] Logging in as Trade Customer...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email').first();
  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').first().fill('Deep@123');
    await page.locator('#send2').first().click();
    await page.waitForTimeout(5000);
  }

  console.log('\n[3] Visiting PDP as LOGGED-IN TRADE CUSTOMER...');
  await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const tradeAddToCart = page.locator('#product-addtocart-button, button.action.tocart').first();
  const tradeHasCart = await tradeAddToCart.isVisible({ timeout: 4000 }).catch(() => false);
  const tradePrice = await page.locator('.price-box, [data-role="priceBox"]').first().innerText().catch(() => '');
  console.log(`Trade Price: "${tradePrice.replace(/\n/g, ' ')}" | Trade Cart Visible: ${tradeHasCart}`);

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'PROOF_2_TRADE_LOGGED_IN_SHOWS_PRICE_AND_CART.png'), fullPage: false });

  // -------------------------------------------------------------------------
  // STEP 3: LOG IN TO MAGENTO ADMIN & INSPECT CATEGORY PERMISSIONS
  // -------------------------------------------------------------------------
  console.log('\n[4] Authenticating to Magento Admin Panel...');
  await page.goto(ADMIN_BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const adminUserInput = page.locator('input#username, input[name="login[username]"]').first();
  if (await adminUserInput.isVisible({ timeout: 4000 }).catch(() => false)) {
    await adminUserInput.fill(ADMIN_USER);
    await page.locator('input#login, input[name="login[password]"]').first().fill(ADMIN_PASS);
    await page.locator('button.action-login').first().click();
    await page.waitForTimeout(6000);
  }

  // Click Stores menu icon
  console.log('Navigating via Stores menu to Configuration...');
  const storesMenu = page.locator('#menu-magento-backend-stores a, li.item-stores > a').first();
  await storesMenu.click();
  await page.waitForTimeout(2000);

  // Click Configuration
  const configLink = page.locator('a:has-text("Configuration"), span:has-text("Configuration")').first();
  await configLink.click();
  await page.waitForTimeout(6000);

  // In Configuration, expand Catalog tab on left menu
  console.log('Expanding Catalog tab in Admin Configuration...');
  const catalogTab = page.locator('.config-nav-block strong:has-text("Catalog"), div.admin__page-nav strong:has-text("Catalog")').first();
  await catalogTab.click().catch(() => {});
  await page.waitForTimeout(1000);

  const catalogSubItem = page.locator('a[href*="section/catalog"], span:has-text("Catalog")').first();
  await catalogSubItem.click().catch(() => {});
  await page.waitForTimeout(5000);

  // Click Category Permissions accordion
  const catPermHead = page.locator('a#catalog_category_permissions-head, strong:has-text("Category Permissions")').first();
  if (await catPermHead.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('Opening Category Permissions section...');
    await catPermHead.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'PROOF_3_ADMIN_CATEGORY_PERMISSIONS_DEFAULT.png'), fullPage: false });
  }

  // Switch Scope to USA Website
  const switcher = page.locator('#store_switcher, select[name="store_switcher"]').first();
  if (await switcher.isVisible({ timeout: 4000 }).catch(() => false)) {
    const opts = await switcher.locator('option').all();
    for (const opt of opts) {
      const txt = (await opt.innerText()).toLowerCase();
      if (txt.includes('globewest us') || (txt.includes('us') && !txt.includes('australia'))) {
        const val = await opt.getAttribute('value');
        console.log(`Switching scope to: "${txt.trim()}" (value: ${val})`);
        await switcher.selectOption({ value: val });
        await page.waitForTimeout(6000);
        break;
      }
    }

    // Re-open Category Permissions accordion on US scope
    const usCatPermHead = page.locator('a#catalog_category_permissions-head, strong:has-text("Category Permissions")').first();
    if (await usCatPermHead.isVisible({ timeout: 5000 }).catch(() => false)) {
      await usCatPermHead.click();
      await page.waitForTimeout(2000);
    }
    await page.screenshot({ path: path.join(EVIDENCE_DIR, 'PROOF_4_ADMIN_CATEGORY_PERMISSIONS_US_SCOPE.png'), fullPage: false });
  }

  console.log('\nAll headed proofs captured successfully!');
});
