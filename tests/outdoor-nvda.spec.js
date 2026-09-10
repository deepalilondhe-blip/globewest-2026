// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Cross-platform screen reader announcement engine (Windows: PowerShell System.Speech, Linux: spd-say, macOS: say)
let speechProcess = null;
let speechResolver = null;

function startSpeechEngine() {
  if (speechProcess) return;
  if (process.platform === 'win32') {
    const { spawn } = require('child_process');
    try {
      speechProcess = spawn('powershell.exe', [
        '-NoProfile',
        '-Command',
        `
          Add-Type -AssemblyName System.Speech;
          $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer;
          $synth.Rate = 3;
          [Console]::Out.WriteLine("Ready");
          while ($line = [Console]::In.ReadLine()) {
            if ($line.Trim() -ne "") {
              $synth.Speak($line);
              [Console]::Out.WriteLine("Done");
            }
          }
        `
      ]);
      
      speechProcess.on('error', (err) => {
        console.warn(`[Speech Engine Warning] PowerShell engine error: ${err.message}`);
        if (speechResolver) {
          const resolve = speechResolver;
          speechResolver = null;
          resolve();
        }
      });

      speechProcess.stdin.setDefaultEncoding('utf-8');
      
      speechProcess.stdout.on('data', (data) => {
        const message = data.toString().trim();
        if (message.includes('Done') && speechResolver) {
          const resolve = speechResolver;
          speechResolver = null;
          resolve();
        }
      });
    } catch (e) {
      console.warn(`[Speech Engine Warning] Could not spawn powershell.exe: ${e.message}`);
    }
  }
}

