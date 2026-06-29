# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.js >> GlobeWest storefront Accessibility Audit (WCAG 2.2 AA) >> 1. Homepage accessibility scan
- Location: tests\accessibility.spec.js:43:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: expect(received).toBeLessThanOrEqual(expected)

Expected: <= 5
Received:    6
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
                - combobox "Search" [ref=e29]
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
      - generic [ref=e46]:
        - group "1 / 1" [ref=e52]:
          - generic [ref=e56]:
            - generic [ref=e57]:
              - heading "Out Now" [level=1] [ref=e58]
              - paragraph [ref=e59]: Designed to complement the natural and architectural elements of Australian homes and commercial spaces.
              - 'link "Explore Collections 2025 Volume #02" [ref=e60] [cursor=pointer]':
                - /url: https://www.globewest.com.au
            - link [ref=e62] [cursor=pointer]:
              - /url: https://www.globewest.com.au
        - generic [ref=e65]:
          - paragraph
        - generic [ref=e69]:
          - generic [ref=e70]:
            - group "1 / 7" [ref=e71]:
              - link "Living Room Furniture " [ref=e75] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/indoor/shop-by-room/living-room
            - group "2 / 7" [ref=e76]:
              - link "Dining Room Furniture " [ref=e80] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/indoor/shop-by-room/dining-room-kitchen
            - group "3 / 7" [ref=e81]:
              - link "Outdoor Furniture " [ref=e85] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/outdoor
            - group "4 / 7" [ref=e86]:
              - link "Bedroom Furniture " [ref=e90] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/indoor/shop-by-room/bedroom
            - group "5 / 7" [ref=e91]:
              - link "Entrance Furniture " [ref=e95] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/indoor/shop-by-room/living-room?custom_category=29914
            - group "6 / 7" [ref=e96]:
              - link "Office Furniture " [ref=e100] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/indoor/shop-by-room/home-office-study
            - group "7 / 7" [ref=e101]:
              - link "Explore Homewares " [ref=e105] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/homeware
          - button "Next slide" [ref=e106] [cursor=pointer]: 
          - text: 
        - generic [ref=e111]:
          - heading "About us" [level=2] [ref=e112]
          - paragraph [ref=e113]: Inspired by uniquely Australian living, we create distinctive furniture and homewares for beautiful spaces. Embracing colour and texture, we celebrate our surroundings to bring you design that transforms your everyday.
          - link "Learn more" [ref=e114] [cursor=pointer]:
            - /url: about-us
        - generic [ref=e124]:
          - text: Find a Designer
          - heading "Get Professional Design Support" [level=3] [ref=e125]
          - paragraph [ref=e126]: Create your ideal space with the support and guidance of professionals.
          - list [ref=e127]:
            - listitem [ref=e128]:  Add beauty and value to your home
            - listitem [ref=e129]:  Save money and time
            - listitem [ref=e130]:  Create a more functional space
            - listitem [ref=e131]:  Solve renovation and decorating problems
          - generic [ref=e132]:
            - link "Find a designer now" [ref=e133] [cursor=pointer]:
              - /url: find-designer-start
            - link "Find a stockist" [ref=e134] [cursor=pointer]:
              - /url: locator
        - generic [ref=e141]:
          - generic:
            - generic [ref=e143]:
              - generic [ref=e144]: Latest Brand Video
              - 'heading "Collections 2023 Volume #02" [level=3] [ref=e145]'
              - link "VIEW" [ref=e146] [cursor=pointer]:
                - /url: collections-2023-video
            - generic [ref=e148] [cursor=pointer]: 
        - generic [ref=e150]:
          - generic [ref=e151]:
            - paragraph [ref=e152]: Trending Products
            - heading "Shop Our Latest Arrivals" [level=4] [ref=e153]
          - list [ref=e155]:  
          - link "View more" [ref=e161] [cursor=pointer]:
            - /url: ""
        - generic [ref=e169]:
          - paragraph
          - generic [ref=e170]:
            - generic [ref=e171]:
              - text: Content hub
              - heading "Inspiring Trends & Directions" [level=3] [ref=e172]
            - list [ref=e173]:
              - generic [ref=e174]:
                - group "1 / 5" [ref=e175]:
                  - generic [ref=e177]:
                    - link "Post testing (Duplicated)" [ref=e179] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated-2
                      - img "Post testing (Duplicated)" [ref=e180]
                    - generic [ref=e181]:
                      - generic [ref=e182]: Dec 07
                      - text: "-"
                      - link "Style tips" [ref=e184] [cursor=pointer]:
                        - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - link "Post testing (Duplicated)" [ref=e187] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated-2
                    - paragraph [ref=e192]: This is test blog
                - group "2 / 5" [ref=e193]:
                  - generic [ref=e195]:
                    - link "test2" [ref=e197] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated
                      - img "test2" [ref=e198]
                    - generic [ref=e199]:
                      - generic [ref=e200]: Dec 07
                      - text: "-"
                      - link "Style tips" [ref=e202] [cursor=pointer]:
                        - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - link "test2" [ref=e205] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated
                    - paragraph [ref=e210]: This is test blog
                - group "3 / 5" [ref=e211]:
                  - generic [ref=e213]:
                    - link "Post testing" [ref=e215] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing
                      - img "Post testing" [ref=e216]
                    - generic [ref=e217]:
                      - generic [ref=e218]: Aug 27
                      - text: "-"
                      - link "Style tips" [ref=e220] [cursor=pointer]:
                        - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - link "Post testing" [ref=e223] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing
                    - paragraph [ref=e228]: This is test blog
                - group "4 / 5" [ref=e229]:
                  - generic [ref=e231]:
                    - link "Stockist in Profile | Kira & Kira" [ref=e233] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/stockist-in-profile-kira-and-kira
                      - img "Stockist in Profile | Kira & Kira" [ref=e234]
                    - generic [ref=e235]:
                      - generic [ref=e236]: Sep 14
                      - text: "-"
                      - generic [ref=e237]:
                        - link "Style tips" [ref=e238] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                        - text: ","
                        - link "Designer in profile" [ref=e239] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/designer-in-profile
                    - link "Stockist in Profile | Kira & Kira" [ref=e242] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/stockist-in-profile-kira-and-kira
                    - paragraph [ref=e247]: Kira & Kira are a GlobeWest stockist located on the Gold Coast, showcasing beautiful furniture, art and homewares from Australian brands & designers alike.
                - group "5 / 5" [ref=e248]:
                  - generic [ref=e250]:
                    - link "Design Directions 2023" [ref=e252] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/design-directions-2023
                      - img "Design Directions 2023" [ref=e253]
                    - generic [ref=e254]:
                      - generic [ref=e255]: Aug 15
                      - text: "-"
                      - generic [ref=e256]:
                        - link "Style tips" [ref=e257] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                        - text: ","
                        - link "Gallery" [ref=e258] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/gallery
                        - text: ","
                        - link "Inspiration" [ref=e259] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/inspiration
                    - link "Design Directions 2023" [ref=e262] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/design-directions-2023
                    - paragraph [ref=e267]: Welcoming our six key trends and themes for Collections 2023.
              - button "Next slide" [ref=e268] [cursor=pointer]: 
              - text: 
            - paragraph [ref=e269]:
              - link "View all articles" [ref=e270] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/blog
        - generic [ref=e275]:
          - paragraph [ref=e276]:
            - link "@Globewest" [ref=e277] [cursor=pointer]:
              - /url: https://www.instagram.com/globewest/
          - heading "Be Inspired" [level=2] [ref=e278]
          - paragraph [ref=e279]: Beautiful & Distinctive furniture inspired by uniquely Australian living.
        - generic [ref=e283]:
          - heading "Distinctive Living" [level=3] [ref=e284]
          - paragraph [ref=e285]: Designed for designers, GlobeWest is an Australian owned and run company with offices and showrooms based in multiple cities. Inspired by creating beautiful design that transforms the everyday, forming connection, comfort and joy in Australian homes and businesses. A labour of love, an in-house dedicated design team develop and curate diverse collections of furniture and homewares catering to Australian residential and commercial spaces.
    - contentinfo [ref=e286]:
      - generic [ref=e288]:
        - generic [ref=e289]:
          - generic [ref=e291]:
            - heading "Connect with us" [level=3] [ref=e292]
            - list [ref=e293]:
              - listitem [ref=e294]:
                - link "" [ref=e295] [cursor=pointer]:
                  - /url: https://www.facebook.com/globewestfurniture/
              - listitem [ref=e296]:
                - link "" [ref=e297] [cursor=pointer]:
                  - /url: https://www.pinterest.com.au/globewest/
              - listitem [ref=e298]:
                - link "" [ref=e299] [cursor=pointer]:
                  - /url: https://www.instagram.com/globewest/
              - listitem [ref=e300]:
                - link "" [ref=e301] [cursor=pointer]:
                  - /url: https://www.tiktok.com/@globewest
          - generic [ref=e304]:
            - heading "Subscribe" [level=2] [ref=e305]
            - generic [ref=e306]:
              - text: Be the first to know about GlobeWest new collections, product launches and special offers.
              - link "Subscribe Now." [ref=e307] [cursor=pointer]:
                - /url: https://www.globewest.com.au/subscribe-to-our-database
                - strong [ref=e308]: Subscribe Now.
          - generic [ref=e311]:
            - text: This site is protected by reCAPTCHA and the Google
            - link "Privacy Policy" [ref=e312] [cursor=pointer]:
              - /url: https://policies.google.com/privacy
            - text: and
            - link "Terms of Service" [ref=e313] [cursor=pointer]:
              - /url: https://policies.google.com/terms
            - text: apply.
          - generic [ref=e315]:
            - heading "Visit our Showrooms" [level=3] [ref=e316]
            - paragraph [ref=e317]: See the largest selection of our products. We look forward to seeing you!
            - link "Book an Appointment" [ref=e318] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/online-booking
          - figure [ref=e321]
        - generic [ref=e325]:
          - generic [ref=e326]:
            - heading "PRODUCTS" [level=3] [ref=e329]
            - generic [ref=e330]:
              - list [ref=e331]:
                - listitem [ref=e332]:
                  - link "In Stock" [ref=e333] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/in-stock
                - listitem [ref=e334]:
                  - link "Indoor" [ref=e335] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor
                - listitem [ref=e336]:
                  - link "Living" [ref=e337] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/living-room
                - listitem [ref=e338]:
                  - link "Dining" [ref=e339] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/dining-room-kitchen
                - listitem [ref=e340]:
                  - link "Bedroom" [ref=e341] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/bedroom
              - list [ref=e342]:
                - listitem [ref=e343]:
                  - link "Outdoor Furniture" [ref=e344] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/outdoor
                - listitem [ref=e345]:
                  - link "Office & Workspace" [ref=e346] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/indoor/shop-by-room/home-office-study
                - listitem [ref=e347]:
                  - link "Homewares" [ref=e348] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/homewares
                - listitem [ref=e349]:
                  - link "Lighting" [ref=e350] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/homeware/lighting
                - listitem [ref=e351]:
                  - link "Rugs" [ref=e352] [cursor=pointer]:
                    - /url: https://mcstaging2.globewest.com.au/homeware/homewares/rugs
          - generic [ref=e353]:
            - heading "CUSTOMER SUPPORT" [level=3] [ref=e356]
            - list [ref=e358]:
              - listitem [ref=e359]:
                - link "How to Buy" [ref=e360] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/how-to-buy
              - listitem [ref=e361]:
                - link "Showroom Locations" [ref=e362] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/contact
              - listitem [ref=e363]:
                - link "Trade & Wholesale" [ref=e364] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre/general/trade-registration
              - listitem [ref=e365]:
                - link "Project & Commercial" [ref=e366] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre
              - listitem [ref=e367]:
                - link "Find a Stockist" [ref=e368] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/locator
              - listitem [ref=e369]:
                - link "Find a Designer" [ref=e370] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/find-designer-start
              - listitem [ref=e371]:
                - link "Help Centre" [ref=e372] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre
              - listitem [ref=e373]:
                - link "After Sales Enquiries" [ref=e374] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/help-centre/after-sales-enquires
              - listitem [ref=e375]:
                - link "Contact Us" [ref=e376] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/contact
              - listitem [ref=e377]:
                - link "Product Care" [ref=e378] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/product-care
              - listitem [ref=e379]:
                - link "Shop Outlet" [ref=e380] [cursor=pointer]:
                  - /url: https://globewestoutlet.com.au/
          - generic [ref=e381]:
            - heading "OUR BRAND" [level=3] [ref=e384]
            - list [ref=e386]:
              - listitem [ref=e387]:
                - link "About Us" [ref=e388] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/about-us
              - listitem [ref=e389]:
                - link "Careers" [ref=e390] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/careers
              - listitem [ref=e391]:
                - link "Inspiration & Interviews" [ref=e392] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/blog
              - listitem [ref=e393]:
                - link "Video Library" [ref=e394] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/video-library
              - listitem [ref=e395]:
                - link "Lookbook Library" [ref=e396] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/lookbook-library
              - listitem [ref=e397]:
                - link "Press" [ref=e398] [cursor=pointer]:
                  - /url: https://mcstaging2.globewest.com.au/press
    - list [ref=e402]:
      - listitem [ref=e403]: © 2023 GlobeWest
      - listitem [ref=e404]:
        - link "Privacy Policy" [ref=e405] [cursor=pointer]:
          - /url: https://mcstaging2.globewest.com.au/privacy-policy
      - listitem [ref=e406]:
        - link "Terms & Conditions" [ref=e407] [cursor=pointer]:
          - /url: https://mcstaging2.globewest.com.au/terms-and-conditions-page
    - text: 
  - generic:
    - generic:
      - generic [ref=e410]:
        - iframe [ref=e411]:
          - button "Close message from company" [ref=f4e4] [cursor=pointer]:
            - img [ref=f4e5]
        - iframe [ref=e412]:
          - button "Hi. Need any help?" [ref=f5e5] [cursor=pointer]
      - iframe [ref=e413]:
        - button "Open messaging window" [ref=f6e5] [cursor=pointer]:
          - img [ref=f6e7]
          - img [ref=f6e10]
  - dialog [ref=e414]:
    - iframe [active] [ref=e416]:
      - generic [ref=f9e9]:
        - heading "Join the GlobeWest Family" [level=1] [ref=f9e15]:
          - generic [ref=f9e19]: Join the GlobeWest Family
        - paragraph [ref=f9e21]:
          - generic [ref=f9e22]: Subscribe to receive updates on upcoming trends, product news, exclusive interviews and home tours from our team via email and SMS.
        - generic [ref=f9e26]:
          - generic [ref=f9e28]:
            - generic [ref=f9e32]:
              - generic [ref=f9e33]: First Name *
              - textbox "First Name" [ref=f9e34]
            - generic [ref=f9e38]:
              - generic [ref=f9e39]:
                - generic [ref=f9e40]: State
                - text: "*"
              - combobox "State" [ref=f9e42]:
                - option "Please select" [selected]
                - option "VIC & TAS"
                - option "NSW & ACT"
                - option "QLD & NT"
                - option "SA"
                - option "WA"
          - generic [ref=f9e44]:
            - generic [ref=f9e45]:
              - generic [ref=f9e46]: Email Address
              - text: "*"
            - textbox "Email Address" [ref=f9e47]
          - generic [ref=f9e49]:
            - generic [ref=f9e51]: Mobile Number
            - generic [ref=f9e53]:
              - 'generic "Australia: +61" [ref=f9e55]'
              - textbox "Mobile Number" [ref=f9e57]:
                - /placeholder: 0412 345 678
        - group [ref=f9e62]:
          - button "Subscribe" [ref=f9e63] [cursor=pointer]
    - img [ref=e418] [cursor=pointer]
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