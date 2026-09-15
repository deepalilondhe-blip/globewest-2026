const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 5 - Header';

const testCases = [
  {
    tcId: 'TC-HEADER-01',
    category: 'Top Utility Bar',
    feature: 'Showroom Booking CTA',
    description: 'Verify "Book Showroom Appointment" link is present, functional, and routes correctly on the US Storefront top utility bar.',
    preconditions: 'US Storefront (https://mcstaging2.globewest.com) is live and accessible.',
    steps: '1. Load US homepage.\n2. Inspect top utility bar.\n3. Locate "Book Showroom Appointment" link.\n4. Verify href and visibility.',
    expected: '"Book Showroom Appointment" link is visible, pointing to /online_booking/ with zero Australian leakage.',
    actual: 'Link is visible and correctly points to /online_booking/.',
    status: 'PASS',
    severity: 'P1 - High',
    visualEvidence: 'Section_Top_Bar_US.png'
  },
  {
    tcId: 'TC-HEADER-02',
    category: 'Top Utility Bar',
    feature: 'Find a Designer Service Link',
    description: 'Verify "Find a designer or stockist" service links exist on US Storefront top utility bar in parity with AU baseline.',
    preconditions: 'AU baseline displays "Find a designer or stockist" on top bar.',
    steps: '1. Load US homepage.\n2. Inspect top-left of utility bar.\n3. Verify presence of "Find a designer or stockist" links.',
    expected: 'Service links "Find a designer" and "stockist" exist and link to US trade locator.',
    actual: 'Links are missing or render an empty href="#" link on US storefront.',
    status: 'FAIL',
    severity: 'P2 - Medium',
    visualEvidence: 'DEFECT_Top_Bar_Find_Designer_Missing.png'
  },
  {
    tcId: 'TC-HEADER-03',
    category: 'Header Branding',
    feature: 'GlobeWest Brand Logo',
    description: 'Verify GlobeWest SVG/PNG logo renders crisply, links to US homepage root, and has proper alt/aria tags.',
    preconditions: 'Desktop viewport 1440x900.',
    steps: '1. Locate header logo container.\n2. Inspect href attribute.\n3. Verify image asset URL and dimension.',
    expected: 'Logo links strictly to https://mcstaging2.globewest.com/ with no .com.au domain.',
    actual: 'Logo correctly points to https://mcstaging2.globewest.com/.',
    status: 'PASS',
    severity: 'P1 - High',
    visualEvidence: 'Section_Header_Utilities_US.png'
  },
  {
    tcId: 'TC-HEADER-04',
    category: 'Header Search',
    feature: 'Overdose Algolia Search Trigger',
    description: 'Verify Search trigger input opens the Algolia search autocomplete overlay without JavaScript errors.',
    preconditions: 'Algolia search extension configured on staging.',
    steps: '1. Click into search trigger field.\n2. Verify search modal opens.\n3. Press Escape to close.',
    expected: 'Search input triggers interactive modal overlay with instant product search results.',
    actual: 'Search trigger renders and is functional.',
    status: 'PASS',
    severity: 'P1 - High',
    visualEvidence: 'Section_Header_Utilities_US.png'
  },
  {
    tcId: 'TC-HEADER-05',
    category: 'Header Utilities',
    feature: 'Wishlist & Cart Icons',
    description: 'Verify Wishlist heart icon and Mini Cart bag icon are present in header utility cluster.',
    preconditions: 'Standard Magento Luma/Overdose theme customer data module.',
    steps: '1. Inspect right-hand utility section.\n2. Verify Wishlist anchor.\n3. Verify Mini Cart anchor and item counter.',
    expected: 'Wishlist and Mini Cart icons render with valid US store endpoints.',
    actual: 'Both icons render properly and route internally.',
    status: 'PASS',
    severity: 'P2 - Medium',
    visualEvidence: 'Section_Header_Utilities_US.png'
  },
  {
    tcId: 'TC-HEADER-06',
    category: 'Navigation',
    feature: 'Top-Level Menu Scope (9 Items)',
    description: 'Verify all 9 top-level navigation categories are present, visible, and route to US URLs.',
    preconditions: 'Desktop viewport 1440x900.',
    steps: '1. Inspect .navigation .level0 menu items.\n2. Assert 9 categories: Indoor, Outdoor, Homewares, In Stock, Customisation, Projects, Inspiration, Support, Contact.\n3. Check hrefs.',
    expected: 'All 9 categories render and link to US store paths.',
    actual: 'All 9 categories render correctly. Homewares links to /homewares (HTTP 200 OK verified; /homeware is 404). Not a defect.',
    status: 'PASS',
    severity: 'P1 - High',
    visualEvidence: 'Section_Top_Nav_Row_US.png'
  },
  {
    tcId: 'TC-HEADER-07',
    category: 'Mega Menu',
    feature: 'Indoor Submenu Multi-Level Drilldown',
    description: 'Verify hovering Indoor expands mega menu; hovering Furniture reveals level-2 subcategories (Sofas, Dining, etc.).',
    preconditions: 'Mega menu JS initialized.',
    steps: '1. Hover "Indoor" menu item.\n2. Hover "Furniture" subcategory.\n3. Assert child subcategories populate in column 2.',
    expected: 'Mega menu expands smoothly into columns; subcategories become visible upon hover.',
    actual: 'Mega menu expands and subcategories populate as expected.',
    status: 'PASS',
    severity: 'P1 - High',
    visualEvidence: 'Section_Mega_Menu_Indoor_US.png'
  },
  {
    tcId: 'TC-HEADER-08',
    category: 'Mega Menu',
    feature: 'Editorial Campaign Promo Banner',
    description: 'Verify mega menu right column displays active editorial campaign card in parity with AU baseline.',
    preconditions: 'AU baseline displays "Out Now - Explore Collections 2025 Volume #02".',
    steps: '1. Hover "Indoor" to open mega menu.\n2. Inspect rightmost promotional column.\n3. Verify promotional graphic and CTA.',
    expected: 'Active US promotional campaign card renders with high-res imagery and US catalog CTA.',
    actual: 'Renders unpopulated "GW Coming Soon" placeholder card with blank text.',
    status: 'FAIL',
    severity: 'P2 - Medium',
    visualEvidence: 'Section_Mega_Menu_Promo_US.png'
  },
  {
    tcId: 'TC-HEADER-09',
    category: 'Scope Integrity',
    feature: '🚨 Australian Outlet Links Leakage (5 Links)',
    description: 'Audit all mega menu links for Australian domain leakage (.globewest.com.au / globewestoutlet.com.au).',
    preconditions: 'Mega menu submenus opened.',
    steps: '1. Query all anchor href attributes in navigation.\n2. Regex scan for .globewest.com.au and globewestoutlet.com.au.\n3. Identify offending links.',
    expected: 'ZERO Australian domain links in US storefront navigation.',
    actual: '🚨 CRITICAL DEFECT: 5 hardcoded Australian Outlet links detected in navigation (Indoor, Outdoor, Homewares, In Stock, Melbourne Outlet Store).',
    status: 'FAIL',
    severity: 'P1 - High',
    visualEvidence: 'DEFECT_Mega_Menu_Outlet_AU_Leak.png'
  },
  {
    tcId: 'TC-HEADER-10',
    category: 'Scope Integrity',
    feature: '🚨 Melbourne Physical Outlet Store Link Leakage',
    description: 'Verify navigation does not contain links to physical Australian retail store locations.',
    preconditions: 'Mega menu submenus opened.',
    steps: '1. Scan navigation links for /pages/melbourne-outlet-store.\n2. Inspect link text and destination.',
    expected: 'No Australian physical store links on US B2B storefront.',
    actual: 'Offending link to https://globewestoutlet.com.au/pages/melbourne-outlet-store is hardcoded.',
    status: 'FAIL',
    severity: 'P1 - High',
    visualEvidence: 'DEFECT_Melbourne_Outlet_Store_Leak.png'
  },
  {
    tcId: 'TC-HEADER-11',
    category: 'Baseline Parity',
    feature: 'AU Baseline 1:1 Comparative Audit',
    description: 'Perform side-by-side audit against AU Live Staging baseline to identify styling or structural deviations.',
    preconditions: 'AU Staging (https://mcstaging2.globewest.com.au) live.',
    steps: '1. Load AU header.\n2. Capture baseline screenshots of top bar, logo, search, and mega menu.\n3. Compare layout dimensions and font styling.',
    expected: 'US Header matches AU layout, styling, and interaction patterns with US localization.',
    actual: 'Structural layout matches AU, but identified 4 content/link defects.',
    status: 'PASS',
    severity: 'P2 - Medium',
    visualEvidence: 'AU_Section_Mega_Menu_Indoor.png'
  },
  {
    tcId: 'TC-HEADER-12',
    category: 'Responsive',
    feature: 'Mobile Hamburger Drawer Navigation',
    description: 'Verify mobile viewport (393x851) header collapses to hamburger icon, opens drawer, and accordions expand.',
    preconditions: 'Mobile viewport 393x851 (Pixel 5).',
    steps: '1. Load US site in mobile viewport.\n2. Click hamburger button (.nav-toggle).\n3. Verify slide-out drawer.\n4. Click Indoor accordion to expand subcategories.',
    expected: 'Mobile drawer opens smoothly; accordions expand child items with zero horizontal page overflow.',
    actual: 'Mobile drawer and accordions function as intended.',
    status: 'PASS',
    severity: 'P1 - High',
    visualEvidence: 'Section_Mobile_Drawer_Open.png'
  }
];

