const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * 1-Click Interactive Figma Launcher for My Orders (Ticket #41794530)
 * 
 * Uses the pre-authenticated Chrome profile to open Figma directly without requiring login.
 * Node ID: 2581-64348 (Globewest USA - External)
 */

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64348&t=UHKXdUurQ7e08vqM-0';
const PROFILE_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/GlobeWest 2026/.figma-chrome-profile';

// Safety: Clean up any stale lock files if Chrome terminated abruptly
const lockFiles = ['SingletonLock', 'SingletonCookie', 'SingletonSocket'];
for (const f of lockFiles) {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) {
    try { fs.unlinkSync(p); } catch (e) {}
  }
}

(async () => {
  console.log('================================================================');
  console.log('OPENING FIGMA: GLOBEWEST USA - MY ORDERS (NODE 2581-64348)');
  console.log(`URL: ${FIGMA_URL}`);
  console.log('================================================================\n');

  try {
    const context = await chromium.launchPersistentContext(PROFILE_DIR, {
      headless: false,
      channel: 'chrome',
      ignoreDefaultArgs: ['--enable-automation'],
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--start-maximized',
        '--window-size=1920,1080'
      ],
      viewport: null
    });

    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
    console.log('Navigating to Figma artboard...');
    await page.goto(FIGMA_URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
    console.log('\n✅ SUCCESS: Figma opened successfully in Chrome with authenticated session!');
    console.log('You can now inspect designs, view specifications, Desktop, and Mobile artboards.');
    console.log('Browser session is active.\n');

    // Keep process alive while user interacts with Figma
    await new Promise(() => {});

  } catch (err) {
    console.error('Error launching Figma browser session:', err.message);
    process.exit(1);
  }
})();
