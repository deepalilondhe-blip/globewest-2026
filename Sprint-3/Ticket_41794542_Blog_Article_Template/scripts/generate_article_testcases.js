const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const BASE_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE_DIR, 'Blog_Article_Template_Test_Cases.csv');
const XLSX_PATH = path.join(BASE_DIR, 'Blog_Article_Template_Test_Cases.xlsx');

const testCases = [
  // --- Category 1: Dual-Auth Matrix & Price Governance ---
  {
    'Test ID': 'TC-BAT-01',
    'Feature / Category': 'Dual-Auth Matrix',
    'Test Scenario': 'Verify Public / Guest Browsing State (Wholesale Pricing Masked & Registration CTAs)',
    'Pre-Conditions': 'User is logged out / incognito session on US Staging (https://mcstaging2.globewest.com)',
    'Test Steps': '1. Open US Blog Article Template URL while unauthenticated.\n2. Inspect top utility header bar.\n3. Verify wholesale trade pricing is strictly hidden.\n4. Verify presence of "Become a Trade Customer" and "Book Showroom" CTAs.',
    'Expected Result': 'Article loads cleanly in guest mode. Wholesale trade prices are completely masked. Top utility bar displays "Become a Trade Customer" and registration links without auth forced redirect.',
    'Actual Result': 'Guest browsing verified. Wholesale pricing remains hidden across all header and flyout elements. Trade CTAs render as expected.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BAT-02',
    'Feature / Category': 'Dual-Auth Matrix',
    'Test Scenario': 'Verify Authenticated US Trade Account Access & Account Header Details',
    'Pre-Conditions': 'US Staging login URL (https://mcstaging2.globewest.com/customer/account/login/)',
    'Test Steps': '1. Log into US Staging with US Trade credentials (deepali.londhe@overdose.digital / Deep@123).\n2. Navigate to Blog Article Template URL.\n3. Assert company identification banner and account state.',
    'Expected Result': 'Trade user is authenticated and header renders "Company: Alert Loans Pty Ltd" alongside "Sign Out" and My Account navigation.',
    'Actual Result': 'Trade user successfully authenticated. Header displays active company details ("Alert Loans Pty Ltd") with zero session drops.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BAT-03',
    'Feature / Category': 'Dual-Auth Matrix',
    'Test Scenario': 'Verify Header Pricing Toggle Mode Switcher (Trade Mode vs MSRP Mode)',
    'Pre-Conditions': 'Authenticated US Trade session on US Blog Article Template',
    'Test Steps': '1. Locate header pricing toggle dropdown.\n2. Verify presence of "Trade ⌵" and "MSRP ⌵" options.\n3. Toggle between Trade Mode and MSRP Mode and observe header state.',
    'Expected Result': 'Pricing toggle dropdown allows switching between Trade Mode and MSRP Mode seamlessly across the blog article page.',
    'Actual Result': 'Trade pricing toggle functions correctly in header. Mode selection toggles smoothly without page reload or styling glitches.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-04',
    'Feature / Category': 'Dual-Auth Matrix',
    'Test Scenario': 'Verify AU Baseline Authenticated Session Parity Check',
    'Pre-Conditions': 'AU Staging (https://mcstaging2.globewest.com.au/customer/account/login/)',
    'Test Steps': '1. Log into AU Staging baseline with AU Trade account (deepalilondhe576@gmail.com / Deep@123).\n2. Access AU blog article baseline.\n3. Cross-verify header components and layout parity against US storefront.',
    'Expected Result': 'AU authenticated baseline renders corresponding trade navigation and acts as benchmark for layout and feature parity.',
    'Actual Result': 'AU baseline authenticated successfully. Core navigation and layout parity verified.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },

  // --- Category 2: Hero Header & Banner Structure ---
  {
    'Test ID': 'TC-BAT-05',
    'Feature / Category': 'Hero Header Banner',
    'Test Scenario': 'Verify Full-Width Featured Hero Header Lifestyle Image Presence',
    'Pre-Conditions': 'Desktop Viewport 1440x900 on US Blog Article Template',
    'Test Steps': '1. Navigate to US Blog Article Template URL.\n2. Inspect area directly below site navigation and above breadcrumbs/title.\n3. Compare layout against AU Live article hero banner (Rectangle_Copy.jpg).',
    'Expected Result': 'Full-width lifestyle hero header image renders directly beneath the main navigation bar across the full viewport width.',
    'Actual Result': 'DEFECT: Top hero banner image is completely missing on US Staging. Article title and breadcrumbs sit directly flush beneath header with 0px hero breathing room.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BAT-06',
    'Feature / Category': 'Hero Header Banner',
    'Test Scenario': 'Verify Hero Banner Image Aspect Ratio & Responsive Scaling Across Viewports',
    'Pre-Conditions': 'US Blog Article Template tested at 1440px, 1024px, 768px, and 390px widths',
    'Test Steps': '1. Inspect hero banner container styling and CSS rules.\n2. Resize viewport from desktop to mobile.\n3. Check image object-fit, max-width, and height calculations.',
    'Expected Result': 'Hero container scales proportionally without distortion, keeping focal point centered.',
    'Actual Result': 'BLOCKED: Due to Defect TC-BAT-05 (missing hero banner on US staging), responsive behavior of hero container cannot be validated.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },

  // --- Category 3: Page Hierarchy, Title & Editorial Typography ---
  {
    'Test ID': 'TC-BAT-07',
    'Feature / Category': 'Article Title & Typography',
    'Test Scenario': 'Verify Article H1 Headline Copy Sanitation of Staging Duplication Artifacts',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Locate main H1 page title on US article page.\n2. Inspect text content and verify editorial clarity.\n3. Compare against AU Live title: "Stockist in Profile | IKOS Home".',
    'Expected Result': 'Title displays clean editorial headline: "Stockist in Profile | IKOS Home" with zero staging duplication text.',
    'Actual Result': 'DEFECT: Title displays "Stockist in Profile | IKOS Home (Duplicated) (Duplicated)", polluting editorial quality with staging artifacts.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-08',
    'Feature / Category': 'Article Title & Typography',
    'Test Scenario': 'Verify Article URL-Key Slug Sanitation & Special Character Encoding',
    'Pre-Conditions': 'Browser address bar on US Staging',
    'Test Steps': '1. Inspect browser URL-key slug.\n2. Check for staging duplication suffixes and unencoded pipe characters (%7C).',
    'Expected Result': 'Clean canonical URL slug matching editorial standard: /blog/stockist-in-profile/stockist-in-profile-ikos-home.',
    'Actual Result': 'DEFECT: URL slug contains staging artifacts: /stockist-in-profile-%7C-ikos-home-duplicated.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-09',
    'Feature / Category': 'Breadcrumbs Navigation',
    'Test Scenario': 'Verify Breadcrumb Hierarchy Path, Text Labels, and Active Trail Links',
    'Pre-Conditions': 'US Blog Article Template loaded',
    'Test Steps': '1. Locate breadcrumbs trail above article title.\n2. Verify trail hierarchy: Home > Blog > Stockist in Profile > Stockist in Profile | IKOS Home.\n3. Click "Home" and "Blog" breadcrumbs to verify navigation.',
    'Expected Result': 'Breadcrumb trail accurately mirrors CMS post hierarchy; links resolve internally to US staging URLs.',
    'Actual Result': 'Breadcrumbs render correctly; "Home" and "Blog" links resolve to US store paths.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-10',
    'Feature / Category': 'Meta Information',
    'Test Scenario': 'Verify Article Publishing Date Formatting & Placement',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Inspect date element rendered above or below article title.\n2. Verify format (e.g. "OCT 02, 2026") and computed typography.\n3. Confirm date matches publishing date of article.',
    'Expected Result': 'Date displays clearly in standardized uppercase format (e.g. "OCT 02, 2026") with font-size 13px–14px and muted color.',
    'Actual Result': 'Date element displays "OCT 02, 2026" with correct uppercase styling and font weight.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-11',
    'Feature / Category': 'Meta Information',
    'Test Scenario': 'Verify Article Category Badge / Pill Styling and Link Destination',
    'Pre-Conditions': 'US Blog Article Template loaded',
    'Test Steps': '1. Locate category tag ("STOCKIST IN PROFILE").\n2. Inspect pill border-radius, padding, and text-transform.\n3. Click category link and verify category listing page destination.',
    'Expected Result': 'Category pill renders with capsule styling / letter spacing, linking to US blog category archive.',
    'Actual Result': 'Category tag renders and links internally to /blog/stockist-in-profile.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-12',
    'Feature / Category': 'Meta Information',
    'Test Scenario': 'Verify Byline / Author Attribution & Estimated Reading Time Rendering',
    'Pre-Conditions': 'US Blog Article Template loaded',
    'Test Steps': '1. Inspect author byline section under title.\n2. Verify author name or brand editorial credit.\n3. Verify presence or styling of reading time indicator if enabled in Magefan config.',
    'Expected Result': 'Byline renders cleanly with consistent font-family and styling matching AU baseline.',
    'Actual Result': 'Byline metadata renders in parity with AU baseline.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },

  // --- Category 4: Social Sharing & Engagement ---
  {
    'Test ID': 'TC-BAT-13',
    'Feature / Category': 'Social Sharing',
    'Test Scenario': 'Verify Social Share Bar Icon Rendering (Facebook, Pinterest, X/Twitter)',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Locate "SHARE:" social share block under article header.\n2. Inspect Facebook, Pinterest, and X/Twitter SVG/font icons.\n3. Verify icon dimensions (16px–20px), alignment, and spacing.',
    'Expected Result': 'Share bar renders "SHARE:" label followed by crisp social media icons with clean margins.',
    'Actual Result': 'Facebook, Pinterest, and Twitter icons render sharply with appropriate hover colors.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-14',
    'Feature / Category': 'Social Sharing',
    'Test Scenario': 'Verify Social Share Click Intent URLs & Popup Windows',
    'Pre-Conditions': 'Desktop Viewport with popup blocker disabled',
    'Test Steps': '1. Click Facebook icon and verify sharer.php popup URL.\n2. Click Pinterest icon and verify pin/create URL with article image.\n3. Click Twitter/X icon and verify intent/tweet URL with article title.',
    'Expected Result': 'Each button opens respective social share dialog containing current article URL and title.',
    'Actual Result': 'Share links open valid share intent URLs referencing US article URL.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },

  // --- Category 5: Editorial Body Layout & Content Components ---
  {
    'Test ID': 'TC-BAT-15',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Editorial Lead / Introduction Paragraph Typography & Line Height',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Locate opening lead paragraph.\n2. Inspect computed font-size (18px–20px), line-height (~1.6), and text-align.\n3. Check centered or left-aligned layout matching AU baseline.',
    'Expected Result': 'Lead paragraph renders with prominent font size, generous line-height, and editorial spacing.',
    'Actual Result': 'Lead paragraph typography aligns with AU design baseline.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-16',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Two-Column Page Builder Grid Structure (Interview Layout)',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Scroll down through article body.\n2. Verify 2-column Page Builder grid: Left column (imagery) and Right column (Q&A text).\n3. Check column gap and gutter margins.',
    'Expected Result': 'Two-column grid renders cleanly without overlapping containers or broken flex/grid wrappers.',
    'Actual Result': 'Two-column Magefan Page Builder structure renders with left photography and right Q&A text.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-17',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Inset Lifestyle Photography High-Resolution Display & Aspect Ratio',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Inspect all embedded photography in left and right body columns.\n2. Check naturalWidth vs clientWidth to verify image resolution.\n3. Check aspect ratios and confirm images are not stretched or pixelated.',
    'Expected Result': 'High-resolution lifestyle interior photography renders with crisp detail and natural proportions.',
    'Actual Result': 'Body lifestyle images render sharply with high natural resolution (e.g. 1200px+ width).',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-18',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Editorial Headings & Subheadings Hierarchy (H2, H3, H4)',
    'Pre-Conditions': 'Article body scrolled into view',
    'Test Steps': '1. Inspect Q&A question headings in interview body.\n2. Verify semantic heading tags (H2/H3/H4) and font weights (600/700).\n3. Check margin-top and margin-bottom separation from paragraphs.',
    'Expected Result': 'Headings maintain consistent editorial hierarchy and comfortable margin spacing.',
    'Actual Result': 'Interview question headings render with consistent typography and margin separation.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-19',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Blockquote / Pull Quote Stylistic Formatting & Accent Borders',
    'Pre-Conditions': 'Article body containing editorial pull quote',
    'Test Steps': '1. Locate pull quote in editorial body.\n2. Verify font styling (italic / serif / stylized display font).\n3. Inspect quotation marks or left accent border.',
    'Expected Result': 'Pull quotes are styled distinctly from body copy with appropriate margins and italic styling.',
    'Actual Result': 'Editorial quotes render with styled typography matching AU layout.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-20',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Stockist Details & Location Callout Box Formatting',
    'Pre-Conditions': 'Scroll to stockist info section at bottom of body',
    'Test Steps': '1. Inspect stockist information callout container.\n2. Check business name, address, phone number, and opening hours.\n3. Verify container padding and border styling.',
    'Expected Result': 'Stockist details render in a well-defined card/box with clean spacing and clear typography.',
    'Actual Result': 'Stockist profile info renders cleanly in dedicated container.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-21',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify "FIND A STOCKIST" CTA Button Styling & URL Destination',
    'Pre-Conditions': 'Stockist section in view',
    'Test Steps': '1. Locate primary "FIND A STOCKIST" CTA button.\n2. Verify pill/box button styling, hover state, and cursor.\n3. Click button and verify destination URL.',
    'Expected Result': 'Button styled to brand guidelines, navigating internally to US store locator (/locator) without AU redirection.',
    'Actual Result': 'CTA button points to internal US path /locator. Button hover styling functions properly.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-22',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Inline Hyperlink Hover Transitions & Color Contrast',
    'Pre-Conditions': 'Editorial body with inline text links',
    'Test Steps': '1. Locate hyperlinked text in interview body.\n2. Hover over links and verify underline transition and color change.\n3. Inspect color contrast ratio against white background.',
    'Expected Result': 'Links have distinct styling, visible hover feedback, and meet WCAG AA contrast ratio (>= 4.5:1).',
    'Actual Result': 'Inline links have distinct color and hover underline transitions.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BAT-23',
    'Feature / Category': 'Editorial Content Body',
    'Test Scenario': 'Verify Copy Scope & Localization Sanitization (Australian Data Leaks)',
    'Pre-Conditions': 'Full article text audit',
    'Test Steps': '1. Inspect editorial copy for Australian phone numbers, postcodes, or domain leaks.\n2. Check stockist address: "Hampton VIC 3188" and phone "(03) 9521 0000".\n3. Check for mentions of Australian states or .com.au links.',
    'Expected Result': 'Sample content should be localized for US storefront or flagged as an Australian demo fixture.',
    'Actual Result': 'CONTENT NOTE: Body text contains Australian address ("Hampton VIC 3188") and AU phone. Acceptable as imported sample post, but recommended to update with US partner.',
    'Status': 'PASS (with Content Note)',
    'Severity': 'P3 - Low'
  },

  // --- Category 6: Bottom Blog Slider / Fresh Ideas Carousel ---
  {
    'Test ID': 'TC-BAT-24',
    'Feature / Category': 'Bottom Blog Slider',
    'Test Scenario': 'Verify Card Thumbnail Image Rendering & Asset Integrity (.home-page-fresh-ideas)',
    'Pre-Conditions': 'Desktop Viewport 1440x900, scroll to bottom section',
    'Test Steps': '1. Scroll to newly added "Inspiring Trends & Directions" section at bottom of article.\n2. Inspect each card thumbnail <img> element in .home-page-fresh-ideas.\n3. Measure computed height and natural dimensions in browser console.',
    'Expected Result': 'All 5 article cards render high-resolution thumbnail images (height ~260px–300px) above titles/categories.',
    'Actual Result': 'DEFECT: All card thumbnail images have computed height: 0px (naturalWidth: 0). Cards show only text labels on blank beige background.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BAT-25',
    'Feature / Category': 'Bottom Blog Slider',
    'Test Scenario': 'Verify Article Card Titles, Category Tags & Date Alignment in Slider',
    'Pre-Conditions': 'Bottom blog slider in view',
    'Test Steps': '1. Inspect card text content under thumbnails.\n2. Verify card category pill ("DESIGNER IN PROFILE", "COLLECTION", etc.).\n3. Verify card headline truncation or multi-line wrapping.',
    'Expected Result': 'Card titles wrap neatly with uniform line-height; category tags display consistent pill styling.',
    'Actual Result': 'Card text and categories render, but visually float awkwardly due to collapsed 0px thumbnail images above them.',
    'Status': 'PASS (Text layout only)',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-26',
    'Feature / Category': 'Bottom Blog Slider',
    'Test Scenario': 'Verify Carousel Navigation Arrows & Swiper/Slick Track Controls',
    'Pre-Conditions': 'Bottom blog slider in view at 1440x900',
    'Test Steps': '1. Inspect slider container for left and right carousel arrow buttons.\n2. Attempt clicking next/previous arrows to cycle through posts.\n3. Compare against AU Live slider navigation controls.',
    'Expected Result': 'Slider provides smooth horizontal carousel navigation with interactive left/right arrows and responsive card tracks.',
    'Actual Result': 'DEFECT: Slider lacks carousel arrows and renders as a static, broken grid with overlapping divider lines.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-27',
    'Feature / Category': 'Bottom Blog Slider',
    'Test Scenario': 'Verify Carousel Touch Swipe & Drag Interaction on Touch Viewports',
    'Pre-Conditions': 'Mobile / Tablet touch viewport emulator',
    'Test Steps': '1. Perform horizontal drag / swipe gesture across slider cards.\n2. Verify track responds with fluid momentum scrolling.\n3. Ensure swipe gesture does not trigger unintended article navigation.',
    'Expected Result': 'Carousel slides smoothly upon touch drag with appropriate friction and snap-to-slide physics.',
    'Actual Result': 'BLOCKED: Missing interactive carousel arrows and collapsed image dimensions impair swiper track behavior.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-28',
    'Feature / Category': 'Bottom Blog Slider',
    'Test Scenario': 'Verify Card Hover States & Micro-Zoom Animations',
    'Pre-Conditions': 'Desktop Viewport with mouse cursor',
    'Test Steps': '1. Hover mouse over individual slider cards.\n2. Observe image scale transform (micro-zoom ~1.05x).\n3. Check cursor pointer feedback on card container.',
    'Expected Result': 'Hovering triggers subtle image zoom transition and title color change with cursor pointer.',
    'Actual Result': 'BLOCKED: Cannot test image micro-zoom because thumbnail images render at 0px height.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-29',
    'Feature / Category': 'Bottom Blog Slider',
    'Test Scenario': 'Verify Card Click-Through Navigation to Target Blog Articles',
    'Pre-Conditions': 'Bottom blog slider in view',
    'Test Steps': '1. Click on card title and container of card #1 ("Designer in Profile | Studio Yugen").\n2. Verify browser navigates to correct target article URL on US Staging.\n3. Confirm zero redirection to Australian domain.',
    'Expected Result': 'Clicking card navigates directly to corresponding US staging blog article without 404 or redirect error.',
    'Actual Result': 'Card link routes to internal US staging path /blog/designer-in-profile/designer-in-profile-studio-yugen.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },

  // --- Category 7: Reciprocal Sequential Article Navigation ---
  {
    'Test ID': 'TC-BAT-30',
    'Feature / Category': 'Reciprocal Navigation',
    'Test Scenario': 'Verify "Previous Article" Reciprocal Navigation Link Presence & Functionality',
    'Pre-Conditions': 'Scroll to .post-nav bar below the bottom blog slider',
    'Test Steps': '1. Locate sequential post navigation bar at bottom of page.\n2. Look for left-aligned "← PREVIOUS ARTICLE" link.\n3. Compare against AU Live post navigation bar.',
    'Expected Result': 'Both "← PREVIOUS ARTICLE" and "NEXT ARTICLE →" links are visible and reciprocal.',
    'Actual Result': 'DEFECT: "← PREVIOUS ARTICLE" link is completely missing from US Staging. Only "NEXT ARTICLE →" is displayed.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-31',
    'Feature / Category': 'Reciprocal Navigation',
    'Test Scenario': 'Verify "NEXT ARTICLE →" Link Target, Arrow Iconography & Navigation',
    'Pre-Conditions': 'Scroll to .post-nav bar',
    'Test Steps': '1. Inspect "NEXT ARTICLE →" link and right arrow icon.\n2. Hover over link to verify text color / arrow nudge animation.\n3. Click link and confirm navigation to subsequent chronological post.',
    'Expected Result': 'Next link is clearly visible on right, styled with arrow icon, and navigates to the next chronological blog post.',
    'Actual Result': '"NEXT ARTICLE →" link is visible and navigates to subsequent post on US Staging.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },

  // --- Category 8: Responsive Layout & Mobile/Tablet Adaptability ---
  {
    'Test ID': 'TC-BAT-32',
    'Feature / Category': 'Responsive Layout',
    'Test Scenario': 'Verify Desktop Viewport (1440x900 & 1920x1080) Full Layout Integrity',
    'Pre-Conditions': 'Desktop Chrome at 1440x900 and 1920x1080',
    'Test Steps': '1. Load US Blog Article Template on large desktop viewports.\n2. Verify max-width container constraints (centered with side gutters).\n3. Check header, body columns, slider, and footer alignment.',
    'Expected Result': 'Page maintains centered container (e.g. 1440px max-width) without stretching excessively on ultra-wide screens.',
    'Actual Result': 'Desktop container constraints function properly; layout remains centered with consistent margins.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-33',
    'Feature / Category': 'Responsive Layout',
    'Test Scenario': 'Verify Tablet Viewport (768x1024 - iPad) Two-Column Layout Adaptation',
    'Pre-Conditions': 'Tablet Viewport 768x1024 Portrait and Landscape',
    'Test Steps': '1. Switch viewport to 768px width.\n2. Verify 2-column editorial grid behavior (stacks or resizes smoothly).\n3. Inspect tap target sizes for buttons and social icons (minimum 44x44px).',
    'Expected Result': 'Content resizes gracefully; columns maintain readable line lengths; tap targets meet mobile accessibility guidelines.',
    'Actual Result': 'Tablet layout resizes gracefully without horizontal overflow or clipped text.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BAT-34',
    'Feature / Category': 'Responsive Layout',
    'Test Scenario': 'Verify Mobile Viewport (390x844 - iPhone) Single-Column Stacking & Touch Usability',
    'Pre-Conditions': 'Mobile Viewport 390x844 (iPhone 14/15 emulation)',
    'Test Steps': '1. Load US Blog Article Template on mobile viewport.\n2. Verify 2-column layout collapses to single vertical stack (photo then text).\n3. Verify title text wrapping and zero horizontal page scrolling.\n4. Check mobile header hamburger menu and cart icon.',
    'Expected Result': 'Columns collapse into single column; images scale to 100% width; zero horizontal overflow scrollbar; clean mobile reading experience.',
    'Actual Result': 'DEFECT: While columns collapse, the missing hero banner image and title wrapping with "(Duplicated) (Duplicated)" creates jarring visual clutter at top of mobile screen.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },

  // --- Category 9: Technical SEO, Assets & Cross-Cutting Quality ---
  {
    'Test ID': 'TC-BAT-35',
    'Feature / Category': 'Catalog & Asset Integrity',
    'Test Scenario': 'Verify Zero Placeholder Media & Open Graph Head Meta Tags Validation',
    'Pre-Conditions': 'Full Page DOM and HTML <head> inspection',
    'Test Steps': '1. Run automated scan across all <img> elements for "/placeholder/default/".\n2. Inspect HTML <head> tags: <title>, meta description, canonical link, og:image, and og:title.\n3. Verify canonical link matches US staging domain.',
    'Expected Result': 'Zero NetSuite placeholder images present; SEO title and meta description accurately describe the article; Open Graph tags configured.',
    'Actual Result': 'All article body images are genuine editorial photography (no placeholder paths); HTML title and Open Graph tags reflect article post.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  }
];

// Write CSV
const headers = Object.keys(testCases[0]);
const csvRows = [headers.join(',')];
testCases.forEach(tc => {
  const row = headers.map(h => `"${String(tc[h]).replace(/"/g, '""')}"`);
  csvRows.push(row.join(','));
});
fs.writeFileSync(CSV_PATH, csvRows.join('\n'), 'utf8');
console.log(`✅ Successfully generated ${testCases.length} CSV Test Cases at:`, CSV_PATH);

// Write Excel (.xlsx)
const worksheet = XLSX.utils.json_to_sheet(testCases);
// Auto-fit column widths
const colWidths = headers.map(h => {
  let maxLen = h.length;
  testCases.forEach(tc => {
    const val = String(tc[h] || '');
    const firstLine = val.split('\n')[0];
    if (firstLine.length > maxLen) maxLen = Math.min(firstLine.length, 45);
  });
  return { wch: maxLen + 3 };
});
worksheet['!cols'] = colWidths;

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Blog Article Test Cases');
XLSX.writeFile(workbook, XLSX_PATH);
console.log(`✅ Successfully generated ${testCases.length} Excel Test Cases at:`, XLSX_PATH);
