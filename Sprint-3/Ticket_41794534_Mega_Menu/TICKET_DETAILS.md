# Ticket Specification & Audit Tracker: Ticket #41794534

| Metadata | Details |
|---|---|
| **Ticket Name** | **Mega menu** |
| **Project** | P-GLW-007 Globewest US Expansion Project |
| **Teamwork Task ID** | [#41794534](https://overdose.eu.teamwork.com/app/tasks/41794534) |
| **Target US Staging URL** | `https://mcstaging2.globewest.com/` |
| **Baseline AU Staging URL** | `https://mcstaging2.globewest.com.au/` |
| **Figma Design Spec** | [Globewest USA - External (Header & Navigation)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External) |
| **QA Lead** | Deepali Londhe (`@DeepaliL`) |
| **Audit Focus** | **Direct Parity Comparison: US Staging (`mcstaging2.globewest.com`) vs. AU Staging Baseline (`mcstaging2.globewest.com.au`)** |

---

## 1. Ticket Acceptance Criteria & Objectives
1. **Direct AU Staging Parity (`https://mcstaging2.globewest.com.au/`):**
   - The US Header Mega Menu reuses the AU header codebase. All 9 top-level categories, column groupings, and flyout interactions must match AU staging.
2. **Category Hierarchy & Multi-Tier Navigation:**
   - Verify categories: `Indoor`, `Outdoor`, `Homewares`, `In Stock`, `Customisation`, `Projects`, `Inspiration`.
   - Subcategory levels: Level 0 (Top bar) -> Level 1 (Dropdown column headers) -> Level 2 (Links).
3. **Australian Scope & Domain Leakage Prevention:**
   - Verify that links in the US mega menu route to US catalog paths (`mcstaging2.globewest.com/...`) and DO NOT point to Australian domains (`.com.au` or `globewestoutlet.com.au`).
4. **Promotional / Editorial Card Parity:**
   - Audit the right-hand promotional card for each category dropdown against AU staging.
5. **Mobile Viewport Drawer Navigation (390×844):**
   - Ensure mobile drawer menu expands categories and subcategories cleanly without layout breakage.

---

## 2. Page Execution Commands File
Per QA Rule 6, refer to [`Mega Menu runcommand.txt`](Mega%20Menu%20runcommand.txt) for exact terminal commands.
