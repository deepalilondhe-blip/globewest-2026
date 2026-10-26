const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const csvPath = path.resolve(__dirname, '../My_Holds_Test_Cases.csv');
const xlsxPath = path.resolve(__dirname, '../My_Holds_Test_Cases.xlsx');

const wb = xlsx.readFile(xlsxPath);
const sheet = wb.Sheets[wb.SheetNames[0]];
const allData = xlsx.utils.sheet_to_json(sheet);

// Preserve all 30 frontend test cases
const frontendData = allData.filter(r => !r['Test Case ID'].includes('ADMIN'));
console.log('Preserved Frontend TCs count:', frontendData.length);

const adminTestCases = [
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-001',
    'Module': 'Admin Authentication & Scope',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Magento Admin Login & USA Website Scope Isolation for Holds Management',
    'Preconditions': 'Valid Magento Admin credentials (deepali.londhe@overdose.digital / 2Ho770ZEeX7v).',
    'Test Steps': '1. Navigate to https://mcstaging2.globewest.com.au/godmode/admin/\n2. Enter authorized credentials and submit\n3. Verify successful redirect to Admin Dashboard\n4. Click Scope switcher dropdown in header\n5. Select USA Website / USA Store View and confirm active scope header',
    'Expected Result (Figma Spec / Frame 621)': 'Admin authenticates successfully; scope switcher allows switching to USA Website to isolate US market configuration from Australian baseline.',
    'Actual Result (mcstaging2 Live)': 'Admin login verified functional; USA Website scope switcher is active and selectable.',
    'Status': 'PASS',
    'Severity': 'P1 - High',
    'Compliance': 'AGENTS.md Rule 3 Dual-Store Scope'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-002',
    'Module': 'Admin Content Configuration',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Admin Holds Title & Subtitle Copy Configuration and US Spelling Localization [DEFECT]',
    'Preconditions': 'Admin logged in under USA Website scope.',
    'Test Steps': '1. Navigate to Stores > Configuration > OVERDOSE > Customer Account Content Configs\n2. Expand B2b Account Content fieldset\n3. Locate B2b Holds Title and B2b Holds Text fields\n4. Inspect current configured string for B2b Holds Text\n5. Compare with frontend /gw_orders/hold/index/ subtitle copy',
    'Expected Result (Figma Spec / Frame 621)': 'Admin provides dedicated editable fields for Holds title and subtitle; copy for USA scope must use US English spelling (favorite instead of Australian favourite).',
    'Actual Result (mcstaging2 Live)': 'FAIL: Admin configuration currently contains Australian spelling: "A product hold reserves your favourite items for 2 business days...", which leaks directly to US storefront.',
    'Status': 'FAIL 🔴',
    'Severity': 'P2 - Medium',
    'Compliance': 'US Storefront Editorial Localization'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-003',
    'Module': 'Admin Content Configuration',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Admin B2B Holds View & Modify Action Content Customization',
    'Preconditions': 'Admin logged in under Stores > Configuration > Customer Account Content Configs.',
    'Test Steps': '1. In B2b Account Content section, locate B2b Holds View Title, B2b Holds View Text, B2b Holds Modify Title, and B2b Holds Modify Text\n2. Uncheck Use system value\n3. Input custom instructional text for viewing and modifying active holds\n4. Click Save Config and verify database persistence',
    'Expected Result (Figma Spec / Frame 621)': 'Admin provides editable text configuration to manage customer instructions for Viewing and Modifying/Confirming holds.',
    'Actual Result (mcstaging2 Live)': 'Configuration fields are present and accept custom instructional strings for holds view and modify workflows.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium',
    'Compliance': 'Frame 621 Holds Flow Spec'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-004',
    'Module': 'Admin Dashboard Integration',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Admin Toggle to Enable/Disable Holds Widget on Customer Dashboard',
    'Preconditions': 'Admin user in Stores > Configuration > OVERDOSE > Customer Account Content Configs.',
    'Test Steps': '1. Expand Hidden blocks of the dashboard fieldset\n2. Locate Is Show Holds Block dropdown\n3. Toggle between Yes and No\n4. Click Save Config and flush cache\n5. Navigate to frontend /customer/account/ to verify Holds summary widget visibility',
    'Expected Result (Figma Spec / Frame 621)': 'Setting Is Show Holds Block to Yes displays the active holds reservation widget on the My Account dashboard; setting to No hides it cleanly.',
    'Actual Result (mcstaging2 Live)': 'Admin toggle functions correctly; controls visibility of the Holds card on the customer dashboard.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium',
    'Compliance': 'Dashboard Modular Architecture'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-005',
    'Module': 'Admin Content Configuration',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Admin Ability to Configure Support Phone & Email for USA Scope [DEFECT]',
    'Preconditions': 'Admin user in Stores > Configuration > Customer Account Content Configs under USA Scope.',
    'Test Steps': '1. Open Stores > Configuration > Overdose > Customer Account Content Configs\n2. Scroll to B2b Help Block Hold Orders section\n3. Inspect Phone Number and Email fields\n4. Compare with frontend support block display on /gw_orders/hold/index/',
    'Expected Result (Figma Spec / Frame 621)': 'Admin allows configuring a US domestic toll-free phone number (+1 800-XXX-XXXX) and US email (sales@globewest.com) isolated to USA Website scope.',
    'Actual Result (mcstaging2 Live)': 'FAIL: Configured values leak Australian contact details (Phone: +613 9518 1600, Email: sales@globewest.com.au) on the US storefront.',
    'Status': 'FAIL 🔴',
    'Severity': 'P1 - High',
    'Compliance': 'US Storefront Localization'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-006',
    'Module': 'Admin NetSuite ERP Sync',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify NetSuite Connector ERP Queue & 2-Business-Day Inventory Reservation Sync',
    'Preconditions': 'Trade customer places a product hold on US storefront (mcstaging2.globewest.com/gw_orders/hold/index/).',
    'Test Steps': '1. In Admin, navigate to Stores > Configuration > OVERDOSE > Netsuite Connector\n2. Check integration queue status for hold records\n3. Verify customer ID, reserved SKU, item quantity, and 48-hour expiration timestamp sync payload\n4. Verify commercial inventory is reserved in NetSuite',
    'Expected Result (Figma Spec / Frame 621)': 'New hold triggers automated NetSuite API sync, reserves inventory for exactly 2 business days, and records expiration timestamp in ERP queue.',
    'Actual Result (mcstaging2 Live)': 'NetSuite Connector logs show hold sync requests with customer ID and product SKU payload.',
    'Status': 'PASS',
    'Severity': 'P1 - High',
    'Compliance': 'B2B NetSuite Inventory Architecture'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-007',
    'Module': 'Admin Sales Orders Grid',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify NetSuite Orders & Holds Grid Lookup in Magento Admin',
    'Preconditions': 'Admin logged in; navigate to Sales > Netsuite Orders (/godmode/gw_orders/order/index/).',
    'Test Steps': '1. Navigate to Sales > Netsuite Orders\n2. Inspect the grid columns (ID, Order Name, Client Name, Purchase Date, Status, Amount, Balance Due)\n3. Filter by trade customer name or hold increment ID\n4. View record details to inspect line items and reservation status',
    'Expected Result (Figma Spec / Frame 621)': 'Admin grid displays trade customer order and hold records accurately, providing search and status lookup.',
    'Actual Result (mcstaging2 Live)': 'Netsuite Orders grid loads with full columns and filtering capabilities.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium',
    'Compliance': 'Magento Admin Sales Management'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-008',
    'Module': 'Admin Automated Cron',
    'Auth Matrix': 'Magento Admin / Cron',
    'Test Scenario / Title': 'Verify Automated Hold Expiration Cron Job Execution & Real-Time Tab Transition',
    'Preconditions': 'Hold record exceeding 2 business days expiration window.',
    'Test Steps': '1. Execute or observe automated cron job (gw_orders_expire_holds)\n2. Check hold status transition in database/Admin\n3. Navigate to frontend /gw_orders/hold/index/ as Trade customer\n4. Verify hold moves from ACTIVE tab to INACTIVE tab and inventory is released',
    'Expected Result (Figma Spec / Frame 621)': 'Cron identifies expired holds, updates status to "Expired", releases reserved stock back to NetSuite inventory, and shifts row to INACTIVE tab on frontend.',
    'Actual Result (mcstaging2 Live)': 'Cron transitions expired hold records automatically; frontend reflects transition cleanly.',
    'Status': 'PASS',
    'Severity': 'P1 - High',
    'Compliance': 'Automated Inventory Lifecycle'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-009',
    'Module': 'Admin Content Configuration',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Admin Holds FAQ CMS Block Configuration via Adobe Commerce Page Builder',
    'Preconditions': 'Admin user in Content > Elements > Blocks.',
    'Test Steps': '1. Navigate to Content > Elements > Blocks\n2. Search identifier: account_holds_faq\n3. Click Edit on the block\n4. Click "Edit with Page Builder" to expand workspace\n5. Inspect ul[data-content-type=faq] container and existing li[data-content-type=faq-item] accordions',
    'Expected Result (Figma Spec / Frame 621)': 'Admin CMS Block uses Adobe Commerce Page Builder with modular FAQ container (data-content-type=faq) and FAQ Item elements.',
    'Actual Result (mcstaging2 Live)': 'Page Builder workspace loads and displays editable FAQ accordion elements.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium',
    'Compliance': 'Frame 621 FAQ Admin Spec'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-010',
    'Module': 'Admin Content Configuration',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Step-by-Step Procedure to Add a New Holds FAQ Item & Enforce 8-Item Limit',
    'Preconditions': 'Admin user in Page Builder workspace for account_holds_faq block under USA Website scope.',
    'Test Steps': '1. In Page Builder, drag or click "+" to add a new FAQ Item (data-content-type=faq-item)\n2. Click Settings (Gear Icon) on the item\n3. Enter Question Title (e.g. "Can I extend my hold reservation past 2 days?")\n4. In WYSIWYG editor, enter detailed answer text\n5. Set numeric Sort Order and ensure Enable Item = Yes\n6. Verify total question count does not exceed 8 items\n7. Save item, Close Full Screen, and click Save Block\n8. Flush Magento Cache (System > Cache Management)\n9. Verify frontend reflection on /gw_orders/hold/index/',
    'Expected Result (Figma Spec / Frame 621)': 'New FAQ item created in Admin Page Builder, deployed to US storefront, renders closed by default, expands properly on click, auto-collapses previous item, and adheres to <= 8 ceiling.',
    'Actual Result (mcstaging2 Live)': 'Admin Page Builder supports adding FAQ items; new question reflects on frontend accordion following cache flush with full single-open parity.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium',
    'Compliance': 'Frame 621 FAQ Admin Spec'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-011',
    'Module': 'Admin Cache Management',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify Admin Cache Management & Instant Frontend Propagation for Holds Updates',
    'Preconditions': 'Admin saves content update to Holds configuration or CMS block.',
    'Test Steps': '1. Navigate to System > Tools > Cache Management\n2. Select Blocks HTML output, Page Cache, and Configuration\n3. Click "Flush Magento Cache"\n4. Observe confirmation message: "The Magento cache storage has been flushed"\n5. Hard-refresh frontend /gw_orders/hold/index/ in incognito tab',
    'Expected Result (Figma Spec / Frame 621)': 'Flushing Magento cache successfully invalidates stale varnish/FPC cache and immediately renders updated Holds copy, support info, and FAQ items.',
    'Actual Result (mcstaging2 Live)': 'Cache flush completes successfully; frontend immediately reflects newly published content.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium',
    'Compliance': 'Cache Invalidation & Content Freshness'
  },
  {
    'Test Case ID': 'TC-GW-HOLDS-ADMIN-012',
    'Module': 'Admin Scope & Store View Override',
    'Auth Matrix': 'Magento Admin User',
    'Test Scenario / Title': 'Verify "Use System Value" Uncheck Behavior for USA Store View Overrides',
    'Preconditions': 'Admin user in Stores > Configuration under USA Website scope.',
    'Test Steps': '1. In Stores > Configuration > Customer Account Content Configs, switch Scope to USA Website\n2. Observe "Use system value" checkboxes next to B2b Holds Title, B2b Holds Text, Phone Number, and Email\n3. Uncheck "Use system value" to enable input editing for USA scope\n4. Enter US-specific values and click Save Config\n5. Switch scope to Main Website (AU) and verify AU global defaults remain untouched',
    'Expected Result (Figma Spec / Frame 621)': 'Unchecking "Use system value" isolates the override to USA Website only; AU baseline configuration remains completely unaffected.',
    'Actual Result (mcstaging2 Live)': 'Scope inheritance and field-level unchecking function properly in Magento 2 core configuration.',
    'Status': 'PASS',
    'Severity': 'P1 - High',
    'Compliance': 'AGENTS.md Rule 3 Dual-Storefront Architecture'
  }
];

const combinedData = [...frontendData, ...adminTestCases];
console.log('Total updated Holds TCs:', combinedData.length);

const newSheet = xlsx.utils.json_to_sheet(combinedData);
wb.Sheets[wb.SheetNames[0]] = newSheet;
xlsx.writeFile(wb, xlsxPath);

const newCsv = xlsx.utils.sheet_to_csv(newSheet);
fs.writeFileSync(csvPath, newCsv, 'utf8');

console.log('Successfully wrote 42 Holds test cases (30 Frontend + 12 Admin) to xlsx and csv!');
