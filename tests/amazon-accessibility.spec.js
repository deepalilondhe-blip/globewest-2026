// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Amazon Public Accessibility Scan (Demo)', () => {

  test('Run Axe-Core audit on Amazon homepage', async ({ page }) => {
    // 1. Configure standard user agent to minimize robot checks
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    // 2. Navigate to Amazon homepage
    console.log('Navigating to Amazon...');
    await page.goto('https://www.amazon.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Check if we hit a bot captcha page
    const bodyText = await page.innerText('body');
    if (bodyText.includes('enter the characters you see below') || bodyText.includes('Robot Check')) {
      console.warn('Note: Amazon displayed a Bot Captcha page. Scanning the Captcha page for accessibility instead.');
    } else {
      console.log('Successfully loaded Amazon homepage.');
    }

    // 3. Run Axe accessibility check
    console.log('Running Axe-Core scan on loaded page...');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const violations = results.violations;
    console.log(`Scan complete. Found ${violations.length} accessibility violations.`);

    // 4. Log detailed violations for the report
    if (violations.length > 0) {
      violations.forEach((v, index) => {
        console.log(`\n[Violation #${index + 1}] ID: ${v.id}`);
        console.log(`Description: ${v.description}`);
        console.log(`Impact: ${v.impact}`);
        console.log(`Help URL: ${v.helpUrl}`);
        console.log(`Target: ${v.nodes.map(n => n.target.join(', ')).join(' | ')}`);
      });
    }

    // 5. Assert that the page is scanned successfully
    expect(results).toBeDefined();
  });
});
