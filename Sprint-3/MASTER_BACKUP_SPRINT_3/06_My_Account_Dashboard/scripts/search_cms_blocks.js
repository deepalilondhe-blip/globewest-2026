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
    if (await loginInput.isVisible().catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForTimeout(5000);
    }

    // Go to Content > Blocks
    console.log('Opening Content > Blocks...');
    await page.hover('#menu-magento-backend-content');
    await page.waitForTimeout(1000);
    const blocksHref = await page.locator('#menu-magento-backend-content a[href*="cms/block"]').first().getAttribute('href');
    await page.goto(blocksHref, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Filter by searching for "dashboard" or "events" or "faq" or "promotion"
    const filters = ['dashboard', 'account', 'claim', 'event', 'promotion', 'faq'];
    const results = {};

    for (const term of filters) {
      console.log(`Searching for "${term}" in CMS Blocks...`);
      // Clear filters button
      const clearBtn = page.locator('button:has-text("Clear all"), button.action-tertiary:has-text("Clear")').first();
      if (await clearBtn.isVisible().catch(() => false)) {
        await clearBtn.click();
        await page.waitForTimeout(3000);
      }

      const searchInput = page.locator('input[name="title"], input.admin__control-text').first();
      if (await searchInput.isVisible().catch(() => false)) {
        await searchInput.fill(term);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(4000);

        const rows = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('table.data-grid tbody tr')).map(tr => {
            const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
            return {
              title: cells[2] || '',
              identifier: cells[3] || '',
              storeView: cells[4] || '',
              status: cells[5] || ''
            };
          }).filter(r => r.title.length > 0 && !r.title.includes('We couldn\'t find any records'));
        });

        results[term] = rows;
        console.log(`Found ${rows.length} blocks for "${term}":`, rows);
      }
    }

    fs.writeFileSync(path.join(OUT_DIR, 'cms_blocks_search_results.json'), JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
