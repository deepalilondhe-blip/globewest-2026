const path = require('path');
const fs = require('fs');
let XLSX;
try {
  XLSX = require('xlsx');
} catch (e) {
  XLSX = require(path.join(__dirname, '..', 'GlobeWest 2026', 'node_modules', 'xlsx'));
}

const baseDir = __dirname;
const xlsxOutPath = path.join(baseDir, 'Ticket4_US_CMS_Structure_TestCases.xlsx');
const csvOutPath = path.join(baseDir, 'Ticket4_US_CMS_Structure_TestCases.csv');
const docsXlsxPath = path.join(baseDir, '..', 'GlobeWest 2026', 'docs', 'Ticket4_US_CMS_Structure_TestCases.xlsx');
const docsCsvPath = path.join(baseDir, '..', 'GlobeWest 2026', 'docs', 'Ticket4_US_CMS_Structure_TestCases.csv');

// ─── Sheet 1: Summary Matrix ──────────────────────────────────────────────────
const summaryData = [
  ['Test Case ID', 'Test Case Name', 'Ticket', 'Priority', 'Category', 'Automation Spec', 'Status'],
  ['TC-US-CMS-01', 'Verify CMS Home Page Assignment in Magento Admin Store Configuration', 'Ticket 4: Set up the CMS Structure', 'P1 (Critical)', 'Store Configuration – Default Pages', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-02', 'Verify CMS Page "Home page - US" (home-us) in Content > Pages', 'Ticket 4: Set up the CMS Structure', 'P1 (Critical)', 'CMS Page Verification', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-03', 'Verify All 9 CMS Blocks Exist & Enabled in Content > Blocks', 'Ticket 4: Set up the CMS Structure', 'P1 (Critical)', 'CMS Blocks Verification', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-04', 'US Storefront: Hero Banner Block (main-us-banner) Rendering', 'Ticket 4: Set up the CMS Structure', 'P1 (Critical)', 'Storefront – Hero Banner', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-05', 'US Storefront: B2B Video Block (home-us-video-block-b2b) Rendering', 'Ticket 4: Set up the CMS Structure', 'P2 (High)', 'Storefront – Video Section', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-06', 'US Storefront: Category Carousel Block (home-us-category-carousel) Rendering', 'Ticket 4: Set up the CMS Structure', 'P1 (Critical)', 'Storefront – Category Carousel', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-07', 'US Storefront: Visit Showroom Block (global-us-visit-showroom) Rendering', 'Ticket 4: Set up the CMS Structure', 'P2 (High)', 'Storefront – Showroom Promo', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-08', 'US Storefront: Recent Articles Block (homepage_us_recent_articles) Rendering', 'Ticket 4: Set up the CMS Structure', 'P2 (High)', 'Storefront – Editorial / Blog', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-09', 'US Storefront: Instagram Feed Block (insta-us-block-home-page) Known Limitation & Fallback Audit', 'Ticket 4: Set up the CMS Structure', 'P2 (High)', 'Storefront – Social Widget', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-10', 'US Storefront: About Us Brand Story Block (home-us-page-about-us) Rendering', 'Ticket 4: Set up the CMS Structure', 'P2 (High)', 'Storefront – Brand Content', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-11', 'US Storefront: Find a Designer CTA Block (global-us-find-designer) Rendering', 'Ticket 4: Set up the CMS Structure', 'P2 (High)', 'Storefront – Trade CTA', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-12', 'US Storefront: SEO Text Block (home-us-seo-text) Rendering', 'Ticket 4: Set up the CMS Structure', 'P3 (Medium)', 'Storefront – SEO Content', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION'],
  ['TC-US-CMS-13', 'US Storefront: Responsive Layout Integrity & Zero AU Scope Leakage', 'Ticket 4: Set up the CMS Structure', 'P1 (Critical)', 'Storefront – Cross-Device & Scope', 'ticket4-us-cms-structure.spec.js', 'READY FOR EXECUTION']
];

