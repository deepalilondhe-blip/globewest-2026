const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes';

const testCases = [
  {
    "Test Case ID": "TC-GW-QUOTES-001",
    "Module": "Filter Tabs",
    "Test Case Title": "Verify Default Active Status Filter Tab is 'ALL'",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Navigate to /gw_quotes/quote/index/\n2. Observe active tab state in filter group.",
    "Expected Result (Figma Spec / Frame 622)": "Active tab must default to 'ALL' with solid charcoal background (#2b1d16) and white text.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Page defaults to 'ALL' tab with solid dark pill active state.",
    "Status": "PASS (Verified Live)",
    "Severity": "HIGH",
    "Evidence Reference": "screenshots/desktop/01_my_quotes_desktop_live_full.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-002",
    "Module": "Search Bar",
    "Test Case Title": "Verify Search Input Placement Inline with Filter Tabs",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect horizontal row containing filter tabs.\n2. Check search input placement and placeholder text.",
    "Expected Result (Figma Spec / Frame 622)": "Search bar ('Search [🔍]') is right-aligned on the SAME horizontal row directly beside filter tabs.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Search bar is positioned inline on the same horizontal row to the right of filter tabs.",
    "Status": "PASS (Verified Live)",
    "Severity": "MEDIUM",
    "Evidence Reference": "screenshots/desktop/01_my_quotes_desktop_live_full.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-003",
    "Module": "Table Columns",
    "Test Case Title": "Verify Consolidated 8 Columns (Redundant DETAILS Column Removed)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect table headers and data columns on desktop.\n2. Count columns.",
    "Expected Result (Figma Spec / Frame 622)": "Table must contain 8 columns. Standalone DETAILS column eliminated.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Standalone DETAILS column removed; table renders exactly 8 columns.",
    "Status": "PASS (Verified Live)",
    "Severity": "HIGH",
    "Evidence Reference": "screenshots/desktop/01_my_quotes_desktop_live_full.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-004",
    "Module": "Table Headers",
    "Test Case Title": "Verify Table Column Naming Parity (EXP. DATE, ORDER NAME)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect text strings of table headers.",
    "Expected Result (Figma Spec / Frame 622)": "Headers must read: QUOTE N, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL, ACTIONS.",
    "Actual Result (mcstaging2 Live)": "FAIL: Column 2 displays 'EXPIRY DATE' instead of 'EXP. DATE', and Column 4 displays 'QUOTE NAME' instead of 'ORDER NAME'.",
    "Status": "FAIL (Defect 01)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_01_HEADER_COPY_MISMATCH.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-005",
    "Module": "Empty State",
    "Test Case Title": "Verify Brand-Styled Empty State Container",
    "Preconditions": "Logged-in Trade Customer with 0 quotes on /gw_quotes/quote/index/",
    "Test Steps": "1. View Quotes table with 0 records or empty filter result.",
    "Expected Result (Figma Spec / Frame 622)": "Clean, luxury brand-styled empty state container adhering to GlobeWest typography.",
    "Actual Result (mcstaging2 Live)": "FAIL: Displays raw default unstyled Magento blue alert banner ('(i) Table is empty!').",
    "Status": "FAIL (Defect 02)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_02_RAW_MAGENTO_EMPTY_ALERT.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-006",
    "Module": "FAQ Section",
    "Test Case Title": "Verify Presence of FAQ Accordion Section Below Table",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Scroll below Quotes table grid.\n2. Check for 'Frequently Asked Questions' header and accordion items.",
    "Expected Result (Figma Spec / Frame 622)": "Dedicated FAQ Accordion module rendered below table with Quotes-specific questions (up to 8 FAQs, all closed by default, single open).",
    "Actual Result (mcstaging2 Live)": "FAIL: Entire FAQ Accordion block is 100% MISSING from the live staging DOM (pure whitespace below table).",
    "Status": "FAIL (Defect 03)",
    "Severity": "CRITICAL",
    "Evidence Reference": "comparison/COMPARISON_03_MISSING_FAQ_ACCORDION_BLOCK.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-007",
    "Module": "Support Section",
    "Test Case Title": "Verify Presence of 'Need help? Contact our sales team' Content Block",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Scroll to bottom of page main content area.\n2. Check for contact support details.",
    "Expected Result (Figma Spec / Frame 622)": "Render dedicated Contact Sales Block below FAQs with US phone, email, and portal order change disclaimer.",
    "Actual Result (mcstaging2 Live)": "FAIL: Entire Need Help support block is 100% MISSING from live staging DOM.",
    "Status": "FAIL (Defect 04)",
    "Severity": "CRITICAL",
    "Evidence Reference": "comparison/COMPARISON_04_MISSING_NEED_HELP_SUPPORT_BLOCK.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-008",
    "Module": "Sidebar Navigation",
    "Test Case Title": "Verify My Account Navigation Numerical Count Badges",
    "Preconditions": "Logged-in Trade Customer viewing left sidebar",
    "Test Steps": "1. Inspect 'Quotes', 'Holds', and 'Orders' items in left navigation menu.",
    "Expected Result (Figma Spec / Frame 622)": "Items display numerical count pill badges (e.g., Quotes [723], Holds [3], Orders [3]).",
    "Actual Result (mcstaging2 Live)": "FAIL: Zero counter badges rendered in the left sidebar on live staging.",
    "Status": "FAIL (Defect 05)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_05_MISSING_SIDEBAR_COUNT_BADGES.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-009",
    "Module": "Mobile Responsive",
    "Test Case Title": "Verify Mobile Actions Column Header",
    "Preconditions": "Mobile viewport on /gw_quotes/quote/index/",
    "Test Steps": "1. Load page on mobile viewport.\n2. Verify Actions header column in table.",
    "Expected Result (Figma Spec / Frame 622)": "Actions column clearly accessible via table layout.",
    "Actual Result (mcstaging2 Live)": "VERIFIED: Table displays Actions column header in DOM.",
    "Status": "PASS (Verified Live)",
    "Severity": "LOW",
    "Evidence Reference": "screenshots/mobile/03_my_quotes_mobile_table_area.png"
  }
];

// Write Excel (.xlsx)
const worksheet = XLSX.utils.json_to_sheet(testCases);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'My Quotes Test Cases');
const xlsxPath = path.join(OUT_DIR, 'My_Quotes_Test_Cases.xlsx');
XLSX.writeFile(workbook, xlsxPath);
console.log('✅ Generated Excel:', xlsxPath);

// Write CSV (.csv)
const csvContent = [
  Object.keys(testCases[0]).join(','),
  ...testCases.map(tc => Object.values(tc).map(v => `"${String(v).replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(','))
].join('\n');
const csvPath = path.join(OUT_DIR, 'My_Quotes_Test_Cases.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log('✅ Generated CSV:', csvPath);
