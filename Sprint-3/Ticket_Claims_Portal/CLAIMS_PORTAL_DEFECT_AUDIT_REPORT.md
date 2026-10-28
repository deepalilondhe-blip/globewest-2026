# GlobeWest QA Comprehensive Audit Report: Claims Portal
## US Storefront Self-Service Trade Claims Architecture & NetSuite Integration

> **Audit Standard**: Dual-Auth Matrix (US Trade Account + AU Baseline), Strict Figma Inspection (Node `2316-15694`), and Zero-Placeholder Verification per `AGENTS.md`.

---

## 1. Executive Summary & Verdict

| Feature / Metric | Status | Severity | Notes |
| :--- | :--- | :--- | :--- |
| **Ticket Name** | **Claims Portal** | - | Sprint 3 / US Storefront B2B Self-Service |
| **Figma Node Reference** | `2316-15694` (`[FINAL] Designs`) | - | Includes Frames `2383-11454`, `2383-11615`, `2383-11003`, and `Frame 630` |
| **Target URL (US Staging)** | `https://mcstaging2.globewest.com/claims` | - | Routes via `/gw_sales/claim/index/status/open/` |
| **Baseline URL (AU Staging)** | `https://mcstaging2.globewest.com.au` | - | Australian customer reference |
| **Overall QA Verdict** | 🚨 **CRITICAL FAIL (P0 BLOCKED)** | **P0 BLOCKER** | Module is completely inaccessible to US trade customers on live staging |

### Core Architectural Pain Points Solved for the US Storefront:
1. **AU Pain Point #1 — Invoice-First Barrier Solved by Product-First Search**: In the legacy AU process, claims had to be raised against an invoice number that customers often could not recall, leading to low online claim volume. The new US design introduces **Product-First Search** (by Product Name or SKU), automatically surfacing matching paid invoices.
2. **AU Pain Point #2 — Reference Continuity Fixed via NetSuite Case IDs**: In the legacy AU flow, web claim IDs did not tie back to NetSuite references, frustrating Customer Service. In the US build, the **NetSuite Case Number is explicitly used as the unique Claim ID**.

---

## 2. P0 Deployment Blockers on Live US Staging

During live testing with US Trade credentials (`deepali.londhe@overdose.digital`), three critical blockers completely prevent testing the intake workflow:

1. 🚨 **P0 BLOCKER 1 — HTTP 302 Redirect Loop on Claims Routes**:
   - Navigating to Open Claims (`/gw_sales/claim/index/status/open/`), Pending Claims, or Closed Claims immediately executes an **HTTP 302 Redirect back to My Dashboard (`/customer/account/`)**.
   - The claims table, status tabs, and header CTAs are 100% inaccessible.
2. 🚨 **P0 BLOCKER 2 — Dashboard "Submit Claim" CTA Has Dead Link (`href="#"`)**:
   - On `/customer/account/`, the notification banner displays `"New: You can now submit claims online"`, but `<a class="od-notification__button" href="#">SUBMIT CLAIM</a>` points to `href="#"`. Clicking it merely jumps to the top of the page.
3. 🚨 **P0 BLOCKER 3 — Create Claim Form Returns HTTP 404 Not Found**:
   - Direct navigation to `/claims/create` or `/gw_sales/claim/create/` returns **HTTP 404 Not Found**. The intake form is not yet deployed or route-mapped on the US scope.

---

## 3. Specification & Verification Matrix

### A. Search & Claim Creation (Product-First Workflow)
| Requirement | Specification Detail | US Staging Live Status | QA Status |
|---|---|---|---|
| **Product-First Search** | Customer searches by Product Name or SKU rather than invoice number | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Automatic Invoice Surfacing** | System surfaces matching paid invoices automatically | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Multi-Invoice Repetition** | Invoice number shown alongside product, repeated per invoice if purchased multiple times | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Paid Invoice Requirement** | Claims can strictly only be raised against a paid invoice | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |

