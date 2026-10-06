# Teamwork Comment: Blog Article Template Verification

**Copy and paste the text below into the Teamwork task comment box for Developer Vinod Vankar (@VinodV):**

---

Hi @VinodV,

Thank you for the update. I have completed the QA verification of the **Blog Article Template** on the live US Staging environment (`mcstaging2.globewest.com`) against the approved live AU baseline (`globewest.com.au`), across both **Desktop (1440px)** and **Mobile (390px)** in headed browser mode.

The editorial layout grid, font typography (`Canela-Deck-Regular` / `TwentiethCentury`), social sharing links, and mobile responsiveness look great and match the baseline.

However, we observed **2 high-severity defects** and **2 medium presentation issues** that require your attention before sign-off:

---

### 🚨 1. Bottom Blog Slider Thumbnail Images Broken (`height: 0px`) — High
* **Observation:** In the newly added Page Builder blog slider at the bottom (`.home-page-fresh-ideas`), all 5 card thumbnail images render with `height: 0px` (computed `naturalWidth: 0`).
* **Impact:** Users see blank beige boxes with isolated floating text titles, and interactive carousel arrows do not scroll properly.
* **AU Baseline:** AU live displays loaded high-resolution blog cover photos (~260px height) with smooth hover zoom animations.
* **Action Required:** Please verify the media library paths and image attribute bindings in the Page Builder block so that thumbnail images render correctly on US Staging.
* 📸 **Side-by-Side Comparison:** Please see the attached image: `02_BOTTOM_BLOG_SLIDER_COMPARISON.png`

---

### 🚨 2. Missing Top Hero Header Banner — High
* **Observation:** On US Staging, the top full-width hero header image (`Rectangle_Copy.jpg`) directly beneath the main navigation bar is missing.
* **Impact:** The article title and breadcrumbs sit directly flush against the header navigation without visual separation.
* **AU Baseline:** All live AU blog articles feature a prominent full-width hero banner setting the magazine aesthetic.
* **Action Required:** Please include the top hero banner image container above the article title in the template layout.
* 📸 **Side-by-Side Comparison:** Please see the attached image: `01_HERO_AND_TITLE_DESKTOP_COMPARISON.png`

---

### ⚠️ 3. Article Title & Slug Contain Staging Noise — Medium
* **Observation:** The article heading displays:
  `"Stockist in Profile | IKOS Home (Duplicated) (Duplicated)"`
  and the URL slug contains encoded duplicate tokens: `-%7C-ikos-home-duplicated`.
* **Expected:** Clean title `"Stockist in Profile | IKOS Home"` matching AU.
* **Action Required:** Please sanitize the post title and URL slug in Magefan -> Posts.

---

### ⚠️ 4. Missing "Previous Article" Navigation Link — Medium
* **Observation:** The bottom article navigation bar only renders `NEXT ARTICLE →`. The reciprocal `← PREVIOUS ARTICLE` link is missing.
* **AU Baseline:** Bidirectional navigation (`← PREVIOUS ARTICLE` and `NEXT ARTICLE →`) is present on AU live posts.
* **Action Required:** Please enable bidirectional previous/next article navigation in the blog configuration.

---

### ℹ️ 5. Editorial Content Scope Note (Low)
* **Observation:** The stockist body copy currently contains Australian contact info (`Hampton VIC 3188`, `(03) 9521 0801`, `www.ikoshome.com.au`).
* **Note:** For final production launch, please coordinate with marketing to ensure US-specific stockist profiles and US phone/address formats are populated.

---

### 📁 Verification Artifacts & Test Evidence:
* **Interactive Defect Viewer:** `Sprint-3/Ticket_41794542_Blog_Article_Template/VIEW_BLOG_ARTICLE_COMPARISONS.html`
* **Side-by-Side Comparison Gallery:**
  - `01_HERO_AND_TITLE_DESKTOP_COMPARISON.png` (Hero Banner & Title)
  - `02_BOTTOM_BLOG_SLIDER_COMPARISON.png` (Bottom Slider Images)
  - `03_BLOG_ARTICLE_MOBILE_COMPARISON.png` (Mobile Viewport)
* **Test Case Matrix:** `Blog_Article_Template_Test_Cases.xlsx` (12 Test Cases)

Please let me know once the slider image paths and hero banner have been updated, and I will be happy to retest immediately!

Best regards,  
**Deepali Londhe**  
Senior QA Automation Lead
