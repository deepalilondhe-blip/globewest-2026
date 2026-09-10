# 📋 Ticket 4: Set up the CMS Structure – Test Cases Catalog

| Metadata | Details |
| :--- | :--- |
| **Ticket Number** | **Ticket 4** |
| **Ticket Name** | **Set up the CMS Structure (US Storefront CMS Home Page & Blocks Setup)** |
| **Parent Epic** | GlobeWest USA B2B Storefront Expansion (Adobe Commerce / Magento 2) |
| **Target Store Scope** | **USA Website** (`mcstaging2.globewest.com` / US Store View) |
| **Admin Panel URL** | `https://mcstaging2.globewest.com.au/godmode/admin/` |
| **Assigned QA Engineer**| Deepali Londhe (`deepali.londhe@overdose.digital`) |
| **Status** | **Ready for Execution** |

---

## 🎯 Test Matrix Overview

| Test Case ID | Test Case Title | Priority | Category | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-US-CMS-01** | Verify CMS Home Page Assignment in Magento Admin Store Configuration | **P1 (Critical)** | Store Configuration – Default Pages | Playwright + Manual | READY |
| **TC-US-CMS-02** | Verify CMS Page `Home page - US` (`home-us`) in Content > Pages | **P1 (Critical)** | CMS Page Verification | Playwright + Manual | READY |
| **TC-US-CMS-03** | Verify All 9 CMS Blocks Exist & Enabled in Content > Blocks | **P1 (Critical)** | CMS Blocks Verification | Playwright + Manual | READY |
| **TC-US-CMS-04** | US Storefront: Hero Banner Block (`main-us-banner`) Rendering | **P1 (Critical)** | Storefront – Hero Banner | Playwright + Manual | READY |
| **TC-US-CMS-05** | US Storefront: B2B Video Block (`home-us-video-block-b2b`) Rendering | **P2 (High)** | Storefront – Video Section | Playwright + Manual | READY |
| **TC-US-CMS-06** | US Storefront: Category Carousel Block (`home-us-category-carousel`) Rendering | **P1 (Critical)** | Storefront – Category Carousel | Playwright + Manual | READY |
| **TC-US-CMS-07** | US Storefront: Visit Showroom Block (`global-us-visit-showroom`) Rendering | **P2 (High)** | Storefront – Showroom Promo | Playwright + Manual | READY |
| **TC-US-CMS-08** | US Storefront: Recent Articles Block (`homepage_us_recent_articles`) Rendering | **P2 (High)** | Storefront – Editorial / Journal | Playwright + Manual | READY |
| **TC-US-CMS-09** | US Storefront: Instagram Feed Block (`insta-us-block-home-page`) Known Limitation & Fallback Audit | **P2 (High)** | Storefront – Social Widget | Playwright + Manual | READY |
| **TC-US-CMS-10** | US Storefront: About Us Brand Story Block (`home-us-page-about-us`) Rendering | **P2 (High)** | Storefront – Brand Content | Playwright + Manual | READY |
| **TC-US-CMS-11** | US Storefront: Find a Designer CTA Block (`global-us-find-designer`) Rendering | **P2 (High)** | Storefront – Trade CTA | Playwright + Manual | READY |
| **TC-US-CMS-12** | US Storefront: SEO Text Block (`home-us-seo-text`) Rendering | **P3 (Medium)** | Storefront – SEO Content | Playwright + Manual | READY |
| **TC-US-CMS-13** | US Storefront: Responsive Layout Integrity & Zero AU Scope Leakage | **P1 (Critical)** | Storefront – Cross-Device & Scope | Playwright + Manual | READY |

---

## 📑 Detailed Test Specifications

### TC-US-CMS-01: Verify CMS Home Page Assignment in Magento Admin Store Configuration
* **Priority**: P1 (Critical)
* **Preconditions**: Admin user authenticated with Magento Admin panel.
* **Admin Navigation Path**: `Stores > Configuration > [Scope: USA Website / US Store View] > General > Web > Default Pages > CMS Home Page`
* **Test Steps**:
  1. Login to Magento Admin (`/godmode/admin/`).
  2. Navigate to `Stores > Configuration`.
  3. In the top-left Store Scope dropdown, switch scope from "Default Config" to **"USA Website"** or **"GlobeWest US"**.
  4. In the left navigation tree, expand `General` and click `Web`.
  5. Expand the `Default Pages` accordion.
  6. Inspect the field `CMS Home Page`.
  7. Verify the `Use Default` checkbox is **unchecked**.
  8. Verify the dropdown value is selected as **"Home page - US"** (corresponding to page identifier `home-us`).
  9. Capture screenshot proof.
* **Expected Result**: Under the US scope, `CMS Home Page` is explicitly assigned to `Home page - US`.
* **Why It Matters**: If this setting is not saved under the US scope, visitors to `mcstaging2.globewest.com` will see either the Australian homepage or a 404 error.

---

