# Sprint-3 Demo Notes: My Account - Quotes — US Storefront (Ticket #41794529)

> **Audience:** Product Owners, Front-End Tech Leads, Solution Architects & Stakeholders  
> **Speaker / Presenter:** Deepali Londhe (Senior QA Lead)  
> **Topic:** Live Verification & Demo Walkthrough of My Quotes Portal (`/gw_quotes/quote/index/`)  
> **Target Environment:** `https://mcstaging2.globewest.com/gw_quotes/quote/index/`  
> **Figma Reference:** [Globewest USA - External (Node 2581-64235 / Frame 622)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0)  

---

## 1. Feature Overview & Scope Delivered
* **Ticket ID:** [#41794529](https://overdose.eu.teamwork.com/app/tasks/41794529) — `My Account - Quotes (P-GLW-007 Globewest US Expansion Project)`
* **Assigned QA Lead:** Deepali Londhe (`@DeepaliL`)
* **Target User Profile:** Authenticated Trade Customer (`deepali.londhe@overdose.digital`)
* **Objective:** Deliver the dedicated B2B Trade Customer Quotes Portal within the My Account section, ensuring seamless quote lookup, status filtering, consolidated row actions, integrated self-service FAQ accordions, and dedicated sales support routing for the US storefront.

---

## 2. Live Sprint Demo Walkthrough Script (Step-by-Step)

### Step 1: Trade Customer Authentication & Navigation (Desktop 1440×900)
1. **Action:** Navigate to `https://mcstaging2.globewest.com/customer/account/login/` and log in with Trade Customer credentials (`deepali.londhe@overdose.digital`).
2. **Action:** Click **"My Quotes"** in the left sidebar navigation (or direct route `/gw_quotes/quote/index/`).
3. **Talking Points:**
   - Confirm page title renders **"My Quotes"** along with the validity copy: *"A GlobeWest quote is valid for 30 days, enough time for your clients to imagine all the joyful moments..."*
   - Verify left sidebar navigation highlights **"My Quotes"** as the active item.
   - Point out account sidebar numerical count badges (e.g., `Quotes [723]`).

### Step 2: Status Filter Tabs & Default Selection (Frame 622 Acceptance Criteria)
1. **Action:** Highlight the segmented tab bar directly above the quotes table.
2. **Talking Points:**
   - Per **Frame 622 Rule 1**, the filter tabs must **default to "ALL"** upon initial page load.
   - Tabs are styled as a cohesive segmented pill control (`ALL`, `OPEN`, `CONVERTED`, `EXPIRED`).
   - The active tab renders with an inverted solid dark background (`#1E1E1E`) and crisp white typography.
   - Clicking between tabs triggers instant, seamless grid filtering based on quote status.

### Step 3: Quotes Data Grid Structure & Unified Actions Dropdown
1. **Action:** Walk through the table column headers and row action controls.
2. **Talking Points:**
   - Table structure strictly adheres to the **8-column Figma layout**:
     1. `QUOTE N` (Quote Number with sort indicator `⬍`)
     2. `EXP. DATE` (Enforcing US Date standard `MM/DD/YYYY`)
     3. `CUST PO#` (Customer Purchase Order reference)
     4. `ORDER NAME` (Descriptive quote/order title)
     5. `CLIENT NAME` (End-client name)
     6. `STATUS` (Status badge: `Open`, `Converted`, `Expired`)
     7. `TOTAL` (US currency formatting `$USD`)
     8. `ACTIONS` (Consolidated dropdown menu)
   - **Unified Actions Dropdown (Frame 622 Rule 3):** Point out that individual row interactions (`View`, `Edit`, `Reorder`, `Download PDF`) are neatly consolidated under a single, responsive **`Actions ▾`** dropdown rather than fragmented across separate columns.

### Step 4: Search Component & Real-Time Lookup
1. **Action:** Demonstrate quote lookup using the search input.
2. **Talking Points:**
   - The search input sits **inline on the same horizontal row** adjacent to the filter tabs, maintaining a clean, balanced layout.
   - Search filters table records dynamically by Quote #, Customer PO#, Order Name, or Client Name.

### Step 5: Self-Service FAQ Accordion Block (Frame 622 Block 2)
1. **Action:** Scroll below the quotes table to the **"Frequently Asked Questions"** section.
2. **Talking Points:**
   - New modular FAQ component built specifically for the My Account experience.
   - Pre-populated with up to 8 contextual quotes-related questions.
   - **Accordion Behavior (Frame 622):** All accordions are collapsed by default upon page load.
   - Clicking to expand an accordion smoothly reveals the answer; expanding a new accordion automatically closes any previously open accordion (**single-accordion active constraint**).

### Step 6: "Need Help? Contact Our Sales Team" Support Block (Frame 622 Block 3)
1. **Action:** Scroll to the dedicated support banner positioned directly beneath the FAQs.
2. **Talking Points:**
   - Direct escalation path for Trade Customers needing assistance with custom quotes or large-scale orders.
   - Features direct sales hotline, dedicated trade email link, and operational hours formatted for US time zones.

### Step 7: Mobile Viewport & Touch Responsiveness (390×844 iPhone View)
1. **Action:** Switch to Mobile Viewport in Chrome DevTools (390×844 / 375×812).
2. **Talking Points:**
   - Filter tabs switch to a horizontally scrollable or stacked segmented bar with comfortable touch targets (minimum 44×44px).
   - Search bar scales to 100% container width.
   - Table collapses cleanly into responsive card-based or scrollable grid view with consolidated `Actions` dropdown accessible on every record.
   - FAQ accordions and Support block retain clean, thumb-friendly tap accessibility.

---

## 3. Current Live Staging Deployment Status & Defect Registry

> [!WARNING]
> **Pre-Deployment Alert (Audit Date: 2026-09-23):**  
> Automated live retest and pixel comparison confirm that **developer frontend changes have NOT yet been deployed** to `mcstaging2.globewest.com`. The live environment currently reflects the unstyled pre-development baseline.

### Pending Engineering Remediation Items (Defects Cataloged):

| Defect # | Feature / Module | Frame 622 / Figma Requirement | Live Staging Actual State | Severity |
| :---: | :--- | :--- | :--- | :---: |
| **Pass 01** | **Filter Tabs** | Must default to **`ALL`** with solid pill styling | Defaults to **`OPEN`** with raw text underline | 🔴 HIGH |
| **Pass 02** | **Table Structure** | 8 Columns; unified `Actions` dropdown; no `DETAILS` | 9 Columns; unstyled redundant `DETAILS` column | 🔴 HIGH |
| **Pass 03** | **Search Bar** | Placed inline horizontally beside filter tabs | Floating disconnected above table right | ⚠️ MEDIUM |
| **Pass 04** | **FAQ Block** | Dedicated FAQ Accordion section below table | **100% MISSING** from live DOM | 🔴 CRITICAL |
| **Pass 05** | **Need Help Block** | "Need help? Contact our sales team" Content Block | **100% MISSING** from live DOM | 🔴 CRITICAL |
| **Pass 06** | **Sidebar Badges** | Numerical count badges (`Quotes [723]`, `Holds [3]`) | Zero count badges rendered in sidebar | ⚠️ MEDIUM |
| **Pass 07** | **Mobile Empty State**| Custom brand-styled empty state alert | Raw blue Magento alert (`Table is empty!`) | 🔴 HIGH |
| **Pass 08** | **Storefront Footer**| Suppress Australian Kangaroo badge on US store | Clean on latest build (verified passed) | 🟢 PASS |

---

## 4. Test Artifacts & Demo Collateral
* **Desktop Staging Capture:** [`screenshots/desktop/01_my_quotes_desktop_live_full.png`](screenshots/desktop/01_my_quotes_desktop_live_full.png)
* **Mobile Staging Capture:** [`screenshots/mobile/01_my_quotes_mobile_live_full.png`](screenshots/mobile/01_my_quotes_mobile_live_full.png)
* **Side-by-Side Red/Green Visual Proof:** Stored in [`comparison/`](comparison/)
* **Interactive Defect Viewer:** [`VIEW_DEFECT_IMAGES.html`](VIEW_DEFECT_IMAGES.html)
* **Full Test Cases Matrix (14 TCs):** [`My_Quotes_Test_Cases.xlsx`](My_Quotes_Test_Cases.xlsx) and [`My_Quotes_Test_Cases.csv`](My_Quotes_Test_Cases.csv)
* **Live Retest Automated Results:** [`retest_results/LATEST_RETEST_SUMMARY.md`](retest_results/LATEST_RETEST_SUMMARY.md)
