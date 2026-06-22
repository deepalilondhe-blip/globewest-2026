// @ts-check
const { nvdaTest: test } = require('@guidepup/playwright');
const { expect } = require('@playwright/test');

test.describe('Automated Audible Screen Reader Journey', () => {

  test('Fully automated multi-page navigation check', async ({ page, nvda }) => {
    // 1. Navigate to W3C bad accessibility demo page
    console.log('Navigating to W3C Demo Page...');
    await page.goto('https://www.w3.org/WAI/demos/bad/before/home.html');
    await page.waitForLoadState('domcontentloaded');

    // 2. Ensure browser window is active and has system focus
    await page.bringToFront();
    await page.locator('body').click();
    
    // 3. Wait for NVDA to initialize and automatically dismiss welcome dialog
    console.log('Waiting 5s for NVDA initialization...');
    await page.waitForTimeout(5000);

    console.log('Dismissing welcome dialog...');
    await nvda.press('Enter');
    await page.waitForTimeout(2000);

    // 4. Clear speech log
    await nvda.clearSpokenPhraseLog();

    // 5. Navigate through home page links using Tab key
    console.log('Tabbing through header links...');
    await nvda.press('Tab');
    await page.waitForTimeout(2500);

    await nvda.press('Tab');
    await page.waitForTimeout(2500);

    // 6. Click the "News" menu link automatically
    console.log('Clicking the "News" page link...');
    await page.click('a[href="news.html"]');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('body').click(); // Re-focus body
    await page.waitForTimeout(4000); // Allow NVDA to read the new page content

    // 7. Click the "Tickets" menu link automatically
    console.log('Clicking the "Tickets" page link...');
    await page.click('a[href="tickets.html"]');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('body').click();
    await page.waitForTimeout(4000); // Allow NVDA to read the new page content

    // 8. Output all spoken phrases to console
    const spokenPhrases = await nvda.spokenPhraseLog();
    console.log(`\n--- NVDA SPOKEN PHRASES LOG ---`);
    console.log(spokenPhrases.join(' | '));
    console.log(`--------------------------------\n`);

    // ASSERTION: Confirm speech was captured
    expect(spokenPhrases.length).toBeGreaterThan(0);
  });
});
