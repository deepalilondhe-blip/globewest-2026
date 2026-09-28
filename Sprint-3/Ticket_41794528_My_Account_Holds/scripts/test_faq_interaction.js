const { chromium } = require('playwright');
const path = require('path');

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

  const questions = await page.$$('h3[data-element="question"]');
  console.log('Found FAQ questions:', questions.length);

  // Click Question 1
  await questions[0].click();
  await page.waitForTimeout(1000);
  const q1Expanded = await questions[0].getAttribute('aria-expanded');
  const panel1Display = await page.evaluate(() => document.querySelectorAll('div[data-role="content"]')[0].style.display);
  console.log('After clicking Q1 -> aria-expanded:', q1Expanded, 'display:', panel1Display);

  // Click Question 2
  await questions[1].click();
  await page.waitForTimeout(1000);
  const q1ExpandedAfterQ2 = await questions[0].getAttribute('aria-expanded');
  const panel1DisplayAfterQ2 = await page.evaluate(() => document.querySelectorAll('div[data-role="content"]')[0].style.display);
  const q2Expanded = await questions[1].getAttribute('aria-expanded');
  const panel2Display = await page.evaluate(() => document.querySelectorAll('div[data-role="content"]')[1].style.display);

  console.log('After clicking Q2 -> Q1 aria-expanded:', q1ExpandedAfterQ2, 'panel1 display:', panel1DisplayAfterQ2);
  console.log('After clicking Q2 -> Q2 aria-expanded:', q2Expanded, 'panel2 display:', panel2Display);

  const singleOpenPassed = (panel1DisplayAfterQ2 === 'none' && panel2Display !== 'none');
  console.log('SINGLE OPEN RULE PASSED:', singleOpenPassed);

  await page.screenshot({ path: path.resolve(__dirname, '../screenshots/desktop/04_MY_HOLDS_FAQ_INTERACTION.png') });
  console.log('Saved 04_MY_HOLDS_FAQ_INTERACTION.png!');

  await browser.close();
})();
