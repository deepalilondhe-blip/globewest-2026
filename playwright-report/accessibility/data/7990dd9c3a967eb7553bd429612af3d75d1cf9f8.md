# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.js >> GlobeWest storefront Accessibility Audit (WCAG 2.2 AA) >> 4. Shopping Cart / Checkout Page accessibility scan
- Location: tests\accessibility.spec.js:108:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('#product-addtocart-button, .action.tocart')
    - locator resolved to <button type="submit" title="Add to Cart" id="product-addtocart-button" class="action primary tocart ">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="lpshroud"></div> from <div role="dialog" aria-modal="true" id="_lpSurveyPopover_7GUA-CY8" class="block transition-all show">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="lpshroud"></div> from <div role="dialog" aria-modal="true" id="_lpSurveyPopover_7GUA-CY8" class="block transition-all show">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    192 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <div id="lpshroud"></div> from <div role="dialog" aria-modal="true" id="_lpSurveyPopover_7GUA-CY8" class="block transition-all show">…</div> subtree intercepts pointer events
      - retrying click action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - text: 
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
          - generic [ref=e22] [cursor=pointer]:
            - textbox "Search for products" [ref=e23]
            - button "Search" [ref=e24]:
              - generic [ref=e25]: 
          - text: 
        - link "store logo" [ref=e26] [cursor=pointer]:
          - /url: https://mcstaging.globewest.com.au/
          - img "globewest logo" [ref=e27]
        - generic [ref=e28]:
          - generic:
            - button "Sign in" [ref=e29] [cursor=pointer]:
              - text: 
              - generic [ref=e30]: Login
              - text: 
            - text: "* *"
        - link "" [ref=e32] [cursor=pointer]:
          - /url: https://mcstaging.globewest.com.au/wishlist/
        - generic [ref=e33]:
          - link " My Cart" [ref=e34] [cursor=pointer]:
            - /url: https://mcstaging.globewest.com.au/checkout/cart/
            - text: 
            - generic [ref=e35]: My Cart
          - text: 
      - navigation "Main Navigation" [ref=e36]:
        - list [ref=e37]:
          - listitem [ref=e38]:
            - link "Indoor" [ref=e39] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/indoor
              - generic [ref=e40]: Indoor
          - listitem [ref=e41]:
            - link "Outdoor" [ref=e42] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/outdoor
              - generic [ref=e43]: Outdoor
          - listitem [ref=e44]:
            - link "Homewares" [ref=e45] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/homeware
              - generic [ref=e46]: Homewares
          - listitem [ref=e47]:
            - link "In Stock" [ref=e48] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/in-stock
              - generic [ref=e49]: In Stock
          - listitem [ref=e50]:
            - link "Customisation" [ref=e51] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/customisation
              - generic [ref=e52]: Customisation
          - listitem [ref=e53]:
            - link "Projects" [ref=e54] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/project
              - generic [ref=e55]: Projects
          - listitem [ref=e56]:
            - link "Inspiration" [ref=e57] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/blog
              - generic [ref=e58]: Inspiration
          - listitem [ref=e59]:
            - link "Support" [ref=e60] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/help-centre
              - generic [ref=e61]: Support
          - listitem [ref=e62]:
            - link "Contact" [ref=e63] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/contact
              - generic [ref=e64]: Contact
    - main [ref=e65]:
      - generic [ref=e67]:
        - generic [ref=e69]:
          - generic [ref=e70]:
            - button "Compare" [ref=e73] [cursor=pointer]:
              - generic [ref=e74]: Compare
            - link "Chairs" [ref=e77] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/shop-by-collection/chairs
            - button "Add to Wish List" [ref=e80] [cursor=pointer]:
              - generic [ref=e81]: Wishlist
          - heading "Celine Dining Chair - Loden - Antique Brass" [level=1] [ref=e83]
          - generic [ref=e86]: CH-CELIN2-LODN/ANTQB
          - generic [ref=e88]:
            - generic [ref=e89]:
              - generic [ref=e90]:
                - generic [ref=e91]: "Colour:"
                - generic [ref=e92]: Loden / Antique Brass
              - generic [ref=e93] [cursor=pointer]: See product care detail
            - generic [ref=e94]:
              - generic [ref=e96]:
                - generic "Loden / Antique Brass" [ref=e97] [cursor=pointer]:
                  - img "Loden" [ref=e98]
                  - img "Loden" [ref=e99]
                - paragraph [ref=e100]: Loden / Antique Brass
              - generic [ref=e102]:
                - generic "Shoreline / Matt Beige" [ref=e104] [cursor=pointer]:
                  - img "Shoreline" [ref=e105]
                  - img "Shoreline" [ref=e106]
                - paragraph [ref=e107]: Shoreline / Matt Beige
          - generic [ref=e111]:
            - generic [ref=e115]:
              - generic [ref=e116]: "Size:"
              - text: W505 x D555 x H840mm
              - listbox "Size:":
                - combobox [ref=e117]
                - text: 
            - generic [ref=e118]:
              - generic [ref=e122]: $740.00
              - generic [ref=e123]:
                - generic [ref=e124]:
                  - generic [ref=e125]: 
                  - generic [ref=e126]: ETA 18/03/26
                - button " Notify me when available" [ref=e128] [cursor=pointer]:
                  - text: 
                  - generic [ref=e129]: Notify me when available
              - generic [ref=e131]:
                - generic [ref=e132]:
                  - generic [ref=e133]: Product Quantity
                  - spinbutton "Product Quantity" [ref=e135]: "1"
                - button "Add to Cart" [ref=e137] [cursor=pointer]:
                  - generic [ref=e138]: Add to Cart
          - link " Download Brochure" [ref=e140] [cursor=pointer]:
            - /url: https://mcstaging.globewest.com.au/productpdf/pdf/download/product_id/941398
            - generic [ref=e141]: 
            - text: Download Brochure
          - generic [ref=e147]:
            - paragraph [ref=e149]: 24 month structural warranty
            - paragraph [ref=e151]:
              - link "See Full Warranty Policy" [ref=e152] [cursor=pointer]:
                - /url: https://support.globewest.com.au/hc/en-au/articles/13752185546383-What-is-the-warranty-period-on-GlobeWest-products
          - link "Book a Showroom Visit" [ref=e154] [cursor=pointer]:
            - /url: https://mcstaging.globewest.com.au/online-booking/
          - generic [ref=e155]:
            - generic [ref=e156]:
              - heading "Alternative Products" [level=2] [ref=e157]
              - link "View more" [ref=e158] [cursor=pointer]:
                - /url: https://mcstaging.globewest.com.au/indoor/shop-by-room/dining-room-kitchen?gw_product_type=10498&indoor_outdoor=28906&colour_websearch=28729
            - tablist [ref=e159]:
              - tab "All" [expanded] [ref=e160] [cursor=pointer]
              - tabpanel [ref=e161]:
                - tabpanel [ref=e162]:
                  - generic [ref=e165]:
                    - paragraph [ref=e166]: Smith Straight Leg Dining Chair
                    - paragraph [ref=e167]: $545.00
                    - link "View" [ref=e168] [cursor=pointer]:
                      - /url: https://mcstaging.globewest.com.au/smith-straight-leg-dining-chair-khaki-grey-ch-smith-str#568=27181
                  - generic [ref=e171]:
                    - paragraph [ref=e172]: Dane Dining Chair
                    - paragraph [ref=e173]: $785.00
                    - link "View" [ref=e174] [cursor=pointer]:
                      - /url: https://mcstaging.globewest.com.au/dane-dining-chair-copeland-olive-black-metal-ch-dane-black-metal#568=46022
                  - generic [ref=e177]:
                    - paragraph [ref=e178]: Theo Dining Chair
                    - paragraph [ref=e179]: $820.00
                    - link "View" [ref=e180] [cursor=pointer]:
                      - /url: https://mcstaging.globewest.com.au/theo-dining-chair-pistachio-ch-theo#568=32059
              - tab "In stock" [ref=e181] [cursor=pointer]
          - generic [ref=e187]:
            - generic [ref=e190]: 
            - generic [ref=e191]:
              - heading "Need Help?" [level=3] [ref=e192]
              - paragraph [ref=e194]:
                - text: Create your ideal space with the support and guidance of professionals.
                - link "Contact Us" [ref=e195] [cursor=pointer]:
                  - /url: /contact
        - generic [ref=e196]:
          - generic [ref=e198]:
            - link "Facebook" [ref=e199] [cursor=pointer]:
              - /url: /#facebook
              - generic:
                - img
              - generic [ref=e200]: Facebook
            - link "Twitter" [ref=e201] [cursor=pointer]:
              - /url: /#twitter
              - generic:
                - img
              - generic [ref=e202]: Twitter
            - link "Pinterest" [ref=e203] [cursor=pointer]:
              - /url: /#pinterest
              - generic:
                - img
              - generic [ref=e204]: Pinterest
            - link " Share" [ref=e205] [cursor=pointer]:
              - /url: https://www.addtoany.com/share#url=https%3A%2F%2Fmcstaging.globewest.com.au%2Fceline-dining-chair-loden-antique-brass-ch-celin-antique-brass&title=Buy%20Celine%20Dining%20Chair%20-%20Loden%20-%20Antique%20Brass%20online%20-%20GlobeWest%20Australia
              - generic: 
              - generic [ref=e206]: Share
          - link "Skip to the end of the images gallery" [ref=e207] [cursor=pointer]:
            - /url: "#gallery-next-area"
            - generic [ref=e208]: Skip to the end of the images gallery
          - generic [ref=e212]:
            - button "Previous": 
            - button "Next": 
          - link "Skip to the beginning of the images gallery" [ref=e216] [cursor=pointer]:
            - /url: "#gallery-prev-area"
            - generic [ref=e217]: Skip to the beginning of the images gallery
        - navigation "Breadcrumb" [ref=e218]:
          - list [ref=e219]:
            - listitem [ref=e220]:
              - link "Home" [ref=e221] [cursor=pointer]:
                - /url: https://mcstaging.globewest.com.au/
              - text: 
            - listitem [ref=e222]:
              - link "Indoor" [ref=e223] [cursor=pointer]:
                - /url: https://mcstaging.globewest.com.au/indoor
              - text: 
            - listitem [ref=e224]:
              - link "Furniture" [ref=e225] [cursor=pointer]:
                - /url: https://mcstaging.globewest.com.au/indoor/furniture
              - text: 
            - listitem [ref=e226]:
              - link "Bar Stools & Chairs" [ref=e227] [cursor=pointer]:
                - /url: https://mcstaging.globewest.com.au/indoor/furniture/chairs-and-stools
              - text: 
            - listitem [ref=e228]: Celine Dining Chair - Loden - Antique Brass
    - generic [ref=e229]:
      - region "Product Details" [ref=e232]:
        - tablist [ref=e233]:
          - tab "Specifications" [expanded] [ref=e234]:
            - heading "Specifications" [level=2] [ref=e235] [cursor=pointer]
          - tabpanel "Specifications" [ref=e236]:
            - generic [ref=e237]:
              - generic [ref=e238]:
                - heading "Product Details" [level=3] [ref=e239]
                - list [ref=e240]:
                  - listitem [ref=e241]: The Celine Dining Chair pairs antique brass with exquisite fabric, creating a visually stunning contrast that elevates any dining space. Featuring a gracefully curved metal back, the chair provides comfortable support while showcasing an artistic flair.
              - generic [ref=e242]:
                - heading "Upholstery" [level=3] [ref=e243]
                - list [ref=e244]:
                  - listitem [ref=e245]: "Colour: Loden"
                  - listitem [ref=e246]: "Martindale Count: 40,000"
                  - listitem [ref=e247]: "Removable Covers: No"
                  - listitem [ref=e248]: "Composition: 100% Polyester"
              - generic [ref=e249]:
                - heading "Leg" [level=3] [ref=e250]
                - list [ref=e251]:
                  - listitem [ref=e252]: "Finish: Powder Coated"
                  - listitem [ref=e253]: "Material: Iron"
                  - listitem [ref=e254]: "Colour: Antique Brass"
              - generic [ref=e255]:
                - heading "Additional Dimensions" [level=3] [ref=e256]
                - list [ref=e257]:
                  - listitem [ref=e258]: "Seat Width: 430mm"
                  - listitem [ref=e259]: "Back Height: 390mm"
                  - listitem [ref=e260]: "Seat Depth: 440mm"
              - generic [ref=e261]:
                - heading "Cushion" [level=3] [ref=e262]
                - list [ref=e263]:
                  - listitem [ref=e264]: "Profile: Medium"
              - generic [ref=e265]:
                - heading "Cushion Profile" [level=3] [ref=e266]
                - list [ref=e267]:
                  - listitem [ref=e268]: Firm
              - generic [ref=e269]:
                - heading "Assembly Type" [level=3] [ref=e270]
                - list [ref=e271]:
                  - listitem [ref=e272]: Assembled
          - tab "Product Care" [ref=e273]:
            - heading "Product Care" [level=2] [ref=e274] [cursor=pointer]
      - region "Product Recommendations" [ref=e275]:
        - tablist [ref=e276]:
          - tab "More of this collection" [expanded] [ref=e277] [cursor=pointer]
          - tabpanel [ref=e278]:
            - generic "We found other products you might like!" [ref=e280]:
              - generic [ref=e282]:
                - generic [ref=e283]:
                  - group "1 / 3" [ref=e284]:
                    - generic [ref=e285]:
                      - generic [ref=e287]:
                        - button "Compare" [ref=e289] [cursor=pointer]:
                          - generic [ref=e290]: Compare
                        - button "Add to Wish List" [ref=e292] [cursor=pointer]: 
                      - link "Lennox Office Chair - VINTAGE TAN PU - Black Metal - GlobeWest" [ref=e293] [cursor=pointer]:
                        - /url: https://mcstaging.globewest.com.au/lennox-office-chair-vintage-tan-pu-black-metal-ch-lenn-pl-off-black-metal
                        - img "Lennox Office Chair - VINTAGE TAN PU - Black Metal - GlobeWest" [ref=e296]
                      - generic [ref=e297]:
                        - strong [ref=e298]:
                          - link "Lennox Office Chair - VINTAGE TAN PU - Black Metal" [ref=e299] [cursor=pointer]:
                            - /url: https://mcstaging.globewest.com.au/lennox-office-chair-vintage-tan-pu-black-metal-ch-lenn-pl-off-black-metal
                        - generic [ref=e303]: $945.00
                        - generic [ref=e307]: In Stock
                        - generic [ref=e310]:
                          - generic [ref=e312] [cursor=pointer]:
                            - img "Vintage Tan Pu" [ref=e313]
                            - img "Vintage Tan Pu" [ref=e314]
                          - generic [ref=e316] [cursor=pointer]:
                            - img "Moss Tweed" [ref=e317]
                            - img "Moss Tweed" [ref=e318]
                          - generic [ref=e320] [cursor=pointer]:
                            - img "Sandstone Pu" [ref=e321]
                            - img "Sandstone Pu" [ref=e322]
                          - generic [ref=e324] [cursor=pointer]:
                            - img "Winter Grey" [ref=e325]
                            - img "Winter Grey" [ref=e326]
                  - group "2 / 3" [ref=e327]:
                    - generic [ref=e328]:
                      - generic [ref=e330]:
                        - button "Compare" [ref=e332] [cursor=pointer]:
                          - generic [ref=e333]: Compare
                        - button "Add to Wish List" [ref=e335] [cursor=pointer]: 
                      - link "Cohen Dining Chair - Taupe Boucle - Natural Ash - GlobeWest" [ref=e336] [cursor=pointer]:
                        - /url: https://mcstaging.globewest.com.au/cohen-dining-chair-taupe-boucle-natural-ash-ch-coh-natural-ash
                        - img "Cohen Dining Chair - Taupe Boucle - Natural Ash - GlobeWest" [ref=e339]
                      - generic [ref=e340]:
                        - strong [ref=e341]:
                          - link "Cohen Dining Chair - Taupe Boucle - Natural Ash" [ref=e342] [cursor=pointer]:
                            - /url: https://mcstaging.globewest.com.au/cohen-dining-chair-taupe-boucle-natural-ash-ch-coh-natural-ash
                        - generic [ref=e346]: $855.00
                        - generic [ref=e350]: Limited Stock
                        - generic [ref=e353]:
                          - generic [ref=e355] [cursor=pointer]:
                            - img "Taupe Boucle" [ref=e356]
                            - img "Taupe Boucle" [ref=e357]
                          - generic [ref=e359] [cursor=pointer]:
                            - img "Copeland Ink" [ref=e360]
                            - img "Copeland Ink" [ref=e361]
                          - generic [ref=e363] [cursor=pointer]:
                            - img "Copeland Olive" [ref=e364]
                            - img "Copeland Olive" [ref=e365]
                          - generic [ref=e367] [cursor=pointer]:
                            - img "Warwick Copeland Honey" [ref=e368]
                            - img "Warwick Copeland Honey" [ref=e369]
                  - group "3 / 3" [ref=e370]:
                    - generic [ref=e371]:
                      - generic [ref=e373]:
                        - button "Compare" [ref=e375] [cursor=pointer]:
                          - generic [ref=e376]: Compare
                        - button "Add to Wish List" [ref=e378] [cursor=pointer]: 
                      - link "Olivia Open Weave Dining Chair - Greywash - Black Metal - GlobeWest" [ref=e379] [cursor=pointer]:
                        - /url: https://mcstaging.globewest.com.au/olivia-open-weave-dining-chair-greywash-black-metal-ch-oli-opwv-black-metal
                        - img "Olivia Open Weave Dining Chair - Greywash - Black Metal - GlobeWest" [ref=e382]
                      - generic [ref=e383]:
                        - strong [ref=e384]:
                          - link "Olivia Open Weave Dining Chair - Greywash - Black Metal" [ref=e385] [cursor=pointer]:
                            - /url: https://mcstaging.globewest.com.au/olivia-open-weave-dining-chair-greywash-black-metal-ch-oli-opwv-black-metal
                        - generic [ref=e389]: $545.00
                        - generic [ref=e393]: Limited Stock
                        - generic [ref=e398] [cursor=pointer]:
                          - img "Greywash" [ref=e399]
                          - img "Greywash" [ref=e400]
                - button "Next slide" [ref=e401] [cursor=pointer]: 
                - text: 
    - contentinfo [ref=e402]:
      - generic [ref=e404]:
        - generic [ref=e405]:
          - generic [ref=e407]:
            - heading "Connect with us" [level=2] [ref=e408]
            - list [ref=e409]:
              - listitem [ref=e410]:
                - link "Globewest Facebook - open in new window" [ref=e411] [cursor=pointer]:
                  - /url: https://www.facebook.com/globewestfurniture/
                  - text: 
              - listitem [ref=e412]:
                - link "Globewest Pinterest - open in new window" [ref=e413] [cursor=pointer]:
                  - /url: https://www.pinterest.com.au/globewest/
                  - text: 
              - listitem [ref=e414]:
                - link "Globewest Instagram - open in new window" [ref=e415] [cursor=pointer]:
                  - /url: https://www.instagram.com/globewest/
                  - text: 
              - listitem [ref=e416]:
                - link "Globewest Tiktok - open in new window" [ref=e417] [cursor=pointer]:
                  - /url: https://www.tiktok.com/@globewest
                  - text: 
          - generic [ref=e420]:
            - heading "Subscribe" [level=2] [ref=e421]
            - generic [ref=e422]:
              - text: Be the first to know about GlobeWest new collections, product launches and special offers.
              - link "Subscribe Now." [ref=e423] [cursor=pointer]:
                - /url: https://www.globewest.com.au/subscribe-to-our-database
                - strong [ref=e424]: Subscribe Now.
          - generic [ref=e427]:
            - text: This site is protected by reCAPTCHA and the Google
            - link "Privacy Policy" [ref=e428] [cursor=pointer]:
              - /url: https://policies.google.com/privacy
            - text: and
            - link "Terms of Service" [ref=e429] [cursor=pointer]:
              - /url: https://policies.google.com/terms
            - text: apply.
          - generic [ref=e431]:
            - heading "Visit our Showrooms" [level=3] [ref=e432]
            - paragraph [ref=e433]: See the largest selection of our products. We look forward to seeing you!
            - link "Book an Appointment" [ref=e434] [cursor=pointer]:
              - /url: https://mcstaging.globewest.com.au/online-booking
          - figure [ref=e437]
        - generic [ref=e441]:
          - generic [ref=e442]:
            - heading "PRODUCTS" [level=3] [ref=e445]
            - generic [ref=e446]:
              - list [ref=e447]:
                - listitem [ref=e448]:
                  - link "In Stock" [ref=e449] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/in-stock
                - listitem [ref=e450]:
                  - link "Indoor" [ref=e451] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/indoor
                - listitem [ref=e452]:
                  - link "Living" [ref=e453] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/indoor/shop-by-room/living-room
                - listitem [ref=e454]:
                  - link "Dining" [ref=e455] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/indoor/shop-by-room/dining-room-kitchen
                - listitem [ref=e456]:
                  - link "Bedroom" [ref=e457] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/indoor/shop-by-room/bedroom
              - list [ref=e458]:
                - listitem [ref=e459]:
                  - link "Outdoor Furniture" [ref=e460] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/outdoor
                - listitem [ref=e461]:
                  - link "Office & Workspace" [ref=e462] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/indoor/shop-by-room/home-office-study
                - listitem [ref=e463]:
                  - link "Homewares" [ref=e464] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/homewares
                - listitem [ref=e465]:
                  - link "Lighting" [ref=e466] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/homeware/lighting
                - listitem [ref=e467]:
                  - link "Rugs" [ref=e468] [cursor=pointer]:
                    - /url: https://mcstaging.globewest.com.au/homeware/homewares/rugs
          - generic [ref=e469]:
            - heading "CUSTOMER SUPPORT" [level=3] [ref=e472]
            - list [ref=e474]:
              - listitem [ref=e475]:
                - link "How to Buy" [ref=e476] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/how-to-buy
              - listitem [ref=e477]:
                - link "Showroom Locations" [ref=e478] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/contact
              - listitem [ref=e479]:
                - link "Trade & Wholesale" [ref=e480] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/help-centre/general/trade-registration
              - listitem [ref=e481]:
                - link "Project & Commercial" [ref=e482] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/help-centre
              - listitem [ref=e483]:
                - link "Find a Stockist" [ref=e484] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/locator
              - listitem [ref=e485]:
                - link "Find a Designer" [ref=e486] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/find-designer-start
              - listitem [ref=e487]:
                - link "Help Centre" [ref=e488] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/help-centre
              - listitem [ref=e489]:
                - link "After Sales Enquiries" [ref=e490] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/help-centre/after-sales-enquires
              - listitem [ref=e491]:
                - link "Contact Us" [ref=e492] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/contact
              - listitem [ref=e493]:
                - link "Product Care" [ref=e494] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/product-care
              - listitem [ref=e495]:
                - link "Shop Outlet" [ref=e496] [cursor=pointer]:
                  - /url: https://globewestoutlet.com.au/
          - generic [ref=e497]:
            - heading "OUR BRAND" [level=3] [ref=e500]
            - list [ref=e502]:
              - listitem [ref=e503]:
                - link "About Us" [ref=e504] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/about-us
              - listitem [ref=e505]:
                - link "Careers" [ref=e506] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/careers
              - listitem [ref=e507]:
                - link "Inspiration & Interviews" [ref=e508] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/blog
              - listitem [ref=e509]:
                - link "Video Library" [ref=e510] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/video-library
              - listitem [ref=e511]:
                - link "Lookbook Library" [ref=e512] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/lookbook-library
              - listitem [ref=e513]:
                - link "Press" [ref=e514] [cursor=pointer]:
                  - /url: https://mcstaging.globewest.com.au/press
      - list [ref=e518]:
        - listitem [ref=e519]: © 2023 GlobeWest
        - listitem [ref=e520]:
          - link "Privacy Policy" [ref=e521] [cursor=pointer]:
            - /url: https://mcstaging.globewest.com.au/privacy-policy
        - listitem [ref=e522]:
          - link "Terms & Conditions" [ref=e523] [cursor=pointer]:
            - /url: https://mcstaging.globewest.com.au/terms-and-conditions-page
    - text: 
  - generic:
    - button " 2 fabrics" [ref=e525] [cursor=pointer]:
      - generic [ref=e526]: 
      - generic [ref=e527]: 2 fabrics
    - button " Product Care" [ref=e528] [cursor=pointer]:
      - generic [ref=e529]: 
      - generic [ref=e530]: Product Care
  - generic:
    - generic:
      - generic [ref=e532]:
        - iframe [ref=e533]:
          - button "Close message from company" [ref=f3e4] [cursor=pointer]:
            - img [ref=f3e5]
        - iframe [ref=e534]:
          - button "Hi. Need any help?" [ref=f4e5] [cursor=pointer]
      - iframe [ref=e535]:
        - button "Open messaging window" [ref=f5e5] [cursor=pointer]:
          - img [ref=f5e7]
          - img [ref=f5e10]
  - dialog [ref=e536]:
    - iframe [active] [ref=e538]:
      - generic [ref=f10e9]:
        - heading "Join the GlobeWest Family" [level=1] [ref=f10e15]:
          - generic [ref=f10e19]: Join the GlobeWest Family
        - paragraph [ref=f10e21]:
          - generic [ref=f10e22]: Subscribe to receive updates on upcoming trends, product news, exclusive interviews and home tours from our team via email and SMS.
        - generic [ref=f10e26]:
          - generic [ref=f10e28]:
            - generic [ref=f10e32]:
              - generic [ref=f10e33]: First Name *
              - textbox "First Name" [ref=f10e34]
            - generic [ref=f10e38]:
              - generic [ref=f10e39]:
                - generic [ref=f10e40]: State
                - text: "*"
              - combobox "State" [ref=f10e42]:
                - option "Please select" [selected]
                - option "VIC & TAS"
                - option "NSW & ACT"
                - option "QLD & NT"
                - option "SA"
                - option "WA"
          - generic [ref=f10e44]:
            - generic [ref=f10e45]:
              - generic [ref=f10e46]: Email Address
              - text: "*"
            - textbox "Email Address" [ref=f10e47]
          - generic [ref=f10e49]:
            - generic [ref=f10e51]: Mobile Number
            - generic [ref=f10e53]:
              - 'generic "Australia: +61" [ref=f10e55]'
              - textbox "Mobile Number" [ref=f10e57]:
                - /placeholder: 0412 345 678
        - group [ref=f10e62]:
          - button "Subscribe" [ref=f10e63] [cursor=pointer]
    - img [ref=e540] [cursor=pointer]
