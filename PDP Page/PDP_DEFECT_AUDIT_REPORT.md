# QA Verification & Defect Audit Report: Product Detail Page (PDP)

| Document Metadata | Details |
|---|---|
| **Ticket Reference** | P-GLW-007 Globewest US Expansion Project / Front End Development: **Product Detail Page (PDP)** |
| **Assigned Developer** | Vinod Vankar (`@VinodV`) |
| **QA Lead / Reporter** | Deepali Londhe (`@DeepaliL`) |
| **Tested Live URL** | `https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat` |
| **Figma Reference** | [Figma Node 2317-27241](https://www.figma.com/design/oSBa3EMR3gol0vM1tXCdTk/Globewest-USA---External?node-id=2317-27241) (`[FINAL] Designs -> PDP` — `desktop/product/Trade Pricing - ETA` & `Mobile/product/Trade Pricing - ETA`) |
| **Execution Standard** | **Headed Chrome Mode** (`DISPLAY=:0`) across **Desktop (1440×900)** and **Mobile (390×844 / iPhone 14/15)** |
| **Visual Highlighting Standard**| 🟢 **Simple Clean Green Outline**: Verified Features Matching Figma Spec<br>🔴 **Simple Clean Red Outline**: Confirmed Defects against Figma Spec<br>*(Strict Standard: 100% Real Browser Screenshots; Zero Artificial Text or Stickers Burned onto Images)* |
| **Audit Status** | **6 Features Verified (PASS 🟢)** \| **6 Confirmed Defects Identified (FAIL 🔴)** |

---

## 1. Verified Defect Catalog (Live vs Figma Specifications)

### Defect 1: Unapproved Floating Social Share Widget (Pinterest & AddToAny) Cluttering UI
* **Severity:** P2 - Medium (UI Fidelity & Design Deviation)
* **Component:** Global PDP Overlay / `mp_social_share_float` (`.a2a_kit`)
* **Figma Specification:** The Figma design features a clean, minimal editorial aesthetic with no floating third-party social share bars.
* **Live Staging Actual:** A persistent floating social share widget containing a red Pinterest icon and a blue AddToAny "+" icon (`.mp_social_share_float`) is anchored to the bottom-right corner of the viewport (`x: 1392px, y: 812px`), overlaying page content and creating visual clutter.
* **Evidence Screenshot:** [`DEFECT_01_FLOATING_SOCIAL_SHARE_WIDGET.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/defects/DEFECT_01_FLOATING_SOCIAL_SHARE_WIDGET.png)
* **Remediation:** Disable the floating social share widget module (`Mageplaza_SocialShare` / AddToAny) on the US storefront view, or configure it to match the subtle inline placement if required.

---

### Defect 2: Secondary `[ADD TO QUOTE]` CTA Button
* **Status:** 🟢 **RESOLVED / DEPLOYED BY DEVELOPER (Re-tested & Verified)**
* **Severity (Prior):** P1 - High (Core B2B Feature Parity)
* **Component:** Product Add-To-Cart Form / Action Buttons Container (`.box-tocart` / `.netsuite-add-to-quote`)
* **Figma Specification:** Directly underneath the primary `[Add to cart]` button, the Figma design explicitly renders a full-width secondary button: **`[ADD TO QUOTE]`**.
* **Live Staging Verified (Post-Deployment):** The secondary `[ADD TO QUOTE]` button is now successfully rendered on the live staging storefront directly below `[ADD TO CART]`. 
  - Rendered element: `button.action.secondary.toquote` with border `1px solid rgb(56, 28, 18)` and width `400px` (desktop) / `100%` (mobile).
  - *Minor Micro-UI note:* The live button label includes a leading chevron (`>ADD TO QUOTE`), whereas Figma displays clean `ADD TO QUOTE`.
* **Evidence Screenshot:** [`09_Desktop_AddToQuote_Button_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/desktop/09_Desktop_AddToQuote_Button_PASS.png)

---

### Defect 3: California Proposition 65 Regulatory Warning Box is Missing
* **Severity:** P1 - High (US Regulatory & Legal Compliance)
* **Component:** Product Information Column / Regulatory Disclosures
* **Figma Specification:** Underneath the warranty policy, the Figma design explicitly mandates the California Prop 65 warning box:
  > *"Warning: This product can expose you to chemicals including Di(2-ethylhexyl)phthalate (DEHP), which is known to the State of California to cause cancer and birth defects or other reproductive harm. For more information go to www.P65Warnings.ca.gov"*
* **Live Staging Actual:** The Proposition 65 warning box is completely missing from the live US product detail page.
* **Evidence Screenshot:** [`DEFECT_03_MISSING_CALIFORNIA_PROP65_WARNING.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/defects/DEFECT_03_MISSING_CALIFORNIA_PROP65_WARNING.png)
* **Impact:** Legal non-compliance for selling consumer furniture and decor products in the United States, specifically under California state regulations.
* **Remediation:** Add the Proposition 65 disclosure container to the US theme PDP layout (`catalog_product_view.xml`) positioned underneath the warranty block.

---

### Defect 4: HTML Page `<title>` Meta Tag Leaks "GlobeWest Australia"
* **Severity:** P1 - High (SEO & Store Scope Defect)
* **Component:** Global HTML `<head>` / Page Meta Title
* **Figma Specification:** US Storefront Scope (`GlobeWest USA`).
* **Live Staging Actual:** The live document title tag contains:  
  `<title>Buy Amari Oasis Large Planter - Wheat online - GlobeWest Australia</title>`
* **Evidence Screenshot:** [`DEFECT_01_US_PDP_Meta_Title_Australia_Leak_RED.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/defects/DEFECT_01_US_PDP_Meta_Title_Australia_Leak_RED.png)
* **Impact:** Australian geographic scope leaks into search engine SERP snippets, browser tab titles, and bookmark names on the US storefront.
* **Remediation:** Update Magento store view configuration (`Content -> Design -> Configuration -> HTML Head -> Page Title Suffix`) for the US Store View to replace "GlobeWest Australia" with "GlobeWest USA".

---

### Defect 5: Stock Availability & ETA Mismatch / Positioning on PDP
* **Severity:** P1 - High (B2B Inventory Transparency & Trade Ordering)
* **Assigned Developer:** Vinod Vankar (`@VinodV`)
* **Component:** PDP Right Column / Stock Status & ETA Block (underneath `[ADD TO QUOTE]`)
* **Figma Specification:**
  - Placed directly below the `[ADD TO QUOTE]` button and above the `[Download Brochure]` action link.
  - When in stock: Displays green status dot + inventory count: **`• In Stock (X available)`**, followed by incoming shipment ETA: **`Next Shipment: Y (ETA DD Mon YYYY)`**.
  - When backordered / awaiting stock: Displays warning ETA badge **`ETA DD Mon YYYY (X available)`** + **`Next Shipment: Y (ETA DD Mon YYYY)`** with an inline **`Notify me`** option.
* **Live Staging Actual (mcstaging2):**
  - **Stock availability information is completely missing** (`In Stock (X available)` does not appear).
  - The ETA is displayed in an incorrect standalone badge format (`ETA 10/09/26`) displaced from the Figma hierarchy and lacking shipment details.
* **Remediation:** Align stock availability and ETA components with the approved Figma specifications (`desktop/product/Trade Pricing - ETA`). Ensure NetSuite/Magento inventory integration populates the active in-stock count and future shipment ETA in the designated container directly under the action buttons.

---

### Defect 6: Product Information Footer Tabs & Specification Content Mismatch
* **Severity:** P2 - Medium (Product Content Structure & Layout Fidelity)
* **Assigned Developer:** Vinod Vankar (`@VinodV`)
* **Component:** PDP Lower Section / Product Details & Specifications Tab Bar
* **Figma Specification:**
  - Three distinct horizontal tabs must be rendered:
    1. **`[Specifications]`** (Default active tab)
    2. **`[Brochures & Downloads]`**
    3. **`[Product care]`**
  - Under `Specifications`: Multi-column attribute layout with standardized headers: `PRODUCT`, `SUPPLIED`, `TOP`, `FRAME`, `DIMENSIONS`, `AREA OF USE`.
* **Live Staging Actual (mcstaging2):**
  - Only a single tab (`[Specifications]`) is present. The **`[Brochures & Downloads]`** and **`[Product care]`** tabs are missing entirely.
  - The content under `Specifications` uses unaligned headings (`PRODUCT DETAILS`, `PRODUCT`, `ASSEMBLY TYPE`) and does not follow the Figma column layout.
* **Remediation:** Implement the 3-tab navigation structure (`Specifications`, `Brochures & Downloads`, `Product care`) in `catalog_product_view.xml` and map product attributes to the approved Figma grid layout.

---

## 2. Verified Passing Features Matching Figma Specifications

| Section | Expected in Figma Design | Live US Staging Actual | Status | Evidence Screenshot |
|---|---|---|---|---|
| **Product Title Typography** | Font: `IvyMode`, Weight: `400` Regular, Serif styling | Computed style: `font-family: IvyMode, "Times New Roman", Georgia, serif`, `font-weight: 400` | 🟢 **PASS** | [`02_PASS_PRODUCT_TITLE_TYPOGRAPHY.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/desktop/02_PASS_PRODUCT_TITLE_TYPOGRAPHY.png) |
| **Trade Dual Pricing** | Customer Trade price ($) + MSRP displayed alongside/underneath | Live price box renders: **`$434.50 • MSRP: $902.00`** | 🟢 **PASS** | [`03_PASS_TRADE_DUAL_PRICING.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/desktop/03_PASS_TRADE_DUAL_PRICING.png) |
| **Primary [ADD TO CART]** | Solid rectangular `[Add to cart]` CTA button | Button rendered, active, and adds product to active cart session | 🟢 **PASS** | [`08_Desktop_AddToCart_Button_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/desktop/08_Desktop_AddToCart_Button_PASS.png) |
| **Guest Price Masking** | Wholesale pricing masked; Add to Cart suppressed | Wholesale prices masked; `[REQUEST FREE SWATCHES]` CTA shown | 🟢 **PASS** | [`05_Desktop_Guest_Pricing_Masked_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/desktop/05_Desktop_Guest_Pricing_Masked_PASS.png) |
| **Header Pricing Toggle** | Active toggle in header utility bar (`Trade` vs `MSRP`) | Functional toggle present in top utility bar for trade users | 🟢 **PASS** | [`06_Desktop_Header_Trade_Toggle_PASS.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/desktop/06_Desktop_Header_Trade_Toggle_PASS.png) |
| **Mobile Responsiveness (390px)** | Matches `Mobile/product/Trade Pricing - ETA` frame | Responsive stacked layout; clean fit without horizontal overflow | 🟢 **PASS** | [`01_ORIGINAL_MOBILE_PDP_HERO.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/mobile/01_ORIGINAL_MOBILE_PDP_HERO.png) |

---

## 3. Artifacts Directory Reference

* **Original Figma Canvas Capture**: [PDP Page/figma_crops/FIGMA_CANVAS_ORIGINAL_CLEAN.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/figma_crops/FIGMA_CANVAS_ORIGINAL_CLEAN.png)
* **Desktop Original Screenshots**: [PDP Page/screenshots/desktop/](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/desktop/)
* **Mobile Original Screenshots**: [PDP Page/screenshots/mobile/](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/mobile/)
* **Defects Screenshots**: [PDP Page/screenshots/defects/](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/screenshots/defects/)
* **Test Cases Spreadsheet**:
  - [PDP Page/PDP_TestCases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/PDP_TestCases.xlsx)
  - [PDP Page/PDP_TestCases.csv](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/PDP%20Page/PDP_TestCases.csv)
