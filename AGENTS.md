# GlobeWest QA Mandatory Verification Rules & Standards

> **STRICT DIRECTIVE**: For every page, module, and ticket tested (Header, Footer, PLP, PDP, Cart, Mini-Cart, CMS, etc.), testing MUST go beyond basic functional "presence" checks and enforce pixel-perfect Figma design fidelity, DOM structural placement, dual-auth states, and catalog asset integrity.

---

## 1. 🔍 Pixel-Perfect Micro-UI & CSS Inspection (Never Assert Just "Presence")
* **Never mark an element as PASSED simply because it exists in the DOM.**
* Always assert computed styles (`window.getComputedStyle(el)`) against Figma specs:
  1. **Typography & Font Weight**:
     - Inspect `font-weight` (e.g., regular `400` vs bold `700`). Flag bold labels where Figma specifies regular weight (e.g., `Compare`).
     - Inspect `font-family`, `font-size`, and `line-height`.
  2. **Padding, Margins & Edge Insets**:
     - Elements must NOT sit flush at `0px` against image boundaries or containers unless explicitly designed.
     - Verify explicit padding/margin (e.g., `[ ] Compare` must have 12px–16px inset breathing room from image corners).
  3. **Border Radius & Pill Styling**:
     - Verify tags/badges (e.g., `New`, `Customize`) have proper pill shapes (`border-radius: 9999px` / capsule) and comfortable internal padding, not boxy 0px rectangles.

---

## 2. 🏗️ DOM Placement & Structural Hierarchy Verification
* **Never assume an element is in the correct place just because it is inside the card/section.**
* Always assert parent/child hierarchy:
  - **Badges (`New`, `Customize`)**: Must sit **BELOW the product photo** inside `.product-item-details` (above the product title), and must NOT be overlaid directly on top of the `.product-item-photo` container.
  - **Toolbars & Buttons**: Must verify left-aligned vs centered positioning and presence of toggles (e.g., dedicated `"Show Filters"` button pinned before filter pills).

---

## 3. 🔐 Dual-Auth Matrix Testing (Logged-Out Guest vs. Logged-In Trade)
Every ticket touching pricing, catalog, header, cart, or account MUST be tested under BOTH states:
1. **Logged-Out (Public Browsing Mode)**:
   - Wholesale/trade pricing must be strictly masked (`Trade Login Required / Unpriced`).
   - Top utility bar must show `"Become a Trade Customer"` / `"Ready to Buy"` and `"Book Showroom"`.
2. **Logged-In (Trade Customer Mode)**:
   - Header pricing toggle must appear (`Trade` vs `MSRP`).
   - Dual pricing line must render: **Trade Price + MSRP** (e.g., `$1390 • MSRP: $1490`).
   - Inventory & stock indicator must render: **`• In Stock (X)`** or lead-time status.
   - Trade registration CTAs must be hidden.

---

## 4. 📦 Data Integrity & Asset Authenticity (Zero Placeholders)
* **Image Asset Validation**:
  - Do NOT just check `img.complete` or HTTP 200 status.
  - Assert that `img.getAttribute('src')` does NOT contain `/placeholder/default/` or "Coming Soon". Flag placeholder images as **Catalog / NetSuite (NS) Sync Defects**.
* **Editorial & Copy Validation**:
  - Assert that copy does NOT contain template tags or dummy text (e.g., `"Lorem ipsum"`, `"SEO Text to go here"`).

---

## 5. 📸 Defect Reporting & Visual Standards
* **Color Standard**:
  - 🔴 **RED BORDER / TAG**: US Storefront Actual Defect
  - 🟢 **GREEN BORDER / TAG**: Approved Figma Spec or AU Baseline
* **Reporting Format**:
  - Every defect must have:
    1. A single-line defect summary.
    2. Expected (Figma / AU) vs Actual (US Staging Live).
    3. Clear, annotated side-by-side Red/Green comparison image.

---

## 6. 📄 Dedicated `<Page Name> runcommand.txt` Standard (Mandatory for Every Ticket)
For every ticket moving forward, always create a dedicated `.txt` file named `<Page Name> runcommand.txt` inside that ticket's directory.
The file format MUST strictly contain only the following 4 items with ZERO extra text, fluff, or commentary:

```text
Ticket Name: <Ticket # - Ticket Name>
Page Name: <Page Name> (<URL>)

Run command for Desktop View:
<exact terminal command for desktop view>

Run command for Mobile View:
<exact terminal command for mobile view>
```
