# GlobeWest US Expansion: Ticket Comparison Source Matrix
# Figma Design Benchmark vs. AU Baseline Parity

---

## 1. Overview & Comparison Strategy

Every QA ticket in the GlobeWest US Expansion Project (P-GLW-007) is validated against one of two primary benchmarks, or a hybrid of both:

1. Figma Design Benchmark:
   - Primary Source: Figma file "Globewest USA - External" (Node 2581-64185 and associated frames).
   - Used for: New US UI components, redesigned layouts, micro-interactions, typography, spacing, and mobile responsive frames.
2. AU Baseline Website Parity:
   - Primary Source: Live Australian Production (https://www.globewest.com.au) and AU Staging (https://mcstaging2.globewest.com.au).
   - Used for: Catalog taxonomy, navigation hierarchy, product facet parity, functional regression, and ensuring US storefront isolation (eradicating Australian regional artifacts).

---

## 2. Master Comparison Matrix by Ticket

| Ticket ID & Module | Primary Comparison Source | Secondary / Hybrid Source | Key Verification Focus |
| :--- | :--- | :--- | :--- |
| Ticket 5: Global Header & Mega Menu (#41801466) | AU Baseline Website | Figma Design Spec | AU parity for 9 categories and 220+ navigation links; Figma for US search bar, currency switcher, and mobile drawer. |
| Global Footer & Legal (#41794517) | AU Baseline Website | Figma Design Spec | AU baseline used as negative check to eradicate Australian Kangaroo logo and phone numbers; Figma for US legal layout. |
| Public Browsing & Trade Toggle (#41794527) | Figma Design Spec | - | Figma specs for Trade vs. MSRP pricing toggle switcher and masked public pricing states. |
| PLP / Category Page (#41794520) | Hybrid (Figma + AU) | AU Baseline Website | Figma for "Show Filters" pinned button, badge placement below photos, and compare insets; AU for catalog facet parity. |
| PDP / Product Details Page (#41794524) | Hybrid (Figma + AU) | AU Baseline Website | Figma for dual-pricing layout and trade downloads; AU for product attribute completeness and NetSuite sync. |
| Cart & Mini-Cart | Hybrid (Figma + AU) | AU Baseline Website | Figma for sliding mini-cart drawer and freight estimator; AU for standard e-commerce cart operations. |
| Ticket #41794528: My Account - Holds | Figma Design Spec (Frame 621) | - | Strictly Figma Frame 621 for ACTIVE/INACTIVE tabs, 7-column table layout, omission of Actions column, and FAQ single-open rule. |
| Ticket #41794529: My Account - Quotes | Figma Design Spec (Frame 623) | - | Strictly Figma Frame 623 for quote filter tabs, quote table layout, USA date formatting, and proposal conversion. |
| Ticket #41794530: My Account - Orders | Figma Design Spec (Frame 624) | - | Strictly Figma Frame 624 for default AWAITING PAYMENT tab, strict 6-column reduction, clickable order link, and Actions dropdown. |

---

## 3. Tickets Compared Strictly Against Figma Design

These tickets introduce newly redesigned US experiences that do not exist on the legacy Australian site, or deliberately deviate from AU layouts:

### 1. Ticket #41794528: My Account - Holds (Frame 621)
- Source: Figma Node 2581-64185 / Frame 621
- Why Figma: The US My Account experience features a redesigned B2B hold management table. Frame 621 defines the dark brown pill styling (#381c12) for the ACTIVE tab, the strict reduction to 7 columns, the rule omitting a separate ACTIONS column (since the Hold ID is clickable), and the single-open FAQ accordion behavior.

### 2. Ticket #41794529: My Account - Quotes (Frame 623)
- Source: Figma Node 2581-64185 / Frame 623
- Why Figma: Defines the US quotation dashboard, quote conversion actions, date formatting (MM/DD/YYYY), and status segmentation.

### 3. Ticket #41794530: My Account - Orders (Frame 624)
- Source: Figma Node 2581-64348 / Frame 624
- Why Figma: Defines the mandatory default tab AWAITING PAYMENT with dark brown pill styling, the consolidation from 10 legacy columns to exactly 6 columns, elimination of the standalone DETAILS column, and the unified Actions dropdown.

### 4. Ticket #41794527: Public Browsing Mode & Pricing Toggle
- Source: Figma Design Specifications
- Why Figma: Defines the client-side toggle switch between Trade Price and MSRP, and the masked pricing state ("Trade Login Required") for public visitors.

---

## 4. Tickets Compared Against AU Baseline Website

These tickets require validation against the Australian production or staging site to ensure catalog integrity, taxonomy completeness, or negative isolation:

### 1. Ticket 5: Global Header & Mega Menu Navigation (#41801466)
- Source: https://www.globewest.com.au
- Why AU Site: The US menu taxonomy must match the live Australian master catalog structure across all 9 main categories (Indoor, Outdoor, Homewares, etc.) and over 220 subcategories. The AU site serves as the functional ground truth for link hierarchy, category names, and URL slugs.

### 2. Global Footer & Legal Isolation (#41794517)
- Source: https://www.globewest.com.au (Negative Baseline)
- Why AU Site: Used as a negative check to verify that Australian-specific elements from the AU site are completely suppressed on the US storefront. This includes the Australian Kangaroo silhouette logo, "AUSTRALIAN OWNED & RUN" badge, Melbourne showroom phone (+613 9518 1600), and Australian GST tax references.

---

## 5. Tickets Requiring Hybrid Validation (Figma + AU Site)

Certain core discovery and shopping pages require a dual-reference strategy:

### 1. Category & Product Listing Page (PLP) (#41794520)
- Figma Reference (Node 2316-12739):
  - Validates UI redesign: dedicated "Show Filters" button pinned before filter pills.
  - Validates badge placement: "New" and "Customize" badges must sit below the product photo inside .product-item-details.
  - Validates compare checkbox styling: 12px to 16px inset margins from container boundaries.
- AU Baseline Reference:
  - Validates catalog parity: facet filter options (Material, Color, Room, Collection), product count consistency, and sorting behavior.

### 2. Product Details Page (PDP) (#41794524)
- Figma Reference:
  - Validates US dual-pricing display (Trade Price + MSRP).
  - Validates Trade spec sheet download section (CAD, 3D models, tear sheets).
  - Validates finish and material swatch selector styling.
- AU Baseline Reference:
  - Validates attribute completeness (dimensions, care instructions, warranty info) and NetSuite product data synchronization.

### 3. Cart & Mini-Cart Drawer
- Figma Reference:
  - Validates mini-cart sliding drawer layout, typography, and button styling.
  - Validates US freight calculation input (ZIP code field).
- AU Baseline Reference:
  - Validates cart session management, item quantity adjustments, and standard e-commerce workflows.

---

## 6. QA Decision Protocol for Future Tickets

When a new ticket is assigned:

1. Check Ticket Description & Teamwork Brief:
   - If a specific Figma Node or Frame is linked: Figma is the primary source of truth for all visual and layout assertions.
   - If "Parity with AU" or "AU Baseline" is specified: The live Australian site (globewest.com.au) is the primary source of truth.
2. If Neither or Both are Mentioned:
   - Visual styling, layout, typography, and spacing adhere to Figma.
   - Product data, navigation links, and functional behavior adhere to AU parity.
   - Any Australian regional text, phone numbers, or Kangaroo badges found on the US site are strictly defects.
