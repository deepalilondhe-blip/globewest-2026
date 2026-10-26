const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const BASE_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE_DIR, 'Mega_Menu_Test_Cases.csv');
const XLSX_PATH = path.join(BASE_DIR, 'Mega_Menu_Test_Cases.xlsx');

const testCases = [
  {
    'Test ID': 'TC-MM-01',
    'Feature / Category': 'Mega Menu - Top Level Navigation',
    'Test Scenario': 'Verify Presence & Order of All 9 Navigation Categories',
    'Pre-Conditions': 'US Staging (https://mcstaging2.globewest.com/) loaded in desktop viewport',
    'Test Steps': '1. Navigate to US Staging.\n2. Inspect Header navigation bar.\n3. Compare category list against AU Staging (https://mcstaging2.globewest.com.au/).',
    'Expected Result': 'All 9 categories (Indoor, Outdoor, Homewares, In Stock, Customisation, Projects, Inspiration, Support, Contact) render in clean hierarchy.',
    'Actual Result': 'All 9 categories present and aligned with US catalog routing.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-MM-02',
    'Feature / Category': 'Desktop - Indoor Category',
    'Test Scenario': 'Verify Indoor Mega Menu Flyout, Interactions & Link Counts',
    'Pre-Conditions': 'Desktop viewport 1440x900, Authenticated Trade session',
    'Test Steps': '1. Hover over "Indoor" category.\n2. Verify flyout animation and column layout (Furniture, Rugs, Lighting).\n3. Hover over Tier-2 "Furniture" subcategory.\n4. Audit all 66 subcategory links.',
    'Expected Result': 'Mega menu flyout opens smoothly displaying multi-column hierarchy; tier-2 items expand subcategories.',
    'Actual Result': 'Flyout opens with 66 total links; Furniture subcategory hovered successfully.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-MM-03',
    'Feature / Category': 'Scope Isolation - Indoor',
    'Test Scenario': 'Verify Indoor Outlet Link Domain Routing (Zero AU Leakage)',
    'Pre-Conditions': 'Hovering Indoor mega menu',
    'Test Steps': '1. Hover over Indoor category.\n2. Locate "Outlet" subcategory link.\n3. Inspect destination href URL.',
    'Expected Result': 'Link routes strictly to US catalog path (mcstaging2.globewest.com) without Australian domain leakage.',
    'Actual Result': 'Link hardcodes https://globewestoutlet.com.au/collections/indoor routing US users to Australian outlet.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-MM-04',
    'Feature / Category': 'Desktop - Outdoor Category',
    'Test Scenario': 'Verify Outdoor Mega Menu Flyout, Interactions & AU Leak Check',
    'Pre-Conditions': 'Desktop viewport 1440x900',
    'Test Steps': '1. Hover over Outdoor category.\n2. Verify flyout layout and audit 30 subcategory links.\n3. Check Outlet destination URL.',
    'Expected Result': 'All links route to US store without Australian leakage.',
    'Actual Result': 'Link hardcodes https://globewestoutlet.com.au/collections/outdoor routing US users to Australian outlet.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-MM-05',
    'Feature / Category': 'Desktop - Homewares Category',
    'Test Scenario': 'Verify Homewares Mega Menu Flyout, Interactions & AU Leak Check',
    'Pre-Conditions': 'Desktop viewport 1440x900',
    'Test Steps': '1. Hover over Homewares category.\n2. Verify 13 subcategory links.\n3. Check Outlet destination URL.',
    'Expected Result': 'All links route to US store without Australian leakage.',
    'Actual Result': 'Link hardcodes https://globewestoutlet.com.au/collections/homewares routing US users to Australian outlet.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-MM-06',
    'Feature / Category': 'Desktop - In Stock Category',
    'Test Scenario': 'Verify In Stock Subcategories Parity with AU Staging',
    'Pre-Conditions': 'Desktop viewport 1440x900',
    'Test Steps': '1. Hover over "In Stock".\n2. Audit column grouping and 36 subcategory links.',
    'Expected Result': 'Exact parity with AU staging column structure, zero Australian domain leakage.',
    'Actual Result': 'Clean US catalog routing; zero AU leakage across all 36 links.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-MM-07',
    'Feature / Category': 'Desktop - Customisation & Projects',
    'Test Scenario': 'Verify Customisation & Projects Mega Menu Parity',
    'Pre-Conditions': 'Desktop viewport 1440x900',
    'Test Steps': '1. Hover over "Customisation" (2 links) and "Projects" (18 links).\n2. Verify links and hover behavior.',
    'Expected Result': 'All links route to US portfolio pages without Australian leakage.',
    'Actual Result': 'Passed with 100% clean US URLs.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-MM-08',
    'Feature / Category': 'Desktop - Inspiration Category',
    'Test Scenario': 'Verify Inspiration Editorial Links & Lookbooks',
    'Pre-Conditions': 'Desktop viewport 1440x900',
    'Test Steps': '1. Hover over "Inspiration".\n2. Audit 15 editorial lookbook and blog links.',
    'Expected Result': 'All links route to US blog without Australian leakage.',
    'Actual Result': 'Passed with 100% clean US URLs.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-MM-09',
    'Feature / Category': 'Scope Isolation - Support Category',
    'Test Scenario': 'Verify Support Mega Menu Sub-Links for Australian Outlet Leakage',
    'Pre-Conditions': 'Desktop viewport 1440x900',
    'Test Steps': '1. Hover over "Support" menu.\n2. Inspect destination URLs of all 18 sub-links.',
    'Expected Result': 'All support links route to US Help Centre; zero Australian outlet or showroom links.',
    'Actual Result': '🚨 2 Australian leaks detected: "Shop Online Outlet" (globewestoutlet.com.au) and "Visit Melbourne Outlet" (pages/melbourne-outlet-store).',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-MM-10',
    'Feature / Category': 'Desktop - Contact Category',
    'Test Scenario': 'Verify Contact Menu Item Routing & Links',
    'Pre-Conditions': 'Desktop viewport 1440x900',
    'Test Steps': '1. Hover and inspect Contact menu item (6 links).\n2. Verify destination URLs.',
    'Expected Result': 'Routes to US contact/showroom inquiry without Australian leakage.',
    'Actual Result': 'Passed with 100% clean US URLs.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-MM-11',
    'Feature / Category': 'Mobile - Hamburger Navigation',
    'Test Scenario': 'Verify Mobile Drawer Opens & Displays All 9 Categories (390x844)',
    'Pre-Conditions': 'Mobile viewport 390x844 (iPhone 14), Logged-in Trade customer',
    'Test Steps': '1. Navigate to US Staging.\n2. Tap Hamburger menu icon.\n3. Assert all 9 category accordions render cleanly without horizontal scroll.',
    'Expected Result': 'Drawer slides out smoothly displaying all 9 top-level categories.',
    'Actual Result': 'Drawer opens cleanly displaying all 9 categories.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-MM-12',
    'Feature / Category': 'Mobile - Individual Category Drilldowns',
    'Test Scenario': 'Verify Accordion Expansion & Subcategory Navigation for All Categories',
    'Pre-Conditions': 'Mobile viewport 390x844',
    'Test Steps': '1. Individually tap each category accordion (Indoor through Contact).\n2. Verify subcategories expand cleanly.\n3. Audit 258 total child links for Australian domain redirects.',
    'Expected Result': 'All accordions expand smoothly; sub-links route to US catalog.',
    'Actual Result': 'All 9 accordions expand cleanly; identified 5 Australian outlet link leaks (Indoor, Outdoor, Homewares, Support x2).',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  }
];

// 1. Write CSV
const headers = Object.keys(testCases[0]);
const csvContent = [
  headers.join(','),
  ...testCases.map(tc => headers.map(h => `"${(tc[h] || '').replace(/"/g, '""')}"`).join(','))
].join('\n');

fs.writeFileSync(CSV_PATH, csvContent);
console.log(`✅ CSV Generated: ${CSV_PATH}`);

// 2. Write Excel
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

// Set column widths
ws['!cols'] = [
  { wch: 12 }, // Test ID
  { wch: 28 }, // Feature / Category
  { wch: 45 }, // Test Scenario
  { wch: 40 }, // Pre-Conditions
  { wch: 55 }, // Test Steps
  { wch: 50 }, // Expected Result
  { wch: 55 }, // Actual Result
  { wch: 10 }, // Status
  { wch: 15 }  // Severity
];

XLSX.utils.book_append_sheet(wb, ws, 'Mega Menu Test Cases');
XLSX.writeFile(wb, XLSX_PATH);
console.log(`✅ XLSX Generated: ${XLSX_PATH}`);
