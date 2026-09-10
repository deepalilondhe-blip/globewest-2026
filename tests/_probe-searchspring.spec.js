// @ts-check
/** TEMPORARY PROBE #2 — why is SearchSpring content empty? */
const { test } = require('@playwright/test');
const fs = require('fs');

const US = process.env.BASE_URL_US || 'https://mcstaging2.globewest.com';

test.describe('PROBE2: SearchSpring diagnostics', () => {
  test('Diagnose SearchSpring bundle load + rendering', async ({ page }) => {
    const consoleMsgs = [];
    const failedReqs = [];
    const ssResponses = [];
    page.on('console', m => consoleMsgs.push(`[${m.type}] ${String(m.text).slice(0, 300)}`));
    page.on('requestfailed', r => failedReqs.push(`${r.url} :: ${r.failure}`));
    page.on('response', r => {
      if (/searchspring|snapui|hbdnkj/i.test(r.url)) ssResponses.push(`${r.status} ${r.url.slice(0, 160)}`);
    });

    await page.goto(`${US}/indoor`, { waitUntil: 'domcontentloaded', timeout: 150000 });

    // Poll up to 45s for grid content
    let state = null;
    const start = Date.now();
    while (Date.now() - start < 45000) {
      state = await page.evaluate(() => {
        const content = document.querySelector('#searchspring-content');
        const anySs = Array.from(document.querySelectorAll('[class*="ss__"], [id*="searchspring"]')).length;
        const imgs = Array.from(document.querySelectorAll('#searchspring-content img')).length;
        return {
          contentLen: content ? content.innerHTML.length : -1,
          anySsEls: anySs,
          imgs: imgs,
          toolbarLen: document.querySelector('#searchspring-toolbar')?.innerHTML.length ?? -1,
          sidebarLen: document.querySelector('#searchspring-sidebar')?.innerHTML.length ?? -1,
        };
      });
      if (state.contentLen > 0) break;
      await page.waitForTimeout(3000);
    }

    const bundleInfo = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src).filter(u => /searchspring/.test(u));
      const meta = Array.from(document.querySelectorAll('script')).map(s => (s.textContent || '')).join(' ').match(/isSearchSpringActive[^;]{0,40}/);
      return { scripts, meta: meta ? meta[0] : null };
    });

    const dump = {
      state,
      elapsedMs: Date.now() - start,
      bundleInfo,
      ssResponses: ssResponses.slice(0, 15),
      failedReqs: failedReqs.slice(0, 15),
      consoleTail: consoleMsgs.slice(0, 40),
    };
    fs.writeFileSync('/tmp/probe2.json', JSON.stringify(dump, null, 2));
    await page.screenshot({ path: '/tmp/probe2_fullpage.png', fullPage: true });
    console.log('PROBE2 DONE');
  });
});