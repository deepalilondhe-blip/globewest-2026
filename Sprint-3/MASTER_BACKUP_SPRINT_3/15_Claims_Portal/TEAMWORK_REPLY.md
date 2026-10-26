# Teamwork QA Defect Audit Reply: Claims Portal

**Task:** Claims Portal  
**Project:** P-GLW-007 Globewest US Expansion Project  
**Target Staging URL:** `https://mcstaging2.globewest.com/claims` & `https://mcstaging2.globewest.com/gw_sales/claim/index/status/open/`  
**Figma Spec:** [Node 2316-15694 / Frames 2383-11454, 2383-11615, 2383-11003, 2383-11131, Frame 630](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-15694&t=UHKXdUurQ7e08vqM-0)  
**QA Lead:** Deepali Londhe (`@DeepaliL`)  
**Status:** 🚨 **CRITICAL FAIL (P0 BLOCKED)**

---

### Teamwork Reply Comment

Hi @Vinod / Team,

I have completed the QA audit for the Claims Portal against the approved Figma specifications (Node 2316-15694 / Frames `2383-11454`, `2383-11615`, `2383-11003`, `2383-11131`, and `Frame 630`).

Testing is currently **BLOCKED by 3 Critical P0 issues** preventing access to the Claims module for authenticated US Trade customers:

1. **P0 CRITICAL BLOCKER — 302 Redirect Loop on Claims Routes**:
   - Navigating directly or via the left account sidebar to Open Claims (`/gw_sales/claim/index/status/open/`), Pending Claims, or Closed Claims immediately executes an HTTP 302 Redirect back to My Dashboard (`/customer/account/`).
   - The Claims table, filter tabs (ALL, OPEN, PENDING, CLOSED), pagination, and `[ CREATE NEW CLAIM ]` CTA are completely inaccessible.
   - *Attached Proof: `comparison/COMPARISON_01_CLAIMS_LISTING_ROUTE_REDIRECT_DEFECT.png`*

2. **P0 CRITICAL BLOCKER — Dashboard "Submit Claim" CTA Has Dead Link (`href="#"`)**:
   - On the customer dashboard (`/customer/account/`), the notification banner reads *"New: You can now submit claims online"*, but the button `<a class="od-notification__button" href="#">SUBMIT CLAIM</a>` points to `href="#"`. Clicking it merely reloads the page.
   - *Attached Proof: `comparison/COMPARISON_02_DASHBOARD_SUBMIT_CLAIM_DEAD_LINK.png`*

3. **P0 CRITICAL BLOCKER — Create Claim Form Not Deployed (404 Not Found)**:
   - Direct requests to `/claims/create` and `/gw_sales/claim/create/` return HTTP 404 Not Found (`[US] 404 Not Found`).
   - *Attached Proof: `comparison/COMPARISON_03_CREATE_CLAIM_FORM_NOT_DEPLOYED.png`*

4. **P1 HIGH — Left Sidebar Hierarchy & Missing Badges**:
   - Figma specifies `MY CLAIMS` as a top-level primary navigation section with a brown vertical active pill and count badges: `Open Claims [ 3 ]` and `Pending Claims [ 3 ]`. Live staging has zero counter badges and nests links under an unexpanded tree.

5. **P1 HIGH — Frame 630 Functional Rules Compliance (To Verify Upon Deployment)**:
   - Date format must strictly render in USA format (`MM/DD/YYYY`).
   - FAQ Accordion block must support a maximum of 8 accordions with strict mutex (only 1 open at a time).
   - Need Help block must display US customer service contact information (not Australian `+613 9518 1600` or `sales@globewest.com.au`).
   - *Attached Proof: `comparison/COMPARISON_04_FRAME_630_SPEC_RULES_VS_LIVE.png`*

The complete 25-test-case validation suite has been exported to:
- `Sprint-3/Ticket_Claims_Portal/Claims_Portal_Test_Cases.xlsx`
- `Sprint-3/Ticket_Claims_Portal/Claims_Portal_Test_Cases.csv`

Please deploy the Claims routing fixes and Create Claim form so we can proceed with end-to-end functional testing.

Kind regards,  
Deepali Londhe  
QA Lead
