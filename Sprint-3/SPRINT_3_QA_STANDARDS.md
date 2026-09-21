# Sprint-3 QA Testing Guidelines & Standards

## 1. Directory Structure Rule
Every ticket assigned in Sprint-3 must be organized inside this folder with dedicated sub-folders:
```
Sprint-3/
├── Ticket_<ID_or_Name>/
│   ├── screenshots/
│   │   ├── desktop/
│   │   ├── mobile/
│   │   └── defects/          <-- Valid defects highlighted with RED border/badge
│   ├── comparison/           <-- Side-by-side vs Figma design or AU baseline
│   ├── <Ticket>_Test_Cases.xlsx  <-- Excel test case sheet
│   ├── <Ticket>_Test_Cases.csv   <-- CSV format test cases
│   ├── SPRINT_DEMO_NOTES.md  <-- Curated notes & presentation script for Sprint Demo
│   └── QA_AUDIT_REPORT.md    <-- Detailed executive summary
```
* **No loose images** in the workspace root or project root. All screenshots must reside strictly within their ticket folder.

---

## 2. Screenshot Authenticity & Defect Highlighting Standard
* **100% Real Live Storefront Captures**: NO AI-generated images or artificial placeholders. All captures must be taken live from `https://mcstaging2.globewest.com`.
* **Red Color for Defects**: Any confirmed discrepancy or defect MUST be highlighted with bright solid **RED** (`#FF0000` / `#DC2626`) outline and badge.
* **Green Color for Approved**: Passed items must be outlined in clean **GREEN** (`#00D632` / `#10B981`).
* **Validity Enforcement**: Defects must be verified and reproducible against either the **Figma Design Spec** or **AU Baseline Parity**.

---

## 3. Comparison Source Enforcement (Figma Design vs AU Baseline)
* **When Figma Design is specified**:
  - The test/script **MUST open and display the Figma design** (headed Chrome window to exact Figma node or loaded high-res design frame) and assert layout, spacing, typography, and badges directly against Figma.
* **When AU Website is specified**:
  - Compare directly against live AU Staging (`https://mcstaging2.globewest.com.au`).
* **If unspecified or ambiguous**:
  - Prompt the user to clarify before executing.

---

## 4. Test Case Deliverables & Sprint Demo Readiness
* **Excel (.xlsx) & CSV format**: Every ticket must generate both `.xlsx` and `.csv` files using `scripts/export_test_cases.js`.
* **Sprint Demo Notes**: Every ticket must include a concise, step-by-step demo guide formatted for stakeholders (Feature overview, demo steps, expected vs live behavior, defect callouts).
