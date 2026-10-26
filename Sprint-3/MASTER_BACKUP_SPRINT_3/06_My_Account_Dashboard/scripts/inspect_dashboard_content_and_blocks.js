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

    // 1. Open Customer Account Content Configs and expand "Dashboard Content"
    await page.hover('#menu-magento-backend-stores');
    await page.waitForTimeout(1000);
    const configHref = await page.locator('#menu-magento-backend-stores a[href*="system_config"]').first().getAttribute('href');
    await page.goto(configHref, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const accountConfigsLink = page.locator('a[href*="section/gw_customer_account"]').first();
    const acHref = await accountConfigsLink.getAttribute('href');
    await page.goto(acHref, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Click to open Dashboard Content
    const dashContentSection = page.locator('#gw_customer_account_dashboard_content-head, a:has-text("Dashboard Content"), strong:has-text("Dashboard Content")').first();
    await dashContentSection.click();
    await page.waitForTimeout(1500);

    // Also open Hidden blocks of dashboard
    const hiddenSection = page.locator('#gw_customer_account_dashboard_hide_blocks-head, a:has-text("Hidden blocks of the dashboard"), strong:has-text("Hidden blocks of the dashboard")').first();
    if (await hiddenSection.isVisible().catch(() => false)) {
      await hiddenSection.click();
      await page.waitForTimeout(1000);
    }

    await page.screenshot({ path: path.join(OUT_DIR, '32_dashboard_content_fields.png'), fullPage: false });

    // 2. Open Content > Blocks and click "Clear all"
    await page.hover('#menu-magento-backend-content');
    await page.waitForTimeout(1000);
    const blocksHref = await page.locator('#menu-magento-backend-content a[href*="cms/block"]').first().getAttribute('href');
    await page.goto(blocksHref, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Click "Clear all" button
    const clearAllBtn = page.locator('.action-clear, button:has-text("Clear all"), [data-action="grid-filter-reset"]').first();
    if (await clearAllBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('Clicking Clear all on CMS Blocks grid...');
      await clearAllBtn.click();
      await page.waitForTimeout(4000);
    }

    await page.screenshot({ path: path.join(OUT_DIR, '33_cms_blocks_all_unfiltered.png') });

    // Extract list of all CMS blocks visible on first page
    const blocksList = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.data-grid tbody tr'));
      return rows.map(tr => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
        return {
          id: cells[1] || '',
          title: cells[2] || '',
          identifier: cells[3] || '',
          storeView: cells[4] || '',
          status: cells[5] || ''
        };
      }).filter(r => r.title.length > 0 && !r.title.includes('We couldn\'t find'));
    });

    console.log(`Found ${blocksList.length} unfiltered CMS blocks on page 1:`);
    blocksList.forEach(b => console.log(`  • [${b.identifier}] ${b.title} (${b.storeView})`));

    fs.writeFileSync(path.join(OUT_DIR, 'unfiltered_cms_blocks.json'), JSON.stringify(blocksList, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
