const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  console.log('🚀 Checking Magento Admin CMS Blocks for Stockist Configuration...');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const loginInput = page.locator('input#username, input[name="login[username]"]').first();
  if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('🔑 Logging into Admin...');
    await loginInput.fill('deepali.londhe@overdose.digital');
    await page.fill('input#login, input[name="login[password]"]', '2Ho770ZEeX7v');
    await page.click('button.action-login');
    await page.waitForTimeout(6000);
  }

  console.log('📍 Navigating to Content > Blocks...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/cms/block/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  console.log('🔍 Searching CMS Blocks for "stockist"...');
  const searchInput = page.locator('input.admin__control-text[placeholder*="Search by keyword"], input[id="fulltext"]').first();
  if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchInput.fill('stockist');
    await searchInput.press('Enter');
    await page.waitForTimeout(5000);
  }

  const blocks = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr.data-row'));
    return rows.map(r => {
      const cells = Array.from(r.querySelectorAll('td')).map(c => c.innerText.trim());
      return {
        id: cells[1] || '',
        title: cells[2] || '',
        identifier: cells[3] || '',
        storeView: cells[4] || '',
        status: cells[5] || ''
      };
    });
  });

  console.log('Stockist CMS Blocks found in Admin:');
  console.log(JSON.stringify(blocks, null, 2));

  await browser.close();
})();
