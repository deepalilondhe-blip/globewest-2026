# GlobeWest US Expansion: Official Defect Log

## Summary Table

| Defect ID | Severity | Category | Defect Title | Impact / Scope |
| :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | 🚨 **P1 High** | Integration / Search | Catalog Search returns 0 products on US Storefront (`?q=chair`) | **Pre-Go-Live Blocker**: SearchSpring index not synced for US |
| **DEF-02** | 🔴 **High** | Typography / CSS | Product Title Line Height overextended (+8.8px) & Letter Spacing stretched | Buy box visual hierarchy distorted |
| **DEF-03** | 🔴 **High** | Micro-UI / Typography | "Add to cart" CTA Button uses font-weight 400 (Regular) instead of 600 (Semibold) | CTA prominence & brand spec mismatch |
| **DEF-04** | 🔴 **High** | Content / Scope | "ADD TO QUOTE" Button label appends unapproved copy " / HOLD" | Non-spec button copy on PDP buy box |
| **DEF-05** | ⚠️ **P2 Medium** | Functional Logic | PDP ETA logic missing available quantity count & incoming shipment schedule | Trade customer cannot see live stock availability |
| **DEF-06** | 🔴 **High** | Header / Typography | Header utility bar showroom link is 13px (vs 16px) and copy is "Book Showroom Visit" | Truncated copy & font size mismatch |
| **DEF-07** | 🔴 **High** | PLP / Grid Layout | Category cards missing Wishlist Heart icon, 0px compare inset & AU spelling | Product card layout & localization discrepancy |
| **DEF-08** | ⚠️ **P2 Medium** | Catalog / Asset Sync | Product cards display generic "GW Coming Soon" placeholder graphics | NetSuite catalog image asset synchronization incomplete |

---

## Detailed Defect Tickets

### DEF-01: Catalog Search Returns 0 Results on US Storefront
* **Severity**: 🚨 **P1 - High (Pre-Go-Live Blocker)**
* **Page / URL**: `https://mcstaging2.globewest.com/catalogsearch/result/?q=chair`
* **Single-line Summary**: *Keyword searches return 0 products found and show an empty container because the SearchSpring index is not synced for the US store view.*
* **Steps to Reproduce**:
  1. Navigate to `https://mcstaging2.globewest.com/`.
  2. Enter any valid catalog product keyword (e.g. `chair`, `sofa`, `table`) into the top search input.
  3. Press Enter or click Search.
* **Expected (Figma & Functional Spec)**: Search results grid loads matching products with prices masked for public guests or priced for trade customers.
* **Actual (Live Staging)**: Returns `0 products found` with an empty grid.
* **Evidence**: [COMPARISON_08_SEARCHSPRING_0_RESULTS.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/individual_comparisons/COMPARISON_08_SEARCHSPRING_0_RESULTS.png)

---

### DEF-02: Product Title Line Height Overextended & Letter Spacing Stretched
* **Severity**: 🔴 **High**
* **Page / URL**: `https://mcstaging2.globewest.com/pearce-marble-2-drawer-bedside-matt-ocean-marble-bone-side-pearce-mar-2dr-matt-ocean-marble-bone` (PDP)
* **Single-line Summary**: *Product title line height is overextended by +8.8px (40px vs 31.2px) and letter spacing is stretched by +0.8px.*
* **Steps to Reproduce**:
  1. Navigate to any PDP on US Staging.
  2. Inspect the H1 heading (`.page-title`).
  3. Check computed `line-height` and `letter-spacing`.
* **Expected (Figma Spec - Node 2424-21417)**:
  * Font: `IvyMode Regular 400`
  * Size: `26px`
  * Line Height: **`120% (31.2px)`**
  * Letter Spacing: **`0px`**
* **Actual (Live Staging)**:
  * Font: `IvyMode Regular 400`
  * Size: `26px`
  * Line Height: **`40px`** (+8.8px excessive vertical height)
  * Letter Spacing: **`0.8px`** (+0.8px letter spacing defect)
* **Evidence**: [COMPARISON_02_PRODUCT_TITLE.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/individual_comparisons/COMPARISON_02_PRODUCT_TITLE.png)

---

### DEF-03: "Add to cart" CTA Button Missing Semibold Weight & Stretched Letter Spacing
* **Severity**: 🔴 **High**
* **Page / URL**: `https://mcstaging2.globewest.com/` (All PDPs)
* **Single-Line Summary**: *The primary "Add to cart" CTA button renders with font-weight 400 (Regular) instead of 600 (Semibold), and letter spacing is 4x wider (1px vs 0.25px).*
* **Steps to Reproduce**:
  1. Log in as a Trade Customer (`deepali.londhe@overdose.digital`).
  2. Navigate to any PDP.
  3. Inspect the `#product-addtocart-button` computed styles.
* **Expected (Figma Spec - Node 2424-21417)**:
  * Font Weight: **`600` (Semibold)**
  * Font Size: `14px`
  * Letter Spacing: **`0.25px`**
  * Label: `Add to cart` (Title Case)
* **Actual (Live Staging)**:
  * Font Weight: **`400` (Regular)**
  * Font Size: `15px`
  * Letter Spacing: **`1px`** (4x wider than spec)
  * Label: `ADD TO CART` (All Uppercase)
* **Evidence**: [COMPARISON_03_ADD_TO_CART_BUTTON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/individual_comparisons/COMPARISON_03_ADD_TO_CART_BUTTON.png)

---

### DEF-04: "ADD TO QUOTE" Button Appending Unapproved Copy " / HOLD"
* **Severity**: 🔴 **High**
* **Page / URL**: `https://mcstaging2.globewest.com/` (All PDPs)
* **Single-Line Summary**: *The secondary quote button appends unapproved text " / HOLD" and lacks the Semibold 600 weight specified in Figma.*
* **Steps to Reproduce**:
  1. Log in as a Trade Customer.
  2. Navigate to any PDP and inspect the secondary action button below Add to Cart.
