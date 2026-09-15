# 🏷️ Ticket 5: Header & Mega Menu Storefront Audit

**Parent Epic**: GlobeWest US B2B Storefront Expansion  
**Ticket Name**: Header (Match AU)  
**Target Environment**: `https://mcstaging2.globewest.com` (US Storefront)  
**Baseline Environment**: `https://mcstaging2.globewest.com.au` (AU Live Staging)  
**Assigned QA**: Deepali Londhe (`@DeepaliL`)  
**Status**: Verification Complete & Defect Audit Documented  

---

## 📌 1. Background & Ticket Objective

As stated in the development team update:
> *"We've completed the work on the header for the US site, which reuses the existing AU header as-is. As part of this, we identified and fixed an issue where the mega menu was not working correctly — this has now been resolved and is functioning as expected. Could you please go ahead and check and verify the header on your end? Please go through the different menu items and interactions to confirm everything is behaving as intended, and let us know if you come across any issues."*

### Key Testing Priorities:
1. **Interactive Headed Execution**: Watch the browser navigate and highlight all clicked/hovered elements with animated neon outlines and floating badge tags.
2. **Mega Menu Drilldown**: Verify all 9 top-level categories (Indoor, Outdoor, Homewares, In Stock, Customisation, Projects, Inspiration, Support, Contact) and multi-level subcategories (Furniture -> Sofas -> Modulars).
3. **Australian Domain Leakage Audit**: Query and assert that none of the 220+ navigation links redirect American B2B specifiers to Australian domains (`.com.au` or `globewestoutlet.com.au`).
4. **Simple Red/Green Comparison Images**: Generate side-by-side comparison images with strict **RED (US Defect)** and **GREEN (AU Baseline)** borders and simple **1-line defect descriptions** in the `comparison/` folder.

---

## 📁 2. Folder Architecture & Organization

```
Ticket 5 - Header/ (also accessible via symlink 'Header/')
├── comparison/                                  <-- User requested comparison folder
│   ├── DEFECT_1_MEGA_MENU_OUTLET_AU_LEAK.png    <-- Red (US) vs Green (AU)
│   ├── DEFECT_2_TOP_BAR_FIND_DESIGNER_MISSING.png
│   ├── DEFECT_3_MEGA_MENU_PROMO_BANNER_MISMATCH.png
│   ├── DEFECT_4_MELBOURNE_OUTLET_LINK_LEAK.png
│   ├── DEFECT_5_HOMEWARES_URL_MISMATCH.png
│   └── ONE_COMBINED_HEADER_DEFECTS_COMPARISON.png <-- Master stacked poster
├── screenshots/
│   ├── sections/                                <-- US Storefront evidence captures
│   ├── au_comparison/                           <-- AU Baseline evidence captures
│   └── mobile/                                  <-- Mobile 393px drawer captures
├── scripts/
│   ├── generate_header_comparison.py            <-- Python Red/Green image builder
│   └── generate_ticket5_xlsx.js                 <-- Excel test cases generator
├── ticket5-us-header-comparison.spec.js         <-- Playwright test with live highlighting
├── run_header_headed.sh                         <-- One-click executable shell runner
├── TICKET5_DEFECT_AUDIT_REPORT.md               <-- Technical QA defect audit report
├── SIMPLE_DEFECT_COMPARISON_REPORT.md           <-- Clean 1-line defect summary with images
├── Ticket5_Header_TestCases.xlsx                <-- Formatted test cases spreadsheet
├── Ticket5_Header_TestCases.csv
├── Ticket5_Header_TestCases.md
└── RUN_COMMANDS.md                              <-- Quick reference run commands
```

---

## 🚨 3. Key Defects Summary

```
┌────┬─────────────────────────────┬──────────┬─────────────────────────────┬────────────────────────────────────────────────────────┬───────────────┐
│ #  │ Component                   │ Severity │ Defect Type                 │ Key Impact                                             │ Status        │
├────┼─────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────────────────────────────────┼───────────────┤
│ 01 │ Mega Menu Outlet Links      │ P1 - High│ Australian Domain Leakage   │ "Outlet" links redirect US visitors to Australian store│ 🚨 OPEN DEFECT│
│ 02 │ Melbourne Outlet Store Link │ P1 - High│ Physical AU Address Leakage │ Hardcoded link to Melbourne physical retail showroom   │ 🚨 OPEN DEFECT│
│ 03 │ Top Bar "Find a Designer"   │ P2 - Med │ Missing Service Utility     │ Trade referral link omitted or unlinked on US top bar  │ ⚠️ OPEN DEFECT│
│ 04 │ Mega Menu Promo Card        │ P2 - Med │ Unpopulated Marketing Block │ Blank "GW Coming Soon" card instead of live campaign   │ ℹ️ PENDING COPY│
│ 05 │ Homewares Category URL Key  │ P3 - Low │ Taxonomy Key Mismatch       │ US uses /homewares while AU baseline uses /homeware    │ ⚠️ DISCREPANCY│
└────┴─────────────────────────────┴──────────┴─────────────────────────────┴────────────────────────────────────────────────────────┴───────────────┘
```

---

## 🚀 4. How to Run

### Interactive Headed Mode (Watch Browser with Live Highlighting):
```bash
./"Ticket 5 - Header/run_header_headed.sh"
```
Or via npm:
```bash
npm run test:ticket5:headed
```

### Re-Generate Comparison Images:
```bash
python3 "Ticket 5 - Header/scripts/generate_header_comparison.py"
```

### Re-Generate Excel Test Cases:
```bash
node "Ticket 5 - Header/scripts/generate_ticket5_xlsx.js"
```
