# GlobeWest QA Comprehensive Audit Report: Claims Portal

> **Audit Standard**: Dual-Auth Matrix (US Trade Account + AU Baseline), Strict Figma Inspection (Node `2316-15694`), and Zero-Placeholder Verification per `AGENTS.md`.

---

## 1. Executive Summary & Verdict

| Feature / Metric | Status | Severity | Notes |
| :--- | :--- | :--- | :--- |
| **Ticket Name** | **Claims Portal** | - | Sprint 3 / US Storefront B2B |
| **Figma Node Reference** | `2316-15694` (`[FINAL] Designs`) | - | Includes Frames `2383-11454`, `2383-11615`, `2383-11003`, `2383-11131`, and `Frame 630` |
| **Target URL (US Staging)** | `https://mcstaging2.globewest.com/claims` | - | Routes via `/gw_sales/claim/index/status/open/` |
| **Baseline URL (AU Staging)** | `https://mcstaging2.globewest.com.au` | - | Australian customer reference |
| **Overall QA Verdict** | 🚨 **CRITICAL FAIL (P0 BLOCKED)** | **P0 BLOCKER** | Module is completely inaccessible to US trade customers |

### Core Blocker Overview
1. 🚨 **P0 BLOCKER 1 — 302 Redirect Loop on Claims Routes**: Navigating directly or via sidebar to Open Claims (`/gw_sales/claim/index/status/open/`), Pending Claims, or Closed Claims immediately executes an **HTTP 302 Redirect back to My Dashboard (`/customer/account/`)**. The Claims listing table, status tabs, and header CTAs are 100% inaccessible.
2. 🚨 **P0 BLOCKER 2 — Dashboard "Submit Claim" CTA Has Dead Link (`href="#"`)**: On `/customer/account/`, the notification banner reads `"New: You can now submit claims online"`, but the CTA `<a class="od-notification__button" href="#">SUBMIT CLAIM</a>` points to `href="#"` and performs no action.
3. 🚨 **P0 BLOCKER 3 — Create Claim Form Not Deployed (404 Not Found)**: Direct navigation to `/claims/create` or `/gw_sales/claim/create/` returns an immediate **HTTP 404 Not Found**.
4. 🚨 **P1 HIGH — Left Sidebar Hierarchy & Missing Badges**: Figma specifies `MY CLAIMS` as a primary top-level menu section with an active brown pill indicator and numeric badges (`Open Claims [ 3 ]`, `Pending Claims [ 3 ]`). Live staging nests items under an unexpanded tree with zero count badges.
5. 🚨 **P1 HIGH — Frame 630 Functional Rules Non-Compliance**:
   - Date format must strictly be USA format (`MM/DD/YYYY`).
   - FAQ Accordion block must support max 8 accordions with strict mutex (only 1 open at a time).
   - Need Help block must display US customer service contact information (not Australian `+613 9518 1600` or `sales@globewest.com.au`).

---

## 2. Dual-Auth Matrix Verification Summary

| Auth State | Environment / Storefront | Account Credentials | Observed System Behavior | Compliance Status |
| :--- | :--- | :--- | :--- | :--- |
| **Authenticated (Trade Customer)** | **US Staging** (`mcstaging2.globewest.com`) | `deepali.londhe@overdose.digital` | Logged-in session maintained; Enterprise tier discount active; clicking Claims menu items results in immediate 302 redirect back to My Dashboard. | 🔴 **FAIL (P0 Blocker)** |
| **Authenticated (Customer Account)** | **AU Baseline** (`mcstaging2.globewest.com.au`) | `deepalilondhe576@gmail.com` | AU baseline operates without regression spillover from US changes. | 🟢 **PASS (AU Baseline)** |
| **Public Browsing (Logged-Out Guest)** | **US Staging** (`mcstaging2.globewest.com`) | None (Anonymous Guest) | Public guest visiting `/claims` is redirected to customer login or 404; trade pricing masked. | 🟢 **PASS (Masking Enforced)** |

---

## 3. Approved Figma Frames vs Live Staging Comparison

### A. Desktop Listing: `desktop/my_account/My Claims` (`2383-11454`, 1440×1573 px)

