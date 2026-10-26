const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test ID": "TC-GW-TRADE-01",
    "Module": "Route & Access",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Trade Application Form Page Loads Successfully with HTTP 200",
    "Preconditions": "Unauthenticated guest browsing session on US Staging",
    "Test Steps": "1. Navigate to https://mcstaging2.globewest.com/gwcustomer/trade/create\n2. Verify HTTP response code 200\n3. Verify page title contains 'Trade application - Step 1'\n4. Verify left form card and right lifestyle hero image load cleanly",
    "Expected Result (Spec)": "Page loads cleanly with HTTP 200. Displays Step 1 'Contact Details' form on the left and full-height lifestyle dining photography on the right.",
    "Actual Result (mcstaging2 Live)": "Page loads with HTTP 200. Left form and right hero image render correctly.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 3 Dual-Auth"
  },
  {
    "Test ID": "TC-GW-TRADE-02",
    "Module": "Dual-Auth Matrix",
    "Auth Matrix": "Trade Customer (Logged In)",
    "Test Scenario / Title": "Verify Authenticated Customer Behavior when Accessing Trade Application",
    "Preconditions": "User logged in with active US Trade account (deepali.londhe@overdose.digital)",
    "Test Steps": "1. Log in with US trade account credentials\n2. Attempt direct navigation to /gwcustomer/trade/create\n3. Observe redirection and alert messaging",
    "Expected Result (Spec)": "Authenticated user is redirected to Customer Account Dashboard (/customer/account/) or displayed notice indicating trade membership is already active.",
    "Actual Result (mcstaging2 Live)": "Logged-in user is redirected to Account Dashboard with active session.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 3 Dual-Auth"
  },
  {
    "Test ID": "TC-GW-TRADE-03",
    "Module": "Step 1 Validation",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Acceptance of Standard US 10-Digit Phone Numbers (CRITICAL BLOCKER)",
    "Preconditions": "Guest user on Step 1 Contact Details",
    "Test Steps": "1. Fill Title (Ms), First Name (Sarah), Last Name (Jenkins), Email (sarah@example.com)\n2. Enter valid 10-digit US phone numbers: Mobile '2125550199' and Phone '2125550198'\n3. Click 'NEXT' button",
    "Expected Result (Spec)": "US storefront must accept valid North American 10-digit telephone numbers without throwing region mismatch errors and advance to Step 2.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Form rejects US phone numbers with Australian regex error: 'Please enter a valid phone number. Example: 0491 570 157 or +61 491 570 157 (Mobile)'. Blocks US customer onboarding.",
    "Status": "FAIL (Pre-Dev Blocker)",
    "Severity": "P0 - Blocker",
    "Compliance": "AGENTS.md Rule 1 Spec Integrity"
  },
  {
    "Test ID": "TC-GW-TRADE-04",
    "Module": "Step 1 Validation",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Mandatory Field Validations on Step 1 (Contact Details)",
    "Preconditions": "Guest user on Step 1 with all fields empty",
    "Test Steps": "1. Leave all fields empty\n2. Click 'NEXT' button\n3. Inspect rendered inline error messages",
    "Expected Result (Spec)": "Mandatory fields (Title, First Name, Last Name, Email, Mobile) trigger inline red error messages: 'This is a required field.' Form does not submit.",
    "Actual Result (mcstaging2 Live)": "Inline validation messages trigger correctly for mandatory fields.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Form Validation Standards"
  },
  {
    "Test ID": "TC-GW-TRADE-05",
    "Module": "Step 1 Copy Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify US English Spelling Localization in Intro Copy ('authorized')",
    "Preconditions": "User on Step 1 Contact Details",
    "Test Steps": "1. Read introductory paragraph below 'Trade application' heading\n2. Inspect spelling of 'authorized design professional'",
    "Expected Result (Spec)": "Introductory copy must use US English spelling: 'To become a GlobeWest stockist or authorized design professional...'",
    "Actual Result (mcstaging2 Live)": "Displays British/AU spelling: '...authorised design professional...' (misspelled with 's').",
    "Status": "FAIL (Copy Mismatch)",
    "Severity": "P3 - Low",
    "Compliance": "AGENTS.md Rule 4 Asset Integrity"
  },
  {
    "Test ID": "TC-GW-TRADE-06",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Back Navigation Button Exact Label ('← BACK')",
    "Preconditions": "User advances to Step 2 Business Details",
    "Test Steps": "1. Inspect back navigation control at top left of Step 2\n2. Compare text against Figma Node 3226-21024",
    "Expected Result (Spec)": "Back control must strictly read '← BACK' in uppercase regular typography.",
    "Actual Result (mcstaging2 Live)": "Live storefront displays '← GO BACK' with redundant extra word 'GO'.",
    "Status": "FAIL (Figma Discrepancy)",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-07",
    "Module": "Step 2 Tax ID Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Tax ID Label is 'EIN*' for US Storefront (Node 3226-21364)",
    "Preconditions": "User on Step 2 Business Details on mcstaging2.globewest.com",
    "Test Steps": "1. Locate tax identifier field adjacent to Business Name\n2. Inspect label, mandatory asterisk, and placeholder",
    "Expected Result (Spec)": "Field label must be 'EIN*' with placeholder 'EIN' (replacing Australian 'ABN*' per US design change request).",
    "Actual Result (mcstaging2 Live)": "Label rendered as 'EIN*' with placeholder 'EIN'. Parity successfully achieved.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 1 Spec Integrity"
  },
  {
    "Test ID": "TC-GW-TRADE-08",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Entity Name Placeholder Text Phrasing",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect input placeholder for #entity_name\n2. Compare against Figma Artboard Node 3226-21024",
    "Expected Result (Spec)": "Placeholder must read exactly: 'Enter entity name if different to the business name'.",
    "Actual Result (mcstaging2 Live)": "Displays redundant trailing words: 'Enter entity name if different to the business name entered above'.",
    "Status": "FAIL (Copy Mismatch)",
    "Severity": "P3 - Low",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-09",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Head Office Street Address Mandatory Status (* Asterisk)",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect label for 'HEAD OFFICE STREET ADDRESS'\n2. Check for presence of mandatory asterisk (*)",
    "Expected Result (Spec)": "Figma design explicitly specifies 'HEAD OFFICE STREET ADDRESS' WITHOUT mandatory asterisk (*).",
    "Actual Result (mcstaging2 Live)": "Live storefront renders 'HEAD OFFICE STREET ADDRESS*' WITH mandatory asterisk (*).",
    "Status": "FAIL (Spec Discrepancy)",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-10",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify State Dropdown Default Placeholder Text ('State ⌵')",
    "Preconditions": "User on Step 2 Business Details with unselected State",
    "Test Steps": "1. Inspect initial unselected state of the State dropdown\n2. Check placeholder text and chevron indicator",
    "Expected Result (Spec)": "Dropdown must display default text 'State ⌵'.",
    "Actual Result (mcstaging2 Live)": "Displays uncustomized Magento default text: 'Please select ⌵'.",
    "Status": "FAIL (Figma Discrepancy)",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-11",
    "Module": "Step 2 Localization",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify State Dropdown Contains All 50 US States and Territories",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Expand #state dropdown\n2. Inspect available options for Alabama, California, New York, Texas, etc.",
    "Expected Result (Spec)": "Dropdown must list all 50 US states, District of Columbia, Armed Forces regions, and US territories.",
    "Actual Result (mcstaging2 Live)": "All 65 US states, armed forces, and territories are populated correctly.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "US Localization Matrix"
  },
  {
    "Test ID": "TC-GW-TRADE-12",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Number of Employees Field Placeholder ('eg. 1')",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect placeholder attribute of #number_of_employees\n2. Compare against Figma Artboard Node 3226-21024",
    "Expected Result (Spec)": "Placeholder must display sample helper value 'eg. 1'.",
    "Actual Result (mcstaging2 Live)": "Live input redundantly repeats label text: 'Number of employees'.",
    "Status": "FAIL (Figma Discrepancy)",
    "Severity": "P3 - Low",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-13",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Commercial Projects Radio Buttons Functionality",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Click 'Yes' radio option for 'DO YOU WORK ON COMMERCIAL PROJECTS?'\n2. Click 'No' radio option\n3. Verify radio toggles mutually exclusively without multi-selection",
    "Expected Result (Spec)": "Radio buttons must operate mutually exclusively. Only one option selected at any time.",
    "Actual Result (mcstaging2 Live)": "Radio buttons operate mutually exclusively as expected.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 1 Functional Parity"
  },
  {
    "Test ID": "TC-GW-TRADE-14",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Average Yearly Spend Asterisk Presence (*)",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect heading for furniture yearly spend\n2. Check for presence of mandatory asterisk",
    "Expected Result (Spec)": "Figma design specifies 'WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?' WITHOUT asterisk (*).",
    "Actual Result (mcstaging2 Live)": "Live storefront renders 'WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?*' WITH asterisk (*).",
    "Status": "FAIL (Spec Discrepancy)",
    "Severity": "P3 - Low",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-15",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Average Yearly Spend Option Tiers Match Figma",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect radio options under Yearly Spend\n2. Verify tiers: Under 10k, 10k - 30k, 30k +",
    "Expected Result (Spec)": "Render 3 radio options: 'Under 10k', '10k - 30k', '30k +'.",
    "Actual Result (mcstaging2 Live)": "All 3 tiers render and toggle cleanly.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 1 Spec Integrity"
  },
  {
    "Test ID": "TC-GW-TRADE-16",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify 'Already have an account? Sign In' Casing and Link Target",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect hyperlink text below the NEXT button\n2. Verify capitalization of 'account' and 'Sign In'\n3. Verify link points to /customer/account/login/",
    "Expected Result (Spec)": "Text must read: 'Already have an account? Sign In' ('account' lowercase, 'Sign In' capitalized). Points to login route.",
    "Actual Result (mcstaging2 Live)": "Displays: 'Already have an Account? Sign in' ('Account' capitalized, 'Sign in' lowercase 'i').",
    "Status": "FAIL (Copy Mismatch)",
    "Severity": "P3 - Low",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-17",
    "Module": "Step 2 Navigation",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Back Navigation Returns to Step 1 with Retained Contact Data",
    "Preconditions": "User on Step 2 with Step 1 previously filled",
    "Test Steps": "1. Click '← GO BACK' on Step 2\n2. Verify page transitions back to Step 1 (1/3)\n3. Verify previously entered name, email, and phone numbers remain preserved in fields",
    "Expected Result (Spec)": "Form animates back to Step 1. All previously entered form inputs remain intact without data loss.",
    "Actual Result (mcstaging2 Live)": "Returns cleanly to Step 1 with all field values preserved.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Form State Persistence"
  },
  {
    "Test ID": "TC-GW-TRADE-18",
    "Module": "Step 3 Workflow",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Step 3 (Additional Information) Form Progression & Fields",
    "Preconditions": "User fills Step 2 with valid business data and clicks NEXT",
    "Test Steps": "1. Click NEXT on Step 2\n2. Verify transition to Step 3 (3/3)\n3. Verify presence of Website Address, Instagram Profile, How Did You Hear dropdown, Terms checkbox, and SUBMIT button",
    "Expected Result (Spec)": "Form transitions to Step 3 (3/3). All additional fields render cleanly with solid dark brown SUBMIT button.",
    "Actual Result (mcstaging2 Live)": "Step 3 renders cleanly with all expected fields.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 2 DOM Structure"
  },
  {
    "Test ID": "TC-GW-TRADE-19",
    "Module": "Step 3 Validation",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Terms & Conditions Checkbox Mandatory Enforcement on Step 3",
    "Preconditions": "User on Step 3 Additional Information",
    "Test Steps": "1. Leave 'Yes, I agree to the Terms & Conditions' checkbox unchecked\n2. Click 'SUBMIT' button\n3. Inspect validation response",
    "Expected Result (Spec)": "Submission is blocked. Red validation error displays: 'This is a required field.' Form does not send.",
    "Actual Result (mcstaging2 Live)": "Validation error correctly blocks submission until checkbox is ticked.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Legal & Compliance Validation"
  },
  {
    "Test ID": "TC-GW-TRADE-20",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Mobile 390px Viewport Single-Column Form Stacking",
    "Preconditions": "Mobile viewport 390x844 on /gwcustomer/trade/create",
    "Test Steps": "1. Open mobile viewport\n2. Inspect layout of Business Name, EIN, City, State, Zipcode\n3. Verify horizontal scrolling does not occur and inputs are 100% full-width",
    "Expected Result (Spec)": "All multi-column rows collapse into a vertical single-column stack. Inputs have 100% container width with no horizontal overflow.",
    "Actual Result (mcstaging2 Live)": "Mobile layout stacks cleanly into single column without clipping.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  },
  {
    "Test ID": "TC-GW-TRADE-21",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Mobile CTA Touch Targets (Minimum 44px Height)",
    "Preconditions": "Mobile viewport 390x844",
    "Test Steps": "1. Inspect computed styles of NEXT button and form input fields on mobile\n2. Assert computed height >= 44px per WCAG / mobile touch standards",
    "Expected Result (Spec)": "Buttons and interactive inputs must meet minimum 44px touch target height for comfortable touch accessibility.",
    "Actual Result (mcstaging2 Live)": "NEXT button height is 52px; input fields are 48px. Meets touch target standards.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "WCAG Mobile Touch Target"
  },
  {
    "Test ID": "TC-GW-TRADE-22",
    "Module": "Navigation Parity",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify US Navigation Menu Spelling Parity (No AU 'Customisation')",
    "Preconditions": "Desktop viewport 1440x900 on US Staging",
    "Test Steps": "1. Inspect header navigation links\n2. Assert spelling of Customization / Projects against US Figma spec",
    "Expected Result (Spec)": "Navigation links must match Figma: Indoor, Outdoor, Homewares, In Stock, Projects, Inspiration, Support, Contact.",
    "Actual Result (mcstaging2 Live)": "Navigation includes AU/UK spelling 'Customisation' (with 's').",
    "Status": "FAIL (Localization Leak)",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 4 Asset Integrity"
  },
  {
    "Test ID": "TC-GW-TRADE-23",
    "Module": "Footer Localization",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Absence of AU 'Australian Owned & Run' Badge on US Footer",
    "Preconditions": "Scroll to global footer on mcstaging2.globewest.com",
    "Test Steps": "1. Inspect footer showroom column and brand badges\n2. Check for Australian regional logo and 'Shop Outlet' link",
    "Expected Result (Spec)": "US storefront must NOT render proprietary Australian map badge 'AUSTRALIAN OWNED & RUN' or AU-only links like 'Shop Outlet'.",
    "Actual Result (mcstaging2 Live)": "CRITICAL LEAK: 'AUSTRALIAN OWNED & RUN' badge and 'Shop Outlet' link are rendered on live US staging footer.",
    "Status": "FAIL (Localization Leak)",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 4 Asset Integrity"
  },
  {
    "Test ID": "TC-GW-TRADE-24",
    "Module": "Missing UI Element",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Breadcrumb Navigation Presence Above Form Card",
    "Preconditions": "Desktop viewport on /gwcustomer/trade/create",
    "Test Steps": "1. Inspect space between header and step indicator (← BACK 2/3)\n2. Check for presence of breadcrumb hierarchy trail",
    "Expected Result (Spec)": "Displays 'Breadcrumb > Breadcrumb' navigation trail above the form card.",
    "Actual Result (mcstaging2 Live)": "Breadcrumbs are completely missing on live form.",
    "Status": "FAIL (Missing UI Element)",
    "Severity": "P3 - Low",
    "Compliance": "AGENTS.md Rule 2 DOM Structure"
  },
  {
    "Test ID": "TC-GW-TRADE-25",
    "Module": "Typography & Branding",
    "Auth Matrix": "Guest (Logged Out)",
    "Test Scenario / Title": "Verify Heading Typography & Luxury Styling Fidelity",
    "Preconditions": "Desktop viewport on Step 2 Business Details",
    "Test Steps": "1. Inspect computed styles for 'Business Details' heading\n2. Verify font-family (IvyMode / serif), font-weight, and color styling against Figma spec",
    "Expected Result (Spec)": "Heading rendered with luxury serif typography, regular weight, dark charcoal color (#2B1D16).",
    "Actual Result (mcstaging2 Live)": "Rendered with branded serif typography and matching color tone.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "AGENTS.md Rule 1 Micro-UI"
  }
];

function exportTestCases() {
  const ws = XLSX.utils.json_to_sheet(testCases);

  ws['!cols'] = [
    { wch: 18 }, // Test ID
    { wch: 22 }, // Module
    { wch: 25 }, // Auth Matrix
    { wch: 42 }, // Test Scenario / Title
    { wch: 35 }, // Preconditions
    { wch: 45 }, // Test Steps
    { wch: 45 }, // Expected Result
    { wch: 45 }, // Actual Result
    { wch: 24 }, // Status
    { wch: 15 }, // Severity
    { wch: 30 }  // Compliance
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Trade Application Test Cases");

  const xlsxPath = path.join(BASE_DIR, 'Trade_Application_Form_Test_Cases.xlsx');
  XLSX.writeFile(wb, xlsxPath);
  console.log(`✅ Generated Comprehensive Excel Test Cases (25 Cases): ${xlsxPath}`);

  const csvContent = XLSX.utils.sheet_to_csv(ws);
  const csvPath = path.join(BASE_DIR, 'Trade_Application_Form_Test_Cases.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✅ Generated Comprehensive CSV Test Cases (25 Cases): ${csvPath}`);
}

exportTestCases();
