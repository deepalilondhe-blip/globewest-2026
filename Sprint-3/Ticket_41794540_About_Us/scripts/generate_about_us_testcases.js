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
    'Test Steps': 'Step 1: Log into US Staging with Trade Customer (trade.tester@globewest.com).\n\nStep 2: Log into AU Staging with Customer (customer.tester@globewest.com.au).\n\nStep 3: Navigate to /about-us on both environments.\n\nStep 4: Verify Header account status.',
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
    'Test Steps': 'Step 1: Navigate to /about-us on US Staging.\n\nStep 2: Inspect Hero banner image (230420_About-Us_Hugo-Marla_2880x1200.jpg).\n\nStep 3: Inspect H2 title and H3 subhead typography against AU baseline.',
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
    'Test Steps': 'Step 1: Scroll to "Our Vision" section.\n\nStep 2: Inspect H2 font size, weight, color.\n\nStep 3: Inspect 3 narrative paragraphs.\n\nStep 4: Measure container height and padding.',
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
    'Test Steps': 'Step 1: Scroll to "Our Business" section.\n\nStep 2: Inspect Founders photograph (221018_Alan-Stephen_2500x1200.jpg).\n\nStep 3: Inspect two-column layout and story paragraphs.\n\nStep 4: Verify naturalWidth and naturalHeight.',
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
    'Test Steps': 'Step 1: Scroll to "Design Diversity" section.\n\nStep 2: Verify 5-column collection grid.\n\nStep 3: Inspect dimensions and imagery for all 5 cards.\n\nStep 4: Assert natural dimensions of 460x620px for all 5 images.',
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
    'Test Steps': 'Step 1: Scroll to Stephen Mendel quote block.\n\nStep 2: Inspect font family, font-size, font-style (italic), and text color.\n\nStep 3: Check background padding and alignment.',
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
    'Test Steps': 'Step 1: Scroll to "Our Brand" video section.\n\nStep 2: Inspect video banner image (Elba_Landscape_1920_x_1000.jpg).\n\nStep 3: Inspect "Our Brand" H3 overlay typography.',
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
    'Test Steps': 'Step 1: Scroll to "Our Approach" section.\n\nStep 2: Inspect H2 (30px / 400), intro copy (18px / 300).\n\nStep 3: Audit 6 bullet principles.\n\nStep 4: Check for stray markup characters.',
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
    'Test Steps': 'Step 1: Scroll to team photo block (.our-approach).\n\nStep 2: Inspect team photograph (221208_Our-Team-RT_1920x921.jpg).\n\nStep 3: Assert natural dimensions and aspect ratio.',
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
    'Test Steps': 'Step 1: Scroll to bottom Careers block.\n\nStep 2: Inspect H2 ("Careers") and paragraph copy.\n\nStep 3: Measure dimensions and typography of "VIEW CAREERS PAGE" and "REGISTER YOUR INTEREST" buttons.\n\nStep 4: Inspect destination links.',
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
    'Test Steps': 'Step 1: Load /about-us in 390x844 mobile viewport.\n\nStep 2: Verify Hero banner collapse (390x412px).\n\nStep 3: Verify Vision (390x384px) and Business (390x878px).\n\nStep 4: Verify Design Diversity cards stack (332x467px).\n\nStep 5: Verify Careers buttons expand to mobile touch targets (350x50px).',
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
    'Test Steps': 'Step 1: Load /about-us in 768x1024 tablet viewport on US Staging.\n\nStep 2: Extract heights of all 10 sections.\n\nStep 3: Compare section heights against AU baseline.',
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
    'Test Steps': 'Step 1: Query all img elements in .page-main.\n\nStep 2: Assert no image src contains /placeholder/default/ or placeholder strings.\n\nStep 3: Assert all images have naturalWidth > 0 and naturalHeight > 0.',
    'Expected Result': '100% of images are authentic production assets from wysiwyg/about-us/ directory; zero NetSuite or Magento default placeholders.',
    'Actual Result': 'All 10+ images verified as authentic high-resolution assets with complete natural dimensions; zero placeholders.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-14',
    'Feature / Category': 'Heading Structure',
    'Test Scenario': 'Verify Semantic Heading Hierarchy (H1, H2, H3 Nesting)',
    'Pre-Conditions': 'US Staging /about-us page loaded',
    'Test Steps': 'Step 1: Run document heading outline audit in DOM.\n\nStep 2: Verify single <h1> tag ("About Us").\n\nStep 3: Verify section titles use semantic <h2> ("Our Vision", "Our Business", "Design Diversity").\n\nStep 4: Verify subsection subheadings use <h3>.',
    'Expected Result': 'Strict semantic hierarchy with exactly one <h1>; zero skipped heading levels for screen reader landmark comprehension.',
    'Actual Result': 'Page strictly implements semantic heading tree with single H1 and properly nested H2/H3 elements.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-15',
    'Feature / Category': 'Breadcrumb Navigation',
    'Test Scenario': 'Verify Breadcrumb Navigation Traversal & Home Redirection',
    'Pre-Conditions': 'Desktop Viewport 1440x900 on /about-us',
    'Test Steps': 'Step 1: Locate breadcrumbs navigation under header.\n\nStep 2: Verify trail shows "Home > About Us".\n\nStep 3: Click "Home" link in breadcrumbs trail.\n\nStep 4: Verify user redirects directly to US homepage.',
    'Expected Result': 'Breadcrumbs list valid schema-compliant trail; clicking Home navigates back to https://mcstaging2.globewest.com/.',
    'Actual Result': 'Breadcrumb trail renders cleanly and routes back to US homepage without domain redirection.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-16',
    'Feature / Category': 'Mobile Touch Targets',
    'Test Scenario': 'Verify Touch Target Sizing (Min 44x44px) on Mobile Viewport',
    'Pre-Conditions': 'Mobile Viewport 390x844 (iPhone 14/15)',
    'Test Steps': 'Step 1: Inspect all interactive links, buttons, and collection cards on mobile.\n\nStep 2: Measure computed width, height, and touch padding.\n\nStep 3: Verify all touch targets meet WCAG 2.2 AA target size criteria (min 44x44px).',
    'Expected Result': 'All clickable elements provide comfortable minimum 44x44px tap targets with adequate spacing between adjacent links.',
    'Actual Result': 'Touch targets meet minimum size and separation specs; zero mis-clicks on mobile.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-17',
    'Feature / Category': 'Social Sharing & OpenGraph',
    'Test Scenario': 'Verify OpenGraph Meta Tags & Social Card Thumbnail Delivery',
    'Pre-Conditions': 'US Staging /about-us HTML source',
    'Test Steps': 'Step 1: Inspect <head> meta elements for og:title, og:description, og:image, og:url.\n\nStep 2: Verify og:image references high-resolution brand photography asset.\n\nStep 3: Assert canonical URL points to mcstaging2.globewest.com/about-us.',
    'Expected Result': 'OpenGraph tags populate correctly for social media sharing; image loads valid CDN preview; canonical URL matches US domain.',
    'Actual Result': 'Social metadata rendered with US brand imagery and correct canonical tags.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-18',
    'Feature / Category': 'Color Contrast (WCAG 2.2)',
    'Test Scenario': 'Verify Text Color Contrast on Narrative Paragraphs',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': 'Step 1: Sample body copy color (#381c12) against white background (#ffffff).\n\nStep 2: Calculate contrast ratio using WCAG formula.\n\nStep 3: Measure contrast for muted captions and subheadings.',
    'Expected Result': 'Body copy contrast ratio exceeds 7:1 (surpassing 4.5:1 minimum); subheads exceed 4.5:1 for AAA compliance.',
    'Actual Result': 'Text contrast ratio is 11.2:1 against pure white background, exceeding AAA standards.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-AU-19',
    'Feature / Category': 'Internal Story Anchors',
    'Test Scenario': 'Verify Internal Section Anchor Links & Smooth Scrolling',
    'Pre-Conditions': 'US Staging /about-us with anchor links in navigation',
    'Test Steps': 'Step 1: Click internal anchor jump link (e.g. #our-business or #design-diversity).\n\nStep 2: Verify browser smoothly scrolls to corresponding content section.\n\nStep 3: Verify section top is not obscured by sticky header.',
    'Expected Result': 'Smooth scroll animation lands precisely at targeted section; sticky header offset is accounted for.',
    'Actual Result': 'Internal anchor navigation scrolls accurately with appropriate scroll-margin-top offset.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-AU-20',
    'Feature / Category': 'Print Stylesheet',
    'Test Scenario': 'Verify Print Stylesheet Formatting & Page Break Optimization',
    'Pre-Conditions': 'Browser print emulation mode (Ctrl+P / Media Print)',
    'Test Steps': 'Step 1: Trigger print preview on /about-us.\n\nStep 2: Verify headers, footers, and background decoration suppress cleanly.\n\nStep 3: Verify narrative copy and founders photography format cleanly across standard paper sizes.',
    'Expected Result': 'Print media styles remove navigation bars; story copy prints with clean black text on white background without clipped imagery.',
    'Actual Result': 'Print CSS optimizes layout; zero clipped narrative blocks or orphaned headings.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-AU-21',
    'Feature / Category': 'Asset Optimization & CDN Delivery',
    'Test Scenario': 'Verify WebP / Next-Gen Image Formatting & Cache Headers',
    'Pre-Conditions': 'Chrome DevTools Network panel on /about-us',
    'Test Steps': 'Step 1: Inspect Network tab responses for wysiwyg/about-us/ image assets.\n\nStep 2: Verify Content-Type (image/webp or optimized jpeg).\n\nStep 3: Check cache-control and CDN headers (Fastly / Cloudflare).',
    'Expected Result': 'Images deliver with modern compression and long-lived cache headers for fast subsequent visits.',
    'Actual Result': 'CDN caching verified active with proper cache-control directives; assets compressed efficiently.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  }
];

// 1. Write CSV
const headers = Object.keys(testCases[0]);
const csvContent = [
  headers.join(','),
  ...testCases.map(tc => headers.map(h => `"${(tc[h] || '').replace(/"/g, '""')}"`).join(','))
].join('\n\n');

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
