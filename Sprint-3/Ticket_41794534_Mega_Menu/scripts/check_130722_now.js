const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false, channel: 'chrome', slowMo: 200 });
  const page = await browser.newPage();

  console.log('Logging into Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login');
  await page.waitForURL(/admin/, { timeout: 30000 }).catch(() => {});

  console.log('Viewing customer 130722 edit page...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/customer/index/edit/id/130722/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const personalInfo = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table.admin__table-secondary tr')).map(tr => tr.innerText.trim());
  });
  console.log('Customer 130722 personal info:', personalInfo);

  // Check if there is an Unlock button right now
  const unlockBtn = page.locator('button#unlock').first();
  const isUnlock = await unlockBtn.isVisible().catch(() => false);
  console.log('Is Unlock button visible on 130722?:', isUnlock);

  await page.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/customer_130722_now.png' });
  await browser.close();
})();
