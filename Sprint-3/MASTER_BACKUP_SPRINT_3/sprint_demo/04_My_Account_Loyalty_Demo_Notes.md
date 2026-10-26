# 🎤 GlobeWest Sprint 3 Demo Notes: My Account - Loyalty

---

### 1. Overview & Feature Scope
- **Feature**: Trade Loyalty Program Portal (`/loyalty/`)
- **Target Staging URL**: `https://mcstaging2.globewest.com/loyalty/`
- **Figma Design Spec**: [Globewest USA - External (Frame 626 / Node 2581-64235)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0)
- **Artboards**: `desktop/my_account/01_loyalty` (1440px) & `mobile/my_account/01_loyalty` (390px)
- **Objective**: Dedicated trade rewards dashboard displaying active tier status, commercial wholesale discount rate, rolling 12-month spend tracking, tier retention targets, pricing levels matrix, and FAQs.

---

### 2. Live Demo Script (Headed Mode)

#### A. Running Desktop Headed Walkthrough:
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Loyalty/scripts/capture_live_desktop.js"
```

**Talking Points During Run**:
1. **Sidebar Navigation Highlighting**:
   - Point out `LOYALTY PROGRAM` link in the left account menu with the active black boundary indicator on the left.
2. **Top Welcome / Loyalty Block (VERIFIED PASSED ✅)**:
   - Point out the `Enterprise tier` pill badge with capsule styling.
   - Verified personalized greeting: `Welcome, Deepali Londhe`, `CUSTOMER #999130725`, and `Tier Discount: 54% off`.
   - Right-aligned luxury promotional sofa photography.
3. **Notification / Promotional Incentive Block**:
   - Displays 1-column card with `Limited offer` pill tag and `LEARN MORE` CTA button.
4. **Trade Program Block & Rolling Spend Tracking**:
   - Displays `Enterprise tier`, large `54% Off` discount rate, and `ROLLING 12M TOTAL: $12,226`.
   - Progress bar: `Spend $10,000 to maintain Enterprise tier` calculating retention spend.
5. **Pricing Levels Matrix Table**:
   - Shows 5-tier table (`PRICING LEVEL`, `DISCOUNT`, `ROLLING 12M TOTAL ⓘ`).
   - Active tier row (Level 3 / Enterprise) is highlighted with a 15% opacity tint of current tier color.
6. **FAQ Accordion Block**:
   - Verified closed by default on initial page render.
   - Single-open auto-collapse interaction verified.

---

#### B. Running Mobile Headed Walkthrough:
```bash
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_My_Account_Loyalty/scripts/capture_live_mobile.js"
```

**Talking Points During Mobile Run**:
1. **Responsive Card Stacking**:
   - Welcome banner text stacks cleanly into a single vertical column; decorative sofa image is hidden to conserve viewport space.
2. **Trade Program Grid Stacking**:
   - 2-column desktop card stacks vertically into single-column layout (Summary card on top, Pricing Levels table below).

---

### 3. Active Real Live Defects Callout 🔴

1. 🔴 **Defect 1: Dummy Latin Body Copy in Welcome Block**:
   - *Expected*: Branded editorial copy explaining trade loyalty benefits.
   - *Actual*: Renders placeholder: *"Lorem ipsum dolor sit amet, adipiscing rhoncus litora ut dui morbi..."*
2. 🔴 **Defect 2: Template Placeholder Dummy Copy in Notification Banner**:
   - *Expected*: Real promotional offer text (e.g. *Spend $5,000 today and unlock Silver status instantly*).
   - *Actual*: Renders literal template placeholder: *"XXXXXX today and unlock Silver status instantly."*
3. 🔴 **Defect 3: Missing Loyalty Status Review Date**:
   - *Expected*: Frame 626 explicitly requires `REVIEW DATE ⓘ` with calendar date in US format (`08/01/2027`).
   - *Actual*: `REVIEW DATE ⓘ` is completely omitted from the live staging Trade Program card.
4. 🔴 **Defect 4: Missing Second Progress Bar (Unlock Next Tier)**:
   - *Expected*: Frame 626 rule mandates progress bar showing spend required to unlock the next tier (*Spend $XX,XXX to unlock Elite*).
   - *Actual*: Only the maintain spend progress bar is present; the unlock next tier bar is missing.
5. 🔴 **Defect 5: Unpopulated Dummy Data Across Entire Pricing Levels Table**:
   - *Expected*: Commercial tier names (Bronze, Silver, Gold, Platinum, Enterprise), real discount percentages, and dollar ranges.
   - *Actual*: Filled with literal dummy placeholders: *Level name 01-05*, *XX% discount*, and *$0 - $X,XXX*.
6. 🔴 **Defect 6: Storefront Scope Leak - Australian Kangaroo Footer Badge**:
   - *Expected*: Clean US footer without Australian regional logos.
   - *Actual*: Renders Australian kangaroo silhouette and *"AUSTRALIAN OWNED & RUN"* badge.

---

### 4. Complete Test Suite Coverage (30 Test Cases)

