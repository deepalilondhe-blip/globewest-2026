const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://mcstaging2.globewest.com/indoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.evaluate(() => window.scrollBy(0, 450));
  await page.waitForTimeout(2000);

  const detailedData = await page.evaluate(() => {
    const card = document.querySelector('.product-item');
    if (!card) return null;

    // Check compare link/label and its ::before
    const toCompare = card.querySelector('.action.tocompare, .tocompare, .compare');
    const compareLabel = card.querySelector('.action.tocompare span, .compare span, label[for*="compare"]');
    
    let beforeStyles = null;
    if (toCompare) {
      const csBefore = window.getComputedStyle(toCompare, '::before');
      beforeStyles = {
        content: csBefore.content,
        width: csBefore.width,
        height: csBefore.height,
        border: `${csBefore.borderTopWidth} ${csBefore.borderTopStyle} ${csBefore.borderTopColor}`,
        borderRadius: csBefore.borderRadius,
        display: csBefore.display,
        margin: `${csBefore.marginTop} ${csBefore.marginRight} ${csBefore.marginBottom} ${csBefore.marginLeft}`,
        position: csBefore.position,
        top: csBefore.top,
        left: csBefore.left,
        backgroundColor: csBefore.backgroundColor
      };
    }

    // Check where badges sit in DOM
    const badges = Array.from(card.querySelectorAll('.badge, [class*="badge"], .swatch-opt, [data-label]')).map(b => ({
      tag: b.tagName,
      className: b.className,
      text: b.textContent.trim(),
      parentTag: b.parentElement ? b.parentElement.tagName : null,
      parentClass: b.parentElement ? b.parentElement.className : null,
      isInsidePhoto: !!b.closest('.product-item-photo'),
      isInsideDetails: !!b.closest('.product-item-details')
    }));

    return {
      beforeStyles,
      badges,
      toCompareRect: toCompare ? toCompare.getBoundingClientRect() : null,
      compareLabelRect: compareLabel ? compareLabel.getBoundingClientRect() : null
    };
  });

  console.log('DETAILED COMPARE PSEUDO & BADGE HIERARCHY:');
  console.log(JSON.stringify(detailedData, null, 2));

  await browser.close();
})();
