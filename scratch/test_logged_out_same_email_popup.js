const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../Sprint-3/Ticket_Trade_Application_Form/screenshots/logged_out_same_email_check');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function banner(page, selectorOrLocator, text, color = '#10B981', dur = 2000) {
  try {
    const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
    const isVis = await loc.isVisible({ timeout: 1500 }).catch(() => false);
    if (!isVis) return;
    await loc.scrollIntoViewIfNeeded({ timeout: 800 }).catch(() => {});
    await loc.evaluate((el, { t, c, d }) => {
      const prevOutline = el.style.outline;
      el.style.outline = `3px solid ${c}`;
      const tag = document.createElement('div');
      tag.className = 'qa-headed-tag';
      tag.textContent = t;
      tag.style.position = 'absolute';
      tag.style.top = '-28px';
      tag.style.left = '0';
      tag.style.background = c;
      tag.style.color = '#ffffff';
      tag.style.fontSize = '14px';
      tag.style.fontWeight = 'bold';
      tag.style.padding = '4px 10px';
      tag.style.borderRadius = '4px';
      tag.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      tag.style.zIndex = '999999';
      tag.style.whiteSpace = 'nowrap';
      tag.style.pointerEvents = 'none';
      if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.appendChild(tag);
      setTimeout(() => {
        el.style.outline = prevOutline;
        tag.remove();
      }, d);
    }, { t: text, c: color, d: dur });
    await page.waitForTimeout(dur);
  } catch (e) {}
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 TESTING LOGGED OUT DUPLICATE EMAIL CHECK (HEADED MODE)');
  console.log('Target: mcstaging2.globewest.com/gwcustomer/trade/create');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // 1. Force complete logout first
  console.log('🚪 Step 1: Navigating to Logout to ensure 100% guest state...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/logout/', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Clear all cookies and local/session storage
  await context.clearCookies();
  await page.goto('https://mcstaging2.globewest.com/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.waitForTimeout(1500);

  // 2. Navigate to Trade Application
  console.log('🌐 Step 2: Navigating to Trade Application Form as GUEST...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // Close any cookie/marketing banner
  await page.evaluate(() => {
    const btn = document.querySelector('#onetrust-accept-btn-handler, .btn-accept, .cookie-accept');
    if (btn) btn.click();
  });

  // Verify guest state in header
  const headerState = await page.evaluate(() => {
    const loginLink = document.querySelector('.customer-welcome, a[href*="customer/account/login"]');
    return loginLink ? loginLink.innerText.trim() : 'Unknown';
  });
  console.log('  Header Account Status:', headerState);

  // 3. Fill Step 1 with existing Trade Email
  const existingEmail = 'deepali.londhe@overdose.digital';
  console.log(`📝 Step 3: Filling Step 1 with Existing Email: ${existingEmail}...`);
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Deepali');
  await page.fill('#last_name', 'Londhe');
  await page.fill('#email', existingEmail);
  await page.fill('#mobile_phone', '2125550199');
  await page.fill('#phone', '2125550198');

  await banner(page, '#email', `Using Existing Account Email: ${existingEmail}`, '#EF4444', 2500);

  const step1Screenshot = path.join(OUTPUT_DIR, '01_STEP1_SAME_EMAIL_ENTERED.png');
  await page.screenshot({ path: step1Screenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step1Screenshot}`);

  // Submit Step 1
  console.log('👉 Submitting Step 1...');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(3000);

  // 4. Inspect Step 2
  await page.waitForSelector('#business_name', { timeout: 10000 });
  console.log('🏢 Step 4: On Step 2. Filling Business Details + Same EIN...');

  const sameEin = '12-3456789';
  await page.fill('#business_name', 'Deepali Trade Studio LLC');
  await page.fill('input[name="ein"], #abn', sameEin);
  await page.fill('#entity_name', 'Deepali Trade Entity LLC');
  await page.fill('#head_office_street_address', '450 Lexington Ave');
  const cityLoc = page.locator('#suburb, #city, input[name="suburb"], input[name="city"]').first();
  await cityLoc.fill('New York');

  await page.evaluate(() => {
    const s = document.querySelector('#state');
    if (s) { s.value = 'NY'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    const b = document.querySelector('#primary_business_type');
    if (b) { b.value = '6'; b.dispatchEvent(new Event('change', { bubbles: true })); }
    const cr = document.querySelector('#commercial-projects-yes, input[name*="commercial"]');
    if (cr) { cr.checked = true; cr.dispatchEvent(new Event('change', { bubbles: true })); }
    const sr = document.querySelector('#yearly-spend-30, input[name*="spend"]');
    if (sr) { sr.checked = true; sr.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  await page.fill('#postcode', '10017');
  await page.fill('#number_of_employees', '5');

  await banner(page, 'input[name="ein"], #abn', `EIN: ${sameEin} (Duplicate Candidate)`, '#EF4444', 2500);

  const step2Screenshot = path.join(OUTPUT_DIR, '02_STEP2_SAME_EIN_FILLED.png');
  await page.screenshot({ path: step2Screenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step2Screenshot}`);

  // Track network requests when clicking NEXT on Step 2
  const networkRequests = [];
  page.on('request', req => {
    if (!req.url().endsWith('.png') && !req.url().endsWith('.jpg') && !req.url().endsWith('.css') && !req.url().endsWith('.woff2')) {
      networkRequests.push({ url: req.url(), method: req.method() });
    }
  });

  // Click Step 2 NEXT button
  console.log('\n👉 Clicking Step 2 NEXT button to observe if popup appears...');
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(3500);

  // Inspect if any popup or modal appeared
  const postStep2State = await page.evaluate(() => {
    const visiblePopups = Array.from(document.querySelectorAll('.modal-popup._show, [data-role="modal"]._show, .ui-dialog:not([style*="display: none"]), .message-error:not([style*="display: none"])')).map(el => ({
      class: el.className,
      text: el.innerText.trim()
    }));
    const step2Visible = document.querySelector('#step2') && window.getComputedStyle(document.querySelector('#step2')).display !== 'none';
    const step3Visible = document.querySelector('#step3') && window.getComputedStyle(document.querySelector('#step3')).display !== 'none';
    const heading = document.querySelector('h2.gwcustomer-subtitle, h2, .gwcustomer-title');

    return {
      visiblePopups,
      step2Visible,
      step3Visible,
      headingText: heading ? heading.innerText.trim() : ''
    };
  });

  console.log('\n📊 Step 2 Post-Click State:', postStep2State);
  console.log('📡 Network requests on click:', networkRequests);

  // Annotate result on page
  if (postStep2State.step3Visible && postStep2State.visiblePopups.length === 0) {
    console.log('🚨 RESULT: Step 3 reached directly! NO Step 2 duplicate popup appeared!');
    await page.evaluate(() => {
      const bannerDiv = document.createElement('div');
      bannerDiv.id = 'qa-defect-banner';
      bannerDiv.style.cssText = 'position: fixed; top: 80px; left: 50%; transform: translateX(-50%); background: #DC2626; color: #FFFFFF; font-size: 16px; font-weight: bold; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); z-index: 999999; border: 2px solid #FFFFFF; text-align: center;';
      bannerDiv.innerHTML = '❌ DEFECT CONFIRMED: NO STEP 2 POPUP!<br/><span style=\"font-size: 13px; font-weight: normal;\">Duplicate email (deepali.londhe@overdose.digital) + EIN (12-3456789) passed cleanly to Step 3 without duplicate popup.</span>';
      document.body.appendChild(bannerDiv);
    });
    await page.waitForTimeout(1000);
  }

  const step3Screenshot = path.join(OUTPUT_DIR, '03_RESULT_NO_POPUP_ADVANCED_TO_STEP3.png');
  await page.screenshot({ path: step3Screenshot, fullPage: false });
  console.log(`  📸 Screenshot saved: ${step3Screenshot}`);

  fs.writeFileSync(path.join(OUTPUT_DIR, 'test_summary.json'), JSON.stringify({
    testedEmail: existingEmail,
    testedEin: sameEin,
    headerState,
    postStep2State,
    networkRequests
  }, null, 2));

  await browser.close();
  console.log('\n✅ Testing complete!');
})();
