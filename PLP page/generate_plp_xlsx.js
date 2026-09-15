const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname);

const testCases = [
  {
    'Test Case ID': 'TC-PLP-01',
    'Category': 'Navigation & Title',
    'Test Description': 'Verify US Storefront PLP Page Title, H1 Tag, and Breadcrumbs',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'US Storefront is deployed and accessible.',
    'Test Steps': '1. Navigate to US PLP (/indoor).\n2. Verify HTTP status is 200.\n3. Check <title> and <h1>.page-title.\n4. Check breadcrumb links.',
    'Expected Result': 'Page loads with HTTP 200. Title and H1 match Indoor category. Breadcrumbs keep user on US domain with zero AU leakage.',
    'Severity': 'P1',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-02',
    'Category': 'Category Hero Banner',
    'Test Description': 'Verify Category Banner & Editorial Description Parity with AU',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Category banner configured in Magento Admin.',
    'Test Steps': '1. Observe category header and top banner image.\n2. Cross-check against AU baseline (/indoor).\n3. Verify text and imagery render cleanly.',
    'Expected Result': 'Banner renders consistently with AU baseline. All CTA links remain within US domain.',
    'Severity': 'P2',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-03',
    'Category': 'Filter Navigation',
    'Test Description': 'Verify Layered Navigation / Searchspring Filter Facets',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Searchspring or Native layered navigation enabled.',
    'Test Steps': '1. Locate filter sidebar or toolbar.\n2. Inspect facet categories (Subcategory, Material, Color, Price, In-Stock).\n3. Compare facet options against AU baseline.',
    'Expected Result': 'Facets are displayed and interactive. Filter counts match active US product catalog.',
    'Severity': 'P2',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-04',
    'Category': 'Sorting Controls',
    'Test Description': 'Verify PLP Sort Dropdown Functionality',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Product listing is populated.',
    'Test Steps': '1. Locate Sort By dropdown.\n2. Inspect available options (Featured, Newest, Price Low-High, Price High-Low).\n3. Select an option and observe re-ordering.',
    'Expected Result': 'Sort options exist and reorder products seamlessly without full page errors.',
    'Severity': 'P2',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-05',
    'Category': 'Product Grid Routing',
    'Test Description': 'Verify Product Cards Anchor Routing (Zero Australian Scope Leaks)',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Products are visible on the grid.',
    'Test Steps': '1. Query all visible product card links (.product-item-link, a.product-item-photo).\n2. Inspect href attributes.\n3. Assert zero links contain .globewest.com.au.',
    'Expected Result': 'All product links route to US store (mcstaging2.globewest.com) or relative paths. Zero links redirect to Australian domain.',
    'Severity': 'P1',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-06',
    'Category': 'Pricing & Currency',
    'Test Description': 'Verify Product Card Pricing & Currency Symbols ($ USD)',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Price display configured for US store view.',
    'Test Steps': '1. Inspect product price elements (.price-box, .price).\n2. Verify currency formatting.\n3. Ensure no AUD currency text appears.',
    'Expected Result': 'Prices display with standard $ symbol corresponding to USD currency. No Australian Dollar labels.',
    'Severity': 'P2',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-07',
    'Category': 'Product Swatches',
    'Test Description': 'Verify Color & Material Swatches on Product Cards',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Configurable products with swatches present.',
    'Test Steps': '1. Locate product cards with swatches (.swatch-option).\n2. Hover/click a swatch option.\n3. Observe image/label update.',
    'Expected Result': 'Swatches render correctly, are clickable, and update card image preview.',
    'Severity': 'P3',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-08',
    'Category': 'Pagination & Scrolling',
    'Test Description': 'Verify Pagination Controls or Infinite Scroll Load-More',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Catalog contains multiple pages of products.',
    'Test Steps': '1. Scroll to the bottom of the product grid.\n2. Observe pagination numbers or Load More button.\n3. Verify navigation to Page 2.',
    'Expected Result': 'Pagination or Load More functions properly, appending/loading subsequent products.',
    'Severity': 'P2',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-09',
    'Category': 'SEO Content',
    'Test Description': 'Verify Bottom Category SEO Editorial Text Block',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Category content configured.',
    'Test Steps': '1. Scroll to the area above the footer.\n2. Check for category editorial/SEO description.\n3. Cross-check against AU baseline.',
    'Expected Result': 'Category editorial copy is populated with keyword-rich marketing text.',
    'Severity': 'P3',
    'Status': 'PASSED'
  },
  {
    'Test Case ID': 'TC-PLP-10',
    'Category': 'Visual Parity',
    'Test Description': 'Verify Full-Page Responsive Visual Comparison (Desktop, Tablet, Mobile)',
    'Scope / URL': 'https://mcstaging2.globewest.com/indoor',
    'Preconditions': 'Desktop, tablet, and mobile viewports.',
    'Test Steps': '1. Capture full-page screenshots of US PLP and AU PLP.\n2. Generate side-by-side Red/Green comparison images.\n3. Verify layout alignment.',
    'Expected Result': 'US PLP maintains visual consistency with AU baseline with proper responsive wrapping.',
    'Severity': 'P2',
    'Status': 'PASSED'
  }
];

// Write Excel (.xlsx)
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);
XLSX.utils.book_append_sheet(wb, ws, 'PLP_US_vs_AU_TestCases');
const xlsxPath = path.join(baseDir, 'PLP_Page_US_vs_AU_TestCases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`✅ Generated Excel: ${xlsxPath}`);

// Write CSV
const csvContent = XLSX.utils.sheet_to_csv(ws);
const csvPath = path.join(baseDir, 'PLP_Page_US_vs_AU_TestCases.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`✅ Generated CSV: ${csvPath}`);

// Write Markdown (.md)
let mdContent = '# PLP Page: US vs AU Cross-Storefront Test Cases Catalog\n\n';
mdContent += '| Test Case ID | Category | Test Description | Severity | Expected Result | Status |\n';
mdContent += '|---|---|---|---|---|---|\n';
testCases.forEach(tc => {
  mdContent += `| **${tc['Test Case ID']}** | ${tc['Category']} | ${tc['Test Description']} | **${tc['Severity']}** | ${tc['Expected Result'].replace(/\n/g, ' ')} | \`${tc['Status']}\` |\n`;
});
const mdPath = path.join(baseDir, 'PLP_Page_US_vs_AU_TestCases.md');
fs.writeFileSync(mdPath, mdContent, 'utf-8');
console.log(`✅ Generated Markdown: ${mdPath}`);
