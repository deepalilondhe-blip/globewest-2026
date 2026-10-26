# 🏆 GlobeWest QA Defect & Design Parity Audit Report
## Ticket: Trade Application Form (Sprint 3)
**Target URL**: `https://mcstaging2.globewest.com/gwcustomer/trade/create`  
**Figma Reference**: Globewest USA - External -> `[FINAL] Designs - September Changes`  
- Desktop Frame: `desktop/trade application` (`node-id=3226-21024`)  
- Mobile Frame: `mobile/trade application` (`node-id=3226-21130`)  
- EIN Change Request Frame: `Trade Application EIN change` (`node-id=3226-21364`)  

---

### 📌 Executive Summary
An exhaustive visual, structural, and functional QA audit of the **Trade Application Form** was conducted in **headed Chrome browser mode** on both **Desktop (1440x900)** and **Mobile (390x844)** viewports against approved Figma specifications.

All previously reported defects from the Google Sheet / Jira tracker were retested, and deep micro-UI inspections were performed across typography, input dimensions, border radii, casing, and regional copy to uncover new defects.

#### Overall Status: **CONDITIONALLY PASSED** (Critical P0 Phone Validation Blocker RESOLVED; 12 Micro-UI Discrepancies & Localization Leaks Identified)

---

### 🎯 Test Matrix & Environment

| Parameter | Specification |
| :--- | :--- |
| **Live Target Storefront** | `https://mcstaging2.globewest.com/gwcustomer/trade/create` |
| **AU Baseline Storefront** | `https://mcstaging2.globewest.com.au/gwcustomer/trade/create` |
| **Figma Desktop Spec** | Frame `desktop/trade application` (`node-id=3226-21024`) |
| **Figma Mobile Spec** | Frame `mobile/trade application` (`node-id=3226-21130`) |
| **Figma EIN Change Request** | Frame `Trade Application EIN change` (`node-id=3226-21364`) |
| **Desktop Viewport** | 1440 x 900 (Desktop Luxury Layout) |
| **Mobile Viewport** | 390 x 844 (Mobile iPhone 14 Standard) |
| **Browser Engine** | Google Chrome (Headed Execution Mode Verified on `DISPLAY=:0`) |
| **Test Data Used** | Realistic US Trade Customer Dummy Data (Sarah Jenkins, Jenkins Design Studio LLC, 450 Lexington Ave, New York, NY 10017, EIN: 12-3456789) |

---

### 🔍 Comprehensive Element Parity Table (Figma vs Live US Staging)

