# Comprehensive QA Audit Report: Ticket #41794540 - About Us Page

## 📋 Ticket & Audit Overview
* **Ticket #:** [#41794540 - About Us](https://overdose.eu.teamwork.com/app/tasks/41794540)
* **Assigned Developer:** Vinod Vankar (*Directive: "Match AU, no redesign required. The page matches the AU live site design as per the Figma reference. Page url: about-us"*)
* **Audit Scope:** Deep Content & Micro-UI inspection, Computed Styles analysis, Asset integrity, and Multi-Breakpoint Responsive Testing comparing **US Staging** against **AU Baseline Staging**.
* **Tested Viewports:**
  - 🖥️ **Desktop:** 1440px × 900px
  - 📱 **Tablet:** 768px × 1024px
  - 📱 **Mobile:** 390px × 844px
* **Date & Timestamp:** 2026-10-01 (Sprint 3)
* **Final QA Verdict:** **100% PASSED (Fully Matched AU Baseline & Ready for Sign-Off)** 🟢

---

## 🔐 Dual-Auth Matrix (Mandatory Logged-In State)
Both storefronts were audited under direct authenticated (logged-in) sessions in accordance with Rule 3:

| Storefront | Environment URL | Authentication Account | Header Verification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **US Staging Target** | `https://mcstaging2.globewest.com/about-us` | `deepali.londhe@overdose.digital` (Trade) | `Company: Alert Loans Pty Ltd` + `My Account ⌵` | ✅ **Authenticated** |
| **AU Baseline Staging** | `https://mcstaging2.globewest.com.au/about-us` | `deepalilondhe576@gmail.com` (Customer) | `My Account ⌵` | ✅ **Authenticated** |

---

## 🔬 Deep Content & Micro-UI Computed Styles Inspection

Every single section on the page was extracted and asserted for `font-size`, `font-weight`, `line-height`, `color`, `width`, `height`, and `padding`:

### 1. 🖥️ Desktop (1440px Viewport) Computed Styles & Dimensions

| Section | Element | Property | AU Baseline | US Staging | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Banner** | Container | Width × Height | `1440px × 600px` | `1440px × 600px` | ✅ **Exact Match** |
| | H2 Headline | Font / Weight / Color | `45px / 400 / #ffffff` | `45px / 400 / #ffffff` | ✅ **Exact Match** |
| | H3 Subhead | Font / Weight / Color | `18px / 400 / #ffffff` | `18px / 400 / #ffffff` | ✅ **Exact Match** |
| | Hero Image | Dimensions | `1920px × 800px` | `1920px × 800px` | ✅ **Exact Match** |
| **Our Vision** | Container | Width × Height | `1440px × 353px` | `1440px × 353px` | ✅ **Exact Match** |
| | H2 Title | Font / Weight / Color | `30px / 400 / #381c12` | `30px / 400 / #381c12` | ✅ **Exact Match** |
| | Body Copy | Font / Weight / Color | `18px / 300 / #381c12` | `18px / 300 / #381c12` | ✅ **Exact Match** |
| **Our Business** | Container | Width × Height | `1440px × 938px` | `1440px × 938px` | ✅ **Exact Match** |
| | Founders Image | Dimensions | `2500px × 1200px` | `2500px × 1200px` | ✅ **Exact Match** |
| | Story Paragraphs | Font / Weight / Color | `15px / 300 / #381c12` | `15px / 300 / #381c12` | ✅ **Exact Match** |
| **Design Diversity** | Container | Width × Height | `1440px × 305px` | `1440px × 305px` | ✅ **Exact Match** |
| | H2 Title | Font / Weight / Color | `30px / 400 / #381c12` | `30px / 400 / #381c12` | ✅ **Exact Match** |
| | 5 Collection Cards | Card Dimensions | `287px × 389px` (each) | `287px × 389px` (each) | ✅ **Exact Match** |
| | Card Images | Image Dimensions | `460px × 620px` (each) | `460px × 620px` (each) | ✅ **Exact Match** |
| **Quote Section** | Quote Text | Font / Style / Color | `15px / 300 italic / #381c12` | `15px / 300 italic / #381c12` | ✅ **Exact Match** |
| **Brand Video** | H3 Headline | Font / Weight / Color | `30px / 400 / #ffffff` | `30px / 400 / #ffffff` | ✅ **Exact Match** |
| | Video Banner | Dimensions | `1920px × 1000px` | `1920px × 1000px` | ✅ **Exact Match** |
| **Our Approach** | Container | Width × Height | `1440px × 424px` | `1440px × 424px` | ✅ **Exact Match** |
| | 6 Principles | Font / Weight / Color | `18px / 300 / #381c12` | `18px / 300 / #381c12` | ✅ **Exact Match** |
| **Our Team** | Team Photo | Dimensions | `1920px × 921px` | `1920px × 921px` | ✅ **Exact Match** |
| **Careers Section** | Container | Width × Height | `1440px × 265px` | `1440px × 265px` | ✅ **Exact Match** |
| | Button 1 (Careers) | Width × Height | `304px × 50px` | `304px × 50px` | ✅ **Exact Match** |
| | Button 2 (Register) | Width × Height | `304px × 50px` | `304px × 50px` | ✅ **Exact Match** |
| | Button Typography | Font / Weight | `14px / 500` | `14px / 500` | ✅ **Exact Match** |

