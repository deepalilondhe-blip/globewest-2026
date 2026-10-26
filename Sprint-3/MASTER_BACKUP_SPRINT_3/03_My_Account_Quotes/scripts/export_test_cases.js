const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-QUOTES-001",
    "Module": "Filter Tabs - Default State",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Default Active Status Filter Tab is 'ALL' (Frame 622 Rule 1)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Navigate to /gw_quotes/quote/index/\n2. Observe the active tab state in the filter group.",
    "Expected Result (Figma Spec / Frame 622)": "Active tab must default to 'ALL' with solid dark background (#2B1D16) and white text.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Page correctly defaults to 'ALL' tab with solid dark pill styling (#2B1D16).",
    "Status": "PASS",
    "Severity": "PASS (Deployed)",
    "Evidence Reference": "screenshots/desktop/02_my_quotes_desktop_live_viewport.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-002",
    "Module": "Search Bar - Row Alignment",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Search Input Placement Inline with Filter Tabs",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect horizontal row containing filter tabs.\n2. Check search input placement.",
    "Expected Result (Figma Spec / Frame 622)": "Search bar ('Search [🔍]') is right-aligned on the SAME horizontal flex row directly beside the filter tabs.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Search bar is placed inline on the same horizontal row beside filter tabs.",
    "Status": "PASS",
    "Severity": "PASS (Deployed)",
    "Evidence Reference": "screenshots/desktop/02_my_quotes_desktop_live_viewport.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-003",
    "Module": "Table Columns - Details Removal",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Elimination of Standalone DETAILS Column",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect table headers on desktop viewport.\n2. Count columns and verify absence of separate 'DETAILS' column.",
    "Expected Result (Figma Spec / Frame 622)": "Table must contain 8 columns. No standalone DETAILS column rendered.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Redundant 'DETAILS' column has been removed (table now has 8 columns).",
    "Status": "PASS",
    "Severity": "PASS (Deployed)",
    "Evidence Reference": "screenshots/desktop/02_my_quotes_desktop_live_viewport.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-004",
    "Module": "Table Column Copy Parity",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Table Column Naming Parity (EXP. DATE, ORDER NAME)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect text strings of table headers.",
    "Expected Result (Figma Spec / Frame 622)": "Headers must read: QUOTE N, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL, ACTIONS.",
    "Actual Result (mcstaging2 Live)": "Staging uses 'EXPIRY DATE' instead of 'EXP. DATE', and 'QUOTE NAME' instead of 'ORDER NAME'.",
    "Status": "FAIL (Active Defect 01)",
    "Severity": "MEDIUM",
    "Evidence Reference": "screenshots/defects/DEFECT_01_HEADER_COPY_MISMATCH.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-005",
    "Module": "Empty State Design",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Brand-Aligned Empty State Container",
    "Preconditions": "Logged-in Trade Customer with zero quotes",
    "Test Steps": "1. View Quotes grid with no quote records.\n2. Observe empty state message styling.",
    "Expected Result (Figma Spec / Frame 622)": "Clean brand-styled empty state adhering to GlobeWest luxury aesthetics.",
    "Actual Result (mcstaging2 Live)": "Displays raw default Magento blue alert box ('ⓘ Table is empty!') with basic styling.",
    "Status": "FAIL (Active Defect 02)",
    "Severity": "HIGH",
    "Evidence Reference": "screenshots/defects/DEFECT_02_RAW_MAGENTO_EMPTY_ALERT.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-006",
    "Module": "FAQ Section",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Presence of FAQ Accordion Section Below Table (Frame 622)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Scroll below the Quotes table grid.\n2. Check for 'Frequently Asked Questions' header and accordion items.",
    "Expected Result (Figma Spec / Frame 622)": "Dedicated FAQ Accordion module rendered below table with Quotes-specific questions (up to 8 FAQs).",
    "Actual Result (mcstaging2 Live)": "FAQ block is 100% MISSING on live staging DOM. Area below table is blank white space.",
    "Status": "CRITICAL FAIL (Active Defect 03)",
    "Severity": "CRITICAL",
    "Evidence Reference": "screenshots/defects/DEFECT_03_MISSING_FAQ_ACCORDION_BLOCK.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-007",
    "Module": "FAQ Section Interaction",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify FAQ Accordion Interaction (Closed by Default, Single Open)",
    "Preconditions": "FAQ Accordion component rendered",
    "Test Steps": "1. Observe initial accordion state.\n2. Click accordion 1 to expand.\n3. Click accordion 2 to expand.",
    "Expected Result (Figma Spec / Frame 622)": "All accordions closed by default. Opening another accordion automatically closes previously open item.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Entire FAQ component is missing from live DOM.",
    "Status": "BLOCKED",
    "Severity": "HIGH",
    "Evidence Reference": "figma/FIGMA_SPEC_FRAME_622.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-008",
    "Module": "Support Section",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Presence of 'Need help? Contact our sales team' Content Block",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Scroll to bottom of page main content area.\n2. Check for contact support details.",
    "Expected Result (Figma Spec / Frame 622)": "Render dedicated Contact Sales Block below FAQs with US phone, email, and portal order change disclaimer.",
    "Actual Result (mcstaging2 Live)": "Block is 100% MISSING on live staging DOM.",
    "Status": "CRITICAL FAIL (Active Defect 04)",
    "Severity": "CRITICAL",
    "Evidence Reference": "screenshots/defects/DEFECT_04_MISSING_NEED_HELP_SUPPORT_BLOCK.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-009",
    "Module": "Sidebar Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify My Account Navigation Numerical Count Badges",
    "Preconditions": "Logged-in Trade Customer viewing left sidebar",
    "Test Steps": "1. Inspect 'Quotes', 'Holds', and 'Orders' items in left navigation menu.",
    "Expected Result (Figma Spec / Frame 622)": "Items display numerical count pill badges (e.g., Quotes [723], Holds [3], Orders [3]).",
    "Actual Result (mcstaging2 Live)": "No counter badges exist in the left sidebar on live staging.",
    "Status": "FAIL (Active Defect 05)",
    "Severity": "MEDIUM",
    "Evidence Reference": "screenshots/defects/DEFECT_05_MISSING_SIDEBAR_COUNT_BADGES.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-010",
    "Module": "Mobile Responsive",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile Viewport Layout & Header Clipping (390px)",
    "Preconditions": "Mobile viewport (iPhone 14/15 390x844) on /gw_quotes/quote/index/",
    "Test Steps": "1. Load page on mobile viewport.\n2. Inspect table headers and right viewport edge.",
    "Expected Result (Figma Spec / Frame 622)": "Touch-friendly responsive mobile cards or smooth horizontal scroll without clipping.",
    "Actual Result (mcstaging2 Live)": "Table header overflows screen edge, truncating 'ACTIONS' to 'ACTION'; raw blue alert box displayed.",
    "Status": "FAIL (Active Defect 06)",
    "Severity": "HIGH",
    "Evidence Reference": "screenshots/defects/DEFECT_06_MOBILE_HEADER_TRUNCATION_AND_RAW_ALERT.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-011",
    "Module": "Storefront Footer",
    "Auth Matrix": "Public / Trade",
    "Test Scenario / Title": "Verify Scope Isolation (No Australian Branding Leakage)",
    "Preconditions": "Logged-in Trade Customer on US storefront (/gw_quotes/quote/index/)",
    "Test Steps": "1. Scroll down to page footer.\n2. Inspect trust badges and copyright copy.",
    "Expected Result (Figma Spec / Frame 622)": "US Storefront must strictly exclude Australian Kangaroo owned badge.",
    "Actual Result (mcstaging2 Live)": "Displays 'AUSTRALIAN OWNED & RUN' kangaroo badge in footer.",
    "Status": "FAIL (Active Defect 07)",
    "Severity": "HIGH",
    "Evidence Reference": "screenshots/defects/DEFECT_07_AUSTRALIAN_KANGAROO_FOOTER_BADGE.png"
  }
];

// Write CSV
const csvHeaders = Object.keys(testCases[0]);
const csvRows = testCases.map(row => {
  return csvHeaders.map(header => {
    let val = row[header] || '';
    if (val.includes(',') || val.includes('\n') || val.includes('"')) {
      val = `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  }).join(',');
});
const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
const csvPath = path.join(BASE_DIR, 'My_Quotes_Test_Cases.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`✅ Saved updated CSV: ${csvPath}`);

// Write XLSX
const ws = XLSX.utils.json_to_sheet(testCases);
const colWidths = [
  { wch: 18 }, // Test Case ID
  { wch: 24 }, // Module
  { wch: 22 }, // Auth Matrix
  { wch: 38 }, // Test Scenario
  { wch: 32 }, // Preconditions
  { wch: 48 }, // Test Steps
  { wch: 48 }, // Expected Result
  { wch: 48 }, // Actual Result
  { wch: 22 }, // Status
  { wch: 25 }, // Severity
  { wch: 38 }  // Evidence Reference
];
ws['!cols'] = colWidths;

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'My Quotes Test Cases');
const xlsxPath = path.join(BASE_DIR, 'My_Quotes_Test_Cases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`✅ Saved updated Excel: ${xlsxPath}`);
