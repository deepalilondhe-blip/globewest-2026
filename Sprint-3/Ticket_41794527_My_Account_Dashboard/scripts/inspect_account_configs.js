const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../screenshots/admin_review');
const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USER = 'deepali.londhe@overdose.digital';
const ADMIN_PASS = '2Ho770ZEeX7v';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    console.log('Logging into admin...');
    await page.goto(ADMIN_URL, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const loginInput = page.locator('input#username, input[name="login[username]"]').first();
    if (await loginInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginInput.fill(ADMIN_USER);
      await page.fill('input#login, input[name="login[password]"]', ADMIN_PASS);
      await page.click('button.action-login, button[type="submit"]');
      await page.waitForTimeout(5000);
    }

    // 1. Hover Stores and get Configuration link
    await page.hover('#menu-magento-backend-stores');
    await page.waitForTimeout(1000);
    const configHref = await page.locator('#menu-magento-backend-stores a[href*="system_config"]').first().getAttribute('href');

    await page.goto(configHref, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Click on "Customer Account Content Configs" link under OVERDOSE
    console.log('Clicking on Customer Account Content Configs...');
    const accountConfigsLink = page.locator('a[href*="section/gw_customer_account"]').first();
    if (await accountConfigsLink.isVisible().catch(() => false)) {
      await accountConfigsLink.click();
    } else {
      const href = await accountConfigsLink.getAttribute('href');
      await page.goto(href, { timeout: 60000, waitUntil: 'domcontentloaded' });
    }
    await page.waitForTimeout(4000);

    console.log('Opened Customer Account Content Configs! URL:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '30_gw_customer_account_overview.png') });

    // Expand all sections
    await page.evaluate(() => {
      document.querySelectorAll('.entry-edit .section-config, fieldset.config, .fieldset-wrapper').forEach(sec => {
        const btn = sec.querySelector('.fieldset-wrapper-title, legend, button, [data-role="collapsible-title"]');
        if (btn && !sec.classList.contains('_show')) {
          btn.click();
        }
      });
    });
    await page.waitForTimeout(2500);

    await page.screenshot({ path: path.join(OUT_DIR, '31_gw_customer_account_expanded.png'), fullPage: true });

    // Extract all field labels and fieldsets
    const configFields = await page.evaluate(() => {
      const fieldsets = Array.from(document.querySelectorAll('.entry-edit fieldset, .fieldset-wrapper'));
      return fieldsets.map(fs => {
        const title = fs.querySelector('.fieldset-wrapper-title, legend, [data-role="collapsible-title"]')?.innerText.trim() || 'Untitled Section';
        const fields = Array.from(fs.querySelectorAll('.field, tr')).map(f => {
          const label = f.querySelector('label, th')?.innerText.trim() || '';
          const value = f.querySelector('input, select, textarea')?.value || '';
          return { label, value: value.slice(0, 80) };
        }).filter(f => f.label.length > 0);
        return { title, fields };
      }).filter(s => s.fields.length > 0);
    });

    console.log('\n--- Customer Account Content Configs Structure ---');
    configFields.forEach(s => {
      console.log(`\n📁 Section: ${s.title}`);
      s.fields.forEach(f => console.log(`   • ${f.label}: ${f.value}`));
    });

    fs.writeFileSync(path.join(OUT_DIR, 'customer_account_configs_dump.json'), JSON.stringify(configFields, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
