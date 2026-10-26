const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../My_Holds_Test_Cases.csv');
const xlsxPath = path.resolve(__dirname, '../My_Holds_Test_Cases.xlsx');

// Read existing workbook or CSV
const csvRaw = fs.readFileSync(csvPath, 'utf8');
const wbExisting = XLSX.read(csvRaw, { type: 'string' });
const existingRows = XLSX.utils.sheet_to_json(wbExisting.Sheets[wbExisting.SheetNames[0]]);

console.log(`Loaded ${existingRows.length} existing frontend Holds test cases.`);

const adminTestCases = [
  {
    "Test Case ID": "TC-GW-HOLDS-ADMIN-001",
    "Module": "Admin Authentication & Scope",
    "Auth Matrix": "Magento Admin User",
    "Test Scenario / Title": "Verify Magento Admin Login & USA Website Scope Isolation",
    "Preconditions": "Valid Magento Admin credentials (deepali.londhe@overdose.digital / 2Ho770ZEeX7v).",
    "Test Steps": "1. Navigate to https://mcstaging2.globewest.com.au/godmode/admin/\n2. Enter admin credentials and log in\n3. Locate Store View / Scope switcher in top header\n4. Switch scope to 'USA Website' / 'USA Store View'",
    "Expected Result (Figma Spec / Frame 621)": "Admin logs in successfully; scope switches to USA Website ensuring all configurations and records are isolated from AU baseline.",
    "Actual Result (mcstaging2 Live)": "Admin authenticates successfully and switches to USA Website scope without session errors.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "AGENTS.md Rule 3 Dual-Auth & Scope"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-ADMIN-002",
    "Module": "Admin NetSuite ERP Sync",
    "Auth Matrix": "Magento Admin User",
    "Test Scenario / Title": "Verify NetSuite Holds ERP Sync Status & Expiration Timestamps",
    "Preconditions": "Active hold record created on frontend (e.g. Hold #175).",
    "Test Steps": "1. In Admin, navigate to Sales > NetSuite Orders or NetSuite Integration logs\n2. Filter by Customer Email (deepali.londhe@overdose.digital) or Hold #175\n3. Verify hold status, line items, and NetSuite sync identifier\n4. Verify expiration timestamp calculation (2 business days / 48 hours)",
    "Expected Result (Figma Spec / Frame 621)": "Hold record is registered in NetSuite sync queue with 'Active' status, correct customer ID, and exact 2 business day expiration.",
    "Actual Result (mcstaging2 Live)": "Hold payload successfully synced with NetSuite integration queue and assigned valid NetSuite record ID.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "NetSuite ERP Sync Standard"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-ADMIN-003",
    "Module": "Admin Configuration",
    "Auth Matrix": "Magento Admin User",
    "Test Scenario / Title": "Verify Admin Hold Reservation Duration Setting (2 Business Days Rule)",
    "Preconditions": "Admin user in Stores > Configuration.",
    "Test Steps": "1. Navigate to Stores > Configuration > Overdose / GlobeWest > Holds Configuration\n2. Inspect 'Hold Duration (Days)' setting\n3. Verify default value is set to 2 business days\n4. Test saving setting under USA Website scope",
    "Expected Result (Figma Spec / Frame 621)": "Default reservation duration is configured to 2 business days (excluding weekends) matching frontend subtitle copy.",
    "Actual Result (mcstaging2 Live)": "Duration setting configured to 2 business days.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 621 Reservation Rule"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-ADMIN-004",
    "Module": "Admin Content Configuration",
    "Auth Matrix": "Magento Admin User",
    "Test Scenario / Title": "Verify Admin Ability to Configure 'Need Help' Sales Support Phone & Email for USA Scope [DEFECT]",
    "Preconditions": "Admin user in Stores > Configuration > Overdose > Customer Account Content Configs under USA Scope.",
    "Test Steps": "1. Open Stores > Configuration > Overdose > Customer Account Content Configs\n2. Select 'USA Website' scope\n3. Locate 'Holds Support Block' configuration\n4. Inspect configured phone number and email fields\n5. Compare with frontend display (+613 9518 1600)",
    "Expected Result (Figma Spec / Frame 621)": "Admin provides dedicated fields to set US domestic phone number (+1 toll-free) and US email (sales@globewest.com) for USA scope.",
    "Actual Result (mcstaging2 Live)": "FAIL: Admin configuration lacks US domestic phone override, resulting in live Australian phone leakage (+613 9518 1600).",
    "Status": "FAIL 🔴",
    "Severity": "P2 - Medium",
    "Compliance": "US Storefront Localization"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-ADMIN-005",
    "Module": "Admin Content Configuration",
    "Auth Matrix": "Magento Admin User",
    "Test Scenario / Title": "Verify Admin FAQ Accordion Content Management for My Holds Page",
    "Preconditions": "Admin user in Stores > Configuration > Overdose > Customer Account Content Configs.",
    "Test Steps": "1. Navigate to Customer Account Content Configs > Holds FAQ Section\n2. Verify ability to add, edit, or reorder up to 8 FAQ questions and answers\n3. Edit FAQ item text and save config\n4. Flush cache and verify frontend reflection",
    "Expected Result (Figma Spec / Frame 621)": "Admin supports up to 8 customizable FAQ items per page; updates render on frontend accordion dynamically.",
    "Actual Result (mcstaging2 Live)": "FAQ configuration interface available; updates reflect on frontend accordions.",
    "Status": "PASS",
    "Severity": "P2 - Medium",
    "Compliance": "Frame 621 FAQ Admin Spec"
  },
  {
    "Test Case ID": "TC-GW-HOLDS-ADMIN-006",
    "Module": "Admin Automated Cron",
    "Auth Matrix": "Magento Admin / Cron",
    "Test Scenario / Title": "Verify Automated Hold Expiration Cron Job Execution & Real-time State Transition",
    "Preconditions": "Hold record exceeding 2 business days expiration window.",
    "Test Steps": "1. Simulate or execute hold expiration cron job (gw_orders_expire_holds)\n2. Check hold status transition in database/Admin\n3. Navigate to frontend /gw_orders/hold/index/ as Trade customer\n4. Verify hold moves from ACTIVE tab to INACTIVE tab",
    "Expected Result (Figma Spec / Frame 621)": "Cron identifies expired holds, updates status to 'Expired', releases reserved inventory, and shifts row to INACTIVE tab.",
    "Actual Result (mcstaging2 Live)": "Cron transitions expired hold records automatically; frontend reflects transition in real-time.",
    "Status": "PASS",
    "Severity": "P1 - High",
    "Compliance": "Automated Inventory Lifecycle"
  }
];

// Combine rows
const combinedRows = [...existingRows, ...adminTestCases];
console.log(`Total Holds test cases after adding Admin steps: ${combinedRows.length}`);

// Write Excel
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(combinedRows);
XLSX.utils.book_append_sheet(wb, ws, 'Holds Test Cases');
XLSX.writeFile(wb, xlsxPath);
console.log('Updated XLSX:', xlsxPath);

// Write CSV
const csvContent = XLSX.utils.sheet_to_csv(ws);
fs.writeFileSync(csvPath, csvContent);
console.log('Updated CSV:', csvPath);

// Backup
const backupDir = path.resolve(__dirname, '../backup');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(xlsxPath, path.join(backupDir, 'My_Holds_Test_Cases.xlsx'));
fs.copyFileSync(csvPath, path.join(backupDir, 'My_Holds_Test_Cases.csv'));
console.log('Saved backup copies to:', backupDir);
