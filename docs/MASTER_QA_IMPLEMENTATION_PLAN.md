# Master QA Implementation Plan: GlobeWest AU Remediation & US B2B Storefront Expansion

## Overview & Executive Summary

This Master QA Implementation Plan governs the end-to-end testing, quality assurance, and compliance verification for **GlobeWest Australia (AU)** and the **GlobeWest United States (US) B2B Storefront Expansion**. Built on Adobe Commerce (Magento 2), the project encompasses:
1. **AU Storefront WCAG 2.2 Level AA Accessibility Remediation (Phase 1)**: Verifying 20 core accessibility remediations across 8 page templates with zero P1/P2 defects and Lighthouse Accessibility scores between 90–100.
2. **US B2B Storefront Foundation & Architecture (Sprint 1)**:
   - **Ticket 1**: Copy AU B2B Theme for the US B2B Storefront (Theme parity, responsive breakpoints, WCAG 2.2 AA compliance).
   - **Ticket 2**: Configure US Store-View Scope (Backend scope, domain/cookie binding, USD currency, locale, Public Browsing mode, scope leak prevention).
   - **Ticket 3**: Implement AU Regression Safeguards (AU baseline integrity, dual-store session isolation, continuous regression gates).

---

## Target Environments & URLs

| Storefront | Environment | Base URL | Primary Focus |
| :--- | :--- | :--- | :--- |
| **GlobeWest AU** | Staging 2 | `https://mcstaging2.globewest.com.au` | WCAG 2.2 AA remediation, commerce journeys, regression guard |
| **GlobeWest US** | Staging 2 | `https://mcstaging2.globewest.com` | US B2B theme parity, USD currency, public browsing, scope isolation |

### Key Page Templates in Scope:
1. **Homepage** (`/`)
2. **Product Listing Page - PLP** (`/furniture/sofas-modulars.html` or `/indoor`)
3. **Product Detail Page - PDP** (`/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass`)
4. **Shopping Cart & Checkout** (`/checkout/cart/` & `/checkout/#shipping` / `checkout/#payment`)
5. **My Account & Login** (`/customer/account/login/`)
6. **B2B Trade Portal** (`/help-centre/general/trade-registration`)
7. **Search Results Page** (`/catalogsearch/result/?q=sofa`)
8. **Static CMS Pages** (`/about-us`, `/contact`, `/showrooms`, `/faqs`)

---

## Sprint 1 Foundation Tickets (US Storefront & AU Safeguards)

### Ticket 1: Copy AU B2B Theme for US B2B Storefront (Frontend)
- **Objective**: Ensure the US storefront inherits the refined, accessible AU B2B theme without visual defects or regression.
- **Verification Criteria**:
  - Header & Megamenu visual parity.
  - Footer layout, legal copyright, and newsletter sign-up.
  - PLP category grid, product card structure, and typography.
  - PDP product gallery, swatch selectors, and quantity inputs.
  - Responsive breakpoints across Desktop (1920x1080), Tablet (820x1180), and Mobile (393x851).
  - Axe-core accessibility scan ensuring zero introduced violations on US templates.

### Ticket 2: Configure US Store-View Scope (Backend & Scope Integrity)
- **Objective**: Guarantee that all storefront settings, currencies, and catalogs correctly reflect the US B2B market without data or functional leakage from AU.
- **Verification Criteria**:
  - Domain binding and cookie scoping (`mcstaging2.globewest.com`).
  - Correct HTML `lang` and regional meta tags.
  - All product prices formatted in **USD ($)**.
  - **Public Browsing Mode**: Guest users can view products, images, and descriptions, but wholesale/trade prices are hidden or masked behind "Login for trade pricing".
  - Scope Leak Prevention: Australian GST (10%), AU postcodes, and domestic shipping calculators must NOT appear on the US storefront.

### Ticket 3: Implement AU Regression Safeguards (Backend & CI/CD Gates)
- **Objective**: Protect the live and staging AU storefront from being broken or altered by US multi-store additions.
- **Verification Criteria**:
  - AU storefront continues serving Australian Dollars (AUD), GST-inclusive pricing, and Australian delivery estimators.
  - Session & Cookie isolation: Logging into the US store does not overwrite or invalidate an AU session, and vice versa.
  - Full WCAG 2.2 AA regression suite passes on AU storefront.

