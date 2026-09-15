# Comprehensive QA Defect Audit Report: Footer Storefront Parity

| Metadata Field | Value |
|---|---|
| **Ticket Reference** | Footer (Match AU - reuses existing AU footer as-is, no redesign required) |
| **Audit Date** | September 11, 2026 |
| **QA Engineer** | Antigravity AI / Deepali |
| **Assigned Developer** | Vinod |
| **Target Storefront (Defect)** | `https://mcstaging2.globewest.com` (US Storefront - **RED**) |
| **Baseline Storefront** | `https://mcstaging2.globewest.com.au` (AU Storefront - **GREEN**) |
| **Test Execution Mode** | Playwright Headed Chrome (`channel: 'chrome'`), Viewports 1400x900 & Mobile 390x844 |
| **Overall Status** | **FAIL** (5 Storefront Defects Verified) |

---

## Executive Summary

The **Footer** component was audited to verify compliance with the requirement: **"Match AU - reuses existing AU footer as-is, no redesign required."**

While the core multi-column grid, responsive accordion behavior on mobile devices (390x844), and standard catalog links (Indoor, Outdoor, Homewares, Living, Dining, etc.) match the AU structure, **5 critical defects** were identified where Australian domain hardcoding, domestic national branding, and outdated legal notices leak into the US storefront:

1. **Defect 1 (P1 - High):** Customer Support column contains a hardcoded link to `https://globewestoutlet.com.au/`, redirecting US trade designers to the domestic Australian secondary clearance store.
2. **Defect 2 (P1 - High):** The Newsletter subscription CTA block hardcodes `https://www.globewest.com.au/subscribe-to-our-database`, misdirecting American newsletter signups to the Australian subscriber database.
3. **Defect 3 (P2 - Medium):** The domestic Australian national emblem featuring the Australian continent map outline and "AUSTRALIAN OWNED & RUN" badge is rendered in the US storefront footer.
4. **Defect 4 (P2 - Medium):** The Pinterest social media icon in Column 1 links to regional Australian URL `https://www.pinterest.com.au/globewest/` instead of the global or US profile (`pinterest.com`).
5. **Defect 5 (P3 - Low):** The bottom legal bar displays an outdated hardcoded copyright string (`© 2023 GlobeWest`) and lacks a dedicated US Privacy Rights / CCPA notice link.

---

## Verified Defects Breakdown

### Defect 1: Customer Support "Shop Outlet" Link Leaking to Australian Outlet Store
- **Severity:** P1 (High)
- **Component:** Column 3: Customer Support
- **Target URL Element:** `footer a[href*="globewestoutlet.com.au"]`
- **Current US Behavior:** Displays "Shop Outlet" pointing to `https://globewestoutlet.com.au/`.
- **AU Baseline Behavior:** Points to domestic AU outlet inventory (valid for Australian users).
- **Impact:** US trade customers looking for outlet deals are redirected to an Australian e-commerce site with AUD pricing and Australian freight restrictions.
- **Expected Fix:** Either remove "Shop Outlet" from the US Customer Support column if no US outlet exists, or configure a US-specific outlet landing page.
- **Comparison Image:** [DEFECT_1_SHOP_OUTLET_AU_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_1_SHOP_OUTLET_AU_LEAK.png)

---

### Defect 2: Newsletter "Subscribe Now." Link Leaking to Australian Database
- **Severity:** P1 (High)
- **Component:** Column 1: Newsletter Subscribe Block
- **Target URL Element:** `footer .newsletter-custom a[href*="subscribe-to-our-database"]`
- **Current US Behavior:** Hyperlink inside "Be the first to know about GlobeWest new collections... Subscribe Now." points to `https://www.globewest.com.au/subscribe-to-our-database`.
- **AU Baseline Behavior:** Routes to Australian database signup form.
- **Impact:** American newsletter subscribers are captured into the Australian marketing list rather than the US Klaviyo/Mailchimp database.
- **Expected Fix:** Update link href to US subscription page/form or relative route `/subscribe`.
- **Comparison Image:** [DEFECT_2_NEWSLETTER_SUBSCRIBE_AU_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_2_NEWSLETTER_SUBSCRIBE_AU_LEAK.png)

---

