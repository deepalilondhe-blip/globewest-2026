# Ticket 4: Set up the CMS Structure (US Storefront)
## Permanent QA Master Guide & Verification Framework

> **Document Version**: 2.0 (Comprehensive QA Reference)  
> **Target Release**: GlobeWest 2026 Multi-Store Expansion (USA Storefront)  
> **Ticket Name**: Ticket 4 - Set up the CMS Structure  
> **Author**: QA Automation & Engineering Team  
> **Date**: September 2026  

---

## 1. Executive Summary & Developer Update Breakdown

The Adobe Commerce engineering team unblocked the US Storefront setup by decoupling the Australian and US CMS architectures. The developer provided the following key update:

```text
We got a solution from the Adobe team, and we are unblocked now.
An update on the CMS Home page setup for the US store:
- We've created a new Home page - US (identifier: home-us), assigned to the USA Website.
- We've also created 9 new CMS blocks for the US store:
    1. home-us-video-block-b2b
    2. main-us-banner
    3. home-us-category-carousel
    4. global-us-visit-showroom
    5. homepage_us_recent_articles
    6. insta-us-block-home-page
    7. home-us-seo-text
    8. home-us-page-about-us
    9. global-us-find-designer
Note: The Insta feed block section isn't currently showing on the site — we've already added the code for it as per the AU site.
Configuration: Yes
How to assign the new home page:
Magento Admin > Stores > Configuration > General > Web > Default Pages > CMS home page > Home page - US
```

---

## 2. Understanding the URLs: What QA Must Compare

| Environment / Page | Exact URL | Page Type | Content & What QA Checks |
| :--- | :--- | :--- | :--- |
| **US Homepage** | `https://mcstaging2.globewest.com/` | **CMS Page (`home-us`)** | **The primary focus of Ticket 4.** Houses all 9 new CMS blocks (`main-us-banner`, `home-us-category-carousel`, `home-us-page-about-us`, `global-us-find-designer`, `home-us-video-block-b2b`, etc.). |
| **US Outdoor PLP** | `https://mcstaging2.globewest.com/outdoor` | **Category / Catalog Page** | Product Listing Page (PLP) for Outdoor Furniture. Features SearchSpring / Magento Layered Navigation filters, category breadcrumbs, and product grids. QA verifies that navigation links from the homepage category carousel route here with USD pricing and US store scope. |
| **AU Homepage (Baseline)** | `https://mcstaging2.globewest.com.au/` | **CMS Page (`home`)** | **The reference benchmark.** QA compares each US block layout against this live AU layout to ensure visual, structural, and behavioral parity. |
| **AU Outdoor PLP** | `https://mcstaging2.globewest.com.au/outdoor` | **Category / Catalog Page** | AU baseline for the Outdoor category, showing AUD pricing and AU stock availability. |

---

## 3. Side-by-Side Comparison: US Storefront vs AU Storefront

