# PLP Page: US vs AU Cross-Storefront Test Cases Catalog

| Test Case ID | Category | Test Description | Severity | Expected Result | Status |
|---|---|---|---|---|---|
| **TC-PLP-01** | Navigation & Title | Verify US Storefront PLP Page Title, H1 Tag, and Breadcrumbs | **P1** | Page loads with HTTP 200. Title and H1 match Indoor category. Breadcrumbs keep user on US domain with zero AU leakage. | `PASSED` |
| **TC-PLP-02** | Category Hero Banner | Verify Category Banner & Editorial Description Parity with AU | **P2** | Banner renders consistently with AU baseline. All CTA links remain within US domain. | `PASSED` |
| **TC-PLP-03** | Filter Navigation | Verify Layered Navigation / Searchspring Filter Facets | **P2** | Facets are displayed and interactive. Filter counts match active US product catalog. | `PASSED` |
| **TC-PLP-04** | Sorting Controls | Verify PLP Sort Dropdown Functionality | **P2** | Sort options exist and reorder products seamlessly without full page errors. | `PASSED` |
| **TC-PLP-05** | Product Grid Routing | Verify Product Cards Anchor Routing (Zero Australian Scope Leaks) | **P1** | All product links route to US store (mcstaging2.globewest.com) or relative paths. Zero links redirect to Australian domain. | `PASSED` |
| **TC-PLP-06** | Pricing & Currency | Verify Product Card Pricing & Currency Symbols ($ USD) | **P2** | Prices display with standard $ symbol corresponding to USD currency. No Australian Dollar labels. | `PASSED` |
| **TC-PLP-07** | Product Swatches | Verify Color & Material Swatches on Product Cards | **P3** | Swatches render correctly, are clickable, and update card image preview. | `PASSED` |
| **TC-PLP-08** | Pagination & Scrolling | Verify Pagination Controls or Infinite Scroll Load-More | **P2** | Pagination or Load More functions properly, appending/loading subsequent products. | `PASSED` |
| **TC-PLP-09** | SEO Content | Verify Bottom Category SEO Editorial Text Block | **P3** | Category editorial copy is populated with keyword-rich marketing text. | `PASSED` |
| **TC-PLP-10** | Visual Parity | Verify Full-Page Responsive Visual Comparison (Desktop, Tablet, Mobile) | **P2** | US PLP maintains visual consistency with AU baseline with proper responsive wrapping. | `PASSED` |
