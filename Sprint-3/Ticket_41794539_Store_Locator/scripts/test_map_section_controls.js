const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(4000);
    
    // 1. Check Map / Satellite toggle
    const satBtn = await page.$('button:has-text("Satellite")');
    const mapBtn = await page.$('button:has-text("Map")');
    console.log('Satellite button:', !!satBtn);
    console.log('Map button:', !!mapBtn);
    
    // 2. Check Zoom buttons
    const zoomIn = await page.$('button[aria-label="Zoom in"]');
    const zoomOut = await page.$('button[aria-label="Zoom out"]');
    console.log('Zoom In button:', !!zoomIn);
    console.log('Zoom Out button:', !!zoomOut);
    
    // 3. Check Fullscreen button
    const fsBtn = await page.$('button[aria-label="Toggle fullscreen view"]');
    console.log('Fullscreen button:', !!fsBtn);
    
    // 4. Check Pins / Markers
    const markerCount = await page.evaluate(() => {
        return document.querySelectorAll('.gm-style [role="button"], .gm-style img[src*="spotlight"], .gm-style area').length;
    });
    console.log('Marker elements found:', markerCount);
    
    // Test Satellite click
    if (satBtn) {
        await satBtn.click();
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_satellite_view.png' });
        console.log('Saved map_satellite_view.png');
        // Switch back to Map
        if (mapBtn) await mapBtn.click();
        await page.waitForTimeout(1000);
    }
    
    // Test Zoom In click
    if (zoomIn) {
        await zoomIn.click();
        await page.waitForTimeout(1000);
        await zoomIn.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_zoomed_in.png' });
        console.log('Saved map_zoomed_in.png');
    }
    
    // Check pin click & InfoWindow
    const pin = await page.$('.gm-style [role="button"] img[src*="spotlight"], .gm-style [role="button"]:has(img)');
    if (pin) {
        console.log('Clicking pin...');
        await pin.click({ force: true });
        await page.waitForTimeout(2000);
        const infoWindow = await page.$('.gm-style-iw, [role="dialog"]');
        console.log('InfoWindow found after pin click:', !!infoWindow);
        if (infoWindow) {
            const text = await infoWindow.innerText();
            console.log('InfoWindow snippet:', text.substring(0, 150));
            await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_infowindow_active.png' });
        }
    } else {
        console.log('No pin button selector matched directly, trying first clickable element inside map');
    }
    
    await browser.close();
})();
