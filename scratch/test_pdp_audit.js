const { chromium } = require('../GlobeWest 2026/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const url = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
  console.log('Navigating to:', url);
  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    console.log('Response status:', res.status());
    await page.waitForTimeout(3000);
    const title = await page.title();
    console.log('Page Title:', title);

    await page.screenshot({ path: '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/us_pdp_guest_desktop.png', fullPage: true });
    console.log('Screenshot saved: scratch/us_pdp_guest_desktop.png');

    // Extract DOM inspection details
    const auditData = await page.evaluate(() => {
      const results = {};
      
      // Title & Brand
      results.h1 = document.querySelector('h1')?.innerText?.trim();
      results.brand = document.querySelector('.product-info-stock-sku, .brand, .product-brand, .product-item-brand')?.innerText?.trim();
      
      // Save button
      const saveBtn = Array.from(document.querySelectorAll('a, button, span')).find(el => el.innerText && el.innerText.toLowerCase().includes('save'));
      results.saveButtonFound = !!saveBtn;
      results.saveButtonText = saveBtn?.innerText?.trim();

      // Warning section (Prop 65)
      const warningText = document.body.innerText.includes('Warning!') || document.body.innerText.includes('P65Warnings') || document.body.innerText.includes('formaldehyde');
      results.warningSectionFound = warningText;

      // Alternative products header text
      const altHeading = Array.from(document.querySelectorAll('h2, h3, h4, .title, strong')).find(el => el.innerText && el.innerText.toLowerCase().includes('alternative'));
      results.altHeadingText = altHeading?.innerText?.trim();

      // Dimension section
      const dimLabel = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('DIMENSIONS:'));
      results.dimensionSection = dimLabel?.parentElement?.innerText?.trim();

      // Check Australian spellings in the page
      const pageText = document.body.innerText;
      results.hasColour = pageText.includes('COLOUR') || pageText.includes('Colour') || pageText.includes('colour');
      results.hasCustomisable = pageText.includes('Customisable') || pageText.includes('customisable');
      results.hasCustomisation = pageText.includes('Customisation') || pageText.includes('customisation');
      results.hasEnquire = pageText.includes('Enquire') || pageText.includes('enquire');

      // Check placeholder images
      const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        isPlaceholder: img.src.includes('placeholder') || img.src.includes('coming-soon') || img.alt.includes('Coming Soon') || (img.naturalWidth === 0 && img.complete)
      }));
      results.placeholderImages = imgs.filter(i => i.isPlaceholder);

      // Check buttons present
      results.buttons = Array.from(document.querySelectorAll('button, a.action')).map(b => b.innerText?.trim()).filter(Boolean);

      return results;
    });

    console.log('Audit Data:', JSON.stringify(auditData, null, 2));

  } catch (err) {
    console.error('Error during audit:', err);
  } finally {
    await browser.close();
  }
})();
