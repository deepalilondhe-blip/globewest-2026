const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const DESKTOP_DIR = path.join(BASE_DIR, 'screenshots/desktop');
const MOBILE_DIR = path.join(BASE_DIR, 'screenshots/mobile');

fs.mkdirSync(DESKTOP_DIR, { recursive: true });
fs.mkdirSync(MOBILE_DIR, { recursive: true });

(async () => {
  console.log('--- STARTING QA TEST FOR MY ACCOUNT - HOLDS (#41794528) ---');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--window-size=1440,900']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // Step 1: Login with Trade Customer Credentials
  console.log('1. Navigating to Customer Login...');
  await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const emailField = await page.$('#email');
  if (emailField) {
    console.log('Logging in as Trade Customer...');
    await page.fill('#email', 'deepali.londhe@overdose.digital');
    await page.fill('#pass', 'Deep@123');
    await page.click('#send2');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(4000);
  }

  // Step 2: Navigate to My Holds
  console.log('2. Navigating to My Holds (/gw_orders/hold/index/)...');
  await page.goto('https://mcstaging2.globewest.com/gw_orders/hold/index/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  // Collect test results
  const results = {};

  // Check 1: Title and Subtitle
  const headingEl = await page.$('.page-title-wrapper .page-title, h1.page-title');
  results.pageTitle = headingEl ? (await headingEl.innerText()).trim() : 'NOT_FOUND';

  const subtitleEl = await page.$('.block-content p, .account-listing-ui__description, p:has-text("product hold")');
  results.subtitleText = subtitleEl ? (await subtitleEl.innerText()).trim() : 'NOT_FOUND';
  results.subtitleSpellingHasFavourite = results.subtitleText.includes('favourite');
  results.subtitleSpellingHasFavorite = results.subtitleText.includes('favorite');

  // Check 2: Filter Tabs
  const tabs = await page.$$('.account-listing-ui__filters__filter');
  results.filterTabs = [];
  for (const tab of tabs) {
    const text = (await tab.innerText()).trim();
    const classes = await tab.getAttribute('class');
    const isActive = classes.includes('is-active');
    const styles = await tab.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        background: cs.backgroundColor,
        color: cs.color,
        borderRadius: cs.borderRadius,
        padding: cs.padding
      };
    });
    results.filterTabs.push({ text, isActive, styles });
  }

  // Check 3: Search Bar
  const searchInput = await page.$('input[name="search"], input[placeholder*="Search" i], .account-listing-ui__search input');
  if (searchInput) {
    const searchBox = await searchInput.boundingBox();
    const activeTab = await page.$('.account-listing-ui__filters__filter.is-active');
    const tabBox = activeTab ? await activeTab.boundingBox() : null;
    results.search = {
      present: true,
      yAlignedWithTabs: tabBox ? Math.abs(searchBox.y - tabBox.y) < 20 : false
    };
  } else {
    results.search = { present: false };
  }

  // Check 4: Table Columns & Redundant Actions Column
  const thElements = await page.$$('table.data-table thead th, .table-wrapper thead th, table thead th');
  results.headers = [];
  for (const th of thElements) {
    const txt = (await th.innerText()).trim().replace(/\s+/g, ' ');
    if (txt) results.headers.push(txt);
  }
  results.columnCount = results.headers.length;
  results.hasActionsColumn = results.headers.some(h => h.toUpperCase().includes('ACTION'));
  results.hasCustPoTypo = results.headers.some(h => h.includes('P0#')); // zero instead of letter O

  // Capture Initial Desktop Views
  console.log('Capturing Desktop Screenshots...');
  await page.screenshot({ path: path.join(DESKTOP_DIR, '01_MY_HOLDS_DESKTOP_FULLPAGE.png'), fullPage: true });
  await page.screenshot({ path: path.join(DESKTOP_DIR, '02_MY_HOLDS_DESKTOP_VIEWPORT.png') });

  // Check 5: Interactive Tab Switch Test
  console.log('3. Testing Filter Tab Toggle (INACTIVE click)...');
  const inactiveTab = await page.$('.account-listing-ui__filters__filter:has-text("INACTIVE")');
  if (inactiveTab) {
    await inactiveTab.click();
    await page.waitForTimeout(2000);
    const inactiveClasses = await inactiveTab.getAttribute('class');
    results.tabToggleWorking = inactiveClasses.includes('is-active');
    await page.screenshot({ path: path.join(DESKTOP_DIR, '03_MY_HOLDS_INACTIVE_TAB_CLICKED.png') });

    // Switch back to ACTIVE
    const activeTab = await page.$('.account-listing-ui__filters__filter:has-text("ACTIVE")');
    if (activeTab) {
      await activeTab.click();
      await page.waitForTimeout(2000);
    }
  }

  // Check 6: FAQ Accordion Single-Open Rule
  console.log('4. Testing FAQ Accordions Single-Open Behavior...');
  const faqItems = await page.$$('.gw-account-faq__item, .faq-item, [class*="faq__item"]');
  results.faqCount = faqItems.length;
  results.faqInitialClosed = true;

  for (const item of faqItems) {
    const isExpanded = await item.evaluate(el => el.classList.contains('active') || el.classList.contains('open') || el.querySelector('.gw-account-faq__content:not([style*="display: none"])') !== null);
    if (isExpanded) results.faqInitialClosed = false;
  }

  if (faqItems.length >= 2) {
    const faqTitle1 = await faqItems[0].$('.gw-account-faq__title, [class*="faq__title"]');
    const faqTitle2 = await faqItems[1].$('.gw-account-faq__title, [class*="faq__title"]');

    if (faqTitle1 && faqTitle2) {
      // Click FAQ 1
      await faqTitle1.click();
      await page.waitForTimeout(1000);
      const item1Open = await faqItems[0].evaluate(el => el.classList.contains('active') || el.classList.contains('open'));

      // Click FAQ 2
      await faqTitle2.click();
      await page.waitForTimeout(1000);
      const item1StillOpen = await faqItems[0].evaluate(el => el.classList.contains('active') || el.classList.contains('open'));
      const item2NowOpen = await faqItems[1].evaluate(el => el.classList.contains('active') || el.classList.contains('open'));

      results.faqSingleOpenRulePassed = (!item1StillOpen && item2NowOpen);
      console.log(`FAQ Single-Open Test: Item 1 closed: ${!item1StillOpen}, Item 2 open: ${item2NowOpen}`);
      await page.screenshot({ path: path.join(DESKTOP_DIR, '04_MY_HOLDS_FAQ_INTERACTION.png') });
    }
  }

  // Check 7: Support Block Information
  const supportEl = await page.$('.block-support, [class*="support"], p:has-text("Contact our sales team")');
  if (supportEl) {
    results.supportText = (await supportEl.innerText()).trim();
  } else {
    // Look for body text
    const bodyText = await page.innerText('body');
    const match = bodyText.match(/Need help\? Contact our sales team[\s\S]*?via this portal\./i);
    results.supportText = match ? match[0] : 'NOT_FOUND';
  }
  results.supportHasAuPhone = results.supportText.includes('+613') || results.supportText.includes('9518 1600');

  // Step 3: Mobile Viewport Testing (390x844)
  console.log('5. Testing Mobile Viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(3000);

  const mobileTh = await page.$$('table.data-table thead th, .table-wrapper thead th, table thead th');
  results.mobileHeaders = [];
  for (const th of mobileTh) {
    const txt = (await th.innerText()).trim().replace(/\s+/g, ' ');
    if (txt) results.mobileHeaders.push(txt);
  }

  await page.screenshot({ path: path.join(MOBILE_DIR, '01_MY_HOLDS_MOBILE_FULLPAGE.png'), fullPage: true });
  await page.screenshot({ path: path.join(MOBILE_DIR, '02_MY_HOLDS_MOBILE_VIEWPORT.png') });

  // Save Results JSON
  fs.writeFileSync(path.join(BASE_DIR, 'live_holds_test_results.json'), JSON.stringify(results, null, 2));
  console.log('Saved test results to live_holds_test_results.json!');

  await browser.close();
  console.log('--- TEST RUN FINISHED SUCCESSFULLY ---');
})();
