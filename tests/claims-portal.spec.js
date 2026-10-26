const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const US_LOGIN_URL = 'https://mcstaging2.globewest.com/customer/account/login/';
const US_DASHBOARD_URL = 'https://mcstaging2.globewest.com/customer/account/';
const US_OPEN_CLAIMS_URL = 'https://mcstaging2.globewest.com/gw_sales/claim/index/status/open/';
const US_PENDING_CLAIMS_URL = 'https://mcstaging2.globewest.com/gw_sales/claim/index/status/pending/';
const US_CLOSED_CLAIMS_URL = 'https://mcstaging2.globewest.com/gw_sales/claim/index/status/closed/';
const US_CLAIMS_BASE_URL = 'https://mcstaging2.globewest.com/claims';
const US_CREATE_CLAIM_URL = 'https://mcstaging2.globewest.com/claims/create';

const AU_LOGIN_URL = 'https://mcstaging2.globewest.com.au/customer/account/login/';
const AU_DASHBOARD_URL = 'https://mcstaging2.globewest.com.au/customer/account/';

const SCREENSHOT_DIR = path.resolve(__dirname, '../../Sprint-3/Ticket_Claims_Portal/screenshots');

test.describe('Claims Portal - Dual-Auth & Figma Verification Suite', () => {

  test('TC-GW-CLM-001: Direct URL Routing & 302 Redirect Blocker on US Staging', async ({ page }) => {
    console.log('--- Step 1: Login as US Trade Customer ---');
    await page.goto(US_LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Check if already authenticated or enter credentials
    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.locator('#pass').fill('Deep@123');
      await page.locator('#send2').click();
      await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
    }

    console.log('--- Step 2: Navigate directly to Open Claims URL ---');
    const response = await page.goto(US_OPEN_CLAIMS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const finalUrl = page.url();
    const pageTitle = await page.title();
    
    console.log(`Target URL: ${US_OPEN_CLAIMS_URL}`);
    console.log(`Final Landed URL: ${finalUrl}`);
    console.log(`Page Title: ${pageTitle}`);

    // Take screenshot of result
    const isMobile = page.viewportSize().width < 768;
    const dest = path.join(SCREENSHOT_DIR, isMobile ? 'mobile' : 'desktop', `LIVE_US_${isMobile ? 'MOBILE' : 'DESKTOP'}_OPEN_CLAIMS.png`);
    await page.screenshot({ path: dest, fullPage: true });

    // Assert redirect blocker
    const isRedirectedToDashboard = finalUrl.includes('/customer/account/') && !finalUrl.includes('claim');
    console.log(`Defect Detected: Redirected back to My Dashboard? ${isRedirectedToDashboard}`);
    
    // In our audit, this is a P0 Blocker: it should land on Claims Portal, not redirect to Dashboard
    expect(isRedirectedToDashboard).toBe(true); // Verifies the defect is consistently reproducible
  });

  test('TC-GW-CLM-003: Verify Dashboard "Submit Claim" CTA Dead Link Defect', async ({ page }) => {
    await page.goto(US_DASHBOARD_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Ensure login if needed
    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.locator('#pass').fill('Deep@123');
      await page.locator('#send2').click();
      await page.waitForNavigation({ timeout: 30000 }).catch(() => {});
    }

    const submitClaimBtn = page.locator('.od-notification__button, a:has-text("SUBMIT CLAIM")');
    const isVisible = await submitClaimBtn.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isVisible) {
      const href = await submitClaimBtn.getAttribute('href');
      console.log(`Submit Claim CTA Button href: "${href}"`);
      // Blocker: href="#" is a dead button
      expect(href).toBe('#');
    } else {
      console.log('Submit Claim CTA button not found on dashboard');
    }
  });

  test('TC-GW-CLM-004: Verify Create Claim Form Route Status (404 Missing)', async ({ page }) => {
    const res = await page.goto(US_CREATE_CLAIM_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const status = res ? res.status() : 404;
    const pageTitle = await page.title();
    console.log(`Create Claim URL: ${US_CREATE_CLAIM_URL} -> Status: ${status}, Title: ${pageTitle}`);
    
    // 404 Not Found proves the form is not deployed
    expect(status === 404 || pageTitle.includes('404')).toBe(true);
  });

  test('TC-GW-CLM-005 & 006: Inspect Sidebar Claims Navigation & Missing Counter Badges', async ({ page }) => {
    await page.goto(US_DASHBOARD_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    const sidebar = page.locator('.sidebar.sidebar-main, .account-nav, .block-collapsible-nav');
    const openClaimsLink = page.locator('a[href*="claim"]:has-text("Open Claims")');
    const pendingClaimsLink = page.locator('a[href*="claim"]:has-text("Pending Claims")');

    const hasOpenClaims = await openClaimsLink.count() > 0;
    const hasPendingClaims = await pendingClaimsLink.count() > 0;

    console.log(`Open Claims link found: ${hasOpenClaims}`);
    console.log(`Pending Claims link found: ${hasPendingClaims}`);

    if (hasOpenClaims) {
      const openText = await openClaimsLink.first().innerText();
      console.log(`Open Claims text content: "${openText.trim()}"`);
      // Figma specifies a count badge e.g. "Open Claims [ 3 ]"
      const hasCountBadge = /\d+/.test(openText);
      console.log(`Has numeric count badge: ${hasCountBadge}`);
    }
  });

  test('TC-GW-CLM-021: Verify Public Browsing Mode Masking', async ({ browser }) => {
    const context = await browser.newContext();
    const guestPage = await context.newPage();
    
    // Navigate as guest to /claims
    const response = await guestPage.goto(US_CLAIMS_BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const finalUrl = guestPage.url();
    console.log(`Guest access to ${US_CLAIMS_BASE_URL} landed on: ${finalUrl}`);
    
    // Guest should be redirected to login or 404
    const isRestricted = finalUrl.includes('/login') || finalUrl.includes('404') || (response && response.status() === 404);
    expect(isRestricted).toBe(true);
    await context.close();
  });

});
