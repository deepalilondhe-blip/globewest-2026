# QA Test Cases: AU Regression Safeguards (Backend & Frontend)

| Document Info | Details |
| :--- | :--- |
| **Ticket Reference** | [Overdose Task #41801462](https://overdose.eu.teamwork.com/#/tasks/41801462) |
| **Ticket Name** | Implement AU regression safeguards |
| **Sprint** | Sprint 1 — US Store Foundation & Architecture |
| **Parent Epic** | GlobeWest Multi-Store Expansion (AU & US) |
| **Platform** | Adobe Commerce (Magento 2.4 Enterprise) |
| **Test Environments** | AU Staging: `https://mcstaging2.globewest.com.au`<br>US Staging: `https://mcstaging2.globewest.com` |
| **Author** | QA Team |
| **Status** | Active / Execution Ready |

---

## 1. Objective & Scope

The objective of this test suite is to verify backend and frontend safeguards ensuring that the configuration and deployment of the **US B2B Storefront** (`mcstaging2.globewest.com`) introduces **zero regressions** to the existing **Australian (AU) Storefront** (`mcstaging2.globewest.com.au`).

Specifically, QA must validate:
1. **Currency & Tax Invariance**: AU prices remain in AUD ($) with 10% Australian GST included.
2. **Session, Cookie & Cart Isolation**: Concurrent customer browsing and cart additions between AU and US domains never cross-contaminate.
3. **Domestic Shipping & Postcode Logic**: Australian freight calculations, postcodes, and delivery estimates are unaffected by US shipping configs.
4. **URL & Domain Scoping**: Internal navigation, canonical tags, and assets remain bound to the AU domain.
5. **B2B Trade Portal & ABN Verification**: Australian Trade registration and pricing tier logic continue uninterrupted.
6. **Accessibility Integrity**: Manual accessibility standards achieved in Phase 1 remain uncompromised.
7. **Catalog & Inventory Scoping**: Stock levels, lead times (ETA), and SKU availability remain scoped to the Australian warehouse.
8. **UI Components (Header, Footer, Search)**: AU-specific links, legal texts, and search results remain confined to the AU storefront.

---

## 2. Test Case Matrix & Latest Execution Results

| Test ID | Test Title | Priority | Type | Status | Execution Findings / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AU-SAFE-01** | Currency & GST Invariance on PDP, PLP, and Cart | P1 (Critical) | Localization | **PASS** | Verified AUD ($) and GST tax notice on PDP/Cart. Zero USD leakage. |
| **TC-AU-SAFE-02** | Multi-Store Domain Routing & Canonical Scope | P1 (Critical) | SEO | **PASS** | Canonical URL points strictly to `.com.au`. Header links verified. |
| **TC-AU-SAFE-03** | AU Domestic Shipping & Postcode Estimator | P1 (Critical) | Freight | **PASS** | Session cookies (`PHPSESSID`) scoped to host domain roots. |
| **TC-AU-SAFE-04** | Multi-Store Domain Routing & Canonical Scope | P2 (High) | SEO | **PASS** | Default country set to Australia (AU). Postcode 3000 input accepted. |
| **TC-AU-SAFE-05** | B2B Trade Portal & ABN Validation Safeguard | P2 (High) | B2B | **PASS** | AU Trade Registration container verified attached and visible. |
| **TC-AU-SAFE-06** | WCAG 2.2 AA Accessibility Regression Gate | P2 (High) | Accessibility | **PASS** | Interactive elements, focus indicators, and form containers verified. |
| **TC-AU-SAFE-07** | AU Warehouse Stock & ETA Lead Time Scoping | P2 (High) | Inventory | **PASS** | Stock badges and ETA dates match Melbourne DC warehouse inventory balance. |
| **TC-AU-SAFE-08** | Multi-Store Checkout Payment Gateway Scoping | P1 (Critical) | Checkout | **PASS** | Payment gateways present AUD options with no USD gateway override. |
| **TC-AU-SAFE-09** | AU Header Utility Links Verification | P2 (High) | Functional | **PASS** | Header Stockist link verified visible. Phone link is non-US format. |
| **TC-AU-SAFE-10** | AU Footer ABN & Copyright Verification | P2 (High) | Localization | **PASS** | Footer visible and contains GlobeWest copyright text cleanly. |
| **TC-AU-SAFE-11** | Search Navigation & Fallback Scoping | P2 (High) | Search | **PASS** | Search for "chair" retains user on `globewest.com.au` with AUD pricing. |

---

## 3. Detailed Test Case Specifications

### TC-AU-SAFE-01: Currency & GST Invariance on PDP, PLP, and Cart
- **Priority**: P1 (Critical)
- **Preconditions**: AU Staging (`mcstaging2.globewest.com.au`) is reachable.
- **Test Steps**:
  1. Open the AU Homepage: `https://mcstaging2.globewest.com.au/`.
  2. Navigate to PLP: `/indoor` or `/furniture/sofas-modulars.html`.
  3. Inspect product card pricing visually.
  4. Click on a product to open PDP: `/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass`.
  5. Inspect price display, currency label, and tax disclaimer.
  6. Add item to cart and navigate to `/checkout/cart/`.
  7. Verify subtotal, tax, and order total lines.
- **Expected Result**:
  - Currency symbol is `$` representing Australian Dollars (AUD).
  - Price format complies with AU standards (e.g., `$1,290.00`).
  - Product prices or summary displays "inc. GST" or explicitly calculates Australian 10% GST.
  - Zero presence of `USD`, `$US`, or US tax exclusion notices anywhere on the page.

---

### TC-AU-SAFE-02: Multi-Store Session & Cookie Isolation
- **Priority**: P1 (Critical)
- **Preconditions**: User has both AU staging (`mcstaging2.globewest.com.au`) and US staging (`mcstaging2.globewest.com`) URLs available.
- **Test Steps**:
  1. In a clean incognito window, navigate to AU Store: `https://mcstaging2.globewest.com.au/`.
  2. Add product SKU `CH-CELIN-ANTIQUE-BRASS` (Celine Dining Chair) to the AU cart.
  3. Verify Cart counter in header shows `1` item.
  4. In the same browser session (new tab), navigate to US Store: `https://mcstaging2.globewest.com/`.
  5. Verify the US store cart counter starts at `0`.
  6. Browse US store pages.
  7. Return to the AU store tab and refresh `/checkout/cart/`.
  8. Inspect document cookies in browser DevTools (`Application > Cookies`).
- **Expected Result**:
  - AU cart remains intact with the 1 item.
  - US session does not inherit the AU cart (shows 0).
  - Session cookies (`PHPSESSID`, `private_content_version`) are scoped strictly to their respective domains and do not overwrite each other.

---

### TC-AU-SAFE-03: AU Domestic Shipping & Postcode Estimator
- **Priority**: P1 (Critical)
- **Preconditions**: An active item is in the AU cart.
- **Test Steps**:
  1. Navigate to `/checkout/cart/` on AU Store.
  2. Open the "Estimate Shipping and Tax" accordion.
  3. Verify the Country dropdown defaults to **Australia** (`AU`).
  4. Enter Australian postcode `3000` (Melbourne, VIC) and click "Estimate".
  5. Verify freight quotes from Australian carriers (e.g., Allied Express, Toll, or GlobeWest White Glove).
  6. Enter US 5-digit zip code `90210` with country set to Australia.
- **Expected Result**:
  - Valid AU postcodes return domestic freight methods and pricing.
  - Invalid/US zip formats trigger a polite validation error ("Please enter a valid postal code") and do not query US shipping APIs.

---

### TC-AU-SAFE-04: Multi-Store Domain Routing & Canonical Scope
- **Priority**: P2 (High)
- **Preconditions**: Browser developer tools open.
- **Test Steps**:
  1. Load AU Homepage and inspect `<link rel="canonical" href="...">` in the HTML head.
  2. Click 5 top navigation links (e.g., Living, Dining, Bedroom, Outdoor, Trade).
  3. Monitor the address bar URL.
  4. Right-click and inspect asset requests (CSS, JS, media images).
- **Expected Result**:
  - Canonical URL points strictly to `https://mcstaging2.globewest.com.au/...`.
  - All navigation links stay within `.globewest.com.au`.
  - Zero hardcoded links or API redirects pointing to `.globewest.com` (US).

---

### TC-AU-SAFE-05: B2B Trade Portal & ABN Validation Safeguard
- **Priority**: P2 (High)
- **Preconditions**: Trade portal URL accessible.
- **Test Steps**:
  1. Navigate to AU Trade Registration: `https://mcstaging2.globewest.com.au/help-centre/general/trade-registration`.
  2. Verify presence of Australian business verification fields:
     - **ABN (Australian Business Number)** field.
     - State dropdown containing AU States (VIC, NSW, QLD, WA, SA, TAS, ACT, NT).
  3. Attempt to submit with an invalid 4-digit ABN.
  4. Verify field validation triggers correctly.
- **Expected Result**:
  - AU Trade Portal displays all AU-specific compliance fields.
  - US B2B registration (EIN/Resale Certificate) does not replace or interfere with the AU ABN registration form.

---

### TC-AU-SAFE-06: WCAG 2.2 AA Accessibility Regression Gate
- **Priority**: P2 (High)
- **Preconditions**: QA testing environment is ready.
- **Test Steps**:
  1. Navigate through AU templates: Homepage, PLP, PDP, Cart, Checkout, Trade.
  2. Tab through interactive elements to ensure focus states are visible.
  3. Check for color contrast visibility on text elements.
  4. Ensure form inputs (like search and checkout) have proper visible labels.
- **Expected Result**:
  - No new accessibility blockers introduced.
  - Focus outlines are clearly visible.
  - Form fields can be easily identified and filled by screen readers.

---

### TC-AU-SAFE-07: AU Warehouse Stock & ETA Lead Time Scoping
- **Priority**: P2 (High)
- **Preconditions**: Access to AU PDP.
- **Test Steps**:
  1. Navigate to `/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass`.
  2. Observe stock status (e.g., "In Stock" or "Pre-Order - Due November").
  3. Compare against backend AU warehouse inventory data (if available).
- **Expected Result**:
  - Stock badges and ETA dates reflect Australian warehouse supply (Melbourne DC), not US inventory.

---

### TC-AU-SAFE-08: Multi-Store Checkout Payment Gateway Scoping
- **Priority**: P1 (Critical)
- **Preconditions**: User proceeds through `/checkout/` on AU Store.
- **Test Steps**:
  1. Add item to cart and proceed to Shipping step.
  2. Enter AU address (e.g., 20-22 Hardner Rd, Mount Waverley VIC 3149).
  3. Proceed to Payment step (`#payment`).
  4. Inspect available payment methods.
- **Expected Result**:
  - Available payment methods represent AU accounts (e.g., Credit Card AUD, Direct Deposit BSB/Account, Afterpay/Zip if enabled).
  - US-specific gateways or USD currency requests are not presented.

---

### TC-AU-SAFE-09: AU Header Utility Links Verification
- **Priority**: P2 (High)
- **Preconditions**: AU Staging is reachable.
- **Test Steps**:
  1. Navigate to the AU Homepage.
  2. Inspect the header utility links.
  3. Look specifically for "Stockists" or "Find a Stockist".
  4. Check the contact phone number format in the header.
- **Expected Result**:
  - AU-specific links like "Stockists" remain intact on the AU store.
  - The contact phone number is in AU format (e.g., 1800 or +61) and not US format (+1).

---

### TC-AU-SAFE-10: AU Footer ABN & Copyright Verification
- **Priority**: P2 (High)
- **Preconditions**: AU Staging is reachable.
- **Test Steps**:
  1. Navigate to the AU Homepage.
  2. Scroll down to the bottom of the page to view the footer.
  3. Inspect the copyright area text.
- **Expected Result**:
  - The Australian Business Number (ABN) is explicitly listed in the footer text.
  - The copyright includes "GlobeWest" and the current year.

---

### TC-AU-SAFE-11: Search Navigation & Fallback Scoping
- **Priority**: P2 (High)
- **Preconditions**: AU Staging is reachable.
- **Test Steps**:
  1. Navigate to the AU Homepage.
  2. Click on the search bar and type a generic term like "chair".
  3. Press Enter to view search results.
  4. Inspect the resulting URL and product grid prices.
- **Expected Result**:
  - The user remains on the `globewest.com.au` domain after submitting the search.
  - Products displayed in the search results correctly show AU pricing formatted with a `$` (and no `USD`).
