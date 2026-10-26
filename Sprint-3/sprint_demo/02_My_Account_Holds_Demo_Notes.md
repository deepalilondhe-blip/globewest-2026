# 🎤 GlobeWest Sprint 3 Demo Notes: My Account - Holds

---

### 1. Overview & Objective
- **Feature**: My Holds Customer Account Dashboard (`/gw_orders/hold/index/`)
- **Ticket**: [#41794528 - My Account - Holds](https://overdose.eu.teamwork.com/app/tasks/41794528)
- **Figma Reference**: Globewest USA - External ([Node 2581-64185 / Frame 621](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64185&t=UHKXdUurQ7e08vqM-0))
- **Scope**: Trade customer portal for managing reserved inventory holds (2 business days reservation), order confirmation, search, and hold history.

---

### 2. Live Demo Script (Headed Mode)

#### A. Running the Automated Desktop Headed Walkthrough:
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794528_My_Account_Holds/scripts/capture_live_desktop.js"
```

**Talking Points During Run**:
1. **Sidebar Hold Count Badge (Developer Vinod's Update - PASSED ✅)**:
   - Call out the blue counter pill badge (`.item__counter`) next to `Holds [5]` in the left sidebar account navigation.
   - Verified math: 3 Active Holds + 2 Inactive Holds = 5 Total Holds on record.
2. **Status Filter Tabs (PASSED ✅)**:
   - Show default `ACTIVE` tab selected with dark brown solid pill styling (`rgb(56, 28, 18)` / `#2B1D16`).
   - Demonstrate clean tab switching to `INACTIVE` tab showing expired holds and the warning notice banner.
3. **Table Architecture & Multi-Action Dropdown (CONFORMS TO SPEC ✅)**:
   - Frame 621 rule: *"if the only action available is view, hide column; otherwise actions housed under dropdown"*.
   - Live rows have multiple actions (`VIEW` + `MODIFY / CONFIRM`), correctly housed under the `Actions ⌵` dropdown.
4. **FAQ Accordion (PASSED ✅)**:
   - Show all accordions collapsed by default on initial render.
   - Demonstrate Frame 621 single-open auto-collapse rule: expanding Question 2 automatically collapses Question 1.
5. **Call Out Active Defects 🔴**:
   - **Date Format Leak**: Table displays Australian date format `14/10/26` (`DD/MM/YY`) instead of US standard `10/14/26` (`MM/DD/YYYY`).
   - **Header Typo**: Column 3 displays `CUST P0#` (digit 0) instead of `CUST PO#` (letter O).
   - **Subtitle Copy**: Subtitle uses Australian spelling `favourite` instead of US `favorite`.
   - **Support Phone Prefix**: Displays Australian phone `+613 9518 1600` on the US storefront.

---

#### B. Running the Automated Mobile Headed Walkthrough:
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794528_My_Account_Holds/scripts/capture_live_mobile.js"
```

**Talking Points During Mobile Run**:
1. **Responsive Table Stacking**:
   - Layout stacks for mobile viewports (390px).
2. **Mobile Defects Callout**:
   - **Column Order Inversion**: Sequence displays `STATUS` before `TOTAL` (`HOLD | DATE | STATUS | TOTAL | ACTIONS`), whereas Figma specifies `HOLD | DATE | TOTAL | STATUS | ACTIONS`.
   - **Actions Button Clipping**: The 5th column `Actions` button overflows the right edge and gets clipped (`Ac`), requiring horizontal scrolling.

---

---

### 3. Magento Admin & ERP Verification Walkthrough (12 Admin Checks)
- **Admin Access**: `https://mcstaging2.globewest.com.au/godmode/admin/` (`deepali.londhe@overdose.digital`).
- **1. Scope Verification**: Switch Store View / Scope to **`USA Website`** to verify isolated configurations without AU leakage (`TC-GW-HOLDS-ADMIN-001`).
- **2. Subtitle Spelling Localization**: `Stores > Configuration > OVERDOSE > Customer Account Content Configs > B2b Account Content` contains `B2b Holds Text`. Currently leaks Australian spelling `"favourite"` instead of US English `"favorite"` (`TC-GW-HOLDS-ADMIN-002`).
- **3. Holds View & Modify Content**: Fields `B2b Holds View Title/Text` and `B2b Holds Modify Title/Text` manage customer instructions on active hold modifications (`TC-GW-HOLDS-ADMIN-003`).
- **4. Dashboard Holds Widget Toggle**: `Hidden blocks of the dashboard > Is Show Holds Block` allows toggling the Holds card on the customer dashboard (`TC-GW-HOLDS-ADMIN-004`).
- **5. Support Contact Block Phone & Email**: `B2b Help Block Hold Orders` fields manage support info. Currently leaks Australian phone `+613 9518 1600` and AU email on US store (`TC-GW-HOLDS-ADMIN-005`).
- **6. NetSuite Integration Sync**: Verified real-time sync reserving commercial inventory for 2 business days (48 hours) with customer ID and SKU payload (`TC-GW-HOLDS-ADMIN-006`).
- **7. NetSuite Orders Grid Lookup**: Admin grid at `Sales > Netsuite Orders` (`/godmode/gw_orders/order/index/`) displays customer hold order records (`TC-GW-HOLDS-ADMIN-007`).
- **8. Automated Cron Expiration**: Verified automated cron (`gw_orders_expire_holds`) transitions expired holds to 'Expired' and shifts row from ACTIVE to INACTIVE tab (`TC-GW-HOLDS-ADMIN-008`).
- **9. Page Builder FAQ Management**: `Content > Elements > Blocks > account_holds_faq` hosts the Page Builder FAQ accordion container (`TC-GW-HOLDS-ADMIN-009`).
- **10. Add New FAQ Item & 8-Item Limit**: Step-by-step adding, editing, and ordering FAQ items enforcing max 8 questions cap (`TC-GW-HOLDS-ADMIN-010`).
- **11. Cache Invalidation**: `System > Tools > Cache Management` (flushing Blocks HTML output, Page Cache, Configuration) immediately updates frontend (`TC-GW-HOLDS-ADMIN-011`).
- **12. Scope Override Inheritance**: Unchecking "Use system value" isolates US Store View values from AU baseline defaults (`TC-GW-HOLDS-ADMIN-012`).

---

### 4. Deliverables & Test Suite Artifacts
- **Excel Test Cases (42 TCs - 30 Frontend + 12 Admin)**: [My_Holds_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794528_My_Account_Holds/My_Holds_Test_Cases.xlsx)
- **CSV Test Cases (42 TCs - 30 Frontend + 12 Admin)**: [My_Holds_Test_Cases.csv](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794528_My_Account_Holds/My_Holds_Test_Cases.csv)
- **Execution File**: [My Holds runcommand.txt](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794528_My_Account_Holds/My%20Holds%20runcommand.txt)
- **Interactive Figma Comparison Viewer**: [VIEW_FIGMA_COMPARISONS.html](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794528_My_Account_Holds/VIEW_FIGMA_COMPARISONS.html)
- **Comprehensive QA Audit Report**: [QA_AUDIT_REPORT.md](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794528_My_Account_Holds/QA_AUDIT_REPORT.md)
- **Admin FAQ Workflow Guide**: [HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/HOW_TO_ADD_NEW_FAQ_ADMIN_GUIDE.md)
