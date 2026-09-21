// @ts-check
const { test } = require('@playwright/test');

test('Inspect Compare and Badge styles on live US PLP', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://mcstaging2.globewest.com/outdoor', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const inspection = await page.evaluate(() => {
    const results = {};
    
    // 1. Compare element
    const compareEls = Array.from(document.querySelectorAll('*')).filter(el => {
      const t = el.textContent?.trim();
      return (t === 'Compare' || t === 'COMPARE') && el.children.length === 0;
    });

    if (compareEls.length > 0) {
      const el = compareEls[0];
      const cs = window.getComputedStyle(el);
      const parentCs = el.parentElement ? window.getComputedStyle(el.parentElement) : null;
      const rect = el.getBoundingClientRect();
      results.compare = {
        text: el.textContent.trim(),
        tagName: el.tagName,
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        color: cs.color,
        letterSpacing: cs.letterSpacing,
        parentTag: el.parentElement?.tagName,
        parentClass: el.parentElement?.className,
        rect: { width: Math.round(rect.width), height: Math.round(rect.height), top: Math.round(rect.top), left: Math.round(rect.left) }
      };
    } else {
      results.compare = 'NOT_FOUND';
    }

    // 2. Badges (New, Customize)
    const badges = Array.from(document.querySelectorAll('.badge, .tag, .product-label, [class*="badge"], [class*="label"], [class*="pill"]'));
    results.badgeCount = badges.length;
    if (badges.length > 0) {
      const b = badges[0];
      const cs = window.getComputedStyle(b);
      results.firstBadge = {
        text: b.textContent.trim(),
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        parentTag: b.parentElement?.tagName,
        parentClass: b.parentElement?.className
      };
    }

    // 3. Product Card Parent / Photo Container
    const photo = document.querySelector('.product-item-photo');
    if (photo) {
      results.photo = {
        className: photo.className,
        hasBadgesInside: photo.querySelectorAll('[class*="badge"], [class*="label"], [class*="tag"]').length > 0
      };
    }

    return results;
  });

  console.log('=== INSPECTION RESULT ===');
  console.log(JSON.stringify(inspection, null, 2));
});
