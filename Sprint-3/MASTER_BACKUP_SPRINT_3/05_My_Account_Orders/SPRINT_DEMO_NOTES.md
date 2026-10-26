# Sprint-3 Demo Notes: My Account - Orders — US Storefront (Ticket #41794530)

> **Audience:** Product Owners, Front-End Tech Leads, Solution Architects & Stakeholders  
> **Speaker / Presenter:** Deepali Londhe (Senior QA Lead)  
> **Topic:** Live Verification & Demo Walkthrough of My Orders Portal (`/gw_orders/order/index/`)  
> **Target Environment:** `https://mcstaging2.globewest.com/gw_orders/order/index/`  
> **Figma Reference:** [Globewest USA - External (Node 2581-64348 / Frame 624)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64348&t=UHKXdUurQ7e08vqM-0)  

---

## 1. Feature Overview & Scope Delivered
* **Ticket ID:** [#41794530](https://overdose.eu.teamwork.com/app/tasks/41794530) — `My Account - Orders (P-GLW-007 Globewest US Expansion Project)`
* **Assigned QA Lead:** Deepali Londhe (`@DeepaliL`)
* **Target User Profile:** Authenticated Trade Customer (`deepali.londhe@overdose.digital`)
* **Objective:** Deliver the dedicated B2B Trade Customer Orders Portal within the My Account section, ensuring streamlined order tracking, status tab filtering, consolidated row actions, clickable order details navigation, integrated self-service FAQ accordions, and dedicated sales support routing for the US storefront.

---

## 2. Live Sprint Demo Walkthrough Script (Step-by-Step)

### Step 1: Trade Customer Authentication & Navigation (Desktop 1440×900)
1. **Action:** Navigate to `https://mcstaging2.globewest.com/customer/account/login/` and log in with Trade Customer credentials (`deepali.londhe@overdose.digital`).
2. **Action:** Click **"Orders"** in the left sidebar navigation under "My Account" (or direct route `/gw_orders/order/index/`).
3. **Talking Points:**
   - Confirm page title renders **"My Orders"** with the editorial serif styling on *"My"* and sans-serif on *"Orders"*.
   - Verify left sidebar navigation highlights **"Orders"** as the active item with the solid dark indicator line.
   - Point out account sidebar numerical count badges (e.g., `Orders [3]`, `Quotes [723]`, `Holds [3]`).

### Step 2: Status Filter Tabs & Default Selection (Frame 624 Acceptance Criteria)
1. **Action:** Highlight the segmented tab control directly above the orders table.
2. **Talking Points:**
   - Per **Frame 624 Rule 1**, the filter tabs must **default to "AWAITING PAYMENT"** upon initial page load.
   - Tabs are styled as a cohesive segmented pill control:
     1. `AWAITING PAYMENT` (Default active — solid dark pill `#2B1D16` / `#1E1E1E` with white text)
     2. `PENDING SHIPMENT`
     3. `DISPATCHED`
     4. `CLOSED`
   - Clicking between tabs triggers instant grid filtering based on order status without a full page reload.

### Step 3: Orders Data Grid Architecture (6-Column Consolidation)
1. **Action:** Walk through the table column headers and row data.
2. **Talking Points:**
   - Per **Frame 624 Rule 2**, table structure strictly adheres to the consolidated **6-column layout**:
     1. `ORDER ⬍` (Order number with sort indicator `⬍`)
     2. `DATE ⬍` (Enforcing US Date standard `MM/DD/YYYY`)
     3. `STATUS ⬍` (Status badge: e.g., `Processing` in mustard/gold `#A1732B`, `Complete` in forest green `#2E7D32`)
     4. `TOTAL ⬍` (US currency formatting `$USD`)
     5. `BALANCE ⬍` (Remaining balance formatting `$USD`)
     6. `ACTIONS` (Consolidated dropdown menu)
   - Highlight the intentional removal of redundant columns (`Cust po#`, `Order name`, `Client Name`) to keep the dashboard uncluttered.

### Step 4: Clickable Order Number Link & Unified Actions Dropdown (Frame 624 Rule 3 & 4)
1. **Action:** Hover over the Order Number `#CH03021` and demonstrate clicking it.
2. **Talking Points:**
   - Per **Frame 624 Rule 4**, the Order Number is a primary clickable link leading directly to the Order Details Page (`/gw_orders/order/view/order_id/X/`).
   - Per **Frame 624 Rule 3**, all secondary actions (`View Order`, `Reorder`, `Download Invoice PDF`) are cleanly housed under the unified **`Actions ▾`** dropdown button, eliminating messy multi-button rows.

### Step 5: Inline Search Component & Dynamic Lookup
1. **Action:** Type an order number or keyword into the search input.
2. **Talking Points:**
   - The search input sits **inline on the same horizontal row** directly to the right of the filter tabs, maintaining a clean, balanced layout.
   - Search dynamically filters records across Order Number and associated metadata.

### Step 6: Self-Service FAQ Accordion Block (Frame 624 Block 2)
1. **Action:** Scroll below the orders table to the **"Frequently Asked Questions"** section.
2. **Talking Points:**
   - Dedicated modular FAQ component built specifically for the My Account Orders experience.
   - Pre-populated with contextual order tracking, modification, and delivery questions (supporting up to 8 FAQs).
   - **Accordion Behavior (Frame 624):** All accordions are collapsed by default upon initial page load.
   - Expanding an accordion smoothly reveals the answer; expanding another accordion automatically closes any previously open accordion (**single-accordion active constraint**).

### Step 7: "Need to Change an Order?" Support Contact Block (Frame 624 Block 3)
1. **Action:** Scroll to the dedicated support banner positioned directly beneath the FAQs.
2. **Talking Points:**
   - Clear guidance for Trade Customers needing to modify orders post-submission.
   - Enforces **US Storefront Scope Isolation**: features dedicated US toll-free customer support hotline and US domain email link (`sales@globewest.com`), replacing legacy Australian contact details.

### Step 8: Mobile Viewport & Touch Responsiveness (390×844 iPhone View)
1. **Action:** Switch to Mobile Viewport in Chrome DevTools (390×844).
2. **Talking Points:**
   - Filter tabs switch to a touch-friendly horizontally scrollable segmented bar (minimum 44×44px tap targets).
   - Search bar scales to 100% container width.
   - Table collapses cleanly into responsive card-based layout with linked Order Number and unified `Actions ▾` dropdown on every card.
   - FAQ accordions and Support block retain clean, thumb-friendly tap accessibility.

---

## 3. Current Live Staging Deployment Status & Defect Registry

> [!WARNING]
> **Pre-Deployment Alert (Audit Date: 2026-09-23):**  
> Automated live retest and pixel comparison confirm that **developer frontend changes have NOT yet been deployed** to `mcstaging2.globewest.com`. The live environment currently reflects the unstyled baseline.

### Pending Engineering Remediation Items (Defects Cataloged Ahead of Deployment):

| Defect # | Feature / Module | Frame 624 / Figma Requirement | Live Staging Actual State | Severity |
| :---: | :--- | :--- | :--- | :---: |
| **Pass 01** | **Filter Tabs** | Must default to **`AWAITING PAYMENT`** with solid pill styling | Defaults to **`OPEN`** with raw text underline; missing `Pending Shipment` & `Dispatched` | 🔴 HIGH |
| **Pass 02** | **Table Structure** | 6 Columns; unified `Actions ▾` dropdown; linked order # | 10 Columns; redundant unstyled `DETAILS` column and extra unneeded columns | 🔴 HIGH |
| **Pass 03** | **Search Bar** | Placed inline horizontally beside filter tabs | Floating disconnected above table right | ⚠️ MEDIUM |
| **Pass 04** | **FAQ Block** | Dedicated FAQ Accordion section below table | **100% MISSING** from live DOM | 🔴 CRITICAL |
| **Pass 05** | **Support Block** | Dedicated US Support information | Leaking Australian phone `+613` & `sales@globewest.com.au` | 🔴 HIGH |
| **Pass 06** | **Sidebar Badges** | Numerical count badges (`Orders [3]`, `Quotes [723]`, `Holds [3]`) | Zero count badges rendered in sidebar | ⚠️ MEDIUM |
| **Pass 07** | **Mobile Empty State**| Custom brand-styled empty state alert | Raw blue Magento alert (`Table is empty!`) | 🔴 HIGH |
| **Pass 08** | **Storefront Footer**| Suppress Australian Kangaroo badge on US store | Leaking Australian Kangaroo logo on footer | 🔴 HIGH |

---

## 4. Key Questions & Stakeholder Discussion Points

1. **Order Cancellation & Modification Window**:
   - What is the business rule for order modifications once an order transitions from `Awaiting Payment` to `Pending Shipment`? (Currently handled via the "Need to change an order?" support contact block).
2. **Order Details Page Alignment**:
   - Confirm whether Ticket #41794530 includes the Orders Details page sub-route (`/gw_orders/order/view/order_id/X/`) or if that is scoped under a separate sub-task.
3. **Admin Order Pagination**:
   - Confirm default page size (Figma artboard displays 3 items per page with pagination controls `[ 1 ] [ 2 ] [ 3 ] [ > ]`).
