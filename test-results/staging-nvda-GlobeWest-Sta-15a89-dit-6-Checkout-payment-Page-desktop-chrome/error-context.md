# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: staging-nvda.spec.js >> GlobeWest Staging NVDA & Keyboard Navigation Audit >> Audit 6. Checkout payment Page
- Location: tests\staging-nvda.spec.js:176:5

# Error details

```
Error: locator.fill: Error: strict mode violation: locator('input[name="postcode"]') resolved to 2 elements:
    1) <input type="text" id="FMXCSC6" name="postcode" class="input-text" aria-required="true" aria-invalid="false" placeholder="Zip/Postal Code" data-validation-success="false" data-bind="↵    value: value,↵    valueUpdate: 'keyup',↵    hasFocus: focused,↵    attr: {↵        name: inputName,↵        placeholder: placeholder,↵        'aria-describedby': getDescriptionId(),↵        'aria-required': required,↵        'aria-invalid': error() ? true : 'false',↵        'data-validation-success': value() && !erro…/> aka getByRole('textbox', { name: 'Zip/Postal Code*' })
    2) <input type="text" id="postcode" name="postcode" class="input-text" autocomplete="off" data-validate="{required:true}" placeholder="Type your Postcode" data-bind="value: currentZip, attr: { placeholder: $t('Type your Postcode') }"/> aka getByPlaceholder('Type your Postcode')

Call log:
  - waiting for locator('input[name="postcode"]')

```

# Test source

