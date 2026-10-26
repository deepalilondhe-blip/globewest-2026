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

    // 1. Hover Stores and get Configuration link
    console.log('Getting Configuration URL from Stores submenu...');
    await page.hover('#menu-magento-backend-stores');
    await page.waitForTimeout(1000);
    const configHref = await page.locator('#menu-magento-backend-stores a[href*="system_config"]').first().getAttribute('href');
    console.log('Config URL:', configHref);

    await page.goto(configHref, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '20_stores_configuration_real.png') });

    // Extract all tabs on Stores > Configuration
    const configTabs = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.admin__page-nav-title strong, .config-nav-block strong')).map(el => el.innerText.trim());
      const links = Array.from(document.querySelectorAll('.admin__page-nav-link, .config-nav-block a')).map(el => ({
        text: el.innerText.trim(),
        href: el.href
      })).filter(l => l.text.length > 0);
      return { titles, links };
    });

    console.log('\n--- Stores > Configuration Structure ---');
    console.log('Main Group Titles:', configTabs.titles);
    console.log('Available Sections:');
    configTabs.links.forEach(l => console.log(`  • ${l.text} -> ${l.href}`));

    // 2. Hover Content and get Blocks link
    console.log('\nGetting Blocks URL from Content submenu...');
    await page.hover('#menu-magento-backend-content');
    await page.waitForTimeout(1000);
    const blocksHref = await page.locator('#menu-magento-backend-content a[href*="cms/block"]').first().getAttribute('href');
    console.log('Blocks URL:', blocksHref);

    await page.goto(blocksHref, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '21_cms_blocks_grid.png') });

    // Search for dashboard/account blocks
    const cmsGridRows = await page.evaluate(() => {
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
      }).filter(r => r.title.length > 0);
    });

    console.log('\n--- Sample CMS Blocks in Grid (First 20) ---');
    cmsGridRows.slice(0, 20).forEach(b => console.log(`  • [${b.identifier}] ${b.title} (${b.storeView})`));

    // Save full inspection to JSON
    fs.writeFileSync(path.join(OUT_DIR, 'detailed_admin_structure.json'), JSON.stringify({
      configTabs,
      cmsGridRows
    }, null, 2));

    console.log('\n✅ Admin structure inspection finished successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
