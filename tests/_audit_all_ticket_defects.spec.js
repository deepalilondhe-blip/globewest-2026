// @ts-check
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const EVIDENCE_DIR = path.join(__dirname, '..', '..', 'Ticket - Enable Public Browsing Mode', 'evidence');
const US_BASE = 'https://mcstaging2.globewest.com';

test('Audit all defects on Enable Public Browsing Mode', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('\n--- 1. AUDITING TOP UTILITY BAR (GUEST) ---');
  await page.goto(`${US_BASE}/indoor`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const topBar = page.locator('.panel.header, .header__utility, .header-panel').first();
  const topBarText = await topBar.innerText().catch(() => '');
  console.log(`Top Utility Bar Text: "${topBarText.replace(/\n/g, ' ')}"`);
  const hasTradeCTA = topBarText.toLowerCase().includes('become a trade customer') || topBarText.toLowerCase().includes('trade login');
  console.log(`Top Bar has "Become a Trade Customer": ${hasTradeCTA} (Expected: true)`);

  console.log('\n--- 2. AUDITING HERO BANNER COPY ---');
  const heroText = await page.locator('.category-top-view, .page-title-wrapper').first().innerText().catch(() => '');
  console.log(`Hero Banner Text: "${heroText.replace(/\n/g, ' ')}"`);
  const hasAuLeak = heroText.toLowerCase().includes('australian');
  console.log(`Hero Banner has "Australian" copy leakage: ${hasAuLeak}`);

  console.log('\n--- 3. AUDITING SEARCHSPRING SEARCH (GUEST) ---');
  await page.goto(`${US_BASE}/catalogsearch/result/?q=chair`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  const searchResultsCount = await page.locator('.product-item, .ss-item').count();
  console.log(`Search for "chair" returned: ${searchResultsCount} products`);

  console.log('\n--- 4. AUDITING PDP GUEST EMPTY GAP ---');
  await page.goto(`${US_BASE}/base-2-seater-left-arm-sofa-oatmeal-light-oak-sof-ske-bas2s-lft-oat-lo`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const pdpPriceSection = page.locator('.product-info-price').first();
  const pdpPriceText = await pdpPriceSection.innerText().catch(() => '');
  console.log(`PDP Price Section Text: "${pdpPriceText.replace(/\n/g, ' ')}"`);
  const hasLoginPrompt = pdpPriceText.toLowerCase().includes('login') || pdpPriceText.toLowerCase().includes('trade');
  console.log(`PDP has explicit Login/Trade Prompt: ${hasLoginPrompt}`);

  console.log('\nAll audit points checked!');
});