### TC-US-CMS-02: Verify CMS Page "Home page - US" (home-us) in Content > Pages
* **Priority**: P1 (Critical)
* **Preconditions**: Magento Admin logged in.
* **Admin Navigation Path**: `Content > Elements > Pages`
* **Test Steps**:
  1. Navigate to `Content > Elements > Pages`.
  2. In the grid filters, set `URL Key` to `home-us` (or Title to `Home page - US`).
  3. Click `Apply Filters`.
  4. Assert that the page record exists.
  5. Check `Status`: Must be **Enabled**.
  6. Check `Store View`: Must include **USA Website** or **US Store View**.
  7. Click `Select > Edit` to verify PageBuilder content and block widgets.
  8. Capture screenshot proof.
* **Expected Result**: Page `home-us` exists, is active (Enabled), is bound to the US website scope, and contains valid layout markup.
* **Why It Matters**: Validates that the underlying CMS page entity created by the Adobe team was saved correctly with proper store view permissions.

---

### TC-US-CMS-03: Verify All 9 CMS Blocks Exist & Enabled in Content > Blocks
* **Priority**: P1 (Critical)
* **Preconditions**: Magento Admin logged in.
* **Admin Navigation Path**: `Content > Elements > Blocks`
* **Test Steps**:
  1. Navigate to `Content > Elements > Blocks`.
  2. Verify all 9 CMS block identifiers individually or by filtering:
     - `home-us-video-block-b2b`
     - `main-us-banner`
     - `home-us-category-carousel`
     - `global-us-visit-showroom`
     - `homepage_us_recent_articles`
     - `insta-us-block-home-page`
     - `home-us-seo-text`
     - `home-us-page-about-us`
     - `global-us-find-designer`
  3. For each block, verify:
     - Record exists.
     - `Status` = **Enabled**.
     - `Store View` = **USA Website** or **All Store Views**.
  4. Capture screenshot evidence of the blocks grid.
* **Expected Result**: All 9 CMS blocks are present, enabled, and scoped to the US website.
* **Why It Matters**: If any block is missing or disabled, Magento CMS widgets will render empty gaps or trigger PHP exceptions on the storefront.

---

### TC-US-CMS-04: US Storefront Hero Banner Block (main-us-banner) Rendering
* **Priority**: P1 (Critical)
* **Preconditions**: US Staging storefront URL accessible (`https://mcstaging2.globewest.com/`).
* **Storefront Location**: Homepage top hero section.
* **Test Steps**:
  1. Open US storefront homepage in browser.
  2. Locate the hero section container (`.block-cms-banner`, `[data-block-id="main-us-banner"]`, or hero slider).
  3. Verify desktop hero image/video renders clearly without 404 asset errors.
  4. Verify H1 headline text and promotional copy.
  5. Inspect the Call-To-Action (CTA) link (e.g., "Explore Collection").
  6. Verify the link stays within the US store domain (`mcstaging2.globewest.com`) and does not point to `.com.au`.
  7. Capture screenshot.
* **Expected Result**: Hero banner renders with high-resolution imagery, legible text, and a valid US storefront link.

---

### TC-US-CMS-05: US Storefront B2B Video Block (home-us-video-block-b2b) Rendering
* **Priority**: P2 (High)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Section below the hero banner.
* **Test Steps**:
  1. Scroll to the video section on the US homepage.
  2. Locate the B2B video element or container (`home-us-video-block-b2b`).
  3. Verify that the video player, HTML5 `<video>`, or YouTube/Vimeo embed frame loads properly.
  4. Check that the video poster image renders.
  5. Verify play/pause interactive controls function without console errors.
  6. Verify accompanying B2B copy (e.g., trade craftsmanship, bespoke design for hospitality/commercial).
  7. Capture screenshot.
* **Expected Result**: Video component loads cleanly without CORS or broken embed errors.

---

### TC-US-CMS-06: US Storefront Category Carousel Block (home-us-category-carousel) Rendering
* **Priority**: P1 (Critical)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Category navigation section.
* **Test Steps**:
  1. Scroll to the category carousel block.
  2. Verify all category cards (e.g., Living, Dining, Bedroom, Outdoor) render with images and title labels.
  3. Click Next/Previous navigation arrows to verify slide animation.
  4. On mobile/touch viewport, test swipe gesture navigation.
  5. Click a category card and verify it navigates to the corresponding US category PLP (e.g., `/indoor` or `/furniture/sofas-modulars.html`).
  6. Capture screenshot.
* **Expected Result**: Carousel operates smoothly; category cards have valid images and route to US PLP URLs.

---

### TC-US-CMS-07: US Storefront Visit Showroom Block (global-us-visit-showroom) Rendering
* **Priority**: P2 (High)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Mid-page promotional block.
* **Test Steps**:
  1. Locate the "Visit Showroom" promotional section.
  2. Verify imagery and headline.
  3. **Strict Inspection**: Verify that the showroom copy does **NOT** mention Australian cities (e.g., Melbourne, Sydney, Brisbane, Perth, Adelaide).
  4. Verify CTA button (e.g., "Book a Consultation", "Find US Showroom", or "Virtual Tour").
  5. Verify the link destination is valid on the US domain.
  6. Capture screenshot.