### Ticket 4: Set up the CMS Structure (CMS Home Page & Blocks Setup)
- **Objective**: Verify that the newly created US CMS Home Page (`Home page - US` / identifier: `home-us`) and its 9 dedicated CMS blocks are properly assigned in Magento Admin under the USA Website scope, correctly render on the US storefront, and maintain strict scope isolation.
- **Verification Criteria**:
  - `CMS Home Page` assigned to `Home page - US` in `Stores > Configuration > General > Web > Default Pages` under US scope.
  - CMS Page `home-us` and all 9 CMS blocks exist, are enabled, and assigned to the US store view.
  - Front-end homepage rendering across Desktop, Tablet, and Mobile with zero AU scope leakage.
  - Instagram feed block graceful degradation audit.

---

## 5 Core Accessibility Pillars (WCAG 2.2 AA)

1. **Colour Contrast (WCAG 1.4.3)**:
   - Normal text: ≥ 4.5:1 ratio.
   - Large text (≥ 18pt or 14pt bold) and UI components: ≥ 3.0:1 ratio.
2. **ARIA & Text Labels (WCAG 1.1.1 / 4.1.2)**:
   - Descriptive accessible names on all icon-only buttons (search, cart, wishlist, mobile menu toggle, social links).
   - Form inputs explicitly labeled with `<label for="...">` or `aria-label`.
3. **Touch Target Size (WCAG 2.5.8)**:
   - Interactive targets (swatch circles, accordion toggles, pagination) must measure at least **44x44 CSS pixels** or have sufficient spacing.
4. **Viewport Scaling (WCAG 1.4.4 & 1.4.10)**:
   - `user-scalable=no` is strictly prohibited.
   - Page must support 200% zoom without clipping or requiring dual-axis scrolling.
5. **DOM Semantics & Focus Management (WCAG 1.3.1 / 2.1.1 / 2.4.3)**:
   - Carousel markup must be valid (`ul > li` only).
   - Skip-to-main-content link functional and visible on Tab.
   - Visible high-contrast focus indicators on all interactive elements.
   - Focus traps implemented for active modals/drawers and dismissed with `Escape`.

---

## Cross-Browser & Device Test Matrices

### 12-Layout UI Matrix
1. **MacBook Pro** - macOS Ventura - Chrome
2. **MacBook Pro** - macOS Ventura - Safari
3. **MacBook Pro** - macOS Sonoma - Chrome
4. **MacBook Pro** - macOS Sonoma - Safari
5. **Android Phone (S22)** - Android 14 - Chrome
6. **Android Phone (S23 Ultra)** - Android 14 - Samsung Internet
7. **iPhone 13 mini** - iOS 18 - Safari
8. **iPhone 14 Pro Max** - iOS 18 - Safari
9. **iPad Air (5th gen)** - iPadOS 17 - Safari
10. **Android Tablet (Tab S8)** - Android 13 - Chrome
11. **Windows 11 PC** - Chrome
12. **Windows 11 PC** - Microsoft Edge

### 3 Core Functional Journey Combinations
1. **MacBook Pro** (macOS Sonoma, Chrome)
2. **iPhone 14 Pro Max** (iOS 18, Safari)
3. **Samsung Galaxy S23 Ultra** (Android 14, Chrome)

---

## QA Execution Command Suite

```bash
# Navigate to project directory
cd "/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026"

# 1. Run Axe-core WCAG 2.2 AA accessibility scans (All 8 templates)
npm run test:accessibility

# 2. Run core functional journeys (Cart, Mega menus, Login)
npm run test:journeys

# 3. Run Screen Reader & Keyboard Navigation Simulator (NVDA / voice audio)
npm run test:staging-nvda

# 4. Run automated Lighthouse audits across all templates
npm run test:lighthouse

# 5. Verify accessibility scorecards (Pass/Fail threshold)
npm run verify:scores

# 6. Run all tests and verify all scores in one command
npm run test:verify-all

# 7. View interactive HTML Playwright report
npm run report

# 8. Package report for stakeholders
npm run zip:report
```

---

## Deliverables & Sign-Off Criteria

### Deliverables Required:
1. **Remediation Log** (`docs/GlobeWest_Remediation_Log.xlsx` / `.md`): Each audit item mapped to status (Pass/Fail) with notes.
2. **Automated Playwright Reports**: HTML reports and `playwright-report.zip`.
3. **Lighthouse Audit Reports**: HTML and JSON reports saved per template.
4. **Screen Reader Evidence**: Logs and recordings from NVDA / VoiceOver runs.
5. **Defect Log**: Detailed P1/P2/P3 bug tickets with reproduction steps.

### Exit / Sign-Off Criteria:
- **Zero open P1 (Critical)** and **Zero open P2 (High)** defects.
- Automated Lighthouse Accessibility scores **between 90 and 100** on all target pages.
- Zero functional regressions on core checkout, login, and registration flows.
- Sign-off confirmed by Overdose Digital (OD) project leads.
