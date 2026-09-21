const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const US_URL = 'https://mcstaging2.globewest.com';
const AU_URL = 'https://mcstaging2.globewest.com.au';

const OUT_DIR = path.join(__dirname, '../../Footer_Live_Inspection');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Starting Headed Chrome to inspect US Footer vs AU Footer...');
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // 1. Inspect US Footer
  console.log(`\n============================================================`);
  console.log(`🌐 NAVIGATING TO US STAGING: ${US_URL}`);
  console.log(`============================================================`);
  await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(5000);

  // Scroll down to footer
  console.log('Scrolling to US footer...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);

  const usFooterLocator = page.locator('footer.page-footer, .footer.content').first();
  await usFooterLocator.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(2000);

  // Extract US Footer details
  const usData = await page.evaluate(() => {
    const footer = document.querySelector('footer.page-footer, .footer.content');
    if (!footer) return null;

    // Social links
    const socialLinks = Array.from(footer.querySelectorAll('.social-links-footer a')).map(a => ({
      class: a.className,
      href: a.href,
      ariaLabel: a.getAttribute('aria-label'),
      title: a.getAttribute('title')
    }));

    // Newsletter
    const newsletter = footer.querySelector('.newsletter_custom, .newsletter-custom');
    const newsletterText = newsletter ? newsletter.innerText.trim() : '';
    const newsletterLinks = newsletter ? Array.from(newsletter.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    })) : [];

    // Showroom block
    const showroom = footer.querySelector('.visit-showroom-footer');
    const showroomText = showroom ? showroom.innerText.trim() : '';
    const showroomLinks = showroom ? Array.from(showroom.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    })) : [];

    // Design logo / Australian Owned badge
    const designLogo = footer.querySelector('.design-logo-footer');
    const designLogoImgs = designLogo ? Array.from(designLogo.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      class: img.className
    })) : [];

    // Column links
    const columnLinks = Array.from(footer.querySelectorAll('.footer-links a, .js-footer-links a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    }));

    // Bottom legal bar
    const bottomLinks = footer.querySelector('.links-footer-bottom');
    const bottomText = bottomLinks ? bottomLinks.innerText.trim() : '';
    const bottomHrefList = bottomLinks ? Array.from(bottomLinks.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    })) : [];

    return {
      socialLinks,
      newsletterText,
      newsletterLinks,
      showroomText,
      showroomLinks,
      designLogoImgs,
      columnLinks,
      bottomText,
      bottomHrefList
    };
  });

  console.log('\n📊 US FOOTER DATA:');
  console.log(JSON.stringify(usData, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, 'us_footer_data.json'), JSON.stringify(usData, null, 2));

  // Screenshot US Footer
  const usFooterShot = await page.locator('footer.page-footer').screenshot().catch(async () => {
    return await page.screenshot({ fullPage: false });
  });
  fs.writeFileSync(path.join(OUT_DIR, '01_US_FOOTER_FULL.png'), usFooterShot);
  fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/01_US_FOOTER_FULL.png', usFooterShot);
  console.log('📸 Captured 01_US_FOOTER_FULL.png');

  // 2. Inspect AU Baseline Footer
  console.log(`\n============================================================`);
  console.log(`🌐 NAVIGATING TO AU BASELINE: ${AU_URL}`);
  console.log(`============================================================`);
  try {
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);

    const auData = await page.evaluate(() => {
      const footer = document.querySelector('footer.page-footer, .footer.content');
      if (!footer) return null;

      const socialLinks = Array.from(footer.querySelectorAll('.social-links-footer a')).map(a => ({
        class: a.className,
        href: a.href,
        ariaLabel: a.getAttribute('aria-label'),
        title: a.getAttribute('title')
      }));

      const newsletter = footer.querySelector('.newsletter_custom, .newsletter-custom');
      const newsletterText = newsletter ? newsletter.innerText.trim() : '';
      const newsletterLinks = newsletter ? Array.from(newsletter.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })) : [];

      const showroom = footer.querySelector('.visit-showroom-footer');
      const showroomText = showroom ? showroom.innerText.trim() : '';
      const showroomLinks = showroom ? Array.from(showroom.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })) : [];

      const designLogo = footer.querySelector('.design-logo-footer');
      const designLogoImgs = designLogo ? Array.from(designLogo.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt,
        class: img.className
      })) : [];

      const columnLinks = Array.from(footer.querySelectorAll('.footer-links a, .js-footer-links a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      }));

      const bottomLinks = footer.querySelector('.links-footer-bottom');
      const bottomText = bottomLinks ? bottomLinks.innerText.trim() : '';
      const bottomHrefList = bottomLinks ? Array.from(bottomLinks.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href
      })) : [];

      return {
        socialLinks,
        newsletterText,
        newsletterLinks,
        showroomText,
        showroomLinks,
        designLogoImgs,
        columnLinks,
        bottomText,
        bottomHrefList
      };
    });

    console.log('\n📊 AU FOOTER DATA:');
    console.log(JSON.stringify(auData, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, 'au_footer_data.json'), JSON.stringify(auData, null, 2));

    const auFooterShot = await page.locator('footer.page-footer').screenshot().catch(async () => {
      return await page.screenshot({ fullPage: false });
    });
    fs.writeFileSync(path.join(OUT_DIR, '02_AU_FOOTER_FULL.png'), auFooterShot);
    fs.writeFileSync('/home/deepali/.gemini/antigravity-ide/brain/4375b821-29fa-4315-8e2a-cf6f6b43a60c/02_AU_FOOTER_FULL.png', auFooterShot);
    console.log('📸 Captured 02_AU_FOOTER_FULL.png');
  } catch (e) {
    console.error('AU fetch error:', e.message);
  }

  await browser.close();
  console.log('\nAudit complete.');
})();
