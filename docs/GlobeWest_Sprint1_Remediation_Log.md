# GlobeWest Sprint 1 & AU Regression Safeguards Remediation Log

## Overview & Scope
This document is the official **Sprint 1 Remediation & Defect Tracking Log** for the **GlobeWest US B2B Storefront Expansion & AU Regression Safeguards** project. It maps each architectural requirement, backend scope setting, regression safeguard, and blocker to its implementation status, verification method, and QA sign-off state.

---

## 📊 Sprint 1 QA Summary

| Category | Total Tasks | Verified / Passed | In-Progress | Blocked / Pending |
| :--- | :---: | :---: | :---: | :---: |
| **AU Regression Safeguards (Backend)** | 5 | 4 | 1 | 0 |
| **US B2B Storefront & Scope (Backend & Frontend)** | 5 | 2 | 1 | 2 |
| **Accessibility & Responsive Parity (WCAG 2.2 AA)** | 2 | 2 | 0 | 0 |
| **Total** | **12** | **8** | **2** | **2** |

---

## 📋 Detailed Sprint 1 Remediation Log

| Item ID | Ticket / Module | Severity | Area | Requirement / Finding | Target Fix / Safeguard | Verification Method | QA Status | Notes / Blocker |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **REM-S1-01** | [Task #41801462](https://overdose.eu.teamwork.com/#/tasks/41801462) | **P1 (Critical)** | AU Backend Scope | Risk of US store configuration overwriting AU base currency or tax settings. | Scope currency settings strictly: AU Store View = AUD ($) with 10% Australian GST inclusive. | Automated (`TC-AU-SAFE-01`) | **PASSED** | AU PDP and PLP verified displaying AUD with GST notice. |
| **REM-S1-02** | [Task #41801462](https://overdose.eu.teamwork.com/#/tasks/41801462) | **P1 (Critical)** | Session / Security | Concurrent customer sessions between AU and US domains could overwrite cart items or auth tokens. | Scope `PHPSESSID`, `mage-messages`, and `private_content_version` cookies to their respective domain roots. | Automated (`TC-AU-SAFE-02`) | **PASSED** | Domain isolation verified across `globewest.com.au` and `globewest.com`. |
| **REM-S1-03** | [Task #41801462](https://overdose.eu.teamwork.com/#/tasks/41801462) | **P1 (Critical)** | AU Cart / Shipping | US freight / ZIP code validation rules could leak into AU domestic shipping estimator. | Restrict domestic freight rules, postcode masks (4 digits), and carriers (Allied Express, Toll) to AU store scope. | Automated (`TC-AU-SAFE-03`) | **PASSED** | Valid AU postcodes (e.g. 3000) calculate correctly; US zip formats rejected. |
| **REM-S1-04** | [Task #41801462](https://overdose.eu.teamwork.com/#/tasks/41801462) | **P2 (High)** | SEO & Routing | Multi-store canonical URLs or cross-store assets could point to wrong store view. | Enforce store-specific canonical URL generation (`.com.au` for AU, `.com` for US). | Automated (`TC-AU-SAFE-04`) | **PASSED** | Canonical tags and asset paths resolve exclusively to `globewest.com.au`. |
| **REM-S1-05** | [Task #41801462](https://overdose.eu.teamwork.com/#/tasks/41801462) | **P2 (High)** | AU B2B Portal | US registration fields (EIN) could inadvertently override Australian Business Number (ABN) validation. | Keep ABN validator and AU state dropdowns bound to AU store code (`trade-registration`). | Automated (`TC-AU-SAFE-05`) | **PASSED** | ABN field present and validated on AU Trade Portal. |
| **REM-S1-06** | [Task #41801457](https://overdose.eu.teamwork.com/app/tasks/41801457) | **P2 (High)** | US Frontend Theme | Copy AU B2B theme to US B2B storefront with exact layout and styling parity. | Inherit AU parent theme; configure US child theme with responsive breakpoints (Desktop, Tablet, Mobile). | Manual & Playwright Visual | **PASSED** | Theme structure copied; breakpoint parity confirmed. |
| **REM-S1-07** | [Task #41801459](https://overdose.eu.teamwork.com/app/tasks/41801459) | **P1 (Critical)** | US Public Browsing | Non-trade guest users must browse products without viewing wholesale/trade prices. | Implement Public Browsing Mode: hide prices and display "Login for trade pricing" CTA for unauthenticated users. | Manual & Functional Test | **IN-PROGRESS** | Native Magento catalog price hiding works; SearchSpring price masking blocked. |
| **REM-S1-08** | [Task #41801465](https://overdose.eu.teamwork.com/#/tasks/41801465) | **P1 (Critical)** | US Search / PLP | SearchSpring (SS) frontend widgets integration and price masking on search/PLP results. | Configure SearchSpring USA staging account and integrate search/autocomplete widgets. | API & Functional Test | **BLOCKED** | **Blocker**: Waiting for SearchSpring USA staging account credentials & dashboard access. |
| **REM-S1-09** | [Task #41801460](https://overdose.eu.teamwork.com/app/tasks/41801460) | **P2 (High)** | US CMS / Content | Set up CMS content structure for US storefront pages. | Create CMS blocks and pages matching US brand requirements. | Visual Inspection | **PENDING** | **Clarification Required**: US homepage design missing in shared Figma files. |
| **REM-S1-10** | [Task #41801461](https://overdose.eu.teamwork.com/#/tasks/41801461) | **P1 (Critical)** | US Backend Scope | Configure US website, store, and store-view scope with USD currency and US tax base. | Set Base Currency = USD, default country = US, and bind domain `mcstaging2.globewest.com`. | Automated & DevTools | **IN-PROGRESS** | Backend scope 80% configured; tax calculation (Avalara) scheduled for Sprint 2. |
| **REM-S1-11** | [Task #41801462](https://overdose.eu.teamwork.com/#/tasks/41801462) | **P2 (High)** | Accessibility Parity | Ensure Phase 1 AU WCAG 2.2 AA remediations are preserved in new US theme. | Run Axe-core scan on US templates; ensure zero critical/serious accessibility regressions. | Automated (`TC-AU-SAFE-06`) | **PASSED** | Zero critical violations found; focus outline and skip-link active. |
| **REM-S1-12** | [Task #41801457](https://overdose.eu.teamwork.com/app/tasks/41801457) | **P2 (High)** | Responsive Reflow | Verify 200% zoom reflow and minimum 44x44px touch targets on US storefront. | Enforce `min-height: 44px; min-width: 44px;` on interactive controls; verify single-column reflow. | Manual (Guide Step 3 & 4) | **PASSED** | Swatches and buttons meet 44px criteria; no layout clipping at 200% zoom. |

---

## 🚨 Current Blockers & Action Items

1. **SearchSpring USA Staging Credentials (Task #41801465)**:
   - **Status**: **BLOCKER**
   - **Impact**: Cannot complete price hiding and search filtering on US PLP/Search pages.
   - **Action**: Overdose Tech Lead (Alex Pape) and PM (Michelle Munro) to provide SearchSpring USA dashboard access.
2. **Figma US Homepage Design Missing (Task #41801460)**:
   - **Status**: **PENDING CLARIFICATION**
   - **Impact**: CMS structure setup for US homepage cannot proceed to 100% completion.
   - **Action**: Design Lead (Shantelle Johnson) to share final US homepage Figma frames.
