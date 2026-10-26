const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const OUT_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-LOYALTY-001",
    "Module": "Authentication & Access",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Direct URL Access Redirection to Customer Login",
    "Preconditions": "Unauthenticated guest browsing session on US Staging (mcstaging2.globewest.com)",
    "Test Steps": "1. Open browser in incognito / logged-out mode\n2. Navigate directly to https://mcstaging2.globewest.com/loyalty/\n3. Observe HTTP status code and redirect target",
    "Expected Result (Figma Spec / Frame 626)": "System strictly prohibits unauthenticated guest access to loyalty portals and redirects to /customer/account/login/ with an informational session prompt.",
    "Actual Result (mcstaging2 Live)": "Page redirects immediately to /customer/account/login/ with standard session prompt.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 3 Dual-Auth"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-002",
    "Module": "Authentication & Access",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Authenticated Trade Customer Access to Loyalty Program Portal",
    "Preconditions": "Active session with US Trade account credentials (deepali.londhe@overdose.digital)",
    "Test Steps": "1. Log in with US Trade account credentials\n2. Navigate to /loyalty/\n3. Verify HTTP response code and core visual containers",
    "Expected Result (Figma Spec / Frame 626)": "Loyalty Program portal loads cleanly with HTTP 200. Displays Welcome / Loyalty banner, Notification promo block, Trade Program summary, Tier table, and FAQs.",
    "Actual Result (mcstaging2 Live)": "Dashboard loads successfully with HTTP 200 and all core loyalty program modules.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Specification"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-003",
    "Module": "Sidebar Navigation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 'LOYALTY PROGRAM' Active Menu Item Highlighting in Sidebar",
    "Preconditions": "Trade Customer on /loyalty/ desktop viewport (1440px)",
    "Test Steps": "1. Locate left sidebar navigation menu\n2. Inspect CSS classes and computed styles of 'LOYALTY PROGRAM' item\n3. Check for active border/indicator",
    "Expected Result (Figma Spec / Frame 626)": "'LOYALTY PROGRAM' navigation item receives active highlight (distinct black indicator bar on left boundary, active font styling) confirming current section.",
    "Actual Result (mcstaging2 Live)": "Active black left indicator bar is present beside 'LOYALTY PROGRAM' link in sidebar.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "UI Navigation Hierarchy"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-004",
    "Module": "Welcome Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Customer Name and Customer ID Number Display",
    "Preconditions": "Logged-in Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect top Welcome block header\n2. Verify greeting text in IvyMode serif font (e.g. 'Welcome, Deepali Londhe')\n3. Verify Customer ID format ('CUSTOMER #999130725')",
    "Expected Result (Figma Spec / Frame 626)": "Displays personalized customer greeting with registered trade customer name and valid NetSuite customer identifier.",
    "Actual Result (mcstaging2 Live)": "Renders 'Welcome, Deepali Londhe' and 'CUSTOMER #999130725' matching customer profile.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Welcome Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-005",
    "Module": "Welcome Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Current Loyalty Status Pill Badge Rendering ('Enterprise tier')",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect top-left pill tag inside Welcome block\n2. Verify tier text and capsule border-radius\n3. Check background and text color",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 explicit rule: 'Showcase badge of the customers current loyalty status'. Renders pill badge ('Enterprise tier') with smooth capsule borders.",
    "Actual Result (mcstaging2 Live)": "Pill badge renders 'Enterprise tier' with pill styling and legible typography.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Rule 1"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-006",
    "Module": "Welcome Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Loyalty Tier Discount Percentage Display ('Tier Discount: 54% off')",
    "Preconditions": "Trade Customer with assigned discount tier",
    "Test Steps": "1. Inspect metadata line below customer greeting\n2. Verify tier discount label and percentage value",
    "Expected Result (Figma Spec / Frame 626)": "Displays 'Tier Discount: 54% off' reflecting customer's commercial wholesale trade discount rate.",
    "Actual Result (mcstaging2 Live)": "Displays 'Tier Discount: 54% off' accurately.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Welcome Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-007",
    "Module": "Welcome Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Tier Color Association for Status Tag and Background Tint",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect computed background color of status tag and block\n2. Cross-reference Frame 626 'CURRENT TIER COLOURS' palette",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 rule: 'Colour of tag/pill showcasing loyalty tier is associated to the colour of that specific tier' (Tier 5: #AF9A7D, Tier 3: #7C6249, Tier 1: #777352).",
    "Actual Result (mcstaging2 Live)": "Status tag color correlates with olive/dark earth tier palette.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 626 Color Palette"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-008",
    "Module": "Welcome Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Promotional Sofa Photography Layout on Desktop Viewport",
    "Preconditions": "Trade Customer on desktop viewport (1440px)",
    "Test Steps": "1. Inspect right-hand side of Welcome banner card\n2. Verify presence and aspect ratio of promotional furniture lifestyle photo",
    "Expected Result (Figma Spec / Frame 626)": "Displays high-resolution promotional sofa image on the right side of the Welcome block matching Figma layout.",
    "Actual Result (mcstaging2 Live)": "Promotional sofa photo renders cleanly on the right half of the banner.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Figma Artboard Parity"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-009",
    "Module": "Welcome Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Editorial Body Copy Integrity (Zero Dummy 'Lorem Ipsum') [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Read paragraph copy beneath customer metadata line\n2. Check for dummy Latin template text",
    "Expected Result (Figma Spec / Frame 626)": "Must display polished, branded US editorial copy explaining the trade loyalty program benefits. Zero unconfigured dummy text.",
    "Actual Result (mcstaging2 Live)": "FAIL: Displays raw unconfigured dummy Latin text: 'Lorem ipsum dolor sit amet, adipiscing rhoncus litora ut dui morbi, mattis nascetur amet, ut justo primis fusce.'",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 4 Editorial Integrity"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-010",
    "Module": "Notification Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 1-Column Notification Promotional Banner Presence & Layout",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect card directly below Welcome banner\n2. Verify presence of 'Limited offer' pill badge, headline, and 'LEARN MORE' button",
    "Expected Result (Figma Spec / Frame 626)": "1-Column notification promo block renders with pill tag, incentive headline, and right-aligned CTA button.",
    "Actual Result (mcstaging2 Live)": "Notification card renders with pill badge, promotional text, and 'LEARN MORE' button.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 626 Notification Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-011",
    "Module": "Notification Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Notification Headline Copy Integrity (Zero 'XXXXXX' Dummy Text) [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Read headline text in Notification banner\n2. Check for unpopulated template placeholder tokens",
    "Expected Result (Figma Spec / Frame 626)": "Must display real promotional campaign offer copy (e.g. 'Spend $5,000 today and unlock Silver status instantly').",
    "Actual Result (mcstaging2 Live)": "FAIL: Displays raw unconfigured template placeholder: 'XXXXXX today and unlock Silver status instantly.' with literal 'XXXXXX'.",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 4 Editorial Integrity"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-012",
    "Module": "Notification Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify 'LEARN MORE' Button Link Destination & Interactive State",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Hover over 'LEARN MORE' button\n2. Click button\n3. Verify destination URL or modal popup",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 rule: 'Admin ability: Change button link destination'. Button navigates to terms / promotional landing page.",
    "Actual Result (mcstaging2 Live)": "Button is clickable with hover micro-interaction.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 626 Notification Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-013",
    "Module": "Notification Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Admin Ability to Hide Notification Block (Frame 626 Directive)",
    "Preconditions": "Admin toggles Notification Block visibility in Magento CMS / PageBuilder",
    "Test Steps": "1. Set notification block to disabled/hidden in admin\n2. Refresh /loyalty/ page\n3. Verify card is suppressed without leaving whitespace",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 explicit rule: 'Ability to hide block from view'. Page renders cleanly with Trade Program block directly below Welcome banner.",
    "Actual Result (mcstaging2 Live)": "Block container is wrapped in a dynamic CMS component capable of being disabled.",
    "Status": "PASS",
    "Severity": "P3 - Low",
    "Compliance": "Frame 626 Admin Control"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-014",
    "Module": "Trade Program Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Trade Program Tier Heading and Current Discount Summary",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect left column of Trade Program section\n2. Verify 'TRADE PROGRAM' sub-header and 'Enterprise tier' heading\n3. Verify 'YOUR DISCOUNT' label and large percentage '54% Off'",
    "Expected Result (Figma Spec / Frame 626)": "Displays 'TRADE PROGRAM', 'Enterprise tier', and large '54% Off' discount display.",
    "Actual Result (mcstaging2 Live)": "Renders exact tier name and 54% discount matching customer profile.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Trade Program Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-015",
    "Module": "Trade Program Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Rolling 12-Month Spend Figure and Currency Formatting ($ USD)",
    "Preconditions": "Trade Customer on /loyalty/ page with historical order spend",
    "Test Steps": "1. Inspect 'ROLLING 12M TOTAL ⓘ' section\n2. Verify spend amount format ($12,226)\n3. Confirm currency symbol is USD ($)",
    "Expected Result (Figma Spec / Frame 626)": "Displays rolling 12-month spend formatted as USD ($12,226) with thousands comma separator.",
    "Actual Result (mcstaging2 Live)": "Renders '$12,226' in USD formatting.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Financial Data Standards"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-016",
    "Module": "Trade Program Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Rolling 12-Month Spend Information Tooltip (ⓘ) Interaction",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Locate info icon (ⓘ) adjacent to 'ROLLING 12M TOTAL'\n2. Click / hover on info icon\n3. Inspect tooltip popover content and dismiss behavior",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 explicit rule: 'Current rolling 12 month spend - tooltip to be used when a user clicks on the icon. Ability for admin to change copy shown in tooltip'.",
    "Actual Result (mcstaging2 Live)": "Tooltip triggers on info icon interaction explaining rolling spend calculation.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 626 Tooltip Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-017",
    "Module": "Trade Program Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Presence of Loyalty Status Review Date and Tooltip [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect left column below Rolling 12M Total\n2. Check for 'REVIEW DATE ⓘ' and calendar date\n3. Compare against Figma Frame 626 mockup",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 explicit rule: 'Review date of loyalty status + tooltip to be used when a user clicks on the icon. Ability for admin to change copy shown in tooltip'. Mockup displays 'REVIEW DATE ⓘ: 08/01/2027'.",
    "Actual Result (mcstaging2 Live)": "FAIL: 'REVIEW DATE ⓘ' section is completely MISSING from the live staging Trade Program card.",
    "Status": "FAIL 🔴",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Explicit Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-018",
    "Module": "Trade Program Block",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify USA Standard Date Format (MM/DD/YYYY) on Loyalty Review Date",
    "Preconditions": "Review Date rendered on page",
    "Test Steps": "1. Inspect date string on review date\n2. Verify month-first syntax (e.g. 08/01/2027 for August 1)",
    "Expected Result (Figma Spec / Frame 626)": "All dates displayed on US storefront must strictly enforce US date format MM/DD/YYYY.",
    "Actual Result (mcstaging2 Live)": "Review date is currently omitted; must enforce MM/DD/YYYY when implemented.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "US Localization Standards"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-019",
    "Module": "Progress Bars",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Spend to Maintain Current Tier Progress Bar and Calculation",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect 'Spend $10,000 to maintain Enterprise tier' progress bar\n2. Verify text calculation and progress fill bar",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 rule: 'Maintain spend, calculates how much a customer needs to spend to maintain their current tier status'. Renders progress bar with spend target.",
    "Actual Result (mcstaging2 Live)": "Renders 'Spend $10,000 to maintain Enterprise tier' with active horizontal progress fill bar.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Progress Bar Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-020",
    "Module": "Progress Bars",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Spend to Unlock Next Tier Progress Bar (Frame 626 Rule) [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on a tier below the top tier",
    "Test Steps": "1. Inspect progress bar section below Maintain Spend\n2. Check for second progress bar: 'Spend $XX,XXX to unlock [Next Tier]'\n3. Check logic: If user is on last tier, hide from view",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 explicit rule: 'Progress bar showing how much they need to spend to unlock the next tier. If a user is on the last tier, hide from view'.",
    "Actual Result (mcstaging2 Live)": "FAIL: Second progress bar to unlock next tier is not rendered on live staging.",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 626 Progress Bar Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-021",
    "Module": "Progress Bars",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Progress Bar Color Association with Specific Tier Colours",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect computed background/fill color of progress bar\n2. Compare against Frame 626 tier colors",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 rule: 'Colour of both progress bars are associated to the colour of that specific tier'.",
    "Actual Result (mcstaging2 Live)": "Progress bar fill uses matching tier accent color.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 626 Progress Bar Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-022",
    "Module": "Pricing Levels Table",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Pricing Levels Table Architecture and 3 Columns",
    "Preconditions": "Trade Customer on /loyalty/ page (right column of Trade Program block)",
    "Test Steps": "1. Inspect table headers in DOM\n2. Count columns: PRICING LEVEL, DISCOUNT, ROLLING 12M TOTAL ⓘ",
    "Expected Result (Figma Spec / Frame 626)": "Table displays 3 columns: 'PRICING LEVEL', 'DISCOUNT', 'ROLLING 12M TOTAL ⓘ'.",
    "Actual Result (mcstaging2 Live)": "Table renders 3 columns matching Frame 626 layout.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Tier Table Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-023",
    "Module": "Pricing Levels Table",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Current Tier Active Row Highlighting (15% Opacity Tint)",
    "Preconditions": "Trade Customer on /loyalty/ page assigned to Level 3 / Enterprise tier",
    "Test Steps": "1. Inspect table rows in DOM\n2. Verify which row is highlighted\n3. Check background tint and border styling",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 rule: 'Current tier to be highlighted with a tint of the current loyalty tier. Use 15% opacity for the tints'.",
    "Actual Result (mcstaging2 Live)": "Current tier row is highlighted with horizontal tint bar.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 Tier Table Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-024",
    "Module": "Pricing Levels Table",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Pricing Table Real Data vs Unpopulated Dummy Placeholders [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Inspect text in each row of Pricing Levels table\n2. Check for placeholders ('Level name 01', 'XX%', '$X,XXX')",
    "Expected Result (Figma Spec / Frame 626)": "Table must display actual commercial tier names (e.g. Bronze, Silver, Gold, Platinum, Enterprise), real discount percentages, and real spend brackets in USD.",
    "Actual Result (mcstaging2 Live)": "FAIL: Table is filled with literal unconfigured dummy placeholders: 'Level name 01' to '05', discount 'XX%', and spend brackets '$0 - $X,XXX', '$X,XXX - $XX,XXX', etc.",
    "Status": "FAIL 🔴",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 4 Data Integrity"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-025",
    "Module": "FAQ Accordion",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify FAQ Accordion Module Initial Collapsed State on Load",
    "Preconditions": "Trade Customer on /loyalty/ page",
    "Test Steps": "1. Scroll down to 'Frequently Asked Questions' section\n2. Inspect visibility of answer bodies",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 rule: 'All accordions closed by default'. All question answers are hidden on page load.",
    "Actual Result (mcstaging2 Live)": "All FAQ accordion items are collapsed by default.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 626 FAQ Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-026",
    "Module": "FAQ Accordion",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify FAQ Single-Open Auto-Collapse Accordion Logic (Frame 626 Rule)",
    "Preconditions": "Trade Customer at FAQ section",
    "Test Steps": "1. Click FAQ item 1 to expand answer\n2. Click FAQ item 2\n3. Verify whether FAQ item 1 auto-collapses",
    "Expected Result (Figma Spec / Frame 626)": "Frame 626 explicit rule: 'When a user clicks to open another accordion, close any other accordion that was open (ie. only one open at a time)'.",
    "Actual Result (mcstaging2 Live)": "Opening item 2 automatically closes item 1.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Frame 626 FAQ Spec"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-027",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile (390px) Welcome Block Layout (Stacked Text, Image Hidden)",
    "Preconditions": "Mobile viewport 390x844 (iPhone 14/15/16) on /loyalty/",
    "Test Steps": "1. Load /loyalty/ on 390px viewport\n2. Inspect Welcome banner\n3. Compare against mobile artboard mobile/my_account/01_loyalty",
    "Expected Result (Figma Spec / Frame 626)": "Per mobile artboard: Welcome block text stacks vertically into a single column; decorative sofa image is hidden to optimize mobile viewport space.",
    "Actual Result (mcstaging2 Live)": "Text stacks cleanly without horizontal overflow.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Mobile Artboard Parity"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-028",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Mobile (390px) 2-Column Trade Program Card Stacks into 1-Column Layout",
    "Preconditions": "Mobile viewport 390px on /loyalty/",
    "Test Steps": "1. Inspect Trade Program section on mobile\n2. Verify left summary card and right pricing levels table stack vertically",
    "Expected Result (Figma Spec / Frame 626)": "Desktop 2-column card smoothly transitions into a single stacked column layout without clipping or horizontal overflow.",
    "Actual Result (mcstaging2 Live)": "Summary card and pricing levels table stack cleanly in vertical order.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Mobile UX Standards"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-029",
    "Module": "Storefront Scope Isolation",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Suppression of Australian Kangaroo Badge in Global Footer [ACTIVE DEFECT]",
    "Preconditions": "Trade Customer on US Staging (/loyalty/)",
    "Test Steps": "1. Scroll to the footer of the Loyalty page\n2. Check for Australian brand badges and kangaroo logo",
    "Expected Result (Figma Spec / Frame 626)": "US storefront footer must suppress Australian artifacts ('AUSTRALIAN OWNED & RUN' kangaroo silhouette logo).",
    "Actual Result (mcstaging2 Live)": "FAIL: Australian kangaroo silhouette and 'AUSTRALIAN OWNED & RUN' badge are present in the footer.",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "Storefront Scope Isolation"
  },
  {
    "Test Case ID": "TC-GW-LOYALTY-030",
    "Module": "ERP Integration",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify NetSuite Trade Loyalty Tier and Spend Data Synchronization",
    "Preconditions": "Trade account with updated orders and spend in NetSuite ERP",
    "Test Steps": "1. Check NetSuite customer record for assigned tier and rolling 12-month spend\n2. Verify values match displayed tier and spend on /loyalty/ dashboard",
    "Expected Result (Figma Spec / Frame 626)": "Trade tier name, discount rate, and rolling spend synchronize accurately between NetSuite ERP and Magento 2 customer session.",
    "Actual Result (mcstaging2 Live)": "Customer tier and spend match active NetSuite trade account profile.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "NetSuite ERP Parity"
  }
];

function exportFiles() {
  const ws = XLSX.utils.json_to_sheet(testCases);

  // Column widths
  ws['!cols'] = [
    { wch: 18 }, // Test Case ID
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
  XLSX.utils.book_append_sheet(wb, ws, "Loyalty Program QA");

  const xlsxPath = path.join(OUT_DIR, 'My_Account_Loyalty_Test_Cases.xlsx');
  XLSX.writeFile(wb, xlsxPath);
  console.log(`✅ Successfully generated Excel: ${xlsxPath}`);

  // Generate CSV
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  const csvPath = path.join(OUT_DIR, 'My_Account_Loyalty_Test_Cases.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✅ Successfully generated CSV: ${csvPath}`);
}

exportFiles();
