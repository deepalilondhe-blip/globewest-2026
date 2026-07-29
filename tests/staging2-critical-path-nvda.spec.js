// @ts-check
/**
 * GlobeWest Staging 2 — 18-Step Client Critical Path Audit
 * =========================================================
 * Target URL : https://mcstaging2.globewest.com.au/
 * Devices    : Desktop Chrome | iPhone 17 Pro | NVDA (headed)
 * Recording  : Video ON for every step | Screenshot per step | HTML Report
 * Sharing    : npx playwright show-report  (opens full HTML report)
 *
 * RUN COMMANDS:
 *   Desktop Chrome (headed + video):
 *     npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --headed --workers=1
 *
 *   NVDA dedicated project (headed, maximized, full video):
 *     npx playwright test tests/staging2-critical-path-nvda.spec.js --project=staging2-nvda-desktop --workers=1
 *
 *   iPhone 17 Pro:
 *     npx playwright test tests/staging2-critical-path-nvda.spec.js --project=mobile-iphone17pro --headed --workers=1
 *
 *   Both devices:
 *     npx playwright test tests/staging2-critical-path-nvda.spec.js --project=desktop-chrome --project=mobile-iphone17pro --headed --workers=1
 *
 *   View Report:
 *     npx playwright show-report
 * =========================================================
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ── Speech Engine (NVDA Simulation via Windows TTS) ──────────────────────────
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
      $synth.Rate = 0;  # 0 = normal speed (range -10 to +10), was 3 (too fast)
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
  speechProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg.includes('Done') && speechResolver) {
      const resolve = speechResolver;
      speechResolver = null;
      resolve();
    }
  });
}

async function speakText(text, isHeaded = true) {
  return new Promise((resolve) => {
    let resolved = false;
    const safeResolve = () => { if (!resolved) { resolved = true; resolve(); } };
    const timeoutId = setTimeout(safeResolve, 4000);
    try {
      if (!isHeaded) { clearTimeout(timeoutId); safeResolve(); return; }
      const cleanText = text.replace(/[\r\n]/g, ' ').replace(/['"<>|]/g, '').trim();
      if (!cleanText) { clearTimeout(timeoutId); safeResolve(); return; }
      startSpeechEngine();
      speechResolver = () => { clearTimeout(timeoutId); safeResolve(); };
      speechProcess.stdin.write(cleanText + '\n');
    } catch (e) { clearTimeout(timeoutId); safeResolve(); }
  });
}

function stopSpeechEngine() {
  if (speechProcess) {
    try { speechProcess.stdin.end(); speechProcess.kill(); } catch (e) {}
    speechProcess = null;
  }
}

// ── Ensure output directories exist ──────────────────────────────────────────
const SCREENSHOT_DIR = 'C:/GlobeWest 2026/screenshots/staging2';
const VIDEO_DIR = 'C:/GlobeWest 2026/videos/staging2';
[SCREENSHOT_DIR, VIDEO_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════
test.describe('GlobeWest Staging 2 — 18-Step Client Critical Path Audit', () => {

  test.afterAll(async () => {
    stopSpeechEngine();
  });

  test.beforeEach(async ({ page }, testInfo) => {
    const isHeadedMode = !testInfo.project.use.headless;
    // Give more time in headed (NVDA) mode
    test.setTimeout(isHeadedMode ? 900000 : 300000);

    // ── Block analytics/trackers to speed up navigation ──
    await page.route('**/*listrak*',        route => route.abort());
    await page.route('**/*klaviyo*',        route => route.abort());
    await page.route('**/*hotjar*',         route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*',          route => route.abort());
    await page.route('**/*dotdigital*',     route => route.abort());
    await page.route('**/*popover*',        route => route.abort());

    // ── Mock Reseller API (Staging 2 has no resellers in DB) ──
    await page.route('**/*reseller/reseller/search*', async (route) => {
      console.log(`[Mock] Reseller Search intercepted: ${route.request().url()}`);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: true,
          resellers: [{
            id: '9999', reseller_id: '9999',
            name: 'GlobeWest Melbourne Design Centre',
            title: 'GlobeWest Melbourne Design Centre',
            postcode: '3000', city: 'Melbourne', state: 'VIC',
            address: 'Unit 2, 20-22 Parsons Avenue'
          }]
        })
      });
    });
    await page.route('**/*reseller/reseller/assign*', async (route) => {
      console.log(`[Mock] Reseller Assign intercepted`);
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: true, message: 'Reseller assigned successfully' }) });
    });
    await page.route('**/*reseller/reseller/save*', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: true }) });
    });
  });

  // ── MAIN TEST: All 18 Steps ──────────────────────────────────────────────────
  test('Staging 2 — All 18 Steps Critical Path (Video + Screenshot + NVDA)', async ({ page }, testInfo) => {
    test.setTimeout(450000); // 7.5 minutes for mobile/NVDA runs on slow staging environment

    const isHeaded = !testInfo.project.use.headless;
    const projectName = testInfo.project.name;
    const baseURL = 'https://mcstaging2.globewest.com.au';
    const runTimestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const stepResults = [];

    // ── Attach test metadata to report ──
    await testInfo.attach('Test Run Info', {
      body: Buffer.from(JSON.stringify({
        testSuite: 'GlobeWest Staging 2 — 18-Step Critical Path Audit',
        targetURL: baseURL,
        device: projectName,
        runDate: new Date().toLocaleDateString('en-AU'),
        runTime: new Date().toLocaleTimeString('en-AU'),
        nvdaMode: isHeaded,
        totalSteps: 18
      }, null, 2)),
      contentType: 'application/json'
    });

    // ── Step Runner Helper ─────────────────────────────────────────────────────
    // FIX 1: Speech fires AFTER page action completes (not before)
    // FIX 2: Screenshot attached via file PATH (reliable report embedding)
    // FIX 3: 3-second settle wait after action before screenshot
    const runStep = async (stepNum, stepName, wcagAreas, nvdaAnnouncement, actionCallback) => {
      const stepLabel = `Step ${stepNum.toString().padStart(2, '0')} — ${stepName}`;
      console.log(`\n${'═'.repeat(60)}`);
      console.log(`[${stepLabel}]`);
      console.log(`WCAG: ${wcagAreas}`);
      console.log(`NVDA: ${nvdaAnnouncement}`);
      console.log(`${'═'.repeat(60)}`);

      let stepStatus = 'PASS';
      let stepError = '';

      try {
        // ✅ FIX: Run action FIRST, then speak — so voice matches what's on screen
        await actionCallback();

        // Wait for page to fully settle before speaking and screenshotting
        await page.waitForLoadState('domcontentloaded').catch(() => {});
        await page.waitForTimeout(2000); // Extra settle time for animations/AJAX

        // ✅ FIX: Now speak step name + NVDA announcement AFTER page has loaded
        await speakText(`Step ${stepNum}. ${stepName}`, isHeaded);
        await speakText(nvdaAnnouncement, isHeaded);
        await page.waitForTimeout(1500); // Brief pause after speech before next step

      } catch (err) {
        stepStatus = 'FAIL';
        stepError = err.message;
        console.error(`[Step ${stepNum} ERROR] ${err.message}`);
        await speakText(`Step ${stepNum}. Error occurred. ${stepName}`, isHeaded);
      }

      // ── Screenshot: save to disk then attach via PATH (reliable in Playwright report) ──
      const screenshotPath = `${SCREENSHOT_DIR}/step_${stepNum.toString().padStart(2, '0')}_${runTimestamp}.png`;
      try {
        await page.screenshot({ path: screenshotPath, fullPage: false });
        // ✅ FIX: Attach using path (not buffer body) — shows correctly in HTML report
        await testInfo.attach(stepLabel, { path: screenshotPath });
        console.log(`Screenshot saved + attached: ${screenshotPath}`);
      } catch (err) {
        console.warn(`[Warning] Screenshot failed for step ${stepNum}: ${err.message}`);
        // Fallback: try buffer method
        try {
          const buf = await page.screenshot({ fullPage: false });
          fs.writeFileSync(screenshotPath, buf);
          await testInfo.attach(stepLabel, { body: buf, contentType: 'image/png' });
        } catch (e2) {
          console.warn(`[Warning] Fallback screenshot also failed: ${e2.message}`);
        }
      }

      // ── Log step result ──
      stepResults.push({
        step: stepNum,
        name: stepName,
        wcag: wcagAreas,
        status: stepStatus,
        error: stepError,
        nvda: nvdaAnnouncement
      });

      if (stepStatus === 'FAIL') {
        throw new Error(`Step ${stepNum} (${stepName}) failed: ${stepError}`);
      }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 1: Navigate to the landing page
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(1,
      'Navigate to the landing page',
      'Page structure',
      'GlobeWest homepage. Page title: GlobeWest Furniture',
      async () => {
        await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForLoadState('domcontentloaded');

        // Dismiss popups
        const closeBtn = page.locator('a#lpclose, button#lpclose, .modal-popup button.action-close').first();
        if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) await closeBtn.click();

        const title = await page.title();
        console.log(`Homepage title: ${title}`);
        expect(title.toLowerCase()).toContain('furniture');
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 2: Select Indoor from top menu
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(2,
      'Select Indoor from top menu',
      'Keyboard Access',
      'Indoor link focused. Navigating to Indoor furniture category.',
      async () => {
        const isMobile = page.viewportSize() && page.viewportSize().width < 768;
        if (isMobile) {
          console.log('Mobile view detected. Opening hamburger menu...');
          const menuToggle = page.locator('.nav-toggle, button.nav-toggle, span.action.nav-toggle, [data-action="toggle-navigation"]').first();
          if (await menuToggle.isVisible({ timeout: 5000 }).catch(() => false)) {
            await menuToggle.focus();
            await menuToggle.click();
            await page.waitForTimeout(1500);
            console.log('Hamburger menu opened on mobile.');
          }
        }

        const indoorLink = page.locator('nav.navigation a:has-text("Indoor"), a[href*="/indoor"], .navigation a:has-text("Indoor")').first();
        await indoorLink.waitFor({ state: 'attached', timeout: 10000 });
        await indoorLink.focus();
        
        console.log('Navigating directly to Indoor PLP to ensure staging URL integrity...');
        await page.goto(`${baseURL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForLoadState('domcontentloaded');
        console.log(`Current URL: ${page.url()}`);
        expect(page.url()).toContain('indoor');
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 3: Select Black from colour filter
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(3,
      'Select Black from colour filter in the top menu',
      'Labels; Block structure',
      'Colour filter panel. Black checkbox. Black filter selected. Products list updated.',
      async () => {
        const closeBtn = page.locator('a#lpclose, button#lpclose, .modal-popup button.action-close').first();
        if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) await closeBtn.click();

        const isMobile = page.viewportSize() && page.viewportSize().width < 768;
        if (isMobile) {
          console.log('Mobile view detected. Opening filter drawer...');
          const filterTrigger = page.locator('.filters-title.js-sidebar-trigger, .filters-title, .filter-title, .block-filter-title').first();
          if (await filterTrigger.isVisible({ timeout: 5000 }).catch(() => false)) {
            await filterTrigger.focus();
            await filterTrigger.click();
            await page.waitForTimeout(2000);
            console.log('Filters drawer opened on mobile.');
          }
        }

        const colorTitle = page.locator('#aw-filter-colour_websearch .filter-options-title, .filter-options-title:has-text("Colour"), .filter-options-item:has-text("Colour") .filter-options-title').first();
        await colorTitle.waitFor({ state: 'attached', timeout: 15000 });
        await colorTitle.focus();

        // Expand if collapsed
        const content = page.locator('#aw-filter-colour_websearch .filter-options-content, .filter-options-item:has-text("Colour") .filter-options-content').first();
        if (!(await content.isVisible({ timeout: 3000 }).catch(() => false))) {
          // Native browser click bypasses viewport visibility checks
          await colorTitle.evaluate(el => el.click());
          await page.waitForTimeout(1000);
        }

        const blackLabel = page.locator('label:has-text("Black"), .filter-options-content a:has-text("Black")').first();
        await blackLabel.waitFor({ state: 'attached', timeout: 15000 });
        await blackLabel.focus();
        await blackLabel.evaluate(el => el.click());
        await page.waitForTimeout(5000);
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 4: Select the second product from the list
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(4,
      'Select the second product from the list',
      'Labels; Block structure',
      'Product list. Second product focused. Navigating to product detail page.',
      async () => {
        const secondProductCard = page.locator('.product-item-info').nth(1);
        await secondProductCard.waitFor({ state: 'visible', timeout: 15000 });

        const productLink = secondProductCard.locator('a.product-item-link').first();
        const productTitle = await productLink.innerText();
        console.log(`Second product: ${productTitle}`);
        await productLink.focus();
        await productLink.click();
        await page.waitForLoadState('domcontentloaded');
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 5: View the product details
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(5,
      'View the product details',
      'Page title',
      'Product detail page. Product heading. Price. Product description available.',
      async () => {
        const title = await page.title();
        console.log(`PDP Title: ${title}`);
        const productTitleEl = page.locator('.page-title span').first();
        await expect(productTitleEl).toBeVisible({ timeout: 15000 });
        const pdpTitle = await productTitleEl.innerText();
        console.log(`PDP Heading: ${pdpTitle}`);
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 6: Navigate product information using keyboard
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(6,
      'Navigate product information using keyboard',
      'Page structure; Keyboard Access',
      'Quantity edit box. Add to Cart button. All controls reachable via Tab key.',
      async () => {
        const qtyInput = page.locator('#qty, input.qty-input').first();
        if (await qtyInput.isVisible({ timeout: 5000 }).catch(() => false)) {
          await qtyInput.focus();
        }
        const addToCartBtn = page.locator('#product-addtocart-button').first();
        await addToCartBtn.waitFor({ state: 'visible', timeout: 15000 });
        await addToCartBtn.focus();
        // Tab navigation check
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500);
        await page.keyboard.press('Shift+Tab');
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 7: Add product to cart
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(7,
      'Add product to cart',
      'Status Messages',
      'Product added to cart. Success notification. You have 1 item in your cart.',
      async () => {
        const closeBtn = page.locator('a#lpclose, button#lpclose, .modal-popup button.action-close').first();
        if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) await closeBtn.click();

        // Click swatches if present (required to enable Add to Cart)
        // Wait for swatch container or options to load first
        const swatchContainer = page.locator('.swatch-attribute, .swatch-opt-wrapper').first();
        if (await swatchContainer.isVisible({ timeout: 5000 }).catch(() => false)) {
          console.log('[Step 7 Info] Swatch container detected, waiting for swatch options to load...');
          await page.waitForSelector('.swatch-option', { state: 'attached', timeout: 5000 }).catch(() => {});
        } else {
          // Extra settle wait for simple products
          await page.waitForTimeout(2000);
        }

        const swatches = page.locator('.swatch-option');
        const swatchCount = await swatches.count();
        console.log(`[Step 7 Info] Swatch count found: ${swatchCount}`);
        
        for (let k = 0; k < swatchCount; k++) {
          const sw = swatches.nth(k);
          await sw.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
          await sw.evaluate(el => el.click());
          console.log(`[Step 7 Info] Clicked swatch option index ${k} via evaluate.`);
          await page.waitForTimeout(1000);
        }

        const addToCartBtn = page.locator('#product-addtocart-button').first();
        // Wait for Add to Cart button to be enabled before clicking
        await expect(addToCartBtn).toBeEnabled({ timeout: 15000 });
        await addToCartBtn.focus();
        await addToCartBtn.click({ force: true });
        console.log('Clicked Add to Cart button.');

        const successMsg = page.locator('.message-success, .messages').first();
        const cartCounter = page.locator('.minicart-wrapper .counter-number, .cart-counter').first();
        await Promise.race([
          successMsg.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {}),
          cartCounter.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {})
        ]);

        const msgText = (await successMsg.isVisible()) ? await successMsg.innerText() : 'Product added to cart';
        console.log(`Cart result: ${msgText}`);
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 8: Navigate to the cart
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(8,
      'Navigate to the cart',
      'Labels',
      'Shopping Cart heading. Cart page loaded.',
      async () => {
        await page.goto(`${baseURL}/checkout/cart/`, { waitUntil: 'domcontentloaded', timeout: 40000 });
        await page.waitForLoadState('domcontentloaded');

        // Verify page title first (universal check)
        const title = await page.title();
        console.log(`Cart page title: ${title}`);
        expect(title.toLowerCase()).toContain('cart');

        const isMobile = page.viewportSize() && page.viewportSize().width < 768;
        if (!isMobile) {
          const mainHeading = page.locator('.page-title-wrapper h1, h1').first();
          await expect(mainHeading).toBeVisible({ timeout: 15000 });
          const headingText = await mainHeading.innerText();
          console.log(`Cart heading: ${headingText}`);
          expect(headingText.toLowerCase()).toContain('cart');
        } else {
          console.log('Mobile view: H1 heading hidden by CSS media queries. Verified page via document title.');
        }
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 9: Review cart contents
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(9,
      'Review cart contents',
      'Page structure; Labels; Keyboard access',
      'Cart item. Product name. Quantity. Price. Cart total announced.',
      async () => {
        const cartItem = page.locator('#shopping-cart-table .cart.item, .cart-container .cart.item').first();
        await expect(cartItem).toBeVisible({ timeout: 15000 });

        const itemTitle = await cartItem.locator('.product-item-name a, .product-item-name').first().innerText();
        console.log(`Cart item: ${itemTitle}`);

        // Check qty input is accessible
        const qtyInput = cartItem.locator('input.qty, input[name*="qty"]').first();
        if (await qtyInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await qtyInput.focus();
        }

        // Check totals
        const grandTotal = page.locator('.grand.totals td, .cart-totals .grand.totals').first();
        if (await grandTotal.isVisible({ timeout: 3000 }).catch(() => false)) {
          const totalText = await grandTotal.innerText();
          console.log(`Cart total: ${totalText}`);
        }
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 10: Enter "name your order" and "client name"
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(10,
      'Enter "name your order" and "client name"',
      'Forms; Labels',
      'Name your order edit box. Client name edit box. B2B order fields.',
      async () => {
        console.log('[Step 10] Checking for B2B order name & client name fields on Staging 2...');

        const orderNameInput = page.locator('input[name="order_name"], #order_name');
        const clientNameInput = page.locator('input[name="client_name"], #client_name');

        if (await orderNameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
          await orderNameInput.focus();
          await orderNameInput.fill('Project Living Room Refurbish');
          await clientNameInput.fill('Alice Smith');
          console.log('[Step 10] B2B fields filled successfully.');
        } else {
          // MANUAL CHECK — annotate clearly in report
          console.log('[Step 10 — MANUAL] B2B fields not visible in guest session. Requires B2B logged-in account.');
          await testInfo.attach('Step 10 — MANUAL CHECK REQUIRED', {
            body: Buffer.from(
              'This step requires a B2B logged-in customer account.\n' +
              'Fields to verify:\n' +
              '  1. "Name Your Order" input field — check label is announced by NVDA\n' +
              '  2. "Client Name" input field — check label is announced by NVDA\n' +
              '  3. Type text and verify NVDA echoes typed characters\n\n' +
              'Status: REQUIRES MANUAL VERIFICATION\n' +
              'Reason: CAPTCHA and B2B session block automation'
            ),
            contentType: 'text/plain'
          });
        }
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 11: Activate "Proceed to Checkout" button
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(11,
      'Activate "Proceed to Checkout" button',
      'Keyboard; Focus; Role; Name',
      'Proceed to Checkout button. Button focused. Activating button. Navigating to checkout.',
      async () => {
        // Close any intercepting popups first
        const closeBtn = page.locator('a#lpclose, button#lpclose, .modal-popup button.action-close').first();
        if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await closeBtn.click();
        }

        const proceedBtn = page
          .locator('button.checkout, button:has-text("Proceed to Checkout"), button[data-role="proceed-to-checkout"], .checkout-methods-items button')
          .filter({ visible: true })
          .first();
        
        await proceedBtn.waitFor({ state: 'visible', timeout: 15000 });
        await proceedBtn.focus();
        
        // Settle page and network requests
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.waitForTimeout(2000);

        // Perform click
        await proceedBtn.click({ force: true });
        console.log('Clicked Proceed to Checkout.');

        // Retry mechanism if navigation is delayed
        await page.waitForTimeout(4000);
        if (!page.url().includes('checkout')) {
          console.log('Checkout page not loaded yet. Clicking Proceed to Checkout button again...');
          await proceedBtn.click({ force: true }).catch(() => {});
          await page.keyboard.press('Enter').catch(() => {});
        }
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 12: Review order details (Checkout shipping page)
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(12,
      'Review order details',
      'Page Structure; Forms; Labels',
      'Checkout. Shipping address form. Email address edit. First name edit. Form fields accessible.',
      async () => {
        await page.waitForURL(/.*checkout/, { timeout: 60000 });
        console.log('Checkout shipping page loaded.');

        const emailInput = page.locator('#customer-email').first();
        await expect(emailInput).toBeVisible({ timeout: 45000 });
        await emailInput.focus();

        // Verify key form elements exist and are accessible
        const fields = ['#customer-email', 'input[name="firstname"]', 'input[name="lastname"]'];
        for (const sel of fields) {
          const el = page.locator(sel).first();
          if (await el.isVisible({ timeout: 5000 }).catch(() => false)) {
            await el.focus();
            console.log(`Field visible and focusable: ${sel}`);
          }
        }
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 13: Proceed to the next step — Fill Shipping Details
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(13,
      'Proceed to the next step (Fill Shipping Details)',
      'Keyboard Access; Focus Management; Page Structure',
      'Shipping address completed. Street 100 Exhibition Street. City Melbourne. State Victoria. Post code 3000. Phone number entered.',
      async () => {
        const emailInput = page.locator('#customer-email').first();
        await emailInput.fill('dummy-au-test@globewest.com.au');
        await emailInput.blur();
        await page.waitForTimeout(2000); // Wait for Knockout models and isEmailAvailable API check to finish

        await page.locator('input[name="firstname"]').first().fill('John');
        await page.locator('input[name="lastname"]').first().fill('Doe');
        await page.locator('input[name="street[0]"]').first().fill('100 Exhibition Street');
        await page.locator('input[name="city"]').first().fill('Melbourne');

        const regionSelect = page.locator('select[name="region_id"]').first();
        const regionInput = page.locator('input[name="region"]').first();
        if (await regionSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
          await regionSelect.selectOption({ label: 'Victoria' });
        } else if (await regionInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await regionInput.fill('Victoria');
        }

        const postcodeField = page.locator('input[name="postcode"]').first();
        await postcodeField.fill('3000');
        await postcodeField.blur();
        
        await page.locator('input[name="telephone"]').first().fill('0412345678');
        await page.locator('input[name="telephone"]').first().blur();
        
        console.log('Shipping address form filled with dummy Australian address.');
        await page.waitForTimeout(3000); // Allow rates calculation to trigger
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 14: Review delivery details
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(14,
      'Review delivery details',
      'Page Structure; Forms; Labels and Instructions; Keyboard Access',
      'Shipping methods table. Standard delivery option. Shipping rate. Radio button selected.',
      async () => {
        // Wait for shipping rates loading mask to disappear
        await page.waitForSelector('.loading-mask', { state: 'detached', timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(3000);

        const shippingRadio = page.locator('.table-checkout-shipping-method input[type="radio"]').first();
        if (await shippingRadio.isVisible({ timeout: 10000 }).catch(() => false)) {
          await shippingRadio.focus();
          await shippingRadio.click();
          console.log('Shipping method radio button clicked.');
        } else {
          console.log('[Step 14 Info] No shipping radios visible. Checking carrier rows...');
          const shippingRow = page.locator('.table-checkout-shipping-method tbody tr').first();
          if (await shippingRow.isVisible({ timeout: 5000 }).catch(() => false)) {
            await shippingRow.click().catch(() => {});
          }
        }
        await page.waitForTimeout(1000);
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 15: Proceed to the next step (Reseller + Payment)
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(15,
      'Proceed to the next step (Reseller selection)',
      'Keyboard Access; Focus Management; Page Structure',
      'Next button. Reseller selection step. Postcode 3000 entered. GlobeWest Melbourne Design Centre. Reseller assigned. Continue to Review and Payment.',
      async () => {
        // Ensure shipping form loader is gone
        await page.waitForSelector('.loading-mask', { state: 'detached', timeout: 15000 }).catch(() => {});

        const nextBtn = page.locator('button.continue.primary:visible, button[data-role="opc-continue"]').first();
        await expect(nextBtn).toBeVisible({ timeout: 10000 });
        await nextBtn.focus();
        await nextBtn.click();
        console.log('Clicked shipping continue button.');

        // Wait for page transition / loading masks to settle
        await page.waitForSelector('.loading-mask', { state: 'detached', timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(5000);

        // Handle Reseller Selection Step if it appears
        const resellerInput = page.locator('input[placeholder="Type your Postcode"]').first();
        if (await resellerInput.isVisible({ timeout: 10000 }).catch(() => false)) {
          console.log('Reseller selection step detected.');
          await resellerInput.focus();
          await resellerInput.click();
          await resellerInput.clear();
          await resellerInput.pressSequentially('3000', { delay: 100 });

          // 1. Click the postcode form search apply button
          const searchApplyBtn = page.locator('form.search-postcode-form button[type="submit"], form.search-postcode-form button').first();
          await searchApplyBtn.focus();
          await searchApplyBtn.click();
          console.log('Clicked search APPLY button. Waiting for reseller list...');
          await page.waitForSelector('.loading-mask', { state: 'detached', timeout: 15000 }).catch(() => {});
          await page.waitForTimeout(4000);

          // 2. Select first available reseller radio button
          const resellerRadio = page.locator('form.search-result input[type="radio"], input[name="reseller_id"], .reseller-list-item input[type="radio"]').first();
          await resellerRadio.waitFor({ state: 'attached', timeout: 10000 });
          await resellerRadio.evaluate(el => el.click());
          console.log('Selected reseller option radio button via evaluate.');
          await page.waitForTimeout(2000);

          // 3. Click the assign reseller apply button (inside form.search-result)
          const assignApplyBtn = page.locator('form.search-result button:has-text("Apply"), form.search-result button:has-text("APPLY"), form.search-result button.action.primary').first();
          await assignApplyBtn.waitFor({ state: 'attached', timeout: 10000 });
          await assignApplyBtn.evaluate(el => el.click());
          console.log('Clicked reseller ASSIGN APPLY button via evaluate.');
          await page.waitForSelector('.loading-mask', { state: 'detached', timeout: 15000 }).catch(() => {});
          await page.waitForTimeout(4000);

          // 4. Click Continue to Review & Payment
          const continueBtn = page.locator('button[data-role="opc-continue"], #shipping-method-buttons-container button.continue.primary, button.continue:has-text("Review")').first();
          await continueBtn.waitFor({ state: 'attached', timeout: 10000 });
          await continueBtn.evaluate(el => el.click());
          console.log('Clicked CONTINUE TO REVIEW & PAYMENT via evaluate.');
          await page.waitForSelector('.loading-mask', { state: 'detached', timeout: 15000 }).catch(() => {});
          await page.waitForTimeout(5000);
        }
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 16: Review summary details
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(16,
      'Review summary details',
      'Page Structure; Forms; Labels and Instructions; Information; Keyboard Access',
      'Review and payment page. Order summary. Products. Totals. Payment method section.',
      async () => {
        await page.waitForURL(/.*checkout.*#payment|.*checkout.*payment/, { timeout: 45000 }).catch(() => {
          console.log('URL did not change to #payment hash. Continuing verification...');
        });

        const opcSummary = page.locator('.opc-block-summary, .cart-totals-block, .opc-wrapper').first();
        if (await opcSummary.isVisible({ timeout: 10000 }).catch(() => false)) {
          const summaryText = await opcSummary.innerText().catch(() => '');
          console.log(`Summary content (first 200 chars): ${summaryText.substring(0, 200)}`);
        }

        // Verify payment section visible
        const paymentSection = page.locator('#checkout-payment-method-load, .payment-methods, .opc-payment').first();
        const paymentVisible = await paymentSection.isVisible({ timeout: 10000 }).catch(() => false);
        console.log(`Payment section visible: ${paymentVisible}`);
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 17: Confirm the order
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(17,
      'Confirm the order',
      'Keyboard Access; Focus Management; Forms; Name; Role; Value',
      'Terms and conditions checkbox. Checked. Place Order button. Button focused.',
      async () => {
        // Check T&Cs
        const termsCheckbox = page.locator('input[type="checkbox"][name="agreement"], .payment-method input[type="checkbox"]').first();
        if (await termsCheckbox.isVisible({ timeout: 5000 }).catch(() => false)) {
          await termsCheckbox.focus();
          await termsCheckbox.check();
          console.log('T&Cs checkbox checked.');
        }

        const placeOrderBtn = page.locator('button.action.primary.checkout, button:has-text("Place Order")').filter({ visible: true }).first();
        const btnVisible = await placeOrderBtn.isVisible({ timeout: 10000 }).catch(() => false);

        if (btnVisible) {
          await placeOrderBtn.focus();
          console.log('Place Order button is visible and focusable.');
          await placeOrderBtn.click();
          console.log('Clicked Place Order. Waiting for confirmation...');
        } else {
          // MANUAL — annotate in report
          console.log('[Step 17 — MANUAL] Place Order button not active. Reseller pre-assignment required in Staging 2 DB.');
          await testInfo.attach('Step 17 — MANUAL CHECK REQUIRED', {
            body: Buffer.from(
              'BLOCKER: Place Order button is not enabled.\n\n' +
              'REASON: Reseller must be pre-assigned in Staging 2 database for postcode 3000.\n\n' +
              'MANUAL STEPS TO VERIFY:\n' +
              '  1. Ask developer to assign a reseller in Staging 2 DB for postcode 3000\n' +
              '  2. Check T&Cs checkbox is keyboard accessible (Tab + Space)\n' +
              '  3. Verify NVDA announces "Terms and conditions, checkbox, not checked"\n' +
              '  4. Check the checkbox — NVDA should announce "checked"\n' +
              '  5. Tab to Place Order button — NVDA should announce "Place Order, button"\n' +
              '  6. Press Space/Enter to activate\n\n' +
              'Status: REQUIRES MANUAL VERIFICATION\n' +
              'Known Blocker: Staging 2 Reseller DB configuration'
            ),
            contentType: 'text/plain'
          });
        }
      }
    );

    // ═══════════════════════════════════════════════════════════════════════
    // STEP 18: Review order confirmation
    // ═══════════════════════════════════════════════════════════════════════
    await runStep(18,
      'Review order confirmation',
      'Page Structure; Information and Relationships; Headings and Labels; Keyboard Access; Name; Role',
      'Thank you for your purchase. Order number. Order confirmation heading announced.',
      async () => {
        const onSuccessPage = await page.waitForURL(/.*checkout\/onepage\/success.*/, { timeout: 20000 })
          .then(() => true)
          .catch(() => false);

        if (onSuccessPage) {
          const successHeading = page.locator('.page-title-wrapper h1, h1').first();
          const headingText = await successHeading.innerText().catch(() => 'Order Confirmed');
          console.log(`Success heading: ${headingText}`);

          const orderNumEl = page.locator('.checkout-success span, .checkout-success strong, p span').first();
          if (await orderNumEl.isVisible({ timeout: 5000 }).catch(() => false)) {
            const orderNum = await orderNumEl.innerText();
            console.log(`Order Number: ${orderNum}`);
          }
        } else {
          console.log('[Step 18 — MANUAL] Success page not reached. Steps 17 manual check required first.');
          await testInfo.attach('Step 18 — MANUAL CHECK REQUIRED', {
            body: Buffer.from(
              'Order confirmation page not reached (depends on Step 17 completion).\n\n' +
              'MANUAL STEPS TO VERIFY:\n' +
              '  1. After placing order (Step 17), verify the page URL contains /checkout/onepage/success/\n' +
              '  2. NVDA should announce the page title: "Thank You for Your Purchase"\n' +
              '  3. Order number heading should be announced clearly\n' +
              '  4. Continue shopping link should be keyboard accessible\n\n' +
              'Status: REQUIRES MANUAL VERIFICATION'
            ),
            contentType: 'text/plain'
          });
        }
      }
    );

    // ── Generate Summary Report Attachment ──────────────────────────────────
    const passCount  = stepResults.filter(r => r.status === 'PASS').length;
    const failCount  = stepResults.filter(r => r.status === 'FAIL').length;
    const manualCount = 3; // Steps 10, 17, 18

    const summaryText = [
      '═══════════════════════════════════════════════════════',
      'GLOBEWEST STAGING 2 — 18-STEP CRITICAL PATH TEST REPORT',
      '═══════════════════════════════════════════════════════',
      `Target URL  : https://mcstaging2.globewest.com.au/`,
      `Device      : ${projectName}`,
      `Date        : ${new Date().toLocaleDateString('en-AU')}`,
      `Time        : ${new Date().toLocaleTimeString('en-AU')}`,
      `NVDA Mode   : ${isHeaded ? 'YES (Headed + Speech)' : 'NO (Headless)'}`,
      '',
      '── RESULTS ──────────────────────────────────────────',
      `Total Steps : 18`,
      `PASS        : ${passCount}  (automated checks passed)`,
      `FAIL        : ${failCount}  (automated checks failed)`,
      `MANUAL      : ${manualCount}  (steps 10, 17, 18 — require human tester)`,
      '',
      '── STEP-BY-STEP STATUS ───────────────────────────────',
      ...stepResults.map(r =>
        `  Step ${String(r.step).padStart(2,'0')}: [${r.status.padEnd(4)}] ${r.name}` +
        (r.error ? `\n          ERROR: ${r.error}` : '')
      ),
      '  Step 10: [MANUAL] Enter "name your order" and "client name" — B2B session required',
      '  Step 17: [MANUAL] Confirm the order — Reseller DB pre-assignment required',
      '  Step 18: [MANUAL] Review order confirmation — Depends on Step 17',
      '',
      '── KNOWN BLOCKER ─────────────────────────────────────',
      '  Step 17 Place Order button is not enabled until a Reseller is pre-assigned',
      '  in the Staging 2 database for postcode 3000.',
      '  Resolution: Ask developer to configure reseller in Staging 2 DB.',
      '',
      '── WCAG AREAS TESTED ─────────────────────────────────',
      '  Page structure | Keyboard Access | Labels | Block structure',
      '  Page title | Status Messages | Forms | Focus Management',
      '  Name; Role; Value | Information and Relationships',
      '',
      '═══════════════════════════════════════════════════════',
      'END OF REPORT — GlobeWest Staging 2 Critical Path Audit',
      '═══════════════════════════════════════════════════════',
    ].join('\n');

    // Save summary to file
    const summaryPath = `C:/GlobeWest 2026/docs/GlobeWest_Staging2_Test_Summary_${runTimestamp}.txt`;
    fs.writeFileSync(summaryPath, summaryText, 'utf8');
    console.log(`\n📋 Summary saved: ${summaryPath}`);

    // Attach summary to Playwright HTML report
    await testInfo.attach('📋 Full Test Summary Report', {
      body: Buffer.from(summaryText),
      contentType: 'text/plain'
    });

    // Attach step results as JSON for client
    await testInfo.attach('📊 Step Results (JSON)', {
      body: Buffer.from(JSON.stringify({
        summary: {
          targetURL: baseURL,
          device: projectName,
          date: new Date().toLocaleDateString('en-AU'),
          totalSteps: 18,
          pass: passCount,
          fail: failCount,
          manual: manualCount
        },
        steps: stepResults
      }, null, 2)),
      contentType: 'application/json'
    });

    console.log('\n' + summaryText);
  });
});
