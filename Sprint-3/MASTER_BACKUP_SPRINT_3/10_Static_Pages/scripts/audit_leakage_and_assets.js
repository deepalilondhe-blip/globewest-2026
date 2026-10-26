const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const pages = [
    { name: 'Terms', url: 'https://mcstaging2.globewest.com/terms-and-conditions-page' },
    { name: 'Privacy', url: 'https://mcstaging2.globewest.com/privacy-policy' },
    { name: 'Contact Us', url: 'https://mcstaging2.globewest.com/contact-us' },
    { name: 'Help Centre', url: 'https://mcstaging2.globewest.com/help-centre' },
    { name: '404', url: 'https://mcstaging2.globewest.com/non-existent-page-404-test' }
  ];

  for (const p of pages) {
    await page.goto(p.url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const issues = await page.evaluate(() => {
      const text = document.body.innerText;
      const auEmails = text.match(/[a-zA-Z0-9._%+-]+@globewest\.com\.au/gi) || [];
      const auUrls = text.match(/https?:\/\/[a-zA-Z0-9.-]*globewest\.com\.au[^\s"'<>]+/gi) || [];
      const auMentions = text.match(/\b(Australia|Australian|ACN|ABN|Victoria|Melbourne|PPSA)\b/gi) || [];
      
      const imgs = Array.from(document.querySelectorAll('main img'));
      const brokenImgs = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(i => i.src);
      
      return {
        title: document.title,
        auEmails: Array.from(new Set(auEmails)),
        auUrls: Array.from(new Set(auUrls)),
        auMentionsCount: auMentions.length,
        auMentionsSample: Array.from(new Set(auMentions)),
        brokenImgs
      };
    });
    console.log(`=== ${p.name} (${p.url}) ===`);
    console.log('Title:', issues.title);
    console.log('AU Emails:', issues.auEmails);
    console.log('AU URLs:', issues.auUrls);
    console.log('AU Mentions Count:', issues.auMentionsCount, 'Sample:', issues.auMentionsSample);
    console.log('Broken Images:', issues.brokenImgs);
    console.log();
  }
  await browser.close();
})();
