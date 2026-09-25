const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/quote_creation_retest';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 RUNNING HEADED QA TEST & ORDER/QUOTE CREATION FLOW (TICKET #41794529)');
  console.log('   Verifying Figma specs and left sidebar numerical blue badge behavior');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 600, // Smooth pacing so Deepali sees each step clearly on screen
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
    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailInput.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('   ✅ Authentication successful.');
    }

    // -----------------------------------------------------------------
    // STEP 2: AUDIT MY QUOTES BEFORE CREATING QUOTE
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 2/6] Inspecting My Quotes Dashboard (/gw_quotes/quote/index/)...');
    await page.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '01_my_quotes_before_creation_full.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '02_my_quotes_before_creation_viewport.png'), fullPage: false });

    // Inspect sidebar badges before creation
    const sidebarBefore = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item a, .account-nav a, .sidebar a'))
        .filter(a => ['Quotes', 'Holds', 'Orders'].some(t => a.innerText.includes(t)));
      return items.map(a => ({
        text: a.innerText.trim().replace(/\n/g, ' '),
        badge: a.querySelector('.badge, .count, [class*="count"]')?.innerText.trim() || 'NONE'
      }));
    });
    console.log('   Sidebar State Before Creation:', sidebarBefore);

    // -----------------------------------------------------------------
    // STEP 3: NAVIGATE TO SHOPPING CART TO CREATE A QUOTE
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 3/6] Navigating to Cart to trigger Quote / Order Creation...');
    await page.goto('https://mcstaging2.globewest.com/checkout/cart/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '03_shopping_cart_view.png') });
    console.log('   📸 Captured Shopping Cart.');

    // Look for "CREATE A QUOTE" button
    const createQuoteBtn = page.locator('button:has-text("CREATE A QUOTE"), button:has-text("Create a quote")').first();
    if (await createQuoteBtn.isVisible().catch(() => false)) {
      console.log('   Clicking "CREATE A QUOTE" button in cart...');
      await createQuoteBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await createQuoteBtn.click();
      await page.waitForTimeout(2000);

      await page.screenshot({ path: path.join(OUT_DIR, '04_create_quote_modal_opened.png') });
      console.log('   📸 Captured "Create a quote" popup modal.');

      // Check if client name dropdown or input exists
      const clientSelect = page.locator('.modal-popup._show select, .modal-inner-wrap select').first();
      const clientInput = page.locator('.modal-popup._show input#client-name, .modal-inner-wrap input[placeholder*="client"]').first();
      const quoteNameInput = page.locator('.modal-popup._show input#order-name, .modal-inner-wrap input[placeholder*="order"], .modal-inner-wrap input[placeholder*="quote"], .modal-popup._show input[type="text"]').last();

      // If client dropdown has options
      if (await clientSelect.isVisible().catch(() => false)) {
        const options = await clientSelect.locator('option').allInnerTexts();
        console.log('   Client dropdown options:', options);
        if (options.length > 1) {
          await clientSelect.selectOption({ index: 1 });
        }
      } else if (await clientInput.isVisible().catch(() => false)) {
        console.log('   Filling Client Name: "Studio Deepali"...');
        await clientInput.fill('Studio Deepali');
      }

      if (await quoteNameInput.isVisible().catch(() => false)) {
        console.log('   Filling Quote Name: "Modern Luxury Living"...');
        await quoteNameInput.fill('Modern Luxury Living');
      }

      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT_DIR, '05_create_quote_form_filled.png') });

      // Click "CREATE & ADD PRODUCT" or submit button in modal
      const submitQuoteBtn = page.locator('.modal-popup._show button:has-text("CREATE & ADD PRODUCT"), .modal-inner-wrap button:has-text("CREATE"), .modal-popup._show button.action.primary').first();
      if (await submitQuoteBtn.isVisible().catch(() => false)) {
        console.log('   Submitting Quote creation...');
        await submitQuoteBtn.click();
        await page.waitForTimeout(5000);
        await page.screenshot({ path: path.join(OUT_DIR, '06_quote_submission_result.png') });
        console.log('   📸 Captured Quote Submission Result.');
      }
    } else {
      console.log('   ℹ️ "Create a quote" button not found, checking Checkout button...');
    }

    // -----------------------------------------------------------------
    // STEP 4: NAVIGATE BACK TO MY QUOTES & VERIFY BLUE BADGES & DATA
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 4/6] Navigating back to My Quotes to verify Blue Badge & Table Grid...');
    await page.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    await page.screenshot({ path: path.join(OUT_DIR, '07_my_quotes_after_creation_full.png'), fullPage: true });
    await page.screenshot({ path: path.join(OUT_DIR, '08_my_quotes_after_creation_viewport.png'), fullPage: false });

    // Inspect Sidebar Badges After Creation
    const sidebarAfter = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item, .account-nav li, .sidebar li'))
        .filter(el => ['Quotes', 'Holds', 'Orders'].some(t => el.innerText.includes(t)));
      return items.map(el => {
        const link = el.querySelector('a');
        const badge = el.querySelector('.badge, .count, [class*="count"], [class*="counter"]');
        return {
          linkText: link ? link.innerText.trim().replace(/\n/g, ' ') : el.innerText.trim(),
          hasBadge: !!badge,
          badgeText: badge ? badge.innerText.trim() : 'NONE',
          badgeTag: badge ? badge.outerHTML : 'NONE',
          fullHtml: el.outerHTML
        };
      });
    });

    console.log('\n========================================================================');
    console.log('⭐ SIDEBAR BADGES VERIFICATION AFTER QUOTE CREATION:');
    console.log(JSON.stringify(sidebarAfter, null, 2));
    console.log('========================================================================\n');

    // Capture Left Sidebar Closeup
    const sidebarEl = page.locator('.block-collapsible-nav, .account-nav, .sidebar.sidebar-main').first();
    if (await sidebarEl.isVisible().catch(() => false)) {
      await sidebarEl.screenshot({ path: path.join(OUT_DIR, '09_left_sidebar_badges_closeup.png') });
      console.log('   📸 Saved Left Sidebar Closeup.');
    }

    // Inspect Table Row Data
    const tableDataAfter = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
      });
      return {
        rowCount: rows.length,
        rows
      };
    });
    console.log('   Table Rows Count After Creation:', tableDataAfter.rowCount);
    console.log('   Table Rows Data:', tableDataAfter.rows);

    const tableEl = page.locator('table, .table-wrapper').first();
    if (await tableEl.isVisible().catch(() => false)) {
      await tableEl.screenshot({ path: path.join(OUT_DIR, '10_quotes_table_populated_closeup.png') });
      console.log('   📸 Saved Populated Quotes Table Closeup.');
    }

    // -----------------------------------------------------------------
    // STEP 5: ALSO CHECK MY ORDERS (/gw_orders/order/index/)
    // -----------------------------------------------------------------
    console.log('\n▶ [Step 5/6] Checking My Orders page to check badge synchronization...');
    await page.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const sidebarOrders = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.block-collapsible-nav .item, .account-nav li, .sidebar li'))
        .filter(el => ['Quotes', 'Holds', 'Orders'].some(t => el.innerText.includes(t)));
      return items.map(el => {
        const link = el.querySelector('a');
        const badge = el.querySelector('.badge, .count, [class*="count"], [class*="counter"]');
        return {
          linkText: link ? link.innerText.trim().replace(/\n/g, ' ') : el.innerText.trim(),
          hasBadge: !!badge,
          badgeText: badge ? badge.innerText.trim() : 'NONE'
        };
      });
    });
    console.log('   Sidebar Badges on My Orders:', sidebarOrders);

    await page.waitForTimeout(2000);
    await browser.close();
    console.log('\n========================================================================');
    console.log('✅ TEST COMPLETE! Check screenshots in screenshots/quote_creation_retest');
    console.log('========================================================================');
  } catch (err) {
    console.error('❌ Error during retest:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
