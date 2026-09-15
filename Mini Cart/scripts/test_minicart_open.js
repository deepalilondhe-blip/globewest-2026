const { chromium } = require('/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  for (const url of ['https://mcstaging2.globewest.com', 'https://mcstaging2.globewest.com.au']) {
    const isAU = url.includes('.au');
    const name = isAU ? 'AU' : 'US';
    console.log(`\n=================== Testing ${name}: ${url} ===================`);
    
    const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    const check = await page.evaluate(() => {
      const showcart = document.querySelector('a.action.showcart');
      const minicart = document.querySelector('[data-block="minicart"]');
      const dialog = document.querySelector('.block-minicart');
      return {
        showcartFound: !!showcart,
        minicartFound: !!minicart,
        dialogFound: !!dialog,
        showcartHref: showcart ? showcart.href : null,
        hasJQuery: typeof window.jQuery !== 'undefined'
      };
    });
    console.log(`[${name}] DOM check:`, check);

    // Click showcart action
    console.log(`[${name}] Clicking showcart...`);
    await page.click('a.action.showcart');
    await page.waitForTimeout(2000);

    let isDialogVisible = await page.locator('.mage-dropdown-dialog').first().isVisible().catch(() => false);
    console.log(`[${name}] Dialog visible after click:`, isDialogVisible);

    if (!isDialogVisible) {
      console.log(`[${name}] Trying widget open...`);
      await page.evaluate(() => {
        if (typeof window.jQuery !== 'undefined') {
          window.jQuery('[data-block="minicart"]').find('[data-role="dropdownDialog"]').dropdownDialog('open');
        }
      });
      await page.waitForTimeout(1500);
      isDialogVisible = await page.locator('.mage-dropdown-dialog').first().isVisible().catch(() => false);
      console.log(`[${name}] Dialog visible after widget call:`, isDialogVisible);
    }

    if (isDialogVisible) {
      const outPath = `/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Mini Cart/screenshots/${name.toLowerCase()}/02_${name}_Empty_MiniCart_Drawer.png`;
      await page.screenshot({ path: outPath });
      console.log(`[${name}] Saved empty minicart screenshot to ${outPath}`);
    }

    await page.close();
  }
  
  await browser.close();
})();
