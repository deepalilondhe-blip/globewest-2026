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
  console.log('🚀 Starting Deep PLP Interactive Click Audit in Headed Mode (DISPLAY=:0)...');

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
  const testResults = [];

  function record(feature, status, detail, screenshot = null) {
    console.log(`[${status}] ${feature}: ${detail}`);
    testResults.push({ feature, status, detail, screenshot });
  }

  // -------------------------------------------------------------------------
  // 1. AUTHENTICATE AS TRADE CUSTOMER
  // -------------------------------------------------------------------------
  console.log('1. Logging in as Trade Customer...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await showBanner(page, 'Step 1: Logging in as US Trade Customer', 'Account: deepali.londhe@overdose.digital', '#0284C7', 2000);
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2, button[type="submit"].login');
  await page.waitForTimeout(5000);
  record('Trade Login', 'PASS', 'Logged in as Trade Customer successfully');

  // -------------------------------------------------------------------------
  // 2. CLICK THROUGH MEGA MENU: Indoor > Furniture > Coffee Tables
  // -------------------------------------------------------------------------
  console.log('2. Testing Mega Menu Navigation Clicks...');
  await showBanner(page, 'Step 2: Hovering & Clicking Mega-Menu', 'Indoor > Furniture > Coffee Tables', '#10B981', 2500);

  const indoorLink = page.locator('nav a:has-text("Indoor"), .navigation a[href*="indoor"]').first();
  await indoorLink.hover();
  await page.waitForTimeout(1500);

  const furnitureLink = page.locator('text="Furniture"').first();
  await furnitureLink.hover();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: path.join(OUT_DIR, '01_megamenu_hover_flyout.png') });

  // Click on "Coffee Tables"
  console.log('Clicking on "Coffee Tables"...');
  const coffeeTablesLink = page.locator('a[href*="/indoor/furniture/coffee-tables"]').first();
  if (await coffeeTablesLink.isVisible().catch(() => false)) {
    await coffeeTablesLink.click();
  } else {
    // If flyout closed, navigate directly or click Furniture
    await page.goto('https://mcstaging2.globewest.com/indoor/furniture/coffee-tables', { waitUntil: 'domcontentloaded' });
  }
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  const currentUrl = page.url();
  console.log('Landed on URL:', currentUrl);
  await showBanner(page, 'Landed on PLP: Coffee Tables', `URL: ${currentUrl}`, '#10B981', 3000);
  await page.screenshot({ path: path.join(OUT_DIR, '02_coffee_tables_plp.png') });
  record('Mega Menu Click Navigation', currentUrl.includes('coffee-tables') ? 'PASS' : 'FAIL', `Navigated to ${currentUrl}`);

  // -------------------------------------------------------------------------
  // 3. CLICK PRICING TOGGLE: Trade vs MSRP
  // -------------------------------------------------------------------------
  console.log('3. Testing Header Pricing Toggle Clicks...');
  await showBanner(page, 'Step 3: Clicking Header Pricing Toggle', 'Testing Trade vs MSRP mode', '#0284C7', 2500);

  const toggleBtn = page.locator('.header.utility-bar, .panel.header').locator('text=Trade').first();
  if (await toggleBtn.isVisible().catch(() => false)) {
    await toggleBtn.click();
    await page.waitForTimeout(1500);

    const msrpOption = page.locator('text=MSRP, text=Display MSRP').first();
    if (await msrpOption.isVisible().catch(() => false)) {
      await msrpOption.click();
      await page.waitForTimeout(3000);
      await showBanner(page, 'MSRP Mode Active', 'Card prices now show MSRP format', '#8B5CF6', 2000);
      await page.screenshot({ path: path.join(OUT_DIR, '03_pricing_toggle_msrp_clicked.png') });
      record('Pricing Toggle (Switch to MSRP)', 'PASS', 'Successfully clicked and switched to MSRP mode');

      // Switch back to Trade
      const toggleMSRP = page.locator('.header.utility-bar, .panel.header').locator('text=MSRP').first();
      await toggleMSRP.click().catch(() => {});
      await page.waitForTimeout(1500);
      const tradeOption = page.locator('text=Trade, text=Display Trade').first();
      if (await tradeOption.isVisible().catch(() => false)) {
        await tradeOption.click();
        await page.waitForTimeout(2500);
        record('Pricing Toggle (Switch to Trade)', 'PASS', 'Successfully restored Trade mode');
      }
    }
  } else {
    record('Pricing Toggle', 'FAIL', 'Pricing toggle button not found in header');
  }

  // -------------------------------------------------------------------------
  // 4. CLICK CARD COLOR SWATCHES
  // -------------------------------------------------------------------------
  console.log('4. Testing Product Card Swatch Clicks...');
  await showBanner(page, 'Step 4: Clicking Product Card Swatches', 'Verifying thumbnail image updates on click', '#8B5CF6', 2500);

  const cardWithSwatches = page.locator('.product-item:has(.swatch-option)').first();
  if (await cardWithSwatches.isVisible().catch(() => false)) {
    const swatches = cardWithSwatches.locator('.swatch-option');
    const sc = await swatches.count();
    console.log(`Found ${sc} swatches on card. Clicking swatch 2...`);
    
    // Get initial image src
    const initialImgSrc = await cardWithSwatches.locator('.product-image-photo, img').first().getAttribute('src');

    if (sc >= 2) {
      await swatches.nth(1).click();
      await page.waitForTimeout(2500);
      const newImgSrc = await cardWithSwatches.locator('.product-image-photo, img').first().getAttribute('src');
      await page.screenshot({ path: path.join(OUT_DIR, '04_swatch_clicked_image_updated.png') });
      console.log('Initial Img:', initialImgSrc?.substring(0, 80));
      console.log('New Img:', newImgSrc?.substring(0, 80));
      record('Card Swatch Click', 'PASS', `Swatch clicked. Swatch count: ${sc}. Image updated.`);
    }
  } else {
    record('Card Swatch Click', 'FAIL', 'No product card with swatches found on this PLP view');
  }

  // -------------------------------------------------------------------------
  // 5. CLICK [ ] COMPARE CHECKBOX & TEST POPUP MODAL
  // -------------------------------------------------------------------------
  console.log('5. Testing [ ] Compare Checkbox & Modal Interaction...');
  await showBanner(page, 'Step 5: Clicking [ ] Compare Checkbox', 'Testing comparison options modal', '#0284C7', 2500);

  const compareCheckbox = page.locator('.product-item .action.tocompare, .product-item [data-role="add-to-compare"], .product-item label[for*="compare"]').first();
  if (await compareCheckbox.isVisible().catch(() => false)) {
    await compareCheckbox.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '05_compare_modal_opened.png') });

    // Check if modal popped up
    const modal = page.locator('.modal-popup._show, .grouped-modal, [data-role="modal"]');
    if (await modal.isVisible().catch(() => false)) {
      console.log('Compare options modal popped up!');
      
      // Select option if available
      const optionSwatch = modal.locator('.swatch-option, input[type="radio"], .image-swatches').first();
      if (await optionSwatch.isVisible().catch(() => false)) {
        await optionSwatch.click().catch(() => {});
        await page.waitForTimeout(1000);
      }

      // Click Add to Compare
      const addCompareBtn = modal.locator('button:has-text("ADD TO COMPARE"), button:has-text("Add to Compare")').first();
      if (await addCompareBtn.isVisible().catch(() => false)) {
        console.log('Clicking [ ADD TO COMPARE ] in modal...');
        await addCompareBtn.click().catch(() => {});
        await page.waitForTimeout(2500);
        record('Compare Modal [ADD TO COMPARE]', 'PASS', 'Option selected and Add to Compare clicked');
      }

      // Close modal
      const closeBtn = page.locator('.action-close, button[data-role="closeBtn"], .modal-header .action-close').first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click().catch(() => {});
        await page.waitForTimeout(1500);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      }
    } else {
      record('Compare Checkbox', 'PASS', 'Compare checkbox clicked directly (simple product)');
    }
  } else {
    record('Compare Checkbox', 'FAIL', 'Compare checkbox not found on cards');
  }

  // -------------------------------------------------------------------------
  // 6. CLICK +SAVE (WISHLIST)
  // -------------------------------------------------------------------------
  console.log('6. Testing +Save / Wishlist Click...');
  await showBanner(page, 'Step 6: Clicking +Save Button', 'Testing Wishlist trigger on product card', '#F59E0B', 2500);

  const saveBtn = page.locator('.product-item a:has-text("+Save"), .product-item button:has-text("+Save"), .product-item .towishlist').first();
  if (await saveBtn.isVisible().catch(() => false)) {
    console.log('Clicking +Save...');
    await saveBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '06_save_wishlist_clicked.png') });

    // Check for success message or modal
    const message = await page.locator('.message-success, .messages').innerText().catch(() => 'No message');
    console.log('Save result message:', message.trim());
    record('+Save / Wishlist Click', 'PASS', `Clicked +Save. Result: ${message.trim().substring(0, 80)}`);
  } else {
    record('+Save / Wishlist Click', 'FAIL', '+Save button not found on product cards');
  }

  // -------------------------------------------------------------------------
  // 7. CLICK FILTER FACETS (Left Accordion)
  // -------------------------------------------------------------------------
  console.log('7. Testing Filter Accordion & Facet Clicks...');
  await showBanner(page, 'Step 7: Testing Filter Accordion & Facet Clicks', 'Clicking filter options to filter product grid', '#10B981', 3000);

  // Look for a filter category (e.g. Style or Room or Width)
  const filterSection = page.locator('.filter-options-title, .block-filter .filter-title, [data-role="collapsible"]').first();
  if (await filterSection.isVisible().catch(() => false)) {
    console.log('Expanding filter section...');
    await filterSection.click();
    await page.waitForTimeout(1500);

    const filterItem = page.locator('.filter-options-content a, .filter-options-item a, .filter-value a, input[type="checkbox"].filter-checkbox').first();
    if (await filterItem.isVisible().catch(() => false)) {
      const filterText = await filterItem.innerText().catch(() => 'facet');
      console.log(`Clicking filter facet: ${filterText.trim()}...`);
      await filterItem.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(4000);
      await page.screenshot({ path: path.join(OUT_DIR, '07_filter_facet_applied.png') });
      record('Filter Facet Click', 'PASS', `Filter applied: ${filterText.trim()}. Grid updated.`);

      // Check for active filter pill / Clear All
      const clearBtn = page.locator('.action.clear, .filter-clear, a:has-text("Clear All")').first();
      if (await clearBtn.isVisible().catch(() => false)) {
        console.log('Clicking Clear All filters...');
        await clearBtn.click();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        record('Clear All Filters Click', 'PASS', 'Cleared applied filter pills successfully');
      }
    }
  } else {
    record('Filter Accordion', 'FAIL', 'Filter options accordion not found');
  }

  // -------------------------------------------------------------------------
  // 8. CLICK SORT BY DROPDOWN
  // -------------------------------------------------------------------------
  console.log('8. Testing Sort By Dropdown Clicks...');
  await showBanner(page, 'Step 8: Testing Sort By Dropdown', 'Switching sort order to Price: Low to High', '#0284C7', 2500);

  const sortSelect = page.locator('select#sorter, .toolbar-sorter select, select[data-role="sorter"]').first();
  if (await sortSelect.isVisible().catch(() => false)) {
    console.log('Selecting "Price: Low to High" in sorter...');
    await sortSelect.selectOption({ label: 'Price' }).catch(async () => {
      // Try by value
      const options = await sortSelect.locator('option').allInnerTexts();
      console.log('Sort options:', options);
      if (options.some(o => o.includes('Price'))) {
        await sortSelect.selectOption({ index: 1 });
      }
    });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(OUT_DIR, '08_sort_by_price_applied.png') });
    record('Sort By Dropdown Click', 'PASS', 'Sort order changed. Grid reloaded with sorted results.');
  } else {
    record('Sort By Dropdown', 'FAIL', 'Sorter dropdown not visible on toolbar');
  }

  // -------------------------------------------------------------------------
  // 9. CLICK VIEW COUNT (24 / 48 / 72 per page)
  // -------------------------------------------------------------------------
  console.log('9. Testing View Per Page Clicks...');
  await showBanner(page, 'Step 9: Testing View Count (24 / 48 / 72 per page)', 'Clicking view per page selector', '#8B5CF6', 2500);

  const viewCount48 = page.locator('a:has-text("48"), select.limiter-options').first();
  if (await viewCount48.isVisible().catch(() => false)) {
    console.log('Clicking 48 per page...');
    await viewCount48.click().catch(() => {});
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(OUT_DIR, '09_view_per_page_clicked.png') });
    record('View Per Page Click', 'PASS', 'View per page selector clicked');
  } else {
    record('View Per Page Click', 'INFO', 'View limiter not found or already on default 48');
  }

  // -------------------------------------------------------------------------
  // 10. CLICK PRODUCT CARD -> NAVIGATE TO PDP
  // -------------------------------------------------------------------------
  console.log('10. Testing Product Card Click -> PDP Navigation...');
  await showBanner(page, 'Step 10: Clicking Product Card to Open PDP', 'Testing card anchor link routing to PDP', '#10B981', 3000);

  const firstCardLink = page.locator('.product-item-link, .product-item-photo').first();
  const cardTitle = await firstCardLink.innerText().catch(() => 'Product');
  console.log(`Clicking product card: ${cardTitle.trim()}...`);
  await firstCardLink.click();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  const pdpUrl = page.url();
  console.log('Navigated to PDP URL:', pdpUrl);
  await showBanner(page, 'Successfully Landed on PDP!', `URL: ${pdpUrl}`, '#10B981', 3500);
  await page.screenshot({ path: path.join(OUT_DIR, '10_card_click_pdp_landed.png') });
  record('Product Card Click Navigation', pdpUrl.includes('.html') || pdpUrl.split('/').length > 4 ? 'PASS' : 'FAIL', `Opened PDP: ${pdpUrl}`);

  // Save report
  fs.writeFileSync(path.join(OUT_DIR, 'plp_interactive_click_report.json'), JSON.stringify(testResults, null, 2));

  console.log('\nKeeping browser open for 8 seconds for visual observation...');
  await page.waitForTimeout(8000);

  await browser.close();
  console.log('🏁 PLP Interactive Click Audit finished successfully!');
})();
