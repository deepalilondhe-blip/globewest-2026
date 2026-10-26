const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/customer_check');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🔍 CHECKING CUSTOMER ACCOUNTS IN MAGENTO ADMIN (READ-ONLY)');
  console.log('   Checking deepali.londhe@overdose.digital status across websites');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    // 1. Authenticate in Admin
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
      console.log('✅ Admin login successful.');
    }

    // 2. Open Customers Grid
    console.log('\nNavigating to Customers > All Customers...');
    const custMenu = page.locator('#menu-magento-customer-customer, a:has-text("CUSTOMERS")').first();
    await custMenu.click();
    await page.waitForTimeout(1000);
    await page.locator('a[href*="customer"]:has-text("All Customers")').first().click();
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(4000);

    // 3. Search for deepali.londhe@overdose.digital
    console.log('Searching for deepali.londhe@overdose.digital in Customers grid...');
    const searchBar = page.locator('input.admin__control-text[placeholder*="Search by keyword"], input[id="fulltext"]').first();
    await searchBar.fill('deepali.londhe@overdose.digital');
    await searchBar.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(4000);

    await page.screenshot({ path: path.join(OUT_DIR, '01_all_customers_search_grid.png') });

    // Extract all rows
    const rowsData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.data-grid tbody tr'));
      return rows.map(r => {
        const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
        return {
          id: cells[1] || '',
          name: cells[2] || '',
          email: cells[3] || cells[4] || '',
          group: cells[4] || cells[5] || '',
          phone: cells[5] || cells[6] || '',
          postcode: cells[6] || cells[7] || '',
          country: cells[7] || cells[8] || '',
          state: cells[8] || cells[9] || '',
          customerSince: cells[9] || cells[10] || '',
          website: cells[10] || cells[11] || '',
          fullText: cells.join(' | ')
        };
      });
    });

    console.log('\n📋 CUSTOMER RECORDS FOUND:');
    rowsData.forEach((r, idx) => {
      console.log(`   [Record ${idx + 1}] ID: ${r.id} | Email: ${r.email} | Full: ${r.fullText}`);
    });

    // 4. Inspect ID 130722 (AU - Main Website)
    console.log('\n🔍 Inspecting Record 130722 (AU / Main Website)...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/customer/index/edit/id/130722/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '02_customer_130722_AU_details.png') });

    const auInfo = await page.evaluate(() => {
      const getText = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText.trim() : 'N/A';
      };
      const entries = Array.from(document.querySelectorAll('.admin__page-section-item, tr, .fieldset > .field'));
      return entries.map(e => e.innerText.trim()).filter(t => t.length > 0 && t.includes(':'));
    });

    // 5. Inspect ID 130725 (USA Website)
    console.log('\n🔍 Inspecting Record 130725 (USA Website)...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/customer/index/edit/id/130725/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '03_customer_130725_USA_details.png') });

    console.log('\n💾 All customer details captured and screens saved to:', OUT_DIR);
    await page.waitForTimeout(3000);
    await browser.close();
  } catch (err) {
    console.error('Error during customer check:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
