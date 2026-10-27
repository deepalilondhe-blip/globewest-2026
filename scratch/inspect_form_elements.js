const { chromium } = require('../GlobeWest 2026/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login');
  await page.waitForTimeout(5000);

  const customersUrl = await page.evaluate(() => document.querySelector('a[href*="/customer/index/index/"]')?.href);
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const searchInput = page.locator('input#fulltext, .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);

  const editUrl = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr')).filter(r => !r.classList.contains('empty-text') && !r.classList.contains('data-grid-filters'));
    const match = rows.find(r => r.innerText.includes('USA Website') || r.innerText.includes('130725'));
    return match ? match.querySelector('a[href*="customer/index/edit"]')?.href : null;
  });

  console.log('Edit URL:', editUrl);
  await page.goto(editUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  await page.click('a:has-text("Account Information")');
  await page.waitForTimeout(3000);

  const formElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('select, input, [data-form-part]'));
    return elements.map(el => ({
      tag: el.tagName,
      name: el.name,
      id: el.id,
      dataUiId: el.getAttribute('data-ui-id'),
      options: el.tagName === 'SELECT' ? Array.from(el.options).map(o => ({ value: o.value, text: o.text.trim() })) : undefined
    })).filter(el => el.name || el.id);
  });

  console.log('FORM ELEMENTS:', JSON.stringify(formElements.filter(e => e.id.includes('group') || e.name.includes('group') || e.options), null, 2));

  await browser.close();
})();
