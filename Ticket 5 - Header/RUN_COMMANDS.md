# 🚀 Run Commands: Ticket 5 (Header & Mega Menu Audit)

This document details all execution commands for running the automated Playwright test suite in **Headed Mode** (with live element highlighting), generating side-by-side **Red/Green Comparison Images**, and exporting **Excel Test Cases**.

---

## 1. One-Click Headed Runner (Recommended)

Run the full automated suite in interactive headed Chrome with animated neon glowing outlines and floating badge tags:

```bash
cd "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
./"Ticket 5 - Header/run_header_headed.sh"
```

Or via npm from the root:
```bash
npm run test:ticket5:headed
```

---

## 2. Playwright Headed Mode Commands

### Run All 7 Header Tests Headed
```bash
cd "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026"
npx playwright test tests/ticket5-us-header-comparison.spec.js --project=desktop-chrome --headed
```

### Run Specific Test Cases Headed
- **Top Utility Bar Audit**:
  ```bash
  npx playwright test tests/ticket5-us-header-comparison.spec.js -g "TC-HEADER-01" --project=desktop-chrome --headed
  ```
- **Mega Menu Subcategories & Drilldown**:
  ```bash
  npx playwright test tests/ticket5-us-header-comparison.spec.js -g "TC-HEADER-04" --project=desktop-chrome --headed
  ```
- **Australian Domain Leakage Scan (All 229 Links)**:
  ```bash
  npx playwright test tests/ticket5-us-header-comparison.spec.js -g "TC-HEADER-05" --project=desktop-chrome --headed
  ```
- **Mobile Header Hamburger Drawer (Pixel 5)**:
  ```bash
  npx playwright test tests/ticket5-us-header-comparison.spec.js -g "TC-HEADER-07" --project=desktop-chrome --headed
  ```

---

## 3. Generate Red / Green Side-by-Side Comparison Images

Re-build the Red (US Defect) vs Green (AU Baseline) side-by-side images in the `comparison/` folder:

```bash
cd "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
python3 "Ticket 5 - Header/scripts/generate_header_comparison.py"
```

Output directory:
`Ticket 5 - Header/comparison/`

---

## 4. Export Test Cases Spreadsheet (Excel XLSX, CSV, MD)

Re-generate the formatted test cases spreadsheet and documentation:

```bash
cd "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)"
node "Ticket 5 - Header/scripts/generate_ticket5_xlsx.js"
```

Output files:
- `Ticket 5 - Header/Ticket5_Header_TestCases.xlsx`
- `Ticket 5 - Header/Ticket5_Header_TestCases.csv`
- `Ticket 5 - Header/Ticket5_Header_TestCases.md`
