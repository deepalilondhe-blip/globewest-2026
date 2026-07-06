// @ts-check
const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');

// Persistent PowerShell speech engine to serialize screen reader announcements without process spawning overhead
let speechProcess = null;
let speechResolver = null;

function startSpeechEngine() {
  if (speechProcess) return;
  const { spawn } = require('child_process');
  speechProcess = spawn('powershell.exe', [
    '-NoProfile',
    '-Command',
    `
      Add-Type -AssemblyName System.Speech;
      $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer;
      $synth.Rate = 4;
      [Console]::Out.WriteLine("Ready");
      while ($line = [Console]::In.ReadLine()) {
        if ($line.Trim() -ne "") {
          $synth.Speak($line);
          [Console]::Out.WriteLine("Done");
        }
      }
    `
  ]);
  
  speechProcess.stdin.setDefaultEncoding('utf-8');
  
  // Listen for the "Done" callback from PowerShell to unblock the tabbing flow
  speechProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    if (message.includes('Done') && speechResolver) {
      const resolve = speechResolver;
      speechResolver = null;
      resolve();
    }
  });
}

async function speakText(text, isHeaded = true) {
  return new Promise((resolve) => {
    try {
      // Disable speech and resolve immediately if running headless for speed optimization
      if (!isHeaded) {
        resolve();
        return;
      }

      const cleanText = text.replace(/[\r\n]/g, ' ').replace(/['"<>|]/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }
      
      startSpeechEngine();
      speechResolver = resolve;
      speechProcess.stdin.write(cleanText + '\n');
    } catch (e) {
      resolve();
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

// List of target pages on GlobeWest staging to test
const PAGES_TO_TEST = [
  { name: '1. Homepage', path: '/' },
  { name: '2. Product Listing Page (PLP)', path: '/indoor' },
  { name: '3. Product Detail Page (PDP)', path: '/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass' },
  { name: '4. Shopping Cart / Checkout', path: '/checkout/cart/' },
  { name: '5. My Account Login', path: '/customer/account/login/' },
  { name: '6. B2B Trade Portal', path: '/help-centre/general/trade-registration' },
  { name: '7. Search Results Page', path: '/catalogsearch/result/?q=sofa' },
  { name: '8. Content / Static Page', path: '/about-us' }
];

test.describe('GlobeWest Staging NVDA & Keyboard Navigation Audit', () => {

  test.afterAll(async () => {
    stopSpeechEngine();
  });

  test.beforeEach(async ({ page }, testInfo) => {
    const isHeadedMode = !testInfo.project.use.headless;
    // Set high timeout for headed runs with audio, and safe 2-minute timeout for headless speed runs
    test.setTimeout(isHeadedMode ? 600000 : 120000);
    // Block third-party scripts that generate blocking overlay popups and slow down page navigation on staging
    await page.route('**/*listrak*', route => route.abort());
    await page.route('**/*klaviyo*', route => route.abort());
    await page.route('**/*hotjar*', route => route.abort());
    await page.route('**/*google-analytics*', route => route.abort());
    await page.route('**/*yotpo*', route => route.abort());
  });

  for (const pageInfo of PAGES_TO_TEST) {
    test(`Audit ${pageInfo.name}`, async ({ page }, testInfo) => {
      console.log(`\n==========================================`);
      console.log(`Starting Staging Audit: ${pageInfo.name}`);
      console.log(`Navigating to path: ${pageInfo.path}`);
      
      // 1. Navigate to target staging page and wait for the page to render fully
      await page.goto(pageInfo.path);
      
      // Wait for network activity to settle or load state
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch (e) {
        await page.waitForLoadState('load');
      }
      
      // Additional wait to ensure client-side components and images are completely rendered
      await page.waitForTimeout(4000);
      
      // 2. Dismiss any overlay welcome newsletter popups or modals
      const closeSelectors = [
        'a#lpclose',
        'button#lpclose',
        '.modal-popup button.action-close',
        '.modal-header button.action-close',
        'button.action-close',
        '.lp-close',
        '.close-popup',
        '#newsletter-popup button.close',
        'button.close',
        'a.close',
        '[aria-label="Close"]',
        '.action.close'
      ];
      for (const selector of closeSelectors) {
        try {
          const closeBtn = page.locator(selector).first();
          if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await page.waitForTimeout(1000);
          }
        } catch (e) {
          // Ignore error checks
        }
      }

      // Dismiss cookie banner if it is visible
      const cookieAcceptBtn = page.locator('#btn-cookie-allow, button.cookie-accept');
      if (await cookieAcceptBtn.isVisible()) {
        await cookieAcceptBtn.click();
        await page.waitForTimeout(1000);
      }

      // Capture initial page state screenshot to artifact directory for reporting
      const artifactDir = `C:\\Users\\Deepali_Londhe\\.gemini\\antigravity\\brain\\2fcf22a4-2816-498c-8f1d-86c05c328536`;
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

      // 4. Bring browser window to front and anchor focus on the skip link or logo to avoid third-party iframe traps
      await page.bringToFront();
      
      // Inject CSS stylesheet to hide popups and search suggestions to prevent keyboard focus traps
      await page.addStyleTag({
        content: `
          a#lpclose, .listrak-popup, #omnisend-form-container, .newsletter-popup, div[role="dialog"], .modal-popup, .lp-popup, .search-autocomplete, #search_autocomplete {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
        `
      });

      const skipLink = page.locator('a.skip-link, a.logo, .logo a, a.logo-image, header a, a').first();
      if (await skipLink.isVisible()) {
        await skipLink.focus();
        // Tag the initially focused element as seen so we don't exit instantly
        await page.evaluate(() => {
          if (document.activeElement) {
            document.activeElement.setAttribute('data-a11y-seen', 'true');
          }
        });
      } else {
        await page.locator('body').click();
      }
      await page.waitForTimeout(1000);

      const isHeadedMode = !testInfo.project.use.headless;

      // Announce the start of the page audit via speech
      await speakText(`Auditing ${pageInfo.name.replace(/^\d+\.\s*/, '')}`, isHeadedMode);

      // 5. Dynamic Tab loop - Simulate keyboard navigation through all focusable elements until they wrap around
      const maxTabs = 150; // Safety limit to prevent infinite loops
      let tabCount = 0;
      let consecutiveBodyCount = 0;
      let lastActiveSelector = '';

      while (tabCount < maxTabs) {
        tabCount++;
        console.log(`Pressing TAB #${tabCount}...`);
        await page.keyboard.press('Tab');
        await page.waitForTimeout(300); // Allow focus state transition

        // Get active element selector to detect stuck focus (excluding the highlight class)
        let currentActiveSelector = '';
        try {
          currentActiveSelector = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el) return '';
            const classes = Array.from(el.classList).filter(c => c !== 'a11y-focus-highlight');
            return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (classes.length ? '.' + classes.join('.') : '');
          });
        } catch (e) {
          console.log(`[A11y Info] Navigation or context destruction detected during active element query. Ending tab loop.`);
          break;
        }

        // Recovery: If focus is stuck on the same element, press Escape to dismiss dropdowns/popups and tab again
        if (currentActiveSelector === lastActiveSelector && tabCount > 1) {
          console.log(`[A11y Warning] Focus stuck on element: ${currentActiveSelector}. Pressing ESC to recover...`);
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
          await page.keyboard.press('Tab');
          await page.waitForTimeout(300);
        }
        lastActiveSelector = currentActiveSelector;

        // Evaluate the focused element and check if we have seen it before
        let elementInfo;
        try {
          elementInfo = await page.evaluate(() => {
            const active = document.activeElement;
            if (!active || active === document.body) {
              return { tag: 'body', name: 'body', isClickable: false, alreadySeen: false };
            }

            const tag = active.tagName.toLowerCase();
            const role = active.getAttribute('role') || 'None';
            const ariaLabel = active.getAttribute('aria-label') || '';
            const alt = active.getAttribute('alt') || '';
            const textContent = active.textContent?.trim() || '';
            
            let name = ariaLabel || alt || textContent || active.getAttribute('name') || 'Unnamed Control';
            if (name.length > 50) name = name.substring(0, 47) + '...';

            const isClickable = tag === 'a' || tag === 'button' || role === 'button' || active.getAttribute('onclick') !== null;
            
            const alreadySeen = active.hasAttribute('data-a11y-seen');
            if (!alreadySeen) {
              active.setAttribute('data-a11y-seen', 'true');
            }
            return { tag, name, isClickable, alreadySeen };
          });
        } catch (e) {
          console.log(`[A11y Info] Navigation or context destruction detected during element info query. Ending tab loop.`);
          break;
        }

        // Break if we wrap around to an already seen element
        if (elementInfo.alreadySeen) {
          console.log(`[A11y] Wrapped around to an already inspected element: ${elementInfo.name}. Finishing tab loop.`);
          break;
        }

        // Handle body focus: if we stay on body multiple times consecutively, we exit
        if (elementInfo.tag === 'body') {
          consecutiveBodyCount++;
          if (consecutiveBodyCount > 3) {
            console.log(`[A11y] Focused on body consecutively. Ending tab loop.`);
            break;
          }
        } else {
          consecutiveBodyCount = 0;
        }

        // Screen-reader style announcement (concise)
        let role = elementInfo.tag;
        if (role === 'a') role = 'link';
        if (role === 'input') role = 'edit';
        if (role === 'img') role = 'image';
        if (role === 'button') role = 'button';
        if (role === 'select') role = 'combo box';
        
        const speakMsg = `${elementInfo.name} ${role}`;
        console.log(`  Tab ${tabCount}: ${speakMsg}`);
        await speakText(speakMsg, isHeadedMode);

        // Capture screenshot of the highlighted focused element
        const stepScreenshot = await page.screenshot({ fullPage: false });
        await testInfo.attach(`Tab #${tabCount} - Focused: ${elementInfo.tag} [${elementInfo.name}]`, {
          body: stepScreenshot,
          contentType: 'image/png'
        });

        await page.waitForTimeout(200);
      }

      await speakText(`Finished auditing ${pageInfo.name.replace(/^\d+\.\s*/, '')}`, isHeadedMode);
    });
  }
});
