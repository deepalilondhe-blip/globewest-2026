# 🏆 Sprint 3 Master Deliverables & Verification Catalog

> **Permanent Archive & Single Source of Truth**  
> **Workspace**: `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/`  
> **Master Backup**: `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/MASTER_BACKUP_SPRINT_3/`  
> **Repository**: Local Git Version Control initialized & committed on `master` branch.  
> **QA Engineer**: Deepali Londhe (`deepali.londhe@overdose.digital`)  
> **Compliance**: Strict adherence to `AGENTS.md` (Dual-Auth Matrix, Zero Placeholders, Rule 6 Run Command standard, Pixel-Perfect Figma fidelity).

---

## 📑 Master Sprint 3 Table of Contents

| # | Feature / Ticket Name | Live URL | Figma Reference | Total Test Cases | Status | P0 / Critical Defect Status |
|---|-----------------------|----------|-----------------|------------------|--------|-----------------------------|
| 1 | **Trade Application Form** | `/customer/account/create/` (Trade tab) | Trade Customer Form (Desktop & Mobile) | **25 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 P0 Blocker: US 10-digit phone number rejected with AU error |
| 2 | **My Account – Holds** | `/customer/account/` -> My Holds (`/gw_orders/hold/index/`) | Frame 621 (`desktop/my_account/02_holds`) | **42 TCs** (30 Front + 12 Admin) | AUDITED & TESTED | 🔴 P0 Blocker: Holds (5) counter missing + AU DD/MM/YYYY date leak |
| 3 | **My Account – Quotes & Details** | `/customer/account/` -> My Quotes (`/gw_quotes/quote/index/`) | Frame 622 (Listing) & 623 (Details) | **38 TCs** (30 Front + 8 Admin) | AUDITED & TESTED | 🔴 P0 Blocker: AU "Inc GST" leak, Help card copy, missing CTA |
| 4 | **My Account – Loyalty** | `/customer/account/` -> Loyalty (`/loyalty/`) | Frame 626 (`01_loyalty`) | **30 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 P0 Blocker: Review Date missing, Tier 2 bar missing, Latin text |
| 5 | **My Account – Orders** | `/customer/account/` -> My Orders (`/sales/order/history/`) | Frame 624 (`03_orders`) | **25 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: Pricing format, actions dropdown, AU dates |
| 6 | **My Account – Dashboard** | `/customer/account/` | Frame 620 (`01_dashboard`) | **31 TCs** (30 Front + 1 Admin) | AUDITED & TESTED | 🔴 Defect: Utility bar visible, nav labels, status truncation |
| 7 | **My Account – Dropdown** | Header `👤 My Account` / Mobile Overlay | Frame 620 Dropdown Artboards | **30 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: Wishlist missing in dropdown, drawer links missing |
| 8 | **FAQ Management Guide** | Magento Admin Page Builder | Frames 620/621/622/624/626 | [Admin Guide](HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md) | COMPLETE & SCRIPTED | 🟢 Up to 8 FAQs, Closed by Default, Single-Open Rule |
| 8 | **Login, Create Account & Password** | `/customer/account/login/` | Auth Pages (Desktop & Mobile) | Verified & Scripted | RETESTED & VERIFIED | 🟢 Pass / Retest Verified |
| 8 | **Homepage** | `/` | Desktop & Mobile Homepage | **21 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: Hero banner CTA padding, Trade mode toggle |
| 9 | **Mega Menu** | Primary Nav Header | Desktop Mega Menu & Mobile Drawer | **28 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: Subcategory flyout alignment, brand links |
| 10 | **Static Pages** | Terms, Privacy, FAQ, Contact Us, 404 | Content Pages Spec | **21 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: Australian contact numbers & AU business addresses |
| 11 | **About Us** | `/about-us` | About Us Spec | **21 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: AU branding badges & high-res image scaling |
| 12 | **Blog Index Page** | `/blog` | Blog Index Spec | **37 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: Pagination styling & category filtering |
| 13 | **Blog Article Template** | `/blog/sample-article` | Blog Detail Spec | **35 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 Defect: Social share links, related articles layout |
| 14 | **Store Locator** | `/locator` | AU Baseline & US Figma | **35 TCs** (.xlsx & .csv) | AUDITED & RETESTED | 🟢 Google Maps API Fixed (Map canvas, satellite view, zoom, pins, keyboard accessibility & city/ZIP auto-navigation); 🟡 Remaining: Regional Copy Leaks, Footer Badge & WCAG Form Labels |
| 15 | **Claims Portal** | `/customer/account/` (`/gw_sales/claim/`) | Frames 630 & 631, `desktop/my_account/My Claims`, `mobile/my_account/My Claims`, `Create Claim` | **55 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🔴 P0 Blocker: Live US Staging Banner has dead link (`href="#"`), backend module redirects to dashboard |
| 16 | **Enable Public Browsing Mode** | Storefront Public Views | Public Browsing Architecture | **21 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🟢 Pass / Verified Public Price Masking & Guest Access |
| 17 | **Trade Pricing Toggle** | Header Utility & PLP/PDP/Search | Header Pricing Switcher Spec | **21 TCs** (.xlsx & .csv) | AUDITED & TESTED | 🟢 Pass / Verified Trade vs MSRP Modes & Dual Pricing |

