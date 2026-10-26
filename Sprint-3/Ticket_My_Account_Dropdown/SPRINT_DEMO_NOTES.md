# Sprint Demo Notes: My Account – Dropdown

**Feature:** My Account Header & Mobile Profile Dropdown  
**Target URL (US Staging):** `https://mcstaging2.globewest.com/customer/account/`  
**Figma Reference:** Master Frame 620 (`FRAME_620_EXACT_SPECS.png`, `mobile/` & `mobile/Home/Menu`)  
**Test Suite:** 30 Test Cases (`My_Account_Dropdown_Test_Cases.xlsx` & `My_Account_Dropdown_Test_Cases.csv`)  
**Account Tested:** US Trade Account (`deepali.londhe@overdose.digital`)

---

## 🎯 Executive Summary for Stakeholders
The **My Account Dropdown** provides rapid, friction-free profile navigation across every page of the storefront for authenticated B2B trade partners. This review verifies the desktop utility dropdown and mobile account overlays against Figma Frame 620.

---

## 🔍 Key Demo Flow (What to Present to the Team)

### 1. Desktop Header Profile Dropdown
- **Trigger & Caret:** In the top utility bar, hovering/clicking `👤 My Account` opens the dropdown flyout and toggles the chevron from downward (`⌵`) to upward (`^`).
- **Container Styling:** Renders a clean white card with subtle drop shadow and upward-pointing pointer arrow.
- **Link Hierarchy:** Displays `My Dashboard`, `My Orders`, `My Quotes`, `My Holds`, `Showroom Bookings`, and `Logout`.
- **Figma Defect (DEF-DROP-01):** Link #5 in Figma (`My Wishlist & Boards`) is **100% missing** from the dropdown menu.

### 2. Mobile Account Navigation Overlay
- **Mobile Header Trigger:** Tapping the `👤` icon in the mobile header (393px viewport) opens the full mobile account overlay.
- **Touch Targets:** Menu items feature 48px height touch targets with clean separator lines.
- **Figma Defect (DEF-DROP-01):** `My Wishlist & Boards` is also missing on the mobile overlay.

### 3. Mobile Hamburger Drawer Account Links
- **Figma Spec (`mobile/Home/Menu`):** When a user is logged in, opening the hamburger navigation menu should display the 7 authenticated account links prominently at the top of the drawer.
- **Figma Defect (DEF-DROP-03):** The mobile drawer currently only displays product categories and completely omits authenticated user account links.

---

## 💻 Exact Terminal Run Commands

### Desktop View (1440 × 900)
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Dropdown/scripts/inspect_account_dropdown.js"
```

### Mobile View (393 × 852 iPhone 14 Pro)
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Dropdown/scripts/capture_mobile_dropdown.js"
```
