# 🚀 Ticket 4: Execution Commands Reference

All commands can be executed directly from the terminal at `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)`.

---

## 💻 1. NPM Run Commands

### 🌟 Command A: Run Storefront & AU Baseline Comparison with Visual Highlighting (RECOMMENDED)
Opens Chrome, audits `https://mcstaging2.globewest.com` (highlighting every section in pink `🇺🇸 [US Storefront]`), then **immediately opens `https://mcstaging2.globewest.com.au/`** (highlighting matching sections in cyan `🇦🇺 [AU Baseline]`), compares them side-by-side, captures screenshots, and logs the parity matrix:
```bash
npm run test:ticket4:functional
```

### 🔐 Command B: Run Magento Admin Panel Tests with Visual Highlighting
Opens Chrome, authenticates to Magento Admin, and highlights the Scope Switcher, Default Pages config (`CMS Home Page = Home page - US`), CMS Page `home-us`, and all 9 Blocks:
```bash
npm run test:ticket4:admin
```

### 🖥️ Command C: Run Full Ticket 4 Test Suite in Headed Mode
Runs both Admin and Storefront tests in a visible browser window:
```bash
npm run test:ticket4:headed
```

### ⚡ Command D: Run Full Suite Headless (Fast Background Execution)
Runs all 13 test cases in the background and outputs the report:
```bash
npm run test:ticket4
```

---

## 📜 2. One-Click Shell Scripts

You can also run the dedicated shell scripts located directly in this folder:

```bash
# 1. Run Storefront Visual Highlight Flow:
bash "Ticket 4 - Set up the CMS Structure/run_storefront_test.sh"

# 2. Run Magento Admin Panel Tests:
bash "Ticket 4 - Set up the CMS Structure/run_admin_test.sh"

# 3. Run Full Ticket 4 Suite:
bash "Ticket 4 - Set up the CMS Structure/run_ticket4_test.sh"
```

---

## 📊 3. View Interactive HTML Test Report

To view the full visual Playwright HTML report with recordings and screenshots:
```bash
npm run report
```
*(Opens interactive test report at `http://localhost:9325`)*
