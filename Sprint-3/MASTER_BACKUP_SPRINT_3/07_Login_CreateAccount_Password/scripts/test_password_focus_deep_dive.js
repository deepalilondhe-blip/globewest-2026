const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://mcstaging2.globewest.com/customer/account/create/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const pwdAnalysis = await page.evaluate(() => {
    const pwd = document.getElementById('password');
    const field = pwd ? pwd.closest('.field') : null;
    const label = field ? field.querySelector('label') : null;
    const strengthMeter = field ? field.querySelector('#password-strength-meter-container') : null;

    // Check computed styles
    const pwdStyles = pwd ? window.getComputedStyle(pwd) : null;
    const fieldStyles = field ? window.getComputedStyle(field) : null;

    // Check elements overlapping the password field
    const rect = pwd.getBoundingClientRect();
    const points = [
      { x: rect.left + 5, y: rect.top + 5 },
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      { x: rect.right - 5, y: rect.top + rect.height / 2 },
      { x: rect.left + 50, y: rect.top + rect.height / 2 }
    ];

    const elementAtPoints = points.map(pt => {
      const el = document.elementFromPoint(pt.x, pt.y);
      return {
        point: pt,
        tag: el ? el.tagName : null,
        id: el ? el.id : null,
        className: el ? el.className : null,
        isPwd: el === pwd
      };
    });

    return {
      pwdOuterHTML: pwd ? pwd.outerHTML : null,
      fieldOuterHTML: field ? field.outerHTML : null,
      labelOuterHTML: label ? label.outerHTML : null,
      strengthMeterOuterHTML: strengthMeter ? strengthMeter.outerHTML : null,
      strengthMeterDisplay: strengthMeter ? window.getComputedStyle(strengthMeter).display : null,
      pwdStyles: {
        zIndex: pwdStyles ? pwdStyles.zIndex : null,
        position: pwdStyles ? pwdStyles.position : null,
        pointerEvents: pwdStyles ? pwdStyles.pointerEvents : null,
        cursor: pwdStyles ? pwdStyles.cursor : null,
        fontSize: pwdStyles ? pwdStyles.fontSize : null,
        padding: pwdStyles ? pwdStyles.padding : null
      },
      elementAtPoints
    };
  });

  console.log('Password DOM Analysis:', JSON.stringify(pwdAnalysis, null, 2));

  // Now let's test clicking on different points of password field
  console.log('\nTesting click on #password center...');
  await page.click('#password');
  let focused = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  console.log('Active element after clicking center:', focused);

  // Click away to blur
  await page.click('h1, .auth__title');
  await page.waitForTimeout(500);

  // Test clicking near the left edge (where placeholder is)
  const rect = await page.$eval('#password', el => {
    const r = el.getBoundingClientRect();
    return { x: r.left + 15, y: r.top + r.height / 2 };
  });
  console.log('Testing mouse click at coordinates:', rect);
  await page.mouse.click(rect.x, rect.y);
  focused = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  console.log('Active element after coordinate click:', focused);

  // Now test mobile viewport (iPhone 14: 390x844)
  console.log('\n--- Testing Mobile Viewport (390x844) ---');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);

  const mobileRect = await page.$eval('#password', el => {
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });

  await page.mouse.click(mobileRect.x, mobileRect.y);
  focused = await page.evaluate(() => document.activeElement ? document.activeElement.id : null);
  console.log('Active element after mobile click:', focused);

  await browser.close();
})();
