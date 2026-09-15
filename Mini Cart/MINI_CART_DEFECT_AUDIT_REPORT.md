# QA Comprehensive Defect Audit Report: Mini Cart Section Parity

## Executive Summary

| Attribute | Details |
|---|---|
| **Ticket Goal** | Match AU, no redesign required. Validate Mini Cart slide-out drawer parity between US and AU staging. |
| **US Staging URL** | `https://mcstaging2.globewest.com` (Target Storefront - RED) |
| **AU Staging URL** | `https://mcstaging2.globewest.com.au` (Baseline Storefront - GREEN) |
| **Testing Mode** | Headed Chrome (`channel: 'chrome'`) with interactive visual element highlight badges |
| **Total Test Scenarios** | 10 Scenarios Executed |
| **Pass Count** | 6 Passed (Empty State, Modal Drawer, Dismissal, Mobile Viewport, Checkout routing, Counter binding) |
| **Fail Count** | 4 Defects Identified & Documented |
| **Severity Distribution** | 2 P1 - High (Purchasing Blocker, GST Tax Leak), 2 P2 - Medium (Cross-Sell Domain Leak, Missing Wishlist Icon) |
| **Reports & Deliverables** | Master Comparison Poster, HTML Visual Gallery, Excel Workbook, CSV Test Matrix |

---

## Verified Defect Catalog

### Defect 1: Critical Purchasing Blocker - "Add to Cart" Button Suppressed on US PDP
- **Severity:** P1 - High (Critical Blocker)
- **Component:** PDP Form / Mini Cart Population Pipeline
- **Affected File / Block:** `Magento_Catalog/templates/product/view/addtocart.phtml`
- **Side-by-Side Comparison:** [DEFECT_1_PURCHASING_BLOCKED_MINICART_POPULATION.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/comparison/DEFECT_1_PURCHASING_BLOCKED_MINICART_POPULATION.png)
- **One-Line Description:** 'Add to Cart' button is completely suppressed on US product detail pages, preventing customers from adding products and populating the Mini Cart drawer.
- **Detailed Finding:**
  On the Australian store, in-stock products render an active `#product-addtocart-button` alongside quantity inputs, allowing shoppers to add items and immediately trigger the populated Mini Cart slide-out drawer. On the US store, `#product-addtocart-button` count is 0 across product detail pages, completely blocking organic cart population and checkout progression.
- **Root Cause:**
  The US product catalog inventory source or website stock channel configuration in Magento 2 is either unassigned or product salability is disabled for the US website scope (`is_salable = 0`).
- **Remediation:**
  Verify US Store inventory stock assignment (`Stores -> Inventory -> Stocks`) and enable product salability/pricing rules for the US website scope so that `#product-addtocart-button` renders properly.

---

### Defect 2: Australian "GST" Tax Line Leaking in US Mini Cart Subtotal Template
- **Severity:** P1 - High (Tax Compliance)
- **Component:** Mini Cart Subtotal Knockout Template
- **Affected File / Block:** `Magento_Checkout/template/minicart/subtotal.html` & `subtotal.min.js`
- **Side-by-Side Comparison:** [DEFECT_2_AUSTRALIAN_GST_TAX_LEAK_IN_MINICART.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/comparison/DEFECT_2_AUSTRALIAN_GST_TAX_LEAK_IN_MINICART.png)
- **One-Line Description:** US Mini Cart subtotal template hardcodes Australian 'GST' tax line (`<div class="gst"><span data-bind="i18n: 'GST'">`), violating US tax compliance requirements.
- **Detailed Finding:**
  The US theme directly copied the Australian theme's `subtotal.html` template without localization:
  ```html
  <div class="gst">
      <span class="label" data-bind="i18n: 'GST'"></span>
      <div class="amount" data-bind="html: gst"></div>
  </div>
  ```
  In the United States, GST does not exist. Taxes are levied as state/local "Sales Tax" or dynamically estimated at checkout based on the customer's delivery ZIP code.
- **Remediation:**
  Update `Magento_Checkout/template/minicart/subtotal.html` in the US child theme to replace the hardcoded "GST" markup with standard US tax labeling: "Estimated Sales Tax" or omit the tax breakdown line until the shipping address is calculated at checkout.

---