| # | Element / Field | Approved Figma Spec | Live US Staging (mcstaging2) | Status | Severity / Note |
| :-: | :--- | :--- | :--- | :-: | :--- |
| **1** | **Step 1 US Phone Validation** | Accepts 10-digit US phone (`2125550199`) | **ACCEPTED**: Form advances cleanly to Step 2 | 🟢 **PASS** | **RESOLVED & VERIFIED (Was P0 Blocker)** |
| **2** | **Back Navigation CTA** | `← BACK` (Underlined) | `← BACK` (Underlined) | 🟢 **PASS** | **RESOLVED & VERIFIED** |
| **3** | **Tax ID Field Label** | `EIN*` (With mandatory `*`) | `EIN` (NO asterisk `*`) | ❌ **FAIL** | **NEW DEFECT**: Missing mandatory `*` on EIN label |
| **4** | **Next CTA Button Shape** | Capsule Pill (`border-radius: 9999px`) | Boxy Rectangle (`border-radius: 2px`) | ❌ **FAIL** | **NEW DEFECT**: Violates Rule 1 pill styling |
| **5** | **Head Office Street Address** | `HEAD OFFICE STREET ADDRESS` (No `*`) | `HEAD OFFICE STREET ADDRESS*` (With `*`) | ❌ **FAIL** | Spec Discrepancy: Mandatory `*` present on optional field |
| **6** | **Yearly Spend Label** | `WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?` (No `*`) | `WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?*` (With `*`) | ❌ **FAIL** | Spec Discrepancy: Mandatory `*` present |
| **7** | **Yearly Spend Tier 2 Spacing** | `10k - 30k` (Space around hyphen) | `10k-30k` (No space around hyphen) | ❌ **FAIL** | **NEW DEFECT**: Typography spacing mismatch |
| **8** | **State Dropdown Placeholder** | `State ⌵` (Title case uppercase 'S') | `state ⌵` (lowercase 's') | ❌ **FAIL** | **NEW DEFECT**: Letter casing mismatch |
| **9** | **Sign In Hyperlink Casing** | `Already have an account? Sign In` | `Already have an account? Sign in` | ❌ **FAIL** | Casing Mismatch: Lowercase 'i' in live link |
| **10** | **Step 1 Intro Copy Spelling** | "authorized design professional" (US 'z') | "authorised design professional" (AU 's') | ❌ **FAIL** | **NEW DEFECT**: AU English spelling leak on US site |
| **11** | **Header Wishlist Icon** | Wishlist Heart (`🤍`) present | Wishlist icon completely missing | ❌ **FAIL** | Header Utility Mismatch |
| **12** | **Header Navigation Spelling** | Projects (US, 8 items total) | `Customisation` (AU spelling, 9 items) | ❌ **FAIL** | Navigation Asset Leak |
| **13** | **Mobile Header Utility Bar** | No brown bar on mobile | Leaking brown bar clipped to `Book Showroom` | ❌ **FAIL** | **NEW DEFECT**: Mobile header layout defect |
| **14** | **Footer Brand Badges** | Clean US brand presentation | Leaking `AUSTRALIAN OWNED & RUN` badge | ❌ **FAIL** | Regional Brand Leak |
| **15** | **Entity Name Placeholder** | `Enter entity name if different to the business name` | `Enter entity name if different to the business name` | 🟢 **PASS** | **RESOLVED & VERIFIED** |
| **16** | **Number of Employees Placeholder** | `eg. 1` | `eg. 1` | 🟢 **PASS** | **RESOLVED & VERIFIED** |
| **17** | **State Options Count** | 50 US States + DC / Territories | Populates all 65 US states & territories | 🟢 **PASS** | Functional match |
| **18** | **Commercial Projects Radios** | `○ Yes`  `○ No` | `○ Yes`  `○ No` (Mutually exclusive) | 🟢 **PASS** | Functional match |

---

### 🚨 Itemized Defect Specifications & Visual Proof

#### Defect 1: [TAX ID ASTERISK] EIN Field Label Missing Mandatory Asterisk (`*`)
- **Defect Summary**: On Step 2 Business Details, the tax identification label renders as `EIN` without an asterisk, whereas approved Figma spec explicitly specifies `EIN*`.
- **Expected (Figma Spec - Node 3226-21364)**: `EIN*` (Mandatory field indicator required).
- **Actual (US Staging Live)**: `EIN` (No asterisk rendered).
- **Severity**: **MEDIUM** (Data Specification Parity).
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_01_EIN_LABEL_AND_STREET_ADDRESS_ASTERISKS.png`.

#### Defect 2: [PILL STYLING] NEXT Button Styled with Boxy `border-radius: 2px` Instead of Figma Capsule Pill Shape
- **Defect Summary**: Primary `NEXT` CTA buttons on Step 1, Step 2, and Step 3 render as rectangular boxes with 2px corner radius rather than the luxury pill/capsule shape designed in Figma.
- **Expected (Figma Spec)**: Capsule pill shape (`border-radius: 9999px` / `50px`, padding: 12px 64px).
- **Actual (US Staging Live)**: Boxy rectangle (`border-radius: 2px; height: 50px; background-color: rgb(56, 28, 18)`).
- **Severity**: **HIGH** (Rule 1 Micro-UI Violations).
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_02_NEXT_BUTTON_PILL_RADIUS_AND_SIGNIN_CASING.png`.

