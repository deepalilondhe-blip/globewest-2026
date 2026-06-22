// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('path');

test.describe('Automated Accessibility Scan on Dummy Page', () => {

  test('Run Axe-Core audit and check for violations', async ({ page }) => {
    // 1. Navigate to the dummy HTML file
    const fileUrl = `file://${path.resolve(__dirname, 'dummy-a11y.html')}`;
    await page.goto(fileUrl);
    await page.waitForLoadState('domcontentloaded');

    // 2. Wait for page elements to be visible
    await page.locator('h2').waitFor();

    // 3. Analyze the page for accessibility violations using Axe-Core
    console.log('Running Axe-Core scan...');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const violations = results.violations;
    console.log(`Scan complete. Found ${violations.length} violations.`);

    // 4. Log detailed violations to the console (which gets captured in the Playwright report)
    if (violations.length > 0) {
      violations.forEach((v, index) => {
        console.log(`\n[Violation #${index + 1}] ID: ${v.id}`);
        console.log(`Description: ${v.description}`);
        console.log(`Impact: ${v.impact}`);
        console.log(`Target element(s): ${v.nodes.map(n => n.target.join(', ')).join(' | ')}`);
      });
    }

    // 5. Assert that our page should have fewer than 3 violations for this test demo
    expect(violations.length).toBeLessThan(3);
  });
});
