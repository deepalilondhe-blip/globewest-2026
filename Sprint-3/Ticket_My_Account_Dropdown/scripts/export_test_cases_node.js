const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const testCases = [
  {
    "Test Case ID": "TC_DROP_001",
    "Module": "Header Trigger",
    "Figma Frame 620 Requirement": "Trigger Presence & Placement: Header utility section contains user outline icon (👤) and 'My Account' text between search/links and cart icon.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "'👤 My Account' trigger rendered with user outline icon and clean sans-serif typography.",
    "Actual Live Staging Result": "Renders '👤 My Account' in header utilities section matching Figma placement.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_002",
    "Module": "Header Trigger",
    "Figma Frame 620 Requirement": "Chevron State Indicator: Trigger displays upward caret (^) when dropdown is open and downward caret (⌵) when closed.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Caret toggles to '^' when menu is open, indicating active dropdown state.",
    "Actual Live Staging Result": "Caret toggles to '^' when open and '⌵' when closed.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_003",
    "Module": "Dual-Auth State",
    "Figma Frame 620 Requirement": "Authenticated Trade User State: Logged-in Trade customer sees 'My Account' profile dropdown trigger.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Shows 'My Account' with dropdown access for authenticated trade users.",
    "Actual Live Staging Result": "Correctly shows 'My Account' for trade account (deepali.londhe@overdose.digital).",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_004",
    "Module": "Dual-Auth State",
    "Figma Frame 620 Requirement": "Public Browsing / Logged-Out State: Unauthenticated guest sees public login/register CTAs instead of account dropdown.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Shows 'Become a Trade Customer' / 'Sign In' without open account menu.",
    "Actual Live Staging Result": "Public browsing mode masks trade account links and prompts login/registration.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_005",
    "Module": "Dropdown Container",
    "Figma Frame 620 Requirement": "Container Styling: White container with subtle drop shadow, rounded corners, and top pointer arrow aligned below trigger.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "White background (#FFFFFF), box-shadow, rounded corners, and top pointing arrow.",
    "Actual Live Staging Result": "Dropdown menu has white background, soft shadow, and top pointer arrow.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_006",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link #1 - My Dashboard: First item is 'My Dashboard' linking to /customer/account/.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "'My Dashboard' is the #1 item at the top of the dropdown menu.",
    "Actual Live Staging Result": "'My Dashboard' is rendered as the first item linking to /customer/account/.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_007",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link #2 - My Orders: Second item is 'My Orders' linking to /sales/order/history/.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "'My Orders' is the #2 item linking to order history.",
    "Actual Live Staging Result": "'My Orders' is rendered as item #2 linking to order history.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_008",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link #3 - My Quotes: Third item is 'My Quotes' linking to /quotes/.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "'My Quotes' is the #3 item linking to quotes portal.",
    "Actual Live Staging Result": "'My Quotes' is rendered as item #3 linking to quotes portal.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_009",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link #4 - My Holds: Fourth item is 'My Holds' linking to /awaff/holds/.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "'My Holds' is the #4 item linking to holds portal.",
    "Actual Live Staging Result": "'My Holds' is rendered as item #4 linking to holds portal.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_010",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link #5 - My Wishlist & Boards: Fifth item is 'My Wishlist & Boards' linking to /wishlist/.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "'My Wishlist & Boards' is rendered as item #5 in dropdown.",
    "Actual Live Staging Result": "'My Wishlist & Boards' is 100% MISSING from the desktop dropdown menu.",
    "Status": "FAIL",
    "Defect ID": "DEF-DROP-01",
    "Severity": "P1 - High"
  },
  {
    "Test Case ID": "TC_DROP_011",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link #6 - Showroom Bookings: Sixth item is 'Showroom Bookings' linking to /online_booking/account/index/.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "'Showroom Bookings' is rendered linking to showroom bookings.",
    "Actual Live Staging Result": "'Showroom Bookings' is rendered linking to /online_booking/account/index/.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_012",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link #7 - Log out: Final item is 'Log out' linking to /customer/account/logout/.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Label is 'Log out' (two words per Figma Frame 620 artboard).",
    "Actual Live Staging Result": "Label is 'Logout' (one word, minor copy mismatch).",
    "Status": "FAIL",
    "Defect ID": "DEF-DROP-02",
    "Severity": "P3 - Low"
  },
  {
    "Test Case ID": "TC_DROP_013",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Link Order & Completeness: Exact 7-link sequence: My Dashboard, My Orders, My Quotes, My Holds, My Wishlist & Boards, Showroom Bookings, Log out.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "All 7 links present in exact order specified in Figma artboard.",
    "Actual Live Staging Result": "Only 6 links rendered; 'My Wishlist & Boards' is missing from the sequence.",
    "Status": "FAIL",
    "Defect ID": "DEF-DROP-01",
    "Severity": "P1 - High"
  },
  {
    "Test Case ID": "TC_DROP_014",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Typography & Spacing: Clean sans-serif font, 14px-15px font size, 400 weight, 12px vertical item padding.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Computed font matches Figma typography and line-height specs.",
    "Actual Live Staging Result": "Font family and size render cleanly with comfortable breathing room.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_015",
    "Module": "Dropdown Menu Links",
    "Figma Frame 620 Requirement": "Hover Interaction: Mouse hover on any link displays subtle background tint or text underline; cursor is pointer.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Hover state feedback clearly indicates clickable item.",
    "Actual Live Staging Result": "Hover effect active on all dropdown items.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_016",
    "Module": "Badge / Counter Sizing",
    "Figma Frame 620 Requirement": "Quote Counter Sizing: Figma shows clean text list without prominent pill counters in top dropdown.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Text renders cleanly matching Figma artboard presentation.",
    "Actual Live Staging Result": "Renders text cleanly without badge overflow.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_017",
    "Module": "Badge / Counter Sizing",
    "Figma Frame 620 Requirement": "Hold Counter Sizing: Holds link rendered cleanly without misaligned counter badges.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Hold link text aligned consistently with other menu items.",
    "Actual Live Staging Result": "Text alignment is consistent.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_018",
    "Module": "Menu Dismissal",
    "Figma Frame 620 Requirement": "Outside Click Dismissal: Clicking anywhere outside the dropdown container dismisses the menu.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Menu closes immediately upon outside click.",
    "Actual Live Staging Result": "Menu dismisses cleanly on outside click.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_019",
    "Module": "Menu Dismissal",
    "Figma Frame 620 Requirement": "Re-Click Trigger Toggle: Clicking the '👤 My Account' trigger while open immediately closes the menu.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Menu toggles closed and chevron reverts to '⌵'.",
    "Actual Live Staging Result": "Re-clicking trigger toggles dropdown closed cleanly.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_020",
    "Module": "Accessibility / Keyboard",
    "Figma Frame 620 Requirement": "Escape Key Dismissal: Pressing Escape closes the dropdown and returns focus to trigger.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Escape key dismisses dropdown menu.",
    "Actual Live Staging Result": "Escape key dismisses dropdown overlay.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_021",
    "Module": "Accessibility / Keyboard",
    "Figma Frame 620 Requirement": "Keyboard Tab Focus: User can Tab sequentially through all dropdown links in logical DOM order.",
    "Test Viewport": "Desktop (1440x900)",
    "Expected Result (Figma Spec)": "Tab moves focus through each link with visible focus ring.",
    "Actual Live Staging Result": "Focus moves sequentially through anchor elements.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_022",
    "Module": "Mobile Account Menu",
    "Figma Frame 620 Requirement": "Mobile User Icon Tap: Tapping '👤' icon in mobile header (393px) opens the mobile account menu overlay.",
    "Test Viewport": "Mobile (393x852)",
    "Expected Result (Figma Spec)": "Mobile account menu opens displaying user options.",
    "Actual Live Staging Result": "Tapping '👤' icon opens mobile account overlay with upward chevron.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_023",
    "Module": "Mobile Account Menu",
    "Figma Frame 620 Requirement": "Mobile Menu Links & Order: Mobile overlay renders 7 links per Figma artboard mobile/: Dashboard, Orders, Quotes, Holds, Wishlist & Boards, Showroom Bookings, Log out.",
    "Test Viewport": "Mobile (393x852)",
    "Expected Result (Figma Spec)": "All 7 links displayed on mobile overlay.",
    "Actual Live Staging Result": "'My Wishlist & Boards' is MISSING from mobile account overlay; only 6 links displayed.",
    "Status": "FAIL",
    "Defect ID": "DEF-DROP-01",
    "Severity": "P1 - High"
  },
  {
    "Test Case ID": "TC_DROP_024",
    "Module": "Mobile Hamburger Drawer",
    "Figma Frame 620 Requirement": "Drawer Account Links: Opening hamburger menu when logged in shows account links at the top (Figma mobile/Home/Menu artboard).",
    "Test Viewport": "Mobile (393x852)",
    "Expected Result (Figma Spec)": "Mobile drawer displays: My Dashboard, My Orders, My Quotes, My Holds, My Wishlist & Boards, Showroom Bookings, Log Out.",
    "Actual Live Staging Result": "Mobile hamburger drawer only displays product categories (Indoor, Outdoor...); authenticated account links are MISSING.",
    "Status": "FAIL",
    "Defect ID": "DEF-DROP-03",
    "Severity": "P1 - High"
  },
  {
    "Test Case ID": "TC_DROP_025",
    "Module": "Mobile Touch Targets",
    "Figma Frame 620 Requirement": "Mobile Touch Accessibility: Links have minimum 44px height for touch targets with clean horizontal divider lines.",
    "Test Viewport": "Mobile (393x852)",
    "Expected Result (Figma Spec)": "Touch targets meet mobile accessibility guidelines.",
    "Actual Live Staging Result": "Items have comfortable 48px height and clean dividers.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_026",
    "Module": "Mobile Dismissal",
    "Figma Frame 620 Requirement": "Mobile Close Action: Tapping the 'X' button or user icon in the header closes mobile overlay.",
    "Test Viewport": "Mobile (393x852)",
    "Expected Result (Figma Spec)": "Tapping 'X' closes overlay cleanly.",
    "Actual Live Staging Result": "Close button dismisses mobile overlay.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_027",
    "Module": "Navigation Routing",
    "Figma Frame 620 Requirement": "Routing Integrity: Clicking any link routes to the appropriate US store page without session loss.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Each link routes correctly and maintains authenticated trade state.",
    "Actual Live Staging Result": "All rendered links route to correct endpoints.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_028",
    "Module": "Scope Integrity",
    "Figma Frame 620 Requirement": "Zero Australian Leakage: All link URLs point strictly to US domain (https://mcstaging2.globewest.com/) with no .com.au domains.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Zero .com.au links in dropdown DOM.",
    "Actual Live Staging Result": "All URLs point to US staging domain.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_029",
    "Module": "Logout Flow",
    "Figma Frame 620 Requirement": "Logout Functionality: Clicking 'Logout' invalidates session and redirects to logout confirmation / homepage.",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Session is cleared, user returned to logged-out public state.",
    "Actual Live Staging Result": "Logout clears session and redirects to public browsing mode.",
    "Status": "PASS",
    "Defect ID": "None",
    "Severity": "None"
  },
  {
    "Test Case ID": "TC_DROP_030",
    "Module": "Cross-Page Availability",
    "Figma Frame 620 Requirement": "Global Consistency: Account dropdown behaves identically across all templates (Homepage, PLP, PDP, Cart, CMS).",
    "Test Viewport": "Desktop & Mobile",
    "Expected Result (Figma Spec)": "Dropdown is globally consistent across all store pages.",
    "Actual Live Staging Result": "Dropdown functions identically on all tested store templates.",
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
  { wch: 22 }, // Viewport
  { wch: 45 }, // Expected
  { wch: 45 }, // Actual
  { wch: 10 }, // Status
  { wch: 14 }, // Defect ID
  { wch: 14 }  // Severity
];

XLSX.utils.book_append_sheet(wb, ws, 'Account Dropdown Test Cases');
const xlsxPath = path.resolve(__dirname, '../My_Account_Dropdown_Test_Cases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log('Saved XLSX:', xlsxPath);

// Write CSV
const csvPath = path.resolve(__dirname, '../My_Account_Dropdown_Test_Cases.csv');
const csvContent = XLSX.utils.sheet_to_csv(ws);
fs.writeFileSync(csvPath, csvContent);
console.log('Saved CSV:', csvPath);

// Write Backup
const backupDir = path.resolve(__dirname, '../backup');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(xlsxPath, path.join(backupDir, 'My_Account_Dropdown_Test_Cases.xlsx'));
fs.copyFileSync(csvPath, path.join(backupDir, 'My_Account_Dropdown_Test_Cases.csv'));
console.log('Saved backup copies to:', backupDir);
