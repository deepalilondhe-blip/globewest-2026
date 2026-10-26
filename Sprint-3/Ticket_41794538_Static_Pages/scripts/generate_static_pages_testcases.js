const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const BASE_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE_DIR, 'Static_Pages_Test_Cases.csv');
const XLSX_PATH = path.join(BASE_DIR, 'Static_Pages_Test_Cases.xlsx');

const testCases = [
  {
    'Test ID': 'TC-STAT-001',
    'Feature / Category': 'Dual-Auth Matrix',
    'Test Scenario': 'Verify Authenticated Sessions across all 5 Static Pages on US and AU Storefronts',
    'Pre-Conditions': 'US Staging (https://mcstaging2.globewest.com/) & AU Staging (https://mcstaging2.globewest.com.au/)',
    'Test Steps': '1. Authenticate on US Staging with Trade Customer (deepali.londhe@overdose.digital).\n2. Authenticate on AU Staging with Customer (deepalilondhe576@gmail.com).\n3. Navigate to each static page: /terms-and-conditions-page, /privacy-policy, /contact-us, /help-centre, /404.\n4. Verify authenticated session header remains persistent.',
    'Expected Result': 'Header persistently displays logged-in user state; Trade pricing and account navigation available across all static pages without session drops.',
    'Actual Result': 'All 5 static pages successfully accessed under authenticated state on both storefronts; sessions remained persistent.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-002',
    'Feature / Category': 'Terms & Conditions',
    'Test Scenario': 'Verify Tabbed Layout and Accordion Functionality (Trade vs General Public)',
    'Pre-Conditions': 'US Staging /terms-and-conditions-page (Desktop 1440x900)',
    'Test Steps': '1. Navigate to /terms-and-conditions-page.\n2. Verify presence of "Trade Customers" and "General Public" tabs.\n3. Click into accordion sections (1. Introduction through 16. Definitions).\n4. Assert accordion expands and collapses smoothly.',
    'Expected Result': 'Interactive tabs toggle between Trade and General Public terms; all 16 numbered sections expand and display clause text clearly.',
    'Actual Result': 'Tabs and accordions function smoothly; all clause panels expand with full text content.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-003',
    'Feature / Category': 'Terms & Conditions',
    'Test Scenario': 'Verify US Legal Entity & Australian Jurisdiction Leakage Audit',
    'Pre-Conditions': 'US Staging /terms-and-conditions-page',
    'Test Steps': '1. Inspect clause 1.1 "Who we are" and contact references.\n2. Check for Australian corporate references (ACN, Victoria, PPSA, claims@globewest.com.au).\n3. Check against US legal requirements.',
    'Expected Result': 'Terms must specify US legal entity and governing jurisdiction without Australian statutory leakage (ACN, PPSA).',
    'Actual Result': 'DEFECT: Clause 1.1 specifies "GlobeWest Pty Ltd, Victoria, Australia ACN 674 872 621", claims@globewest.com.au, and PPSA (Australian Personal Property Securities Act).',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-STAT-004',
    'Feature / Category': 'Terms & Conditions',
    'Test Scenario': 'Verify Responsive Mobile Usability & Collapsible Drawer Behavior',
    'Pre-Conditions': 'Mobile Viewport 390x844 (iPhone 14/15)',
    'Test Steps': '1. Load /terms-and-conditions-page in mobile viewport.\n2. Verify tab pills wrap cleanly.\n3. Tap to expand accordion items on touch device.\n4. Check horizontal scrolling or layout clipping.',
    'Expected Result': 'Accordions stack cleanly; touch targets are minimum 44x44px; zero horizontal scrolling or layout clipping.',
    'Actual Result': 'Mobile layout adapts seamlessly; accordion triggers are finger-friendly; text wraps cleanly within 390px viewport.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-005',
    'Feature / Category': 'Privacy Policy',
    'Test Scenario': 'Verify Content Hierarchy & Section Matching (AU Baseline vs US Target)',
    'Pre-Conditions': 'US Staging /privacy-policy vs AU Baseline /privacy-policy',
    'Test Steps': '1. Navigate to /privacy-policy on both environments.\n2. Compare H2 headings: "What we collect", "What we do with information", "Security", "How we use cookies", "List of cookies we collect".\n3. Verify section copy and paragraph counts.',
    'Expected Result': 'US Privacy Policy structure, headings, and cookie tables match AU baseline 1-to-1 without content loss.',
    'Actual Result': 'Matches AU baseline: identical H2 hierarchy (7 sections) and consistent body copy (AU 25,164 chars vs US 25,194 chars).',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-006',
    'Feature / Category': 'Privacy Policy',
    'Test Scenario': 'Verify Cookie Table Formatting & Responsive Mobile Overflow',
    'Pre-Conditions': 'US Staging /privacy-policy (Desktop & Mobile)',
    'Test Steps': '1. Scroll down to "List of cookies we collect" table.\n2. Inspect table columns: Cookie Name, Cookie Description.\n3. Switch to mobile viewport (390px) and verify table scroll/wrap behavior.',
    'Expected Result': 'Cookie table is structured with headers; on mobile, table is horizontally scrollable or responsive without breaking container bounds.',
    'Actual Result': 'Table renders cleanly on desktop; responsive overflow container allows smooth horizontal scrolling on mobile.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-STAT-007',
    'Feature / Category': 'Privacy Policy',
    'Test Scenario': 'Verify Contact Email & Australian Legal Entity References',
    'Pre-Conditions': 'US Staging /privacy-policy',
    'Test Steps': '1. Inspect Privacy Policy contact section.\n2. Check for Australian ABN and .com.au emails (marketing@globewest.com.au, enquiries@globewest.com.au).',
    'Expected Result': 'Privacy Policy should list US-appropriate contact endpoints and privacy rights disclosures (e.g., CCPA / US privacy contact).',
    'Actual Result': 'DEFECT: Lists Australian emails (marketing@globewest.com.au, enquiries@globewest.com.au) and references Australian privacy legislation.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-STAT-008',
    'Feature / Category': 'Contact Us',
    'Test Scenario': 'Verify Page Layout, Online Inquiry Form & Field Validation',
    'Pre-Conditions': 'US Staging /contact-us (Desktop 1440x900)',
    'Test Steps': '1. Navigate to /contact-us.\n2. Inspect H2 headings ("Contact Us", "Our Showrooms", "Online enquiry").\n3. Test form input fields (Name, Email, Phone, Inquiry Reason, Message).\n4. Attempt submission with empty required fields.',
    'Expected Result': 'Online inquiry form renders cleanly; required field validations trigger with descriptive error messages.',
    'Actual Result': 'Form renders with all input fields; required validation triggers correctly on empty submit.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-009',
    'Feature / Category': 'Contact Us',
    'Test Scenario': 'Verify Showroom Directory Localization & Australian Data Leakage',
    'Pre-Conditions': 'US Staging /contact-us',
    'Test Steps': '1. Inspect "Our Showrooms" section.\n2. Verify showroom cards, addresses, opening hours, and contact emails.\n3. Check whether US showrooms or AU showrooms are displayed.',
    'Expected Result': 'US Contact page must display US showroom locations and US contact info.',
    'Actual Result': 'DEFECT: Displays Australian showrooms (Melbourne, Sydney, Brisbane, Perth) and .com.au emails (melbourne@globewest.com.au, etc.).',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-010',
    'Feature / Category': 'Contact Us',
    'Test Scenario': 'Verify Showroom Imagery & Broken Asset Inspection',
    'Pre-Conditions': 'US Staging /contact-us',
    'Test Steps': '1. Inspect all showroom and hero image tags in <main>.\n2. Assert naturalWidth > 0 and HTTP 200 for all image assets.\n3. Check for placeholder images.',
    'Expected Result': 'All showroom photos load high-res photography; zero broken image links.',
    'Actual Result': 'DEFECT: Broken image link detected for "GW-090724-005-3_375x420.jpg" returning HTTP 404.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-STAT-011',
    'Feature / Category': 'Contact Us',
    'Test Scenario': 'Verify Responsive Mobile Layout & Form Usability',
    'Pre-Conditions': 'Mobile Viewport 390x844',
    'Test Steps': '1. Load /contact-us on mobile.\n2. Inspect single-column stacking of form and showroom cards.\n3. Test input tap responsiveness and keyboard avoidance.',
    'Expected Result': 'Clean vertical stack; input fields stretch full-width (350px); touch targets conform to mobile accessibility standards.',
    'Actual Result': 'Mobile layout stacks cleanly; form inputs full-width and functional on touch devices.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-012',
    'Feature / Category': 'Help Centre / FAQ',
    'Test Scenario': 'Verify Document <title> Tag & WCAG 2.2 AA Conformance (Empty Title Check)',
    'Pre-Conditions': 'US Staging /help-centre vs AU Baseline /help-centre',
    'Test Steps': '1. Navigate to /help-centre on US Staging.\n2. Inspect document.title via DOM inspection.\n3. Compare with AU baseline document.title.',
    'Expected Result': 'Document title must be non-empty and descriptive: "<title>Help centre</title>" (conforms to WCAG 2.2 AA Criterion 2.4.2 Page Titled).',
    'Actual Result': 'DEFECT: US Staging document.title is completely EMPTY ("") whereas AU Staging has "Help centre".',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-013',
    'Feature / Category': 'Help Centre / FAQ',
    'Test Scenario': 'Verify Hero Banner Photography & Category Navigation Grid',
    'Pre-Conditions': 'US Staging /help-centre',
    'Test Steps': '1. Inspect Help Centre hero banner asset.\n2. Inspect category cards (Orders, Delivery, Returns, Trade Accounts, Product Care).\n3. Check category card links and hover states.',
    'Expected Result': 'Hero banner renders crisp photography; category cards render with icons and navigate to appropriate articles.',
    'Actual Result': 'DEFECT: Hero banner image (help-center-banner.jpg) fails to load (404 error); category navigation grid renders properly.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-STAT-014',
    'Feature / Category': 'Help Centre / FAQ',
    'Test Scenario': 'Verify Search Bar Interaction & Responsive Mobile Layout',
    'Pre-Conditions': 'Desktop 1440px & Mobile 390px Viewports',
    'Test Steps': '1. Inspect search input in Help Centre.\n2. Enter search queries (e.g. "delivery", "trade discount").\n3. Switch to mobile viewport and verify responsive stacking.',
    'Expected Result': 'Search input accessible with placeholder text; category cards stack into 1-2 columns on mobile cleanly.',
    'Actual Result': 'Search input functional; layout adapts smoothly to 390px mobile viewport with zero horizontal overflow.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-STAT-015',
    'Feature / Category': '404 Page Not Found',
    'Test Scenario': 'Verify HTTP 404 Status Code & Error Messaging on Invalid URL',
    'Pre-Conditions': 'US Staging /non-existent-page-404-test',
    'Test Steps': '1. Navigate to an arbitrary non-existent URL (/non-existent-page-404-test).\n2. Assert HTTP response status is 404 Not Found.\n3. Verify H2 heading "Page not available." and body copy.',
    'Expected Result': 'Server returns 404 response; user-friendly error message "Page not available." renders within global header and footer.',
    'Actual Result': 'Server returns HTTP 404; H2 "Page not available." renders within global header/footer structure identical to AU baseline.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-STAT-016',
    'Feature / Category': '404 Page Not Found',
    'Test Scenario': 'Verify Document <title> Tag Staging Prefix Sanitization',
    'Pre-Conditions': 'US Staging /non-existent-page-404-test vs AU Baseline',
    'Test Steps': '1. Inspect document.title on US 404 page.\n2. Compare with AU baseline title.',
    'Expected Result': 'Document title is cleanly formatted: "<title>404 Not Found</title>".',
    'Actual Result': 'DEFECT: Title contains internal staging store prefix: "[US] 404 Not Found" (AU baseline is "404 Not Found").',
    'Status': 'FAIL',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-STAT-017',
    'Feature / Category': '404 Page Not Found',
    'Test Scenario': 'Verify Recovery CTAs, Search Bar & Responsive Mobile Layout',
    'Pre-Conditions': 'Desktop 1440px & Mobile 390px Viewports',
    'Test Steps': '1. Check recovery links (Home, Catalog, Contact Us).\n2. Verify search bar presence in header.\n3. Inspect layout in 390px mobile view.',
    'Expected Result': 'Header search bar and navigation links allow user recovery; layout renders without distortion on mobile.',
    'Actual Result': 'Header search and navigation links allow immediate recovery; mobile view renders cleanly (375x1262px).',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-STAT-018',
    'Feature / Category': 'Cross-Page Integrity',
    'Test Scenario': 'Verify URL Path Resolution & Footer Navigation Links',
    'Pre-Conditions': 'US Staging Footer Links',
    'Test Steps': '1. Click all footer static page links (Terms, Privacy, Contact, FAQ).\n2. Check redirection and URL resolution.\n3. Assert zero 404 errors on linked paths.',
    'Expected Result': 'Footer links map correctly: Terms -> /terms-and-conditions-page, Privacy -> /privacy-policy, Contact -> /contact-us, FAQ -> /help-centre.',
    'Actual Result': 'All footer links resolve to 200 OK without broken redirects or dead ends.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  }
];

// Write CSV
function escapeCsv(str) {
  if (!str) return '""';
  return `"${str.replace(/"/g, '""')}"`;
}

const csvHeaders = Object.keys(testCases[0]);
const csvRows = testCases.map(row => csvHeaders.map(h => escapeCsv(row[h])).join(','));
const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
fs.writeFileSync(CSV_PATH, csvContent, 'utf8');
console.log(`Saved CSV test cases: ${CSV_PATH} (${testCases.length} test cases)`);

// Write XLSX
const ws = XLSX.utils.json_to_sheet(testCases);
ws['!cols'] = [
  { wch: 14 }, // Test ID
  { wch: 22 }, // Feature / Category
  { wch: 45 }, // Test Scenario
  { wch: 35 }, // Pre-Conditions
  { wch: 55 }, // Test Steps
  { wch: 50 }, // Expected Result
  { wch: 50 }, // Actual Result
  { wch: 10 }, // Status
  { wch: 14 }  // Severity
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Static Pages QA');
XLSX.writeFile(wb, XLSX_PATH);
console.log(`Saved XLSX test cases: ${XLSX_PATH}`);
