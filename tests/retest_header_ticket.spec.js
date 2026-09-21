// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const US_URL = 'https://mcstaging2.globewest.com';
const AU_URL = 'https://mcstaging2.globewest.com.au';

const OUT_DIR = path.join(__dirname, '..', '..', 'Ticket 5 - Header', 'retest_evidence');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const TRADE_USER = {
  email: 'deepali.londhe@overdose.digital',
  password: 'Deep@123'
};

test.describe('Header Ticket Comprehensive Re-testing Suite', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: Dual-Auth Matrix for Top Utility Bar Links (Guest vs Trade Desktop)
  // ──────────────────────────────────────────────────────────────────────────
  test('01. Desktop Dual-Auth Matrix: Top Utility Bar Links', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n=== 1A. Testing US Guest Header (Desktop) ===');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);

    const guestTopBarData = await page.evaluate(() => {
      const topBar = document.querySelector('.panel.header, .header-top');
      const links = Array.from(document.querySelectorAll('.panel.header a, .header-top a, .header-top-link')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
        className: a.className,
        visible: window.getComputedStyle(a).display !== 'none' && window.getComputedStyle(a).visibility !== 'hidden',
        computedStyle: {
          display: window.getComputedStyle(a).display,
          color: window.getComputedStyle(a).color,
          fontSize: window.getComputedStyle(a).fontSize
        }
      }));
      return { topBarText: topBar?.innerText?.trim(), links };
    });

    console.log('US Guest Top Bar Data:', JSON.stringify(guestTopBarData, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, 'us_guest_top_bar.json'), JSON.stringify(guestTopBarData, null, 2));

    await page.screenshot({
      path: path.join(OUT_DIR, '01_US_Guest_Header_Desktop.png'),
      clip: { x: 0, y: 0, width: 1440, height: 180 }
    });

    console.log('\n=== 1B. Logging in as Trade Customer ===');
    await page.goto(`${US_URL}/customer/account/login/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email').first();
    const passField = page.locator('#pass').first();
    const submitBtn = page.locator('#send2').first();

    if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailField.fill(TRADE_USER.email);
      await passField.fill(TRADE_USER.password);
      await submitBtn.click();
      await page.waitForTimeout(4000);
    }

    console.log('\n=== 1C. Testing US Logged-In Trade Header (Desktop) ===');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const tradeTopBarData = await page.evaluate(() => {
      const topBar = document.querySelector('.panel.header, .header-top');
      const links = Array.from(document.querySelectorAll('.panel.header a, .header-top a, .header-top-link')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href'),
        className: a.className,
        visible: window.getComputedStyle(a).display !== 'none' && window.getComputedStyle(a).visibility !== 'hidden',
        computedStyle: {
          display: window.getComputedStyle(a).display,
          color: window.getComputedStyle(a).color,
          fontSize: window.getComputedStyle(a).fontSize
        }
      }));
      const priceToggle = document.querySelector('.price-toggle');
      return {
        topBarText: topBar?.innerText?.trim(),
        links,
        hasPriceToggle: !!priceToggle,
        priceToggleVisible: priceToggle ? window.getComputedStyle(priceToggle).display !== 'none' : false
      };
    });

    console.log('US Trade Logged-In Top Bar Data:', JSON.stringify(tradeTopBarData, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, 'us_trade_top_bar.json'), JSON.stringify(tradeTopBarData, null, 2));

    await page.screenshot({
      path: path.join(OUT_DIR, '02_US_Trade_Header_Desktop.png'),
      clip: { x: 0, y: 0, width: 1440, height: 180 }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Mobile Viewport (< 768px) Inspection
  // ──────────────────────────────────────────────────────────────────────────
  test('02. Mobile Viewport Top Bar & Navigation Drawer', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14

    console.log('\n=== 2A. Testing US Guest Header (Mobile 390px) ===');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const mobileGuestData = await page.evaluate(() => {
      const topBar = document.querySelector('.panel.header, .header-top');
      const tradeLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent?.includes('Become a Trade Customer'));
      const showroomLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent?.includes('Book Showroom'));
      return {
        topBarVisible: topBar ? window.getComputedStyle(topBar).display !== 'none' : false,
        tradeLinkFound: !!tradeLink,
        tradeLinkVisible: tradeLink ? window.getComputedStyle(tradeLink).display !== 'none' : false,
        showroomLinkFound: !!showroomLink,
        showroomLinkVisible: showroomLink ? window.getComputedStyle(showroomLink).display !== 'none' : false
      };
    });

    console.log('Mobile Guest Data:', JSON.stringify(mobileGuestData, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, 'us_mobile_guest.json'), JSON.stringify(mobileGuestData, null, 2));

    await page.screenshot({
      path: path.join(OUT_DIR, '03_US_Mobile_Guest_Header.png'),
      clip: { x: 0, y: 0, width: 390, height: 220 }
    });

    // Open Mobile Navigation Drawer
    const hamburger = page.locator('.nav-toggle, button[data-action="toggle-nav"]').first();
    if (await hamburger.isVisible({ timeout: 4000 }).catch(() => false)) {
      await hamburger.click();
      await page.waitForTimeout(1500);

      await page.screenshot({
        path: path.join(OUT_DIR, '04_US_Mobile_Navigation_Drawer.png'),
        clip: { x: 0, y: 0, width: 390, height: 650 }
      });
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: Australian Domain Leakage & Mega Menu Navigation Audit
  // ──────────────────────────────────────────────────────────────────────────
  test('03. Navigation & Mega Menu Links Australian Scope Scan', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n=== 3. Crawling Mega Menu Navigation Links on US ===');
    await page.goto(US_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    // Hover each top navigation category to populate dynamic submenus
    const categories = ['Indoor', 'Outdoor', 'Homewares', 'In Stock', 'Customisation', 'Projects', 'Inspiration', 'Support', 'Contact'];
    for (const cat of categories) {
      const loc = page.locator('.navigation .level0 > a').filter({ hasText: cat }).first();
      if (await loc.count() > 0) {
        await loc.hover({ force: true }).catch(() => {});
        await page.waitForTimeout(300);
      }
    }

    // Extract all navigation and header links
    const linkScan = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('.navigation a, header.page-header a, .panel.header a'));
      const mapped = allLinks.map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href') || '',
        parentCategory: a.closest('.level0')?.querySelector(':scope > a')?.textContent?.trim() || 'Header/Utility'
      }));

      // Find AU leaks (.com.au, globewestoutlet.com.au)
      const auLeaks = mapped.filter(item => item.href.includes('.globewest.com.au') || item.href.includes('globewestoutlet.com.au') || item.href.includes('.com.au'));
      
      // Specifically check for Outlet links
      const outletLinks = mapped.filter(item => item.text.toLowerCase().includes('outlet') || item.href.toLowerCase().includes('outlet'));

      // Specifically check for Melbourne outlet showroom link
      const melbourneLinks = mapped.filter(item => item.text.toLowerCase().includes('melbourne') || item.href.toLowerCase().includes('melbourne'));

      return {
        totalLinks: mapped.length,
        auLeaks,
        outletLinks,
        melbourneLinks,
        allLinks: mapped
      };
    });

    console.log(`Scanned ${linkScan.totalLinks} links.`);
    console.log(`AU Leaks found: ${linkScan.auLeaks.length}`);
    console.log('AU Leaks detail:', JSON.stringify(linkScan.auLeaks, null, 2));
    console.log('Outlet Links detail:', JSON.stringify(linkScan.outletLinks, null, 2));
    console.log('Melbourne Links detail:', JSON.stringify(linkScan.melbourneLinks, null, 2));

    fs.writeFileSync(path.join(OUT_DIR, 'us_navigation_links_scan.json'), JSON.stringify(linkScan, null, 2));

    // Capture Indoor Mega Menu with Furniture subcategories open
    const indoorLoc = page.locator('.navigation .level0 > a').filter({ hasText: 'Indoor' }).first();
    await indoorLoc.hover({ force: true }).catch(() => {});
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(OUT_DIR, '05_US_Mega_Menu_Indoor.png'),
      clip: { x: 0, y: 140, width: 1440, height: 500 }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: AU Storefront Baseline Capture (Match AU)
  // ──────────────────────────────────────────────────────────────────────────
  test('04. AU Baseline Storefront Header Capture & Metrics', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1440, height: 900 });

    console.log('\n=== 4. Testing AU Baseline Header (mcstaging2.globewest.com.au) ===');
    await page.goto(AU_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    const auHeaderData = await page.evaluate(() => {
      const topBar = document.querySelector('.panel.header, .header-top');
      const topLinks = Array.from(document.querySelectorAll('.panel.header a, .header-top a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href')
      }));
      return { topBarText: topBar?.innerText?.trim(), topLinks };
    });

    console.log('AU Baseline Top Bar Data:', JSON.stringify(auHeaderData, null, 2));
    fs.writeFileSync(path.join(OUT_DIR, 'au_baseline_top_bar.json'), JSON.stringify(auHeaderData, null, 2));

    await page.screenshot({
      path: path.join(OUT_DIR, '06_AU_Baseline_Header_Desktop.png'),
      clip: { x: 0, y: 0, width: 1440, height: 180 }
    });

    // Capture AU Indoor Mega Menu
    const auIndoor = page.locator('.navigation .level0 > a').filter({ hasText: 'Indoor' }).first();
    if (await auIndoor.count() > 0) {
      await auIndoor.hover({ force: true }).catch(() => {});
      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(OUT_DIR, '07_AU_Baseline_Mega_Menu_Indoor.png'),
        clip: { x: 0, y: 140, width: 1440, height: 500 }
      });
    }
  });

});
