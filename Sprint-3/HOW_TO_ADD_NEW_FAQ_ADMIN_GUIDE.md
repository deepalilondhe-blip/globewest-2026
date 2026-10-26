# 📖 Magento Admin Guide: How to Add & Manage FAQs (My Account Experience)

> **Target Platform**: Adobe Commerce / Magento 2 Enterprise  
> **Environment**: GlobeWest Staging Admin (`https://mcstaging2.globewest.com.au/godmode/admin/`)  
> **Applicable Storefronts**: US Staging (`https://mcstaging2.globewest.com`) & AU Baseline (`https://mcstaging2.globewest.com.au`)  
> **Applicable Pages**: My Account Dashboard, My Holds, My Quotes, My Orders, Loyalty Program  
> **Figma Specifications**: Frames 620, 621, 622, 624, 626 (FAQ Accordion Component Spec)

---

## 1. 📌 Overview & Figma Acceptance Criteria

Across the entire GlobeWest **My Account** redesign (Figma Frames 620, 621, 622, 624, 626), the self-service **Frequently Asked Questions (FAQ) Accordion Block** is deployed as a standardized, modular component.

### Strict Design & Functional Rules:
1. **Capacity Limit**: Up to **8 FAQs** maximum per page.
2. **Initial State**: All accordion items **closed by default** on page load.
3. **Single-Open Rule**: When a user clicks to open an accordion, any currently open accordion must **automatically collapse** (strictly only **one open at a time**).
4. **Admin Manageability**: Full admin ability to add new FAQ items, update questions and answers, reorder items, and manage per-store scope isolation.

---

## 2. 🔐 Step-by-Step Procedure: How to Add a New FAQ in Magento Admin

### Step 1: Log in to Magento Admin Panel
1. Open the Magento Admin URL:  
   `https://mcstaging2.globewest.com.au/godmode/admin/`
2. Enter your authorized administrator credentials:
   - **Username**: `deepali.londhe@overdose.digital`
   - **Password**: `2Ho770ZEeX7v`
3. Click **Sign in**.

---

### Step 2: Set Store View Scope (Mandatory Isolation Rule)
> ⚠️ **CRITICAL SCOPE RULE**: Never edit customer-facing content under `All Store Views` unless intended globally. Always switch to the target store view to prevent cross-store data leakage!

1. In the top-left store switcher dropdown, click **Scope: Default Config** (or **All Store Views**).
2. Select **USA Website** (or **USA Store View** under `Globewest USA`).
3. Confirm that the header scope displays: `Scope: USA Website` or `Scope: USA Store View`.

---

### Step 3: Navigate to CMS Blocks (Page Builder Stage)
1. On the left-hand navigation sidebar, click the **Content** icon (page/book icon).
2. Under the **Elements** column, click **Blocks** (`Content > Elements > Blocks`).
3. You will see the **CMS Blocks Grid**.

---

### Step 4: Locate the Target My Account FAQ Block
1. In the **Search by keyword** field (or the **Identifier** column filter), search for the target page block identifier:
   - **My Holds FAQ**: `account_holds_faq` (or Title: `Account Holds FAQ`)
   - **My Quotes FAQ**: `account_quotes_faq` (or Title: `Account Quotes FAQ`)
   - **My Orders FAQ**: `account_orders_faq` (or Title: `Account Orders FAQ`)
   - **My Dashboard FAQ**: `account_dashboard_faq` (or Title: `Account Dashboard FAQ`)
   - **My Loyalty FAQ**: `account_loyalty_faq` (or Title: `Account Loyalty FAQ`)
2. Click **Apply Filters**.
3. In the grid row, click **Edit** (or click **Select ▾ > Edit** in the Action column).

---

### Step 5: Launch Adobe Commerce Page Builder
1. On the Block edit page, scroll down to the **Block Content** section.
2. Click the orange **"Edit with Page Builder"** button to expand the visual design workspace full-screen.
3. You will see the visual layout container:
   - Outer row: `div[data-content-type="row"]`
   - FAQ wrapper: `ul[data-content-type="faq"]` (the parent container)
   - Existing FAQ items: `li[data-content-type="faq-item"]`

---

### Step 6: Add the New FAQ Item
1. **Locate the Component**:
   - In the left-hand Page Builder panel under **Custom Elements** / **Layout**, locate the **FAQ Item** component (`data-content-type="faq-item"`).
   - *Alternative Shortcut*: Hover over the existing FAQ accordion container and click the **`+` (Add FAQ Item)** button at the bottom of the list.
