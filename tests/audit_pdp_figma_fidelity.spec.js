// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_BASE_URL = 'https://mcstaging2.globewest.com';
const PDP_URL = `${US_BASE_URL}/artifact-small-floor-sculpture-smoked-teak-dec-arti-flr-scul-sm-smoked-teak`;

test('Full PDP Figma Audit - Guest vs Trade', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });

  console.log('\n============================================================');
  console.log('🔍 RUNNING COMPREHENSIVE PDP FIGMA FIDELITY AUDIT');
  console.log('============================================================\n');

  // -------------------------------------------------------------------------
  // 1. GUEST MODE AUDIT
  // -------------------------------------------------------------------------
  console.log('--- 1. AUDITING PDP IN GUEST MODE ---');
  await page.goto(PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const guestAudit = await page.evaluate(() => {
    const topBar = document.querySelector('.panel.header, .header__utility, .header-panel');
    const becomeTrade = document.body.innerText.includes('Become a Trade Customer');
    const bookShowroom = document.body.innerText.includes('Book Showroom');
    
    const breadcrumbs = document.querySelector('.breadcrumbs');
    const gallery = document.querySelector('.gallery-placeholder, .fotorama, .product.media');
    const mainImg = document.querySelector('.gallery-placeholder__image, .fotorama__img, .product.media img');
    const isPlaceholder = mainImg ? (mainImg.src.includes('placeholder') || mainImg.src.includes('coming-soon')) : false;

    const title = document.querySelector('.page-title');
    const titleFont = title ? window.getComputedStyle(title).fontFamily : '';
    const titleSize = title ? window.getComputedStyle(title).fontSize : '';

    const sku = document.querySelector('.product.attribute.sku, [itemprop="sku"]');
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const priceText = priceBox ? priceBox.innerText.trim() : '';
    const hasDollar = document.querySelector('.product-info-main')?.innerText.includes('$') || false;

    const addToCartBtn = document.querySelector('#product-addtocart-button, .action.tocart.primary');
    const addToQuoteBtn = document.querySelector('[data-role="quote"], .action.toquote, .action.quote');

    const swatches = document.querySelectorAll('.swatch-option, .swatch-attribute');
    const brochure = document.querySelector('a[href*="brochure"], .action.download-brochure');
    const warranty = document.body.innerText.includes('warranty') || document.body.innerText.includes('Warranty');
    const prop65 = document.body.innerText.includes('Proposition 65') || document.body.innerText.includes('P65Warnings') || document.body.innerText.includes('formaldehyde');

    const tabs = Array.from(document.querySelectorAll('.data.items .item.title, .product.info.detailed .item.title')).map(t => t.innerText.trim());

    return {
      topBar: {
        present: !!topBar,
        becomeTrade,
        bookShowroom
      },
      breadcrumbs: {
        present: !!breadcrumbs,
        text: breadcrumbs ? breadcrumbs.innerText.trim() : ''
      },
      gallery: {
        present: !!gallery,
        imgSrc: mainImg ? mainImg.src : '',
        isPlaceholder
      },
      title: {
        text: title ? title.innerText.trim() : '',
        fontFamily: titleFont,
        fontSize: titleSize
      },
      sku: {
        present: !!sku,
        text: sku ? sku.innerText.trim() : ''
      },
      pricing: {
        hasDollarSign: hasDollar,
        priceText,
        priceBoxPresent: !!priceBox
      },
      actions: {
        addToCartPresent: !!addToCartBtn,
        addToQuotePresent: !!addToQuoteBtn
      },
      swatchesCount: swatches.length,
      brochurePresent: !!brochure,
      warrantyPresent: warranty,
      prop65Present: prop65,
      tabs
    };
  });

  console.log('Guest PDP Audit Result:\n', JSON.stringify(guestAudit, null, 2));

  // -------------------------------------------------------------------------
  // 2. LOGGED-IN TRADE CUSTOMER AUDIT
  // -------------------------------------------------------------------------
  console.log('\n--- 2. AUDITING PDP IN LOGGED-IN TRADE MODE ---');
  await page.goto(`${US_BASE_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const emailField = page.locator('#email, input[name="login[username]"]').first();
  const passField = page.locator('#pass, input[name="login[password]"]').first();
  const submitBtn = page.locator('#send2, button.action.login.primary').first();

  if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
    await emailField.fill('deepali.londhe@overdose.digital');
    await passField.fill('Deep@123');
    await submitBtn.click();
    await page.waitForTimeout(4000);
  }

  await page.goto(PDP_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const tradeAudit = await page.evaluate(() => {
    const toggle = document.querySelector('.pricing-toggle, .trade-toggle, [data-role="pricing-toggle"]') || document.querySelector('.header__utility');
    const toggleText = toggle ? toggle.innerText : '';
    
    const priceBox = document.querySelector('.price-box, .product-info-price');
    const priceText = priceBox ? priceBox.innerText.trim() : '';

    const addToCartBtn = document.querySelector('#product-addtocart-button, .action.tocart.primary');
    const addToQuoteBtn = document.querySelector('[data-role="quote"], .action.toquote, .action.quote');
    const qtyBox = document.querySelector('#qty, input[name="qty"]');

    const stockStatus = document.querySelector('.stock.available, .availability, [class*="stock"]');
    const stockText = stockStatus ? stockStatus.innerText.trim() : '';

    return {
      toggleFound: !!toggle,
      toggleText,
      priceText,
      addToCartVisible: !!addToCartBtn && window.getComputedStyle(addToCartBtn).display !== 'none',
      addToQuoteVisible: !!addToQuoteBtn && window.getComputedStyle(addToQuoteBtn).display !== 'none',
      qtyBoxVisible: !!qtyBox,
      stockText
    };
  });

  console.log('Trade PDP Audit Result:\n', JSON.stringify(tradeAudit, null, 2));
});
