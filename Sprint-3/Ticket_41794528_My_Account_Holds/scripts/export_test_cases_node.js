const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const csvPath = path.resolve(__dirname, '../My_Holds_Test_Cases.csv');
const xlsxPath = path.resolve(__dirname, '../My_Holds_Test_Cases.xlsx');

const csvData = fs.readFileSync(csvPath, 'utf8');
const workbook = XLSX.read(csvData, { type: 'string' });

XLSX.writeFile(workbook, xlsxPath);
console.log('Successfully created My_Holds_Test_Cases.xlsx from CSV!');
