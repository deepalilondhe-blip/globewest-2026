// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for GlobeWest 2026 Accessibility & Journey Automation
 * @see https://playwright.dev/docs/test-configuration
 */
// Dynamically set output folder based on the running test spec with timestamps to prevent reports being deleted/overwritten
const argvStr = process.argv.join(' ');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); // Format: YYYY-MM-DDTHH-MM-SS
let reportFolder = `playwright-report/general-${timestamp}`;
if (argvStr.includes('accessibility.spec.js')) {
  reportFolder = `playwright-report/accessibility-${timestamp}`;
} else if (argvStr.includes('journeys.spec.js')) {
  reportFolder = `playwright-report/journeys-${timestamp}`;
} else if (argvStr.includes('lighthouse.spec.js')) {
  reportFolder = `playwright-report/lighthouse-${timestamp}`;
} else if (argvStr.includes('staging-nvda.spec.js')) {
  reportFolder = 'playwright-report/nvda';
} else if (argvStr.includes('plp')) {
  reportFolder = 'playwright-report/plp';
}

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 240000,
  expect: {
    timeout: 15000,
  },
  reporter: [['html', { outputFolder: reportFolder, open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://mcstaging2.globewest.com.au', // Fallback to live URL if staging is not accessible
    trace: 'on-first-retry',
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  projects: [
    /* 💻 Desktop Browsers */
    {
      name: 'desktop-chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome',
        launchOptions: {
          args: ['--force-renderer-accessibility']
        }
      },
    },
    // ── Staging 2 NVDA Desktop (Headed — video + speech + screenshot per step) ──
    {
      name: 'staging2-nvda-desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: false,        // Headed = NVDA can see the screen
        screenshot: 'on',
        video: 'on',
        trace: 'on',
        viewport: { width: 1280, height: 900 },
        launchOptions: {
          args: [
            '--force-renderer-accessibility',
            '--start-maximized'
          ]
        }
      },
    },
    {
      name: 'desktop-safari',
      use: { ...devices['Desktop Safari'] },
    },

    /* 📱 Mobile Emulation */
    {
      name: 'mobile-safari-iphone',
      use: { 
        ...devices['Pixel 5'],
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 430, height: 932 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
        launchOptions: {
          args: ['--window-size=430,932']
        }
      },
      testMatch: /.*(accessibility|staging-nvda)\.spec\.js/,
    },
    {
      name: 'mobile-iphone17pro',
      use: {
        // iPhone 17 Pro viewport: 393x852, device pixel ratio 3
        // Base on Pixel 5 to run stably on Chromium under Windows
        ...devices['Pixel 5'],
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
        launchOptions: {
          args: ['--window-size=393,852']
        }
      },
    },
    {
      name: 'mobile-iphone18pro',
      use: {
        // iPhone 18 Pro (Hypothetical) viewport assumption: 400x874, device pixel ratio 3
        ...devices['Pixel 5'],
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1',
        viewport: { width: 400, height: 874 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
        launchOptions: {
          args: ['--window-size=420,950']
        }
      },
    },
    {
      name: 'mobile-chrome-android',
      use: { 
        ...devices['Pixel 5'],
        channel: 'chrome',
        launchOptions: {
          args: ['--window-size=393,851']
        }
      },
      testMatch: /.*(accessibility|staging-nvda)\.spec\.js/,
    },

    /* 📋 Tablet Emulation */
    {
      name: 'tablet-safari-ipad',
      use: { 
        ...devices['iPad Air'],
        channel: 'chrome',
        launchOptions: {
          args: ['--window-size=820,1180']
        }
      },
      testMatch: /.*accessibility.spec.js/,
    },
  ],
});
