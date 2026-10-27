const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/responsive_trade_results';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Running Mobile & Tablet Responsive Audit in TRADE Logged-In Mode...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Step 1: Login on desktop context to obtain Trade session
  const authContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const authPage = await authContext.newPage();

  console.log('Logging in with Trade account...');
  await authPage.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await authPage.fill('#email', 'deepali.londhe@overdose.digital');
  await authPage.fill('#pass', 'Deep@123');
  await authPage.click('#send2, button[type="submit"].login');
  await authPage.waitForTimeout(6000);

  const cookies = await authContext.cookies();
  await authContext.close();

  // Test devices
  const devices = [
    { name: 'iPhone_14_390x844', width: 390, height: 844 },
    { name: 'iPhone_SE_375x667', width: 375, height: 667 },
    { name: 'iPad_Mini_768x1024', width: 768, height: 1024 },
    { name: 'Desktop_1440x900', width: 1440, height: 900 }
  ];

  const targetPdps = [
    {
      name: 'Leon_Side_Table',
      url: 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue'
    },
    {
      name: 'Amari_Planter',
      url: 'https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat'
    }
  ];

  for (const dev of devices) {
    console.log(`\nTesting Device: ${dev.name}...`);
    const context = await browser.newContext({
      viewport: { width: dev.width, height: dev.height },
      isMobile: dev.width < 1000,
      hasTouch: dev.width < 1000,
      userAgent: dev.width < 1000
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    await context.addCookies(cookies);
    const page = await context.newPage();

    for (const pdp of targetPdps) {
      console.log(`  Auditing ${pdp.name} on ${dev.name}...`);
      await page.goto(pdp.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(5000);

      const shotPath = path.join(OUT_DIR, `${pdp.name}_${dev.name}_trade.png`);
      await page.screenshot({ path: shotPath, fullPage: true });

      // Check Mobile Trade Elements
      const devAudit = await page.evaluate((dInfo) => {
        const topBar = document.querySelector('.panel.header, .header-panel, .header.utility-bar, .top-bar');
        const priceBox = document.querySelector('.price-box, .product-info-price');
        const atcBtn = document.querySelector('#product-addtocart-button');
        const toQuoteBtn = document.querySelector('button.action.secondary.toquote, button[data-action="add-to-quote"]');
        const floatingShare = document.querySelector('.mp_social_share_float, .a2a_kit');

        // Check horizontal overflow
        const overflow = document.documentElement.scrollWidth > window.innerWidth + 2;

        // Check button widths and stacking
        let atcWidth = null;
        let quoteWidth = null;
        let isStacked = null;
        if (atcBtn) {
          const r1 = atcBtn.getBoundingClientRect();
          atcWidth = r1.width;
          if (toQuoteBtn) {
            const r2 = toQuoteBtn.getBoundingClientRect();
            quoteWidth = r2.width;
            isStacked = r2.top >= r1.bottom - 2;
          }
        }

        return {
          device: dInfo.name,
          overflow,
          topBarText: topBar ? topBar.innerText.trim().replace(/\n+/g, ' | ') : 'NONE',
          hasTradeToggle: !!Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.trim() === 'Trade'),
          priceBoxText: priceBox ? priceBox.innerText.trim().replace(/\n+/g, ' ') : 'NONE',
          atcVisible: !!(atcBtn && atcBtn.offsetParent),
          atcWidth,
          quoteVisible: !!(toQuoteBtn && toQuoteBtn.offsetParent),
          quoteWidth,
          isStacked,
          floatingShareVisible: !!(floatingShare && floatingShare.offsetParent)
        };
      }, dev);

      console.log(`  Audit result for ${pdp.name} on ${dev.name}:`, devAudit);
    }

    await context.close();
  }

  await browser.close();
  console.log('✅ Trade Responsive Audit Finished!');
})();
