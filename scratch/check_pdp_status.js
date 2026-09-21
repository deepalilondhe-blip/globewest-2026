const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    console.log('Navigating to live PDP URL...');
    await page.goto('https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat', { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(4000);

    // 1. Check tabs
    const tabData = await page.evaluate(() => {
      const titles = Array.from(document.querySelectorAll('.product.data.items .item.title, [role="tablist"] [role="tab"], .data.item.title')).map(e => e.innerText.trim());
      const tabsContainer = document.querySelector('.product.data.items');
      return {
        titles,
        containerFound: !!tabsContainer
      };
    });
    console.log('--- PRODUCT TABS ---');
    console.log(JSON.stringify(tabData, null, 2));

    // 2. Check Brochures & Downloads tab and PDF link
    const pdfData = await page.evaluate(() => {
      const pdfLinks = Array.from(document.querySelectorAll('a[href*=".pdf"], a[href*="brochure"], a[href*="download"]')).map(a => ({
        href: a.href,
        text: a.innerText.trim()
      }));
      return pdfLinks;
    });
    console.log('--- PDF / BROCHURE LINKS ---');
    console.log(JSON.stringify(pdfData, null, 2));

    // 3. Check Prop 65 warning
    const prop65Data = await page.evaluate(() => {
      const p65El = Array.from(document.querySelectorAll('*')).find(e => e.innerText && e.innerText.includes('P65Warnings.ca.gov'));
      return {
        found: !!p65El,
        tag: p65El ? p65El.tagName : null,
        text: p65El ? p65El.innerText.trim() : null
      };
    });
    console.log('--- PROP 65 WARNING ---');
    console.log(JSON.stringify(prop65Data, null, 2));

    // 4. Check Stock Availability & ETA placement
    const stockEtaData = await page.evaluate(() => {
      const rightCol = document.querySelector('.product-info-main');
      if (!rightCol) return { error: 'product-info-main not found' };

      const addToCart = rightCol.querySelector('.action.primary.tocart, #product-addtocart-button');
      const addToQuote = rightCol.querySelector('.action.secondary.toquote, [data-role="add-to-quote"]');
      const brochureLink = rightCol.querySelector('a[href*="brochure"], .download-brochure');

      // Let's find any stock or ETA text
      const allText = rightCol.innerText;
      const etaElements = Array.from(rightCol.querySelectorAll('[class*="stock"], [class*="eta"], .availability, .notify-me, [data-role="stock"]')).map(e => ({
        className: e.className,
        text: e.innerText.trim()
      }));

      return {
        hasAddToCart: !!addToCart,
        hasAddToQuote: !!addToQuote,
        hasBrochureLink: !!brochureLink,
        etaElements,
        infoSnippet: allText
      };
    });
    console.log('--- STOCK & ETA ---');
    console.log(JSON.stringify(stockEtaData, null, 2));

    await browser.close();
  } catch (err) {
    console.error('Error checking PDP:', err);
  }
})();
