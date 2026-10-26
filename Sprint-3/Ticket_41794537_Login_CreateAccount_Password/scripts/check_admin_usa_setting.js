const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('dialog', async d => {
    console.log('Dialog popped:', d.message());
    await d.accept();
  });

  console.log('Logging into Magento Admin...');
  await page.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await page.fill('#username', 'deepali.londhe@overdose.digital');
  await page.fill('#login', '2Ho770ZEeX7v');
  await page.click('button.action-login');
  await page.waitForTimeout(6000);

  // Directly navigate to Configuration using the href found in the dashboard
  const configHref = await page.evaluate(() => {
    const el = document.querySelector('.item-system-config a, a[href*="system_config/index"]');
    return el ? el.href : null;
  });
  console.log('Navigating to Configuration via:', configHref);
  await page.goto(configHref, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // Find customer section link in left menu
  const customerLinkHref = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('section/customer'));
    return link ? link.href : null;
  });
  console.log('Navigating to Customer Configuration via:', customerLinkHref);
  await page.goto(customerLinkHref, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // Click Scope switcher
  console.log('Opening Scope switcher...');
  await page.click('#store-change-button');
  await page.waitForTimeout(1000);

  // Click USA Website
  console.log('Clicking USA Website in dropdown...');
  await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.dropdown-menu a, .admin__action-dropdown-menu a, a'));
    const usa = links.find(a => a.innerText && a.innerText.trim().startsWith('USA Website'));
    if (usa) usa.click();
  });
  await page.waitForTimeout(1500);

  // Click OK on modal popup
  console.log('Confirming modal...');
  const okBtn = page.locator('.modal-popup._show button.action-accept, button:has-text("OK")').first();
  if (await okBtn.isVisible()) {
    await okBtn.click();
    await page.waitForTimeout(7000);
  }

  console.log('Current Active Scope after switch:', await page.innerText('#store-change-button'));

  // Expand "Create New Account Options"
  console.log('Expanding Create New Account Options...');
  await page.evaluate(() => {
    const head = document.querySelector('#customer_create_account_options-head');
    if (head && !head.classList.contains('open')) head.click();
  });
  await page.waitForTimeout(2000);

  // Highlight the row with green outline for visual QA proof
  await page.evaluate(() => {
    const allRows = Array.from(document.querySelectorAll('#customer_create_account_options .admin__field, #customer_create_account_options tr'));
    const targetRow = allRows.find(r => r.innerText.includes('Allow Customer to Create Account'));
    if (targetRow) {
      targetRow.style.outline = '4px solid #10B981';
      targetRow.style.backgroundColor = 'rgba(16, 185, 129, 0.12)';
      targetRow.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });

  const usaDetails = await page.evaluate(() => {
    const select = document.querySelector('select[id*="create_account"], select[name*="create_account"]');
    const inherit = document.querySelector('input[type="checkbox"][id*="create_account"]');
    return {
      scope: document.querySelector('#store-change-button').innerText.trim(),
      selectedValue: select ? select.value : null,
      selectedText: select && select.selectedIndex >= 0 ? select.options[select.selectedIndex].text : null,
      useDefaultChecked: inherit ? inherit.checked : null
    };
  });
  console.log('USA Scope Result:', JSON.stringify(usaDetails, null, 2));

  await page.waitForTimeout(1000);
  const shotPath = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/registration_disabled_audit/07_magento_admin_usa_website_setting_verified.png';
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log('Saved screenshot to:', shotPath);

  await browser.close();
})();
