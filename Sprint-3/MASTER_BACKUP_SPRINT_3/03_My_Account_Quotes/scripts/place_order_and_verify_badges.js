const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/order_placement_verified';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 PLACING ORDER (CONFIRM ORDER WITH #custom_tnc) & CHECKING BADGES');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // -------------------------------------------------------------
    // STEP 1: AUTHENTICATION
    // -------------------------------------------------------------
    console.log('▶ [Step 1/5] Logging in as Trade Customer...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('#email');
    if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      await emailInput.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
      console.log('   ✅ Authenticated.');
    }

    // -------------------------------------------------------------
    // STEP 2: CHECKOUT STEP 1 & 2
    // -------------------------------------------------------------
    console.log('\n▶ [Step 2/5] Navigating to Checkout (/checkout/)...');
    await page.goto('https://mcstaging2.globewest.com/checkout/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Step 1: Order Details
    console.log('   Step 1: Order Details...');
    const phone = page.locator('input[placeholder*="contact"], input[name*="telephone"], input[name*="phone"]').first();
    if (await phone.isVisible().catch(() => false)) await phone.fill('0395181600');
    const po = page.locator('input[placeholder*="reference"], input[name*="reference"]').first();
    if (await po.isVisible().catch(() => false)) await po.fill(`PO-GW-${Date.now()}`);

    const step1Next = page.locator('#order-details button:has-text("NEXT"), button:has-text("NEXT")').first();
    await step1Next.click();
    console.log('   Clicked Step 1 NEXT. Waiting for Step 2...');
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(4000);

    // Step 2: Delivery Details
    console.log('   Step 2: Delivery Details...');
    await page.waitForSelector('.loading-mask, .loader', { state: 'detached', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const step2Next = page.locator('button:has-text("NEXT"):visible').last();
    if (await step2Next.isVisible().catch(() => false)) {
      console.log('   Clicking Step 2 NEXT...');
      await step2Next.click();
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(4000);
    }

    // Step 3: Summary & Confirmation
    console.log('   Step 3: Summary & Confirmation...');
    console.log('   Current URL:', page.url());

    // Explicitly click #custom_tnc
    console.log('   Checking #custom_tnc checkbox...');
    const customTnc = page.locator('#custom_tnc');
    await customTnc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await customTnc.click();
    await page.waitForTimeout(1000);

    const isTncChecked = await customTnc.isChecked();
    console.log('   #custom_tnc is checked:', isTncChecked);
    await page.screenshot({ path: path.join(OUT_DIR, '01_tnc_checked_perfect.png') });

    // Click CONFIRM ORDER
    const confirmOrderBtn = page.locator('button:has-text("CONFIRM ORDER")').first();
    console.log('   🚀 Clicking "CONFIRM ORDER" button...');
    await confirmOrderBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await confirmOrderBtn.click();

    console.log('   Waiting for order placement & success redirect...');
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(10000);

    console.log('   Current URL after confirmation:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '02_order_placement_result.png'), fullPage: true });

    const resultText = await page.evaluate(() => document.body.innerText.substring(0, 800).replace(/\n/g, ' '));
    console.log('   Result Page Text:', resultText);

    // -------------------------------------------------------------
    // STEP 3: NAVIGATE TO MY ORDERS TO CHECK BADGES & ROW DATA
    // -------------------------------------------------------------
    console.log('\n▶ [Step 3/5] Navigating to My Orders (/gw_orders/order/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '03_my_orders_after_order_full.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '04_my_orders_after_order_viewport.png') });

    const sidebarOrders = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item, .account-nav li, .sidebar li'))
        .filter(el => ['Quotes', 'Holds', 'Orders'].some(t => el.innerText.includes(t)));
      return items.map(el => {
        const link = el.querySelector('a');
        const badge = el.querySelector('.badge, .count, [class*="count"]');
        return {
          text: link ? link.innerText.trim().replace(/\n/g, ' ') : el.innerText.trim(),
          badge: badge ? badge.innerText.trim() : 'NONE',
          html: el.outerHTML
        };
      });
    });
    console.log('\n⭐ SIDEBAR BADGES ON MY ORDERS:');
    console.log(JSON.stringify(sidebarOrders, null, 2));

    const ordersTableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
      });
      return { count: rows.length, rows };
    });
    console.log('   My Orders Rows Count:', ordersTableData.count);
    console.log('   My Orders Rows:', ordersTableData.rows);

    // -------------------------------------------------------------
    // STEP 4: NAVIGATE TO MY QUOTES TO CHECK BADGES & ROW DATA
    // -------------------------------------------------------------
    console.log('\n▶ [Step 4/5] Navigating to My Quotes (/gw_quotes/quote/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '05_my_quotes_after_order_full.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '06_my_quotes_after_order_viewport.png') });

    const sidebarQuotes = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item, .account-nav li, .sidebar li'))
        .filter(el => ['Quotes', 'Holds', 'Orders'].some(t => el.innerText.includes(t)));
      return items.map(el => {
        const link = el.querySelector('a');
        const badge = el.querySelector('.badge, .count, [class*="count"]');
        return {
          text: link ? link.innerText.trim().replace(/\n/g, ' ') : el.innerText.trim(),
          badge: badge ? badge.innerText.trim() : 'NONE',
          html: el.outerHTML
        };
      });
    });
    console.log('\n⭐ SIDEBAR BADGES ON MY QUOTES:');
    console.log(JSON.stringify(sidebarQuotes, null, 2));

    const quotesTableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
      });
      return { count: rows.length, rows };
    });
    console.log('   My Quotes Rows Count:', quotesTableData.count);
    console.log('   My Quotes Rows:', quotesTableData.rows);

    // Save final verified state
    fs.writeFileSync(path.resolve(__dirname, '../retest_results/final_order_and_badges_verified.json'), JSON.stringify({
      timestamp: new Date().toISOString(),
      isTncChecked,
      sidebarOrders,
      ordersTableData,
      sidebarQuotes,
      quotesTableData
    }, null, 2));

    await page.waitForTimeout(2000);
    await browser.close();
    console.log('\n========================================================================');
    console.log('✅ TEST EXECUTION COMPLETED!');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Error during order placement:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
