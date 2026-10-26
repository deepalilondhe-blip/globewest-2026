# 🎤 GlobeWest Sprint 3 Demo Notes: Trade Application Form

---

### 1. Overview & Objective
- **Feature**: Trade Application Onboarding Wizard (`/gwcustomer/trade/create`)
- **Figma Reference**: Globewest USA - External (`node-id=3226-21024` desktop, `node-id=3226-21130` mobile, `node-id=3226-21364` EIN change).
- **Scope**: Multi-step AJAX trade registration form tailored for US interior designers, architects, and trade professionals.

---

### 2. Live Demo Script (Headed Mode)

#### A. Running the Automated Desktop Headed Walkthrough:
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_Trade_Application_Form/scripts/run_desktop_live_comparison.js"
```
**Talking Points During Run**:
1. **Step 1 - Contact Details**:
   - Note realistic dummy data entry: *Sarah Jenkins, Jenkins Design Studio LLC*.
   - **Call Out Blocker**: When entering a valid US phone number (`212 555 0199`), Magento triggers Australian mobile regex validation (`0491... / +61...`). This is a **P0 Critical Blocker** because US customers cannot submit without an AU number.
   - Script applies the bypass number (`0491 570 157`) to unlock Step 2.
2. **Step 2 - Business Details (Figma Counterpart)**:
   - **Verified Success**: Note that the tax ID field has been correctly localized from Australian **ABN\*** to US **EIN\*** per Figma change request `3226-21364`.
   - **Verified Success**: Note the US State dropdown populates all 50 US States and territories.
   - **UI Discrepancy 1**: Back navigation displays `← GO BACK` instead of Figma `← BACK`.
   - **UI Discrepancy 2**: State placeholder displays `Please select ⌵` instead of Figma `State ⌵`.
   - **UI Discrepancy 3**: Employees field placeholder displays `Number of employees` instead of Figma `eg. 1`.
   - **UI Discrepancy 4**: Street Address has mandatory asterisk `*` which is optional in Figma.
3. **Step 3 - Additional Information**:
   - Note smooth transition into Step 3 with Website, Instagram, and Terms checkbox.

---

#### B. Running the Automated Mobile Headed Walkthrough:
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_Trade_Application_Form/scripts/run_mobile_live_comparison.js"
```
**Talking Points During Mobile Run**:
1. Responsive single-column layout successfully stacks all inputs without clipping or horizontal scroll.
2. Demonstrates identical phone validation blocker on mobile viewports.

---

### 3. Visual Comparisons & Test Suite Links
- **Interactive Defect Viewer**: `Sprint-3/Ticket_Trade_Application_Form/VIEW_DEFECT_IMAGES.html`
- **Excel Test Cases**: `Sprint-3/Ticket_Trade_Application_Form/Trade_Application_Form_Test_Cases.xlsx`
- **Full QA Audit Report**: `Sprint-3/Ticket_Trade_Application_Form/QA_AUDIT_REPORT.md`
