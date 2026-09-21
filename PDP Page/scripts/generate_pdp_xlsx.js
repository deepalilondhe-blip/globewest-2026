/**
 * Generate comprehensive Excel test suite for Ticket: PDP Figma Fidelity & Functional Audit
 * Output: PDP_TestCases.xlsx & PDP_TestCases.csv
 */
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/PDP Page';
const XLSX_PATH = path.join(OUTPUT_DIR, 'PDP_TestCases.xlsx');
const CSV_PATH = path.join(OUTPUT_DIR, 'PDP_TestCases.csv');

const testCases = [
  {
    "Test Case ID": "TC_PDP_001",
    "Section": "Page Meta / SEO",
    "Viewport": "Global",
    "Test Scenario": "Verify HTML Page <title> and geographic branding for US Storefront",
    "Test Steps": "1. Open PDP URL on US Storefront (mcstaging2.globewest.com)\n2. Inspect document.title in head element",
    "Expected Result (Figma Spec)": "Page title reflects US Storefront scope (e.g. 'Buy Amari Oasis Large Planter - Wheat online - GlobeWest USA')",
    "Actual Result (US Staging Live)": "Page <title> leaks Australian branding: 'Buy Amari Oasis Large Planter - Wheat online - GlobeWest Australia'",
    "Status": "FAIL",
    "Severity": "P1 - High",
    "Evidence Screenshot": "03_DEFECT_PAGE_META_TITLE_AUSTRALIA_LEAK.png"
  },
  {
    "Test Case ID": "TC_PDP_002",
    "Section": "Regulatory Compliance",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify presence of mandatory California Proposition 65 warning",
    "Test Steps": "1. Navigate to US PDP product information column\n2. Inspect for California Prop 65 warning block",
    "Expected Result (Figma Spec)": "Explicit warning box: 'Warning: This product can expose you to chemicals including Di(2-ethylhexyl)phthalate (DEHP)... www.P65Warnings.ca.gov'",
    "Actual Result (US Staging Live)": "California Proposition 65 warning block is completely missing from the US product detail page",
    "Status": "FAIL",
    "Severity": "P1 - High",
    "Evidence Screenshot": "02_DEFECT_MISSING_CALIFORNIA_PROP65_WARNING.png"
  },
  {
    "Test Case ID": "TC_PDP_003",
    "Section": "Purchasing & Actions",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify secondary [ADD TO QUOTE] CTA button availability",
    "Test Steps": "1. Authenticate as Trade customer\n2. Inspect action buttons in .box-tocart container underneath [ADD TO CART]",
    "Expected Result (Figma Spec)": "Secondary full-width or outlined button: [ADD TO QUOTE] rendered underneath [Add to cart]",
    "Actual Result (US Staging Live)": "[ADD TO QUOTE] CTA button is completely absent on the US product page",
    "Status": "FAIL",
    "Severity": "P1 - High",
    "Evidence Screenshot": "01_DEFECT_MISSING_ADD_TO_QUOTE_CTA.png"
  },
  {
    "Test Case ID": "TC_PDP_004",
    "Section": "Typography & Title",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify product title typography against Figma specification (IvyMode 400)",
    "Test Steps": "1. Inspect .page-title computed styles\n2. Verify font-family and font-weight",
    "Expected Result (Figma Spec)": "Font: IvyMode, Weight: 400 Regular, Serif styling",
    "Actual Result (US Staging Live)": "Computed font-family: 'IvyMode, \"Times New Roman\", Georgia, serif', font-weight: 400; matches Figma spec",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "04_PASS_PRODUCT_TITLE_TYPOGRAPHY.png"
  },
  {
    "Test Case ID": "TC_PDP_005",
    "Section": "Trade Dual Pricing",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify dual pricing display for authenticated Trade customers",
    "Test Steps": "1. Log in as Trade customer\n2. Inspect .price-box on PDP",
    "Expected Result (Figma Spec)": "Displays customer Trade price ($) with MSRP displayed underneath / alongside",
    "Actual Result (US Staging Live)": "Renders dual pricing: '$434.50 MSRP: $902.00' matching Figma requirements",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "05_PASS_TRADE_DUAL_PRICING.png"
  },
  {
    "Test Case ID": "TC_PDP_006",
    "Section": "Guest Pricing Masking",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify wholesale price masking and Add to Cart suppression for unauthenticated guests",
    "Test Steps": "1. Open PDP in unauthenticated guest session\n2. Inspect price box and purchasing CTAs",
    "Expected Result (Figma Spec)": "Wholesale prices hidden; Add to Cart suppressed; [REQUEST FREE SWATCHES] CTA shown",
    "Actual Result (US Staging Live)": "Wholesale pricing is strictly masked; Add to Cart button is suppressed conforming to B2B rules",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "05_Desktop_Guest_Pricing_Masked_PASS.png"
  },
  {
    "Test Case ID": "TC_PDP_007",
    "Section": "Primary Purchasing CTA",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify primary [ADD TO CART] button availability for Trade customers",
    "Test Steps": "1. Log in as Trade customer\n2. Locate #product-addtocart-button",
    "Expected Result (Figma Spec)": "Prominent solid rectangular [Add to cart] button active",
    "Actual Result (US Staging Live)": "[ADD TO CART] CTA button is rendered, active, and clickable",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "08_Desktop_AddToCart_Button_PASS.png"
  },
  {
    "Test Case ID": "TC_PDP_008",
    "Section": "Header Pricing Toggle",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify header utility bar Trade Pricing Toggle integration",
    "Test Steps": "1. Inspect header utility bar on PDP\n2. Verify presence of Trade vs MSRP pricing toggle",
    "Expected Result (Figma Spec)": "Dropdown/toggle allowing switching between Trade and MSRP views",
    "Actual Result (US Staging Live)": "Active Trade pricing toggle rendered in header utility bar",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "06_Desktop_Header_Trade_Toggle_PASS.png"
  },
  {
    "Test Case ID": "TC_PDP_009",
    "Section": "Product Metadata",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify SKU, breadcrumbs, and gallery media rendering",
    "Test Steps": "1. Inspect breadcrumb trail\n2. Inspect SKU attribute and image gallery",
    "Expected Result (Figma Spec)": "Accurate breadcrumbs, SKU line, and high-res gallery images",
    "Actual Result (US Staging Live)": "Breadcrumbs visible, SKU clearly displayed ('DEC-AMAR-OAS-PLT-LG-WHEAT'), gallery functional",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "01_Desktop_Breadcrumbs_PASS.png"
  },
  {
    "Test Case ID": "TC_PDP_010",
    "Section": "Mobile Responsiveness",
    "Viewport": "Mobile (390px)",
    "Test Scenario": "Verify mobile PDP viewport adaptation and touch layout (390x844)",
    "Test Steps": "1. Emulate mobile screen (iPhone 14/15 390x844)\n2. Inspect visual hierarchy, image scaling, and action buttons",
    "Expected Result (Figma Spec)": "Mobile layout matches Mobile/product/Trade Pricing - ETA frame without horizontal overflow",
    "Actual Result (US Staging Live)": "Responsive mobile layout cleanly rendered; gallery fits screen width; readable typography",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "06_PASS_MOBILE_VIEW_COMPARISON.png"
  },
  {
    "Test Case ID": "TC_PDP_011",
    "Section": "Documentation & Warranty",
    "Viewport": "Desktop (1440px)",
    "Test Scenario": "Verify warranty and brochure links",
    "Test Steps": "1. Inspect product info lower section\n2. Verify warranty policy links",
    "Expected Result (Figma Spec)": "Warranty reference ('24 month structural warranty') and download brochure link",
    "Actual Result (US Staging Live)": "Warranty policy link present in product specifications",
    "Status": "PASS",
    "Severity": "N/A",
    "Evidence Screenshot": "11_Desktop_Warranty_Link_PASS.png"
  }
];

// 1. Write CSV
const csvHeaders = Object.keys(testCases[0]).join(',');
const csvRows = testCases.map(row => {
  return Object.values(row).map(val => {
    const clean = String(val).replace(/"/g, '""');
    return `"${clean}"`;
  }).join(',');
});
fs.writeFileSync(CSV_PATH, [csvHeaders, ...csvRows].join('\n'), 'utf8');
console.log(`CSV written to: ${CSV_PATH}`);

// 2. Write XLSX
const ws = XLSX.utils.json_to_sheet(testCases);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "PDP Test Cases");
XLSX.writeFile(wb, XLSX_PATH);
console.log(`XLSX written to: ${XLSX_PATH}`);
