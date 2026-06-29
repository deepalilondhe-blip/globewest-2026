# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.js >> GlobeWest storefront Accessibility Audit (WCAG 2.2 AA) >> 7. Search Results Page accessibility scan
- Location: tests\accessibility.spec.js:67:3

# Error details

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 5
Received:    7
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - paragraph [ref=e12]:
          - text: Find a
          - link "designer" [ref=e13] [cursor=pointer]:
            - /url: /find-designer-start
          - text: or
          - link "stockist" [ref=e14] [cursor=pointer]:
            - /url: /locator
        - generic [ref=e17]:
          - link "Ready to Buy" [ref=e18] [cursor=pointer]:
            - /url: /how-to-buy/
          - link "Book Showroom Visit" [ref=e19] [cursor=pointer]:
            - /url: /online_booking/
      - generic [ref=e20]:
        - generic [ref=e21]:
          - strong [ref=e23]: Search
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]: Search
              - generic [ref=e28]:
                - combobox "Search" [ref=e29]: sofa
                - link "Advanced Search" [ref=e31] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/catalogsearch/advanced/
            - button "Search" [disabled] [ref=e33]
        - link "store logo" [ref=e34] [cursor=pointer]:
          - /url: https://mcstaging2.globewest.com.au/
          - img "globewest logo" [ref=e35]
        - generic [ref=e36]:
          - generic:
            - button " Login " [ref=e37] [cursor=pointer]:
              - text: 
              - generic [ref=e38]: Login
              - text: 
            - text: "* *"
        - link "" [ref=e40] [cursor=pointer]:
          - /url: https://mcstaging2.globewest.com.au/wishlist/
        - generic [ref=e41]:
          - link " My Cart" [ref=e42] [cursor=pointer]:
            - /url: https://mcstaging2.globewest.com.au/checkout/cart/
            - text: 
            - generic [ref=e43]: My Cart
          - text: 
    - main [ref=e44]:
      - generic [ref=e48]:
        - heading "My Wishlist" [level=2] [ref=e50]
        - generic [ref=e51]:
          - strong [ref=e52]: Last Added Items
          - generic [ref=e53]: You have no items in your wish list.
    - generic [ref=e62]:
      - paragraph
      - generic [ref=e63]:
        - generic [ref=e64]:
          - text: Content hub
          - heading "Inspiring Trends & Directions" [level=3] [ref=e65]
        - list [ref=e66]:
          - generic [ref=e67]:
            - group "1 / 5" [ref=e68]:
              - generic [ref=e70]:
                - link "Post testing (Duplicated)" [ref=e72] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated-2
                  - img "Post testing (Duplicated)" [ref=e73]
                - generic [ref=e74]:
                  - generic [ref=e75]: Dec 07
                  - text: "-"
                  - link "Style tips" [ref=e77] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                - link "Post testing (Duplicated)" [ref=e80] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated-2
                - paragraph [ref=e85]: This is test blog
            - group "2 / 5" [ref=e86]:
              - generic [ref=e88]:
                - link "test2" [ref=e90] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated
                  - img "test2" [ref=e91]
                - generic [ref=e92]:
                  - generic [ref=e93]: Dec 07
                  - text: "-"
                  - link "Style tips" [ref=e95] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                - link "test2" [ref=e98] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated
                - paragraph [ref=e103]: This is test blog
            - group "3 / 5" [ref=e104]:
              - generic [ref=e106]:
                - link "Post testing" [ref=e108] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing
                  - img "Post testing" [ref=e109]
                - generic [ref=e110]:
                  - generic [ref=e111]: Aug 27
                  - text: "-"
                  - link "Style tips" [ref=e113] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                - link "Post testing" [ref=e116] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing
                - paragraph [ref=e121]: This is test blog
            - group "4 / 5" [ref=e122]:
              - generic [ref=e124]:
                - link "Stockist in Profile | Kira & Kira" [ref=e126] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/stockist-in-profile-kira-and-kira
                  - img "Stockist in Profile | Kira & Kira" [ref=e127]
                - generic [ref=e128]:
                  - generic [ref=e129]: Sep 14
                  - text: "-"
                  - generic [ref=e130]:
                    - link "Style tips" [ref=e131] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - text: ","
                    - link "Designer in profile" [ref=e132] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/designer-in-profile
                - link "Stockist in Profile | Kira & Kira" [ref=e135] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/stockist-in-profile-kira-and-kira
                - paragraph [ref=e140]: Kira & Kira are a GlobeWest stockist located on the Gold Coast, showcasing beautiful furniture, art and homewares from Australian brands & designers alike.
            - group "5 / 5" [ref=e141]:
              - generic [ref=e143]:
                - link "Design Directions 2023" [ref=e145] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/design-directions-2023
                  - img "Design Directions 2023" [ref=e146]
                - generic [ref=e147]:
                  - generic [ref=e148]: Aug 15
                  - text: "-"
                  - generic [ref=e149]:
                    - link "Style tips" [ref=e150] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - text: ","
                    - link "Gallery" [ref=e151] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/gallery
                    - text: ","
                    - link "Inspiration" [ref=e152] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/inspiration
                - link "Design Directions 2023" [ref=e155] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog/style-tips/design-directions-2023
                - paragraph [ref=e160]: Welcoming our six key trends and themes for Collections 2023.
          - button "Next slide" [ref=e161] [cursor=pointer]: 
          - text: 
        - paragraph [ref=e162]:
          - link "View all articles" [ref=e163] [cursor=pointer]:
            - /url: https://mcprod.globewest.com.au/blog
    - contentinfo [ref=e164]:
      - generic [ref=e166]:
        - generic [ref=e167]:
          - generic [ref=e169]:
            - heading "Connect with us" [level=3] [ref=e170]
            - list [ref=e171]:
              - listitem [ref=e172]:
                - link "" [ref=e173] [cursor=pointer]:
                  - /url: https://www.facebook.com/globewestfurniture/
              - listitem [ref=e174]:
                - link "" [ref=e175] [cursor=pointer]:
                  - /url: https://www.pinterest.com.au/globewest/
              - listitem [ref=e176]:
                - link "" [ref=e177] [cursor=pointer]:
                  - /url: https://www.instagram.com/globewest/
              - listitem [ref=e178]:
                - link "" [ref=e179] [cursor=pointer]:
                  - /url: https://www.tiktok.com/@globewest
          - generic [ref=e182]:
            - heading "Subscribe" [level=2] [ref=e183]
            - generic [ref=e184]:
              - text: Be the first to know about GlobeWest new collections, product launches and special offers.
              - link "Subscribe Now." [ref=e185] [cursor=pointer]:
                - /url: https://www.globewest.com.au/subscribe-to-our-database
                - strong [ref=e186]: Subscribe Now.
          - generic [ref=e189]:
            - text: This site is protected by reCAPTCHA and the Google
            - link "Privacy Policy" [ref=e190] [cursor=pointer]:
              - /url: https://policies.google.com/privacy
            - text: and
            - link "Terms of Service" [ref=e191] [cursor=pointer]:
              - /url: https://policies.google.com/terms
            - text: apply.
          - generic [ref=e193]:
            - heading "Visit our Showrooms" [level=3] [ref=e194]
            - paragraph [ref=e195]: See the largest selection of our products. We look forward to seeing you!
            - link "Book an Appointment" [ref=e196] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/online-booking
          - figure [ref=e199]
        - generic [ref=e203]:
          - generic [ref=e204]:
            - heading "PRODUCTS" [level=3] [ref=e207]
            - generic [ref=e208]:
              - list [ref=e209]:
                - listitem [ref=e210]:
                  - link "In Stock" [ref=e211] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/in-stock
                - listitem [ref=e212]:
                  - link "Indoor" [ref=e213] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor
                - listitem [ref=e214]:
                  - link "Living" [ref=e215] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/living-room
                - listitem [ref=e216]:
                  - link "Dining" [ref=e217] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/dining-room-kitchen
                - listitem [ref=e218]:
                  - link "Bedroom" [ref=e219] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/bedroom
              - list [ref=e220]:
                - listitem [ref=e221]:
                  - link "Outdoor Furniture" [ref=e222] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/outdoor
                - listitem [ref=e223]:
                  - link "Office & Workspace" [ref=e224] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/home-office-study
                - listitem [ref=e225]:
                  - link "Homewares" [ref=e226] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/homewares
                - listitem [ref=e227]:
                  - link "Lighting" [ref=e228] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/homeware/lighting
                - listitem [ref=e229]:
                  - link "Rugs" [ref=e230] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/homeware/homewares/rugs
          - generic [ref=e231]:
            - heading "CUSTOMER SUPPORT" [level=3] [ref=e234]
            - list [ref=e236]:
              - listitem [ref=e237]:
                - link "How to Buy" [ref=e238] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/how-to-buy
              - listitem [ref=e239]:
                - link "Showroom Locations" [ref=e240] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/contact
              - listitem [ref=e241]:
                - link "Trade & Wholesale" [ref=e242] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre/general/trade-registration
              - listitem [ref=e243]:
                - link "Project & Commercial" [ref=e244] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre
              - listitem [ref=e245]:
                - link "Find a Stockist" [ref=e246] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/locator
              - listitem [ref=e247]:
                - link "Find a Designer" [ref=e248] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/find-designer-start
              - listitem [ref=e249]:
                - link "Help Centre" [ref=e250] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre
              - listitem [ref=e251]:
                - link "After Sales Enquiries" [ref=e252] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre/after-sales-enquires
              - listitem [ref=e253]:
                - link "Contact Us" [ref=e254] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/contact
              - listitem [ref=e255]:
                - link "Product Care" [ref=e256] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/product-care
              - listitem [ref=e257]:
                - link "Shop Outlet" [ref=e258] [cursor=pointer]:
                  - /url: https://globewestoutlet.com.au/
          - generic [ref=e259]:
            - heading "OUR BRAND" [level=3] [ref=e262]
            - list [ref=e264]:
              - listitem [ref=e265]:
                - link "About Us" [ref=e266] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/about-us
              - listitem [ref=e267]:
                - link "Careers" [ref=e268] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/careers
              - listitem [ref=e269]:
                - link "Inspiration & Interviews" [ref=e270] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog
              - listitem [ref=e271]:
                - link "Video Library" [ref=e272] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/video-library
              - listitem [ref=e273]:
                - link "Lookbook Library" [ref=e274] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/lookbook-library
              - listitem [ref=e275]:
                - link "Press" [ref=e276] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/press
    - list [ref=e280]:
      - listitem [ref=e281]: © 2023 GlobeWest
      - listitem [ref=e282]:
        - link "Privacy Policy" [ref=e283] [cursor=pointer]:
          - /url: https://mcstaging2.globewest.com.au/privacy-policy
      - listitem [ref=e284]:
        - link "Terms & Conditions" [ref=e285] [cursor=pointer]:
          - /url: https://mcstaging2.globewest.com.au/terms-and-conditions-page
    - text: 
  - generic:
    - generic:
      - generic [ref=e288]:
        - iframe [ref=e289]:
          - button "Close message from company" [ref=f3e4] [cursor=pointer]:
            - img [ref=f3e5]
        - iframe [ref=e290]:
          - button "Hi. Need any help?" [ref=f4e5] [cursor=pointer]
      - iframe [ref=e291]:
        - button "Open messaging window" [ref=f5e5] [cursor=pointer]:
          - img [ref=f5e7]
          - img [ref=f5e10]
  - dialog [ref=e292]:
    - iframe [ref=e294]:
      - generic [ref=f6e9]:
        - heading "Join the GlobeWest Family" [level=1] [ref=f6e15]:
          - generic [ref=f6e19]: Join the GlobeWest Family
        - paragraph [ref=f6e21]:
          - generic [ref=f6e22]: Subscribe to receive updates on upcoming trends, product news, exclusive interviews and home tours from our team via email and SMS.
        - generic [ref=f6e26]:
          - generic [ref=f6e28]:
            - generic [ref=f6e32]:
              - generic [ref=f6e33]: First Name *
              - textbox "First Name" [ref=f6e34]
            - generic [ref=f6e38]:
              - generic [ref=f6e39]:
                - generic [ref=f6e40]: State
                - text: "*"
              - combobox "State" [ref=f6e42]:
                - option "Please select" [selected]
                - option "VIC & TAS"
                - option "NSW & ACT"
                - option "QLD & NT"
                - option "SA"
                - option "WA"
          - generic [ref=f6e44]:
            - generic [ref=f6e45]:
              - generic [ref=f6e46]: Email Address
              - text: "*"
            - textbox "Email Address" [ref=f6e47]
          - generic [ref=f6e49]:
            - generic [ref=f6e51]: Mobile Number
            - generic [ref=f6e53]:
              - 'generic "Australia: +61" [ref=f6e55]'
              - textbox "Mobile Number" [ref=f6e57]:
                - /placeholder: 0412 345 678
        - group [ref=f6e62]:
          - button "Subscribe" [ref=f6e63] [cursor=pointer]
    - img [ref=e296] [cursor=pointer]
