# GlobeWest QA Workflow - Accessibility & Functional Journey Testing

This document outlines the extracted QA scope, tools, activities, and criteria for the **GlobeWest AU Accessibility Remediation (Phase 1)** project. It details exactly what a QA engineer needs to test, report, and verify to ensure WCAG 2.2 Level AA compliance and zero regressions.

---

## User Review Required

Please review the following testing scope and verify if additional manual test scripts/matrices are required from the client or Overdose Digital (OD).

> [!IMPORTANT]
> The QA exit criteria require **zero open P1 or P2 defects** and a **Lighthouse Accessibility score of 90–100** across all 8 target page types. 

---

## Open Questions

1. **Test Matrix Specifics**: The proposal mentions a "12-combination browser/device test matrix" from the OD brief. Do we have the exact list of these 12 combinations (e.g. specific Safari, Chrome, iOS, and Android versions)?
2. **Auditor Test Scripts**: Will the independent auditor provide specific UAT test cases, or will we verify using our automated [accessibility.spec.js](file:///C:/GlobeWest%202026/tests/accessibility.spec.js) and manual walkthroughs?

---

## Extracted QA Scope & Activities

### 1. In-Scope Pages to Test
You will perform all QA validation on the following 8 key page templates (both on staging `mcstaging2.globewest.com.au` and post-deployment):
1. **Homepage** (e.g. `/`)
2. **Product Listing Page (PLP)** (e.g. `/furniture/sofas-modulars.html` / `/indoor`)
3. **Product Detail Page (PDP)** (e.g. `/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass`)
4. **Shopping Cart & Checkout** (e.g. `/checkout/cart/` / `/checkout/`)
5. **My Account Page & Login** (e.g. `/customer/account/login/`)
6. **B2B Trade Portal** (e.g. `/help-centre/general/trade-registration`)
7. **Search Results Page** (e.g. `/catalogsearch/result/?q=sofa`)
8. **Content / Static Pages** (e.g. `/about-us` / `/faqs`)

---

### 2. QA Testing Activities

The QA effort is divided into four main testing areas:

#### A. Automated Accessibility Scans
* **Tooling**: Playwright integrated with **Axe-Core** (`@axe-core/playwright`).
* **Checks**:
  * Run automated checks targeting `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa`.
  * Ensure Lighthouse Accessibility Score reaches **90–100** on all templates.
  * Verify that third-party elements (like Yotpo reviews or SearchSpring) are appropriately excluded or tolerated if they cannot be remediated directly.

#### B. Manual Accessibility Testing
* **Keyboard-only Navigation**:
  * Validate that the **Skip-to-Main-Content** link is functional, shifts focus, and is visible on focus.
  * Verify **Keyboard Focus order** is logical and visual reading order is maintained.
  * Confirm that **Keyboard Focus outlines** are highly visible (high-contrast outlines).
  * Ensure there are **no keyboard traps** (e.g., in modals like the mini-cart, cookie banner, search overlay, or mobile navigation drawer).
* **Screen Reader Testing**:
  * Test using **NVDA** (Windows) and **VoiceOver** (macOS / iOS).
  * Check that dynamic state changes (e.g., FAQ expand/collapse, swatches active state) are announced correctly via `aria-expanded`, `aria-selected`, or `aria-pressed`.
  * Ensure that dynamic content updates (e.g., form validation errors, search autocomplete, add-to-cart success) are announced via `aria-live` regions.
  * Check that hidden elements (e.g., closed mobile drawers, inactive slides) are properly hidden from screen readers (`aria-hidden="true"` or `tabindex="-1"`).

#### C. Functional Regression Testing
* **Goal**: Ensure accessibility fixes do not break existing business logic.
* **Key journeys to test**:
  * B2C Add to Cart and full Checkout pipeline.
  * B2B Trade Portal registration form validation and submission.
  * Customer login, dashboard navigation, and address updates.
  * Search auto-suggestions and filtering behaviors on PLPs.

#### D. Performance & Core Web Vitals Verification
* Verify that structural/ARIA updates do not degrade performance:
  * **Largest Contentful Paint (LCP)**: < 2.5 seconds.
  * **Cumulative Layout Shift (CLS)**: < 0.1.
  * **Interaction to Next Paint (INP)**: < 200 milliseconds.

---

## QA Deliverables

As the QA engineer, you must produce and maintain:
1. **Remediation Log**: A mapping sheet showing every original audit finding, the fix applied, and QA verification status (Pass/Fail).
2. **Defect Log**: Tracked defects, retest results, and verification logs.
3. **Screen Reader Evidence**: Sound cues/NVDA logs showing screen reader outputs on key flows.
4. **Cross-Browser/Device Evidence**: Screenshots or test results showing successful passes across the 12-combination browser matrix.
5. **Lighthouse Accessibility Reports**: Auto-generated HTML reports for the 8 pages.

---

## QA Exit Criteria

For the QA team to sign off on the release, the following must be achieved:
* All 20 approved accessibility remediation tasks are validated as **Passed**.
* **Zero open P1 (Critical) or P2 (High) defects**.
* All critical store features (Checkout, login, etc.) run with **zero regressions**.
* Automated Lighthouse Accessibility scores are consistently between **90–100**.
* Auditor verification findings on Staging are successfully addressed and resolved.
