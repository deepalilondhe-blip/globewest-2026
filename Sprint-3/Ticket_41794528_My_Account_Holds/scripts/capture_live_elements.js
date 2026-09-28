const { chromium } = require('playwright');
const path = require('path');

const COMP_DIR = path.resolve(__dirname, '../comparison');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/');
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  await page.goto('https://mcstaging2.globewest.com/gw_orders/hold/index/');
  await page.waitForTimeout(3000);

  // 1. Table thead or headers
  const thead = await page.$('thead');
  if (thead) {
    await thead.screenshot({ path: path.join(COMP_DIR, 'exact_live_table.png') });
    console.log('Saved exact_live_table.png');
  } else {
    const table = await page.$('table');
    if (table) {
      await table.screenshot({ path: path.join(COMP_DIR, 'exact_live_table.png') });
      console.log('Saved exact_live_table.png (table)');
    }
  }

  // 2. Subtitle: paragraph under My Holds
  const sub = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('p')).find(p => p.innerText && p.innerText.includes('favourite'));
  });
  if (sub && sub.asElement()) {
    await sub.asElement().screenshot({ path: path.join(COMP_DIR, 'exact_live_subtitle.png') });
    console.log('Saved exact_live_subtitle.png');
  }

  await browser.close();
  console.log('Finished capturing table and subtitle!');
})();