2. **Verify Count Ceiling**:
   - Count the existing questions. The Figma specification mandates a **maximum of 8 FAQ items**. If 8 items already exist, retire or replace an inactive item before adding.
3. **Drop New Item**:
   - Drag and place the new **FAQ Item** into the list at the desired position.

---

### Step 7: Enter Question Title & Answer Content
1. Hover over the newly placed **FAQ Item** to reveal its action toolbar.
2. Click the **Settings (Gear Icon)**:
3. In the configuration modal:
   - **Question Title (`data-element="question"`)**:
     - Enter the exact customer-facing question.
     - *Example*: `How long do product holds remain active?` or `Can I convert a quote directly into an order?`
   - **Answer Content (`data-element="answer"`)**:
     - In the rich text WYSIWYG editor, enter the full answer text.
     - Use clean formatting: paragraph tags (`<p>`), bullet points (`<ul><li>`), or support links (`<a href="/help-centre">Help Centre</a>`).
     - Avoid dummy text (zero Latin *"Lorem ipsum"*).
   - **Item State / Active Status**:
     - Ensure **Enable Item** is toggled to **Yes**.
   - **Sort Order**:
     - Set numerical position (e.g. `1` for top, `8` for bottom).
4. Click **Save** in the top-right corner of the slide-out modal.

---

### Step 8: Save Block & Flush Cache
1. Click **Close Full Screen** in the top-right corner of Page Builder.
2. Click the orange **Save Block** (or **Save & Close**) button in the top admin header.
3. **Flush Magento Cache** *(Mandatory for frontend propagation)*:
   - From the left sidebar, navigate to **System > Tools > Cache Management**.
   - Check **Blocks HTML output**, **Page Cache**, and **Configuration**.
   - Click the orange **Flush Magento Cache** button.
   - Wait for green confirmation: *"The Magento cache storage has been flushed."*

---

## 3. 🌐 Step-by-Step Frontend QA Verification & Acceptance Checklist

After publishing a new FAQ item in Magento Admin, execute this verification checklist on the live US Staging storefront (`https://mcstaging2.globewest.com`):

| # | Verification Step | Expected Result | Acceptance Criteria |
|---|-------------------|-----------------|---------------------|
| **1** | **Direct Navigation** | Navigate to the page while logged in as Trade Customer (e.g. `/gw_orders/hold/index/` or `/gw_quotes/quote/index/`). | Page loads with HTTP 200 without PHP/layout exceptions. |
| **2** | **Initial Collapsed State** | Scroll down to the FAQ accordion section below the data table. | **All FAQ accordions (including the new item) are closed by default.** (`aria-expanded="false"`, answer `display: none`). |
| **3** | **New Item Presence & Copy** | Locate the newly added FAQ item in the list. | Question title matches Admin text verbatim; no placeholder strings. |
| **4** | **Expansion Interaction** | Click on the new FAQ question header (`h3[data-element="question"]`). | Item expands smoothly; right-side chevron flips to up (`^`); answer text becomes visible (`aria-expanded="true"`). |
| **5** | **Single-Open Auto-Collapse Rule** | While the new item is open, click another FAQ item in the list. | **The previously open item automatically closes** (`aria-expanded="false"`, `display: none`), and only the clicked item opens. |
| **6** | **Max Count Verification** | Count total rendered accordion items. | Count is **<= 8 items** (strict Frame 620/621/622/624/626 ceiling). |
| **7** | **Mobile Responsiveness (390px)** | Resize viewport to 390px (iPhone 14/15/16). | Accordion width spans 100% full width with 16px lateral padding; thumb-friendly tap target (minimum 44px height). |
| **8** | **Cross-Store Isolation** | Check the AU Baseline page (`https://mcstaging2.globewest.com.au`). | US-specific FAQ item does NOT leak into AU storefront if scoped to USA Website. |

---

## 4. ⚙️ Supplementary: Configuring Support Contact Block via Stores Config

If editing the **"Need Help? Contact our sales team"** contact numbers or email addresses displayed alongside the FAQ block:

1. Navigate to:  
   `Stores > Configuration > OVERDOSE > Customer Account Content Configs`  
   (`gw_customer_account` section)
2. Switch Scope to: **`USA Website`** (or **`USA Store View`**).
3. Expand **`B2b Help Block Hold Orders`** (or target page section).
4. Update:
   - **Phone Number**: Enter US Toll-Free / Domestic Phone (e.g. `+1 (800) XXX-XXXX`) instead of Australian `+613 9518 1600`.
   - **Email**: Enter US domestic sales email (`sales@globewest.com`).
5. Click **Save Config** and flush cache.
