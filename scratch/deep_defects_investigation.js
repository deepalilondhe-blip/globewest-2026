const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/deep_defects_investigation';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Running Deep Forensic PDP Defect Audit...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Login as Trade customer
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Logging in as Trade Customer...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2, button[type="submit"].login');
  await page.waitForTimeout(6000);

  const cookies = await context.cookies();

  // Test Desktop & Mobile
  const viewports = [
    { name: 'desktop', width: 1440, height: 900, isMobile: false },
    { name: 'mobile', width: 390, height: 844, isMobile: true }
  ];

  const pdpUrl = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';

  for (const vp of viewports) {
    console.log(`\nInspecting PDP on ${vp.name}...`);
    const vpContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile
    });
    await vpContext.addCookies(cookies);
    const p = await vpContext.newPage();

    await p.goto(pdpUrl, { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(5000);

    // Capture initial full page
    await p.screenshot({ path: path.join(OUT_DIR, `${vp.name}_full_page.png`), fullPage: true });

    // Inspect Swatches
    console.log(`Auditing Swatches on ${vp.name}...`);
    const swatchData = await p.evaluate(() => {
      const swatchContainer = document.querySelector('.swatch-attribute.color, .swatch-attribute[attribute-code="color"]');
      const swatches = Array.from(document.querySelectorAll('.swatch-option')).map(s => ({
        label: s.getAttribute('aria-label') || s.getAttribute('data-option-label'),
        type: s.getAttribute('data-option-type'),
        value: s.getAttribute('data-option-value'),
        bgImage: window.getComputedStyle(s).backgroundImage,
        bgColor: window.getComputedStyle(s).backgroundColor,
        border: window.getComputedStyle(s).border,
        outline: window.getComputedStyle(s).outline,
        selected: s.classList.contains('selected')
      }));

      // Check the black horizontal line that intersects COLOUR:
      const colourLabel = document.querySelector('.swatch-attribute-label, .swatch-attribute.color .swatch-attribute-label');
      const hrLine = document.querySelector('.product-info-main hr, .swatch-attribute hr, .product-add-form hr');

      // Check Compare Products dropdown
      const compareBox = document.querySelector('.block.block-compare, .action.compare, [data-role="compare-products-sidebar"]');

      // Check Download Brochure link
      const brochureLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText && a.innerText.toLowerCase().includes('download brochure'));

      // Check Warranty link
      const warrantyLink = Array.from(document.querySelectorAll('a')).find(a => a.innerText && a.innerText.toLowerCase().includes('warranty policy'));

      // Check Lower Tabs
      const tabs = Array.from(document.querySelectorAll('.data.items [data-role="collapsible"], .product.data.items .item.title')).map(t => t.innerText.trim());

      return {
        swatchCount: swatches.length,
        swatches,
        colourLabelHTML: colourLabel ? colourLabel.outerHTML : null,
        colourLabelStyles: colourLabel ? {
          position: window.getComputedStyle(colourLabel).position,
          borderBottom: window.getComputedStyle(colourLabel).borderBottom,
          lineHeight: window.getComputedStyle(colourLabel).lineHeight
        } : null,
        compareBoxHTML: compareBox ? compareBox.outerHTML.substring(0, 300) : 'NOT_FOUND',
        brochureHref: brochureLink ? brochureLink.href : 'NOT_FOUND',
        warrantyHref: warrantyLink ? warrantyLink.href : 'NOT_FOUND',
        tabs
      };
    });

    console.log(`Swatch & Element data on ${vp.name}:\n`, JSON.stringify(swatchData, null, 2));

    // Test clicking 2nd and 4th swatch to verify swatch switching behavior
    if (!vp.isMobile) {
      console.log('Testing Swatch Click on Desktop...');
      const swatchOptions = p.locator('.swatch-option');
      const count = await swatchOptions.count();
      if (count > 1) {
        // Click 1st swatch: Natural Ash
        await swatchOptions.nth(0).click();
        await p.waitForTimeout(2000);
        await p.screenshot({ path: path.join(OUT_DIR, 'desktop_swatch_1_natural_ash.png') });

        // Click 4th swatch: Tobacco Ash
        await swatchOptions.nth(3).click();
        await p.waitForTimeout(2000);
        await p.screenshot({ path: path.join(OUT_DIR, 'desktop_swatch_4_tobacco_ash.png') });
      }
    } else {
      // On mobile, test clicking swatch and inspect Compare Products overlap
      console.log('Inspecting Mobile Compare Products element...');
      const mobileCompare = await p.evaluate(() => {
        const titleEl = document.querySelector('h1.page-title, h1');
        const compareEl = document.querySelector('.compare, .action.compare, [data-role="compare-products-sidebar"], select, .block-compare');
        let overlap = false;
        if (titleEl && compareEl) {
          const tRect = titleEl.getBoundingClientRect();
          const cRect = compareEl.getBoundingClientRect();
          overlap = !(cRect.right < tRect.left || cRect.left > tRect.right || cRect.bottom < tRect.top || cRect.top > tRect.bottom);
        }
        return {
          titleHTML: titleEl ? titleEl.outerHTML : null,
          compareHTML: compareEl ? compareEl.outerHTML : null,
          overlap
        };
      });
      console.log('Mobile Compare overlap inspection:\n', JSON.stringify(mobileCompare, null, 2));
    }

    await vpContext.close();
  }

  await browser.close();
  console.log('🏁 Deep defect audit completed successfully!');
})();
