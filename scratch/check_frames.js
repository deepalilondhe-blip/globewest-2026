const { chromium } = require('../GlobeWest 2026/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login');
  await page.waitForTimeout(5000);

  const customersUrl = await page.evaluate(() => document.querySelector('a[href*="/customer/index/index/"]')?.href);
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const searchInput = page.locator('input#fulltext, .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  const editUrl = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="customer/index/edit/id/130725"]'));
    return anchors[0] ? anchors[0].href : null;
  });

  await page.goto(editUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  await page.click('a:has-text("Account Information")');
  await page.waitForTimeout(3000);

  const frames = page.frames();
  console.log('Frame count:', frames.length);
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    console.log('Frame ' + i + ' URL: ' + f.url());
    const selects = await f.evaluate(() => Array.from(document.querySelectorAll('select')).map(s => ({ name: s.name, id: s.id, options: Array.from(s.options).map(o => o.text.trim()) }))).catch(() => []);
    console.log('Selects in Frame ' + i + ':\n', JSON.stringify(selects, null, 2));
  }

  await browser.close();
})();
