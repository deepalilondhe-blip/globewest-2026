# Teamwork Status Update & Pre-Dev Audit Report

**Task:** [#41794529 - My Account - Quotes](https://overdose.eu.teamwork.com/app/tasks/41794529)  
**Project:** P-GLW-007 Globewest US Expansion Project  
**Target URL:** `https://mcstaging2.globewest.com/gw_quotes/quote/index/`  
**Figma Spec:** [Node 2581-64235 / Frame 622](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0)  
**QA Lead:** Deepali Londhe (`@DeepaliL`)

---

Hi Team,

I have completed a comprehensive **Pre-Development / Work-in-Progress Verification Audit** for the **My Account - Quotes** module (`/gw_quotes/quote/index/`), cross-referencing the live staging build on `mcstaging2` against the approved **Figma Desktop & Mobile Artboards** and the **Frame 622 Specification Annotations**.

Below is the summary of items to be addressed during the current frontend development sprint:

---

### 1. Acceptance Criteria & Gap Analysis (Figma Frame 622 Traceability)

| Component | Frame 622 Specification | Current Live Staging Actual (`mcstaging2`) | Severity |
| :--- | :--- | :--- | :---: |
| **Filter Tabs** | *"Tabs that filter table view of quotes shown based on quote status. Default to 'all'"* | Currently defaults to **`OPEN`** tab with plain text underline. | **HIGH** |
| **Filter Tabs Styling** | Segmented pill container (`[ ALL ] [ OPEN ] [ CONVERTED ] [ EXPIRED ]`) with solid dark fill (`#1E1E1E`) on active tab | Unstyled plain text links with basic text-decoration underline. | **MEDIUM** |
| **Table Columns** | 8 Columns (`QUOTE N`, `EXP. DATE`, `CUST PO#`, `ORDER NAME`, `CLIENT NAME`, `STATUS`, `TOTAL`, `ACTIONS`) | 9 Columns rendered. Contains an extra redundant **`DETAILS`** column and full word `EXPIRY DATE`. | **HIGH** |
| **Actions CTAs** | *"Actions housed under dropdown for both mobile + desktop as per other table functionality"* | Actions split across `DETAILS` and `ACTIONS` columns instead of single `Actions` dropdown. | **HIGH** |
| **Search Bar Placement** | Pinned inline on the **same horizontal row** alongside the filter tabs | Pushed to a disconnected upper position above table right. | **MEDIUM** |
| **FAQ Accordion Block** | *"New block utilised throughout the My Account Experience... Up to 8 FAQs. All accordions closed by default. Only one open at a time."* | **100% MISSING** from live staging. Blank whitespace below table. | **CRITICAL** |
| **Need Help Block** | *"Need Help Block: Content Block / Admin ability to change content"* | **100% MISSING** from live staging. | **CRITICAL** |
| **Sidebar Count Badges** | Numerical count pill badges (e.g. `Quotes [723]`, `Holds [3]`, `Orders [3]`) | Left account navigation renders no count badges. | **MEDIUM** |
| **Mobile Empty State** | Brand-styled empty state and mobile table parity | Displays raw Magento default blue alert box (`Table is empty!`). | **HIGH** |
| **Footer Scope Leak** | US Storefront clean footer isolation | Displays Australian Kangaroo logo and `"AUSTRALIAN OWNED & RUN"` copy. | **HIGH** |

---

### 2. Deliverables & Evidence Generated

- **Interactive Visual Defect Gallery**: `VIEW_DEFECT_IMAGES.html` (Complete side-by-side comparison cards with modal image zoom).
- **Test Case Matrices**:
  - `My_Quotes_Test_Cases.xlsx` (Formal 14-point QA execution matrix with custom column widths).
  - `My_Quotes_Test_Cases.csv` (Clean machine-readable CSV with formatted step spacing).
- **Side-by-Side Comparison Passes**:
  - `Pass 01`: Default Active Tab (`ALL` vs `OPEN`).
  - `Pass 02`: Table Columns & Consolidated Actions Dropdown.
  - `Pass 03`: Search Bar Row Alignment.
  - `Pass 04`: Missing FAQ Accordion Block.
  - `Pass 05`: Missing Need Help Block.
  - `Pass 06`: Sidebar Count Badges.
  - `Pass 07`: Mobile Responsive Parity.
  - `Pass 08`: Australian Kangaroo Footer Badge Scope Leak.

All comparison captures follow the QA visual standard with solid RED (`#FF0000`) boxes outlining defects and GREEN (`#2E7D32`) borders framing approved Figma specifications.

Once the frontend team deploys these changes to `mcstaging2`, QA will immediately execute regression testing.

Thank you,  
**Deepali Londhe**  
*QA Lead*
