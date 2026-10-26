# Senior QA Defect Audit Report: Ticket #41794541 (Blog Index Page)

| Document Metadata | Details |
|---|---|
| **Ticket Reference** | **P-GLW-007 Globewest US Expansion Project / Front End Development: Blog Index Page** |
| **Teamwork Task ID** | [#41794541](https://overdose.eu.teamwork.com/app/tasks/41794541) |
| **Assigned Developer** | Vinod Vankar (`@VinodV`) |
| **QA Lead / Reporter** | Deepali Londhe (`@DeepaliL`) |
| **Target Tested URL (US)** | `https://mcstaging2.globewest.com/blog` |
| **Baseline Reference (AU)** | `https://www.globewest.com.au/blog` |
| **Execution Standard** | **Real Headed Chrome / Playwright Mode** across **Desktop (1440×900)** and **Mobile (390×844)** |
| **Visual Evidence Standard** | 🟢 **Green Border/Badge**: Approved AU Live Baseline<br>🔴 **Red Border/Badge**: Confirmed Live US Staging Defects |
| **Audit Status** | **31 Features Verified (PASS 🟢)** \| **6 Defects / Glitches Flagged (🔴 Red)** |

---

## 1. Executive Summary & Defect Table

```
┌────┬─────────────────────────────┬──────────┬─────────────────────────────┬────────────────────────────────────────────────────────┬───────────────┐
│ #  │ Feature / Component         │ Severity │ Defect Type                 │ Key Impact                                             │ Status        │
├────┼─────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────────────────────────────────┼───────────────┤
│ 01 │ Hero "News" Background Color│ P2 - Med │ Color / Branding Mismatch   │ Left hero title box renders dark brown (#381c12)       │ 🔴 FAIL       │
│ 02 │ Hero "READ MORE" Link       │ P1 - High│ Australian Domain Leakage   │ CTA button hardcoded to mcprod.globewest.com.au        │ 🔴 FAIL       │
│ 03 │ Category Filter Navigation  │ P2 - Med │ Australian Scope Tags       │ Displays "THE BLOCK" (AU TV show) & "HOLIDAY CLOSURE"  │ 🔴 FAIL       │
│ 04 │ Pagination Bar Truncation   │ P1 - High│ Functional Navigation Cutoff│ Shows "72 articles" but only pages 1 & 2 exist (p.3-6) │ 🔴 FAIL       │
│ 05 │ Post Titles & Dummy Posts   │ P2 - Med │ Staging Content Artifacts   │ Post #1 shows "(Duplicated)"; Post #2 is "Post testing"│ 🔴 FAIL       │
│ 06 │ Header Wishlist Icon        │ P3 - Low │ Visual Parity Omission      │ Global header omits the Wishlist heart icon (♡)        │ 🔴 FAIL       │
└────┴─────────────────────────────┴──────────┴─────────────────────────────┴────────────────────────────────────────────────────────┴───────────────┘
```

---

## 2. In-Depth Glitch Analysis: Pagination & Article Counter

### 🔍 Special Investigation: AU Baseline Glitch vs. US Staging Defect

As observed and reported to `@MichelleM`, the **AU website possesses an inherent pagination count glitch**:

1. **Approved AU Baseline Behavior (`https://www.globewest.com.au/blog`)**:
   * **Displayed Counter**: `"Viewed 12 out of 231 articles"`.
   * **Rendered Pager**: Shows pages `[ 1 ] [ 2 ] [ 3 ] ... [ 15 ] [ > ]`.
   * **The Reality**:
     * `15 pages × 12 items/page = 180 articles`.
     * Direct navigation to `https://www.globewest.com.au/blog?p=16` returns **`0` articles**.
     * The SQL collection count returns `231`, which includes unpublished, draft, or inactive posts that the frontend loop filters out. This creates a **51-article mathematical discrepancy** on AU Live.

2. **US Staging Actual Defect (`https://mcstaging2.globewest.com/blog`)**:
   * **Displayed Counter**: `"Viewed 12 out of 72 articles"`.
   * **Rendered Pager**: Displays **ONLY `[ 1 ] [ 2 ] [ > ]`**.
   * **The Reality**:
     * `72 total articles ÷ 12 items/page = 6 expected pages`.
     * The pager UI truncates after page 2! Pages `3, 4, 5, 6` are **completely missing from the pagination bar**.
     * **Direct URL Test**: Navigating directly to `https://mcstaging2.globewest.com/blog?p=3` loads **12 genuine articles**.
     * **Impact**: American shoppers are completely blocked from browsing past page 2 via pagination controls, hiding over 48 published articles!

* **Visual Evidence**:
  [03_PAGINATION_ARTICLE_COUNT_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/comparison/03_PAGINATION_ARTICLE_COUNT_COMPARISON.png)

---

## 3. Confirmed Live Defects (US Staging vs Approved AU Baseline)

### 🚨 Defect 01: Hero "News" Background Color Mismatch
* **Component**: `.blog-category-banner__left`
* **Approved AU Live Baseline (🟢)**:
  * The left title panel displaying `"News"` has a light sand/beige background: `rgb(208, 193, 164)` (`#d0c1a4`).
* **Live US Staging Actual (🔴)**:
  * The background renders as dark chocolate brown: `rgb(56, 28, 18)` (`#381c12`), altering the brand identity and contrast.
* **Visual Evidence**:
  [01_BLOG_INDEX_DESKTOP_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/comparison/01_BLOG_INDEX_DESKTOP_COMPARISON.png)

---

### 🚨 Defect 02: Hero Banner "READ MORE" Button Hardcoded to Australian Production
* **Component**: `.blog-category-banner__info a`
* **Approved AU Live Baseline (🟢)**:
  * Links internally to the featured editorial article: `/blog/gallery/outdoor-collections-2027-gallery`.
* **Live US Staging Actual (🔴)**:
  * Hardcoded to: `https://mcprod.globewest.com.au/blog/style-tips/design-directions-2023`.
  * **Critical Scope Leak**: Clicking the hero CTA routes American buyers to the Australian production domain.

---

### 🚨 Defect 03: Australian Scope Tags in Category Filter Toolbar
* **Component**: `.blog-filter__list`
* **Approved AU Live Baseline (🟢)**:
  * Active categories: *ALL ARTICLES, STYLE TIPS, STOCKIST IN PROFILE, HOME TOUR, GALLERIES, PROJECTS, DESIGNER IN PROFILE, WOMEN IN DESIGN, LIGHTHOUSE FOUNDATION, 20 YEARS, COLLECTIONS 2027*.
* **Live US Staging Actual (🔴)**:
  * Renders Australian TV series tag: `"THE BLOCK"`, as well as Australian warehouse notices: `"HOLIDAY CLOSURE"` and `"TRADE EVENTS"`.
  * In addition, uses singular `"GALLERY"` instead of approved plural `"GALLERIES"`.

---

### 🚨 Defect 04: Truncated Pagination Bar Controls
* **Component**: `.toolbar-amount` and `.pages`
* **Approved AU Live Baseline (🟢)**:
  * Pager allows sequential navigation across all active pages (`1, 2, 3 ... 15`).
* **Live US Staging Actual (🔴)**:
  * Pager renders only buttons `1` and `2`, completely cutting off access to pages 3, 4, 5, 6 despite 72 articles being reported.

---

### ⚠️ Defect 05: Staging Post Duplication & Dummy Posts in Blog Grid
* **Component**: `.post-item`
* **Approved AU Live Baseline (🟢)**:
  * All posts are genuine brand articles with clean titles and editorial photography.
* **Live US Staging Actual (🔴)**:
  * Post #1 headline: `"Stockist in Profile | IKOS Home (Duplicated) (Duplicated)"`.
  * Post #2 headline: `"Post testing"` with placeholder `banner42.jpg`.

---

### ⚠️ Defect 06: Global Header Wishlist Heart Icon Missing
* **Component**: Global Header Utility Bar
* **Approved AU Live Baseline (🟢)**:
  * Wishlist heart icon (`♡`) is displayed beside the shopping bag.
* **Live US Staging Actual (🔴)**:
  * Wishlist trigger is omitted on US Staging header.

---

## 4. Responsive Testing Matrix (Real Measurements)

| Breakpoint | Viewport | Verified Layout & Usability | Status |
|---|---|---|---|
| **Desktop** | `1440 × 900` | 3-column article card grid, hero banner split-layout, full swiper categories | **PASS 🟢** (with visual defects noted) |
| **Tablet** | `768 × 1024` | 2-column article card grid, touch swiper for categories, zero overflow | **PASS 🟢** |
| **Mobile** | `390 × 844` | Single-column stacking (1 card per row), `scrollWidth: 390px`, zero horizontal scrolling | **PASS 🟢** |

---

## 5. Artifacts & Deliverables

* 📄 **Test Cases (CSV)**: [Blog_Index_Page_Test_Cases.csv](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/Blog_Index_Page_Test_Cases.csv)
* 📊 **Test Cases (Excel)**: [Blog_Index_Page_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/Blog_Index_Page_Test_Cases.xlsx)
* 📸 **Side-by-Side Comparisons**:
  * [01_BLOG_INDEX_DESKTOP_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/comparison/01_BLOG_INDEX_DESKTOP_COMPARISON.png)
  * [02_BLOG_INDEX_MOBILE_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/comparison/02_BLOG_INDEX_MOBILE_COMPARISON.png)
  * [03_PAGINATION_ARTICLE_COUNT_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/comparison/03_PAGINATION_ARTICLE_COUNT_COMPARISON.png)
* 🖥️ **Terminal Run Commands**: [Blog Index Page runcommand.txt](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794541_Blog_Index_Page/Blog%20Index%20Page%20runcommand.txt)
