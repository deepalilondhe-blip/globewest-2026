# Claims Portal - Figma Architecture & Structure Analysis

## 1. Overview & Approved Figma Frames

- **Figma Master File**: `Globewest USA - External`
- **Page**: `[FINAL] Designs`
- **Feature Area**: My Account > Claims (`/customer/account/` or dedicated `/claims` portal)

### Approved Frame Registry

| Frame Name | Figma Node ID | Dimensions | Type / Purpose |
| :--- | :--- | :--- | :--- |
| **`Frame 630`** | `2584-65044` | 445 × 828 px | Functional Specification Card for My Claims Table, FAQs, & Need Help block |
| **`desktop/my_account/My Claims`** | `2383-11454` | 1440 × 1573 px | Desktop My Claims listing, filter tabs, table grid, pagination, & FAQ block |
| **`mobile/my_account/My Claims`** | `2383-11615` | 375 × 1654 px | Mobile responsive My Claims listing, compact table, actions dropdown, & FAQ block |
| **`Frame 631`** | `2383-11003` (Adjacent) | 445 × 828 px | Functional Specification Card for Create a Claim form, tooltips, & uploads |
| **`desktop/my_account/Create Claim`** | `2383-11003` | 1440 × 2292 px | Desktop Create a Claim submission form with file uploader & review workflow |
| **`mobile/my_account/Create Claim`** | `2383-11131` | 375 × 2513 px | Mobile responsive Create a Claim submission form |
| **`desktop/my_account/04.2_Orderdetail`** | `2383-11003` (Variant) | 1440 × 2292 px | Order/Invoice autocomplete lookup state |

---

## 2. Specification Rules & Functional Logic (from Frames 630 & 631)

### A. My Claims Listing Table Logic
1. **Create New Claim CTA**:
   - Secondary outlined button `[ CREATE NEW CLAIM ]` pinned to the top right of the dashboard.
   - Clicking takes the user directly to the Create Claim page (`/claims/create` or `/sales/claim/create/`).
2. **Status Filter Tabs**:
   - Four status tabs: `ALL` (default active), `OPEN`, `PENDING`, `CLOSED`.
   - Clicking filters the claims table in place.
3. **Date Formatting**:
   - **MANDATORY US FORMAT**: Dates MUST render in USA format (`MM/DD/YYYY`, e.g., `01/24/2026`). Must NOT display Australian format (`DD/MM/YYYY`).
4. **Action Column Behavior**:
   - If the only action available is `"VIEW"`, hide the actions dropdown and render `"VIEW"` as a direct action link.
   - If multiple actions exist, house them under a clean dropdown for both Desktop and Mobile.
5. **Order Number Navigation**:
   - Order Number (e.g., `#CH03021`) MUST be an interactive clickable hyperlink leading to that order's detail page.
6. **Grid Pagination**:
   - Admin must be able to configure items per page in Magento/Commerce backend.
   - Pagination bar renders on the right (`[ 1 ] [ 2 ] [ 3 ] [ > ]`) with counter on the left (`3 items`).
7. **AU Theme Parity**:
   - Retains same underlying functional architecture as AU theme with localized US modifications.

### B. Create a Claim Form Logic
1. **Product / Invoice Lookup**:
   - Autocomplete search field allowing input of Product Name, SKU, or Invoice Number.
   - Shows live search suggestions with Product Name, PO Number, and Invoice Number for quick selection.
2. **Tooltips (`🛈`)**:
   - Tooltips present on: `Claim type`, `Product or Invoice No`, `Quantity`, `Preferred resolution`, `Description of issue`.
   - Tooltip copy must be admin-configurable.
3. **Media Upload Support**:
   - Dropzone supports both Images and Video (`JPG, PNG, MP4, MOV`).
   - Maximum file size: **100MB**.
   - Thumbnail previews render dynamically with a `DELETE` button next to each uploaded file.
4. **Form Progression**:
   - Actions: `[ BACK ]` (navigates back to claims list) and `[ REVIEW ]` (proceeds to claim summary before submission).

### C. Shared Blocks (FAQ Block & Need Help Block)
1. **FAQ Block**:
   - Up to 8 accordions supported.
   - All accordions closed by default.
   - **Strict Accordion Mutex**: Opening one accordion automatically closes any previously open accordion.
   - Admin editable content via CMS/Magento.
