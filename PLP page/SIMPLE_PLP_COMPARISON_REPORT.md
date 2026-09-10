# QA PLP Defect Comparison Report: US vs AU Storefront

| Audit Scope | Details |
|---|---|
| **Target Storefront (US)** | `https://mcstaging2.globewest.com/indoor` |
| **Baseline Storefront (AU)** | `https://www.globewest.com.au/indoor` |
| **Color Coding** | **RED** = US Storefront Defect \| **GREEN** = AU Storefront Baseline |

---

## One Combined Comparison Image (All PLP Findings)

![One Combined PLP Defects Comparison](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/ONE_COMBINED_PLP_DEFECTS_COMPARISON.png)

---

## Component 1: Category Header & Breadcrumbs

![PLP Component 1 Title and Breadcrumbs](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_PLP_1_TITLE_BREADCRUMBS.png)

- **US Storefront (RED):** Category title renders as `"Indoor Furniture"` with breadcrumbs staying on the US domain.
- **AU Storefront (GREEN):** Category title renders as `"Indoor Furniture"` with matching category hierarchy.
- **Result:** **MATCH** — Category title and breadcrumb navigation match 100% with zero Australian domain leakage.

---

## Component 2: Layered Navigation Filter Facets

![PLP Component 2 Filter Toolbar and Facets](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_PLP_2_FILTERS.png)

- **US Storefront (RED):** Filter toolbar renders **38 filter facets** (e.g., Brand, Height, Room, Depth).
- **AU Storefront (GREEN):** Filter toolbar renders **50 filter facets** on the live catalog.
- **Defect Explanation:** US catalog is missing 12 filter facets compared to the AU catalog baseline, restricting product filtering capabilities for US shoppers.

---

## Component 3: Product Cards & Scope Routing

![PLP Component 3 Product Cards and Routing](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_PLP_3_PRODUCT_CARD_ROUTING.png)

- **US Storefront (RED):** Product grid renders 48 product cards with all links routing strictly to `https://mcstaging2.globewest.com/...`.
- **AU Storefront (GREEN):** Product grid renders 48 product cards routing within the AU catalog.
- **Result:** **MATCH** — All product cards route to US PDPs with 0 scope leaks to the Australian domain.

---

## Component 4: Pricing & Currency Masking

![PLP Component 4 Pricing and Currency](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_PLP_4_PRICING_CURRENCY.png)

- **US Storefront (RED):** Wholesale prices are suppressed for non-logged-in guest sessions (`Trade Login Required / Unpriced`).
- **AU Storefront (GREEN):** Wholesale prices are similarly suppressed for guest sessions (`Trade Login Required / Unpriced`).
- **Result:** **MATCH** — B2B trade price masking functions identically across storefronts.

---

## Component 5: Bottom Category Editorial SEO Text

![PLP Component 5 Bottom Category SEO Text](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_PLP_5_SEO_TEXT.png)

- **US Storefront (RED):** Displays unreplaced dummy placeholder copy: `"Sofas SEO Text to go here"` and `"Lorem ipsum dolor sit amet..."`.
- **AU Storefront (GREEN):** Displays clean layout with zero unreplaced placeholder text.
- **Defect Explanation:** US storefront contains unreplaced placeholder text `"Sofas SEO Text to go here"` (Lorem Ipsum) pending production copy.

---

## Summary Matrix

| Component | US Storefront (`mcstaging2.globewest.com`) | AU Baseline (`globewest.com.au`) | Status |
|---|---|---|---|
| **1. Category Title & Breadcrumbs** | "Indoor Furniture" (0 AU leaks) | "Indoor Furniture" | **MATCH** |
| **2. Category Hero Banner** | Present | Present | **MATCH** |
| **3. Filter Facets** | 38 facets | 50 facets | **MISMATCH (12 Missing Facets)** |
| **4. Sort Dropdown** | Functional | Functional | **MATCH** |
| **5. Product Card Links** | 48 cards (0 AU leaks) | 48 cards | **MATCH** |
| **6. Pricing & Currency** | Trade Login / Unpriced | Trade Login / Unpriced | **MATCH** |
| **7. Swatches Parity** | 0 swatches (dynamic hover) | 0 swatches (dynamic hover) | **MATCH** |
| **8. Pagination & Navigation** | Present (Page 1 of 90) | Infinite Scroll / Single Page | **MISMATCH** |
| **9. Bottom SEO Content Block** | Dummy `"Sofas SEO Text to go here"` | Clean / None | **DEFECT (Unreplaced Placeholder)** |
