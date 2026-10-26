const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/order_placed_live';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 PLACING TEST ORDER ON GLOBEWEST STAGING (HEADED CHROME MODE)');
  console.log('   Goal: Complete Checkout to populate Orders & verify Blue Count Badges');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 400, // Smooth pacing so user sees every step on screen
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // -----------------------------------------------------------------
    // STEP 1: AUTHENTICATION
    // -----------------------------------------------------------------
    console.log('▶ [Step 1/6] Logging in as Trade Customer...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('#email');
    if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   🔐 Submitting trade credentials (deepali.londhe@overdose.digital)...');
      await emailInput.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2500);
      console.log('   ✅ Successfully logged in.');
    } else {
      console.log('   ℹ️ Already logged in.');
    }

    // -----------------------------------------------------------------
    // STEP 2: CHECKOUT STEP 1 (ORDER DETAILS)
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 2/6] Navigating to Checkout (/checkout/)...');
    await page.goto('https://mcstaging2.globewest.com/checkout/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    console.log('   Filling Step 1: Order Details...');
    const phoneInput = page.locator('input[placeholder*="contact"], input[name*="telephone"], input[name*="phone"]').first();
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill('0395181600');
    }

    const poNumber = `PO-GW-${Date.now().toString().slice(-6)}`;
    const poInput = page.locator('input[placeholder*="reference"], input[name*="reference"], input[placeholder*="purchase"]').first();
    if (await poInput.isVisible().catch(() => false)) {
      console.log(`   Entering Purchase Order Reference: "${poNumber}"...`);
      await poInput.fill(poNumber);
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '01_step1_order_details_filled.png') });

    console.log('   Clicking Step 1 NEXT button...');
    const step1Next = page.locator('#order-details button:has-text("NEXT"), button:has-text("NEXT")').first();
    await step1Next.click();
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(4000);

    // -----------------------------------------------------------------
    // STEP 3: CHECKOUT STEP 2 (DELIVERY DETAILS)
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 3/6] Handling Step 2: Delivery Details...');
    await page.waitForSelector('.loading-mask, .loader', { state: 'detached', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(OUT_DIR, '02_step2_delivery_details.png') });

    const step2Next = page.locator('button:has-text("NEXT"):visible').last();
    if (await step2Next.isVisible().catch(() => false)) {
      console.log('   Clicking Step 2 NEXT button...');
      await step2Next.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await step2Next.click();
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(4000);
    }

    // -----------------------------------------------------------------
    // STEP 4: CHECKOUT STEP 3 (SUMMARY, TERMS & CONFIRM ORDER)
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 4/6] Step 3: Summary, Agreement & Confirm Order...');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '03_step3_summary_view.png') });

    // Check Terms and Conditions
    console.log('   Agreeing to Terms and Conditions (#custom_tnc)...');
    await page.evaluate(() => {
      const tnc = document.getElementById('custom_tnc');
      if (tnc && !tnc.checked) {
        tnc.click();
        tnc.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(1500);

    const isChecked = await page.evaluate(() => {
      const tnc = document.getElementById('custom_tnc');
      return tnc ? tnc.checked : false;
    });
    console.log('   T&C Checkbox Checked Status:', isChecked ? 'YES ✅' : 'NO ❌');
    await page.screenshot({ path: path.join(OUT_DIR, '04_terms_checked.png') });

    // Click CONFIRM ORDER
    console.log('   🚀 Clicking "CONFIRM ORDER" to place the order...');
    const confirmBtn = page.locator('button:has-text("CONFIRM ORDER")').first();
    await confirmBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await confirmBtn.click();

    console.log('   ⏳ Waiting for order processing and order success confirmation...');
    // Wait for redirect to success page
    await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(10000);

    console.log('   Current URL after placing order:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '05_order_success_confirmation.png'), fullPage: true });

    const orderSuccessText = await page.evaluate(() => {
      const main = document.querySelector('.checkout-success, .column.main, main');
      return main ? main.innerText.substring(0, 500).replace(/\n/g, ' ') : document.body.innerText.substring(0, 500).replace(/\n/g, ' ');
    });
    console.log('   🎉 Confirmation Snippet:', orderSuccessText);

    // -----------------------------------------------------------------
    // STEP 5: VERIFY MY ORDERS (/gw_orders/order/index/)
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 5/6] Navigating to My Orders (/gw_orders/order/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '06_my_orders_dashboard_full.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '07_my_orders_dashboard_viewport.png') });

    // Inspect Left Sidebar Badges
    const sidebarOrders = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item, .account-nav li, .sidebar li'))
        .filter(el => ['Quotes', 'Holds', 'Orders'].some(t => el.innerText.includes(t)));
      return items.map(el => {
        const link = el.querySelector('a');
        const badge = el.querySelector('.badge, .count, [class*="count"]');
        return {
          text: link ? link.innerText.trim().replace(/\n/g, ' ') : el.innerText.trim(),
          badge: badge ? badge.innerText.trim() : 'NONE',
          hasBadge: !!badge
        };
      });
    });
    console.log('\n⭐ SIDEBAR BADGES ON MY ORDERS AFTER PLACING ORDER:');
    console.log(JSON.stringify(sidebarOrders, null, 2));

    // Capture sidebar closeup
    const sbOrdersEl = page.locator('.block-collapsible-nav, .account-nav, .sidebar.sidebar-main').first();
    if (await sbOrdersEl.isVisible().catch(() => false)) {
      await sbOrdersEl.screenshot({ path: path.join(OUT_DIR, '08_sidebar_my_orders_closeup.png') });
    }

    // Inspect My Orders Table Rows
    const ordersTable = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
      });
      return { rowCount: rows.length, rows };
    });
    console.log('   My Orders Table Row Count:', ordersTable.rowCount);
    console.log('   My Orders Table Rows:', ordersTable.rows);

    // -----------------------------------------------------------------
    // STEP 6: VERIFY MY QUOTES (/gw_quotes/quote/index/)
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 6/6] Navigating to My Quotes (/gw_quotes/quote/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '09_my_quotes_dashboard_full.png'), fullPage: true });

    const sidebarQuotes = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item, .account-nav li, .sidebar li'))
        .filter(el => ['Quotes', 'Holds', 'Orders'].some(t => el.innerText.includes(t)));
      return items.map(el => {
        const link = el.querySelector('a');
        const badge = el.querySelector('.badge, .count, [class*="count"]');
        return {
          text: link ? link.innerText.trim().replace(/\n/g, ' ') : el.innerText.trim(),
          badge: badge ? badge.innerText.trim() : 'NONE',
          hasBadge: !!badge
        };
      });
    });
    console.log('⭐ SIDEBAR BADGES ON MY QUOTES:');
    console.log(JSON.stringify(sidebarQuotes, null, 2));

    const sbQuotesEl = page.locator('.block-collapsible-nav, .account-nav, .sidebar.sidebar-main').first();
    if (await sbQuotesEl.isVisible().catch(() => false)) {
      await sbQuotesEl.screenshot({ path: path.join(OUT_DIR, '10_sidebar_my_quotes_closeup.png') });
    }

    // Save final JSON result
    const summaryData = {
      timestamp: new Date().toISOString(),
      orderPo: poNumber,
      orderSuccessUrl: page.url(),
      orderSuccessText,
      sidebarOrders,
      ordersTable,
      sidebarQuotes
    };

    fs.writeFileSync(path.resolve(__dirname, '../retest_results/placed_order_results.json'), JSON.stringify(summaryData, null, 2));
    console.log('\n💾 Saved order placement results to retest_results/placed_order_results.json');

    await page.waitForTimeout(3000);
    await browser.close();
    console.log('\n========================================================================');
    console.log('🎉 ORDER PLACEMENT AND DASHBOARD VERIFICATION COMPLETED SUCCESSFULLY!');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Error during order placement flow:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
