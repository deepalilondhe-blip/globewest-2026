const XLSX = require('xlsx');
const path = require('path');

const outPath = path.join(__dirname, 'docs', 'AU_Regression_Safeguards_Test_Cases.xlsx');

// Sheet 1: Test Case Matrix
const summaryData = [
  ['Test ID', 'Test Title', 'Priority', 'Type', 'Status'],
  ['TC-AU-SAFE-01', 'Currency & GST Invariance on PDP, PLP, and Cart', 'P1 (Critical)', 'Localization', 'PASSED'],
  ['TC-AU-SAFE-02', 'Multi-Store Session & Cookie Isolation', 'P1 (Critical)', 'Security', 'PASSED'],
  ['TC-AU-SAFE-03', 'AU Domestic Shipping & Postcode Estimator', 'P1 (Critical)', 'Freight', 'PASSED'],
  ['TC-AU-SAFE-04', 'Multi-Store Domain Routing & Canonical Scope', 'P2 (High)', 'SEO', 'PASSED'],
  ['TC-AU-SAFE-05', 'B2B Trade Portal & ABN Validation Safeguard', 'P2 (High)', 'B2B', 'PASSED'],
  ['TC-AU-SAFE-06', 'WCAG 2.2 AA Accessibility Regression Gate', 'P2 (High)', 'Accessibility', 'PASSED'],
  ['TC-AU-SAFE-07', 'AU Warehouse Stock & ETA Lead Time Scoping', 'P2 (High)', 'Inventory', 'PENDING'],
  ['TC-AU-SAFE-08', 'Multi-Store Checkout Payment Gateway Scoping', 'P1 (Critical)', 'Checkout', 'PENDING'],
  ['TC-AU-SAFE-09', 'AU Header Utility Links Verification', 'P2 (High)', 'Functional', 'PASSED'],
  ['TC-AU-SAFE-10', 'AU Footer ABN & Copyright Verification', 'P2 (High)', 'Localization', 'PASSED'],
  ['TC-AU-SAFE-11', 'Search Navigation & Fallback Scoping', 'P2 (High)', 'Search', 'PASSED']
];