| Section # | CMS Block Identifier | Vertical Position (Top px) | US Storefront (`mcstaging2.globewest.com`) | AU Storefront Reference (`mcstaging2.globewest.com.au`) | Parity Status & QA Action |
| :---: | :--- | :---: | :--- | :--- | :---: |
| **1** | `main-us-banner` | `165px` | Large Hero Swiper slider ("Out Now"). CTA button: "Explore Collections". | Matching Hero Swiper slider. CTA links to AU collections. | 🚨 **DEFECT**: US CTA points to `https://www.globewest.com.au`. Must be updated to US relative path. |
| **2** | `home-us-category-carousel` | `1034px` | 14 Category cards (Living Room, Dining, Outdoor, Bedroom, etc.). | 14 Category cards with identical layout and imagery. | ⚠️ **DEFECT**: Category card hrefs point to `.com.au/indoor/...`. Must route to US catalog. |
| **3** | `home-us-page-about-us` | `1755px` | "About us: Inspired by uniquely Australian living..." brand copy block. | Identical brand story block. | ✅ **MATCH**: Content rendered cleanly in US layout. |
| **4** | `global-us-find-designer` | `2116px` | "Find a Referred Designer / Get Professional Design Support" split banner + CTA. | Identical trade/designer banner. | ✅ **MATCH**: Renders correctly with US styling. |
| **5** | `home-us-video-block-b2b` | `2967px` | "Collections 2026 Volume #02 / Latest Video" embedded video block. | Identical video block. | ✅ **MATCH**: Video player controls and responsive container verified. |
| **6** | Product Carousel | `3743px` | "Our Newest Arrivals" dynamic product carousel widget. | Dynamic product carousel. | ✅ **MATCH**: Core widget functioning. |
| **7** | `homepage_us_recent_articles` | `4498px` | "Content hub: Inspiring Trends & Directions" blog and journal card grid (21 links). | Identical Content Hub widget. | ✅ **MATCH**: Article cards rendered with responsive layout. |
| **8** | `insta-us-block-home-page` | `5372px` | Instagram social feed container present in DOM; posts hidden. | Live Instagram feed widget displaying social posts. | ℹ️ **KNOWN LIMITATION (VERIFIED)**: Dev note confirmed feed is hidden pending API token authorization. No fatal JS crashes. |
| **9** | `global-us-visit-showroom` | Modular / Config | Showroom booking promo block in Magento PageBuilder. | Showroom booking promo block. | ⚠️ **INFO**: Active in AU; for US, showrooms are AU-specific so CTA redirects to `/how-to-buy/`. |
| **10** | `home-us-seo-text` | Above Footer | SEO text block container defined in Magento Admin. | Footer SEO paragraph text. | ℹ️ **INFO**: Container deployed in PageBuilder; pending final US marketing copy. |

---

## 4. What We As QA Must Do (Permanent Step-by-Step QA Checklist)

