const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://mcstaging2.globewest.com/locator', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Find all inputs
    const inputs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('input')).map(i => ({
            id: i.id,
            name: i.name,
            placeholder: i.placeholder,
            type: i.type
        }));
    });
    console.log('Inputs found:', inputs);
    
    // Test 1: Enter City "Los Angeles" in Store Name input
    const storeInput = await page.$('input[placeholder*="Typing"], #store, input[name="store"]');
    if (storeInput) {
        console.log('Found store input, typing Los Angeles...');
        await storeInput.fill('Los Angeles');
        // Find magnifying glass / submit button next to storeInput
        const submitBtn = await page.$('.search-by-name button, button[type="submit"]:has(svg), .search-store-btn');
        if (submitBtn) {
            await submitBtn.click();
        } else {
            await storeInput.press('Enter');
        }
        await page.waitForTimeout(4000);
        await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_city_navigation_la.png' });
        console.log('Saved map_city_navigation_la.png');
    }
    
    // Test 2: Enter ZIP Code "90069"
    const zipInput = await page.$('input[placeholder*="90210"], #postcode, input[name="postcode"]');
    if (zipInput) {
        console.log('Found ZIP input, typing 90069...');
        await zipInput.fill('90069');
        await zipInput.press('Enter');
        await page.waitForTimeout(4000);
        await page.screenshot({ path: 'Sprint-3/Ticket_41794539_Store_Locator/screenshots/desktop/map_zip_navigation_90069.png' });
        console.log('Saved map_zip_navigation_90069.png');
    }
    
    // Check rendered stockist card in left panel
    const stockistCards = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.stockist-item, .stockist-card, .store-item, .locator-item, [class*="stockist"]')).map(el => el.innerText.trim()).filter(Boolean);
    });
    console.log('Stockist cards found count:', stockistCards.length);
    if (stockistCards.length > 0) {
        console.log('First card preview:\n', stockistCards[0].substring(0, 150));
    }
    
    await browser.close();
})();
