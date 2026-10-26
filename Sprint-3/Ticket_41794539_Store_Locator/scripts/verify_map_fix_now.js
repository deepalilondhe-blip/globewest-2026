const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
    
    console.log('Navigating to https://mcstaging2.globewest.com/locator ...');
    try {
        await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'networkidle', timeout: 60000 });
    } catch (e) {
        console.log('Navigation timeout or error, proceeding to inspect state...', e.message);
    }
    await page.waitForTimeout(6000);
    
    // Check map elements in DOM
    const mapInfo = await page.evaluate(() => {
        const mapDiv = document.querySelector('#map') || document.querySelector('.map-canvas') || document.querySelector('[id*="map"]');
        const gmErrContainer = document.querySelector('.gm-err-container');
        const gmErrContent = document.querySelector('.gm-err-content');
        const gmStyle = document.querySelector('.gm-style');
        const gmTiles = document.querySelectorAll('img[src*="googleapis.com"], img[src*="google.com/maps"], .gm-style canvas');
        
        return {
            mapDivExists: !!mapDiv,
            mapDivId: mapDiv ? mapDiv.id : null,
            mapDivClasses: mapDiv ? mapDiv.className : null,
            hasGmErrContainer: !!gmErrContainer,
            gmErrText: gmErrContainer ? gmErrContainer.innerText : (gmErrContent ? gmErrContent.innerText : null),
            hasGmStyle: !!gmStyle,
            gmTilesCount: gmTiles.length,
            innerHtmlSnippet: mapDiv ? mapDiv.innerHTML.substring(0, 300) : ''
        };
    });
    
    console.log('=== MAP DOM INSPECTION ===');
    console.log(JSON.stringify(mapInfo, null, 2));
    
    const mapLogs = consoleLogs.filter(l => 
        l.text.toLowerCase().includes('google') || 
        l.text.toLowerCase().includes('map') || 
        l.text.toLowerCase().includes('referer') ||
        l.type === 'error'
    );
    console.log('=== RELEVANT CONSOLE LOGS ===');
    console.log(JSON.stringify(mapLogs, null, 2));
    
    // Take desktop screenshot
    await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_verification_current.png', fullPage: false });
    console.log('Desktop screenshot saved to screenshots/desktop/map_verification_current.png');
    
    // Test interactive search by zip code
    console.log('\n=== TESTING SEARCH BY ZIP CODE (e.g. 90210) ===');
    try {
        const postcodeInput = await page.$('input[name="postcode"], #postcode, input[placeholder*="ZIP"], input[placeholder*="90210"], input[placeholder*="Postcode"]');
        if (postcodeInput) {
            console.log('Found postcode input!');
            await postcodeInput.fill('90210');
            const submitBtn = await page.$('button[type="submit"], .search-postcode-btn, button:has(.fa-search), button:has(svg)');
            if (submitBtn) {
                console.log('Submitting zip search...');
                await submitBtn.click();
                await page.waitForTimeout(4000);
            }
        } else {
            console.log('Postcode input selector not matched directly, checking inputs on page...');
            const inputs = await page.evaluate(() => Array.from(document.querySelectorAll('input')).map(i => ({ id: i.id, name: i.name, placeholder: i.placeholder, className: i.className })));
            console.log('Page inputs:', inputs);
        }
    } catch (err) {
        console.log('Search test error:', err.message);
    }
    
    await browser.close();
})();
