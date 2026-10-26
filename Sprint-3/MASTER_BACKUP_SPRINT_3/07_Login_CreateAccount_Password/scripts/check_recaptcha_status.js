const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const urls = [
    { site: 'US Staging', page: 'Login', url: 'https://mcstaging2.globewest.com/customer/account/login/' },
    { site: 'US Staging', page: 'Create Account', url: 'https://mcstaging2.globewest.com/customer/account/create/' },
    { site: 'US Staging', page: 'Forgot Password', url: 'https://mcstaging2.globewest.com/customer/account/forgotpassword/' },
    { site: 'AU Live', page: 'Login', url: 'https://www.globewest.com.au/customer/account/login/' },
    { site: 'AU Live', page: 'Create Account', url: 'https://www.globewest.com.au/customer/account/create/' },
    { site: 'AU Live', page: 'Forgot Password', url: 'https://www.globewest.com.au/customer/account/forgotpassword/' }
  ];

  for (const item of urls) {
    console.log(`\n================ Checking ${item.site} - ${item.page} ================`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      const recaptchaInfo = await page.evaluate(() => {
        const recaptchaScripts = Array.from(document.querySelectorAll('script[src*="recaptcha"]')).map(s => s.src);
        const recaptchaContainers = Array.from(document.querySelectorAll('.g-recaptcha, [data-sitekey], .grecaptcha-badge, [id*="recaptcha"]')).map(el => ({
          tag: el.tagName,
          id: el.id,
          class: el.className,
          sitekey: el.getAttribute('data-sitekey')
        }));
        const iframes = Array.from(document.querySelectorAll('iframe[src*="recaptcha"]')).map(f => f.src);
        const textNodes = document.body.innerText.includes('reCAPTCHA') || document.body.innerText.includes('Google Privacy Policy');
        
        // Find exact text or disclaimer element
        const disclaimerEl = Array.from(document.querySelectorAll('div, p, span')).find(el => 
          el.innerText && el.innerText.includes('This site is protected by reCAPTCHA') && el.children.length <= 3
        );

        return {
          recaptchaScripts,
          recaptchaContainers,
          iframesCount: iframes.length,
          hasDisclaimerText: textNodes,
          disclaimerHTML: disclaimerEl ? disclaimerEl.outerHTML : null
        };
      });
      console.log(JSON.stringify(recaptchaInfo, null, 2));
    } catch (e) {
      console.log('Error:', e.message);
    }
  }

  await browser.close();
})();
