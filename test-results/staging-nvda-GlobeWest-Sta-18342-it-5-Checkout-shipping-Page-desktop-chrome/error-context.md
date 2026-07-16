# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: staging-nvda.spec.js >> GlobeWest Staging NVDA & Keyboard Navigation Audit >> Audit 5. Checkout shipping Page
- Location: tests\staging-nvda.spec.js:176:5

# Error details

```
Error: Failed to dynamically add any product to cart.
```

# Test source

```ts
  72  |     speechProcess = null;
  73  |   }
  74  | }
  75  | 
  76  | // List of target pages on GlobeWest staging to test
  77  | const PAGES_TO_TEST = [
  78  |   { name: '1. Homepage', path: '/' },
  79  |   { name: '2. Product Listing Page (PLP)', path: '/indoor' },
  80  |   { name: '3. Product Detail Page (PDP)', path: '/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass' },
  81  |   { name: '4. Shopping Cart Page', path: '/checkout/cart/' },
  82  |   { name: '5. Checkout shipping Page', path: 'https://mcstaging.globewest.com.au/checkout/#shipping' },
  83  |   { name: '6. Checkout payment Page', path: 'https://mcstaging.globewest.com.au/checkout/#payment' },
  84  |   { name: '7. My Account Page', path: '/customer/account/' }
  85  | ];
  86  | 
  87  | test.describe('GlobeWest Staging NVDA & Keyboard Navigation Audit', () => {
  88  | 
  89  |   test.afterAll(async () => {
  90  |     stopSpeechEngine();
  91  |   });
  92  | 
  93  |   test.beforeEach(async ({ page }, testInfo) => {
  94  |     const isHeadedMode = !testInfo.project.use.headless;
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
> 172 |     throw new Error('Failed to dynamically add any product to cart.');
      |           ^ Error: Failed to dynamically add any product to cart.
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
  195 |           await page.locator('input[name="postcode"]').fill('2000');
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
```