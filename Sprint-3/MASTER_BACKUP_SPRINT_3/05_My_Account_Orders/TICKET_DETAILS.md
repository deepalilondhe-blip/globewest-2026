# Ticket Specification & Audit Tracker: Ticket #41794530

| Metadata | Details |
|---|---|
| **Ticket Name** | **My Account - Orders** |
| **Project** | P-GLW-007 Globewest US Expansion Project |
| **Teamwork Task ID** | [#41794530](https://overdose.eu.teamwork.com/app/tasks/41794530) |
| **Target Live Staging URL** | `https://mcstaging2.globewest.com/gw_orders/order/index/` |
| **Figma Design Spec** | [Globewest USA - External (Node 2581-64348 / Frame 624)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64348&t=UHKXdUurQ7e08vqM-0) |
| **Target User Profile** | Trade Customer (`deepali.londhe@overdose.digital`) |
| **QA Lead** | Deepali Londhe (`@DeepaliL`) |
| **Current Phase** | **Pre-Development / Work-in-Progress Baseline Verification** |
| **Deliverables Attached** | `My_Orders_Test_Cases.xlsx`, `My_Orders_Test_Cases.csv`, `VIEW_DEFECT_IMAGES.html`, `SPRINT_DEMO_NOTES.md` |

---

## 1. Verified Live Staging Baseline
* **Live Route:** `/gw_orders/order/index/` (Protected customer account area)
* **Access Standard:** Requires authenticated Trade Customer login session (`deepali.londhe@overdose.digital`).
* **Live Layout Captured:** [`screenshots/desktop/01_my_orders_desktop_live_full.png`](screenshots/desktop/01_my_orders_desktop_live_full.png)

### Observed Live Staging Structure:
1. **Title & Copy:** Heading `"My Orders"` with placeholder description.
2. **Filter Tabs:** `ALL`, `OPEN`, `CLOSED`. (Defaults incorrectly to `OPEN` with raw underline).
3. **Search Component:** Search input floating disconnected in top right.
4. **Data Grid (10 Columns):**
   - `Order`
   - `Date`
   - `Cust po#`
   - `Order name`
   - `Client Name`
   - `Status`
   - `Total`
   - `Balance`
   - `Details` (redundant unstyled link)
   - `Actions`
5. **Empty State Alert:** `ⓘ Table is empty!` unstyled Magento alert.
6. **Support Block:** Australian phone `+613 9518 1600` and email `sales@globewest.com.au`.
7. **Missing Modules:** FAQ Accordion block completely absent.
8. **Storefront Footer:** Australian `"AUSTRALIAN OWNED & RUN"` badge present.

---

## 2. Figma Design Specification (Node 2581-64348 / Frame 624)

### Orders Table Requirements (Frame 624):
* **Status Filter Tabs:**
  - Must default to **`AWAITING PAYMENT`** (Dark solid pill active state `#2B1D16` / `#1E1E1E` with white text).
  - 4 Tabs total: `AWAITING PAYMENT` (default), `PENDING SHIPMENT`, `DISPATCHED`, `CLOSED`.
* **Reduction of Columns Shown (6 Columns Total):**
  1. `ORDER ⬍` (Order number with sort indicators, linked and clickable to order details page)
  2. `DATE ⬍` (USA format `MM/DD/YYYY`)
  3. `STATUS ⬍` (Status badge, e.g., `Processing`, `Complete`)
  4. `TOTAL ⬍` (US currency formatting `$USD`)
  5. `BALANCE ⬍` (US currency formatting `$USD`)
  6. `ACTIONS` (Consolidated `Actions ▾` dropdown on every row)
* **Unified Actions Dropdown:** Actions housed under dropdown for both mobile + desktop as per other table functionality.
* **Order Number Link:** Order number must be linked + clickable to the order details page.
* **USA Date Format:** Ensure dates displayed are in USA format (`MM/DD/YYYY`).
* **Search Input:** Aligned horizontally on the same row as the filter tabs.
* **Admin Order Pagination:** Admin to be able to set how many orders are in the table grid view.
* **AUS Theme Parity:** Should retain same core functionality as current AUS theme while enforcing US styling.

### Frequently Asked Questions (FAQ) Block (Frame 624):
* New modular block utilized throughout the My Account Experience.
* Specific questions related to Orders.
* Admin ability to change content; ability to add up to 8 FAQs.
* **All accordions closed by default.**
* **Single-accordion open behavior:** When a user clicks to open another accordion, close any other accordion that was open.

### Need Help / Support Block:
* US contact details (US toll-free phone and US domain email). Australian contact information must be replaced.

### Sidebar Navigation:
* Left sidebar account navigation must display numerical count badges (`Quotes [723]`, `Holds [3]`, `Orders [3]`).
