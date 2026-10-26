const fs = require('fs');
const path = require('path');
const XLSX = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/xlsx');

const BASE_DIR = path.resolve(__dirname, '..');
const CSV_PATH = path.join(BASE_DIR, 'Blog_Index_Page_Test_Cases.csv');
const XLSX_PATH = path.join(BASE_DIR, 'Blog_Index_Page_Test_Cases.xlsx');

const testCases = [
  // --- Category 1: Dual-Auth Matrix & Price Governance ---
  {
    'Test ID': 'TC-BIP-01',
    'Feature / Module': 'Dual-Auth Matrix',
    'Auth Matrix': 'Guest (Logged Out)',
    'Test Scenario': 'Verify Public / Guest Browsing State (Wholesale Pricing Masked & Registration CTAs)',
    'Pre-Conditions': 'User is unauthenticated / incognito session on US Staging (https://mcstaging2.globewest.com/blog)',
    'Test Steps': '1. Open US Blog Index Page URL while logged out.\n2. Inspect top utility header bar.\n3. Verify wholesale trade pricing is strictly hidden.\n4. Verify presence of "Become a Trade Customer" and "Book Showroom" CTAs.',
    'Expected Result (AU / Spec)': 'Blog index loads cleanly in guest mode. Wholesale trade prices are completely masked across header and mini-cart. Registration CTAs active.',
    'Actual Result (US Live)': 'Guest browsing verified. Wholesale pricing remains hidden across all header elements. Trade registration CTAs render correctly.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-02',
    'Feature / Module': 'Dual-Auth Matrix',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Authenticated US Trade Account Access & Account Header Details',
    'Pre-Conditions': 'US Staging login URL (https://mcstaging2.globewest.com/customer/account/login/)',
    'Test Steps': '1. Log into US Staging with Trade credentials (deepali.londhe@overdose.digital / Deep@123).\n2. Navigate to Blog Index URL (/blog).\n3. Assert company identification banner and account state.',
    'Expected Result (AU / Spec)': 'Trade user is authenticated and header renders "Company: Alert Loans Pty Ltd" alongside "Sign Out" and My Account navigation.',
    'Actual Result (US Live)': 'Trade user successfully authenticated. Header displays active company details ("Alert Loans Pty Ltd") with zero session drops.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-03',
    'Feature / Module': 'Dual-Auth Matrix',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify Header Pricing Toggle Mode Switcher (Trade Mode vs MSRP Mode)',
    'Pre-Conditions': 'Authenticated US Trade session on US Blog Index Page',
    'Test Steps': '1. Locate header pricing toggle dropdown.\n2. Verify presence of "Trade ⌵" and "MSRP ⌵" options.\n3. Toggle between Trade Mode and MSRP Mode and observe header state.',
    'Expected Result (AU / Spec)': 'Pricing toggle dropdown allows switching between Trade Mode and MSRP Mode seamlessly across the blog index page.',
    'Actual Result (US Live)': 'Trade pricing toggle functions correctly in header. Mode selection toggles smoothly without page reload or styling glitches.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-04',
    'Feature / Module': 'Dual-Auth Matrix',
    'Auth Matrix': 'Trade Customer (Logged In)',
    'Test Scenario': 'Verify AU Baseline Authenticated Session Parity Check',
    'Pre-Conditions': 'AU Staging (https://mcstaging2.globewest.com.au/customer/account/login/)',
    'Test Steps': '1. Log into AU Staging baseline with AU Trade account (deepalilondhe576@gmail.com / Deep@123).\n2. Access AU blog index baseline (/blog).\n3. Cross-verify header components and layout parity against US storefront.',
    'Expected Result (AU / Spec)': 'AU authenticated baseline renders corresponding trade navigation and acts as benchmark for layout and feature parity.',
    'Actual Result (US Live)': 'AU baseline authenticated successfully. Core navigation and layout parity verified.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },

  // --- Category 2: Hero Featured Banner ---
  {
    'Test ID': 'TC-BIP-05',
    'Feature / Module': 'Hero Featured Banner',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Hero Title Block Background Color Fidelity (.blog-category-banner__left)',
    'Pre-Conditions': 'Desktop Viewport 1440x900 on US Blog Index Page',
    'Test Steps': '1. Inspect left title panel of hero banner (.blog-category-banner__left).\n2. Check window.getComputedStyle().backgroundColor.\n3. Compare against AU Live baseline color.',
    'Expected Result (AU / Spec)': 'The left title block displaying "News" has a light sand/beige background (rgb(208, 193, 164) / #cdc1ab).',
    'Actual Result (US Live)': 'DEFECT: Background renders as dark chocolate brown (rgb(56, 28, 18) / #381c12), breaking approved color harmony.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-06',
    'Feature / Module': 'Hero Featured Banner',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Hero Banner "READ MORE" Primary CTA Link & Domain Scope Isolation',
    'Pre-Conditions': 'Hero banner visible on US Blog Index Page',
    'Test Steps': '1. Inspect "READ MORE" button link inside .blog-category-banner__info.\n2. Check target href attribute.\n3. Click button and verify destination URL domain.',
    'Expected Result (AU / Spec)': 'CTA button navigates internally to US catalog / blog path (e.g. https://mcstaging2.globewest.com/blog/...) without Australian domain leakage.',
    'Actual Result (US Live)': 'DEFECT: "READ MORE" button is hardcoded to Australian production domain: https://mcprod.globewest.com.au/blog/style-tips/design-directions-2023. Critical AU leakage.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-07',
    'Feature / Module': 'Hero Featured Banner',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Hero Featured Photography Scaling & Dimensions (.blog-category-banner__right)',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Inspect right lifestyle image panel of hero banner.\n2. Verify background-image URL and natural resolution.\n3. Check object-fit / background-size cover scaling.',
    'Expected Result (AU / Spec)': 'Hero image displays high-resolution lifestyle photography (2100x940) scaled with background-size: cover without distortion.',
    'Actual Result (US Live)': 'Right panel renders high-resolution lifestyle imagery (2100x940 Felix-Loop) with background-size: cover.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-08',
    'Feature / Module': 'Hero Featured Banner',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Hero Editorial Heading & Subtitle Typography',
    'Pre-Conditions': 'Hero banner in view',
    'Test Steps': '1. Inspect "News" title and accompanying subtitle text.\n2. Verify font-family, font-weight, font-size, and line-height.\n3. Check contrast against background container.',
    'Expected Result (AU / Spec)': 'Typography matches editorial style with clean serif/sans-serif hierarchy and comfortable margins.',
    'Actual Result (US Live)': 'Typography renders cleanly; however, the dark brown background alters the approved visual contrast.',
    'Status': 'PASS (Typography structure only)',
    'Severity': 'P2 - Medium'
  },

  // --- Category 3: Category Navigation & Filtering ---
  {
    'Test ID': 'TC-BIP-09',
    'Feature / Module': 'Category Filter Toolbar',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Category Filter Toolbar Swiper Carousel Container & Arrow Controls',
    'Pre-Conditions': 'Desktop Viewport 1440x900, scroll to filter toolbar',
    'Test Steps': '1. Locate .blog-filter__list swiper container.\n2. Inspect swiper navigation buttons (.swiper-button-prev, .swiper-button-next).\n3. Click next arrow to scroll through category pills horizontally.',
    'Expected Result (AU / Spec)': 'Filter toolbar provides smooth horizontal swiper navigation with interactive prev/next arrows for overflow pills.',
    'Actual Result (US Live)': 'Swiper container initialized properly with smooth horizontal sliding and responsive arrow controls.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-10',
    'Feature / Module': 'Category Filter Toolbar',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Category Filter Active State Pill Styling ("ALL ARTICLES")',
    'Pre-Conditions': 'Blog Index Page loaded at default root URL (/blog)',
    'Test Steps': '1. Inspect "ALL ARTICLES" pill element (.blog-filter__item.active).\n2. Check active background color, text color, and border styling.\n3. Verify only one category pill has the active state.',
    'Expected Result (AU / Spec)': '"ALL ARTICLES" pill has prominent active highlight styling, distinguishing it from inactive filter pills.',
    'Actual Result (US Live)': '"ALL ARTICLES" pill renders with .active class and distinct visual highlight.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BIP-11',
    'Feature / Module': 'Category Filter Toolbar',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Australian Scope Leaks in Category Filter Tags (AU TV & Holidays)',
    'Pre-Conditions': 'Inspect all category pills inside .blog-filter__list',
    'Test Steps': '1. Read all category pill text values.\n2. Check for Australian-specific TV shows, events, or local holiday closure tags.\n3. Compare against AU Live baseline categories.',
    'Expected Result (AU / Spec)': 'Categories include relevant editorial topics: ALL ARTICLES, STYLE TIPS, STOCKIST IN PROFILE, HOME TOUR, GALLERIES, PROJECTS, DESIGNER IN PROFILE, WOMEN IN DESIGN.',
    'Actual Result (US Live)': 'DEFECT: US filter toolbar renders Australian-specific tags: "THE BLOCK" (AU TV show), "HOLIDAY CLOSURE", and "TRADE EVENTS". Unsanitized AU content.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-12',
    'Feature / Module': 'Category Filter Toolbar',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Category Taxonomy Nomenclature Parity ("GALLERIES" vs "GALLERY")',
    'Pre-Conditions': 'Inspect gallery category pill',
    'Test Steps': '1. Compare category naming between AU Live and US Staging.\n2. Verify singular vs plural naming convention.',
    'Expected Result (AU / Spec)': 'Category is named "GALLERIES" matching AU editorial standard.',
    'Actual Result (US Live)': 'US Staging renders singular "GALLERY" instead of "GALLERIES". Minor naming inconsistency.',
    'Status': 'FAIL',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BIP-13',
    'Feature / Module': 'Category Filter Toolbar',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Category Filtering Interaction & AJAX / URL Route Update',
    'Pre-Conditions': 'Click "STYLE TIPS" category pill',
    'Test Steps': '1. Click "STYLE TIPS" filter pill.\n2. Observe page transition and URL update.\n3. Verify article grid updates to display only posts tagged with "STYLE TIPS".',
    'Expected Result (AU / Spec)': 'Page updates to show filtered posts; active pill changes to "STYLE TIPS"; URL updates to /blog/style-tips.',
    'Actual Result (US Live)': 'Category filter navigates to /blog/style-tips and filters article cards accordingly.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-14',
    'Feature / Module': 'Category Filter Toolbar',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Horizontal Touch Swiping on Mobile for Filter Pills',
    'Pre-Conditions': 'Mobile Viewport 390x844 with touch emulation',
    'Test Steps': '1. Perform horizontal drag / swipe gesture across category filter bar.\n2. Verify swiper track responds smoothly without page stutter.\n3. Ensure tapping a category does not require double tap.',
    'Expected Result (AU / Spec)': 'Swiper moves fluidly with touch momentum; snap points align neatly; single tap triggers category filter.',
    'Actual Result (US Live)': 'Touch swiping functions smoothly on mobile viewport.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },

  // --- Category 4: Blog Article Cards Grid Layout & Content ---
  {
    'Test ID': 'TC-BIP-15',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Grid Column Structure on Desktop (3-Column Layout)',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Inspect article cards grid container.\n2. Verify 3 cards per row alignment.\n3. Check grid gap / margin spacing between cards.',
    'Expected Result (AU / Spec)': 'Article cards render in a symmetrical 3-column grid with uniform row gutters (~30px–40px).',
    'Actual Result (US Live)': 'Article grid renders in 3 columns per row matching AU layout.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-16',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Card Thumbnail Image Asset Integrity & Aspect Ratio',
    'Pre-Conditions': 'Inspect all 12 cards on page 1',
    'Test Steps': '1. Inspect card <img> elements.\n2. Measure naturalWidth vs clientWidth and computed aspect-ratio (~840x900 / 0.93).\n3. Check image sharpness and object-fit.',
    'Expected Result (AU / Spec)': 'All cards render high-resolution photography without distortion, broken image icons, or 0px height collapse.',
    'Actual Result (US Live)': 'Article thumbnails render with valid images (e.g. natural dimensions 840x900). Zero 0px height collapse on index page.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-17',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Zero NetSuite Placeholder Media Assets (/placeholder/default/)',
    'Pre-Conditions': 'Automated scan across all image elements on page',
    'Test Steps': '1. Query all <img> elements on the page.\n2. Inspect src attributes for "/placeholder/default/" or "Coming Soon".\n3. Flag any catalog placeholder images.',
    'Expected Result (AU / Spec)': 'Zero placeholder images present across all 12 post cards.',
    'Actual Result (US Live)': 'Zero NetSuite placeholder images detected. All thumbnails link to actual article media assets.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-18',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Card Headline Typography & Multi-Line Clamping',
    'Pre-Conditions': 'Inspect article card titles in grid',
    'Test Steps': '1. Inspect card title typography (font-family, size 18px–20px, line-height).\n2. Verify titles wrap neatly across 2–3 lines without clipping or overlapping metadata.\n3. Check text alignment (left-aligned).',
    'Expected Result (AU / Spec)': 'Headlines wrap cleanly with consistent line-height and uniform margin above/below.',
    'Actual Result (US Live)': 'Titles wrap neatly with consistent typography matching AU baseline.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-19',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Title Sanitation & Duplication Artifacts (Post #1)',
    'Pre-Conditions': 'Inspect Post #1 on US Staging Blog Index',
    'Test Steps': '1. Locate Post #1 headline.\n2. Check for staging duplication suffixes like "(Duplicated)".\n3. Compare against AU Live Post: "Stockist in Profile | IKOS Home".',
    'Expected Result (AU / Spec)': 'Post headline reads cleanly: "Stockist in Profile | IKOS Home".',
    'Actual Result (US Live)': 'DEFECT: Post #1 displays "Stockist in Profile | IKOS Home (Duplicated) (Duplicated)". Polluted editorial staging content.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-20',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Dummy / Staging Test Post Removal (Post #2)',
    'Pre-Conditions': 'Inspect Post #2 on US Staging Blog Index',
    'Test Steps': '1. Locate Post #2 headline and image.\n2. Check for developer placeholder or test post copy.',
    'Expected Result (AU / Spec)': 'All visible posts are genuine brand articles with professional editorial headlines.',
    'Actual Result (US Live)': 'DEFECT: Post #2 is a dummy test post titled "Post testing" with placeholder banner42.jpg. Staging pollution.',
    'Status': 'FAIL',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-21',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Card Category Tag Pill Styling',
    'Pre-Conditions': 'Inspect category labels above card titles',
    'Test Steps': '1. Inspect category tag (e.g. "STOCKIST IN PROFILE", "STYLE TIPS").\n2. Verify uppercase styling, font-size (11px–12px), letter-spacing, and color.\n3. Click category link and verify category archive navigation.',
    'Expected Result (AU / Spec)': 'Category pill renders in uppercase muted text, linking to respective category archive.',
    'Actual Result (US Live)': 'Category labels render with proper uppercase styling and link to category archives.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BIP-22',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Card Publishing Date Format Standardization',
    'Pre-Conditions': 'Inspect date element rendered beside category',
    'Test Steps': '1. Inspect date text (e.g. "OCT 02", "AUG 27").\n2. Verify month abbreviation and day number formatting.\n3. Verify separation dot or spacing between date and category.',
    'Expected Result (AU / Spec)': 'Date renders standardized in uppercase (e.g. "OCT 02") beside category pill.',
    'Actual Result (US Live)': 'Date formatting renders consistently across all cards.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BIP-23',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Card "Read more" Text CTA Link & Hover States',
    'Pre-Conditions': 'Inspect bottom of article card',
    'Test Steps': '1. Locate "Read more" link at bottom of each card.\n2. Hover mouse over link and observe underline / color change.\n3. Verify cursor pointer feedback.',
    'Expected Result (AU / Spec)': '"Read more" link has distinct styling, clear hover feedback, and points to the article template URL.',
    'Actual Result (US Live)': '"Read more" links render and respond properly to mouse hover.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BIP-24',
    'Feature / Module': 'Article Grid Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Article Card Click-Through Navigation to Target Article Template',
    'Pre-Conditions': 'Click on card image, title, and "Read more" link of Post #1',
    'Test Steps': '1. Click on thumbnail image and title.\n2. Verify browser navigates to article template page.\n3. Confirm zero redirection to Australian domain.',
    'Expected Result (AU / Spec)': 'Clicking card navigates directly to corresponding US staging blog article without 404 or redirect error.',
    'Actual Result (US Live)': 'Card navigates internally to /blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },

  // --- Category 5: Pagination & Toolbar Behavior (Glitch Analysis) ---
  {
    'Test ID': 'TC-BIP-25',
    'Feature / Module': 'Pagination Section',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Pagination Total Article Counter Accuracy (AU Baseline Glitch Analysis)',
    'Pre-Conditions': 'Scroll to bottom pagination toolbar on AU Live (https://www.globewest.com.au/blog)',
    'Test Steps': '1. Inspect toolbar-amount text.\n2. Read total article count displayed.\n3. Inspect pager page numbers and verify total available pages.',
    'Expected Result (AU / Spec)': 'Total article count should match the actual number of published articles and pages (e.g. 15 pages * 12 = 180 articles).',
    'Actual Result (US Live)': 'CONFIRMED AU GLITCH: AU Baseline shows "Viewed 12 out of 231 articles" with only 15 pages (180 articles). Pages 16-20 return 0 articles. Wrong total count calculation in Magefan collection.',
    'Status': 'FAIL (AU Baseline Glitch Highlighted)',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-26',
    'Feature / Module': 'Pagination Section',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify US Staging Pagination Truncation Defect ("Viewed 12 out of 72 articles")',
    'Pre-Conditions': 'Scroll to bottom pagination toolbar on US Staging (https://mcstaging2.globewest.com/blog)',
    'Test Steps': '1. Inspect toolbar-amount text on US Staging.\n2. Inspect pager buttons (pages rendered).\n3. Compare total articles (72) divided by 12 (expected: 6 pages) against rendered pages (1, 2).',
    'Expected Result (AU / Spec)': 'Pager should provide clickable navigation buttons for all 6 pages (1, 2, 3, 4, 5, 6) or ellipses (1, 2, 3 ... 6).',
    'Actual Result (US Live)': 'DEFECT: US Staging displays "Viewed 12 out of 72 articles" but the pager ONLY renders buttons for [ 1 ] and [ 2 ]. Pages 3, 4, 5, 6 are completely truncated and unreachable via pager buttons.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-27',
    'Feature / Module': 'Pagination Section',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Direct URL Access for Truncated Pages (/blog?p=3)',
    'Pre-Conditions': 'Navigate directly to https://mcstaging2.globewest.com/blog?p=3',
    'Test Steps': '1. Open browser address bar and append "?p=3".\n2. Verify if page loads 12 valid blog post cards.\n3. Confirm whether backend possesses the articles despite missing pagination button.',
    'Expected Result (AU / Spec)': 'If articles exist, page loads 12 posts; pager should reflect current page 3.',
    'Actual Result (US Live)': 'Page 3 successfully loads with 12 real blog post cards. Confirms posts exist in DB, but Magento frontend pager template fails to render page links past page 2.',
    'Status': 'FAIL',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-28',
    'Feature / Module': 'Pagination Section',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify "View 12 | 24 | All" Grid Density Switcher Functionality',
    'Pre-Conditions': 'Inspect left toolbar controls ("View 12 | 24 | All")',
    'Test Steps': '1. Locate density switcher links on left of pagination bar.\n2. Click "24" and observe article grid reload.\n3. Click "All" and verify full catalog loading.',
    'Expected Result (AU / Spec)': 'Clicking "24" reloads grid with 24 posts; clicking "All" displays all posts with lazy loading.',
    'Actual Result (US Live)': '"View 12 | 24 | All" controls render; switching to 24 updates grid density.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BIP-29',
    'Feature / Module': 'Pagination Section',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Next / Previous Pagination Arrow Navigation Controls',
    'Pre-Conditions': 'Pagination bar on Page 1 and Page 2',
    'Test Steps': '1. On Page 1, verify left arrow is disabled/hidden and right arrow (">") is active.\n2. Click ">" and verify navigation to Page 2.\n3. On Page 2, verify left arrow ("<") is visible and navigates back to Page 1.',
    'Expected Result (AU / Spec)': 'Previous/Next arrows provide sequential navigation between pages with disabled states on edge pages.',
    'Actual Result (US Live)': 'Next arrow navigates to Page 2. On Page 2, previous arrow returns to Page 1.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-30',
    'Feature / Module': 'Pagination Section',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Active Page Number Pill Styling (.current / active state)',
    'Pre-Conditions': 'Pagination bar in view',
    'Test Steps': '1. Inspect active page button (e.g. Page 1 on /blog).\n2. Verify border, background color, and text contrast.\n3. Verify inactive page buttons have distinct outline/hover styling.',
    'Expected Result (AU / Spec)': 'Active page number is clearly highlighted with solid border/background matching brand guidelines.',
    'Actual Result (US Live)': 'Active page number renders with .current class and dark border styling.',
    'Status': 'PASS',
    'Severity': 'P3 - Low'
  },

  // --- Category 6: Responsive Layout & Mobile Adaptation ---
  {
    'Test ID': 'TC-BIP-31',
    'Feature / Module': 'Responsive Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Desktop Viewport (1440x900) Max-Width Container & Alignment',
    'Pre-Conditions': 'Desktop Viewport 1440x900 and 1920x1080',
    'Test Steps': '1. Load US Blog Index Page on large viewports.\n2. Verify max-width container constraints (centered with side gutters).\n3. Check header, category filter, 3-column grid, and pagination alignment.',
    'Expected Result (AU / Spec)': 'Page maintains centered container without stretching excessively on ultra-wide screens.',
    'Actual Result (US Live)': 'Desktop layout aligns cleanly with uniform margins and centered container.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-32',
    'Feature / Module': 'Responsive Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Tablet Viewport (768x1024 - iPad) 2-Column Grid Transformation',
    'Pre-Conditions': 'Tablet Viewport 768x1024 Portrait',
    'Test Steps': '1. Resize viewport to 768px width.\n2. Observe article cards grid layout.\n3. Verify transition from 3-column to 2-column grid layout.',
    'Expected Result (AU / Spec)': 'Grid smoothly transforms to 2 columns per row; images scale proportionally without horizontal overflow.',
    'Actual Result (US Live)': 'Tablet grid adapts cleanly to 2 columns per row with zero horizontal scrollbars.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },
  {
    'Test ID': 'TC-BIP-33',
    'Feature / Module': 'Responsive Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Mobile Viewport (390x844 - iPhone) Single-Column Stacking',
    'Pre-Conditions': 'Mobile Viewport 390x844 with touch emulation',
    'Test Steps': '1. Load US Blog Index Page on mobile viewport.\n2. Verify hero banner stacks vertically (title then image).\n3. Verify article cards stack in a single column (1 card per row).',
    'Expected Result (AU / Spec)': 'Hero banner collapses cleanly; cards stack in single column; tap targets meet minimum 44x44px guidelines.',
    'Actual Result (US Live)': 'Mobile layout stacks properly in single column; card thumbnails scale to 100% container width.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-34',
    'Feature / Module': 'Responsive Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Mobile Zero Horizontal Overflow (scrollWidth == clientWidth)',
    'Pre-Conditions': 'Mobile Viewport 390x844',
    'Test Steps': '1. Measure document.documentElement.scrollWidth vs clientWidth.\n2. Attempt horizontal dragging across body.\n3. Confirm zero horizontal scrollbar or unintended layout spill.',
    'Expected Result (AU / Spec)': 'scrollWidth equals clientWidth (390px); zero horizontal scrolling allowed.',
    'Actual Result (US Live)': 'Verified scrollWidth: 390px, clientWidth: 390px. Zero horizontal overflow detected.',
    'Status': 'PASS',
    'Severity': 'P1 - High'
  },
  {
    'Test ID': 'TC-BIP-35',
    'Feature / Module': 'Responsive Layout',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Mobile Category Filter Swiper Track Responsiveness',
    'Pre-Conditions': 'Mobile Viewport 390x844',
    'Test Steps': '1. Inspect category filter bar on mobile screen.\n2. Swipe horizontally across categories.\n3. Ensure active pill is visible without being obscured by screen edges.',
    'Expected Result (AU / Spec)': 'Filter bar enables fluid touch dragging across all category pills on mobile.',
    'Actual Result (US Live)': 'Swiper touch interactions function smoothly on mobile device view.',
    'Status': 'PASS',
    'Severity': 'P2 - Medium'
  },

  // --- Category 7: Header, Global Elements & SEO ---
  {
    'Test ID': 'TC-BIP-36',
    'Feature / Module': 'Global Header',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify Header Wishlist Heart Icon Presence (Comparison with AU)',
    'Pre-Conditions': 'Desktop Viewport 1440x900',
    'Test Steps': '1. Inspect global header utility icons on right side (Search, Account, Wishlist, Cart).\n2. Look for Wishlist heart icon (♡) beside mini-cart bag.\n3. Compare against AU Live header.',
    'Expected Result (AU / Spec)': 'Heart icon (♡) is displayed between search/account and shopping bag icon.',
    'Actual Result (US Live)': 'DEFECT: Only Account and Cart icons render; Wishlist heart trigger is absent from US staging header.',
    'Status': 'FAIL',
    'Severity': 'P3 - Low'
  },
  {
    'Test ID': 'TC-BIP-37',
    'Feature / Module': 'SEO & Meta Header',
    'Auth Matrix': 'All Users',
    'Test Scenario': 'Verify HTML Page <title>, Meta Description & Canonical Link Tag',
    'Pre-Conditions': 'HTML <head> inspection on US Blog Index Page',
    'Test Steps': '1. Inspect document.title and meta name="description".\n2. Inspect link rel="canonical" href attribute.\n3. Verify canonical resolves to US staging domain (https://mcstaging2.globewest.com/blog).',
    'Expected Result (AU / Spec)': 'Document title displays "Blog - GlobeWest USA" or "Blog"; canonical link points to US domain without AU leakage.',
    'Actual Result (US Live)': 'Document title displays "Blog"; canonical tag resolves internally to US domain.',
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
XLSX.utils.book_append_sheet(workbook, worksheet, 'Blog Index Test Cases');
XLSX.writeFile(workbook, XLSX_PATH);
console.log(`✅ Successfully generated ${testCases.length} Excel Test Cases at:`, XLSX_PATH);