* **Expected (Figma Spec - Node 2424-21417)**:
  * Content Label: **`ADD TO QUOTE`** (Clean 3-word action)
  * Font Weight: **`600` (Semibold)**
  * Letter Spacing: `0.25px`
* **Actual (Live Staging)**:
  * Content Label: **`ADD TO QUOTE / HOLD`** (Unapproved text `/ HOLD` appended)
  * Font Weight: **`400` (Regular)**
* **Evidence**: [COMPARISON_04_ADD_TO_QUOTE_BUTTON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/individual_comparisons/COMPARISON_04_ADD_TO_QUOTE_BUTTON.png)

---

### DEF-05: Missing Stock Quantity Count & Incoming Shipment Schedule
* **Severity**: ⚠️ **P2 - Medium**
* **Page / URL**: `https://mcstaging2.globewest.com/` (All PDPs)
* **Single-Line Summary**: *Live staging displays a generic "Enquire for ETA" link, omitting the available quantity count and the entire secondary incoming shipment schedule.*
* **Steps to Reproduce**:
  1. Log in as a Trade Customer.
  2. Navigate to any PDP and locate the stock notification block under the CTA buttons.
* **Expected (Figma Spec - Node 2424-21417)**:
  * Primary Line: `ETA 14 Mar 2027 (8 available)` with available quantity count in brackets.
  * Secondary Line: `Next Shipment: 8 (ETA 14 Mar 2027)`
  * Action: Pinned `🔔 Notify me` action on the right.
* **Actual (Live Staging)**:
  * Primary Line: Generic `⚠️ Enquire for ETA` only.
  * Available Quantity: **Completely MISSING** (no stock count in brackets).
  * Secondary Line: **Completely MISSING** (no next shipment schedule line).
* **Evidence**: [COMPARISON_05_STOCK_ETA_SCHEDULE.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/individual_comparisons/COMPARISON_05_STOCK_ETA_SCHEDULE.png)

---

### DEF-06: Header Utility Bar Truncated Copy & Smaller Font Size
* **Severity**: 🔴 **High**
* **Page / URL**: `https://mcstaging2.globewest.com/` (Header across all pages)
* **Single-Line Summary**: *The top utility bar renders showroom booking at 13px (vs Figma 16px) and changes the copy to "Book Showroom Visit" instead of "Book Showroom Appointment".*
* **Steps to Reproduce**:
  1. Inspect the top brown utility bar on desktop.
  2. Inspect the right-hand showroom link computed styles.
* **Expected (Figma Spec - Node 2424-21417)**:
  * Copy: `Book Showroom Appointment`
  * Font Size: **`16px`**
  * Line Height: `160% (25.6px)`
* **Actual (Live Staging)**:
  * Copy: `Book Showroom Visit` (Copy altered)
  * Font Size: **`13px`** (-3px smaller than Figma)
  * Line Height: `18px`
* **Evidence**: [COMPARISON_06_HEADER_UTILITY_BAR.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/individual_comparisons/COMPARISON_06_HEADER_UTILITY_BAR.png)

---

### DEF-07: Product Cards Missing Wishlist Heart & Australian Spelling on Badges
* **Severity**: 🔴 **High**
* **Page / URL**: `https://mcstaging2.globewest.com/indoor` (All PLP Category Grids)
* **Single-Line Summary**: *Category product cards are missing the Wishlist heart icon on the top right, badges use Australian spelling "Customisable" instead of US "Customize", and compare checkbox sits flush at 0px.*
* **Steps to Reproduce**:
  1. Navigate to `/indoor` or any category page.
  2. Inspect the top-right corner of each product card.
  3. Inspect the badge copy under the image.
* **Expected (Figma Spec - Node 2316-12739)**:
  * Wishlist Heart: Heart icon `♡` pinned in the top-right corner opposite to `Compare`.
  * Compare Inset: `[ ] Compare` checkbox has 12px–16px inset breathing room from image corners.
  * Badge Copy: `Customize` (US spelling with 'z').
* **Actual (Live Staging)**:
  * Wishlist Heart: **Completely MISSING** on product cards.
  * Compare Inset: Sits flush at `0px` against the container boundary.
  * Badge Copy: `Customisable` (Australian spelling with 's').
* **Evidence**: [COMPARISON_07_PLP_CARD_AND_COMPARE.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/individual_comparisons/COMPARISON_07_PLP_CARD_AND_COMPARE.png)

---

### DEF-08: Product Cards Display Generic "GW Coming Soon" Placeholder Graphics
* **Severity**: ⚠️ **P2 - Medium (Asset Synchronization)**
* **Page / URL**: `https://mcstaging2.globewest.com/indoor`, `/outdoor`
* **Single-Line Summary**: *Category product cards render generic gray "GW Image Coming Soon" placeholder graphics (230118_Image-Coming-Soon-2_1100x1100_1.jpg) instead of live product photography.*
* **Steps to Reproduce**:
  1. Navigate to `/indoor` or `/outdoor`.
  2. Inspect product card image `src` attributes.
* **Expected (Figma Spec)**: High-resolution lifestyle product photography.
* **Actual (Live Staging)**: Product card `src` renders `.../230118_Image-Coming-Soon-2_1100x1100_1.jpg`. NetSuite catalog synchronization required.
* **Evidence**: [02_LIVE_PRODUCT_CARD_CLOSEUP.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/micro_ui_audit/02_LIVE_PRODUCT_CARD_CLOSEUP.png)