---

## 📂 Master Directory Structure & Permanent Storage Locations

Every ticket contains its dedicated artifacts, test cases, screenshots, scripts, and Rule 6 run command files:

```
Sprint-3/
├── MASTER_BACKUP_SPRINT_3/                      <-- Complete offline mirror & permanent snapshot
│   ├── 01_Trade_Application_Form/
│   ├── 02_My_Account_Holds/
│   ├── 03_My_Account_Quotes/
│   ├── 04_My_Account_Loyalty/
│   ├── 05_My_Account_Orders/
│   ├── 06_My_Account_Dashboard/
│   ├── 07_Login_CreateAccount_Password/
│   ├── 08_Homepage/
│   ├── 09_Mega_Menu/
│   ├── 10_Static_Pages/
│   ├── 11_About_Us/
│   ├── 12_Blog_Index_Page/
│   ├── 13_Blog_Article_Template/
│   └── sprint_demo/
│
├── sprint_demo/                                  <-- Sprint 3 Demo Presentation Pack
│   ├── README.md                                 <-- Master Demo Navigator
│   ├── 01_Trade_Application_Form_Demo_Notes.md
│   ├── 02_My_Account_Holds_Demo_Notes.md
│   ├── 03_My_Account_Quotes_Demo_Notes.md
│   ├── 04_My_Account_Loyalty_Demo_Notes.md
│   ├── 05_My_Account_Orders_Demo_Notes.md
│   └── SPRINT_3_DEMO_EXECUTIVE_SUMMARY.md
│
├── Ticket_Trade_Application_Form/               <-- Ticket 1 Working Directory
│   ├── Trade Application Form runcommand.txt     <-- Rule 6 Terminal Commands
│   ├── Trade_Application_Form_Test_Cases.xlsx    <-- Excel Test Suite (25 TCs)
│   ├── Trade_Application_Form_Test_Cases.csv     <-- CSV Test Suite
│   ├── SPRINT_DEMO_NOTES.md
│   ├── QA_AUDIT_REPORT.md
│   └── comparison/ & screenshots/
│
├── Ticket_41794528_My_Account_Holds/             <-- Ticket 2 Working Directory
│   ├── My Holds runcommand.txt                   <-- Rule 6 Terminal Commands
│   ├── My_Holds_Test_Cases.xlsx                  <-- Excel Test Suite (30 TCs)
│   ├── My_Holds_Test_Cases.csv                   <-- CSV Test Suite
│   ├── SPRINT_DEMO_NOTES.md
│   ├── QA_AUDIT_REPORT.md
│   └── backup/ & comparison/ & screenshots/
│
├── Ticket_41794529_My_Account_Quotes/            <-- Ticket 3 Working Directory
│   ├── My Quotes runcommand.txt                  <-- Rule 6 Terminal Commands
│   ├── My_Quotes_Test_Cases.xlsx                 <-- Excel Test Suite (30 TCs)
│   ├── My_Quotes_Test_Cases.csv                  <-- CSV Test Suite
│   ├── SPRINT_DEMO_NOTES.md
│   ├── QA_AUDIT_REPORT.md
│   └── backup/ & comparison/ & screenshots/
│
├── Ticket_My_Account_Loyalty/                   <-- Ticket 4 Working Directory
│   ├── Loyalty runcommand.txt                    <-- Rule 6 Terminal Commands
│   ├── My_Account_Loyalty_Test_Cases.xlsx        <-- Excel Test Suite (30 TCs)
│   ├── My_Account_Loyalty_Test_Cases.csv         <-- CSV Test Suite
│   ├── SPRINT_DEMO_NOTES.md
│   ├── backup/
│   ├── screenshots/
│   └── scripts/
│
└── loyalty_figma/                               <-- High-Resolution Figma Frame 626 Exports
```

