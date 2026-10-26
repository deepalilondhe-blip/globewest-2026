# Teamwork QA Verification Reply: Enable Public Browsing Mode

**Task:** Enable Public Browsing Mode  
**Project:** P-GLW-007 Globewest US Expansion Project  
**Target Staging URL:** `https://mcstaging2.globewest.com`  
**Baseline URL:** `https://mcstaging2.globewest.com.au`  
**QA Lead:** Deepali Londhe (`@DeepaliL`)  
**Status:** 🟡 **CONDITIONALLY PASSED (Core Magento Masking Verified; 1 Critical Search Integration Blocker Logged)**

---

### Teamwork Reply Comment

Hi Team,

I have completed the live QA verification for **Enable Public Browsing Mode** against the approved **Specific Views Specification Matrix** and dual-auth requirements across US Staging and AU Baseline:

1. **Specific Views Matrix Verification**:
   - **General public / logged out (PASSED)**: Zero pricing shown. Wholesale & retail prices are 100% masked across PLPs and PDPs (zero dollar signs `$`). Pricing toggle is hidden, and "Add to Cart" buttons are suppressed.
   - **Logged-in trade customer (PASSED)**: Trade pricing displays by default upon login. The header Pricing Toggle (`.price-toggle`) allows switching smoothly to **MSRP mode**, dynamically suppressing the wholesale Trade price and displaying MSRP only for client presentations.
   - **Salesperson View (PASSED)**: Salesperson tier defaults to tier view with round-trip toggle switching to customer-facing MSRP mode supported.
   - **AU Baseline Safeguard (PASSED)**: Australian storefront is 100% unaffected — public guests continue to see retail AUD prices and active Add to Cart.

2. **Pre-Go-Live Regression Test (PASSED with 0 Price Leaks)**:
   - **Direct Cart Bypass (`/checkout/cart`)**: Checkout button hidden, cart empty state secured.
   - **Cross-Category Price Masking (`/outdoor`, `/homewares`, `/in-stock`)**: 100% price suppression across 72+ inspected cards (zero dollar signs `$`, 0 Add to Cart buttons).
   - **Mobile Viewport (390x844)**: Responsive header and PLP price masking intact; toggle strictly hidden.

3. **Logged Defect Observations & Pre-Go-Live Risks**:
   - 🚨 **P1 High Blocker (SearchSpring)**: Catalog search (`?q=chair`, `?q=sofa`) returns **0 products** on the US storefront. Developer requires SearchSpring dashboard access to configure US store view index prior to launch.
   - ⚠️ **P2 Medium (Asset Sync)**: Category product cards display `"Image Coming Soon"` placeholders (`230118_Image-Coming-Soon-2_1100x1100_1.jpg`) instead of live photography. NetSuite catalog sync is needed.
   - ⚠️ **P2 Medium (ETA & Stock Status Logic Discrepancy)**: Live PDP displays generic `Enquire for ETA` only. It omits the available quantity count `(8 available)` and the incoming shipment ETA line (`Next Shipment: 8 (ETA 14 Mar 2027)`) specified in Figma and Alex Pape's Four Hands requirement.

The full 19-test-case validation suite and regression results are exported to:
- `Sprint-3/Ticket_Enable_Public_Browsing_Mode/Enable_Public_Browsing_Mode_Test_Cases.xlsx`
- `Sprint-3/Ticket_Enable_Public_Browsing_Mode/Enable_Public_Browsing_Mode_Test_Cases.csv`

Kind regards,  
Deepali Londhe  
QA Lead
