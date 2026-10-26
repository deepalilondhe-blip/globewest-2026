const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '../Sprint-3/Ticket_Trade_Application_Form');
const SCREENSHOTS_DIR = path.join(BASE_DIR, 'screenshots/deep_headed_audit');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const DUMMY_DATA = {
  title: 'Ms',
  firstName: 'Sarah',
  lastName: 'Jenkins',
  email: `sarah.jenkins.design.${Date.now()}@gmail.com`,
  usPhone: '2125550199',
  businessName: 'Jenkins Design Studio LLC',
  ein: '12-3456789',
  entityName: 'Jenkins Interiors Inc',
  streetAddress: '450 Lexington Ave',
  city: 'New York',
  stateCode: 'NY',
  zipcode: '10017',
  numEmployees: '6',
  bizTypeId: '6',
  website: 'https://www.jenkinsinteriors.com',
  instagram: '@jenkins_interiors',
  additionalNotes: 'Boutique high-end design studio.'
};

async function banner(page, selectorOrLocator, text, color = '#10B981', dur = 2500) {
  try {
    const loc = typeof selectorOrLocator === 'string' ? page.locator(selectorOrLocator).first() : selectorOrLocator;
    const isVis = await loc.isVisible({ timeout: 1500 }).catch(() => false);
    if (!isVis) return;
    await loc.scrollIntoViewIfNeeded({ timeout: 1000 }).catch(() => {});
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
      tag.style.fontSize = '13px';
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

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form, button[aria-label="Close"]');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

(async () => {
  console.log('========================================================================');
  console.log('🚀 RUNNING HEADED MODE DEEP AUDIT: TRADE APPLICATION FORM VS FIGMA');
  console.log('Target URL: https://mcstaging2.globewest.com/gwcustomer/trade/create');
  console.log('Figma Spec: Globewest USA - External -> [FINAL] Designs - September Changes');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Navigate to US Staging Trade Application
  console.log('🌐 Step 1: Navigating to Trade Application...');
  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await clearOverlays(page);
  await page.waitForTimeout(2000);

  // Capture Header Data
  console.log('🔍 Inspecting Header & Navigation...');
  const headerData = await page.evaluate(() => {
    const topBar = document.querySelector('.c-header-utility, .header-utility, .utility-bar, .panel.wrapper');
    const navItems = Array.from(document.querySelectorAll('.navigation .level0, nav.navigation li.level0')).map(el => el.innerText.trim());
    const wishlistIcon = document.querySelector('.action.towishlist, .wishlist-link, a[href*="wishlist"], svg.icon-heart, i.fa-heart, [class*="wishlist"]');
    const searchBox = document.querySelector('#search, input[name="q"]');
    const cartIcon = document.querySelector('.action.showcart, a[href*="checkout/cart"]');
    const loginLink = document.querySelector('.customer-welcome, a[href*="customer/account/login"]');

    return {
      topBarText: topBar ? topBar.innerText.replace(/\s+/g, ' ').trim() : '',
      navItems,
      hasWishlistIcon: wishlistIcon !== null,
      searchPlaceholder: searchBox ? searchBox.placeholder : '',
      cartVisible: cartIcon !== null,
      loginText: loginLink ? loginLink.innerText.trim() : ''
    };
  });
  console.log('  Header Nav Items:', headerData.navItems);
  console.log('  Wishlist Icon Present:', headerData.hasWishlistIcon);
  console.log('  Search Placeholder:', headerData.searchPlaceholder);

  // Check Breadcrumbs
  const breadcrumbs = await page.evaluate(() => {
    const el = document.querySelector('.breadcrumbs');
    return el ? el.innerText.replace(/\s+/g, ' ').trim() : '';
  });
  console.log('  Breadcrumbs Live:', breadcrumbs);

  // Inspect Step 1 Content & Copy
  console.log('\n📝 Inspecting Step 1 (Contact Details)...');
  const step1Data = await page.evaluate(() => {
    const title = document.querySelector('.gwcustomer-title, h1.page-title, h1');
    const subtitle = document.querySelector('.gwcustomer-subtitle, h2');
    // Find p tag inside main container above the form
    const introP = document.querySelector('.column.main > p, .page-main p, .gwcustomer-title ~ p, form#step1 p');
    const stepCount = document.querySelector('.step-count, .current-step, .wizard-step');
    const titleSelect = document.querySelector('#title');
    const firstName = document.querySelector('#first_name');
    const lastName = document.querySelector('#last_name');
    const email = document.querySelector('#email');
    const mobilePhone = document.querySelector('#mobile_phone');
    const phone = document.querySelector('#phone');

    return {
      h1: title ? title.innerText.trim() : '',
      h1Font: title ? window.getComputedStyle(title).fontFamily : '',
      h1Size: title ? window.getComputedStyle(title).fontSize : '',
      subtitle: subtitle ? subtitle.innerText.trim() : '',
      introCopy: introP ? introP.innerText.trim() : '',
      stepCount: stepCount ? stepCount.innerText.trim() : '',
      titleOptions: titleSelect ? Array.from(titleSelect.options).map(o => o.text.trim()) : [],
      mobilePlaceholder: mobilePhone ? mobilePhone.placeholder : '',
      phonePlaceholder: phone ? phone.placeholder : ''
    };
  });
  console.log('  Step 1 H1:', step1Data.h1, `(${step1Data.h1Font}, ${step1Data.h1Size})`);
  console.log('  Step 1 Subtitle:', step1Data.subtitle);
  console.log('  Step 1 Intro Copy:', step1Data.introCopy);
  console.log('  Title Options:', step1Data.titleOptions);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_LIVE_STEP1_INITIAL.png'), fullPage: false });

  // Visual Banner on Step 1 Title
  await banner(page, '.gwcustomer-title, h1', 'Auditing Step 1 Header & Typography', '#3B82F6', 1500);

  // Fill Step 1 with valid US test data
  console.log('\n✍️ Entering Realistic US Test Data into Step 1...');
  await page.selectOption('#title', { value: DUMMY_DATA.title }).catch(async () => {
    await page.selectOption('#title', { label: 'Ms' }).catch(() => {});
  });
  await page.fill('#first_name', DUMMY_DATA.firstName);
  await page.fill('#last_name', DUMMY_DATA.lastName);
  await page.fill('#email', DUMMY_DATA.email);
  await page.fill('#mobile_phone', DUMMY_DATA.usPhone);
  await page.fill('#phone', DUMMY_DATA.usPhone);

  await banner(page, '#mobile_phone', `US Phone: ${DUMMY_DATA.usPhone}`, '#10B981', 1500);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_LIVE_STEP1_FILLED.png'), fullPage: false });

  // Submit Step 1
  console.log('👉 Submitting Step 1...');
  await page.click('form#step1 button[type="submit"], #step1 button:has-text("Next")');
  await page.waitForTimeout(3000);
  await clearOverlays(page);

  // Check if error occurred or if Step 2 loaded
  const step1Errors = await page.evaluate(() => {
    const errs = Array.from(document.querySelectorAll('.mage-error, [id*="-error"]')).filter(e => e.offsetParent !== null).map(e => e.innerText.trim());
    return errs;
  });
  console.log('  Step 1 Validation Errors:', step1Errors);

  // STEP 2 AUDIT
  console.log('\n🏢 Inspecting Step 2 (Business Details)...');
  await page.waitForSelector('#business_name', { timeout: 10000 });
  await page.waitForTimeout(1500);

  const step2Elements = await page.evaluate(() => {
    const backBtn = document.querySelector('.action.back, a.back, a[href*="back"], button.back') || Array.from(document.querySelectorAll('a, button')).find(el => el.innerText.toUpperCase().includes('BACK'));
    const stepCount = document.querySelector('.step-count, .current-step') || Array.from(document.querySelectorAll('span, div')).find(el => /^[123]\/3$/.test(el.innerText.trim()));
    const heading = document.querySelector('h2.gwcustomer-subtitle, h2') || Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Business'));
    
    // Labels and inputs
    const bizLabel = document.querySelector('label[for="business_name"]');
    const bizInput = document.querySelector('#business_name');
    
    const einLabel = document.querySelector('label[for="abn"], label[for="ein"]') || Array.from(document.querySelectorAll('label')).find(l => l.innerText.includes('EIN') || l.innerText.includes('ABN'));
    const einInput = document.querySelector('#abn, #ein, input[name="abn"], input[name="ein"]');
    
    const entityLabel = document.querySelector('label[for="entity_name"]');
    const entityInput = document.querySelector('#entity_name');
    
    const addressLabel = document.querySelector('label[for="head_office_street_address"]');
    const addressInput = document.querySelector('#head_office_street_address');
    
    const cityLabel = document.querySelector('label[for="suburb"], label[for="city"]');
    const cityInput = document.querySelector('#suburb, #city');
    
    const stateLabel = document.querySelector('label[for="state"]');
    const stateSelect = document.querySelector('#state');
    
    const zipLabel = document.querySelector('label[for="postcode"], label[for="zipcode"]');
    const zipInput = document.querySelector('#postcode, #zipcode');
    
    const empLabel = document.querySelector('label[for="number_of_employees"]');
    const empInput = document.querySelector('#number_of_employees');
    
    const bizTypeLabel = document.querySelector('label[for="primary_business_type"]');
    const bizTypeSelect = document.querySelector('#primary_business_type');
    
    const commLabel = Array.from(document.querySelectorAll('label, .legend, div.label')).find(l => l.innerText.toUpperCase().includes('COMMERCIAL PROJECTS'));
    const commRadios = Array.from(document.querySelectorAll('input[name*="commercial"]')).map(r => ({ value: r.value, id: r.id }));
    
    const spendLabel = Array.from(document.querySelectorAll('label, .legend, div.label')).find(l => l.innerText.toUpperCase().includes('AVERAGE YEARLY SPEND'));
    const spendOptions = Array.from(document.querySelectorAll('input[name*="spend"]')).map(r => {
      const lbl = document.querySelector(`label[for="${r.id}"]`) || r.parentElement;
      return { value: r.value, label: lbl ? lbl.innerText.trim() : '' };
    });
    
    const addlServicesLabel = Array.from(document.querySelectorAll('label, .legend')).find(l => l.innerText.toUpperCase().includes('ADDITIONAL SERVICES'));
    const nextBtn = document.querySelector('form#step2 button[type="submit"], #step2 button.action.submit, #step2 button');
    const signIn = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toLowerCase().includes('sign in'));
    
    return {
      backBtn: backBtn ? { text: backBtn.innerText.trim(), tag: backBtn.tagName, className: backBtn.className } : null,
      stepCount: stepCount ? stepCount.innerText.trim() : '',
      heading: heading ? { text: heading.innerText.trim(), font: window.getComputedStyle(heading).fontFamily, size: window.getComputedStyle(heading).fontSize } : null,
      bizName: { label: bizLabel ? bizLabel.innerText.trim() : '', placeholder: bizInput ? bizInput.placeholder : '' },
      ein: { label: einLabel ? einLabel.innerText.trim() : '', placeholder: einInput ? einInput.placeholder : '' },
      entity: { label: entityLabel ? entityLabel.innerText.trim() : '', placeholder: entityInput ? entityInput.placeholder : '' },
      address: { label: addressLabel ? addressLabel.innerText.trim() : '', placeholder: addressInput ? addressInput.placeholder : '' },
      city: { label: cityLabel ? cityLabel.innerText.trim() : '', placeholder: cityInput ? cityInput.placeholder : '' },
      state: {
        label: stateLabel ? stateLabel.innerText.trim() : '',
        defaultOptionText: stateSelect && stateSelect.options[0] ? stateSelect.options[0].text.trim() : '',
        totalOptions: stateSelect ? stateSelect.options.length : 0
      },
      zipcode: { label: zipLabel ? zipLabel.innerText.trim() : '', placeholder: zipInput ? zipInput.placeholder : '' },
      employees: { label: empLabel ? empLabel.innerText.trim() : '', placeholder: empInput ? empInput.placeholder : '' },
      bizType: { label: bizTypeLabel ? bizTypeLabel.innerText.trim() : '', defaultText: bizTypeSelect && bizTypeSelect.options[0] ? bizTypeSelect.options[0].text.trim() : '' },
      commercial: { label: commLabel ? commLabel.innerText.trim() : '', radios: commRadios },
      spend: { label: spendLabel ? spendLabel.innerText.trim() : '', options: spendOptions },
      addlServices: { label: addlServicesLabel ? addlServicesLabel.innerText.trim() : '' },
      nextBtn: nextBtn ? { text: nextBtn.innerText.trim(), bg: window.getComputedStyle(nextBtn).backgroundColor, color: window.getComputedStyle(nextBtn).color, borderRadius: window.getComputedStyle(nextBtn).borderRadius } : null,
      signIn: signIn ? { text: signIn.innerText.trim(), fullParentText: signIn.parentElement ? signIn.parentElement.innerText.trim() : '' } : null
    };
  });

  console.log('\n📊 DETAILED STEP 2 LIVE INSPECTION RESULTS:');
  console.log(JSON.stringify(step2Elements, null, 2));

  // Visual Banners for Key Fields on Live UI
  await banner(page, '.action.back, a:has-text("BACK"), a:has-text("GO BACK")', `Back CTA: "${step2Elements.backBtn?.text}"`, '#10B981', 1500);
  await banner(page, 'label[for="head_office_street_address"]', `Street Address: "${step2Elements.address.label}"`, step2Elements.address.label.includes('*') ? '#EF4444' : '#10B981', 1500);
  await banner(page, '#state', `State Default: "${step2Elements.state.defaultOptionText}" (${step2Elements.state.totalOptions} states)`, '#10B981', 1500);
  await banner(page, '#number_of_employees', `Employees Placeholder: "${step2Elements.employees.placeholder}"`, '#10B981', 1500);

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_LIVE_STEP2_INITIAL.png'), fullPage: false });

  // Populating Step 2 with US Test Data
  console.log('\n✍️ Entering Realistic US Test Data into Step 2...');
  await page.fill('#business_name', DUMMY_DATA.businessName);
  await page.fill('input[name="ein"], #abn', DUMMY_DATA.ein);
  await page.fill('#entity_name', DUMMY_DATA.entityName);
  await page.fill('#head_office_street_address', DUMMY_DATA.streetAddress);
  await page.fill('#suburb', DUMMY_DATA.city);

  await page.evaluate(() => {
    const s = document.querySelector('#state');
    if (s) { s.value = 'NY'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    const b = document.querySelector('#primary_business_type');
    if (b) { b.value = '6'; b.dispatchEvent(new Event('change', { bubbles: true })); }
  });

  await page.fill('#postcode', DUMMY_DATA.zipcode);
  await page.fill('#number_of_employees', DUMMY_DATA.numEmployees);

  // Click Commercial Projects Yes
  await page.click('input[name="commercial_projects"][value="1"], input[id*="commercial"][value="1"]').catch(() => {});
  // Click Yearly Spend 30k +
  await page.click('input[name="average_yearly_spend"][value*="30"], input[id*="spend"][value*="30"]').catch(() => {});

  await banner(page, 'form#step2 button[type="submit"]', 'Advancing to Step 3...', '#3B82F6', 1500);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_LIVE_STEP2_FILLED.png'), fullPage: false });

  // Submit Step 2 to inspect Step 3
  console.log('👉 Submitting Step 2 to reach Step 3...');
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(4000);
  await clearOverlays(page);

  // STEP 3 AUDIT
  console.log('\n📋 Inspecting Step 3...');
  const step3Data = await page.evaluate(() => {
    const heading = document.querySelector('h2.gwcustomer-subtitle, h2, .gwcustomer-title');
    const inputs = Array.from(document.querySelectorAll('form#step3 input, form#step3 select, form#step3 textarea')).map(el => ({
      id: el.id,
      name: el.name,
      type: el.type,
      placeholder: el.placeholder,
      label: document.querySelector(`label[for="${el.id}"]`) ? document.querySelector(`label[for="${el.id}"]`).innerText.trim() : ''
    }));
    const stepCount = document.querySelector('.step-count, .current-step') || Array.from(document.querySelectorAll('span, div')).find(el => /^[123]\/3$/.test(el.innerText.trim()));
    const submitBtn = document.querySelector('form#step3 button[type="submit"]');

    return {
      heading: heading ? heading.innerText.trim() : '',
      stepCount: stepCount ? stepCount.innerText.trim() : '',
      inputs,
      submitBtnText: submitBtn ? submitBtn.innerText.trim() : ''
    };
  });

  console.log('  Step 3 Heading:', step3Data.heading);
  console.log('  Step 3 Step Count:', step3Data.stepCount);
  console.log('  Step 3 Inputs:', step3Data.inputs);
  console.log('  Step 3 Submit CTA:', step3Data.submitBtnText);

  await banner(page, 'h2, .gwcustomer-subtitle', `Step 3: "${step3Data.heading}" (${step3Data.stepCount})`, '#10B981', 2000);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_LIVE_STEP3_INITIAL.png'), fullPage: false });

  // Check Footer Leaks
  console.log('\n🦶 Inspecting Footer Localization on US Trade Form...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);

  const footerData = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    const footerText = footer ? footer.innerText : '';
    const hasAuBadge = footerText.toLowerCase().includes('australian owned') || document.querySelector('img[alt*="Australian Owned"], .c-footer__badge') !== null;
    const hasShopOutlet = footerText.toLowerCase().includes('shop outlet');
    const showroomText = footerText.includes('VISIT OUR SHOWROOMS');
    const copyright = Array.from(document.querySelectorAll('small.copyright, .copyright, .footer-copyright')).map(c => c.innerText.trim());

    return {
      hasAuBadge,
      hasShopOutlet,
      showroomText,
      copyright
    };
  });
  console.log('  Footer AU Badge Leaked:', footerData.hasAuBadge);
  console.log('  Footer Shop Outlet Leaked:', footerData.hasShopOutlet);
  console.log('  Footer Copyright:', footerData.copyright);

  if (footerData.hasAuBadge) {
    await banner(page, 'footer', '🔴 DEFECT: Australian Owned & Run badge leaked on US Storefront', '#EF4444', 2500);
  }
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_LIVE_FOOTER_AUDIT.png'), fullPage: false });

  // Save audit data to JSON
  const auditReport = {
    header: headerData,
    breadcrumbs,
    step1: step1Data,
    step1Errors,
    step2: step2Elements,
    step3: step3Data,
    footer: footerData,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(BASE_DIR, 'SCRATCH_DEEP_HEADED_AUDIT_DATA.json'),
    JSON.stringify(auditReport, null, 2)
  );

  console.log('\n========================================================================');
  console.log('✅ HEADED AUDIT FINISHED SUCCESSFULLY! Data saved.');
  console.log('========================================================================');

  await page.waitForTimeout(4000);
  await browser.close();
})();
