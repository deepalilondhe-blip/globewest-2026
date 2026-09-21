/**
 * GlobeWest Staging 2 — Google Sheets Creator Script
 * ====================================================
 * HOW TO USE:
 * 1. Go to: https://script.google.com
 * 2. Click "New project"
 * 3. Delete all existing code
 * 4. Paste this ENTIRE script
 * 5. Click the ▶ Run button (select "createStaging2RemediationSheet" function)
 * 6. Authorize when prompted
 * 7. Check your Google Drive — a new sheet will be created!
 * ====================================================
 */

function createStaging2RemediationSheet() {

  // ── Create the Spreadsheet ──────────────────────────────────────────────────
  var ss = SpreadsheetApp.create('GlobeWest Staging 2 — Critical Path Remediation');
  var sheet = ss.getActiveSheet();
  sheet.setName('Staging 2 Critical Path');

  // ── Sheet Dimensions ────────────────────────────────────────────────────────
  sheet.setColumnWidth(1, 60);   // #
  sheet.setColumnWidth(2, 260);  // Action
  sheet.setColumnWidth(3, 260);  // Expected Result
  sheet.setColumnWidth(4, 200);  // WCAG Areas
  sheet.setColumnWidth(5, 140);  // Desktop Chrome
  sheet.setColumnWidth(6, 140);  // iPhone 17 Pro
  sheet.setColumnWidth(7, 140);  // NVDA
  sheet.setColumnWidth(8, 320);  // Verification Notes

  // ── TITLE ROW ───────────────────────────────────────────────────────────────
  sheet.setRowHeight(1, 60);
  var titleRange = sheet.getRange('A1:H1');
  titleRange.merge();
  titleRange.setValue('GlobeWest — Staging 2 Critical Path Remediation | https://mcstaging2.globewest.com.au/');
  titleRange.setBackground('#1a1a2e');
  titleRange.setFontColor('#e0533c');
  titleRange.setFontSize(14);
  titleRange.setFontWeight('bold');
  titleRange.setVerticalAlignment('middle');
  titleRange.setHorizontalAlignment('center');
  titleRange.setBorder(false, false, true, false, false, false, '#e0533c', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // ── METADATA ROW ────────────────────────────────────────────────────────────
  sheet.setRowHeight(2, 30);
  var metaValues = [
    ['URL: https://mcstaging2.globewest.com.au/', '', '', 'Date: ' + Utilities.formatDate(new Date(), 'Australia/Melbourne', 'dd MMM yyyy'), '', '', 'Spec: staging2-critical-path-nvda.spec.js', '']
  ];
  var metaRange = sheet.getRange('A2:H2');
  metaRange.setValues(metaValues);
  metaRange.setBackground('#12121f');
  metaRange.setFontColor('#8896a8');
  metaRange.setFontSize(9);
  metaRange.setFontStyle('italic');
  metaRange.setVerticalAlignment('middle');

  // ── STATS ROW ───────────────────────────────────────────────────────────────
  sheet.setRowHeight(3, 40);
  var statsRange = sheet.getRange('A3:H3');
  statsRange.setValues([['Total Steps: 18', 'Desktop Chrome Pass: 15', 'Manual Required: 3', 'iPhone 17 Pro: Pending', 'NVDA: Pending', 'Known Blocker: 1 (Reseller DB)', '', '']]);
  statsRange.setBackground('#0d1117');
  statsRange.setFontColor('#58a6ff');
  statsRange.setFontSize(9);
  statsRange.setFontWeight('bold');
  statsRange.setVerticalAlignment('middle');

  // ── HEADER ROW ──────────────────────────────────────────────────────────────
  sheet.setRowHeight(4, 40);
  var headers = [['#', 'Action', 'Expected Result', 'WCAG Areas Covered', '💻 Desktop Chrome', '📱 iPhone 17 Pro', '🔊 NVDA', 'Verification Notes']];
  var headerRange = sheet.getRange('A4:H4');
  headerRange.setValues(headers);
  headerRange.setBackground('#e0533c');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontSize(10);
  headerRange.setFontWeight('bold');
  headerRange.setVerticalAlignment('middle');
  headerRange.setHorizontalAlignment('center');
  headerRange.setBorder(false, false, true, false, false, false, '#ffffff', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  // ── DATA ROWS ───────────────────────────────────────────────────────────────
  var data = [
    [1,  'Navigate to the landing page',                         'Page title is announced correctly',                                           'Page structure',                                                      'PASS',   'PENDING', 'PENDING', 'Automated – homepage loaded, page title verified'],
    [2,  'Select Indoor from top menu',                          'Link is reachable via keyboard',                                              'Keyboard Access',                                                     'PASS',   'PENDING', 'PENDING', 'Automated – Indoor PLP navigation confirmed'],
    [3,  'Select Black from colour filter in the top menu',      'Filter and filter options are announced correctly',                           'Labels; Block structure',                                             'PASS',   'PENDING', 'PENDING', 'Automated – Black colour filter applied via SearchSpring facet'],
    [4,  'Select the second product from the list',              'Product title and other details are announced correctly',                     'Labels; Block structure',                                             'PASS',   'PENDING', 'PENDING', 'Automated – 2nd product selected from PLP grid'],
    [5,  'View the product details',                             'Page title changes and product details are available',                        'Page title',                                                          'PASS',   'PENDING', 'PENDING', 'Automated – Product Detail Page loaded and verified'],
    [6,  'Navigate product information using keyboard',          'All interactive elements reachable via keyboard',                             'Page structure; Keyboard Access',                                     'PASS',   'PENDING', 'PENDING', 'Automated – Tab key navigation on PDP confirmed'],
    [7,  'Add product to cart',                                  'Successfully add product to cart and receive confirmation',                   'Status Messages',                                                     'PASS',   'PENDING', 'PENDING', 'Automated – Add to Cart triggered with colour swatch selection'],
    [8,  'Navigate to the cart',                                 'Cart page heading announced',                                                 'Labels',                                                              'PASS',   'PENDING', 'PENDING', 'Automated – Cart page navigated successfully'],
    [9,  'Review cart contents',                                 'Product details announced correctly',                                        'Page structure; Labels; Keyboard access',                             'PASS',   'PENDING', 'PENDING', 'Automated – Cart contents verified with product visible'],
    [10, 'Enter "name your order" and "client name"',            'Field label is announced and typed content is announced correctly',           'Forms; Labels',                                                       'MANUAL', 'MANUAL',  'MANUAL',  '⚠️ B2B customer checkout fields — Requires logged-in B2B session. Blocked by CAPTCHA.'],
    [11, 'Activate "Proceed to Checkout" button',                'Button reachable; has visible focus state; can be activated',                 'Keyboard; Focus; Role; Name',                                         'PASS',   'PENDING', 'PENDING', 'Automated – Checkout button clicked, checkout page loaded'],
    [12, 'Review order details',                                 'Form fields; radio buttons; order info and pricing details are announced',    'Page Structure; Forms; Labels',                                       'PASS',   'PENDING', 'PENDING', 'Automated – Checkout form loaded, all fields verified'],
    [13, 'Proceed to the next step (Shipping)',                  'Able to navigate to the next step',                                          'Keyboard Access; Focus Management; Page Structure',                   'PASS',   'PENDING', 'PENDING', 'Automated – AU shipping address filled and continued to delivery step'],
    [14, 'Review delivery details',                              'Able to navigate through the delivery details page',                          'Page Structure; Forms; Labels and Instructions; Keyboard Access',     'PASS',   'PENDING', 'PENDING', 'Automated – Standard delivery method confirmed on Staging 2'],
    [15, 'Proceed to the next step (Reseller)',                  'Able to navigate to the next step',                                          'Keyboard Access; Focus Management; Page Structure',                   'PASS',   'PENDING', 'PENDING', 'Automated – Reseller postcode search (3000) applied, continued to summary'],
    [16, 'Review summary details',                               'Able to navigate through the summary details page',                          'Page Structure; Forms; Labels and Instructions; Keyboard Access',     'PASS',   'PENDING', 'PENDING', 'Automated – Review & Payment summary page loaded successfully'],
    [17, 'Confirm the order',                                    'Able to confirm T&Cs and able to confirm the order',                         'Keyboard Access; Focus Management; Forms; Name; Role; Value',         'MANUAL', 'MANUAL',  'MANUAL',  '⚠️ Reseller must be pre-assigned in Staging 2 DB for Place Order button to activate'],
    [18, 'Review order confirmation',                            'Order confirmation heading and order number are announced clearly',           'Page Structure; Information; Headings and Labels; Keyboard Access',   'MANUAL', 'MANUAL',  'MANUAL',  '⚠️ Depends on Step 17 manual completion — confirm order number announced by NVDA']
  ];

  // Write data rows starting from row 5
  var dataRange = sheet.getRange(5, 1, data.length, 8);
  dataRange.setValues(data);

  // Row styling
  for (var i = 0; i < data.length; i++) {
    var row = i + 5;
    var rowBg = (i % 2 === 0) ? '#0d1117' : '#161b22';
    sheet.getRange(row, 1, 1, 8).setBackground(rowBg);
    sheet.getRange(row, 1, 1, 8).setFontColor('#c9d1d9');
    sheet.getRange(row, 1, 1, 8).setFontSize(9);
    sheet.getRange(row, 1, 1, 8).setVerticalAlignment('middle');
    sheet.setRowHeight(row, 50);

    // Step number cell
    sheet.getRange(row, 1).setFontWeight('bold').setFontColor('#e0533c').setHorizontalAlignment('center').setFontSize(11);

    // Colour-code status cells: columns 5 (Desktop), 6 (iPhone), 7 (NVDA)
    var statusCols = [5, 6, 7];
    for (var s = 0; s < statusCols.length; s++) {
      var cell = sheet.getRange(row, statusCols[s]);
      var val = data[i][statusCols[s] - 1];
      cell.setHorizontalAlignment('center').setFontWeight('bold');
      if (val === 'PASS') {
        cell.setBackground('#1a4731').setFontColor('#3fb950');
      } else if (val === 'FAIL') {
        cell.setBackground('#3d1b1b').setFontColor('#f85149');
      } else if (val === 'MANUAL') {
        cell.setBackground('#2d2052').setFontColor('#a78bfa');
      } else {
        cell.setBackground('#21262d').setFontColor('#8b949e');
      }
    }

    // Notes column wrap text
    sheet.getRange(row, 8).setWrap(true).setFontSize(8).setFontColor('#8896a8');
    sheet.getRange(row, 2).setWrap(true);
    sheet.getRange(row, 3).setWrap(true);
    sheet.getRange(row, 4).setWrap(true).setFontSize(8).setFontColor('#8b949e');
  }

  // ── FREEZE HEADER ROWS ──────────────────────────────────────────────────────
  sheet.setFrozenRows(4);
  sheet.setFrozenColumns(1);

  // ── RUN COMMANDS SHEET ──────────────────────────────────────────────────────
  var cmdSheet = ss.insertSheet('Run Commands');
  cmdSheet.setColumnWidth(1, 200);
  cmdSheet.setColumnWidth(2, 700);

  var cmdTitle = cmdSheet.getRange('A1:B1');
  cmdTitle.merge();
  cmdTitle.setValue('GlobeWest Staging 2 — Playwright Run Commands');
  cmdTitle.setBackground('#e0533c');
  cmdTitle.setFontColor('#ffffff');
  cmdTitle.setFontSize(13);
  cmdTitle.setFontWeight('bold');
  cmdTitle.setHorizontalAlignment('center');
  cmdTitle.setVerticalAlignment('middle');
  cmdSheet.setRowHeight(1, 45);

  var cmdHeaders = [['Device / Mode', 'Command (run in C:\\GlobeWest 2026\\)']];
  cmdSheet.getRange('A2:B2').setValues(cmdHeaders);
  cmdSheet.getRange('A2:B2').setBackground('#30363d').setFontColor('#58a6ff').setFontWeight('bold').setFontSize(10);
  cmdSheet.setRowHeight(2, 35);

  var cmds = [
    ['Desktop Chrome (Headed)',        'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --headed --workers=1'],
    ['iPhone 17 Pro (Headed)',          'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=mobile-iphone17pro --headed --workers=1'],
    ['Both Devices Together',           'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --project=mobile-iphone17pro --headed --workers=1'],
    ['NVDA (Run with NVDA active)',     'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --headed --workers=1'],
    ['Desktop Chrome (Headless/CI)',    'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --workers=1'],
    ['iPhone 17 Pro (Headless/CI)',     'npx playwright test tests/staging2-critical-path-nvda.spec.js --project=mobile-iphone17pro --workers=1'],
    ['View HTML Report After Run',      'npx playwright show-report'],
  ];

  var cmdBgs = ['#1a4731', '#2d2052', '#21262d', '#3d2400', '#1c2128', '#2d2052', '#21262d'];
  var cmdFgs = ['#3fb950', '#a78bfa', '#8b949e', '#fbbf24', '#c9d1d9', '#a78bfa', '#8b949e'];

  for (var c = 0; c < cmds.length; c++) {
    var r = c + 3;
    cmdSheet.setRowHeight(r, 40);
    cmdSheet.getRange(r, 1).setValue(cmds[c][0]).setBackground(cmdBgs[c]).setFontColor(cmdFgs[c]).setFontWeight('bold').setFontSize(9).setVerticalAlignment('middle').setHorizontalAlignment('center');
    cmdSheet.getRange(r, 2).setValue(cmds[c][1]).setBackground('#0d1117').setFontColor('#93c5fd').setFontFamily('Courier New').setFontSize(9).setVerticalAlignment('middle').setWrap(true);
  }

  // ── MANUAL CHECKS SHEET ─────────────────────────────────────────────────────
  var manualSheet = ss.insertSheet('Manual Check Areas');
  manualSheet.setColumnWidth(1, 100);
  manualSheet.setColumnWidth(2, 280);
  manualSheet.setColumnWidth(3, 350);
  manualSheet.setColumnWidth(4, 200);

  var manualTitle = manualSheet.getRange('A1:D1');
  manualTitle.merge();
  manualTitle.setValue('GlobeWest Staging 2 — Manual Check Areas (Cannot Be Automated)');
  manualTitle.setBackground('#3d2400').setFontColor('#fbbf24').setFontSize(13).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle');
  manualSheet.setRowHeight(1, 45);

  manualSheet.getRange('A2:D2').setValues([['Step', 'Action', 'Why Manual?', 'Tester Result']]);
  manualSheet.getRange('A2:D2').setBackground('#30363d').setFontColor('#58a6ff').setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center');
  manualSheet.setRowHeight(2, 35);

  var manualData = [
    [10, 'Enter "name your order" and "client name"',  'B2B customer checkout fields — Requires a logged-in B2B account. CAPTCHA blocks automation. Check field label announcement and input echo in NVDA.', ''],
    [17, 'Confirm the order (Place Order)',              'Reseller must be pre-assigned in Staging 2 database. The Place Order button is not enabled until a valid reseller is assigned. Verify T&Cs checkbox and button keyboard access.', ''],
    [18, 'Review order confirmation page',               'Depends on Step 17 manual completion. Verify that NVDA reads the order confirmation heading and order number clearly.', ''],
  ];

  for (var m = 0; m < manualData.length; m++) {
    var mr = m + 3;
    manualSheet.setRowHeight(mr, 70);
    manualSheet.getRange(mr, 1).setValue(manualData[m][0]).setBackground('#3d2400').setFontColor('#fbbf24').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setFontSize(12);
    manualSheet.getRange(mr, 2).setValue(manualData[m][1]).setBackground('#1c2128').setFontColor('#c9d1d9').setFontSize(10).setVerticalAlignment('middle').setWrap(true);
    manualSheet.getRange(mr, 3).setValue(manualData[m][2]).setBackground('#0d1117').setFontColor('#8896a8').setFontSize(9).setVerticalAlignment('middle').setWrap(true);
    manualSheet.getRange(mr, 4).setValue(manualData[m][3]).setBackground('#161b22').setFontColor('#3fb950').setFontSize(10).setVerticalAlignment('middle').setWrap(true).setBorder(true, true, true, true, false, false, '#30363d', SpreadsheetApp.BorderStyle.SOLID);
  }

  // ── Navigate back to main sheet ─────────────────────────────────────────────
  ss.setActiveSheet(sheet);

  // ── LOG URL ──────────────────────────────────────────────────────────────────
  var url = ss.getUrl();
  Logger.log('✅ GlobeWest Staging 2 Google Sheet created!');
  Logger.log('🔗 URL: ' + url);

  // Show a popup in the browser with the URL
  SpreadsheetApp.getUi().alert(
    '✅ GlobeWest Staging 2 Sheet Created!\n\n🔗 URL:\n' + url + '\n\nThis sheet has been saved to your Google Drive.\nShare this URL with your team!'
  );

  return url;
}
