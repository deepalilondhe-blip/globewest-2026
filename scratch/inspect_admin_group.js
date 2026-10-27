const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Login
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login, button[type="submit"]');
  await page.waitForTimeout(6000);

  // Navigate to Customers Grid
  const customersUrl = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/customer/index/index/'));
    return link ? link.href : null;
  });
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // Search
  const searchInput = page.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  // Find row with 130725 and click Edit
  const clicked = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr'));
    for (const r of rows) {
      if (r.innerText.includes('130725') || (r.innerText.includes('deepali.londhe@overdose.digital') && r.innerText.includes('USA'))) {
        const editLink = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
        if (editLink) {
          editLink.click();
          return true;
        }
      }
    }
    return false;
  });

  console.log('Clicked edit link:', clicked);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(6000);

  console.log('Current URL:', page.url());

  // Click Account Information
  await page.locator('a:has-text("Account Information")').first().click();
  await page.waitForTimeout(4000);

  // Inspect the Group dropdown and all inputs/selects in the form
  const details = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('select, input, .admin__control-select')).map(el => ({
      tagName: el.tagName,
      name: el.getAttribute('name'),
      id: el.id,
      className: el.className,
      dataBind: el.getAttribute('data-bind'),
      value: el.value,
      options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text.trim() })) : null
    }));

    // Find the Group label and its corresponding control
    const labels = Array.from(document.querySelectorAll('label, .admin__field-label span'));
    const groupLabel = labels.find(l => l.innerText.trim().startsWith('Group'));
    let groupFieldContainer = null;
    if (groupLabel) {
      groupFieldContainer = groupLabel.closest('.admin__field');
    }

    return {
      inputs,
      groupContainerHTML: groupFieldContainer ? groupFieldContainer.innerHTML : null
    };
  });

  console.log('DETAILS:\n', JSON.stringify(details, null, 2));

  await browser.close();
})();