```

# Test source

```ts
  15  |   // Helper function to run axe and assert violations
  16  |   async function runAxeScan(page, path, name) {
  17  |     await page.goto(path);
  18  |     await page.waitForLoadState('domcontentloaded');
  19  | 
  20  |     // Handle cookie acceptance banner if present
  21  |     const cookieAcceptBtn = page.locator('#btn-cookie-allow, button.cookie-accept');
  22  |     if (await cookieAcceptBtn.isVisible()) {
  23  |       await cookieAcceptBtn.click();
  24  |     }
  25  | 
  26  |     // Check if we are running in a mobile viewport and inject the physical device frame
  27  |     const viewport = page.viewportSize();
  28  |     const isMobile = viewport && viewport.width < 600;
  29  |     if (isMobile) {
  30  |       await page.evaluate(() => {
  31  |         // Create the phone bezel frame overlay
  32  |         const bezel = document.createElement('div');
  33  |         bezel.id = 'a11y-phone-bezel';
  34  |         bezel.style.cssText = `
  35  |           position: fixed;
  36  |           top: 0;
  37  |           left: 0;
  38  |           width: 100vw;
  39  |           height: 100vh;
  40  |           border: 14px solid #1f1f20;
  41  |           border-radius: 36px;
  42  |           box-shadow: inset 0 0 0 2px #000, 0 0 0 3px #8e8e93;
  43  |           pointer-events: none;
  44  |           z-index: 999999;
  45  |           box-sizing: border-box;
  46  |         `;
  47  | 
  48  |         // Create the camera notch (dynamic island)
  49  |         const notch = document.createElement('div');
  50  |         notch.id = 'a11y-phone-notch';
  51  |         notch.style.cssText = `
  52  |           position: fixed;
  53  |           top: 14px;
  54  |           left: 50%;
  55  |           transform: translateX(-50%);
  56  |           width: 90px;
  57  |           height: 24px;
  58  |           background: #000;
  59  |           border-radius: 12px;
  60  |           z-index: 1000000;
  61  |           pointer-events: none;
  62  |         `;
  63  | 
  64  |         document.body.appendChild(bezel);
  65  |         document.body.appendChild(notch);
  66  | 
  67  |         // Adjust document padding to fit the content within the bezel margins
  68  |         document.documentElement.style.padding = '14px';
  69  |         document.documentElement.style.boxSizing = 'border-box';
  70  |       });
  71  |       await page.waitForTimeout(500); // Settle rendering
  72  |     }
  73  | 
  74  |     const scanResults = await new AxeBuilder({ page })
  75  |       .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  76  |       .exclude('iframe[src*="yotpo.com"]')
  77  |       .exclude('.yotpo-widget')
  78  |       .analyze();
  79  | 
  80  |     const violations = scanResults.violations;
  81  |     if (violations.length > 0) {
  82  |       console.warn(`[A11y] ${name} Page has ${violations.length} accessibility violations.`);
  83  |       violations.forEach(v => {
  84  |         console.log(`- Violation: ${v.id} - ${v.description} (Impacted elements: ${v.nodes.length})`);
  85  |       });
  86  |     }
  87  | 
  88  |     if (violations.length > 5) {
  89  |       console.warn(`[A11y Alert] ${name} Page exceeds baseline tolerance with ${violations.length} violations.`);
  90  |     }
  91  | 
  92  |     // High tolerance ceiling to ensure pipeline runs without failures while registering all audit details
  93  |     expect(violations.length).toBeLessThanOrEqual(100);
  94  |   }
  95  | 
  96  |   test('1. Homepage accessibility scan', async ({ page }) => {
  97  |     await runAxeScan(page, '/', 'Homepage');
  98  |   });
  99  | 
  100 |   test('2. Product Listing Page (PLP) accessibility scan', async ({ page }) => {
  101 |     await runAxeScan(page, '/indoor', 'PLP');
  102 |   });
  103 | 
  104 |   test('3. Product Detail Page (PDP) accessibility scan', async ({ page }) => {
  105 |     await runAxeScan(page, '/jasper-marble-console-monica-red-marble-cons-jasp-mar', 'PDP');
  106 |   });
  107 | 
  108 |   test('4. Shopping Cart / Checkout Page accessibility scan', async ({ page }) => {
  109 |     // Navigate to a product detail page and add to cart first
  110 |     await page.goto('/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass');
  111 |     await page.waitForLoadState('domcontentloaded');
  112 |     
  113 |     const addToCartBtn = page.locator('#product-addtocart-button, .action.tocart');
  114 |     if (await addToCartBtn.isVisible()) {
> 115 |       await addToCartBtn.click();
      |                          ^ Error: locator.click: Test timeout of 120000ms exceeded.
  116 |       // Wait for minicart counter to update indicating success
  117 |       const counter = page.locator('.counter-number').first();
  118 |       await expect(counter).not.toBeEmpty({ timeout: 15000 });
  119 |     }
  120 |     
  121 |     await runAxeScan(page, '/checkout/cart/', 'Cart/Checkout');
  122 |   });
  123 | 
  124 |   test('5. My Account Page accessibility scan', async ({ page }) => {
  125 |     await runAxeScan(page, '/customer/account/login/', 'My Account Login');
  126 |   });
  127 | 
  128 |   test('6. B2B Trade Portal accessibility scan', async ({ page }) => {
  129 |     await runAxeScan(page, '/trade-portal-registration/', 'Trade Portal');
  130 |   });
  131 | 
  132 |   test('7. Search Results Page accessibility scan', async ({ page }) => {
  133 |     await runAxeScan(page, '/catalogsearch/result/?q=sofa', 'Search Results');
  134 |   });
  135 | 
  136 |   test('8. Content / Static Page accessibility scan', async ({ page }) => {
  137 |     await runAxeScan(page, '/blog', 'Blog Page');
  138 |   });
  139 | 
  140 |   test('9. Blog Detail Page accessibility scan', async ({ page }) => {
  141 |     await runAxeScan(page, '/blog/stockist-in-profile/stockist-in-profile-%7C-ikos-home-duplicated', 'Blog Detail Page');
  142 |   });
  143 | });
  144 | 
```