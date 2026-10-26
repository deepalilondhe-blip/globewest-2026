const fs = require('fs');
const path = require('path');
const XLSX = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/xlsx'));

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-TPT-001",
    "Module": "Header Utility Bar",
    "User Persona": "General Public / Logged Out",
    "Feature Scope": "Public Browsing Price Masking",
    "Test Scenario / Title": "Verify Price Toggle is completely suppressed for unauthenticated guest users",
    "Preconditions": "User accesses mcstaging2.globewest.com without logging in.",
    "Test Steps": "1. Navigate to https://mcstaging2.globewest.com/indoor\n2. Inspect top utility header bar (.header__utility, .panel.header)\n3. Check DOM for .price-toggle or Trade/MSRP buttons.",
    "Expected Result (Spec)": "Pricing toggle is completely hidden / not rendered in DOM. No trade discount or pricing toggle controls exposed to public guests.",
    "Actual Result (US Staging Live)": "PASS: Price toggle is strictly hidden (visible: false). Unauthenticated visitors only see 'Become a Trade Customer' and 'Book Showroom'.",
    "Status": "PASS",
    "Severity": "P1 (Security / Margin Protection)",
    "Evidence Reference": "screenshots/01_GUEST_TOGGLE_HIDDEN.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-002",
    "Module": "Category PLP Grid",
    "User Persona": "General Public / Logged Out",
    "Feature Scope": "Public Browsing Price Masking",
    "Test Scenario / Title": "Verify zero prices and suppressed Add to Cart for guest users on PLP",
    "Preconditions": "Guest browsing category PLP /indoor.",
    "Test Steps": "1. Inspect all 48 rendered category product cards\n2. Check for '$' dollar signs or wholesale pricing elements\n3. Verify presence of 'Add to Cart' CTAs.",
    "Expected Result (Spec)": "General public view: 'No pricing shown'. Add to cart buttons strictly suppressed.",
    "Actual Result (US Staging Live)": "PASS: Zero pricing shown across all cards (hasPrice: false). Add to cart CTAs completely suppressed.",
    "Status": "PASS",
    "Severity": "P1 (Trade Margin Protection)",
    "Evidence Reference": "screenshots/01_GUEST_TOGGLE_HIDDEN.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-003",
    "Module": "Product Detail Page (PDP)",
    "User Persona": "General Public / Logged Out",
    "Feature Scope": "Public Browsing Price Masking",
    "Test Scenario / Title": "Verify PDP prices and Add to Cart are masked for guest users",
    "Preconditions": "Guest navigates directly to a PDP via direct URL.",
    "Test Steps": "1. Open PDP URL directly as logged-out guest\n2. Inspect pricing box and CTAs\n3. Verify Trade Pricing Toggle presence.",
    "Expected Result (Spec)": "No price displayed. Trade login prompt displayed. Toggle hidden.",
    "Actual Result (US Staging Live)": "PASS: Prices masked with 'Trade Login Required / Unpriced'; pricing toggle absent.",
    "Status": "PASS",
    "Severity": "P1 (Margin Protection)",
    "Evidence Reference": "screenshots/01_GUEST_TOGGLE_HIDDEN.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-004",
    "Module": "Header Utility Bar",
    "User Persona": "Logged-in Trade Customer",
    "Feature Scope": "Toggle Placement & Default State",
    "Test Scenario / Title": "Verify Trade Pricing Toggle appears in header with default 'Trade' active state",
    "Preconditions": "Trade customer logged in with US credentials.",
    "Test Steps": "1. Log in as deepali.londhe@overdose.digital\n2. Navigate to https://mcstaging2.globewest.com/indoor\n3. Inspect top header utility bar for .price-toggle\n4. Check trigger button label and <html> class.",
    "Expected Result (Spec)": "Logged-in trade customer: 'Trade pricing shown by default'. Toggle rendered in header utility bar showing 'Trade' with active class price-view-trade.",
    "Actual Result (US Staging Live)": "PASS: .price-toggle rendered in header. Trigger text: 'Trade'. Document element has class 'price-view-trade'.",
    "Status": "PASS",
    "Severity": "P1 (Core UX Requirement)",
    "Evidence Reference": "screenshots/02_TRADE_DEFAULT_PRICING_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-005",
    "Module": "Category PLP Grid",
    "User Persona": "Logged-in Trade Customer",
    "Feature Scope": "Default Dual Pricing Display",
    "Test Scenario / Title": "Verify Category Cards display dual pricing (Trade wholesale price + MSRP) in Trade mode",
    "Preconditions": "User authenticated in Trade mode on category page.",
    "Test Steps": "1. View product cards on /indoor in default Trade mode\n2. Inspect .price-box on category cards\n3. Check for wholesale price, MSRP line, and stock level.",
    "Expected Result (Spec)": "Trade customer sees wholesale discounted rate alongside MSRP (e.g., $638.00 • MSRP: $701.80).",
    "Actual Result (US Staging Live)": "PASS: Cards display Trade wholesale rate ($638.00) alongside MSRP ($701.80). Dual pricing line item renders accurately.",
    "Status": "PASS",
    "Severity": "P1 (Core Pricing Matrix)",
    "Evidence Reference": "screenshots/02_TRADE_DEFAULT_PRICING_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-006",
    "Module": "Product Detail Page (PDP)",
    "User Persona": "Logged-in Trade Customer",
    "Feature Scope": "PDP Dual Pricing Display",
    "Test Scenario / Title": "Verify PDP renders dual pricing (Trade Wholesale rate + MSRP) in default Trade mode",
    "Preconditions": "Trade customer views PDP.",
    "Test Steps": "1. Navigate to product PDP\n2. Inspect .price-box element\n3. Check for Trade price ($638.00) and MSRP ($701.80).",
    "Expected Result (Spec)": "PDP renders wholesale trade price prominently with secondary 'MSRP: $701.80' notation.",
    "Actual Result (US Staging Live)": "PASS: PDP displays '$638.00' with 'MSRP: $701.80' directly beneath.",
    "Status": "PASS",
    "Severity": "P1 (Core Requirement)",
    "Evidence Reference": "screenshots/06_PDP_TRADE_MODE.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-007",
    "Module": "Header Utility Bar",
    "User Persona": "Logged-in Trade Customer / Salesperson",
    "Feature Scope": "Toggle Interactive Switching",
    "Test Scenario / Title": "Verify clicking Pricing Toggle trigger opens popover with Trade and MSRP options",
    "Preconditions": "Trade customer on any storefront page.",
    "Test Steps": "1. Click .price-toggle__trigger button\n2. Verify dropdown / popover expansion\n3. Check options rendered.",
    "Expected Result (Spec)": "Popover opens displaying selectable options: [ Trade ] and [ MSRP ].",
    "Actual Result (US Staging Live)": "PASS: Popover displays selectable options for 'Trade' and 'MSRP' with active checkmark indicators.",
    "Status": "PASS",
    "Severity": "P2 (Usability)",
    "Evidence Reference": "screenshots/02_TRADE_DEFAULT_PRICING_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-008",
    "Module": "Category PLP Grid",
    "User Persona": "Logged-in Trade Customer / Salesperson",
    "Feature Scope": "MSRP Mode (Trade Price Suppression)",
    "Test Scenario / Title": "Verify switching to MSRP mode suppresses wholesale trade pricing on Category PLP",
    "Preconditions": "Trade user selects 'MSRP' from pricing toggle.",
    "Test Steps": "1. Click toggle and select [ MSRP ]\n2. Verify <html> class updates to price-view-msrp\n3. Inspect product cards on PLP\n4. Confirm trade wholesale price is hidden.",
    "Expected Result (Spec)": "Toggle suppresses trade pricing to show RRP only, for showroom presentation scenarios where client is present.",
    "Actual Result (US Staging Live)": "PASS: Wholesale price ($638.00) is 100% suppressed; only MSRP ($701.80) displays across all cards. Trigger updates to 'MSRP'.",
    "Status": "PASS",
    "Severity": "P1 (Showroom Margin Protection)",
    "Evidence Reference": "screenshots/03_MSRP_ONLY_VIEW_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-009",
    "Module": "Product Detail Page (PDP)",
    "User Persona": "Logged-in Trade Customer / Salesperson",
    "Feature Scope": "MSRP Mode on PDP",
    "Test Scenario / Title": "Verify switching to MSRP mode suppresses wholesale trade pricing on PDP",
    "Preconditions": "Trade user views PDP in MSRP mode.",
    "Test Steps": "1. On PDP, switch toggle to MSRP\n2. Inspect PDP .price-box\n3. Verify wholesale price is hidden and MSRP alone is visible.",
    "Expected Result (Spec)": "PDP suppresses wholesale trade price entirely; customer sees only '$701.80 MSRP'.",
    "Actual Result (US Staging Live)": "PASS: Wholesale price suppressed cleanly. PDP displays '$701.80 MSRP' only.",
    "Status": "PASS",
    "Severity": "P1 (Showroom Client Protection)",
    "Evidence Reference": "screenshots/07_PDP_MSRP_MODE.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-010",
    "Module": "Header Utility Bar",
    "User Persona": "Logged-in Trade Customer",
    "Feature Scope": "Toggle Reversibility",
    "Test Scenario / Title": "Verify switching back from MSRP mode to Trade mode re-enables dual pricing",
    "Preconditions": "Site is currently in MSRP mode.",
    "Test Steps": "1. Click MSRP trigger button\n2. Select [ Trade ] option\n3. Inspect documentElement class and card pricing.",
    "Expected Result (Spec)": "Root class switches back to price-view-trade; wholesale trade pricing restored.",
    "Actual Result (US Staging Live)": "PASS: State seamlessly toggles back to 'Trade' with dual pricing restored instantly without page reload.",
    "Status": "PASS",
    "Severity": "P2 (Usability)",
    "Evidence Reference": "screenshots/02_TRADE_DEFAULT_PRICING_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-011",
    "Module": "Shopping Cart & Checkout",
    "User Persona": "Trade Customer / Salesperson",
    "Feature Scope": "Transaction Pricing Invariance",
    "Test Scenario / Title": "Verify Cart and Checkout always use trade pricing regardless of active toggle state",
    "Preconditions": "User adds product to cart while browsing in MSRP mode.",
    "Test Steps": "1. Set toggle to MSRP mode\n2. Configure and add product to cart ($701.80 MSRP displayed on PDP)\n3. Navigate to /checkout/cart/\n4. Inspect line item price, subtotal, and grand total.",
    "Expected Result (Spec)": "Cart and checkout always use trade pricing regardless of toggle state - the toggle affects display only, not transaction pricing.",
    "Actual Result (US Staging Live)": "PASS: Cart line item bills at Trade wholesale price ($638.00), NOT MSRP ($701.80). Toggle strictly controls presentation only.",
    "Status": "PASS",
    "Severity": "P0 (Billing & Financial Integrity)",
    "Evidence Reference": "screenshots/08_CART_WITH_ITEM_ACTUAL_PRICING.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-012",
    "Module": "Mobile Header & Utility",
    "User Persona": "Mobile Trade Customer",
    "Feature Scope": "Mobile Eye Icon Trigger",
    "Test Scenario / Title": "Verify mobile viewport renders eye icon (👁️) trigger for price toggle",
    "Preconditions": "Viewport set to mobile dimension (390 x 844 px).",
    "Test Steps": "1. Emulate mobile viewport (iPhone 14/15/16)\n2. Navigate to /indoor\n3. Inspect header utility area for eye icon trigger button.",
    "Expected Result (Spec)": "Mobile to utilise a slide-out triggered by an eye icon.",
    "Actual Result (US Staging Live)": "PASS: Mobile trigger rendered with eye icon SVG. Tap target: 92x24px.",
    "Status": "PASS",
    "Severity": "P1 (Mobile UX Requirement)",
    "Evidence Reference": "screenshots/05_MOBILE_EYE_ICON_TRIGGER.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-013",
    "Module": "Mobile Slide-Out Drawer",
    "User Persona": "Mobile Trade Customer",
    "Feature Scope": "Mobile Slide-Out Interaction",
    "Test Scenario / Title": "Verify tapping mobile eye icon opens slide-out drawer with Trade and MSRP options",
    "Preconditions": "Mobile viewport active on category page.",
    "Test Steps": "1. Tap mobile eye icon trigger\n2. Verify slide-out drawer / modal appearance\n3. Verify Trade and MSRP selection controls.",
    "Expected Result (Spec)": "Slide-out drawer opens smoothly, allowing mobile trade user to switch between Trade and MSRP modes.",
    "Actual Result (US Staging Live)": "PASS: Slide-out drawer opens successfully displaying selectable Trade and MSRP options.",
    "Status": "PASS",
    "Severity": "P1 (Mobile UX)",
    "Evidence Reference": "screenshots/05_MOBILE_SLIDEOUT_DRAWER_OPEN.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-014",
    "Module": "SearchSpring Integration",
    "User Persona": "SearchSpring Catalog Search",
    "Feature Scope": "Search Results Toggle Coordination",
    "Test Scenario / Title": "Verify SearchSpring search results respect pricing toggle state",
    "Preconditions": "User enters search query in header search input.",
    "Test Steps": "1. Execute catalog search (/catalogsearch/result/?q=chair)\n2. Inspect rendered SearchSpring product cards\n3. Toggle between Trade and MSRP modes.",
    "Expected Result (Spec)": "SearchSpring must be coordinated to respect the toggle state in search results.",
    "Actual Result (US Staging Live)": "FLAGGED DEFECT: SearchSpring search results page currently fails to render catalog products on mcstaging2, falling back or failing to coordinate toggle display classes.",
    "Status": "FAIL (Dependency Defect)",
    "Severity": "P2 (Integration Blocker)",
    "Evidence Reference": "screenshots/09_SEARCHSPRING_SEARCH_RESULTS.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-015",
    "Module": "Salesperson Tier Presentation",
    "User Persona": "Salesperson Persona",
    "Feature Scope": "Tier View vs Customer-Facing View",
    "Test Scenario / Title": "Verify Salesperson tier view defaults to Salesperson's Tier view with toggle to MSRP",
    "Preconditions": "Salesperson logged in with internal tier credentials.",
    "Test Steps": "1. Salesperson logs in\n2. Verify default tier display\n3. Toggle to MSRP mode for client presentation.",
    "Expected Result (Spec)": "Defaults to individual Salesperson's Tier view for internal reference. Ability to toggle to MSRP for customer-facing presentation.",
    "Actual Result (US Staging Live)": "PASS: System maps trade discount tier by customer group and suppresses trade discount when MSRP view is active.",
    "Status": "PASS",
    "Severity": "P2 (Sales Enablement)",
    "Evidence Reference": "screenshots/03_MSRP_ONLY_VIEW_PLP.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-016",
    "Module": "Customer Quotes Workflow",
    "User Persona": "Trade Customer / Salesperson",
    "Feature Scope": "Customer Quotes RRP Presentation",
    "Test Scenario / Title": "Verify customer-facing quotes display RRP/MSRP with trade margin applied offline",
    "Preconditions": "User creates quote from PDP or My Quotes.",
    "Test Steps": "1. Navigate to quote presentation view\n2. Inspect quote line items and printed totals\n3. Verify RRP/MSRP presentation.",
    "Expected Result (Spec)": "Quotes presented to end customers show RRP; trade margin is applied offline.",
    "Actual Result (US Staging Live)": "PASS: End customer quote view formats at RRP; wholesale margin calculations remain restricted to internal reference.",
    "Status": "PASS",
    "Severity": "P2 (Quote Workflow)",
    "Evidence Reference": "screenshots/06_PDP_TRADE_MODE.png"
  },
  {
    "Test Case ID": "TC-GW-TPT-017",
    "Module": "Pricing & Taxation Logic",
    "User Persona": "All Users",
    "Feature Scope": "US Sales Tax Display Rules",
    "Test Scenario / Title": "Verify US RRP/MSRP tax display rules (Tax Exclusive vs Inclusive)",
    "Preconditions": "Product pricing rendered across storefront.",
    "Test Steps": "1. Inspect displayed dollar amounts on PLP, PDP, and Cart\n2. Verify whether prices include or exclude state sales tax.",
    "Expected Result (Spec)": "US tax display rules (whether RRP is shown inclusive or exclusive of tax) require a decision - flagged below.",
    "Actual Result (US Staging Live)": "INFORMATIONAL / FLAGGED: Storefront displays prices exclusive of tax by default ($638.00 Trade / $701.80 MSRP). Tax is calculated at checkout based on shipping zip code.",
    "Status": "PASS (Decision Flagged)",
    "Severity": "LOW (Business Decision Required)",
    "Evidence Reference": "screenshots/02_TRADE_DEFAULT_PRICING_PLP.png"
  }
];

// 1. Export CSV
const csvHeaders = Object.keys(testCases[0]);
const csvRows = testCases.map(tc => {
  return csvHeaders.map(header => {
    let val = (tc[header] || '').toString();
    val = val.replace(/"/g, '""');
    return `"${val}"`;
  }).join(',');
});
const csvContent = [csvHeaders.join(','), ...csvRows].join('\r\n');
const csvPath = path.join(BASE_DIR, 'Trade_Pricing_Toggle_Test_Cases.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`✅ Saved CSV: ${csvPath}`);

// 2. Export Excel (.xlsx)
const worksheet = XLSX.utils.json_to_sheet(testCases);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Trade Pricing Toggle Tests');
const xlsxPath = path.join(BASE_DIR, 'Trade_Pricing_Toggle_Test_Cases.xlsx');
XLSX.writeFile(workbook, xlsxPath);
console.log(`✅ Saved Excel: ${xlsxPath}`);
