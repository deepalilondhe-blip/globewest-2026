const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64183&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';
const OUT_DIR = path.resolve(__dirname, '..', 'figma');

(async () => {
  console.log('🚀 CAPTURING HIGH-RES FIGMA SECTIONS FOR DASHBOARD...');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--window-size=1920,1080'
    ],
    viewport: { width: 1920, height: 1080 }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto(FIGMA_URL, { timeout: 90000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('canvas', { timeout: 60000 });
    await page.waitForTimeout(10000);

    // 1. Focus on desktop/my_account/01_dashboard
    console.log('Searching for "desktop/my_account/01_dashboard"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('desktop/my_account/01_dashboard');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    // Zoom to selection
    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(2500);

    // Zoom in once or twice to make it sharp and readable
    await page.keyboard.press('+');
    await page.waitForTimeout(1000);

    // Hide UI
    await page.keyboard.press('Control+Backslash');
    await page.waitForTimeout(2000);

    // Capture Section 1: Header, Left Nav & Welcome
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_SECTION_1_HEADER_WELCOME.png') });
    console.log('📸 Saved FIGMA_SECTION_1_HEADER_WELCOME.png');

    // Pan down to Section 2: Recent Orders & Notification
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_SECTION_2_RECENT_ORDERS.png') });
    console.log('📸 Saved FIGMA_SECTION_2_RECENT_ORDERS.png');

    // Pan down to Section 3: Upcoming Events & Promotions
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_SECTION_3_EVENTS_PROMOTIONS.png') });
    console.log('📸 Saved FIGMA_SECTION_3_EVENTS_PROMOTIONS.png');

    // Pan down to Section 4: Showroom Bookings & FAQs
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_SECTION_4_BOOKINGS_FAQS.png') });
    console.log('📸 Saved FIGMA_SECTION_4_BOOKINGS_FAQS.png');

    // Bring UI back
    await page.keyboard.press('Control+Backslash');
    await page.waitForTimeout(1000);

    // 2. Focus on mobile/my_account/01_dashboard
    console.log('Searching for "mobile/my_account/01_dashboard"...');
    await page.keyboard.press('Control+f');
    await page.waitForTimeout(1000);
    await page.keyboard.type('mobile/my_account/01_dashboard');
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    await page.keyboard.press('Shift+2');
    await page.waitForTimeout(2500);

    // Zoom in once
    await page.keyboard.press('+');
    await page.waitForTimeout(1000);

    // Hide UI
    await page.keyboard.press('Control+Backslash');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_MOBILE_SECTION_1_TOP.png') });
    console.log('📸 Saved FIGMA_MOBILE_SECTION_1_TOP.png');

    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'FIGMA_MOBILE_SECTION_2_BOTTOM.png') });
    console.log('📸 Saved FIGMA_MOBILE_SECTION_2_BOTTOM.png');

  } catch (err) {
    console.error('Error during Figma capture:', err);
  } finally {
    await context.close();
    console.log('Finished capturing high-res Figma sections.');
  }
})();
