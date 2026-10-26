const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../GlobeWest 2026/node_modules/playwright'));

const FIGMA_CLAIMS_URL = 'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2316-15694&t=UHKXdUurQ7e08vqM-0';
const US_LOGIN_URL = 'https://mcstaging2.globewest.com/customer/account/login/';
const US_ACCOUNT_URL = 'https://mcstaging2.globewest.com/customer/account/';

const PROFILE_DIR = path.resolve(__dirname, '../../../GlobeWest 2026/.figma-chrome-profile');
['SingletonLock', 'SingletonCookie', 'SingletonSocket'].forEach(f => {
  const p = path.join(PROFILE_DIR, f);
  if (fs.existsSync(p)) try { fs.unlinkSync(p); } catch (e) {}
});

(async () => {
  console.log('========================================================================');
  console.log('🚀 SIMULTANEOUS DUAL-TAB AUDIT: FIGMA CLAIMS DESIGN VS LIVE US STAGING');
  console.log('Figma Spec: Frames 630, 631, desktop/my_account/My Claims & Create Claim');
  console.log('Live Target: mcstaging2.globewest.com (Logged in Trade Customer)');
  console.log('========================================================================\n');

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    slowMo: 400,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled'
    ],
    viewport: null
  });

  // TAB 1: FIGMA MASTER DESIGN
  console.log('🌐 [TAB 1] Loading Figma Design (Node 2316-15694 - Claims Portal / Frame 630)...');
  const figmaPage = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  await figmaPage.goto(FIGMA_CLAIMS_URL, { timeout: 90000, waitUntil: 'domcontentloaded' }).catch(e => console.log('Figma load note:', e.message));
  
  // Wait a bit for Figma canvas
  console.log('⏳ Waiting for Figma canvas to render...');
  await figmaPage.waitForTimeout(6000);
  await figmaPage.keyboard.press('Escape');

  // TAB 2: LIVE US STOREFRONT
  console.log('\n🛍️ [TAB 2] Opening Live US Staging in second tab...');
  const livePage = await context.newPage();
  
  console.log('Logging in as US Trade Customer (deepali.londhe@overdose.digital)...');
  await livePage.goto(US_LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await livePage.waitForTimeout(2000);

  const email = livePage.locator('#email');
  if (await email.isVisible({ timeout: 4000 }).catch(() => false)) {
    await email.fill('deepali.londhe@overdose.digital');
    await livePage.locator('#pass').fill('Deep@123');
    await livePage.locator('#send2').click();
    await livePage.waitForTimeout(5000);
  }

  console.log('Landed on Dashboard: ' + livePage.url());
  await livePage.goto(US_ACCOUNT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await livePage.waitForTimeout(3000);

  // Focus and Highlight the "MY CLAIMS" option on Live Staging
  console.log('\n🎯 Locating and Clicking "MY CLAIMS" option on Live Staging...');
  const myClaimsOption = livePage.locator('button:has-text("MY CLAIMS"), .account-list__toggle:has-text("MY CLAIMS")').first();
  
  if (await myClaimsOption.isVisible({ timeout: 4000 }).catch(() => false)) {
    await livePage.evaluate(() => {
      const el = Array.from(document.querySelectorAll('button, a')).find(b => b.innerText.trim().toUpperCase() === 'MY CLAIMS');
      if (el) {
        el.style.border = '4px solid #00CC66';
        el.style.boxShadow = '0 0 20px #00CC66';
      }
    });
    await livePage.waitForTimeout(1500);
    console.log('Clicking "MY CLAIMS" button on live page...');
    await myClaimsOption.click();
    await livePage.waitForTimeout(2500);
  }

  // Highlight the sublinks: Open Claims, Pending Claims, Closed Claims, Submit Claim
  await livePage.evaluate(() => {
    const mark = (selector, label, color) => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.border = `2px solid ${color}`;
        el.style.padding = '4px';
      });
    };
    mark('a[href*="claim"]', 'CLAIM LINK', '#FF3333');
    mark('.od-notification__button', 'SUBMIT CLAIM', '#FF3333');
  });

  console.log('\n🔄 Switching back to TAB 1 (Figma) for side-by-side comparison...');
  await figmaPage.bringToFront();
  await figmaPage.waitForTimeout(4000);

  console.log('🔄 Switching back to TAB 2 (Live Storefront)...');
  await livePage.bringToFront();
  await livePage.waitForTimeout(4000);

  console.log('\n========================================================================');
  console.log('✅ BOTH TABS ARE CURRENTLY ACTIVE ON YOUR SCREEN:');
  console.log('Tab 1: Figma Design (Frames 630 & 631)');
  console.log('Tab 2: Live US Staging Storefront (My Claims option expanded)');
  console.log('You can now inspect pixel to pixel directly between the two tabs!');
  console.log('========================================================================\n');

  // Keep open for user inspection
  console.log('Keeping browser open for 30 seconds for live inspection...');
  await livePage.waitForTimeout(30000);

  await context.close();
  console.log('🏁 Audit session completed.');
})();
