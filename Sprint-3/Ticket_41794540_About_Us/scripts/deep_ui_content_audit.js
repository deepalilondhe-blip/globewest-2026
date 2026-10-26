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

async function clearOverlays(page) {
  await page.evaluate(() => {
    const overlays = document.querySelectorAll('#lpshroud, [id*="Survey"], [id*="lp"], .modal-popup, .newsletter-modal, .ui-widget-overlay, #cookie-status, .klaviyo-close-form');
    overlays.forEach(el => el.remove());
  }).catch(() => {});
}

async function scrollPageFully(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 120);
    });
  });
  await page.waitForTimeout(2000);
}

// Function to extract comprehensive computed styles and content metrics of all about-us sections
async function extractPageMetrics(page) {
  return await page.evaluate(() => {
    function getCleanStyles(el) {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily ? cs.fontFamily.split(',')[0].replace(/['"]/g, '') : '',
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
        marginTop: cs.marginTop,
        marginBottom: cs.marginBottom,
        textAlign: cs.textAlign,
        borderRadius: cs.borderRadius,
        border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`
      };
    }

    const mainDivs = Array.from(document.querySelectorAll('.column.main > div'));

    // 1. Hero Banner
    const hero = document.querySelector('.about-us-top-image') || mainDivs[0];
    const heroH2 = hero ? hero.querySelector('h2') : null;
    const heroH3 = hero ? hero.querySelector('h3') : null;
    const heroImg = hero ? hero.querySelector('img') : null;

    // 2. Our Vision
    const visionDiv = mainDivs.find(d => d.innerText.includes('Our Vision'));
    const visionH2 = visionDiv ? visionDiv.querySelector('h2') : null;
    const visionP = visionDiv ? visionDiv.querySelector('p') : null;

    // 3. Our Business / Founders
    const businessDiv = mainDivs.find(d => d.innerText.includes('Our Business') && d !== hero);
    const businessH2 = businessDiv ? businessDiv.querySelector('h2') : null;
    const businessPs = businessDiv ? Array.from(businessDiv.querySelectorAll('p')) : [];
    const businessImg = businessDiv ? businessDiv.querySelector('img') : null;

    // 4. Design Diversity
    const diversityDiv = mainDivs.find(d => d.innerText.includes('Design Diversity'));
    const diversityH2 = diversityDiv ? diversityDiv.querySelector('h2') : null;
    const diversityP = diversityDiv ? diversityDiv.querySelector('p') : null;

    // 5. Diversity 5 Cards
    const cardsDiv = mainDivs.find(d => d.innerText.includes('Contemporary') && d.innerText.includes('Retreat'));
    const cardLinks = cardsDiv ? Array.from(cardsDiv.querySelectorAll('a, .column, [class*="column"]')) : [];
    const cards = cardLinks.map(c => {
      const img = c.querySelector('img');
      const title = c.innerText.trim();
      return {
        title,
        cardStyles: getCleanStyles(c),
        imgStyles: getCleanStyles(img),
        imgSrc: img ? img.getAttribute('src') : ''
      };
    });

    // 6. Quote
    const quoteDiv = mainDivs.find(d => d.innerText.includes('We are so grateful') || d.innerText.includes('Stephen Mendel'));
    const quoteText = quoteDiv ? (quoteDiv.querySelector('p, blockquote') || quoteDiv) : null;

    // 7. Brand Video
    const videoDiv = mainDivs.find(d => d.innerText.includes('Our Brand') || d.querySelector('video, iframe, [class*="video"]'));
    const videoH3 = videoDiv ? videoDiv.querySelector('h3') : null;

    // 8. Our Approach
    const approachDiv = mainDivs.find(d => d.innerText.includes('Our Approach') && !d.classList.contains('our-approach'));
    const approachH2 = approachDiv ? approachDiv.querySelector('h2') : null;
    const approachIntro = approachDiv ? approachDiv.querySelector('p') : null;
    const approachListItems = approachDiv ? Array.from(approachDiv.querySelectorAll('p, li')).map(p => ({
      text: p.innerText.trim(),
      styles: getCleanStyles(p)
    })) : [];

    // 9. Team Photo
    const teamDiv = document.querySelector('.our-approach') || mainDivs.find(d => d.classList.contains('our-approach'));
    const teamImg = teamDiv ? teamDiv.querySelector('img') : null;

    // 10. Careers
    const careersDiv = mainDivs.find(d => d.innerText.includes('Careers'));
    const careersH2 = careersDiv ? careersDiv.querySelector('h2') : null;
    const careersP = careersDiv ? careersDiv.querySelector('p') : null;
    const careersBtns = careersDiv ? Array.from(careersDiv.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.getAttribute('href'),
      styles: getCleanStyles(a)
    })) : [];

    return {
      hero: {
        container: getCleanStyles(hero),
        h2: { text: heroH2 ? heroH2.innerText.trim() : '', styles: getCleanStyles(heroH2) },
        h3: { text: heroH3 ? heroH3.innerText.trim() : '', styles: getCleanStyles(heroH3) },
        img: { src: heroImg ? heroImg.getAttribute('src') : '', styles: getCleanStyles(heroImg) }
      },
      vision: {
        container: getCleanStyles(visionDiv),
        h2: { text: visionH2 ? visionH2.innerText.trim() : '', styles: getCleanStyles(visionH2) },
        p: { text: visionP ? visionP.innerText.trim() : '', styles: getCleanStyles(visionP) }
      },
      business: {
        container: getCleanStyles(businessDiv),
        h2: { text: businessH2 ? businessH2.innerText.trim() : '', styles: getCleanStyles(businessH2) },
        pCount: businessPs.length,
        pStyles: businessPs.map(p => getCleanStyles(p)),
        img: { src: businessImg ? businessImg.getAttribute('src') : '', styles: getCleanStyles(businessImg) }
      },
      diversity: {
        container: getCleanStyles(diversityDiv),
        h2: { text: diversityH2 ? diversityH2.innerText.trim() : '', styles: getCleanStyles(diversityH2) },
        p: { text: diversityP ? diversityP.innerText.trim() : '', styles: getCleanStyles(diversityP) },
        cardsContainer: getCleanStyles(cardsDiv),
        cards
      },
      quote: {
        container: getCleanStyles(quoteDiv),
        text: { text: quoteText ? quoteText.innerText.trim() : '', styles: getCleanStyles(quoteText) }
      },
      video: {
        container: getCleanStyles(videoDiv),
        h3: { text: videoH3 ? videoH3.innerText.trim() : '', styles: getCleanStyles(videoH3) }
      },
      approach: {
        container: getCleanStyles(approachDiv),
        h2: { text: approachH2 ? approachH2.innerText.trim() : '', styles: getCleanStyles(approachH2) },
        intro: { text: approachIntro ? approachIntro.innerText.trim() : '', styles: getCleanStyles(approachIntro) },
        listItems: approachListItems
      },
      team: {
        container: getCleanStyles(teamDiv),
        img: { src: teamImg ? teamImg.getAttribute('src') : '', styles: getCleanStyles(teamImg) }
      },
      careers: {
        container: getCleanStyles(careersDiv),
        h2: { text: careersH2 ? careersH2.innerText.trim() : '', styles: getCleanStyles(careersH2) },
        p: { text: careersP ? careersP.innerText.trim() : '', styles: getCleanStyles(careersP) },
        buttons: careersBtns
      }
    };
  });
}

(async () => {
  console.log('🚀 Launching Deep Content & Micro-UI Comparison Script...');
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ];

  const fullReport = {
    generatedAt: new Date().toISOString(),
    viewports: {}
  };

  for (const vp of viewports) {
    console.log(`\n========================================================================`);
    console.log(`🔎 AUDITING VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})`);
    console.log(`========================================================================`);

    // 1. AU Baseline
    console.log(`   🔐 Logging into AU Baseline (${vp.name})...`);
    const auContext = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const auPage = await auContext.newPage();
    await auPage.goto(`${AU_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await clearOverlays(auPage);
    const auEmail = auPage.locator('#email');
    if (await auEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
      await auEmail.fill(AU_CREDS.email);
      await auPage.fill('#pass', AU_CREDS.pass);
      await auPage.click('#send2');
      await auPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await auPage.waitForTimeout(2000);
    }
    await auPage.goto(`${AU_BASE}/about-us`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await auPage.waitForTimeout(3000);
    await clearOverlays(auPage);
    await scrollPageFully(auPage);
    const auMetrics = await extractPageMetrics(auPage);
    await auContext.close();

    // 2. US Staging
    console.log(`   🔐 Logging into US Staging Target (${vp.name})...`);
    const usContext = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const usPage = await usContext.newPage();
    await usPage.goto(`${US_BASE}/customer/account/login/`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await clearOverlays(usPage);
    const usEmail = usPage.locator('#email');
    if (await usEmail.isVisible({ timeout: 5000 }).catch(() => false)) {
      await usEmail.fill(US_CREDS.email);
      await usPage.fill('#pass', US_CREDS.pass);
      await usPage.click('#send2');
      await usPage.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
      await usPage.waitForTimeout(2000);
    }
    await usPage.goto(`${US_BASE}/about-us`, { timeout: 60000, waitUntil: 'domcontentloaded' });
    await usPage.waitForTimeout(3000);
    await clearOverlays(usPage);
    await scrollPageFully(usPage);
    const usMetrics = await extractPageMetrics(usPage);
    await usContext.close();

    fullReport.viewports[vp.name] = {
      au: auMetrics,
      us: usMetrics
    };
  }

  await browser.close();

  const outJson = path.join(BASE_DIR, 'about_us_deep_ui_audit_metrics.json');
  fs.writeFileSync(outJson, JSON.stringify(fullReport, null, 2));
  console.log(`\n💾 Saved detailed metrics comparison to: ${outJson}`);
})();
