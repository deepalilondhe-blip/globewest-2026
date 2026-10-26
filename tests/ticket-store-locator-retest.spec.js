const { test, expect } = require('@playwright/test');

test.use({ channel: 'chrome' });

test.describe('Ticket #41794539 - Store Locator Live Retest Suite', () => {
  const TARGET_URL = 'https://mcstaging2.globewest.com/locator';

  test('Desktop Retest: Verify Fixed Items and Open Defects', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3000);

    // 1. VERIFY FIXED: Document <title>
    const title = await page.title();
    console.log(`Document Title: "${title}"`);
    expect(title).toContain('Find a Stockist & Showroom | GlobeWest');

    // 2. VERIFY FIXED: US Postcode Placeholder
    const placeholder = await page.getAttribute('input[placeholder*="90210"], input[placeholder*="3000"], .input-text', 'placeholder').catch(() => null);
    const allPlaceholders = await page.$$eval('input', inputs => inputs.map(i => i.placeholder));
    console.log('Detected Placeholders:', allPlaceholders);
    expect(allPlaceholders).toContain('Eg. 90210');
    expect(allPlaceholders).not.toContain('Eg.3000');

    // 3. VERIFY FIXED: CMS Block Heading without "- us"
    const headings = await page.$$eval('h1, h2, h3, h4', els => els.map(e => e.innerText.trim()));
    console.log('Detected Headings:', headings);
    expect(headings).toContain('How to Buy with a Stockist');
    const hasUsSuffix = headings.some(h => h.toLowerCase().includes('- us'));
    expect(hasUsSuffix).toBeFalsy();

    // 4. CHECK REMAINING DEFECT: Google Maps Canvas (P0 Blocker)
    const mapError = consoleErrors.find(e => e.includes('RefererNotAllowedMapError'));
    if (mapError) {
      console.warn('⚠️ KNOWN P0 DEFECT PERSISTS: Google Maps JavaScript API RefererNotAllowedMapError detected.');
    }

    // 5. CHECK REMAINING DEFECT: Intro Australia Reference
    const bodyText = await page.innerText('body');
    if (bodyText.includes("Australia's finest furniture")) {
      console.warn('⚠️ KNOWN P1 DEFECT PERSISTS: Australian regional reference leaks in intro copy.');
    }

    // 6. CHECK REMAINING DEFECT: Spelling "finalise"
    if (bodyText.includes('finalise')) {
      console.warn('⚠️ KNOWN P2 DEFECT PERSISTS: Australian spelling "finalise" present instead of "finalize".');
    }
  });

  test('Mobile View Retest (375x812 iPhone)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3000);

    // Check placeholder on mobile
    const allPlaceholders = await page.$$eval('input', inputs => inputs.map(i => i.placeholder));
    expect(allPlaceholders).toContain('Eg. 90210');

    // Check heading on mobile
    const headings = await page.$$eval('h1, h2, h3, h4', els => els.map(e => e.innerText.trim()));
    expect(headings).toContain('How to Buy with a Stockist');
  });
});
