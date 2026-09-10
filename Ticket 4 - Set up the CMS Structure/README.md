# 🏷️ Ticket 4: Set up the CMS Structure

**Parent Epic**: GlobeWest US B2B Storefront Expansion  
**Environment**: Staging 2 (`https://mcstaging2.globewest.com.au` / `https://mcstaging2.globewest.com`)  
**Assigned QA**: Deepali Londhe (`@DeepaliL`)  
**Status**: Ready for Verification & Testing  

---

## 📌 1. What is Mentioned in the Team Update? (Full Breakdown)

The team shared an important milestone update regarding the **US Storefront CMS Home Page & Blocks Setup**:

### 1.1 Unblocking from Adobe Team
* **Background**: The setup was previously blocked pending technical guidance/solution from the Adobe Commerce team.
* **Resolution**: The Adobe team provided the solution, and the team is now **fully unblocked** and has implemented the foundation.

### 1.2 New CMS Home Page Created
* **Page Title**: `Home page - US`
* **URL Key / Identifier**: `home-us`
* **Store Scope Assignment**: Assigned strictly to the **USA Website** (`GlobeWest US`).
* **Purpose**: Serves as the dedicated, localized homepage for American B2B customers, completely decoupled from the Australian homepage.

### 1.3 Nine (9) New CMS Blocks Created for the US Store
To facilitate easy content updates, modular marketing campaigns, and independent maintenance without altering code, the dev team created 9 dedicated CMS blocks:

| # | Block Identifier | Block Purpose / Placement | Expected Content / Behavior |
|---|:---|:---|:---|
| 1 | `main-us-banner` | **Section 1: Hero Banner** (Top of page) | High-impact promotional hero banner, seasonal campaign imagery, H1 header, and CTA linking to US catalog. |
| 2 | `home-us-video-block-b2b` | **Section 2: B2B Brand Video** | Video module highlighting GlobeWest craftsmanship, bespoke capabilities, and commercial interior design expertise. |
| 3 | `home-us-category-carousel` | **Section 3: Category Carousel** | Interactive slider showcasing key US furniture categories (Living, Dining, Bedroom, Outdoor) with quick-access links. |
| 4 | `global-us-visit-showroom` | **Section 4: Showroom Promo** | Promotional module encouraging showroom visits or virtual consultations for US trade clients (must NOT show AU addresses). |
| 5 | `homepage_us_recent_articles` | **Section 5: Recent Articles / Journal** | Editorial design journal cards, styling tips, and trend articles tailored for the US market. |
| 6 | `insta-us-block-home-page` | **Section 6: Instagram Social Feed** | Social gallery block. *(See Known Limitation below)*. |
| 7 | `home-us-page-about-us` | **Section 7: About Us Brand Story** | Brand heritage narrative, design philosophy, and trade dedication introducing GlobeWest to US designers. |
| 8 | `global-us-find-designer` | **Section 8: Find a Designer CTA** | Call-to-action connecting trade professionals, hospitality specifiers, and interior designers. |
| 9 | `home-us-seo-text` | **Section 9: SEO Keyword Block** (Above Footer) | Keyword-rich copy optimized for US search engines (luxury wholesale furniture, trade discounts, US delivery). |

### 1.4 Known Issue / Dev Team Note: Instagram Feed Block
* **Dev Note**: *"The Insta feed block section isn't currently showing on the site — we've already added the code for it as per the AU site."*
* **What this means**: The block template and container code have been deployed into Magento, but live Instagram photos are not rendering yet. This typically happens because third-party social feed widgets (e.g. Meta Graph API, Elfsight, SmashBalloon) require an active Access Token or domain authorization specifically registered for `mcstaging2.globewest.com`.
* **QA Action**: Confirm that the block exists in the DOM, that the feed does **not** cause visual bugs or fatal JavaScript errors, and log this as an expected dependency for token activation.

### 1.5 Configuration Instructions
* **Admin Path**:
  `Magento Admin > Stores > Configuration > General > Web > Default Pages > CMS home page > Home page - US`
* **Configuration State**: Set to `Yes` (active under the US scope).
* **Screenshot Provided**: Confirms that under the US store view scope, `CMS Home Page` is selected as `Home page - US` and `Use Default` is unchecked.