// 1. Generate CSV
const csvRows = [
  ['Test Case ID', 'Category', 'Feature', 'Description', 'Preconditions', 'Execution Steps', 'Expected Result', 'Actual Result', 'Status', 'Severity', 'Visual Evidence']
];
testCases.forEach(tc => {
  csvRows.push([
    tc.tcId,
    tc.category,
    tc.feature,
    `"${tc.description.replace(/"/g, '""')}"`,
    `"${tc.preconditions.replace(/"/g, '""')}"`,
    `"${tc.steps.replace(/"/g, '""')}"`,
    `"${tc.expected.replace(/"/g, '""')}"`,
    `"${tc.actual.replace(/"/g, '""')}"`,
    tc.status,
    tc.severity,
    tc.visualEvidence
  ]);
});
const csvContent = csvRows.map(r => r.join(',')).join('\n');
fs.writeFileSync(path.join(OUT_DIR, 'Ticket5_Header_TestCases.csv'), csvContent);
console.log('Generated CSV: Ticket5_Header_TestCases.csv');

// 2. Generate Markdown Table
let mdContent = `# Ticket 5: US Storefront Header & Mega Menu Test Cases\n\n`;
mdContent += `| TC ID | Category | Feature | Status | Severity | Expected Result | Actual Result |\n`;
mdContent += `|---|---|---|:---:|:---:|---|---|\n`;
testCases.forEach(tc => {
  const statusBadge = tc.status === 'PASS' ? '✅ PASS' : '❌ FAIL';
  mdContent += `| **${tc.tcId}** | ${tc.category} | ${tc.feature} | ${statusBadge} | **${tc.severity}** | ${tc.expected} | ${tc.actual} |\n`;
});
fs.writeFileSync(path.join(OUT_DIR, 'Ticket5_Header_TestCases.md'), mdContent);
console.log('Generated Markdown: Ticket5_Header_TestCases.md');

