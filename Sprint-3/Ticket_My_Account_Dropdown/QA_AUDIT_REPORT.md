# GlobeWest QA Audit Report: My Account Dropdown

**Feature:** My Account Header & Mobile Profile Dropdown  
**Target URL (US Staging):** `https://mcstaging2.globewest.com/customer/account/`  
**Figma Reference:** Master Frame 620 (`FRAME_620_EXACT_SPECS.png`, `mobile/` & `mobile/Home/Menu`)  
**Audit Date:** October 9, 2026  
**Tested Viewports:** Desktop (1440 × 900) & Mobile (393 × 852 iPhone 14 Pro)  
**Authentication State:** US Trade Account (`deepali.londhe@overdose.digital`)

---

## 1. Executive Summary & Verification Overview

A complete verification of the **My Account Dropdown Menu** (both Desktop Header Flyout and Mobile Overlay/Menu) was conducted on the **US Staging storefront** against the approved **Figma Design Specifications (Frame 620 Dropdown Artboards)**.

### Overall Status:
- **Core Architecture & Dropdown Triggers (PASS):** The desktop header trigger `👤 My Account`, active caret toggle (`^` open, `⌵` closed), container styling, drop shadow, and routing for Dashboard, Orders, Quotes, Holds, Bookings, and Logout are functional.
- **Critical Figma Spec Discrepancies (3 Flagged):**
  1. 🔴 **`My Wishlist & Boards` Missing (DEF-DROP-01 - P1 High):** Link #5 in Figma Frame 620 is `My Wishlist & Boards`. It is completely absent from both the Desktop flyout and the Mobile overlay.
  2. 🔴 **Mobile Hamburger Menu Drawer Account Links Missing (DEF-DROP-03 - P1 High):** Figma artboard `mobile/Home/Menu` specifies that authenticated trade customers should see their 7 account links at the top of the mobile navigation drawer. On live staging, the drawer only lists product categories, omitting account links.
  3. 🔴 **Copy Inconsistency (DEF-DROP-02 - P3 Low):** Figma specifies `Log out` (two words); live staging renders `Logout` (one word).

---

## 2. Figma Frame 620 Specification Alignment Matrix

| # | Element / Feature | Figma Frame 620 Requirement | Live US Staging Actual Behavior | Result |
|---|---|---|---|:---:|
| 1 | **Header Trigger** | `👤 My Account` with chevron toggle | Renders user icon + `My Account` with chevron | 🟢 **PASS** |
| 2 | **Chevron State** | Caret points up `^` when open, `⌵` when closed | Caret switches to `^` when open | 🟢 **PASS** |
| 3 | **Link 1: My Dashboard** | Points to `/customer/account/` | Renders and routes to `/customer/account/` | 🟢 **PASS** |
| 4 | **Link 2: My Orders** | Points to `/sales/order/history/` | Renders and routes to `/sales/order/history/` | 🟢 **PASS** |
| 5 | **Link 3: My Quotes** | Points to `/quotes/` | Renders and routes to `/quotes/` | 🟢 **PASS** |
| 6 | **Link 4: My Holds** | Points to `/awaff/holds/` | Renders and routes to `/awaff/holds/` | 🟢 **PASS** |
| 7 | **Link 5: My Wishlist & Boards** | Rendered as item #5 in dropdown sequence | **100% MISSING** from dropdown | 🔴 **FAIL (DEF-DROP-01)** |
| 8 | **Link 6: Showroom Bookings** | Points to `/online_booking/account/index/` | Renders and routes correctly | 🟢 **PASS** |
| 9 | **Link 7: Log out** | Label is `Log out` (two words) | Label is `Logout` (single word) | 🔴 **FAIL (DEF-DROP-02)** |
| 10 | **Mobile User Icon Tap** | Tapping `👤` opens mobile account overlay | Opens mobile account overlay | 🟢 **PASS** |
| 11 | **Mobile Account Overlay** | Renders all 7 links per Figma `mobile/` | `My Wishlist & Boards` is missing | 🔴 **FAIL (DEF-DROP-01)** |
| 12 | **Mobile Drawer Menu** | `mobile/Home/Menu` shows account links at top | Drawer only lists product catalog | 🔴 **FAIL (DEF-DROP-03)** |
| 13 | **Outside Click Dismissal** | Dismisses dropdown when clicking outside | Dropdown closes on outside click | 🟢 **PASS** |
| 14 | **Escape Key Dismissal** | Pressing Escape closes menu | Escape key dismisses overlay | 🟢 **PASS** |

---

## 3. Detailed Defect Analysis

### Defect #1: `My Wishlist & Boards` Completely Missing from Dropdown (DEF-DROP-01)
- **Summary:** The 5th item in the Figma Frame 620 dropdown sequence (`My Wishlist & Boards`) is missing from both Desktop and Mobile dropdown menus.
- **Expected (Figma Frame 620 Dropdown):**
  1. `My Dashboard`
  2. `My Orders`
  3. `My Quotes`
  4. `My Holds`
  5. `My Wishlist & Boards`
  6. `Showroom Bookings`
  7. `Log out`
- **Actual (US Live Staging):** Only 6 links rendered:
  1. `My Dashboard`
  2. `My Orders`
  3. `My Quotes`
  4. `My Holds`
  5. `Showroom Bookings`
  6. `Logout`
- **Evidence:** `screenshots/01_desktop_account_dropdown_open.png` vs `figma/FIGMA_DROPDOWN_FRAME_620.png`

---

### Defect #2: Mobile Navigation Drawer Omits Authenticated Account Section (DEF-DROP-03)
- **Summary:** When logged in, opening the mobile hamburger drawer does not display the account links specified in Figma artboard `mobile/Home/Menu`.
- **Expected (Figma artboard `mobile/Home/Menu`):** Drawer opens with account options listed at the top (`My Dashboard`, `My Orders`, `My Quotes`, `My Holds`, `My Wishlist & Boards`, `Showroom Bookings`, `Log Out`), followed by product categories.
- **Actual (US Live Staging):** Drawer only displays product categories (`Indoor`, `Outdoor`, `Homewares`, `In Stock`, etc.) and footer links (`Showroom`, `How to buy`, `My Boards`).
- **Evidence:** `screenshots/02_mobile_account_nav_open.png`

---

## 4. Deliverables Index

- **Rule 6 Command File:** `My Account Dropdown runcommand.txt`
- **Test Suite:**
  - `My_Account_Dropdown_Test_Cases.xlsx` (30 Test Cases)
  - `My_Account_Dropdown_Test_Cases.csv` (30 Test Cases)
- **Sprint Demo Notes:** `SPRINT_DEMO_NOTES.md`
- **Evidence Screenshots:**
  - `screenshots/01_desktop_account_dropdown_open.png` (Desktop open flyout)
  - `screenshots/02_mobile_account_nav_open.png` (Mobile drawer)
  - `screenshots/03_mobile_account_nav_dropdown_open.png` (Mobile in-page dashboard nav toggle)
  - `screenshots/04_mobile_user_icon_clicked.png` (Mobile account overlay)
  - `figma/FIGMA_DROPDOWN_FRAME_620.png` (Figma Frame 620 approved artboard)
