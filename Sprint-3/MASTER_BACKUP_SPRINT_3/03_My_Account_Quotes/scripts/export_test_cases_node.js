const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const OUT_DIR = path.resolve(__dirname, '..');

const testCases = [
  // =========================================================================
  // PART A: MY QUOTES LISTING PAGE (/gw_quotes/quote/index/ - FRAME 622)
  // =========================================================================
  {
    "Test Case ID": "TC-GW-QUOTE-001",
    "Page Scope": "Quote Listing Page",
    "Module": "Authentication & Access",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Direct URL Access Redirection to Customer Login",
    "Preconditions": "Unauthenticated guest browsing session on US Staging (mcstaging2.globewest.com)",
    "Test Steps": "1. Open browser in incognito / logged-out session\n2. Navigate directly to https://mcstaging2.globewest.com/gw_quotes/quote/index/\n3. Observe HTTP status code and redirect target",
    "Expected Result (Figma Spec / Frame 622)": "System strictly prohibits unauthorized access to trade account portals and redirects the guest to /customer/account/login/ with an informational session prompt.",
    "Actual Result (mcstaging2 Live)": "Page redirects immediately to /customer/account/login/ with standard session prompt.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 3 Dual-Auth"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-002",
    "Page Scope": "Quote Listing Page",
    "Module": "Authentication & Access",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Authenticated Trade Customer Access to My Quotes Portal",
    "Preconditions": "Active session with US Trade account credentials (deepali.londhe@overdose.digital)",
    "Test Steps": "1. Log in with US Trade account credentials\n2. Navigate to /gw_quotes/quote/index/\n3. Verify HTTP response code and page structure",
    "Expected Result (Figma Spec / Frame 622)": "My Quotes portal loads cleanly with HTTP 200. Displays page title 'My Quotes', subtitle copy, status filter tabs, search bar, quotes table, and sidebar navigation.",
    "Actual Result (mcstaging2 Live)": "Dashboard loads successfully with HTTP 200 and all core dashboard containers.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 622 Specification"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-003",
    "Page Scope": "Quote Listing Page",
    "Module": "Status Filter Tabs",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Default Active Status Filter Tab is 'ALL' (Frame 622 Rule 1)",
    "Preconditions": "Logged-in Trade Customer on /gw_quotes/quote/index/ initial page load",
    "Test Steps": "1. Navigate to /gw_quotes/quote/index/\n2. Observe active tab state in filter group directly above quotes grid\n3. Inspect computed background-color and text color",
    "Expected Result (Figma Spec / Frame 622)": "Per Frame 622: 'Tabs that filter table view of quotes shown based on quote status. Default to all'. Active tab must default to 'ALL' with solid dark pill background (#2B1D16) and white text.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Page defaults to 'ALL' tab with solid dark pill active state (background: rgb(43, 29, 22)).",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 622 Rule 1"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-004",
    "Page Scope": "Quote Listing Page",
    "Module": "Status Filter Tabs",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Dynamic Filter Tab State Transitions (ALL, OPEN, CONVERTED, EXPIRED)",
    "Preconditions": "Trade Customer with quotes in multiple statuses",
    "Test Steps": "1. Click on 'OPEN' tab and observe grid update\n2. Click on 'CONVERTED' tab\n3. Click on 'EXPIRED' tab\n4. Click back to 'ALL'",
    "Expected Result (Figma Spec / Frame 622)": "Grid dynamically updates records matching the selected status instantly via AJAX without triggering full page reload. Active dark brown pill styling shifts cleanly.",
    "Actual Result (mcstaging2 Live)": "Tab selection triggers seamless asynchronous table grid refresh across all 4 statuses.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 622 Functional Spec"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-005",
    "Page Scope": "Quote Listing Page",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Search Input Inline Placement Horizontally with Filter Tabs",
    "Preconditions": "Trade Customer on desktop viewport (1440px)",
    "Test Steps": "1. Inspect horizontal flex row containing filter tabs\n2. Check search input placement, placeholder text, and search icon",
    "Expected Result (Figma Spec / Frame 622)": "Search bar ('Search [🔍]') is right-aligned on the SAME horizontal flex row directly beside filter tabs per Figma mockup.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Search bar is positioned inline on the same horizontal row to the right of filter tabs.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Figma Artboard Alignment"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-006",
    "Page Scope": "Quote Listing Page",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Dynamic Real-time Search Across Quote #, PO#, and Client Name",
    "Preconditions": "Multiple quote records present in table",
    "Test Steps": "1. Enter a valid Quote Number into search box\n2. Enter a Client Name\n3. Enter a Customer PO#\n4. Enter a non-matching string",
    "Expected Result (Figma Spec / Frame 622)": "Grid dynamically updates to show matching quotes in real-time. Searching non-matching query displays empty state message.",
    "Actual Result (mcstaging2 Live)": "Search input filters grid records accurately across multiple metadata fields.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Search Functionality"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-007",
    "Page Scope": "Quote Listing Page",
    "Module": "Search Component",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Search Reset & Restoring Full Table View",
    "Preconditions": "Search query currently active and table filtered",
    "Test Steps": "1. Clear all text from search input box\n2. Submit empty query / press Enter\n3. Check table rows",
    "Expected Result (Figma Spec / Frame 622)": "Table resets to show all quotes matching the active filter tab without requiring full page refresh.",
    "Actual Result (mcstaging2 Live)": "Table resets and displays all records smoothly.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Search Functionality"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-008",
    "Page Scope": "Quote Listing Page",
    "Module": "Table Architecture",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Consolidated 8 Columns Structure (Redundant DETAILS Column Removed)",
    "Preconditions": "Trade Customer on desktop viewport",
    "Test Steps": "1. Inspect table headers and count columns across quotes grid\n2. Confirm standalone 'DETAILS' column is eliminated",
    "Expected Result (Figma Spec / Frame 622)": "Per Frame 622: Table must contain strictly 8 columns. Standalone DETAILS column eliminated; all actions housed under Actions dropdown.",
    "Actual Result (mcstaging2 Live)": "VERIFIED PASSED: Standalone DETAILS column removed; table renders exactly 8 columns.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 622 Rule 3"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-009",
    "Page Scope": "Quote Listing Page",
    "Module": "Table Headers",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Table Column Naming Parity (EXP. DATE, ORDER NAME) [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on My Quotes desktop view",
    "Test Steps": "1. Inspect text strings of table headers across all 8 columns\n2. Compare against Frame 622 specification",
    "Expected Result (Figma Spec / Frame 622)": "Headers must read: QUOTE N, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL, ACTIONS.",
    "Actual Result (mcstaging2 Live)": "FAIL: Column 2 displays 'EXPIRY DATE' instead of 'EXP. DATE', and Column 4 displays 'QUOTE NAME' instead of 'ORDER NAME'.",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 622 Spec Parity"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-010",
    "Page Scope": "Quote Listing Page",
    "Module": "Empty State",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Brand-Styled Empty State Container vs Raw Magento Banner [ACTIVE DEFECT]",
    "Preconditions": "Logged-in Trade Customer with 0 quotes or non-matching filter",
    "Test Steps": "1. View Quotes table with 0 records or empty filter result\n2. Inspect alert container styling",
    "Expected Result (Figma Spec / Frame 622)": "Clean, luxury brand-styled empty state container adhering to GlobeWest typography and color palette.",
    "Actual Result (mcstaging2 Live)": "FAIL: Displays raw default unstyled Magento blue alert banner ('ⓘ Table is empty!') with blue background (#d9edf7).",
    "Status": "FAIL 🔴",
    "Severity": "P1 - High",
    "Compliance": "Micro-UI & Brand Aesthetics"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-011",
    "Page Scope": "Quote Listing Page",
    "Module": "Table Actions Dropdown",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Unified 'Actions ▾' Dropdown on Desktop & Mobile (Frame 622 Rule 3)",
    "Preconditions": "Quotes grid populated with quote records",
    "Test Steps": "1. Locate 'ACTIONS' column on a quote row\n2. Click 'Actions ▾' dropdown button\n3. Inspect menu actions: View, Edit, Convert to Order, Download PDF",
    "Expected Result (Figma Spec / Frame 622)": "Per Frame 622: 'Actions housed under dropdown for both mobile + desktop as per other table functionality'. Unified dropdown menu renders smoothly.",
    "Actual Result (mcstaging2 Live)": "Actions dropdown functions properly across table rows, housing contextual actions.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 622 Rule 3"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-012",
    "Page Scope": "Quote Listing Page",
    "Module": "Table Sorting",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Column Header Sorting (Ascending / Descending ⬍)",
    "Preconditions": "Quotes grid populated with multiple quote records",
    "Test Steps": "1. Click on 'QUOTE N ⬍' column header\n2. Observe sort order of records\n3. Click again to reverse sort direction\n4. Repeat for 'EXP. DATE ⬍' and 'TOTAL ⬍'",
    "Expected Result (Figma Spec / Frame 622)": "Table re-sorts records cleanly in ascending/descending order upon clicking sortable column headers with active sort indicator arrow.",
    "Actual Result (mcstaging2 Live)": "Sorting operates smoothly on Quote #, Date, and Total; sort indicators reflect active state.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Grid Usability Standards"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-013",
    "Page Scope": "Quote Listing Page",
    "Module": "Pagination",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Table Pagination and Items-Per-Page Configuration",
    "Preconditions": "Trade account with more than 10 quote records",
    "Test Steps": "1. Scroll to table footer pagination controls\n2. Click 'Next' / page number 2\n3. Change items-per-page dropdown (10, 20, 50)",
    "Expected Result (Figma Spec / Frame 622)": "Pagination transitions between pages without losing active tab filter. Items-per-page dropdown adjusts displayed rows accordingly.",
    "Actual Result (mcstaging2 Live)": "Pagination controls and limits render and function correctly.",
    "Status": "PASS",
    "Severity": "P3 - Low",
    "Compliance": "Frame 622 Admin Control"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-014",
    "Page Scope": "Quote Listing Page",
    "Module": "Navigation to Details",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Clickable Quote Number Link Navigates to Quote Details Page",
    "Preconditions": "Quotes grid populated with quote records",
    "Test Steps": "1. Hover over Quote Number (e.g. #CH03021)\n2. Click on the Quote Number link\n3. Observe destination URL and rendered view",
    "Expected Result (Figma Spec / Frame 622)": "Quote Number is a clickable hyperlink leading directly to Quote Details page (/gw_quotes/quote/view/quote_id/X/).",
    "Actual Result (mcstaging2 Live)": "Clicking Quote Number navigates directly to the Quote Details page.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Navigation Specification"
  },
  {
    "Test Case ID": "TC-GW-QUOTE-015",
    "Page Scope": "Quote Listing Page",
    "Module": "Proposal PDF Generation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 'Download PDF / Tear Sheet' Generates Formatted Client Proposal",
    "Preconditions": "Quotes grid with existing quote records",
    "Test Steps": "1. Click 'Actions ▾' on a quote row\n2. Select 'Download PDF'\n3. Open and inspect downloaded PDF proposal",
    "Expected Result (Figma Spec / Frame 622)": "A branded, high-resolution PDF proposal downloads containing product photos, specifications, quantities, and valid US currency pricing.",
    "Actual Result (mcstaging2 Live)": "PDF export downloads successfully with complete quote summary.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Trade Feature Standards"
  },

  // =========================================================================
  // PART B: QUOTE DETAILS PAGE (/gw_quotes/quote/view/quote_id/... - FRAME 623)
  // =========================================================================
  {
    "Test Case ID": "TC-GW-QVIEW-016",
    "Page Scope": "Quote Details Page",
    "Module": "Back Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify '← GO BACK TO QUOTES' Breadcrumb / Back Link",
    "Preconditions": "Trade Customer on Quote Details page (/gw_quotes/quote/view/quote_id/...)",
    "Test Steps": "1. Locate top left back navigation control\n2. Verify label '← GO BACK TO QUOTES'\n3. Click link",
    "Expected Result (Figma Spec / Frame 623)": "Control displays '← GO BACK TO QUOTES'. Clicking navigates back to /gw_quotes/quote/index/ without state loss.",
    "Actual Result (mcstaging2 Live)": "Back link renders at top left and returns cleanly to My Quotes listing.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 623 Navigation"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-017",
    "Page Scope": "Quote Details Page",
    "Module": "Header & Inline Status",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Quote Status Sits Inline with Quote Number (Frame 623 Requirement)",
    "Preconditions": "Trade Customer on Quote Details page",
    "Test Steps": "1. Inspect main page title (e.g. 'Quote #CH03023')\n2. Check placement of status badge (e.g. 'Open', 'Converted', 'Expired')",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit rule: 'Quote status to sit inline with quote number'. Status renders as a pill badge horizontally beside the quote heading.",
    "Actual Result (mcstaging2 Live)": "Status pill badge sits inline beside the Quote Number heading.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 623 Rule 1"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-018",
    "Page Scope": "Quote Details Page",
    "Module": "Delete Quote Action",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 'DELETE QUOTE' Button & Confirmation Popup Modal (Frame 623 Rule)",
    "Preconditions": "Trade Customer on Quote Details page with active quote",
    "Test Steps": "1. Locate 'DELETE QUOTE 🗑️' button at top right of quote details\n2. Click 'DELETE QUOTE'\n3. Observe modal popup\n4. Verify confirmation text and cancel/confirm buttons",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit rule: 'Delete quote location. If a user clicks delete, a pop up confirming they wish to delete should appear'. User must confirm before deletion.",
    "Actual Result (mcstaging2 Live)": "Confirmation modal triggers upon clicking delete, prompting confirmation.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 623 Rule 2"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-019",
    "Page Scope": "Quote Details Page",
    "Module": "Metadata & US Dates",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Quote Order Details Metadata Grid & US Date Format (MM/DD/YYYY)",
    "Preconditions": "Trade Customer on Quote Details page",
    "Test Steps": "1. Inspect metadata grid: ORDER DATE, EXPIRY DATE, CLIENT NAME, QUOTE NAME, TIME SUBMITTED, CUSTOMER PO#\n2. Verify date syntax in ORDER DATE and EXPIRY DATE",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit rule: 'Styling + order of order date, expiry date section. Ensure dates displayed are in USA format' (MM/DD/YYYY).",
    "Actual Result (mcstaging2 Live)": "Metadata grid renders all 6 attributes. Date formatting must enforce US format strictly.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 623 Rule 3 & 4"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-020",
    "Page Scope": "Quote Details Page",
    "Module": "Markup Bulk Update",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Bulk Markup Percentage Update ('APPLY TO ALL') (Frame 623 Rule)",
    "Preconditions": "Quote Details page with multiple product line items",
    "Test Steps": "1. Locate Quote Markup section ('Markup: Individual rates can still be overridden')\n2. Enter markup value '15' in '%'\n3. Click 'APPLY TO ALL' button\n4. Inspect MARK UP (%) and TOTAL columns across all line items",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit rule: 'Ability for a user to bulk update the markup on all products in the order. They can still individually edit the markup of each product afterwards'.",
    "Actual Result (mcstaging2 Live)": "Entering percentage and clicking APPLY TO ALL recalculates markup across all products.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 623 Markup Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-021",
    "Page Scope": "Quote Details Page",
    "Module": "Markup Individual Override",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Individual Product Markup Override Capability",
    "Preconditions": "Bulk markup applied across line items",
    "Test Steps": "1. Locate specific product line item row\n2. Change its individual MARK UP (%) input box from 15% to 25%\n3. Verify line total and quote total recalculate",
    "Expected Result (Figma Spec / Frame 623)": "Individual markup override is permitted per product row; overrides bulk rate without altering other products.",
    "Actual Result (mcstaging2 Live)": "Individual row markup can be modified independently and recalculates price.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 623 Markup Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-022",
    "Page Scope": "Quote Details Page",
    "Module": "Product Line Items",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify MSRP Display per Product (Frame 623 Requirement)",
    "Preconditions": "Product line items displayed on Quote Details",
    "Test Steps": "1. Inspect product metadata in PRODUCT column\n2. Verify presence of MSRP price line (e.g. 'MSRP: $1545')",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit rule: 'MSRP to be shown per product'. Displayed alongside SKU, Colour, and Dimensions.",
    "Actual Result (mcstaging2 Live)": "MSRP displays per product row under specifications.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 623 Product Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-023",
    "Page Scope": "Quote Details Page",
    "Module": "Product Line Items",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Product Names are Clickable Links to PDP (Frame 623 Requirement)",
    "Preconditions": "Product line items displayed on Quote Details",
    "Test Steps": "1. Hover over Product Name in line item card\n2. Click Product Name link\n3. Verify navigation destination",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit rule: 'Product Names to be linked to the product page'. Clicking opens corresponding PDP.",
    "Actual Result (mcstaging2 Live)": "Product name is a valid hyperlink navigating to PDP.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 623 Product Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-024",
    "Page Scope": "Quote Details Page",
    "Module": "Line Item Actions",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Line Item Removal via Trash Icon Action",
    "Preconditions": "Quote with multiple product items",
    "Test Steps": "1. Click trash / remove icon on a line item row\n2. Confirm removal\n3. Verify row disappears and order totals update",
    "Expected Result (Figma Spec / Frame 623)": "Line item is removed from quote; Subtotal, Margin, and Quote Total recalculate instantly.",
    "Actual Result (mcstaging2 Live)": "Item removes smoothly and totals update.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 623 Product Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-025",
    "Page Scope": "Quote Details Page",
    "Module": "Shipping Option USA Rule",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify USA Single Shipping Option & Installation Suppressed (Frame 623 Directive)",
    "Preconditions": "Trade Customer on Quote Details Shipping section",
    "Test Steps": "1. Inspect available shipping options in dropdown / radio group\n2. Check for white-glove / installation options",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit directive: 'For launch, USA to only have one option available for shipping' and 'Installation option suppressed for USA'.",
    "Actual Result (mcstaging2 Live)": "Only single standard freight shipping option is presented; installation options suppressed.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 623 Shipping Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-026",
    "Page Scope": "Quote Details Page",
    "Module": "Shipping Estimator",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Shipping Estimate Postcode Calculator",
    "Preconditions": "Trade Customer on Quote Details page",
    "Test Steps": "1. Enter valid US 5-digit ZIP code (e.g. 90210)\n2. Click 'CALCULATE' button\n3. Observe shipping rate calculation",
    "Expected Result (Figma Spec / Frame 623)": "Shipping rate calculates based on ZIP code and updates Shipping charge in the order summary.",
    "Actual Result (mcstaging2 Live)": "Shipping estimate calculates and populates fee.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 623 Shipping Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-027",
    "Page Scope": "Quote Details Page",
    "Module": "Financial Totals & Margins",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 'Your Margin', Subtotal, Shipping, and Quote Total Calculations",
    "Preconditions": "Quote with line items, markup, and shipping fee",
    "Test Steps": "1. Inspect summary sidebar card\n2. Verify formula: Your Margin = (Total Markup Amount), Quote Total = Subtotal + Shipping",
    "Expected Result (Figma Spec / Frame 623)": "All financial summaries render in USD ($). Margin displays trade profit cleanly.",
    "Actual Result (mcstaging2 Live)": "Financial breakdown displays correct math with 2 decimal precision.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Financial Precision Standards"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-028",
    "Page Scope": "Quote Details Page",
    "Module": "Quote Actions & Checkout",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 'SEND QUOTE' and 'CONFIRM ORDER' (Convert to Order) CTAs",
    "Preconditions": "Trade Customer on Quote Details page",
    "Test Steps": "1. Inspect primary CTA buttons: 'SEND QUOTE' and 'CONFIRM ORDER'\n2. Click 'CONFIRM ORDER'\n3. Observe redirection to Checkout",
    "Expected Result (Figma Spec / Frame 623)": "'CONFIRM ORDER' pre-populates checkout with quoted line items and negotiated pricing. 'SEND QUOTE' emails proposal to client.",
    "Actual Result (mcstaging2 Live)": "Confirm order smoothly routes into checkout with quote data transferred.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Conversion Architecture"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-029",
    "Page Scope": "Global / Both Pages",
    "Module": "FAQ Accordion Module",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify FAQ Accordion Section Presence & Single-Open Rule (Frame 622 & 623)",
    "Preconditions": "Trade Customer on Quote Listing or Quote Details page",
    "Test Steps": "1. Scroll down to 'Frequently Asked Questions' section\n2. Verify accordions are closed by default\n3. Click Question 1, then Question 2\n4. Verify Question 1 auto-collapses",
    "Expected Result (Figma Spec / Frame 622 & 623)": "Frame 622/623 rule: 'All accordions closed by default. When user clicks to open another accordion, close any other accordion (ie. only one open at a time)'.",
    "Actual Result (mcstaging2 Live)": "FAQ section rendered; single open rule enforced.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 622 & 623 FAQ Spec"
  },
  {
    "Test Case ID": "TC-GW-QVIEW-030",
    "Page Scope": "Global / Both Pages",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile (390px) Order Details Stack Rather than Scroll (Frame 623 Rule)",
    "Preconditions": "Mobile viewport (390x844 iPhone 14/15/16) on Quote Details page",
    "Test Steps": "1. Load Quote Details on 390px viewport\n2. Inspect order details metadata grid and product cards\n3. Check for horizontal overflow",
    "Expected Result (Figma Spec / Frame 623)": "Frame 623 explicit rule: 'Mobile to have those order details stack, rather than scroll'. Metadata grid and product cards stack vertically.",
    "Actual Result (mcstaging2 Live)": "Mobile layout stacks cleanly in a responsive vertical card structure.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 623 Mobile Spec"
  }
];

function exportFiles() {
  const ws = XLSX.utils.json_to_sheet(testCases);

  // Column widths
  ws['!cols'] = [
    { wch: 18 }, // Test Case ID
    { wch: 22 }, // Page Scope
    { wch: 25 }, // Module
    { wch: 25 }, // Auth Matrix
    { wch: 42 }, // Test Scenario / Title
    { wch: 38 }, // Preconditions
    { wch: 48 }, // Test Steps
    { wch: 50 }, // Expected Result
    { wch: 50 }, // Actual Result
    { wch: 18 }, // Status
    { wch: 16 }, // Severity
    { wch: 30 }  // Compliance
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Quotes & Details QA");

  const xlsxPath = path.join(OUT_DIR, 'My_Quotes_Test_Cases.xlsx');
  XLSX.writeFile(wb, xlsxPath);
  console.log(`✅ Successfully generated Excel: ${xlsxPath}`);

  // Generate CSV
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  const csvPath = path.join(OUT_DIR, 'My_Quotes_Test_Cases.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✅ Successfully generated CSV: ${csvPath}`);
}

exportFiles();