| Test ID | Module | Scenario / Title | Expected Result (Spec / Frame 626) | Live Status | Severity |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **TC-GW-LOYALTY-001** | Auth & Access | Direct URL Redirection to Login | Redirects unauthenticated guest to login | **PASS** | P1 - High |
| **TC-GW-LOYALTY-002** | Auth & Access | Authenticated Access to `/loyalty/` | Loads loyalty portal with HTTP 200 OK | **PASS** | P1 - High |
| **TC-GW-LOYALTY-003** | Sidebar Nav | Active Link Highlight in Sidebar | Black left indicator bar on 'LOYALTY PROGRAM' | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-004** | Welcome Block | Customer Name & ID Display | 'Welcome, Deepali Londhe', 'CUSTOMER #999130725' | **PASS** | P1 - High |
| **TC-GW-LOYALTY-005** | Welcome Block | Loyalty Status Pill Badge | 'Enterprise tier' pill badge with capsule styling | **PASS** | P1 - High |
| **TC-GW-LOYALTY-006** | Welcome Block | Tier Discount Percentage | 'Tier Discount: 54% off' | **PASS** | P1 - High |
| **TC-GW-LOYALTY-007** | Welcome Block | Tier Color Association | Status tag color matches current tier palette | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-008** | Welcome Block | Promotional Sofa Photography | Desktop right-aligned sofa photo renders cleanly | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-009** | Welcome Block | Editorial Copy Placeholder Audit | Branded US copy; zero dummy text | **FAIL 🔴** | P2 - Medium |
| **TC-GW-LOYALTY-010** | Notification | 1-Column Promo Banner Layout | 'Limited offer' pill, headline, 'LEARN MORE' button | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-011** | Notification | Notification Headline Copy | Real promotional campaign text; zero 'XXXXXX' | **FAIL 🔴** | P2 - Medium |
| **TC-GW-LOYALTY-012** | Notification | 'LEARN MORE' Button Action | Interactive button with hover state and destination | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-013** | Notification | Admin Ability to Hide Block | Dynamic CMS block can be hidden in admin | **PASS** | P3 - Low |
| **TC-GW-LOYALTY-014** | Trade Program | Tier Name & Discount Summary | 'TRADE PROGRAM', 'Enterprise tier', '54% Off' | **PASS** | P1 - High |
| **TC-GW-LOYALTY-015** | Trade Program | Rolling 12M Spend Formatting | Formatted as USD ($12,226) with comma separator | **PASS** | P1 - High |
| **TC-GW-LOYALTY-016** | Trade Program | Rolling Spend Tooltip (ⓘ) | Tooltip triggers explaining rolling spend calculation | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-017** | Trade Program | Review Date & Tooltip (Frame 626) | Renders 'REVIEW DATE ⓘ: 08/01/2027' | **FAIL 🔴** | P1 - High |
| **TC-GW-LOYALTY-018** | Trade Program | US Date Format (MM/DD/YYYY) | Review date enforces US date syntax | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-019** | Progress Bars | Maintain Spend Progress Bar | 'Spend $10,000 to maintain Enterprise tier' | **PASS** | P1 - High |
| **TC-GW-LOYALTY-020** | Progress Bars | Unlock Next Tier Progress Bar | 'Spend $XX,XXX to unlock Elite' bar | **FAIL 🔴** | P2 - Medium |
| **TC-GW-LOYALTY-021** | Progress Bars | Progress Bar Color Matching | Progress bar fill matches tier accent color | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-022** | Tier Table | Table Architecture (3 Columns) | PRICING LEVEL, DISCOUNT, ROLLING 12M TOTAL ⓘ | **PASS** | P1 - High |
| **TC-GW-LOYALTY-023** | Tier Table | Active Tier Row Highlighting | Current tier row highlighted with 15% opacity tint | **PASS** | P1 - High |
| **TC-GW-LOYALTY-024** | Tier Table | Data Realism vs Placeholders | Real tier names, discounts, and dollar ranges | **FAIL 🔴** | P1 - High |
| **TC-GW-LOYALTY-025** | FAQ Module | FAQ Initial Collapsed State | All FAQ answers collapsed by default on load | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-026** | FAQ Module | FAQ Single-Open Rule (Frame 626) | Opening item 2 automatically collapses item 1 | **PASS** | P1 - High |
| **TC-GW-LOYALTY-027** | Mobile View | Welcome Block Stacking (390px) | Text stacks vertically; sofa image hidden | **PASS** | P2 - Medium |
| **TC-GW-LOYALTY-028** | Mobile View | 2-Column Trade Program Stacking | Card stacks cleanly without horizontal overflow | **PASS** | P1 - High |
| **TC-GW-LOYALTY-029** | Storefront | Australian Footer Badge Suppression | US footer suppresses Kangaroo badge | **FAIL 🔴** | P2 - Medium |
| **TC-GW-LOYALTY-030** | NetSuite ERP | Tier and Spend Data Sync | Tier and rolling spend sync with NetSuite ERP | **PASS** | P1 - High |

---

### 5. Artifact Links
- **Excel Test Cases**: [My_Account_Loyalty_Test_Cases.xlsx](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_My_Account_Loyalty/My_Account_Loyalty_Test_Cases.xlsx)
- **CSV Test Cases**: [My_Account_Loyalty_Test_Cases.csv](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_My_Account_Loyalty/My_Account_Loyalty_Test_Cases.csv)
- **Execution Run Command**: [Loyalty runcommand.txt](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_My_Account_Loyalty/Loyalty%20runcommand.txt)
- **Generator Script**: [scripts/export_test_cases_node.js](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_My_Account_Loyalty/scripts/export_test_cases_node.js)