// Sheet 2: Detailed Steps
const detailsData = [
  ['Test ID', 'Preconditions', 'Test Steps', 'Expected Result'],
  [
    'TC-AU-SAFE-01', 
    'AU Staging (mcstaging2.globewest.com.au) is reachable.', 
    '1. Open AU Homepage\n2. Navigate to PLP (/indoor)\n3. Inspect product card pricing visually\n4. Click on a product to open PDP\n5. Inspect price display, currency label, and tax disclaimer\n6. Add item to cart and navigate to /checkout/cart/\n7. Verify subtotal, tax, and order total lines', 
    '- Currency symbol is $ representing Australian Dollars (AUD)\n- Price format complies with AU standards (e.g., $1,290.00)\n- Product prices or summary displays "inc. GST"\n- Zero presence of USD, $US, or US tax exclusion notices'
  ],
  [
    'TC-AU-SAFE-02',
    'User has both AU staging and US staging URLs available.',
    '1. In a clean incognito window, navigate to AU Store\n2. Add product SKU to AU cart\n3. Verify Cart counter shows 1\n4. In new tab, navigate to US Store\n5. Verify US store cart starts at 0\n6. Browse US pages\n7. Return to AU tab and refresh /checkout/cart/\n8. Inspect document cookies in DevTools',
    '- AU cart remains intact with 1 item\n- US session does not inherit the AU cart\n- Session cookies are scoped strictly to their respective domains'
  ],
  [
    'TC-AU-SAFE-03',
    'An active item is in the AU cart.',
    '1. Navigate to /checkout/cart/ on AU Store\n2. Open "Estimate Shipping and Tax"\n3. Verify Country defaults to Australia (AU)\n4. Enter postcode 3000 (Melbourne, VIC) and click Estimate\n5. Verify freight quotes from AU carriers\n6. Enter US zip code 90210 with country set to Australia',
    '- Valid AU postcodes return domestic freight methods\n- Invalid/US zip formats trigger a validation error and do not query US shipping APIs'
  ],
  [
    'TC-AU-SAFE-04',
    'Browser developer tools open.',
    '1. Load AU Homepage and inspect canonical link\n2. Click 5 top navigation links\n3. Monitor address bar URL\n4. Inspect asset requests (CSS, JS, images)',
    '- Canonical URL points strictly to .globewest.com.au\n- All navigation links stay within .globewest.com.au\n- Zero hardcoded links pointing to .globewest.com (US)'
  ],
  [
    'TC-AU-SAFE-05',
    'Trade portal URL accessible.',
    '1. Navigate to AU Trade Registration\n2. Verify presence of ABN field and AU States dropdown\n3. Attempt to submit with invalid 4-digit ABN\n4. Verify field validation',
    '- AU Trade Portal displays all AU-specific compliance fields\n- US B2B registration does not replace AU ABN registration form'
  ],
  [
    'TC-AU-SAFE-06',
    'QA testing environment is ready.',
    '1. Navigate through AU templates: Homepage, PLP, PDP, Cart, Checkout, Trade\n2. Tab through interactive elements for focus states\n3. Check color contrast\n4. Ensure form inputs have visible labels',
    '- No new accessibility blockers introduced\n- Focus outlines clearly visible\n- Form fields can be easily identified'
  ],
  [
    'TC-AU-SAFE-07',
    'Access to AU PDP.',
    '1. Navigate to a product PDP\n2. Observe stock status (e.g., In Stock or Pre-Order)\n3. Compare against backend AU warehouse inventory data',
    '- Stock badges and ETA dates reflect Australian warehouse supply (Melbourne DC), not US inventory'
  ],
  [
    'TC-AU-SAFE-08',
    'User proceeds through /checkout/ on AU Store.',
    '1. Add item to cart and proceed to Shipping step\n2. Enter AU address\n3. Proceed to Payment step\n4. Inspect available payment methods',
    '- Available payment methods represent AU accounts\n- US-specific gateways or USD currency requests are not presented'
  ],
  [
    'TC-AU-SAFE-09',
    'AU Staging is reachable.',
    '1. Navigate to AU Homepage\n2. Inspect header utility links\n3. Look for "Stockists" or "Find a Stockist"\n4. Check contact phone number format',
    '- AU-specific links like Stockists remain intact on AU store\n- Contact phone number is in AU format (1800 or +61) not US format'
  ],
  [
    'TC-AU-SAFE-10',
    'AU Staging is reachable.',
    '1. Navigate to AU Homepage\n2. Scroll down to bottom\n3. Inspect copyright area text',
    '- ABN is explicitly listed in footer text\n- Copyright includes GlobeWest and current year'
  ],
  [
    'TC-AU-SAFE-11',
    'AU Staging is reachable.',
    '1. Navigate to AU Homepage\n2. Type generic term like "chair" in search\n3. Press Enter to view results\n4. Inspect resulting URL and product grid prices',
    '- User remains on globewest.com.au domain\n- Products correctly show AU pricing formatted with $ and no USD'
  ]
];

const wb = XLSX.utils.book_new();

// Sheet 1 processing
const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
ws1['!cols'] = [
  { wch: 18 }, { wch: 55 }, { wch: 15 }, { wch: 18 }, { wch: 12 }
];
XLSX.utils.book_append_sheet(wb, ws1, 'Test Case Matrix');

// Sheet 2 processing
const ws2 = XLSX.utils.aoa_to_sheet(detailsData);
ws2['!cols'] = [
  { wch: 18 }, { wch: 45 }, { wch: 70 }, { wch: 70 }
];
// Enable wrap text for detailed steps
for (let key in ws2) {
  if (key[0] === '!') continue;
  if (!ws2[key].s) ws2[key].s = {};
  ws2[key].s.alignment = { wrapText: true, vertical: 'top' };
}
XLSX.utils.book_append_sheet(wb, ws2, 'Detailed Specifications');

XLSX.writeFile(wb, outPath);
console.log(`✅ Excel created: ${outPath}`);
