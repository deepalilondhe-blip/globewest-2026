const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const AU_BASE_URL = 'https://mcstaging2.globewest.com.au';

(async () => {
  console.log('🚀 Inspecting Live ETA & Stock Status Logic on US Staging (Guest vs Trade)...');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // 1. GUEST STATE (Public Browsing Mode) - PLP (/indoor)
  console.log('\n--- 1. GUEST (LOGGED OUT) ON PLP (/indoor) ---');
  await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const guestPlpEta = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.product-item')).slice(0, 10);
    return cards.map(c => {
      const name = c.querySelector('.product-item-link')?.innerText?.trim() || '';
      const stockBadge = c.querySelector('.stock, .availability, [class*="eta"], [class*="stock"]')?.innerText?.trim() || '';
      const allText = c.innerText.replace(/\n+/g, ' | ');
      // Search for ETA pattern
      const etaMatch = allText.match(/(In Stock|Enquire for ETA|ETA\s*[-–]\s*[\d/]+|Limited Stock[^\s|]*)/i);
      return {
        name,
        stockBadge,
        detectedStatus: etaMatch ? etaMatch[0] : 'None Detected',
        snippet: allText.substring(0, 150)
      };
    });
  });
  console.log('Guest PLP ETA & Stock Statuses:');
  guestPlpEta.forEach((item, idx) => {
    console.log(`[Card ${idx + 1}] "${item.name}": Status -> ${item.detectedStatus}`);
  });

  // 2. GUEST STATE (Public Browsing Mode) - PDP
  console.log('\n--- 2. GUEST (LOGGED OUT) ON PDP ---');
  const firstLink = await page.locator('.product-item-link').first().getAttribute('href');
  console.log('Opening PDP as Guest:', firstLink);
  await page.goto(firstLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const guestPdpEta = await page.evaluate(() => {
    const stockEl = document.querySelector('.stock, .availability, [class*="stock"], [class*="eta"]');
    const allBodyText = document.body.innerText;
    const etaMatch = allBodyText.match(/(In Stock[^\n]*|Enquire for ETA|ETA\s*[-–]\s*[\d/]+|Limited Stock[^\n]*)/i);
    const shipmentMatch = allBodyText.match(/(next incoming shipment|future shipment|arriving\s*[\d/]+|shipment[^\n]*)/i);
    return {
      stockText: stockEl?.innerText?.trim() || 'Not Found',
      detectedStatus: etaMatch ? etaMatch[0] : 'None Detected',
      detectedShipment: shipmentMatch ? shipmentMatch[0] : 'None Detected'
    };
  });
  console.log('Guest PDP Stock & ETA Status:', guestPdpEta);

  // 3. LOGGED-IN TRADE CUSTOMER - PDP
  console.log('\n--- 3. LOGGED-IN TRADE CUSTOMER ON PDP ---');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  const email = page.locator('#email');
  if (await email.isVisible({ timeout: 4000 }).catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }

  await page.goto(firstLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const tradePdpEta = await page.evaluate(() => {
    const stockEl = document.querySelector('.stock, .availability, [class*="stock"], [class*="eta"]');
    const allBodyText = document.body.innerText;
    const etaMatch = allBodyText.match(/(In Stock[^\n]*|Enquire for ETA|ETA\s*[-–]\s*[\d/]+|Limited Stock[^\n]*)/i);
    const shipmentMatch = allBodyText.match(/(next incoming shipment|future shipment|arriving\s*[\d/]+|incoming[^\n]*)/i);
    return {
      stockText: stockEl?.innerText?.trim() || 'Not Found',
      detectedStatus: etaMatch ? etaMatch[0] : 'None Detected',
      detectedShipment: shipmentMatch ? shipmentMatch[0] : 'None Detected'
    };
  });
  console.log('Trade PDP Stock & ETA Status:', tradePdpEta);

  // 4. CHECK AU BASELINE ON PDP FOR COMPARISON
  console.log('\n--- 4. CHECKING AU BASELINE FOR COMPARISON ---');
  await page.goto(`${AU_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const auLink = await page.locator('.product-item-link').first().getAttribute('href');
  await page.goto(auLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const auPdpEta = await page.evaluate(() => {
    const stockEl = document.querySelector('.stock, .availability, [class*="stock"], [class*="eta"]');
    const allBodyText = document.body.innerText;
    const etaMatch = allBodyText.match(/(In Stock[^\n]*|Enquire for ETA|ETA\s*[-–]\s*[\d/]+|Limited Stock[^\n]*)/i);
    return {
      stockText: stockEl?.innerText?.trim() || 'Not Found',
      detectedStatus: etaMatch ? etaMatch[0] : 'None Detected'
    };
  });
  console.log('AU Baseline PDP Stock & ETA Status:', auPdpEta);

  await page.waitForTimeout(3000);
  await browser.close();
  console.log('🏁 Audit Complete.');
})();
