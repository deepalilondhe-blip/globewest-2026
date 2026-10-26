# 📋 GlobeWest Sprint 3: Master Demo Notes Index (Page-Wise)

This directory contains curated, page-by-page Sprint Demo walkthrough guides, talking points, headed execution commands, defect matrices, and complete test suites for Sprint 3 features.

---

## 📑 Page-Wise Demo Notes Directory

### 1. [01. Trade Application Form Demo Notes](01_Trade_Application_Form_Demo_Notes.md)
- **Target URL**: `https://mcstaging2.globewest.com/gwcustomer/trade/create`
- **Figma Reference**: Node 3226-21024 (Desktop) / Node 3226-21130 (Mobile) / Node 3226-21364 (EIN)
- **Scope**: Multi-step trade customer onboarding wizard, US phone number validation blocker (P0), EIN field verification, and 50 US States selector.
- **Run Command (Desktop)**: `NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_Trade_Application_Form/scripts/run_desktop_live_comparison.js"`
- **Test Suite**: 25 Test Cases ([Trade_Application_Form_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_Trade_Application_Form/Trade_Application_Form_Test_Cases.xlsx))

---

### 2. [02. My Account - Holds Demo Notes](02_My_Account_Holds_Demo_Notes.md)
- **Target URL**: `https://mcstaging2.globewest.com/gw_orders/hold/index/`
- **Figma Reference**: Node 2581-64185 / Frame 621
- **Scope**: B2B 2-day inventory hold reservation portal, developer Vinod's blue counter badge update (`Holds [5]`), ACTIVE/INACTIVE filter tabs, multi-action dropdown architecture, and AU date format leak (`14/10/26`).
- **Run Command (Desktop)**: `NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794528_My_Account_Holds/scripts/capture_live_desktop.js"`
- **Test Suite**: 42 Test Cases (30 Frontend + 12 Admin) ([My_Holds_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794528_My_Account_Holds/My_Holds_Test_Cases.xlsx))

---

### 3. [03. My Account - Quotes & Quote Details Demo Notes](03_My_Account_Quotes_Demo_Notes.md)
- **Target URL**: `https://mcstaging2.globewest.com/gw_quotes/quote/index/` & `/gw_quotes/quote/view/quote_id/[ID]/`
- **Figma Reference**: Frame 622 (Listing) & Frame 623 (Quote Details)
- **Scope**: Quotation management, default `ALL` tab, 8 consolidated columns, inline quote status badge, delete quote confirmation modal, bulk/individual trade markup (`APPLY TO ALL`), MSRP display per item, USA single shipping option, and Convert to Order flow.
- **Run Command (Desktop)**: `NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794529_My_Account_Quotes/scripts/capture_live_desktop.js"`
- **Test Suite**: 38 Test Cases (30 Frontend + 8 Admin) ([My_Quotes_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794529_My_Account_Quotes/My_Quotes_Test_Cases.xlsx))

---

### 4. [04. My Account - Loyalty Program Demo Notes](04_My_Account_Loyalty_Demo_Notes.md)
- **Target URL**: `https://mcstaging2.globewest.com/loyalty/`
- **Figma Reference**: Frame 626 & artboard `desktop/my_account/01_loyalty`
- **Scope**: Trade tier loyalty portal, Enterprise tier status badge, 54% discount rate, $12,226 rolling 12M spend, progress bars (maintain spend & unlock next tier), 5-level pricing matrix table with 15% opacity active tint, single-open FAQ accordions, and real defects audit (dummy Latin copy, `XXXXXX` placeholder, missing review date).
- **Run Command (Desktop)**: `NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Loyalty/scripts/capture_live_desktop.js"`
- **Test Suite**: 30 Test Cases ([My_Account_Loyalty_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_My_Account_Loyalty/My_Account_Loyalty_Test_Cases.xlsx))

---

### 5. [05. My Account - Dashboard Demo Notes](05_My_Account_Dashboard_Demo_Notes.md)
- **Target URL**: `https://mcstaging2.globewest.com/customer/account/`
- **Figma Reference**: Master Frame 620 (`desktop/my_account/01_dashboard` & `mobile/my_account/01_dashboard`)
- **Scope**: Central B2B operational dashboard, customer greeting & Enterprise tier badge, 6-column Recent Orders table reduction, USA MM/DD/YY date formatting, online claims banner, 3-card marketing promotions grid, and single-open FAQ accordions.
- **Run Command (Desktop)**: `NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794527_My_Account_Dashboard/scripts/run_headed_dashboard_desktop_audit.js"`
- **Test Suite**: 31 Test Cases (30 Frontend + 1 Admin) ([Dashboard_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794527_My_Account_Dashboard/Dashboard_Test_Cases.xlsx))

---

### 6. [06. My Account - Dropdown Demo Notes](06_My_Account_Dropdown_Demo_Notes.md)
- **Target URL**: `https://mcstaging2.globewest.com/customer/account/`
- **Figma Reference**: Frame 620 Dropdown Artboards (`FRAME_620_EXACT_SPECS.png`, `mobile/` & `mobile/Home/Menu`)
- **Scope**: Global header profile dropdown flyout, upward/downward caret toggling, 7-link sequence (Dashboard, Orders, Quotes, Holds, Wishlist, Bookings, Logout), mobile user icon overlay, and mobile hamburger drawer authenticated links.
- **Run Command (Desktop)**: `NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Dropdown/scripts/inspect_account_dropdown.js"`
- **Test Suite**: 30 Test Cases ([My_Account_Dropdown_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_My_Account_Dropdown/My_Account_Dropdown_Test_Cases.xlsx))

---

### 7. [07. How to Add a New FAQ: Magento Admin Guide](../HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md)
- **Scope**: Comprehensive step-by-step administrator walkthrough for adding, editing, and ordering FAQ accordions via Adobe Commerce Page Builder across all My Account pages.
- **Guide**: [HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md)

