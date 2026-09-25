# Automated Retest Summary - Ticket #41794529
Date: 2026-09-23T07:01:45.666Z
Target: https://mcstaging2.globewest.com/gw_quotes/quote/index/

| Test Case | Requirement | Status | Live Details |
| :--- | :--- | :---: | :--- |
| **TC-QUOTES-02** | Default active filter tab is "ALL" | **FAIL** | Active tab detected: "UNKNOWN" (Expected: "ALL") |
| **TC-QUOTES-04** | 8 columns total & unified Actions dropdown (No separate DETAILS column) | **FAIL** | Columns: 9. Separate DETAILS column present: true. Headers: [Quote N, Expiry Date, Cust PO#, Quote Name, Client Name, Status, Total, Details, Actions] |
| **TC-QUOTES-05** | Table header labels: "EXP. DATE" and "ORDER NAME" | **FAIL** | Exp Date Header: "Expiry Date" (Expected: "EXP. DATE"). Order Name Header: "Quote Name" (Expected: "ORDER NAME") |
| **TC-QUOTES-08** | FAQ Accordion Block present below table | **FAIL** | FAQ Accordion block is 100% MISSING from page. |
| **TC-QUOTES-10** | "Need help? Contact our sales team" Content Block present | **FAIL** | Need Help block is 100% MISSING from page. |
| **TC-QUOTES-11** | Numerical count badges in My Account left sidebar | **FAIL** | No count badges rendered in sidebar. |
| **TC-QUOTES-13** | Australian Kangaroo badge removed from US storefront footer | **PASS** | Footer clean; Australian badge excluded. |
