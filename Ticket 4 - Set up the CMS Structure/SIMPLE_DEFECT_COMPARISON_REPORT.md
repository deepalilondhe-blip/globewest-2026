# QA Defect Comparison Report: US vs AU Storefront

| Audit Scope | Details |
|---|---|
| **Target** | `https://mcstaging2.globewest.com` (US Storefront) |
| **Baseline** | `https://mcstaging2.globewest.com.au` (AU Storefront) |
| **Color Coding** | **RED** = US Storefront Defect \| **GREEN** = AU Storefront Baseline |

---

## One Combined Comparison Image (All Defects)

![One Combined Defects Comparison](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/ONE_COMBINED_DEFECTS_COMPARISON.png)

---

## Defect 1: Hero Banner CTA Link

![Defect 1 Hero Banner CTA](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_1_HERO_BANNER_CTA.png)

- **US Storefront (RED):** The "Explore Collections" CTA button links to `https://www.globewest.com.au`.
- **AU Storefront (GREEN):** The CTA button links internally within the Australian store.
- **Defect Explanation:** The primary hero banner button on the US storefront incorrectly redirects users to the Australian website instead of keeping them on the US storefront.

---

## Defect 2: Category Carousel Card Links

![Defect 2 Category Carousel](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_2_CATEGORY_CAROUSEL.png)

- **US Storefront (RED):** All 14 category carousel cards link to Australian URLs (`https://www.globewest.com.au/indoor/...`).
- **AU Storefront (GREEN):** Category cards link internally within the Australian catalog.
- **Defect Explanation:** All 14 category cards on the US storefront redirect users to the Australian catalog instead of the US category pages.

---

## Defect 3: Instagram Social Feed

![Defect 3 Instagram Feed](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_3_INSTAGRAM_FEED.png)

- **US Storefront (RED):** The Instagram feed section renders completely blank with no images or header.
- **AU Storefront (GREEN):** The Instagram feed renders an active 4-column social photo grid with the `@Globewest` header.
- **Defect Explanation:** The Instagram feed is not displaying any content on the US storefront, resulting in an empty gap on the page.

---

## Defect 4: SEO Text Content

![Defect 4 SEO Text](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_4_SEO_TEXT.png)

- **US Storefront (RED):** The SEO content block above the footer is completely empty (0 words).
- **AU Storefront (GREEN):** The SEO content block displays 3 full paragraphs of keyword-rich editorial text.
- **Defect Explanation:** The SEO text content block is unpopulated on the US storefront, leaving the space above the footer blank.

---

## Defect 5: Hero Banner CTA Hover Link Leak

![Defect 5 Hero Banner Hover Link Leak](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/simple_defect_reports/DEFECT_5_HERO_BANNER_HOVER.png)

- **US Storefront (RED):** Hovering over "EXPLORE COLLECTIONS" displays `https://www.globewest.com.au` in the browser preview.
- **AU Storefront (GREEN):** Hovering over the banner CTA previews internal Australian store links.
- **Defect Explanation:** Hovering over the Hero Banner CTA button previews and redirects to the Australian live domain instead of staying on the US storefront domain.

---

## Summary Table

| Defect | US Storefront (Red) | AU Storefront (Green) | Defect Explanation |
|---|---|---|---|
| **1. Hero Banner CTA** | Links to `globewest.com.au` | Links within AU store | CTA button incorrectly redirects US users to the Australian website. |
| **2. Category Carousel** | 14 cards link to `.com.au` | Links within AU catalog | All 14 cards redirect US users to the Australian catalog. |
| **3. Instagram Feed** | Completely blank (0 photos) | Live photo feed displayed | Instagram feed displays no photos on the US storefront. |
| **4. SEO Text Block** | Empty container (0 words) | 3 paragraphs displayed | SEO content block is completely empty on the US storefront. |
| **5. Hero Banner Hover Leak** | Hover shows `globewest.com.au` | Hover within AU domain | Hovering on CTA previews and redirects to the Australian live website. |
