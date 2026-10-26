const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-HOLDS-001",
    "Module": "Authentication & Route Access",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Direct URL Access Redirection to Customer Login",
    "Preconditions": "Public unauthenticated guest session on US Staging (mcstaging2.globewest.com)",
    "Test Steps": "1. Open browser in incognito / logged-out state\n2. Navigate directly to https://mcstaging2.globewest.com/gw_orders/hold/index/\n3. Observe HTTP status code and redirect target",
    "Expected Result (Figma Spec / Frame 621)": "System must strictly prohibit unauthorized access to trade account portals and redirect the guest to /customer/account/login/ with an informational message.",
    "Actual Result (mcstaging2 Live)": "Page redirects immediately to /customer/account/login/ with standard session prompt.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 3 Dual-Auth"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-002",
    "Module": "Authentication & Route Access",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Authenticated Trade Customer Access to My Holds Portal",
    "Preconditions": "Active session with US Trade account credentials (deepali.londhe@overdose.digital)",
    "Test Steps": "1. Log in with US Trade account\n2. Navigate to /gw_orders/hold/index/\n3. Verify HTTP 200 response and visual elements",
    "Expected Result (Figma Spec / Frame 621)": "My Holds portal loads cleanly with HTTP 200. Displays page title 'My Holds', subtitle, status filter tabs, search bar, holds table, and FAQ module.",
    "Actual Result (mcstaging2 Live)": "Dashboard loads successfully with HTTP 200 and all core dashboard containers.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 Specification"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-003",
    "Module": "Account Sidebar Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Active Menu Item Highlighting on 'Holds' Link",
    "Preconditions": "Trade Customer on /gw_orders/hold/index/ desktop viewport",
    "Test Steps": "1. Locate left sidebar menu under 'MY ACCOUNT'\n2. Inspect CSS classes and computed styles of the 'Holds' link\n3. Compare against adjacent links (Quotes, Orders)",
    "Expected Result (Figma Spec / Frame 621)": "'Holds' link receives active styling (class 'current' / dark brown color rgb(56, 28, 18) and bold weight), clearly identifying current section.",
    "Actual Result (mcstaging2 Live)": "'Holds' element has 'nav item current item--counter item--holds' with active visual indicator.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "UI Navigation Hierarchy"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-004",
    "Module": "Account Sidebar Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Hold Count Badge Math and Pill Display (Developer Update)",
    "Preconditions": "Trade Customer with 3 Active Holds and 2 Inactive Holds on record",
    "Test Steps": "1. Inspect the blue count badge (.item__counter) rendered adjacent to 'Holds' in left navigation\n2. Verify displayed numeric value\n3. Check border-radius pill styling",
    "Expected Result (Figma Spec / Frame 621)": "Badge renders total count '5' (sum of 3 Active + 2 Inactive holds) in a pill-shaped container, verifying developer Vinod's badge update.",
    "Actual Result (mcstaging2 Live)": "Badge renders '5' inside .item__counter matching total holds count. Verified fixed.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 Counter Badge Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-005",
    "Module": "Status Filter Tabs",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Default 'ACTIVE' Filter Tab Selection & Pill Styling",
    "Preconditions": "Trade Customer on My Holds initial dashboard load",
    "Test Steps": "1. Inspect filter buttons above table\n2. Check active class on 'ACTIVE' button\n3. Inspect computed background-color and text color",
    "Expected Result (Figma Spec / Frame 621)": "'ACTIVE' tab selected by default with solid dark brown background (#2B1D16 / rgb(56, 28, 18)) and white text (#FFFFFF). 'INACTIVE' is unselected with neutral outline.",
    "Actual Result (mcstaging2 Live)": "'ACTIVE' has class 'account-listing-ui__filters__filter is-active' with background rgb(56, 28, 18) and white text.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 Rule 1"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-006",
    "Module": "Status Filter Tabs",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Tab Switching State Transition to 'INACTIVE'",
    "Preconditions": "Trade Customer on My Holds page with active tab selected",
    "Test Steps": "1. Click 'INACTIVE' filter tab\n2. Observe active styling switch\n3. Verify table content updates dynamically to display inactive holds",
    "Expected Result (Figma Spec / Frame 621)": "Active styling switches cleanly to 'INACTIVE' tab. Table updates to display inactive/expired holds (2 records) without page reloading or UI breakage.",
    "Actual Result (mcstaging2 Live)": "'INACTIVE' tab activates; table filters cleanly to display 2 inactive records.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 Functional Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-007",
    "Module": "Status Filter Tabs",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Switching Back from 'INACTIVE' to 'ACTIVE' Tab",
    "Preconditions": "Trade Customer on 'INACTIVE' tab view",
    "Test Steps": "1. Click 'ACTIVE' filter tab\n2. Verify tab styling returns to 'ACTIVE'\n3. Verify table displays the 3 active hold records",
    "Expected Result (Figma Spec / Frame 621)": "'ACTIVE' tab regains dark brown active styling. Table re-filters to display active holds.",
    "Actual Result (mcstaging2 Live)": "Tab transitions smoothly back to ACTIVE state with 3 active records.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 621 State Management"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-008",
    "Module": "Status Filter Tabs",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Inactive Holds Advisory Banner Rendering",
    "Preconditions": "Trade Customer switched to 'INACTIVE' tab",
    "Test Steps": "1. View top of inactive holds table\n2. Inspect advisory notice text for expired/inactive items",
    "Expected Result (Figma Spec / Frame 621)": "Advisory text displays informing the user that holds expire after 2 business days and how to request re-activation.",
    "Actual Result (mcstaging2 Live)": "Informational banner renders cleanly on inactive view.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 621 UX Notification Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-009",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Horizontal Inline Search Input Alignment with Filter Tabs",
    "Preconditions": "Trade Customer on desktop viewport (1440px)",
    "Test Steps": "1. Inspect positioning of search input box relative to filter tabs\n2. Check placeholder and magnifying glass icon placement",
    "Expected Result (Figma Spec / Frame 621)": "Search input sits horizontally on the same row adjacent to filter tabs with inset magnifying glass search icon per Figma mockup.",
    "Actual Result (mcstaging2 Live)": "Search bar is aligned inline horizontally beside tabs with search icon.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Figma Artboard Alignment"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-010",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Filter Table Records by Specific Hold Number",
    "Preconditions": "Multiple active holds present in table",
    "Test Steps": "1. Type Hold # '175' into search input\n2. Press Enter or click search button\n3. Observe table rows",
    "Expected Result (Figma Spec / Frame 621)": "Table updates to show only the matching Hold # 175 row. Non-matching records are excluded from view.",
    "Actual Result (mcstaging2 Live)": "Table filters dynamically to show Hold # 175.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Search Functionality"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-011",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Search Execution by Customer PO# & Order Name",
    "Preconditions": "Trade Customer on My Holds dashboard",
    "Test Steps": "1. Enter PO identifier 'PO-4518' or Order Name 'Coastal Cafe Refresh' into search\n2. Submit search query",
    "Expected Result (Figma Spec / Frame 621)": "Search matches PO# and Order Name fields and returns the corresponding record.",
    "Actual Result (mcstaging2 Live)": "Matching record is returned in table.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Search Functionality"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-012",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Search Reset & Restoring Full Table View",
    "Preconditions": "Search query currently active and table filtered",
    "Test Steps": "1. Clear all text from search input box\n2. Submit empty query / press Enter\n3. Check table rows",
    "Expected Result (Figma Spec / Frame 621)": "Table resets to show all 3 active hold records without requiring full page refresh.",
    "Actual Result (mcstaging2 Live)": "Table resets and displays all active records.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Search Functionality"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-013",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Empty Search Results State Handling",
    "Preconditions": "Trade Customer on My Holds dashboard",
    "Test Steps": "1. Enter non-existent keyword (e.g. 'XYZ99999NONEXISTENT')\n2. Execute search\n3. Observe table body",
    "Expected Result (Figma Spec / Frame 621)": "Table body displays clear empty state messaging indicating no matching holds were found.",
    "Actual Result (mcstaging2 Live)": "Displays empty state notice 'Table is empty!' / 'No records found'.",
    "Status": "PASS",
    "Severity": "P3 - Low",
    "Compliance": "Empty State Standard"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-014",
    "Module": "Table Architecture",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Desktop Column Sequence & Headers Count (Frame 621 Rule)",
    "Preconditions": "Trade Customer on desktop viewport",
    "Test Steps": "1. Inspect table thead element\n2. Verify headers: HOLD, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL, ACTIONS\n3. Cross-reference Frame 621 multi-action rule",
    "Expected Result (Figma Spec / Frame 621)": "Frame 621 rule: 'if the only action available is view, hide column; otherwise actions housed under dropdown for both mobile + desktop'. If multiple actions exist, 8 columns with Actions column is expected.",
    "Actual Result (mcstaging2 Live)": "Table renders 8 columns with dedicated 'ACTIONS' column housing multi-action dropdown. Conforms to multi-action rule.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 621 Rule 2 & 4"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-015",
    "Module": "Table Architecture",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Customer PO# Column Header Label Typo ('CUST P0#' Zero vs 'CUST PO#')",
    "Preconditions": "Trade Customer on My Holds desktop view",
    "Test Steps": "1. Inspect 3rd column header text in DOM\n2. Check whether character after 'P' is digit '0' or letter 'O'\n3. Compare against data rows underneath",
    "Expected Result (Figma Spec / Frame 621)": "Header should read 'CUST PO#' (letter 'O' for Purchase Order). Both Figma mockup and live code contain 'CUST P0#' with numeric zero '0', representing a design spec typo.",
    "Actual Result (mcstaging2 Live)": "DOM renders 'CUST P0#' with number zero '0'. Matches Figma mockup, but both contain typo.",
    "Status": "FAIL (Design Typo ⚠️)",
    "Severity": "P2 - Medium",
    "Compliance": "Commercial Data Integrity"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-016",
    "Module": "Table Architecture",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Table Row Actions Dropdown Menu Interaction",
    "Preconditions": "Active hold record row with Actions trigger",
    "Test Steps": "1. Click 'Actions ⌵' button in ACTIONS column\n2. Inspect dropdown options (View, Modify / Confirm)\n3. Click outside dropdown to dismiss",
    "Expected Result (Figma Spec / Frame 621)": "Dropdown opens smoothly displaying contextual actions: 'View Hold', 'Modify / Confirm Hold'. Dismisses cleanly when clicking outside.",
    "Actual Result (mcstaging2 Live)": "Dropdown expands showing action options; dismisses cleanly on backdrop click.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 Rule 4"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-017",
    "Module": "Table Architecture",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Clickable Hold # Link Navigation to Hold Detail View",
    "Preconditions": "Trade Customer on My Holds page with active records",
    "Test Steps": "1. Click on Hold # link '175'\n2. Observe URL and destination page",
    "Expected Result (Figma Spec / Frame 621)": "Directly navigates to the Hold View/Details page (/gw_orders/hold/view/hold_id/175/) displaying hold item breakdown and product lines.",
    "Actual Result (mcstaging2 Live)": "Direct link navigates to hold detail summary page.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 Navigation Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-018",
    "Module": "Table Data Integrity",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Hold Status Badge Pill Styling & Color Coding",
    "Preconditions": "Rows with status values ('Active', 'Expired')",
    "Test Steps": "1. Inspect STATUS column cell in DOM\n2. Verify pill border-radius, background, and font styling",
    "Expected Result (Figma Spec / Frame 621)": "'Active' status renders in a pill-shaped container with distinct green/neutral accent; 'Expired' renders in subdued styling.",
    "Actual Result (mcstaging2 Live)": "Status renders with pill borders and clear visual status distinction.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-019",
    "Module": "Data Localization",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Date Format Localization for US Storefront (US MM/DD/YYYY vs AU DD/MM/YY) [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on US Staging (/gw_orders/hold/index/)",
    "Test Steps": "1. Inspect EXP. DATE column values in table rows (e.g. 14/10/26)\n2. Cross-reference Frame 621 explicit directive",
    "Expected Result (Figma Spec / Frame 621)": "Frame 621 explicitly states: 'ensure dates displayed are in USA format' (MM/DD/YYYY or MM/DD/YY, e.g. 10/14/26 for Oct 14).",
    "Actual Result (mcstaging2 Live)": "FAIL: Live storefront leaks Australian date format DD/MM/YY ('14/10/26', '07/10/26', '02/10/26'). Day 14 cannot represent a month in US standard.",
    "Status": "FAIL 🔴",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 Explicit Directive"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-020",
    "Module": "Financial & Currency",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Total Column Currency Symbol ($ USD) & 2-Decimal Precision",
    "Preconditions": "Trade Customer on US Staging My Holds page",
    "Test Steps": "1. Inspect TOTAL column values in all rows\n2. Verify currency symbol ($) and thousands comma separator",
    "Expected Result (Figma Spec / Frame 621)": "Total amounts formatted as USD currency with dollar sign ($), thousands commas, and two decimals (e.g. $2,451.00, $12,920.99, $15,296.00).",
    "Actual Result (mcstaging2 Live)": "Currency values correctly formatted as $2,451.00, $12,920.99, $15,296.00 with proper symbols.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "US Storefront Pricing Standard"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-021",
    "Module": "Editorial & Content",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Urgency Expiration Notification Banner Rendering",
    "Preconditions": "Holds present nearing expiration threshold",
    "Test Steps": "1. Inspect advisory banner text below table\n2. Verify exact copy phrasing",
    "Expected Result (Figma Spec / Frame 621)": "Displays banner text: 'Your hold is almost due to expire. Please confirm the order today to prevent your products being released'.",
    "Actual Result (mcstaging2 Live)": "Urgency banner is rendered with exact expected notification copy.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 621 Notification Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-022",
    "Module": "Table Pager & Summary",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Active Holds Item Count Summary Label ('3 Items')",
    "Preconditions": "3 active hold rows rendered in table",
    "Test Steps": "1. Inspect summary count text below table\n2. Verify number matches displayed rows count",
    "Expected Result (Figma Spec / Frame 621)": "Displays '3 Items' matching the 3 rendered rows.",
    "Actual Result (mcstaging2 Live)": "Renders '3 Items' corresponding accurately to row count.",
    "Status": "PASS",
    "Severity": "P3 - Low",
    "Compliance": "Table Summary Standard"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-023",
    "Module": "Editorial & Localization",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Sub-heading Copy US English Spelling Compliance ('favorite' vs 'favourite') [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on US Staging My Holds page",
    "Test Steps": "1. Read subtitle copy below 'My Holds' title\n2. Inspect spelling of word 'favourite'",
    "Expected Result (Figma Spec / Frame 621)": "US storefront must use US American English spelling: 'A product hold reserves your favorite items for 2 business days.'",
    "Actual Result (mcstaging2 Live)": "FAIL: Subtitle uses Australian/British spelling 'favourite': 'A product hold reserves your favourite items for 2 business days.'",
    "Status": "FAIL 🔴",
    "Severity": "P3 - Low",
    "Compliance": "AGENTS.md Rule 4 Editorial Standards"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-024",
    "Module": "FAQ Accordion",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify FAQ Accordions Default Collapsed / Closed State",
    "Preconditions": "Trade Customer on My Holds page",
    "Test Steps": "1. Scroll down to 'Frequently Asked Questions' section\n2. Inspect visibility of answer bodies",
    "Expected Result (Figma Spec / Frame 621)": "All FAQ questions are collapsed by default on page load. Answer content is concealed until user clicks to expand.",
    "Actual Result (mcstaging2 Live)": "All FAQ items are collapsed by default on initial page render.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 621 FAQ Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-025",
    "Module": "FAQ Accordion",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify FAQ Single-Open Auto-Collapse Accordion Logic",
    "Preconditions": "Trade Customer at FAQ section",
    "Test Steps": "1. Click FAQ item 1 to expand answer\n2. Click FAQ item 2\n3. Observe whether FAQ item 1 auto-collapses",
    "Expected Result (Figma Spec / Frame 621)": "Frame 621 single-open rule enforced: Expanding FAQ item 2 automatically collapses FAQ item 1 so only one item remains open.",
    "Actual Result (mcstaging2 Live)": "Verified in headed Chrome: Expanding item 2 immediately auto-collapses item 1.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 621 FAQ Logic Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-026",
    "Module": "Customer Support Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Sales Support Contact Phone US Localization (+613 vs US Toll-Free) [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer at bottom support block of My Holds",
    "Test Steps": "1. Inspect 'Need help? Contact our sales team' section\n2. Check phone number prefix and email address",
    "Expected Result (Figma Spec / Frame 621)": "Should display US-localized contact details (US phone number / US support email) for US market.",
    "Actual Result (mcstaging2 Live)": "FAIL: Displays Australian contact details: 'P: +613 9518 1600' and 'sales@globewest.com'.",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "US Storefront Localization"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-027",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile Table Column Sequence at 390px Viewport [ACTIVE DEFECT]",
    "Preconditions": "Browser viewport set to 390x844 (iPhone 14/15/16)",
    "Test Steps": "1. Inspect mobile table column order\n2. Compare against Figma mobile artboard (HOLD | DATE | TOTAL | STATUS | ACTIONS)",
    "Expected Result (Figma Spec / Frame 621)": "Columns sequenced as: HOLD | DATE | TOTAL | STATUS | ACTIONS.",
    "Actual Result (mcstaging2 Live)": "FAIL: Sequence is reversed: HOLD | DATE | STATUS | TOTAL | ACTIONS (STATUS placed before TOTAL).",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "Mobile Artboard Parity"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-028",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile Actions Dropdown Button Clipping & Overflow [ACTIVE DEFECT]",
    "Preconditions": "Browser viewport width 390px",
    "Test Steps": "1. Inspect right boundary of mobile table\n2. Verify visibility of column 5 'Actions' button",
    "Expected Result (Figma Spec / Frame 621)": "All columns and CTA buttons fit comfortably or have smooth horizontal scroll without clipped text.",
    "Actual Result (mcstaging2 Live)": "FAIL: 'Actions' button overflows right edge and is clipped (only partial text 'Ac' visible).",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "Mobile UX & Touch Accessibility"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-029",
    "Module": "Mobile Ergonomics",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile Touch Targets for Filter Tabs and FAQ Headers (>= 44px)",
    "Preconditions": "Mobile viewport 390px",
    "Test Steps": "1. Measure computed height and padding of filter buttons\n2. Measure FAQ header tap targets",
    "Expected Result (Figma Spec / Frame 621)": "Interactive elements meet minimum touch target recommendations of 44x44px for effortless mobile tapping.",
    "Actual Result (mcstaging2 Live)": "Filter tabs and FAQ triggers meet minimum touch target standards.",
    "Status": "PASS",
    "Severity": "P3 - Low",
    "Compliance": "Mobile Ergonomics & WCAG"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-030",
    "Module": "Breadcrumb Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Breadcrumb Trail Hierarchy and Link Destinations",
    "Preconditions": "Trade Customer on My Holds page",
    "Test Steps": "1. Inspect breadcrumb trail at top of page\n2. Verify link hierarchy: Home > My Account > My Holds\n3. Click 'My Account'",
    "Expected Result (Figma Spec / Frame 621)": "Trail displays Home > My Account > My Holds. Clicking 'My Account' navigates to /customer/account/. 'My Holds' is active.",
    "Actual Result (mcstaging2 Live)": "Breadcrumb trail renders correctly with valid navigational links.",
    "Status": "PASS",
    "Severity": "P3 - Low",
    "Compliance": "Global Navigation Standard"
  }
];

function exportFiles() {
  const ws = XLSX.utils.json_to_sheet(testCases);

  // Set column widths for optimal reading in Excel
  ws['!cols'] = [
    { wch: 18 }, // Test Case ID
    { wch: 26 }, // Module
    { wch: 25 }, // Auth Matrix
    { wch: 42 }, // Test Scenario / Title
    { wch: 38 }, // Preconditions
    { wch: 48 }, // Test Steps
    { wch: 50 }, // Expected Result
    { wch: 50 }, // Actual Result
    { wch: 22 }, // Status
    { wch: 16 }, // Severity
    { wch: 32 }  // Compliance
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "My Holds QA");

  const xlsxPath = path.join(BASE_DIR, 'My_Holds_Test_Cases.xlsx');
  XLSX.writeFile(wb, xlsxPath);
  console.log(`✅ Successfully generated Excel: ${xlsxPath}`);

  // Generate CSV
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  const csvPath = path.join(BASE_DIR, 'My_Holds_Test_Cases.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✅ Successfully generated CSV: ${csvPath}`);
}

exportFiles();
