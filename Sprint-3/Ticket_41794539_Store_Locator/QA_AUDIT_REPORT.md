# 🏆 Senior QA Audit Report: Store Locator (#41794539)

> **Ticket Reference**: [Task #41794539 – Store Locator](https://overdose.eu.teamwork.com/app/tasks/41794539)  
> **Target Live Staging (US)**: `https://mcstaging2.globewest.com/locator`  
> **Baseline Storefront (AU)**: `https://www.globewest.com.au/locator` & `https://mcstaging2.globewest.com.au/locator`  
> **Figma Design Reference**: [Globewest USA - External](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External)  
> **Standard Compliance**: Strict adherence to `AGENTS.md` (Dual-Auth Matrix, Zero Placeholders, Rule 6 Terminal Standard, Pixel-Perfect Fidelity, WCAG 2.2 AA).  
> **QA Engineer**: Deepali Londhe (`deepali.londhe@overdose.digital`)  
> **Audit Date**: October 12, 2026  
> **Audit Status**: 🔴 **FAILED — P0 CRITICAL BLOCKER DETECTED**

---

## 📊 Executive Summary & Metrics

An end-to-end pixel-perfect visual and functional audit was executed across the **US Staging Store Locator (`/locator`)** in comparison with the **AU Live Baseline** and **Figma Design System**.

While basic page routing (`HTTP 200`) and the lifestyle asset load correctly, the page cannot be approved due to an active **P0 Blocker**: the **Google Maps JavaScript API fails with a `RefererNotAllowedMapError`**, leaving the interactive map completely broken on the live US staging site. Furthermore, extensive Australian copy, Melbourne postcode placeholders (`Eg.3000`), a leaked CMS block code (`"- us"`), and WCAG 2.2 AA accessibility violations were discovered.

| Metric | Result | Notes |
| :--- | :---: | :--- |
| **Total Test Cases Executed** | **25 TCs** | Available in [.xlsx](Store_Locator_Test_Cases.xlsx) and [.csv](Store_Locator_Test_Cases.csv) |
| **Passed Test Cases** | **17 TCs** | Core routes, asset loading, layout structure, dual-auth headers |
| **Failed Test Cases** | **8 TCs** | Map API failure, regional leaks, CMS title bug, WCAG violations |
| **P0 Critical Blockers** | **1** | Google Maps JavaScript API fails with `RefererNotAllowedMapError` |
| **P1 High Severity Defects** | **4** | AU Postcode placeholder, Australia copy leak, CMS heading bug, Mobile stacking |
| **P2 Medium Defects** | **3** | AU spelling (`finalise`), Empty `<title>` tag, Footer Kangaroo badge |
| **WCAG 2.2 AA Violations** | **2** | Missing document `<title>`, Missing input form labels |

---

## 🚨 Detailed Defect Matrix

### 🔴 Defect 01: Interactive Google Maps Canvas Failure (P0 Blocker)
* **Summary**: Google Maps API fails to load with `RefererNotAllowedMapError`, displaying a broken grey canvas with a Google error alert.
* **Live URL**: `https://mcstaging2.globewest.com/locator`
* **Console Exception**:
  ```text
  Google Maps JavaScript API error: RefererNotAllowedMapError
  https://developers.google.com/maps/documentation/javascript/error-messages#referer-not-allowed-map-error
  Your site URL to be authorized: https://mcstaging2.globewest.com/locator
  ```
* **Expected (AU Baseline / Figma)**: Interactive Google Maps canvas must initialize cleanly, displaying map tiles, pan/zoom controls, and custom pins for stockists/showrooms.
* **Root Cause**: The staging domain `mcstaging2.globewest.com` is not whitelisted in the Google Cloud Console HTTP Referrer credentials.
* **Evidence**: [Pass 01 Comparison](comparison/COMPARISON_01_GOOGLE_MAPS_CANVAS.png)

---

### 🔴 Defect 02: Hardcoded Australian Postcode Placeholder `Eg.3000` (P1 High)
* **Summary**: Search input placeholder displays Australian Melbourne postcode `"Eg.3000"` on the US storefront.
* **Expected**: For the US market, placeholder must reflect standard 5-digit US ZIP codes (e.g. `Eg. 90210` or `Eg. 78701`), and field label should be `"SEARCH BY ZIP CODE"`.
* **Actual**: Displays `"SEARCH BY POSTCODE"` with placeholder `Eg.3000`.
* **Evidence**: [Pass 02 Comparison](comparison/COMPARISON_02_POSTCODE_PLACEHOLDER.png)

---

### 🔴 Defect 03: Regional Australia Marketing Copy Leak (P1 High)
* **Summary**: The primary introductory paragraph under the `FIND A STOCKIST` title contains hardcoded Australian regional copy:
  > *"GlobeWest is stocked at some of Australia's finest furniture and home decor retailers. Stockists display select GlobeWest products in-store and can order any item from the collection for you."*
* **Expected**: Copy must be localized for the American market or reference upcoming US Trade Showrooms (LA & Austin currently under consideration per ticket description).
* **Evidence**: [Pass 03 Comparison](comparison/COMPARISON_03_AU_COPY_LEAK.png)

---

### 🔴 Defect 04: Editorial Section CMS Heading Title Wrap Defect (P1 High)
* **Summary**: Lower editorial block heading renders with a hyphen and internal CMS store view code `"- us"` awkwardly wrapped:
  ```text
  How to Buy with a Stockist -
  us
  ```
* **Expected**: Clean editorial heading matching AU Baseline: `"How to Buy with a Stockist"`.
* **Root Cause**: Magento PageBuilder block title was inadvertently updated to include internal identifier `"- us"` in frontend HTML.
* **Evidence**: [Pass 04 Comparison](comparison/COMPARISON_04_EDITORIAL_HEADING_WRAP.png)

---

### 🔴 Defect 05: Editorial Body Text Australian Spelling Leak (P2 Medium)
* **Summary**: Editorial body text contains British/Australian English spelling `"finalise your order"` (with 's') and repeats the Australian stockist reference.
* **Expected**: American English localization: `"finalize your order"` (with 'z') and guidance for US trade clients.
* **Evidence**: [Pass 05 Comparison](comparison/COMPARISON_05_EDITORIAL_BODY_SPELLING.png)

---

### 🔴 Defect 06: Missing HTML `<title>` Tag & Analytics Error (P1 High / WCAG 2.4.2)
* **Summary**: The HTML `<title>` tag on `/locator` is completely empty (`""`).
* **Console Exception**:
  ```json
  [{"Track.Title":["'Title' must not be empty."]}] {pageType: 0, url: https://mcstaging2.globewest.com/locator, title: ""}
  ```
* **Expected**: Descriptive SEO title: `<title>Find a Stockist & Showroom | GlobeWest</title>`.
* **Impact**: SEO regression and broken analytics event tracking.

---

### 🔴 Defect 07: Storefront Footer Australian Kangaroo Trust Badge (P2 Medium)
* **Summary**: The footer on the US storefront renders the Australian Kangaroo mark (`"AUSTRALIAN OWNED & RUN"`).
* **Expected**: Suppressed on the US store view per Figma US Global Footer specifications.
* **Evidence**: [Pass 06 Comparison](comparison/COMPARISON_06_FOOTER_KANGAROO_BADGE.png)

---

### 🔴 Defect 08: Mobile Responsive Stacking & Duplicate Help Text (P1 High)
* **Summary**: On mobile viewport (390x844 iPhone 14), the broken map canvas renders awkwardly, and the checkout help text paragraph appears duplicated both above and below the map.
* **Expected**: Single clean occurrence of help text, localized ZIP code inputs, and interactive touch map.
* **Evidence**: [Pass 07 Comparison](comparison/COMPARISON_07_MOBILE_RESPONSIVE_OVERVIEW.png)

---

## ♿ WCAG 2.2 AA Automated Accessibility Audit Results

As explicitly mandated by the ticket (*"Note: US site to be built to WCAG 2.2 AA"*), an automated audit was executed via Axe-core:

| Rule ID | WCAG Success Criterion | Severity | Affected Nodes | Remediation |
| :--- | :--- | :---: | :---: | :--- |
| `document-title` | **WCAG 2.4.2 (Level A)** Page Titled | **Serious** | `html` | Add descriptive title tag: `<title>Find a Stockist & Showroom \| GlobeWest</title>`. |
| `label` | **WCAG 4.1.2 & 1.3.1 (Level A)** Info & Relationships | **Critical** | `input[type="text"]`, `input[type="number"]` | Provide explicit `<label for="...">` or `aria-label` attributes for search inputs. |

---

## 🔐 Dual-Auth Matrix Verification

| Storefront / URL | State | Observed Behavior | Status |
| :--- | :--- | :--- | :---: |
| **US Staging (`mcstaging2.globewest.com/locator`)** | **Logged-Out (Public Guest)** | Public browsing mode active; wholesale pricing masked; trade registration CTAs active. | 🟢 PASS |
| **US Staging (`mcstaging2.globewest.com/locator`)** | **Authenticated (Trade Customer)** | Trade account session persists; navigation remains intact without header breakage. | 🟢 PASS |
| **AU Baseline (`globewest.com.au/locator`)** | **Public & Authenticated** | Interactive Google Map, active Australian stockists, clean editorial layout intact. | 🟢 PASS |

---

## 🖼️ Side-by-Side Visual Proof Gallery

| Pass # | Comparison Subject | Artifact Link |
| :---: | :--- | :--- |
| **01** | Interactive Google Maps Canvas & Referrer Restriction | [COMPARISON_01_GOOGLE_MAPS_CANVAS.png](comparison/COMPARISON_01_GOOGLE_MAPS_CANVAS.png) |
| **02** | Search Inputs & Australian Postcode (Eg.3000) Leak | [COMPARISON_02_POSTCODE_PLACEHOLDER.png](comparison/COMPARISON_02_POSTCODE_PLACEHOLDER.png) |
| **03** | Primary Heading & Australia Regional Copy Leak | [COMPARISON_03_AU_COPY_LEAK.png](comparison/COMPARISON_03_AU_COPY_LEAK.png) |
| **04** | Editorial CMS Section Heading Title Wrap Defect (`- us`) | [COMPARISON_04_EDITORIAL_HEADING_WRAP.png](comparison/COMPARISON_04_EDITORIAL_HEADING_WRAP.png) |
| **05** | Editorial Body Copy & AU Spelling Leak (`finalise`) | [COMPARISON_05_EDITORIAL_BODY_SPELLING.png](comparison/COMPARISON_05_EDITORIAL_BODY_SPELLING.png) |
| **06** | Storefront Footer Australian Kangaroo Trust Badge | [COMPARISON_06_FOOTER_KANGAROO_BADGE.png](comparison/COMPARISON_06_FOOTER_KANGAROO_BADGE.png) |
| **07** | Mobile Responsive Viewport Layout Stacking (390x844) | [COMPARISON_07_MOBILE_RESPONSIVE_OVERVIEW.png](comparison/COMPARISON_07_MOBILE_RESPONSIVE_OVERVIEW.png) |

---

## 🛠️ Step-by-Step Reproduction Guide

1. Navigate to `https://mcstaging2.globewest.com/locator` in any desktop browser.
2. Observe the map area: Note the Google Maps error alert overlay:
   > *"Oops! Something went wrong. This page didn't load Google Maps correctly."*
3. Open DevTools Console (F12) to see `RefererNotAllowedMapError` and empty title analytics error.
4. Inspect the search input placeholder: Note `Eg.3000`.
5. Scroll down to the editorial card: Observe heading *"How to Buy with a Stockist - us"*.
6. Scroll down to the footer: Observe the Australian Kangaroo badge.
7. Switch to mobile emulation (390x844): Observe duplicate help text and layout stacking.

---

## 📋 Recommended Action Plan for Engineering

1. **Google Cloud Console**: Authorize `https://mcstaging2.globewest.com/*` and production US domain on the Google Maps JavaScript API key credentials.
2. **Page Title & SEO**: Populate `<title>Find a Stockist & Showroom | GlobeWest</title>` in Magento Admin CMS Page configuration.
3. **Search Inputs**: Update input placeholder from `Eg.3000` to `Eg. 90210` / `Eg. 78701`, and associate explicit `aria-label` attributes for WCAG compliance.
4. **Content & Copy**:
   - Update intro copy to remove Australian references.
   - Update CMS block title from `"How to Buy with a Stockist - us"` to `"How to Buy with a Stockist"`.
   - Update body text to American English spelling (`"finalize"`).
5. **Footer**: Suppress the Kangaroo trust badge on the US store view.
