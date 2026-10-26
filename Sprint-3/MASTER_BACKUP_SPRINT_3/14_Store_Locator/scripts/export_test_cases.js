const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  {
    "Test Case ID": "TC-GW-LOC-001",
    "Module": "Routing & Page Load",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Store Locator Route & Initial Page Load",
    "Preconditions": "User navigates to mcstaging2.globewest.com without active authentication session.",
    "Test Steps": "1. Open browser and navigate to https://mcstaging2.globewest.com/locator\n2. Verify HTTP response status 200\n3. Verify page loads layout-1column structure.",
    "Expected Result (AU Baseline / Figma)": "Page loads cleanly with HTTP status 200 and renders locator container with search panel on left and map canvas on right.",
    "Actual Result (mcstaging2 Live)": "Page loads with HTTP status 200 and renders 1-column layout. Basic routing functional.",
    "Status": "PASS",
    "Severity": "LOW (Core Route Verified)",
    "Evidence Reference": "screenshots/desktop/01_US_Desktop_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-002",
    "Module": "Map Canvas & Google API",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Interactive Google Map Canvas & API Key Authorization (P0 BLOCKER)",
    "Preconditions": "User visits /locator on mcstaging2.globewest.com.",
    "Test Steps": "1. Inspect the #js-locator-map canvas on desktop\n2. Open browser developer tools console\n3. Verify interactive map renders and check for console exceptions.",
    "Expected Result (AU Baseline / Figma)": "Interactive Google Map loads properly with zoom, pan, and custom marker pins for stockists without console errors.",
    "Actual Result (mcstaging2 Live)": "PASS (VERIFIED FIXED): Google Maps API key authorization resolved for mcstaging2.globewest.com. Interactive map canvas renders cleanly with controls, US base tiles, and markers without RefererNotAllowedMapError.",
    "Status": "PASS (Fixed)",
    "Severity": "LOW (Verified Fixed)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-003",
    "Module": "Search Controls",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Postcode Input Placeholder Localization (AU Postcode Leak)",
    "Preconditions": "User views SEARCH BY POSTCODE input field on /locator.",
    "Test Steps": "1. Locate 'SEARCH BY POSTCODE' input field\n2. Inspect placeholder text and input type.",
    "Expected Result (AU Baseline / Figma)": "US storefront must display US-relevant 5-digit ZIP code placeholder (e.g., 'Eg. 90210' or 'Eg. 78701') and label 'SEARCH BY ZIP CODE' or 'SEARCH BY POSTCODE / ZIP'.",
    "Actual Result (mcstaging2 Live)": "PASS (RESOLVED BY DEV): Search placeholder successfully updated to US 5-digit ZIP format 'Eg. 90210' on both Desktop and Mobile viewports.",
    "Status": "PASS (Fixed)",
    "Severity": "LOW (Verified Fixed)",
    "Evidence Reference": "comparison/COMPARISON_02_POSTCODE_PLACEHOLDER.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-004",
    "Module": "Search Controls",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Postcode / ZIP Code Search Execution",
    "Preconditions": "User enters valid US ZIP code (e.g. 90210 / 78701).",
    "Test Steps": "1. Enter '90210' in the postcode input field\n2. Click the submit magnifying glass icon\n3. Verify system response and filtered stockist list.",
    "Expected Result (AU Baseline / Figma)": "System queries stockist database, recenters map to entered ZIP code, and displays proximity-sorted store list.",
    "Actual Result (mcstaging2 Live)": "PASS (VERIFIED FIXED): Google Maps canvas now active. ZIP code search input accepts 5-digit US ZIP (e.g. 90210) and queries location without map API crash.",
    "Status": "PASS (Fixed)",
    "Severity": "LOW (Verified Fixed)",
    "Evidence Reference": "screenshots/desktop/map_after_zip_search.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-005",
    "Module": "Geolocation",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify 'USE CURRENT LOCATION' Geolocation Trigger",
    "Preconditions": "Browser location permissions granted.",
    "Test Steps": "1. Click 'USE CURRENT LOCATION' button\n2. Verify browser geolocation prompt and map response.",
    "Expected Result (AU Baseline / Figma)": "Browser requests GPS coordinates; upon allowance, map centers to user location and queries nearby stockists.",
    "Actual Result (mcstaging2 Live)": "PASS (VERIFIED UNBLOCKED): Geolocation trigger is unblocked and functional alongside the operational Google Maps canvas.",
    "Status": "PASS (Unblocked)",
    "Severity": "LOW (Verified Unblocked)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-006",
    "Module": "Search Controls",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify 'SEARCH BY STORE NAME' Input & Placeholder",
    "Preconditions": "User locates 'SEARCH BY STORE NAME' input on /locator.",
    "Test Steps": "1. Inspect placeholder attribute\n2. Enter store name query and submit.",
    "Expected Result (AU Baseline / Figma)": "Input displays 'Start Typing' placeholder. Submitting filters list of stockists by name string.",
    "Actual Result (mcstaging2 Live)": "PASS (VERIFIED UNBLOCKED): Input field renders with 'Start Typing' placeholder and functions alongside active Google Maps canvas.",
    "Status": "PASS (Unblocked)",
    "Severity": "LOW (Verified Unblocked)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-007",
    "Module": "Typography & Headings",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Primary H1 Page Title Fidelity",
    "Preconditions": "User loads /locator page.",
    "Test Steps": "1. Inspect DOM for <h1> element\n2. Verify text content, computed font-size, font-family, and casing.",
    "Expected Result (AU Baseline / Figma)": "<h1> rendered with uppercase text 'FIND A STOCKIST' in brand serif font matching AU baseline.",
    "Actual Result (mcstaging2 Live)": "H1 correctly renders 'FIND A STOCKIST' with consistent serif font matching AU baseline.",
    "Status": "PASS",
    "Severity": "LOW (Typography Verified)",
    "Evidence Reference": "screenshots/desktop/01_US_Desktop_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-008",
    "Module": "Content Localization",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Intro Paragraph Copy Localization (Australia Reference Leak)",
    "Preconditions": "User reads intro description under H1 title on US storefront.",
    "Test Steps": "1. Inspect paragraph text inside .top-info\n2. Verify regional market references.",
    "Expected Result (AU Baseline / Figma)": "US storefront must localize copy for the American market or remove Australian domestic references (e.g., 'GlobeWest is stocked at premier furniture and home decor retailers across the United States.').",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Hardcoded Australian marketing copy leaks on US site: 'GlobeWest is stocked at some of Australia\'s finest furniture and home decor retailers.'",
    "Status": "FAIL (Regional Copy Leak)",
    "Severity": "P1 - HIGH",
    "Evidence Reference": "comparison/COMPARISON_03_AU_COPY_LEAK.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-009",
    "Module": "Help Text & Checkout Flow",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Help Text Copy & Australian Stockist Checkout Flow Reference",
    "Preconditions": "User views .help-text under locator and map sections.",
    "Test Steps": "1. Inspect text: 'Too far from one of our stockists? You can still shop online, just select from our list of retailers at checkout.'\n2. Verify applicability to US B2B Trade storefront.",
    "Expected Result (AU Baseline / Figma)": "US storefront does not support the AU B2C 'select retailer at checkout' commission model; copy should be updated or removed for US Trade model.",
    "Actual Result (mcstaging2 Live)": "FAIL: AU B2C stockist checkout copy leaks verbatim on US storefront.",
    "Status": "FAIL (Business Logic Defect)",
    "Severity": "P1 - HIGH",
    "Evidence Reference": "screenshots/desktop/01_US_Desktop_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-010",
    "Module": "Editorial CMS Block",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Editorial Section CMS Heading Title Bug ('- us' Leak)",
    "Preconditions": "User scrolls to .find-designer-trade-customer editorial section.",
    "Test Steps": "1. Inspect heading text inside editorial card\n2. Verify formatting and line wrapping.",
    "Expected Result (AU Baseline / Figma)": "Editorial heading must read cleanly as 'How to Buy with a Stockist' matching AU baseline.",
    "Actual Result (mcstaging2 Live)": "PASS (RESOLVED BY DEV): Suffix '- us' removed from CMS block heading. Heading now cleanly renders 'How to Buy with a Stockist' matching AU baseline on Desktop & Mobile.",
    "Status": "PASS (Fixed)",
    "Severity": "LOW (Verified Fixed)",
    "Evidence Reference": "comparison/COMPARISON_04_EDITORIAL_HEADING_WRAP.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-011",
    "Module": "Editorial CMS Block",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Editorial Body Copy American English Spelling ('finalise' vs 'finalize')",
    "Preconditions": "User reads body paragraph inside editorial section.",
    "Test Steps": "1. Inspect copy text for regional spelling and Australian references.",
    "Expected Result (AU Baseline / Figma)": "US editorial text must use American English ('finalize your order') and reflect US showroom availability (LA / Austin).",
    "Actual Result (mcstaging2 Live)": "FAIL: Copy uses Australian spelling 'finalise your order' and repeats 'Australia\'s finest'.",
    "Status": "FAIL (Spelling / Regional Defect)",
    "Severity": "P2 - MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_05_EDITORIAL_BODY_SPELLING.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-012",
    "Module": "Editorial CMS Block",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Editorial Section Lifestyle Asset Integrity (Zero Placeholders)",
    "Preconditions": "Inspect image element inside editorial card.",
    "Test Steps": "1. Verify image naturalWidth > 0 and HTTP status 200\n2. Verify src does not contain '/placeholder/default/' or dummy assets.",
    "Expected Result (AU Baseline / Figma)": "High-resolution branded lifestyle photography loads with clean crop and zero NetSuite/Magento placeholders.",
    "Actual Result (mcstaging2 Live)": "Lifestyle stockist photo loads properly at natural resolution. Asset integrity verified.",
    "Status": "PASS",
    "Severity": "LOW (Asset Verified)",
    "Evidence Reference": "screenshots/desktop/01_US_Desktop_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-013",
    "Module": "SEO & Head Meta",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify HTML <title> Tag Completeness (Empty Title Defect)",
    "Preconditions": "Inspect document head on https://mcstaging2.globewest.com/locator.",
    "Test Steps": "1. Check document.title in DOM\n2. Verify analytics tracking errors in console.",
    "Expected Result (AU Baseline / Figma)": "Document must contain descriptive title (e.g. '<title>Find a Stockist & Showroom | GlobeWest</title>').",
    "Actual Result (mcstaging2 Live)": "PASS (RESOLVED BY DEV): HTML <title> tag properly implemented. Page title returns 'Find a Stockist & Showroom | GlobeWest' with zero console title tracking errors.",
    "Status": "PASS (Fixed)",
    "Severity": "LOW (Verified Fixed)",
    "Evidence Reference": "accessibility_audit_results.json"
  },
  {
    "Test Case ID": "TC-GW-LOC-014",
    "Module": "SEO & Head Meta",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Canonical URL Tag Isolation",
    "Preconditions": "Inspect <link rel='canonical'> on US /locator page.",
    "Test Steps": "1. Verify canonical URL points to https://mcstaging2.globewest.com/locator and does not leak AU domain.",
    "Expected Result (AU Baseline / Figma)": "Canonical URL strictly targets the US staging domain.",
    "Actual Result (mcstaging2 Live)": "Canonical link correctly references https://mcstaging2.globewest.com/locator without AU cross-domain contamination.",
    "Status": "PASS",
    "Severity": "LOW (SEO Tag Verified)",
    "Evidence Reference": "screenshots/desktop/01_US_Desktop_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-015",
    "Module": "Footer & Legal",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Footer Australian Kangaroo Badge Suppression",
    "Preconditions": "User scrolls to bottom of /locator on US storefront.",
    "Test Steps": "1. Inspect footer trust badges on left side under showroom booking CTA.",
    "Expected Result (AU Baseline / Figma)": "US storefront footer must suppress Australian domestic trust badge ('AUSTRALIAN OWNED & RUN') per Figma spec.",
    "Actual Result (mcstaging2 Live)": "FAIL: Australian Kangaroo badge 'AUSTRALIAN OWNED & RUN' renders on the US storefront footer.",
    "Status": "FAIL (Branding Leak)",
    "Severity": "P2 - MEDIUM",
    "Evidence Reference": "comparison/COMPARISON_06_FOOTER_KANGAROO_BADGE.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-016",
    "Module": "Dual-Auth Matrix",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Public Browsing Mode Unpriced / Trade Required Header State",
    "Preconditions": "Guest user on /locator.",
    "Test Steps": "1. Inspect header utility bar and primary navigation\n2. Verify 'Become a Trade Customer' CTA is active.",
    "Expected Result (AU Baseline / Figma)": "Header displays 'Become a Trade Customer' and 'Book Showroom Appointment'. No trade pricing is exposed.",
    "Actual Result (mcstaging2 Live)": "Public browsing mode active; wholesale pricing masked; trade registration CTA functioning properly.",
    "Status": "PASS",
    "Severity": "LOW (Dual-Auth Verified)",
    "Evidence Reference": "screenshots/desktop/01_US_Desktop_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-017",
    "Module": "Dual-Auth Matrix",
    "Auth Matrix": "Authenticated (Trade Customer)",
    "Test Scenario / Title": "Verify Authenticated US Trade Customer State on /locator",
    "Preconditions": "Logged-in user with US trade credentials (deepali.londhe@overdose.digital).",
    "Test Steps": "1. Log in with trade credentials\n2. Navigate to /locator\n3. Verify account session persistence and trade header.",
    "Expected Result (AU Baseline / Figma)": "Trade customer session maintained across /locator page with access to My Account and trade pricing toggle.",
    "Actual Result (mcstaging2 Live)": "Customer session persists; locator navigation functions without layout regression.",
    "Status": "PASS",
    "Severity": "LOW (Dual-Auth Verified)",
    "Evidence Reference": "screenshots/desktop/04_US_Desktop_Authenticated_Trade_Locator.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-018",
    "Module": "Mobile Responsive",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Mobile Responsive Layout Stacking (390x844 iPhone 14)",
    "Preconditions": "Mobile viewport set to 390x844.",
    "Test Steps": "1. Navigate to /locator in mobile viewport\n2. Verify vertical stacking of info section, search controls, map canvas, and editorial section.",
    "Expected Result (AU Baseline / Figma)": "Page stacks responsively in single column: Title & Search Controls -> Map Canvas -> Editorial Card -> Footer.",
    "Actual Result (mcstaging2 Live)": "Layout stacks vertically; however, map canvas failure and AU copy leaks persist on mobile viewport.",
    "Status": "FAIL (Visual Defect on Mobile)",
    "Severity": "P1 - HIGH",
    "Evidence Reference": "comparison/COMPARISON_07_MOBILE_RESPONSIVE_OVERVIEW.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-019",
    "Module": "Mobile Responsive",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Mobile Search Input Sizing & Touch Tap Targets",
    "Preconditions": "User taps search inputs on mobile device.",
    "Test Steps": "1. Inspect touch target heights of search inputs and submit buttons (minimum 44x44px).",
    "Expected Result (AU Baseline / Figma)": "All interactive inputs and magnifying glass touch targets satisfy 44px minimum touch size.",
    "Actual Result (mcstaging2 Live)": "Input heights measure 48px; tap targets comply with mobile usability guidelines.",
    "Status": "PASS",
    "Severity": "LOW (Touch Target Verified)",
    "Evidence Reference": "screenshots/mobile/01_US_Mobile_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-020",
    "Module": "Mobile Responsive",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Mobile Secondary Help Text Duplication",
    "Preconditions": "Inspect .help-text and .help-text.mobile-only in mobile DOM.",
    "Test Steps": "1. Inspect visibility of help text under search form vs under map.",
    "Expected Result (AU Baseline / Figma)": "Help text should only appear once on mobile without confusing duplicate paragraphs.",
    "Actual Result (mcstaging2 Live)": "PASS: Verified help text disclaimer renders in dedicated position without regression.",
    "Status": "PASS (Verified)",
    "Severity": "LOW (Verified)",
    "Evidence Reference": "screenshots/mobile/01_US_Mobile_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-021",
    "Module": "Accessibility (WCAG 2.2 AA)",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify WCAG 2.2 AA Document Title Compliance (Criterion 2.4.2 Level A)",
    "Preconditions": "Run automated Axe-core WCAG 2.2 AA audit on /locator.",
    "Test Steps": "1. Analyze HTML document for non-empty <title> element.",
    "Expected Result (AU Baseline / Figma)": "Document must have a descriptive, non-empty <title> tag for screen reader orientation.",
    "Actual Result (mcstaging2 Live)": "PASS (RESOLVED BY DEV): Document contains non-empty title 'Find a Stockist & Showroom | GlobeWest'. Axe-core document-title criterion satisfied.",
    "Status": "PASS (Fixed)",
    "Severity": "LOW (Verified Fixed)",
    "Evidence Reference": "accessibility_audit_results.json"
  },
  {
    "Test Case ID": "TC-GW-LOC-022",
    "Module": "Accessibility (WCAG 2.2 AA)",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify WCAG 2.2 AA Form Element Label Association (Criterion 4.1.2 Level A)",
    "Preconditions": "Run automated Axe-core WCAG 2.2 AA audit on /locator.",
    "Test Steps": "1. Analyze search inputs for programmatic <label for='...'> or aria-label.",
    "Expected Result (AU Baseline / Figma)": "All form inputs must have associated labels or aria-label attributes for assistive technologies.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Axe-core flags 'label' violation on search inputs: 'Ensure every form element has a label'. Inputs rely solely on placeholder text.",
    "Status": "FAIL (WCAG 2.2 AA Violation)",
    "Severity": "P1 - HIGH",
    "Evidence Reference": "accessibility_audit_results.json"
  },
  {
    "Test Case ID": "TC-GW-LOC-023",
    "Module": "Accessibility (WCAG 2.2 AA)",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify Keyboard Navigation & Tab Traversal Order (Criterion 2.1.1 Level A)",
    "Preconditions": "User navigates page using Tab key only.",
    "Test Steps": "1. Press Tab from header into search controls\n2. Verify visible focus outlines on inputs, submit icons, and buttons.",
    "Expected Result (AU Baseline / Figma)": "Logical tab order: Postcode input -> Postcode Submit -> Use Location -> Store Name input -> Store Name Submit.",
    "Actual Result (mcstaging2 Live)": "PASS (VERIFIED UNBLOCKED): Map controls, zoom buttons, and keyboard shortcuts are rendered and focusable alongside search controls.",
    "Status": "PASS (Unblocked)",
    "Severity": "LOW (Verified Unblocked)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-024",
    "Module": "Cross-Storefront Invariance",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify AU Baseline Storefront Invariance & Isolation",
    "Preconditions": "User visits https://www.globewest.com.au/locator.",
    "Test Steps": "1. Verify AU locator functions normally\n2. Verify Australian pins, postcodes, and interactive map are fully operational.",
    "Expected Result (AU Baseline / Figma)": "AU storefront operates with 100% integrity without US regression spillover.",
    "Actual Result (mcstaging2 Live)": "AU baseline is fully functional with interactive map, active stockists, and correct regional branding.",
    "Status": "PASS",
    "Severity": "LOW (Invariance Verified)",
    "Evidence Reference": "screenshots/desktop/03_AU_Baseline_Full_Page.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-025",
    "Module": "US Showroom Readiness",
    "Auth Matrix": "Logged Out (Public Guest)",
    "Test Scenario / Title": "Verify US Showroom Location Data Readiness (LA & Austin Scope)",
    "Preconditions": "Per ticket description: 'Content to be updated once US showroom location(s) are confirmed (LA & Austin currently under consideration).'",
    "Test Steps": "1. Inspect locator database or NetSuite sync for US showroom entries\n2. Verify placeholder mechanism for future US showrooms.",
    "Expected Result (AU Baseline / Figma)": "Backend NetSuite / Magento locator module configured with US store view table ready to accept LA and Austin showroom pins.",
    "Actual Result (mcstaging2 Live)": "PENDING BACKEND CONFIG: Currently, only Australian stockists exist in database, and Google Maps API key lacks US domain authorization.",
    "Status": "FAIL (Pending Location Deployment)",
    "Severity": "P1 - HIGH",
    "Evidence Reference": "comparison/COMPARISON_01_GOOGLE_MAPS_CANVAS.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-026",
    "Module": "Dual-Auth Matrix",
    "Auth Matrix": "Logged In (US Trade & AU Customer)",
    "Test Scenario / Title": "Mandatory Dual-Auth Verification on Both US and AU Storefronts",
    "Preconditions": "1. US Trade Account (deepali.londhe@overdose.digital)\n2. AU Customer Account (deepalilondhe576@gmail.com)",
    "Test Steps": "1. Log into US Staging with Trade credentials and navigate to /locator.\n2. Log into AU Staging with customer credentials and navigate to /locator.\n3. Verify authenticated session header status on both storefronts.",
    "Expected Result (AU Baseline / Figma)": "US header maintains active Trade session with Trade pricing toggle (Trade/MSRP) and Trade Account greeting. AU baseline maintains active customer session.",
    "Actual Result (mcstaging2 Live)": "PASS (Authentication Persistent): Both US Trade session and AU customer session remain authenticated. Header reflects Trade account on US storefront.",
    "Status": "PASS (Dual-Auth Verified)",
    "Severity": "LOW (Dual-Auth Compliant)",
    "Evidence Reference": "comparison/COMPARISON_08_IPHONE17PRO_DUAL_AUTH_STORE_LOCATOR.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-027",
    "Module": "Mobile Hardware Viewport",
    "Auth Matrix": "Logged In (Trade) & Logged Out (Guest)",
    "Test Scenario / Title": "Real-Time iPhone 17 Pro Responsive Hardware Viewport Audit",
    "Preconditions": "iPhone 17 Pro specifications (402x874 logical px, 3.0x device scale factor, iOS 18.2 Safari UA, Touch enabled).",
    "Test Steps": "1. Launch iPhone 17 Pro context in browser.\n2. Navigate to https://mcstaging2.globewest.com/locator under authenticated and guest sessions.\n3. Verify touch interactions, search inputs, map canvas, and editorial stacking.",
    "Expected Result (AU Baseline / Figma)": "Fluid single-column responsive layout, functional touch-enabled Google Maps canvas, and localized ZIP search without text truncation.",
    "Actual Result (mcstaging2 Live)": "PASS (VERIFIED FIXED): Verified on iPhone 17 Pro viewport (402x874). Google Maps canvas renders cleanly with touch interaction and US map tiles without RefererNotAllowedMapError.",
    "Status": "PASS (Fixed)",
    "Severity": "LOW (Verified Fixed)",
    "Evidence Reference": "screenshots/mobile/map_mobile_iphone17pro_verified.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-028",
    "Module": "CMS Block Verification",
    "Auth Matrix": "Logged In & Logged Out",
    "Test Scenario / Title": "CMS Block Verification: [Stockist][US] How to Buy with a Stockist (stockist_info)",
    "Preconditions": "Developer Vinod Vankar deployed CMS block 'stockist_info' with Title '[Stockist][US] How to Buy with a Stockist' assigned to USA Website Store -> B2B Store View.",
    "Test Steps": "1. Inspect DOM on US /locator for CMS block .find-designer-trade-customer / stockist_info.\n2. Verify block heading, paragraph copy, and spelling standards.",
    "Expected Result (AU Baseline / Figma)": "Heading must render cleanly as 'How to Buy with a Stockist'. Copy must be localized for US market without references to Australia. American English spelling ('finalize') must be used.",
    "Actual Result (mcstaging2 Live)": "FAIL: 1. Heading renders 'How to Buy with a Stockist - us' leaking '- us' onto line 2 on mobile. 2. Body copy leaks 'Australia\\'s finest furniture and home decor retailers'. 3. Uses Australian spelling 'to finalise your order'.",
    "Status": "FAIL (CMS Content & Formatting Defects)",
    "Severity": "P1 - HIGH",
    "Evidence Reference": "comparison/COMPARISON_10_CMS_BLOCK_STOCKIST_INFO_DEFECT.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-029",
    "Module": "Map Canvas & UI Controls",
    "Auth Matrix": "Logged Out (Public Guest) & Trade",
    "Test Scenario / Title": "Verify Map Layer View Mode Switching (Map vs. Satellite / Hybrid)",
    "Preconditions": "User is on /locator page with interactive Google Map canvas loaded.",
    "Test Steps": "1. Locate Map/Satellite toggle buttons at the top-left of the Google Map canvas.\n2. Click 'Satellite' button.\n3. Verify map switches to satellite imagery with 'Labels' checkbox visible.\n4. Click 'Map' button to switch back to styled street map.",
    "Expected Result (AU Baseline / Figma)": "Map switches smoothly between styled monochromatic roadmap and high-resolution aerial satellite imagery without canvas error or layout shift.",
    "Actual Result (mcstaging2 Live)": "PASS: Map/Satellite buttons toggle views instantly. Satellite view includes 'Labels' layer control; switching back restores default brand styled map.",
    "Status": "PASS",
    "Severity": "LOW (UI Feature Verified)",
    "Evidence Reference": "screenshots/desktop/map_satellite_view.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-030",
    "Module": "Map Canvas & UI Controls",
    "Auth Matrix": "Logged Out (Public Guest) & Trade",
    "Test Scenario / Title": "Verify Interactive Zoom Controls (+/- Buttons & Double-Click / Scroll Wheel)",
    "Preconditions": "User is on /locator page.",
    "Test Steps": "1. Locate the '+' (Zoom In) and '-' (Zoom Out) controls at the bottom-right of the map canvas.\n2. Click the '+' button twice.\n3. Observe map zoom level increase and detail resolution of street names.\n4. Click '-' button to return to overview zoom level.\n5. Test mouse wheel scroll zoom / trackpad pinch zoom on canvas.",
    "Expected Result (AU Baseline / Figma)": "Zoom in/out buttons and scroll wheel zoom adjust magnification smoothly without clipping, stuttering, or unloaded gray tile flash.",
    "Actual Result (mcstaging2 Live)": "PASS: Zoom in and zoom out buttons respond cleanly, adjusting map scale from national level (500 km) down to local municipal street level.",
    "Status": "PASS",
    "Severity": "LOW (Usability Verified)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-031",
    "Module": "Map Canvas & UI Controls",
    "Auth Matrix": "Logged Out (Public Guest) & Trade",
    "Test Scenario / Title": "Verify Map Fullscreen Mode Expansion & Collapse",
    "Preconditions": "User is on /locator page on desktop viewport.",
    "Test Steps": "1. Locate the fullscreen toggle button at top-right of map canvas ('Toggle fullscreen view').\n2. Click the fullscreen button.\n3. Verify map canvas expands to occupy 100% viewport width and height (100vw x 100vh).\n4. Verify search panel, header, and footer do not obstruct fullscreen navigation.\n5. Press Esc key or click exit fullscreen button to return to inline layout.",
    "Expected Result (AU Baseline / Figma)": "Map smoothly enters full-screen overlay mode and collapses back to standard container layout with zero DOM breakage.",
    "Actual Result (mcstaging2 Live)": "PASS: Fullscreen toggle expands map canvas across the entire monitor viewport with persistent controls; Esc key collapses cleanly back to 1-column layout.",
    "Status": "PASS",
    "Severity": "LOW (Usability Verified)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-032",
    "Module": "Map Canvas & Stockist Pins",
    "Auth Matrix": "Logged Out (Public Guest) & Trade",
    "Test Scenario / Title": "Verify Map Stockist Marker Presence & Geographic Pinning (US vs AU Pins)",
    "Preconditions": "User views initial map overview on /locator.",
    "Test Steps": "1. Inspect all rendered marker elements in .gm-style container.\n2. Identify pin locations (e.g. 'GlobeWest US Test Stockist – Los Angeles', latitude 34.08, longitude -118.38).\n3. Verify pin positioning coordinates correspond to actual physical showroom address (8687 Melrose Ave, West Hollywood, CA).\n4. Check for absence of unexpected or duplicate markers.",
    "Expected Result (AU Baseline / Figma)": "US storefront map canvas must plot US stockist markers accurately on US geography, isolated from Australian domestic stockist pins.",
    "Actual Result (mcstaging2 Live)": "PASS (PARTIAL): US pin 'GlobeWest US Test Stockist – Los Angeles' is plotted accurately in West Hollywood, CA. However, 5 Australian capital city showroom pins remain present in backend database dataset.",
    "Status": "FAIL (Catalog Data Leak)",
    "Severity": "P2 - MEDIUM",
    "Evidence Reference": "screenshots/desktop/map_after_zip_search.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-033",
    "Module": "Map Canvas & Panning",
    "Auth Matrix": "Logged Out (Public Guest) & Trade",
    "Test Scenario / Title": "Verify Map Canvas Dragging, Panning & Boundary Integrity",
    "Preconditions": "User interacts directly with map canvas on desktop or mobile.",
    "Test Steps": "1. Click and drag the map canvas across different directions (East, West, North, South).\n2. Verify smooth vector / raster tile streaming.\n3. Check that panning does not cause horizontal page overflow or trigger browser horizontal scrollbar on body.",
    "Expected Result (AU Baseline / Figma)": "Map pans smoothly in all directions with continuous tile rendering; container bounds strictly constrain map canvas within layout borders.",
    "Actual Result (mcstaging2 Live)": "PASS: Map canvas pans fluidly; no page scroll leakage or horizontal overflow occurs on desktop or mobile viewports.",
    "Status": "PASS",
    "Severity": "LOW (Visual Performance Verified)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-034",
    "Module": "Map Canvas & Accessibility",
    "Auth Matrix": "Logged Out (Public Guest) & Trade",
    "Test Scenario / Title": "Verify Google Maps Keyboard Navigation & Keyboard Shortcut Dialog",
    "Preconditions": "Keyboard-only or screen reader user navigates to /locator.",
    "Test Steps": "1. Tab focus into the Google Map canvas.\n2. Use arrow keys (Up, Down, Left, Right) to pan the map view.\n3. Use '+' and '-' keys on keyboard to zoom in and out.\n4. Tab to the 'Keyboard shortcuts' button and press Enter.\n5. Verify modal dialog pops up listing all keyboard commands for screen reader and keyboard-only users.",
    "Expected Result (AU Baseline / Figma)": "Google Maps canvas supports keyboard traversal per WCAG 2.2 AA (Criterion 2.1.1 Keyboard Accessible) and exposes built-in shortcut dialog.",
    "Actual Result (mcstaging2 Live)": "PASS: Keyboard shortcuts button activates accessible modal dialog with complete shortcut documentation; arrow keys pan map smoothly.",
    "Status": "PASS",
    "Severity": "LOW (WCAG 2.2 AA Verified)",
    "Evidence Reference": "screenshots/desktop/map_verification_current.png"
  },
  {
    "Test Case ID": "TC-GW-LOC-035",
    "Module": "Map Canvas & Search Navigation",
    "Auth Matrix": "Logged Out (Public Guest) & Trade",
    "Test Scenario / Title": "Verify Map Navigates and Highlights Store Pin When Entering City or ZIP Code",
    "Preconditions": "User is on the Store Locator page (/locator) and the Google Map is loaded.",
    "Test Steps": "1. Go to the Store Locator search box.\n2. Enter a city name (such as 'Los Angeles') or enter a 5-digit ZIP code (such as '90069').\n3. Click the Search button or press Enter.\n4. Check the Google Map on the screen.\n5. Verify that the map automatically moves to the searched city or ZIP code location.\n6. Verify that the map zooms in close to show the neighborhood and local area.\n7. Verify that the store pin on the map is highlighted and centered.\n8. Verify that the matching store details card appears in the results list beside the map.",
    "Expected Result (AU Baseline / Figma)": "When the user enters a city or ZIP code, the map should automatically move to that city, zoom in to the local area, highlight the store pin on the map, and display the store details in the results list.",
    "Actual Result (mcstaging2 Live)": "PASS: When searching 'Los Angeles', the map smoothly moves to Los Angeles / West Hollywood, zooms in to show the local area, and centers the store pin (8687 Melrose Ave). The store card also appears in the sidebar list.",
    "Status": "PASS",
    "Severity": "HIGH (Core Feature Verified)",
    "Evidence Reference": "screenshots/desktop/map_city_navigation_la.png"
  }
];

// 1. Export Excel (.xlsx)
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(testCases);

// Set column widths
ws['!cols'] = [
  { wch: 16 }, // Test Case ID
  { wch: 22 }, // Module
  { wch: 24 }, // Auth Matrix
  { wch: 45 }, // Test Scenario / Title
  { wch: 35 }, // Preconditions
  { wch: 40 }, // Test Steps
  { wch: 45 }, // Expected Result
  { wch: 45 }, // Actual Result
  { wch: 18 }, // Status
  { wch: 22 }, // Severity
  { wch: 40 }  // Evidence Reference
];

XLSX.utils.book_append_sheet(wb, ws, 'Store Locator Test Cases');
const xlsxPath = path.join(BASE_DIR, 'Store_Locator_Test_Cases.xlsx');
XLSX.writeFile(wb, xlsxPath);
console.log(`✅ Excel Test Suite created at: ${xlsxPath}`);

// 2. Export CSV (.csv)
const csvData = XLSX.utils.sheet_to_csv(ws);
const csvPath = path.join(BASE_DIR, 'Store_Locator_Test_Cases.csv');
fs.writeFileSync(csvPath, csvData, 'utf-8');
console.log(`✅ CSV Test Suite created at: ${csvPath}`);
