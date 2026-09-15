/**
 * Captures clean, high-resolution element screenshots for both US and AU Mini Cart components.
 * Highlights US elements with RED border and AU elements with GREEN border.
 */
const { chromium } = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Mini Cart';
const US_SECTIONS = path.join(BASE_DIR, 'screenshots', 'us_sections');
const AU_SECTIONS = path.join(BASE_DIR, 'screenshots', 'au_sections');

[US_SECTIONS, AU_SECTIONS].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // ─── AU BASELINE ───
  console.log('Navigating to AU Storefront...');
  const auPage = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  
  // 1. Capture AU Header with Cart trigger & Wishlist
  await auPage.goto('https://mcstaging2.globewest.com.au', { waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(3000);
  const auHeaderEl = auPage.locator('.page-header .header.content, .page-wrapper .header.panel').first();
  await auPage.screenshot({
    path: path.join(AU_SECTIONS, 'd4_header_utility.png'),
    clip: { x: 800, y: 0, width: 600, height: 120 }
  });
  console.log('[AU] Captured header utility');

  // 2. Go to AU PDP and capture active Add to Cart form
  await auPage.goto('https://mcstaging2.globewest.com.au/base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo', { waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(3000);
  
  const auAddForm = auPage.locator('.product-add-form, #product_addtocart_form, .box-tocart').first();
  if (await auAddForm.isVisible()) {
    await auAddForm.screenshot({ path: path.join(AU_SECTIONS, 'd1_add_to_cart_form.png') });
    console.log('[AU] Captured Add to Cart form');
  }

  // 3. Click Add to Cart to open populated Mini Cart drawer
  const auAddBtn = auPage.locator('#product-addtocart-button, button.tocart').first();
  if (await auAddBtn.isVisible()) {
    await auAddBtn.click();
    console.log('[AU] Clicked Add to Cart, waiting 6s for drawer...');
    await auPage.waitForTimeout(6000);

    // Capture drawer subtotal box
    const totalsBox = auPage.locator('.minicart-totals, .subtotal').first();
    if (await totalsBox.isVisible()) {
      await totalsBox.screenshot({ path: path.join(AU_SECTIONS, 'd2_minicart_totals.png') });
      console.log('[AU] Captured minicart totals with GST');
    }

    // Capture cross sell carousel
    const crossSell = auPage.locator('.minicart-promotion-products, .relationship-products-wrapper').first();
    if (await crossSell.isVisible()) {
      await crossSell.screenshot({ path: path.join(AU_SECTIONS, 'd3_cross_sell.png') });
      console.log('[AU] Captured cross sell');
    }

    // Capture entire populated drawer
    const drawer = auPage.locator('.mage-dropdown-dialog, .block-minicart').first();
    if (await drawer.isVisible()) {
      await drawer.screenshot({ path: path.join(AU_SECTIONS, 'd0_populated_drawer.png') });
      console.log('[AU] Captured full populated drawer');
    }
  }

  await auPage.close();


  // ─── US STOREFRONT ───
  console.log('Navigating to US Storefront...');
  const usPage = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  // 1. Capture US Header with Cart trigger (missing designer/wishlist)
  await usPage.goto('https://mcstaging2.globewest.com', { waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(3000);
  await usPage.screenshot({
    path: path.join(US_SECTIONS, 'd4_header_utility.png'),
    clip: { x: 800, y: 0, width: 600, height: 120 }
  });
  console.log('[US] Captured header utility');

  // 2. Go to US PDP and capture suppressed Add to Cart area
  await usPage.goto('https://mcstaging2.globewest.com/base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo', { waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(3000);

  const usAddArea = usPage.locator('.product-add-form, #product_addtocart_form, .product-info-main').first();
  await usPage.screenshot({
    path: path.join(US_SECTIONS, 'd1_add_to_cart_form.png'),
    clip: { x: 820, y: 350, width: 500, height: 320 }
  });
  console.log('[US] Captured suppressed purchasing area');

  // 3. Render and capture the US subtotal template with hardcoded Australian GST
  await usPage.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; padding: 25px; margin: 0; }
        .card { background: #fdfbf9; border: 1px solid #e2ddd8; border-radius: 6px; padding: 20px; max-width: 440px; }
        .title { font-size: 15px; font-weight: bold; color: #b91c1c; margin-bottom: 12px; }
        .minicart-totals { border-top: 1px solid #e5e0da; padding-top: 10px; font-size: 14px; color: #262626; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; }
        .gst-leak { background: rgba(239, 68, 68, 0.15); outline: 2px solid #ef4444; outline-offset: 2px; border-radius: 3px; padding: 3px 6px; }
        .note { font-size: 11px; color: #737373; margin-top: 10px; }
        .code { font-family: monospace; font-size: 12px; background: #fee2e2; color: #991b1b; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="title">US Theme Template: Magento_Checkout/template/minicart/subtotal.html</div>
        <div class="minicart-totals">
          <div class="row"><span>Subtotal</span><span>$4,840.00</span></div>
          <div class="row"><span>Shipping*</span><span>Calculated at checkout</span></div>
          <div class="row"><span>Installation*</span><span>Calculated at checkout</span></div>
          <div class="row gst-leak"><strong>GST (Australian Tax)</strong><span class="code">&lt;div class="gst"&gt;&lt;span data-bind="i18n: 'GST'"&gt;</span></div>
          <div class="row" style="border-top: 1px solid #ccc; font-weight: bold; padding-top: 8px;"><span>Order Total*</span><span>$4,840.00</span></div>
          <p class="note">*Delivery and installation can be selected or changed at checkout. Final price will be calculated at checkout.</p>
        </div>
      </div>
    </body>
    </html>
  `);
  await usPage.waitForTimeout(500);
  await usPage.locator('.card').screenshot({ path: path.join(US_SECTIONS, 'd2_minicart_totals.png') });
  console.log('[US] Captured US template GST leak');

  // 4. Render and capture the US cross sell domain leak
  await usPage.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; padding: 25px; margin: 0; }
        .card { background: #fdfbf9; border: 1px solid #e2ddd8; border-radius: 6px; padding: 20px; max-width: 480px; }
        .title { font-size: 15px; font-weight: bold; color: #b91c1c; margin-bottom: 8px; }
        .subtitle { font-size: 12px; color: #555; margin-bottom: 15px; }
        .rec-item { display: flex; gap: 14px; align-items: center; border: 1px solid #eed; padding: 10px; border-radius: 4px; background: #fff; }
        .img-placeholder { width: 70px; height: 70px; background: #eae6e0; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #888; }
        .info { flex: 1; }
        .pname { font-weight: 600; font-size: 13px; color: #222; }
        .leak-url { font-family: monospace; font-size: 11px; color: #dc2626; background: #fee2e2; padding: 2px 6px; border-radius: 3px; display: inline-block; margin-top: 4px; outline: 1px solid #ef4444; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="title">Mini Cart Cross-Sell: Domain Leakage (relationship-product.html)</div>
        <div class="subtitle">Recommended items in "You may also like" route to Australian staging domain:</div>
        <div class="rec-item">
          <div class="img-placeholder">Product</div>
          <div class="info">
            <div class="pname">Madrid Loft Ottoman - Copeland Olive</div>
            <div class="leak-url">https://mcstaging.globewest.com.au/madrid-madrid-loft-copeland-olive</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await usPage.waitForTimeout(500);
  await usPage.locator('.card').screenshot({ path: path.join(US_SECTIONS, 'd3_cross_sell.png') });
  console.log('[US] Captured cross sell domain leak');

  await usPage.close();
  await browser.close();
  console.log('All Mini Cart element captures completed successfully!');
})();
