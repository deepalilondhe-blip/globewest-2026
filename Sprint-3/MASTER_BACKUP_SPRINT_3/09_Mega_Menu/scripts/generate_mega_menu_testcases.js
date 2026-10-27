const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const BASE_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE_DIR, 'Mega_Menu_Test_Cases.csv');
const XLSX_PATH = path.join(BASE_DIR, 'Mega_Menu_Test_Cases.xlsx');

const testCases = [
  {
    "Test ID": "TC-MM-01",
    "Feature / Category": "Mega Menu - Top Level Navigation",
    "Test Scenario": "Verify Presence & Order of All 9 Navigation Categories",
    "Pre-Conditions": "User is on US staging homepage on desktop browser",
    "Test Steps": "Step 1: Open the homepage on desktop browser.\n\nStep 2: Look at the top navigation menu.\n\nStep 3: Verify all 9 main categories are visible: Indoor, Outdoor, Homewares, In Stock, Customisation, Projects, Inspiration, Support, Contact.",
    "Expected Result": "All 9 categories should be displayed in the correct order with proper spacing.",
    "Actual Result": "All 9 categories are present and displayed properly.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-02",
    "Feature / Category": "Desktop - Indoor Category",
    "Test Scenario": "Verify Indoor Dropdown Menu Display and Subcategories",
    "Pre-Conditions": "User is on homepage on desktop",
    "Test Steps": "Step 1: Hover mouse over \"Indoor\" in the main menu.\n\nStep 2: Check the dropdown layout showing Furniture, Rugs, and Lighting columns.\n\nStep 3: Click on a few subcategories like Sofas, Dining Tables, and Lounge Chairs to check navigation.",
    "Expected Result": "Dropdown should open smoothly, showing all columns and subcategory links clearly.",
    "Actual Result": "Dropdown opens smoothly with all columns and subcategories displayed properly.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-03",
    "Feature / Category": "Scope Isolation - Indoor",
    "Test Scenario": "Verify Indoor Outlet Link Redirects to US Store",
    "Pre-Conditions": "Indoor dropdown menu is open",
    "Test Steps": "Step 1: Hover over \"Indoor\" to open the menu.\n\nStep 2: Locate the \"Outlet\" link under Indoor.\n\nStep 3: Click on the Outlet link or inspect its URL destination.",
    "Expected Result": "The link should navigate to the US outlet page on mcstaging2.globewest.com.",
    "Actual Result": "Defect found: Link redirects to Australian outlet site (globewestoutlet.com.au) instead of US store.",
    "Status": "FAIL",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-04",
    "Feature / Category": "Desktop - Outdoor Category",
    "Test Scenario": "Verify Outdoor Dropdown Menu Display and Outlet Link",
    "Pre-Conditions": "User on desktop view",
    "Test Steps": "Step 1: Hover mouse over \"Outdoor\" in the main menu.\n\nStep 2: Check columns and subcategory links (Tables, Chairs, Sofas, Accessories).\n\nStep 3: Check the destination URL for the Outdoor Outlet link.",
    "Expected Result": "All links should stay on the US store without redirecting to Australian domain.",
    "Actual Result": "Defect found: Outdoor Outlet link hardcodes the Australian outlet URL (globewestoutlet.com.au).",
    "Status": "FAIL",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-05",
    "Feature / Category": "Desktop - Homewares Category",
    "Test Scenario": "Verify Homewares Dropdown Menu Display and Outlet Link",
    "Pre-Conditions": "User on desktop view",
    "Test Steps": "Step 1: Hover mouse over \"Homewares\" in the main menu.\n\nStep 2: Check the subcategory links under Homewares.\n\nStep 3: Check the destination URL for the Homewares Outlet link.",
    "Expected Result": "All links should point to the US store.",
    "Actual Result": "Defect found: Homewares Outlet link redirects to the Australian outlet store.",
    "Status": "FAIL",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-06",
    "Feature / Category": "Desktop - In Stock Category",
    "Test Scenario": "Verify In Stock Category Dropdown Links",
    "Pre-Conditions": "User on desktop view",
    "Test Steps": "Step 1: Hover mouse over \"In Stock\" in the main navigation.\n\nStep 2: Check all category group links (In Stock Indoor, In Stock Outdoor, etc.).\n\nStep 3: Click on \"In Stock Indoor\" to test navigation.",
    "Expected Result": "Menu should open cleanly and links should direct to US in-stock product listings.",
    "Actual Result": "In Stock menu opens properly and all links navigate to US catalog.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-07",
    "Feature / Category": "Desktop - Customisation & Projects",
    "Test Scenario": "Verify Customisation and Projects Navigation Links",
    "Pre-Conditions": "User on desktop view",
    "Test Steps": "Step 1: Hover over \"Customisation\" and click the link.\n\nStep 2: Hover over \"Projects\" and click a project gallery link.\n\nStep 3: Confirm that both pages load properly.",
    "Expected Result": "Both links should load their respective US pages without any errors.",
    "Actual Result": "Pages load correctly on US staging with clean URLs.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-08",
    "Feature / Category": "Desktop - Inspiration Category",
    "Test Scenario": "Verify Inspiration Menu Lookbooks and Blog Links",
    "Pre-Conditions": "User on desktop view",
    "Test Steps": "Step 1: Hover mouse over \"Inspiration\".\n\nStep 2: Review lookbooks and design inspiration links.\n\nStep 3: Click on a lookbook link to test navigation.",
    "Expected Result": "All links should navigate to US blog and lookbook pages.",
    "Actual Result": "Inspiration links open the correct US lookbook pages.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-09",
    "Feature / Category": "Scope Isolation - Support Category",
    "Test Scenario": "Verify Support Dropdown Links for Australian Store Leaks",
    "Pre-Conditions": "User on desktop view",
    "Test Steps": "Step 1: Hover mouse over \"Support\" in header.\n\nStep 2: Review all links under Support (Help Centre, Care, Warranty, Outlet).\n\nStep 3: Check destination URLs for all links.",
    "Expected Result": "All support links should open US customer care and FAQ pages.",
    "Actual Result": "Defect found: \"Shop Online Outlet\" and \"Visit Melbourne Outlet\" links redirect to Australian websites.",
    "Status": "FAIL",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-10",
    "Feature / Category": "Desktop - Contact Category",
    "Test Scenario": "Verify Contact Menu Link Navigation",
    "Pre-Conditions": "User on desktop view",
    "Test Steps": "Step 1: Hover over or click \"Contact\" in header menu.\n\nStep 2: Click on \"Contact Us\" or \"Book a Showroom\".\n\nStep 3: Verify page navigation.",
    "Expected Result": "User should be taken to the US contact and showroom booking page.",
    "Actual Result": "Contact page opens with US showroom information.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-11",
    "Feature / Category": "Mobile - Hamburger Navigation",
    "Test Scenario": "Verify Mobile Menu Drawer Opens and Shows All 9 Categories",
    "Pre-Conditions": "Mobile view (390x844 on mobile device)",
    "Test Steps": "Step 1: Open the website on mobile browser.\n\nStep 2: Tap the hamburger menu icon (three lines) in the header.\n\nStep 3: Verify that the side menu slides open smoothly.\n\nStep 4: Check that all 9 categories are listed.",
    "Expected Result": "Mobile drawer opens smoothly and displays all 9 main categories without horizontal scrolling.",
    "Actual Result": "Drawer opens smoothly showing all 9 categories clearly.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-12",
    "Feature / Category": "Mobile - Category Submenus",
    "Test Scenario": "Verify Category Accordions Expand and Links Navigate Properly",
    "Pre-Conditions": "Mobile menu drawer is open",
    "Test Steps": "Step 1: Tap on \"Indoor\" to expand its subcategories.\n\nStep 2: Check that child categories expand smoothly.\n\nStep 3: Tap other categories (Outdoor, Homewares, Support) to expand.\n\nStep 4: Click subcategory links to test navigation.",
    "Expected Result": "Each category accordion expands and collapses cleanly on tap.",
    "Actual Result": "Accordions work smoothly; however, outlet links inside Indoor and Support redirect to Australian domain.",
    "Status": "FAIL",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-13",
    "Feature / Category": "Keyboard Navigation",
    "Test Scenario": "Verify Menu Navigation Using Tab and Arrow Keys",
    "Pre-Conditions": "Desktop view, user on homepage",
    "Test Steps": "Step 1: Press Tab key to move focus through the main navigation menu.\n\nStep 2: Verify visible focus outline around each menu link.\n\nStep 3: Press Enter or Space to open a dropdown menu.\n\nStep 4: Use Tab and arrow keys to move through dropdown links.",
    "Expected Result": "User can navigate all categories and submenu items using keyboard only with clear focus highlighting.",
    "Actual Result": "Keyboard Tab navigation works smoothly with clear visible focus rings on all menu links.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-14",
    "Feature / Category": "Keyboard Escape Key",
    "Test Scenario": "Verify Escape Key Closes Open Dropdown Menu",
    "Pre-Conditions": "A mega menu dropdown is currently open on desktop",
    "Test Steps": "Step 1: Hover or press Enter to open the \"Indoor\" menu dropdown.\n\nStep 2: Press the Escape key on your keyboard.\n\nStep 3: Verify that the dropdown closes immediately.",
    "Expected Result": "The dropdown menu should close right away and focus should return to the parent category button.",
    "Actual Result": "Menu closes immediately when Escape key is pressed.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-15",
    "Feature / Category": "Mouse Hover Stability",
    "Test Scenario": "Verify Menu Stays Open While Moving Mouse Between Columns",
    "Pre-Conditions": "Desktop view, user hovers over main menu",
    "Test Steps": "Step 1: Hover mouse over \"Indoor\" to open the dropdown.\n\nStep 2: Move the mouse pointer diagonally towards subcategories on the right.\n\nStep 3: Verify the menu stays open and does not flicker or close accidentally.",
    "Expected Result": "Dropdown stays open smoothly while moving the mouse pointer across menu columns.",
    "Actual Result": "Dropdown menu remains stably open without accidental closing.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-16",
    "Feature / Category": "Active Page Highlight",
    "Test Scenario": "Verify Active Visual Highlight on Currently Selected Category",
    "Pre-Conditions": "User has navigated to a category page like /indoor",
    "Test Steps": "Step 1: Click on \"Indoor\" in the menu to load the Indoor page.\n\nStep 2: Look at the top navigation bar.\n\nStep 3: Check if \"Indoor\" is visually highlighted or underlined to show current page.",
    "Expected Result": "The current category should show an active underline or bold text so users know where they are.",
    "Actual Result": "Active category displays a clear underline indicator.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-17",
    "Feature / Category": "Search Overlay Coexistence",
    "Test Scenario": "Verify Menu Closes When Opening Search Popup",
    "Pre-Conditions": "Mega menu dropdown is open on desktop",
    "Test Steps": "Step 1: Hover over any category so the dropdown is open.\n\nStep 2: Click the Search (magnifying glass) icon in the header.\n\nStep 3: Check that the mega menu closes automatically and search box opens.",
    "Expected Result": "Menu should close cleanly so it does not overlap with the search box.",
    "Actual Result": "Menu closes smoothly as soon as search icon is clicked.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-18",
    "Feature / Category": "Mobile Drawer Dismissal",
    "Test Scenario": "Verify Mobile Menu Closes by Tapping Outside Drawer",
    "Pre-Conditions": "Mobile menu drawer is open on mobile screen",
    "Test Steps": "Step 1: On mobile view, tap hamburger icon to open the side menu.\n\nStep 2: Tap anywhere on the dimmed background area outside the menu.\n\nStep 3: Verify that the drawer closes and returns to the page.",
    "Expected Result": "Tapping the background overlay should close the menu and re-enable page scrolling.",
    "Actual Result": "Drawer closes smoothly and page scrolling resumes normally.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-19",
    "Feature / Category": "Mobile Touch Targets",
    "Test Scenario": "Verify Mobile Menu Links are Easy to Tap",
    "Pre-Conditions": "Mobile view on mobile phone or emulator",
    "Test Steps": "Step 1: Open mobile menu drawer.\n\nStep 2: Tap through several category links.\n\nStep 3: Check if links have enough spacing so adjacent links are not accidentally tapped.",
    "Expected Result": "Links should have ample height and spacing for easy finger tapping on touchscreens.",
    "Actual Result": "All links are easy to tap with comfortable touch spacing.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-20",
    "Feature / Category": "Header Logo Navigation",
    "Test Scenario": "Verify Logo Click Returns to Home While Menu is Open",
    "Pre-Conditions": "Main menu dropdown is open on desktop",
    "Test Steps": "Step 1: Hover over a menu item to open the dropdown.\n\nStep 2: Click the GlobeWest brand logo in the header.\n\nStep 3: Verify the browser navigates back to the homepage.",
    "Expected Result": "Clicking the logo takes the user directly back to the US homepage and closes the menu.",
    "Actual Result": "Logo click redirects to homepage cleanly.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-21",
    "Feature / Category": "Screen Reader Accessibility",
    "Test Scenario": "Verify Screen Reader Labels for Menu Categories",
    "Pre-Conditions": "Storefront loaded with screen reader enabled",
    "Test Steps": "Step 1: Focus on category menu items with screen reader on.\n\nStep 2: Open and close a category dropdown.\n\nStep 3: Check if the screen reader announces whether the menu is expanded or collapsed.",
    "Expected Result": "Screen reader should announce the category name and state (expanded or collapsed).",
    "Actual Result": "Screen reader announces category name and expanded/collapsed state accurately.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-22",
    "Feature / Category": "Desktop - Editorial & Promo Cards",
    "Test Scenario": "Verify Promotional Card Display & US Image/Link Parity in Flyouts",
    "Pre-Conditions": "Desktop viewport 1440x900 on US staging homepage",
    "Test Steps": "Step 1: Hover mouse over categories containing promotional cards (Indoor, Outdoor, Homewares, In Stock).\n\nStep 2: Inspect right-hand promotional card imagery, heading copy, and CTA button.\n\nStep 3: Click promotional card CTA and assert target destination URL on US storefront.",
    "Expected Result": "Promotional cards display high-resolution imagery and headlines matching design spec; CTA links navigate cleanly to US collection pages without AU domain leakage.",
    "Actual Result": "Right-hand promotional cards render high-res lifestyle imagery; CTAs link cleanly to US collections with zero Australian domain leakage.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-23",
    "Feature / Category": "Tablet - Responsive Navigation (768px - 1024px)",
    "Test Scenario": "Verify Mega Menu Responsive Breakpoint & Touch Drawer on Tablet / iPad",
    "Pre-Conditions": "Tablet viewport 820x1180 (iPad Air) and 768x1024 (iPad Mini)",
    "Test Steps": "Step 1: Open US staging homepage on tablet viewport.\n\nStep 2: Verify header navigation collapses cleanly into mobile hamburger icon at tablet widths.\n\nStep 3: Tap hamburger icon to open side drawer.\n\nStep 4: Tap category accordions (Indoor, Outdoor, Support) and test touch interaction.",
    "Expected Result": "Header navigation adapts responsively without horizontal overflow or overlapping logo; side drawer opens smoothly with responsive touch targets.",
    "Actual Result": "Navigation adapts cleanly to tablet viewport; hamburger drawer operates smoothly with comfortable touch spacing across all categories.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-24",
    "Feature / Category": "Desktop - Sticky Header on Scroll",
    "Test Scenario": "Verify Mega Menu Flyout Behavior when Header is Sticky on Page Scroll",
    "Pre-Conditions": "Desktop viewport 1440x900, user is on a long PLP or PDP page",
    "Test Steps": "Step 1: Scroll down page past 300px so sticky header locks to top of viewport.\n\nStep 2: Hover mouse over navigation categories (Indoor, Outdoor, Inspiration).\n\nStep 3: Verify mega menu flyout dropdown positions correctly below sticky header without clipping or visual lag.",
    "Expected Result": "Mega menu flyout opens directly underneath the sticky header bar with proper z-index layering over page content.",
    "Actual Result": "Mega menu flyout opens seamlessly beneath sticky header; z-index layering sits cleanly above PLP product cards and banners.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-25",
    "Feature / Category": "Desktop - Primary Category Landing",
    "Test Scenario": "Verify Direct Click on Top-Level Category Navigates to Primary Category PLP",
    "Pre-Conditions": "Desktop viewport 1440x900 on homepage",
    "Test Steps": "Step 1: Click directly on top-level category label \"Indoor\" (not subcategory link).\n\nStep 2: Verify browser navigates to /indoor collection page.\n\nStep 3: Repeat direct click test for \"Outdoor\" and \"Homewares\".",
    "Expected Result": "Direct click on parent category label routes user to the primary category PLP (/indoor, /outdoor, /homewares) with full product catalog.",
    "Actual Result": "Direct clicks route cleanly to respective parent category PLPs on US storefront (/indoor, /outdoor, /homewares) with HTTP 200.",
    "Status": "PASS",
    "Severity": "P2 - Medium"
  },
  {
    "Test ID": "TC-MM-26",
    "Feature / Category": "Cross-Feature Coexistence - Mini Cart",
    "Test Scenario": "Verify Open Mega Menu Flyout Dismisses when Mini Cart Drawer is Opened",
    "Pre-Conditions": "Desktop viewport 1440x900, active open mega menu flyout",
    "Test Steps": "Step 1: Hover over \"Indoor\" to expand mega menu flyout.\n\nStep 2: Click the Mini Cart bag icon in the header.\n\nStep 3: Verify mega menu flyout automatically closes as mini cart slide-out drawer opens.",
    "Expected Result": "Mega menu flyout closes immediately to avoid visual z-index collision with the cart drawer.",
    "Actual Result": "Mega menu collapses cleanly as mini cart drawer opens; zero z-index or visual overlap conflict.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-27",
    "Feature / Category": "Dual-Auth Matrix - Trade Customer Session",
    "Test Scenario": "Verify Mega Menu Structure and Category Parity in Authenticated Trade Session",
    "Pre-Conditions": "Logged in as approved US Trade customer (deepali.londhe@overdose.digital)",
    "Test Steps": "Step 1: Log in as Trade customer on US staging.\n\nStep 2: Inspect top navigation menu bar and all 9 categories.\n\nStep 3: Hover through Indoor, Outdoor, and In Stock flyouts.\n\nStep 4: Verify trade pricing toggle and account dropdown coexist alongside mega menu.",
    "Expected Result": "All 9 categories retain full parity with guest view; trade pricing indicator and account utilities render cleanly without displacing category pills.",
    "Actual Result": "All 9 categories render with exact parity in Trade session; header utilities and trade toggle coexist without layout distortion.",
    "Status": "PASS",
    "Severity": "P1 - High"
  },
  {
    "Test ID": "TC-MM-28",
    "Feature / Category": "Catalog Routing Integrity - Subcategory PLPs",
    "Test Scenario": "Verify Core Subcategory Links Navigate to Active US PLP Pages (Zero 404s)",
    "Pre-Conditions": "Desktop viewport 1440x900 on US staging",
    "Test Steps": "Step 1: Hover over \"Indoor\" and click \"Sofas\", \"Dining Tables\", \"Lounge Chairs\".\n\nStep 2: Hover over \"Outdoor\" and click \"Dining Tables\", \"Sofas\".\n\nStep 3: Hover over \"In Stock\" and click \"In Stock Indoor\".\n\nStep 4: Verify all destination pages return HTTP 200 with populated product listing grids.",
    "Expected Result": "All sampled subcategory links route to valid US PLP paths with active product listings and zero 404 error pages.",
    "Actual Result": "All core subcategory links return HTTP 200 with populated product grids and zero 404 broken page errors.",
    "Status": "PASS",
    "Severity": "P1 - High"
  }
];

// 1. Write CSV with generous spacing between test cases
const headers = Object.keys(testCases[0]);
const csvRows = testCases.map(tc => headers.map(h => `"${(tc[h] || '').replace(/"/g, '""')}"`).join(','));
const csvContent = [headers.join(','), ...csvRows].join('\n\n');

fs.writeFileSync(CSV_PATH, csvContent);
console.log(`✅ CSV Generated with Spacing: ${CSV_PATH}`);

// 2. Write Excel with column widths
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

ws['!cols'] = [
  { wch: 14 },
  { wch: 32 },
  { wch: 48 },
  { wch: 40 },
  { wch: 65 },
  { wch: 55 },
  { wch: 60 },
  { wch: 12 },
  { wch: 15 }
];

XLSX.utils.book_append_sheet(wb, ws, 'Mega Menu Test Cases');
XLSX.writeFile(wb, XLSX_PATH);
console.log(`✅ XLSX Generated with Widths: ${XLSX_PATH}`);
