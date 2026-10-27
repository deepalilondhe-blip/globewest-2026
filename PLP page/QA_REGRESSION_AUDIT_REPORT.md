# Product Listing Page (PLP) — QA Regression & Figma Fidelity Audit Report

**Ticket**: #41794520 / GLW-007 — Category Page (PLP)  
**Target URL**: `https://mcstaging2.globewest.com/indoor`  
**Figma Exact Artboards**: 
- `Globewest USA - External` > `[FINAL] Designs` > Artboard `desktop/Category/Trade Pricing`
- Artboard `desktop/Category/Show Filters` (Node `2316-12739`)
- Official Figma Design Specification Card: `CATEGORY PAGE`  
**Execution Standard**: Headed Chrome Mode (`DISPLAY=:0`) with Dual-Auth Matrix (Public Guest Browsing vs. Logged-In US Trade Customer)  
**Authenticated Credentials**: `deepali.londhe@overdose.digital` / `Deep@123`  

---

## 1. Complete Figma Specification Cross-Check Matrix

| # | Spec Area | Exact Figma Design Requirement | Live US Storefront Actual Status | Verdict |
|---|:---|:---|:---|:---:|
| **1** | **Quick Links Section** | *"Removed section under hero image that contained quick links to other categories / customisation products"* | No subcategory pills/tiles rendered below hero banner. Clean layout matches Figma. | 🟢 **PASS** |
| **2** | **Filters Alignment** | *"Left aligned filters on the page, rather than centred"* | Filter pills (`Brand ⌵`, `Height ⌵`, `Bed Size ⌵`) are pinned to the left edge of the toolbar. | 🟢 **PASS** |
| **3** | **Filter Title** | *"Removed redundant filter title"* | Redundant filter heading above pills removed. Clean horizontal filter bar. | 🟢 **PASS** |
| **4** | **Trade Pricing View** | *"If dropdown shows 'Trade', showcase the customer's trade pricing + MSRP pricing across the site"* | Renders dual pricing: `$580.00 $1,295.00 • MSRP: $638.00` on authenticated product cards. | 🟢 **PASS** |
| **5** | **Trade Mode Toggle** | Header pricing toggle switches between Trade and MSRP views dynamically | Header utility bar displays `👁️ Trade ⌵`, toggles seamlessly to `👁️ MSRP ⌵` and back. | 🟢 **PASS** |
| **6** | **Trade Registration Link** | *"Remove the 'Become a trade customer' link when a user is logged in"* | Removed upon login; replaced by `👁️ Trade ⌵` and `My Account ⌵` menu. | 🟢 **PASS** |
| **7** | **Logged-Out Masking** | Suppress wholesale pricing for public guests; prompt trade registration | Wholesale prices strictly masked; utility bar displays trade registration CTAs. | 🟢 **PASS** |
| **8** | **Stock Availability** | *"Same functionality as current site"* | Displays bulleted stock/lead-time indicator: `• Enquire for ETA` or `• In Stock (X)`. | 🟢 **PASS** |
| **9** | **Badge Placement & Shape** | `[New]` and `[Customisable]` badges positioned **below product photo** inside details above title; rounded pill capsule | Badges render inside details below photo with pill `border-radius: 9999px` (Developer fix verified). | 🟢 **PASS** |
| **10**| **Compare Checkbox** | `[ ] Compare` checkbox on top-left of product card; regular font-weight (`400`) | Rendered at top-left with regular font-weight `400` verified in DevTools. | 🟢 **PASS** |
| **11**| **Card Action (+Save)** | Top-right of product card provides B2B action link | Renders `+Save` link to save items directly to trade projects/boards. | 🟢 **PASS** |
| **12**| **Mobile Utility Bar** | *"Utility bar with the dropdown + Showroom booking link"* | Mobile utility bar renders `👁️ Trade ⌵` dropdown + `Book Showroom`. | 🟢 **PASS** |
| **13**| **Mobile Filter & Grid** | Mobile 2-column grid, "Browse by" filter button, "New Arrivals ⌵" sort | 375x812 iPhone viewport renders 2-column grid and mobile filter drawer cleanly. | 🟢 **PASS** |
| **14**| **Catalog Imagery (NetSuite)**| Real product lifestyle/silhouette photography without placeholders | 8 cards currently display placeholder "GW Coming Soon" images pending NetSuite catalog sync. | ⚠️ **NetSuite Sync Dependency** |

---

## 2. Key Clarifications on Previous QA Questions

### A. "Show Filters" Button Clarification
* **Figma Note Card Wording**: The specification card states:  
  *`- Left aligned filters on the page, rather than centred`*  
  *`- Removed redundant filter title`*
* **Design Intent**: There is **no requirement** to add an extra button called "Show Filters" before the filter pills. The artboard in Figma was simply named *"desktop/Category/Show Filters"* to depict the state where filters are displayed.
* **Status**: **🟢 100% PASS** — Filters are left-aligned, and the redundant filter title has been removed.

### B. Product Card Badges & Compare Placement
* As previously confirmed with developer @VinodV and client @MichelleM:
  * `[New]` and `[Customisable]` badges are placed **below the photo and above the product title** in capsule pill styling.
  * `[ ] Compare` uses **regular font weight (`400`)** on a clean `#FFFFFF` background.
* **Status**: **🟢 100% PASS** — Matches approved Figma artboard `desktop/Category/Trade Pricing`.

---

## 3. Dedicated Terminal Run Commands (Rule 6 Standard)

Per **Rule 6**, the dedicated run commands file is stored at:  
[`PLP Page runcommand.txt`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/PLP%20Page%20runcommand.txt)

```text
Ticket Name: #41794520 - Category Page (PLP)
Page Name: Product Listing Page (https://mcstaging2.globewest.com/indoor)

Run command for Desktop View:
DISPLAY=:0 node "PLP page/scripts/audit_plp_regression_login_headed.js"

Run command for Mobile View:
DISPLAY=:0 node "PLP page/scripts/audit_plp_regression_mobile_headed.js"
```
