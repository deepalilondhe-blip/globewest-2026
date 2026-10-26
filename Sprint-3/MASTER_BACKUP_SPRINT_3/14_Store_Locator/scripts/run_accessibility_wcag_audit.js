const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '../accessibility_audit_results.json');

(async () => {
  console.log('========================================================================');
  console.log('♿ WCAG 2.2 AA ACCESSIBILITY AUDIT: STORE LOCATOR');
  console.log('Target: https://mcstaging2.globewest.com/locator');
  console.log('Standard: WCAG 2.0 / 2.1 / 2.2 AA Compliance');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Run Axe scan targeting WCAG 2.2 AA
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();

  console.log(`Scan Complete! Found ${accessibilityScanResults.violations.length} accessibility violation categories.`);

  const summary = accessibilityScanResults.violations.map(v => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    helpUrl: v.helpUrl,
    nodesCount: v.nodes.length,
    targets: v.nodes.map(n => n.target).slice(0, 3)
  }));

  console.log('\nViolation Summary:');
  console.log(JSON.stringify(summary, null, 2));

  fs.writeFileSync(OUT_FILE, JSON.stringify(accessibilityScanResults, null, 2));
  console.log(`\nDetailed report saved to: ${OUT_FILE}`);

  await browser.close();
})();