| UI Component | Approved Figma Specification | Actual US Live Staging Behavior | Defect Classification |
| :--- | :--- | :--- | :--- |
| **Page Route** | Dedicated My Claims URL (`/claims` or `/customer/account/claims`) | Redirects (302) to `/customer/account/` | 🔴 **P0 CRITICAL BLOCKER** |
| **Primary Header Action** | Outlined button `[ CREATE NEW CLAIM ]` top right | Missing; not rendered | 🔴 **P0 CRITICAL BLOCKER** |
| **Filter Tabs** | 4 Tabs: `ALL` (default active), `OPEN`, `PENDING`, `CLOSED` | Missing; not rendered | 🔴 **P0 CRITICAL BLOCKER** |
| **Table Grid Columns** | 8 Columns: `Order, Invoice, Date, Cust PO#, Order Name, Client Name, Status, Details` | Missing; only Recent Orders (6 cols) shown on Dashboard | 🔴 **P0 CRITICAL BLOCKER** |
| **Date Formatting** | Strictly USA format `MM/DD/YYYY` (e.g. `01/24/2026`) | Dashboard dates render as `MM/DD/YY` | 🟡 **P1 HIGH (To Verify on Deploy)** |
| **Order Number Link** | Interactive hyperlink leading to order detail view | Missing on claims | 🟡 **P1 HIGH** |
| **Action Dropdown Logic** | Single action = direct link "VIEW"; Multiple actions = dropdown | Missing on claims | 🟡 **P1 HIGH** |
| **FAQ Accordion Block** | Max 8 accordions; strict mutex (only 1 open at once) | Absent | 🟡 **P1 HIGH** |
| **Need Help Block** | US Contact details (US phone & email) | Absent | 🟡 **P1 HIGH** |

---

### B. Mobile Listing: `mobile/my_account/My Claims` (`2383-11615`, 375×1654 px)

| UI Component | Approved Figma Specification | Actual US Live Staging Behavior | Defect Classification |
| :--- | :--- | :--- | :--- |
| **Responsive Viewport** | 375px fluid single-column layout | Redirects (302) to Dashboard | 🔴 **P0 CRITICAL BLOCKER** |
| **Navigation Selector** | Top compact dropdown selector `[ My Claims ⌵ ]` | Standard mobile account menu | 🟡 **P1 HIGH** |
| **Mobile Table Columns** | 5 Columns: `Order, Date, Total, Status, Actions ⌵` | Missing | 🔴 **P0 CRITICAL BLOCKER** |
| **Search & Filter Stacking** | Search input stacked above horizontally scrolling tabs | Missing | 🔴 **P0 CRITICAL BLOCKER** |
| **Create Claim CTA** | Full-width button stacked below subtext | Missing | 🔴 **P0 CRITICAL BLOCKER** |

---

### C. Create Claim Form: `desktop/my_account/Create Claim` (`2383-11003`, 1440×2292 px)

| UI Component | Approved Figma Specification | Actual US Live Staging Behavior | Defect Classification |
| :--- | :--- | :--- | :--- |
| **Page Route** | `/claims/create` or `/gw_sales/claim/create/` | Returns **404 Not Found** | 🔴 **P0 CRITICAL BLOCKER** |
| **Autocomplete Search** | Live lookup by Product Name, SKU, or Invoice Number | Not deployed | 🔴 **P0 CRITICAL BLOCKER** |
| **Tooltips (`🛈`)** | Present on Claim type, Product/Invoice No, Qty, Resolution, Description | Not deployed | 🔴 **P0 CRITICAL BLOCKER** |
| **File Uploader Dropzone** | JPG, PNG, MP4, MOV up to 100MB with thumbnail & delete action | Not deployed | 🔴 **P0 CRITICAL BLOCKER** |
| **Form CTAs** | `[ BACK ]` (navigates to list) and `[ REVIEW ]` (summary before submit) | Not deployed | 🔴 **P0 CRITICAL BLOCKER** |

---

## 4. Defect Evidence & Detailed Analysis Cards

### Defect 01 — P0 CRITICAL BLOCKER: Claims Routes 302 Redirect Loop
- **Defect Summary**: Authenticated US Trade Customer navigating to Open, Pending, or Closed Claims is redirected back to My Dashboard.
- **Expected**: Renders My Claims portal with status tabs and claims data table per Figma Frame `2383-11454`.
- **Actual**: System issues an HTTP 302 Redirect from `/gw_sales/claim/index/status/open/` directly to `/customer/account/`.
- **Visual Evidence**:

![Comparison 01: Claims Listing Route 302 Redirect Defect](comparison/COMPARISON_01_CLAIMS_LISTING_ROUTE_REDIRECT_DEFECT.png)

---

