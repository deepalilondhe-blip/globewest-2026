# QA Audit Report: Static Pages (Terms, Privacy, Contact, FAQ, 404)
**Ticket:** [#41794538 - Static Pages: Terms, Privacy, Contact, FAQ, 404](https://overdose.eu.teamwork.com/app/tasks/41794538)  
**Storefronts Audited:**
- **US Staging (Target):** `https://mcstaging2.globewest.com` (Logged-In Trade Customer: `deepali.londhe@overdose.digital`)
- **AU Staging (Approved Baseline):** `https://mcstaging2.globewest.com.au` (Logged-In Customer: `deepalilondhe576@gmail.com`)
**Requirement:** *"Match AU, no redesign required. US site to be built to WCAG 2.2 AA."*  
**Viewports Tested:** Desktop (1440×900) & Mobile (390×844 iPhone 14/15)  
**Date:** October 1, 2026  
**Status:** Audit Completed — **4 Defects Logged (2 High, 1 Medium, 1 Low)**

---

## 1. Executive Summary & Page-by-Page Status Matrix

| Page Name | AU Baseline URL | US Staging URL | Visual Fidelity | Content Parity | WCAG 2.2 AA | Overall Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: |
| **Privacy Policy** | `/privacy-policy` | `/privacy-policy` | ✅ MATCH | ✅ 1-to-1 Match (7 H2s) | ✅ PASS | 🟢 **PASS** |
| **Terms & Conditions** | `/terms-and-conditions-page` | `/terms-and-conditions-page` | ✅ MATCH | ⚠️ US Adapted (AU legal leakage) | ✅ PASS | 🟡 **PASS w/ Notes** |
| **Contact Us** | `/contact` | `/contact-us` | ⚠️ DEFECT | ❌ AU Showrooms Leaked | ⚠️ Broken Img | 🔴 **DEFECT LOGGED** |
| **Help Centre / FAQ** | `/help-centre` | `/help-centre` | ⚠️ DEFECT | ❌ Empty `<title>` Tag | ❌ Fails 2.4.2 | 🔴 **DEFECT LOGGED** |
| **404 Error Page** | `/404-test` | `/404-test` | ✅ MATCH | ⚠️ `[US]` Title Prefix | ✅ PASS | 🟡 **DEFECT LOGGED** |

---

## 2. Comprehensive Page-by-Page Audit Details

### 1. Privacy Policy (`/privacy-policy`)
- **AU Baseline vs US Staging Parity:**
  - Headings match 1-to-1 across all 7 sections:
    1. *What we collect*
    2. *What we do with the information we gather*
    3. *Security*
    4. *How we use cookies*
    5. *Links to other websites*
    6. *Controlling your personal information*
    7. *List of cookies we collect*
  - Body character count: AU = 25,164 chars, US = 25,194 chars.
  - Zero broken images detected.
  - Cookie specification table renders with proper column headers and handles responsive horizontal overflow seamlessly on mobile viewports.
  - *Recommendation:* Legal team should confirm whether CCPA (California Consumer Privacy Act) or US-specific disclosures need to replace Australian Privacy Principles references.

### 2. Terms & Conditions (`/terms-and-conditions-page`)
- **Layout & Structure:**
  - US Staging features an enhanced tabbed accordion presentation (`Trade Customers` vs `General Public`) with 16 collapsible clause drawers, which is substantially cleaner and more readable than AU Staging's uncollapsed single document dump (which also inadvertently prepends the Privacy Policy text).
  - Mobile responsiveness: Accordion triggers and tab pills wrap smoothly within 390px without horizontal clipping.
- **Defect / Flagged Finding (Defect #3):**
  - Clause 1.1 states: *"We are GlobeWest Pty Ltd, a company incorporated and registered in Victoria, Australia with company number ACN 674 872 621..."*
  - Clause 12 references *"PPSA – security interests"* (Australian federal Personal Property Securities Act 2009).
  - Listed claims email: `claims@globewest.com.au`.
  - *Action:* Legal team must provide US entity registration and state governing law clauses.

### 3. Contact Us (`/contact-us`)
- **Functional Integrity:**
  - Online inquiry form renders with all required fields (Name, Email, Phone, Subject, Message) and triggers client-side validation on empty submission.
  - Form adapts to mobile into a clean single-column stack with 100% identical text (2,494 characters on both Desktop and Mobile).
- **Defects / Flagged Findings:**
  - **Staging Test Text in Heading (Defect #5):** H3 subheading on US Staging reads: `“We’d love to help you test”` (live AU is clean: `“We’d love to help you”`).
  - **AU Showroom Data Leakage (Defect #2):** The "Our Showrooms" section displays Australian physical showrooms:
    - *Melbourne Head Office & Warehouse*
    - *Sydney Showroom*
    - *Brisbane Showroom*
    - *Perth Showroom*
  - Listed showroom contact emails are Australian: `melbourne@globewest.com.au`, `sydney@globewest.com.au`, etc.
  - **Broken Asset:** Image asset `GW-090724-005-3_375x420.jpg` returns HTTP 404.

### 4. Help Centre / FAQ (`/help-centre`)
- **Note on URL Structure:** Both AU and US return 404 for `/faq`. All FAQ and self-service support documentation is hosted on `/help-centre` (which is correctly linked from the footer "Support / FAQ").
- **Defects / Flagged Findings (Defect #1):**
  - **Empty Document Title (WCAG 2.2 AA Violation):**
    - AU Baseline has `<title>Help centre</title>`.
    - US Staging has `<title></title>` (`document.title === ""`).
    - *WCAG Violation:* Fails WCAG 2.2 Success Criterion 2.4.2 (Page Titled - Level A). A page must have a descriptive title for screen readers and search crawlers.
  - **Broken Hero Banner Image:** Image `https://mcstaging2.globewest.com/media/wysiwyg/help-center-banner.jpg` returns HTTP 404.

### 5. 404 Page Not Found (`/non-existent-page-404-test`)
- **Status & Shell Rendering:**
  - Correctly issues an HTTP 404 status code header.
  - Global header and footer render identically to AU baseline.
  - Main messaging matches AU baseline: H2 *"Page not available."* with recovery navigation links.
- **Defect / Flagged Finding (Defect #4):**
  - AU Baseline document title is clean: `<title>404 Not Found</title>`.
  - US Staging document title contains internal staging prefix: `<title>[US] 404 Not Found</title>`.

---

## 3. Formal Defect Log

### 🔴 Defect 1: Help Centre Missing `<title>` Tag (WCAG 2.2 AA Violation) & Broken Hero Banner
- **Severity:** P1 - High
- **URL:** `https://mcstaging2.globewest.com/help-centre`
- **Expected:**
  - Browser tab title: `<title>Help centre</title>`
  - Hero banner image loads valid photography.
- **Actual:**
  - Browser tab title is completely EMPTY (`document.title === ""`), violating WCAG 2.4.2.
  - Hero banner `help-center-banner.jpg` returns HTTP 404.
- **Proof:** `DEFECT_SCREENSHOTS/ANNOTATED_DEFECT_1.png`

---

### 🔴 Defect 2: US Contact Us Page Leaking Australian Showrooms & `.com.au` Emails
- **Severity:** P1 - High
- **URL:** `https://mcstaging2.globewest.com/contact-us`
- **Expected:** US Showroom addresses / US customer service contact points.
- **Actual:** Displays Melbourne, Sydney, Brisbane, Perth Australian showrooms and `melbourne@globewest.com.au` email addresses. Broken image: `GW-090724-005-3_375x420.jpg`.
- **Proof:** `DEFECT_SCREENSHOTS/ANNOTATED_DEFECT_2.png`

---

### 🟡 Defect 3: Australian Corporate Entity & Statutory Jurisdiction in US Terms
- **Severity:** P2 - Medium
- **URL:** `https://mcstaging2.globewest.com/terms-and-conditions-page`
- **Expected:** Terms governed by US laws and US corporate entity details.
- **Actual:** Clause 1.1 specifies "GlobeWest Pty Ltd, Victoria, Australia ACN 674 872 621", claims email is `claims@globewest.com.au`, and references Australian PPSA statute.
- **Proof:** `DEFECT_SCREENSHOTS/ANNOTATED_DEFECT_3.png`

---

### 🟢 Defect 4: 404 Page Document Title Leaking Internal Staging Identifier `[US]`
- **Severity:** P3 - Low
- **URL:** `https://mcstaging2.globewest.com/non-existent-page-404-test`
- **Expected:** Clean browser title: `<title>404 Not Found</title>`.
- **Actual:** Title is `<title>[US] 404 Not Found</title>`.
- **Proof:** `DEFECT_SCREENSHOTS/ANNOTATED_DEFECT_4.png`

---

## 4. Test Deliverables & Artefacts

1. **Test Cases Documentation:**
   - [`Static_Pages_Test_Cases.csv`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794538_Static_Pages/Static_Pages_Test_Cases.csv) — 18 detailed test cases covering all 5 static pages.
   - [`Static_Pages_Test_Cases.xlsx`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794538_Static_Pages/Static_Pages_Test_Cases.xlsx) — Excel workbook with formatted column widths.
2. **Interactive Visual Dashboard:**
   - [`VIEW_REAL_PAGE_COMPARISON.html`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794538_Static_Pages/VIEW_REAL_PAGE_COMPARISON.html) — Filterable dashboard displaying Desktop & Mobile side-by-side comparisons in pure unhighlighted format.
   - [`VIEW_DEFECT_IMAGES.html`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794538_Static_Pages/VIEW_DEFECT_IMAGES.html) — Red/Green defect proof viewer with root-cause breakdowns.
3. **Execution Commands:**
   - [`Static Pages runcommand.txt`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794538_Static_Pages/Static%20Pages%20runcommand.txt) — Strictly conforming to Rule 6 standard.
