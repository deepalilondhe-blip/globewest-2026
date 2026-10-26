const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/customer_admin');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Logging into Magento Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const loginInput = page.locator('input#username, input[name="login[username]"]').first();
  if (await loginInput.isVisible().catch(() => false)) {
    await loginInput.fill('deepali.londhe@overdose.digital');
    await page.fill('input#login, input[name="login[password]"]', '2Ho770ZEeX7v');
    await page.click('button.action-login');
    await page.waitForURL(/admin/, { timeout: 35000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }

  console.log('Navigating to Customers > All Customers...');
  const custMenu = page.locator('#menu-magento-customer-customer, a:has-text("CUSTOMERS")').first();
  await custMenu.click();
  await page.waitForTimeout(1000);
  await page.locator('a[href*="customer"]:has-text("All Customers")').first().click();
  await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(4000);

  console.log('Searching for "Deepali"...');
  const searchBar = page.locator('input.admin__control-text[placeholder*="Search by keyword"], input[id="fulltext"]').first();
  await searchBar.fill('Deepali');
  await searchBar.press('Enter');
  await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(4000);

  // Take screenshot of grid
  await page.screenshot({ path: path.join(OUT_DIR, '01_deepali_customers_grid.png') });

  // Find 130722 row
  const row130722 = page.locator('tr:has-text("130722")').first();
  if (await row130722.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('Found 130722 (AU)! Clicking Edit...');
    await row130722.locator('a:has-text("Edit")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);

    await page.screenshot({ path: path.join(OUT_DIR, '02_customer_130722_edit_page.png') });

    // Check for Unlock button
    const unlockBtn = page.locator('button#unlock, button:has-text("Unlock")').first();
    const hasUnlock = await unlockBtn.isVisible().catch(() => false);
    console.log('Account locked status (Unlock button visible):', hasUnlock);

    if (hasUnlock) {
      console.log('Unlocking AU customer account...');
      await unlockBtn.click();
      await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('Account successfully unlocked!');
    }

    // Now set password to Deep@123 to ensure it matches US storefront
    console.log('Checking Account Information tab for password reset...');
    const accInfoTab = page.locator('#tab_customer, a:has-text("Account Information")').first();
    if (await accInfoTab.isVisible().catch(() => false)) {
      await accInfoTab.click();
      await page.waitForTimeout(2000);
    }

    const resetPassBtn = page.locator('button#reset_password, button:has-text("Reset Password")').first();
    const newPassInput = page.locator('input[name="customer[new_password]"], input#new_password, input[name="new_password"]').first();
    const changePassCheckbox = page.locator('input#change_password, input[name="change_password"]').first();

    if (await changePassCheckbox.isVisible().catch(() => false)) {
      console.log('Checking change password checkbox...');
      await changePassCheckbox.check();
      await page.waitForTimeout(1000);
    }

    if (await newPassInput.isVisible().catch(() => false)) {
      console.log('Setting AU customer password to Deep@123...');
      await newPassInput.fill('Deep@123');
      await page.waitForTimeout(500);

      const saveBtn = page.locator('button#save, button:has-text("Save Customer")').first();
      await saveBtn.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(4000);
      console.log('AU customer password updated successfully!');
    } else {
      console.log('New password field not directly exposed on form.');
    }
  }

  await page.screenshot({ path: path.join(OUT_DIR, '03_after_save_or_unlock.png') });
  await page.waitForTimeout(3000);
  await browser.close();
})();