---

## 🛠️ 2. What Deepali Needs to Do: Manual vs. Automation Breakdown

### A. What Needs to be Done MANUALLY (Human / Physical QA)
1. **Verify Configuration in Admin Panel**:
   - Log into Magento Admin: `https://mcstaging2.globewest.com.au/godmode/admin/`
   - Navigate to `Stores > Configuration > General > Web > Default Pages`.
   - Switch scope to **USA Website** / **US Store View**.
   - Verify that `Use Default` is **unchecked** and `CMS Home Page` is set to **`Home page - US`**.
   - *If not already saved*: Select `Home page - US`, click **Save Config**, and flush cache via `System > Cache Management > Flush Magento Cache`.
2. **Visual & Aesthetic Review (Figma / Design Parity)**:
   - Check banner typography, high-resolution imagery, and padding/margins.
   - Verify that hero imagery does not stretch or pixelate on high-DPI displays.
3. **Instagram Feed Investigation**:
   - Inspect the block in DevTools to confirm whether it renders an empty container or throws a console error (e.g., expired token, CORS origin).
   - Ensure the empty space does not leave an awkward gaping white space or broken layout.
4. **Content & Localization Sanity Check**:
   - Ensure no Australian phone numbers (`+61`, `1800`), Australian postcodes, or Australian showroom addresses appear in the new US blocks.
5. **Stakeholder Communication**:
   - Reply to the team / JIRA ticket with verification findings using the provided template.

---

### B. What is AUTOMATED via Playwright
We have built an automated test suite covering all functional and structural checks:
1. **Admin Configuration Assertion**: Automatically logs into Magento Admin, navigates to Web configuration, switches to US scope, and verifies `CMS Home Page` equals `Home page - US`.
2. **CMS Page Entity Verification**: Automatically queries `Content > Pages` to assert `home-us` is **Enabled** and assigned to **USA Website**.
3. **All 9 CMS Blocks Audit**: Automatically searches and verifies the status of all 9 CMS blocks in `Content > Blocks`.
4. **Storefront DOM & Visibility Check**: Automatically loads the US homepage and checks that the containers for all 9 blocks exist.
5. **Instagram Feed Graceful Degradation Check**: Validates DOM existence and logs visibility without failing the build.
6. **Responsive Layout Check**: Loads the US homepage under Desktop (1920x1080), Tablet (820x1180), and Mobile (393x851), asserting zero horizontal scroll overflow.
7. **Australian Scope Leakage Detection**: Scans the page text using regex to ensure no Australian keywords (`AUD`, `$AU`, `ABN`, `VIC 3204`) leak onto the US homepage.
8. **Automated Screenshot Evidence**: Automatically captures full-page and component screenshots saved to `screenshots/`.

---

## 🚀 3. How to Run the Automated Suite

### Option 1: Direct Script Runner
### Option 1: Live Interactive Flow with Visual Highlighting (Headed Mode)
Watch the browser automatically scroll through the homepage, highlighting each CMS section with an animated neon border and floating badge tag, and flashing links in green:
```bash
npm run test:ticket4:functional
```

### Option 2: Run Full Suite Headed (Watch Entire Test Suite)
```bash
npm run test:ticket4:headed
```

### Option 3: Run Full Suite Headless
```bash
npm run test:ticket4
```

### Option 4: One-Click Shell Runner
```bash
bash "Ticket 4 - Set up the CMS Structure/run_ticket4_test.sh"
```

---

