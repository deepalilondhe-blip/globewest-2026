// @ts-check
const { nvdaTest: test } = require('@guidepup/playwright');
const { expect } = require('@playwright/test');
const path = require('path');

test.describe('Automated NVDA Screen Reader Verification', () => {

  test('NVDA verification on dummy accessibility page', async ({ page, nvda }) => {
    // 1. Navigate to the local dummy-a11y.html file
    const fileUrl = `file://${path.resolve(__dirname, 'dummy-a11y.html')}`;
    await page.goto(fileUrl);
    await page.waitForLoadState('domcontentloaded');

    // 2. Wait for page header to verify load
    await page.locator('h2').waitFor();

    // 3. Ensure browser window is active
    await page.bringToFront();
    
    // 4. Wait for NVDA to fully initialize
    console.log('Waiting 5s for NVDA initialization...');
    await page.waitForTimeout(5000);

    // 5. Clear logs to ensure clean assertions
    await nvda.clearSpokenPhraseLog();

    // 6. Programmatically focus the accessible button inside the DOM
    // This triggers Chrome's accessibility event directly, forcing NVDA to read it
    console.log('Focusing the accessible button...');
    await page.focus('#accessible-btn');
    
    // Allow 3 seconds for the speech to process and be captured in the buffer
    await page.waitForTimeout(3000);

    // Read the phrases spoken by NVDA
    const spokenPhrases = await nvda.spokenPhraseLog();
    console.log(`NVDA Spoken Phrases: "${spokenPhrases.join(' | ')}"`);

    // ASSERTION: Verify NVDA announced the custom aria-label "Close Shopping Cart"
    const announcedCorrectly = spokenPhrases.some(phrase => 
      phrase.toLowerCase().includes('close shopping cart') || 
      phrase.toLowerCase().includes('shopping cart')
    );
    
    expect(announcedCorrectly).toBe(true);
  });
});
