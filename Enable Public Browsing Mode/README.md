# Enable Public Browsing Mode: Defect & Verification Gallery

**Project**: P-GLW-007 Globewest US Expansion Project  
**Task**: `Enable Public Browsing Mode`  
**Target Environment**: `https://mcstaging2.globewest.com` (US Storefront)  
**Baseline Environment**: `https://mcstaging2.globewest.com.au` (AU Storefront)  
**QA Lead**: Deepali Londhe (Senior QA Engineer)  

---

## 🖼️ Gallery of Real Defect & Verification Images

| File Name | Defect / Verification Description | Highlight Standard |
| :--- | :--- | :---: |
| **[`DEFECT_SEARCHSPRING_0_RESULTS.png`](DEFECT_SEARCHSPRING_0_RESULTS.png)** | 100% Real browser capture: US catalog search for `"chair"` returns 0 results / blank screen. | 🔴 Simple Red Box |
| **[`DEFECT_1_SEARCHSPRING_0_RESULTS.png`](DEFECT_1_SEARCHSPRING_0_RESULTS.png)** | SearchSpring 0 results on US Storefront vs Active catalog search on Australian baseline. | 🔴 Red vs 🟢 Green |
| **[`DEFECT_2_TOP_BAR_TRADE_CTA_MISSING.png`](DEFECT_2_TOP_BAR_TRADE_CTA_MISSING.png)** | Top utility bar missing `"Become a Trade Customer"` registration CTA (only Book Showroom present). | 🔴 Red vs 🟢 Green |
| **[`DEFECT_3_PDP_EMPTY_GAP_NO_CTA.png`](DEFECT_3_PDP_EMPTY_GAP_NO_CTA.png)** | Product Detail Page: Masking price/cart leaves empty white gap with no guidance on how to view pricing. | 🔴 Red vs 🟢 Green |
| **[`DEFECT_4_HERO_BANNER_AU_COPY_LEAK.png`](DEFECT_4_HERO_BANNER_AU_COPY_LEAK.png)** | Category hero banner on US `/indoor` states *"...to enrich Australian homes..."*. | 🔴 Red vs 🟢 Green |
| **[`SHOWING_VS_NOT_SHOWING_PUBLIC_BROWSING_PASS.png`](SHOWING_VS_NOT_SHOWING_PUBLIC_BROWSING_PASS.png)** | Core Public Browsing Pass: Product prices and Add to Cart are 100% suppressed for US guests. | 🟢 Pass Verification |
| **[`MASTER_PUBLIC_BROWSING_AUDIT_POSTER.png`](MASTER_PUBLIC_BROWSING_AUDIT_POSTER.png)** | Unified 4-panel visual audit poster combining all key verification areas. | 📊 Master Poster |

---

## 📝 Teamwork Ticket Reply (Copy & Paste)

> Hi **@Mohamed Bharmal**, **@MichelleM**, **@AlexP**,
> 
> I have completed the QA verification for **Enable Public Browsing Mode** on US Staging (`https://mcstaging2.globewest.com`):
> 
> **✅ 1. Core Public Browsing (Magento Base) — PASSED:**
> * **Category & PDP Browsing**: Unauthenticated guests can freely browse categories (`/indoor`, `/outdoor`) and product detail pages without any forced login redirects.
> * **Price Masking**: Product prices are **100% hidden** for guest visitors across PLP and PDP (zero dollar amounts in UI or DOM).
> * **Add to Cart**: The `Add to Cart` button is **100% suppressed** for guests.
> * **AU Safeguard**: Australia (`mcstaging2.globewest.com.au`) remains completely unaffected with retail AUD prices visible.
> 
> **🔴 2. SearchSpring Integration — BLOCKER:**
> * When a guest visitor searches for any keyword in the search bar (e.g., `chair`, `sofa` on `/catalogsearch/result/?q=chair`), it returns **0 products and an empty blank screen** (see attached screenshot).
> * As noted in Mohamed's update, SearchSpring dashboard access and product indexing for the US store view are required so guest users can search products with prices masked.
> 
> 📎 **Attached Screenshot:**  
> `DEFECT_SEARCHSPRING_0_RESULTS.png` showing the 0-results search page outlined with a simple red box.
> 
> Thanks,  
> **Deepali**
