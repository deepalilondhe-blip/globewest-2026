const { execSync } = require('child_process');
const path = require('path');

// Determine project based on argument (defaults to mobile-iphone17pro)
const project = process.argv[2] === 'desktop' ? 'desktop-chrome' : 'mobile-iphone17pro';

console.log(`🚀 Starting GlobeWest QA Audit for project: ${project}...`);

try {
  // Execute Playwright test. Wrap in try/catch because expected manual checks exit with code 1
  execSync(`npx playwright test tests/staging2-critical-path-nvda.spec.js --project=${project} --headed --workers=1`, { stdio: 'inherit' });
} catch (testError) {
  console.log('\n[Info] Playwright finished execution (manual steps or blockers detected). Proceeding to build dashboard...');
}

try {
  // Execute dashboard generator
  console.log('\n📊 Rebuilding and launching visual HTML dashboard...');
  execSync('node scratch/generate_dashboard.js', { stdio: 'inherit' });
} catch (dashboardError) {
  console.error(`[Error] Failed to generate dashboard: ${dashboardError.message}`);
}
