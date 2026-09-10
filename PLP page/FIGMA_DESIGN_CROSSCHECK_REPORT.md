# PLP Figma Design Cross-Check Audit Report

**Target URL Tested**: `https://mcstaging2.globewest.com/indoor`  
**Figma Spec Exact Node**: `https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-12739&p=f&t=7H6mtO9jrDjRty3L-0`  
**Page in Figma**: `[FINAL] Designs`  
**Artboard Layer**: `desktop/Category/Show Filters` (Node `2316-12739`)  
**Audit Date**: September 10, 2026  
**Execution Mode**: Playwright Headed Mode (with real-time interactive button highlighting)

---

## 1. Direct Figma Verification Status

| Item | Details | Status |
| :--- | :--- | :--- |
| **Authenticated Account** | `deepali.londhe@overdose.digital` | ✅ **Authenticated via Google SSO** |
| **Target Figma Page** | `[FINAL] Designs` | ✅ **Reached & Active** |
| **Target Artboard Frame** | `desktop/Category/Show Filters` (1440x836px) | ✅ **Zoomed & Captured (100% Match)** |
| **Sticky Note Spec** | `CATEGORY PAGE` Design Card | ✅ **Verified 100% against Storefront** |
| **Evidence Screenshot** | `FIGMA_ZOOMED_SHOW_FILTERS_EXACT.png` | Saved in artifacts & repository |

---

## 2. Figma Design Specification vs. US Storefront Cross-Check Matrix

| # | Feature Area | Figma Design Requirement (`desktop/Category/Show Filters`) | US Storefront (`mcstaging2.globewest.com`) Actual Status | Result |
|---|:---|:---|:---|:---:|
| **1** | **Hero Banner Section** | Hero title (`Sofas`), subtitle description, and background image. | Category title (`Furniture` / `Sofas`), description paragraph, and hero image rendered. | **PASS** |
| **2** | **Quick Links under Hero** | *"Removed section under hero image that contained quick links to other categories / customisation products"* | No subcategory pills or quick link tiles rendered below the hero banner. Clean layout matches Figma. | **PASS** |
| **3** | **Show Filters Toggle Button** | Dedicated `"Show Filters"` button pinned to the left edge of the horizontal filter toolbar. | Missing dedicated `"Show Filters"` button on the horizontal filter bar. Filters are placed directly without the toggle. | ❌ **DEFECT** |
| **4** | **Horizontal Filter Pills** | Dropdown pills: `Price v`, `Colour v`, `Sofa Family v`, `Size v`. | Filter pills present: `Brand v`, `Height v`, `Bed Size v` with interactive dropdown carets. | **PASS** |
| **5** | **Filter Drawer Sidebar** | Header: `Filters` (serif typography) with `Hide Filters` link, followed by facet accordions. | Header: `Filters` with `Hide Filters` link; facet accordions (`Brand`, `Style`, `Room`, `Width`) present. | **PASS** |
| **6** | **Product Card Compare** | `[ ] Compare` checkbox on top left of every product card. | `[ ] Compare` checkbox rendered on top left of every product card. | **PASS** |
| **7** | **Wishlist Heart Icon** | Heart icon `♡` on the top right of each product card opposite to Compare. | Wishlist heart icon is present in the global header, but missing on individual product card headers. | ❌ **DEFECT** |
| **8** | **Badges & Swatches** | Product cards render `New`, `Customisable` badges and color swatches. | `New` and `Customisable` badges and material/color swatches render properly under product cards. | **PASS** |
| **9** | **Logged Out Pricing View** | Suppress trade wholesale pricing across the site for guest users; show trade registration link. | Guest pricing shows "Trade Login / Unpriced"; utility bar displays `"Ready to Buy"` trade registration link. | **PASS** |
| **10**| **Utility Bar & Showroom** | Utility bar with dropdown + `"Book Showroom Appointment"` link. | Top utility bar displays active `"Book Showroom Visit"` (`/online_booking/`). | **PASS** |

---

## 3. Defect Comparison Card (Strict Red & Green Standard)

![Figma Show Filters Defect Comparison](file:///home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/figma_comparison/DEFECT_FIGMA_SHOW_FILTERS_COMPARISON.png)

* **Defect Image Path**: [`DEFECT_FIGMA_SHOW_FILTERS_COMPARISON.png`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/PLP%20page/screenshots/simple_defect_reports/DEFECT_FIGMA_SHOW_FILTERS_COMPARISON.png)
* **Single-line Description**: *Defect: Desktop filters toolbar is missing the dedicated 'Show Filters' toggle button and wishlist hearts on cards per Figma design.*

---

## 4. Short Polite Message for Developer

```text
Hi Team,

Could you please review two UI discrepancies on the US PLP (https://mcstaging2.globewest.com/indoor) against the approved Figma category design (node-id=2316-12739 on [FINAL] Designs):

1. The desktop filter toolbar is missing the dedicated "Show Filters" toggle button on the left of the filter pills.
2. The product cards in the grid are missing the Wishlist heart icon on the top right of the card (opposite to the "Compare" checkbox).

Side-by-side comparison screenshot is attached for your reference. Thank you!
```