2. **Need Help Block**:
   - Admin editable contact information.
   - **Critical US Storefront Requirement**: Must display US customer care phone and email, NOT Australian contact details (`+613 9518 1600` or `sales@globewest.com.au`).

---

## 3. Detailed Component Hierarchy

### Page 1: My Claims Dashboard (`/claims` or `/customer/account/claims`)
```
├── Header & Utility Bar (GlobeWest standard)
├── Account Layout (2-Column Desktop / 1-Column Mobile)
│   ├── Left Sidebar: Account Navigation Menu
│   │   ├── MY DASHBOARD
│   │   ├── MY ACCOUNT (Quotes, Holds, Orders, Invoices, After Sales & Claims, etc.)
│   │   ├── MY CLAIMS (Active Brown Left Pill)
│   │   │   ├── Open Claims [ 3 ] (Badge)
│   │   │   ├── Pending Claims [ 3 ] (Badge)
│   │   │   └── Closed Claims
│   │   ├── MY COMPANY
│   │   ├── MY BOOKINGS
│   │   ├── LOYALTY PROGRAM
│   │   ├── HELP CENTRE
│   │   └── LOGOUT
│   └── Main Content Panel
│       ├── Page Header: "My Claims" + Intro Paragraph
│       ├── CTA: [ CREATE NEW CLAIM ]
│       ├── Filter Bar: [ ALL ] [ OPEN ] [ PENDING ] [ CLOSED ] | [ Search Input 🔍 ]
│       ├── Claims Data Table (Desktop: 8 columns / Mobile: 5 columns)
│       ├── Pagination Controls
│       ├── FAQ Accordion Block (Max 8 items)
│       └── Need Help / Contact Sales Block
└── Footer (GlobeWest standard)
```

### Page 2: Create a Claim (`/claims/create`)
```
├── Header & Utility Bar
├── Main Container
│   ├── Top Navigation: ← GO BACK TO CLAIMS
│   ├── Page Title: "Create a Claim" + Subtitle
│   ├── Form Section: CLAIM DETAILS
│   │   ├── Claim type (Select Dropdown + 🛈 Tooltip)
│   │   ├── Product or Invoice No (Search Autocomplete Input + 🛈 Tooltip)
│   │   ├── Quantity (Number/Select + 🛈 Tooltip)
│   │   ├── Preferred resolution (Select Dropdown + 🛈 Tooltip)
│   │   ├── Description of issue (Textarea + 🛈 Tooltip)
│   │   └── PRODUCT PHOTO OR VIDEO
│   │       ├── File Upload Dropzone (Dashed border, "UPLOAD FILES" button)
│   │       ├── Upload constraints notice: "Files as JPG, PNG, MP4 or MOV — max 100MB"
│   │       └── Uploaded Files List (Thumbnails + Filename + DELETE action)
│   ├── Form CTAs: [ BACK ] | [ REVIEW ]
│   ├── FAQ Accordion Block
│   └── Need Help Block: "Questions about your claim? [ VISIT HELP CENTRE ]"
└── Footer
```

---

## 4. Key Differences: Desktop vs Mobile

| Element | Desktop (`1440px`) | Mobile (`375px`) |
| :--- | :--- | :--- |
| **Account Navigation** | Sticky Left Sidebar with accordion levels and active indicators | Top compact dropdown selector `[ My Claims ⌵ ]` |
| **Claims Table Layout** | Full grid with 8 columns: `Order, Invoice, Date, Cust PO#, Order Name, Client Name, Status, Details` | Compact grid with 5 columns: `Order, Date, Total, Status, Actions ⌵` |
| **Status Pills** | Fixed horizontal pill labels (`Processing`, `Complete`) | Compact pill labels with ellipsis support |
| **Filter & Search Bar** | Tabs on left, Search input pinned to right | Search input stacked full width above horizontal scrolling status tabs |
| **Create Claim CTA** | Button right-aligned alongside header | Full-width button stacked below subtext |
| **Form Layout** | 2-column label/field alignment within content area | 1-column vertically stacked fields with full-width inputs |
| **Review CTAs** | Left/Right aligned (`Back` left, `Review` right) | Full-width buttons stacked vertically |