## 🎨 Visual Highlighting & Flow Verification
When running in headed mode (`npm run test:ticket4:functional`), the script executes in the natural top-to-bottom flow of the page:
1. **Flow 1/9 [Hero Banner]**: Scrolls to top, highlights banner with `🏷️ [1/9] Hero Banner`, flashes CTA link in neon cyan, and validates destination URL.
2. **Flow 2/9 [B2B Video]**: Scrolls down, highlights video container with `🏷️ [2/9] B2B Video Block`, and inspects player controls.
3. **Flow 3/9 [Category Carousel]**: Highlights category carousel container with `🏷️ [3/9] Category Carousel`, then highlights and tests category cards one-by-one.
4. **Flow 4/9 [Visit Showroom]**: Scrolls down, highlights showroom promo with `🏷️ [4/9] Visit Showroom Promo`, and flashes booking CTA.
5. **Flow 5/9 [Recent Articles]**: Highlights editorial journal with `🏷️ [5/9] Recent Articles Journal`, and inspects article cards.
6. **Flow 6/9 [Instagram Feed]**: Highlights Instagram social block with `🏷️ [6/9] Instagram Feed Block`, confirming graceful degradation.
7. **Flow 7/9 [About Us]**: Highlights brand narrative with `🏷️ [7/9] About Us Brand Story`, asserting copy length and formatting.
8. **Flow 8/9 [Find a Designer]**: Highlights designer section with `🏷️ [8/9] Find a Designer CTA`, and flashes designer CTA button.
9. **Flow 9/9 [SEO Text]**: Scrolls to bottom above footer, highlights `🏷️ [9/9] SEO Text Content`.

---

## 📁 4. Folder File Structure

```
Ticket 4 - Set up the CMS Structure/
├── README.md                               # Complete Ticket Overview & Technical Breakdown
├── Manual_Verification_Checklist.md        # Step-by-Step Manual QA Checklist & Ready-to-Send Reply
├── Ticket4_US_CMS_Structure_TestCases.md   # Detailed Test Cases Catalog (TC-US-CMS-01 to TC-US-CMS-13)
├── Ticket4_US_CMS_Structure_TestCases.csv  # CSV Test Matrix for Excel/Google Sheets
├── Ticket4_US_CMS_Structure_TestCases.xlsx # Formatted 3-Sheet Excel Workbook
├── generate_ticket4_xlsx.js                # Generation script for Excel & CSV
├── ticket4-us-cms-structure.spec.js        # Full Playwright Test Suite
├── run_ticket4_test.sh                     # One-click execution script
└── screenshots/                            # Directory for test evidence captures
```

---

## 📊 5. Test Case Matrix Summary

| Test ID | Test Title | Priority | Scope | Type | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-US-CMS-01** | Verify CMS Home Page Assignment in Admin Store Configuration | P1 | Admin | Configuration | READY |
| **TC-US-CMS-02** | Verify CMS Page `Home page - US` (`home-us`) in Content > Pages | P1 | Admin | CMS Entity | READY |
| **TC-US-CMS-03** | Verify All 9 CMS Blocks Exist & Enabled in Content > Blocks | P1 | Admin | CMS Blocks | READY |
| **TC-US-CMS-04** | US Storefront: Hero Banner (`main-us-banner`) Rendering | P1 | Storefront | Component | READY |
| **TC-US-CMS-05** | US Storefront: B2B Video Block (`home-us-video-block-b2b`) Rendering | P2 | Storefront | Media | READY |
| **TC-US-CMS-06** | US Storefront: Category Carousel (`home-us-category-carousel`) Rendering | P1 | Storefront | Navigation | READY |
| **TC-US-CMS-07** | US Storefront: Visit Showroom Block (`global-us-visit-showroom`) Rendering | P2 | Storefront | Promo / Scope | READY |
| **TC-US-CMS-08** | US Storefront: Recent Articles Block (`homepage_us_recent_articles`) Rendering | P2 | Storefront | Editorial | READY |
| **TC-US-CMS-09** | US Storefront: Instagram Block (`insta-us-block-home-page`) Known Limitation | P2 | Storefront | Social Widget | READY |
| **TC-US-CMS-10** | US Storefront: About Us Brand Story (`home-us-page-about-us`) Rendering | P2 | Storefront | Brand | READY |
| **TC-US-CMS-11** | US Storefront: Find a Designer CTA (`global-us-find-designer`) Rendering | P2 | Storefront | Conversion | READY |
| **TC-US-CMS-12** | US Storefront: SEO Text Block (`home-us-seo-text`) Rendering | P3 | Storefront | SEO | READY |
| **TC-US-CMS-13** | US Storefront: Responsive Layout & Zero AU Scope Leakage | P1 | Storefront | Cross-Device | READY |
