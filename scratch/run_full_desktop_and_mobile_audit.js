const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../Sprint-3/Ticket_Trade_Application_Form');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots/deep_headed_audit');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--start-maximized', '--no-sandbox']
  });

  // =========================================================================
  // 1. DESKTOP VIEWPORT: Capture Lower Half of Step 2 & Full Step 3
  // =========================================================================
  console.log('🖥️ 1. Running Desktop Audit...');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dPage = await desktopContext.newPage();

  await dPage.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
  await dPage.waitForTimeout(2000);

  // Fill Step 1
  await dPage.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await dPage.fill('#first_name', 'Sarah');
  await dPage.fill('#last_name', 'Jenkins');
  await dPage.fill('#email', `sarah.jenkins.${Date.now()}@example.com`);
  await dPage.fill('#mobile_phone', '2125550199');
  await dPage.fill('#phone', '2125550199');
  await dPage.click('form#step1 button[type="submit"]');
  await dPage.waitForTimeout(3000);

  // Step 2 reached
  await dPage.waitForSelector('#business_name', { timeout: 10000 });

  // Scroll down on Step 2 to capture the lower half (Radio buttons, Spend, Next CTA, Sign in link)
  await dPage.evaluate(() => {
    const el = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await dPage.waitForTimeout(1000);
  await dPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'DESKTOP_STEP2_LOWER_HALF.png') });

  // Extract Lower Step 2 Micro-UI styles
  const lowerStep2Styles = await dPage.evaluate(() => {
    const commLabel = Array.from(document.querySelectorAll('label, .legend, div.label')).find(l => l.innerText.toUpperCase().includes('COMMERCIAL PROJECTS'));
    const spendLabel = Array.from(document.querySelectorAll('label, .legend, div.label')).find(l => l.innerText.toUpperCase().includes('AVERAGE YEARLY SPEND'));
    const spendRadios = Array.from(document.querySelectorAll('input[name*="spend"]')).map(r => {
      const lbl = document.querySelector(`label[for="${r.id}"]`) || r.parentElement;
      return { id: r.id, value: r.value, label: lbl ? lbl.innerText.trim() : '' };
    });
    const nextBtn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit, #step2 button');
    const signIn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toLowerCase().includes('sign in'));

    return {
      commLabelText: commLabel ? commLabel.innerText.trim() : '',
      spendLabelText: spendLabel ? spendLabel.innerText.trim() : '',
      spendRadios,
      nextBtn: nextBtn ? {
        text: nextBtn.innerText.trim(),
        borderRadius: window.getComputedStyle(nextBtn).borderRadius,
        backgroundColor: window.getComputedStyle(nextBtn).backgroundColor,
        padding: window.getComputedStyle(nextBtn).padding,
        height: nextBtn.offsetHeight,
        width: nextBtn.offsetWidth
      } : null,
      signIn: signIn ? {
        text: signIn.innerText.trim(),
        fullParentText: signIn.parentElement ? signIn.parentElement.innerText.trim() : '',
        underline: window.getComputedStyle(signIn).textDecorationLine
      } : null
    };
  });
  console.log('Desktop Lower Step 2 Micro-UI:', JSON.stringify(lowerStep2Styles, null, 2));

  // Fill Step 2 to advance to Step 3
  await dPage.fill('#business_name', 'Jenkins Design Studio LLC');
  await dPage.fill('input[name="ein"], #abn', '12-3456789');
  await dPage.fill('#entity_name', 'Jenkins Interiors Inc');
  await dPage.fill('#head_office_street_address', '450 Lexington Ave');
  const cityLoc = dPage.locator('#suburb, #city, input[name="suburb"], input[name="city"]').first();
  await cityLoc.fill('New York');

  await dPage.evaluate(() => {
    const s = document.querySelector('#state');
    if (s) { s.value = 'NY'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    const b = document.querySelector('#primary_business_type');
    if (b) { b.value = '6'; b.dispatchEvent(new Event('change', { bubbles: true })); }
    const cr = document.querySelector('#commercial-projects-yes, input[name*="commercial"]');
    if (cr) { cr.checked = true; cr.dispatchEvent(new Event('change', { bubbles: true })); }
    const sr = document.querySelector('#yearly-spend-30, input[name*="spend"]');
    if (sr) { sr.checked = true; sr.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  await dPage.fill('#postcode', '10017');
  await dPage.fill('#number_of_employees', '6');

  // Submit Step 2
  await dPage.evaluate(() => {
    const btn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit');
    if (btn) btn.click();
  });
  await dPage.waitForTimeout(4000);

  // Capture Step 3 full view
  await dPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'DESKTOP_STEP3_TOP.png') });
  await dPage.evaluate(() => window.scrollBy(0, 400));
  await dPage.waitForTimeout(1000);
  await dPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'DESKTOP_STEP3_BOTTOM.png') });

  await desktopContext.close();

  // =========================================================================
  // 2. MOBILE VIEWPORT (390 x 844 iPhone 14 Standard): Headed Inspection
  // =========================================================================
  console.log('\n📱 2. Running Mobile Audit (390 x 844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mPage = await mobileContext.newPage();

  await mPage.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });
  await mPage.waitForTimeout(2000);

  await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'MOBILE_STEP1_INITIAL.png') });

  // Fill Step 1 on Mobile
  await mPage.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await mPage.fill('#first_name', 'Sarah');
  await mPage.fill('#last_name', 'Jenkins');
  await mPage.fill('#email', `sarah.jenkins.m.${Date.now()}@example.com`);
  await mPage.fill('#mobile_phone', '2125550199');
  await mPage.fill('#phone', '2125550199');

  await mPage.click('form#step1 button[type="submit"]');
  await mPage.waitForTimeout(3000);

  await mPage.waitForSelector('#business_name', { timeout: 10000 });
  await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'MOBILE_STEP2_TOP.png') });

  // Scroll down on Mobile Step 2
  await mPage.evaluate(() => window.scrollBy(0, 500));
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'MOBILE_STEP2_MID.png') });

  await mPage.evaluate(() => window.scrollBy(0, 600));
  await mPage.waitForTimeout(1000);
  await mPage.screenshot({ path: path.join(SCREENSHOTS_DIR, 'MOBILE_STEP2_BOTTOM.png') });

  console.log('Mobile screenshots captured successfully.');

  await mobileContext.close();
  await browser.close();

  console.log('✅ Audit script completed cleanly.');
})();
