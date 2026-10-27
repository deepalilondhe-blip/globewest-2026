const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/admin_trade_group_test';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Changing Customer 130725 to Trade group...');
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  // 1. Login to Admin
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login, button[type="submit"]');
  await page.waitForTimeout(6000);

  // 2. Direct navigate to All Customers Grid
  const customersUrl = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/customer/index/index/'));
    return link ? link.href : null;
  });
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  // Search deepali.londhe@overdose.digital
  const searchInput = page.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  // Get edit URL for USA Customer (130725)
  const usaCustomer = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr')).filter(r => !r.classList.contains('empty-text') && !r.classList.contains('data-grid-filters'));
    const list = rows.map(r => {
      const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
      const editAnchor = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
      return {
        id: cells[1],
        email: cells[4],
        website: cells[12],
        editUrl: editAnchor ? editAnchor.href : null
      };
    }).filter(c => c.email && c.email.includes('@'));
    return list.find(c => c.id === '130725' || (c.website && c.website.includes('USA'))) || list[0];
  });

  console.log('Target USA Customer:\n', usaCustomer);
  await page.goto(usaCustomer.editUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  // 3. Click "Account Information" tab on the left
  console.log('Clicking "Account Information" tab...');
  const accountTab = page.locator('a:has-text("Account Information"), [data-ui-id*="tab-customer"]').first();
  await accountTab.click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: path.join(OUT_DIR, '01_account_information_tab.png') });

  // Inspect Group dropdown
  const groupOptions = await page.evaluate(() => {
    const sel = document.querySelector('select[name="customer[group_id]"], select[id*="group_id"]');
    if (!sel) return [];
    return Array.from(sel.options).map(opt => ({
      value: opt.value,
      text: opt.text.trim(),
      selected: opt.selected
    }));
  });
  console.log('Group Options inside Account Information:\n', JSON.stringify(groupOptions, null, 2));

  // Find Trade option
  const tradeOpt = groupOptions.find(opt => opt.text.toLowerCase() === 'trade' || opt.text.toLowerCase().includes('trade'));
  if (!tradeOpt) {
    console.error('❌ Trade option not found in dropdown!');
    await browser.close();
    return;
  }

  console.log(`Selecting Trade group: value ${tradeOpt.value} (${tradeOpt.text})...`);
  await page.selectOption('select[name="customer[group_id]"], select[id*="group_id"]', tradeOpt.value);
  await page.waitForTimeout(1000);

  // 4. Click Save Customer
  console.log('Clicking Save Customer...');
  await page.click('#save, button[data-ui-id="save-button"]');
  await page.waitForTimeout(8000);

  console.log('Saved! Admin URL after save:', page.url());
  await page.screenshot({ path: path.join(OUT_DIR, '02_after_save_trade.png') });

  // 5. Search again, open edit, and Click "Login as Customer"
  console.log('Opening customer edit to click Login as Customer...');
  await page.goto(customersUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  await searchInput.fill('deepali.londhe@overdose.digital');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(6000);

  const reEditUrl = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr')).filter(r => !r.classList.contains('empty-text') && !r.classList.contains('data-grid-filters'));
    const list = rows.map(r => {
      const cells = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
      const editAnchor = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
      return {
        id: cells[1],
        email: cells[4],
        group: cells[5],
        website: cells[12],
        editUrl: editAnchor ? editAnchor.href : null
      };
    }).filter(c => c.email && c.email.includes('@'));
    const match = list.find(c => c.id === '130725' || (c.website && c.website.includes('USA'))) || list[0];
    console.log('Re-check match:', match);
    return match ? match.editUrl : null;
  });

  console.log('Navigating to re-edit URL:', reEditUrl);
  await page.goto(reEditUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  // Click "Login as Customer"
  console.log('⚡ Clicking "Login as Customer"...');
  const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);
  await page.click('#login_as_customer, button[data-ui-id="login-as-customer-button"]');
  await page.waitForTimeout(2000);

  const confirmBtn = page.locator('.modal-popup.confirm button.action-primary, button.action-accept, .modal-footer button:has-text("OK")').first();
  if (await confirmBtn.isVisible().catch(() => false)) {
    console.log('Accepting confirmation popup modal...');
    await confirmBtn.click();
  }

  const newPage = await popupPromise;
  const storefrontPage = newPage || page;
  console.log('Waiting for storefront redirect...');
  await storefrontPage.waitForLoadState('load');
  await storefrontPage.waitForTimeout(6000);

  console.log('Storefront URL after Login as Customer:', storefrontPage.url());
  await storefrontPage.screenshot({ path: path.join(OUT_DIR, '03_storefront_landing.png') });

  // 6. Navigate to Leon Side Table PDP
  const pdpUrl = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
  console.log('📍 Navigating to Leon Side Table PDP:', pdpUrl);
  await storefrontPage.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await storefrontPage.waitForTimeout(6000);

  await storefrontPage.screenshot({ path: path.join(OUT_DIR, '04_pdp_trade_price_check.png'), fullPage: true });

  // Detailed PDP Audit
  const auditResult = await storefrontPage.evaluate(() => {
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const prices = Array.from(document.querySelectorAll('.price, [data-price-type], .price-wrapper, .old-price, .special-price')).map(p => ({
      class: p.className,
      text: p.innerText.trim()
    }));

    return {
      url: window.location.href,
      headerContent: document.querySelector('.header.content, .panel.header')?.innerText?.trim(),
      tradePricingToggle: document.querySelector('.pricing-mode-toggle, .trade-pricing-switch, .price-toggle, .utility-trade-toggle')?.innerText?.trim() || 'NOT_FOUND',
      title: document.querySelector('h1')?.innerText?.trim(),
      priceBoxText: priceBox ? priceBox.innerText.trim() : 'NONE',
      detectedPrices: prices,
      hasAddToCart: !!document.querySelector('#product-addtocart-button'),
      addToCartVisible: !!document.querySelector('#product-addtocart-button')?.offsetParent,
      hasAddToQuote: !!Array.from(document.querySelectorAll('button, a')).find(el => el.innerText && el.innerText.toLowerCase().includes('add to quote')),
      stockEta: document.querySelector('.stock.available, .availability, .eta-status')?.innerText?.trim(),
      hasTradeCTA: document.body.innerText.includes('Join Trade Program')
    };
  });

  console.log('\n========================================');
  console.log('TRADE GROUP RE-TEST RESULT:');
  console.log(JSON.stringify(auditResult, null, 2));
  console.log('========================================');

  await browser.close();
  console.log('🏁 Finished!');
})();
