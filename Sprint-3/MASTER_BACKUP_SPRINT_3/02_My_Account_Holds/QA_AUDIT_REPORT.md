# Comprehensive QA Audit & Figma Comparison Report

## Ticket #41794528: My Account - Holds

| Metadata Field | Specification Details |
| :--- | :--- |
| **Project** | P-GLW-007 GlobeWest US Expansion Project |
| **Ticket Name** | My Account - Holds |
| **Teamwork Task** | [#41794528](https://overdose.eu.teamwork.com/app/tasks/41794528) |
| **Target Live Staging URL** | `https://mcstaging2.globewest.com/gw_orders/hold/index/` |
| **Figma Design Spec** | [Globewest USA - External (Node 2581-64185 / Frame 621)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64185&t=UHKXdUurQ7e08vqM-0) |
| **Test Environment** | US Staging (`mcstaging2.globewest.com`) under Trade Customer Authentication |
| **Assigned Developer** | Vinod |
| **QA Lead** | Deepali Londhe |

---

### 1. Executive Summary

A comprehensive, headed retest and side-by-side Figma comparison was conducted on live US Staging (`/gw_orders/hold/index/`) for **Ticket #41794528: My Account - Holds**, cross-referencing against approved Figma artboard (`desktop/my_account/03_my_Holds` and `mobile/my_account/03_my_Holds`) and Frame 621 logic notes.

#### Key Testing Outcomes:
1. **Hold Count Badge (Developer's Update): VERIFIED FIXED & PASSED ✅**
   - Developer Vinod added the blue counter badge (`.item__counter`) next to `Holds [5]` in the left sidebar account navigation.
   - Count math verified: 3 Active Holds + 2 Inactive Holds = 5 Total Holds. Badge styling matches Figma pill design.
2. **Table Architecture & Multi-Action Dropdown: CONFORMS TO SPEC ✅**
   - Frame 621 rule states: *"if the only action available is 'view', hide column; otherwise actions housed under dropdown for both mobile + desktop as per order table functionality"*.
   - Live rows have multiple actions (`VIEW` + `MODIFY/ CONFIRM` for Active holds; `VIEW` + `Reactivate` for Inactive holds). Housing these under the `Actions` dropdown conforms to the specification.
3. **Status Filter Tabs (`ACTIVE` / `INACTIVE`): PASSED ✅**
   - Active pill tab defaults to brown (`rgb(56, 28, 18)`). Switching tabs filters cleanly. Expired warning banner renders correctly on Inactive tab.
4. **FAQ Accordion & Customer Support Block: PASSED ✅**
   - Closed by default, single-open accordion auto-collapse logic verified functional.
5. **Cross-Verification on `CUST P0#` Table Header (Clarified Finding ⚠️):**
   - **Deep Verification Result:** On careful inspection of the Figma artboard, the **Figma mockup itself contains `CUST P0#`** (with numeric zero `'0'`). Developer Vinod followed the Figma design literally.
   - **Recommendation:** In standard business accounting, "PO" stands for Customer Purchase Order. The data rows below the header show `#PO2647585` (with letter `'O'`). Therefore, while code matches the mockup, this is a Figma design typo that should be corrected to **`CUST PO#`**.
6. **Active Defects Identified 🔴:**
   - **Date Format (US MM/DD/YYYY vs AU DD/MM/YY)**: Dates are displayed in Australian format (`14/10/26`), violating Frame 621 directive *"ensure dates displayed are in USA format"*.
   - **Mobile Viewport (390px)**: Column order mismatch (`STATUS` before `TOTAL`), and Column 5 `Actions` button overflows and gets clipped at the right margin.
   - **Editorial Copy Localization**: Subtitle uses Australian spelling `"favourite"` instead of US English `"favorite"`.
   - **Customer Support Phone Prefix**: Displays Australian country code prefix `+613 9518 1600` on the US storefront.

---

### 2. Figma vs Live Staging Traceability Matrix

| # | Component / Requirement | Figma Specification (Frame 621) | Live US Staging Actual | Status | Visual Evidence |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **01** | **Sidebar Hold Count Badge** | Blue counter pill badge next to active navigation items (`Holds [3]`) | Renders `Holds [5]`, `Quotes [10]`, `Orders [8]`. Total 5 matches 3 active + 2 inactive holds | **PASSED ✅** | `01_COMP_SIDEBAR_HOLD_COUNT_BADGE.png` |
| **02** | **Date Format Localization** | Frame 621 explicit directive: *"ensure dates displayed are in USA format"* (MM/DD/YYYY) | Leaked Australian format DD/MM/YY (`14/10/26`, `07/10/26`, `02/10/26`) | **FAIL 🔴** | `02_COMP_DATE_FORMAT_AU_VS_USA.png` |
| **03** | **Header Typo: CUST PO#** | Figma mock literally has `CUST P0#` (designer typo using number 0) | Rendered as `CUST P0#` (matches Figma mock, but both contain typo) | **DESIGN TYPO ⚠️** | `03_COMP_TABLE_HEADER_TYPO_CUST_PO.png` |
| **04** | **Mobile Table Layout & Clipping** | Column sequence `HOLD \| DATE \| TOTAL \| STATUS \| ACTIONS` within 375px | Sequence `HOLD \| DATE \| STATUS \| TOTAL \| ACTIONS`; Actions button clipped at 390px | **FAIL 🔴** | `04_COMP_MOBILE_TABLE_CLIPPING_AND_ORDER.png` |
| **05** | **Actions Column Architecture** | Hide column if only 'view'; otherwise housed under dropdown for multi-action | Multiple actions available (`VIEW` + `MODIFY/CONFIRM`), housed under `Actions` dropdown | **PASS ✅** | `05_COMP_TABLE_ACTIONS_DROPDOWN_ARCHITECTURE.png` |
| **06** | **Subtitle Copy Spelling** | Standard US American English spelling | Subtitle reads: *"A product hold reserves your **favourite** items..."* (AU/UK spelling) | **FAIL 🔴** | `06_COMP_SUBTITLE_SPELLING_FAVOURITE.png` |
| **07** | **Support Phone Localization** | Localized US contact number | Displays Australian contact phone: `P: +613 9518 1600` | **FAIL 🔴** | `07_COMP_SUPPORT_BLOCK_PHONE.png` |
| **08** | **Status Filter Tabs** | `ACTIVE` (default dark brown pill) and `INACTIVE` (outline pill) | Rendered and functional. Switching filters 3 Active / 2 Inactive | **PASSED ✅** | `05_inactive_tab_view.png` |
| **09** | **Search Bar** | Inline beside tabs with magnifying glass icon | Inline with tabs, placeholder and search icon present | **PASSED ✅** | `06_search_bar_desktop.png` |
| **10** | **FAQ Accordions** | All closed by default, single open accordion at a time | Verified in headed test: closed by default, auto-collapses on second click | **PASSED ✅** | `08_faq_item_1_open.png` |

---

### 3. Detailed Defect Descriptions & Required Fixes

#### Defect 1: Date Format Leaking Australian DD/MM/YY Standard
- **Location:** Desktop & Mobile Table `EXP. DATE` and `DATE` columns.
- **Expected:** Frame 621 explicitly states: *"ensure dates displayed are in USA format"*. Dates should render as `10/14/26` or `10/14/2026` (MM/DD/YYYY).
- **Actual:** Displays `14/10/26`, `07/10/26`, `02/10/26`. Day 14 cannot represent a month in US standard.
- **Fix:** Update date formatting helper in Magento block/template to format dates using US locale `en_US` (`m/d/Y`).

#### Observation / Clarification: Table Header `CUST P0#` vs `CUST PO#`
- **Location:** Table Column 3 Header.
- **Deep Verification:** The Figma design mockup itself contains the typo `CUST P0#` (with numeric zero `'0'`), which developer Vinod implemented verbatim.
- **Context:** In commercial retail and accounting, "PO" stands for Customer Purchase Order. The data rows underneath the header display `#PO2647585` (with uppercase letter `'O'`).
- **Fix:** Update column header label string in layout/template/translation to standard `CUST PO#`.

#### Defect 2: Mobile Viewport (390px) Table Column Clipping & Swapped Order
- **Location:** Mobile Table (`/gw_orders/hold/index/` on width <= 390px).
- **Expected:** Column sequence `HOLD | DATE | TOTAL | STATUS | ACTIONS`. All columns and buttons fit within 375px width.
- **Actual:** Column sequence has `STATUS` and `TOTAL` reversed (`HOLD | DATE | STATUS | TOTAL | ACTIONS`). The 5th column `Actions` button overflows and gets clipped at the right margin (only `Ac` is visible).
- **Fix:** Align column order to Figma and adjust cell padding / column widths on mobile table styling.

#### Defect 3: Editorial Copy Australian Spelling (`favourite`)
- **Location:** Page Subtitle under `My Holds`.
- **Expected:** US English spelling: *"A product hold reserves your **favorite** items for 2 business days."*
- **Actual:** Subtitle reads *"favourite"*.
- **Fix:** Update translation in `en_US.csv` or CMS block.

---

### 4. Comparison Artifacts Location

All side-by-side comparison images are stored in:
`Sprint-3/Ticket_41794528_My_Account_Holds/comparison/`

Visual HTML Viewer:
[VIEW_FIGMA_COMPARISONS.html](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794528_My_Account_Holds/VIEW_FIGMA_COMPARISONS.html)
