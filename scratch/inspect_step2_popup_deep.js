const path = require('path');
const { chromium } = require(path.resolve(__dirname, '../GlobeWest 2026/node_modules/playwright'));

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();
  
  const requests = [];
  page.on('request', req => {
    requests.push({ url: req.url(), method: req.method() });
  });

  await page.goto('https://mcstaging2.globewest.com/gwcustomer/trade/create', { waitUntil: 'domcontentloaded' });

  // Step 1
  await page.selectOption('#title', { value: 'Ms' }).catch(() => {});
  await page.fill('#first_name', 'Deepali');
  await page.fill('#last_name', 'Londhe');
  await page.fill('#email', 'deepali.londhe@overdose.digital');
  await page.fill('#mobile_phone', '2125550199');
  await page.click('form#step1 button[type="submit"]');
  await page.waitForTimeout(2000);

  // Search Step 2 architecture
  const domInfo = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.textContent || '');
    const relevantScripts = scripts.filter(t => 
      t.toLowerCase().includes('popup') || 
      t.toLowerCase().includes('duplicate') || 
      t.toLowerCase().includes('already exists') || 
      t.toLowerCase().includes('ein')
    );
    
    const modals = Array.from(document.querySelectorAll('div[class*="modal"], div[class*="popup"], div[id*="popup"], div[id*="modal"], [data-role*="modal"]')).map(d => ({
      className: d.className,
      id: d.id,
      dataRole: d.getAttribute('data-role'),
      text: d.innerText.trim().slice(0, 100)
    }));

    // Check form#step2 submit event listeners
    const form2 = document.querySelector('form#step2');
    const submitBtn = document.querySelector('form#step2 button[type="submit"]');

    return {
      relevantScriptsCount: relevantScripts.length,
      relevantScripts: relevantScripts.map(s => s.slice(0, 400)),
      modals,
      hasForm2: !!form2,
      submitBtnAction: submitBtn ? submitBtn.className : 'none'
    };
  });

  console.log('=== DOM INFO ON STEP 2 ===');
  console.log('Modals in DOM:', domInfo.modals);
  console.log('Scripts matching keywords:', domInfo.relevantScriptsCount);
  domInfo.relevantScripts.forEach((s, idx) => console.log(`Script ${idx}:\n`, s));

  // Fill Step 2
  await page.fill('#business_name', 'Jenkins Design Studio LLC');
  await page.fill('input[name="ein"], #abn', '12-3456789');
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

  requests.length = 0; // reset
  console.log('\n👉 Clicking Step 2 Next button...');
  await page.click('form#step2 button[type="submit"]');
  await page.waitForTimeout(3000);

  const ajaxRequests = requests.filter(r => !r.url.endsWith('.png') && !r.url.endsWith('.jpg') && !r.url.endsWith('.woff2') && !r.url.endsWith('.css'));
  console.log('\nRequests triggered on Step 2 click:', ajaxRequests);

  const postState = await page.evaluate(() => {
    const visiblePopups = Array.from(document.querySelectorAll('.modal-popup._show, [data-role="modal"]._show, .ui-dialog:not([style*="display: none"]), .message-error:not([style*="display: none"])')).map(el => ({
      class: el.className,
      text: el.innerText
    }));
    const step2Active = document.querySelector('#step2') && window.getComputedStyle(document.querySelector('#step2')).display !== 'none';
    const step3Active = document.querySelector('#step3') && window.getComputedStyle(document.querySelector('#step3')).display !== 'none';
    return { visiblePopups, step2Active, step3Active };
  });

  console.log('\nPost Click State:', postState);

  await browser.close();
})();
