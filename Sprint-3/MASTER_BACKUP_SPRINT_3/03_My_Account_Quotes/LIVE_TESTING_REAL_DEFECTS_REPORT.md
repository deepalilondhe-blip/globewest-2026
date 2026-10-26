# Live Testing & Real Defect Audit Report

## Ticket #41794529: My Account - Quotes

| Metadata Field | Verification Details |
| :--- | :--- |
| **Ticket Name** | **My Account - Quotes** |
| **Teamwork Task** | [#41794529](https://overdose.eu.teamwork.com/app/tasks/41794529) |
| **Target URL** | `https://mcstaging2.globewest.com/gw_quotes/quote/index/` |
| **Figma Design Spec** | [Globewest USA - External (Node 2581-64235 / Frame 622)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0) |
| **Test Environment** | US Live Staging (`mcstaging2.globewest.com`) |
| **Execution Date** | 2026-09-23 14:31 IST |
| **Execution Mode** | Real Automated Browser Capture (Chromium Desktop 1440×900 & Mobile 390×844) |
| **QA Lead** | Deepali Londhe (`@DeepaliL`) |

---

## 1. Executive Summary & Verification Outcome

Live testing was executed using automated Playwright browser sessions on `mcstaging2.globewest.com/gw_quotes/quote/index/` under the authenticated Trade Customer profile (`deepali.londhe@overdose.digital`).

### ✅ Changes Deployed / Passed by Developer:
1. **Status Filter Tabs**: The filter tabs **correctly default to "ALL"** upon initial page load with a dark solid active state (`background: #2b1d16; color: #fff`).
2. **Search Bar Row Alignment**: The search bar is placed **inline on the same horizontal row** to the right of the filter tabs.
3. **Table Column Consolidation**: The standalone `DETAILS` column has been removed, reducing the table from 9 columns down to 8 columns.
4. **FAQ Accordion Block (NEWLY DEPLOYED)**: The dedicated *"Frequently Asked Questions"* accordion block has been deployed directly below the quotes table on both desktop and mobile.
5. **"Need Help? Contact our sales team" Block (NEWLY DEPLOYED)**: Rendered directly below the FAQs with phone and email support information.

---

## 2. 🔴 Real Live Defects Catalog

---

### Defect 01: Table Header Copy Mismatches (`EXPIRY DATE` & `QUOTE NAME`)

* **Severity**: ⚠️ **MEDIUM (Figma Discrepancy)**
* **Component**: `.account-listing-ui__table thead tr th`
* **Expected (Frame 622 Spec)**:
  * Column 2 header must be: **`EXP. DATE`**
  * Column 4 header must be: **`ORDER NAME`**
* **Actual (Live Staging)**:
  * Column 2 header displays: **`EXPIRY DATE`**
  * Column 4 header displays: **`QUOTE NAME`**

---

### Defect 02: Raw Magento Blue Empty State Alert (`Table is empty!`)

* **Severity**: 🔴 **HIGH (Visual / Micro-UI)**
* **Component**: `.message.info.empty`
* **Expected (Frame 622 Spec)**:
  * Clean, brand-aligned empty state message adhering to GlobeWest luxury aesthetics.
* **Actual (Live Staging)**:
  * Displays the default unstyled Magento blue alert banner: `ⓘ Table is empty!` (`background: #d9edf7; color: #31708f; border: 1px solid #bce8f1; padding: 15px`).

---

### Defect 03: FAQ Accordion Single-Open Constraint Violation

* **Severity**: ⚠️ **LOW / MICRO-DEFECT (Interaction Logic)**
* **Component**: `.od-dynamic-cms-block .accordion` / PageBuilder FAQ Accordion
* **Expected (Frame 622 Spec)**:
  * Frame 622 explicitly mandates: *"When a user clicks to open another accordion, close any other accordion that was open (ie. only one open at a time)"*.
* **Actual (Live Staging)**:
  * Multiple accordions stay expanded simultaneously when clicked. Opening FAQ 2 does NOT automatically close FAQ 1.

---

### Defect 04: Left Navigation Sidebar Missing Numerical Count Badges

* **Severity**: ⚠️ **MEDIUM (Visual Parity)**
* **Component**: `.account-nav .nav.item .badge`
* **Expected (Figma Spec)**:
  * Left sidebar menu items feature high-contrast blue capsule count badges: `Quotes [723]`, `Holds [3]`, `Orders [3]`.
* **Actual (Live Staging)**:
  * Zero numerical count badges are rendered in the sidebar navigation. Items appear as plain text links.


![Defect 05: Missing Sidebar Count Badges](screenshots/defects/REAL_DEFECT_05_MISSING_SIDEBAR_COUNT_BADGES.png)
---

## 3. Real Defect Summary Table

| Defect # | Module / Area | Defect Summary | Severity | Remediation Action Required |
| :---: | :--- | :--- | :---: | :--- |
| **01** | Table Headers | `EXPIRY DATE` & `QUOTE NAME` copy mismatch | ⚠️ MEDIUM | Rename to `EXP. DATE` and `ORDER NAME` in table template. |
| **02** | Empty State | Raw default Magento blue alert box (`Table is empty!`) | 🔴 HIGH | Replace with brand-styled empty state component. |
| **03** | FAQ Accordion | FAQ Accordion module 100% missing below table | 🔴 CRITICAL | Integrate FAQ accordion component (up to 8 items, single active open). |
| **04** | Support Block | "Need Help? Contact Our Sales Team" block 100% missing | 🔴 CRITICAL | Add support content block with US phone/email below FAQs. |
| **05** | Sidebar Navigation | Zero numerical count badges in left navigation menu | ⚠️ MEDIUM | Implement badge counter rendering for Quotes, Holds, and Orders. |

---

### 📋 Scope Clarifications & Validations:
* **Mobile "Actions" Column**: Verified on live staging DOM that the column is `Actions` (`<th class="col actions">Actions</th>`). On responsive viewports, horizontal scrolling allows full viewing.
* **Australian Footer Badge**: Identified as global theme-level footer scope rather than ticket-specific defect, hence excluded from this ticket's acceptance criteria.
