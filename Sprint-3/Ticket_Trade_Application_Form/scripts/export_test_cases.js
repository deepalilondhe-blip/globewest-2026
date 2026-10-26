const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-TRADE-001",
    "Module": "Route & Access",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Trade Application Form Route & Initial Load",
    "Preconditions": "Guest user accessing mcstaging2.globewest.com without active session",
    "Test Steps": "1. Navigate to /gwcustomer/trade/create\n2. Verify HTTP status 200\n3. Verify page title, H1 'Trade application', and subtitle 'Contact Details'",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Page loads cleanly with HTTP 200. Step 1 (1/3) renders with Contact Details form card on left and lifestyle dining imagery on right.",
    "Actual Result (mcstaging2 Live)": "Page loads successfully with HTTP 200. Step 1 renders correctly.",
    "Status": "PASS",
    "Severity": "LOW (Core Route Verified)",
    "Evidence Reference": "screenshots/desktop/01_US_TRADE_CREATE_STEP1_DESKTOP.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-002",
    "Module": "Step 1 Validation",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify US Phone Number Validation & Acceptance (CRITICAL BLOCKER)",
    "Preconditions": "Guest user on Step 1 of /gwcustomer/trade/create",
    "Test Steps": "1. Enter valid contact details (Sarah Jenkins)\n2. Enter valid 10-digit US phone numbers (e.g., 2125550199 / 2125550198)\n3. Click 'NEXT' button",
    "Expected Result (Figma Spec / Frame 3226-21024)": "US storefront must accept valid North American / US telephone numbers formatted as 10 digits (e.g. (212) 555-0199 or 2125550199) and advance to Step 2.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Form rejects US phone numbers with Australian regex error: 'Please enter a valid phone number. Example: 0491 570 157 or +61 491 570 157 (Mobile)'. Blocks US customer onboarding.",
    "Status": "FAIL (Pre-Dev Blocker)",
    "Severity": "CRITICAL",
    "Evidence Reference": "comparison/COMPARISON_03_CRITICAL_US_PHONE_VALIDATION_DEFECT.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-003",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Back Navigation CTA Label Fidelity ('← BACK')",
    "Preconditions": "User advances to Step 2 (2/3) Business Details",
    "Test Steps": "1. Inspect the back navigation control pinned at top left of Step 2 card\n2. Verify text content and arrow icon against Figma node 3226-21024",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Back control must display exactly '← BACK' in uppercase regular font.",
    "Actual Result (mcstaging2 Live)": "Live storefront renders '← GO BACK' with redundant word 'GO'.",
    "Status": "FAIL (Figma Discrepancy)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-004",
    "Module": "Step 2 Localization",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Tax ID Label is 'EIN*' for US Storefront (Node 3226-21364)",
    "Preconditions": "User on Step 2 Business Details on mcstaging2.globewest.com",
    "Test Steps": "1. Inspect field adjacent to BUSINESS NAME\n2. Verify field label and placeholder are 'EIN*' and 'EIN', not AU 'ABN*'",
    "Expected Result (Figma Spec / Frame 3226-21364)": "Field label must be 'EIN*' with placeholder 'EIN' replacing AU 'ABN' per Figma change request.",
    "Actual Result (mcstaging2 Live)": "Label rendered as 'EIN*' and placeholder 'EIN'. Parity successfully achieved.",
    "Status": "PASS",
    "Severity": "LOW (Verified Feature)",
    "Evidence Reference": "screenshots/desktop/02_US_TRADE_STEP2_FILLED_DESKTOP.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-005",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Entity Name Placeholder Text Matches Figma Spec",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect input placeholder for #entity_name\n2. Compare text against Figma artboard 3226-21024",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Placeholder must strictly read: 'Enter entity name if different to the business name'.",
    "Actual Result (mcstaging2 Live)": "Live placeholder contains redundant trailing words: 'Enter entity name if different to the business name entered above'.",
    "Status": "FAIL (Copy Mismatch)",
    "Severity": "LOW",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-006",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Head Office Street Address Mandatory State (* Asterisk)",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect label for 'HEAD OFFICE STREET ADDRESS'\n2. Verify presence or absence of mandatory asterisk (*)",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Figma design explicitly specifies 'HEAD OFFICE STREET ADDRESS' WITHOUT mandatory asterisk (*).",
    "Actual Result (mcstaging2 Live)": "Live storefront renders 'HEAD OFFICE STREET ADDRESS*' WITH mandatory asterisk (*).",
    "Status": "FAIL (Spec Discrepancy)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-007",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify State Dropdown Default Placeholder Text ('State ⌵')",
    "Preconditions": "User on Step 2 Business Details with empty form",
    "Test Steps": "1. Inspect default unselected state of the State dropdown\n2. Verify placeholder text and chevron down indicator",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Dropdown must display placeholder 'State ⌵'.",
    "Actual Result (mcstaging2 Live)": "Live dropdown displays default Magento text 'Please select ⌵'.",
    "Status": "FAIL (Figma Discrepancy)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-008",
    "Module": "Step 2 Localization",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify State Dropdown Contains All 50 US States and Territories",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Expand State dropdown (#state)\n2. Inspect available state options",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Dropdown must list US states (AL, AK, AZ, CA, NY, etc.) and territories.",
    "Actual Result (mcstaging2 Live)": "All 65 US states, armed forces, and territories are populated correctly.",
    "Status": "PASS",
    "Severity": "LOW (Verified Feature)",
    "Evidence Reference": "screenshots/desktop/02_US_TRADE_STEP2_FILLED_DESKTOP.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-009",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Number of Employees Placeholder Text ('eg. 1')",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect placeholder for #number_of_employees\n2. Compare against Figma artboard 3226-21024",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Placeholder must display sample value 'eg. 1'.",
    "Actual Result (mcstaging2 Live)": "Live storefront renders literal label repeat: 'Number of employees'.",
    "Status": "FAIL (Figma Discrepancy)",
    "Severity": "LOW",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-010",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Average Yearly Spend Asterisk Presence (*)",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect section header for furniture yearly spend\n2. Check for presence of mandatory asterisk",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Figma design specifies 'WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?' WITHOUT asterisk (*).",
    "Actual Result (mcstaging2 Live)": "Live storefront displays 'WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?*' WITH asterisk (*).",
    "Status": "FAIL (Spec Discrepancy)",
    "Severity": "LOW",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-011",
    "Module": "Step 2 Figma Parity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify 'Already have an account? Sign In' Casing and Link",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Inspect footer text below the NEXT button\n2. Check exact character casing and hyperlink destination",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Text must read: 'Already have an account? Sign In' ('account' lowercase, 'Sign In' title case).",
    "Actual Result (mcstaging2 Live)": "Live storefront displays: 'Already have an Account? Sign in' ('Account' title case, 'Sign in' sentence case).",
    "Status": "FAIL (Copy Mismatch)",
    "Severity": "LOW",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-012",
    "Module": "Mobile Responsiveness",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Mobile 390px Viewport Single-Column Form Stacking",
    "Preconditions": "Mobile viewport 390x844 on /gwcustomer/trade/create",
    "Test Steps": "1. Navigate to Step 2 on mobile viewport\n2. Inspect layout of Business Name, EIN, City, State, Zipcode\n3. Verify horizontal scrolling does not occur",
    "Expected Result (Figma Spec / Frame 3226-21130)": "All form rows stack into a clean, vertical single-column layout without overflow or clipped controls.",
    "Actual Result (mcstaging2 Live)": "Form stacks cleanly into single-column mobile presentation.",
    "Status": "PASS",
    "Severity": "LOW (Verified Responsive)",
    "Evidence Reference": "screenshots/mobile/02_US_TRADE_STEP2_FILLED_MOBILE.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-013",
    "Module": "Storefront Header",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Wishlist Heart Icon Presence in Header Utility Bar",
    "Preconditions": "Desktop viewport 1440x900 on Trade Application Form",
    "Test Steps": "1. Inspect top right utility section of main header\n2. Verify presence of Wishlist Heart icon (🤍) adjacent to Cart",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Header must display Wishlist Heart icon (🤍) between Login dropdown and Cart.",
    "Actual Result (mcstaging2 Live)": "Wishlist Heart icon is completely missing from live header.",
    "Status": "FAIL (Missing UI Element)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_01_DESKTOP_FIGMA_VS_LIVE_STEP2.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-014",
    "Module": "Storefront Navigation",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify US Navigation Menu Spelling Parity (No AU 'Customisation')",
    "Preconditions": "Desktop viewport 1440x900 on US Staging",
    "Test Steps": "1. Inspect primary navigation bar links\n2. Check spelling of 'Customisation' vs US English 'Customization'",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Navigation links must match Figma: Indoor, Outdoor, Homewares, In Stock, Projects, Inspiration, Support, Contact.",
    "Actual Result (mcstaging2 Live)": "Navigation includes AU/UK spelling 'Customisation'.",
    "Status": "FAIL (Localization Leak)",
    "Severity": "MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_04_STOREFRONT_LEAKAGES_NAV_FOOTER.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-015",
    "Module": "Storefront Footer",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Absence of AU 'Australian Owned & Run' Badge on US Footer",
    "Preconditions": "US Staging storefront footer inspection",
    "Test Steps": "1. Scroll to global footer on mcstaging2.globewest.com\n2. Inspect showroom / brand badges on left footer column",
    "Expected Result (US Localization Standard)": "US storefront must NOT display AU proprietary badge 'AUSTRALIAN OWNED & RUN' or AU-only links like 'Shop Outlet'.",
    "Actual Result (mcstaging2 Live)": "CRITICAL LEAK: 'AUSTRALIAN OWNED & RUN' badge and 'Shop Outlet' link are rendered on live US staging footer.",
    "Status": "FAIL (Localization Leak)",
    "Severity": "HIGH",
    "Evidence Reference": "comparison/COMPARISON_04_STOREFRONT_LEAKAGES_NAV_FOOTER.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-016",
    "Module": "Step 3 Workflow",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Step 3 (Additional Information) Form Progression & Controls",
    "Preconditions": "User completes Step 2 with valid business information",
    "Test Steps": "1. Click NEXT on Step 2\n2. Verify transition to Step 3 (3/3)\n3. Verify Website, Instagram, and Terms checkbox render",
    "Expected Result (Figma Spec / Confluence Functional Scope)": "Step 3 loads cleanly. Renders Website URL, Instagram Profile, How Did You Hear dropdown, Terms & Conditions checkbox, and SUBMIT button.",
    "Actual Result (mcstaging2 Live)": "Step 3 loads successfully and accepts dummy inputs.",
    "Status": "PASS",
    "Severity": "LOW (Verified Progression)",
    "Evidence Reference": "screenshots/desktop/03_US_TRADE_STEP3_FILLED_DESKTOP.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-017",
    "Module": "Form Data Integrity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Radio Group Exclusive Selection (Commercial Projects & Spend)",
    "Preconditions": "User on Step 2 Business Details",
    "Test Steps": "1. Click 'Yes' radio for Commercial Projects, then click 'No'\n2. Click 'Under 10k', then '10k-30k', then '30k +'\n3. Verify only one radio button remains selected per group",
    "Expected Result (Figma Spec / Frame 3226-21024)": "Radio button groups must operate mutually exclusively without double selection.",
    "Actual Result (mcstaging2 Live)": "Radio groups operate mutually exclusively as expected.",
    "Status": "PASS",
    "Severity": "LOW (Functional Parity)",
    "Evidence Reference": "screenshots/desktop/02_US_TRADE_STEP2_FILLED_DESKTOP.png"
  },
  {
    "Test Case ID": "TC-GW-TRADE-018",
    "Module": "Step 1 Copy",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Step 1 Intro Copy Localization ('authorized' vs 'authorised')",
    "Preconditions": "User on Step 1 Contact Details",
    "Test Steps": "1. Read introductory paragraph below 'Trade application' heading\n2. Inspect spelling of 'authorised design professional'",
    "Expected Result (US Localization Standard)": "US English spelling 'authorized design professional' must be used on US storefront.",
    "Actual Result (mcstaging2 Live)": "Text uses British/AU spelling: 'authorised design professional'.",
    "Status": "FAIL (Localization Copy)",
    "Severity": "LOW",
    "Evidence Reference": "screenshots/desktop/01_US_TRADE_CREATE_STEP1_DESKTOP.png"
  }
];

function exportXLSX() {
  const ws = XLSX.utils.json_to_sheet(testCases);

  // Set column widths
  ws['!cols'] = [
    { wch: 18 }, // Test Case ID
    { wch: 22 }, // Module
    { wch: 25 }, // Auth Matrix
    { wch: 38 }, // Test Scenario / Title
    { wch: 35 }, // Preconditions
    { wch: 45 }, // Test Steps
    { wch: 45 }, // Expected Result
    { wch: 45 }, // Actual Result
    { wch: 24 }, // Status
    { wch: 22 }, // Severity
    { wch: 45 }  // Evidence Reference
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Trade Application QA");

  const xlsxPath = path.join(BASE_DIR, 'Trade_Application_Form_Test_Cases.xlsx');
  XLSX.writeFile(wb, xlsxPath);
  console.log(`✅ Generated Excel Test Cases: ${xlsxPath}`);

  // CSV
  const csvContent = XLSX.utils.sheet_to_csv(ws);
  const csvPath = path.join(BASE_DIR, 'Trade_Application_Form_Test_Cases.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf8');
  console.log(`✅ Generated CSV Test Cases: ${csvPath}`);
}

exportXLSX();
