# QA Test Strategy & Specification: Enable Public Browsing Mode
**Ticket**: `P-GLW-007 Globewest US Expansion Project > Delivery > Store Configuration > Enable Public Browsing Mode`  
**Related Ticket**: `RRP / Trade Price Toggle`  
**QA Lead**: Deepali Londhe (Senior QA Engineer)  
**Environment**: US Staging (`https://mcstaging2.globewest.com`) & AU Baseline (`https://mcstaging2.globewest.com.au`)  
**Design Spec (Figma)**: [Figma Design Node 2424-21417](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2424-21417&t=bCwvwbROwLksT4HZ-0)  
**Blueprint Reference**: [Confluence Wiki - RRP / Trade Price Toggle](https://overdosedigital.atlassian.net/wiki/spaces/GlobeWest/pages/5196087412/RRP+Trade+Price+Toggle)  
**Standards Compliance**: WCAG 2.2 AA Accessibility, Pixel-Perfect Figma Fidelity, Dual-Auth Matrix  

---

## 1. Executive Summary & Objective

The objective of this ticket is to enable **Public Browsing Mode** for the GlobeWest USA website. 
In the US B2B market model:
* **Guest / Logged-out visitors** must be granted unrestricted access to explore the catalog, category pages (PLP), and product detail pages (PDP) to discover GlobeWest's collections.
* **All pricing (Trade & MSRP)** and **all ordering/purchasing mechanisms (Add to Cart, Quick Buy, Instant Checkout)** must be strictly hidden and suppressed for guests.
* The wholesale trade pricing model remains visible only to authenticated **Trade Customers** and **Salespeople**.
* The **Australia (AU) storefront must remain completely unaffected** (public visitors in AU see consumer retail pricing and can purchase).

---

## 2. Dual-Market Architecture & Backend Configuration

### A. Magento Admin Category Permissions
**Navigation**: `Stores > Configuration > Catalog > Catalog > Category Permissions`

| Setting Field | Scope | Configured Value | Business Impact |
| :--- | :--- | :--- | :--- |
| **Enable** | Default Config | `Yes` | Activates Magento B2B Category Permissions globally across the instance. |
| **Allow Browsing Category** | Default Config / USA | `Yes, for Everyone` | Allows unauthenticated guest visitors to browse category and catalog pages without redirection. |
| **Display Product Prices** | USA Website (Override) | `No` / Restricted Groups | Suppresses product prices on category and product pages for guest/unapproved groups. |
| **Allow Adding to Cart** | USA Website (Override) | `No` / Restricted Groups | Removes the Add to Cart button and disables cart actions for unapproved customer groups. |

### B. Category-Level Permissions Override Rule
* As per the specification, individual categories on the USA website (e.g., `Indoor`, `Outdoor`, `Living`) **do not have category-specific permission overrides**.
* All categories inherit directly from the website-level scope (`USA Website`).
* **QA Validation Note**: Verify that no category inadvertently sets custom permissions that would redirect guests to a 404 or login wall.

### C. Cache Invalidation Standard
* Any administrative permission updates require a full flush:
  `System > Tools > Cache Management > Flush Magento Cache`.

---

## 3. Dual-Auth User Matrix & Storefront Behavior

| User State | Category / PLP Browsing | PDP Browsing | Pricing Display | Add to Cart Button | Pricing Toggle (Trade/MSRP) | Cart & Checkout Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Guest / Public (US)** | ✅ Permitted (No redirect) | ✅ Permitted | ❌ **Hidden / Masked** (No dollar amount in UI or DOM) | ❌ **Hidden / Suppressed** | ❌ **Hidden** | ❌ Blocked (Redirects to Login) |
| **Trade Customer (US)** | ✅ Permitted | ✅ Permitted | ✅ Trade Price (Default) or MSRP (Toggled) | ✅ Active | ✅ **Active** (`Trade` / `MSRP`) | ✅ Processes at wholesale Trade price |
| **Salesperson (US)** | ✅ Permitted | ✅ Permitted | ✅ Salesperson Tier or MSRP | ✅ Active | ✅ **Active** | ✅ Processes at authorized margin |
| **Guest / Public (AU)** | ✅ Permitted | ✅ Permitted | ✅ Retail AUD Price Visible | ✅ Active | ❌ Not applicable | ✅ Allows consumer checkout |

---

## 4. Integration Critical Path: SearchSpring (SS)

> **Key Integration Risk Flagged by Dev Team (Mohamed Bharmal)**:  
> While core Magento/Luma templates have price masking implemented, **SearchSpring (SS)** powers search autocomplete, faceted PLP filters, and search results grids.  
> **QA Requirement**: SearchSpring dynamic templates must NOT bypass Magento Category Permissions. Search results, quick view modals, and search autocomplete cards must be tested to ensure no prices leak through client-side JavaScript payloads or SearchSpring API responses.

---

## 5. Comprehensive Senior QA Test Scenarios

### Test Suite 1: US Storefront Guest Public Browsing (Negative Pricing & Cart Check)
* **TC-PB-01**: Access US Homepage as Guest → Verify no price leaks in featured collections or hero carousels.
* **TC-PB-02**: Access Top Navigation Categories (`/indoor`, `/outdoor`, `/living`) → Verify PLP loads with HTTP 200, category header renders, zero prices visible on cards, zero Add to Cart buttons.
* **TC-PB-03**: DOM Security Inspection → Inspect `.product-item-info`, `.price-box`, and dataset attributes (`data-price-amount`, `data-price-type`) to ensure pricing is NOT simply hidden with `display: none` or `visibility: hidden`.
* **TC-PB-04**: PDP Deep Inspection → Open product page directly as guest. Verify photo gallery, dimensions, materials, and NetSuite SKU render, but price and Add to Cart are suppressed.
* **TC-PB-05**: Trade Conversion CTAs → Verify presence of `"Become a Trade Customer"`, `"Trade Login Required"`, or `"Book Showroom"` prompts on unpriced cards and header utility bar.

### Test Suite 2: Search & Autocomplete Leakage (SearchSpring Validation)
* **TC-PB-06**: Search Autocomplete Dropdown → Type common keywords (`chair`, `table`, `sofa`). Verify suggestion thumbnails and card titles appear without pricing or buy triggers.
* **TC-PB-07**: Search Results Page (`/catalogsearch/result/?q=...`) → Verify full SearchSpring grid enforces the guest price suppression.

### Test Suite 3: AU Storefront Regression Safeguards
* **TC-PB-08**: AU Storefront Guest Baseline (`mcstaging2.globewest.com.au`) → Verify Australian guest sessions can view retail prices (AUD) and see the `"Add to Cart"` button. Confirm US Category Permissions did not leak to Default/AU scope.

### Test Suite 4: Authenticated Trade Customer Workflow
* **TC-PB-09**: Trade Login (`deepali.londhe@overdose.digital`) → Verify successful authentication.
* **TC-PB-10**: Trade Pricing Default View → Verify wholesale trade pricing is immediately displayed on PLP and PDP.
* **TC-PB-11**: Price Toggle Interaction → Verify toggle switches between Trade and MSRP, updating root HTML class (`price-view-trade` vs `price-view-msrp`).
* **TC-PB-12**: Cart Wholesale Enforcement → Verify adding item to cart reflects Trade wholesale price, unaffected by the visual toggle state.

### Test Suite 5: WCAG 2.2 AA Accessibility & Visual Aesthetics
* **TC-PB-13**: Accessibility of Unpriced Cards → Screen reader announcements must not announce empty or confusing price containers.
* **TC-PB-14**: Layout Balance → Verify product cards without price and Add to Cart maintain consistent grid height, alignment, and visual breathing room as per Figma specifications.
