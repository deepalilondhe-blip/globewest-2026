const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');
const fs = require('fs');
const path = require('path');

const outDir = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Cart Page';

const testCases = [
  {
    'Test ID': 'TC-CART-01',
    'Component': 'Product Detail Page (PDP)',
    'Feature': 'Add to Cart CTA Button',
    'Pre-conditions': 'Logged in as Trade/Retail customer (Deepali Londhe)',
    'Test Steps': '1. Navigate to in-stock product PDP (e.g. Felix Fold 3 Seater Sofa)\n2. Check for "Add to Cart" button',
    'Expected Result (AU Baseline)': '"ADD TO CART" button is rendered and functional with qty stepper and unit price',
    'Actual Result (US Storefront)': '"Add to Cart" button is completely suppressed/omitted from #product_addtocart_form; only "REQUEST FREE SWATCHES" is shown',
    'Status': 'FAIL',
    'Severity': 'P1 - High (Blocker)',
    'Notes / Impact': 'US customers cannot add items to cart or proceed to checkout'
  },
  {
    'Test ID': 'TC-CART-02',
    'Component': 'Cart Page Content Hub',
    'Feature': 'Empty Cart Recommendations & Blog Links',
    'Pre-conditions': 'Empty cart state (/checkout/cart/)',
    'Test Steps': '1. Open /checkout/cart/\n2. Scroll down to "Inspiring Trends & Directions"\n3. Inspect images and "VIEW ALL ARTICLES" link',
    'Expected Result (AU Baseline)': 'Clean styled marketing cards with internal routing',
    'Actual Result (US Storefront)': 'Displays low-resolution pixelated truck icons for "Post testing (Duplicated)" and leaks to https://mcprod.globewest.com.au/blog',
    'Status': 'FAIL',
    'Severity': 'P1 - High (Scope Leak)',
    'Notes / Impact': 'American visitors are redirected to the Australian blog domain'
  },
  {
    'Test ID': 'TC-CART-03',
    'Component': 'Cart Page Header',
    'Feature': 'Top Utility Bar Service Links & Wishlist',
    'Pre-conditions': 'Navigate to Cart Page',
    'Test Steps': '1. Inspect top utility bar and main header on Cart page',
    'Expected Result (AU Baseline)': 'Displays "Find a designer or stockist" in brown top bar and Wishlist heart icon next to cart',
    'Actual Result (US Storefront)': 'Top bar service link is missing; Wishlist heart icon is omitted next to cart icon',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium (Parity Gap)',
    'Notes / Impact': 'Service parity gap between US and AU'
  },
  {
    'Test ID': 'TC-CART-04',
    'Component': 'Cart / Customer Footer',
    'Feature': 'Australian Geographic Scope Branding',
    'Pre-conditions': 'Cart and customer registration pages',
    'Test Steps': '1. Inspect footer branding elements on US storefront',
    'Expected Result (AU Baseline)': 'Australian domestic branding on AU site',
    'Actual Result (US Storefront)': 'Renders "AUSTRALIAN OWNED & RUN" badge with continent map of Australia on US store view',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium (Scope Leak)',
    'Notes / Impact': 'Australian domestic branding leak on USA storefront'
  },
  {
    'Test ID': 'TC-CART-05',
    'Component': 'Mini-Cart Drawer',
    'Feature': 'Slideout Drawer Interaction',
    'Pre-conditions': 'Home page or catalog page',
    'Test Steps': '1. Click on Header Cart Icon',
    'Expected Result (AU Baseline)': 'Slideout right drawer opens with "My Cart" and empty cart message',
    'Actual Result (US Storefront)': 'Drawer opens with "My Cart" and empty message; matches AU interaction',
    'Status': 'PASS',
    'Severity': 'N/A',
    'Notes / Impact': 'Mini-cart slideout drawer behavior is functional'
  },
  {
    'Test ID': 'TC-CART-06',
    'Component': 'Empty Cart Core Messaging',
    'Feature': 'Empty Cart Hero Card',
    'Pre-conditions': 'Visit /checkout/cart/ with empty cart',
    'Test Steps': '1. Inspect empty cart title and CTA buttons',
    'Expected Result (AU Baseline)': '"Your Cart Is Empty" with [EXPLORE IN STOCK] and [SHOP FURNITURE] buttons',
    'Actual Result (US Storefront)': 'Matches AU layout with identical text and working catalog CTA buttons',
    'Status': 'PASS',
    'Severity': 'N/A',
    'Notes / Impact': 'Core empty cart card matches AU baseline'
  },
  {
    'Test ID': 'TC-CART-07',
    'Component': 'Mobile Responsiveness',
    'Feature': 'Mobile Viewport Cart Layout (390x844)',
    'Pre-conditions': 'Set viewport to 390x844',
    'Test Steps': '1. Open Cart page on mobile viewport\n2. Inspect responsiveness and button stacking',
    'Expected Result (AU Baseline)': 'Clean responsive stacking on mobile screens',
    'Actual Result (US Storefront)': 'Responsive layout stacks correctly without horizontal overflow',
    'Status': 'PASS',
    'Severity': 'N/A',
    'Notes / Impact': 'Mobile layout passes visual verification'
  }
];

// 1. Generate Excel (.xlsx)
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

// Auto-adjust column widths
const colWidths = [
  { wch: 14 }, // Test ID
  { wch: 25 }, // Component
  { wch: 30 }, // Feature
  { wch: 30 }, // Pre-conditions
  { wch: 35 }, // Test Steps
  { wch: 35 }, // Expected Result
  { wch: 35 }, // Actual Result
  { wch: 10 }, // Status
  { wch: 25 }, // Severity
  { wch: 35 }  // Notes
];
ws['!cols'] = colWidths;

XLSX.utils.book_append_sheet(wb, ws, 'Cart Page Test Cases');
const xlsxPath = path.join(outDir, 'Cart_Page_TestCases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`[Excel Created] ${xlsxPath}`);

// 2. Generate CSV
const csvContent = XLSX.utils.sheet_to_csv(ws);
const csvPath = path.join(outDir, 'Cart_Page_TestCases.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`[CSV Created] ${csvPath}`);
