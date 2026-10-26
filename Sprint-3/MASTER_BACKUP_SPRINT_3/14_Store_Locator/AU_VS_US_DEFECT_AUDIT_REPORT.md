# 🔍 Store Locator: AU Baseline vs. US Staging Comprehensive QA Audit

**Ticket:** [#41794539 - Store Locator](https://overdose.eu.teamwork.com/app/tasks/41794539)  
**Target US URL:** `https://mcstaging2.globewest.com/locator`  
**Baseline AU URL:** `https://mcstaging2.globewest.com.au/locator` & `https://www.globewest.com.au/locator`  
**Mobile Device Emulation:** **Real iPhone 17 Pro** (`402 x 874` logical CSS px, `3.0x` Retina scale factor, iOS 18.2 Safari UA, Touch enabled)  
**Dual-Auth Status:** Verified under **Logged-In Authenticated Sessions** on BOTH US & AU  
**Cursor Interaction:** **Live Click Spotlight Highlighter Enabled** on all clicks  

---

## 📊 1. Full Element-by-Element Comparison Matrix (AU vs. US)

| Element / Section | AU Baseline (`mcstaging2.globewest.com.au/locator`) | US Storefront Live (`mcstaging2.globewest.com/locator`) | Match Status | Defect / Severity |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title (`<title>`)** | `<title></title>` (Empty) | `<title></title>` (Empty) | ❌ Both Empty | **P1 / WCAG 2.4.2 Level A Defect** (Console: `Track.Title: Title must not be empty`) |
| **Authentication Header** | Authenticated Customer Session (`deepalilondhe576@gmail.com`) | Authenticated US Trade Session (`deepali.londhe@overdose.digital`) + Header Trade Mode Toggle | ⚠️ Dual-Auth Verified | ✅ **PASS** (Dual-auth persistent on both storefronts) |
| **Utility Bar** | Domestic AU links (`Become a Trade Customer`, `Book Showroom`) | `Book Showroom` link present | ⚠️ Verified | ✅ **PASS** |
| **H1 Hero Heading** | `FIND A STOCKIST` | `FIND A STOCKIST` | ✅ Identical | ✅ **PASS** |
| **Introductory Paragraph Copy** | Reference to Australian retailers: *"GlobeWest is stocked at some of Australia's finest furniture..."* | Leaks identical Australian text verbatim: *"GlobeWest is stocked at some of Australia's finest..."* | ❌ AU Copy Leaked | 🔴 **P1 High Defect**: Australia editorial copy leaked on US Storefront |
| **Search Input 1: Postcode Placeholder** | `placeholder="Eg.3000"` (Melbourne AU Postcode) | `placeholder="Eg.3000"` (Melbourne AU Postcode) | ❌ AU Postcode Leaked | 🔴 **P1 High Defect**: Hardcoded Australian postcode; must be US 5-digit ZIP (`Eg. 90210`) |
| **Search Action: Current Location** | `"USE CURRENT LOCATION"` | `"USE CURRENT LOCATION"` | ✅ Identical | ✅ **PASS** |
| **Search Input 2: Store Name** | `placeholder="Start Typing"` | `placeholder="Start Typing"` | ✅ Identical | ✅ **PASS** |
| **Disclaimer Paragraph Duplication** | Disclaimer text rendered twice: above map and below map | Disclaimer text rendered twice: above map and below map | ❌ Duplicated | 🟡 **P2 Defect**: Duplicate editorial disclaimer |
| **Google Maps Canvas & API** | **Operational Google Maps container** with interactive controls & pins | ❌ **CRITICAL FAILURE**: Blank grey canvas + alert *"Oops! Something went wrong. This page didn't load Google Maps correctly."* | ❌ NOT MATCHING | 🔴 **P0 CRITICAL BLOCKER**: `RefererNotAllowedMapError` (`mcstaging2.globewest.com` not authorized in Google Cloud Console) |
| **Stockist Pin Data** | Active Victoria / Melbourne stockist pins in database | **Zero US stockist pins / Zero US showroom pins** | ❌ NOT MATCHING | 🔴 **P1 High Defect**: US Showroom locations (LA & Austin) not configured |
| **CMS Block: `stockist_info` Heading** | `<h2>How to Buy with a Stockist</h2>` | `<h2>How to Buy with a Stockist - us</h2>` | ❌ NOT MATCHING | 🔴 **P1 High Defect**: Internal Magento store identifier `"- us"` leaked into title; wraps awkwardly on mobile |
| **CMS Block: Body Copy** | Australian furniture stockists | Leaks *"Australia's finest furniture and home decor retailers"* | ❌ AU Copy Leaked | 🔴 **P1 High Defect**: US CMS block body copy must be localized |
| **CMS Block: Spelling Standard** | Australian spelling *"finalise your order"* | Australian spelling *"finalise your order"* | ❌ AU Spelling Leaked | 🟡 **P2 Medium Defect**: American English standard requires *"finalize"* |
| **Storefront Footer Trust Badge** | Australian Kangaroo trust badge (`AUSTRALIAN OWNED & RUN` with AU map) | Australian Kangaroo trust badge (`AUSTRALIAN OWNED & RUN` with AU map) | ❌ AU Badge Leaked | 🟡 **P2 Medium Defect**: Domestic Australian badge must be suppressed on US |

---

## 📱 2. Real-Time iPhone 17 Pro Responsive Viewport Audit

The Store Locator was evaluated on a **physical-spec iPhone 17 Pro**:
- **Logical CSS Viewport:** `402 x 874` px
- **Device Scale Factor (Retina):** `3.0x` (Physical: `1206 x 2622` px)
- **User Agent:** `Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1`
- **Touch Emulation:** Active (`hasTouch: true`, `isMobile: true`)

### Key Findings on Real iPhone 17 Pro:
1. **Google Maps Failure on Mobile:** Google Maps canvas does not render tiles or pins on mobile; renders as an unresponsive blank grey block.
2. **CMS Block Line Wrap:** The heading `How to Buy with a Stockist - us` breaks awkwardly across two lines:
   ```text
   How to Buy with a Stockist -
   us
   ```
3. **Hardcoded AU Postcode Input:** The search field displays `Eg.3000`, confusing US mobile shoppers expecting a standard US ZIP code format.

---

## 🎯 3. Live Cursor Click Highlighter Standard

Per explicit testing directives, Playwright was configured with a **real-time animated click spotlight highlighter**:
- **Visual Cursor Pointer:** A persistent circular pointer (`#f59e0b` amber with white stroke) tracks mouse movement across the viewport.
- **Click Spotlight Ring:** On every single click, an animated expanding ripple spotlight (`#ef4444` red with glowing border) pulses from the exact click coordinates.
- **Verified Click Points:**
  1. `SEARCH BY POSTCODE` input field (cursor spotlight centered inside field)
  2. Search submit button
  3. `USE CURRENT LOCATION` link
  4. `SEARCH BY STORE NAME` input field
  5. Google Maps canvas
  6. Mobile navigation hamburger toggle (iPhone 17 Pro)
  7. CMS Block heading `How to Buy with a Stockist - us` (iPhone 17 Pro)

---

## 📸 4. Visual Evidence & Red/Green Comparison Directory

All visual artifacts are strictly organized per `AGENTS.md` standards (🟢 Green = AU Baseline, 🔴 Red = US Live Defect):

- **Side-by-Side Comparisons:** Located in `comparison/`:
  - `COMPARISON_01_GOOGLE_MAPS_CANVAS.png` (P0: Google Maps JS API Referer Failure)
  - `COMPARISON_02_POSTCODE_PLACEHOLDER.png` (P1: Hardcoded Australian Postcode Placeholder)
  - `COMPARISON_03_AU_COPY_LEAK.png` (P1: Australian Intro Copy Leak)
  - `COMPARISON_04_EDITORIAL_HEADING_WRAP.png` (P1: CMS Heading Wrap & "- us" Suffix Leak)
  - `COMPARISON_05_EDITORIAL_BODY_SPELLING.png` (P2: Australian Spelling "finalise")
  - `COMPARISON_06_FOOTER_KANGAROO_BADGE.png` (P2: Australian Kangaroo Badge in Footer)
  - `COMPARISON_07_MOBILE_RESPONSIVE_OVERVIEW.png` (P1: Mobile Layout Stacking)
  - `COMPARISON_08_IPHONE17PRO_DUAL_AUTH_STORE_LOCATOR.png` (iPhone 17 Pro Dual-Auth Comparison)
  - `COMPARISON_09_IPHONE17PRO_MAP_AND_CMS_DEFECTS.png` (iPhone 17 Pro Map Failure)
  - `COMPARISON_10_CMS_BLOCK_STOCKIST_INFO_DEFECT.png` (CMS Block `stockist_info` Detailed Audit)

- **Cursor Click Highlight Evidence:** Located in `screenshots/cursor_highlights/`:
  - `02_US_Click_Postcode_Input_Highlighted.png` (Highlighted click inside postcode field)
  - `05_US_Click_Store_Name_Highlighted.png` (Highlighted click inside store search field)
  - `06_US_Click_Broken_Map_Highlighted.png` (Highlighted click on broken map canvas)
  - `07_US_Mobile_Click_Hamburger_Highlighted.png` (Highlighted click on mobile burger nav)
  - `08_US_Mobile_Click_Postcode_Highlighted.png` (Highlighted click on mobile postcode field)
  - `09_US_Mobile_Click_CMS_Heading_Highlighted.png` (Highlighted click on CMS heading on iPhone 17 Pro)

- **Interactive Gallery Viewer:** Open `VIEW_DEFECT_IMAGES.html` in any browser to inspect full-resolution images with modal zoom.
