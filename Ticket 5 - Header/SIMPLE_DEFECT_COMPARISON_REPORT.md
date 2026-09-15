# QA Defect Comparison Report: US vs AU Storefront Header

| Audit Scope | Details |
|---|---|
| **Ticket Reference** | Ticket 5 - Header & Mega Menu Verification |
| **Target Storefront** | `https://mcstaging2.globewest.com` (US Storefront - RED) |
| **Baseline Storefront** | `https://mcstaging2.globewest.com.au` (AU Storefront - GREEN) |
| **Color Coding** | **RED** = US Storefront Defect \| **GREEN** = AU Storefront Baseline |
| **Comparison Folder** | `Ticket 5 - Header/comparison/` (also accessible via `comparison/` and `Header/comparison/`) |
| **Interactive HTML Gallery** | [VIEW_DEFECT_IMAGES.html](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Ticket%205%20-%20Header/VIEW_DEFECT_IMAGES.html) |

---

## One Combined Comparison Image (All Verified Defects)

A unified vertical comparison poster presenting all verified Header defects side-by-side:

![One Combined Defects Comparison](comparison/ONE_COMBINED_HEADER_DEFECTS_COMPARISON.png)

- 📂 **Click to open file in IDE:** [ONE_COMBINED_HEADER_DEFECTS_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Ticket%205%20-%20Header/comparison/ONE_COMBINED_HEADER_DEFECTS_COMPARISON.png)
- 📍 **Full Path:** `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 5 - Header/comparison/ONE_COMBINED_HEADER_DEFECTS_COMPARISON.png`

---

## Defect 1: Mega Menu Outlet Links Leak to Australian Store

![Defect 1 Mega Menu Outlet AU Leak](comparison/DEFECT_1_MEGA_MENU_OUTLET_AU_LEAK.png)

- 📂 **Click to open file in IDE:** [DEFECT_1_MEGA_MENU_OUTLET_AU_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Ticket%205%20-%20Header/comparison/DEFECT_1_MEGA_MENU_OUTLET_AU_LEAK.png)
- 📍 **Full Path:** `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 5 - Header/comparison/DEFECT_1_MEGA_MENU_OUTLET_AU_LEAK.png`
- **US Storefront (RED):** The "Outlet" link inside the US Mega Menu hardcodes `https://globewestoutlet.com.au/collections/indoor` (along with Outdoor, Homewares, and In Stock outlet links).
- **AU Storefront (GREEN):** The Australian navigation routes internal buyers to domestic catalogs.
- **Defect Explanation:** American customers browsing the US Storefront mega menu who click "Outlet" are leaked directly to the Australian outlet domain (`globewestoutlet.com.au`) showing AUD pricing.

---

## Defect 2: Melbourne Physical Outlet Store Link in Navigation

![Defect 2 Melbourne Outlet Link Leak](comparison/DEFECT_2_MELBOURNE_OUTLET_LINK_LEAK.png)

- 📂 **Click to open file in IDE:** [DEFECT_2_MELBOURNE_OUTLET_LINK_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Ticket%205%20-%20Header/comparison/DEFECT_2_MELBOURNE_OUTLET_LINK_LEAK.png)
- 📍 **Full Path:** `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 5 - Header/comparison/DEFECT_2_MELBOURNE_OUTLET_LINK_LEAK.png`
- **US Storefront (RED):** The US navigation menu contains a hardcoded link to `https://globewestoutlet.com.au/pages/melbourne-outlet-store`.
- **AU Storefront (GREEN):** Links to domestic Australian showroom locations.
- **Defect Explanation:** Australian physical store showroom links have leaked into the US B2B storefront navigation, misdirecting US interior designers to Melbourne, Victoria.

---

## Defect 3: Top Utility Bar "Find a Designer" Missing

![Defect 3 Top Bar Find Designer Missing](comparison/DEFECT_3_TOP_BAR_FIND_DESIGNER_MISSING.png)

- 📂 **Click to open file in IDE:** [DEFECT_3_TOP_BAR_FIND_DESIGNER_MISSING.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Ticket%205%20-%20Header/comparison/DEFECT_3_TOP_BAR_FIND_DESIGNER_MISSING.png)
- 📍 **Full Path:** `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 5 - Header/comparison/DEFECT_3_TOP_BAR_FIND_DESIGNER_MISSING.png`
- **US Storefront (RED):** The top utility bar only displays "Book Showroom Appointment". The "Find a designer or stockist" service links are completely missing.
- **AU Storefront (GREEN):** The top utility bar displays "Find a designer or stockist" linking to `/find-designer-start` and `/locator`.
- **Defect Explanation:** The US storefront top bar fails to provide trade designers with quick access to the US designer referral service (even though `/find-designer-start` exists and returns HTTP 200).

---

## Defect 4: Mega Menu Editorial Promo Banner Mismatch

![Defect 4 Mega Menu Promo Banner Mismatch](comparison/DEFECT_4_MEGA_MENU_PROMO_BANNER_MISMATCH.png)

- 📂 **Click to open file in IDE:** [DEFECT_4_MEGA_MENU_PROMO_BANNER_MISMATCH.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Ticket%205%20-%20Header/comparison/DEFECT_4_MEGA_MENU_PROMO_BANNER_MISMATCH.png)
- 📍 **Full Path:** `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 5 - Header/comparison/DEFECT_4_MEGA_MENU_PROMO_BANNER_MISMATCH.png`
- **US Storefront (RED):** The right column of the US Mega Menu renders an unpopulated "GW Coming Soon" placeholder card.
- **AU Storefront (GREEN):** The AU Mega Menu renders an active editorial campaign banner: "Out Now - Explore Collections 2025 Volume #02".
- **Defect Explanation:** The promotional feature block inside the US Mega Menu is unpopulated, displaying placeholder imagery instead of active marketing campaign content.

---

## Verified Non-Defect (Validated as Correct)

- **Homewares URL Key (`/homewares` vs `/homeware`)**:
  - Live server verification confirmed: `https://mcstaging2.globewest.com/homewares` returns **HTTP 200 (OK)**, while `/homeware` returns **HTTP 404 (Not Found)**.
  - Linking to `/homewares` on the US Storefront is **100% intentional and working as designed**. It has been excluded from defects to prevent false reporting.

---

## Summary Table

| Defect | US Storefront (Red) | AU Storefront (Green) | Defect Explanation | Severity |
|---|---|---|---|:---:|
| **1. Mega Menu Outlet Links** | Links to `globewestoutlet.com.au` | Links to domestic catalog | Outlet link leaks US buyers to Australian domain (4 instances) | **P1 - High** |
| **2. Melbourne Store Link Leak** | Links to Melbourne Outlet page | AU domestic showroom links | Physical Melbourne store link leaked into US site | **P1 - High** |
| **3. Top Bar "Find a Designer"** | Missing / Empty link | "Find a designer or stockist" | Trade service link missing on US top utility bar | **P2 - Medium** |
| **4. Mega Menu Promo Banner** | "GW Coming Soon" placeholder | "Out Now" Live Campaign Banner | Promotional feature block unpopulated on US | **P2 - Medium** |
