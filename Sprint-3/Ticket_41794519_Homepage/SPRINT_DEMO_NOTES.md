# Sprint-3 Demo Notes: Homepage — US Storefront (Ticket #41794519)

> **Audience:** Product Owners, Front-End Tech Leads, Solution Architects & Stakeholders  
> **Speaker / Presenter:** Deepali Londhe (Senior QA Lead)  
> **Topic:** Verification of newly deployed Homepage — US (`mcstaging2.globewest.com`)

---

## 1. Feature Overview & Scope Delivered
* **Ticket ID:** [#41794519](https://overdose.eu.teamwork.com/app/tasks/41794519) — `Homepage - P-GLW-007 Globewest US Expansion Project`
* **Assigned Developer:** Vinod Vankar
* **Objective:** Establish the dedicated US Storefront Homepage, replicating the approved Australian B2B aesthetic and content structure while enforcing strict US multi-store scope isolation, WCAG 2.2 AA accessibility, and dual-auth trade customer matrix.

---

## 2. Live Sprint Demo Walkthrough Script (Step-by-Step)

### Step 1: Desktop First Impression & Hero Banner (1440×900)
1. **Action:** Open `https://mcstaging2.globewest.com/` in Chrome.
2. **Talking Points:**
   - Notice the full-width Hero Banner Slider (`main-us-banner`) rendering high-resolution lifestyle photography.
   - Smooth horizontal slide transition powered by Swiper JS with active pagination dots.
   - Click the primary call-to-action button: *"Explore Collections 2025 Volume #02"*.
   - **Callout:** Verify that navigation remains strictly within the US storefront (`mcstaging2.globewest.com`), confirming that the previous AU leakage defect is fully resolved.

### Step 2: Category Navigation Carousel & Room Mapping
1. **Action:** Scroll down to the Category Carousel.
2. **Talking Points:**
   - 7 curated room categories are rendered (*Living Room, Dining Room, Outdoor, Bedroom, Entrance*).
   - High-resolution thumbnail assets render with zero NetSuite image sync breaks.
   - Each card links cleanly to its corresponding US catalog category page.

### Step 3: Brand Story & B2B Video Showcase
1. **Action:** Scroll to the About Us Brand Story and Video Section.
2. **Talking Points:**
   - 2-column editorial layout: *"Inspired by uniquely Australian living, we create distinctive furniture..."*
   - Video container maintains responsive 16:9 aspect ratio with embedded iframe player, presenting zero layout shifts.

### Step 4: Dual-Auth Matrix (Guest vs Logged-In Trade Customer)
1. **Action:** Highlight Header Utility Bar in current Guest mode -> then log in as Trade Customer.
2. **Talking Points:**
   - **Guest Browsing Mode:** Wholesale prices and trade margin tags are strictly masked; Trade Pricing Toggle is hidden.
   - **Trade Session:** Upon logging in (`deepali.londhe@overdose.digital`), the header immediately surfaces the **Trade Pricing Toggle** (`Trade` vs `MSRP`), recognizing the user as an authenticated trade partner.

### Step 5: Mobile Responsiveness & WCAG 2.2 AA Compliance
1. **Action:** Toggle Chrome DevTools to Mobile (390×844 iPhone 14/15).
2. **Talking Points:**
   - Verified **zero horizontal scroll overflow** (`scrollWidth = clientWidth = 375px`).
   - Clean vertical stacking of room categories and touch-friendly navigation drawer.
   - Full automated Axe-Core audit confirmed **0 WCAG 2.2 AA accessibility violations**.

---

## 3. QA Defect Callouts & Next Steps for Engineering

While core layout and navigation are functional, senior QA has raised **4 defects** for developer remediation:

1. 🔴 **Fresh Ideas Dummy Blog Posts:**
   - The Recent Articles block currently displays staging test posts (*"Post testing (Duplicated)"*, *"test2"*). Needs master content sync from WordPress hub.
2. ⚠️ **Instagram Photo Feed Blank:**
   - Feed shell is rendered, but photos are missing due to pending Instagram Graph API client token authorization.
3. 🔴 **Australian Domain Leaks in Footer:**
   - "Shop Outlet" links to `globewestoutlet.com.au` and Pinterest links to `.com.au`. Must update to US routes.
4. ⚠️ **HTML `<title>` Meta Tag:**
   - Currently displays unbranded CMS slug: `<title>Home page - US</title>`. Needs Store View title suffix configured (`- GlobeWest USA`).

---

## 4. Demo Artifacts & Evidence Reference
* **Interactive Defect Viewer:** Open `VIEW_DEFECT_IMAGES.html` in any browser.
* **Side-by-Side Red/Green Proof:** Stored in `comparison/`.
* **Full Test Case Matrix (15 TCs):** Available in `Homepage_Test_Cases.xlsx`.
