# GlobeWest QA Verification & Defect Audit Report
## Feature: Trade Pricing Toggle (US Storefront vs Approved Spec & Baseline)

---

### 1. Executive Summary & Verification Matrix

An exhaustive, live end-to-end verification of the **Trade Pricing Toggle** feature was executed on the live US Staging Storefront (`https://mcstaging2.globewest.com`) in authenticated and unauthenticated states, across Desktop and Mobile viewports, and cross-checked against the approved specification requirements and AU Baseline (`https://mcstaging2.globewest.com.au`).

| # | Requirement Specification | Expected Behavior | US Staging Live Status | QA Verdict |
|---|---|---|---|---|
| **1** | **General Public / Logged Out** | No pricing shown; price toggle completely hidden from header | Pricing masked 100%; `.price-toggle` suppressed from DOM | 🟢 **PASS** |
| **2** | **Logged-In Trade Customer Default** | Trade wholesale pricing shown by default alongside MSRP | Renders `$638.00 • MSRP: $701.80`; toggle label `Trade` | 🟢 **PASS** |
| **3** | **Showroom Presentation (MSRP Mode)** | Toggle suppresses trade pricing to display MSRP/RRP only | Wholesale price 100% hidden; renders `$701.80 MSRP` | 🟢 **PASS** |
| **4** | **PDP Dual-Pricing & MSRP Toggle** | PDP reflects toggle state dynamically | Trade mode: `$638.00 + MSRP`; MSRP mode: `$701.80 MSRP` | 🟢 **PASS** |
| **5** | **Cart & Checkout Transaction Pricing** | Cart and checkout **always** use trade pricing regardless of toggle | Toggle affects display only; cart strictly bills at wholesale | 🟢 **PASS** |
| **6** | **Mobile Viewport Specification** | Utilise a slide-out triggered by an eye icon (`👁️`) | Eye icon SVG trigger rendered; opens smooth slide-out drawer | 🟢 **PASS** |
| **7** | **SearchSpring Integration Dependency** | Search results coordinated to respect toggle state | `/catalogsearch/result/?q=...` fails to render catalog | 🔴 **DEFECT FLAGGED** |
| **8** | **US Sales Tax Display Rules** | Decision on Tax Inclusive vs Exclusive for RRP/MSRP | Displays prices exclusive of tax by default | ⚠️ **FLAGGED DECISION** |
| **9** | **AU Baseline Parity Safeguard** | Feature isolation to US market | AU baseline has no toggle (`hasToggle: false`) | 🟢 **PASS (Isolated)** |

---

### 2. Live Verification Breakdown

#### A. Guest Logged-Out Browsing State (Margin Security)
- **Tested URL**: `https://mcstaging2.globewest.com/indoor`
- **Result**:
  - Unauthenticated visitors cannot see wholesale trade discounts or MSRP figures.
  - Price toggle (`.price-toggle`) is completely suppressed from the DOM.
  - Add to Cart buttons are suppressed across all category cards.
  - Public CTAs (`"Become a Trade Customer"` and `"Book Showroom Appointment"`) remain active.
- **Evidence**: `comparison/COMPARISON_01_GUEST_VS_TRADE_TOGGLE.png`

#### B. Logged-In Trade Customer Default View
- **Authentication**: `deepali.londhe@overdose.digital` (US Trade Account)
- **Result**:
  - The `.price-toggle` element renders cleanly in the header utility bar.
  - The trigger displays `👁️ Trade ⌵`.
  - The document root receives class `price-view-trade`.
  - Category cards and PDPs display dual pricing:
    - Wholesale discounted price (e.g., `$638.00`)
    - Secondary MSRP indicator (e.g., `MSRP: $701.80`)
    - Stock inventory level (e.g., `In Stock` / `Enquire for ETA`)
- **Evidence**: `comparison/COMPARISON_02_TRADE_MODE_VS_MSRP_MODE_PLP.png`

#### C. Toggle Interaction to MSRP Mode (Showroom Presentation)
- **Trigger**: Click `👁️ Trade ⌵` -> Select `[ MSRP ]`
- **Result**:
  - Trigger updates immediately to `👁️ MSRP ⌵`.
  - Document root receives class `price-view-msrp`.
  - Wholesale trade price (`$638.00`) is **100% suppressed and hidden from the DOM layout**.
  - Only customer-facing retail price (`$701.80 MSRP`) is displayed.
  - Allows sales reps and interior designers to present product options in showroom scenarios without exposing their trade margins.
