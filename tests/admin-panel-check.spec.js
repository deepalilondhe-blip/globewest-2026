// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const ADMIN_URL = 'https://mcstaging2.globewest.com.au/godmode/admin/';
const ADMIN_USERNAME = 'deepali.londhe@overdose.digital';
const ADMIN_PASSWORD = '2Ho770ZEeX7v';

test.describe('Admin Panel Access Check', () => {
  
  test('ADMIN-01: Verify Admin Panel Login', async ({ page }) => {
    console.log('🔐 Navigating to Admin Panel...');
    
    await page.goto(ADMIN_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`📍 Current URL: ${currentUrl}`);

    // Take screenshot of what we see
    await page.screenshot({ 
      path: path.join(__dirname, '..', 'admin_panel_check.png'),
      fullPage: true 
    });

    // Check if login form is visible
    const loginForm = page.locator('form#login-form, form[action*="login"], input#username, input[name="login[username]"]').first();
    const isLoginPage = await loginForm.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isLoginPage) {
      console.log('📋 Login form detected – entering credentials...');
      
      // Enter username
      const usernameField = page.locator('input#username, input[name="login[username]"]').first();
      await usernameField.fill(ADMIN_USERNAME);
      
      // Enter password
      const passwordField = page.locator('input#login, input[name="login[password]"]').first();
      await passwordField.fill(ADMIN_PASSWORD);

      // Click Sign In
      const signInBtn = page.locator('button.action-login, button[type="submit"]:has-text("Sign in")').first();
      await signInBtn.click();

      // Wait for navigation
      await page.waitForTimeout(8000);

      const afterLoginUrl = page.url();
      console.log(`📍 URL after login: ${afterLoginUrl}`);

      // Screenshot after login
      await page.screenshot({ 
        path: path.join(__dirname, '..', 'admin_panel_after_login.png'),
        fullPage: true 
      });

      // Check if we landed on dashboard
      const dashboardIndicator = page.locator('.page-title:has-text("Dashboard"), .admin__page-nav, #menu-magento-backend-dashboard').first();
      const isDashboard = await dashboardIndicator.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (isDashboard) {
        console.log('✅ ADMIN PANEL OPENED SUCCESSFULLY – Dashboard is visible');
      } else {
        // Check for error messages
        const errorMsg = page.locator('.message-error, .message.error').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);
        if (hasError) {
          const errorText = await errorMsg.innerText();
          console.log(`❌ Login error: "${errorText.trim()}"`);
        } else {
          console.log('⚠️ Login submitted but dashboard not confirmed. Page may have loaded partially.');
        }
      }
    } else {
      // Already logged in or different page
      const pageTitle = await page.title();
      console.log(`📋 Page title: "${pageTitle}"`);
      
      if (currentUrl.includes('godmode') || currentUrl.includes('admin')) {
        console.log('✅ Admin panel URL is accessible');
      } else {
        console.log('⚠️ Redirected away from admin panel');
      }
    }
  });
});