```

# Test source

```ts
  1  | // @ts-check
  2  | const { test, expect } = require('@playwright/test');
  3  | const AxeBuilder = require('@axe-core/playwright').default;
  4  | const { Homepage } = require('../pages/Homepage');
  5  | const { ProductListingPage } = require('../pages/ProductListingPage');
  6  | const { ProductDetailPage } = require('../pages/ProductDetailPage');
  7  | const { CheckoutPage } = require('../pages/CheckoutPage');
  8  | const { MyAccountPage } = require('../pages/MyAccountPage');
  9  | const { TradePortalPage } = require('../pages/TradePortalPage');
  10 | const { SearchPage } = require('../pages/SearchPage');
  11 | const { StaticPage } = require('../pages/StaticPage');
  12 | 
  13 | test.describe('GlobeWest storefront Accessibility Audit (WCAG 2.2 AA)', () => {
  14 |   
  15 |   // Helper function to run axe and assert violations
  16 |   async function runAxeScan(page, path, name) {
  17 |     await page.goto(path);
  18 |     await page.waitForLoadState('domcontentloaded');
  19 | 
  20 |     // Handle cookie acceptance banner if present
  21 |     const cookieAcceptBtn = page.locator('#btn-cookie-allow, button.cookie-accept');
  22 |     if (await cookieAcceptBtn.isVisible()) {
  23 |       await cookieAcceptBtn.click();
  24 |     }
  25 | 
  26 |     const scanResults = await new AxeBuilder({ page })
  27 |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  28 |       .exclude('iframe[src*="yotpo.com"]')
  29 |       .exclude('.yotpo-widget')
  30 |       .analyze();
  31 | 
  32 |     const violations = scanResults.violations;
  33 |     if (violations.length > 0) {
  34 |       console.warn(`[A11y] ${name} Page has ${violations.length} accessibility violations.`);
  35 |       violations.forEach(v => {
  36 |         console.log(`- Violation: ${v.id} - ${v.description} (Impacted elements: ${v.nodes.length})`);
  37 |       });
  38 |     }
  39 | 
> 40 |     expect(violations.length).toBeLessThanOrEqual(5); // Allowing minor baseline tolerance for third-party scripts, target is 0 for custom styles
     |                               ^ Error: expect(received).toBeLessThanOrEqual(expected)
  41 |   }
  42 | 
  43 |   test('1. Homepage accessibility scan', async ({ page }) => {
  44 |     await runAxeScan(page, '/', 'Homepage');
  45 |   });
  46 | 
  47 |   test('2. Product Listing Page (PLP) accessibility scan', async ({ page }) => {
  48 |     await runAxeScan(page, '/furniture/sofas-modulars.html', 'PLP');
  49 |   });
  50 | 
  51 |   test('3. Product Detail Page (PDP) accessibility scan', async ({ page }) => {
  52 |     await runAxeScan(page, '/sofas-modulars/3-seater/sofa-name.html', 'PDP');
  53 |   });
  54 | 
  55 |   test('4. Shopping Cart / Checkout Page accessibility scan', async ({ page }) => {
  56 |     await runAxeScan(page, '/checkout/cart/', 'Cart/Checkout');
  57 |   });
  58 | 
  59 |   test('5. My Account Page accessibility scan', async ({ page }) => {
  60 |     await runAxeScan(page, '/customer/account/login/', 'My Account Login');
  61 |   });
  62 | 
  63 |   test('6. B2B Trade Portal accessibility scan', async ({ page }) => {
  64 |     await runAxeScan(page, '/trade-portal-registration/', 'Trade Portal');
  65 |   });
  66 | 
  67 |   test('7. Search Results Page accessibility scan', async ({ page }) => {
  68 |     await runAxeScan(page, '/catalogsearch/result/?q=sofa', 'Search Results');
  69 |   });
  70 | 
  71 |   test('8. Content / Static Page accessibility scan', async ({ page }) => {
  72 |     await runAxeScan(page, '/about-us/', 'About Us Content');
  73 |   });
  74 | });
  75 | 
```