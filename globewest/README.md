# GlobeWest US Expansion Project (P-GLW-007)
# Master Project Architecture & Operations Manual

---

## 1. Project Metadata & Overview

- Project Name: GlobeWest US Expansion Project
- Project Code: P-GLW-007
- Client: GlobeWest
- Digital Agency: Overdose Digital
- Target Live Staging URL: https://mcstaging2.globewest.com
- Baseline Production URL (AU): https://www.globewest.com.au
- Approved Figma Design File: Globewest USA - External (Node 2581-64185 / Frames 621-624)
- QA Lead: Deepali Londhe

### Business Mission
GlobeWest is a leading Australian designer furniture and homewares brand catering to interior designers, architects, commercial specifiers, and retail consumers. Project P-GLW-007 represents the brand's strategic entry into the United States market. The objective is to deploy a localized, high-performance eCommerce platform on Adobe Commerce (Magento 2.4.x Enterprise) integrated bi-directionally with NetSuite ERP.

The platform transitions GlobeWest from an Australian wholesale operation into a dual-audience US storefront that serves both public retail shoppers and verified trade professionals.

---

## 2. Technical Stack & System Architecture

### Platform Components:
- E-Commerce Engine: Adobe Commerce / Magento 2 Enterprise Edition (M2)
- Frontend Storefront: Custom Magento theme, PHTML templates, Knockout.js, Vanilla CSS
- ERP System: Oracle NetSuite ERP (US Instance)
- NetSuite Integration: Bi-directional synchronization for live US inventory, pricing tiers, customer credit limits, product holds, formal quotes, and order fulfillment
- Test Automation Harness: Playwright with Headed Chrome, Python image processing, Node.js XLSX matrix generator

---

## 3. Dual-Auth Architecture

The US storefront enforces a strict Dual-Auth operational matrix:

### Mode 1: Logged-Out Guest (Public Browsing Mode)
- Retail visitors can browse the complete catalog.
- Wholesale and trade pricing are strictly masked across all catalog and search views.
- Products display Manufacturer Suggested Retail Price (MSRP) only.
- Top utility bar displays public CTAs: "Become a Trade Customer", "Ready to Buy", and "Book Showroom".
- Direct wholesale purchasing is disabled. Account URLs redirect to the login page (/customer/account/login/).

### Mode 2: Logged-In Trade Customer Mode
- Verified interior designers and commercial accounts unlock wholesale trade pricing.
- Top header provides an active pricing toggle: [ Trade Price | MSRP ].
- Product cards render dual pricing lines: Trade Price + MSRP (e.g., $1,390 Trade • $1,490 MSRP).
- Real-time stock counts reflect live US warehouse availability or dispatch lead times.
- Trade customer registration CTAs are hidden.
- Access is granted to the self-service B2B portal for Holds, Quotes, Orders, and Invoices.

---

## 4. Comprehensive Sprint Breakdown

