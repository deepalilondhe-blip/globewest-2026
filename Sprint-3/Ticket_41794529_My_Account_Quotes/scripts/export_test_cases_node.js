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
    "Expected Result (Figma Spec / Frame 622)": "Active tab must default to 'ALL' with solid charcoal background (#1E1E1E) and white text.",
    "Actual Result (mcstaging2 Live)": "Page erroneously defaults to 'OPEN' tab with plain underlined text. 'ALL' tab is unselected.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_01_DEFAULT_ACTIVE_TAB.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-002",
    "Module": "Filter Tabs",
    "Test Case Title": "Verify Filter Tabs Styling & Segmented Pill Container",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect DOM computed styles of tabs container.\n2. Verify border radius, padding, and active/inactive styling.",
    "Expected Result (Figma Spec / Frame 622)": "Tabs render as a unified segmented control with 4px border-radius. Inactive tabs have border; active tab has dark fill.",
    "Actual Result (mcstaging2 Live)": "Tabs render as unstyled plain text links with standard Magento text-decoration underline on active.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_PASS_01_DEFAULT_ACTIVE_TAB.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-003",
    "Module": "Table Structure",
    "Test Case Title": "Verify Consolidated 'Actions' Dropdown Column (No Separate DETAILS Column)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect table headers and data columns on desktop.\n2. Count columns and inspect row action CTAs.",
    "Expected Result (Figma Spec / Frame 622)": "Table must contain 8 columns. Actions housed under single dropdown ('Actions ∨') for desktop & mobile. No separate DETAILS column.",
    "Actual Result (mcstaging2 Live)": "Table displays 9 columns with an unstyled redundant 'DETAILS' column in addition to 'ACTIONS'.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_02_TABLE_COLUMNS_AND_ACTIONS.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-004",
    "Module": "Table Headers",
    "Test Case Title": "Verify Table Column Naming Parity (EXP. DATE, ORDER NAME)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect text strings of table headers.",
    "Expected Result (Figma Spec / Frame 622)": "Headers must read: QUOTE N, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL, ACTIONS.",
    "Actual Result (mcstaging2 Live)": "Staging uses 'EXPIRY DATE' instead of 'EXP. DATE', and 'QUOTE NAME' instead of 'ORDER NAME'.",
    "Status": "FAIL (Copy Mismatch)",
    "Severity": "LOW",
    "Evidence Reference": "comparison/COMPARISON_PASS_02_TABLE_COLUMNS_AND_ACTIONS.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-005",
    "Module": "Date Formatting",
    "Test Case Title": "Verify Quote Dates Display in USA Format (MM/DD/YYYY)",
    "Preconditions": "Logged-in Trade Customer with active quote records",
    "Test Steps": "1. Inspect dates rendered under EXP. DATE column.\n2. Verify month precedes day.",
    "Expected Result (Figma Spec / Frame 622)": "Dates must be formatted in US standard (MM/DD/YYYY) per Frame 622 explicit directive.",
    "Actual Result (mcstaging2 Live)": "Pending quote records creation; staging baseline must enforce US locale formatting.",
    "Status": "TO VERIFY (Awaiting Data)",
    "Severity": "HIGH",
    "Evidence Reference": "figma/FIGMA_SPEC_FRAME_622.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-006",
    "Module": "Search Bar",
    "Test Case Title": "Verify Search Input Placement Inline with Filter Tabs",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Inspect horizontal row containing filter tabs.\n2. Check search input placement and placeholder text.",
    "Expected Result (Figma Spec / Frame 622)": "Search bar ('Search [🔍]') is right-aligned on the SAME horizontal row directly beside the filter tabs.",
    "Actual Result (mcstaging2 Live)": "Search bar sits in a detached position above the table right, breaking inline row alignment with tabs.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_PASS_03_SEARCH_BAR_ALIGNMENT.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-007",
    "Module": "FAQ Section",
    "Test Case Title": "Verify Presence of FAQ Accordion Section Below Table",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Scroll below Quotes table grid.\n2. Check for 'Frequently Asked Questions' header and accordion items.",
    "Expected Result (Figma Spec / Frame 622)": "Dedicated FAQ Accordion module rendered below table with Quotes-specific questions (up to 8 FAQs).",
    "Actual Result (mcstaging2 Live)": "FAQ block is 100% MISSING on live staging. Area below table is blank white space.",
    "Status": "CRITICAL FAIL (Missing Module)",
    "Severity": "CRITICAL",
    "Evidence Reference": "comparison/COMPARISON_PASS_04_MISSING_FAQ_BLOCK.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-008",
    "Module": "FAQ Section",
    "Test Case Title": "Verify FAQ Accordion Interaction (Closed by Default, Single Open)",
    "Preconditions": "FAQ Accordion component rendered",
    "Test Steps": "1. Observe initial accordion state.\n2. Click accordion 1 to expand.\n3. Click accordion 2 to expand.",
    "Expected Result (Figma Spec / Frame 622)": "All accordions closed by default. Opening another accordion automatically closes previously open item.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Entire FAQ component is missing from DOM.",
    "Status": "BLOCKED (Missing Module)",
    "Severity": "HIGH",
    "Evidence Reference": "figma/FIGMA_SPEC_FRAME_622.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-009",
    "Module": "Support Section",
    "Test Case Title": "Verify Presence of 'Need help? Contact our sales team' Content Block",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/",
    "Test Steps": "1. Scroll to bottom of page main content area.\n2. Check for contact support details.",
    "Expected Result (Figma Spec / Frame 622)": "Render dedicated Contact Sales Block below FAQs with US phone, email, and portal order change disclaimer.",
    "Actual Result (mcstaging2 Live)": "Block is 100% MISSING on live staging.",
    "Status": "CRITICAL FAIL (Missing Module)",
    "Severity": "CRITICAL",
    "Evidence Reference": "comparison/COMPARISON_PASS_05_MISSING_NEED_HELP_BLOCK.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-010",
    "Module": "Sidebar Navigation",
    "Test Case Title": "Verify My Account Navigation Count Badges",
    "Preconditions": "Logged-in Trade Customer viewing left sidebar",
    "Test Steps": "1. Inspect 'Quotes', 'Holds', and 'Orders' items in left navigation menu.",
    "Expected Result (Figma Spec / Frame 622)": "Items display numerical count pill badges (e.g., Quotes [723], Holds [3], Orders [3]).",
    "Actual Result (mcstaging2 Live)": "No counter badges exist in the left sidebar on live staging.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_PASS_06_SIDEBAR_COUNT_BADGES.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-011",
    "Module": "Mobile Responsive",
    "Test Case Title": "Verify Mobile Viewport Layout & Empty State Parity (390px)",
    "Preconditions": "Mobile viewport (iPhone 14/15 390x844) on /gw_quotes/quote/index/",
    "Test Steps": "1. Load page on mobile viewport.\n2. Observe tabs, table/cards layout, and empty state.",
    "Expected Result (Figma Spec / Frame 622)": "Clean mobile layout with styled segmented tabs, full-width search, and brand-styled empty state.",
    "Actual Result (mcstaging2 Live)": "Displays raw Magento default blue alert box ('ⓘ Table is empty!') and unstyled tabs.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_07_MOBILE_RESPONSIVE_PARITY.png"
  },
  {
    "Test Case ID": "TC-GW-QUOTES-012",
    "Module": "Storefront Footer",
    "Test Case Title": "Verify Scope Isolation (No Australian Branding Leakage)",
    "Preconditions": "Logged-in Trade Customer on US storefront (/gw_quotes/quote/index/)",
    "Test Steps": "1. Scroll down to page footer.\n2. Inspect trust badges and copyright copy.",
    "Expected Result (Figma Spec / Frame 622)": "US Storefront must strictly exclude Australian Kangaroo owned badge.",
    "Actual Result (mcstaging2 Live)": "Displays 'AUSTRALIAN OWNED & RUN' kangaroo badge in footer.",
    "Status": "FAIL (Scope Leak)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_08_FOOTER_SCOPE_LEAK.png"
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
