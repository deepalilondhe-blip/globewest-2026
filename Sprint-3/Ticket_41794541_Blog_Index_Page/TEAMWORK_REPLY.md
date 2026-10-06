# QA Defect Audit Report: Ticket #41794541 - Blog Index Page

| Audit Scope | Details |
|---|---|
| **Ticket Reference** | [#41794541 - Blog Index Page](https://overdose.eu.teamwork.com/app/tasks/41794541) |
| **Tested Target (US)** | `https://mcstaging2.globewest.com/blog` (🔴 **RED**) |
| **Baseline Reference (AU)** | `https://www.globewest.com.au/blog` (🟢 **GREEN**) |
| **Audited Viewports** | 🖥️ Desktop (1440 × 900) & 📱 Mobile (390 × 844) |
| **Assigned Developer** | Vinod Vankar |
| **QA Verdict** | ⚠️ **4 Defects / Mismatches Identified** |

---

## 📋 Executive Defect Summary Table

| # | Defect Summary | Severity | Expected (AU Baseline) | Actual (US Live Staging) | Status |
|:---|:---|:---:|:---|:---|:---:|
| **1** | **Hero "News" Background Color Mismatch** | **P2 - Medium** | Light beige / sand background (`#cdc1ab`) | Dark chocolate brown background (`#381c12`) | 🔴 **DEFECT** |
| **2** | **AU TV & Holiday Category Tags in Filter Toolbar** | **P2 - Medium** | Standard relevant blog categories | Renders `"THE BLOCK"` (AU TV series) & `"HOLIDAY CLOSURE"` tabs | 🔴 **SCOPE LEAK** |
| **3** | **Grid Article Cards Render Blurred Placeholders** | **P2 - Medium** | Crisp high-resolution lifestyle interior photography | Lower grid cards display blurred placeholder / default assets | 🔴 **ASSET DEFECT** |
| **4** | **Header Wishlist Heart Icon Missing** | **P3 - Low** | Wishlist heart icon (`♡`) pinned next to shopping cart | Wishlist heart icon omitted from the header utility section | 🔴 **UI DEFECT** |

---

## 🔍 Detailed Defect Breakdown

### 1. 🎨 Defect 1: Hero Banner "News" Background Color Mismatch
* **Component**: `.blog-hero-title` / Left Header Block
* **Expected (AU Baseline - 🟢 Green)**: The left title block displaying *"News"* has a light sand/beige background (`#cdc1ab` / `rgb(205, 193, 171)`).
* **Actual (US Staging Live - 🔴 Red)**: The background renders as dark chocolate brown (`#381c12` / `rgb(56, 28, 18)`), creating inconsistent branding across breakpoints.

---

### 2. 🏷️ Defect 2: Australian Category Scope Leakage in Filter Toolbar
* **Component**: `.blog-categories-nav` / Filter Tabs
* **Expected (AU Baseline - 🟢 Green)**: Filter navigation includes active editorial categories (*All Articles, Style Tips, Stockist in Profile, Home Tour, Galleries, Projects, Designer in Profile, Women in Design*).
* **Actual (US Staging Live - 🔴 Red)**: US filter toolbar displays Australian-specific tags including `"THE BLOCK"` (an Australian TV renovation show) and `"HOLIDAY CLOSURE"`, which are irrelevant for the US audience.

---

### 3. 🖼️ Defect 3: Grid Article Cards Render Blurred Default Placeholder Thumbnails
* **Component**: `.blog-post-card .post-thumbnail`
* **Expected (AU Baseline - 🟢 Green)**: Every blog post card in the grid renders crisp, high-resolution photography.
* **Actual (US Staging Live - 🔴 Red)**: Multiple secondary cards in the grid display low-resolution, blurred grey/black placeholder images pending catalog sync.

---

### 4. 🤍 Defect 4: Global Wishlist Heart Icon Missing from Header
* **Component**: Global Header (`.header-utility-icons`)
* **Expected (AU Baseline - 🟢 Green)**: Heart icon (`♡`) is displayed between the search bar and the shopping bag icon.
* **Actual (US Staging Live - 🔴 Red)**: Only the Search and Cart icons are rendered; the Wishlist heart trigger is absent.

---

## 💬 Ready-to-Send Teamwork Comment for Developer

```text
Hi @VinodV,

I have completed the QA verification for the Blog Index Page (Ticket #41794541) on live staging (https://mcstaging2.globewest.com/blog) against the AU live baseline (https://www.globewest.com.au/blog) on both Desktop and Mobile viewports.

Please review the following observations:

1. Hero "News" Panel Background Color:
   • The left "News" title block renders with a dark brown background (#381c12) on US Staging, whereas the AU baseline uses a light beige background (#cdc1ab).

2. Category Filter Navigation (AU Scope Tags):
   • The filter toolbar on US Staging includes Australian-specific tags: "THE BLOCK" and "HOLIDAY CLOSURE". Please review if these should be excluded for the US store view.

3. Article Card Thumbnail Assets:
   • Several secondary article cards in the blog grid are rendering blurred placeholder images instead of final article photography.

4. Header Wishlist Icon:
   • The Wishlist heart icon (♡) is missing next to the shopping bag in the global header.

Side-by-side comparison proofs (Desktop & Mobile) are attached for your reference.

Kind regards,  
Deepali Londhe  
QA Lead
```
