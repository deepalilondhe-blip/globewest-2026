# Teamwork QA Re-Verification Reply

**Task:** [#41794530 - My Account - Orders](https://overdose.eu.teamwork.com/app/tasks/41794530)  
**Project:** P-GLW-007 Globewest US Expansion Project  
**Target Staging URL:** `https://mcstaging2.globewest.com/gw_orders/order/index/`  
**Figma Spec:** [Node 2581-64348 / Frame 624](https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64348&t=UHKXdUurQ7e08vqM-0)  
**QA Lead:** Deepali Londhe (`@DeepaliL`)  
**Assignee:** Mitchell (`@Mitchell`)

---

### Teamwork Reply Comment

Hi @Mitchell,

I have completed the QA re-verification on live staging against the Figma specifications (Frame 624). The reported items have been verified as follows:

1. Status Filter Tabs and Table Columns:
   - The status filter tabs default to "AWAITING PAYMENT" and correctly display all four required tabs (Awaiting Payment, Pending Shipment, Dispatched, and Closed).
   - The table has been reduced to the required six columns (Order, Date, Status, Total, Balance, Actions), with legacy columns removed.
   - Attached proof: RETEST_PROOF_01_STATUS_TABS_AND_COLUMNS.png

2. FAQ Accordion Single-Open Functionality:
   - Verified that only one accordion panel remains open at a time. Expanding an item automatically collapses any previously open panel.
   - Attached proof: RETEST_PROOF_02_FAQ_ACCORDION_SINGLE_OPEN.png

3. Support Block Layout:
   - The divider line issue overlapping the text has been resolved.

Assigning this ticket to you for review and next steps.

Kind regards,  
Deepali Londhe  
QA Lead
