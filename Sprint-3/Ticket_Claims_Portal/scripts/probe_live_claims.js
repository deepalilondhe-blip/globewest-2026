const path = require('path');
const fs = require('fs');

const SCRIPTS_DIR = __dirname;
const MODULES_DIR = path.resolve(SCRIPTS_DIR, '../../../GlobeWest 2026/node_modules');
const { chromium } = require(path.join(MODULES_DIR, 'playwright'));

(async () => {
  console.log('🌐 Probing live Claims URL on US and AU staging...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Test US staging /claims
  try {
    const resUs = await page.goto('https://mcstaging2.globewest.com/claims', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`US /claims status: ${resUs.status()}`);
    console.log(`US /claims title: ${await page.title()}`);
    console.log(`US /claims url: ${page.url()}`);
    await page.screenshot({ path: path.join(__dirname, '../screenshots/US_LIVE_CLAIMS_URL_PROBE.png') });
  } catch (e) {
    console.log(`US /claims error: ${e.message}`);
  }

  // Test AU staging /claims
  try {
    const resAu = await page.goto('https://mcstaging2.globewest.com.au/claims', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`AU /claims status: ${resAu.status()}`);
    console.log(`AU /claims title: ${await page.title()}`);
    console.log(`AU /claims url: ${page.url()}`);
    await page.screenshot({ path: path.join(__dirname, '../screenshots/AU_LIVE_CLAIMS_URL_PROBE.png') });
  } catch (e) {
    console.log(`AU /claims error: ${e.message}`);
  }

  await browser.close();
  console.log('🏁 Probe finished!');
})();
