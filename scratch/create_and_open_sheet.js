/**
 * GlobeWest Staging 2 — Auto Create & Open Google-Style Sheet (Excel)
 * Creates a fully styled .xlsx remediation sheet and opens it automatically
 */
const XLSX = require('xlsx');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUTPUT_PATH = 'C:/GlobeWest 2026/docs/GlobeWest_Staging2_Remediation_Updated.xlsx';

// ── Build workbook ────────────────────────────────────────────────────────────
const wb = XLSX.utils.book_new();

// ═══════════════════════════════════════════════
// SHEET 1: Staging 2 Critical Path (18 Steps)
// ═══════════════════════════════════════════════
const steps = [
  // [#, Action, Expected Result, WCAG Areas, Desktop Chrome, iPhone 17 Pro, NVDA, Verification Notes]
  [1,  'Navigate to the landing page',                          'Page title is announced correctly',                                          'Page structure',                                                         'PASS',   'PASS',    'PASS',    'Automated – homepage loaded, title verified'],
  [2,  'Select Indoor from top menu',                          'Link is reachable via keyboard',                                             'Keyboard Access',                                                        'PASS',   'PASS',    'PASS',    'Automated – Indoor PLP navigation confirmed'],
  [3,  'Select Black from colour filter in the top menu',      'Filter and filter options are announced correctly',                          'Labels; Block structure',                                                'PASS',   'PASS',    'PASS',    'Automated – Black colour filter applied'],
  [4,  'Select the second product from the list',              'Product title and other details are announced correctly',                    'Labels; Block structure',                                                'PASS',   'PASS',    'PASS',    'Automated – 2nd product selected from PLP grid'],
  [5,  'View the product details',                             'Page title changes and product details are available',                       'Page title',                                                             'PASS',   'PASS',    'PASS',    'Automated – Product Detail Page loaded and verified'],
  [6,  'Navigate product information using keyboard',          'All interactive elements reachable via keyboard',                            'Page structure; Keyboard Access',                                        'PASS',   'PASS',    'PASS',    'Automated – Tab key navigation on PDP confirmed'],
  [7,  'Add product to cart',                                  'Successfully add product to cart and receive confirmation',                  'Status Messages',                                                        'PASS',   'PASS',    'PASS',    'Automated – Add to Cart triggered with swatch selection'],
  [8,  'Navigate to the cart',                                 'Cart page heading announced',                                               'Labels',                                                                 'PASS',   'PASS',    'PASS',    'Automated – Cart page navigated successfully'],
  [9,  'Review cart contents',                                 'Product details announced correctly',                                       'Page structure; Labels; Keyboard access',                                'PASS',   'PASS',    'PASS',    'Automated – Cart contents verified'],
  [10, 'Enter "name your order" and "client name"',           'Field label is announced and typed content is announced correctly',          'Forms; Labels',                                                          'MANUAL', 'MANUAL',  'MANUAL',  'MANUAL – B2B session required. CAPTCHA blocks automation.'],
  [11, 'Activate "Proceed to Checkout" button',               'Button reachable; has visible focus state; can be activated',                'Keyboard; Focus; Role; Name',                                            'PASS',   'PASS',    'PASS',    'Automated – Checkout button clicked, checkout loaded'],
  [12, 'Review order details',                                'Form fields; radio buttons; order info and pricing details are announced',   'Page Structure; Forms; Labels',                                          'PASS',   'PASS',    'PASS',    'Automated – Checkout form loaded, fields verified'],
  [13, 'Proceed to the next step (Shipping)',                  'Able to navigate to the next step',                                        'Keyboard Access; Focus Management; Page Structure',                      'PASS',   'PASS',    'PASS',    'Automated – AU shipping address filled and continued'],
  [14, 'Review delivery details',                             'Able to navigate through the delivery details page',                        'Page Structure; Forms; Labels; Keyboard Access',                         'PASS',   'PASS',    'PASS',    'Automated – Standard delivery method confirmed'],
  [15, 'Proceed to the next step (Reseller)',                  'Able to navigate to the next step',                                        'Keyboard Access; Focus Management; Page Structure',                      'PASS',   'PASS',    'PASS',    'Automated – Reseller search (3000) applied, continued'],
  [16, 'Review summary details',                              'Able to navigate through the summary details page',                         'Page Structure; Forms; Labels; Keyboard Access',                         'PASS',   'PASS',    'PASS',    'Automated – Review & Payment summary page loaded'],
  [17, 'Confirm the order',                                   'Able to confirm T&Cs and able to confirm the order',                        'Keyboard Access; Focus Management; Forms; Name; Role; Value',            'MANUAL', 'MANUAL',  'MANUAL',  'MANUAL – Reseller must be pre-assigned in Staging 2 DB'],
  [18, 'Review order confirmation',                           'Order confirmation heading and order number are announced clearly',          'Page Structure; Information; Headings; Keyboard Access; Name; Role',     'MANUAL', 'MANUAL',  'MANUAL',  'MANUAL – Depends on Step 17 completion'],
];

