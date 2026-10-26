const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const US_BASE = 'https://mcstaging2.globewest.com';
const LIVE_AU_BASE = 'https://www.globewest.com.au';

const PAGES = [
  { id: 'privacy', name: 'Privacy Policy', usPath: '/privacy-policy', auPath: '/privacy-policy' },
  { id: 'terms', name: 'Terms & Conditions', usPath: '/terms-and-conditions-page', auPath: '/terms-and-conditions-page' },
  { id: 'contact', name: 'Contact Us', usPath: '/contact-us', auPath: '/contact' },
  { id: 'faq', name: 'Help Centre / FAQ', usPath: '/help-centre', auPath: '/help-centre' },
  { id: '404', name: '404 Page Not Found', usPath: '/dfsdfd', auPath: '/dfsdfd' }
];

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function extractFullContent(page) {
  return await page.evaluate(() => {
    // 1. Text blocks
    const mainEl = document.querySelector('.column.main, main') || document.body;
    
    const headings = Array.from(mainEl.querySelectorAll('h1, h2, h3, h4, h5')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim(),
      fontSize: window.getComputedStyle(h).fontSize,
      fontWeight: window.getComputedStyle(h).fontWeight
    })).filter(h => h.text.length > 0);

    const paragraphs = Array.from(mainEl.querySelectorAll('p, li')).map(p => ({
      tag: p.tagName,
      text: p.innerText.trim(),
      fontSize: window.getComputedStyle(p).fontSize
    })).filter(p => p.text.length > 0);

    // 2. Links
    const links = Array.from(mainEl.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href') || ''
    })).filter(a => a.href.length > 0 && !a.href.startsWith('javascript:'));

    // 3. Form elements
    const forms = Array.from(mainEl.querySelectorAll('form')).map(f => {
      const inputs = Array.from(f.querySelectorAll('input, select, textarea')).map(i => ({
        name: i.name,
        type: i.type || i.tagName.toLowerCase(),
        placeholder: i.placeholder || '',
        required: i.required || i.classList.contains('required-entry')
      }));
      return { id: f.id, inputs };
    });

    // 4. Buttons
    const buttons = Array.from(mainEl.querySelectorAll('button, .action.primary, .btn')).map(b => ({
      text: b.innerText.trim(),
      disabled: b.disabled
    })).filter(b => b.text.length > 0);

    return {
      title: document.title,
      rawTextLength: mainEl.innerText.length,
      headings,
      paragraphsCount: paragraphs.length,
      sampleParagraphs: paragraphs.slice(0, 10),
      linksCount: links.length,
      links: links.slice(0, 20),
      forms,
      buttons
    };
  });
}

(async () => {
  console.log('========================================================================');
  console.log('🔬 METICULOUS WORD-BY-WORD & ELEMENT-BY-ELEMENT CONTENT CROSS-VERIFICATION');
  console.log('   Checking US Staging vs Live AU across Desktop (1440px) & Mobile (390px)');
  console.log('========================================================================\n');

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });

  const auditReport = {
    timestamp: new Date().toISOString(),
    pages: {}
  };

  // 1. DESKTOP COMPARISON (1440x900)
  const dtContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dtPage = await dtContext.newPage();

  for (const p of PAGES) {
    console.log(`▶ Auditing [DESKTOP]: ${p.name}...`);
    auditReport.pages[p.id] = { name: p.name, desktop: {}, mobile: {} };

    // US Desktop
    await dtPage.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await dtPage.waitForTimeout(2000);
    await clearOverlays(dtPage);
    auditReport.pages[p.id].desktop.us = await extractFullContent(dtPage);

    // AU Live Desktop
    await dtPage.goto(`${LIVE_AU_BASE}${p.auPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await dtPage.waitForTimeout(2000);
    await clearOverlays(dtPage);
    auditReport.pages[p.id].desktop.au_live = await extractFullContent(dtPage);
  }
  await dtContext.close();

  // 2. MOBILE COMPARISON (390x844)
  const mobContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });
  const mobPage = await mobContext.newPage();

  for (const p of PAGES) {
    console.log(`▶ Auditing [MOBILE]: ${p.name}...`);

    // US Mobile
    await mobPage.goto(`${US_BASE}${p.usPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await mobPage.waitForTimeout(2000);
    await clearOverlays(mobPage);
    const usMob = await extractFullContent(mobPage);
    usMob.scrollWidth = await mobPage.evaluate(() => document.body.scrollWidth);
    usMob.hasOverflow = usMob.scrollWidth > 390;
    auditReport.pages[p.id].mobile.us = usMob;

    // AU Live Mobile
    await mobPage.goto(`${LIVE_AU_BASE}${p.auPath}`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await mobPage.waitForTimeout(2000);
    await clearOverlays(mobPage);
    const auMob = await extractFullContent(mobPage);
    auMob.scrollWidth = await mobPage.evaluate(() => document.body.scrollWidth);
    auMob.hasOverflow = auMob.scrollWidth > 390;
    auditReport.pages[p.id].mobile.au_live = auMob;
  }
  await mobContext.close();

  await browser.close();

  const outPath = path.join(BASE_DIR, 'meticulous_content_audit_results.json');
  fs.writeFileSync(outPath, JSON.stringify(auditReport, null, 2));
  console.log(`\n💾 Saved detailed word-by-word content report to: ${outPath}`);
  console.log('🎉 Audit finished successfully!');
})();
