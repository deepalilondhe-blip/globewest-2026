// @ts-check
const { test } = require('@playwright/test');
const { execSync } = require('child_process');

// Helper function to trigger a physical system beep sound on Windows
function playSystemBeep(frequency = 800, durationMs = 250) {
  try {
    execSync(`powershell.exe "[console]::beep(${frequency}, ${durationMs})"`, { stdio: 'ignore' });
  } catch (e) {
    process.stdout.write('\u0007');
  }
}

// Play a camera shutter "click" sound
function playPhotoClickSound() {
  playSystemBeep(1800, 50);
  playSystemBeep(1800, 50);
}

test.describe('Audible Beep, Photo Clicks & High-Contrast Highlight Test', () => {

  test('Verify browser focus with active highlighting and custom sound cues', async ({ page }, testInfo) => {
    // 1. Navigate to W3C bad accessibility demo page
    console.log('Navigating to W3C Demo Page...');
    await page.goto('https://www.w3.org/WAI/demos/bad/before/home.html');
    await page.waitForLoadState('domcontentloaded');

    // 2. Inject CSS style and JavaScript to dynamically highlight the currently focused element
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

    // 3. Ensure browser window is active and focused
    await page.bringToFront();
    await page.locator('body').click();
    await page.waitForTimeout(2000);

    // Play double beep to indicate test has started
    console.log('Test Started - Playing Audio Alert...');
    playSystemBeep(1000, 150);
    await page.waitForTimeout(100);
    playSystemBeep(1200, 150);

    // Capture initial page state screenshot
    const initScreenshot = await page.screenshot();
    await testInfo.attach('Initial Page Load', {
      body: initScreenshot,
      contentType: 'image/png'
    });

    // 4. Tab through elements
    const totalTabs = 5;
    for (let i = 1; i <= totalTabs; i++) {
      console.log(`Pressing TAB #${i}...`);
      await page.keyboard.press('Tab');
      
      // Check if the focused element is a photo/image link
      const elementInfo = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return { isPhoto: false, name: 'Unknown' };
        const tagName = active.tagName.toLowerCase();
        const isPhoto = tagName === 'img' || active.querySelector('img') !== null;
        const name = active.textContent?.trim() || active.getAttribute('aria-label') || active.getAttribute('alt') || 'Unnamed element';
        return { isPhoto, name };
      });

      if (elementInfo.isPhoto) {
        console.log(`  Focused on a Photo Link [${elementInfo.name}]! Playing Photo Click Sound...`);
        playPhotoClickSound();
      } else {
        const pitch = 700 + (i * 80);
        playSystemBeep(pitch, 200);
      }
      
      await page.waitForTimeout(1000); // Wait briefly for animation to stabilize

      // Capture and attach screenshot of the currently focused/highlighted element
      const stepScreenshot = await page.screenshot();
      await testInfo.attach(`Tab #${i} - Focused element: ${elementInfo.name}`, {
        body: stepScreenshot,
        contentType: 'image/png'
      });

      await page.waitForTimeout(1500); // Additional delay
    }

    // Play final success triple beep
    console.log('Test Completed - Playing Completion Alert...');
    playSystemBeep(1200, 100);
    await page.waitForTimeout(50);
    playSystemBeep(1200, 100);
    await page.waitForTimeout(50);
    playSystemBeep(1500, 300);
  });
});
