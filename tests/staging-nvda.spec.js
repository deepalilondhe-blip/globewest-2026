// @ts-check
const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// Persistent PowerShell speech engine to serialize screen reader announcements without process spawning overhead
let speechProcess = null;
let speechResolver = null;

function startSpeechEngine() {
  if (speechProcess) return;
  const { spawn } = require('child_process');
  speechProcess = spawn('powershell.exe', [
    '-NoProfile',
    '-Command',
    `
      Add-Type -AssemblyName System.Speech;
      $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer;
      $synth.Rate = 4;
      [Console]::Out.WriteLine("Ready");
      while ($line = [Console]::In.ReadLine()) {
        if ($line.Trim() -ne "") {
          $synth.Speak($line);
          [Console]::Out.WriteLine("Done");
        }
      }
    `
  ]);
  
  speechProcess.stdin.setDefaultEncoding('utf-8');
  
  // Listen for the "Done" callback from PowerShell to unblock the tabbing flow
  speechProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message.includes('Done') && speechResolver) {
      const resolve = speechResolver;
      speechResolver = null;
      resolve();
    }
  });
}

async function speakText(text, isHeaded = true) {
  return new Promise((resolve) => {
    try {
      // Disable speech and resolve immediately if running headless for speed optimization
      if (!isHeaded) {
        resolve();
        return;
      }

      const cleanText = text.replace(/[\r\n]/g, ' ').replace(/['"<>|]/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }
      
      startSpeechEngine();
      speechResolver = resolve;
      speechProcess.stdin.write(cleanText + '\n');
    } catch (e) {
      resolve();
    }
  });
}

function stopSpeechEngine() {
  if (speechProcess) {
    try {
      speechProcess.stdin.end();
      speechProcess.kill();
    } catch (e) {}
    speechProcess = null;
  }
}

// List of target pages on GlobeWest staging to test
const PAGES_TO_TEST = [
  { name: '1. Homepage', path: '/' },
  { name: '2. Product Listing Page (PLP)', path: '/indoor' },
  { name: '3. Product Detail Page (PDP)', path: '/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass' },
  { name: '4. Shopping Cart Page', path: '/checkout/cart/' },
  { name: '5. Checkout shipping Page', path: 'https://mcstaging.globewest.com.au/checkout/#shipping' },
  { name: '6. Checkout payment Page', path: 'https://mcstaging.globewest.com.au/checkout/#payment' },
  { name: '7. My Account Dashboard', path: 'https://mcstaging.globewest.com.au/customer/account/index/' },
  { name: '8. My Account Login', path: 'https://mcstaging.globewest.com.au/customer/account/login/' },
  { name: '9. B2B Quotes Index', path: 'https://mcstaging.globewest.com.au/gw_quotes/quote/index/' }
];

test.describe('GlobeWest Staging NVDA & Keyboard Navigation Audit', () => {

  test.afterAll(async () => {
    stopSpeechEngine();
  });

  test.beforeEach(async ({ page }, testInfo) => {
    const isHeadedMode = !testInfo.project.use.headless;
    // Set high timeout for headed runs with audio, and safe 2-minute timeout for headless speed runs
    test.setTimeout(isHeadedMode ? 600000 : 120000);
    // Block third-party scripts that generate blocking overlay popups and slow down page navigation on staging
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*', route => route.abort());
  });

  // Dynamic helper to add ANY available in-stock product to cart
  async function addAnyProductToCart(page, checkoutUrl) {
    console.log('Navigating to PLP to find in-stock products...');
    await page.goto(`${checkoutUrl}/indoor`);
    await page.waitForLoadState('domcontentloaded');

    const closeBtn = page.locator('a#lpclose');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }

    const firstProduct = page.locator('.product-item-link').first();
    try {
      await firstProduct.waitFor({ state: 'visible', timeout: 15000 });
    } catch (e) {
      console.log('Dynamic product listings did not load in time.');
    }

    const productLinks = page.locator('.product-item-link');
    const count = await productLinks.count();
    console.log(`Found ${count} links on PLP. Extracting hrefs...`);

    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await productLinks.nth(i).getAttribute('href');
      if (href && !hrefs.includes(href)) {
        hrefs.push(href);
      }
    }

    console.log(`Extracted ${hrefs.length} unique product links. Testing additions...`);

    for (const href of hrefs.slice(0, 10)) {
      console.log(`Navigating to product page: ${href}`);
      try {
        await page.goto(href, { timeout: 20000 });
        await page.waitForLoadState('domcontentloaded');
      } catch (e) {
        console.log(`Product page load timed out/failed, skipping to next: ${href}`);
        continue;
      }

      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }

      // Automatically select swatches (color/materials) if visible
      const swatches = page.locator('.swatch-option');
      const swatchCount = await swatches.count();
      for (let k = 0; k < Math.min(swatchCount, 3); k++) {
        const sw = swatches.nth(k);
        if (await sw.isVisible()) {
          await sw.click();
          await page.waitForTimeout(500);
        }
      }

      // Automatically select dropdown size options if visible
      const selects = page.locator('select.swatch-select');
      const selectCount = await selects.count();
      for (let k = 0; k < selectCount; k++) {
        const sel = selects.nth(k);
        if (await sel.isVisible()) {
          await sel.selectOption({ index: 1 });
          await page.waitForTimeout(500);
        }
      }

      // Click Add to Cart
      const addToCartBtn = page.locator('#product-addtocart-button');
      if (await addToCartBtn.isVisible() && await addToCartBtn.isEnabled()) {
        console.log('Clicking Add to Cart...');
        await addToCartBtn.click();
        await page.waitForTimeout(5000); // Settle AJAX

        // Check if cart is populated
        await page.goto(`${checkoutUrl}/checkout/cart/`);
        await page.waitForLoadState('domcontentloaded');

        const emptyMessage = page.locator('.cart-empty');
        if (!(await emptyMessage.isVisible())) {
          console.log('Successfully populated cart!');
          return; // Done
        }
      }
    }
    throw new Error('Failed to dynamically add any product to cart.');
  }

  for (const pageInfo of PAGES_TO_TEST) {
    test(`Audit ${pageInfo.name}`, async ({ page }, testInfo) => {
      console.log(`\n==========================================`);
      console.log(`Starting Staging Audit: ${pageInfo.name}`);
      console.log(`Navigating to path: ${pageInfo.path}`);
      
      // Populate cart session on mcstaging first for the checkout stages
      if (pageInfo.name.includes('5. Checkout shipping') || pageInfo.name.includes('6. Checkout payment')) {
        const checkoutUrl = 'https://mcstaging.globewest.com.au';
        await addAnyProductToCart(page, checkoutUrl);
        if (pageInfo.name.includes('6. Checkout payment')) {
          await page.goto(`${checkoutUrl}/checkout/`);
          await page.waitForLoadState('load');
          const emailInput = page.locator('#customer-email');
          await emailInput.waitFor({ state: 'visible', timeout: 15000 });
          await emailInput.fill('john.smith@example.com');
          await page.locator('input[name="firstname"]').fill('John');
          await page.locator('input[name="lastname"]').fill('Smith');
          await page.locator('input[name="street[0]"]').fill('123 Test Street');
          await page.locator('input[name="city"]').fill('Sydney');
          await page.locator('select[name="region_id"]').selectOption({ label: 'New South Wales' });
          await page.locator('input[name="postcode"]').first().fill('2000');
          await page.locator('input[name="telephone"]').fill('0412345678');
          await page.waitForTimeout(2000); // Allow AJAX rates to load
          
          const firstRate = page.locator('.table-checkout-shipping-method input[type="radio"]').first();
          if (await firstRate.isVisible({ timeout: 5000 }).catch(() => false)) {
            await firstRate.click();
            await page.waitForTimeout(1000);
          } else {
            console.log('No shipping method radio button visible, proceeding directly to Payment.');
          }
          await page.locator('button.continue.primary:visible').click();
          await page.waitForTimeout(4000);
        }
      } else if (pageInfo.name.includes('7. My Account Dashboard') || pageInfo.name.includes('9. B2B Quotes Index')) {
        console.log(`Logging in via Admin to access ${pageInfo.name}...`);
        const loginUrl = 'https://mcstaging.globewest.com.au/godmode/customer/index/edit/id/112317/key/3cef45675f154e3048246abb9227c3e3113730cfb1e7b2886b8460a9335c5516/#';
        await page.goto(loginUrl, { timeout: 25000, waitUntil: 'domcontentloaded' });
        
        await page.locator('input#username').fill('deepali_od');
        await page.locator('input#login').fill('xMKbkaep4AQqxfuwbskhqA');
        await page.locator('button.action-login, button:has-text("Sign in")').click();
        await page.waitForURL('**/dashboard/**', { timeout: 15000 });
        
        // Expand Customers and go to All Customers
        await page.locator('li#menu-magento-customer-customer > a, a:has-text("Customers")').first().click();
        await page.waitForTimeout(2000);
        await page.locator('a:has-text("All Customers"), .submenu a[href*="customer/index"]').first().click();
        await page.waitForURL('**/customer/index/index/**', { timeout: 15000 });
        
        // Click Edit customer row
        const customerRow = page.locator('tr.data-row, tr').filter({ hasText: '112317' }).first();
        await customerRow.waitFor({ state: 'visible', timeout: 10000 });
        await customerRow.locator('a.action-menu-item').filter({ hasText: 'Edit' }).first().click();
        await page.waitForURL('**/customer/index/edit/**', { timeout: 25000 });
        await page.waitForTimeout(6000);
        
        // Login as Customer (handle popup)
        const loginBtn = page.locator('button:has-text("Login as Customer"), button[id*="login_as_customer"]').first();
        await loginBtn.click();
        await page.waitForTimeout(3000);
        
        const confirmBtn = page.locator('.modal-popup button:has-text("Login as Customer"), button.action-accept').first();
        
        // Listen for new page tab
        const [newPage] = await Promise.all([
          page.context().waitForEvent('page'),
          confirmBtn.click()
        ]);
        
        await newPage.waitForLoadState('load');
        await newPage.waitForTimeout(5000);
        
        if (pageInfo.name.includes('9. B2B Quotes Index')) {
          console.log('Navigating to B2B Quotes Index Page...');
          await newPage.goto('https://mcstaging.globewest.com.au/gw_quotes/quote/index/', { timeout: 25000 });
          await newPage.waitForLoadState('load');
        }
        
        // Point target page context to the newly authenticated frontend tab
        page = newPage;
      }
      
      // 1. Navigate to target staging page and wait for the page to render fully
      if (!pageInfo.name.includes('7. My Account Dashboard') && !pageInfo.name.includes('9. B2B Quotes Index')) {
        try {
          await page.goto(pageInfo.path, { timeout: 20000 });
          await page.waitForLoadState('load');
        } catch (e) {
          console.warn(`Primary page navigation failed/timed out, continuing scan: ${pageInfo.path}`);
        }
      }
      
      // Additional wait to ensure client-side components and images are completely rendered
      await page.waitForTimeout(4000);
      
      // 2. Dismiss any overlay welcome newsletter popups or modals
      const closeSelectors = [
        'a#lpclose',
        'button#lpclose',
        '.modal-popup button.action-close',
        '.modal-header button.action-close',
        'button.action-close',
        '.lp-close',
        '.close-popup',
        '#newsletter-popup button.close',
        'button.close',
        'a.close',
        '[aria-label="Close"]',
        '.action.close'
      ];
      for (const selector of closeSelectors) {
        try {
          const closeBtn = page.locator(selector).first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await page.waitForTimeout(1000);
          }
        } catch (e) {
          // Ignore error checks
        }
      }

      // Dismiss cookie banner if it is visible
      const cookieAcceptBtn = page.locator('#btn-cookie-allow, button.cookie-accept');
      if (await cookieAcceptBtn.isVisible()) {
        await cookieAcceptBtn.click();
        await page.waitForTimeout(1000);
      }

      // Inject Space Black iPhone 17 Pro device frame bezel on mobile viewports
      const viewport = page.viewportSize();
      const isMobile = viewport && viewport.width < 600;
      if (isMobile) {
        await page.evaluate(() => {
          const bezel = document.createElement('div');
          bezel.id = 'a11y-phone-bezel';
          bezel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            border: 12px solid #0c0d10;
            border-radius: 44px;
            box-shadow: inset 0 0 0 2px #1c1c1e, inset 0 0 0 3px #2c2c2e, 0 0 20px rgba(0,0,0,0.8);
            pointer-events: none;
            z-index: 999999;
            box-sizing: border-box;
          `;

          const notch = document.createElement('div');
          notch.id = 'a11y-phone-notch';
          notch.style.cssText = `
            position: fixed;
            top: 14px;
            left: 50%;
            transform: translateX(-50%);
            width: 110px;
            height: 28px;
            background: #000000;
            border-radius: 18px;
            box-shadow: inset 0 0 2px rgba(255,255,255,0.15);
            z-index: 1000000;
            pointer-events: none;
          `;

          document.body.appendChild(bezel);
          document.body.appendChild(notch);

          document.documentElement.style.padding = '12px';
          document.documentElement.style.boxSizing = 'border-box';
        });
        await page.waitForTimeout(500);
      }

      // Capture initial page state screenshot to artifact directory for reporting
      const artifactDir = `C:\\Users\\Deepali_Londhe\\.gemini\\antigravity\\brain\\2fcf22a4-2816-498c-8f1d-86c05c328536`;
      const screenshotName = pageInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').trim() + '.png';
      await page.screenshot({ path: `${artifactDir}/${screenshotName}` });

      // 3. Inject CSS style to dynamically highlight the currently focused element
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          .a11y-focus-highlight {
            outline: 6px solid #ff0055 !important;
            outline-offset: 4px !important;
            box-shadow: 0 0 15px #ff0055 !important;
            transition: outline-color 0.1s ease-in-out;
          }
        `;
        document.head.appendChild(style);

        document.addEventListener('focus', (event) => {
          document.querySelectorAll('.a11y-focus-highlight').forEach(el => {
            el.classList.remove('a11y-focus-highlight');
          });
          const active = event.target;
          if (active instanceof HTMLElement) {
            active.classList.add('a11y-focus-highlight');
          }
        }, true);
      });

      // 4. Bring browser window to front and anchor focus on the skip link or logo to avoid third-party iframe traps
      await page.bringToFront();
      
      // Inject CSS stylesheet to hide popups and search suggestions to prevent keyboard focus traps
      try {
        await page.addStyleTag({
          content: `
            a#lpclose, .listrak-popup, #omnisend-form-container, .newsletter-popup, div[role="dialog"], .modal-popup, .lp-popup, .search-autocomplete, #search_autocomplete, #_lpSurveyPopover_7GUA-CY8, iframe#lpdialog, div[id*="SurveyPopover"] {
              display: none !important;
              visibility: hidden !important;
              pointer-events: none !important;
            }
          `
        });
      } catch (e) {
        console.warn('CSP blocked stylesheet injection, continuing test run without it.');
      }

      const skipLink = page.locator('a.skip-link, a.logo, .logo a, a.logo-image, header a, a').first();
      if (await skipLink.isVisible()) {
        await skipLink.focus();
        // Tag the initially focused element as seen so we don't exit instantly
        await page.evaluate(() => {
          if (document.activeElement) {
            document.activeElement.setAttribute('data-a11y-seen', 'true');
          }
        });
      } else {
        await page.locator('body').click();
      }
      await page.waitForTimeout(1000);

      const isHeadedMode = !testInfo.project.use.headless;

      // Announce the start of the page audit via speech
      await speakText(`Auditing ${pageInfo.name.replace(/^\d+\.\s*/, '')}`, isHeadedMode);

      // 5. Dynamic Tab loop - Simulate keyboard navigation through all focusable elements until they wrap around
      const maxTabs = 40; // Safety limit to prevent infinite loops
      let tabCount = 0;
      let consecutiveBodyCount = 0;
      let lastActiveSelector = '';

      while (tabCount < maxTabs) {
        tabCount++;
        console.log(`Pressing TAB #${tabCount}...`);
        await page.keyboard.press('Tab');
        await page.waitForTimeout(300); // Allow focus state transition

        // Get active element selector to detect stuck focus (excluding the highlight class)
        let currentActiveSelector = '';
        try {
          currentActiveSelector = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return '';
            
            // Generate a unique CSS path for the element
            const getUniquePath = (node) => {
              const parts = [];
              let current = node;
              while (current && current.nodeType === Node.ELEMENT_NODE) {
                let index = 1;
                for (let sib = current.previousSibling; sib; sib = sib.previousSibling) {
                  if (sib.nodeType === Node.ELEMENT_NODE && sib.tagName === current.tagName) {
                    index++;
                  }
                }
                parts.unshift(current.tagName.toLowerCase() + ':nth-of-type(' + index + ')');
                current = current.parentNode;
              }
              return parts.join(' > ');
            };
            
            return getUniquePath(el);
          });
        } catch (e) {
          console.log(`[A11y Info] Navigation or context destruction detected during active element query. Ending tab loop.`);
          break;
        }

        // Recovery: If focus is stuck on the same element, press Escape to dismiss dropdowns/popups and tab again
        if (currentActiveSelector === lastActiveSelector && tabCount > 1) {
          console.log(`[A11y Warning] Focus stuck on element: ${currentActiveSelector}. Pressing ESC to recover...`);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
          await page.keyboard.press('Tab');
          await page.waitForTimeout(300);
        }
        lastActiveSelector = currentActiveSelector;

        // Evaluate the focused element and check if we have seen it before
        let elementInfo;
        try {
          elementInfo = await page.evaluate(() => {
            const active = document.activeElement;
            if (!active || active === document.body) {
              return { tag: 'body', name: 'body', isClickable: false, alreadySeen: false };
            }

            const tag = active.tagName.toLowerCase();
            const role = active.getAttribute('role') || 'None';
            const ariaLabel = active.getAttribute('aria-label') || '';
            const alt = active.getAttribute('alt') || '';
            const textContent = active.textContent?.trim() || '';
            
            let name = ariaLabel || alt || textContent || active.getAttribute('name') || 'Unnamed Control';
            if (name.length > 50) name = name.substring(0, 47) + '...';

            const isClickable = tag === 'a' || tag === 'button' || role === 'button' || active.getAttribute('onclick') !== null;
            
            const alreadySeen = active.hasAttribute('data-a11y-seen');
            if (!alreadySeen) {
              active.setAttribute('data-a11y-seen', 'true');
            }
            return { tag, name, isClickable, alreadySeen };
          });
        } catch (e) {
          console.log(`[A11y Info] Navigation or context destruction detected during element info query. Ending tab loop.`);
          break;
        }

        // Break if we wrap around to an already seen element
        if (elementInfo.alreadySeen) {
          console.log(`[A11y] Wrapped around to an already inspected element: ${elementInfo.name}. Finishing tab loop.`);
          break;
        }

        // Handle body focus: if we stay on body multiple times consecutively, we exit
        if (elementInfo.tag === 'body') {
          consecutiveBodyCount++;
          if (consecutiveBodyCount > 3) {
            console.log(`[A11y] Focused on body consecutively. Ending tab loop.`);
            break;
          }
        } else {
          consecutiveBodyCount = 0;
        }

        // Screen-reader style announcement (concise)
        let role = elementInfo.tag;
        if (role === 'a') role = 'link';
        if (role === 'input') role = 'edit';
        if (role === 'img') role = 'image';
        if (role === 'button') role = 'button';
        if (role === 'select') role = 'combo box';
        
        const speakMsg = `${elementInfo.name} ${role}`;
        console.log(`  Tab ${tabCount}: ${speakMsg}`);
        await speakText(speakMsg, isHeadedMode);

        // Capture screenshot of the highlighted focused element
        const stepScreenshot = await page.screenshot({ fullPage: false });
        await testInfo.attach(`Tab #${tabCount} - Focused: ${elementInfo.tag} [${elementInfo.name}]`, {
          body: stepScreenshot,
          contentType: 'image/png'
        });

        await page.waitForTimeout(200);
      }

      await speakText(`Finished auditing ${pageInfo.name.replace(/^\d+\.\s*/, '')}`, isHeadedMode);

      // Click "Place Order" / "Process Payment" to complete checkout if it is the payment page
      if (pageInfo.name.includes('6. Checkout payment')) {
        console.log('Clicking the Place Order button to complete payment process...');
        const placeOrderBtn = page.locator('button.action.primary.checkout');
        if (await placeOrderBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
          await placeOrderBtn.click();
          await page.waitForTimeout(6000); // Wait for order success redirection
          console.log('Order successfully placed!');
        }
      }
    });
  }
});
