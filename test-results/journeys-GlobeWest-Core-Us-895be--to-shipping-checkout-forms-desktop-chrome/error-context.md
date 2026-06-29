# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: journeys.spec.js >> GlobeWest Core User Journey & State Verification >> Verify Checkout Entry transition from cart page to shipping checkout forms
- Location: tests\journeys.spec.js:276:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
=========================== logs ===========================
  "load" event fired
============================================================
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
      - navigation [ref=e44]:
        - list [ref=e45]:
          - listitem [ref=e46]:
            - link "Indoor" [ref=e47] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/indoor
              - generic [ref=e48]: Indoor
          - listitem [ref=e49]:
            - link "Outdoor" [ref=e50] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/outdoor
              - generic [ref=e51]: Outdoor
          - listitem [ref=e52]:
            - link "Homewares" [ref=e53] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/homeware
              - generic [ref=e54]: Homewares
          - listitem [ref=e55]:
            - link "In Stock" [ref=e56] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/in-stock
              - generic [ref=e57]: In Stock
          - listitem [ref=e58]:
            - link "Customisation" [ref=e59] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/customisation
              - generic [ref=e60]: Customisation
          - listitem [ref=e61]:
            - link "Projects" [ref=e62] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/project
              - generic [ref=e63]: Projects
          - listitem [ref=e64]:
            - link "Inspiration" [ref=e65] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/blog
              - generic [ref=e66]: Inspiration
          - listitem [ref=e67]:
            - link "Support" [ref=e68] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/help-centre
              - generic [ref=e69]: Support
          - listitem [ref=e70]:
            - link "Contact" [ref=e71] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/contact
              - generic [ref=e72]: Contact
    - main [ref=e73]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - heading "Your Cart is Empty" [level=1] [ref=e77]
          - paragraph [ref=e78]: You’re missing out is all we’re saying.
          - generic [ref=e79]:
            - link "Explore In Stock" [ref=e80] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/in-stock/
              - generic [ref=e81]: Explore In Stock
            - link "Shop Furniture" [ref=e82] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/indoor/furniture/
              - generic [ref=e83]: Shop Furniture
        - generic [ref=e93]:
          - paragraph
          - generic [ref=e94]:
            - generic [ref=e95]:
              - text: Content hub
              - heading "Inspiring Trends & Directions" [level=3] [ref=e96]
            - list [ref=e97]:
              - generic [ref=e98]:
                - group "1 / 5" [ref=e99]:
                  - generic [ref=e101]:
                    - link "Post testing (Duplicated)" [ref=e103] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated-2
                      - img "Post testing (Duplicated)" [ref=e104]
                    - generic [ref=e105]:
                      - generic [ref=e106]: Dec 07
                      - text: "-"
                      - link "Style tips" [ref=e108] [cursor=pointer]:
                        - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - link "Post testing (Duplicated)" [ref=e111] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated-2
                    - paragraph [ref=e116]: This is test blog
                - group "2 / 5" [ref=e117]:
                  - generic [ref=e119]:
                    - link "test2" [ref=e121] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated
                      - img "test2" [ref=e122]
                    - generic [ref=e123]:
                      - generic [ref=e124]: Dec 07
                      - text: "-"
                      - link "Style tips" [ref=e126] [cursor=pointer]:
                        - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - link "test2" [ref=e129] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing-duplicated
                    - paragraph [ref=e134]: This is test blog
                - group "3 / 5" [ref=e135]:
                  - generic [ref=e137]:
                    - link "Post testing" [ref=e139] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing
                      - img "Post testing" [ref=e140]
                    - generic [ref=e141]:
                      - generic [ref=e142]: Aug 27
                      - text: "-"
                      - link "Style tips" [ref=e144] [cursor=pointer]:
                        - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                    - link "Post testing" [ref=e147] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/post-testing
                    - paragraph [ref=e152]: This is test blog
                - group "4 / 5" [ref=e153]:
                  - generic [ref=e155]:
                    - link "Stockist in Profile | Kira & Kira" [ref=e157] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/stockist-in-profile-kira-and-kira
                      - img "Stockist in Profile | Kira & Kira" [ref=e158]
                    - generic [ref=e159]:
                      - generic [ref=e160]: Sep 14
                      - text: "-"
                      - generic [ref=e161]:
                        - link "Style tips" [ref=e162] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                        - text: ","
                        - link "Designer in profile" [ref=e163] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/designer-in-profile
                    - link "Stockist in Profile | Kira & Kira" [ref=e166] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/stockist-in-profile-kira-and-kira
                    - paragraph [ref=e171]: Kira & Kira are a GlobeWest stockist located on the Gold Coast, showcasing beautiful furniture, art and homewares from Australian brands & designers alike.
                - group "5 / 5" [ref=e172]:
                  - generic [ref=e174]:
                    - link "Design Directions 2023" [ref=e176] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/design-directions-2023
                      - img "Design Directions 2023" [ref=e177]
                    - generic [ref=e178]:
                      - generic [ref=e179]: Aug 15
                      - text: "-"
                      - generic [ref=e180]:
                        - link "Style tips" [ref=e181] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/style-tips
                        - text: ","
                        - link "Gallery" [ref=e182] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/gallery
                        - text: ","
                        - link "Inspiration" [ref=e183] [cursor=pointer]:
                          - /url: https://mcstaging2.globewest.com.au/blog/inspiration
                    - link "Design Directions 2023" [ref=e186] [cursor=pointer]:
                      - /url: https://mcstaging2.globewest.com.au/blog/style-tips/design-directions-2023
                    - paragraph [ref=e191]: Welcoming our six key trends and themes for Collections 2023.
              - button "Next slide" [ref=e192] [cursor=pointer]: 
              - text: 
            - paragraph [ref=e193]:
              - link "View all articles" [ref=e194] [cursor=pointer]:
                - /url: https://mcprod.globewest.com.au/blog
    - contentinfo [ref=e195]:
      - generic [ref=e196]:
        - list [ref=e197]:
          - listitem [ref=e198]:
            - link " Continue Shopping" [ref=e199] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/
              - text: 
              - generic [ref=e200]: Continue Shopping
          - listitem [ref=e201]:
            - link "Delivery Information" [ref=e202] [cursor=pointer]:
              - /url: https://mcstaging2.globewest.com.au/help-centre/delivery/
          - listitem [ref=e203]:
            - button "Help" [ref=e204] [cursor=pointer]
        - list [ref=e205]:
          - listitem [ref=e206]:
            - img "VISA" [ref=e207]
          - listitem [ref=e208]:
            - img "MasterCard" [ref=e209]
    - text: 
  - generic:
    - generic:
      - generic [ref=e212]:
        - iframe [ref=e213]:
          - button "Close message from company" [ref=f8e4] [cursor=pointer]:
            - img [ref=f8e5]
        - iframe [ref=e214]:
          - button "Hi. Need any help?" [ref=f9e5] [cursor=pointer]
      - iframe [ref=e215]:
        - button "Open messaging window" [ref=f10e5] [cursor=pointer]:
          - img [ref=f10e7]
          - img [ref=f10e10]
  - dialog [ref=e216]:
    - iframe [active] [ref=e218]:
      - generic [ref=f13e9]:
        - heading "Join the GlobeWest Family" [level=1] [ref=f13e15]:
          - generic [ref=f13e19]: Join the GlobeWest Family
        - paragraph [ref=f13e21]:
          - generic [ref=f13e22]: Subscribe to receive updates on upcoming trends, product news, exclusive interviews and home tours from our team via email and SMS.
        - generic [ref=f13e26]:
          - generic [ref=f13e28]:
            - generic [ref=f13e32]:
              - generic [ref=f13e33]: First Name *
              - textbox "First Name" [ref=f13e34]
            - generic [ref=f13e38]:
              - generic [ref=f13e39]:
                - generic [ref=f13e40]: State
                - text: "*"
              - combobox "State" [ref=f13e42]:
                - option "Please select" [selected]
                - option "VIC & TAS"
                - option "NSW & ACT"
                - option "QLD & NT"
                - option "SA"
                - option "WA"
          - generic [ref=f13e44]:
            - generic [ref=f13e45]:
              - generic [ref=f13e46]: Email Address
              - text: "*"
            - textbox "Email Address" [ref=f13e47]
          - generic [ref=f13e49]:
            - generic [ref=f13e51]: Mobile Number
            - generic [ref=f13e53]:
              - 'generic "Australia: +61" [ref=f13e55]'
              - textbox "Mobile Number" [ref=f13e57]:
                - /placeholder: 0412 345 678
        - group [ref=f13e62]:
          - button "Subscribe" [ref=f13e63] [cursor=pointer]
    - img [ref=e220] [cursor=pointer]