### Defect 3: Mini Cart Cross-Sell Recommendations Route to Australian Domain
- **Severity:** P2 - Medium
- **Component:** Mini Cart "You May Also Like" Recommendation Carousel
- **Affected File / Block:** `Magento_Checkout/template/minicart/content.html` / `relationship-product.html`
- **Side-by-Side Comparison:** [DEFECT_3_CROSS_SELL_AU_DOMAIN_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/comparison/DEFECT_3_CROSS_SELL_AU_DOMAIN_LEAK.png)
- **One-Line Description:** Cross-sell recommendation cards inside the Mini Cart drawer link to Australian domain (`https://mcstaging.globewest.com.au`), leaking US buyers to the AU catalog.
- **Detailed Finding:**
  When recommended products render inside the Mini Cart drawer carousel, the item cards link to the Australian staging domain:
  `https://mcstaging.globewest.com.au/madrid-madrid-loft-copeland-olive`
  Clicking these recommendations causes US customers to exit the US store scope and enter the AU storefront with AUD pricing.
- **Remediation:**
  Ensure the cross-sell block uses relative store URLs (`getUrl()`) or dynamically resolves against the current store scope's base URL (`mcstaging2.globewest.com`).

---

### Defect 4: Wishlist Heart Icon Missing from Header Next to Mini Cart Trigger
- **Severity:** P2 - Medium
- **Component:** Header Utility Navigation
- **Affected File / Block:** `Magento_Theme/templates/html/header.phtml` / `Magento_Wishlist/layout/default.xml`
- **Side-by-Side Comparison:** [DEFECT_4_MISSING_CART_UTILITY_IN_HEADER.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/comparison/DEFECT_4_MISSING_CART_UTILITY_IN_HEADER.png)
- **One-Line Description:** Wishlist heart icon is absent from the US header utility area next to the Mini Cart trigger icon, creating a feature parity gap with AU.
- **Detailed Finding:**
  On AU, the top header utility area includes a Wishlist heart icon with item counter badge directly adjacent to the Mini Cart icon (`.wishlist-link`). On the US storefront, only the Login dropdown and Cart bag icon are present.
- **Remediation:**
  Enable `Magento_Wishlist` in the US store view scope or restore the `<block class="Magento\Wishlist\Block\Link" name="wish-list-link"/>` entry in the US header layout.

---

## Test Execution Matrix Summary

| Test ID | Scenario | Scope | Expected Result | Actual Result | Status | Severity |
|---|---|---|---|---|---|---|
| **TC_MINICART_001** | Add to Cart button availability | PDP / Mini Cart | Button renders, adds item, opens drawer | Button completely suppressed (count = 0) | **FAIL** | P1 - High |
| **TC_MINICART_002** | Mini Cart subtotal tax markup | Subtotal | Sales Tax or calculated at checkout | Hardcoded Australian GST markup | **FAIL** | P1 - High |
| **TC_MINICART_003** | Cross-sell carousel links | Drawer | Routes to US catalog domain | Routes to Australian staging domain | **FAIL** | P2 - Medium |
| **TC_MINICART_004** | Header Wishlist utility icon | Header | Heart icon displayed next to cart | Heart icon missing from header | **FAIL** | P2 - Medium |
| **TC_MINICART_005** | Mini Cart trigger opening | Navigation | Drawer slides out smoothly | Drawer opens cleanly with backdrop | **PASS** | Informational |
| **TC_MINICART_006** | Empty drawer state | Empty State | Shows empty message and styling | Matches AU typography and layout | **PASS** | Informational |
| **TC_MINICART_007** | Drawer close button & dismiss | Interactions | Close button / backdrop dismisses | Smoothly slides closed | **PASS** | Informational |
| **TC_MINICART_008** | Item count badge binding | Trigger | Counter updates dynamically | Knockout binding structure matches AU | **PASS** | Informational |
| **TC_MINICART_009** | Mobile responsive viewport | Mobile 390px | Adapts to mobile screen width | Clean mobile drawer rendering | **PASS** | Informational |
| **TC_MINICART_010** | Checkout CTAs destination | Checkout | Points to US /checkout and /cart | Configured to US checkout routes | **PASS** | Informational |

---

## Deliverables & Artifacts Index

- 🖼️ **One Combined Poster:** [ONE_COMBINED_MINI_CART_DEFECTS_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/comparison/ONE_COMBINED_MINI_CART_DEFECTS_COMPARISON.png)
- 🌐 **Interactive HTML Gallery:** [VIEW_DEFECT_IMAGES.html](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/VIEW_DEFECT_IMAGES.html)
- 📊 **Excel Test Suite:** [Mini_Cart_TestCases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/Mini_Cart_TestCases.xlsx)
- 📄 **CSV Test Suite:** [Mini_Cart_TestCases.csv](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/Mini_Cart_TestCases.csv)
- 📝 **Simple Defect Report:** [SIMPLE_DEFECT_COMPARISON_REPORT.md](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Mini%20Cart/SIMPLE_DEFECT_COMPARISON_REPORT.md)
