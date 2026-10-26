# Sprint Demo Notes: My Account – Dashboard

**Ticket:** [#41794527 - My Account - Dashboard](https://overdose.eu.teamwork.com/app/tasks/41794527)  
**Live URL:** `https://mcstaging2.globewest.com/customer/account/`  
**Figma Reference:** Master Frame 620 (`desktop/my_account/01_dashboard` & `mobile/my_account/01_dashboard`)  
**Test Suite:** 31 Test Cases (30 Frontend + 1 Admin) (`Dashboard_Test_Cases.xlsx` & `Dashboard_Test_Cases.csv`)  
**Admin Guide:** [HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md](file:///home/deepali/My%20Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md)  
**Account Tested:** US Trade Account (`deepali.londhe@overdose.digital`)

---

## 🎯 Executive Summary for Stakeholders
The **My Account Dashboard** serves as the central operational hub for authenticated B2B trade partners in the US market. The page has been rebuilt to reflect the clean Frame 620 layout, showcasing loyalty program standing, a consolidated 6-column order history, digital claims integration, marketing campaigns, and showroom bookings.

---

## 🔍 Key Demo Flow (What to Present to the Team)

### 1. Welcome / Loyalty Banner
- **Figma Parity:** Displays customer greeting (`Welcome, Deepali Londhe`), account number (`CUSTOMER #999130725`), tier status pill (`Enterprise tier`), and active discount rate (`Tier Discount: 54% off`).
- **Responsive Behavior:** Desktop features the promotional sofa photograph; mobile gracefully collapses image and stacks typography vertically.
- **Defect Flagged (DEF-DASH-04):** Body paragraph currently renders dummy Latin text (*"Lorem ipsum dolor sit amet..."*) instead of approved English editorial copy.

### 2. Consolidated Recent Orders Table
- **Figma Parity:** Streamlined from legacy 10 columns to **exactly 6 columns**: `ORDER`, `DATE`, `STATUS`, `TOTAL`, `BALANCE`, `ACTIONS`.
- **Localization:** Dates render in US format (`MM/DD/YY` e.g., `09/27/26`); currency renders in USD (`$10,316.00`).
- **Interactive Links & Dropdown:** Order numbers (e.g. `#SO972501`) are clickable anchor links. Secondary actions are cleanly housed under the `Actions ⌵` dropdown button.
- **Defect Flagged (DEF-DASH-03):** Fixed-width status pill badge containers cause text clipping (`Awaiting ...`, `Pending P...`).

### 3. Claims Integration & Promotional Cards
- **Claims Banner:** 1-Column card with `New` pill badge and `SUBMIT CLAIM` button directing to the online claims portal.
- **Events & Promotions Grid:** 3-card responsive grid (`Event`, `Sale: 15% off`, `News`) with individual action buttons.
- **Showroom Bookings:** Clean empty state messaging with `MAKE A BOOKING` CTA button linking to showroom appointment scheduling.
- **FAQ Block:** 5 interactive FAQ accordions enforcing single-open auto-collapse rules.

### 4. Critical Scope & Navigation Discrepancies
- **Defect 1 (DEF-DASH-01 - P1 High):** Top brown utility bar is visible on the dashboard with `"Book Showroom Appointment"`, violating the explicit Frame 620 rule stating *"Desktop & Mobile: Hidden/no utility bar on My Account, so a user cannot toggle pricing view"*.
- **Defect 2 (DEF-DASH-02 - P2 Medium):** Left navigation sidebar displays `GLOBEWEST REFERRALS ⌵` instead of `MY CLAIMS ⌵` (Link #3) and `BOOKINGS ⌵` instead of `MY BOOKINGS ⌵` (Link #5).

---

## 💻 Exact Terminal Run Commands

### Desktop View (1440 × 900)
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794527_My_Account_Dashboard/scripts/run_headed_dashboard_desktop_audit.js"
```

### Mobile View (390 × 844)
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794527_My_Account_Dashboard/scripts/run_headed_dashboard_mobile_audit.js"
```
