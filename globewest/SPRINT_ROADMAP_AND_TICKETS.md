# GlobeWest US Expansion: Sprint Roadmap & Ticket Catalog

---

## 1. High-Level Sprint Roadmap

- Sprint 1: Storefront Foundation & Navigation
  - Ticket 4: CMS Structure & Landing Pages
  - Ticket 5: Global Header & Mega Menu (Ticket #41801466)
  - Ticket: Global Footer & Legal Isolation (Ticket #41794517)
  - Ticket: Enable Public Browsing & Pricing Toggle (Ticket #41794527)

- Sprint 2: Catalog Discovery & Purchasing Workflows
  - Ticket: PLP / Category Page (Ticket #41794520)
  - Ticket: PDP / Product Details Page (Ticket #41794524)
  - Ticket: Cart Page & Freight Estimator
  - Ticket: Mini-Cart Drawer

- Sprint 3: My Account Trade Customer Portal
  - Ticket #41794528: My Account - Holds (Figma Frame 621)
  - Ticket #41794529: My Account - Quotes (Figma Frame 623)
  - Ticket #41794530: My Account - Orders (Figma Frame 624)

---

## 2. Sprint 1 Ticket Details

### Ticket 5: Global Header & Mega Navigation (Ticket #41801466)
- URL: https://mcstaging2.globewest.com
- Objective: Complete verification of header and 3-tier mega menu across Desktop and Mobile viewports.
- Verified Elements:
  - 9 main navigation categories: Indoor, Outdoor, Homewares, In Stock, Projects, Inspiration, Support, Contact, Brands.
  - Over 220 category and subcategory links verified against Australian catalog parity.
  - Currency display: US Dollars ($).
  - Search input with real-time predictive autocomplete.
  - Header trade utility bar (Book Showroom, Become a Trade Customer, Trade Login).
  - Mobile responsive drawer menu with smooth accordion transitions.

### Ticket: Global Footer & Legal Isolation (Ticket #41794517)
- URL: Global Footer on all pages
- Objective: Remove Australian artifacts and implement US legal and customer care blocks.
- Verified Elements:
  - Complete suppression of Australian Kangaroo badge ("AUSTRALIAN OWNED & RUN").
  - Removal of Australian physical warehouse and showroom addresses.
  - Implementation of US customer care phone numbers and contact emails.
  - US Copyright and localized Terms of Trade.

### Ticket: Public Browsing & Trade Pricing Toggle (Ticket #41794527)
- URL: Global Header / PLP / PDP
- Objective: Allow authenticated designers to toggle between wholesale net pricing (Trade Price) and client-facing suggested retail pricing (MSRP).
- Verified Elements:
  - Header toggle switch: [ Trade Price | MSRP ].
  - Switching toggle instantly flips product card prices between Trade Wholesale and MSRP without page reload.
  - Guest mode locks pricing to MSRP or masked state ("Trade Login Required").

---

## 3. Sprint 2 Ticket Details

### Ticket: Category & Product Listing Page (PLP) (Ticket #41794520)
- URL: https://mcstaging2.globewest.com/furniture/living/sofas.html
- Figma Node: 2316-12739
- Objective: Pixel-perfect grid layout, filters, and product cards.
- Verified Elements:
  - Dedicated "Show Filters" button pinned before filter pills.
  - Category badges (New, Customize, Pre-Order) positioned strictly below the product photo inside .product-item-details, never overlaid directly on top of images.
  - Compare checkbox containers have comfortable 12px to 16px inset margins, never flush at 0px against boundaries.
  - Zero placeholder image defects (/placeholder/default/).

### Ticket: Product Details Page (PDP) (Ticket #41794524)
- URL: https://mcstaging2.globewest.com/ (PDP links)
- Objective: Complete product presentation, technical specifications, and trade purchasing.
- Verified Elements:
  - Dual pricing display: Trade Price + MSRP.
  - Material and color swatch selectors with instant image switching.
  - Real-time stock status (In Stock quantity or factory lead time).
  - Trade spec sheet downloads (3D models, CAD drawings, care guides).

---

## 4. Sprint 3 Ticket Details (My Account Portal)

### Ticket #41794528: My Account - Holds
- URL: https://mcstaging2.globewest.com/gw_orders/hold/index/
- Figma Spec: Node 2581-64185 / Frame 621
- Assigned Developer: Vinod
- QA Status: Audit Complete - 1 Open Defect Reported
- Frame 621 Requirements:
  - Status Filter Tabs: Filter table view of "active" and "inactive" holds. ACTIVE must default to active with dark solid pill styling (#381c12).
  - Inline Search Bar: Horizontally aligned on the same row adjacent to the filter tabs.
  - Table Column Architecture: Strict 7 columns (HOLD, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL).
  - Actions Rule: Omit standalone ACTIONS column because the Hold Number itself is a clickable link routing directly to hold details.
  - FAQ Module: Present below table, all items closed by default, single-open auto-collapse rule.
  - Support Block: Customer support contact block below FAQs (+613 9518 1600 / salessupport@globewest.com.au), CMS editable.
- Open Defect: Table currently displays 8 columns on live staging, retaining a redundant standalone ACTIONS column.

### Ticket #41794529: My Account - Quotes
- URL: https://mcstaging2.globewest.com/gw_orders/quote/index/
- Figma Spec: Node 2581-64185 / Frame 623
- Objective: B2B quote management, client proposal generation, and quote conversion.
- Frame 623 Requirements:
  - Quote status filtering.
  - Direct conversion of quotes into active orders.
  - Standard USA date formatting (MM/DD/YYYY).
  - FAQ accordion single-open behavior.

### Ticket #41794530: My Account - Orders
- URL: https://mcstaging2.globewest.com/gw_orders/order/index/
- Figma Spec: Node 2581-64348 / Frame 624
- Assigned Developer: Mitchell
- QA Status: Retest Verified on Staging (All Core Fixes Passing)
- Frame 624 Requirements:
  - Status Filter Tabs: Must default to AWAITING PAYMENT with dark brown solid pill styling (#381c12). All 4 status tabs present: AWAITING PAYMENT, PENDING SHIPMENT, DISPATCHED, CLOSED.
  - Table Column Reduction: Exactly 6 columns: ORDER, DATE, STATUS, TOTAL, BALANCE, ACTIONS.
  - Elimination of DETAILS: Standalone DETAILS column and legacy metadata columns (Cust po#, Order name, Client Name) removed.
  - Order Link: Order number is clickable link to /gw_orders/order/view/order_id/X/.
  - Actions Dropdown: Unified Actions dropdown on every row.
  - FAQ Block: Closed by default with single-open auto-collapse rule.
  - Support Block Layout: Clean divider line with comfortable vertical margin (no text overlap).
