const { test, expect } = require('@playwright/test');

test('Debug swatch click on Theron Zenith Sculpture', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(`[Console ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[PageError] ${err.message}`));

  console.log('Navigating to PLP...');
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'networkidle' });
  
  // Find a product card that specifically has swatches
  console.log('Looking for a product card with swatches...');
  const productCard = page.locator('.product-item-info:has(.swatch-option)').first();
  await productCard.waitFor({ timeout: 15000 });
  
  // Find swatches inside the product card
  const swatches = productCard.locator('.swatch-option.image, .swatch-option.color');
  const swatchCount = await swatches.count();
  console.log(`Found ${swatchCount} swatches on the first product card.`);
  
  if (swatchCount > 0) {
    // Get initial main image src
    const mainImage = productCard.locator('.product-image-photo').first();
    const initialSrc = await mainImage.getAttribute('src');
    console.log(`Initial image src: ${initialSrc}`);
    
    // Click the second swatch if available, else first
    const indexToClick = swatchCount > 1 ? 1 : 0;
    console.log(`Clicking swatch index ${indexToClick}...`);
    await swatches.nth(indexToClick).click();
    
    // Wait a moment for any JS to run
    await page.waitForTimeout(2000);
    
    // Check if image src changed
    const newSrc = await mainImage.getAttribute('src');
    console.log(`New image src: ${newSrc}`);
    
    if (initialSrc !== newSrc) {
      console.log('✅ Swatch click SUCCESS: Main image updated.');
    } else {
      console.log('❌ Swatch click FAILED: Main image did NOT update.');
    }
  } else {
    console.log('No swatches found on this product.');
  }

  console.log('--- Browser Logs ---');
  console.log(logs.join('\n'));
});
