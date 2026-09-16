






# QA Defect Audit Report: Ticket 4 (US Storefront CMS Structure)

| Document Metadata | Details |
|---|---|
| **Ticket Reference** | Ticket 4 - Set up the CMS Structure (USA Storefront) |
| **Tested Environment (Target)** | `https://mcstaging2.globewest.com` (US Storefront) |
| **Baseline Environment (Reference)** | `https://mcstaging2.globewest.com.au` (AU Storefront) |
| **Execution Mode** | Headed Chromium (Full Storefront Cross-Comparison) |
| **Audit Focus** | **Defects & Mismatches Only** |
| **Total Defects Identified** | **4 Issues** (1 Critical, 1 Major, 2 Pending Content/Integrations) |

---

## Executive Summary of Defects

```
┌────┬─────────────────────────────┬──────────┬─────────────────────────────┬────────────────────────────────────────────────────────┬───────────────┐
│ #  │ Component                   │ Severity │ Defect Type                 │ Key Impact                                             │ Status        │
├────┼─────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────────────────────────────────┼───────────────┤
│ 01 │ Hero Banner Slider          │ P1 - High│ Australian Domain Leakage   │ Main CTA button navigates US visitors to AU website    │ ✅ RESOLVED   │
│ 02 │ Category Carousel           │ P2 - Med │ Australian Catalog Routing  │ All 14 category cards redirect buyers to AU catalog    │ ✅ RESOLVED   │
│ 03 │ Instagram Social Feed       │ P3 - Low │ Missing Images / Feed       │ Feed container renders blank (Token pending)           │ ⚠️ KNOWN LIMIT│
│ 04 │ SEO Text Content Block      │ P3 - Low │ Missing Marketing Copy      │ Container empty (Pending marketing copy population)    │ ℹ️ PENDING COPY│
└────┴─────────────────────────────┴──────────┴─────────────────────────────┴────────────────────────────────────────────────────────┴───────────────┘
```

---

## 🖼️ Master Defect Overview Graphic

A unified comparison poster highlighting all 4 defects side-by-side:

![Master Defect Overview Graphic](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/MASTER_SHOWING_VS_NOT_SHOWING.png)

---

## 1. 🚨 Defect 1: Hero Banner CTA Leaks to Australian Store — [✅ RESOLVED]
> **Regression Verification Status: RESOLVED & PASS** (Verified on `mcstaging2.globewest.com`)
> - The primary CTA link now points to `https://mcstaging2.globewest.com/` (relative US domain).
> - Live test confirmed clicking the CTA button stays on the US storefront with 0 Australian domain leakage.

![Hero Banner Link Defect Comparison](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_3_HERO_BANNER_LINK.png)

### Defect Details
- **CMS Identifier:** `main-us-banner`
- **Component:** Primary Hero Banner Slider (Top of page, ~181px)
- **Defect Severity:** 🚨 **P1 — Critical (Scope Leakage) -> [NOW RESOLVED]**

### The Previous Defect (Highlighted in Red):
- On the **US Storefront** (`mcstaging2.globewest.com`), the primary call-to-action button **"Explore Collections"** previously contained a hardcoded link to the Australian website:
  ```html
  <a href="https://www.globewest.com.au">Explore Collections</a>
  ```
- On the **AU Baseline** (Green Box), the button stays within the local store.

### Resolution Verified:
The button link was updated to stay within the US storefront (`https://mcstaging2.globewest.com/`). Playwright regression tests passed.

---

## 2. ⚠️ Defect 2: Category Carousel Cards Link to Australian Catalog — [✅ RESOLVED]
> **Regression Verification Status: RESOLVED & PASS** (Verified on `mcstaging2.globewest.com`)
> - All 14 category cards now route to US store URLs (e.g. `https://mcstaging2.globewest.com/outdoor`, `https://mcstaging2.globewest.com/indoor/shop-by-room/living-room`).
> - Live automated click navigation verified successful browsing without AU redirection.

![Category Carousel Links Defect Comparison](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_4_CATEGORY_CAROUSEL_LINKS.png)

### Defect Details
- **CMS Identifier:** `home-us-category-carousel`
- **Component:** Category Navigation Carousel (~481px)
- **Defect Severity:** ⚠️ **P2 — Major (Navigation Scope Leak) -> [NOW RESOLVED]**

### Resolution Verified:
All 14 category links were updated to US-relative paths. Regression automation verified 14 cards active with `US routing: true`.

---

## 3. ⚠️ Defect 3: Instagram Icon, Header & Photos Missing on US Store

![Instagram Feed Defect Comparison](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_1_INSTAGRAM_ICON_FEED.png)

### Defect Details
- **CMS Identifier:** `insta-us-block-home-page`
- **Component:** Social Proof Instagram Feed (~5470px)
- **Defect Severity:** ⚠️ **P3 — Minor / Known Limitation (Pending API Token)**

### The Defect (Highlighted in Red):
- On the **US Storefront**, the Instagram section is **completely blank (empty space)**. The Instagram camera icon, the `@Globewest` handle, the "Be Inspired" title, and photos **do not render**.
- On the **AU Baseline** (Green Box), the camera icon, `@Globewest` header, and a live 4-column photo grid **are showing**.

### Root Cause:
- Confirmed by developer note: template code is added as per AU, but the **US Instagram Graph API token is not authorized yet**.

### Developer Fix:
- Authenticate the US Instagram Business account in Magento Social settings to allow photos to populate.

---

## 4. ⚠️ Defect 4: SEO Text Content Block Is Completely Empty

![SEO Text Defect Comparison](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_2_SEO_TEXT.png)

### Defect Details
- **CMS Identifier:** `home-us-seo-text`
- **Component:** SEO Rich Text (Directly above footer)
- **Defect Severity:** ⚠️ **P3 — Minor / Content Defect (SEO Impact)**

### The Defect (Highlighted in Red):
- On the **US Storefront**, the PageBuilder row container is **100% empty (0 words of text)**.
- On the **AU Baseline** (Green Box), **3 full paragraphs of keyword-rich copy** (*"Australian Living Furniture & Homewares..."*) are showing.

### Impact:
- Search engines (Google/Bing) crawling the US homepage have zero organic keyword content to index.

### Developer Fix:
- Marketing team must paste the US-localized copywriting into Magento Admin (`Content > Elements > Blocks > home-us-seo-text`).