### B. Claim Detail & Categorisation (Fault Categories & Media)
| Requirement | Specification Detail | US Staging Live Status | QA Status |
|---|---|---|---|
| **Fault Category: Transit Damage** | Prompt: `"Product received in damaged condition"` | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Fault Category: Product Defect** | Prompt: `"Considered defect to product"` | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Fault Category: Missing Parts** | Prompt: `"Missing parts from a delivery"` | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Fault Category: Incorrect Item** | Prompt: `"Incorrect product received"` | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Mandatory Photo Upload** | Mandatory intake — minimum one photo per claim enforced | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Video Upload** | Optional video intake (.mp4, .mov up to 100MB) | Under assessment by Overdose | ⚠️ **ASSESSMENT** |
| **Multiple Products per Claim** | Allows bundling multiple products in single claim (matching AU behavior) | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |
| **Description Field** | Mandatory free-text description per Figma designs | Form route returns 404 Not Found | 🔴 **BLOCKED (P0)** |

### C. NetSuite Integration & Status ID Mapping
| Case Status (Storefront View) | NetSuite Status ID(s) | Description / Trigger | Integration State |
|---|---|---|---|
| **Claim Received** | `10` - Claim/Issue Logged<br>`20` - Pending Detail from Customer | Claim lodged via portal; awaiting review or customer input | Mapped in Spec |
| **Claim Under Review** | `30` - Pending Product Team Input<br>`31` - Pending QC Team Input<br>`32` - Pending Repair Person Input<br>`33` - Pending Carrier Input<br>`40` - Issue Under Review | Internal evaluation across product, QC, repair, or freight teams | Mapped in Spec |
| **Resolution Offered** | `50` - Proposed Resolution to Customer<br>`55` - Resolution In Dispute<br>`56` - Escalated to Senior Mgt<br>`57` - Senior Mgt Approve Resolution | Settlement offer provided to client; dispute escalation | Mapped in Spec |
| **Resolution Accepted** | `60` - Agreed Resolution-Not Yet in Stock<br>`61` - Agreed Resolution-Awaiting QC<br>`62` - Agreed Resolution-Awaiting Customer Input<br>`63` - Agreed Resolution-Repair<br>`64` - Agreed Resolution–Other<br>`68` - Agreed Resolution-Pending Return | Customer agreed to credit, replacement, repair, or return | Mapped in Spec |
| **Claim Closed** | `75` - Closed | Final case disposition reached and closed in NetSuite | Mapped in Spec |

### D. Claim Tracking & Offline CS Sync
| Requirement | Specification Detail | US Staging Live Status | QA Status |
|---|---|---|---|
| **My Account Tracking** | Customers can view live status of submitted claims in My Account | Listing route redirects to Dashboard (302) | 🔴 **BLOCKED (P0)** |
| **Offline CS Sync Frequency** | Claims raised offline by CS team sync to customer account every 15 minutes | Awaiting portal deployment to verify cron sync | 🔴 **BLOCKED (P0)** |
| **Cross-System Traceability** | Claim numbers referenced across Zendesk and NetSuite | Awaiting deployment | 🔴 **BLOCKED (P0)** |
| **Portal-Only Lodging** | Claims portal-only for lodging (no email-based creation, matching AU) | Verified policy | 🟢 **PASS (Policy)** |

---

## 4. Test Case Deliverables Summary

A comprehensive test suite of **50 test cases** has been generated and exported to the ticket directory covering all client requirements, mobile responsive layouts, FAQ mutex rules, UI behaviors, error handling, quantity boundary constraints, and NetSuite status mappings:
- 📊 **Excel Spreadsheet**: `Sprint-3/Ticket_Claims_Portal/Claims_Portal_Test_Cases.xlsx`
- 📄 **CSV Export**: `Sprint-3/Ticket_Claims_Portal/Claims_Portal_Test_Cases.csv`

---

## 5. Execution Commands (`Claims Portal runcommand.txt`)

```text
Ticket Name: Claims Portal
Page Name: Claims Portal (https://mcstaging2.globewest.com/claims)

Run command for Desktop View:
npx playwright test tests/claims-portal.spec.js --project=chromium --headed

Run command for Mobile View:
npx playwright test tests/claims-portal.spec.js --project=mobile --headed
```
