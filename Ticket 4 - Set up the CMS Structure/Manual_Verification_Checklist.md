# 🛠️ Ticket 4: Manual QA Verification Checklist

**Ticket**: Ticket 4 – Set up the CMS Structure  
**Assignee**: Deepali Londhe (`@DeepaliL`)  
**Storefront Scope**: USA Website (`GlobeWest US` / `mcstaging2.globewest.com`)  
**Admin URL**: `https://mcstaging2.globewest.com.au/godmode/admin/`  

---

## 📌 Summary: What You Need to Do Manually

While our automated Playwright test suite verifies backend field values, DOM structure, and responsive layout programmatically, the following steps **require human review and manual verification**:

| Step | Action Area | What You Need To Do Manually |
| :--- | :--- | :--- |
| **1** | **Admin Configuration** | Open Magento Admin, switch to **USA Website** scope, confirm `CMS Home Page` is set to `Home page - US`, and if not already saved, select it, click **Save Config**, and flush Magento cache. |
| **2** | **Visual & Design QA** | Visually review high-resolution hero banners, typography hierarchy, image cropping, and card alignment on the US homepage. |
| **3** | **Instagram Feed Investigation** | Verify that the Instagram feed block container is present, inspect why posts do not load (e.g. missing API token / staging domain whitelist), and confirm that no ugly broken placeholders appear. |
| **4** | **US Content & Brand Integrity** | Confirm that no Australian addresses (e.g., Melbourne showroom, VIC 3204) or Australian phone numbers (`+61`, `1800`) are present in any of the new CMS blocks. |
| **5** | **Ticket Sign-off & Communication** | Attach screenshot evidence to JIRA / Slack and reply to the project team confirming that verification is complete. |

---

## 🔍 Phase 1: Magento Admin Panel Verification (Manual Steps)

### Step 1.1: Verify & Save the Home Page Configuration
1. Open your browser and go to:
   `https://mcstaging2.globewest.com.au/godmode/admin/`
2. Enter your admin credentials:
   - **Username**: `deepali.londhe@overdose.digital`
   - **Password**: *(your password)*
3. In the left navigation menu, click **Stores** > **Configuration** (under Settings).
4. Look at the top-left corner under "Configuration":
   - Click the **Scope** dropdown (defaults to "Default Config").
   - Select **USA Website** or **GlobeWest US** (Store View).
5. In the left sidebar under **General**, click **Web**.
6. Click to expand the **Default Pages** section.
7. Inspect the **CMS Home Page** field:
   - [ ] Checkbox **Use Default** must be **UNCHECKED**.
   - [ ] Dropdown must have **Home page - US** selected.
8. *If it is NOT already saved:*
   - Uncheck **Use Default**.
   - Select **Home page - US** from the dropdown.
   - Click the orange **Save Config** button in the top-right corner.
   - Go to **System** > **Tools** > **Cache Management** and click **Flush Magento Cache**.
9. **Capture Screenshot**: Take a screenshot of the `Default Pages` configuration showing `CMS Home Page: Home page - US` (similar to the screenshot shared by the team).

---

### Step 1.2: Verify CMS Page "Home page - US"
1. In the left navigation menu, click **Content** > **Pages** (under Elements).
2. In the search filters:
   - In the **URL Key** column filter, enter: `home-us`
   - Click **Apply Filters**.
3. Verify the grid row:
   - [ ] **Title**: Shows `Home page - US`
   - [ ] **URL Key**: Shows `home-us`
   - [ ] **Layout**: Shows `1 column` or `CMS Page`
   - [ ] **Status**: Shows **Enabled** (green badge)
   - [ ] **Store View**: Includes **USA Website** (or GlobeWest US)
4. Click **Select** > **Edit** on the row:
   - Expand the **Content** tab.
   - Verify PageBuilder rows contain the CMS block widgets or directives corresponding to the new blocks.
5. **Capture Screenshot**: Take a screenshot of the CMS Pages grid and the Content tab.

---

### Step 1.3: Verify All 9 CMS Blocks in Magento Admin
1. In the left navigation menu, click **Content** > **Blocks** (under Elements).
2. Check that each of the following 9 CMS blocks exists and is active:

| # | Block Identifier | Expected Title | Status | Scope / Store View | Checked (✔/✖) |
|---|:---|:---|:---:|:---:|:---:|
| 1 | `home-us-video-block-b2b` | US B2B Video Block | Enabled | USA Website | [ ] |
| 2 | `main-us-banner` | Main US Hero Banner | Enabled | USA Website | [ ] |
| 3 | `home-us-category-carousel` | US Category Carousel | Enabled | USA Website | [ ] |
| 4 | `global-us-visit-showroom` | Visit Showroom (US) | Enabled | USA Website | [ ] |
| 5 | `homepage_us_recent_articles` | Homepage Recent Articles | Enabled | USA Website | [ ] |
| 6 | `insta-us-block-home-page` | Instagram Block Home Page | Enabled | USA Website | [ ] |
| 7 | `home-us-seo-text` | Home US SEO Text | Enabled | USA Website | [ ] |
| 8 | `home-us-page-about-us` | Home US Page About Us | Enabled | USA Website | [ ] |
| 9 | `global-us-find-designer` | Find a Designer (US) | Enabled | USA Website | [ ] |

