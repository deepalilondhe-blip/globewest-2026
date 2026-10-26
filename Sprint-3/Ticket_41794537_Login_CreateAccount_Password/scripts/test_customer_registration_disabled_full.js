const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const REPORT_DIR = path.resolve(__dirname, 'registration_disabled_audit');
fs.mkdirSync(REPORT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 AUDIT: CUSTOMER REGISTRATION DISABLED VERIFICATION');
  console.log('Target: US Staging (mcstaging2.globewest.com)');
  console.log('Developer: Mohamed Bharmal | PR: 5321');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {};

  // -------------------------------------------------------------
  // TEST 1: Header Login Popup (Desktop & Mobile)
  // -------------------------------------------------------------
  console.log('🔍 [1/7] Testing Header Login Popup (Desktop 1440px)...');
  const contextDesk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageDesk = await contextDesk.newPage();
  await pageDesk.goto('https://mcstaging2.globewest.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await pageDesk.waitForTimeout(3000);

  // Click login toggle in header
  const loginToggle = pageDesk.locator('.authorization-link a, [data-action="customer-menu-toggle"], .header.links .authorization-link, a:has-text("Login")').first();
  if (await loginToggle.isVisible()) {
    await loginToggle.click();
    await pageDesk.waitForTimeout(1500);
  }

  const headerPopupCheck = await pageDesk.evaluate(() => {
    const popup = document.querySelector('.customer-menu, .block-customer-login, #customer-popup, .header-panel');
    const text = popup ? popup.innerText : document.body.innerText;
    const hasCreateAccountText = /create an account/i.test(text) || /don't have an account/i.test(text);
    const createBtn = document.querySelector('.customer-menu a[href*="account/create"], .block-customer-login a[href*="account/create"]');
    return {
      popupVisible: !!popup,
      hasCreateAccountText,
      hasCreateBtn: !!createBtn,
      rawText: popup ? popup.innerText.trim().replace(/\n+/g, ' | ') : 'N/A'
    };
  });
  results.test1_header_popup_desktop = headerPopupCheck;
  console.log('  Desktop Header Popup Result:', headerPopupCheck);
  const shot1 = path.join(REPORT_DIR, '01_desktop_header_login_popup.png');
  await pageDesk.screenshot({ path: shot1 });

  // Mobile Header Check
  console.log('🔍 [1b/7] Testing Header Login & Menu (Mobile 390px)...');
  const contextMob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });
  const pageMob = await contextMob.newPage();
  await pageMob.goto('https://mcstaging2.globewest.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await pageMob.waitForTimeout(3000);

  // Open mobile menu
  const burger = pageMob.locator('.action.nav-toggle, [data-action="toggle-nav"], .nav-toggle').first();
  if (await burger.isVisible()) {
    await burger.click();
    await pageMob.waitForTimeout(1500);
  }
  const mobileMenuCheck = await pageMob.evaluate(() => {
    const nav = document.querySelector('.navigation, .nav-sections, .mobile-menu');
    const text = nav ? nav.innerText : '';
    const hasCreate = /create an account/i.test(text) || /register/i.test(text);
    const regLinks = Array.from(document.querySelectorAll('a[href*="account/create"]')).map(a => a.href);
    return {
      hasCreateTextInMenu: hasCreate,
      registerLinksCount: regLinks.length,
      regLinks
    };
  });
  results.test1_header_menu_mobile = mobileMenuCheck;
  console.log('  Mobile Menu Result:', mobileMenuCheck);
  const shot1b = path.join(REPORT_DIR, '01b_mobile_menu_nav.png');
  await pageMob.screenshot({ path: shot1b });
  await contextMob.close();

  // -------------------------------------------------------------
  // TEST 2: Login Page (/customer/account/login/)
  // -------------------------------------------------------------
  console.log('\n🔍 [2/7] Testing Dedicated Login Page (/customer/account/login/)...');
  await pageDesk.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await pageDesk.waitForTimeout(3000);

  const loginPageCheck = await pageDesk.evaluate(() => {
    const newCustBlock = document.querySelector('.block-new-customer, .column-new-customer, .create-account-block');
    const createBtn = document.querySelector('a.action.create, a[href*="account/create"]');
    const registeredBlock = document.querySelector('.block-customer-login');
    return {
      hasNewCustBlock: !!newCustBlock,
      isNewCustBlockVisible: newCustBlock ? window.getComputedStyle(newCustBlock).display !== 'none' : false,
      hasCreateBtn: !!createBtn,
      hasRegisteredBlock: !!registeredBlock,
      loginPageText: document.querySelector('.main') ? document.querySelector('.main').innerText.trim().replace(/\n+/g, ' ') : ''
    };
  });
  results.test2_login_page = loginPageCheck;
  console.log('  Login Page Result:', loginPageCheck);
  const shot2 = path.join(REPORT_DIR, '02_login_page_inspection.png');
  await pageDesk.screenshot({ path: shot2 });

  // -------------------------------------------------------------
  // TEST 3: Direct Registration URL (/customer/account/create)
  // -------------------------------------------------------------
  console.log('\n🔍 [3/7] Testing Direct Access to /customer/account/create...');
  const respRegister = await pageDesk.goto('https://mcstaging2.globewest.com/customer/account/create', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await pageDesk.waitForTimeout(2500);

  const finalUrl = pageDesk.url();
  const regRedirectCheck = {
    requestedUrl: 'https://mcstaging2.globewest.com/customer/account/create',
    finalUrl: finalUrl,
    isRedirectedToLogin: finalUrl.includes('/customer/account/login') || finalUrl.endsWith('/customer/account/'),
    httpStatus: respRegister ? respRegister.status() : null
  };
  results.test3_register_page_redirect = regRedirectCheck;
  console.log('  Register URL Redirect Result:', regRedirectCheck);
  const shot3 = path.join(REPORT_DIR, '03_register_redirect_to_login.png');
  await pageDesk.screenshot({ path: shot3 });

  // -------------------------------------------------------------
  // TEST 4: Direct Form POST (/customer/account/createpost)
  // -------------------------------------------------------------
  console.log('\n🔍 [4/7] Testing Direct Form POST to /customer/account/createpost...');
  // Extract form key
  const formKey = await pageDesk.evaluate(() => {
    const input = document.querySelector('input[name="form_key"]');
    return input ? input.value : null;
  });

  const postResult = await pageDesk.evaluate(async (fKey) => {
    try {
      const formData = new URLSearchParams();
      formData.append('form_key', fKey || '');
      formData.append('firstname', 'TestBypass');
      formData.append('lastname', 'Tester');
      formData.append('email', 'test.bypass.attempt@example.com');
      formData.append('password', 'SecretPass123!');
      formData.append('password_confirmation', 'SecretPass123!');

      const response = await fetch('/customer/account/createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData.toString()
      });

      return {
        status: response.status,
        redirected: response.redirected,
        url: response.url,
        statusText: response.statusText
      };
    } catch (e) {
      return { error: e.message };
    }
  }, formKey);
  results.test4_direct_createpost = postResult;
  console.log('  POST /customer/account/createpost Result:', postResult);

  // -------------------------------------------------------------
  // TEST 5: Overdose Ajax Signup API (POST od_theme/account/signup)
  // -------------------------------------------------------------
  console.log('\n🔍 [5/7] Testing Ajax Signup API: POST /od_theme/account/signup...');
  const ajaxSignupResult = await pageDesk.evaluate(async (fKey) => {
    try {
      const formData = new URLSearchParams();
      formData.append('form_key', fKey || '');
      formData.append('email', 'test.ajax.signup@example.com');
      formData.append('password', 'SecretPass123!');

      const response = await fetch('/od_theme/account/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData.toString()
      });

      let json = null;
      let text = null;
      try {
        json = await response.json();
      } catch (e) {
        text = await response.text();
      }

      return {
        status: response.status,
        json,
        text: text ? text.substring(0, 300) : null
      };
    } catch (e) {
      return { error: e.message };
    }
  }, formKey);
  results.test5_ajax_signup = ajaxSignupResult;
  console.log('  POST /od_theme/account/signup Result:', ajaxSignupResult);

  // -------------------------------------------------------------
  // TEST 6: Online Booking Guest Save API (POST online_booking/customer/save)
  // -------------------------------------------------------------
  console.log('\n🔍 [6/7] Testing Online Booking Guest Save: POST /online_booking/customer/save...');
  const onlineBookingResult = await pageDesk.evaluate(async (fKey) => {
    try {
      const formData = new URLSearchParams();
      formData.append('form_key', fKey || '');
      formData.append('email', 'test.booking.guest@example.com');
      formData.append('firstname', 'Guest');
      formData.append('lastname', 'Booking');

      const response = await fetch('/online_booking/customer/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData.toString()
      });

      let json = null;
      let text = null;
      try {
        json = await response.json();
      } catch (e) {
        text = await response.text();
      }

      return {
        status: response.status,
        json,
        text: text ? text.substring(0, 300) : null
      };
    } catch (e) {
      return { error: e.message };
    }
  }, formKey);
  results.test6_online_booking = onlineBookingResult;
  console.log('  POST /online_booking/customer/save Result:', onlineBookingResult);

  await contextDesk.close();

  // -------------------------------------------------------------
  // TEST 7: Magento Admin Panel Setting Verification
  // -------------------------------------------------------------
  console.log('\n🔍 [7/7] Verifying Magento Admin Configuration Setting...');
  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const adminPage = await adminContext.newPage();

  console.log('  Logging into Magento Admin...');
  await adminPage.goto('https://mcstaging2.globewest.com.au/godmode/admin/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await adminPage.fill('#username', 'deepali.londhe@overdose.digital');
  await adminPage.fill('#login', '2Ho770ZEeX7v');
  await adminPage.click('button.action-login, button[type="submit"]');
  await adminPage.waitForTimeout(6000);

  console.log('  Navigating to Customer Configuration in Admin...');
  // Find URL to Stores > Configuration > Customers > Customer Configuration
  // Or navigate via menu:
  await adminPage.evaluate(() => {
    const configLink = Array.from(document.querySelectorAll('a')).find(a => a.href && a.href.includes('admin/system_config'));
    if (configLink) configLink.click();
  });
  await adminPage.waitForTimeout(4000);

  // Directly navigate to customer config section if available
  const currentAdminUrl = adminPage.url();
  const keyMatch = currentAdminUrl.match(/key\/([a-zA-Z0-9]+)/);
  const secretKey = keyMatch ? keyMatch[1] : '';

  if (secretKey) {
    const customerConfigUrl = `https://mcstaging2.globewest.com.au/godmode/admin/system_config/edit/section/customer/key/${secretKey}/`;
    console.log('  Navigating directly to:', customerConfigUrl);
    await adminPage.goto(customerConfigUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await adminPage.waitForTimeout(5000);
  }

  // Switch Scope to USA Website
  console.log('  Checking Scope switcher...');
  const scopeData = await adminPage.evaluate(() => {
    const scopeBtn = document.querySelector('#store-change-button, [data-role="store-switcher"]');
    const currentScope = scopeBtn ? scopeBtn.innerText.trim() : 'Unknown';
    return { hasScopeSwitcher: !!scopeBtn, currentScope };
  });
  console.log('  Current Scope:', scopeData);

  // Click scope switcher to select USA Website
  await adminPage.click('#store-change-button, [data-role="store-switcher"]').catch(() => {});
  await adminPage.waitForTimeout(1500);

  const switchedToUsa = await adminPage.evaluate(() => {
    const usaOption = Array.from(document.querySelectorAll('.dropdown-menu a, .store-switcher-all a, .admin__action-dropdown-menu a')).find(a => a.innerText.includes('USA Website') || a.innerText.includes('USA') || a.innerText.includes('US'));
    if (usaOption) {
      usaOption.click();
      return { clicked: true, text: usaOption.innerText.trim() };
    }
    return { clicked: false };
  });
  console.log('  Scope Switch to USA:', switchedToUsa);
  await adminPage.waitForTimeout(6000);

  // Expand "Create New Account Options"
  console.log('  Expanding "Create New Account Options" tab...');
  await adminPage.evaluate(() => {
    const tabHeader = document.querySelector('#customer_create_account_options-head, a[href*="customer_create_account_options"]');
    if (tabHeader) {
      if (!tabHeader.classList.contains('open')) tabHeader.click();
    }
  });
  await adminPage.waitForTimeout(2000);

  // Check the setting: "Allow Customer to Create Account from the Frontend"
  const adminSettingCheck = await adminPage.evaluate(() => {
    const select = document.querySelector('select[name*="create_account_options"][name*="create_account"], #customer_create_account_options_create_account_type, select[id*="create_account"]');
    const label = document.querySelector('label[for*="create_account"]');
    const scopeLabel = document.querySelector('#store-change-button');
    return {
      scope: scopeLabel ? scopeLabel.innerText.trim() : '',
      settingFound: !!select,
      settingId: select ? select.id : null,
      settingName: select ? select.name : null,
      selectedValue: select ? select.value : null,
      selectedText: select && select.selectedIndex >= 0 ? select.options[select.selectedIndex].text : null,
      labelText: label ? label.innerText.trim() : null
    };
  });
  results.test7_admin_setting = adminSettingCheck;
  console.log('  Admin Setting Check Result:', adminSettingCheck);

  const shot7 = path.join(REPORT_DIR, '07_magento_admin_customer_configuration.png');
  await adminPage.screenshot({ path: shot7, fullPage: false });
  console.log('  Screenshot 7 saved:', shot7);

  await adminContext.close();
  await browser.close();

  // Save JSON report
  const jsonReport = path.join(REPORT_DIR, 'AUTOMATION_TEST_RESULTS.json');
  fs.writeFileSync(jsonReport, JSON.stringify(results, null, 2));
  console.log('\n========================================================================');
  console.log('✅ ALL 7 AUTOMATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('Results saved to:', jsonReport);
  console.log('========================================================================');
})();