* **Expected Result**: Showroom promo is tailored for US customers; zero Australian showroom locations or domestic phone numbers are displayed.

---

### TC-US-CMS-08: US Storefront Recent Articles Block (homepage_us_recent_articles) Rendering
* **Priority**: P2 (High)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Editorial / Design Journal section.
* **Test Steps**:
  1. Locate the recent articles / design blog section.
  2. Verify individual article cards display valid thumbnails, titles, and publication dates/excerpts.
  3. Verify that images are responsive and not distorted.
  4. Click an article link and confirm navigation to the article page on the US store.
  5. Capture screenshot.
* **Expected Result**: Editorial cards render with valid typography and active hyperlinks.

---

### TC-US-CMS-09: US Storefront Instagram Feed Block (insta-us-block-home-page) Known Limitation & Fallback Audit
* **Priority**: P2 (High)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Social feed section above footer.
* **Test Steps**:
  1. Inspect the DOM in DevTools for the Instagram feed container (`insta-us-block-home-page`, `#instagram-feed`, or `.insta-feed`).
  2. Verify whether the container markup is present in the DOM.
  3. **Verify Dev Team Note**: Confirm that Instagram post images are **NOT currently showing** on the page.
  4. Check browser DevTools Console: Look for API token errors, missing script warnings, or CORS restrictions on `mcstaging2.globewest.com`.
  5. **Graceful Degradation Check**: Verify that the non-rendering feed does **NOT**:
     - Break page scrolling or layout.
     - Display an ugly broken image placeholder or raw code snippet.
     - Throw an uncaught fatal JavaScript error that blocks other scripts.
  6. Document exact console logs and screenshot evidence.
* **Expected Result**: The feed container degrades gracefully without breaking the user experience; the missing feed issue is validated and documented for subsequent API/token setup.

---

### TC-US-CMS-10: US Storefront About Us Brand Story Block (home-us-page-about-us) Rendering
* **Priority**: P2 (High)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Brand narrative section.
* **Test Steps**:
  1. Scroll to the "About Us" brand story block.
  2. Verify headline, brand ethos paragraph, and imagery.
  3. Verify that any links ("Learn More", "Our Story") point to the US `/about-us` CMS page.
  4. Check text contrast and legibility across viewports.
  5. Capture screenshot.
* **Expected Result**: About Us block renders with clear brand messaging and valid internal link.

---

### TC-US-CMS-11: US Storefront Find a Designer CTA Block (global-us-find-designer) Rendering
* **Priority**: P2 (High)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Trade community CTA section.
* **Test Steps**:
  1. Locate the "Find a Designer" or Trade Directory section.
  2. Verify headline, description, and button elements.
  3. Click the CTA button and verify it links to the US Trade Registration page or Designer Directory.
  4. Verify mobile responsive wrapping.
  5. Capture screenshot.
* **Expected Result**: Clean layout with functional CTA routing to US Trade/Designer resource.

---

### TC-US-CMS-12: US Storefront SEO Text Block (home-us-seo-text) Rendering
* **Priority**: P3 (Medium)
* **Preconditions**: US Staging storefront loaded.
* **Storefront Location**: Bottom of homepage, above footer.
* **Test Steps**:
  1. Scroll to the bottom of the US homepage.
  2. Locate the SEO text content block (`home-us-seo-text`).
  3. Verify heading tags (H2/H3) and paragraphs.
  4. Confirm that the text focuses on GlobeWest furniture offerings for the US market.
  5. Verify no Australian corporate disclosures (e.g. ABN numbers, AU GST disclaimers) are included in this block.
  6. Capture screenshot.
* **Expected Result**: SEO text block is present, readable, and properly scoped for US search indexing.

---

### TC-US-CMS-13: US Storefront Responsive Layout Integrity & Zero AU Scope Leakage
* **Priority**: P1 (Critical)
* **Preconditions**: US Staging storefront loaded.
* **Test Steps**:
  1. Test the US homepage across 3 viewports:
     - Desktop: 1920 x 1080
     - Tablet: 820 x 1180
     - Mobile: 393 x 851
  2. Check for horizontal scrollbars, text clipping, or overlapping blocks.
  3. Verify that all images have `naturalWidth > 0` (no broken images).
  4. Execute automated text inspection for Australian scope leakage:
     - Words: `AUD`, `$AU`, `Australia`, `ABN`, `inc. GST`, `VIC`, `NSW`, `+61`.
  5. Capture full-page screenshots for Desktop, Tablet, and Mobile.
* **Expected Result**: Flawless responsive layout across all device viewports; zero broken images; zero Australian data leakage.
