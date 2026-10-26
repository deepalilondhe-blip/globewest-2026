# QA Defect Audit Report: Ticket #41794534 (Mega Menu)

| Document Metadata | Details |
|---|---|
| **Ticket Reference** | **#41794534 - Mega menu** |
| **Teamwork Task** | [Task #41794534](https://overdose.eu.teamwork.com/app/tasks/41794534) |
| **Tested Environment (Target)** | `https://mcstaging2.globewest.com` (US Staging Live - 🔴 RED) |
| **Baseline Environment (Reference)** | `https://mcstaging2.globewest.com.au` (AU Staging Live - 🟢 GREEN) |
| **QA Lead** | Deepali Londhe (`@DeepaliL`) |
| **Audit Focus** | **Individual Category Verification across Desktop & Mobile, Cross-Border Leakage Prevention, and Interaction Fidelity** |
| **Authentication State** | **Dual-Authenticated: US Trade (`deepali.londhe@overdose.digital`) & AU Customer (`deepalilondhe576@gmail.com`)** |
| **Total Categories Audited** | **9 Categories (Indoor, Outdoor, Homewares, In Stock, Customisation, Projects, Inspiration, Support, Contact)** |
| **Total Links Audited** | **Desktop: 204 Links | Mobile: 258 Links (462 Total)** |
| **Total Defects Identified** | **4 Validated Cross-Border Domain Leaks (5 Leaking Links)** |

---

## 1. 📊 Individual Category Verification Matrix (Desktop vs. Mobile)

Each of the 9 navigation categories on the US storefront was individually opened, hovered, clicked, and audited for Australian domain leaks, routing integrity, and responsive interactions:

| # | Category | Desktop Links | Mobile Links | Hover & Flyout (Desktop) | Accordion Drilldown (Mobile) | AU Domain Leaks (`globewestoutlet.com.au`) | Status |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **01** | **Indoor** | 66 | 80 | 🟢 Tier-2 Flyout Expands | 🟢 Accordion Expands Cleanly | 🔴 **1 AU Leak Detected** (`/collections/indoor`) | 🚨 **DEFECT** |
| **02** | **Outdoor** | 30 | 37 | 🟢 Tier-2 Flyout Expands | 🟢 Accordion Expands Cleanly | 🔴 **1 AU Leak Detected** (`/collections/outdoor`) | 🚨 **DEFECT** |
| **03** | **Homewares** | 13 | 18 | 🟢 Tier-2 Flyout Expands | 🟢 Accordion Expands Cleanly | 🔴 **1 AU Leak Detected** (`/collections/homewares`) | 🚨 **DEFECT** |
| **04** | **In Stock** | 36 | 41 | 🟢 Multi-column Flyout | 🟢 Accordion Expands Cleanly | 🟢 Zero AU Leaks (Clean US Catalog) | ✅ **PASSED** |
| **05** | **Customisation** | 2 | 5 | 🟢 Submenu Opens | 🟢 Accordion Expands Cleanly | 🟢 Zero AU Leaks (Clean US Catalog) | ✅ **PASSED** |
| **06** | **Projects** | 18 | 23 | 🟢 Multi-column Flyout | 🟢 Accordion Expands Cleanly | 🟢 Zero AU Leaks (Clean US Catalog) | ✅ **PASSED** |
| **07** | **Inspiration** | 15 | 20 | 🟢 Multi-column Flyout | 🟢 Accordion Expands Cleanly | 🟢 Zero AU Leaks (Clean US Catalog) | ✅ **PASSED** |
| **08** | **Support** | 18 | 24 | 🟢 Flyout Opens | 🟢 Accordion Expands Cleanly | 🔴 **2 AU Leaks Detected** (Outlet & Melbourne Store) | 🚨 **DEFECT** |
| **09** | **Contact** | 6 | 10 | 🟢 Direct/Submenu Nav | 🟢 Accordion Expands Cleanly | 🟢 Zero AU Leaks (Clean US Catalog) | ✅ **PASSED** |
| **TOTAL** | **9 Categories** | **204** | **258** | **All 9 Verified** | **All 9 Verified** | **5 Leaking Links Found** | **4 DEFECTS** |

---

## 2. 🚨 Detailed Defect Analysis

### 🚨 Defect 1: Indoor Mega Menu — "Outlet" Link Cross-Border Leak (P1 High)
* **Component:** Mega Menu Navigation (`.navigation .level0`) -> Category: `Indoor`
* **Severity:** **P1 — High (Cross-Border Scope Leakage)**
* **Expected:** The "Outlet" link must route within the US catalog domain (`https://mcstaging2.globewest.com/...`) or be suppressed if no US clearance outlet exists.
* **Actual:** Hardcodes Australian discount storefront: `https://globewestoutlet.com.au/collections/indoor`
* **Impact:** Directs American B2B specifiers to the Australian consumer clearance outlet.
* **Desktop Proof:** [`DEFECT_SCREENSHOTS/DESKTOP_DEFECT_1_INDOOR_OUTLET.png`](DEFECT_SCREENSHOTS/DESKTOP_DEFECT_1_INDOOR_OUTLET.png)
* **Mobile Proof:** [`DEFECT_SCREENSHOTS/MOBILE_DEFECT_1_INDOOR_OUTLET.png`](DEFECT_SCREENSHOTS/MOBILE_DEFECT_1_INDOOR_OUTLET.png)

---

### 🚨 Defect 2: Outdoor Mega Menu — "Outlet" Link Cross-Border Leak (P1 High)
* **Component:** Mega Menu Navigation -> Category: `Outdoor`
* **Severity:** **P1 — High (Cross-Border Scope Leakage)**
* **Expected:** All outdoor subcategories route to US catalog paths.
* **Actual:** Subcategory link hardcodes: `https://globewestoutlet.com.au/collections/outdoor`
* **Desktop Proof:** [`DEFECT_SCREENSHOTS/DESKTOP_DEFECT_2_OUTDOOR_OUTLET.png`](DEFECT_SCREENSHOTS/DESKTOP_DEFECT_2_OUTDOOR_OUTLET.png)
* **Mobile Proof:** [`DEFECT_SCREENSHOTS/MOBILE_DEFECT_2_OUTDOOR_OUTLET.png`](DEFECT_SCREENSHOTS/MOBILE_DEFECT_2_OUTDOOR_OUTLET.png)

---

### 🚨 Defect 3: Homewares Mega Menu — "Outlet" Link Cross-Border Leak (P1 High)
* **Component:** Mega Menu Navigation -> Category: `Homewares`
* **Severity:** **P1 — High (Cross-Border Scope Leakage)**
* **Expected:** All homewares subcategories route to US catalog paths.
* **Actual:** "Outlet" subcategory hardcodes: `https://globewestoutlet.com.au/collections/homewares`
* **Desktop Proof:** [`DEFECT_SCREENSHOTS/DESKTOP_DEFECT_3_HOMEWARES_OUTLET.png`](DEFECT_SCREENSHOTS/DESKTOP_DEFECT_3_HOMEWARES_OUTLET.png)
* **Mobile Proof:** [`DEFECT_SCREENSHOTS/MOBILE_DEFECT_3_HOMEWARES_OUTLET.png`](DEFECT_SCREENSHOTS/MOBILE_DEFECT_3_HOMEWARES_OUTLET.png)

---

### 🚨 Defect 4: Support Mega Menu — Australian Outlet & Melbourne Retail Store Leaks (P1 High)
* **Component:** Mega Menu Navigation -> Category: `Support`
* **Severity:** **P1 — High (Australian Physical Store & Domain Leakage)**
* **Expected:** Support menu items route to US Help Centre, US Showroom Booking, and US Contact pages.
* **Actual:** Contains 2 hardcoded links to Australian outlet and physical retail premises:
  1. *"Shop Online Outlet"*: `https://globewestoutlet.com.au/`
  2. *"Visit Melbourne Outlet"*: `https://globewestoutlet.com.au/pages/melbourne-outlet-store`
* **Impact:** Confuses American trade designers by advertising a local physical outlet in Melbourne, Australia.
* **Desktop Proof:** [`DEFECT_SCREENSHOTS/DESKTOP_DEFECT_4_SUPPORT_OUTLET.png`](DEFECT_SCREENSHOTS/DESKTOP_DEFECT_4_SUPPORT_OUTLET.png)
* **Mobile Proof:** [`DEFECT_SCREENSHOTS/MOBILE_DEFECT_4_SUPPORT_OUTLET.png`](DEFECT_SCREENSHOTS/MOBILE_DEFECT_4_SUPPORT_OUTLET.png)

---

## 3. ✅ Verified Parity Features (Matching AU Baseline)
1. **In Stock Category:**
   - Desktop: 36 subcategory links cleanly grouped into Furniture, Homewares, and Outdoor quick-ship.
   - Mobile: Accordion expands all 41 child items cleanly.
2. **Customisation Category:**
   - Custom builder links for Custom Sofas and Custom Dining Tables render matching AU staging.
3. **Projects Category:**
   - 18 commercial project sub-links (Commercial, Hospitality, Multi-Residential) match AU staging.
4. **Inspiration Category:**
   - 15 design lookbooks, trend forecast articles, and editorial press features match AU staging.
5. **Contact Category:**
   - Direct contact links route to US contact and inquiry pages.

---

## 4. 📄 Dedicated Execution Commands Standard (Rule 6)
Per Rule 6, refer to [`Mega Menu runcommand.txt`](Mega%20Menu%20runcommand.txt):

```text
Ticket Name: #41794534 - Mega menu
Page Name: Mega Menu (https://mcstaging2.globewest.com)

Run command for Desktop View:
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794534_Mega_Menu/scripts/verify_individual_mega_menus_desktop.js"

Run command for Mobile View:
NODE_PATH="GlobeWest 2026/node_modules" node "Sprint-3/Ticket_41794534_Mega_Menu/scripts/verify_individual_mega_menus_mobile.js"
```