// ─── Sheet 2: Detailed Steps ──────────────────────────────────────────────────
const detailsData = [
  ['Test Case ID', 'Test Case Name', 'Preconditions', 'Admin / Storefront Navigation Path', 'Test Steps', 'Expected Result', 'Why It Matters', 'Verification Type'],
  [
    'TC-US-CMS-01',
    'Verify CMS Home Page Assignment in Magento Admin Store Configuration',
    'Admin user deepali.londhe@overdose.digital has valid access to Magento Admin panel.',
    'Magento Admin > Stores > Configuration > General > Web > Default Pages > CMS Home Page',
    '1. Login to Magento Admin panel (godmode/admin).\n2. Navigate to Stores > Configuration.\n3. Change Scope dropdown to "USA Website" or "GlobeWest US".\n4. Expand General > Web > Default Pages section.\n5. Inspect the "CMS Home Page" field.\n6. Verify "Use Default" checkbox is unchecked.\n7. Verify selected value is "Home page - US" (identifier: home-us).\n8. Capture screenshot proof.',
    'The "CMS Home Page" dropdown under US scope is set to "Home page - US". "Use Default" is unchecked.',
    'If the CMS Home page is not assigned under the US scope, the US storefront will fall back to the AU homepage or a 404 page, breaking the US customer entry point.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-02',
    'Verify CMS Page "Home page - US" (home-us) in Content > Pages',
    'Admin panel logged in.',
    'Magento Admin > Content > Elements > Pages',
    '1. In Magento Admin, go to Content > Pages.\n2. In search filter, enter URL Key: "home-us" or Title: "Home page - US".\n3. Click Apply Filters.\n4. Verify row exists.\n5. Verify Status is "Enabled".\n6. Verify Scope/Store View includes "USA Website" (or US Store View).\n7. Click Select > Edit to inspect content structure and layout.\n8. Verify Layout is "1 column" or "CMS Home Page" template.\n9. Capture screenshot proof.',
    'Page "Home page - US" is found, Status = Enabled, assigned to USA Website, and contains the required layout/content references.',
    'Ensures the master CMS container page exists, is enabled, and is strictly restricted to the US scope.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-03',
    'Verify All 9 CMS Blocks Exist & Enabled in Content > Blocks',
    'Admin panel logged in.',
    'Magento Admin > Content > Elements > Blocks',
    '1. In Magento Admin, navigate to Content > Blocks.\n2. For each of the 9 identifiers:\n   - home-us-video-block-b2b\n   - main-us-banner\n   - home-us-category-carousel\n   - global-us-visit-showroom\n   - homepage_us_recent_articles\n   - insta-us-block-home-page\n   - home-us-seo-text\n   - home-us-page-about-us\n   - global-us-find-designer\n3. Filter by Identifier and verify row exists.\n4. Verify Status = "Enabled".\n5. Verify Store View = "USA Website" or "All Store Views".\n6. Capture screenshot evidence.',
    'All 9 CMS blocks are successfully created, status is "Enabled", and mapped to the US store scope.',
    'Missing or disabled CMS blocks will cause blank gaps, broken widgets, or PHP widget exceptions on the live US homepage.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-04',
    'US Storefront: Hero Banner Block (main-us-banner) Rendering',
    'US Staging storefront URL reachable (https://mcstaging2.globewest.com/).',
    'US Storefront Homepage (/)',
    '1. Navigate to US storefront homepage.\n2. Wait for page load and inspect top hero section.\n3. Verify presence of block container matching "main-us-banner".\n4. Check banner image renders without 404 broken image icon.\n5. Verify headline text, sub-copy, and CTA button ("Shop Collection" / "Discover").\n6. Click or inspect CTA link to ensure it stays on the US domain.\n7. Capture screenshot.',
    'Hero banner displays prominently at top of page, high-resolution imagery loads, CTA link points to US catalog URL.',
    'First impression for US B2B trade customers; broken hero banner immediately ruins trust and conversion.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-05',
    'US Storefront: B2B Video Block (home-us-video-block-b2b) Rendering',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Scroll to the video section on the US homepage.\n2. Locate block container for "home-us-video-block-b2b".\n3. Check video element or embed (HTML5 video, YouTube, or Vimeo embed).\n4. Verify video poster thumbnail loads.\n5. Verify play/pause controls or autoplay muted functionality.\n6. Ensure no console errors or mixed content HTTP warnings.\n7. Capture screenshot.',
    'Video block container renders smoothly, video poster/media loads without CORS or 404 errors, responsive across viewports.',
    'Key storytelling element tailored for US B2B audience showcasing craftsmanship and design.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-06',
    'US Storefront: Category Carousel Block (home-us-category-carousel) Rendering',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Locate the category carousel section.\n2. Verify block container for "home-us-category-carousel".\n3. Verify category items render (e.g., Living, Dining, Bedroom, Outdoor).\n4. Test carousel navigation (Next/Prev buttons, swipe on touch).\n5. Check all category image cards load.\n6. Verify category links point to US catalog URLs without /au or .com.au.\n7. Capture screenshot.',
    'Category carousel displays all active cards with images and titles; slider controls respond to clicks; links route to US PLPs.',
    'Primary navigation pathway for US customers to browse product categories.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-07',
    'US Storefront: Visit Showroom Block (global-us-visit-showroom) Rendering',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Scroll to the showroom locator section.\n2. Locate block container for "global-us-visit-showroom".\n3. Verify imagery and copy.\n4. Check that showroom details do NOT list Australian addresses (Melbourne, Sydney, Brisbane).\n5. Verify CTA button ("Book a Visit" / "US Showrooms" / "Virtual Consultation").\n6. Verify destination URL is valid on US site.\n7. Capture screenshot.',
    'Showroom promo block renders with US-appropriate copy/links; zero Australian showroom addresses shown.',
    'Crucial for preventing US trade clients from seeing Australian showroom locations or phone numbers.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-08',
    'US Storefront: Recent Articles Block (homepage_us_recent_articles) Rendering',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Scroll to the blog / recent articles section.\n2. Locate block container for "homepage_us_recent_articles".\n3. Verify article cards render (thumbnails, publication titles, read more links).\n4. Verify images are responsive and not broken.\n5. Click an article link and ensure it opens the US blog/article page.\n6. Capture screenshot.',
    'Recent articles grid renders with active content, valid links, and clean typography.',
    'Maintains editorial parity with AU site and provides SEO value for the US market.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-09',
    'US Storefront: Instagram Feed Block (insta-us-block-home-page) Known Limitation & Fallback Audit',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Scroll to the social feed area where Instagram widget is placed.\n2. Locate container element for "insta-us-block-home-page".\n3. Verify DOM presence of the block.\n4. Check DevTools Console for widget errors (e.g., Instagram API token invalid for US domain, script blocked, or empty feed container).\n5. Confirm the dev team note: block code is present, but feed posts do not render.\n6. Verify that missing feed does NOT break page layout, cause UI overlap, or trigger fatal JavaScript crashes.\n7. Capture screenshot and console log.',
    'Block container is present in DOM; gracefully degrades (empty or hidden) without breaking the rest of the page; defect documented with root cause.',
    'Validates the specific note provided by the dev team and ensures graceful degradation until API/token is connected.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-10',
    'US Storefront: About Us Brand Story Block (home-us-page-about-us) Rendering',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Scroll to the About Us brand section.\n2. Locate container for "home-us-page-about-us".\n3. Verify headline, brand story paragraph, and imagery.\n4. Verify any links ("Read Our Story" / "About GlobeWest") route to the US About Us CMS page.\n5. Verify text formatting, contrast, and alignment.\n6. Capture screenshot.',
    'About Us block renders cleanly with clear brand story and working link to US About page.',
    'Builds brand credibility and introduces GlobeWest design pedigree to the American trade audience.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-11',
    'US Storefront: Find a Designer CTA Block (global-us-find-designer) Rendering',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Scroll to the Find a Designer section.\n2. Locate container for "global-us-find-designer".\n3. Verify headline, subtext, and action buttons.\n4. Verify CTA link routes to the US designer directory or trade registration portal.\n5. Check responsive behavior on tablet and mobile.\n6. Capture screenshot.',
    'Find a Designer section displays properly with accessible CTA button routing to US trade / directory page.',
    'Connects US trade professionals and interior designers to the brand.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-12',
    'US Storefront: SEO Text Block (home-us-seo-text) Rendering',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/)',
    '1. Scroll to the bottom of the homepage above the footer.\n2. Locate container for "home-us-seo-text".\n3. Inspect heading tags (H2/H3) and paragraphs.\n4. Verify text content mentions GlobeWest US offerings without Australian legal disclaimers (ABN, AU GST).\n5. Check expand/collapse accordion behavior if applicable.\n6. Capture screenshot.',
    'SEO text block renders formatted paragraphs at bottom of page; no AU-specific regulatory text present.',
    'Drives organic search ranking for US interior design and wholesale furniture keywords in Google US.',
    'Automated (Playwright) + Manual'
  ],
  [
    'TC-US-CMS-13',
    'US Storefront: Responsive Layout Integrity & Zero AU Scope Leakage',
    'US Staging storefront URL reachable.',
    'US Storefront Homepage (/) across Desktop, Tablet, Mobile',
    '1. Emulate Desktop (1920x1080), Tablet (820x1180), and Mobile (393x851).\n2. Load US homepage under each viewport.\n3. Verify all CMS blocks stack gracefully without horizontal overflow.\n4. Run regex search on page text for Australian leakage: "AUD", "$AU", "ABN", "GST inc", "+61", "Victoria 3204".\n5. Check all images for natural dimensions (naturalWidth > 0).\n6. Capture responsive screenshots.',
    'Zero horizontal scrolling or overlapping blocks; all images render; zero AU scope leakage found on US homepage.',
    'Guarantees end-to-end presentation excellence and strict multi-store scope isolation.',
    'Automated (Playwright) + Manual'
  ]
];

