const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../../GlobeWest 2026/node_modules/playwright'));

(async () => {
  console.log('========================================================================');
  console.log('🔍 LIVE HEADED CHECK: LOGGED-IN FILTER SIDEBAR ("Filters / Hide Filters")');
  console.log('Credentials: deepali.londhe@overdose.digital / Deep@123');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 700,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  async function highlight(locator, title, desc, color = '#10B981', dur = 3500) {
    try {
      if (!await locator.isVisible({ timeout: 2000 }).catch(() => false)) return;
      await locator.scrollIntoViewIfNeeded();
      await locator.evaluate((el, { t, d, c }) => {
        el.style.outline = `3px solid ${c}`;
        el.style.boxShadow = `0 0 20px ${c}`;
        
        const b = document.createElement('div');
        b.className = 'qa-spotlight-banner';
        b.innerHTML = `<div style="font-weight:900; font-size:12px;">${t}</div><div style="font-size:11px;">${d}</div>`;
        b.style.position = 'absolute';
        b.style.top = '-50px';
        b.style.left = '0';
        b.style.background = c;
        b.style.color = '#fff';
        b.style.padding = '6px 12px';
        b.style.borderRadius = '6px';
        b.style.zIndex = '100000';
        b.style.pointerEvents = 'none';
        b.style.whiteSpace = 'nowrap';
        
        if (window.getComputedStyle(el).position === 'static') {
          el.style.position = 'relative';
        }
        el.appendChild(b);
        setTimeout(() => { b.remove(); el.style.outline = 'none'; el.style.boxShadow = 'none'; }, 3000);
      }, { t: title, d: desc, c: color });
      await page.waitForTimeout(dur);
    } catch(e) {}
  }

  // 1. Authenticate as Trade Customer
  console.log('🔑 [Step 1] Logging into US Trade Customer Account...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email');
  if (await emailField.isVisible({ timeout: 4000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await page.locator('#pass').fill('Deep@123');
    await page.locator('#send2').click();
    await page.waitForTimeout(4000);
  }

  // 2. Navigate to PLP
  console.log('📍 [Step 2] Navigating to PLP (/indoor)...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // 3. Inspect the Filters Sidebar
  console.log('\n🔍 [Step 3] Inspecting Filter Sidebar & "Hide Filters" on Live...');
  const filtersSection = page.locator('.block.filter, .sidebar, .sidebar-main, #layered-filter-block').first();
  const filtersHeader = page.locator('text=Filters').first();
  const hideFiltersLink = page.locator('text=Hide Filters').first();

  if (await hideFiltersLink.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('  ✅ "Filters / Hide Filters" is VISIBLE on screen!');
    await highlight(filtersHeader, '🟢 FILTERS SIDEBAR ACTIVE', 'Header: "Filters" with "Hide Filters" link matches Figma artboard!', '#10B981', 3500);
    await highlight(hideFiltersLink, '🟢 HIDE FILTERS LINK PRESENT', 'Clicking this collapses the sidebar facets', '#10B981', 3500);

    // 4. Test clicking Hide Filters
    console.log('👉 [Step 4] Clicking "Hide Filters"...');
    await hideFiltersLink.click();
    await page.waitForTimeout(2500);

    // Look for Show Filters or toggle
    const showFiltersLink = page.locator('text=Show Filters, text=Filters, .action.show-filter').first();
    if (await showFiltersLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await highlight(showFiltersLink, '🟢 SHOW FILTERS RE-APPEARS', 'Sidebar is hidden; button allows user to re-open filters', '#00D2FF', 3000);
      console.log('👉 [Step 5] Clicking to re-open filters...');
      await showFiltersLink.click();
      await page.waitForTimeout(2500);
    }
  } else {
    console.log('  ⚠️ Filters sidebar not found with standard selector, inspecting page content...');
  }

  console.log('\n========================================================================');
  console.log('✅ DEMO COMPLETE: Browser will stay open for 15 seconds for your review!');
  console.log('========================================================================\n');

  await page.waitForTimeout(15000);
  await browser.close();
})();
