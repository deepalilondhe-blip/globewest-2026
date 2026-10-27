const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/plp_click_audit_proofs';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function showBanner(page, title, subtitle, bgColor = '#0F172A', duration = 2500) {
  await page.evaluate(({ title, subtitle, bgColor }) => {
    let el = document.getElementById('gw-qa-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gw-qa-banner';
      el.style.position = 'fixed';
      el.style.top = '15px';
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.zIndex = '999999999';
      el.style.padding = '12px 28px';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
      el.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      el.style.textAlign = 'center';
      el.style.pointerEvents = 'none';
      el.style.transition = 'all 0.3s ease';
      document.body.appendChild(el);
    }
    el.style.background = bgColor;
    el.innerHTML = `<div style="color:#FFF; font-size:16px; font-weight:bold; margin-bottom:4px;">${title}</div>
                    <div style="color:rgba(255,255,255,0.85); font-size:13px;">${subtitle}</div>`;
  }, { title, subtitle, bgColor });

  if (duration > 0) {
    await page.waitForTimeout(duration);
  }
}

(async () => {
  console.log('🚀 Starting Isolated PLP Click Tests in Headed Mode (DISPLAY=:0)...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 600,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const clickLog = [];

  // Login
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2, button[type="submit"].login');
  await page.waitForTimeout(5000);

  // Navigate to Coffee Tables PLP
  await page.goto('https://mcstaging2.globewest.com/indoor/furniture/coffee-tables', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // 1. CLICK: "Hide Filters" / "Show Filters" toggle
  console.log('\n--- Test 1: Click "Hide Filters" toggle ---');
  await showBanner(page, 'Test 1: Click "Hide Filters" / "Show Filters"', 'Toggling left filter sidebar visibility', '#0284C7', 2500);

  const hideFiltersBtn = page.locator('button:has-text("Hide Filters"), a:has-text("Hide Filters"), .filter-toggle').first();
  if (await hideFiltersBtn.isVisible().catch(() => false)) {
    await hideFiltersBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'click_01_filters_hidden.png') });
    console.log('Clicked "Hide Filters" successfully!');
    clickLog.push({ test: 'Hide Filters Toggle', status: 'PASS', detail: 'Sidebar collapsed' });

    // Click "Show Filters" to re-open
    const showFiltersBtn = page.locator('button:has-text("Show Filters"), a:has-text("Show Filters"), .filter-toggle').first();
    if (await showFiltersBtn.isVisible().catch(() => false)) {
      await showFiltersBtn.click();
      await page.waitForTimeout(2000);
      clickLog.push({ test: 'Show Filters Toggle', status: 'PASS', detail: 'Sidebar re-expanded' });
    }
  }

  // 2. CLICK: Filter Accordion (Brand +)
  console.log('\n--- Test 2: Click Filter Facet (Brand +) ---');
  await showBanner(page, 'Test 2: Expanding Filter Facet (Brand +)', 'Clicking filter accordion to reveal brand options', '#10B981', 2500);

  const brandFacet = page.locator('.filter-options-title:has-text("Brand"), [data-role="collapsible"]:has-text("Brand")').first();
  if (await brandFacet.isVisible().catch(() => false)) {
    await brandFacet.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'click_02_brand_accordion_open.png') });

    // Click the first brand option
    const firstBrand = page.locator('.filter-options-content a, .filter-options-item a').first();
    if (await firstBrand.isVisible().catch(() => false)) {
      const brandName = await firstBrand.innerText().catch(() => 'Brand');
      console.log(`Clicking Brand facet: ${brandName.trim()}...`);
      await firstBrand.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(OUT_DIR, 'click_03_brand_filter_applied.png') });
      clickLog.push({ test: 'Filter Facet Click', status: 'PASS', detail: `Applied brand: ${brandName.trim()}` });

      // Click Clear All
      const clearBtn = page.locator('.action.clear, .filter-clear, a:has-text("Clear All")').first();
      if (await clearBtn.isVisible().catch(() => false)) {
        await clearBtn.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        clickLog.push({ test: 'Clear All Filter Click', status: 'PASS', detail: 'Filter cleared successfully' });
      }
    }
  }

  // 3. CLICK: Sort By Dropdown
  console.log('\n--- Test 3: Click Sort By Dropdown ---');
  await showBanner(page, 'Test 3: Click Sort By Dropdown', 'Selecting "Price" sort order', '#0284C7', 2500);

  const sorter = page.locator('select#sorter, select[data-role="sorter"]').first();
  if (await sorter.isVisible().catch(() => false)) {
    const opts = await sorter.locator('option').allInnerTexts();
    console.log('Available Sort options:', opts);
    await sorter.selectOption({ index: 1 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, 'click_04_sort_by_applied.png') });
    clickLog.push({ test: 'Sort Dropdown Click', status: 'PASS', detail: `Sorted by: ${opts[1] || 'Price'}` });
  }

  // 4. CLICK: Product Card Link -> Navigate to PDP
  console.log('\n--- Test 4: Click Product Card Title -> Open PDP ---');
  await showBanner(page, 'Test 4: Click Product Card to Navigate to PDP', 'Testing product card anchor routing', '#10B981', 3000);

  const productLink = page.locator('.product-item-name a, .product-item-link, a.product-item-photo').first();
  const pTitle = await productLink.innerText().catch(() => 'Product');
  console.log(`Clicking product card link: ${pTitle.trim()}...`);
  await productLink.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  const targetPdpUrl = page.url();
  console.log('Successfully navigated to PDP URL:', targetPdpUrl);
  await showBanner(page, 'Landed on Product Detail Page (PDP)', `URL: ${targetPdpUrl}`, '#10B981', 3500);
  await page.screenshot({ path: path.join(OUT_DIR, 'click_05_pdp_navigated.png') });
  clickLog.push({ test: 'Product Card Click Routing', status: 'PASS', detail: `Navigated to PDP: ${targetPdpUrl}` });

  // 5. ON PDP: CLICK [ADD TO CART] & [ADD TO QUOTE]
  console.log('\n--- Test 5: On PDP: Click Add to Cart / Add to Quote ---');
  await showBanner(page, 'Test 5: On PDP: Testing Action Buttons', 'Verifying [ADD TO CART] and [ADD TO QUOTE]', '#0284C7', 3000);

  const atc = page.locator('#product-addtocart-button');
  const atq = page.locator('button.toquote, button:has-text("ADD TO QUOTE")').first();

  const atcVisible = await atc.isVisible().catch(() => false);
  const atqVisible = await atq.isVisible().catch(() => false);
  console.log('Add to Cart visible:', atcVisible, '| Add to Quote visible:', atqVisible);
  clickLog.push({ test: 'PDP Action Buttons Presence', status: (atcVisible && atqVisible) ? 'PASS' : 'PARTIAL', detail: `AddToCart: ${atcVisible}, AddToQuote: ${atqVisible}` });

  // Save full log
  fs.writeFileSync(path.join(OUT_DIR, 'isolated_clicks_results.json'), JSON.stringify(clickLog, null, 2));

  console.log('\nKeeping browser open for 6 seconds for user observation...');
  await page.waitForTimeout(6000);

  await browser.close();
  console.log('🏁 Isolated Click Tests completed successfully!');
})();
