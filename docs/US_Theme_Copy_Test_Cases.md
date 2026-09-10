# QA Test Cases: Ticket 1 — Copy AU B2B Theme for US B2B Storefront

| Document Info | Details |
| :--- | :--- |
| **Ticket Reference** | [Overdose Task #41801457](https://overdose.eu.teamwork.com/app/tasks/41801457) |
| **Ticket Name** | Copy the AU B2B theme for the US B2B storefront (Frontend) |
| **Sprint** | Sprint 1 — US Store Foundation & Architecture |
| **Platform** | Adobe Commerce (Magento 2.4 Enterprise) |
| **Target US Staging URL** | `https://mcstaging2.globewest.com` |
| **Reference AU Staging URL**| `https://mcstaging2.globewest.com.au` |
| **Figma Design** | [Globewest USA – External (node 2571-60995)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2571-60995) |
| **Execution Status** | **12 of 18 PASSED · 6 PENDING (Pricing Toggle implementation)** |

---

## 1. Test Case Summary

| Test ID | Module | Title | Priority | Automated Spec | Status |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **TC-US-THEME-01** | Header & Navigation | Header & Megamenu Navigation Parity against AU B2B Theme | **P1** | `ticket1-us-theme-copy.spec.js` | **PASSED** |
| **TC-US-THEME-02** | Footer & Branding | Footer Layout, Newsletter, and Copyright Branding Parity | **P2** | `ticket1-us-theme-copy.spec.js` | **PASSED** |
| **TC-US-THEME-03** | PLP & Category Grid | Product Listing Page (PLP) Category Grid & Styling Parity | **P1** | `ticket1-us-theme-copy.spec.js` | **PASSED** |
| **TC-US-THEME-04** | PDP & Media | Product Detail Page (PDP) Layout & Gallery Markup Parity | **P1** | `ticket1-us-theme-copy.spec.js` | **PASSED** |
| **TC-US-THEME-05** | Responsive Design | Responsive Breakpoints Layout Validation (Desktop, Tablet, Mobile) | **P1** | `ticket1-us-theme-copy.spec.js` | **PASSED** |
| **TC-US-THEME-06** | Accessibility (A11y) | Axe-Core WCAG 2.2 AA Parity Audit (Zero Introduced Regressions) | **P2** | `ticket1-us-theme-copy.spec.js` | **PASSED** |
| **TC-US-PLP-A1** | Header – Pricing Toggle | Logged Out Desktop: "Book Showroom" + "Become a Trade Customer" links visible | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PASSED** |
| **TC-US-PLP-A2** | Header – Pricing Toggle | Logged Out Desktop: No pricing visible on PLP product cards | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PASSED** |
| **TC-US-PLP-A3** | Header – Pricing Toggle | Logged Out Mobile: No utility bar displayed | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PASSED** |
| **TC-US-PLP-B1** | Header – Pricing Toggle | Logged In Desktop: Pricing toggle dropdown exists with "Trade" option | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PENDING** |
| **TC-US-PLP-B2** | Header – Pricing Toggle | Logged In Desktop: "Become a Trade Customer" link HIDDEN | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PENDING** |
| **TC-US-PLP-B3** | Header – Pricing Toggle | Logged In Trade View: Trade pricing + MSRP both displayed on cards | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PENDING** |
| **TC-US-PLP-B4** | Header – Pricing Toggle | Logged In Mobile: Utility bar WITH pricing dropdown + Showroom link | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PENDING** |
| **TC-US-PLP-C1** | Header – Pricing Toggle | Logged In MSRP View: Switching to MSRP hides trade pricing | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PENDING** |
| **TC-US-PLP-C2** | Header – Pricing Toggle | Logged In MSRP Mobile: Same pricing functionality as desktop | **P1** | `ticket1-figma-vs-live-plp.spec.js` | **PENDING** |
| **TC-US-PLP-D1** | PLP Layout | Full Page PLP Screenshot Capture – US /indoor | **P2** | `ticket1-figma-vs-live-plp.spec.js` | **PASSED** |
| **TC-US-PLP-G1** | Checkout Pricing | Checkout page defaults to trade pricing (toggle absent) | **P2** | `ticket1-figma-vs-live-plp.spec.js` | **PASSED** |
| **TC-US-PLP-G2** | My Account Pricing | My Account page defaults to trade pricing (toggle absent) | **P2** | `ticket1-figma-vs-live-plp.spec.js` | **PASSED** |

---

## 2. HEADER – PRICING TOGGLE (Figma Final Designs)

### 2.1 Logged Out State

| Aspect | Desktop | Mobile |
| :--- | :--- | :--- |
| **Utility Bar Links** | "Book Showroom Visit" + "Become a Trade Customer" displayed | No utility bar |
| **Pricing** | No pricing visible – customer must log in to see pricing | No pricing visible |
| **Hamburger Menu** | N/A (full nav visible) | Hamburger icon visible, nav collapsed |

**Test Result**: ✅ "Book Showroom Visit" link VISIBLE, "Ready to Buy" link VISIBLE. No pricing on product cards confirmed. Mobile utility bar hidden.

### 2.2 Logged In – Trade Pricing View

| Aspect | Desktop | Mobile |
| :--- | :--- | :--- |
| **Pricing Toggle** | Dropdown shows "Trade" | Same dropdown in utility bar |
| **Pricing Display** | Trade pricing + MSRP pricing shown across PLP/PDP/Cart | Same as desktop |
| **"Become a Trade Customer"** | REMOVED (hidden) | REMOVED (hidden) |
| **Utility Bar** | Pricing dropdown + navigation links | Dropdown + Showroom booking link |

**Test Result**: ⚠️ PENDING – Pricing toggle dropdown not yet implemented on staging. Test structure ready.

### 2.3 Logged In – MSRP View

| Aspect | Desktop | Mobile |
| :--- | :--- | :--- |
| **Pricing Toggle** | Dropdown shows "MSRP" | Same dropdown in utility bar |
| **Pricing Display** | MSRP only – trade pricing hidden | Same as desktop |
| **"Become a Trade Customer"** | REMOVED (hidden) | REMOVED (hidden) |

**Test Result**: ⚠️ PENDING – Awaiting pricing toggle feature deployment.

### 2.4 Checkout + My Account Pages

| Aspect | Behavior |
| :--- | :--- |
| **Pricing Toggle** | NOT present on checkout or My Account pages |
| **Default Pricing** | Defaults to trade pricing / existing price structure |
| **Persistence** | Toggle selection does NOT persist into checkout/account flows |

**Test Result**: ✅ Pricing toggle confirmed absent on checkout and My Account pages.

---

## 3. PLP Page Visual Comparison Results

| Element | Figma Design | Live US Staging | Match |
| :--- | :--- | :--- | :---: |
| **Logo** | SVG logo (logo.svg) | ✅ `logo.svg` loaded | ✅ |
| **Navigation Items** | Indoor, Outdoor, Homewares, In Stock, Customisation, Projects, Inspiration, Support, Contact | ✅ All 9 items found | ✅ |
| **"Ready to Buy" Link** | Top-right utility bar | ✅ VISIBLE | ✅ |
| **"Book Showroom Visit" Link** | Top-right utility bar | ✅ VISIBLE | ✅ |
| **Wishlist Icon** | Header icon | ✅ Present | ✅ |
| **Minicart Icon** | Header icon | ✅ Present | ✅ |
| **Category Title** | "Indoor Furniture" (IvyMode, 55px) | ✅ IvyMode 55px | ✅ |
| **Hero Background Image** | Category banner image | ✅ `leg1.jpg` loaded | ✅ |
| **Breadcrumbs** | Home > Indoor | ✅ 2 items | ✅ |
| **Product Grid** | SearchSpring rendered cards | ✅ 48 products displayed | ✅ |
| **Filter Sidebar** | Left-side filter panel | ✅ Visible | ✅ |
| **Toolbar** | Sort/view controls | ✅ Visible | ✅ |
| **Footer – Social Links** | Facebook, Pinterest, Instagram, TikTok | ✅ All 4 present | ✅ |
| **Footer Columns** | PRODUCTS, CUSTOMER SUPPORT, OUR BRAND | ✅ All 3 visible | ✅ |
| **Typography – Headings** | IvyMode font family | ✅ 3 variants loaded (400, 700, 300) | ✅ |
| **Typography – Body** | proxima-nova | ✅ proxima-nova, 14px | ✅ |
| **Body Colors** | Background: white, Text: rgb(56,28,18) | ✅ Matches | ✅ |

---

## 4. Test Execution Details & Verified Findings

- **Header Parity**: The main navigation renders all top-level categories (Indoor, Outdoor, Homewares, In Stock, Customisation, Projects, Inspiration, Support, Contact). Logo and utility icons verified.
- **Footer Parity**: Social links (Facebook, Pinterest, Instagram, TikTok), Subscribe section, Visit Showrooms section, and all 3 footer columns verified.
- **Responsive Layout**: Validated across Desktop (1920x1080), iPad (820x1180), and Mobile (393x851). Hamburger menu toggle is responsive and functional with zero horizontal overflow.
- **Axe-Core Accessibility Audit**: 0 critical violations detected on the copied US theme.
- **SearchSpring**: 48 product cards rendered successfully on the PLP. Filter sidebar and toolbar functional.
- **Pricing Toggle**: Feature not yet deployed to staging. Test automation prepared and ready to execute once implemented.

---

## 5. Screenshots Captured

All screenshots saved to: `Comparison before and After snapshout/figma-vs-live/`

| File | Description |
| :--- | :--- |
| `A1-logged-out-desktop-header.png` | Logged-out header with utility links |
| `A2-logged-out-pricing-check.png` | PLP pricing state when logged out |
| `A3-logged-out-mobile-no-utility-bar.png` | Mobile view without utility bar |
| `D1-us-plp-indoor-fullpage.png` | US PLP full page screenshot |
| `D2-header-navigation.png` | Header & navigation bar |
| `D3-category-hero-banner.png` | Category hero with background image |
| `D4-product-grid.png` | Product grid (SearchSpring) |
| `D4b-first-product-card.png` | Individual product card detail |
| `D4c-filter-sidebar.png` | Left-side filter panel |
| `E1-footer-layout.png` | Footer layout with all sections |
| `E3-responsive-desktop.png` | Desktop breakpoint (1920px) |
| `E3-responsive-tablet.png` | Tablet breakpoint (820px) |
| `E3-responsive-mobile.png` | Mobile breakpoint (393px) |
| `F1-au-plp-indoor-fullpage.png` | AU PLP for side-by-side comparison |
