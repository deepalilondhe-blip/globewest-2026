# Teamwork Status Update & Headed QA Retest Audit Report

**Task:** [#41794530 - My Account - Orders](https://overdose.eu.teamwork.com/app/tasks/41794530)  
**Project:** P-GLW-007 Globewest US Expansion Project  
**Target URL:** `https://mcstaging2.globewest.com/gw_orders/order/index/`  
**Figma Spec:** [Node 2581-64348 / Frame 624](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64348&t=UHKXdUurQ7e08vqM-0)  
**QA Lead:** Deepali Londhe (`@DeepaliL`)

---

Hi Team,

I have completed a thorough **Headed Mode QA Verification Audit** for the **My Account - Orders** page (`/gw_orders/order/index/`), cross-referencing the latest live deployment on `mcstaging2` against the approved **Figma Desktop & Mobile Artboards** and **Frame 624 Specification Annotations**.

Below is the verified status and breakdown of findings:

---

### 1. Verification Summary & Progress

* **Search Bar Row Alignment**: **PASSED ✅** — The search input is now positioned inline on the same horizontal row beside the filter tabs.
* **FAQ Accordion Block Deployment**: **DEPLOYED & VISIBLE ⚠️** — The FAQ block (`Frequently Asked Questions`) with 2 accordion items is now present and closed by default. However, an interaction defect exists where opening a second FAQ does not collapse the first.
* **Table Details Column**: **REMOVED ✅** — The redundant unstyled `DETAILS` column has been removed, reducing columns from 10 to 9.

---

### 2. Live Retest Defects against Figma Frame 624 Specifications

| # | Component | Frame 624 Specification | Live Staging Actual (`mcstaging2`) | Severity |
| :---: | :--- | :--- | :--- | :---: |
| **01** | **Status Filter Tabs** | *"Tabs that filter table view of orders shown based on status. Default to 'awaiting payment'"*<br>Figma Artboard specifies 4 tabs: `AWAITING PAYMENT` (default dark solid pill), `PENDING SHIPMENT`, `DISPATCHED`, `CLOSED`. | Renders only 3 tabs: `ALL`, `OPEN` (active by default), `CLOSED`. Missing `AWAITING PAYMENT`, `PENDING SHIPMENT`, and `DISPATCHED`. Fails default active tab requirement. | **HIGH** |
| **02** | **Table Column Reduction** | *"Reduction of columns shown"*<br>Figma Artboard strictly specifies 5-6 columns: `ORDER ⬍`, `DATE ⬍`, `STATUS ⬍`, `TOTAL ⬍`, `BALANCE ⬍`, `ACTIONS ▾`. | Displays 9 columns. Retains unrequested legacy columns: `CUST PO#`, `ORDER NAME`, and `CLIENT NAME`. | **HIGH** |
| **03** | **FAQ Accordion Single-Open Rule** | *"All accordions closed by default. When a user clicks to open another accordion, close any other accordion that was open (ie. only one open at a time)"* | Opening FAQ #2 leaves FAQ #1 open. Both accordions remain open simultaneously with chevrons up (`^`) and expanded content (`aria-expanded="true"`). | **HIGH** |
| **04** | **Support Block Layout & US Routing** | *"Need to change an order?"* support content block with clean layout and US contact routing. | **Visual Glitch**: Horizontal rule line visibly strikes through the sentence `To change a submitted order, please contact our Sales Administration team on:`.<br>**Scope Leak**: Displays Australian phone `+613 9518 1600` and email `sales@globewest.com.au`. | **HIGH** |
| **05** | **Sidebar Count Badges** | Left account navigation must render high-contrast numerical count badges (`Quotes [723]`, `Holds [3]`, `Orders [3]`). | Left sidebar displays plain text links with zero numerical count badges. | **MEDIUM** |
| **06** | **Empty State Container** | Clean brand-styled container when table is empty. | Displays raw default unstyled Magento blue alert container (`ⓘ Table is empty!`). | **MEDIUM** |

---

### 3. Deliverables & Verified Comparison Evidence

* **Interactive Defect Gallery**: `VIEW_DEFECT_IMAGES.html` (Complete side-by-side comparison gallery with modal zoom).
* **Test Case Matrix**:
  * `My_Orders_Test_Cases.xlsx` (Formal QA execution matrix).
  * `My_Orders_Test_Cases.csv` (CSV format).
* **Execution Commands**: `My Orders runcommand.txt`
* **Side-by-Side Comparison Passes (Strict Red/Green standards, zero added text on screenshots)**:
  * `Pass 01`: Status Filter Tabs (`AWAITING PAYMENT` vs `OPEN`)
  * `Pass 02`: Table Column Reduction (6 Columns vs 9 Columns)
  * `Pass 03`: Search Input Alignment (PASSED ✅)
  * `Pass 04`: FAQ Accordion Multi-Open Violation (Only one open at a time)
  * `Pass 05`: Support Block Line Overlap Glitch & Leaking AU Phone/Email
  * `Pass 06`: Sidebar Numerical Count Badges
  * `Pass 07`: Empty State Raw Alert Box (`Table is empty!`)

Please review the comparison cards in `VIEW_DEFECT_IMAGES.html`. Once the status tabs, column reduction, and FAQ single-open collapse logic are updated, QA will re-verify immediately.

Thank you,  
**Deepali Londhe**  
*QA Lead*
