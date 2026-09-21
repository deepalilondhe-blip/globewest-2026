const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Standard QA Test Case Exporter for Sprint-3
 * Exports test case array into both .xlsx and .csv formats
 *
 * @param {Array<Object>} testCases - Array of test case objects
 * @param {string} outputDir - Directory to save files
 * @param {string} baseFileName - Base file name without extension
 */
function exportTestCases(testCases, outputDir, baseFileName) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const ws = XLSX.utils.json_to_sheet(testCases);

  // Set column widths for comfortable Excel readability
  const colWidths = [
    { wch: 14 }, // Test Case ID
    { wch: 18 }, // Feature / Module
    { wch: 22 }, // Auth Matrix
    { wch: 35 }, // Test Scenario
    { wch: 30 }, // Pre-Conditions
    { wch: 45 }, // Test Steps
    { wch: 45 }, // Expected Result (Figma / AU)
    { wch: 45 }, // Actual Result (US Live)
    { wch: 15 }, // Status
    { wch: 40 }, // Defect Summary
    { wch: 35 }  // Visual Evidence
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'QA Test Cases');

  const xlsxPath = path.join(outputDir, `${baseFileName}.xlsx`);
  const csvPath = path.join(outputDir, `${baseFileName}.csv`);

  XLSX.writeFile(wb, xlsxPath);
  const csvData = XLSX.utils.sheet_to_csv(ws);
  fs.writeFileSync(csvPath, csvData, 'utf-8');

  console.log(`[EXPORT] Created Excel sheet: ${xlsxPath}`);
  console.log(`[EXPORT] Created CSV format:  ${csvPath}`);

  return { xlsxPath, csvPath };
}

module.exports = { exportTestCases };
