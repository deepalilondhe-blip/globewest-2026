# Ticket Specification & Audit Tracker: Ticket #41794529

| Metadata | Details |
|---|---|
| **Ticket Name** | **My Account - Quotes** |
| **Project** | P-GLW-007 Globewest US Expansion Project |
| **Teamwork Task ID** | [#41794529](https://overdose.eu.teamwork.com/app/tasks/41794529) |
| **Target Live Staging URL** | `https://mcstaging2.globewest.com/gw_quotes/quote/index/` |
| **Figma Design Spec** | [Globewest USA - External (Node 2581-64235)](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0) |
| **Target User Profile** | Trade Customer (`deepali.londhe@overdose.digital`) |
| **QA Lead** | Deepali Londhe (`@DeepaliL`) |
| **Current Phase** | Pre-Development / In Progress Verification Readiness |

---

## 1. Verified Live Staging Baseline
* **Live Route:** `/gw_quotes/quote/index/` (Protected customer account area)
* **Access Standard:** Requires authenticated Trade Customer login session (`deepali.londhe@overdose.digital`).
* **Live Layout Captured:** [`screenshots/desktop/01_my_quotes_live_staging.png`](screenshots/desktop/01_my_quotes_live_staging.png)

### Observed Live Structure:
1. **Title & Copy:** Heading `"My Quotes"` with 30-day quote validity description text.
2. **Filter Tabs:** `ALL`, `OPEN`, `CONVERTED`, `EXPIRED`.
3. **Search Component:** Global search input for quote reference lookup.
4. **Data Grid (9 Columns):**
   - `QUOTE N`
   - `EXPIRY DATE`
   - `CUST PO#`
   - `QUOTE NAME`
   - `CLIENT NAME`
   - `STATUS`
   - `TOTAL`
   - `DETAILS`
   - `ACTIONS`
5. **Empty State Alert:** `ⓘ Table is empty!` box.
6. **Footer Scope Leak Identified:** The page footer contains the Australian `"AUSTRALIAN OWNED & RUN"` badge.

---

## 2. Figma Design Cross-Check Requirements (Node 2581-64235)
* Figma URL opened directly in Chrome (`deepali.londhe@overdose.digital`).
* Elements to assert against Figma artboard:
  1. Micro-UI styling & padding of tabs (`ALL`, `OPEN`, `CONVERTED`, `EXPIRED`).
  2. Table header font weight, spacing, sorting indicators (`⬍`).
  3. Column naming parity (`QUOTE N` vs `QUOTE #` vs `QUOTE NO`).
  4. Button pill styling for Action CTAs (`View`, `Edit`, `Reorder`, `Download PDF`).
  5. Scope isolation: US currency formatting (`$USD`), zero AUD/GST tax references, domestic US address guidance.
