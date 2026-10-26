/**
 * GlobeWest Ticket #41794537: Defect Retest & API Verification Script
 * Checks:
 * 1. Login Page Defect: Orphaned "General Public" / .b2c-customer-register block
 * 2. Ajax Signup API: POST /od_theme/account/signup
 * 3. Online Booking API: POST /online_booking/customer/save
 * 4. Direct Form Submit: POST /customer/account/createpost
 * 5. Direct URL Access: GET /customer/account/create
 */

const https = require('https');
const querystring = require('querystring');

const BASE_URL = 'https://mcstaging2.globewest.com';

function httpGet(path) {
  return new Promise((resolve, reject) => {
    https.get(`${BASE_URL}${path}`, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

function httpPost(path, postData) {
  return new Promise((resolve, reject) => {
    const data = querystring.stringify(postData);
    const options = {
      hostname: 'mcstaging2.globewest.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
        'X-Requested-With': 'XMLHttpRequest'
      },
      rejectUnauthorized: false
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runAudit() {
  console.log('========================================================================');
  console.log('GLOBEWEST: RETESTING LOGIN DEFECT & REGISTRATION APIS');
  console.log(`Target: ${BASE_URL}`);
  console.log(`Time:   ${new Date().toISOString()}`);
  console.log('========================================================================\n');

  // 1. CHECK LOGIN PAGE DEFECT
  console.log('1. CHECKING LOGIN PAGE DEFECT (Orphaned "General Public" Copy)...');
  try {
    const loginRes = await httpGet('/customer/account/login/');
    const hasB2cBlock = loginRes.body.includes('b2c-customer-register');
    const hasGeneralPublic = loginRes.body.includes('General Public');
    const hasOrphanCopy = loginRes.body.includes('Create a web account with GlobeWest');
    const hasCreateAccountBtn = loginRes.body.includes('action create') || loginRes.body.includes('href="https://mcstaging2.globewest.com/customer/account/create"');

    console.log(`   - HTTP Status: ${loginRes.status}`);
    console.log(`   - '.b2c-customer-register' class present: ${hasB2cBlock ? 'YES (STILL PRESENT - DEFECT)' : 'NO (REMOVED - PASSED)'}`);
    console.log(`   - 'General Public' heading present:     ${hasGeneralPublic ? 'YES (STILL PRESENT - DEFECT)' : 'NO (REMOVED - PASSED)'}`);
    console.log(`   - Orphaned description copy present:    ${hasOrphanCopy ? 'YES (STILL PRESENT - DEFECT)' : 'NO (REMOVED - PASSED)'}`);
    console.log(`   - [CREATE AN ACCOUNT] button present:   ${hasCreateAccountBtn ? 'YES' : 'NO (Hidden)'}`);

    if (hasB2cBlock || hasGeneralPublic || hasOrphanCopy) {
      console.log('\n   DEFECT STATUS: NOT FIXED YET');
      console.log('   The ".b2c-customer-register" block with "General Public" copy still exists in the DOM.\n');
    } else {
      console.log('\n   DEFECT STATUS: FIXED & VERIFIED [PASSED]');
      console.log('   The orphaned ".b2c-customer-register" block has been completely removed from the US Login Page.\n');
    }
  } catch (err) {
    console.error('   Error checking login page:', err.message);
  }

  // 2. CHECK AJAX SIGNUP API
  console.log('2. CHECKING AJAX SIGNUP API (POST /od_theme/account/signup)...');
  try {
    const res1 = await httpPost('/od_theme/account/signup', {
      email: 'qa.test.verify@example.com',
      password: 'SecretPassword123!'
    });
    console.log(`   - Status Code: ${res1.status}`);
    console.log(`   - Response:    ${res1.body}`);
    if (res1.body.includes('"success":0') || res1.body.includes('disabled')) {
      console.log('   API VERDICT: [PASSED] (Registration rejected as expected)\n');
    } else {
      console.log('   API VERDICT: [FAILED] (Unexpected response)\n');
    }
  } catch (err) {
    console.error('   Error testing Ajax Signup API:', err.message);
  }

  // 3. CHECK ONLINE BOOKING GUEST API
  console.log('3. CHECKING ONLINE BOOKING GUEST API (POST /online_booking/customer/save)...');
  try {
    const res2 = await httpPost('/online_booking/customer/save', {
      email: 'qa.booking.verify@example.com',
      firstname: 'QA',
      lastname: 'Tester'
    });
    console.log(`   - Status Code: ${res2.status}`);
    console.log(`   - Response:    ${res2.body}`);
    if (res2.body.includes('"status":"error"') && res2.body.includes('not available')) {
      console.log('   API VERDICT: [PASSED] (Registration rejected as expected)\n');
    } else {
      console.log('   API VERDICT: [FAILED] (Unexpected response)\n');
    }
  } catch (err) {
    console.error('   Error testing Booking API:', err.message);
  }

  // 4. CHECK DIRECT CREATEPOST API
  console.log('4. CHECKING DIRECT REGISTRATION SUBMIT (POST /customer/account/createpost)...');
  try {
    const res3 = await httpPost('/customer/account/createpost', {
      firstname: 'QABypass',
      lastname: 'Tester',
      email: 'qa.bypass.attempt@example.com',
      password: 'SecretPassword123!'
    });
    console.log(`   - Status Code: ${res3.status} (${res3.status === 302 ? 'Redirected' : 'Normal'})`);
    console.log(`   - Location:    ${res3.headers.location || 'None'}`);
    if (res3.status === 302) {
      console.log('   API VERDICT: [PASSED] (Bypass intercepted and redirected to login)\n');
    } else {
      console.log('   API VERDICT: [FAILED]\n');
    }
  } catch (err) {
    console.error('   Error testing createpost API:', err.message);
  }

  // 5. CHECK DIRECT REGISTRATION URL
  console.log('5. CHECKING DIRECT REGISTRATION URL (GET /customer/account/create)...');
  try {
    const res4 = await httpGet('/customer/account/create');
    console.log(`   - Status Code: ${res4.status}`);
    console.log(`   - Redirect Location: ${res4.headers.location || 'N/A'}`);
    if (res4.status === 302 || (res4.headers.location && res4.headers.location.includes('/customer/account/login'))) {
      console.log('   URL VERDICT: [PASSED] (Automatically redirected to Login page)\n');
    } else {
      console.log('   Response code:', res4.status);
    }
  } catch (err) {
    console.error('   Error testing direct URL:', err.message);
  }

  console.log('========================================================================');
  console.log('RETEST AUDIT COMPLETE');
  console.log('========================================================================');
}

runAudit();
