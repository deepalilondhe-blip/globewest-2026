# Sprint-3 Demo Notes: Blog Article Template (Ticket #41794542)

> **Audience:** Product Owners, Front-End Tech Leads, Solution Architects & Stakeholders  
> **Speaker / Presenter:** Deepali Londhe (Senior QA Lead)  
> **Topic:** Verification of Blog Article Template (`mcstaging2.globewest.com/blog/...`)

---

## 1. Feature Overview & Scope Delivered
* **Ticket ID:** [#41794542](https://overdose.eu.teamwork.com/app/tasks/41794542) — `Blog Article Template - P-GLW-007 Globewest US Expansion Project`
* **Assigned Developer:** Vinod Vankar
* **Objective:** Establish the dedicated US Blog Article Template via Magefan Page Builder, matching the live AU editorial layout, incorporating the bottom blog slider (`.home-page-fresh-ideas`), and validating mobile responsiveness and WCAG 2.2 AA accessibility.

---

## 2. Live Sprint Demo Walkthrough Script (Step-by-Step)

### Step 1: Desktop First Impression & Editorial Layout (1440×900)
1. **Action:** Open `https://mcstaging2.globewest.com/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated` in Chrome.
2. **Talking Points:**
   - Notice the editorial 2-column layout matching the Australian lifestyle publication design.
   - Typography uses the approved brand serif font (`Canela-Deck-Regular`) for headings with clean line-height and letter spacing.
   - Responsive featured photography renders crisply on the left with interview copy and stockist profile on the right.
   - Social sharing icons (Facebook, Pinterest, X, Email) are present and properly positioned below the body copy.

### Step 2: Dual-Auth Matrix (Guest vs Logged-In Trade Customer)
1. **Action:** Highlight header utility bar in public browsing mode, then toggle authenticated trade session.
2. **Talking Points:**
   - **Guest Browsing Mode:** Public browsing mode masks trade wholesale pricing and preserves trade login CTAs.
   - **Trade Session:** Authenticated trade customer session cleanly mounts the **Trade Pricing Toggle** in the header without disrupting the blog layout or causing layout shifts.

### Step 3: Mobile Responsiveness (390×844 iPhone 14/15)
1. **Action:** Toggle viewport to mobile 390×844.
2. **Talking Points:**
   - Verified **zero horizontal scroll overflow** (`document.documentElement.scrollWidth === clientWidth`).
   - Editorial columns collapse into an intuitive single-column reading stack.

---

## 3. QA Defect Callouts & Action Items for Engineering

QA has flagged **2 high-severity defects** and **2 medium issues** preventing sign-off:

1. 🔴 **Bottom Blog Slider Images Collapsed (`height: 0px`):**
   - In the newly added Page Builder blog slider at the bottom (`.home-page-fresh-ideas`), all 5 card thumbnail images render with `height: 0px` (`naturalWidth: 0`), leaving blank beige boxes. Media paths in Page Builder must be re-linked to active staging assets.
2. 🔴 **Missing Top Hero Header Banner:**
   - AU Live displays a full-width hero header image (`Rectangle_Copy.jpg`) directly beneath the main navigation bar. On US Staging, this top hero image is completely absent, causing the title to sit flush against the header.
3. ⚠️ **Staging Title & Slug Artifacts:**
   - Article title displays `"Stockist in Profile | IKOS Home (Duplicated) (Duplicated)"` and URL slug contains `-%7C-ikos-home-duplicated`. Needs sanitization to clean title.
4. ⚠️ **Missing "Previous Article" Reciprocal Navigation:**
   - Bottom navigation only renders `NEXT ARTICLE →`; the reciprocal `← PREVIOUS ARTICLE` link present on AU is missing.

---

## 4. Verification Evidence & Artifacts

* **Interactive Browser Defect Gallery:** `Sprint-3/Ticket_41794542_Blog_Article_Template/VIEW_BLOG_ARTICLE_COMPARISONS.html`
* **Test Case Matrix:** `Blog_Article_Template_Test_Cases.xlsx` (12 Test Cases)
* **Side-by-Side Red/Green Visuals:**
  - `01_HERO_AND_TITLE_DESKTOP_COMPARISON.png` (Top Hero & Title)
  - `02_BOTTOM_BLOG_SLIDER_COMPARISON.png` (Bottom Slider Broken Thumbnails)
  - `03_BLOG_ARTICLE_MOBILE_COMPARISON.png` (Mobile Viewport)
