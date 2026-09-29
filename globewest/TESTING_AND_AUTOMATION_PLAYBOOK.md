# GlobeWest US Expansion: Testing & Automation Playbook

---

## 1. Automated Test Framework Setup

The test harness uses Playwright with real Headed Chrome instances to enable live visual inspection during test execution:

### Environment Requirements:
- Runtime: Node.js v20+ or v22+
- Framework: Playwright (@playwright/test)
- Browser Channel: Google Chrome / Chromium (--channel=chrome --start-maximized)
- Supporting Libraries: xlsx (Excel matrix generation), Python Pillow (image cropping and comparisons)

### Dependency Resolution:
All dependencies are installed in GlobeWest 2026/node_modules/. To run any standalone script from anywhere in the workspace, set NODE_PATH:

```bash
export NODE_PATH="GlobeWest 2026/node_modules"
```

---

## 2. Authentication Management (Dual-Auth Test Profile)

For all authenticated tests touching Trade Pricing, My Account, or Checkout:
- Account Type: Authenticated Trade Customer
- Email: deepali.londhe@overdose.digital
- Password: Deep@123
- Login URL: https://mcstaging2.globewest.com/customer/account/login/

### Programmatic Login Pattern:
```javascript
await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
const emailInput = page.locator('#email');
if (await emailInput.isVisible({ timeout: 4000 }).catch(() => false)) {
  await emailInput.fill('deepali.londhe@overdose.digital');
  await page.fill('#pass', 'Deep@123');
  await page.click('#send2');
  await page.waitForLoadState('networkidle');
}
```

---

## 3. Pixel-Perfect Computed Style Assertions

Per AGENTS.md Rule 1, never assert mere presence in the DOM. Always evaluate computed styles against Figma specifications:

```javascript
const styles = await page.evaluate((selector) => {
  const el = document.querySelector(selector);
  if (!el) return null;
  const cs = window.getComputedStyle(el);
  return {
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,        // e.g. 400 (regular) vs 700 (bold)
    fontFamily: cs.fontFamily,
    color: cs.color,
    backgroundColor: cs.backgroundColor,
    borderRadius: cs.borderRadius,    // e.g. 9999px for pill shape
    padding: cs.padding,
    margin: cs.margin
  };
}, '.account-listing-ui__filters__filter.is-active');
```

---

## 4. Pagewise Terminal Run Commands

### 1. My Account - Holds (Ticket #41794528)
```bash
# Desktop View:
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794528_My_Account_Holds/scripts/capture_live_desktop.js"

# Mobile View:
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794528_My_Account_Holds/scripts/capture_live_mobile.js"

# FAQ Single-Open Rule Test:
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794528_My_Account_Holds/scripts/test_faq_interaction.js"
```

### 2. My Account - Orders (Ticket #41794530)
```bash
# Full Retest (Status Tabs, 6 Columns, FAQ Single-Open, Support Block):
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794530_My_Account_Orders/scripts/retest_my_orders_live.js"

# Desktop Capture:
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794530_My_Account_Orders/scripts/capture_live_desktop.js"

# Mobile Capture:
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794530_My_Account_Orders/scripts/capture_live_mobile.js"
```

### 3. PLP / Category Page (Ticket #41794520)
```bash
# Category US vs AU Cross-Storefront Comparison:
npx playwright test "GlobeWest 2026/tests/plp-us-vs-au-comparison.spec.js" --project=desktop-chrome --headed

# Live Defect Proof Walkthrough:
npx playwright test "GlobeWest 2026/tests/plp-client-defects-proof.spec.js" --project=desktop-chrome --headed
```

### 4. Header & Mega Menu (Ticket #41801466)
```bash
# Header & Navigation Parity Audit:
npx playwright test "GlobeWest 2026/tests/ticket5-us-header-comparison.spec.js" --project=desktop-chrome --headed
```

### 5. Global Footer & Legal (Ticket #41794517)
```bash
# Footer Audit (AU Kangaroo logo suppression & legal blocks):
npx playwright test "GlobeWest 2026/tests/ticket-footer.spec.js" --project=desktop-chrome --headed
```

---

## 5. Visual Defect Standards & Comparison Rules

### Side-by-Side Formatting:
- Left: Approved Figma Specification or AU Baseline.
- Right: Live Staging Actual Defect.

### Border Color Standard:
- Solid Red (#FF0000): Highlights confirmed defects on live staging.
- Solid Green (#2E7D32): Outlines approved Figma benchmark.

### Zero Text Burned on Captures:
- Comparison images must contain only the raw visual captures with highlighting boxes.
- No text overlays, titles, or descriptions baked directly into the image.

---

## 6. Test Matrix Generation (Excel & CSV)

Every ticket directory maintains both a CSV and an XLSX file:
- Headers: Test Case ID, Module, Test Title, Preconditions, Test Steps, Expected Result, Actual Result, Status, Severity, Compliance.
- Excel Styling:
  - Header fill: Solid dark brown #2B1D16 with bold white text.
  - Status pills: Green fill #D4EDDA for PASS, Red fill #F8D7DA for FAIL.
  - Column auto-sizing and thin borders.
- To regenerate any ticket test matrix:

```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_<ID>/scripts/export_test_cases_node.js"
```
