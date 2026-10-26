# Teamwork / Jira Ticket Update: Claims Portal Requirements & Audit Status

**Ticket**: Claims Portal — US Storefront B2B Self-Service Intake & NetSuite Integration  
**Storefront**: GlobeWest US Staging (`https://mcstaging2.globewest.com`)  
**Status**: 🚨 **P0 DEPLOYMENT BLOCKERS DETECTED (AWAITING DEV DEPLOYMENT TO UNBLOCK INTAKE VERIFICATION)**  

---

### Understanding & Alignment on Client Requirements:

We have carefully aligned all test cases and validation criteria with the new specifications provided:

1. **AU Pain Points Resolved**:
   - **Product-First Search**: Replacing the legacy invoice-first search. Customers search by **Product Name or SKU**, and the system automatically surfaces the matching paid invoice(s). If purchased across multiple invoices, the invoice is repeated per entry.
   - **Reference Continuity**: The **NetSuite Case Number** is explicitly used as the web Claim ID, allowing Customer Service to instantly locate cases quoted by clients.

2. **Claim Intake & Categorization**:
   - **4 Fault Categories**: `Transit Damage` ("Product received in damaged condition"), `Product Defect` ("Considered defect to product"), `Missing Parts` ("Missing parts from a delivery"), and `Incorrect item` ("Incorrect product received").
   - **Media Upload**: Mandatory minimum 1 photo per claim; video upload under assessment by Overdose.
   - **Multi-Product Intake**: Allows bundling multiple products in a single claim (matching AU behavior).
   - **Paid Invoices Only**: Claims can strictly only be raised against paid invoices.

3. **NetSuite Integration & Status ID Mapping**:
   - Portal-only intake (no email claim generation).
   - Unified status synchronization across 16 NetSuite Status IDs:
     - `Claim Received` ➔ IDs `10`, `20`
     - `Claim Under Review` ➔ IDs `30`, `31`, `32`, `33`, `40`
     - `Resolution Offered` ➔ IDs `50`, `55`, `56`, `57`
     - `Resolution Accepted` ➔ IDs `60`, `61`, `62`, `63`, `64`, `68`
     - `Claim Closed` ➔ ID `75`

4. **Tracking & Traceability**:
   - Customers track live status via My Account.
   - Offline claims raised by CS sync to customer account every 15 minutes.
   - Traceability maintained across Zendesk and NetSuite.

---

### Current Live Blockers on `mcstaging2.globewest.com`:

During live execution in headed mode, testing is currently blocked by three P0 environment issues:
1. 🔴 **P0 Blocker 1 (302 Redirect Loop)**: Navigating to Open Claims (`/gw_sales/claim/index/status/open/`), Pending, or Closed Claims immediately executes an HTTP 302 redirect back to the Dashboard (`/customer/account/`).
2. 🔴 **P0 Blocker 2 (Dashboard Dead Link)**: The dashboard notification button `<a class="od-notification__button" href="#">SUBMIT CLAIM</a>` has a dead placeholder `href="#"`.
3. 🔴 **P0 Blocker 3 (Create Form 404)**: Navigating to `/claims/create` or `/gw_sales/claim/create/` returns HTTP 404 Not Found.

---

### Deliverables:
- 📊 **Test Cases (30 Cases)**: `Sprint-3/Ticket_Claims_Portal/Claims_Portal_Test_Cases.xlsx` & `.csv`
- 📝 **Full Audit Report**: `Sprint-3/Ticket_Claims_Portal/CLAIMS_PORTAL_DEFECT_AUDIT_REPORT.md`
- 📄 **Run Commands**: `Sprint-3/Ticket_Claims_Portal/Claims Portal runcommand.txt`
