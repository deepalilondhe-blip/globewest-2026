# QA Defect Audit Report: Cart Page & Purchasing Flow (Match AU)

| Document Metadata | Details |
|---|---|
| **Ticket Reference** | Cart Page - Parity & Scope Verification (Match AU) |
| **Target Storefront (Tested)** | `https://mcstaging2.globewest.com` (US Storefront - RED) |
| **Baseline Storefront (Reference)** | `https://mcstaging2.globewest.com.au` (AU Storefront - GREEN) |
| **Execution Mode** | Headed Chromium with Live Element Highlighting & DOM Audit |
| **Audit Focus** | **Cart Page (/checkout/cart/), Mini-Cart Drawer, Purchasing Action, Scope Leakage** |
| **Total Defects Identified** | **4 Validated Defects** (1 Critical Purchasing Blocker, 1 Scope Leakage, 2 Parity Gaps) |

---

## Executive Summary of Defects

```
┌────┬─────────────────────────────┬──────────┬─────────────────────────────┬────────────────────────────────────────────────────────┬───────────────┐
│ #  │ Component                   │ Severity │ Defect Type                 │ Key Impact                                             │ Status        │
├────┼─────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────────────────────────────────┼───────────────┤
│ 01 │ PDP Add to Cart Action      │ P1 - High│ Suppressed Purchasing CTA   │ "Add to Cart" button missing; users cannot buy or cart │ 🚨 OPEN DEFECT│
│ 02 │ Cart Content Hub Recs       │ P1 - High│ Low-Res / Domain Leakage    │ Pixelated truck icons + links to AU blog (mcprod...au) │ 🚨 OPEN DEFECT│
│ 03 │ Cart Header Service & Heart │ P2 - Med │ Parity Gap                  │ Top utility "Find a designer" & Wishlist heart missing │ ⚠️ OPEN DEFECT│
│ 04 │ Footer Geographic Scope     │ P2 - Med │ Geographic Scope Leakage    │ "Australian Owned & Run" continent logo on US footer   │ ⚠️ OPEN DEFECT│
└────┴─────────────────────────────┴──────────┴─────────────────────────────┴────────────────────────────────────────────────────────┴───────────────┘
```

---

## Master Comparison Graphic (All 4 Defects Combined)

A unified overview comparing the US Storefront (Red border) vs AU Baseline (Green border):

![Master Defect Overview Graphic](comparison/ONE_COMBINED_CART_DEFECTS_COMPARISON.png)

*Direct image path:* `Cart Page/comparison/ONE_COMBINED_CART_DEFECTS_COMPARISON.png`

---

## 1. 🚨 Defect 1: "Add to Cart" Button Suppressed on US Product Pages (Purchasing Blocked)

![Defect 1 Add to Cart Button Missing](comparison/DEFECT_1_ADD_TO_CART_BUTTON_MISSING_ON_US.png)

*Direct image path:* `Cart Page/comparison/DEFECT_1_ADD_TO_CART_BUTTON_MISSING_ON_US.png`

### Defect Details
- **Component:** Product Detail Page Purchasing Actions (`#product_addtocart_form`)
- **Severity:** 🚨 **P1 — High (Critical Business Blocker)**
- **Test URL:** `https://mcstaging2.globewest.com/felix-fold-3-seater-sofa-windy-grey-sof-fel-fld-3s-windy-grey`

### The Issue:
On the AU baseline storefront, in-stock products render an active **"ADD TO CART"** button alongside the quantity selector and price ($4,135.00), allowing trade and retail customers to add items to their shopping cart.
On the US storefront, while the underlying `#product_addtocart_form` exists in the DOM, the **"Add to Cart" button is completely suppressed** (`buttons: []`), leaving only "REQUEST FREE SWATCHES". As a result, American customers cannot purchase products or populate the shopping cart.

### Recommended Developer Fix:
- Enable the Add to Cart module and catalog purchasing permissions under the **USA Store View / Website Scope**.
- Ensure stock inventory sources and price books are mapped to the US catalog so `#product-addtocart-button` renders properly.

---

## 2. 🚨 Defect 2: Broken Pixelated Truck Icons & Australian Blog Domain Leak in Cart Content Hub

![Defect 2 Cart Content Hub Broken Images and AU Link](comparison/DEFECT_2_CART_CONTENT_HUB_BROKEN_IMAGES_AND_AU_LINK.png)