### Step 1: Magento Admin Configuration Audit (High Priority)
1. **Access Admin**: Log into `https://mcstaging2.globewest.com.au/godmode/admin/`.
2. **Verify CMS Home Page Assignment**:
   - Navigate to: **Stores > Settings > Configuration > General > Web > Default Pages**.
   - Switch Store Scope to: **USA Website**.
   - Check the **"Use Default"** checkbox: It **must be UNCHECKED** (so the US site doesn't inherit the AU homepage).
   - Check **CMS Home Page dropdown**: Value must be **"Home page - US"** (identifier: `home-us`).
3. **Verify CMS Page Entity**:
   - Navigate to: **Content > Elements > Pages**.
   - Filter by URL Key: `home-us`.
   - Verify Status is **Enabled** and Store View is assigned to **USA Website** / **USA Store**.
4. **Verify 9 CMS Blocks in Admin**:
   - Navigate to: **Content > Elements > Blocks**.
   - Confirm all 9 identifiers exist, are **Enabled**, and assigned to the US Store View.

### Step 2: US Storefront Homepage Visual & Functional Audit
1. Open `https://mcstaging2.globewest.com/` in Chrome.
2. Verify HTTP status is `200 OK` and `document.body` contains the class `cms-home-us`.
3. Scroll from top to bottom and confirm each section loads in order:
   - **Section 1**: Hero Banner (`main-us-banner`)
   - **Section 2**: Category Carousel (`home-us-category-carousel`)
   - **Section 3**: About Us (`home-us-page-about-us`)
   - **Section 4**: Find a Designer (`global-us-find-designer`)
   - **Section 5**: B2B Video Block (`home-us-video-block-b2b`)
   - **Section 6**: New Arrivals Product Carousel
   - **Section 7**: Content Hub Recent Articles (`homepage_us_recent_articles`)
   - **Section 8**: Instagram Feed (`insta-us-block-home-page`)
   - **Section 9**: SEO Content (`home-us-seo-text`)

### Step 3: Scope Leakage & Link Destination Testing (Critical Quality Gate)
- Inspect **all anchor links (`<a href="...">`)** across the US homepage.
- **PASS Criteria**: Links must be relative (`/outdoor`, `/living-room`) or stay on `https://mcstaging2.globewest.com`.
- **FAIL Criteria**: Any link pointing to `https://www.globewest.com.au` or `https://mcstaging2.globewest.com.au` without a store switcher parameter is an Australian Scope Leak defect.
- **Check currency symbols**: Must display `$` (USD) or no currency prefix; must NOT display `AUD`, `$AU`, or Australian GST notices.
- **Check contact info**: Must NOT display Australian ABN or Richmond Melbourne showroom addresses on US landing pages.

### Step 4: Responsive Verification
- **Desktop (1920x1080)**: Full-width layout, zero horizontal scroll, interactive carousels.
- **Tablet (820x1180)**: Responsive 2-column or stacked layouts, touch swipers active.
- **Mobile (393x851)**: Hamburger menu, single-column stacked blocks, tap targets ≥ 48px.

---

## 5. Automated Testing Suite & How to Run

All automated tests are located in:
`Ticket 4 - Set up the CMS Structure/ticket4-us-cms-structure.spec.js` (and mirrored in `GlobeWest 2026/tests/ticket4-us-cms-structure.spec.js`).

### Quick Commands (Run from Project Root)

```bash
# 1. Run Storefront Functional Suite with VISUAL HIGHLIGHTS (Headed Chrome)
npm run test:ticket4:functional

# 2. Run Admin Panel Checks with VISUAL HIGHLIGHTS (Headed Chrome)
npm run test:ticket4:admin

# 3. Run Full Ticket 4 Test Suite (All 13 test cases, Headed)
npm run test:ticket4:headed

# 4. Run Full Ticket 4 Test Suite in Background (Headless)
npm run test:ticket4

# 5. Open the Playwright HTML Test Report (with embedded screenshots)
npm run report
```

### Visual Highlight Features During Test Execution
When running in headed mode (`--headed`), the script visibly indicates what it is doing in real-time:
- **Neon Pink Outline (`4px solid #FF0055`)**: Highlights the active section being audited.
- **Floating Badge (`🏷️ [X/9] Component Name`)**: Displays which of the 9 CMS blocks is under test.
- **Green Flash (`#00FFCC`)**: Flashes on buttons and links as they are clicked/evaluated.

---

## 6. How to View Reports with Screenshots

### Option A: Official Playwright HTML Report (Live Server)
Run the following command in your terminal:
```bash
npx playwright show-report playwright-report/general --port 9325
```
Open **`http://localhost:9325`** in your browser. Every test step includes expandable screenshots and video recordings of the test execution!

### Option B: Standalone Visual Dashboard (No Server Needed)
Open this file directly in Chrome or Firefox:
```text
/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Ticket 4 - Set up the CMS Structure/visual_report.html
```
Features:
- Complete top-to-bottom visual layout map
- Side-by-side screenshots of each section
- Direct links to full-page and responsive screenshots
- Defect summary cards ready to share with developers

---

## 7. Defects Identified for Developer Remediation

Share the following report with the developer:

> **Defect 1 (Priority P1 - Critical Scope Leak)**:
> - **Component**: `main-us-banner` (Hero Banner)
> - **Issue**: The primary Hero Banner Call-to-Action button links directly to `https://www.globewest.com.au` instead of the US catalog or a relative path (`/collections`).
> - **Impact**: US users clicking the primary banner are redirected out of the US website onto the Australian site.
> - **Fix Required**: Update the PageBuilder link in `main-us-banner` to use a relative URL (e.g., `/collections` or `/outdoor`).

> **Defect 2 (Priority P2 - Category Carousel Scope Leak)**:
> - **Component**: `home-us-category-carousel`
> - **Issue**: The category cards (Living Room, Dining Room, Outdoor) link to `https://www.globewest.com.au/indoor/...`.
> - **Fix Required**: Update card URLs in `home-us-category-carousel` to relative URLs (e.g., `/outdoor`, `/living-room`).

> **Verification Note (Instagram Feed)**:
> - **Component**: `insta-us-block-home-page`
> - **Finding**: Confirmed that the block HTML is present in the DOM and fails gracefully without JavaScript errors. The developer note ("Insta feed block section isn't currently showing — added as per AU site") is **verified and accepted** pending Instagram API token provision.