#### Defect 3: [MANDATORY ASTERISK] Head Office Street Address Marked Mandatory with Asterisk (`*`)
- **Defect Summary**: `HEAD OFFICE STREET ADDRESS*` displays a mandatory asterisk on live staging, while Figma explicitly defines the field without an asterisk (optional).
- **Expected (Figma Spec - Node 3226-21024 / 3226-21130)**: `HEAD OFFICE STREET ADDRESS` (No asterisk).
- **Actual (US Staging Live)**: `HEAD OFFICE STREET ADDRESS*` (With mandatory `*`).
- **Severity**: **MEDIUM**.
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_01_EIN_LABEL_AND_STREET_ADDRESS_ASTERISKS.png`.

#### Defect 4: [MANDATORY ASTERISK] Average Yearly Spend Label Marked Mandatory with Asterisk (`*`)
- **Defect Summary**: The question label for yearly furniture spend has a mandatory asterisk on live staging, whereas Figma specifies no asterisk.
- **Expected (Figma Spec)**: `WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?` (No asterisk).
- **Actual (US Staging Live)**: `WHAT IS YOUR AVERAGE YEARLY SPEND ON FURNITURE?*` (With mandatory `*`).
- **Severity**: **LOW**.
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_03_YEARLY_SPEND_ASTERISK_AND_TIER_SPACING.png`.

#### Defect 5: [TYPOGRAPHY / SPACING] Yearly Spend Tier 2 Dash Spacing Mismatch (`10k-30k` vs `10k - 30k`)
- **Defect Summary**: In the yearly spend tier radio group, Tier 2 lacks spaces around the hyphen.
- **Expected (Figma Spec)**: `10k - 30k` (Space before and after hyphen).
- **Actual (US Staging Live)**: `10k-30k` (No spaces around hyphen).
- **Severity**: **LOW**.
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_03_YEARLY_SPEND_ASTERISK_AND_TIER_SPACING.png`.

#### Defect 6: [LETTER CASING] State Dropdown Unselected Placeholder Rendered in Lowercase (`state` vs `State`)
- **Defect Summary**: The unselected option in the US state dropdown renders in lowercase `state` instead of title case `State`.
- **Expected (Figma Spec)**: `State ⌵` (Title case uppercase 'S').
- **Actual (US Staging Live)**: `state ⌵` (lowercase 's').
- **Severity**: **LOW**.
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/screenshots/step_by_step/02_STEP2_INITIAL.png`.

#### Defect 7: [LETTER CASING] "Already have an account? Sign In" Capitalization Mismatch
- **Defect Summary**: The hyperlink below the NEXT button uses sentence case `Sign in` rather than title case `Sign In`.
- **Expected (Figma Spec)**: `Already have an account? Sign In` (Capital 'I' in 'Sign In').
- **Actual (US Staging Live)**: `Already have an account? Sign in` (lowercase 'i' in 'Sign in').
- **Severity**: **LOW**.
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_02_NEXT_BUTTON_PILL_RADIUS_AND_SIGNIN_CASING.png`.

#### Defect 8: [LOCALIZATION LEAK] British/Australian Spelling "authorised" in Step 1 Intro Copy
- **Defect Summary**: The introductory paragraph on Step 1 contains the British/AU spelling `authorised` rather than US English `authorized`.
- **Expected (US English Spec)**: "To become a GlobeWest stockist or **authorized** design professional, please complete the form below..." (with 'z').
- **Actual (US Staging Live)**: "To become a GlobeWest stockist or **authorised** design professional, please complete the form below..." (with 's').
- **Severity**: **MEDIUM** (Localization Integrity).
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_04_STEP1_COPY_SPELLING_LOCALIZATION.png`.

