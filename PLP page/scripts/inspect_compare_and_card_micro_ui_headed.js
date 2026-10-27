const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Launching headed Chrome to inspect Compare Box & Product Card Micro-UI on mcstaging2...');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  const targetUrl = 'https://mcstaging2.globewest.com/indoor';
  console.log(`Navigating to ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  // Scroll down slightly to make sure product cards are fully loaded
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(2000);

  // Inspect the first product card and its Compare element in detail
  const cardData = await page.evaluate(() => {
    // Locate first product item
    const card = document.querySelector('.product-item, .product-item-info, .product-item-details');
    if (!card) return { error: 'No product card found' };

    // Find compare element
    const compareWrap = document.querySelector('.compare, .action.tocompare, .field.choice.compare, [data-role="add-to-links"]');
    const compareInput = document.querySelector('input[type="checkbox"][name*="compare"], input[type="checkbox"]');
    const compareLabel = document.querySelector('label[for*="compare"], .compare label, .action.tocompare span, .compare span');

    // Badges
    const badge = document.querySelector('.badge, .badge-new, .badge-customisable, .stock-badge, .product-item-photo .badge, .product-item-details .badge');
    
    // Title
    const title = document.querySelector('.product-item-name, .product-item-link');

    // Photo container
    const photo = document.querySelector('.product-item-photo, .product-image-container');

    const getStyles = (el) => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        className: el.className,
        text: el.innerText ? el.innerText.trim() : el.textContent?.trim(),
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
        borderRadius: cs.borderRadius,
        position: cs.position,
        topOffset: cs.top,
        leftOffset: cs.left,
        rightOffset: cs.right,
        bottomOffset: cs.bottom
      };
    };

    return {
      card: getStyles(document.querySelector('.product-item')),
      photo: getStyles(photo),
      compareWrap: getStyles(compareWrap),
      compareInput: getStyles(compareInput),
      compareLabel: getStyles(compareLabel),
      badge: getStyles(badge),
      title: getStyles(title)
    };
  });

  console.log('\n📊 DETAILED COMPUTED STYLES ON MCSTAGING2:');
  console.log(JSON.stringify(cardData, null, 2));

  // Save JSON report
  const outDir = path.join(__dirname, '../screenshots/micro_ui_audit');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'LIVE_COMPUTE_STYLES_MCSTG2.json'), JSON.stringify(cardData, null, 2));

  // Highlight the compare checkbox and take high-res close-up screenshot
  await page.evaluate(() => {
    const el = document.querySelector('.compare, .action.tocompare, .field.choice.compare, [data-role="add-to-links"], input[type="checkbox"]');
    if (el) {
      el.scrollIntoView({ block: 'center' });
      el.style.outline = '3px solid #EF4444';
      el.style.outlineOffset = '2px';
    }
  });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '01_LIVE_COMPARE_BOX_HIGHLIGHTED.png'), fullPage: false });

  // Close-up crop of the first product card
  const firstCard = page.locator('.product-item').first();
  if (await firstCard.isVisible()) {
    await firstCard.screenshot({ path: path.join(outDir, '02_LIVE_PRODUCT_CARD_CLOSEUP.png') });
  }

  console.log('Saved screenshots to', outDir);
  await browser.close();
})();