*Direct image path:* `Cart Page/comparison/DEFECT_2_CART_CONTENT_HUB_BROKEN_IMAGES_AND_AU_LINK.png`

### Defect Details
- **Component:** Cart Page Content Hub Section (`.content-hub-section`)
- **Severity:** 🚨 **P1 — High (Content Quality & Cross-Border Leakage)**
- **Location:** `https://mcstaging2.globewest.com/checkout/cart/` (under "Your Cart Is Empty")

### The Issue:
Below the empty cart container, the "Inspiring Trends & Directions" content block exhibits two major defects:
1. **Broken Low-Resolution Placeholder Images:** In place of clean campaign thumbnails, giant distorted, pixelated black-and-white delivery truck icons are rendered for test blog entries (`DEC 07 - STYLE TIPS: Post testing (Duplicated)` and `test2`).
2. **Australian Blog Domain Leakage:** The **"VIEW ALL ARTICLES"** link points directly to the Australian staging blog: `https://mcprod.globewest.com.au/blog`.

### Recommended Developer Fix:
- Replace dummy "Post testing" blog entries with live US editorial articles and high-resolution lifestyle imagery.
- Correct the "VIEW ALL ARTICLES" URL to point to the US blog path (`/blog`) rather than `globewest.com.au`.

---

## 3. ⚠️ Defect 3: Top Bar "Find a Designer" & Wishlist Heart Icon Missing in Cart Header

![Defect 3 Cart Header Wishlist and Find Designer Missing](comparison/DEFECT_3_CART_HEADER_WISHLIST_AND_FIND_DESIGNER_MISSING.png)

*Direct image path:* `Cart Page/comparison/DEFECT_3_CART_HEADER_WISHLIST_AND_FIND_DESIGNER_MISSING.png`

### Defect Details
- **Component:** Cart Page Header Utilities (`.panel.header` and `.header.content`)
- **Severity:** ⚠️ **P2 — Medium (Header Service Parity Gap)**

### The Issue:
- **Top Utility Bar:** AU displays "Find a designer or stockist" linking to trade referral services. The US cart top bar omits this link entirely.
- **Wishlist Heart Icon:** AU displays the customer Wishlist heart icon immediately between the Login dropdown and the Cart icon. On US, the Wishlist icon is missing.

### Recommended Developer Fix:
Synchronize the header layout on the Cart Page to match the AU baseline by restoring the Wishlist heart icon and trade locator links.

---

## 4. ⚠️ Defect 4: "Australian Owned & Run" Geographic Badge Leaking in US Footer

![Defect 4 Australian Owned Badge Leak](comparison/DEFECT_4_AUSTRALIAN_OWNED_BADGE_LEAK_ON_US.png)

*Direct image path:* `Cart Page/comparison/DEFECT_4_AUSTRALIAN_OWNED_BADGE_LEAK_ON_US.png`

### Defect Details
- **Component:** Storefront Global Footer (`.footer.content`)
- **Severity:** ⚠️ **P2 — Medium (Geographic Scope Discrepancy)**

### The Issue:
The global footer rendered on customer account, registration, and cart pages includes the **"AUSTRALIAN OWNED & RUN"** emblem featuring a silhouette map of the Australian continent.

### Recommended Developer Fix:
Suppress or replace this Australian domestic badge for the US Store View scope with appropriate US brand messaging.

---

## Detailed Test Case Execution Summary

| Test ID | Area | Feature | Status | Severity |
|---|---|---|:---:|:---:|
| **TC-CART-01** | PDP Action | Add to Cart CTA Button | **FAIL** | 🚨 P1 - High |
| **TC-CART-02** | Cart Content Hub | Editorial Recs & Blog Links | **FAIL** | 🚨 P1 - High |
| **TC-CART-03** | Cart Header | "Find a Designer" & Wishlist Icon | **FAIL** | ⚠️ P2 - Med |
| **TC-CART-04** | Global Footer | "Australian Owned & Run" Badge | **FAIL** | ⚠️ P2 - Med |
| **TC-CART-05** | Mini-Cart | Slideout Drawer Interaction | **PASS** | Functional |
| **TC-CART-06** | Empty Cart | Core Hero Card & Catalog CTAs | **PASS** | Functional |
| **TC-CART-07** | Mobile | Responsive Viewport Stacking (390x844) | **PASS** | Functional |
