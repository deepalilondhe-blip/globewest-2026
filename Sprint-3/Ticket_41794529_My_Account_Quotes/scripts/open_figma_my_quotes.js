const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * 1-Click Interactive Figma Launcher for My Quotes & My Account
 * 
 * Uses the pre-authenticated Chrome profile to open Figma directly without requiring login.
 * Usage:
 *   NODE_PATH="GlobeWest 2026/node_modules" node "GlobeWest 2026/scripts/open_figma_my_quotes.js"
 * Or via npm:
 *   npm run figma:my-quotes
 */

const FIGMA_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2581-64235&t=SCzEabH2QK3XzI6G-0';
const PROFILE_DIR = path.resolve(__dirname, '../.figma-chrome-profile');

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
  console.log('OPENING FIGMA: GLOBEWEST USA - MY QUOTES & MY ACCOUNT');
  console.log(`URL: ${FIGMA_URL}`);
  console.log(`Profile: ${PROFILE_DIR}`);
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
    console.log('\n SUCCESS: Figma opened successfully in Chrome with authenticated session!');
    console.log('You can now inspect designs, view Frame 622, Frame 623, Desktop, and Mobile artboards.');
    console.log('To close the browser session, simply close the Chrome window or press Ctrl+C in this terminal.\n');

    // Keep process alive while user interacts with Figma
    await new Promise(() => {});

  } catch (err) {
    console.error('Error launching Figma browser session:', err.message);
    process.exit(1);
  }
})();
