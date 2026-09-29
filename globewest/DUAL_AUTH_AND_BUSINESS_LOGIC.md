# GlobeWest US Expansion: Dual-Auth Architecture & Business Logic

---

## 1. Dual-Audience Business Model

GlobeWest operates on a specialized Dual-Audience model serving two distinct customer segments:

### Trade Professionals (Primary Audience)
- Interior Designers, Commercial Specifiers, Architects, Stylists, and Hospitality procurement specialists.
- Entitled to wholesale trade pricing, exclusive volume tiers, formal quoting, product reservation holds, and NetSuite invoicing.

### Public Retail Consumers (Secondary Audience)
- Retail homeowners looking for design inspiration and luxury furniture.
- Allowed to browse the full catalog, view manufacturer suggested retail pricing (MSRP), find local design showrooms, or apply to become trade customers. Direct unapproved wholesale purchases are strictly blocked.

---

## 2. Dual-Auth Matrix: Operational Specification

Every component across the storefront evaluates customer authentication and account tier status:

| Storefront Component | Logged-Out Guest (Public) | Logged-In Trade Customer |
| :--- | :--- | :--- |
| Header Utility Bar | Public CTAs: "Become a Trade Customer", "Ready to Buy", "Book Showroom", "Sign In" | Trade Pricing Toggle Switcher: [ Trade Price \| MSRP ], Trade Account Navigation, "Sign Out" |
| PLP / Category Cards | Pricing is masked or displays MSRP. Add to Cart button is hidden. Inquire / Showroom CTAs shown. | Dual Pricing Display: Trade Price + MSRP (e.g., $1,390 Trade • $1,490 MSRP). Live stock count indicator. |
| PDP (Product Details) | Public MSRP only. "Apply for Trade Account" CTA. Swatches and Spec Sheets visible. | Trade Wholesale Pricing unlocked. Quantity Tier Discounts. Tear Sheet, 3D and CAD Downloads. Add to Hold / Add to Cart. |
| Cart & Mini-Cart | Direct wholesale checkout disabled. Sample requests enabled. | Full Trade Wholesale Checkout. NetSuite US Sales Tax and Freight calculations. |
| My Account Portal (/customer/account/*) | Direct access blocked with HTTP 302 redirect to /customer/account/login/ with session notice. | Full Trade Portal Access: Holds (/gw_orders/hold/), Quotes (/gw_orders/quote/), Orders (/gw_orders/order/), Invoices. |

---

## 3. Product Hold & Quote Business Lifecycle

### 1. Holds (/gw_orders/hold/index/ - Frame 621)
- Business Purpose: Interior designers pitching concepts to high-end clients often need to guarantee stock availability without immediately charging a client credit card.
- Reservation Window: Items placed on hold are reserved in the US warehouse for exactly 2 business days.
- Status Lifecycle:
  - ACTIVE: Hold is current; stock is reserved in NetSuite; user can view details and convert to an order.
  - EXPIRED: Reservation window elapsed; inventory released back to general pool.
  - CANCELLED: User or admin released the hold before expiry.

### 2. Quotes (/gw_orders/quote/index/ - Frame 623)
- Business Purpose: For large commercial or multi-room residential projects, designers compile custom product lists to negotiate volume discounts or obtain formal corporate approval.
- Key Capabilities: Quote PDF generation, expiration dates, client reference numbers, and 1-click checkout conversion.

### 3. Orders (/gw_orders/order/index/ - Frame 624)
- Business Purpose: Real-time order tracking integrated directly with NetSuite ERP.
- Status Lifecycle (Frame 624 Rule 1):
  - AWAITING PAYMENT (Default tab): Order received, awaiting bank wire or credit term approval.
  - PENDING SHIPMENT: Payment confirmed; warehouse picking and packing in progress.
  - DISPATCHED: Shipped via freight carriers; live tracking number assigned.
  - CLOSED: Completed, delivered, or settled.

---

## 4. US Storefront Isolation Rules (Zero Australian Leaks)

The US storefront (mcstaging2.globewest.com) branched from the Australian codebase. Absolute storefront isolation must be maintained:

### 1. Branding & Trust Badges
- Australian Kangaroo Logo: The Australian Kangaroo silhouette and "AUSTRALIAN OWNED & RUN" badge must be completely removed from the US footer.
- US Footer: Clean luxury footer with US copyright and localized policy links.

### 2. Contact & Showroom Information
- Australian Phone & Melbourne Codes: Phone numbers starting with +61 or area code (03) must not appear in US live blocks.
- US Contact: US toll-free numbers (1-800 / +1) and US domain emails (sales@globewest.com).

### 3. Tax & Currency Localization
- Australian GST References: Australian Goods & Services Tax ("GST Included") must never display.
- US Sales Tax: Tax calculated dynamically based on destination ZIP code, with tax exemption certificates supported in My Account.

### 4. Copy & Regional Spelling
- Australian / British English: Avoid Australian spellings like favourite, colour, customised, or enquiry in live UI.
- US English: Enforce favorite, color, customized, and inquiry across all templates and static CMS blocks.