```ts
  95  |     // Set high timeout for headed runs with audio, and safe 2-minute timeout for headless speed runs
  96  |     test.setTimeout(isHeadedMode ? 600000 : 120000);
  97  |     // Block third-party scripts that generate blocking overlay popups and slow down page navigation on staging
  98  |     await page.route('**/*listrak*', route => route.abort());
  99  |     await page.route('**/*klaviyo*', route => route.abort());
  100 |     await page.route('**/*hotjar*', route => route.abort());
  101 |     await page.route('**/*google-analytics*', route => route.abort());
  102 |     await page.route('**/*yotpo*', route => route.abort());
  103 |   });
  104 | 
  105 |   // Dynamic helper to add ANY available in-stock product to cart
  106 |   async function addAnyProductToCart(page, checkoutUrl) {
  107 |     console.log('Navigating to PLP to find in-stock products...');
  108 |     await page.goto(`${checkoutUrl}/indoor`);
  109 |     await page.waitForLoadState('domcontentloaded');
  110 | 
  111 |     const closeBtn = page.locator('a#lpclose');
  112 |     if (await closeBtn.isVisible()) {
  113 |       await closeBtn.click();
  114 |     }
  115 | 
  116 |     const productLinks = page.locator('.product-item-link');
  117 |     const count = await productLinks.count();
  118 |     console.log(`Found ${count} products on PLP. Scanning for purchasable item...`);
  119 | 
  120 |     for (let i = 0; i < Math.min(count, 8); i++) {
  121 |       const href = await productLinks.nth(i).getAttribute('href');
  122 |       if (!href) continue;
  123 | 
  124 |       console.log(`Navigating to product page: ${href}`);
  125 |       await page.goto(href);
  126 |       await page.waitForLoadState('domcontentloaded');
  127 | 
  128 |       if (await closeBtn.isVisible()) {
  129 |         await closeBtn.click();
  130 |       }
  131 | 
  132 |       // Automatically select swatches (color/materials) if visible
  133 |       const swatches = page.locator('.swatch-option');
  134 |       const swatchCount = await swatches.count();
  135 |       for (let k = 0; k < Math.min(swatchCount, 3); k++) {
  136 |         const sw = swatches.nth(k);
  137 |         if (await sw.isVisible()) {
  138 |           await sw.click();
  139 |           await page.waitForTimeout(500);
  140 |         }
  141 |       }
  142 | 
  143 |       // Automatically select dropdown size options if visible
  144 |       const selects = page.locator('select.swatch-select');
  145 |       const selectCount = await selects.count();
  146 |       for (let k = 0; k < selectCount; k++) {
  147 |         const sel = selects.nth(k);
  148 |         if (await sel.isVisible()) {
  149 |           await sel.selectOption({ index: 1 });
  150 |           await page.waitForTimeout(500);
  151 |         }
  152 |       }
  153 | 
  154 |       // Click Add to Cart
  155 |       const addToCartBtn = page.locator('#product-addtocart-button');
  156 |       if (await addToCartBtn.isVisible() && await addToCartBtn.isEnabled()) {
  157 |         console.log('Clicking Add to Cart...');
  158 |         await addToCartBtn.click();
  159 |         await page.waitForTimeout(5000); // Settle AJAX
  160 | 
  161 |         // Check if cart is populated
  162 |         await page.goto(`${checkoutUrl}/checkout/cart/`);
  163 |         await page.waitForLoadState('domcontentloaded');
  164 | 
  165 |         const emptyMessage = page.locator('.cart-empty');
  166 |         if (!(await emptyMessage.isVisible())) {
  167 |           console.log('Successfully populated cart!');
  168 |           return; // Done
  169 |         }
  170 |       }
  171 |     }
  172 |     throw new Error('Failed to dynamically add any product to cart.');
  173 |   }
  174 | 
  175 |   for (const pageInfo of PAGES_TO_TEST) {
  176 |     test(`Audit ${pageInfo.name}`, async ({ page }, testInfo) => {
  177 |       console.log(`\n==========================================`);
  178 |       console.log(`Starting Staging Audit: ${pageInfo.name}`);
  179 |       console.log(`Navigating to path: ${pageInfo.path}`);
  180 |       
  181 |       // Populate cart session on mcstaging first for the checkout stages
  182 |       if (pageInfo.name.includes('5. Checkout shipping') || pageInfo.name.includes('6. Checkout payment')) {
  183 |         const checkoutUrl = 'https://mcstaging.globewest.com.au';
  184 |         await addAnyProductToCart(page, checkoutUrl);
  185 |         if (pageInfo.name.includes('6. Checkout payment')) {
  186 |           await page.goto(`${checkoutUrl}/checkout/`);
  187 |           await page.waitForLoadState('load');
  188 |           const emailInput = page.locator('#customer-email');
  189 |           await emailInput.waitFor({ state: 'visible', timeout: 15000 });
  190 |           await emailInput.fill('test_nvda@globewestqa.com');
  191 |           await page.locator('input[name="firstname"]').fill('QA');
  192 |           await page.locator('input[name="lastname"]').fill('Tester');
  193 |           await page.locator('input[name="street[0]"]').fill('123 Test Street');
  194 |           await page.locator('input[name="city"]').fill('Sydney');
> 195 |           await page.locator('input[name="postcode"]').fill('2000');
      |                                                        ^ Error: locator.fill: Error: strict mode violation: locator('input[name="postcode"]') resolved to 2 elements:
  196 |           await page.locator('input[name="telephone"]').fill('0412345678');
  197 |           
  198 |           const firstRate = page.locator('.table-checkout-shipping-method input[type="radio"]').first();
  199 |           await firstRate.click();
  200 |           await page.waitForTimeout(1000);
  201 |           await page.locator('button.continue.primary').click();
  202 |           await page.waitForTimeout(4000);
  203 |         }
  204 |       }
  205 |       
  206 |       // 1. Navigate to target staging page and wait for the page to render fully
  207 |       await page.goto(pageInfo.path);
  208 |       
  209 |       // Wait for network activity to settle or load state
  210 |       try {
  211 |         await page.waitForLoadState('networkidle', { timeout: 10000 });
  212 |       } catch (e) {
  213 |         await page.waitForLoadState('load');
  214 |       }
  215 |       
  216 |       // Additional wait to ensure client-side components and images are completely rendered
  217 |       await page.waitForTimeout(4000);
  218 |       
  219 |       // 2. Dismiss any overlay welcome newsletter popups or modals
  220 |       const closeSelectors = [
  221 |         'a#lpclose',
  222 |         'button#lpclose',
  223 |         '.modal-popup button.action-close',
  224 |         '.modal-header button.action-close',
  225 |         'button.action-close',
  226 |         '.lp-close',
  227 |         '.close-popup',
  228 |         '#newsletter-popup button.close',
  229 |         'button.close',
  230 |         'a.close',
  231 |         '[aria-label="Close"]',
  232 |         '.action.close'
  233 |       ];
  234 |       for (const selector of closeSelectors) {
  235 |         try {
  236 |           const closeBtn = page.locator(selector).first();
  237 |           if (await closeBtn.isVisible()) {
  238 |             await closeBtn.click();
  239 |             await page.waitForTimeout(1000);
  240 |           }
  241 |         } catch (e) {
  242 |           // Ignore error checks
  243 |         }
  244 |       }
  245 | 
  246 |       // Dismiss cookie banner if it is visible
  247 |       const cookieAcceptBtn = page.locator('#btn-cookie-allow, button.cookie-accept');
  248 |       if (await cookieAcceptBtn.isVisible()) {
  249 |         await cookieAcceptBtn.click();
  250 |         await page.waitForTimeout(1000);
  251 |       }
  252 | 
  253 |       // Capture initial page state screenshot to artifact directory for reporting
  254 |       const artifactDir = `C:\\Users\\Deepali_Londhe\\.gemini\\antigravity\\brain\\2fcf22a4-2816-498c-8f1d-86c05c328536`;
  255 |       const screenshotName = pageInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').trim() + '.png';
  256 |       await page.screenshot({ path: `${artifactDir}/${screenshotName}` });
  257 | 
  258 |       // 3. Inject CSS style to dynamically highlight the currently focused element
  259 |       await page.evaluate(() => {
  260 |         const style = document.createElement('style');
  261 |         style.innerHTML = `
  262 |           .a11y-focus-highlight {
  263 |             outline: 6px solid #ff0055 !important;
  264 |             outline-offset: 4px !important;
  265 |             box-shadow: 0 0 15px #ff0055 !important;
  266 |             transition: outline-color 0.1s ease-in-out;
  267 |           }
  268 |         `;
  269 |         document.head.appendChild(style);
  270 | 
  271 |         document.addEventListener('focus', (event) => {
  272 |           document.querySelectorAll('.a11y-focus-highlight').forEach(el => {
  273 |             el.classList.remove('a11y-focus-highlight');
  274 |           });
  275 |           const active = event.target;
  276 |           if (active instanceof HTMLElement) {
  277 |             active.classList.add('a11y-focus-highlight');
  278 |           }
  279 |         }, true);
  280 |       });
  281 | 
  282 |       // 4. Bring browser window to front and anchor focus on the skip link or logo to avoid third-party iframe traps
  283 |       await page.bringToFront();
  284 |       
  285 |       // Inject CSS stylesheet to hide popups and search suggestions to prevent keyboard focus traps
  286 |       await page.addStyleTag({
  287 |         content: `
  288 |           a#lpclose, .listrak-popup, #omnisend-form-container, .newsletter-popup, div[role="dialog"], .modal-popup, .lp-popup, .search-autocomplete, #search_autocomplete, #_lpSurveyPopover_7GUA-CY8, iframe#lpdialog, div[id*="SurveyPopover"] {
  289 |             display: none !important;
  290 |             visibility: hidden !important;
  291 |             pointer-events: none !important;
  292 |           }
  293 |         `
  294 |       });
  295 | 
```