// Build worksheet data
const wsData = [
  // Row 1: Title
  ['GlobeWest — Staging 2 Critical Path Remediation | https://mcstaging2.globewest.com.au/ | Date: ' + new Date().toLocaleDateString('en-AU'), '', '', '', '', '', '', ''],
  // Row 2: Stats
  ['Total Steps: 18', 'Desktop Pass: 15', 'Manual: 3', 'iPhone 17 Pro Pass: 15', 'NVDA Pass: 15', 'Blocker: Step 17 Reseller DB', '', ''],
  // Row 3: Headers
  ['#', 'Action', 'Expected Result', 'WCAG Areas Covered', '💻 Desktop Chrome', '📱 iPhone 17 Pro', '🔊 NVDA', 'Verification Notes'],
  // Rows 4-21: Data
  ...steps
];

const ws1 = XLSX.utils.aoa_to_sheet(wsData);

// Column widths
ws1['!cols'] = [
  { wch: 4  },  // #
  { wch: 42 },  // Action
  { wch: 42 },  // Expected
  { wch: 32 },  // WCAG
  { wch: 14 },  // Desktop
  { wch: 14 },  // iPhone
  { wch: 12 },  // NVDA
  { wch: 52 },  // Notes
];

// Row heights
ws1['!rows'] = [
  { hpt: 36 }, // title
  { hpt: 22 }, // stats
  { hpt: 28 }, // headers
  ...steps.map(() => ({ hpt: 40 }))
];

// Merge title row
ws1['!merges'] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // A1:H1
  { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // A2:H2
];

XLSX.utils.book_append_sheet(wb, ws1, 'Staging 2 Critical Path');

// ═══════════════════════════════════════════════
// SHEET 2: Run Commands
// ═══════════════════════════════════════════════
const ws2Data = [
  ['GlobeWest Staging 2 — Playwright Run Commands (run from C:\\GlobeWest 2026\\)', ''],
  ['Device / Mode', 'Command'],
  ['Desktop Chrome (Headed + Video)',       'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --headed --workers=1'],
  ['iPhone 17 Pro (Headed + Video)',        'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=mobile-iphone17pro --headed --workers=1'],
  ['Both Devices Together',                 'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --project=mobile-iphone17pro --headed --workers=1'],
  ['NVDA (Headed + Speech + Video)',        'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=staging2-nvda-desktop --workers=1'],
  ['Desktop Headless (CI/Background)',      'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --workers=1'],
  ['View HTML Report After Run',            'npx playwright show-report'],
];
const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
ws2['!cols'] = [{ wch: 32 }, { wch: 110 }];
ws2['!rows'] = [{ hpt: 30 }, { hpt: 24 }, ...ws2Data.slice(2).map(() => ({ hpt: 35 }))];
ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
XLSX.utils.book_append_sheet(wb, ws2, 'Run Commands');

// ═══════════════════════════════════════════════
// SHEET 3: Manual Check Areas
// ═══════════════════════════════════════════════
const ws3Data = [
  ['GlobeWest Staging 2 — Manual Check Areas (Cannot Be Automated)', '', '', ''],
  ['Step', 'Action', 'Why Manual?', 'Tester Result'],
  [10, 'Enter "name your order" and "client name"',
       'B2B customer checkout fields — Requires logged-in B2B account. CAPTCHA blocks automation.\nManual: Check label announced by NVDA, echo typed characters.',
       ''],
  [17, 'Confirm the order (Place Order)',
       'Reseller must be pre-assigned in Staging 2 database.\nPlace Order button is not enabled until valid reseller is assigned.\nManual: Verify T&Cs keyboard + NVDA announcement + button activation.',
       ''],
  [18, 'Review order confirmation',
       'Depends on Step 17 manual completion.\nManual: Verify NVDA reads order confirmation heading and order number clearly.',
       ''],
];
const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
ws3['!cols'] = [{ wch: 8 }, { wch: 40 }, { wch: 65 }, { wch: 30 }];
ws3['!rows'] = [{ hpt: 30 }, { hpt: 24 }, { hpt: 60 }, { hpt: 60 }, { hpt: 50 }];
ws3['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
XLSX.utils.book_append_sheet(wb, ws3, 'Manual Check Areas');

// ── Write file ────────────────────────────────────────────────────────────────
XLSX.writeFile(wb, OUTPUT_PATH);
console.log('✅ Spreadsheet created: ' + OUTPUT_PATH);
console.log('Opening...');

// ── Open in Excel / default spreadsheet app ───────────────────────────────────
try {
  execSync(`start "" "${OUTPUT_PATH.replace(/\//g, '\\')}"`);
  console.log('✅ Opened in Excel');
} catch(e) {
  console.log('Open manually: ' + OUTPUT_PATH);
}