// ─── Sheet 3: CMS Blocks Architecture Mapping ─────────────────────────────────
const mappingData = [
  ['Block Identifier', 'Block Title / Component', 'Position on Home Page', 'Expected Content / Purpose', 'AU vs US Differences', 'Status in Update'],
  ['main-us-banner', 'Main US Hero Banner', 'Section 1 (Top Hero)', 'Hero image/carousel, H1 headline, CTA link to US catalog', 'US catalog URL destination, USD pricing if shown', 'Created & Ready for Verification'],
  ['home-us-video-block-b2b', 'B2B Video Block', 'Section 2 (Below Hero)', 'Brand video player/embed highlighting craftsmanship', 'US B2B messaging, no AU contact numbers', 'Created & Ready for Verification'],
  ['home-us-category-carousel', 'US Category Carousel', 'Section 3', 'Product category cards (Living, Dining, Bedroom, Outdoor)', 'Routes to US category URLs', 'Created & Ready for Verification'],
  ['global-us-visit-showroom', 'Visit Showroom Promo', 'Section 4', 'Showroom locator / consultation booking CTA', 'US showroom locations or virtual consultations; no AU addresses', 'Created & Ready for Verification'],
  ['homepage_us_recent_articles', 'Recent Articles / Journal', 'Section 5', 'Editorial design articles and blog posts', 'US localized blog posts & links', 'Created & Ready for Verification'],
  ['insta-us-block-home-page', 'Instagram Social Feed', 'Section 6', 'Curated social media image grid', 'Shared feed code from AU; widget token pending activation', 'Created (Known issue: feed not showing)'],
  ['home-us-page-about-us', 'About Us Brand Story', 'Section 7', 'Company heritage, design ethos, trade dedication', 'US B2B brand story; no AU-only certifications', 'Created & Ready for Verification'],
  ['global-us-find-designer', 'Find a Designer / Trade CTA', 'Section 8', 'B2B trade partner / designer connection portal', 'Routes to US trade portal / designer registration', 'Created & Ready for Verification'],
  ['home-us-seo-text', 'US Homepage SEO Body Text', 'Section 9 (Above Footer)', 'Keyword-rich copy for US Google indexation', 'Targeted US keywords (luxury furniture, B2B, wholesale trade)', 'Created & Ready for Verification']
];

