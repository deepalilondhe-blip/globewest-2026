# 🛋️ GlobeWest QA Automation Project (2026)

This project contains automated accessibility and functional journey tests for the **GlobeWest storefront** (`globewest.com.au`), designed to verify compliance with **WCAG 2.2 Level AA** standards during Phase 1 of the Accessibility Remediation program.

The project is built on **Playwright** and **Axe-Core**, featuring a modular Page Object Model (POM) architecture.

---

## 📂 Project Structure

```
GlobeWest 2026/
├── pages/                    # Page Object Model (POM) classes
│   ├── BasePage.js           # Shared utilities (navigation, focus audits, screenshots)
│   ├── Homepage.js           # Home page selectors & header/footer interactions
│   ├── ProductListingPage.js # Product categories & filtering panel interaction
│   ├── ProductDetailPage.js  # Gallery slide validation, color swatches, quantity controls
│   ├── CheckoutPage.js       # Shopping cart, shipping billing forms, order success
│   ├── MyAccountPage.js      # Customer dashboard, login portals, address edits
│   ├── TradePortalPage.js    # B2B trade applications, pricing grid validations
│   ├── SearchPage.js         # Search bar suggestions, query list, blank results notice
│   └── StaticPage.js         # CMS templates (Showrooms, Contact forms, FAQ accordions)
├── tests/                    # Test suites
│   ├── accessibility.spec.js # Automated WCAG 2.2 AA audit scans (Axe-Core) on all 8 templates
│   └── journeys.spec.js      # Key user journey, form validation & dynamic state checks
├── package.json              # Script shortcuts and NPM package listings
└── playwright.config.js      # Global viewport configurations & device emulations
```

---

## 🚀 Getting Started

### 📋 Prerequisites
* Install [Node.js](https://nodejs.org/) (Version 16 or newer recommended)

### 💻 Installation
1. Open your terminal in VS Code and change directory to the project folder:
   ```bash
   cd "GlobeWest 2026"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install browser binaries required by Playwright:
   ```bash
   npx playwright install
   ```

---

## 🛠️ Running the Tests

You can execute different scripts configured in `package.json`:

* **Run all tests (headless mode):**
  ```bash
  npm test
  ```
* **Run accessibility scans only (all 8 templates):**
  ```bash
  npm run test:accessibility
  ```
* **Run functional user journeys only (dynamic states & forms):**
  ```bash
  npm run test:journeys
  ```
* **Run tests in a specific browser environment (e.g. Mobile Safari emulation):**
  ```bash
  npx playwright test --project=mobile-safari-iphone
  ```
* **Show HTML Test Report:**
  ```bash
  npm run report
  ```

---

## 📈 Success Criteria Checked
1. **Lighthouse & Axe-Core Audits:** Validates headers, footers, PLP list markup, and details against WCAG 2.2 AA standards across all 8 page templates.
2. **Keyboard Focus Outlines:** Asserts that interactive elements expose high-contrast outlines when navigated by tab keys.
3. **Skip-to-Main-Content Links:** Simulates keyboard navigation sequence to verify the bypass mechanism.
4. **Viewport Scaling:** Asserts that the viewport configuration does not restrict pinch-to-zoom scaling on mobile.
5. **List Nesting Semantics:** Ensures that slides in carousels conform to HTML semantic nesting rules.
6. **Form Accessibility & Labels:** Checks that input fields on the Checkout and Trade Portal pages are associated with valid accessibility labels.
7. **Dynamic State Changes:** Asserts that state toggles (like FAQ expansions) modify `aria-expanded` and other ARIA attributes dynamically.
