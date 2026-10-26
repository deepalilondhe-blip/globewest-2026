const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/customer_cleanup');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';

(async () => {
  console.log('========================================================================');
  console.log('🧹 EXECUTING TARGETED DELETION OF 7 NON-OVERDOSE CUSTOMER ACCOUNTS');
  console.log('   Strict Criteria: Only accounts with @gmail.com or @magnetoitsolutions.com');
  console.log('   Preserved: deepali.londhe@overdose.digital (IDs 130725 and 130722)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log(`💬 Confirming modal dialog: "${dialog.message()}"`);
    await dialog.accept();
  });

  try {
    // 1. Authenticate
    console.log('▶ [Step 1/4] Logging into Magento Admin...');
    await page.goto(ADMIN_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForURL(/admin/, { timeout: 35000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('   ✅ Authenticated.');
    }

    // 2. Navigate via menu to get valid security key
    console.log('\n▶ [Step 2/4] Navigating to Customers > All Customers...');
    const custMenu = page.locator('#menu-magento-customer-customer, a:has-text("CUSTOMERS")').first();
    await custMenu.click();
    await page.waitForTimeout(1000);
    await page.locator('a[href*="customer"]:has-text("All Customers")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(4000);

    // 3. Search for "Deepali"
    console.log('\n▶ [Step 3/4] Searching for "Deepali" in grid...');
    const searchBar = page.locator('input.admin__control-text[placeholder*="Search by keyword"], input[id="fulltext"]').first();
    await searchBar.fill('Deepali');
    await searchBar.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(4000);

    // Locate all customer rows
    const rows = await page.locator('table.data-grid tbody tr').all();
    console.log(`   Found ${rows.length} total rows in search results.`);

    let selectedCount = 0;
    const selectedDetails = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const text = await row.innerText();
      const cells = text.split('\t').map(c => c.trim());
      const customerId = cells[1] || '';
      const email = cells[4] || '';

      // Strict condition: Must NOT contain overdose.digital AND must be one of the non-overdose emails
      if ((email.includes('@gmail.com') || email.includes('@magnetoitsolutions.com')) && !email.includes('overdose.digital')) {
        const checkbox = row.locator('input[type="checkbox"]').first();
        if (await checkbox.isVisible().catch(() => false)) {
          await checkbox.check();
          selectedCount++;
          selectedDetails.push({ id: customerId, email: email });
          console.log(`   ☑️ Selected: ID ${customerId} | Email: ${email}`);
        }
      } else if (email.includes('overdose.digital')) {
        console.log(`   🛡️ PRESERVED (Skipped): ID ${customerId} | Email: ${email}`);
      }
    }

    console.log(`\n   Total accounts selected for deletion: ${selectedCount}`);
    await page.screenshot({ path: path.join(OUT_DIR, '01_selected_for_deletion.png'), fullPage: false });

    if (selectedCount === 0) {
      console.log('   No accounts matched deletion criteria.');
      await browser.close();
      return;
    }

    // 4. Trigger Mass Action -> Delete
    console.log('\n▶ [Step 4/4] Triggering Mass Action "Delete"...');
    // In Magento UI components, massaction dropdown is typically in .action-select-wrap
    const massActionBtn = page.locator('.action-select-wrap button.action-select, button.action-select').first();
    await massActionBtn.click();
    await page.waitForTimeout(800);

    const deleteOption = page.locator('.action-menu-item, .action-select-wrap a, .action-select-wrap li')
      .filter({ hasText: /^Delete$/i })
      .first();

    if (await deleteOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('   Clicking "Delete" in mass action dropdown...');
      await deleteOption.click();
      await page.waitForTimeout(1000);

      // Check for confirmation modal button (OK / Confirm)
      const modalConfirmBtn = page.locator('button.action-primary.action-accept, .modal-popup button:has-text("OK"), .modal-inner button:has-text("OK")').first();
      if (await modalConfirmBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
        console.log('   Confirming deletion modal prompt...');
        await modalConfirmBtn.click();
      }

      await page.waitForLoadState('networkidle', { timeout: 35000 }).catch(() => {});
      await page.waitForTimeout(5000);

      // Check success notification
      const successBox = page.locator('.message-success, .messages .message.success').first();
      if (await successBox.isVisible({ timeout: 5000 }).catch(() => false)) {
        const msg = await successBox.innerText();
        console.log(`\n   🎉 MAGENTO NOTIFICATION: "${msg.trim()}"`);
      }

      await page.screenshot({ path: path.join(OUT_DIR, '02_after_deletion_results.png'), fullPage: false });
    } else {
      console.warn('   ⚠️ Could not find "Delete" option in mass action dropdown.');
    }

    // Verify remaining accounts with "Deepali"
    const remainingRows = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('table.data-grid tbody tr')).map(tr => {
        const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
        return { id: tds[1], name: tds[2], email: tds[4], website: tds[12] };
      }).filter(r => r.id && r.id.length > 0);
    });

    console.log('\n========================================================================');
    console.log('📊 REMAINING CUSTOMER ACCOUNTS FOR "DEEPALI":');
    console.log(JSON.stringify(remainingRows, null, 2));
    console.log('========================================================================\n');

    await page.waitForTimeout(3000);
    await browser.close();
    console.log('Browser closed. Cleanup execution complete.');
  } catch (err) {
    console.error('Error during customer deletion:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