### Defect 3: "Australian Owned & Run" Geographic Badge Leaking in US Storefront Footer
- **Severity:** P2 (Medium)
- **Component:** Column 1: Bottom Branding Block
- **Target URL Element:** `footer .design-logo-footer img` (`design-logo-footer.png`)
- **Current US Behavior:** Displays Australian continent outline image and "AUSTRALIAN OWNED & RUN" badge on the US storefront.
- **AU Baseline Behavior:** Valid domestic Australian provenance logo.
- **Impact:** Inappropriate geographic marketing for US B2B buyers; displays regional Australian pride badge on the American storefront.
- **Expected Fix:** Replace with global GlobeWest brand logo or hide the domestic Australian emblem on the US website.
- **Comparison Image:** [DEFECT_3_AUSTRALIAN_OWNED_BADGE_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_3_AUSTRALIAN_OWNED_BADGE_LEAK.png)

---

### Defect 4: Pinterest Social Icon Routes to Regional Australian Locale
- **Severity:** P2 (Medium)
- **Component:** Column 1: Social Media Links ("Connect with us")
- **Target URL Element:** `footer .social-links-footer a.pinterest`
- **Current US Behavior:** Points to `https://www.pinterest.com.au/globewest/`.
- **AU Baseline Behavior:** Points to domestic Australian Pinterest URL.
- **Impact:** US users are sent to Australian Pinterest subdomain rather than canonical/global profile.
- **Expected Fix:** Update link href to `https://www.pinterest.com/globewest/`.
- **Comparison Image:** [DEFECT_4_PINTEREST_AU_LOCALE_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_4_PINTEREST_AU_LOCALE_LEAK.png)

---

### Defect 5: Outdated Copyright Year "© 2023 GlobeWest" & Missing US Privacy/CCPA Compliance
- **Severity:** P3 (Low)
- **Component:** Bottom Legal Bar (`.links-footer-bottom`)
- **Target URL Element:** `footer .links-footer-bottom li:first-child`
- **Current US Behavior:** Hardcoded text reads `© 2023 GlobeWest` (3 years outdated); missing California Consumer Privacy Act (CCPA) notice link.
- **AU Baseline Behavior:** Displays `© 2023 GlobeWest Privacy Policy Terms & Conditions`.
- **Impact:** Storefront displays stale copyright date and lacks required US state privacy compliance disclosure.
- **Expected Fix:** 
  1. Make copyright year dynamic (`© 2026 GlobeWest` or `new Date().getFullYear()`).
  2. Add US CCPA / "Do Not Sell or Share My Personal Information" link.
- **Comparison Image:** [DEFECT_5_OUTDATED_COPYRIGHT_2023.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_5_OUTDATED_COPYRIGHT_2023.png)

---

## Full Footer Link Audit Matrix

