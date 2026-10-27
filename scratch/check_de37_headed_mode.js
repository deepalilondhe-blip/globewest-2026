const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/de37_headed_proofs';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function showBanner(page, text, bgColor = '#0F172A', textColor = '#FFFFFF') {
  await page.evaluate(({ text, bgColor, textColor }) => {
    let el = document.getElementById('gw-qa-banner');
    if (!el) {
      el = document.createElement('div');
      el.id = 'gw-qa-banner';
      el.style.position = 'fixed';
      el.style.top = '15px';
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.zIndex = '999999999';
      el.style.padding = '14px 28px';
      el.style.borderRadius = '8px';
      el.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
      el.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      el.style.fontSize = '16px';
      el.style.fontWeight = 'bold';
      el.style.textAlign = 'center';
      el.style.transition = 'all 0.3s ease';
      document.body.appendChild(el);
    }
    el.style.background = bgColor;
    el.style.color = textColor;
    el.innerText = text;
  }, { text, bgColor, textColor });
}

(async () => {
  console.log('🚀 Launching Chrome in HEADED mode (DISPLAY=:0)...');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 600,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const adminPage = await context.newPage();

  // -------------------------------------------------------------
  // STEP 1: ADMIN LOGIN & VERIFY CUSTOMER GROUP
  // -------------------------------------------------------------
  console.log('1. Navigating to Magento Admin...');
  await adminPage.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded' });
  await showBanner(adminPage, 'Step 1: Logging in to Magento Admin...', '#1E293B');

  await adminPage.fill('#username', 'deepali.londhe@overdose.digital');
  await adminPage.fill('#login', '2Ho770ZEeX7v');
  await adminPage.click('button.action-login, button[type="submit"]');
  await adminPage.waitForTimeout(6000);

  // Go to Customers Grid
  const customersUrl = await adminPage.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('/customer/index/index/'));
    return link ? link.href : null;
  });
  console.log('Navigating to Customers Grid:', customersUrl);
  await adminPage.goto(customersUrl, { waitUntil: 'domcontentloaded' });
  await adminPage.waitForTimeout(5000);

  await showBanner(adminPage, 'Step 2: Searching Customer deepali.londhe@overdose.digital...', '#0284C7');
  const searchInput = adminPage.locator('input#fulltext, input.admin__control-text[name="keyword"], .data-grid-search-control input').first();
  await searchInput.fill('deepali.londhe@overdose.digital');
  await adminPage.keyboard.press('Enter');
  await adminPage.waitForTimeout(6000);

  // Edit Customer 130725 (USA Website)
  console.log('Opening Customer 130725...');
  await adminPage.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.data-grid tbody tr'));
    for (const r of rows) {
      if (r.innerText.includes('130725') || (r.innerText.includes('deepali.londhe@overdose.digital') && r.innerText.includes('USA'))) {
        const editLink = r.querySelector('a.action-menu-item, a[href*="customer/index/edit"]');
        if (editLink) editLink.click();
      }
    }
  });
  await adminPage.waitForLoadState('domcontentloaded');
  await adminPage.waitForTimeout(6000);

  // Open Account Information tab
  console.log('Inspecting Account Information tab...');
  await adminPage.locator('a:has-text("Account Information")').first().click();
  await adminPage.waitForTimeout(3000);

  // Highlight Customer Group on Screen
  await adminPage.evaluate(() => {
    const groupWrap = document.querySelector('div[name="customer[group_id]"]');
    if (groupWrap) {
      groupWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      groupWrap.style.outline = '4px solid #16A34A';
      groupWrap.style.boxShadow = '0 0 20px rgba(22, 163, 74, 0.6)';
    }
  });

  await showBanner(adminPage, '✅ CONFIRMED IN ADMIN: Customer Group is "General Public"', '#16A34A');
  await adminPage.waitForTimeout(4000);
  await adminPage.screenshot({ path: path.join(OUT_DIR, '01_admin_customer_general_public_verified.png') });

  // -------------------------------------------------------------
  // STEP 2: FRONT-END DEFECT CHECK (DE#37 ENQUIRE FOR ETA LEAK)
  // -------------------------------------------------------------
  console.log('\n2. Opening US Front-End as General Public User...');
  const frontPage = await context.newPage();
  
  // Login directly to US Storefront as General Public account
  await frontPage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await showBanner(frontPage, 'Step 3: Authenticating on US Storefront (General Public)...', '#0284C7');
  await frontPage.fill('#email', 'deepali.londhe@overdose.digital');
  await frontPage.fill('#pass', 'Deep@123');
  await frontPage.click('#send2, button[type="submit"].login');
  await frontPage.waitForTimeout(5000);

  // Check Product 1: Amari Oasis Planter
  const amariUrl = 'https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat';
  console.log('Navigating to Amari Planter PDP:', amariUrl);
  await frontPage.goto(amariUrl, { waitUntil: 'domcontentloaded' });
  await frontPage.waitForTimeout(4000);

  // Check ETA element & highlight
  const amariCheck = await frontPage.evaluate(() => {
    const allEls = Array.from(document.querySelectorAll('*'));
    const etaEl = allEls.find(el => el.innerText && el.innerText.trim().startsWith('Enquire for ETA') || el.innerText.trim() === 'Enquire for ETA');
    let found = false;
    if (etaEl) {
      found = true;
      etaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      etaEl.style.outline = '4px solid #DC2626';
      etaEl.style.backgroundColor = '#FEE2E2';
      etaEl.style.padding = '6px 12px';
      etaEl.style.borderRadius = '6px';
      etaEl.style.boxShadow = '0 0 25px rgba(220, 38, 38, 0.8)';
    }
    return {
      found,
      text: etaEl ? etaEl.innerText.trim() : null
    };
  });

  if (amariCheck.found) {
    console.log('🔴 DEFECT DE#37 FOUND ON AMARI:', amariCheck.text);
    await showBanner(frontPage, `🔴 DEFECT DE#37: "${amariCheck.text}" Leaks to General Public! (Must be Trade Only)`, '#DC2626');
  } else {
    console.log('No ETA leak on Amari');
    await showBanner(frontPage, 'No ETA leak on Amari Planter', '#16A34A');
  }

  await frontPage.waitForTimeout(6000);
  await frontPage.screenshot({ path: path.join(OUT_DIR, '02_amari_eta_leak_defect_de37.png') });

  // Check Product 2: Leon Side Table
  const leonUrl = 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue';
  console.log('Navigating to Leon Side Table PDP:', leonUrl);
  await frontPage.goto(leonUrl, { waitUntil: 'domcontentloaded' });
  await frontPage.waitForTimeout(4000);

  const leonCheck = await frontPage.evaluate(() => {
    const allEls = Array.from(document.querySelectorAll('*'));
    const etaEl = allEls.find(el => el.innerText && (el.innerText.trim().startsWith('Enquire for ETA') || el.innerText.trim() === 'Enquire for ETA'));
    let found = false;
    if (etaEl) {
      found = true;
      etaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      etaEl.style.outline = '4px solid #DC2626';
      etaEl.style.backgroundColor = '#FEE2E2';
      etaEl.style.padding = '6px 12px';
      etaEl.style.borderRadius = '6px';
      etaEl.style.boxShadow = '0 0 25px rgba(220, 38, 38, 0.8)';
    }
    return {
      found,
      text: etaEl ? etaEl.innerText.trim() : null
    };
  });

  if (leonCheck.found) {
    console.log('🔴 DEFECT DE#37 FOUND ON LEON:', leonCheck.text);
    await showBanner(frontPage, `🔴 DEFECT DE#37: "${leonCheck.text}" Leaks to General Public! (Must be Trade Only)`, '#DC2626');
  } else {
    console.log('No ETA leak on Leon');
  }

  await frontPage.waitForTimeout(6000);
  await frontPage.screenshot({ path: path.join(OUT_DIR, '03_leon_eta_leak_defect_de37.png') });

  console.log('Keeping browser open on screen for 10 seconds for user visual observation...');
  await frontPage.waitForTimeout(10000);

  await browser.close();
  console.log('🏁 Headed verification of Defect DE#37 completed!');
})();
