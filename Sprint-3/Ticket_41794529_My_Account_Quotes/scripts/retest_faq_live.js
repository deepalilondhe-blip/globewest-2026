const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/retest_faq';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('🚀 Re-testing Live Staging Quotes for FAQ Section...');

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  try {
    // 1. Login
    console.log('Navigating to Trade Login...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const emailField = page.locator('#email');
    if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailField.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      console.log('Submitted login credentials...');
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }

    // 2. Navigate to Quotes & Hard Refresh
    console.log('Navigating to Quotes page...');
    await page.goto('https://mcstaging2.globewest.com/gw_quotes/quote/index/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    console.log('Executing Hard Reload (Cache-Bust)...');
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3000);

    // 3. Inspect DOM for FAQ and Support blocks
    const auditData = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      
      // Look for FAQ elements
      const faqHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, div, span, p'))
        .filter(el => el.textContent.trim().toLowerCase().includes('frequently asked questions'))
        .map(el => ({ tag: el.tagName, text: el.textContent.trim(), class: el.className }));

      // Look for accordion items
      const accordions = Array.from(document.querySelectorAll('.accordion, .faq, [data-role="collapsible"], .faq-accordion, .block-faq, [class*="faq"], [class*="accordion"]'))
        .map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim().substring(0, 100) }));

      // Look for Need Help block
      const needHelp = Array.from(document.querySelectorAll('div, section, p, h2, h3, h4'))
        .filter(el => el.textContent.trim().toLowerCase().includes('need help?') || el.textContent.trim().toLowerCase().includes('contact our sales team'))
        .map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.trim().substring(0, 150) }));

      // Table headers
      const ths = Array.from(document.querySelectorAll('table thead th, .data-table thead th, th')).map(th => th.textContent.trim());

      return {
        hasFAQText: bodyText.toLowerCase().includes('frequently asked questions'),
        faqHeadings,
        accordionsCount: accordions.length,
        accordionsSummary: accordions.slice(0, 10),
        needHelpMatches: needHelp,
        ths
      };
    });

    console.log('\n--- LIVE AUDIT RESULTS ---');
    console.log('FAQ Text Present in Body:', auditData.hasFAQText);
    console.log('FAQ Headings Found:', JSON.stringify(auditData.faqHeadings, null, 2));
    console.log('Accordions Detected:', auditData.accordionsCount);
    console.log('Accordions Sample:', JSON.stringify(auditData.accordionsSummary, null, 2));
    console.log('Need Help Matches:', JSON.stringify(auditData.needHelpMatches, null, 2));
    console.log('Table Headers:', auditData.ths);
    console.log('--------------------------\n');

    // 4. Screenshots
    const fullPath = path.join(OUT_DIR, '01_quotes_full_after_refresh.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log('📸 Saved Full Page Screenshot:', fullPath);

    const vpPath = path.join(OUT_DIR, '02_quotes_viewport_after_refresh.png');
    await page.screenshot({ path: vpPath, fullPage: false });
    console.log('📸 Saved Viewport Screenshot:', vpPath);

    // If FAQ element found, scroll to it and screenshot
    const faqLoc = page.locator('text=Frequently Asked Questions, [class*="faq"]').first();
    if (await faqLoc.isVisible().catch(() => false)) {
      await faqLoc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      const faqPath = path.join(OUT_DIR, '03_faq_section_closeup.png');
      await faqLoc.screenshot({ path: faqPath });
      console.log('📸 Saved FAQ Section Closeup:', faqPath);

      // Test accordion click
      const firstAcc = page.locator('.accordion, [data-role="collapsible"], [class*="accordion-title"], [class*="faq-item"]').first();
      if (await firstAcc.isVisible().catch(() => false)) {
        console.log('Clicking first accordion item to test expand...');
        await firstAcc.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(OUT_DIR, '04_faq_expanded.png') });
        console.log('📸 Saved FAQ Expanded State!');
      }
    } else {
      console.log('⚠️ FAQ locator text not directly visible on initial view, scrolling main content area...');
      // Scroll down main area to see what is below table
      await page.evaluate(() => window.scrollBy(0, 600));
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT_DIR, '03_below_table_scrolled.png') });
    }

    await browser.close();
    console.log('✅ Retest script finished successfully!');
  } catch (err) {
    console.error('Error during retest:', err);
    await browser.close().catch(() => {});
  }
})();