3. **Capture Screenshot**: Take a screenshot of the Blocks grid filtered for `*-us-*` or displaying these blocks.

---

## 🌐 Phase 2: US Storefront Visual & Functional Review (Manual Steps)

Navigate to the US Staging Storefront Homepage:
`https://mcstaging2.globewest.com/` (or staging host mapped to US store view).

### Step 2.1: Hero Banner (`main-us-banner`)
- [ ] Banner image displays clearly across full desktop width.
- [ ] Headline text is crisp, legible, and properly aligned.
- [ ] Click the CTA button (e.g. "Shop Now" / "Explore").
- [ ] Confirm the link stays on the US domain and goes to a valid US catalog page.

### Step 2.2: B2B Video Section (`home-us-video-block-b2b`)
- [ ] Video thumbnail / poster image loads without broken icon.
- [ ] Video playback starts when clicking play (or autoplays muted).
- [ ] Text accompanying the video speaks to trade clients / interior designers.

### Step 2.3: Category Carousel (`home-us-category-carousel`)
- [ ] Category cards (Living, Dining, Bedroom, etc.) show relevant furniture photos.
- [ ] Left and right slider arrows move cards smoothly.
- [ ] Clicking a category card navigates to the correct category on the US site.

### Step 2.4: Showroom Section (`global-us-visit-showroom`)
- [ ] Visual layout is clean and balanced.
- [ ] **Crucial Check**: Confirm NO Australian addresses appear (e.g., Melbourne Showroom in Richmond, Moore Park Sydney, etc.).
- [ ] CTA button routes to US showroom info or virtual appointment page.

### Step 2.5: Recent Articles (`homepage_us_recent_articles`)
- [ ] Article cards display titles, images, and excerpt text.
- [ ] Card images maintain consistent aspect ratios.
- [ ] Clicking an article opens the article detail page.

### Step 2.6: Instagram Feed (`insta-us-block-home-page`) - Known Limitation
- [ ] Confirm the dev team note: Posts are not currently displaying.
- [ ] Open Browser DevTools (F12) > Elements tab: Search for `insta-us-block-home-page` to confirm the container element is in the HTML.
- [ ] Open DevTools Console tab: Check if there is an error message (e.g. Instagram token expiration, CORS, or script missing).
- [ ] Confirm that the missing feed leaves a clean layout and does NOT display broken image placeholders or crash page scripts.

### Step 2.7: Brand Story & Trade CTA (`home-us-page-about-us` & `global-us-find-designer`)
- [ ] About Us copy reads naturally for the American market.
- [ ] "Find a Designer" button works and directs to designer registration or search.

### Step 2.8: SEO Text Block (`home-us-seo-text`)
- [ ] Heading and paragraph text appear above the footer.
- [ ] Text mentions GlobeWest US furniture and collections.
- [ ] No Australian corporate disclosures (no ABN, no AU GST details).

---

## 📱 Phase 3: Responsive & Cross-Device Review
1. Open Chrome DevTools and switch to Device Mode (Ctrl+Shift+M):
   - [ ] **Desktop**: 1920 x 1080 (Check wide banner alignment)
   - [ ] **Tablet**: iPad / 820 x 1180 (Check 2-column card wrapping)
   - [ ] **Mobile**: iPhone / 393 x 851 (Check 1-column stacking, hamburger menu, touch carousel swipe)
2. Verify that there is **no horizontal scrollbar** on mobile.

---

## 💬 Phase 4: Ready-to-Send Reply Template to the Team

Once you complete verification, you can copy-paste this response to the project team:

```markdown
Hi Team,

I have verified the CMS Home page setup for the US store as requested. Here is the verification summary:

✅ 1. Magento Admin Configuration:
- Stores > Configuration > General > Web > Default Pages > CMS Home Page is assigned to "Home page - US" (identifier: home-us) under the USA Website scope.
- "Use Default" is unchecked and configuration is active.

✅ 2. CMS Page & Blocks Entity Audit:
- CMS Page "Home page - US" (home-us) is Enabled and assigned to the USA Website.
- All 9 CMS blocks (main-us-banner, home-us-video-block-b2b, home-us-category-carousel, global-us-visit-showroom, homepage_us_recent_articles, insta-us-block-home-page, home-us-page-about-us, global-us-find-designer, home-us-seo-text) exist, are Enabled, and assigned to the US scope.

✅ 3. US Storefront Homepage Verification:
- Hero banner, B2B video, Category carousel, Showroom promo, Recent articles, About Us, Find a Designer, and SEO text blocks all render correctly on the US homepage.
- Verified responsive stacking across Desktop, Tablet, and Mobile viewports with zero horizontal scrolling.
- Confirmed zero Australian scope leakage (no AUD prices, Australian showroom addresses, or ABN numbers).

ℹ️ 4. Instagram Feed (insta-us-block-home-page):
- Confirmed that the block container code is present in the DOM as described.
- As noted in your update, the live Instagram post feed is currently not rendering (pending social API token / app authorization for the US domain). It degrades gracefully without breaking the layout.

Screenshot evidence and automated test logs have been archived for Ticket 4.

Thank you!
Deepali
```