| Column / Section | Link Label | Target Href (US) | AU Baseline Status | Audit Result |
|---|---|---|---|---|
| **Social Links** | Facebook | `https://www.facebook.com/globewestfurniture/` | Same | **PASS** |
| **Social Links** | Pinterest | `https://www.pinterest.com.au/globewest/` | Same (AU) | **FAIL (Defect 4 - .com.au leak)** |
| **Social Links** | Instagram | `https://www.instagram.com/globewest/` | Same | **PASS** |
| **Social Links** | TikTok | `https://www.tiktok.com/@globewest` | Same | **PASS** |
| **Newsletter** | Subscribe Now. | `https://www.globewest.com.au/subscribe-to-our-database` | Same (AU) | **FAIL (Defect 2 - .com.au leak)** |
| **Showroom** | Book an Appointment | `https://mcstaging2.globewest.com/online-booking` | Valid AU path | **PASS** |
| **Branding** | Australian Owned Emblem | `design-logo-footer.png` | Valid AU badge | **FAIL (Defect 3 - Geo leak)** |
| **Products** | In Stock | `https://mcstaging2.globewest.com/in-stock` | Valid US path | **PASS** |
| **Products** | Indoor | `https://mcstaging2.globewest.com/indoor` | Valid US path | **PASS** |
| **Products** | Living | `https://mcstaging2.globewest.com/indoor/shop-by-room/living-room` | Valid US path | **PASS** |
| **Products** | Dining | `https://mcstaging2.globewest.com/indoor/shop-by-room/dining-room-kitchen` | Valid US path | **PASS** |
| **Products** | Bedroom | `https://mcstaging2.globewest.com/indoor/shop-by-room/bedroom` | Valid US path | **PASS** |
| **Products** | Outdoor Furniture | `https://mcstaging2.globewest.com/outdoor` | Valid US path | **PASS** |
| **Products** | Office & Workspace | `https://mcstaging2.globewest.com/indoor/shop-by-room/home-office-study` | Valid US path | **PASS** |
| **Products** | Homewares | `https://mcstaging2.globewest.com/homewares` | Valid US path | **PASS** |
| **Products** | Lighting | `https://mcstaging2.globewest.com/homeware/lighting` | Valid US path | **PASS** |
| **Products** | Rugs | `https://mcstaging2.globewest.com/homeware/homewares/rugs` | Valid US path | **PASS** |
| **Customer Support** | How to Buy | `https://mcstaging2.globewest.com/how-to-buy` | Valid US path | **PASS** |
| **Customer Support** | Showroom Locations | `https://mcstaging2.globewest.com/contact` | Valid US path | **PASS** |
| **Customer Support** | Trade & Wholesale | `https://mcstaging2.globewest.com/help-centre/general/trade-registration` | Valid US path | **PASS** |
| **Customer Support** | Project & Commercial | `https://mcstaging2.globewest.com/help-centre` | Valid US path | **PASS** |
| **Customer Support** | Find a Stockist | `https://mcstaging2.globewest.com/locator` | Valid US path | **PASS** |
| **Customer Support** | Find a Designer | `https://mcstaging2.globewest.com/find-designer-start` | Valid US path | **PASS** |
| **Customer Support** | Help Centre | `https://mcstaging2.globewest.com/help-centre` | Valid US path | **PASS** |
| **Customer Support** | After Sales Enquiries | `https://mcstaging2.globewest.com/help-centre/after-sales-enquires` | Valid US path | **PASS** |
| **Customer Support** | Contact Us | `https://mcstaging2.globewest.com/contact` | Valid US path | **PASS** |
| **Customer Support** | Product Care | `https://mcstaging2.globewest.com/product-care` | Valid US path | **PASS** |
| **Customer Support** | Shop Outlet | `https://globewestoutlet.com.au/` | Domestic AU store | **FAIL (Defect 1 - .com.au leak)** |
| **Our Brand** | About Us | `https://mcstaging2.globewest.com/about-us` | Valid US path | **PASS** |
| **Our Brand** | Careers | `https://mcstaging2.globewest.com/careers` | Valid US path | **PASS** |
| **Our Brand** | Inspiration & Interviews | `https://mcstaging2.globewest.com/blog` | Valid US path | **PASS** |
| **Our Brand** | Video Library | `https://mcstaging2.globewest.com/video-library` | Valid US path | **PASS** |
| **Our Brand** | Lookbook Library | `https://mcstaging2.globewest.com/lookbook-library` | Valid US path | **PASS** |
| **Our Brand** | Press | `https://mcstaging2.globewest.com/press` | Valid US path | **PASS** |
| **Legal Bar** | Copyright | `© 2023 GlobeWest` | Outdated year | **FAIL (Defect 5 - Stale 2023)** |
| **Legal Bar** | Privacy Policy | `https://mcstaging2.globewest.com/privacy-policy` | Valid US path | **PASS** |
| **Legal Bar** | Terms & Conditions | `https://mcstaging2.globewest.com/terms-and-conditions-page` | Valid US path | **PASS** |

---

## Deliverables & Artifacts Index

- **Master Comparison Image (Vertical):** [ONE_COMBINED_FOOTER_DEFECTS_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/ONE_COMBINED_FOOTER_DEFECTS_COMPARISON.png)
- **Defect 1 Image:** [DEFECT_1_SHOP_OUTLET_AU_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_1_SHOP_OUTLET_AU_LEAK.png)
- **Defect 2 Image:** [DEFECT_2_NEWSLETTER_SUBSCRIBE_AU_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_2_NEWSLETTER_SUBSCRIBE_AU_LEAK.png)
- **Defect 3 Image:** [DEFECT_3_AUSTRALIAN_OWNED_BADGE_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_3_AUSTRALIAN_OWNED_BADGE_LEAK.png)
- **Defect 4 Image:** [DEFECT_4_PINTEREST_AU_LOCALE_LEAK.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_4_PINTEREST_AU_LOCALE_LEAK.png)
- **Defect 5 Image:** [DEFECT_5_OUTDATED_COPYRIGHT_2023.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/comparison/DEFECT_5_OUTDATED_COPYRIGHT_2023.png)
- **Excel Test Suite:** [Footer_TestCases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/Footer_TestCases.xlsx)
- **CSV Test Suite:** [Footer_TestCases.csv](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/Footer_TestCases.csv)
- **Interactive HTML Viewer:** [VIEW_DEFECT_IMAGES.html](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Footer/VIEW_DEFECT_IMAGES.html)
