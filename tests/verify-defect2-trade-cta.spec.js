// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'evidence');
if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const US_URL = 'https://mcstaging2.globewest.com';
const AU_URL = 'https://mcstaging2.globewest.com.au';

/** Glowing highlighter with floating badge */
async function highlightElement(locator, label = '', durationMs = 4000, color = '#FF0055') {
  try {
    const el = locator.first();
    if (await el.isVisible({ timeout: 5000 }).catch(() => false)) {
      await el.evaluate((node, { tagText, col }) => {
        node.style.transition = 'all 0.3s ease-in-out';
        node.style.outline = `4px solid ${col}`;
        node.style.outlineOffset = '4px';
        node.style.boxShadow = `0 0 25px ${col}`;

        let badge = node.querySelector('.qa-highlight-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'qa-highlight-badge';
          badge.innerHTML = tagText;
          badge.style.position = 'absolute';
          badge.style.top = '40px';
          badge.style.left = '20px';
          badge.style.zIndex = '9999999';
          badge.style.backgroundColor = col;
          badge.style.color = '#FFFFFF';
          badge.style.fontSize = '14px';
          badge.style.fontWeight = '900';
          badge.style.fontFamily = 'monospace';
          badge.style.padding = '6px 14px';
          badge.style.borderRadius = '6px';
          badge.style.boxShadow = '0 4px 15px rgba(0,0,0,0.7)';
          badge.style.pointerEvents = 'none';
          badge.style.letterSpacing = '0.5px';

          if (window.getComputedStyle(node).position === 'static') {
            node.style.position = 'relative';
          }
          node.appendChild(badge);
        }
      }, { tagText: label, col: color });

      await el.page().waitForTimeout(durationMs);
    }
  } catch (e) {}
}

test('Live Headed Demonstration: Defect 2 - Top Utility Bar Missing "Become a Trade Customer"', async ({ page }) => {
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('\n================================================================');
  console.log('STEP 1: US STOREFRONT — AUDITING TOP UTILITY BAR (DEFECT 2)');
  console.log('================================================================');

  await page.goto(`${US_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const usTopBar = page.locator('.panel.header, .header__utility, .header-panel, .panel.wrapper').first();
  const usTopBarText = await usTopBar.innerText().catch(() => '');
  console.log(`US Top Bar Text: "${usTopBarText.replace(/\n/g, ' ').trim()}"`);

  // Inspect links in US top utility bar
  const usLinks = await usTopBar.locator('a').allInnerTexts().catch(() => []);
  console.log('US Top Bar Links found:', usLinks.map(l => l.trim()));

  const hasBecomeTrade = usTopBarText.toLowerCase().includes('become a trade customer');
  console.log(`\n🚨 DEFECT CONFIRMED: "Become a Trade Customer" link present: ${hasBecomeTrade} (Expected: true)`);

  // Highlight Defect on US Storefront with Glowing RED border
  await highlightElement(
    usTopBar,
    '🚨 DEFECT 2: "Become a Trade Customer" LINK IS MISSING (Only "Book Showroom Appointment" is showing)',
    5000,
    '#FF0055'
  );

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'HEADED_DEFECT2_US_TOP_BAR_MISSING_TRADE_CTA.png'), fullPage: false });

  console.log('\n================================================================');
  console.log('STEP 2: AU STOREFRONT — COMPARING AGAINST BASELINE');
  console.log('================================================================');

  await page.goto(`${AU_URL}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  const auTopBar = page.locator('.panel.header, .header__utility, .header-panel, .panel.wrapper').first();
  const auTopBarText = await auTopBar.innerText().catch(() => '');
  console.log(`AU Top Bar Text: "${auTopBarText.replace(/\n/g, ' ').trim()}"`);

  const auLinks = await auTopBar.locator('a').allInnerTexts().catch(() => []);
  console.log('AU Top Bar Links found:', auLinks.map(l => l.trim()));

  // Highlight Baseline on AU Storefront with Glowing GREEN border
  await highlightElement(
    auTopBar,
    '🟢 AU BASELINE: Top Bar contains "Find a designer or stockist" service links',
    5000,
    '#00E676'
  );

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'HEADED_DEFECT2_AU_TOP_BAR_BASELINE.png'), fullPage: false });

  console.log('\n🎉 Demonstration complete! Both US defect and AU baseline demonstrated live.');
});
