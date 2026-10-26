const path = require('path');
const fs = require('fs');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const OUT_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    'Test Case ID': 'TC-QUOTES-01',
    'Feature / Module': 'Authentication & Access',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Access to My Quotes Portal for Authenticated Trade Customer',
    'Pre-Conditions': 'User holds an active Trade Customer account (deepali.londhe@overdose.digital) on mcstaging2.globewest.com',
    'Test Steps': 
`Step 1: Navigate to customer account login page (/customer/account/login/)

Step 2: Enter valid Trade Customer email and password

Step 3: Click "Sign In" button

Step 4: Navigate directly to the My Quotes URL (/gw_quotes/quote/index/)

Step 5: Verify page renders successfully with HTTP 200 OK and "My Quotes" page title`,
    'Expected Result (Figma Spec / Frame 622)': 
`Trade Customer successfully accesses the My Quotes portal.

The authenticated header, left-hand My Account navigation sidebar, and Quotes table container render cleanly.`,
    'Actual Result (mcstaging2 Live)': 
`Page loads successfully with HTTP 200 for authenticated trade customer.

Header, left navigation menu, and table container are displayed as expected.`,
    'Status': 'PASS',
    'Severity / Defect Summary': 'None. Core route access verified.'
  },
  {
    'Test Case ID': 'TC-QUOTES-02',
    'Feature / Module': 'Filter Tabs - Default State',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Default Active Status Filter Tab is "ALL" (Frame 622 Rule 1)',
    'Pre-Conditions': 'User accesses /gw_quotes/quote/index/ in a clean authenticated session',
    'Test Steps': 
`Step 1: Navigate to /gw_quotes/quote/index/

Step 2: Locate the quote status filter tabs (ALL, OPEN, CONVERTED, EXPIRED) below the page title

Step 3: Observe which filter tab is selected and highlighted by default on initial load`,
    'Expected Result (Figma Spec / Frame 622)': 
`Per Frame 622 explicit rule: "Tabs that filter table view of quotes shown based on quote status. Default to 'all'".

The "ALL" tab must be active by default with solid dark background (#1E1E1E) and white text.`,
    'Actual Result (mcstaging2 Live)': 
`The live staging build erroneously selects the "OPEN" tab by default.

The "ALL" tab is inactive and unselected.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'HIGH - Direct business logic violation of Frame 622.'
  },
  {
    'Test Case ID': 'TC-QUOTES-03',
    'Feature / Module': 'Filter Tabs - Micro-UI Styling',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Segmented Control Pill Styling for Filter Tabs',
    'Pre-Conditions': 'Quotes dashboard rendered at desktop resolution (1440x900)',
    'Test Steps': 
`Step 1: Inspect computed CSS styles of the status filter tabs container

Step 2: Verify container border-radius, internal padding, and active/inactive state styling

Step 3: Compare styling against Figma artboard desktop/my_account/02_My Quotes`,
    'Expected Result (Figma Spec / Frame 622)': 
`Filter tabs must render as a unified segmented control with 4px border-radius.

Inactive tabs have subtle grey borders (#CCCCCC); Active tab has solid dark fill (#1E1E1E) and white text (#FFFFFF).`,
    'Actual Result (mcstaging2 Live)': 
`Tabs render as unstyled plain text links with a standard browser underline on the active tab.

No segmented pill container styling is present.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'MEDIUM - Visual design fidelity and micro-UI defect.'
  },
  {
    'Test Case ID': 'TC-QUOTES-04',
    'Feature / Module': 'Table Columns - Action Dropdown',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Consolidated "Actions" Dropdown & Removal of Separate "DETAILS" Column',
    'Pre-Conditions': 'Quotes table loaded on desktop viewport',
    'Test Steps': 
`Step 1: Inspect the table header row and data columns

Step 2: Count the total number of columns rendered

Step 3: Check action buttons and links available per row`,
    'Expected Result (Figma Spec / Frame 622)': 
`Per Frame 622 Rule 3: "Actions housed under dropdown for both mobile + desktop as per other table functionality".

Table must contain strictly 8 columns. All row actions must be consolidated inside a single "Actions" dropdown button. There must be NO separate "DETAILS" column.`,
    'Actual Result (mcstaging2 Live)': 
`Table displays 9 columns, including a redundant unstyled "DETAILS" column preceding "ACTIONS".`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'HIGH - DOM structural placement and column mismatch.'
  },
  {
    'Test Case ID': 'TC-QUOTES-05',
    'Feature / Module': 'Table Headers - Column Naming',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Table Column Header Wording Parity (EXP. DATE, ORDER NAME)',
    'Pre-Conditions': 'Quotes table header row visible',
    'Test Steps': 
`Step 1: Read the text labels of all table header cells

Step 2: Compare exact copy against the approved Figma specification:
- Column 2 expected: EXP. DATE
- Column 4 expected: ORDER NAME`,
    'Expected Result (Figma Spec / Frame 622)': 
`Column 2 must display "EXP. DATE" (abbreviated).

Column 4 must display "ORDER NAME".`,
    'Actual Result (mcstaging2 Live)': 
`Column 2 displays full word "EXPIRY DATE".

Column 4 displays "QUOTE NAME".`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'LOW - Copy and label discrepancy with approved design.'
  },
  {
    'Test Case ID': 'TC-QUOTES-06',
    'Feature / Module': 'Date Formatting - US Locale',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Quote Expiry Dates Enforce US Standard Format (MM/DD/YYYY)',
    'Pre-Conditions': 'Trade customer account with active quote records available',
    'Test Steps': 
`Step 1: Locate quote date values in the table

Step 2: Check date sequence to confirm month precedes day (e.g. 01/24/2026, not 24/01/2026)`,
    'Expected Result (Figma Spec / Frame 622)': 
`Per Frame 622 explicit rule: "Ensure dates displayed are in USA format".

All quote dates must strictly display in standard US format (MM/DD/YYYY).`,
    'Actual Result (mcstaging2 Live)': 
`Pending quote record population on staging.

The codebase baseline must enforce US locale formatting rather than Australian DD/MM/YYYY.`,
    'Status': 'PENDING DATA',
    'Severity / Defect Summary': 'HIGH - Critical locale and format requirement.'
  },
  {
    'Test Case ID': 'TC-QUOTES-07',
    'Feature / Module': 'Search Component - Layout',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Search Bar Inline Horizontal Placement Beside Filter Tabs',
    'Pre-Conditions': 'Desktop viewport loaded at 1440x900',
    'Test Steps': 
`Step 1: Locate the quote search input box

Step 2: Inspect horizontal alignment with the status filter tabs

Step 3: Verify placeholder text "Search" and magnifying glass icon`,
    'Expected Result (Figma Spec / Frame 622)': 
`The search bar is right-aligned on the SAME horizontal row directly beside the filter tabs.`,
    'Actual Result (mcstaging2 Live)': 
`The search bar sits in a detached position above the table right, breaking inline row alignment with the filter tabs.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'MEDIUM - Layout alignment discrepancy.'
  },
  {
    'Test Case ID': 'TC-QUOTES-08',
    'Feature / Module': 'FAQ Block - Module Presence',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Presence of Dedicated FAQ Accordion Section Below Table (Frame 622 Block 2)',
    'Pre-Conditions': 'Quotes dashboard loaded on desktop or mobile viewport',
    'Test Steps': 
`Step 1: Scroll below the Quotes table grid

Step 2: Check for presence of "Frequently Asked Questions" heading and accordion items`,
    'Expected Result (Figma Spec / Frame 622)': 
`Per Frame 622 explicit specification:
"New block utilised throughout the My Account Experience. Each FAQ block will have specific questions related to the page it is on. Admin ability to change content. Ability to add up to 8 FAQs."`,
    'Actual Result (mcstaging2 Live)': 
`The FAQ Accordion section is 100% MISSING on live staging.

The area below the table is completely empty white space followed directly by the footer.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'CRITICAL - Entire core module omitted from page.'
  },
  {
    'Test Case ID': 'TC-QUOTES-09',
    'Feature / Module': 'FAQ Block - Accordion Behavior',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Accordions Closed by Default & Single Expansion Behavior (Frame 622 Block 2)',
    'Pre-Conditions': 'FAQ Accordion block rendered on page',
    'Test Steps': 
`Step 1: Observe default accordion state upon page load

Step 2: Click Accordion item 1 to expand

Step 3: Click Accordion item 2 to expand

Step 4: Verify Accordion item 1 automatically collapses`,
    'Expected Result (Figma Spec / Frame 622)': 
`Per Frame 622 rules:
1. "All accordions closed by default"
2. "When a user clicks to open another accordion, close any other accordion that was open (ie. only one open at a time)"`,
    'Actual Result (mcstaging2 Live)': 
`BLOCKED: Cannot execute test because the entire FAQ component is absent from the DOM.`,
    'Status': 'BLOCKED',
    'Severity / Defect Summary': 'HIGH - Dependent on FAQ block development.'
  },
  {
    'Test Case ID': 'TC-QUOTES-10',
    'Feature / Module': 'Support Block - Contact Sales',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Presence of "Need help? Contact our sales team" Block (Frame 622 Block 3)',
    'Pre-Conditions': 'Quotes dashboard scrolled toward bottom of main content area',
    'Test Steps': 
`Step 1: Scroll below the FAQ section

Step 2: Check for presence of "Need help? Contact our sales team" content block

Step 3: Verify support contact details and order changes disclaimer`,
    'Expected Result (Figma Spec / Frame 622)': 
`Per Frame 622: "NEED HELP BLOCK: Content Block / Admin ability to change content."

Renders dedicated support box with US contact phone, email, and order submission guidelines.`,
    'Actual Result (mcstaging2 Live)': 
`The Support / Contact Sales block is 100% MISSING on live staging.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'CRITICAL - Missing content block module.'
  },
  {
    'Test Case ID': 'TC-QUOTES-11',
    'Feature / Module': 'Sidebar Navigation - Count Badges',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Numerical Count Badges in My Account Left Navigation',
    'Pre-Conditions': 'Desktop view at 1440px with left navigation visible',
    'Test Steps': 
`Step 1: Inspect left-hand sidebar menu items under "MY ACCOUNT"

Step 2: Check for numerical count badges next to Quotes, Holds, and Orders`,
    'Expected Result (Figma Spec / Frame 622)': 
`Sidebar navigation items feature pill count badges (e.g. Quotes [723], Holds [3], Orders [3]).`,
    'Actual Result (mcstaging2 Live)': 
`No count badges are rendered in the left navigation sidebar on live staging.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'MEDIUM - Navigation micro-UI defect.'
  },
  {
    'Test Case ID': 'TC-QUOTES-12',
    'Feature / Module': 'Mobile Viewport - Layout & Alerts',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Mobile Viewport Layout Parity & Custom Empty State (390x844)',
    'Pre-Conditions': 'Mobile browser viewport (iPhone 14/15 390x844)',
    'Test Steps': 
`Step 1: Load /gw_quotes/quote/index/ on mobile viewport

Step 2: Inspect Quotes dropdown selector, title, subtitle, and search input

Step 3: Inspect empty state alert container styling`,
    'Expected Result (Figma Spec / Frame 622)': 
`Clean mobile presentation matching mobile/my_account/02_my_quotes artboard.

Styled segmented tabs, full-width search, and brand-styled empty state.`,
    'Actual Result (mcstaging2 Live)': 
`Renders raw Magento default blue alert box ("Table is empty!") with light blue background.

Tabs are unstyled plain text.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'HIGH - Mobile responsive styling defect.'
  },
  {
    'Test Case ID': 'TC-QUOTES-13',
    'Feature / Module': 'Storefront Footer - Scope Leak',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Scope Isolation & Absence of Australian Kangaroo Badge in Footer',
    'Pre-Conditions': 'US Storefront /gw_quotes/quote/index/ scrolled to footer',
    'Test Steps': 
`Step 1: Scroll down to storefront footer

Step 2: Inspect trust badges, certifications, and copyright copy`,
    'Expected Result (Figma Spec / Frame 622)': 
`US Storefront footer must strictly exclude Australian Kangaroo owned badge and Australian business entity references.`,
    'Actual Result (mcstaging2 Live)': 
`Displays Australian Kangaroo silhouette logo and "AUSTRALIAN OWNED & RUN" badge in storefront footer.`,
    'Status': 'FAIL',
    'Severity / Defect Summary': 'HIGH - Australian scope leak onto US storefront.'
  },
  {
    'Test Case ID': 'TC-QUOTES-14',
    'Feature / Module': 'Grid Administration - Pagination',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Admin Ability to Set Quotes Grid Items Per Page (Frame 622 Rule 4)',
    'Pre-Conditions': 'Magento Admin panel access / Storefront grid with quotes populated',
    'Test Steps': 
`Step 1: Inspect table pagination and items per page controls

Step 2: Verify configurable page sizes (e.g. 10, 20, 50)`,
    'Expected Result (Figma Spec / Frame 622)': 
`Per Frame 622: "Admin to be able to set how many orders are in the table grid view".

Configurable pagination limits available.`,
    'Actual Result (mcstaging2 Live)': 
`Currently empty grid on staging.

Backend admin configuration to be verified during full integration testing.`,
    'Status': 'PENDING DATA',
    'Severity / Defect Summary': 'LOW - Backend admin configuration check.'
  }
];

