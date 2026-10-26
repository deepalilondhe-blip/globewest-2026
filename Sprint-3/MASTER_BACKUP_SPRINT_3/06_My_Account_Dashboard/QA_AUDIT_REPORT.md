# GlobeWest QA Audit Report: My Account - Dashboard (#41794527)

**Ticket:** [#41794527 - My Account - Dashboard](https://overdose.eu.teamwork.com/app/tasks/41794527)  
**Target URL (US Staging):** `https://mcstaging2.globewest.com/customer/account/`  
**AU Baseline Reference:** `https://mcstaging2.globewest.com.au/customer/account/`  
**Master Figma Reference:** [Globewest USA — External (Node 2581-64183 / Frame 620)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64183&t=UHKXdUurQ7e08vqM-0)  
**Audit Date:** October 2, 2026  
**Tested Viewports:** Desktop (1440 × 900) & Mobile (390 × 844)  
**Authentication State:** US Trade Account (`deepali.londhe@overdose.digital`) & AU Trade Baseline  

---

## 1. Executive Summary & Verification Overview

A complete verification was conducted for the newly rebuilt **My Account Dashboard** on the **US Staging storefront** against the approved **Figma Design Specifications (Master Frame 620 & Artboard `desktop/my_account/01_dashboard`)**.

### Overall Status:
- **Core Architecture & Modules (PASS):** The Welcome / Loyalty Block, Recent Orders Table data mapping, USA date formatting, Clickable Order links, 1-Column Claims Notification banner, 3-Card Upcoming Events & Promotions grid, Showroom Bookings empty state, and 5-item FAQ Accordion are correctly implemented and functioning.
- **Frame 620 Design Discrepancies (FAIL / 3 Flagged):** 
  1. Top brown utility bar is visible on the dashboard, violating the explicit Frame 620 rule to hide the utility bar on My Account.
  2. Side navigation links show `GLOBEWEST REFERRALS` and `BOOKINGS` instead of `MY CLAIMS` and `MY BOOKINGS`.
  3. Status pill badges in the Recent Orders table have fixed widths causing text truncation with ellipses (`Awaiting ...`, `Pending P...`, `Payment ...`).

---

## 2. Figma Frame 620 Master Specification Alignment Matrix

| # | Frame 620 Section | Specification Rule from Frame 620 | Live US Staging Actual Behavior | Result |
|---|---|---|---|:---:|
| 1 | **HEADER - Utility Bar** | **Desktop & Mobile:** Hidden/no utility bar, so a user cannot toggle pricing view. | Dark brown utility bar is visible with `Book Showroom Appointment` and company name. | 🔴 **FAIL (Defect #1)** |
| 2 | **MY ACCOUNT - LINKS** | Side nav links must show: `MY DASHBOARD`, `MY ACCOUNT ⌵`, `MY CLAIMS ⌵`, `MY COMPANY ⌵`, `MY BOOKINGS ⌵`, `LOYALTY PROGRAM`, `HELP CENTRE ⌵`, `LOGOUT`. Other AU5 links hidden. Larger alert numbers accommodated. | Link #3 displays `GLOBEWEST REFERRALS ⌵` instead of `MY CLAIMS ⌵`. Link #5 displays `BOOKINGS ⌵` instead of `MY BOOKINGS ⌵`. | 🔴 **FAIL (Defect #2)** |
| 3 | **WELCOME / LOYALTY BLOCK** | Showcase current loyalty status badge (`Enterprise tier`), Customer Name (`Welcome, Deepali Londhe`), Customer Number (`CUSTOMER #999130725`) + Tier Discount (`Tier Discount: 54% off`), editable copy & promo sofa image. | Renders Enterprise tier pill, IvyMode serif welcome heading, customer number, 54% tier discount, body copy, and promotional image. Responsive on mobile (stacked text). | 🟢 **PASS** |
| 4 | **RECENT ORDERS - Columns** | Reduction in columns shown: `ORDER`, `DATE`, `STATUS`, `TOTAL`, `BALANCE`, `ACTIONS`. | Table headers match Figma exactly: `ORDER`, `DATE`, `STATUS`, `TOTAL`, `BALANCE`, `ACTIONS`. | 🟢 **PASS** |
| 5 | **RECENT ORDERS - Dates** | Ensure dates displayed are in USA format (`MM/DD/YY`). | Dates render in USA format: `09/27/26`, `09/21/26`, `09/15/26`. | 🟢 **PASS** |
| 6 | **RECENT ORDERS - Order Link** | Order number is a link that a user can click to view the order details page. | Order numbers (e.g., `#SO972501`) are clickable anchor links leading to the order detail page. | 🟢 **PASS** |
| 7 | **RECENT ORDERS - Actions Dropdown** | Actions housed under dropdown for both mobile + desktop. | Actions menu rendered as `Actions ⌵` dropdown for all rows. | 🟢 **PASS** |
| 8 | **RECENT ORDERS - Status Badges** | Status badges display full status text cleanly inside colored pill badges (`Processing`, `Complete`, etc.). | Badge containers have tight width causing text truncation with ellipses: `Awaiting ...`, `Pending P...`, `Payment ...`. | 🔴 **FAIL (Defect #3)** |
| 9 | **NOTIFICATION BLOCK** | 1-Column notification block: `New` tag, heading `"You can now submit claims online"`, paragraph copy, and `"SUBMIT CLAIM"` CTA button. | Rendered as 1-column card with `New` pill, heading, descriptive copy, and `SUBMIT CLAIM` button matching Figma. | 🟢 **PASS** |
| 10 | **UPCOMING EVENTS & PROMOTIONS** | 3-column content block: Card 1 (`Event`), Card 2 (`Sale: 15% off All Indoor`), Card 3 (`News`) with respective tags, images, copy, and CTAs (`LEARN MORE`, `SHOP NOW`). | Exact 3-column layout rendered on Desktop, responsive vertical stack on Mobile with all 3 promotional cards and CTAs. | 🟢 **PASS** |
| 11 | **SHOWROOM BOOKINGS BLOCK** | Section for showroom appointments with appointment cards, location, date/time, and `"MAKE A BOOKING"` CTA button. Empty state handled cleanly. | Section displays subtitle `"All upcoming showroom bookings listed below. We look forward to seeing you soon!"` and prominent `"MAKE A BOOKING"` CTA button. | 🟢 **PASS** |
| 12 | **FAQ BLOCK** | Up to 8 FAQs, all accordions closed by default, single accordion open at a time (opening another closes previously opened one). | 5 accordions rendered, all closed initially, accordion toggle closes others automatically as required by Frame 620. | 🟢 **PASS** |
| 13 | **OTHER BLOCKS (AU5 Blocks)** | Hidden for USA launch: `My Holds`, `My Wishlist`, `Customer Attribution Credits`, `Referral Code Block`. | Standalone Holds, Attribution credits, and Referral code blocks are hidden from the dashboard view as specified. | 🟢 **PASS** |

---

## 3. Detailed Defect Analysis & Red/Green Visuals

### Defect #1: Utility Bar Visible on Dashboard (Frame 620 Violation)
- **Summary:** The dark brown utility bar is visible on the dashboard, violating the explicit Frame 620 directive to hide the utility bar on My Account pages.
- **Expected (Figma Frame 620 - HEADER):**
  > *"Promotional Banner / Utility Bar -> Desktop: Hidden/no utility bar, so a user cannot toggle pricing view. Mobile: Hidden/no utility bar, so a user cannot toggle pricing view."*
- **Actual (US Live Staging):** The dark brown utility bar renders at the top of the screen on both Desktop and Mobile displaying `"Book Showroom Appointment"` and `"Company: Alert Loans Pty Ltd"`.
- **Evidence:** `DEFECT_SCREENSHOTS/DEFECT_1_UTILITY_BAR_NOT_HIDDEN.png`

---

### Defect #2: Side Navigation Link Labels & Order Inconsistency
- **Summary:** Left navigation sidebar displays `GLOBEWEST REFERRALS ⌵` instead of `MY CLAIMS ⌵` and `BOOKINGS ⌵` instead of `MY BOOKINGS ⌵`.
- **Expected (Figma Frame 620 & Artboard `desktop/my_account/01_dashboard`):**
  1. `MY DASHBOARD`
  2. `MY ACCOUNT ⌵`
  3. `MY CLAIMS ⌵`
  4. `MY COMPANY ⌵`
  5. `MY BOOKINGS ⌵`
  6. `LOYALTY PROGRAM`
  7. `HELP CENTRE ⌵`
  8. `LOGOUT`
- **Actual (US Live Staging):**
  1. `MY DASHBOARD`
  2. `MY ACCOUNT ⌵`
  3. `GLOBEWEST REFERRALS ⌵`
  4. `MY COMPANY ⌵`
  5. `BOOKINGS ⌵`
  6. `LOYALTY PROGRAM`
  7. `HELP CENTRE ⌵`
  8. `LOGOUT`
- **Evidence:** `DEFECT_SCREENSHOTS/DEFECT_2_SIDE_NAV_LINKS_INCONSISTENCY.png`

---

### Defect #3: Recent Orders Table Status Badge Text Truncation
- **Summary:** Order status badge containers have a fixed width / tight overflow, causing status labels to truncate with ellipses.
- **Expected (Figma Artboard `desktop/my_account/01_dashboard`):** Status pill badges accommodate the full status name cleanly (e.g., `Processing`, `Complete`, `Pending Payment`, `Awaiting Payment`).
- **Actual (US Live Staging):** Badges display truncated text on both Desktop and Mobile:
  - `#SO972501`: `Awaiting ...`
  - `#SO972502`: `Pending P...`
  - `#SO972503`: `Payment ...`
- **Evidence:** `DEFECT_SCREENSHOTS/DEFECT_3_RECENT_ORDERS_STATUS_TRUNCATION.png`

---

## 4. Deliverables Index

- **Rule 6 Command File:** `My Account - Dashboard runcommand.txt`
- **Interactive Visualizers:**
  - `VIEW_FIGMA_COMPARISON.html` (10 real clean comparisons)
  - `VIEW_DEFECT_IMAGES.html` (3 red/green defect breakdowns)
- **High-Resolution Comparisons:** `REAL_COMPARISONS/01_...` to `10_...`
- **Annotated Defect Screenshots:** `DEFECT_SCREENSHOTS/DEFECT_1_...` to `DEFECT_3_...`
- **Test Cases:** `Dashboard_Test_Cases.csv`
- **Automated Audit Scripts:**
  - `scripts/run_headed_dashboard_desktop_audit.js`
  - `scripts/run_headed_dashboard_mobile_audit.js`
  - `scripts/generate_all_comparisons_and_defects.py`
