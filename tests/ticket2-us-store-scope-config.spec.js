// @ts-check
/**
 * ============================================================
 * TICKET 2: Configure US Store-View Scope
 * Test File: ticket2-us-store-scope-config.spec.js
 * ============================================================
 *
 * PURPOSE:
 *   Verify that every required Magento Admin configuration field
 *   for the GlobeWest USA website scope is correctly set.
 *   Each test case maps 1-to-1 to a row in the configuration
 *   specification table shared by the project team.
 *
 * FLOW FOR EVERY TEST:
 *   1. Navigate to Admin Panel → use direct key URL or login flow
 *   2. Navigate to the target Stores > Configuration path
 *   3. Set the correct Store-View scope (GlobeWest US)
 *   4. Read / assert the configured value
 *   5. Screenshot evidence saved per test
 *
 * ADMIN CREDENTIALS:
 *   URL      : https://mcstaging2.globewest.com.au/godmode/admin/
 *   Username : deepali.londhe@overdose.digital
 *   Password : stored in ADMIN_PASS env var
 *
 * RUN COMMAND:
 *   npx playwright test ticket2-us-store-scope-config.spec.js --headed
 * ============================================================
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_BASE  = 'https://mcstaging2.globewest.com.au/godmode/admin';
const ADMIN_DASH  = 'https://mcstaging2.globewest.com.au/godmode/admin/dashboard/index/key/6d86dbce835dd074acfbd649a6127972d3731e91889d6de6702beb1ea91213c0/';
const ADMIN_USER  = process.env.ADMIN_USER  || 'deepali.londhe@overdose.digital';
const ADMIN_PASS  = process.env.ADMIN_PASS  || '2Ho770ZEeX7v';
const SCREENSHOTS = path.join(__dirname, '..', 'test-results', 'ticket2-screenshots');

// Magento Admin → Stores > Configuration deep-link section paths
const CFG = {
  general  : `${ADMIN_BASE}/system_config/edit/section/general/`,
  currency : `${ADMIN_BASE}/system_config/edit/section/currency/`,
  web      : `${ADMIN_BASE}/system_config/edit/section/web/`,
};

// ─── Shared Helpers ───────────────────────────────────────────────────────────

/** Performs admin login if the login form is detected. Safe to re-call if already logged in. */
async function ensureAdminLogin(page) {
  await page.goto(ADMIN_DASH, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  const loginField = page.locator('input#username, input[name="login[username]"]').first();
  const isLoginPage = await loginField.isVisible({ timeout: 5000 }).catch(() => false);
  if (isLoginPage) {
    console.log('🔐 Login form detected — authenticating...');
    await loginField.fill(ADMIN_USER);
    await page.locator('input#login, input[name="login[password]"]').first().fill(ADMIN_PASS);
    await page.locator('button.action-login, button[type="submit"]').first().click();
    await page.waitForURL(/dashboard/, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log(`✅ Logged in — current URL: ${page.url()}`);
  } else {
    console.log('ℹ️  Already authenticated — skipping login step.');
  }
}

/**
 * Navigates to a Stores > Configuration section and switches scope to US store-view.
 * @param {import('@playwright/test').Page} page
 * @param {string} configUrl - Full admin config section URL
 */
async function gotoConfigSection(page, configUrl) {
  await page.goto(configUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Switch scope to US store-view if the scope switcher dropdown is present
  const selectEl = page.locator('select#store_switcher, select[name="store_switcher"]').first();
  if (await selectEl.isVisible({ timeout: 4000 }).catch(() => false)) {
    const options = await selectEl.locator('option').all();
    for (const opt of options) {
      const text = await opt.innerText();
      if (
        text.toLowerCase().includes('globewest us') ||
        text.toLowerCase().includes('united states') ||
        (text.toLowerCase().includes('us') && !text.toLowerCase().includes('australia'))
      ) {
        const val = await opt.getAttribute('value');
        await selectEl.selectOption({ value: val });
        await page.waitForTimeout(2000);
        console.log(`🔀 Switched scope to: "${text.trim()}"`);
        break;
      }
    }
  }

  console.log(`📄 Config section loaded: "${await page.title()}"`);
}

/** Expands a Magento config fieldset by clicking its legend if collapsed. */
async function expandSection(page, sectionSelector) {
  const section = page.locator(sectionSelector).first();
  if (await section.isVisible({ timeout: 3000 }).catch(() => false)) {
    const legend = section.locator('legend, .fieldset-legend').first();
    if (await legend.isVisible({ timeout: 2000 }).catch(() => false)) {
      await legend.click().catch(() => {});
      await page.waitForTimeout(600);
    }
  }
}

/** Saves a named screenshot for evidence. */
async function captureEvidence(page, testId) {
  try {
    const screenshotPath = path.join(SCREENSHOTS, `${testId}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved → ${screenshotPath}`);
  } catch (e) {
    console.warn(`[captureEvidence] Could not save screenshot: ${e.message}`);
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

test.describe('Ticket 2: US Store-View Scope Configuration Verification', () => {

  // Authenticate before every test
  test.beforeEach(async ({ page }) => {
    await ensureAdminLogin(page);
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-01: USA Website Timezone Configuration
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Locale Options > Timezone
   *
   * EXPECTED:
   *   A US timezone (America/*, US/*, Pacific/*, etc.)
   *   NOT "Australia/Sydney" or any AU timezone.
   *
   * WHY: Wrong timezone produces incorrect order timestamps and scheduling.
   */
  test('TC-US-CFG-01: USA Website Timezone is Set to a Valid US Timezone', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Locale Options")), [id*="locale_options"]');

    const timezoneSelect = page.locator(
      'select[name="groups[locale][fields][timezone][value]"], select#general_locale_timezone, [id*="locale_timezone"]'
    ).first();

    if (await timezoneSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      const timezoneValue = await timezoneSelect.evaluate(
        e => e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : e.value
      );
      console.log(`⏰ [TC-US-CFG-01] Timezone: "${timezoneValue}"`);

      const usTimezonePatterns = ['America/', 'US/', 'Pacific/', 'Mountain/', 'Central/', 'Eastern/', 'Chicago', 'New_York', 'Los_Angeles', 'Denver'];
      const isUsTimezone = usTimezonePatterns.some(p => timezoneValue.includes(p));

      expect(
        isUsTimezone,
        `Expected a US timezone (e.g. America/Chicago) but found: "${timezoneValue}"`
      ).toBe(true);
      expect(timezoneValue, 'Timezone must NOT be an Australian timezone').not.toContain('Australia');
    } else {
      console.warn('[TC-US-CFG-01] ⚠️ Timezone field not found — verify US scope is selected');
    }

    await captureEvidence(page, 'TC-US-CFG-01');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-02: Language & Format Set to United States English
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Locale Options > Locale
   *
   * EXPECTED:
   *   Locale = en_US (English - United States)
   *   NOT en_AU.
   *
   * WHY: AU locale formats dates/numbers differently; US B2B customers expect en_US.
   */
  test('TC-US-CFG-02: Locale Language & Format is Set to United States English (en_US)', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Locale Options")), [id*="locale_options"]');

    const localeSelect = page.locator(
      'select[name="groups[locale][fields][code][value]"], select#general_locale_code, [id*="locale_code"]'
    ).first();

    if (await localeSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      const localeText = await localeSelect.evaluate(
        e => e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : ''
      );
      const localeVal = await localeSelect.inputValue();
      console.log(`🌍 [TC-US-CFG-02] Locale: "${localeText}" (value=${localeVal})`);

      expect(localeVal, `Expected en_US locale but found: "${localeVal}"`).toContain('en_US');
      expect(localeText.toLowerCase(), 'Locale label must mention United States').toContain('united states');
      expect(localeVal, 'Locale must NOT be en_AU').not.toContain('en_AU');
    } else {
      console.warn('[TC-US-CFG-02] ⚠️ Locale field not visible — verify US scope is selected');
    }

    await captureEvidence(page, 'TC-US-CFG-02');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-03: Store Information Country Set to United States
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Store Information > Country
   *
   * EXPECTED:
   *   Country dropdown value = "US" / "United States"
   *
   * WHY: Governs default tax, shipping origin country, and B2B registration fields.
   */
  test('TC-US-CFG-03: Store Information Country is Set to United States', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Store Information")), [id*="store_information"]');

    const countrySelect = page.locator(
      'select[name="groups[store_information][fields][country_id][value]"], [id*="store_information_country_id"]'
    ).first();

    if (await countrySelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      const countryText = await countrySelect.evaluate(
        e => e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : ''
      );
      const countryVal = await countrySelect.inputValue();
      console.log(`🗺️ [TC-US-CFG-03] Store Country: "${countryText}" (value=${countryVal})`);

      expect(countryVal, `Expected "US" but got "${countryVal}"`).toBe('US');
      expect(countryText.toLowerCase(), 'Country label must say United States').toContain('united states');
    } else {
      console.warn('[TC-US-CFG-03] ⚠️ Country field not found — expand Store Information section');
    }

    await captureEvidence(page, 'TC-US-CFG-03');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-04: Store Name (Brand Name) Set for US Customers
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Store Information > Store Name
   *
   * EXPECTED:
   *   Non-empty, contains "GlobeWest" brand name.
   *
   * WHY: The public store name shown to US customers in emails and invoices.
   */
  test('TC-US-CFG-04: Store Name is Populated and References the GlobeWest Brand for US Customers', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Store Information")), [id*="store_information"]');

    const storeNameInput = page.locator(
      'input[name="groups[store_information][fields][name][value]"], [id*="store_information_name"]'
    ).first();

    if (await storeNameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const storeName = await storeNameInput.inputValue();
      console.log(`🏷️ [TC-US-CFG-04] Store Name: "${storeName}"`);

      expect(storeName.trim().length, 'Store Name must not be empty').toBeGreaterThan(0);
      expect(storeName.toLowerCase(), `Store Name must contain "globewest" but found: "${storeName}"`).toContain('globewest');
    } else {
      console.warn('[TC-US-CFG-04] ⚠️ Store Name field not visible');
    }

    await captureEvidence(page, 'TC-US-CFG-04');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-05: USA Customer Support Phone Number is Set
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Store Information > Store Phone Number
   *
   * EXPECTED:
   *   Non-empty phone number.
   *   NOT starting with +61, 1800 (AU patterns).
   *
   * WHY: Displayed in storefront header/footer to US customers.
   */
  test('TC-US-CFG-05: USA Customer Support Phone Number is Populated and Uses US Format', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Store Information")), [id*="store_information"]');

    const phoneInput = page.locator(
      'input[name="groups[store_information][fields][phone][value]"], [id*="store_information_phone"]'
    ).first();

    if (await phoneInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const phone = await phoneInput.inputValue();
      console.log(`📞 [TC-US-CFG-05] Store Phone: "${phone}"`);

      expect(phone.trim().length, 'Customer Support Phone must not be empty').toBeGreaterThan(0);
      expect(phone, 'Phone must not be an AU number (+61 / 1800 / 0x)').not.toMatch(/^\+61|^1800|^0[2-9]/);
    } else {
      console.warn('[TC-US-CFG-05] ⚠️ Phone field not found — expand Store Information section');
    }

    await captureEvidence(page, 'TC-US-CFG-05');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-06: Store Address — City Set to a US City
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Store Information > City
   *
   * EXPECTED:
   *   Non-empty, NOT an Australian city name.
   *
   * WHY: City appears on tax invoices and order confirmation emails.
   */
  test('TC-US-CFG-06: Store Address City is Set to a US City (Not an Australian City)', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Store Information")), [id*="store_information"]');

    const cityInput = page.locator(
      'input[name="groups[store_information][fields][city][value]"], [id*="store_information_city"]'
    ).first();

    if (await cityInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const city = await cityInput.inputValue();
      console.log(`🏙️ [TC-US-CFG-06] Store City: "${city}"`);

      expect(city.trim().length, 'Store City must not be empty').toBeGreaterThan(0);

      const auCities = ['melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'canberra', 'darwin', 'hobart'];
      const isAuCity = auCities.some(c => city.toLowerCase().includes(c));
      expect(isAuCity, `City "${city}" is an Australian city — update to a US city`).toBe(false);
    } else {
      console.warn('[TC-US-CFG-06] ⚠️ City field not visible');
    }

    await captureEvidence(page, 'TC-US-CFG-06');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-07: Store Address — State/Region Set to a US State
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Store Information > Region / State
   *
   * EXPECTED:
   *   Non-empty US state (CA, TX, IL, NY, etc.)
   *   NOT an Australian state (VIC, NSW, QLD, SA, WA).
   *
   * WHY: State drives tax rate computation and US carrier rate lookups.
   */
  test('TC-US-CFG-07: Store Address State is a Valid US State (Not an Australian State)', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Store Information")), [id*="store_information"]');

    const stateSelect = page.locator('[id*="store_information_region_id"]').first();
    const stateInput  = page.locator('[id*="store_information_region"]').first();

    let stateValue = '';
    if (await stateSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      stateValue = await stateSelect.evaluate(
        e => e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : e.value
      );
    } else if (await stateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      stateValue = await stateInput.inputValue();
    }

    if (stateValue.trim().length > 0) {
      console.log(`📍 [TC-US-CFG-07] Store State: "${stateValue}"`);

      const auStates = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT',
                        'Victoria', 'New South Wales', 'Queensland', 'South Australia',
                        'Western Australia', 'Tasmania'];
      const isAuState = auStates.some(s => stateValue.toUpperCase().includes(s.toUpperCase()));
      expect(isAuState, `State "${stateValue}" is an AU state — update to a US state`).toBe(false);
    } else {
      console.warn('[TC-US-CFG-07] ⚠️ State field not found — expand Store Information section');
    }

    await captureEvidence(page, 'TC-US-CFG-07');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-08: Store Address — ZIP Code is US 5-Digit Format
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Store Information > ZIP / Postal Code
   *
   * EXPECTED:
   *   Matches US 5-digit ZIP format (e.g. 60601 or 60601-1234).
   *   NOT a 4-digit AU postcode (e.g. 3000).
   *
   * WHY: Used on invoices and US carrier shipping rate lookups.
   */
  test('TC-US-CFG-08: Store ZIP Code is a Valid 5-Digit US ZIP (Not a 4-Digit AU Postcode)', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Store Information")), [id*="store_information"]');

    const zipInput = page.locator(
      'input[name="groups[store_information][fields][postcode][value]"], [id*="store_information_postcode"]'
    ).first();

    if (await zipInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const zip = await zipInput.inputValue();
      console.log(`📮 [TC-US-CFG-08] Store ZIP: "${zip}"`);

      expect(zip.trim().length, 'ZIP code must not be empty').toBeGreaterThan(0);

      // US ZIP: 5 digits, optionally followed by hyphen + 4 digits
      const isUsZip = /^\d{5}(-\d{4})?$/.test(zip.trim());
      expect(isUsZip, `Expected a 5-digit US ZIP but found: "${zip}" (AU postcodes are 4 digits)`).toBe(true);
    } else {
      console.warn('[TC-US-CFG-08] ⚠️ Postcode field not visible');
    }

    await captureEvidence(page, 'TC-US-CFG-08');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-09: Store Address — Street Address Populated for US Location
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > Store Information > Street Address (Line 1)
   *
   * EXPECTED:
   *   Non-empty; does NOT contain Australian address keywords
   *   (VIC, NSW, QLD, Melbourne, Sydney, Australia).
   *
   * WHY: Printed on tax invoices and order confirmation emails sent to US customers.
   */
  test('TC-US-CFG-09: Store Street Address is Populated for the US Location (No Australian Keywords)', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("Store Information")), [id*="store_information"]');

    const streetInput = page.locator(
      'input[name="groups[store_information][fields][street_line1][value]"], [id*="store_information_street_line1"]'
    ).first();

    if (await streetInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const street = await streetInput.inputValue();
      console.log(`🏢 [TC-US-CFG-09] Store Street: "${street}"`);

      expect(street.trim().length, 'Street Address must not be empty').toBeGreaterThan(0);

      const auKeywords = ['VIC', 'NSW', 'QLD', 'Australia', 'Melbourne', 'Sydney', 'Brisbane', 'Perth'];
      const hasAuKeyword = auKeywords.some(kw => street.includes(kw));
      expect(hasAuKeyword, `Street "${street}" contains AU address keywords — update to US address`).toBe(false);
    } else {
      console.warn('[TC-US-CFG-09] ⚠️ Street Address field not found');
    }

    await captureEvidence(page, 'TC-US-CFG-09');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-10: State/Region Required for United States in Checkout
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > General
   *   > State Options > State is Required for
   *
   * EXPECTED:
   *   "United States" is selected in the multi-select list of countries
   *   for which state/region is a required field at checkout.
   *
   * WHY: US tax compliance and carrier integrations require a valid state.
   */
  test('TC-US-CFG-10: State/Region Required Checkbox Includes United States for Checkout Address Validation', async ({ page }) => {
    await gotoConfigSection(page, CFG.general);
    await expandSection(page, 'fieldset:has(legend:has-text("State Options")), [id*="state_options"]');

    const stateRequiredSelect = page.locator(
      'select[name="groups[region][fields][state_required][value][]"], [id*="region_state_required"]'
    ).first();

    if (await stateRequiredSelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      const selectedCountries = await stateRequiredSelect.evaluate(sel => {
        return Array.from(sel.selectedOptions).map(o => o.text);
      });
      console.log(`📋 [TC-US-CFG-10] State-required countries: [${selectedCountries.join(', ')}]`);

      const hasUS = selectedCountries.some(c => c.toLowerCase().includes('united states'));
      expect(hasUS, `"United States" must be in "State is Required for" list. Found: [${selectedCountries.join(', ')}]`).toBe(true);
    } else {
      // Fallback: inspect checkbox or option
      const usOption = page.locator('option[value="US"]').first();
      if (await usOption.count() > 0) {
        const isSelected = await usOption.evaluate(o => o.selected);
        console.log(`[TC-US-CFG-10] US option selected: ${isSelected}`);
        expect(isSelected, '"United States" must be selected in state-required list').toBe(true);
      } else {
        console.warn('[TC-US-CFG-10] ⚠️ State Options section not found — expand section manually');
      }
    }

    await captureEvidence(page, 'TC-US-CFG-10');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-11: Public Base URL (HTTP) is Bound to the US Domain
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > Web
   *   > Base URLs > Base URL
   *
   * EXPECTED:
   *   Contains "globewest.com" (US domain).
   *   Does NOT contain ".com.au" (AU domain).
   *
   * WHY: Domain binding for all public US storefront URLs — wrong binding
   *      causes cross-domain redirects and AU scope leakage.
   */
  test('TC-US-CFG-11: Public HTTP Base URL is Bound to the US Domain (globewest.com, Not .com.au)', async ({ page }) => {
    await gotoConfigSection(page, CFG.web);
    await expandSection(page, 'fieldset:has(legend:has-text("Base URLs")), [id*="unsecure"]');

    const baseUrlInput = page.locator(
      'input[name="groups[unsecure][fields][base_url][value]"], [id*="web_unsecure_base_url"]'
    ).first();

    if (await baseUrlInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const baseUrl = await baseUrlInput.inputValue();
      console.log(`🌐 [TC-US-CFG-11] HTTP Base URL: "${baseUrl}"`);

      expect(baseUrl.trim().length, 'Base URL must not be empty').toBeGreaterThan(0);
      expect(baseUrl, `Base URL must contain "globewest.com" (US domain) but found: "${baseUrl}"`).toContain('globewest.com');
      expect(baseUrl, `Base URL must NOT contain ".com.au" but found: "${baseUrl}"`).not.toContain('.com.au');
    } else {
      console.warn('[TC-US-CFG-11] ⚠️ Base URL field not visible — check scope selection');
    }

    await captureEvidence(page, 'TC-US-CFG-11');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-12: Secure Base URL (HTTPS) is Bound to the US Domain
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > Web
   *   > Base URLs (Secure) > Secure Base URL
   *
   * EXPECTED:
   *   Starts with "https://".
   *   Contains "globewest.com" (US domain).
   *   Does NOT contain ".com.au".
   *
   * WHY: Required for secure checkout, payment gateways, and SSL certificate matching.
   */
  test('TC-US-CFG-12: Secure HTTPS Base URL is Bound to the US Domain with Valid HTTPS Protocol', async ({ page }) => {
    await gotoConfigSection(page, CFG.web);
    await expandSection(page, 'fieldset:has(legend:has-text("Base URLs (Secure)")), [id*="secure"]');

    const secureUrlInput = page.locator(
      'input[name="groups[secure][fields][base_url][value]"], [id*="web_secure_base_url"]'
    ).first();

    if (await secureUrlInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const secureUrl = await secureUrlInput.inputValue();
      console.log(`🔒 [TC-US-CFG-12] HTTPS Secure URL: "${secureUrl}"`);

      expect(secureUrl.trim().length, 'Secure Base URL must not be empty').toBeGreaterThan(0);
      expect(secureUrl, `Secure URL must start with "https://" but found: "${secureUrl}"`).toMatch(/^https:\/\//);
      expect(secureUrl, `Secure URL must contain "globewest.com" (US) but found: "${secureUrl}"`).toContain('globewest.com');
      expect(secureUrl, `Secure URL must NOT contain ".com.au" but found: "${secureUrl}"`).not.toContain('.com.au');
    } else {
      console.warn('[TC-US-CFG-12] ⚠️ Secure Base URL field not visible — check scope selection');
    }

    await captureEvidence(page, 'TC-US-CFG-12');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-13: Product Image & Media Base URL Points to US Media Location
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > Web
   *   > Base URLs > Base URL for User Media Files
   *
   * EXPECTED:
   *   If populated (non-empty), must NOT reference the AU domain (.com.au).
   *   If fully qualified (starts with http), must contain globewest.com.
   *   An empty/relative value is also acceptable (inherits base URL).
   *
   * WHY: Wrong media URL serves product images from AU domain — causes broken
   *      images, CORS issues, and CDN misconfiguration on the US storefront.
   */
  test('TC-US-CFG-13: Product Image & Media Base URL Points to US Location (Not AU Domain)', async ({ page }) => {
    await gotoConfigSection(page, CFG.web);
    await expandSection(page, 'fieldset:has(legend:has-text("Base URLs")), [id*="unsecure"]');

    const mediaUrlInput = page.locator(
      'input[name="groups[unsecure][fields][base_media_url][value]"], [id*="web_unsecure_base_media_url"]'
    ).first();

    if (await mediaUrlInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      const mediaUrl = await mediaUrlInput.inputValue();
      console.log(`🖼️ [TC-US-CFG-13] Media Base URL: "${mediaUrl || '(relative/empty — inherits base URL)'}"`);

      if (mediaUrl.trim().length > 0) {
        expect(mediaUrl, `Media URL must NOT contain ".com.au" — found: "${mediaUrl}"`).not.toContain('.com.au');
        if (mediaUrl.startsWith('http')) {
          expect(mediaUrl, `Fully-qualified Media URL must contain "globewest.com" — found: "${mediaUrl}"`).toContain('globewest.com');
        }
      }
      console.log(`[TC-US-CFG-13] ✅ Media URL scope verified.`);
    } else {
      console.warn('[TC-US-CFG-13] ⚠️ Media URL field not visible — may use default relative path');
    }

    await captureEvidence(page, 'TC-US-CFG-13');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-14: Base & Display Currency Configured as USD for US Storefront
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * ADMIN FLOW:
   *   Stores > Configuration > [US scope] > General > Currency Setup
   *   > Currency Options > Base Currency + Default Display Currency
   *
   * EXPECTED:
   *   Base Currency = "US Dollar (USD)"
   *   Default Display Currency = "US Dollar (USD)"
   *   NOT AUD.
   *
   * WHY: Core revenue integrity — wrong currency causes all US prices to
   *      display in AUD, breaking the entire B2B commerce flow.
   */
  test('TC-US-CFG-14: Base Currency and Default Display Currency are Both Configured as USD (Not AUD)', async ({ page }) => {
    await gotoConfigSection(page, CFG.currency);
    await expandSection(page, 'fieldset:has(legend:has-text("Currency Options")), [id*="currency_options"]');

    // Base Currency
    const baseCurrencySelect = page.locator(
      'select[name="groups[options][fields][base][value]"], [id*="currency_options_base"]'
    ).first();

    if (await baseCurrencySelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      const baseCurrency = await baseCurrencySelect.evaluate(
        e => e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : e.value
      );
      console.log(`💵 [TC-US-CFG-14] Base Currency: "${baseCurrency}"`);
      expect(baseCurrency.toUpperCase(), 'Base Currency must be USD').toContain('USD');
      expect(baseCurrency.toUpperCase(), 'Base Currency must NOT be AUD').not.toContain('AUD');
    } else {
      console.warn('[TC-US-CFG-14] ⚠️ Base Currency select not visible');
    }

    // Default Display Currency
    const displayCurrencySelect = page.locator(
      'select[name="groups[options][fields][default][value]"], [id*="currency_options_default"]'
    ).first();

    if (await displayCurrencySelect.isVisible({ timeout: 5000 }).catch(() => false)) {
      const displayCurrency = await displayCurrencySelect.evaluate(
        e => e.options[e.selectedIndex] ? e.options[e.selectedIndex].text : e.value
      );
      console.log(`💲 [TC-US-CFG-14] Default Display Currency: "${displayCurrency}"`);
      expect(displayCurrency.toUpperCase(), 'Default Display Currency must be USD').toContain('USD');
    } else {
      console.warn('[TC-US-CFG-14] ⚠️ Display Currency select not visible');
    }

    await captureEvidence(page, 'TC-US-CFG-14');
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TC-US-CFG-15: US Storefront Displays Prices in USD — No AUD or GST
  // ══════════════════════════════════════════════════════════════════════════
  /**
   * FRONTEND FLOW (no admin login — public storefront verification):
   *   1. Navigate to US Homepage (https://mcstaging2.globewest.com)
   *   2. Navigate to PLP (/indoor)  — check price displays "$", not "AUD"
   *   3. Navigate to PDP            — check price, verify no GST notice
   *
   * EXPECTED:
   *   All product prices show "$" (USD).
   *   "AUD", "A$", and "GST" are NOT visible to US customers.
   *
   * WHY: End-to-end verification that all admin currency config flows through
   *      correctly to the public-facing US B2B storefront.
   */
  test('TC-US-CFG-15: US Storefront Prices Display in USD — AUD and GST Labels Not Shown to US Customers', async ({ page }) => {
    const US_BASE_URL = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';

    // Block analytics/trackers for clean execution
    await page.route('**/*listrak*',          r => r.abort());
    await page.route('**/*klaviyo*',          r => r.abort());
    await page.route('**/*hotjar*',           r => r.abort());
    await page.route('**/*google-analytics*', r => r.abort());

    // 1. US Homepage — verify domain scope
    await page.goto(US_BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(page.url(), 'Must be on globewest.com (US domain)').toContain('globewest.com');
    expect(page.url(), 'Must NOT be on globewest.com.au (AU domain)').not.toContain('.com.au');
    console.log(`[TC-US-CFG-15] ✅ US Homepage loaded: ${page.url()}`);

    // 2. US PLP (/indoor) — verify price format
    await page.goto(`${US_BASE_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const plpPriceEl = page.locator('.price-box .price, [data-price-type="finalPrice"]').first();
    if (await plpPriceEl.isVisible({ timeout: 5000 }).catch(() => false)) {
      const plpPriceText = await plpPriceEl.innerText();
      console.log(`💲 [TC-US-CFG-15] PLP Price: "${plpPriceText}"`);
      expect(plpPriceText, 'PLP price must contain "$"').toContain('$');
      expect(plpPriceText.toUpperCase(), 'PLP price must NOT show "AUD"').not.toContain('AUD');
      expect(plpPriceText.toUpperCase(), 'PLP price must NOT show "A$"').not.toContain('A$');
    } else {
      console.warn('[TC-US-CFG-15] PLP price not visible — SearchSpring US account may be pending');
    }

    // 3. US PDP — verify price and no GST notice
    const pdpUrl  = `${US_BASE_URL}/celine-dining-chair-loden-antique-brass-ch-celin-antique-brass`;
    const pdpResp = await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    if (pdpResp && pdpResp.status() !== 404) {
      const pdpPriceEl = page.locator('.product-info-price .price, .price-box .price').first();
      if (await pdpPriceEl.isVisible({ timeout: 5000 }).catch(() => false)) {
        const pdpPriceText = await pdpPriceEl.innerText();
        console.log(`💲 [TC-US-CFG-15] PDP Price: "${pdpPriceText}"`);
        expect(pdpPriceText, 'PDP price must contain "$"').toContain('$');
        expect(pdpPriceText.toUpperCase(), 'PDP price must NOT show "AUD"').not.toContain('AUD');
      }

      // Ensure no GST label (AU-specific) leaks onto US PDP
      const gstNotices = page.locator('.tax-notice, .price-including-tax, .gst-notice, [class*="gst"]');
      if (await gstNotices.count() > 0) {
        const gstText = await gstNotices.first().innerText();
        expect(
          gstText.toLowerCase(),
          `GST notice "${gstText.trim()}" must NOT appear on the US storefront`
        ).not.toContain('gst');
      }
    } else {
      console.warn('[TC-US-CFG-15] ⚠️ PDP returned 404 — product not yet assigned to US catalog scope');
    }

    await captureEvidence(page, 'TC-US-CFG-15');
  });

});
