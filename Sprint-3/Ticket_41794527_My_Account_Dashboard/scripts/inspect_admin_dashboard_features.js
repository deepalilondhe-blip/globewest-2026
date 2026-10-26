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
  console.log('🔐 MAGENTO ADMIN INSPECTION: MY ACCOUNT DASHBOARD FEATURES (READ-ONLY)');
  console.log('   Target: Inspecting Admin Paths for Dashboard Content & Settings');
  console.log('   STRICT DIRECTIVE: READ-ONLY — DO NOT MODIFY OR SAVE ANY DATA');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: true, // running headless to inspect and capture screenshots
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  try {
    // 1. Login to Admin
    console.log('▶ Step 1: Logging into Magento Admin Panel...');
    await page.goto(ADMIN_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForURL(/admin/, { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(4000);
      console.log('   ✅ Successfully logged into Admin Panel!');
    }

    await page.screenshot({ path: path.join(OUT_DIR, '01_admin_dashboard_home.png') });

    // 2. Inspect Stores -> Configuration -> OVERDOSE
    console.log('\n▶ Step 2: Checking Stores > Configuration...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/system_config/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // List all tabs under Overdose
    const overdoseTabs = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.admin__page-nav-item a, .config-nav-block a'));
      return links.map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })).filter(a => a.text.length > 0);
    });

    console.log('   Found ' + overdoseTabs.length + ' Configuration Tabs.');
    const overdoseSpecific = overdoseTabs.filter(t => 
      t.text.toLowerCase().includes('overdose') || 
      t.text.toLowerCase().includes('account') || 
      t.text.toLowerCase().includes('dashboard') ||
      t.text.toLowerCase().includes('customer') ||
      t.text.toLowerCase().includes('content')
    );
    console.log('   Relevant Config Tabs:', JSON.stringify(overdoseSpecific, null, 2));

    await page.screenshot({ path: path.join(OUT_DIR, '02_stores_configuration_overview.png') });

    // Click on Customer Account Content Configs if found
    for (const tab of overdoseSpecific) {
      if (tab.text.toLowerCase().includes('customer') || tab.text.toLowerCase().includes('content')) {
        console.log(`   Navigating to: ${tab.text} (${tab.href})...`);
        await page.goto(tab.href, { timeout: 60000, waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(4000);
        const slug = tab.text.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        await page.screenshot({ path: path.join(OUT_DIR, `03_config_${slug}.png`), fullPage: false });

        // Extract section titles
        const sections = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('.entry-edit-head strong, .section-config strong, .admin__collapsible-title'))
            .map(el => el.innerText.trim()).filter(Boolean);
        });
        console.log(`   Sections inside ${tab.text}:`, sections);
      }
    }

    // 3. Inspect Content -> Blocks (CMS Blocks)
    console.log('\n▶ Step 3: Checking Content > Blocks for Dashboard CMS Blocks...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/cms/block/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    await page.screenshot({ path: path.join(OUT_DIR, '04_cms_blocks_grid.png') });

    // Search for "dashboard"
    console.log('   Searching CMS Blocks for "dashboard"...');
    const searchField = page.locator('input[name="title"], input[name="identifier"], input.admin__control-text').first();
    if (await searchField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchField.fill('dashboard');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(OUT_DIR, '05_cms_blocks_search_dashboard.png') });
    }

    const dashboardBlocks = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.data-grid tbody tr'));
      return rows.map(tr => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
        return {
          id: cells[1] || '',
          title: cells[2] || '',
          identifier: cells[3] || '',
          status: cells[5] || '',
          storeView: cells[4] || ''
        };
      }).filter(r => r.title.length > 0);
    });

    console.log('   CMS Blocks matching "dashboard":', JSON.stringify(dashboardBlocks, null, 2));

    // Also search for "account"
    console.log('   Searching CMS Blocks for "account"...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/cms/block/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const searchField2 = page.locator('input[name="title"], input[name="identifier"], input.admin__control-text').first();
    if (await searchField2.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchField2.fill('account');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(OUT_DIR, '06_cms_blocks_search_account.png') });
    }

    const accountBlocks = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.data-grid tbody tr'));
      return rows.map(tr => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
        return {
          id: cells[1] || '',
          title: cells[2] || '',
          identifier: cells[3] || '',
          status: cells[5] || '',
          storeView: cells[4] || ''
        };
      }).filter(r => r.title.length > 0);
    });

    console.log('   CMS Blocks matching "account":', JSON.stringify(accountBlocks, null, 2));

    // Also search for "claim"
    console.log('   Searching CMS Blocks for "claim"...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/cms/block/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const searchField3 = page.locator('input[name="title"], input[name="identifier"], input.admin__control-text').first();
    if (await searchField3.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchField3.fill('claim');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(OUT_DIR, '07_cms_blocks_search_claim.png') });
    }

    const claimBlocks = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.data-grid tbody tr'));
      return rows.map(tr => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
        return {
          id: cells[1] || '',
          title: cells[2] || '',
          identifier: cells[3] || '',
          status: cells[5] || '',
          storeView: cells[4] || ''
        };
      }).filter(r => r.title.length > 0);
    });

    console.log('   CMS Blocks matching "claim":', JSON.stringify(claimBlocks, null, 2));

    // Also search for "faq"
    console.log('   Searching CMS Blocks for "faq"...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/cms/block/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const searchField4 = page.locator('input[name="title"], input[name="identifier"], input.admin__control-text').first();
    if (await searchField4.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchField4.fill('faq');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(OUT_DIR, '08_cms_blocks_search_faq.png') });
    }

    const faqBlocks = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table.data-grid tbody tr'));
      return rows.map(tr => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
        return {
          id: cells[1] || '',
          title: cells[2] || '',
          identifier: cells[3] || '',
          status: cells[5] || '',
          storeView: cells[4] || ''
        };
      }).filter(r => r.title.length > 0);
    });

    console.log('   CMS Blocks matching "faq":', JSON.stringify(faqBlocks, null, 2));

    // 4. Inspect Content -> Widgets
    console.log('\n▶ Step 4: Checking Content > Widgets...');
    await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/admin/widget_instance/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '09_widgets_grid.png') });

    // Save summary json
    const summaryData = {
      adminUrl: ADMIN_URL,
      overdoseSpecific,
      dashboardBlocks,
      accountBlocks,
      claimBlocks,
      faqBlocks
    };

    fs.writeFileSync(path.join(OUT_DIR, 'admin_inspection_summary.json'), JSON.stringify(summaryData, null, 2));
    console.log('\n🎉 Admin inspection completed successfully! All data and screenshots saved.');

  } catch (err) {
    console.error('❌ Error during Admin inspection:', err);
  } finally {
    await browser.close();
  }
})();
