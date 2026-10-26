# Senior QA Defect Audit Report: Ticket #41794542 (Blog Article Template)

| Document Metadata | Details |
|---|---|
| **Ticket Reference** | **P-GLW-007 Globewest US Expansion Project / Front End Development: Blog Article Template** |
| **Teamwork Task ID** | [#41794542](https://overdose.eu.teamwork.com/app/tasks/41794542) |
| **Assigned Developer** | Vinod Vankar (`@VinodV`) |
| **QA Lead / Reporter** | Deepali Londhe (`@DeepaliL`) |
| **Target Tested URL** | `https://mcstaging2.globewest.com/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated` |
| **Baseline Environment**| `https://www.globewest.com.au/blog/stockist-in-profile/stockist-in-profile-ikos-home`<br>`https://www.globewest.com.au/blog/designer-in-profile/designer-in-profile-studio-yugen` |
| **Execution Standard** | **Headed Chrome Mode** across **Desktop (1440×900)** and **Mobile (390×844)** |
| **Visual Evidence Standard** | 🟢 **Green Border/Badge**: Approved AU Live Baseline<br>🔴 **Red Border/Badge**: Confirmed Live US Staging Defects |
| **Audit Status** | **6 Features Verified (PASS 🟢)** \| **5 Defects Flagged (2 High, 2 Medium, 1 Low 🔴)** |

---

## 1. Executive Summary & Defect Table

```
┌────┬─────────────────────────────┬──────────┬─────────────────────────────┬────────────────────────────────────────────────────────┬───────────────┐
│ #  │ Feature / Component         │ Severity │ Defect Type                 │ Key Impact                                             │ Status        │
├────┼─────────────────────────────┼──────────┼─────────────────────────────┼────────────────────────────────────────────────────────┼───────────────┤
│ 01 │ Bottom Blog Slider          │ P1 - High│ Broken 0px Thumbnail Images │ In .home-page-fresh-ideas, all 5 cards render 0px height│ 🔴 FAIL       │
│ 02 │ Top Hero Header Banner      │ P1 - High│ Missing Asset / Structure   │ Top full-width hero image absent beneath nav header    │ 🔴 FAIL       │
│ 03 │ Article Title & URL Slug    │ P2 - Med │ Staging Noise Artifacts     │ Title shows "(Duplicated) (Duplicated)"; slug messy   │ 🔴 FAIL       │
│ 04 │ Post Navigation Bar         │ P2 - Med │ Missing Reciprocal Link     │ "PREVIOUS ARTICLE" button missing; only NEXT present   │ 🔴 FAIL       │
│ 05 │ Article Body Copy           │ P3 - Low │ Australian Scope Leaks      │ Stockist info references VIC 3188, (03) phone, .com.au │ ⚠️ CONTENT    │
└────┴─────────────────────────────┴──────────┴─────────────────────────────┴────────────────────────────────────────────────────────┴───────────────┘
```

---

## 2. Confirmed Defect Catalog (Live Staging vs. Approved AU Baseline)

### 🚨 Defect 01: Bottom Blog Slider Renders 0px Height Broken Thumbnails (`.home-page-fresh-ideas`)
* **Severity:** **P1 — High (Visual Collapse & Interactive Defect)**
* **Component:** Bottom Article Page Builder Block (`.home-page-fresh-ideas` / Blog Carousel)
* **Approved AU Live Baseline:**
  - The bottom blog slider displays 4–5 cards simultaneously with rich high-resolution photography (`aspect-ratio: ~4/3`, height ~260px–300px), card titles, and category tags.
  - Hovering over a card triggers a smooth micro-zoom transition.
  - Slick arrows slide effortlessly through recent posts.
* **Live US Staging Actual:**
  - The newly added blog slider block renders, but all 5 card thumbnail `<img>` elements collapse to **`height: 0px`** (computed `naturalWidth: 0`).
  - Visitors see blank beige boxes with isolated floating text labels.
  - The slider track height collapses and interactive arrows do not scroll properly due to missing image dimensions.
* **Visual Evidence:**
  - Side-by-side comparison: [02_BOTTOM_BLOG_SLIDER_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/comparison/02_BOTTOM_BLOG_SLIDER_COMPARISON.png)
* **Remediation:**
  - Inspect Magefan Page Builder configuration for `.home-page-fresh-ideas`. Ensure the post thumbnail media paths are linked to valid US staging media library images rather than unmigrated or unindexed AU image URLs.

---

### 🚨 Defect 02: Missing Top Hero Header Banner
* **Severity:** **P1 — High (Structural Layout Parity Defect)**
* **Component:** Top Hero Section (Directly under Header Navigation)
* **Approved AU Live Baseline:**
  - All blog articles on AU Live feature a prominent, full-width hero header image (`Rectangle_Copy.jpg` / full-bleed header banner) immediately below the main site navigation.
  - This provides visual breathing room and sets the editorial magazine tone before the article title appears.
* **Live US Staging Actual:**
  - The top hero image is completely absent on US Staging.
  - The article title container and breadcrumbs sit directly flush beneath the navigation header with 0px top banner separation.
* **Visual Evidence:**
  - Side-by-side comparison: [01_HERO_AND_TITLE_DESKTOP_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/comparison/01_HERO_AND_TITLE_DESKTOP_COMPARISON.png)
* **Remediation:**
  - Add the top hero banner image block into the template structure above the breadcrumbs/post title to match the AU live layout.

---

### 🚨 Defect 03: Title & URL Slug Display Staging Artifacts
* **Severity:** **P2 — Medium (Staging Pollution / Presentation Defect)**
* **Component:** Article `<h1>` Heading and URL Slug
* **Approved AU Live Baseline:**
  - Title: `"Stockist in Profile | IKOS Home"`
  - Clean URL: `/blog/stockist-in-profile/stockist-in-profile-ikos-home`
* **Live US Staging Actual:**
  - Title displays: `"Stockist in Profile | IKOS Home (Duplicated) (Duplicated)"`
  - URL slug contains: `/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated`
* **Visual Evidence:**
  - Side-by-side comparison: [01_HERO_AND_TITLE_DESKTOP_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/comparison/01_HERO_AND_TITLE_DESKTOP_COMPARISON.png)
* **Remediation:**
  - In Magefan Admin -> Posts, edit the post title to remove `(Duplicated) (Duplicated)` and sanitize the URL-Key.

---

### 🚨 Defect 04: Missing "Previous Article" Reciprocal Navigation
* **Severity:** **P2 — Medium (Functional Post Navigation Defect)**
* **Component:** Article Bottom Navigation (`.post-nav` / Next-Prev Bar)
* **Approved AU Live Baseline:**
  - AU Live articles render both `← PREVIOUS ARTICLE` and `NEXT ARTICLE →` controls, allowing users to browse sequentially in both directions.
* **Live US Staging Actual:**
  - US Staging only renders `NEXT ARTICLE →`. The reciprocal `← PREVIOUS ARTICLE` link is absent, breaking circular post exploration.
* **Remediation:**
  - Verify post order and ensure bidirectional previous/next post links are enabled in the Magefan Blog configuration.

---

### ⚠️ Defect 05: Editorial Content Australian Localization Leaks
* **Severity:** **P3 — Low (Editorial Content Scope)**
* **Component:** Article Body Text & Contact Sidebar
* **Observed Content:**
  - Address: `Hampton VIC 3188` (Australia)
  - Phone: `(03) 9521 0801` (Melbourne area code)
  - Website: `www.ikoshome.com.au`
* **Recommendation:**
  - Inform content/marketing team to supply US-specific stockist profiles and US phone/address formats prior to public launch.

---

## 3. Verified Features Catalog (PASS 🟢)

### ✅ Feature 1: Core Typography & Heading Hierarchy
* **Status:** 🟢 **PASS**
* **Verification:** The article title correctly uses `Canela-Deck-Regular`, `font-size: 32px`, `font-weight: 400`, perfectly matching the AU live design token. Paragraph body text uses `TwentiethCentury-Book` (`font-size: 16px`, `line-height: 26px`), maintaining high editorial readability.

### ✅ Feature 2: Editorial 2-Column Responsive Layout
* **Status:** 🟢 **PASS**
* **Verification:** The 2-column Page Builder layout (large featured photography on the left, Q&A interview text on the right) matches AU spacing with clean internal margins and proper column division.

### ✅ Feature 3: Social Sharing Integration
* **Status:** 🟢 **PASS**
* **Verification:** Post sharing icons (Facebook, Pinterest, X/Twitter, Mail) render beneath the article with clean SVG vectors, hover states, and functional share dialogue endpoints.

### ✅ Feature 4: Dual-Auth Matrix Verification
* **Status:** 🟢 **PASS**
* **Verification:**
  - **Guest User (Logged Out):** Header utility bar renders `"Become a Trade Customer"` and `"Ready to Buy"`; trade pricing is strictly hidden.
  - **Trade Customer (`deepali.londhe@overdose.digital`):** Header reveals Trade Pricing Toggle (`Trade ⌵` / `MSRP ⌵`) without causing horizontal layout shifts or clipping the blog template.

### ✅ Feature 5: Cross-Viewport Mobile Responsiveness (390×844)
* **Status:** 🟢 **PASS**
* **Verification:** Responsive DOM audit verified `document.documentElement.scrollWidth === clientWidth` (390px) with **0px horizontal overflow**. Layout gracefully collapses into a single-column flow on mobile.
* **Evidence:** [03_BLOG_ARTICLE_MOBILE_COMPARISON.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/comparison/03_BLOG_ARTICLE_MOBILE_COMPARISON.png)

### ✅ Feature 6: WCAG 2.2 AA Accessibility Compliance
* **Status:** 🟢 **PASS**
* **Verification:** Heading tags maintain strict hierarchy (single `<h1>` for article title, followed by `<h2>`/`<h3>` for subheadings). Contrast ratio between charcoal text (`#222`) and beige background (`#f9f7f4`) exceeds `7:1`, surpassing WCAG 2.2 AA standard of `4.5:1`.

---

## 4. Deliverables & Artifacts Index

| Deliverable | Location / Clickable Link | Format / Purpose |
|---|---|---|
| **Run Command Reference** | [Blog Article Template runcommand.txt](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/Blog%20Article%20Template%20runcommand.txt) | Mandatory 4-item CLI file |
| **Excel Test Cases** | [Blog_Article_Template_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/Blog_Article_Template_Test_Cases.xlsx) | Full QA Test Matrix (12 Test Cases) |
| **CSV Test Cases** | [Blog_Article_Template_Test_Cases.csv](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/Blog_Article_Template_Test_Cases.csv) | Machine-readable Test Case Catalog |
| **Visual Evidence Gallery**| [VIEW_BLOG_ARTICLE_COMPARISONS.html](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/VIEW_BLOG_ARTICLE_COMPARISONS.html) | Interactive Browser Defect Gallery |
| **Teamwork Reply** | [TEAMWORK_REPLY.md](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/TEAMWORK_REPLY.md) | Ready-to-Post Comment for Vinod Vankar |
| **Sprint Demo Notes** | [SPRINT_DEMO_NOTES.md](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/SPRINT_DEMO_NOTES.md) | Presentation Script for Sprint Review |
| **Comparison Generator**| [generate_side_by_side_comparisons.py](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20%282%29/Sprint-3/Ticket_41794542_Blog_Article_Template/scripts/generate_side_by_side_comparisons.py) | Pillow Red/Green Image Generator |

---

*Report Compiled by:* **Deepali Londhe** — Senior QA Automation Lead, GlobeWest US Expansion Project  
*Date of Execution:* **October 5, 2026**