### Defect 02 — P0 CRITICAL BLOCKER: Dashboard "Submit Claim" CTA Dead Link (`href="#"`)
- **Defect Summary**: The dashboard notification card displays `"New: You can now submit claims online"`, but the CTA button `<a class="od-notification__button" href="#">SUBMIT CLAIM</a>` points to `href="#"`.
- **Expected**: Clicking `"SUBMIT CLAIM"` routes to the Create Claim workflow (`/claims/create` or `/gw_sales/claim/create/`).
- **Actual**: Button contains dummy placeholder `href="#"`. Clicking scrolls to top of page without performing any action.
- **Visual Evidence**:

![Comparison 02: Dashboard Submit Claim Dead Link Defect](comparison/COMPARISON_02_DASHBOARD_SUBMIT_CLAIM_DEAD_LINK.png)

---

### Defect 03 — P0 CRITICAL BLOCKER: Create Claim Form Routes Return 404 Not Found
- **Defect Summary**: Create Claim form routes (`/claims/create` and `/gw_sales/claim/create/`) are completely missing from the staging environment.
- **Expected**: Renders Create a Claim multi-step submission form per Figma Frame `2383-11003`.
- **Actual**: Both URLs return HTTP 404 Not Found (`[US] 404 Not Found`).
- **Visual Evidence**:

![Comparison 03: Create Claim Form Not Deployed 404 Defect](comparison/COMPARISON_03_CREATE_CLAIM_FORM_NOT_DEPLOYED.png)

---

### Defect 04 — P1 HIGH: Frame 630 Functional Rules Non-Compliance
- **Defect Summary**: Frame 630 architectural specifications (USA Date format `MM/DD/YYYY`, FAQ block mutex, Need Help US contact details) are not yet integrated or enforceable due to missing portal templates.
- **Expected**:
  1. Mandatory USA Date format `MM/DD/YYYY` (AU `DD/MM/YYYY` strictly prohibited).
  2. FAQ Accordion block supports max 8 accordions with strict mutex (only 1 accordion open at a time).
  3. Need Help block must display US customer service contact details, not Australian phone/email.
- **Actual**: Claims module is not rendered; Frame 630 rules cannot be validated until the base route is deployed.
- **Visual Evidence**:

![Comparison 04: Frame 630 Spec Rules vs Live Staging](comparison/COMPARISON_04_FRAME_630_SPEC_RULES_VS_LIVE.png)

---

## 5. Automated Test Cases Summary

A complete 25-test-case validation matrix has been developed and exported to both Microsoft Excel and CSV formats:
- **Excel Spreadsheet**: `Sprint-3/Ticket_Claims_Portal/Claims_Portal_Test_Cases.xlsx`
- **CSV Data File**: `Sprint-3/Ticket_Claims_Portal/Claims_Portal_Test_Cases.csv`

### Test Suite Distribution

| Category / Module | Test Cases Count | Pass Count | Fail / Blocked Count |
| :--- | :--- | :--- | :--- |
| **Routing & Navigation** | 3 | 0 | 3 (P0/P1) |
| **Dashboard Integration** | 1 | 0 | 1 (P0) |
| **Create Claim Workflow** | 5 | 0 | 5 (P0) |
| **Sidebar Navigation** | 2 | 0 | 2 (P1/P2) |
| **Claims Table Grid** | 2 | 0 | 2 (P0) |
| **Filter Controls & CTAs** | 2 | 0 | 2 (P0) |
| **Localization & Formatting** | 1 | 0 | 1 (P1) |
| **Data Table Interactions** | 2 | 0 | 2 (P1) |
| **Shared Blocks (FAQs & Help)** | 2 | 0 | 2 (P1) |
| **Dual-Auth Matrix** | 2 | 2 | 0 |
| **Cross-Storefront Parity** | 1 | 1 | 0 |
| **Mobile Responsive & A11y** | 2 | 0 | 2 (P0/P1) |
| **TOTAL** | **25** | **3** | **22 (Blocked by P0)** |

---

## 6. Verification Execution Commands

Per **Rule 6** of `AGENTS.md`, the dedicated command file is located at:
`Sprint-3/Ticket_Claims_Portal/Claims Portal runcommand.txt`

```text
Ticket Name: Claims Portal
Page Name: Claims Portal (https://mcstaging2.globewest.com/claims)

Run command for Desktop View:
npx playwright test tests/claims-portal.spec.js --project=chromium --headed

Run command for Mobile View:
npx playwright test tests/claims-portal.spec.js --project=mobile --headed
```
