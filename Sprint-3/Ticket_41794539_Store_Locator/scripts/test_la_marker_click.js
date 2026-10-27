const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);
    
    const marker = await page.$('.gm-style div[title*="Los Angeles"], .gm-style div[aria-label*="Los Angeles"]');
    console.log('LA marker found:', !!marker);
    if (marker) {
        await marker.click();
        await page.waitForTimeout(2000);
        const iw = await page.$('.gm-style-iw');
        console.log('InfoWindow visible:', !!iw);
        if (iw) {
            console.log('InfoWindow text:\n', await iw.innerText());
            await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_infowindow_la_marker.png' });
            console.log('Screenshot saved to screenshots/desktop/map_infowindow_la_marker.png');
        }
    }
    await browser.close();
})();
