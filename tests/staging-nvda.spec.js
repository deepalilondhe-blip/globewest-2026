// @ts-check
const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// Helper function to trigger a physical system beep sound on Windows
function playSystemBeep(frequency = 800, durationMs = 200) {
  try {
    execSync(`powershell.exe "[console]::beep(${frequency}, ${durationMs})"`, { stdio: 'ignore' });
  } catch (e) {
    process.stdout.write('\u0007');
  }
}

// Play a camera shutter "click" sound when focusing on images/buttons
function playPhotoClickSound() {
  playSystemBeep(1800, 50);
  playSystemBeep(1800, 50);
}

// List of target pages on GlobeWest staging to test
const PAGES_TO_TEST = [
  { name: '1. Homepage', path: '/' },
  { name: '2. Product Listing Page (PLP)', path: '/furniture/sofas-modulars.html' },
  { name: '3. Product Detail Page (PDP)', path: '/sofas-modulars/3-seater/sofa-name.html' },
  { name: '4. Shopping Cart / Checkout', path: '/checkout/cart/' },
  { name: '5. My Account Login', path: '/customer/account/login/' },
  { name: '6. B2B Trade Portal', path: '/trade-portal-registration/' },
  { name: '7. Search Results Page', path: '/catalogsearch/result/?q=sofa' },
  { name: '8. Content / Static Page', path: '/about-us/' }
];

test.describe('GlobeWest Staging NVDA & Keyboard Navigation Audit', () => {

  for (const pageInfo of PAGES_TO_TEST) {
    test(`Audit ${pageInfo.name}`, async ({ page }, testInfo) => {
      console.log(`\n==========================================`);
      console.log(`Starting Staging Audit: ${pageInfo.name}`);
      console.log(`Navigating to path: ${pageInfo.path}`);
      
      // 1. Navigate to target staging page
      await page.goto(pageInfo.path);
      await page.waitForLoadState('domcontentloaded');
      
      // 2. Dismiss cookie banner if it is visible
      const cookieAcceptBtn = page.locator('#btn-cookie-allow, button.cookie-accept');
      if (await cookieAcceptBtn.isVisible()) {
        await cookieAcceptBtn.click();
      }

      // Capture initial page state screenshot to artifact directory for reporting
      const artifactDir = `C:\\Users\\Deepali_Londhe\\.gemini\\antigravity\\brain\\8e702931-bda8-4e71-a7d9-f8509d9c917c`;
      const screenshotName = pageInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').trim() + '.png';
      await page.screenshot({ path: `${artifactDir}/${screenshotName}` });

      // 3. Inject CSS style to dynamically highlight the currently focused element
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.innerHTML = `
          .a11y-focus-highlight {
            outline: 6px solid #ff0055 !important;
            outline-offset: 4px !important;
            box-shadow: 0 0 15px #ff0055 !important;
            transition: outline-color 0.1s ease-in-out;
          }
        `;
        document.head.appendChild(style);

        document.addEventListener('focus', (event) => {
          document.querySelectorAll('.a11y-focus-highlight').forEach(el => {
            el.classList.remove('a11y-focus-highlight');
          });
          const active = event.target;
          if (active instanceof HTMLElement) {
            active.classList.add('a11y-focus-highlight');
          }
        }, true);
      });

      // 4. Bring browser window to front and focus body
      await page.bringToFront();
      await page.locator('body').click();
      await page.waitForTimeout(1000);

      // Play double-beep warning tone to notify start of keyboard navigation loop
      playSystemBeep(1000, 100);
      playSystemBeep(1200, 100);

      // 5. Tab loop - Simulate keyboard navigation and capture screenshots
      const totalTabs = 5;
      for (let i = 1; i <= totalTabs; i++) {
        console.log(`Pressing TAB #${i}...`);
        await page.keyboard.press('Tab');
        await page.waitForTimeout(500); // Allow brief animation time

        // Extract element details from the browser context
        const elementInfo = await page.evaluate(() => {
          const active = document.activeElement;
          if (!active || active === document.body) {
            return { tag: 'None', text: 'No active focus element', isClickable: false };
          }
          const tag = active.tagName.toLowerCase();
          const role = active.getAttribute('role') || 'None';
          const ariaLabel = active.getAttribute('aria-label') || '';
          const alt = active.getAttribute('alt') || '';
          const textContent = active.textContent?.trim() || '';
          
          let name = ariaLabel || alt || textContent || active.getAttribute('name') || 'Unnamed Control';
          if (name.length > 50) name = name.substring(0, 47) + '...';

          const isClickable = tag === 'a' || tag === 'button' || role === 'button' || active.getAttribute('onclick') !== null;
          return { tag, text: `${tag} [role="${role}"]: "${name}"`, isClickable };
        });

        // Speak/Notify through audible beeps
        if (elementInfo.isClickable) {
          console.log(`  Focused clickable element: ${elementInfo.text}. Playing Photo Click Sound...`);
          playPhotoClickSound();
        } else {
          console.log(`  Focused element: ${elementInfo.text}. Playing Normal focus beep...`);
          const pitch = 600 + (i * 80);
          playSystemBeep(pitch, 150);
        }

        // Capture screenshot of the highlighted focused element
        const stepScreenshot = await page.screenshot({ fullPage: false });
        await testInfo.attach(`Tab #${i} - Focused: ${elementInfo.text}`, {
          body: stepScreenshot,
          contentType: 'image/png'
        });

        await page.waitForTimeout(500);
      }

      // Play final completion alert sound
      playSystemBeep(1200, 100);
      await page.waitForTimeout(50);
      playSystemBeep(1500, 250);
    });
  }
});
