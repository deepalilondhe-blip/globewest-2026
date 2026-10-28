const fs = require('fs');
const path = require('path');
const XLSX = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/xlsx'));

const BASE_DIR = path.resolve(__dirname, '..');

const testCases = [
  // -------------------------------------------------------------------------
  // SECTION 1: ROUTING, ACCESS & DEPLOYMENT BLOCKERS (P0)
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-001",
    "Module": "Routing & Navigation",
    "Feature Scope": "Claims Listing Access",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Direct URL Routing to Open Claims Page (P0 CRITICAL BLOCKER)",
    "Preconditions": "User authenticated with US Trade account (deepali.londhe@overdose.digital).",
    "Test Steps": "1. Navigate directly to https://mcstaging2.globewest.com/gw_sales/claim/index/status/open/\n2. Verify final HTTP response code and landed URL\n3. Verify page renders Claims management interface.",
    "Expected Result (Spec)": "System renders My Claims dashboard with 'OPEN' tab active, displaying the claims listing table, status pills, and 'CREATE NEW CLAIM' button per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Route executes an immediate HTTP 302 Redirect to /customer/account/ (My Dashboard). The Claims management interface is completely inaccessible.",
    "Status": "FAIL (P0 Blocker)",
    "Severity": "P0 - CRITICAL BLOCKER",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-002",
    "Module": "Routing & Navigation",
    "Feature Scope": "Claims Listing Access",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Pending & Closed Claims Route Redirects (P0 BLOCKER)",
    "Preconditions": "User authenticated on US Staging.",
    "Test Steps": "1. Navigate to /gw_sales/claim/index/status/pending/\n2. Navigate to /gw_sales/claim/index/status/closed/\n3. Check landed URLs.",
    "Expected Result (Spec)": "Routes render My Claims listing filtered to Pending and Closed claims respectively per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Both routes execute an HTTP 302 Redirect back to /customer/account/ (My Dashboard).",
    "Status": "FAIL (P0 Blocker)",
    "Severity": "P0 - CRITICAL BLOCKER",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-003",
    "Module": "Routing & Navigation",
    "Feature Scope": "Clean Vanity URL",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Clean Vanity Claims URL Routing (/claims)",
    "Preconditions": "User navigates to https://mcstaging2.globewest.com/claims.",
    "Test Steps": "1. Enter https://mcstaging2.globewest.com/claims in browser\n2. Verify HTTP status and page content.",
    "Expected Result (Spec)": "Route resolves cleanly to My Claims portal or redirects to /customer/account/claims/ per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "FAIL: Returns HTTP 404 Not Found ('[US] 404 Not Found').",
    "Status": "FAIL (404 Missing Route)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-004",
    "Module": "Dashboard Integration",
    "Feature Scope": "Submit Claim Entry Point",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Account Dashboard 'Submit Claim' Notification CTA Button (P0 BLOCKER)",
    "Preconditions": "User views /customer/account/ dashboard notification card: 'New: You can now submit claims online'.",
    "Test Steps": "1. Inspect the 'SUBMIT CLAIM' button (.od-notification__button)\n2. Check href attribute value\n3. Click the button.",
    "Expected Result (Spec)": "Button links to the Create Claim workflow (href='/claims/create' or '/gw_sales/claim/create/') per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: CTA button has dummy dead link href='#'. Clicking reloads top of page without performing any action.",
    "Status": "FAIL (P0 Dead Link)",
    "Severity": "P0 - CRITICAL BLOCKER",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-005",
    "Module": "Create Claim Workflow",
    "Feature Scope": "Form Deployment",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Create Claim Page Deployment & Availability (P0 BLOCKER)",
    "Preconditions": "User visits https://mcstaging2.globewest.com/claims/create or /gw_sales/claim/create/.",
    "Test Steps": "1. Request Create Claim URL\n2. Inspect HTTP status code and document title.",
    "Expected Result (Spec)": "Page loads Create a Claim form per Figma Frame 2383-11003 with file uploader and tooltips.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Returns HTTP 404 Not Found. Create Claim form is completely missing / undeployed.",
    "Status": "FAIL (P0 Missing Module)",
    "Severity": "P0 - CRITICAL BLOCKER",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },

  // -------------------------------------------------------------------------
  // SECTION 2: SEARCH & CLAIM CREATION (PRODUCT-FIRST WORKFLOW)
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-006",
    "Module": "Search & Claim Creation",
    "Feature Scope": "Product-First Search",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Product-First Search by Product Name (Replacing AU Invoice-First Flow)",
    "Preconditions": "User initiates claim creation on Create Claim screen.",
    "Test Steps": "1. Locate product search input\n2. Type product name (e.g., 'Pearce Marble Nightstand')\n3. Verify search results.",
    "Expected Result (Spec)": "Search is product-first; customer searches by product name rather than having to find an invoice first. Matching purchased products appear dynamically per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Create Claim form undeployed (HTTP 404). Search input unavailable.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P0 - CRITICAL",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-007",
    "Module": "Search & Claim Creation",
    "Feature Scope": "Product-First Search",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Product-First Search by SKU",
    "Preconditions": "User in claim creation workflow.",
    "Test Steps": "1. Enter product SKU into search box (e.g., 'SIDE-PEARCE-MAR-2DR')\n2. Verify system identifies product record.",
    "Expected Result (Spec)": "System successfully returns product by SKU without requiring invoice number input per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P0 - CRITICAL",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-008",
    "Module": "Search & Claim Creation",
    "Feature Scope": "Automatic Invoice Surfacing",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify System Automatically Surfaces Matching Paid Invoices",
    "Preconditions": "Customer selects product from search results.",
    "Test Steps": "1. Select searched product\n2. Inspect surfaced invoice metadata.",
    "Expected Result (Spec)": "System automatically surfaces matching paid invoice(s) for the selected product, solving AU pain point where customers cannot recall invoice numbers (per Figma Frame 2383-11003).",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P0 - CRITICAL",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-009",
    "Module": "Search & Claim Creation",
    "Feature Scope": "Multi-Invoice Repetition",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Multiple Invoices for Same Product Render Repeated per Invoice",
    "Preconditions": "Trade customer purchased identical product across multiple invoices.",
    "Test Steps": "1. Search for product purchased multiple times\n2. Inspect search results list.",
    "Expected Result (Spec)": "Invoice number is shown alongside the product wherever it appears in the flow, repeated per invoice if purchased more than once (per Figma Frame 2383-11003).",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-010",
    "Module": "Submission Requirements",
    "Feature Scope": "Paid Invoice Enforcement",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Claims can ONLY be Raised Against a Paid Invoice",
    "Preconditions": "Customer has pending/unpaid order quotes or proformas.",
    "Test Steps": "1. Attempt to lodge claim against unpaid invoice or pending order\n2. Verify system validation.",
    "Expected Result (Spec)": "Claims can strictly only be raised against a paid invoice. Unpaid orders/invoices are rejected or omitted from claimable list per Frame 630.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },

  // -------------------------------------------------------------------------
  // SECTION 3: CLAIM DETAIL & CATEGORISATION (FAULT CATEGORIES & MEDIA)
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-011",
    "Module": "Claim Detail & Categorisation",
    "Feature Scope": "Fault Categories",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Prompt Category: 'Transit Damage'",
    "Preconditions": "User in claim creation step 2.",
    "Test Steps": "1. Inspect fault category options\n2. Verify presence of 'Transit Damage'\n3. Verify helper description: 'Product received in damaged condition'.",
    "Expected Result (Spec)": "'Transit Damage' category available with prompt description 'Product received in damaged condition' per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Create Claim form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-012",
    "Module": "Claim Detail & Categorisation",
    "Feature Scope": "Fault Categories",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Prompt Category: 'Product Defect'",
    "Preconditions": "User in claim creation step 2.",
    "Test Steps": "1. Inspect fault category options\n2. Verify 'Product Defect'\n3. Verify description: 'Considered defect to product'.",
    "Expected Result (Spec)": "'Product Defect' category available with description 'Considered defect to product' per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Create Claim form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-013",
    "Module": "Claim Detail & Categorisation",
    "Feature Scope": "Fault Categories",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Prompt Category: 'Missing Parts'",
    "Preconditions": "User in claim creation step 2.",
    "Test Steps": "1. Inspect fault category options\n2. Verify 'Missing Parts'\n3. Verify description: 'Missing parts from a delivery'.",
    "Expected Result (Spec)": "'Missing Parts' category available with description 'Missing parts from a delivery' per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Create Claim form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-014",
    "Module": "Claim Detail & Categorisation",
    "Feature Scope": "Fault Categories",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Prompt Category: 'Incorrect item'",
    "Preconditions": "User in claim creation step 2.",
    "Test Steps": "1. Inspect fault category options\n2. Verify 'Incorrect item'\n3. Verify description: 'Incorrect product received'.",
    "Expected Result (Spec)": "'Incorrect item' category available with description 'Incorrect product received' per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Create Claim form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-015",
    "Module": "Submission Requirements",
    "Feature Scope": "Photo Upload",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Mandatory Photo Upload (Minimum 1 Photo per Claim Enforced)",
    "Preconditions": "User attempts to submit claim without uploading an image.",
    "Test Steps": "1. Fill required fields (product, category, description)\n2. Leave photo dropzone empty\n3. Click [ REVIEW ] / [ SUBMIT ].",
    "Expected Result (Spec)": "System strictly blocks submission with validation error: 'Photo upload is mandatory - minimum one photo per claim' per Figma Frame 2383-11003 & Frame 630.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P0 - CRITICAL",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-016",
    "Module": "Submission Requirements",
    "Feature Scope": "Video Upload",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Video Upload Assessment & Acceptance (.mp4, .mov)",
    "Preconditions": "User attaches a video file (.mp4, .mov) up to 100MB.",
    "Test Steps": "1. Drag video file into dropzone\n2. Inspect uploader behavior.",
    "Expected Result (Spec)": "Video upload supported as optional media intake (under assessment by Overdose per spec; dropzone per Figma Frame 2383-11003).",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-017",
    "Module": "Submission Requirements",
    "Feature Scope": "Multi-Product Claims",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Multiple Products per Single Claim Submission (Matching AU Behavior)",
    "Preconditions": "User adds product 1 to claim.",
    "Test Steps": "1. Click '+ ADD ANOTHER PRODUCT' CTA\n2. Search and select second product\n3. Verify both items bundled in single claim submission.",
    "Expected Result (Spec)": "Multiple products per claim allowed; behavior to match current AU per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-018",
    "Module": "Submission Requirements",
    "Feature Scope": "Description Field",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Mandatory Description Field per Designs",
    "Preconditions": "User fills claim form.",
    "Test Steps": "1. Leave description textarea empty\n2. Attempt submit\n3. Enter detailed issue description and verify character limit.",
    "Expected Result (Spec)": "Description field mandatory with validation error if empty per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },

  // -------------------------------------------------------------------------
  // SECTION 4: INTEGRATION & NETSUITE STATUS MAPPING
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-019",
    "Module": "NetSuite Integration",
    "Feature Scope": "Claim Identifier",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify NetSuite Case Number is Used as the Claim ID (Fixing AU Gap)",
    "Preconditions": "Claim submitted successfully.",
    "Test Steps": "1. Inspect generated claim confirmation ID\n2. Verify ID matches NetSuite Case Number format\n3. Verify customer service can look up claim directly in NetSuite.",
    "Expected Result (Spec)": "Update required for US is for the NetSuite case number to be used as the ID (resolves AU reference continuity gap where claim ID did not tie back to NetSuite).",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims portal not deployed on US staging; cannot lodge claim to verify NetSuite Case ID sync.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P0 - CRITICAL INTEGRATION",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-020",
    "Module": "NetSuite Integration",
    "Feature Scope": "Portal-Only Intake",
    "Auth Matrix": "All Users",
    "Test Scenario / Title": "Verify Claims are Portal-Only for Lodging (No Email-Based Claim Creation)",
    "Preconditions": "User seeks to lodge claim.",
    "Test Steps": "1. Inspect Support/Contact/Claims documentation\n2. Verify lodging instructions direct to customer portal.",
    "Expected Result (Spec)": "Claims will remain portal-only for lodging, i.e. no email based claim creation, consistent with AU per Figma Frame 630.",
    "Actual Result (mcstaging2 Live)": "FAIL: Portal is inaccessible (302 redirect), leaving customers with zero mechanism to submit claims.",
    "Status": "FAIL (P0 Blocker)",
    "Severity": "P0 - CRITICAL",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-021",
    "Module": "Status Mapping",
    "Feature Scope": "NetSuite Status Sync",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify 'Claim Received' Mapping (NetSuite Status IDs: 10, 20)",
    "Preconditions": "NetSuite case set to '10 - Claim/Issue Logged' or '20 - Pending Detail from Customer'.",
    "Test Steps": "1. Update case status in NetSuite\n2. Sync to storefront\n3. Inspect status badge in My Claims.",
    "Expected Result (Spec)": "Storefront displays unified status: 'Claim Received' pill badge per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-022",
    "Module": "Status Mapping",
    "Feature Scope": "NetSuite Status Sync",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify 'Claim Under Review' Mapping (NetSuite Status IDs: 30, 31, 32, 33, 40)",
    "Preconditions": "NetSuite case set to IDs 30 (Product Team), 31 (QC Team), 32 (Repair Person), 33 (Carrier), or 40 (Issue Under Review).",
    "Test Steps": "1. Sync NetSuite case\n2. Inspect storefront status.",
    "Expected Result (Spec)": "Storefront displays unified status: 'Claim Under Review' pill badge per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-023",
    "Module": "Status Mapping",
    "Feature Scope": "NetSuite Status Sync",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify 'Resolution Offered' Mapping (NetSuite Status IDs: 50, 55, 56, 57)",
    "Preconditions": "NetSuite case set to IDs 50 (Proposed), 55 (In Dispute), 56 (Escalated), or 57 (Approved).",
    "Test Steps": "1. Sync NetSuite case\n2. Inspect storefront status.",
    "Expected Result (Spec)": "Storefront displays unified status: 'Resolution Offered' pill badge per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-024",
    "Module": "Status Mapping",
    "Feature Scope": "NetSuite Status Sync",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify 'Resolution Accepted' Mapping (NetSuite Status IDs: 60, 61, 62, 63, 64, 68)",
    "Preconditions": "NetSuite case set to IDs 60 (Not in Stock), 61 (Awaiting QC), 62 (Awaiting Customer), 63 (Repair), 64 (Other), or 68 (Pending Return).",
    "Test Steps": "1. Sync NetSuite case\n2. Inspect storefront status.",
    "Expected Result (Spec)": "Storefront displays unified status: 'Resolution Accepted' pill badge per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-025",
    "Module": "Status Mapping",
    "Feature Scope": "NetSuite Status Sync",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify 'Claim Closed' Mapping (NetSuite Status ID: 75)",
    "Preconditions": "NetSuite case set to '75 - Closed'.",
    "Test Steps": "1. Sync NetSuite case\n2. Inspect storefront status.",
    "Expected Result (Spec)": "Storefront displays status: 'Claim Closed' with closed pill styling per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },

  // -------------------------------------------------------------------------
  // SECTION 5: CLAIM TRACKING & OFFLINE CS SYNC
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-026",
    "Module": "Claim Tracking",
    "Feature Scope": "My Account Tracking",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Customers can View Status of Submitted Claims via My Account",
    "Preconditions": "Trade customer has submitted claims.",
    "Test Steps": "1. Navigate to My Account\n2. Click 'My Claims'\n3. Inspect claims status and details.",
    "Expected Result (Spec)": "Customers can view the status of submitted claims via My Account per Figma Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "CRITICAL FAIL: Access blocked by 302 redirect loop to Dashboard.",
    "Status": "FAIL (P0 Blocker)",
    "Severity": "P0 - CRITICAL",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-027",
    "Module": "Claim Tracking",
    "Feature Scope": "Offline CS Sync",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Offline Claims Raised by CS Team Sync to Customer Account (15-Min Frequency)",
    "Preconditions": "Customer Service team creates a claim offline directly in NetSuite.",
    "Test Steps": "1. Raise claim offline in NetSuite for trade account\n2. Wait 15 minutes for cron sync\n3. Verify claim surfaces under customer's My Account portal.",
    "Expected Result (Spec)": "Offline claims raised by the CS team sync to the customer's account (frequency every 15 mins for new Claims) per Figma Frame 2383-11454 & Frame 630.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims portal not deployed on US staging.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-028",
    "Module": "Claim Tracking",
    "Feature Scope": "Cross-System Traceability",
    "Auth Matrix": "Internal Support / NetSuite / Zendesk",
    "Test Scenario / Title": "Verify Claim Numbers are Referenced Across Zendesk and NetSuite",
    "Preconditions": "Claim submitted online.",
    "Test Steps": "1. Check Zendesk ticket created/updated for claim\n2. Check NetSuite case record\n3. Verify identical Claim/Case ID referenced across both platforms.",
    "Expected Result (Spec)": "Claim numbers are referenced across Zendesk and NetSuite for internal traceability per Frame 630.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims portal not deployed on US staging.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },

  // -------------------------------------------------------------------------
  // SECTION 6: FIGMA DESIGN FIDELITY & REGIONAL STANDARDS (FRAME 630)
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-029",
    "Module": "Localization & Formatting",
    "Feature Scope": "USA Date Format",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify USA Date Formatting (MM/DD/YYYY) Compliance (Frame 630 Rule)",
    "Preconditions": "User views claims dates.",
    "Test Steps": "1. Inspect date column in claims table\n2. Verify format MM/DD/YYYY (e.g. 01/24/2026).",
    "Expected Result (Spec)": "Frame 630: Date must strictly render in USA format: MM/DD/YYYY. Australian format (DD/MM/YYYY) is prohibited.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-030",
    "Module": "Need Help & Support Block",
    "Feature Scope": "Regional Contact Information",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Need Help Block Displays US Contact Information (Frame 630 Rule)",
    "Preconditions": "Inspect Need Help section at bottom of My Claims page.",
    "Test Steps": "1. Verify telephone number is US toll-free / local format\n2. Verify email is US support (e.g., support@globewest.com)\n3. Check for Australian contact leakage.",
    "Expected Result (Spec)": "Need Help block must display US customer service contact information (not Australian +613 9518 1600 or sales@globewest.com.au) per Figma Frame 630 & Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims portal not deployed.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },

  // -------------------------------------------------------------------------
  // SECTION 7: MOBILE RESPONSIVENESS & ADVANCED UI BEHAVIOR (FRAMES 630 & 631)
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-031",
    "Module": "Mobile Responsiveness",
    "Feature Scope": "Claims Listing Mobile Layout (375px)",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Mobile View Layout for My Claims Listing (375px Viewport)",
    "Preconditions": "User views claims portal on mobile device (375px viewport).",
    "Test Steps": "1. Set viewport to 375x812\n2. Navigate to My Claims\n3. Inspect layout hierarchy, compact table, and navigation selector.",
    "Expected Result (Spec)": "Renders mobile layout per Frame 2383-11615: top compact account selector [ My Claims ⌵ ], compact 5-column table (Order, Date, Total, Status, Actions), full-width search input above horizontal scrolling status tabs, full-width [ CREATE NEW CLAIM ] button.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: 302 Redirect loop to My Dashboard on mobile.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11615 (mobile/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-032",
    "Module": "Mobile Responsiveness",
    "Feature Scope": "Create Claim Mobile Layout (375px)",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Mobile View Layout for Create Claim Form (375px Viewport)",
    "Preconditions": "User accesses claim creation on mobile device.",
    "Test Steps": "1. Set viewport to 375x812\n2. Navigate to /claims/create\n3. Verify form fields, dropzone, and CTAs stacking.",
    "Expected Result (Spec)": "Renders mobile form per Frame 2383-11131: single-column vertically stacked fields, full-width file dropzone, full-width stacked action buttons [ REVIEW ] and [ BACK ].",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Returns HTTP 404 Not Found.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11131 (mobile/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-033",
    "Module": "FAQ Accordion Block",
    "Feature Scope": "FAQ Mutex & Admin Rule",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify FAQ Block Mutex Behavior and Max 8 Accordions Rule",
    "Preconditions": "User on My Claims or Create Claim page viewing FAQ block.",
    "Test Steps": "1. Count rendered FAQ accordion items (max 8)\n2. Verify all accordions closed by default\n3. Click to open Accordion 1\n4. Click to open Accordion 2\n5. Verify Accordion 1 closes automatically.",
    "Expected Result (Spec)": "Up to 8 FAQs rendered; closed by default; strict mutex behavior enforced (opening an accordion closes previously opened accordion) per Frame 630.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Portal undeployed.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-034",
    "Module": "UI Table Behavior",
    "Feature Scope": "Action Column Display Logic",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Action Column Displays Direct 'VIEW' Link vs Dropdown (Frame 630 Rule)",
    "Preconditions": "User viewing claims grid.",
    "Test Steps": "1. Inspect row with only 'VIEW' action available\n2. Inspect row with multiple actions (e.g., View, Upload Documents, Cancel)\n3. Verify UI presentation.",
    "Expected Result (Spec)": "Per Frame 630: If 'VIEW' is the only action, hide the dropdown wrapper and render 'VIEW' as a direct inline link. If multiple actions exist, house them inside an actions dropdown.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-035",
    "Module": "UI Table Behavior",
    "Feature Scope": "Order Number Hyperlink Navigation",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Order Number is Clickable Hyperlink to Order Details",
    "Preconditions": "User viewing claims list containing order reference numbers.",
    "Test Steps": "1. Inspect Order Number cell (e.g. #CH03021)\n2. Verify element is an anchor tag with href pointing to /sales/order/view/order_id/...\n3. Click Order link and verify navigation.",
    "Expected Result (Spec)": "Per Frame 630: Order Number is an interactive clickable hyperlink navigating directly to that order's detail page.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-036",
    "Module": "UI Table Behavior",
    "Feature Scope": "Pagination Controls & Item Counter",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Pagination Controls and Items Counter per Frame 630",
    "Preconditions": "User has more claims than the configured items-per-page limit.",
    "Test Steps": "1. Inspect bottom of claims table\n2. Verify item count display on the left (e.g. 'X items')\n3. Verify page switcher on the right ([ 1 ] [ 2 ] [ > ])\n4. Click next page and verify grid update.",
    "Expected Result (Spec)": "Renders pagination bar per Frame 630: counter on left, page switcher on right, backend-configurable items per page.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 630 (Functional Specifications & Rules)"
  },
  {
    "Test Case ID": "TC-GW-CLM-037",
    "Module": "Create Claim Form",
    "Feature Scope": "Help Tooltips (🛈)",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Interactive Help Tooltips on Form Fields per Frame 631",
    "Preconditions": "User on Create Claim form.",
    "Test Steps": "1. Locate tooltips on: 'Claim type', 'Product or Invoice No', 'Quantity', 'Preferred resolution', 'Description of issue'\n2. Hover/click each tooltip\n3. Verify contextual helper popover appears with admin-configured text.",
    "Expected Result (Spec)": "All 5 specified fields feature interactive 🛈 tooltips with administrative copy per Frame 631 & Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Create Claim form returns 404.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 631 (Create Claim Functional Specifications)"
  },
  {
    "Test Case ID": "TC-GW-CLM-038",
    "Module": "Create Claim Form",
    "Feature Scope": "Media Dropzone & File Removal",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Media Upload Thumbnail Rendering and File Deletion Action",
    "Preconditions": "User uploads valid images (.jpg, .png) or video (.mp4, .mov) under 100MB.",
    "Test Steps": "1. Upload 2 files to dropzone\n2. Verify thumbnail previews and filenames render\n3. Click [ DELETE ] button on file 1\n4. Verify file 1 is removed from upload queue while file 2 remains.",
    "Expected Result (Spec)": "Thumbnails render dynamically alongside uploaded file names; [ DELETE ] action cleanly removes individual files prior to submission per Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-039",
    "Module": "Create Claim Form",
    "Feature Scope": "Preferred Resolution Selection",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Preferred Resolution Dropdown Options and Selection",
    "Preconditions": "User filling Create Claim form.",
    "Test Steps": "1. Click 'Preferred resolution' dropdown\n2. Inspect available options\n3. Select an option (e.g., Replacement, Credit, Repair)\n4. Verify selected option persists.",
    "Expected Result (Spec)": "Dropdown provides standardized resolution options (Replacement, Credit Note, Repair, Refund) per Figma Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-040",
    "Module": "Create Claim Workflow",
    "Feature Scope": "Review Summary & Form Progression",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Form Progression: [ REVIEW ] Summary Step and [ BACK ] State Preservation",
    "Preconditions": "User has filled all required claim form fields.",
    "Test Steps": "1. Click [ REVIEW ] button\n2. Verify system displays Claim Summary review modal/page\n3. Click [ BACK ] button\n4. Verify user returns to edit form with all entered data, attached photos, and selections intact.",
    "Expected Result (Spec)": "[ REVIEW ] navigates to summary review before lodging; [ BACK ] returns to form preserving all user input without data loss per Figma Frame 2383-11003 & Frame 631.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 631 & Frame 2383-11003"
  },

  // -------------------------------------------------------------------------
  // SECTION 8: EDGE CASES, DATA INTEGRITY & DUAL-AUTH VERIFICATION (AGENTS.md & FRAMES 630/631)
  // -------------------------------------------------------------------------
  {
    "Test Case ID": "TC-GW-CLM-041",
    "Module": "UI Table States",
    "Feature Scope": "Empty State Handling",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Empty State Display When No Claims Exist for Selected Filter",
    "Preconditions": "Account with zero claims or filter returning 0 records.",
    "Test Steps": "1. Navigate to My Claims with empty account or filter with 0 items\n2. Inspect table container\n3. Verify empty state copy and action CTA.",
    "Expected Result (Spec)": "Renders clean empty state ('You have no claims in this view') with primary [ CREATE NEW CLAIM ] CTA button; no broken table or JavaScript error per Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: 302 Redirect loop to My Dashboard.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-042",
    "Module": "Claims Search & Filtering",
    "Feature Scope": "Table Search Bar",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Live Keyword Search Filtering Across Claims Table",
    "Preconditions": "Customer has multiple claims across different orders/products.",
    "Test Steps": "1. Enter keyword in search input (e.g. Order #, SKU, or Product Name)\n2. Observe table update without page reload\n3. Clear search bar.",
    "Expected Result (Spec)": "System dynamically filters table rows matching search query with debounce (300ms) without full page reload per Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Claims listing inaccessible.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-043",
    "Module": "Claims Search & Filtering",
    "Feature Scope": "Status Filter Tabs (ALL, OPEN, PENDING, CLOSED)",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Status Filter Tab Switching and Active Indicator",
    "Preconditions": "User on My Claims listing page.",
    "Test Steps": "1. Click 'ALL' tab\n2. Click 'OPEN' tab\n3. Click 'PENDING' tab\n4. Click 'CLOSED' tab\n5. Verify active tab styling and URL/state update.",
    "Expected Result (Spec)": "Tab switches active indicator (underline/pill), updates displayed claims instantly or via clean AJAX request, and preserves filter state per Frame 2383-11454.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Route redirects to Dashboard.",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-044",
    "Module": "Navigation & Hierarchy",
    "Feature Scope": "Sidebar Active Indicator (AGENTS.md Rule 2)",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify My Account Sidebar 'MY CLAIMS' Active Brown Pill Styling and Sub-Items",
    "Preconditions": "User viewing any Claims view.",
    "Test Steps": "1. Inspect My Account left navigation sidebar\n2. Inspect 'MY CLAIMS' menu item\n3. Check computed background color, border-radius, and sub-items (Open Claims, Pending Claims, Closed Claims).",
    "Expected Result (Spec)": "'MY CLAIMS' item renders active brown pill styling with sub-items expanded per Figma Frame 2383-11454 and Rule 2 of AGENTS.md.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Inaccessible on live storefront (302 redirect).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P2 - MEDIUM",
    "Figma Frame Reference": "Figma Frame 2383-11454 (desktop/my_account/My Claims)"
  },
  {
    "Test Case ID": "TC-GW-CLM-045",
    "Module": "Form Validation",
    "Feature Scope": "Quantity Bound Enforcement",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Claim Quantity Cannot Exceed Purchased Invoice Quantity",
    "Preconditions": "User selected product with invoice quantity of 2.",
    "Test Steps": "1. Locate Quantity field\n2. Attempt to input quantity higher than invoice quantity (e.g., 5)\n3. Attempt to proceed to Review.",
    "Expected Result (Spec)": "System enforces quantity constraint: field max value locked to purchased quantity or shows inline error 'Quantity cannot exceed purchased quantity (2)' per Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Create Claim form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-046",
    "Module": "Media Intake Validation",
    "Feature Scope": "File Size Limit (100MB)",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Rejection of Media Files Exceeding 100MB Limit",
    "Preconditions": "User attempts to upload file > 100MB.",
    "Test Steps": "1. Select a video or image file > 100MB (e.g. 110MB .mp4)\n2. Drop into upload dropzone\n3. Verify upload rejection.",
    "Expected Result (Spec)": "System blocks file with clear validation toast/error: 'File size exceeds maximum limit of 100MB' per Frame 2383-11003 & Frame 631.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 631 (Create Claim Functional Specifications)"
  },
  {
    "Test Case ID": "TC-GW-CLM-047",
    "Module": "Media Intake Validation",
    "Feature Scope": "File Extension Whitelist",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Rejection of Disallowed File Extensions (.pdf, .exe, .zip)",
    "Preconditions": "User attempts to upload non-supported media type.",
    "Test Steps": "1. Attempt to upload a .pdf or .zip file\n2. Drop into file dropzone\n3. Verify validation error.",
    "Expected Result (Spec)": "System strictly enforces allowed formats (.jpg, .png, .mp4, .mov) and rejects other formats with 'Unsupported file type' error per Frame 2383-11003.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "Figma Frame 2383-11003 (desktop/my_account/Create Claim)"
  },
  {
    "Test Case ID": "TC-GW-CLM-048",
    "Module": "Submission & Notifications",
    "Feature Scope": "Confirmation Screen & Email Trigger",
    "Auth Matrix": "Authenticated (US Trade Customer)",
    "Test Scenario / Title": "Verify Post-Submission Confirmation Screen and Automated Email Trigger",
    "Preconditions": "User successfully submits a complete claim.",
    "Test Steps": "1. Complete review step and click [ SUBMIT CLAIM ]\n2. Verify confirmation page renders\n3. Verify display of NetSuite Case ID and timeline expectation\n4. Verify automated email dispatch.",
    "Expected Result (Spec)": "Page renders confirmation banner with NetSuite Case Number, resolution SLA details, and dispatches confirmation email to customer email address per Frame 2383-11003 & Frame 630.",
    "Actual Result (mcstaging2 Live)": "BLOCKED: Form undeployed (404).",
    "Status": "FAIL (Blocked by P0)",
    "Severity": "P0 - CRITICAL",
    "Figma Frame Reference": "Figma Frame 630 & Frame 2383-11003"
  },
  {
    "Test Case ID": "TC-GW-CLM-049",
    "Module": "Dual-Auth Matrix",
    "Feature Scope": "Logged-Out Public Browsing Mode (AGENTS.md Rule 3)",
    "Auth Matrix": "Logged-Out / Guest User",
    "Test Scenario / Title": "Verify Unauthenticated Guest Access to Claims URL Redirects to Login with Referer",
    "Preconditions": "Guest user browsing storefront without logging in.",
    "Test Steps": "1. Open incognito/guest browser\n2. Navigate directly to https://mcstaging2.globewest.com/claims\n3. Verify HTTP status and redirection.",
    "Expected Result (Spec)": "Unauthenticated users are redirected cleanly to /customer/account/login/ with referer parameter (or 404 masked); wholesale portal is strictly inaccessible per Rule 3 of AGENTS.md.",
    "Actual Result (mcstaging2 Live)": "Pass: Guest cannot access authenticated claims data.",
    "Status": "PASS",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "AGENTS.md Dual-Auth Matrix"
  },
  {
    "Test Case ID": "TC-GW-CLM-050",
    "Module": "Dual-Auth Matrix & AU Baseline",
    "Feature Scope": "AU Storefront Anti-Regression Safeguard (AGENTS.md Rule 3)",
    "Auth Matrix": "Authenticated (AU Customer / Trade deepalilondhe576@gmail.com)",
    "Test Scenario / Title": "Verify AU Baseline Storefront Invariant Integrity (Zero Defect Leakage from US Scope)",
    "Preconditions": "User authenticated on AU Staging (https://mcstaging2.globewest.com.au).",
    "Test Steps": "1. Login with AU credentials (deepalilondhe576@gmail.com / Deep@123)\n2. Navigate to AU My Account\n3. Verify AU claims architecture remains unchanged without US experimental route leakage.",
    "Expected Result (Spec)": "AU storefront operates on established baseline without regressions, broken redirects, or US theme leakage per Rule 3 of AGENTS.md.",
    "Actual Result (mcstaging2 Live)": "Pass: AU baseline intact.",
    "Status": "PASS",
    "Severity": "P1 - HIGH",
    "Figma Frame Reference": "AGENTS.md Dual-Auth Matrix & AU Baseline"
  }
];

// 1. Export CSV
const csvHeaders = Object.keys(testCases[0]);
const csvRows = testCases.map(tc => {
  return csvHeaders.map(header => {
    let val = (tc[header] || '').toString();
    val = val.replace(/"/g, '""');
    return `"${val}"`;
  }).join(',');
});
const csvContent = [csvHeaders.join(','), ...csvRows].join('\r\n');
const csvPath = path.join(BASE_DIR, 'Claims_Portal_Test_Cases.csv');
fs.writeFileSync(csvPath, csvContent, 'utf-8');
console.log(`✅ Saved CSV with Figma Frame References: ${csvPath}`);

// 2. Export Excel (.xlsx)
const worksheet = XLSX.utils.json_to_sheet(testCases);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Claims Portal Test Cases');
const xlsxPath = path.join(BASE_DIR, 'Claims_Portal_Test_Cases.xlsx');
XLSX.writeFile(workbook, xlsxPath);
console.log(`✅ Saved Excel with Figma Frame References: ${xlsxPath}`);
