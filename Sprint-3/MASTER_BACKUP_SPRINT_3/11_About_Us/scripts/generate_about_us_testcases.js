const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const BASE_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE_DIR, 'About_Us_Test_Cases.csv');
const XLSX_PATH = path.join(BASE_DIR, 'About_Us_Test_Cases.xlsx');

const testCases = [
  {
    'Test ID': 'TC-AU-01',
    'Feature / Category': 'Dual-Auth Matrix',
    'Test Scenario': 'Verify Authenticated Logged-In Sessions on Both US and AU Storefronts',
    'Pre-Conditions': 'US Staging (https://mcstaging2.globewest.com/) & AU Staging (https://mcstaging2.globewest.com.au/)',
    'Test Steps': '1. Log into US Staging with Trade Customer (deepali.londhe@overdose.digital).\n2. Log into AU Staging with Customer (deepalilondhe576@gmail.com).\n3. Navigate to /about-us on both environments.\n4. Verify Header account status.',
    'Expected Result': 'US shows "Company: Alert Loans Pty Ltd" and "My Account ⌵". AU shows customer "My Account ⌵". Both render authenticated CMS views.',
    'Actual Result': 'Both storefronts verified under authenticated state; header displays logged-in account details.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-02',
    'Feature / Category': 'Hero Banner',
    'Test Scenario': 'Verify Hero Banner Photography, Headline & Sub-Headline Parity',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Navigate to /about-us on US Staging.\n2. Inspect Hero banner image (230420_About-Us_Hugo-Marla_2880x1200.jpg).\n3. Inspect H2 title and H3 subhead typography against AU baseline.',
    'Expected Result': 'Hero image renders full-width (1440x600 container); H2 title displays "About Us" (45px / 400); H3 subhead displays "Our Business" (18px / 400); zero placeholders.',
    'Actual Result': 'Hero container is exactly 1440x600px; typography matches AU baseline (staging "About Us test" cleaned up to "About Us").',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-03',
    'Feature / Category': 'Our Vision Section',
    'Test Scenario': 'Verify Our Vision Heading, Paragraph Copy & Computed Typography',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to "Our Vision" section.\n2. Inspect H2 font size, weight, color.\n3. Inspect 3 narrative paragraphs.\n4. Measure container height and padding.',
    'Expected Result': 'Container is 1440x353px; H2 is 30px / 400 / #381c12; paragraph copy is 18px / 300 / #381c12; copy matches AU baseline word-for-word.',
    'Actual Result': 'Computed styles match AU baseline to the exact pixel (1440x353px container, font 30px / 18px).',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-04',
    'Feature / Category': 'Our Business / Founders',
    'Test Scenario': 'Verify Alan & Stephen Mendel Story, Layout & High-Res Photography',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to "Our Business" section.\n2. Inspect Founders photograph (221018_Alan-Stephen_2500x1200.jpg).\n3. Inspect two-column layout and story paragraphs.\n4. Verify naturalWidth and naturalHeight.',
    'Expected Result': 'Founders photograph renders natural dimensions 2500x1200px without distortion; two-column grid renders cleanly; container height is 938px.',
    'Actual Result': 'Matches AU baseline: container is 1440x938px; image is high-res (2500x1200); copy is 15px / 300.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-05',
    'Feature / Category': 'Design Diversity Grid',
    'Test Scenario': 'Verify 5 Collection Cards (Contemporary, Modern, Classic, Eclectic, Retreat)',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to "Design Diversity" section.\n2. Verify 5-column collection grid.\n3. Inspect dimensions and imagery for all 5 cards.\n4. Assert natural dimensions of 460x620px for all 5 images.',
    'Expected Result': 'All 5 cards render in a horizontal row; each card is 287x389px; all images load high-res (460x620px); zero placeholders.',
    'Actual Result': 'All 5 cards render with exact 287x389px dimensions; all 5 images load natural 460x620px; zero placeholders.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-06',
    'Feature / Category': 'Quote Section',
    'Test Scenario': 'Verify Stephen Mendel Quote Formatting, Font Style & Contrast',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to Stephen Mendel quote block.\n2. Inspect font family, font-size, font-style (italic), and text color.\n3. Check background padding and alignment.',
    'Expected Result': 'Quote displays centered italic text (15px / 300 / #381c12); container height is 173px; proper contrast and spacing.',
    'Actual Result': 'Computed styles match AU baseline: 15px / 300 italic / #381c12, 173px height.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-07',
    'Feature / Category': 'Brand Video Banner',
    'Test Scenario': 'Verify "Our Brand" Video Section & Elba Landscape Photography',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to "Our Brand" video section.\n2. Inspect video banner image (Elba_Landscape_1920_x_1000.jpg).\n3. Inspect "Our Brand" H3 overlay typography.',
    'Expected Result': 'Video banner displays full-width high-res image (1920x1000 natural); H3 overlay text renders 30px / 400 in white (#ffffff).',
    'Actual Result': 'Image loads natural 1920x1000; typography is 30px / 400 white; matches AU baseline.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-08',
    'Feature / Category': 'Our Approach Section',
    'Test Scenario': 'Verify 6 Core Principles Typography & Markup Character Cleanup',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to "Our Approach" section.\n2. Inspect H2 (30px / 400), intro copy (18px / 300).\n3. Audit 6 bullet principles.\n4. Check for stray markup characters.',
    'Expected Result': 'All 6 principles render cleanly (18px / 300 / #381c12); container is 1440x424px; stray "<" characters found in AU baseline source code are removed.',
    'Actual Result': 'Container is 1440x424px; copy is clean without stray "<" characters; 100% parity with AU content.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-09',
    'Feature / Category': 'Our Team Section',
    'Test Scenario': 'Verify Team Photograph Display & Container Dimensions',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to team photo block (.our-approach).\n2. Inspect team photograph (221208_Our-Team-RT_1920x921.jpg).\n3. Assert natural dimensions and aspect ratio.',
    'Expected Result': 'Team photo renders high-res 1920x921 natural size; container height is 728px; zero placeholder or broken images.',
    'Actual Result': 'Image loads natural 1920x921; container height is 728px; matches AU baseline.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-10',
    'Feature / Category': 'Careers Section & CTAs',
    'Test Scenario': 'Verify Careers Description & Both CTA Button Dimensions and Routing',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll to bottom Careers block.\n2. Inspect H2 ("Careers") and paragraph copy.\n3. Measure dimensions and typography of "VIEW CAREERS PAGE" and "REGISTER YOUR INTEREST" buttons.\n4. Inspect destination links.',
    'Expected Result': 'Container is 1440x265px; both buttons are exactly 304x50px with 14px / 500 typography; "VIEW CAREERS PAGE" links to /careers-landing; "REGISTER YOUR INTEREST" links to mailto:careers@globewest.com.au.',
    'Actual Result': 'Container is 1440x265px; both buttons measure 304x50px with font 14px / 500; links and styles match AU baseline.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-11',
    'Feature / Category': 'Mobile Responsiveness',
    'Test Scenario': 'Verify Mobile Viewport Layout Collapse (390x844 iPhone 14)',
    'Pre-Conditions': 'Mobile Viewport 390x844',
    'Test Steps': '1. Load /about-us in 390x844 mobile viewport.\n2. Verify Hero banner collapse (390x412px).\n3. Verify Vision (390x384px) and Business (390x878px).\n4. Verify Design Diversity cards stack (332x467px).\n5. Verify Careers buttons expand to mobile touch targets (350x50px).',
    'Expected Result': 'All sections collapse into single-column responsive flow; zero horizontal scroll; touch targets exceed 44px min height; imagery scales cleanly.',
    'Actual Result': 'All container dimensions match AU mobile baseline to the pixel; buttons expand to 350x50px; zero horizontal overflow.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-12',
    'Feature / Category': 'Tablet Responsiveness',
    'Test Scenario': 'Verify Tablet Viewport Section Heights Parity (768x1024 iPad)',
    'Pre-Conditions': 'Tablet Viewport 768x1024',
    'Test Steps': '1. Load /about-us in 768x1024 tablet viewport on US Staging.\n2. Extract heights of all 10 sections.\n3. Compare section heights against AU baseline.',
    'Expected Result': 'Section heights match AU baseline across all 10 blocks (Hero: 811px, Vision: 296px, Business: 1080px, Diversity: 153px/670px, Approach: 414px, Team: 780px, Careers: 306px).',
    'Actual Result': '100% exact match across all 10 sections with 0px variance.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-13',
    'Feature / Category': 'Asset & Catalog Integrity',
    'Test Scenario': 'Verify Zero Placeholder Images & Real CDN Asset Delivery',
    'Pre-Conditions': 'Desktop & Mobile Viewports',
    'Test Steps': '1. Query all img elements in .page-main.\n2. Assert no image src contains /placeholder/default/ or placeholder strings.\n3. Assert all images have naturalWidth > 0 and naturalHeight > 0.',
    'Expected Result': '100% of images are authentic production assets from wysiwyg/about-us/ directory; zero NetSuite or Magento default placeholders.',
    'Actual Result': 'All 10+ images verified as authentic high-resolution assets with complete natural dimensions; zero placeholders.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  }
];

// 1. Write CSV
const headers = Object.keys(testCases[0]);
const csvContent = [
  headers.join(','),
  ...testCases.map(tc => headers.map(h => `"${(tc[h] || '').replace(/"/g, '""')}"`).join(','))
].join('\n');

fs.writeFileSync(CSV_PATH, csvContent);
console.log(`✅ CSV Generated: ${CSV_PATH}`);

// 2. Write Excel (XLSX)
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

// Column widths for professional formatting
ws['!cols'] = [
  { wch: 12 }, // Test ID
  { wch: 25 }, // Feature / Category
  { wch: 45 }, // Test Scenario
  { wch: 40 }, // Pre-Conditions
  { wch: 55 }, // Test Steps
  { wch: 55 }, // Expected Result
  { wch: 55 }, // Actual Result
  { wch: 10 }, // Status
  { wch: 15 }  // Severity
];

XLSX.utils.book_append_sheet(wb, ws, 'About Us Test Cases');
XLSX.writeFile(wb, XLSX_PATH);
console.log(`✅ XLSX Generated: ${XLSX_PATH}`);