async function speakText(text, isHeaded = true) {
  return new Promise((resolve) => {
    let resolved = false;
    const safeResolve = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };
    const timer = setTimeout(safeResolve, 6000);

    try {
      if (!isHeaded) {
        clearTimeout(timer);
        safeResolve();
        return;
      }

      const cleanText = text.replace(/[\r\n]/g, ' ').replace(/['"<>|]/g, '').trim();
      if (!cleanText) {
        clearTimeout(timer);
        safeResolve();
        return;
      }
      
      if (process.platform === 'win32') {
        startSpeechEngine();
        if (!speechProcess || !speechProcess.stdin || speechProcess.killed) {
          clearTimeout(timer);
          safeResolve();
          return;
        }
        speechResolver = () => {
          clearTimeout(timer);
          safeResolve();
        };
        speechProcess.stdin.write(cleanText + '\n');
      } else if (process.platform === 'linux') {
        const { execFile } = require('child_process');
        // -w: Wait until speech finishes completely
        // -r -15: Slower, natural and clear speech rate
        execFile('spd-say', ['-w', '-r', '-15', cleanText], (err) => {
          clearTimeout(timer);
          safeResolve();
        });
      } else if (process.platform === 'darwin') {
        const { execFile } = require('child_process');
        execFile('say', ['-r', '140', cleanText], (err) => {
          clearTimeout(timer);
          safeResolve();
        });
      } else {
        clearTimeout(timer);
        safeResolve();
      }
    } catch (e) {
      clearTimeout(timer);
      safeResolve();
    }
  });
}

function stopSpeechEngine() {
  if (speechProcess) {
    try {
      speechProcess.stdin.end();
      speechProcess.kill();
    } catch (e) {}
    speechProcess = null;
  }
}

const OUTDOOR_URL = process.env.OUTDOOR_URL || 'https://mcstaging2.globewest.com/outdoor';

test.describe('Outdoor Category Page — Screen / Voiced Reader Audit', () => {

  test.afterAll(async () => {
    stopSpeechEngine();
  });

  test.beforeEach(async ({ page }, testInfo) => {
    const isHeadedMode = !testInfo.project.use.headless;
    test.setTimeout(isHeadedMode ? 300000 : 120000);

    // Block third-party scripts to avoid intrusive overlays
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*', route => route.abort());
  });

  test('Voiced Reader & Keyboard Navigation on Outdoor Page', async ({ page }, testInfo) => {
    const isHeadedMode = !testInfo.project.use.headless;
    console.log(`\n==========================================`);
    console.log(`Starting Voiced Reader Audit for: ${OUTDOOR_URL}`);
    console.log(`==========================================\n`);

    // 1. Navigate to Outdoor page
    await page.goto(OUTDOOR_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);

    // 2. Dismiss cookie & welcome popups
    const dismissSelectors = [
      '#btn-cookie-allow', 'button.cookie-accept', 'a#lpclose', 'button#lpclose',
      '.action-close', '[data-role="closeBtn"]'
    ];
    for (const sel of dismissSelectors) {
      try {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await btn.click({ noWaitAfter: true }).catch(() => {});
          await page.waitForTimeout(500);
        }
      } catch (e) {}
    }

    // 3. Inject dynamic high-contrast focus highlight style
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        .a11y-focus-highlight {
          outline: 5px solid #0066ff !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 12px rgba(0, 102, 255, 0.8) !important;
          transition: outline 0.1s ease-in-out;
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

    // 4. Suppress interfering overlays and search dropdowns during tabbing
    await page.addStyleTag({
      content: `
        a#lpclose, .listrak-popup, #omnisend-form-container, .newsletter-popup, div[role="dialog"] {
          display: none !important;
        }
      `
    });

    // Initial announcement
    await speakText('Navigating to GlobeWest Outdoor Category Page. Starting accessibility voiced reader.', isHeadedMode);

    // Anchor focus to start navigation
    const firstFocusable = page.locator('a.skip-link, a.logo, header a, a').first();
    if (await firstFocusable.isVisible()) {
      await firstFocusable.focus();
    } else {
      await page.keyboard.press('Tab');
    }

    // 5. Tab loop: traverse interactive controls and announce via voice
    const maxTabs = 35;
    let tabCount = 0;
    const announcements = [];

    while (tabCount < maxTabs) {
      tabCount++;
      await page.keyboard.press('Tab');
      await page.waitForTimeout(300);

      const elementInfo = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active || active === document.body) {
          return { tag: 'body', name: 'body', role: 'none' };
        }

        const tag = active.tagName.toLowerCase();
        const role = active.getAttribute('role') || tag;
        const ariaLabel = active.getAttribute('aria-label') || '';
        const alt = active.getAttribute('alt') || '';
        const imgAlt = active.querySelector('img')?.getAttribute('alt') || '';
        const svgTitle = active.querySelector('svg title')?.textContent?.trim() || '';
        const titleAttr = active.getAttribute('title') || '';
        const placeholder = active.getAttribute('placeholder') || '';
        const textContent = active.textContent?.trim() || '';
        const parentLabel = active.closest('label')?.textContent?.trim() || '';
        const className = String(active.className || '');
        const id = active.id || '';

        let name = ariaLabel || alt || imgAlt || svgTitle || titleAttr || placeholder || textContent || parentLabel;

        // Contextual identification if developer omitted accessible label
        if (!name) {
          if (id.includes('search') || className.includes('search') || active.getAttribute('name') === 'q' || active.getAttribute('data-bind')?.includes('searchQuery')) {
            name = 'Search input (Unlabelled input defect)';
          } else if (className.includes('wishlist') || active.getAttribute('data-action') === 'add-to-wishlist') {
            name = 'Wishlist heart icon (Missing accessible text)';
          } else if (className.includes('logo') || active.querySelector('.logo')) {
            name = 'GlobeWest Logo home';
          } else if (className.includes('account') || className.includes('customer') || className.includes('authorization-link')) {
            name = 'Account sign in';
          } else if (className.includes('minicart') || className.includes('cart')) {
            name = 'Shopping Cart';
          } else {
            name = 'Unlabelled ' + tag;
          }
        }

        if (name.length > 55) name = name.substring(0, 52) + '...';

        return { tag, name, role };
      });

      if (elementInfo.tag === 'body') continue;

      let humanRole = elementInfo.role;
      if (elementInfo.tag === 'a') humanRole = 'link';
      if (elementInfo.tag === 'button') humanRole = 'button';
      if (elementInfo.tag === 'input') humanRole = 'edit text field';
      if (elementInfo.tag === 'select') humanRole = 'combo box';

      const speechMessage = `${elementInfo.name}, ${humanRole}`;
      console.log(`[Voiced Reader] Tab ${tabCount}: ${speechMessage}`);
      announcements.push({ tab: tabCount, text: speechMessage });

      // Speak text aloud and wait for speech to finish
      await speakText(speechMessage, isHeadedMode);

      // Comfortable pause so user can see and hear each highlighted element
      await page.waitForTimeout(1000);

      // Attach screenshot of focused element
      const screenshot = await page.screenshot({ fullPage: false });
      await testInfo.attach(`Focus Tab #${tabCount} - ${elementInfo.name}`, {
        body: screenshot,
        contentType: 'image/png'
      });
    }

    await speakText('Completed Outdoor Page voiced reader audit.', isHeadedMode);
    console.log(`\nSuccessfully audited ${announcements.length} interactive elements with voiced announcements.`);
    expect(announcements.length).toBeGreaterThan(5);
  });
});