#### Defect 9: [HEADER UTILITY] Wishlist Heart Icon (`🤍`) Missing in Header
- **Defect Summary**: In Figma desktop header utility, a Wishlist Heart icon is present between `Login ⌵` and the shopping cart (`🛒`). On live US staging, it is missing.
- **Expected (Figma Spec)**: Wishlist Heart icon (`🤍`) rendered between Login and Cart.
- **Actual (US Staging Live)**: Wishlist Heart icon is completely absent.
- **Severity**: **MEDIUM**.
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/COMPARISON_04_STOREFRONT_LEAKAGES_NAV_FOOTER.png`.

#### Defect 10: [NAVIGATION DEFECT] `Customisation` (AU Spelling) Leaked into US Navigation Menu
- **Defect Summary**: The live US staging navigation displays 9 items including `Customisation` (AU spelling with 's'), whereas Figma specifies 8 items and uses `Projects`.
- **Expected (Figma Spec)**: `Projects` navigation item (8 top-level items total, no `Customisation`).
- **Actual (US Staging Live)**: `Customisation` rendered as an extra item before `Projects`.
- **Severity**: **HIGH** (Editorial & Navigation Defect).
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_05_NAVIGATION_CUSTOMISATION_LEAK.png`.

#### Defect 11: [MOBILE HEADER LEAK] Desktop Utility Bar Leaks onto Mobile Viewport (Clipped "Book Showroom")
- **Defect Summary**: On mobile viewports (390px / 375px), the brown desktop top utility bar is rendered and clipped to just "Book Showroom", whereas Figma mobile spec has no top utility bar.
- **Expected (Figma Mobile Spec)**: Clean mobile header starting directly with hamburger (`☰`), search (`🔍`), logo, and cart.
- **Actual (US Staging Live)**: Leaks brown top bar showing clipped `Book Showroom`.
- **Severity**: **MEDIUM** (Responsive UI Defect).
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/screenshots/deep_headed_audit/MOBILE_STEP2_TOP.png`.

#### Defect 12: [FOOTER LEAK] Australian Owned & Run Badge & AU Outlet Link Leaked in Footer
- **Defect Summary**: The US storefront footer renders the proprietary Australian map logo `"AUSTRALIAN OWNED & RUN"` and AU outlet link `"Shop Outlet"`.
- **Expected (US Staging)**: Clean US footer without Australian regional branding.
- **Actual (US Staging Live)**: AU badge and link visible on both Desktop and Mobile viewports.
- **Severity**: **HIGH** (Brand Localization Leak).
- **Evidence**: `Sprint-3/Ticket_Trade_Application_Form/comparison/COMPARISON_04_STOREFRONT_LEAKAGES_NAV_FOOTER.png`.

---

### 📂 Test Assets & Verification Deliverables

1. **Dedicated Run Command File (AGENTS.md Rule 6)**:
   - `Sprint-3/Ticket_Trade_Application_Form/Trade Application Form runcommand.txt`
2. **Headed Demonstration Scripts**:
   - Desktop: `Sprint-3/Ticket_Trade_Application_Form/scripts/run_desktop_live_comparison.js`
   - Mobile: `Sprint-3/Ticket_Trade_Application_Form/scripts/run_mobile_live_comparison.js`
3. **Annotated Red/Green Comparison Evidence**:
   - `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_01_EIN_LABEL_AND_STREET_ADDRESS_ASTERISKS.png`
   - `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_02_NEXT_BUTTON_PILL_RADIUS_AND_SIGNIN_CASING.png`
   - `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_03_YEARLY_SPEND_ASTERISK_AND_TIER_SPACING.png`
   - `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_04_STEP1_COPY_SPELLING_LOCALIZATION.png`
   - `Sprint-3/Ticket_Trade_Application_Form/comparison/NEW_DEFECT_05_NAVIGATION_CUSTOMISATION_LEAK.png`
   - `Sprint-3/Ticket_Trade_Application_Form/comparison/COMPARISON_04_STOREFRONT_LEAKAGES_NAV_FOOTER.png`