---

## ⚡ Rule 6 Run Commands Quick Reference

### 1. Trade Application Form
- **Desktop**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_Trade_Application_Form/scripts/audit_trade_application_form.js"
  ```
- **Mobile**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node -e "const {chromium,devices}=require('playwright');(async()=>{const b=await chromium.launch({headless:false,channel:'chrome'});const c=await b.newContext({...devices['iPhone 14 Pro'],viewport:{width:393,height:852}});const p=await c.newPage();await p.goto('https://mcstaging2.globewest.com/customer/account/create/',{waitUntil:'networkidle'});await p.waitForTimeout(4000);await p.screenshot({path:'Sprint-3/Ticket_Trade_Application_Form/screenshots/08_us_trade_mobile_live.png',fullPage:true});await b.close();})();"
  ```

### 2. My Account – Holds
- **Desktop**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794528_My_Account_Holds/scripts/run_comprehensive_headed_holds_test.js"
  ```
- **Mobile**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node -e "const {chromium,devices}=require('playwright');(async()=>{const b=await chromium.launch({headless:false,channel:'chrome'});const c=await b.newContext({...devices['iPhone 14 Pro'],viewport:{width:393,height:852}});const p=await c.newPage();await p.goto('https://mcstaging2.globewest.com/customer/account/login/',{waitUntil:'networkidle'});await p.fill('#email','deepali.londhe@overdose.digital');await p.fill('#pass','Deep@123');await p.click('#send2');await p.waitForNavigation({waitUntil:'networkidle'});await p.goto('https://mcstaging2.globewest.com/customer/account/',{waitUntil:'networkidle'});await p.waitForTimeout(4000);await p.screenshot({path:'Sprint-3/Ticket_41794528_My_Account_Holds/screenshots/mobile/01_my_holds_mobile_live_full.png',fullPage:true});await b.close();})();"
  ```

### 3. My Account – Quotes & Details
- **Desktop**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794529_My_Account_Quotes/scripts/retest_quotes_page_headed.js"
  ```
- **Mobile**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node -e "const {chromium,devices}=require('playwright');(async()=>{const b=await chromium.launch({headless:false,channel:'chrome'});const c=await b.newContext({...devices['iPhone 14 Pro'],viewport:{width:393,height:852}});const p=await c.newPage();await p.goto('https://mcstaging2.globewest.com/customer/account/login/',{waitUntil:'networkidle'});await p.fill('#email','deepali.londhe@overdose.digital');await p.fill('#pass','Deep@123');await p.click('#send2');await p.waitForNavigation({waitUntil:'networkidle'});await p.goto('https://mcstaging2.globewest.com/quotes/',{waitUntil:'networkidle'});await p.waitForTimeout(4000);await p.screenshot({path:'Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/mobile/01_my_quotes_mobile_live_full.png',fullPage:true});await b.close();})();"
  ```

### 4. My Account – Loyalty
- **Desktop**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Loyalty/scripts/capture_live_desktop.js"
  ```
- **Mobile**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Loyalty/scripts/capture_live_mobile.js"
  ```

### 5. My Account – Dashboard
- **Desktop**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794527_My_Account_Dashboard/scripts/run_headed_dashboard_desktop_audit.js"
  ```
- **Mobile**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794527_My_Account_Dashboard/scripts/run_headed_dashboard_mobile_audit.js"
  ```

### 6. My Account – Dropdown
- **Desktop**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Dropdown/scripts/inspect_account_dropdown.js"
  ```
- **Mobile**:
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Dropdown/scripts/capture_mobile_dropdown.js"
  ```


---

## 🔒 Verification & Permanence Guarantees
1. **Redundancy**: Files are saved in original ticket directories, mirrored in `MASTER_BACKUP_SPRINT_3/`, archived in ticket-level `backup/` directories, and symlinked across both workspace roots.
2. **Git Version Control**: All files staged and committed to permanent git history.
3. **Format Support**: Test suites are available in both industry-standard Excel (`.xlsx`) and machine-readable (`.csv`) formats.
4. **Offline Access**: Complete standalone HTML comparison viewers with embedded base64/high-res visual evidence are included for presentation without internet access.
