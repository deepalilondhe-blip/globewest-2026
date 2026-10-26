const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Logging into Magento Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  if (await page.locator('#username').isVisible().catch(() => false)) {
    await page.fill('#username', 'deepali.londhe@overdose.digital');
    await page.fill('#login', '2Ho770ZEeX7v');
    await page.click('button.action-login');
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }

  console.log('Navigating to Customers Grid...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/customer/index/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  console.log('Filtering for deepali.londhe@overdose.digital...');
  const searchInput = page.locator('input[data-action="grid-filter-expand"], input.admin__control-text[placeholder="Search by keyword"]').first();
  if (await searchInput.isVisible().catch(() => false)) {
    await searchInput.fill('deepali.londhe@overdose.digital');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
  }

  // Look at rows
  const rows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.data-grid tbody tr')).map(tr => {
      const tds = Array.from(tr.querySelectorAll('td'));
      return tds.map(td => td.innerText.trim());
    });
  });
  console.log('Customer rows found:', rows);

  // Let's find customer 130722 (Main Website)
  const auRow = page.locator('tr:has-text("130722")').first();
  if (await auRow.isVisible().catch(() => false)) {
    console.log('Clicking Customer 130722 (Main Website AU)...');
    const editLink = auRow.locator('a:has-text("Edit"), a').first();
    await editLink.click();
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);

    console.log('Customer 130722 URL:', page.url());

    // Check if there is an "Unlock" button
    const unlockBtn = page.locator('button#unlock, button:has-text("Unlock")').first();
    const isLocked = await unlockBtn.isVisible().catch(() => false);
    console.log('Is Unlock button visible?:', isLocked);

    if (isLocked) {
      console.log('Account is temporarily locked by Magento! Clicking Unlock...');
      await unlockBtn.click();
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('Account unlocked!');
    }

    // Check customer info / group
    const group = await page.locator('#customer_group_id, select[name="customer[group_id]"]').inputValue().catch(() => 'unknown');
    console.log('Customer group ID:', group);
  }

  await page.screenshot({ path: 'Sprint-3/Ticket_41794534_Mega_Menu/screenshots/customer_130722_admin.png' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
