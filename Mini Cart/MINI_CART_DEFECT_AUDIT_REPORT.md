# QA Verification & Defect Audit Report: Mini Cart Section

| Document Metadata | Details |
|---|---|
| **Ticket Reference** | P-GLW-007 Globewest US Expansion Project / Front End Development: **Mini Cart** |
| **Ticket Goal** | Match AU, no redesign required. WCAG 2.2 AA compliance. |
| **Tested Target Storefront** | `https://mcstaging2.globewest.com` (US Storefront) |
| **Baseline Reference Storefront** | `https://mcstaging2.globewest.com.au` (AU Storefront) |
| **Execution Standard** | **Headed Chrome Mode** (`--project=desktop-chrome --headed`) on `DISPLAY=:0` |
| **Tested Viewports** | **Desktop View** (1440x900) & **Mobile View** (390x844 / iPhone 13/14/15) |
| **Visual Highlighting Standard**| 🟢 **Simple Solid Green**: Verified Working Functionality / AU Parity<br>🔴 **Red Outline & Badge**: Confirmed Defects / Parity Gaps |
| **Audit Status** | **8 Features Verified Working Fine (PASS 🟢)** \| **2 Specific Defects / Parity Gaps (🔴)** |

---

## Executive Summary of Findings

Following the instruction to test the **Mini Cart** in **Headed Mode** across both **Desktop** and **Mobile** viewports:

1. **Desktop View (1440x900) — Working Fine 🟢**:
   - **Header Trigger & Counter**: Cart icon is visible with live item counter badge (e.g. `16 items`).
   - **Populated Slideout Drawer**: Slides open cleanly.
   - **Item Details**: Displays product thumbnail image, hyperlinked title, SKU, unit price (`$5,500.00`), quantity input, and remove item action.
   - **Totals & Subtotal**: Subtotal displays accurately (`Subtotal $29,194.00`) without Australian "GST" tax line leakage.
   - **Action CTAs**: `[VIEW AND EDIT CART]` routes to `/checkout/cart/`; `[PROCEED TO CHECKOUT]` CTA is active.
   - **Empty State Behavior**: Clicking the header cart icon when empty routes to `/checkout/cart/`, matching AU baseline behavior 100%.

2. **Mobile View (390x844) — Working Fine 🟢**:
   - **Header Trigger**: Mobile cart bag icon is clearly visible and tapable in the mobile header bar.
   - **Responsive Drawer Fit**: The slideout drawer width measures **335px** on the 390px mobile viewport, leaving a 55px backdrop overlay on the left. It fits cleanly without horizontal scrolling or viewport overflow.
   - **Mobile Product Card**: Product thumbnail, title, price, and quantity controls render responsively in a stacked mobile card layout.
   - **Mobile CTAs**: `[PROCEED TO CHECKOUT]` and `[VIEW AND EDIT CART]` buttons are tapable and prominent.

3. **Confirmed Defects / Parity Gaps (🔴)**:
   - **Defect 1 (P2 - Parity Gap)**: **Header Wishlist Utility Icon Missing**: AU storefront features a Wishlist heart icon next to the Mini Cart trigger in the top utility header. On US staging, this icon is absent.
   - **Defect 2 (P2 - Accessibility / WCAG 2.2 AA)**: **Mobile Close Button Touch Target Size**: The close button ("X") in the mobile drawer has a narrow interactive bounding box (`16.5px × 1px`), which does not meet the recommended WCAG 2.2 AA target size of 24×24px / 44×44px.

---

## Detailed Test Execution Matrix

