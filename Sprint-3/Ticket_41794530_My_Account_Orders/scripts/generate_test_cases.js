const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-ORDERS-001",
    "Module": "Authentication & Access",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Access to My Orders Portal for Authenticated Trade Customer",
    "Preconditions": "User holds an active Trade Customer account (deepali.londhe@overdose.digital) on mcstaging2.globewest.com",
    "Test Steps": "1. Navigate to customer login page (/customer/account/login/)\n2. Enter valid Trade Customer credentials\n3. Click 'Sign In'\n4. Navigate to My Orders URL (/gw_orders/order/index/)",
    "Expected Result (Figma Spec / Frame 624)": "Trade Customer successfully accesses My Orders portal. Header, left navigation sidebar, and Orders table container render cleanly with HTTP 200.",
    "Actual Result (mcstaging2 Live)": "Page loads successfully with HTTP 200 for authenticated trade customer. Left navigation and table container are displayed.",
    "Status": "PASS",
    "Severity": "LOW (Core Route Verified)",
    "Evidence Reference": "screenshots/desktop/01_my_orders_desktop_live_full.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-002",
    "Module": "Filter Tabs - Default State",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Default Active Status Filter Tab is 'AWAITING PAYMENT' (Frame 624 Rule 1)",
    "Preconditions": "Logged-in Trade Customer accessing clean session on /gw_orders/order/index/",
    "Test Steps": "1. Navigate to /gw_orders/order/index/\n2. Locate the status filter tabs directly above the orders grid\n3. Inspect which tab is highlighted and active by default",
    "Expected Result (Figma Spec / Frame 624)": "Per Frame 624: 'Tabs that filter table view of orders shown based on status. Default to awaiting payment'. Active tab must default to 'AWAITING PAYMENT' with solid dark pill styling (#2B1D16).",
    "Actual Result (mcstaging2 Live)": "Page erroneously defaults to the 'OPEN' tab with a plain text underline. 'AWAITING PAYMENT' tab is missing.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_01_DEFAULT_ACTIVE_TAB.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-003",
    "Module": "Filter Tabs - Status Parity",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify All 4 Status Filter Tabs Exist with Segmented Pill Styling",
    "Preconditions": "Desktop viewport (1440x900) on /gw_orders/order/index/",
    "Test Steps": "1. Inspect all rendered filter tabs.\n2. Count tabs and inspect labels.\n3. Inspect computed CSS styles (border-radius, padding, background).",
    "Expected Result (Figma Spec / Frame 624)": "Render 4 segmented tabs: [ AWAITING PAYMENT ] [ PENDING SHIPMENT ] [ DISPATCHED ] [ CLOSED ]. Pills have capsule shape and active dark fill.",
    "Actual Result (mcstaging2 Live)": "Only renders 3 tabs: 'ALL', 'OPEN', 'CLOSED'. Tabs are unstyled plain text links. Missing 'PENDING SHIPMENT' and 'DISPATCHED'.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_01_DEFAULT_ACTIVE_TAB.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-004",
    "Module": "Table Columns - Consolidation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Strict 6-Column Layout (Frame 624 Rule 2)",
    "Preconditions": "Logged-in Trade Customer on /gw_orders/order/index/",
    "Test Steps": "1. Inspect table headers on desktop viewport.\n2. Count number of columns.\n3. Verify column header labels.",
    "Expected Result (Figma Spec / Frame 624)": "Per Frame 624: 'Reduction of columns shown'. Exactly 6 columns: ORDER ⬍, DATE ⬍, STATUS ⬍, TOTAL ⬍, BALANCE ⬍, ACTIONS.",
    "Actual Result (mcstaging2 Live)": "Live staging displays 10 columns: Order, Date, Cust po#, Order name, Client Name, Status, Total, Balance, Details, Actions.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_02_TABLE_COLUMNS_AND_ACTIONS.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-005",
    "Module": "Table Actions - Elimination of DETAILS",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Elimination of Standalone DETAILS Column & Redundant Columns",
    "Preconditions": "Logged-in Trade Customer on /gw_orders/order/index/",
    "Test Steps": "1. Verify whether a separate 'DETAILS' header/column exists.\n2. Verify presence of 'Cust po#', 'Order name', 'Client Name'.",
    "Expected Result (Figma Spec / Frame 624)": "No standalone 'DETAILS' column. No 'Cust po#', 'Order name', or 'Client Name' columns in default grid.",
    "Actual Result (mcstaging2 Live)": "Redundant unstyled 'DETAILS' column is rendered alongside separate 'ACTIONS' column, plus 3 redundant metadata columns.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_02_TABLE_COLUMNS_AND_ACTIONS.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-006",
    "Module": "Order Details Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Clickable Order Number Link to Order Details Page (Frame 624 Rule 4)",
    "Preconditions": "Orders grid populated with order records",
    "Test Steps": "1. Hover over the Order Number (e.g., #CH03021).\n2. Click on the Order Number link.\n3. Observe destination URL and rendered view.",
    "Expected Result (Figma Spec / Frame 624)": "Per Frame 624: 'Order number to be linked + clickable to the order details page'. Clicking order # navigates to /gw_orders/order/view/order_id/X/.",
    "Actual Result (mcstaging2 Live)": "Must verify clickable hyperlink presence once test data / dev build is deployed.",
    "Status": "TO VERIFY (Awaiting Data)",
    "Severity": "HIGH",
    "Evidence Reference": "figma/CROP_FRAME_624.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-007",
    "Module": "Table Actions - Dropdown",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Unified 'Actions ▾' Dropdown on Desktop & Mobile (Frame 624 Rule 3)",
    "Preconditions": "Orders grid populated with order records",
    "Test Steps": "1. Locate 'ACTIONS' column on each row.\n2. Click 'Actions ▾' dropdown button.\n3. Verify menu options (View Order, Reorder, Print Invoice).",
    "Expected Result (Figma Spec / Frame 624)": "Per Frame 624: 'Actions housed under dropdown for both mobile + desktop as per other table functionality'. Clean consolidated dropdown on every row.",
    "Actual Result (mcstaging2 Live)": "Actions are split across separate Details text and raw Actions column with no unified dropdown.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_02_TABLE_COLUMNS_AND_ACTIONS.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-008",
    "Module": "Date Formatting",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Dates Enforce USA Standard Format (MM/DD/YYYY)",
    "Preconditions": "Orders grid populated with order records",
    "Test Steps": "1. Inspect dates displayed in DATE column.\n2. Verify calendar date syntax and month-first order.",
    "Expected Result (Figma Spec / Frame 624)": "Per Frame 624: 'Ensure dates displayed are in USA format'. E.g., 01/24/2026 (MM/DD/YYYY).",
    "Actual Result (mcstaging2 Live)": "Awaiting live order records; ensure US locale date pipe is applied in Knockout / PHTML template.",
    "Status": "MONITOR (Awaiting Data)",
    "Severity": "MEDIUM",
    "Evidence Reference": "figma/CROP_FRAME_624.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-009",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Search Input Placed Inline Horizontally with Filter Tabs",
    "Preconditions": "Logged-in Trade Customer on /gw_orders/order/index/",
    "Test Steps": "1. Inspect horizontal row above orders grid.\n2. Check position of search bar relative to filter tabs.",
    "Expected Result (Figma Spec / Frame 624)": "Search bar ('Search [🔍]') is right-aligned on the exact same horizontal flex row alongside status filter tabs.",
    "Actual Result (mcstaging2 Live)": "Search bar floats in a detached row above the table, breaking inline row parity.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_PASS_03_SEARCH_BAR_ALIGNMENT.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-010",
    "Module": "FAQ Accordion Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Presence of Dedicated FAQ Accordion Block Below Table (Frame 624)",
    "Preconditions": "Logged-in Trade Customer on /gw_orders/order/index/",
    "Test Steps": "1. Scroll down below the Orders table grid.\n2. Check for 'Frequently Asked Questions' section header and accordion items.",
    "Expected Result (Figma Spec / Frame 624)": "Per Frame 624: Dedicated 'Frequently Asked Questions' block rendered below table with orders-specific questions (up to 8 FAQs).",
    "Actual Result (mcstaging2 Live)": "FAQ component is 100% MISSING from live staging DOM. Direct transition from table to raw support text.",
    "Status": "CRITICAL FAIL (Missing Module)",
    "Severity": "CRITICAL",
    "Evidence Reference": "comparison/COMPARISON_PASS_04_MISSING_FAQ_BLOCK.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-011",
    "Module": "FAQ Accordion Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify FAQ Accordion Interaction Rules (Closed by Default, Single Open)",
    "Preconditions": "FAQ Accordion component rendered",
    "Test Steps": "1. Verify initial accordion state upon page load.\n2. Click accordion 1 to expand.\n3. Click accordion 2 to expand.",
    "Expected Result (Figma Spec / Frame 624)": "Per Frame 624: 'All accordions closed by default. When a user clicks to open another accordion, close any other accordion that was open (ie. only one open at a time)'.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Entire FAQ component is missing from DOM.",
    "Status": "BLOCKED (Missing Module)",
    "Severity": "HIGH",
    "Evidence Reference": "figma/CROP_FRAME_624.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-012",
    "Module": "Support Content Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 'Need to Change an Order?' Support Block US Scope Isolation",
    "Preconditions": "Logged-in Trade Customer on /gw_orders/order/index/",
    "Test Steps": "1. Scroll to the support section below FAQs.\n2. Inspect phone number and email address.",
    "Expected Result (Figma Spec / Frame 624)": "Displays US toll-free customer support hotline and US domain email link (sales@globewest.com). Zero Australian phone or domain leaks.",
    "Actual Result (mcstaging2 Live)": "Displays Australian phone '+613 9518 1600 #3' and email 'sales@globewest.com.au'.",
    "Status": "FAIL (Scope Leak)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_05_SUPPORT_BLOCK_SCOPE_LEAK.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-013",
    "Module": "Sidebar Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Left Account Navigation Counter Badges (Orders, Quotes, Holds)",
    "Preconditions": "Trade Customer viewing left sidebar menu",
    "Test Steps": "1. Inspect 'Orders', 'Quotes', and 'Holds' menu items.\n2. Verify presence and styling of numerical count badges.",
    "Expected Result (Figma Spec / Frame 624)": "Menu items display high-contrast blue capsule count badges: Quotes [723], Holds [3], Orders [3].",
    "Actual Result (mcstaging2 Live)": "Zero numerical count badges rendered in sidebar navigation on live staging.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_PASS_06_SIDEBAR_COUNT_BADGES.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-014",
    "Module": "Mobile Responsive Parity",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile Viewport Layout, Empty State & Touch Parity (390x844)",
    "Preconditions": "Mobile viewport (iPhone 14/15 390x844) on /gw_orders/order/index/",
    "Test Steps": "1. Load page on mobile viewport.\n2. Observe search bar, filter tabs, table card layout, and empty state.",
    "Expected Result (Figma Spec / Frame 624)": "Clean mobile layout with touch-friendly tabs, full-width search, responsive cards with unified 'Actions ▾' dropdown, and branded empty state.",
    "Actual Result (mcstaging2 Live)": "Displays default unstyled Magento blue alert box ('ⓘ Table is empty!') and stacked search above plain text links.",
    "Status": "FAIL (Pre-Dev Defect)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_07_MOBILE_RESPONSIVE_PARITY.png"
  },
  {
    "Test Case ID": "TC-GW-ORDERS-015",
    "Module": "Storefront Footer",
    "Auth Matrix": "Public / Trade",
    "Test Scenario / Title": "Verify US Storefront Footer Suppresses Australian Kangaroo Branding",
    "Preconditions": "View storefront footer on /gw_orders/order/index/",
    "Test Steps": "1. Scroll down to bottom footer.\n2. Inspect trust badges and branding logos.",
    "Expected Result (Figma Spec / Frame 624)": "US Storefront must strictly suppress Australian Kangaroo logo and 'AUSTRALIAN OWNED & RUN' copy.",
    "Actual Result (mcstaging2 Live)": "Displays Australian Kangaroo silhouette logo and 'AUSTRALIAN OWNED & RUN' badge.",
    "Status": "FAIL (Scope Leak)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_PASS_08_FOOTER_SCOPE_LEAK.png"
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
const csvPath = path.join(BASE_DIR, 'My_Orders_Test_Cases.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`✅ Saved CSV: ${csvPath}`);

// Write XLSX using xlsx
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
XLSX.utils.book_append_sheet(wb, ws, 'My Orders Test Cases');
const xlsxPath = path.join(BASE_DIR, 'My_Orders_Test_Cases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`✅ Saved Excel: ${xlsxPath}`);
