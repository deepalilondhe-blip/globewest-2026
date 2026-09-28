# Comprehensive QA Audit Report

## Ticket #41794528: My Account - Holds

| Metadata Field | Specification Details |
| :--- | :--- |
| Project | P-GLW-007 Globewest US Expansion Project |
| Ticket Name | My Account - Holds |
| Teamwork Task | [#41794528](https://overdose.eu.teamwork.com/app/tasks/41794528) |
| Target Live Staging URL | `https://mcstaging2.globewest.com/gw_orders/hold/index/` |
| Figma Design Spec | [Globewest USA - External (Node 2581-64185 / Frame 621)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64185&t=UHKXdUurQ7e08vqM-0) |
| Assigned Developer | Vinod |
| QA Lead | Deepali Londhe |

---

### Executive Summary

The QA audit was conducted on live staging (mcstaging2) for Ticket #41794528: My Account - Holds (/gw_orders/hold/index/), cross-referencing against approved Figma artboards (03_my_Holds) and Frame 621 specifications.

#### Key Findings:

1. Status Filter Tabs (Frame 621 Rule 1): PASSED
   - Displays ACTIVE (selected by default with dark brown pill) and INACTIVE. Tab switching functions properly.

2. Search Bar: PASSED
   - Horizontally aligned on the same row beside the filter tabs.

3. FAQ Accordion Block: PASSED
   - Present below the table, all items closed by default, single-open rule enforced.

4. Customer Support Block: PASSED (Matches Figma)
   - Layout and contact details match Figma Frame 621 mockup. Configurable via Magento CMS static block.

5. Sub-heading Copy: PASSED (Matches Figma)
   - Introductory copy matches Figma layout structure.

6. Mobile View: PASSED
   - Mobile view is responsive and functioning properly.

7. Table Column Architecture & Redundant Actions Column (Frame 621 Rules 2 & 4): FAIL (Defect)
   - Figma specifies 7 columns (HOLD, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL) without a separate Actions column.
   - Live Staging displays 8 columns, retaining a standalone ACTIONS column.

---

### Acceptance Criteria Traceability Matrix

| Component | Frame 621 Requirement | Live Staging Behavior | Status |
| :--- | :--- | :--- | :---: |
| Filter Tabs | Tabs filtering active and inactive holds | ACTIVE default pill, toggles cleanly | PASS |
| Search Bar | Inline beside tabs | Correctly aligned horizontally | PASS |
| FAQ Block | Closed by default, single-open rule | Verified functional | PASS |
| Support Block | Support contact block below FAQs | Matches Figma Frame 621 | PASS |
| Mobile View | Mobile layout functionality | Responsive and functioning properly | PASS |
| Table Columns | 7 columns; hide actions if only view | Displays 8 columns with redundant ACTIONS | FAIL |

---

### Visual Evidence

Attached comparison screenshot: COMPARISON_PASS_01_TABLE_COLUMNS_AND_ACTIONS.png

![Joined Comparison](/home/deepali/.gemini/antigravity-ide/brain/6367bf6c-8242-49b8-b748-20cd58330e7e/COMPARISON_PASS_01_TABLE_COLUMNS_AND_ACTIONS.png)