| Test ID | Viewport | Component / Feature | Test Description | Expected Result (AU Baseline) | Actual Result (US Live) | Status | Evidence Screenshot |
|---|---|---|---|---|---|---|---|
| **TC-MC-01** | Desktop (1440px) | Header Mini-Cart Trigger | Locate cart bag icon in header | Present in header with live counter | Visible, active, counter updates dynamically | PASS 🟢 | [`01_Desktop_Header_Cart_Trigger_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/01_Desktop_Header_Cart_Trigger_PASS.png) |
| **TC-MC-02** | Desktop (1440px) | Empty State Cart Trigger Action | Click cart trigger when cart is empty | Navigates directly to `/checkout/cart/` | Navigates to `/checkout/cart/` with empty hero layout | PASS 🟢 | [`02_Desktop_Empty_Cart_Page_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/02_Desktop_Empty_Cart_Page_PASS.png) |
| **TC-MC-03** | Desktop (1440px) | Trade Purchasing & Counter Update | Add in-stock product to cart as Trade customer | Adds item and updates header badge | Item added; header badge updates to reflect cart count | PASS 🟢 | [`04_Desktop_Cart_Counter_Badge_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/04_Desktop_Cart_Counter_Badge_PASS.png) |
| **TC-MC-04** | Desktop (1440px) | Populated Slideout Drawer Display | Click cart trigger with items in cart | Slideout drawer displays with items list | Populated drawer opens cleanly with item card | PASS 🟢 | [`05_Desktop_Populated_MiniCart_Drawer_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/05_Desktop_Populated_MiniCart_Drawer_PASS.png) |
| **TC-MC-05** | Desktop (1440px) | Item Row: Thumbnail, Title, SKU | Inspect product card inside drawer | Shows thumbnail, title, SKU details | Renders product thumbnail, title, and SKU | PASS 🟢 | [`06_Desktop_MiniCart_Item_Row_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/06_Desktop_MiniCart_Item_Row_PASS.png) |
| **TC-MC-06** | Desktop (1440px) | Price Visibility in Drawer | Inspect unit price display in drawer | Displays USD price (e.g. `$5,500.00`) | Price visible in USD with proper currency symbol | PASS 🟢 | [`07_Desktop_MiniCart_Price_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/07_Desktop_MiniCart_Price_PASS.png) |
| **TC-MC-07** | Desktop (1440px) | Quantity Stepper & Removal | Test quantity input and delete trash icon | Qty adjustable; delete icon removes item | Quantity input and delete action link functional | PASS 🟢 | [`08_Desktop_MiniCart_Qty_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/08_Desktop_MiniCart_Qty_PASS.png) |
| **TC-MC-08** | Desktop (1440px) | Subtotal & Tax Compliance | Inspect subtotal line in drawer | Displays Subtotal without Australian GST | Renders `Subtotal $29,194.00`; no GST leak | PASS 🟢 | [`10_Desktop_MiniCart_Subtotal_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/10_Desktop_MiniCart_Subtotal_PASS.png) |
| **TC-MC-09** | Desktop (1440px) | View Cart & Checkout CTAs | Check [VIEW CART] and [CHECKOUT] buttons | Route to `/checkout/cart/` and `/checkout/` | Both buttons active and correctly targeted | PASS 🟢 | [`11_Desktop_MiniCart_ViewCart_CTA_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/desktop/11_Desktop_MiniCart_ViewCart_CTA_PASS.png) |
| **TC-MC-10** | Mobile (390px) | Mobile Header Cart Trigger | Inspect cart icon on mobile viewport | Visible and accessible on mobile bar | Cart bag icon clearly visible on mobile header | PASS 🟢 | [`02_Mobile_Header_Cart_Trigger_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/mobile/02_Mobile_Header_Cart_Trigger_PASS.png) |
| **TC-MC-11** | Mobile (390px) | Mobile Drawer Sizing & Fit | Tap cart trigger on mobile | Drawer fits viewport with overlay | Drawer width is 335px on 390px screen; no overflow | PASS 🟢 | [`03_Mobile_Drawer_Fit_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/mobile/03_Mobile_Drawer_Fit_PASS.png) |
| **TC-MC-12** | Mobile (390px) | Mobile Product Card & Subtotal | Inspect drawer content on mobile | Stacked layout; readable text and price | Card details and subtotal display cleanly | PASS 🟢 | [`05_Mobile_Item_Card_Layout_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/mobile/05_Mobile_Item_Card_Layout_PASS.png) |
| **TC-MC-13** | Mobile (390px) | Mobile CTAs Usability | Inspect Checkout and View Cart buttons | Full-width or tapable CTAs | Buttons are prominent and easily tapable | PASS 🟢 | [`07_Mobile_Checkout_CTA_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/mobile/07_Mobile_Checkout_CTA_PASS.png) |
| **TC-MC-14** | Header | Wishlist Heart Icon Parity | Inspect header utility area | Wishlist heart icon present next to cart | Absent from US header (Parity gap) | FAIL 🔴 | [`DEFECT_01_US_Header_Missing_Wishlist_Icon_RED.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/defects/DEFECT_01_US_Header_Missing_Wishlist_Icon_RED.png) |
| **TC-MC-15** | Mobile (390px) | Close Button Touch Target Size | Measure touch target size of "X" | Minimum 24x24px / 44x44px (WCAG 2.2 AA) | Bounding box is narrow (16.5px × 1px) | FAIL 🔴 | [`04_Mobile_Close_Button_TouchTarget_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Mini%20Cart/screenshots/mobile/04_Mobile_Close_Button_TouchTarget_PASS.png) |

---

## Defect Details & Recommendations

### Defect 1: Header Wishlist Utility Icon Missing Next to Mini Cart
* **Severity:** P2 - Medium (Parity Gap)
* **Expected (AU Baseline):** On the AU storefront, the header utility navigation features a Wishlist heart icon directly adjacent to the Mini Cart trigger.
* **Actual (US Live):** Only the Login dropdown and Cart icon are displayed; Wishlist heart is absent.
* **Remediation:** Enable the `Magento_Wishlist` header link block in the US header layout XML.

### Defect 2: Mobile Close Button Touch Target Size (WCAG 2.2 AA)
* **Severity:** P2 - Medium (Accessibility Compliance)
* **Expected (WCAG 2.2 AA Target Size):** Interactive controls must have an accessible touch target of at least 24×24px (or 44×44px for optimal mobile touch ergonomics).
* **Actual (US Live):** The close button (`#btn-minicart-close`) uses pseudo-element styling with an effective bounding height of ~1px, making it difficult for touch-screen users to tap reliably.
* **Remediation:** Add padding or explicit dimensions (`width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;`) to `#btn-minicart-close`.