// 3. Generate Excel XLSX
const wb = XLSX.utils.book_new();
const wsData = [
  ['Test Case ID', 'Category', 'Feature', 'Description', 'Preconditions', 'Execution Steps', 'Expected Result', 'Actual Result', 'Status', 'Severity', 'Visual Evidence'],
  ...testCases.map(tc => [
    tc.tcId,
    tc.category,
    tc.feature,
    tc.description,
    tc.preconditions,
    tc.steps,
    tc.expected,
    tc.actual,
    tc.status,
    tc.severity,
    tc.visualEvidence
  ])
];
const ws = XLSX.utils.aoa_to_sheet(wsData);
ws['!cols'] = [
  { wch: 15 }, // ID
  { wch: 18 }, // Category
  { wch: 25 }, // Feature
  { wch: 45 }, // Description
  { wch: 30 }, // Preconditions
  { wch: 40 }, // Steps
  { wch: 40 }, // Expected
  { wch: 40 }, // Actual
  { wch: 10 }, // Status
  { wch: 14 }, // Severity
  { wch: 30 }  // Visual Evidence
];
XLSX.utils.book_append_sheet(wb, ws, 'Header Test Cases');
const xlsxPath = path.join(OUT_DIR, 'Ticket5_Header_TestCases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`Generated Excel: ${xlsxPath}`);
