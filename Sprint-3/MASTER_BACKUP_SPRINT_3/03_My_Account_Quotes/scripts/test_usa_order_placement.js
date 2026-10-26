const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/Sprint-3/Ticket_41794529_My_Account_Quotes/screenshots/order_placed_usa_test';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  console.log('========================================================================');
  console.log('🚀 TESTING CHECKOUT WITH USA DUMMY CONTACT & USA DELIVERY ADDRESS');
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
    if (res.url().includes('payment-information') || res.url().includes('shipping-information') || res.url().includes('place-order')) {
      console.log(`[API RESPONSE ${res.status()}] ${res.url()}`);
      if (res.status() >= 400) {
        try {
          const body = await res.text();
          console.log(`[API ERROR BODY]:`, body);
        } catch (e) {}
      }
    }
  });

  try {
    // STEP 1: LOGIN
    console.log('1. Logging in...');
    await page.goto('https://mcstaging2.globewest.com/customer/account/login/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    const emailInput = page.locator('#email');
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('deepali.londhe@overdose.digital');
      await page.fill('#pass', 'Deep@123');
      await page.click('#send2');
      await page.waitForTimeout(3000);
    }

    // STEP 2: CHECKOUT STEP 1 (ORDER DETAILS)
    console.log('2. Navigating to Checkout (/checkout/)...');
    await page.goto('https://mcstaging2.globewest.com/checkout/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    console.log('   Filling Step 1 with USA dummy phone: 212-555-0199...');
    const phoneInput = page.locator('input[placeholder*="contact"], input[name*="telephone"], input[name*="phone"]').first();
    if (await phoneInput.isVisible().catch(() => false)) {
      await phoneInput.fill('212-555-0199');
    }

    const poNumber = `PO-USA-${Date.now().toString().slice(-6)}`;
    const poInput = page.locator('input[placeholder*="reference"], input[name*="reference"], input[placeholder*="purchase"]').first();
    if (await poInput.isVisible().catch(() => false)) {
      await poInput.fill(poNumber);
    }

    await page.screenshot({ path: path.join(OUT_DIR, '01_step1_usa_phone.png') });

    console.log('   Clicking Step 1 NEXT...');
    const step1Next = page.locator('#order-details button:has-text("NEXT"), button:has-text("NEXT")').first();
    await step1Next.click();
    await page.waitForTimeout(4000);

    // STEP 3: CHECKOUT STEP 2 (DELIVERY DETAILS)
    console.log('3. Handling Step 2: Delivery Details...');
    await page.screenshot({ path: path.join(OUT_DIR, '02_step2_before_client.png') });

    // Click "Deliver to client"
    console.log('   Clicking "Deliver to client" tab/option...');
    const deliverToClientOption = page.locator('li:has-text("Deliver to client"), span:has-text("Deliver to client")').first();
    await deliverToClientOption.click();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(OUT_DIR, '03_step2_deliver_to_client_opened.png') });

    // Inspect inputs in client address form
    console.log('   Checking visible inputs in client address form...');
    const formVisible = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select')).filter(el => el.offsetParent !== null);
      return inputs.map(i => ({ id: i.id, name: i.name, placeholder: i.placeholder, type: i.type }));
    });
    console.log('   Visible form fields:', JSON.stringify(formVisible, null, 2));

    // Fill in USA client address if fields exist
    const clientFirst = page.locator('input[name*="firstname"], #client-firstname').first();
    if (await clientFirst.isVisible().catch(() => false)) await clientFirst.fill('John');

    const clientLast = page.locator('input[name*="lastname"], #client-lastname').first();
    if (await clientLast.isVisible().catch(() => false)) await clientLast.fill('Smith');

    const clientPhone = page.locator('input[name*="telephone"], #client-telephone').first();
    if (await clientPhone.isVisible().catch(() => false)) await clientPhone.fill('212-555-0199');

    const clientStreet = page.locator('input[name*="street[0]"], input[name*="street"], #client-street').first();
    if (await clientStreet.isVisible().catch(() => false)) await clientStreet.fill('123 Broadway');

    const clientCity = page.locator('input[name*="city"], #client-city').first();
    if (await clientCity.isVisible().catch(() => false)) await clientCity.fill('New York');

    const clientZip = page.locator('input[name*="postcode"], #client-zip, #client-postcode').first();
    if (await clientZip.isVisible().catch(() => false)) await clientZip.fill('10001');

    // Region / State
    const clientRegion = page.locator('select[name*="region_id"], #client-region');
    if (await clientRegion.isVisible().catch(() => false)) {
      await clientRegion.selectOption({ label: 'New York' }).catch(() => clientRegion.selectOption({ index: 1 }));
    }

    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(OUT_DIR, '04_client_address_filled.png') });

    // Click NEXT on Step 2
    console.log('   Clicking Step 2 NEXT button...');
    const step2Next = page.locator('button:has-text("NEXT"):visible').last();
    if (await step2Next.isVisible().catch(() => false)) {
      await step2Next.click();
      await page.waitForTimeout(4000);
    }

    // STEP 4: CHECKOUT STEP 3 (SUMMARY)
    console.log('4. Checking Step 3: Summary...');
    await page.screenshot({ path: path.join(OUT_DIR, '05_step3_summary.png') });

    // Check T&C
    console.log('   Agreeing to Terms and Conditions...');
    await page.evaluate(() => {
      const tnc = document.getElementById('custom_tnc');
      if (tnc && !tnc.checked) {
        tnc.click();
        tnc.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.waitForTimeout(1000);

    // Click CONFIRM ORDER
    console.log('   🚀 Clicking "CONFIRM ORDER"...');
    const confirmBtn = page.locator('button:has-text("CONFIRM ORDER")').first();
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
      await page.waitForTimeout(8000);
    }

    console.log('   URL after order confirmation attempt:', page.url());
    await page.screenshot({ path: path.join(OUT_DIR, '06_final_result.png'), fullPage: true });

    const pageErrors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.message-error, .message.error, .mage-error, [data-ui-id="message-error"]'))
        .map(el => el.innerText.trim());
    });
    console.log('   Errors found on page:', pageErrors);

  } catch (err) {
    console.error('Error during execution:', err);
  } finally {
    await browser.close();
    console.log('Test completed.');
  }
})();
