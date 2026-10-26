const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome', slowMo: 200 });
  const page = await browser.newPage();

  console.log('Checking recent customer changes in Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login');
  await page.waitForURL(/admin/, { timeout: 30000 }).catch(() => {});

  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/customer/index/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Get first 10 customers sorted by ID descending
  const rows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table.data-grid tbody tr')).slice(0, 10).map(r => {
      const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
      return {
        id: cells[1],
        name: cells[2],
        email: cells[4],
        group: cells[5],
        website: cells[10]
      };
    });
  });

  console.log('Latest customer rows in Admin:', JSON.stringify(rows, null, 2));

  // Check 130722 specifically
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/customer/index/edit/id/130722/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const lockStatus = await page.locator('tr:has-text("Account Lock") td, div:has-text("Account Lock")').allInnerTexts().catch(() => []);
  console.log('Customer 130722 Account Lock text:', lockStatus);

  const unlockVisible = await page.locator('button#unlock').isVisible().catch(() => false);
  console.log('Customer 130722 Unlock button visible?:', unlockVisible);

  await browser.close();
})();
