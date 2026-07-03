// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration for GlobeWest 2026 Accessibility & Journey Automation
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 120000,
  expect: {
    timeout: 10000,
  },
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://mcstaging2.globewest.com.au', // Fallback to live URL if staging is not accessible
    trace: 'on-first-retry',
    headless: false,
    screenshot: 'on',
    video: 'on',
    ignoreHTTPSErrors: true,
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
    {
      name: 'desktop-safari',
      use: { ...devices['Desktop Safari'] },
    },

    /* 📱 Mobile Emulation */
    {
      name: 'mobile-safari-iphone',
      use: { 
        ...devices['iPhone 14 Pro Max'],
        launchOptions: {
          args: ['--window-size=430,932']
        }
      },
      testMatch: /.*accessibility.spec.js/,
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
      testMatch: /.*accessibility.spec.js/,
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