### Sprint 1: Storefront Foundation, Header & Footer Isolation
- Ticket 4 (CMS Structure): Implementation of US-specific CMS pages, hero banners, and policy documentation.
- Ticket 5 (Header & Mega Menu - Ticket #41801466): 9 primary navigation categories, 220+ verified links, predictive search autocomplete, and mobile drawer menu.
- Global Footer & Legal Isolation (Ticket #41794517): Complete suppression of Australian Kangaroo trust badges ("AUSTRALIAN OWNED & RUN"), removal of Australian showroom addresses, and insertion of US copyright, privacy policy, and sales contact channels.
- Public Browsing & Trade Pricing Toggle (Ticket #41794527): Client-side switching between Trade Price and MSRP.

### Sprint 2: Catalog Discovery, PDP & Checkout
- Category & PLP Pages (Ticket #41794520): Dedicated "Show Filters" button pinned before active filter pills, product badges (New, Customize) placed below photos inside details container, and compare checkboxes inset 12px to 16px from boundaries.
- Product Details Page (Ticket #41794524): High-resolution product galleries, material and finish swatches, live NetSuite stock counts, and downloadable trade spec sheets (CAD, 3D models, tear sheets).
- Cart & Mini-Cart: Sliding mini-cart drawer, US ZIP-code freight estimation, and NetSuite tax calculation.

### Sprint 3: My Account Trade Customer Portal (/customer/account/)
- Ticket #41794528: My Account - Holds (Frame 621)
  - 2-day inventory reservations for design proposals.
  - Status tabs: ACTIVE (default dark brown pill #381c12) and INACTIVE.
  - Strict 7-column table layout: HOLD, EXP. DATE, CUST PO#, ORDER NAME, CLIENT NAME, STATUS, TOTAL.
  - Dedicated ACTIONS column omitted because the Hold Number itself is a clickable link to view details.
  - FAQ accordion module enforcing single-open auto-collapse rule.
  - Customer support contact block editable via Magento CMS static block.
- Ticket #41794529: My Account - Quotes (Frame 623)
  - Formal B2B quotation management, proposal generation, and 1-click checkout conversion.
- Ticket #41794530: My Account - Orders (Frame 624)
  - Real-time order tracking synchronized with NetSuite ERP.
  - Default status tab AWAITING PAYMENT (dark brown pill), plus PENDING SHIPMENT, DISPATCHED, and CLOSED.
  - Strict 6-column consolidated table layout: ORDER, DATE, STATUS, TOTAL, BALANCE, ACTIONS.
  - Legacy DETAILS column and extra metadata columns eliminated.
  - Order Number clickable link to view order details.
  - Unified Actions dropdown on every row.
  - FAQ accordion module enforcing single-open auto-collapse rule.

---

## 5. QA Verification Standards (AGENTS.md Compliance)

Testing across all modules must adhere to the following directives:

1. Pixel-Perfect Micro-UI Inspection:
   - Computed styles (window.getComputedStyle) must be asserted against Figma specifications.
   - Inspect font-family, font-size, line-height, and font-weight (400 regular vs 700 bold).
   - Ensure proper margin and padding insets (no elements sitting flush at 0px against boundaries).
   - Verify pill border-radius (capsule styling) on badges and status tabs.

2. DOM Structural Hierarchy:
   - Badges (New, Customize) must sit below the product photo inside .product-item-details, never overlaid directly on top of the image container.
   - Toolbars and buttons must maintain proper left/right alignment.

3. Dual-Auth Matrix Testing:
   - Every ticket touching catalog, pricing, cart, or account must be verified under both Logged-Out Guest and Logged-In Trade Customer modes.

4. Data Integrity & Zero Placeholders:
   - Flag placeholder images (/placeholder/default/) as NetSuite sync defects.
   - Flag template text (Lorem ipsum, SEO text here) as content defects.

5. Visual Defect Reporting Standards:
   - Red Border / Tag (#FF0000): US Storefront Actual Defect.
   - Green Border / Tag (#2E7D32): Approved Figma Spec or AU Baseline.
   - Zero text burned onto comparison captures.

6. Execution Commands File:
   - Every ticket directory must maintain a dedicated text file named "<Page Name> runcommand.txt" containing exact replication commands for Desktop and Mobile views.

---

## 6. Project Directory Sitemap

- globewest/ : Central Project Knowledge Base
  - README.md : Master Project Architecture & Operations Manual
  - DUAL_AUTH_AND_BUSINESS_LOGIC.md : Dual-Auth Architecture & NetSuite Integration
  - SPRINT_ROADMAP_AND_TICKETS.md : Sprint Roadmap & Ticket Catalog
  - TICKET_COMPARISON_MATRIX.md : Figma vs. AU Baseline Comparison Mapping
  - TESTING_AND_AUTOMATION_PLAYBOOK.md : Test Execution Playbook & Run Commands
- AGENTS.md : QA Compliance Directives
- PAGEWISE_RUN_COMMANDS.txt : Centralized terminal execution commands
- GlobeWest 2026/ : Git Repository Workspace (origin master)
- Sprint-3/ : Sprint 3 Deliverables and Automated Headed Test Suites
  - Ticket_41794528_My_Account_Holds/
  - Ticket_41794529_My_Account_Quotes/
  - Ticket_41794530_My_Account_Orders/
