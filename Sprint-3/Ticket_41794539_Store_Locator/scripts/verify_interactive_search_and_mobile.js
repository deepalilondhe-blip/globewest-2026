const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    
    // 1. Desktop Interactive Search Test
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    
    // Check pin / marker on map
    const markers = await page.evaluate(() => {
        const markerImgs = document.querySelectorAll('.gm-style img[src*="spotlight"], .gm-style [role="button"]');
        return markerImgs.length;
    });
    console.log('Initial markers count:', markers);
    
    // Type 90210 into the input and search
    const zipInput = await page.$('input[placeholder*="90210"], #postcode, input[name="postcode"]');
    if (zipInput) {
        await zipInput.click();
        await zipInput.fill('90210');
        // Press Enter or click search button
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_after_zip_search.png' });
        console.log('Saved map_after_zip_search.png');
    }
    
    // 2. Mobile Viewport Test (iPhone 14 / iPhone 17 Pro)
    const mobilePage = await browser.newPage({ viewport: { width: 402, height: 874 } }); // iPhone 17 Pro
    await mobilePage.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'networkidle', timeout: 60000 });
    await mobilePage.waitForTimeout(4000);
    
    const mobileMapStatus = await mobilePage.evaluate(() => {
        const gmStyle = document.querySelector('.gm-style');
        const gmErr = document.querySelector('.gm-err-container');
        return {
            hasGmStyle: !!gmStyle,
            hasGmErr: !!gmErr
        };
    });
    console.log('Mobile map status:', mobileMapStatus);
    await mobilePage.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/mobile/map_mobile_iphone17pro_verified.png', fullPage: false });
    console.log('Saved map_mobile_iphone17pro_verified.png');
    
    await browser.close();
})();
