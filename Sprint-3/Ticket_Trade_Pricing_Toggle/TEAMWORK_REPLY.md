# Teamwork / Jira Ticket Update: Trade Pricing Toggle Verification

**Ticket**: Trade Pricing Toggle Functional Audit & Specification Parity  
**Storefront**: GlobeWest US Staging (`https://mcstaging2.globewest.com`)  
**Baseline**: GlobeWest AU Staging Baseline (`https://mcstaging2.globewest.com.au`)  
**Status**: 🟢 **CORE FE IMPLEMENTATION VERIFIED (WITH 1 DEPENDENCY DEFECT FLAGGED)**  

---

### Verification Summary against Approved Specification:

1. **General Public / Logged Out**:
   - ✅ **PASS**: Unauthenticated visitors have 100% price masking. The `.price-toggle` component is strictly hidden from the DOM. Add to Cart CTAs are completely suppressed.

2. **Logged-in Trade Customer**:
   - ✅ **PASS**: Authenticated Trade users (`deepali.londhe@overdose.digital`) receive the `.price-toggle` in the header utility bar.
   - ✅ **PASS**: Default state is `👁️ Trade ⌵` with dual pricing displayed across Category PLP (`$638.00 • MSRP: $701.80`) and PDP.
   - ✅ **PASS**: Clicking the toggle trigger exposes `[ Trade ]` and `[ MSRP ]` options.

3. **MSRP Mode (Showroom Presentation)**:
   - ✅ **PASS**: Selecting MSRP updates `<html>` root class to `price-view-msrp`, completely hides/suppresses wholesale trade prices, and displays customer-facing MSRP only (`$701.80 MSRP`). This supports salesperson showroom presentations without leaking trade margins.

4. **Cart & Checkout Transaction Pricing Invariance**:
   - ✅ **PASS**: Verified that the pricing toggle is presentation-only. Cart line items and order totals strictly bill at Trade wholesale pricing even when added/browsed under MSRP mode.

5. **Mobile Viewport Specification**:
   - ✅ **PASS**: On mobile viewports (390px iPhone), the toggle renders with an eye icon (`👁️`) trigger in the utility header. Tapping it opens a smooth slide-out drawer containing Trade and MSRP options.

6. **AU Baseline Parity Safeguard**:
   - ✅ **PASS**: AU baseline (`mcstaging2.globewest.com.au`) has no price toggle (`hasToggle: false`). The feature is cleanly isolated to the US storefront.

---

### 🔴 Dependency Defect & Items for Business Sign-Off:

- 🔴 **DEFECT-TPT-01 (SearchSpring Integration)**: Catalog search results (`/catalogsearch/result/?q=...`) currently fail to render products on `mcstaging2`, blocking SearchSpring toggle coordination. SearchSpring index sync required on US staging.
- ⚠️ **US Sales Tax Decision**: Confirmed US staging renders prices exclusive of tax by default ($638.00 / $701.80), with tax calculated at checkout. Pending formal business confirmation.

---

### Deliverables:
- 📊 **Test Cases (17 Cases)**: `Sprint-3/Ticket_Trade_Pricing_Toggle/Trade_Pricing_Toggle_Test_Cases.xlsx` & `.csv`
- 📸 **Visual Proofs**: `Sprint-3/Ticket_Trade_Pricing_Toggle/comparison/` (5 Red/Green side-by-side images)
- 📄 **Run Commands**: `Sprint-3/Ticket_Trade_Pricing_Toggle/Trade Pricing Toggle runcommand.txt`