// Build Workbook
const wb = XLSX.utils.book_new();

const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
wsSummary['!cols'] = [{ wch: 15 }, { wch: 45 }, { wch: 35 }, { wch: 15 }, { wch: 30 }, { wch: 35 }, { wch: 22 }];

const wsDetails = XLSX.utils.aoa_to_sheet(detailsData);
wsDetails['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 35 }, { wch: 40 }, { wch: 50 }, { wch: 45 }, { wch: 45 }, { wch: 25 }];

const wsMapping = XLSX.utils.aoa_to_sheet(mappingData);
wsMapping['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 25 }, { wch: 45 }, { wch: 45 }, { wch: 30 }];

XLSX.utils.book_append_sheet(wb, wsSummary, 'Test Matrix');
XLSX.utils.book_append_sheet(wb, wsDetails, 'Detailed Test Cases');
XLSX.utils.book_append_sheet(wb, wsMapping, 'CMS Block Architecture');

// Write XLSX
XLSX.writeFile(wb, xlsxOutPath);
console.log('✅ Generated XLSX:', xlsxOutPath);

// Write to docs folder as well for project parity
try {
  XLSX.writeFile(wb, docsXlsxPath);
  console.log('✅ Copied XLSX to docs:', docsXlsxPath);
} catch (e) {
  console.warn('Could not copy to docs:', e.message);
}

// Generate CSV
const csvRows = detailsData.map(row => 
  row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
).join('\n');

fs.writeFileSync(csvOutPath, csvRows, 'utf8');
console.log('✅ Generated CSV:', csvOutPath);

try {
  fs.writeFileSync(docsCsvPath, csvRows, 'utf8');
  console.log('✅ Copied CSV to docs:', docsCsvPath);
} catch (e) {
  console.warn('Could not copy CSV to docs:', e.message);
}
