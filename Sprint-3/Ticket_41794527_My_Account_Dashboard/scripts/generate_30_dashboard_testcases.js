const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const testCases = [
  {
    "Test Case ID": "TC_DASH_001",
    "Module": "Header / Utility Bar",
    "Figma Frame 620 Requirement": "Promotional Banner / Brown Utility Bar: Desktop & Mobile: Hidden/no utility bar on My Account, so a user cannot toggle pricing view or see store appointments banner.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Dark brown utility bar is completely hidden/suppressed on all My Account pages.",
    "Actual Live Staging Result": "Dark brown utility bar remains visible on both Desktop and Mobile displaying 'Book Showroom Appointment' and trade company name.",
    "Status": "FAIL",
    "Defect ID": "DEF-DASH-01",
    "Severity": "P1 - High"
  },
  {
    "Test Case ID": "TC_DASH_002",
    "Module": "Header / Pricing Toggle",
    "Figma Frame 620 Requirement": "Trade Pricing Toggle: Must not appear on dashboard utility bar to prevent conflicting pricing state.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Pricing toggle is not rendered on dashboard header/utility bar.",
    "Actual Live Staging Result": "Utility bar is rendered, exposing redundant elements.",
    "Status": "FAIL",
    "Defect ID": "DEF-DASH-01",
    "Severity": "P2 - Medium"
  },
  {
    "Test Case ID": "TC_DASH_003",
    "Module": "Header / Branding Logo",
    "Figma Frame 620 Requirement": "GlobeWest wordmark logo centered in header, clickable to return to US homepage without losing trade session.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Logo links to https://mcstaging2.globewest.com/ and maintains active trade session.",
    "Actual Live Staging Result": "Logo links to US store root and retains trade session correctly.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_004",
    "Module": "Left Navigation Sidebar",
    "Figma Frame 620 Requirement": "Side nav links updated to have 8 canonical items: MY DASHBOARD, MY ACCOUNT ⌵, MY CLAIMS ⌵, MY COMPANY ⌵, MY BOOKINGS ⌵, LOYALTY PROGRAM, HELP CENTRE ⌵, LOGOUT.",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Exactly 8 specified top-level links rendered in exact Figma hierarchy.",
    "Actual Live Staging Result": "Link #3 renders 'GLOBEWEST REFERRALS ⌵' instead of 'MY CLAIMS ⌵', and Link #5 renders 'BOOKINGS ⌵' instead of 'MY BOOKINGS ⌵'.",
    "Status": "FAIL",
    "Defect ID": "DEF-DASH-02",
    "Severity": "P2 - Medium"
  },
  {
    "Test Case ID": "TC_DASH_005",
    "Module": "Left Navigation Sidebar",
    "Figma Frame 620 Requirement": "Side Nav Link #3 label must be 'MY CLAIMS ⌵' allowing trade customers to manage claims online.",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Link #3 displays 'MY CLAIMS ⌵' and routes to /claims/.",
    "Actual Live Staging Result": "Link #3 displays 'GLOBEWEST REFERRALS ⌵'.",
    "Status": "FAIL",
    "Defect ID": "DEF-DASH-02",
    "Severity": "P2 - Medium"
  },
  {
    "Test Case ID": "TC_DASH_006",
    "Module": "Left Navigation Sidebar",
    "Figma Frame 620 Requirement": "Side Nav Link #5 label must be 'MY BOOKINGS ⌵' for showroom appointment reservations.",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Link #5 displays 'MY BOOKINGS ⌵'.",
    "Actual Live Staging Result": "Link #5 displays 'BOOKINGS ⌵' without 'MY' prefix.",
    "Status": "FAIL",
    "Defect ID": "DEF-DASH-02",
    "Severity": "P3 - Low"
  },
  {
    "Test Case ID": "TC_DASH_007",
    "Module": "Left Navigation Sidebar",
    "Figma Frame 620 Requirement": "Active link indicator: 'MY DASHBOARD' link must display active dark left border/indicator when viewing dashboard.",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Active state styling (dark vertical indicator line + bold weight) on MY DASHBOARD.",
    "Actual Live Staging Result": "Active indicator line renders correctly on left border of MY DASHBOARD item.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_008",
    "Module": "Left Navigation Sidebar",
    "Figma Frame 620 Requirement": "Alert Number Sizing: Changes to the size of the alert within the side nav to accommodate larger numbers (2+ digits).",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Counters for Quotes (10), Holds (5), Orders (8) display inside pill badges without text clipping or overflowing container.",
    "Actual Live Staging Result": "Counter badges scale appropriately and render numbers cleanly.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_009",
    "Module": "Left Navigation Sidebar",
    "Figma Frame 620 Requirement": "AU5 Deprecated Links Suppression: Hide legacy AU links (Wishlist, Customer Attribution Credits, Referral Code).",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Deprecated AU5 blocks and links are suppressed from sidebar.",
    "Actual Live Staging Result": "Attribution credits and Wishlist links are removed from sidebar.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_010",
    "Module": "Welcome / Loyalty Banner",
    "Figma Frame 620 Requirement": "Loyalty Status Badge: Showcase pill badge with customer loyalty tier ('Enterprise tier') on olive green card.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Pill badge with semi-transparent background, white border, and 'Enterprise tier' text.",
    "Actual Live Staging Result": "Renders 'Enterprise tier' pill badge cleanly inside olive green banner card.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_011",
    "Module": "Welcome / Loyalty Banner",
    "Figma Frame 620 Requirement": "Customer Greeting: 'Welcome, [First Name] [Last Name]' rendered in IvyMode serif font.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Renders 'Welcome, Deepali Londhe' with correct serif typography.",
    "Actual Live Staging Result": "Renders 'Welcome, Deepali Londhe' matching Figma font styling.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_012",
    "Module": "Welcome / Loyalty Banner",
    "Figma Frame 620 Requirement": "Customer Number & Tier Discount: 'CUSTOMER #[ID] • Tier Discount: [XX]% off' rendered in clean uppercase font.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Renders 'CUSTOMER #999130725 • Tier Discount: 54% off'.",
    "Actual Live Staging Result": "Renders 'CUSTOMER #999130725 • Tier Discount: 54% off' with middle dot separator.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_013",
    "Module": "Welcome / Loyalty Banner",
    "Figma Frame 620 Requirement": "Promotional Lifestyle Image: High-resolution lifestyle sofa photograph positioned on the right side of the banner.",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Lifestyle sofa photography renders seamlessly on right side of olive container.",
    "Actual Live Staging Result": "Promotional sofa photo renders cleanly on desktop layout.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_014",
    "Module": "Welcome / Loyalty Banner",
    "Figma Frame 620 Requirement": "Mobile Responsive Layout: Text elements stack vertically; sofa image hides cleanly on mobile artboard.",
    "Test Viewport": "Mobile (393px)",
    "Expected Result (Figma Spec)": "Welcome block stacks vertically with comfortable padding; hero image hidden.",
    "Actual Live Staging Result": "Text stacks cleanly; sofa image hides on mobile viewport.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_015",
    "Module": "Welcome / Loyalty Banner",
    "Figma Frame 620 Requirement": "Editorial Copy Authenticity: Body paragraph must provide meaningful program copy without placeholder text.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Real English copy describing trade benefits and loyalty status.",
    "Actual Live Staging Result": "Displays placeholder Latin text: 'Lorem ipsum dolor sit amet, adipiscing rhoncus litora ut dui morbi...'.",
    "Status": "FAIL",
    "Defect ID": "DEF-DASH-04",
    "Severity": "P2 - Medium"
  },
  {
    "Test Case ID": "TC_DASH_016",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "Column Reduction: Exactly 6 columns displayed: ORDER, DATE, STATUS, TOTAL, BALANCE, ACTIONS.",
    "Test Viewport": "Desktop",
    "Expected Result (Figma Spec)": "Table header has exactly 6 columns: ORDER, DATE, STATUS, TOTAL, BALANCE, ACTIONS.",
    "Actual Live Staging Result": "Table header renders exactly 6 columns matching Figma specification.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_017",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "USA Date Format: All dates rendered in USA format (MM/DD/YY or MM/DD/YYYY).",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Dates render in USA format: e.g. 09/27/26, 09/21/26, 09/15/26.",
    "Actual Live Staging Result": "Dates correctly formatted as MM/DD/YY: 09/27/26, 09/21/26, 09/15/26.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_018",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "Clickable Order Link: Order number is a hyperlink navigating to order details page (/sales/order/view/...).",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Clicking #SO972501 navigates directly to order view.",
    "Actual Live Staging Result": "Order number is an anchor tag linking to order view page.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_019",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "Actions Dropdown Menu: Secondary actions housed under unified 'Actions ⌵' dropdown button.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Each row has 'Actions ⌵' dropdown button.",
    "Actual Live Staging Result": "'Actions ⌵' button rendered for each order row on desktop and mobile.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_020",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "Actions Dropdown Items: Dropdown options include 'View Order', 'Reorder', 'Download Invoice PDF'.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Dropdown opens smoothly revealing actionable links.",
    "Actual Live Staging Result": "Dropdown opens and displays action links properly.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_021",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "Status Badge Styling & Width: Badges display full text cleanly without truncation (e.g. Awaiting Payment, Complete, Processing).",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Full status label visible inside colored pill badge without ellipsis.",
    "Actual Live Staging Result": "Badges have fixed width causing text truncation with ellipses: 'Awaiting ...', 'Pending P...', 'Payment ...'.",
    "Status": "FAIL",
    "Defect ID": "DEF-DASH-03",
    "Severity": "P2 - Medium"
  },
  {
    "Test Case ID": "TC_DASH_022",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "Currency & Price Formatting: Amounts formatted in USD with dollar symbol, comma thousands separator, and 2 decimal places.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Formatted as $10,316.00, $11,506.00, etc.",
    "Actual Live Staging Result": "Correct USD currency formatting: $10,316.00 and $11,506.00.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_023",
    "Module": "Recent Orders Table",
    "Figma Frame 620 Requirement": "VIEW ALL Link: Top-right header link 'VIEW ALL' navigates to full order history page (/sales/order/history/).",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Clicking VIEW ALL navigates to /sales/order/history/.",
    "Actual Live Staging Result": "VIEW ALL link is visible and navigates to order history.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_024",
    "Module": "Claims Notification Block",
    "Figma Frame 620 Requirement": "1-Column Notification layout: Card with 'New' pill badge, headline, paragraph copy, and 'SUBMIT CLAIM' button.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "1-column container rendered with New pill, headline, body text, and CTA.",
    "Actual Live Staging Result": "Notification card renders matching Figma structure and typography.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_025",
    "Module": "Claims Notification Block",
    "Figma Frame 620 Requirement": "Claims Headline & Copy: Headline 'You can now submit claims online' with explanatory paragraph.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Headline matches Figma specification exactly.",
    "Actual Live Staging Result": "Renders 'You can now submit claims online'.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_026",
    "Module": "Claims Notification Block",
    "Figma Frame 620 Requirement": "SUBMIT CLAIM CTA Button: Outlined pill button routing to online claims submission form.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Button links to claims portal and shows hover state.",
    "Actual Live Staging Result": "SUBMIT CLAIM button is functional and styled with pill border.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_027",
    "Module": "Upcoming Events & Promotions",
    "Figma Frame 620 Requirement": "3-Column Grid Block: 3 cards (Event, Sale: 15% off All Indoor, News) rendered horizontally on desktop and stacked on mobile.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "3-column grid on desktop, 1-column vertical stack on mobile.",
    "Actual Live Staging Result": "Desktop displays 3 columns; mobile stacks cards vertically.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_028",
    "Module": "Upcoming Events & Promotions",
    "Figma Frame 620 Requirement": "Promotional Card CTAs: Individual CTAs for each card ('LEARN MORE', 'SHOP NOW', 'LEARN MORE') linking to respective campaign pages.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "All 3 CTA buttons are clickable and route to promotional destinations.",
    "Actual Live Staging Result": "Buttons render with correct labels and valid links.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_029",
    "Module": "Showroom Bookings Block",
    "Figma Frame 620 Requirement": "Showroom Appointments Section: Appointment cards or friendly empty state copy with prominent 'MAKE A BOOKING' CTA button.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Displays appointment details or empty state copy with MAKE A BOOKING CTA.",
    "Actual Live Staging Result": "Renders empty state copy and functional 'MAKE A BOOKING' button linking to /online_booking/.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DASH_030",
    "Module": "FAQ Accordion Block",
    "Figma Frame 620 Requirement": "FAQ Accordion Rules: Up to 8 FAQs, all closed by default, single accordion open at a time (opening another collapses previously open item).",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "5-8 accordions rendered, all closed initially, auto-collapse on toggle.",
    "Actual Live Staging Result": "5 FAQs rendered, all closed by default, expanding one collapses any open item conforming to Frame 620 rule.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  }
];

// Write Excel
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

ws['!cols'] = [
  { wch: 15 }, // ID
  { wch: 28 }, // Module
  { wch: 45 }, // Figma Req
  { wch: 18 }, // Viewport
  { wch: 45 }, // Expected
  { wch: 45 }, // Actual
  { wch: 10 }, // Status
  { wch: 14 }, // Defect ID
  { wch: 14 }  // Severity
];

XLSX.utils.book_append_sheet(wb, ws, 'Dashboard Test Cases');
const xlsxPath = path.resolve(__dirname, '../Dashboard_Test_Cases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log('Saved XLSX:', xlsxPath);

// Write CSV
const csvPath = path.resolve(__dirname, '../Dashboard_Test_Cases.csv');
const csvContent = XLSX.utils.sheet_to_csv(ws);
fs.writeFileSync(csvPath, csvContent);
console.log('Saved CSV:', csvPath);

// Write Backup
const backupDir = path.resolve(__dirname, '../backup');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(xlsxPath, path.join(backupDir, 'Dashboard_Test_Cases.xlsx'));
fs.copyFileSync(csvPath, path.join(backupDir, 'Dashboard_Test_Cases.csv'));
console.log('Saved backup copies to:', backupDir);
