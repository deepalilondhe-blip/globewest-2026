const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const US_BASE = 'https://mcstaging2.globewest.com';
const AU_BASE = 'https://mcstaging2.globewest.com.au';

const US_CREDS = {
  email: 'deepali.londhe@overdose.digital',
  pass: 'Deep@123'
};

const AU_CREDS = {
  email: 'deepalilondhe576@gmail.com',
  pass: 'Deep@123'
};

const PAGES = [
  { id: 'privacy', name: 'Privacy Policy', auPath: '/privacy-policy', usPath: '/privacy-policy' },
  { id: 'terms', name: 'Terms & Conditions', auPath: '/terms-and-conditions-page', usPath: '/terms-and-conditions-page' },
  { id: 'contact', name: 'Contact Us', auPath: '/contact', usPath: '/contact-us' },
  { id: 'faq', name: 'Help Centre / FAQ', auPath: '/help-centre', usPath: '/help-centre' },
  { id: '404', name: '404 Page Not Found', auPath: '/non-existent-page-404-test', usPath: '/non-existent-page-404-test' }
];

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function extractDetailedMetrics(page, pageId) {
  return await page.evaluate((pid) => {
    function getCleanStyles(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        text: (el.innerText || '').slice(0, 80).replace(/\n/g, ' ').trim(),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily ? cs.fontFamily.split(',')[0].replace(/['"]/g, '') : '',
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        margin: `${cs.marginTop} ${cs.marginRight} ${cs.marginBottom} ${cs.marginLeft}`,
        borderRadius: cs.borderRadius,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`
      };
    }

    const docTitle = document.title;
    const h1s = Array.from(document.querySelectorAll('h1')).map(getCleanStyles);
    const h2s = Array.from(document.querySelectorAll('.column.main h2, main h2')).map(getCleanStyles);
    const h3s = Array.from(document.querySelectorAll('.column.main h3, main h3')).map(getCleanStyles);
    const sampleP = getCleanStyles(document.querySelector('.column.main p, main p'));

    // Check specific elements per page
    let pageSpecific = {};

    if (pid === 'privacy') {
      const cookieTable = document.querySelector('table');
      pageSpecific = {
        hasCookieTable: !!cookieTable,
        tableStyles: getCleanStyles(cookieTable),
        sectionsCount: document.querySelectorAll('.column.main h2').length
      };
    } else if (pid === 'terms') {
      const tabs = Array.from(document.querySelectorAll('.tabs button, .tabs a, [role="tab"]')).map(getCleanStyles);
      const accordionHeaders = Array.from(document.querySelectorAll('button[aria-expanded], .accordion-title, div[data-role="collapsible"]')).map(getCleanStyles);
      pageSpecific = {
        tabsCount: tabs.length,
        tabs: tabs.map(t => t.text),
        accordionHeadersCount: accordionHeaders.length
      };
    } else if (pid === 'contact') {
      const form = document.querySelector('form#contact-form, form');
      const inputs = Array.from(document.querySelectorAll('form input:not([type="hidden"]), form textarea, form select')).map(el => ({
        id: el.id,
        name: el.name,
        type: el.type || el.tagName.toLowerCase(),
        required: el.required || el.classList.contains('required-entry'),
        styles: getCleanStyles(el)
      }));
      pageSpecific = {
        hasForm: !!form,
        inputsCount: inputs.length,
        inputs: inputs.map(i => ({ name: i.name, required: i.required, type: i.type })),
        showroomsList: Array.from(document.querySelectorAll('.showrooms h3, .showroom-title, h3')).map(e => e.innerText.trim()).filter(Boolean)
      };
    } else if (pid === 'faq') {
      const searchInput = document.querySelector('input[type="search"], input#search, .search input');
      const cards = Array.from(document.querySelectorAll('.category-card, .faq-category, .card')).map(getCleanStyles);
      pageSpecific = {
        hasSearchInput: !!searchInput,
        searchStyles: getCleanStyles(searchInput),
        cardsCount: cards.length
      };
    } else if (pid === '404') {
      const mainErrorH2 = getCleanStyles(document.querySelector('.column.main h2, .not-found h2, main h2'));
      pageSpecific = {
        mainErrorH2
      };
    }

    // Asset verification
    const images = Array.from(document.querySelectorAll('main img')).map(img => ({
      src: img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      isBroken: !img.complete || img.naturalWidth === 0,
      isPlaceholder: (img.src || '').includes('/placeholder/default/')
    }));

    return {
      title: docTitle,
      h1s,
      h2s,
      h3s,
      sampleP,
      pageSpecific,
      imagesCount: images.length,
      brokenImages: images.filter(i => i.isBroken),
      placeholders: images.filter(i => i.isPlaceholder)
    };
  }, pageId);
}

(async () => {
  console.log('========================================================================');
  console.log('🔬 DEEP CROSS-VERIFICATION OF STATIC PAGES (PIXEL-PERFECT & CSS METRICS)');
  console.log('   Terms, Privacy, Contact, FAQ, 404');
  console.log('   Testing AU Baseline vs US Target (Authenticated & Public Modes)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  const fullReport = {
    timestamp: new Date().toISOString(),
    pages: {}
  };

  // 1. DESKTOP AUTHENTICATED AUDIT (AU & US)
  console.log('▶ [1/4] AUDITING AU BASELINE (DESKTOP - AUTHENTICATED)...');
  const auContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const auPage = await auContext.newPage();
  await auPage.goto(`${AU_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await auPage.waitForTimeout(2000);
  await clearOverlays(auPage);
  if (await auPage.locator('#email').isVisible({ timeout: 5000 }).catch(() => false)) {
    await auPage.fill('#email', AU_CREDS.email);
    await auPage.fill('#pass', AU_CREDS.pass);
    await auPage.click('#send2');
    await auPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await auPage.waitForTimeout(2000);
  }

  for (const p of PAGES) {
    console.log(`   Auditing AU: ${p.name}...`);
    await auPage.goto(`${AU_BASE}${p.auPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await auPage.waitForTimeout(3000);
    await clearOverlays(auPage);

    if (!fullReport.pages[p.id]) fullReport.pages[p.id] = {};
    fullReport.pages[p.id].au_auth_desktop = await extractDetailedMetrics(auPage, p.id);
  }
  await auContext.close();

  console.log('\n▶ [2/4] AUDITING US TARGET (DESKTOP - AUTHENTICATED)...');
  const usContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const usPage = await usContext.newPage();
  await usPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
  await usPage.waitForTimeout(2000);
  await clearOverlays(usPage);
  if (await usPage.locator('#email').isVisible({ timeout: 5000 }).catch(() => false)) {
    await usPage.fill('#email', US_CREDS.email);
    await usPage.fill('#pass', US_CREDS.pass);
    await usPage.click('#send2');
    await usPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await usPage.waitForTimeout(2000);
  }

  for (const p of PAGES) {
    console.log(`   Auditing US: ${p.name}...`);
    await usPage.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await usPage.waitForTimeout(3000);
    await clearOverlays(usPage);

    fullReport.pages[p.id].us_auth_desktop = await extractDetailedMetrics(usPage, p.id);
  }
  await usContext.close();

  // 3. LOGGED-OUT PUBLIC BROWSING CHECK
  console.log('\n▶ [3/4] AUDITING US TARGET (DESKTOP - LOGGED OUT PUBLIC BROWSING)...');
  const pubContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pubPage = await pubContext.newPage();
  for (const p of PAGES) {
    console.log(`   Auditing Public US: ${p.name}...`);
    await pubPage.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await pubPage.waitForTimeout(2000);
    await clearOverlays(pubPage);

    const pubData = await pubPage.evaluate(() => {
      const topBarText = document.querySelector('.panel.wrapper, .header.content')?.innerText || '';
      return {
        hasBecomeTradeCustomer: topBarText.includes('Become a Trade Customer') || topBarText.includes('Trade Customer'),
        hasLoginLink: topBarText.includes('Login') || topBarText.includes('Sign In'),
        title: document.title
      };
    });
    fullReport.pages[p.id].us_logged_out = pubData;
  }
  await pubContext.close();

  // 4. MOBILE RESPONSIVE METRICS (390x844)
  console.log('\n▶ [4/4] AUDITING US TARGET (MOBILE 390x844 RESPONSIVE)...');
  const mobContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });
  const mobPage = await mobContext.newPage();
  for (const p of PAGES) {
    console.log(`   Auditing Mobile US: ${p.name}...`);
    await mobPage.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await mobPage.waitForTimeout(2000);
    await clearOverlays(mobPage);

    const mobData = await mobPage.evaluate(() => {
      return {
        bodyScrollWidth: document.body.scrollWidth,
        viewportWidth: window.innerWidth,
        hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
        h1FontSize: window.getComputedStyle(document.querySelector('h1') || document.body).fontSize,
        h2FontSize: window.getComputedStyle(document.querySelector('h2') || document.body).fontSize
      };
    });
    fullReport.pages[p.id].us_mobile_responsive = mobData;
  }
  await mobContext.close();

  await browser.close();

  const outJson = path.join(BASE_DIR, 'deep_static_pages_verification_report.json');
  fs.writeFileSync(outJson, JSON.stringify(fullReport, null, 2));
  console.log(`\n💾 Saved exhaustive verification report to: ${outJson}`);
  console.log('🎉 Deep cross-verification completed successfully!');
})();