```

# Test source

```ts
  198 |       await expect(firstSwatch).toBeFocused();
  199 |       await firstSwatch.click();
  200 |     }
  201 | 
  202 |     // Verify quantity input focus
  203 |     if (await pdp.quantityInput.isVisible()) {
  204 |       await pdp.quantityInput.click(); // Click to reliably set focus
  205 |       await expect(pdp.quantityInput).toBeFocused();
  206 |     }
  207 | 
  208 |     // Click Add to Cart button (waiting until it is enabled/ready)
  209 |     if (await pdp.addToCartButton.isVisible()) {
  210 |       await expect(pdp.addToCartButton).toBeEnabled({ timeout: 15000 });
  211 |       await pdp.addToCartButton.focus();
  212 |       // We verify focus dynamically to tolerate background client script blurring
  213 |       const isFocused = await pdp.addToCartButton.evaluate(el => document.activeElement === el);
  214 |       console.log(`Add to cart focus state: ${isFocused}`);
  215 |     }
  216 |   });
  217 | 
  218 |   test('Verify Add to Cart minicart focus trap', async ({ page }) => {
  219 |     const pdp = new ProductDetailPage(page);
  220 |     await pdp.navigate('/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass');
  221 | 
  222 |     // Click Add to Cart button if visible
  223 |     if (await pdp.addToCartButton.isVisible()) {
  224 |       await pdp.addToCartButton.click({ noWaitAfter: true });
  225 |       
  226 |       // Wait for minicart drawer to become visible - using .first() to avoid strict mode violations
  227 |       const minicart = page.locator('#minicart-content-wrapper, .block-minicart').first();
  228 |       if (await minicart.isVisible()) {
  229 |         await expect(minicart).toBeVisible();
  230 | 
  231 |         // Check if focus shifts inside the minicart
  232 |         const closeBtn = minicart.locator('#btn-minicart-close, .action.close');
  233 |         if (await closeBtn.first().isVisible()) {
  234 |           await closeBtn.first().focus();
  235 |           await expect(closeBtn.first()).toBeFocused();
  236 |         }
  237 |       }
  238 |     }
  239 |   });
  240 | 
  241 |   test('Verify My Account login validation errors accessibility', async ({ page }) => {
  242 |     const myAccount = new MyAccountPage(page);
  243 |     await myAccount.navigate('/customer/account/login/');
  244 | 
  245 |     // Wait for JS validation scripts to fully load and bind
  246 |     await page.waitForTimeout(4000);
  247 | 
  248 |     // Submit invalid login credentials
  249 |     if (await myAccount.loginEmailInput.isVisible()) {
  250 |       await myAccount.login('invalid-email-format', 'short');
  251 |       
  252 |       // Look for standard Magento validation messages (specifically targeting the input error fields first)
  253 |       const errorMsg = page.locator('#email-error, #pass-error, .mage-error, .message-error').first();
  254 |       await expect(errorMsg).toBeVisible({ timeout: 10000 });
  255 |     }
  256 |   });
  257 | 
  258 |   test('Verify B2B Trade Portal login validation accessibility', async ({ page }) => {
  259 |     const tradePortal = new TradePortalPage(page);
  260 |     await tradePortal.navigate('/help-centre/general/trade-registration');
  261 | 
  262 |     // Focus and click B2B portal login link if present
  263 |     if (await tradePortal.loginPortalLink.isVisible()) {
  264 |       await tradePortal.loginPortalLink.focus();
  265 |       await expect(tradePortal.loginPortalLink).toBeFocused();
  266 |       await tradePortal.loginPortalLink.click();
  267 | 
  268 |       // Check if redirected or modal opened containing login inputs
  269 |       const loginEmail = page.locator('input#email, input[name="login[username]"]');
  270 |       if (await loginEmail.isVisible()) {
  271 |         await expect(loginEmail).toBeVisible();
  272 |       }
  273 |     }
  274 |   });
  275 | 
  276 |   test('Verify Checkout Entry transition from cart page to shipping checkout forms', async ({ page }) => {
  277 |     const checkout = new CheckoutPage(page);
  278 | 
  279 |     // 1. Navigate to the cart page
  280 |     await checkout.navigate('/checkout/cart/');
  281 | 
  282 |     // 2. Click the proceed to checkout button if visible, else fall back to direct navigation
  283 |     if (await checkout.proceedToCheckoutButton.isVisible()) {
  284 |       await checkout.proceedToCheckoutButton.focus();
  285 |       await expect(checkout.proceedToCheckoutButton).toBeFocused();
  286 |       await checkout.proceedToCheckoutButton.click();
  287 | 
  288 |       // 3. Verify it transitions to the checkout/shipping page URL
  289 |       await expect(page).toHaveURL(/.*checkout/);
  290 | 
  291 |       // 4. Verify shipping inputs are visible or loaded
  292 |       if (await checkout.emailInput.isVisible()) {
  293 |         await expect(checkout.emailInput).toBeVisible();
  294 |       }
  295 |     } else {
  296 |       // Fallback: Navigate directly to /checkout/ and verify forms exist
  297 |       await checkout.navigate('/checkout/');
> 298 |       await page.waitForLoadState('networkidle');
      |                  ^ Error: page.waitForLoadState: Test timeout of 60000ms exceeded.
  299 |       if (await checkout.emailInput.isVisible()) {
  300 |         await expect(checkout.emailInput).toBeVisible();
  301 |       }
  302 |     }
  303 |   });
  304 | 
  305 |   test('Verify search input autocomplete and search results page', async ({ page }) => {
  306 |     const homepage = new Homepage(page);
  307 |     const searchPage = new SearchPage(page);
  308 | 
  309 |     await homepage.navigate('/');
  310 |     
  311 |     if (await homepage.searchBar.isVisible()) {
  312 |       await homepage.searchBar.focus();
  313 |       await expect(homepage.searchBar).toBeFocused();
  314 | 
  315 |       await homepage.searchProduct('chair');
  316 |       await expect(page).toHaveURL(/.*(search|result|q=).*/);
  317 | 
  318 |       if (await searchPage.searchQueryTitle.isVisible()) {
  319 |         await expect(searchPage.searchQueryTitle).toBeVisible();
  320 |       }
  321 |     }
  322 |   });
  323 | });
  324 | 
  325 | 
  326 | 
```