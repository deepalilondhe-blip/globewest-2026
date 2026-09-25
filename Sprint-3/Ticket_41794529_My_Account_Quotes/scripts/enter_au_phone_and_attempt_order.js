const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/au_phone_order_attempt';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 TESTING CHECKOUT WITH PHONE: +61 491 570 157');
  console.log('========================================================================\n');

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    slowMo: 300,
    args: ['--no-sandbox', '--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  page.on('response', async res => {
    if (res.url().includes('payment-information') || res.url().includes('place-order') || res.url().includes('setIsHold')) {
      console.log(`[API RESPONSE ${res.status()}] ${res.url()}`);
      if (res.status() >= 400) {
        try {
          const body = await res.text();
          console.log(`[API ERROR RESPONSE]:`, body);
        } catch (e) {}
      }
    }
  });

  try {
    // 1. LOGIN
    console.log('▶ [Step 1] Logging in...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const emailInput = page.locator('#email');
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForTimeout(3000);
    }

    // 2. CHECKOUT STEP 1
    console.log('\n▶ [Step 2] Navigating to Checkout (/checkout/)...');
    await page.goto('https://mcstaging2.globewest.com/checkout/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    console.log('   Entering Contact Number: "+61 491 570 157"...');
    const phoneInput = page.locator('input[placeholder*="contact"], input[name*="telephone"], input[name*="phone"]').first();
    await phoneInput.fill('+61 491 570 157');

    const poNumber = `PO-TEST-${Date.now().toString().slice(-6)}`;
    const poInput = page.locator('input[placeholder*="reference"], input[name*="reference"], input[placeholder*="purchase"]').first();
    if (await poInput.isVisible().catch(() => false)) {
      await poInput.fill(poNumber);
    }

    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, '01_step1_au_phone_entered.png') });

    console.log('   Clicking Step 1 NEXT...');
    const step1Next = page.locator('#order-details button:has-text("NEXT"), button:has-text("NEXT")').first();
    await step1Next.click();
    await page.waitForTimeout(4000);

    // 3. CHECKOUT STEP 2 (DELIVERY DETAILS)
    console.log('\n▶ [Step 3] Handling Step 2: Delivery Details...');
    await page.screenshot({ path: path.join(OUT_DIR, '02_step2_delivery_details.png') });

    const step2Next = page.locator('button:has-text("NEXT"):visible').last();
    if (await step2Next.isVisible().catch(() => false)) {
      console.log('   Clicking Step 2 NEXT...');
      await step2Next.click();
      await page.waitForTimeout(4000);
    }

    // 4. CHECKOUT STEP 3 (SUMMARY)
    console.log('\n▶ [Step 4] Step 3: Summary & Order Confirmation...');
    await page.screenshot({ path: path.join(OUT_DIR, '03_step3_summary_before_confirm.png') });

    console.log('   Agreeing to Terms and Conditions (#custom_tnc)...');
    await page.evaluate(() => {
      const tnc = document.getElementById('custom_tnc');
      if (tnc && !tnc.checked) {
        tnc.click();
        tnc.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(1500);

    console.log('   🚀 Clicking "CONFIRM ORDER"...');
    const confirmBtn = page.locator('button:has-text("CONFIRM ORDER")').first();
    await confirmBtn.click();
    await page.waitForTimeout(10000);

    console.log('\n▶ [Step 5] Capturing Final Result...');
    console.log('   Current URL:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '04_final_order_placement_result.png'), fullPage: true });

    const messages = await page.evaluate(() => {
      const msgs = Array.from(document.querySelectorAll('.message-error, .message.error, .mage-error, [data-ui-id="message-error"], .checkout-success, .success.message'));
      return msgs.map(m => m.innerText.trim());
    });
    console.log('   On-screen messages:', messages);

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await browser.close();
    console.log('\n🏁 Script finished.');
  }
})();