- **Evidence**: `comparison/COMPARISON_03_PDP_TRADE_VS_MSRP_PRICING.png`

#### D. Cart & Checkout Transaction Pricing Invariance
- **Rule Tested**: *"Cart and checkout always use trade pricing regardless of toggle state - the toggle affects display only, not transaction pricing."*
- **Result**:
  - When browsing in MSRP view (`$701.80 MSRP`), adding an item to cart and viewing `/checkout/cart/` retains wholesale billing rate (`$638.00`).
  - The toggle controls presentation layer styles only and does not tamper with Magento quote/cart item unit prices.
- **Evidence**: `screenshots/08_CART_WITH_ITEM_ACTUAL_PRICING.png`

#### E. Mobile Viewport (Eye Icon & Slide-Out Drawer)
- **Device Tested**: Mobile screen width (390 x 844 px, iPhone 14/15/16)
- **Result**:
  - The header utility area renders an eye icon SVG trigger button.
  - Tapping the eye icon trigger smoothly expands a full slide-out drawer from the side.
  - The drawer contains dedicated selection controls for `Trade` and `MSRP` with an `×` close button.
- **Evidence**: `comparison/COMPARISON_04_MOBILE_EYE_TRIGGER_VS_SLIDEOUT.png`

---

### 3. Defect & Dependency Analysis

#### 🔴 DEFECT-TPT-01: SearchSpring Search Results Page Integration Failure
- **Issue**: Navigating to `/catalogsearch/result/?q=chair` fails to render catalog search results on `mcstaging2.globewest.com`, rendering a blank/fallback container.
- **Spec Impact**: *"SearchSpring must be coordinated to respect the toggle state in search results."*
- **Severity**: P2 (Integration Dependency Blocker).
- **Recommendation**: Ensure the SearchSpring US staging catalog index is synced and SearchSpring template integration hooks into the `.price-view-trade` / `.price-view-msrp` DOM classes.
- **Evidence**: `comparison/COMPARISON_05_SEARCHSPRING_SEARCH_RESULTS_DEFECT.png`

#### ⚠️ FLAGGED DECISION: US Sales Tax Display Rules
- **Spec Note**: *"US tax display rules (whether RRP is shown inclusive or exclusive of tax) require a decision - flagged below."*
- **Current Live Behavior**: US staging displays both Trade wholesale rates and MSRP exclusive of sales tax (e.g., `$638.00` / `$701.80`). Sales tax is computed dynamically at checkout based on destination state/zip code nexus.
- **Action Required**: GlobeWest / Overdose business team sign-off confirming US tax-exclusive standard.

#### ⚠️ CATALOG DEFECT: Placeholder "Coming Soon" Images on US Staging
- **Issue**: Several PDPs (e.g. `Pearce Marble 2 Drawer Nightstand`) render `GW Coming Soon` placeholder imagery instead of NetSuite high-res product photos.
- **Rule 4 Violation**: NetSuite asset sync defect to be addressed by catalog integration team.

---

### 4. Test Case Deliverables Summary

A comprehensive test suite of **17 test cases** has been generated and exported to the ticket directory:
- 📊 **Excel Spreadsheet**: `Sprint-3/Ticket_Trade_Pricing_Toggle/Trade_Pricing_Toggle_Test_Cases.xlsx`
- 📄 **CSV Export**: `Sprint-3/Ticket_Trade_Pricing_Toggle/Trade_Pricing_Toggle_Test_Cases.csv`

---

### 5. Execution Commands (`Trade Pricing Toggle runcommand.txt`)

```text
Ticket Name: Trade Pricing Toggle
Page Name: Trade Pricing Toggle (https://mcstaging2.globewest.com/indoor)

Run command for Desktop View:
npx playwright test tests/ticket-trade-pricing-toggle-audit.spec.js --project=chromium --headed

Run command for Mobile View:
npx playwright test tests/ticket-trade-pricing-toggle-audit.spec.js --project=mobile --headed
```
