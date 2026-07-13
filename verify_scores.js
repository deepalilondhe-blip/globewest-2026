const fs = require('fs');
const path = require('path');

const reportDir = './Comparison before and After snapshout';
const targetPages = [
  { file: 'lighthouse-1_homepage-report.json', label: '1. Homepage' },
  { file: 'lighthouse-2_plp-report.json', label: '2. Product Listing Page (PLP)' },
  { file: 'lighthouse-3_pdp-report.json', label: '3. Product Detail Page (PDP)' },
  { file: 'lighthouse-4_cart-report.json', label: '4. Shopping Cart Page' },
  { file: 'lighthouse-5_login-report.json', label: '5. My Account Login' },
  { file: 'lighthouse-6_trade-report.json', label: '6. B2B Trade Portal' },
  { file: 'lighthouse-7_search-report.json', label: '7. Search Results Page' },
  { file: 'lighthouse-8_static-report.json', label: '8. Blog List Page' },
  { file: 'lighthouse-9_blog_detail-report.json', label: '9. Blog Detail Page' }
];

console.log('\n======================================================');
console.log('      GLOBEWEST ACCESSIBILITY SCORE VERIFICATION      ');
console.log('======================================================\n');

let tableData = [];

targetPages.forEach(page => {
  const filePath = path.join(reportDir, page.file);
  let score = 'No Report Found';
  let isPerfect = 'N/A';

  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const rawScore = data.categories.accessibility.score;
      if (rawScore !== undefined && rawScore !== null) {
        const pctScore = Math.round(rawScore * 100);
        score = `${pctScore}/100`;
        isPerfect = pctScore === 100 ? 'YES (100%)' : 'NO';
      }
    } catch (e) {
      score = 'Error Parsing';
    }
  }

  tableData.push({
    'Page Name': page.label,
    'Current Score': score,
    '100% Compliant': isPerfect
  });
});

console.table(tableData);
console.log('\n======================================================\n');
