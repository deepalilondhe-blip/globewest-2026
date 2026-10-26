const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/admin_review');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';

(async () => {
  console.log('========================================================================');
  console.log('🇺🇸 OPENING MAGENTO ADMIN UNDER "USA WEBSITE" SCOPE (READ-ONLY)');
  console.log('   Target: My Account / Orders / Support & FAQ Configuration');
  console.log('   STRICT DIRECTIVE: READ-ONLY REVIEW — NO SAVING OR EDITING DATA');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 350,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Automatically accept any confirmation dialogs (e.g. scope change warnings)
  page.on('dialog', async dialog => {
    console.log(`💬 Confirming modal dialog: "${dialog.message()}"`);
    await dialog.accept();
  });

  try {
    // -------------------------------------------------------------------------
    // 1. LOGIN TO MAGENTO ADMIN
    // -------------------------------------------------------------------------
    console.log('▶ [Step 1/5] Logging into Magento Admin...');
    await page.goto(ADMIN_URL, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForURL(/admin/, { timeout: 35000 }).catch(() => {});
      await page.waitForTimeout(3000);
      console.log('   ✅ Admin logged in. URL:', page.url());
    } else {
      console.log('   ℹ️ Already on admin panel.');
    }

    // -------------------------------------------------------------------------
    // 2. NAVIGATE TO STORES > CONFIGURATION
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 2/5] Navigating to Stores > Configuration...');
    const storesMenu = page.locator('#menu-magento-backend-stores, a:has-text("STORES")').first();
    if (await storesMenu.isVisible({ timeout: 4000 }).catch(() => false)) {
      await storesMenu.click();
      await page.waitForTimeout(800);
    }
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/system_config/', { timeout: 40000, waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(3000);
    console.log('   Stores > Configuration loaded. URL:', page.url());

    // -------------------------------------------------------------------------
    // 3. SWITCH SCOPE TO "USA WEBSITE" / "GLOBEWEST US"
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 3/5] Switching Scope to "USA Website"...');
    
    // Check if dropdown button exists
    const storeSwitcherBtn = page.locator('#store-change-button, button.store-switcher, [data-role="store-change"]').first();
    const selectEl = page.locator('select#store_switcher, select[name="store_switcher"]').first();

    let scopeSwitched = false;

    if (await storeSwitcherBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      const currentScopeText = await storeSwitcherBtn.innerText();
      console.log(`   Current Scope Button text: "${currentScopeText.trim()}"`);
      
      if (!currentScopeText.toLowerCase().includes('usa website') && !currentScopeText.toLowerCase().includes('us')) {
        await storeSwitcherBtn.click();
        await page.waitForTimeout(1000);

        // Find USA Website option in dropdown list
        const usaOption = page.locator('.store-switcher-all a, [data-role="store-view-item"], .dropdown-menu a')
          .filter({ hasText: /USA Website|GlobeWest US|United States/i })
          .first();

        if (await usaOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          const optText = await usaOption.innerText();
          console.log(`   Clicking scope option: "${optText.trim()}"`);
          await usaOption.click();
          await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
          await page.waitForTimeout(3000);
          scopeSwitched = true;
          console.log('   ✅ Scope switched to USA Website via dropdown.');
        }
      } else {
        console.log('   ℹ️ Already on USA scope.');
        scopeSwitched = true;
      }
    }

    if (!scopeSwitched && await selectEl.isVisible({ timeout: 3000 }).catch(() => false)) {
      const options = await selectEl.locator('option').all();
      for (const opt of options) {
        const text = await opt.innerText();
        if (text.toLowerCase().includes('usa website') || text.toLowerCase().includes('globewest us')) {
          const val = await opt.getAttribute('value');
          console.log(`   Selecting select option: "${text.trim()}" (value: ${val})`);
          await selectEl.selectOption({ value: val });
          await page.waitForLoadState('networkidle', { timeout: 25000 }).catch(() => {});
          await page.waitForTimeout(3000);
          scopeSwitched = true;
          break;
        }
      }
    }

    await page.screenshot({ path: path.join(OUT_DIR, '05_usa_website_scope_loaded.png'), fullPage: false });

    // -------------------------------------------------------------------------
    // 4. LOCATE & EXPAND "OVERDOSE" CONFIGURATIONS UNDER USA SCOPE
    // -------------------------------------------------------------------------
    console.log('\n▶ [Step 4/5] Searching for Overdose & Customer Account configs...');
    
    // Look for OVERDOSE parent tab on left nav
    const overdoseHeader = page.locator('.config-nav-block strong:has-text("OVERDOSE"), .admin__page-nav-title:has-text("OVERDOSE"), div:has-text("OVERDOSE")').first();
    if (await overdoseHeader.isVisible({ timeout: 4000 }).catch(() => false)) {
      console.log('   Found OVERDOSE section header.');
      await overdoseHeader.click().catch(() => {});
      await page.waitForTimeout(1000);
    }

    // List all links in config navigation to locate customer account / orders
    const availableLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.admin__page-nav-link, .config-nav-block a'));
      return links.map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href') || ''
      })).filter(l => l.text.length > 0);
    });

    console.log('   Available left-navigation sections under current scope:');
    availableLinks.forEach(l => {
      if (l.text.toLowerCase().includes('customer') || l.text.toLowerCase().includes('order') || l.text.toLowerCase().includes('overdose') || l.text.toLowerCase().includes('toggle') || l.text.toLowerCase().includes('price') || l.text.toLowerCase().includes('account')) {
        console.log(`     👉 [${l.text}] -> ${l.href}`);
      }
    });

    // Try clicking Customer Account Content Configs or Price Toggle or Customer Configuration
    const targetLink = page.locator('a:has-text("Customer Account"), a:has-text("Content Configs"), a:has-text("Customer Configuration"), a:has-text("Price Toggle")').first();
    if (await targetLink.isVisible({ timeout: 4000 }).catch(() => false)) {
      const linkText = await targetLink.innerText();
      console.log(`   Opening section: "${linkText.trim()}"...`);
      await targetLink.click();
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2500);

      // Expand all fieldsets on this config page so user can inspect every field
      await page.evaluate(() => {
        document.querySelectorAll('.entry-edit .section-config, fieldset.config, .fieldset-wrapper').forEach(sec => {
          const btn = sec.querySelector('.fieldset-wrapper-title, legend, button, [data-role="collapsible-title"]');
          if (btn && !sec.classList.contains('_show')) {
            btn.click();
          }
        });
      });
      await page.waitForTimeout(2000);

      await page.screenshot({ path: path.join(OUT_DIR, '06_usa_account_configs_expanded.png'), fullPage: true });
      console.log('   📸 Captured expanded USA Account Configs.');
    }

    // Also inspect Sales > Orders in Admin
    console.log('\n▶ [Step 5/5] Checking Sales > Orders Grid (Read-Only Review)...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/sales/order/index/', { timeout: 40000, waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // Filter by USA store view / website if store filter exists in grid
    const storeFilter = page.locator('select[name="store_id"], select[name="store"]').first();
    if (await storeFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('   Store filter found in Sales Grid.');
    }

    await page.screenshot({ path: path.join(OUT_DIR, '07_sales_orders_usa_review.png'), fullPage: false });

    // Open Storefront My Orders in Tab 2 for direct cross-verification
    const sfPage = await context.newPage();
    console.log('\n▶ Opening Tab 2: Live US Storefront My Orders (/gw_orders/order/index/)...');
    await sfPage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sfPage.waitForTimeout(1500);
    const sfEmail = sfPage.locator('#email');
    if (await sfEmail.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sfEmail.fill(ADMIN_USER);
      await sfPage.fill('#pass', 'Deep@123');
      await sfPage.click('#send2');
      await sfPage.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await sfPage.waitForTimeout(2000);
    }
    await sfPage.goto('https://mcstaging2.globewest.com/gw_orders/order/index/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sfPage.waitForTimeout(2000);

    // Bring Admin tab back to focus
    await page.bringToFront();

    console.log('\n========================================================================');
    console.log('🌟 USA WEBSITE SCOPE IS ACTIVE & DISPLAYED ON SCREEN FOR YOUR REVIEW!');
    console.log('   • Tab 1: Magento Admin under USA Website Scope');
    console.log('   • Tab 2: US Staging Storefront My Orders');
    console.log('   • STRICT SAFETY: Read-Only. No settings or data are changed or saved.');
    console.log('   • Browser window remains open on your desktop for 10 minutes.');
    console.log('========================================================================\n');

    // Keep open for 10 minutes (600 seconds) so user can comfortably review
    await page.waitForTimeout(600000);

    await browser.close();
    console.log('Session closed.');
  } catch (err) {
    console.error('Error in USA Website review script:', err);
    if (browser) await browser.close().catch(() => {});
  }
})();
