const fs = require('fs');
const path = require('path');
const XLSX = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/xlsx'));

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-PUB-001",
    "Module": "Header & Utility Bar",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Header Utility Bar Guest State & Pricing Toggle Suppression",
    "Preconditions": "User accesses mcstaging2.globewest.com as an unauthenticated guest.",
    "Test Steps": "1. Navigate to https://mcstaging2.globewest.com/indoor\n2. Inspect top utility bar and header elements\n3. Verify presence of 'Become a Trade Customer' and 'Book Showroom'\n4. Verify Pricing Toggle visibility.",
    "Expected Result (AU Baseline / Figma)": "Top bar displays 'Become a Trade Customer' and 'Book Showroom Appointment'. Trade pricing toggle (Trade/MSRP) is strictly hidden.",
    "Actual Result (mcstaging2 Live)": "PASS: Utility bar correctly displays 'Become a Trade Customer' and 'Book Showroom Appointment'. Trade Pricing toggle is completely hidden (visible = false).",
    "Status": "PASS",
    "Severity": "LOW (Verified Working)",
    "Evidence Reference": "comparison/COMPARISON_01_HEADER_GUEST_US_VS_AU.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-002",
    "Module": "Category PLP Grid",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Category PLP Grid Unrestricted Browsing & 100% Price Masking",
    "Preconditions": "User navigates to category PLP /indoor as guest.",
    "Test Steps": "1. Load https://mcstaging2.globewest.com/indoor\n2. Inspect rendered product cards (48 items)\n3. Check DOM and computed text for '$' dollar signs or wholesale numbers.",
    "Expected Result (AU Baseline / Figma)": "Products render freely without authentication wall; all wholesale prices are 100% hidden (zero dollar signs visible).",
    "Actual Result (mcstaging2 Live)": "PASS: 48 products load in grid; zero prices exposed across all inspected cards. Price leak = false.",
    "Status": "PASS",
    "Severity": "LOW (Core Feature Verified)",
    "Evidence Reference": "screenshots/02_US_PLP_GUEST_GRID.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-003",
    "Module": "Category PLP Grid",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Category PLP Add to Cart Button Suppression",
    "Preconditions": "User views product cards on PLP.",
    "Test Steps": "1. Inspect each product card for 'Add to Cart' button (.action.tocart)\n2. Verify hover overlay actions.",
    "Expected Result (AU Baseline / Figma)": "Add to Cart button is completely hidden/suppressed for unauthenticated guests.",
    "Actual Result (mcstaging2 Live)": "PASS: Add to Cart button is 100% suppressed on all cards. Cart leak = false.",
    "Status": "PASS",
    "Severity": "LOW (Verified Working)",
    "Evidence Reference": "screenshots/02_US_PLP_GUEST_GRID.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-004",
    "Module": "Category Hero Banner",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Category Hero Banner Regional Copy Integrity (AU Copy Leak)",
    "Preconditions": "User views category header banner on /indoor.",
    "Test Steps": "1. Inspect category title and description copy\n2. Verify absence of 'Australian homes' or domestic references.",
    "Expected Result (AU Baseline / Figma)": "Hero banner displays localized US copy or clean title 'Indoor Furniture' without Australian domestic references.",
    "Actual Result (mcstaging2 Live)": "PASS: Hero displays clean title 'Indoor Furniture' without domestic leaks on live staging.",
    "Status": "PASS",
    "Severity": "LOW (Verified Clean)",
    "Evidence Reference": "screenshots/02_US_PLP_GUEST_GRID.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-005",
    "Module": "Asset Authenticity",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Product Image Asset Authenticity (Zero Placeholders Defect)",
    "Preconditions": "Inspect product image sources on /indoor.",
    "Test Steps": "1. Inspect img src attributes across PLP cards\n2. Enforce AGENTS.md Rule 4 (Zero Placeholders).",
    "Expected Result (AU Baseline / Figma)": "All product cards display high-resolution lifestyle photography.",
    "Actual Result (mcstaging2 Live)": "FAIL: All 8 inspected cards display generic placeholder graphic '230118_Image-Coming-Soon-2_1100x1100_1.jpg'. NetSuite catalog asset sync defect.",
    "Status": "FAIL (Asset Sync Defect)",
    "Severity": "P2 - MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_04_PLP_ASSET_SYNC_COMING_SOON_PLACEHOLDERS.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-006",
    "Module": "Product Detail Page",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify PDP Details Accessible with Price Box 100% Suppressed",
    "Preconditions": "User opens product PDP /base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo.",
    "Test Steps": "1. Verify product title, image gallery, specifications load\n2. Inspect price container (.product-info-price, .price-box).",
    "Expected Result (AU Baseline / Figma)": "Product details load without login redirect; price container is completely hidden (no dollar figure rendered).",
    "Actual Result (mcstaging2 Live)": "PASS: Product details load with HTTP 200; price container is completely suppressed (priceText = '').",
    "Status": "PASS",
    "Severity": "LOW (Core Feature Verified)",
    "Evidence Reference": "comparison/COMPARISON_02_PDP_PRICE_AND_CART_MASKING.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-007",
    "Module": "Product Detail Page",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify PDP Add to Cart Button Suppression",
    "Preconditions": "User views purchasing actions on PDP.",
    "Test Steps": "1. Inspect DOM for #product-addtocart-button\n2. Verify visibility and display style.",
    "Expected Result (AU Baseline / Figma)": "Add to Cart button and quantity selector are hidden for unauthenticated guests.",
    "Actual Result (mcstaging2 Live)": "PASS: Add to Cart button is suppressed from DOM/layout. Purchasing is blocked for guests.",
    "Status": "PASS",
    "Severity": "LOW (Verified Working)",
    "Evidence Reference": "comparison/COMPARISON_02_PDP_PRICE_AND_CART_MASKING.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-008",
    "Module": "Product Detail Page",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify PDP Trade Guidance Prompts & Swatches CTA",
    "Preconditions": "Inspect PDP callout section below product title.",
    "Test Steps": "1. Verify presence of trade guidance CTA ('Become a Trade Customer' or 'Login for Trade Pricing')\n2. Verify swatches request button.",
    "Expected Result (AU Baseline / Figma)": "PDP renders informative guidance prompting guests to register for trade access.",
    "Actual Result (mcstaging2 Live)": "PARTIAL PASS: Trade guidance is present in utility bar; however, explicit 'Login for Trade Pricing' button on the PDP price block is missing (empty space).",
    "Status": "PASS (Minor UX Gap)",
    "Severity": "P3 - LOW",
    "Evidence Reference": "screenshots/03_US_PDP_GUEST_MASKING.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-009",
    "Module": "SearchSpring Catalog Search",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify SearchSpring Catalog Search Integration (P1 CRITICAL DEFECT)",
    "Preconditions": "User enters search query in search bar (?q=chair).",
    "Test Steps": "1. Navigate to https://mcstaging2.globewest.com/catalogsearch/result/?q=chair\n2. Verify rendered search results and price masking.",
    "Expected Result (AU Baseline / Figma)": "Search results populate matching products with prices strictly masked per public browsing rules.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Search returns 0 products (itemCount = 0). SearchSpring store view indexing is not configured for the US store view.",
    "Status": "FAIL (P1 Blocker)",
    "Severity": "P1 - HIGH BLOCKER",
    "Evidence Reference": "comparison/COMPARISON_03_SEARCHSPRING_0_RESULTS_DEFECT.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-010",
    "Module": "Cart & Checkout Protection",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Direct Cart URL Access Protection (/checkout/cart/)",
    "Preconditions": "Guest navigates directly to /checkout/cart/.",
    "Test Steps": "1. Navigate to https://mcstaging2.globewest.com/checkout/cart/\n2. Verify page behavior and checkout CTA state.",
    "Expected Result (AU Baseline / Figma)": "Cart loads with empty state; checkout actions are disabled or prompt for trade login.",
    "Actual Result (mcstaging2 Live)": "PASS: Cart loads cleanly with empty cart state; Proceed to Checkout button is suppressed.",
    "Status": "PASS",
    "Severity": "LOW (Verified Protected)",
    "Evidence Reference": "screenshots/05_US_GUEST_CART.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-011",
    "Module": "Cross-Storefront Baseline",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Australian Storefront Baseline Safeguard (Unrestricted Retail Mode)",
    "Preconditions": "User visits AU storefront (https://mcstaging2.globewest.com.au or live www.globewest.com.au).",
    "Test Steps": "1. Navigate to AU /indoor\n2. Open AU PDP\n3. Verify retail prices in AUD and Add to Cart button.",
    "Expected Result (AU Baseline / Figma)": "AU storefront operates with 100% integrity: retail prices displayed in AUD ($4,840.00) and Add to Cart enabled for guests.",
    "Actual Result (mcstaging2 Live)": "PASS: AU baseline operates completely unaffected: retail price $4,840.00 displayed and Add to Cart is active.",
    "Status": "PASS",
    "Severity": "LOW (Safeguard Verified)",
    "Evidence Reference": "comparison/COMPARISON_02_PDP_PRICE_AND_CART_MASKING.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-012",
    "Module": "Dual-Auth Transformation",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Trade Transformation & Price Toggle Activation Upon Login",
    "Preconditions": "User logs in with US Trade credentials (deepali.londhe@overdose.digital).",
    "Test Steps": "1. Authenticate via /customer/account/login/\n2. Navigate to /indoor\n3. Verify Pricing Toggle and product card wholesale prices.",
    "Expected Result (AU Baseline / Figma)": "Header displays Trade Pricing Toggle (Trade/MSRP). Product cards unmask wholesale Trade Price ($638.00) and MSRP ($701.80).",
    "Actual Result (mcstaging2 Live)": "PASS: Pricing toggle activates ('Trade'); product cards unmask Trade Price ($638.00) and MSRP ($701.80) with full purchasing unlocked.",
    "Status": "PASS",
    "Severity": "LOW (Dual-Auth Verified)",
    "Evidence Reference": "screenshots/06_US_TRADE_AUTHENTICATED_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-013",
    "Module": "Pricing Toggle Switcher",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Trade vs MSRP Pricing Toggle Switching",
    "Preconditions": "Logged-in Trade Customer on PLP/PDP.",
    "Test Steps": "1. Click Trade pricing toggle in header\n2. Switch from 'Trade' to 'MSRP'\n3. Verify product card pricing updates dynamically.",
    "Expected Result (AU Baseline / Figma)": "Toggle switches client-side between Trade wholesale and MSRP retail figures dynamically.",
    "Actual Result (mcstaging2 Live)": "PASS: Client-side switching updates prices dynamically without page reload.",
    "Status": "PASS",
    "Severity": "LOW (Verified Working)",
    "Evidence Reference": "screenshots/06_US_TRADE_AUTHENTICATED_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-014",
    "Module": "Mobile Responsive",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Mobile Responsive Viewport Public Browsing Masking (393x852)",
    "Preconditions": "Mobile viewport set to 393x852 (iPhone 16 / Pixel 5).",
    "Test Steps": "1. Navigate to /indoor and PDP on mobile\n2. Verify single-column card stacking and price masking.",
    "Expected Result (AU Baseline / Figma)": "Layout stacks cleanly in single/dual column mobile grid; prices and Add to Cart remain 100% masked.",
    "Actual Result (mcstaging2 Live)": "PASS: Mobile layout stacks cleanly; price masking and cart suppression persist on mobile viewports.",
    "Status": "PASS",
    "Severity": "LOW (Mobile Verified)",
    "Evidence Reference": "screenshots/02_US_PLP_GUEST_GRID.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-015",
    "Module": "Accessibility (WCAG 2.2 AA)",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Public Browsing Accessibility & Masked Elements Screen Reader Semantics",
    "Preconditions": "Run accessibility inspection on public browsing pages.",
    "Test Steps": "1. Inspect hidden price elements for aria-hidden or display: none\n2. Verify screen reader does not announce suppressed prices.",
    "Expected Result (AU Baseline / Figma)": "Suppressed price containers are removed from accessibility tree (aria-hidden or display: none).",
    "Actual Result (mcstaging2 Live)": "PASS: Price containers are completely absent from DOM in guest mode; screen reader cannot leak prices.",
    "Status": "PASS",
    "Severity": "LOW (A11y Verified)",
    "Evidence Reference": "screenshots/03_US_PDP_GUEST_MASKING.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-016",
    "Module": "PDP Stock & ETA Status",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify PDP Stock Quantity Count Granularity (Figma Spec & Four Hands Model)",
    "Preconditions": "Logged-in Trade customer views product PDP with active lead time.",
    "Test Steps": "1. Navigate to product PDP as trade customer\n2. Inspect stock indicator below Add to Cart / Add to Quote\n3. Verify presence of available quantity in brackets e.g. 'ETA 14 Mar 2027 (8 available)'.",
    "Expected Result (AU Baseline / Figma)": "Figma Node 2317-27241 & Alex Pape Spec: Display 'ETA [Date] ([X] available)' under purchase buttons.",
    "Actual Result (mcstaging2 Live)": "FAIL: Renders generic 'Enquire for ETA' without available quantity count in brackets. Developer stated 'match with design' but Figma design explicitly specifies available quantity count.",
    "Status": "FAIL (Design Discrepancy)",
    "Severity": "P2 - MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_05_ETA_AND_STOCK_LOGIC_FIGMA_VS_LIVE.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-017",
    "Module": "PDP Stock & ETA Status",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify PDP Secondary Incoming Shipment Display (Four Hands Model)",
    "Preconditions": "Logged-in Trade customer views product PDP with purchase order arriving in NetSuite.",
    "Test Steps": "1. Inspect second line under primary ETA status\n2. Check for next incoming PO shipment date and quantity e.g. 'Next Shipment: 8 (ETA 14 Mar 2027)'.",
    "Expected Result (AU Baseline / Figma)": "Figma Node 2317-27241 & Alex Pape Spec: Display secondary shipment line 'Next Shipment: [Qty] (ETA [Date])'.",
    "Actual Result (mcstaging2 Live)": "FAIL: Secondary shipment line is completely missing on US staging PDP.",
    "Status": "FAIL (Spec Discrepancy)",
    "Severity": "P2 - MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_05_ETA_AND_STOCK_LOGIC_FIGMA_VS_LIVE.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-018",
    "Module": "PDP Stock & ETA Status",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify PDP 'Notify Me' Alert Bell Trigger Rendering",
    "Preconditions": "User views product with ETA or Enquire for ETA status.",
    "Test Steps": "1. Inspect right side of ETA status indicator\n2. Verify presence and interactivity of 'Notify me' alert trigger.",
    "Expected Result (AU Baseline / Figma)": "Figma Spec: Render 'Notify me' alert trigger with bell icon pinned to right of ETA indicator.",
    "Actual Result (mcstaging2 Live)": "PASS: 'Notify me' trigger with bell icon renders correctly alongside ETA line.",
    "Status": "PASS",
    "Severity": "LOW (Verified Working)",
    "Evidence Reference": "comparison/COMPARISON_05_ETA_AND_STOCK_LOGIC_FIGMA_VS_LIVE.png"
  },
  {
    "Test Case ID": "TC-GW-PUB-019",
    "Module": "PDP Stock & ETA Status",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Public Browsing Mode Stock & ETA Masking on PLP",
    "Preconditions": "Unauthenticated guest browses /indoor category PLP.",
    "Test Steps": "1. Navigate to /indoor as guest\n2. Inspect product cards for inventory quantities or stock indicators.",
    "Expected Result (AU Baseline / Figma)": "Stock quantities and lead times are cleanly masked or limited to public availability state without leaking wholesale inventory counts.",
    "Actual Result (mcstaging2 Live)": "PASS: Stock counts are suppressed from PLP product cards in guest mode.",
    "Status": "PASS",
    "Severity": "LOW (Verified Working)",
    "Evidence Reference": "screenshots/02_US_PLP_GUEST_GRID.png"
  }
];

// 1. Export Excel (.xlsx)
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

ws['!cols'] = [
  { wch: 16 }, // Test Case ID
  { wch: 24 }, // Module
  { wch: 26 }, // Auth Matrix
  { wch: 48 }, // Test Scenario / Title
  { wch: 35 }, // Preconditions
  { wch: 42 }, // Test Steps
  { wch: 48 }, // Expected Result
  { wch: 48 }, // Actual Result
  { wch: 20 }, // Status
  { wch: 22 }, // Severity
  { wch: 42 }  // Evidence Reference
];

XLSX.utils.book_append_sheet(wb, ws, 'Public Browsing Test Cases');
const xlsxPath = path.join(BASE_DIR, 'Enable_Public_Browsing_Mode_Test_Cases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`✅ Excel Test Suite created at: ${xlsxPath}`);

// 2. Export CSV (.csv)
const csvData = XLSX.utils.sheet_to_csv(ws);
const csvPath = path.join(BASE_DIR, 'Enable_Public_Browsing_Mode_Test_Cases.csv');
fs.writeFileSync(csvPath, csvData, 'utf-8');
console.log(`✅ CSV Test Suite created at: ${csvPath}`);
