# Ticket 4: Visual Recognition Guide — Showing vs. NOT Showing

> [!IMPORTANT]
> **Visual Recognition Principle**:
> - 🟢 **GREEN BOX (Right Side / AU Baseline)**: Shows the exact element that **IS SHOWING** (e.g. Instagram icon, `@Globewest` handle, SEO paragraphs).
> - 🔴 **RED BOX (Left Side / US Storefront)**: Shows that the exact same element **IS NOT SHOWING** (completely blank / missing / empty space).

---

## 🖼️ Master Overview Poster: Showing vs. NOT Showing

![Master Showing vs Not Showing Guide](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/MASTER_SHOWING_VS_NOT_SHOWING.png)

---

## 1. Instagram Icon, Header & Feed: Showing on AU vs. NOT Showing on US

![Instagram Icon Showing vs Not Showing](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_1_INSTAGRAM_ICON_FEED.png)

### 🔍 Exactly What to Look For:
- 🟢 **ON AU STOREFRONT (Right Side - Green Box)**:
  - **IS SHOWING**: The Instagram camera icon, the **`@Globewest`** handle, and the **`Be Inspired`** headline.
- 🔴 **ON US STOREFRONT (Left Side - Red Box)**:
  - **IS NOT SHOWING**: The Instagram icon, handle, headline, and photos are **100% ABSENT** (it is a blank empty space).
- **Reason**: The developer deployed the block code, but the US Instagram Graph API token is not yet connected.

---

## 2. SEO Text Paragraphs: Showing on AU vs. NOT Showing on US

![SEO Text Showing vs Not Showing](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_2_SEO_TEXT.png)

### 🔍 Exactly What to Look For:
- 🟢 **ON AU STOREFRONT (Right Side - Green Box)**:
  - **IS SHOWING**: **3 full paragraphs** of SEO copywriting (*"Australian Living Furniture & Homewares..."*).
- 🔴 **ON US STOREFRONT (Left Side - Red Box)**:
  - **IS NOT SHOWING**: **0 words of copy** (the PageBuilder container is completely empty).
- **Reason**: The marketing team needs to paste the US copy into `Content > Blocks > home-us-seo-text`.

---

## 3. Hero Banner CTA Link: Local Link Showing vs. US Link NOT Showing

![Hero Banner Link Showing vs Not Showing](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_3_HERO_BANNER_LINK.png)

### 🔍 Exactly What to Look For:
- 🟢 **ON AU STOREFRONT (Right Side - Green Box)**:
  - **IS SHOWING**: The button links to the local Australian catalog.
- 🔴 **ON US STOREFRONT (Left Side - Red Box)**:
  - **IS NOT SHOWING**: A US destination link is **NOT SHOWING**. Instead, it contains a hardcoded link to `https://www.globewest.com.au` (redirecting US customers to Australia).
- **Fix**: Update CTA href in block `main-us-banner` to relative path `/outdoor`.

---

## 4. Category Carousel: Local Category Paths Showing vs. US Paths NOT Showing

![Category Carousel Links Showing vs Not Showing](/home/deepali/.gemini/antigravity-ide/brain/35949052-5130-4815-b7ea-118ef98c2f2b/showing_vs_not_showing/SHOWING_VS_NOT_SHOWING_4_CATEGORY_CAROUSEL_LINKS.png)

### 🔍 Exactly What to Look For:
- 🟢 **ON AU STOREFRONT (Right Side - Green Box)**:
  - **IS SHOWING**: Category cards link within the local store catalog.
- 🔴 **ON US STOREFRONT (Left Side - Red Box)**:
  - **IS NOT SHOWING**: US catalog paths are **NOT SHOWING**. All 14 cards link directly to Australian category URLs (`https://www.globewest.com.au/indoor/...`).
- **Fix**: Change hrefs on all 14 cards in block `home-us-category-carousel` to relative paths (`/living-room`, etc.).
