/**
 * Generate comprehensive Excel test suite for Ticket: Footer Cross-Storefront Audit
 * Output: Footer_TestCases.xlsx & Footer_TestCases.csv
 */
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Footer';
const XLSX_PATH = path.join(OUTPUT_DIR, 'Footer_TestCases.xlsx');
const CSV_PATH = path.join(OUTPUT_DIR, 'Footer_TestCases.csv');

const testCases = [
  {
    "Test Case ID": "TC_FOOTER_001",
    "Section": "Customer Support Column",
    "Test Scenario": "Verify 'Shop Outlet' link destination on US storefront",
    "Test Steps": "1. Navigate to US Storefront footer\n2. Locate 'CUSTOMER SUPPORT' column\n3. Inspect 'Shop Outlet' anchor tag href\n4. Click 'Shop Outlet' link",
    "Expected Result (AU Baseline)": "Link should route to US outlet inventory or be hidden if no US outlet exists. Should NOT leak to domestic AU outlet.",
    "Actual Result (US Staging)": "Hardcoded to https://globewestoutlet.com.au/ (Australian Outlet store displaying AUD pricing).",
    "Status": "FAIL",
    "Severity": "P1 - High",
    "Defect Linked": "DEFECT 1: Shop Outlet AU Domain Leak",
    "Comparison Screenshot": "DEFECT_1_SHOP_OUTLET_AU_LEAK.png"
  },
  {
    "Test Case ID": "TC_FOOTER_002",
    "Section": "Newsletter Subscription",
    "Test Scenario": "Verify Newsletter 'Subscribe Now.' link target on US storefront",
    "Test Steps": "1. Navigate to US Storefront footer\n2. Locate 'Subscribe' promo section in Column 1\n3. Inspect 'Subscribe Now.' link href",
    "Expected Result (AU Baseline)": "Link should route to US newsletter signup form/endpoint (e.g., /subscribe or US Klaviyo/Mailchimp integration).",
    "Actual Result (US Staging)": "Hardcoded to https://www.globewest.com.au/subscribe-to-our-database, leaking US user registrations to Australian database.",
    "Status": "FAIL",
    "Severity": "P1 - High",
    "Defect Linked": "DEFECT 2: Newsletter Subscribe AU Domain Leak",
    "Comparison Screenshot": "DEFECT_2_NEWSLETTER_SUBSCRIBE_AU_LEAK.png"
  },
  {
    "Test Case ID": "TC_FOOTER_003",
    "Section": "Geographic Branding",
    "Test Scenario": "Verify 'AUSTRALIAN OWNED & RUN' national logo presence on US storefront",
    "Test Steps": "1. Navigate to US Storefront footer\n2. Inspect Column 1 bottom emblem under showroom booking\n3. Verify brand logo suitability for US domestic market",
    "Expected Result (AU Baseline)": "US storefront should display US-appropriate branding or omit domestic Australian national continent emblem.",
    "Actual Result (US Staging)": "Displays domestic Australian continent map outline and 'AUSTRALIAN OWNED & RUN' badge on US storefront.",
    "Status": "FAIL",
    "Severity": "P2 - Medium",
    "Defect Linked": "DEFECT 3: Australian Continent Emblem Leak",
    "Comparison Screenshot": "DEFECT_3_AUSTRALIAN_OWNED_BADGE_LEAK.png"
  },
  {
    "Test Case ID": "TC_FOOTER_004",
    "Section": "Social Media Links",
    "Test Scenario": "Verify Pinterest social media icon destination on US storefront",
    "Test Steps": "1. Navigate to US Storefront footer\n2. Locate 'Connect with us' social media icon list\n3. Inspect Pinterest icon anchor tag href",
    "Expected Result (AU Baseline)": "Link should point to international or US Pinterest profile (https://www.pinterest.com/globewest/).",
    "Actual Result (US Staging)": "Points to regional Australian locale URL: https://www.pinterest.com.au/globewest/",
    "Status": "FAIL",
    "Severity": "P2 - Medium",
    "Defect Linked": "DEFECT 4: Pinterest AU Locale Leak",
    "Comparison Screenshot": "DEFECT_4_PINTEREST_AU_LOCALE_LEAK.png"
  },
  {
    "Test Case ID": "TC_FOOTER_005",
    "Section": "Legal & Bottom Bar",
    "Test Scenario": "Verify Copyright notice year accuracy across storefront footer",
    "Test Steps": "1. Navigate to US Storefront bottom legal bar\n2. Inspect Copyright notice text string",
    "Expected Result (AU Baseline)": "Should display current year dynamically (e.g., © 2026 GlobeWest or © Current Year GlobeWest).",
    "Actual Result (US Staging)": "Hardcoded outdated year: '© 2023 GlobeWest'.",
    "Status": "FAIL",
    "Severity": "P3 - Low",
    "Defect Linked": "DEFECT 5: Outdated Copyright Year",
    "Comparison Screenshot": "DEFECT_5_OUTDATED_COPYRIGHT_2023.png"
  },
  {
    "Test Case ID": "TC_FOOTER_006",
    "Section": "Legal & Bottom Bar",
    "Test Scenario": "Verify US Privacy Rights & CCPA compliance link in footer",
    "Test Steps": "1. Navigate to US Storefront bottom bar\n2. Check for required US state privacy disclosures (Do Not Sell My Info / CCPA)",
    "Expected Result (AU Baseline)": "US storefront must include CCPA / Do Not Sell or Share My Personal Information link for regulatory compliance.",
    "Actual Result (US Staging)": "Missing dedicated CCPA / California Consumer Privacy Act link; only standard AU Privacy Policy link is shown.",
    "Status": "FAIL",
    "Severity": "P2 - Medium",
    "Defect Linked": "DEFECT 5: Missing US CCPA Compliance Link",
    "Comparison Screenshot": "DEFECT_5_OUTDATED_COPYRIGHT_2023.png"
  },
  {
    "Test Case ID": "TC_FOOTER_007",
    "Section": "Products Column",
    "Test Scenario": "Verify Products navigation links routing on US storefront",
    "Test Steps": "1. Inspect Products column links:\n   - In Stock (/in-stock)\n   - Indoor (/indoor)\n   - Living (/indoor/shop-by-room/living-room)\n   - Dining (/indoor/shop-by-room/dining-room-kitchen)\n   - Bedroom (/indoor/shop-by-room/bedroom)\n   - Outdoor (/outdoor)\n   - Office (/indoor/shop-by-room/home-office-study)\n   - Homewares (/homewares)\n   - Lighting (/homeware/lighting)\n   - Rugs (/homeware/homewares/rugs)",
    "Expected Result (AU Baseline)": "All product links resolve correctly to US staging domain without Australian scope or 404 errors.",
    "Actual Result (US Staging)": "All 10 product catalog links resolve properly to mcstaging2.globewest.com paths.",
    "Status": "PASS",
    "Severity": "Informational",
    "Defect Linked": "None (Verified Clean)",
    "Comparison Screenshot": "N/A"
  },
  {
    "Test Case ID": "TC_FOOTER_008",
    "Section": "Customer Support Column",
    "Test Scenario": "Verify standard Customer Support links routing on US storefront",
    "Test Steps": "1. Inspect links in Customer Support column:\n   - How to Buy (/how-to-buy)\n   - Showrooms (/contact)\n   - Trade & Wholesale (/help-centre/general/trade-registration)\n   - Project & Commercial (/help-centre)\n   - Find a Stockist (/locator)\n   - Find a Designer (/find-designer-start)\n   - Help Centre (/help-centre)\n   - After Sales (/help-centre/after-sales-enquires)\n   - Contact Us (/contact)\n   - Product Care (/product-care)",
    "Expected Result (AU Baseline)": "All support links resolve to valid US staging relative/absolute URLs.",
    "Actual Result (US Staging)": "All 10 core customer support links resolve to mcstaging2.globewest.com endpoints.",
    "Status": "PASS",
    "Severity": "Informational",
    "Defect Linked": "None (Verified Clean)",
    "Comparison Screenshot": "N/A"
  },
  {
    "Test Case ID": "TC_FOOTER_009",
    "Section": "Our Brand Column",
    "Test Scenario": "Verify Our Brand links routing on US storefront",
    "Test Steps": "1. Inspect links in Our Brand column:\n   - About Us (/about-us)\n   - Careers (/careers)\n   - Inspiration & Interviews (/blog)\n   - Video Library (/video-library)\n   - Lookbook Library (/lookbook-library)\n   - Press (/press)",
    "Expected Result (AU Baseline)": "All brand links resolve correctly to US staging domain.",
    "Actual Result (US Staging)": "All 6 brand links resolve properly to mcstaging2.globewest.com endpoints.",
    "Status": "PASS",
    "Severity": "Informational",
    "Defect Linked": "None (Verified Clean)",
    "Comparison Screenshot": "N/A"
  },
  {
    "Test Case ID": "TC_FOOTER_010",
    "Section": "Connect Column",
    "Test Scenario": "Verify Showroom Booking CTA button destination on US storefront",
    "Test Steps": "1. Locate 'Visit our Showrooms' block\n2. Inspect 'Book an Appointment' button href",
    "Expected Result (AU Baseline)": "Link should route to US showroom booking page (https://mcstaging2.globewest.com/online-booking).",
    "Actual Result (US Staging)": "Points to https://mcstaging2.globewest.com/online-booking as expected.",
    "Status": "PASS",
    "Severity": "Informational",
    "Defect Linked": "None (Verified Clean)",
    "Comparison Screenshot": "N/A"
  },
  {
    "Test Case ID": "TC_FOOTER_011",
    "Section": "Mobile Responsiveness",
    "Test Scenario": "Verify collapsible accordion columns on mobile viewport (390x844)",
    "Test Steps": "1. Emulate iPhone 12/13/14 viewport (390x844)\n2. Navigate to footer\n3. Verify Products, Customer Support, Our Brand accordion headers toggle open/close",
    "Expected Result (AU Baseline)": "Accordion triggers expand and collapse links smoothly without text truncation or overflow.",
    "Actual Result (US Staging)": "Collapsible triggers respond to touch/click, expanding column link menus cleanly.",
    "Status": "PASS",
    "Severity": "Informational",
    "Defect Linked": "None (Verified Clean)",
    "Comparison Screenshot": "04_US_Footer_Mobile_390x844.png"
  }
];

// 1. Create Excel Workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

// Column Widths
ws['!cols'] = [
  { wch: 16 }, // Test Case ID
  { wch: 22 }, // Section
  { wch: 40 }, // Test Scenario
  { wch: 45 }, // Test Steps
  { wch: 45 }, // Expected Result
  { wch: 45 }, // Actual Result
  { wch: 10 }, // Status
  { wch: 14 }, // Severity
  { wch: 35 }, // Defect Linked
  { wch: 35 }  // Comparison Screenshot
];

XLSX.utils.book_append_sheet(wb, ws, 'Footer Test Cases');
XLSX.writeFile(wb, XLSX_PATH);
console.log(`[Excel Created] ${XLSX_PATH}`);

// 2. Create CSV
const csvData = XLSX.utils.sheet_to_csv(ws);
fs.writeFileSync(CSV_PATH, csvData);
console.log(`[CSV Created] ${CSV_PATH}`);