---

### 2. 📱 Mobile (390px Viewport) Computed Styles & Dimensions

| Section | Element | Property | AU Baseline | US Staging | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Banner** | Container | Width × Height | `390px × 412px` | `390px × 412px` | ✅ **Exact Match** |
| | H2 Headline | Font / Weight / Color | `35px / 400 / #ffffff` | `35px / 400 / #ffffff` | ✅ **Exact Match** |
| | H3 Subhead | Font / Weight / Color | `15px / 400 / #ffffff` | `15px / 400 / #ffffff` | ✅ **Exact Match** |
| **Our Vision** | Container | Width × Height | `390px × 384px` | `390px × 384px` | ✅ **Exact Match** |
| | H2 Title | Font / Weight / Color | `24px / 400 / #381c12` | `24px / 400 / #381c12` | ✅ **Exact Match** |
| | Body Copy | Font / Weight / Color | `15px / 300 / #381c12` | `15px / 300 / #381c12` | ✅ **Exact Match** |
| **Our Business** | Container | Width × Height | `390px × 878px` | `390px × 878px` | ✅ **Exact Match** |
| | H2 Title | Font / Weight / Color | `26px / 400 / #381c12` | `26px / 400 / #381c12` | ✅ **Exact Match** |
| **Design Diversity** | Container | Width × Height | `390px × 205px` | `390px × 205px` | ✅ **Exact Match** |
| | Cards (Stacked) | Card Dimensions | `332px × 467px` | `332px × 467px` | ✅ **Exact Match** |
| **Our Approach** | Container | Width × Height | `390px × 528px` | `390px × 528px` | ✅ **Exact Match** |
| | H2 Title | Font / Weight / Color | `26px / 400 / #381c12` | `26px / 400 / #381c12` | ✅ **Exact Match** |
| | Intro Copy | Font / Weight / Color | `16px / 300 / #381c12` | `16px / 300 / #381c12` | ✅ **Exact Match** |
| **Careers Section** | Container | Width × Height | `390px × 328px` | `390px × 328px` | ✅ **Exact Match** |
| | Button 1 (Careers) | Dimensions & Padding | `350px × 50px (pad: 5px 68px)` | `350px × 50px (pad: 5px 68px)` | ✅ **Exact Match** |
| | Button 2 (Register) | Dimensions & Padding | `350px × 50px (pad: 5px 68px)` | `350px × 50px (pad: 5px 68px)` | ✅ **Exact Match** |

---

### 3. 📱 Tablet (768px Viewport) Responsive Section Heights

| Section Name | AU Baseline Height | US Staging Height | Variance | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Banner** | `811px` | `811px` | `0px` | ✅ **100% Match** |
| **Our Vision** | `296px` | `296px` | `0px` | ✅ **100% Match** |
| **Our Business** | `1080px` | `1080px` | `0px` | ✅ **100% Match** |
| **Design Diversity Intro** | `153px` | `153px` | `0px` | ✅ **100% Match** |
| **Design Diversity Cards** | `670px` | `670px` | `0px` | ✅ **100% Match** |
| **Stephen Mendel Quote** | `155px` | `155px` | `0px` | ✅ **100% Match** |
| **Brand Video** | `375px` | `375px` | `0px` | ✅ **100% Match** |
| **Our Approach** | `414px` | `414px` | `0px` | ✅ **100% Match** |
| **Our Team** | `780px` | `780px` | `0px` | ✅ **100% Match** |
| **Careers & CTAs** | `306px` | `306px` | `0px` | ✅ **100% Match** |

---

## 📸 Side-by-Side Comparison Cards (AU Baseline vs US Staging)

All comparison cards have been generated according to Rule 5 standards:

1. **Card 01 - Hero Banner & Heading:** [01_Hero_Banner_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/01_Hero_Banner_Comparison.png)
2. **Card 02 - Our Vision & Founders:** [02_Founders_Our_Business_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/02_Founders_Our_Business_Comparison.png)
3. **Card 03 - Design Diversity (5 Styles):** [03_Design_Diversity_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/03_Design_Diversity_Comparison.png)
4. **Card 04 - Quote & Brand Video:** [04_Quote_and_Video_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/04_Quote_and_Video_Comparison.png)
5. **Card 05 - Our Approach & Team:** [05_Our_Approach_and_Team_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/05_Our_Approach_and_Team_Comparison.png)
6. **Card 06 - Careers Block & Buttons:** [06_Careers_Block_and_Buttons_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/06_Careers_Block_and_Buttons_Comparison.png)
7. **Card 07 - Mobile Viewport (390px):** [07_Mobile_Viewport_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/07_Mobile_Viewport_Comparison.png)
8. **Card 08 - Tablet Viewport (768px):** [08_Tablet_Viewport_Comparison.png](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/comparison/08_Tablet_Viewport_Comparison.png)

---

## 🛠️ Reproduction Commands
Saved inside [`About Us runcommand.txt`](file:///home/deepali/My%20Projects/Deepali/GlobeWest%202026%20(2)/Sprint-3/Ticket_41794540_About_Us/About%20Us%20runcommand.txt):

* **Desktop View:**
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794540_About_Us/scripts/test_about_us_desktop.js"
  ```

* **Mobile View:**
  ```bash
  NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794540_About_Us/scripts/test_about_us_mobile.js"
  ```