// Write Excel (.xlsx) with comfortable column widths (excluding Visual Evidence)
const ws = XLSX.utils.json_to_sheet(testCases);

ws['!cols'] = [
  { wch: 16 }, // Test Case ID
  { wch: 30 }, // Feature / Module
  { wch: 28 }, // Auth Matrix
  { wch: 45 }, // Test Scenario
  { wch: 40 }, // Pre-Conditions
  { wch: 65 }, // Test Steps
  { wch: 65 }, // Expected Result (Figma Spec / Frame 622)
  { wch: 65 }, // Actual Result (mcstaging2 Live)
  { wch: 16 }, // Status
  { wch: 45 }  // Severity / Defect Summary
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'My Quotes Test Cases');
const xlsxPath = path.join(OUT_DIR, 'My_Quotes_Test_Cases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log('✅ Generated Excel (Visual Evidence deleted):', xlsxPath);

// Write CSV (.csv) preserving double line breaks between steps (excluding Visual Evidence)
const headers = Object.keys(testCases[0]);
const csvRows = [
  headers.join(','),
  ...testCases.map(tc => 
    headers.map(h => {
      const val = tc[h] || '';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',')
  )
];

const csvPath = path.join(OUT_DIR, 'My_Quotes_Test_Cases.csv');
fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf8');
console.log('✅ Generated CSV (Visual Evidence deleted):', csvPath);
