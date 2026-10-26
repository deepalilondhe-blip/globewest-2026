Hi Vinod,

Thank you for assigning this ticket.

We have conducted a comprehensive audit of all 5 Static Pages (**Terms & Conditions, Privacy Policy, Contact Us, Help Centre / FAQ, and 404 Error Page**) on **US Staging** (`https://mcstaging2.globewest.com`) compared directly against the approved **AU Baseline Staging** storefront (`https://mcstaging2.globewest.com.au`), verified under **both Desktop (1440px) and Mobile (390px)** viewports under **authenticated (logged-in) sessions**.

---

### 📋 Summary of Findings & Page Status:

1. **Privacy Policy (`/privacy-policy`):**
   - **Status:** **PASS**
   - Headings, clause hierarchy, and cookie tables match the AU baseline 1-to-1 across all 7 sections (*What we collect, What we do with information, Security, How we use cookies, Links to other websites, Controlling personal info, List of cookies*).
   - Zero broken images detected; mobile layout stacks and scrolls cleanly.

2. **Terms & Conditions (`/terms-and-conditions-page`):**
   - **Status:** **PASS with Legal Clarification Required**
   - Features clean tabbed accordion navigation (*Trade Customers* vs *General Public*) with 16 collapsible drawers.
   - **Note for Mitchell / Content Team:** Clause 1.1 currently references Australian corporate registration (*"GlobeWest Pty Ltd, Victoria, Australia ACN 674 872 621"*), `claims@globewest.com.au`, and the Australian PPSA statute. These need to be updated with the US legal entity and governing jurisdiction.

3. **Contact Us (`/contact-us`):**
   - **Status:** **DEFECT LOGGED (P1 - High)**
   - Online inquiry form functions properly with required field validations; zero text loss on mobile.
   - **Defect 1 (Staging Copy):** H3 subheading contains staging test copy: `“We’d love to help you test”` (live AU is clean: `“We’d love to help you”`).
   - **Defect 2 (AU Showroom Data Leakage):** The "Our Showrooms" section displays Australian showrooms (*Melbourne, Sydney, Brisbane, Perth*) and `.com.au` emails (*melbourne@globewest.com.au*, etc.). Broken image link: `GW-090724-005-3_375x420.jpg`. This needs US showroom addresses / localization.

4. **Help Centre / FAQ (`/help-centre`):**
   - **Status:** **DEFECT LOGGED (P1 - High - WCAG 2.2 AA Violation)**
   - Category cards and search input render and stack responsively.
   - **Defect 1 (WCAG 2.4.2 Failure):** The `<title>` tag on US Staging is completely **EMPTY** (`<title></title>`), whereas AU Baseline has `<title>Help centre</title>`. A valid, descriptive title is required for WCAG 2.2 AA accessibility and SEO.
   - **Defect 2:** Hero banner image (`help-center-banner.jpg`) returns HTTP 404.

5. **404 Page Not Found (`/non-existent-page-404-test`):**
   - **Status:** **DEFECT LOGGED (P3 - Low)**
   - Issues proper HTTP 404 header; messaging (*"Page not available."*) and header/footer recovery navigation match AU baseline.
   - **Minor Defect:** Document title contains internal staging prefix: `<title>[US] 404 Not Found</title>` (AU is clean `<title>404 Not Found</title>`).

---

### 📂 Test Artefacts Created:
- **18 Test Cases:** Created and available in `Static_Pages_Test_Cases.xlsx` and `Static_Pages_Test_Cases.csv`.
- **Real Side-by-Side Visuals (Unhighlighted):** Viewable in `VIEW_REAL_PAGE_COMPARISON.html` across all 5 pages for both Desktop and Mobile.
- **Annotated Defect Proofs:** Viewable in `VIEW_DEFECT_IMAGES.html`.
- **Run Commands:** Dedicated `Static Pages runcommand.txt` logged for test automation execution.

CC: Mitchell
