# QA Test Cases: "Allow Customer to Create Account from the Frontend" Setting

- **Ticket**: #41794537 - Login, Create an Account, Password
- **Feature**: Enable / Disable Customer Account Registration via Magento Admin
- **Configuration Path**: `Stores > Configuration > Customers > Customer Configuration > Create New Account Options > Allow Customer to Create Account from the Frontend`
- **Scope**: `USA Website`
- **Target URL**: `https://mcstaging2.globewest.com`

---

## 1. Test Suite Matrix Overview

| Test Case ID | Test Category | Setting Value | Feature / Touchpoint | Expected Outcome |
|---|---|:---:|---|---|
| **TC-POS-01** | Positive | **Yes** | Direct URL `/customer/account/create` | Registration form renders successfully without redirect |
| **TC-POS-02** | Positive | **Yes** | Registration Form Submit (`POST /createpost`) | New customer account created in DB; user redirected to My Account |
| **TC-POS-03** | Positive | **Yes** | Header Login Popup Flyout | "Don't have an account? / Create An Account" link visible & functional |
| **TC-POS-04** | Positive | **Yes** | Login Page (`/customer/account/login/`) | `[ CREATE AN ACCOUNT ]` button visible under General Public |
| **TC-POS-05** | Positive | **Yes** | Overdose Ajax Signup API (`/od_theme/account/signup`) | Successful registration response returned |
| **TC-POS-06** | Positive | **Yes** | Online Booking Guest API (`/online_booking/customer/save`) | Guest registration allowed during appointment booking |
| **TC-POS-07** | Positive | **Yes** | Scope Isolation (USA vs AU) | USA website toggle does not disrupt AU store registration |
| **TC-NEG-01** | Negative | **No** | Direct URL `/customer/account/create` | Request intercepted; automatically redirected to `/customer/account/login/` |
| **TC-NEG-02** | Negative | **No** | Direct Form POST (`POST /createpost`) | Rejected and redirected; 0 customer records written to Magento DB |
| **TC-NEG-03** | Negative | **No** | Header Login Popup Flyout | Registration link completely hidden; only Login inputs render |
| **TC-NEG-04** | Negative | **No** | Login Page (`/customer/account/login/`) | `[ CREATE AN ACCOUNT ]` button hidden; orphan copy flagged |
| **TC-NEG-05** | Negative | **No** | Overdose Ajax Signup API (`/od_theme/account/signup`) | Returns `{ "success": 0, "message": "Customer registration is already disabled." }` |
| **TC-NEG-06** | Negative | **No** | Online Booking Guest API (`/online_booking/customer/save`) | Returns `{ "status": "error", "text": "Account registration is not available..." }` |
| **TC-NEG-07** | Negative | **No** | Malformed / Script Injection POST to `/createpost` | Strict rejection without revealing server stack trace or creating records |
| **TC-NEG-08** | Negative | **No** | Customer Group Integrity | Ensures unapproved guests cannot obtain General Public or Trade account |

---

## 2. Positive Test Cases (Setting = YES | Registration Enabled)

### TC-POS-01: Direct URL Access When Registration is Enabled
- **Objective**: Verify that `/customer/account/create` loads the full registration page when the admin setting is `Yes`.
- **Pre-conditions**:
  1. Magento Admin ➔ `Stores > Configuration > Customers > Customer Configuration > Create New Account Options`.
  2. Scope set to **USA Website**.
  3. `Allow Customer to Create Account from the Frontend` = **`Yes`**.
  4. Magento cache flushed.
- **Test Steps**:
  1. Open a new private/incognito window.
  2. Navigate directly to `https://mcstaging2.globewest.com/customer/account/create`.
- **Expected Results**:
  - The URL remains `https://mcstaging2.globewest.com/customer/account/create` (no redirect to login).
  - The page heading displays "Create New Customer Account".
  - All input fields render: First Name, Last Name, Email, Password, Confirm Password, and "Create an Account" submit button.

---

### TC-POS-02: End-to-End Account Registration & DB Verification
- **Objective**: Verify that valid user registration creates a real customer entity in Magento database.
- **Pre-conditions**: Setting is `Yes` on USA Website.
- **Test Steps**:
  1. Navigate to `https://mcstaging2.globewest.com/customer/account/create`.
  2. Fill in valid data with an unused email (e.g. `test.pos.registration@example.com`).
  3. Enter a strong password and matching password confirmation.
  4. Click "Create an Account".
  5. In a separate tab, log into Magento Admin ➔ `Customers > All Customers`.
  6. Search for `test.pos.registration@example.com`.
- **Expected Results**:
  - Frontend: User is redirected to `/customer/account/` (My Account Dashboard) with banner: *"Thank you for registering with GlobeWest"*.
  - Backend Admin: Customer grid returns **1 record found** with:
    - Name: Matching submitted name.
    - Group: "General Public".
    - Website: "USA Website".

---

### TC-POS-03: Header Login Popup Shows "Create an Account" Link
- **Objective**: Verify that header login flyout contains the registration link when setting is `Yes`.
- **Pre-conditions**: Setting is `Yes` on USA Website.
- **Test Steps**:
  1. Navigate to `https://mcstaging2.globewest.com/` as a guest.
  2. Click the "👤 Login" button in the top-right header.
- **Expected Results**:
  - The Customer Login flyout opens.
  - Below the "Sign In" button, the link **"Don't have an account? Create an Account"** is displayed.
  - Clicking the link navigates user to `/customer/account/create`.

---

### TC-POS-04: Login Page Displays "Create an Account" Button Under General Public
- **Objective**: Verify that `/customer/account/login/` displays the `[ CREATE AN ACCOUNT ]` button under General Public.
- **Pre-conditions**: Setting is `Yes` on USA Website.
- **Test Steps**:
  1. Navigate to `https://mcstaging2.globewest.com/customer/account/login/`.
  2. Inspect the right column (`.right-auth-block`).
- **Expected Results**:
  - Under "Trade Customers": `[ BECOME A TRADE CUSTOMER ]` button is visible.
  - Under "General Public": `[ CREATE AN ACCOUNT ]` button is visible below the description.
  - Clicking `[ CREATE AN ACCOUNT ]` redirects to `/customer/account/create`.

---

### TC-POS-05: Overdose Ajax Signup API Accepts Valid Registrations
- **Objective**: Verify that `POST /od_theme/account/signup` processes signups when enabled.
- **Pre-conditions**: Setting is `Yes` on USA Website.
- **Test Steps**:
  1. Open DevTools Console on the storefront.
  2. Execute POST request with valid new email and password to `/od_theme/account/signup`.
- **Expected Results**:
  - HTTP Status returns 200.
  - JSON response does **NOT** return `"Customer registration is already disabled."`.
  - JSON returns `success: 1` or valid customer session payload.

---

### TC-POS-06: Online Booking Guest Save Allows Registration
- **Objective**: Verify that guest appointment booking can register customer accounts when setting is `Yes`.
- **Pre-conditions**: Setting is `Yes` on USA Website.
- **Test Steps**:
  1. Execute POST request to `/online_booking/customer/save` with guest details.
- **Expected Results**:
  - Does **NOT** return *"Account registration is not available. Please sign in to an existing account to continue."*.
  - Returns booking confirmation or successful customer record save.

---

## 3. Negative Test Cases (Setting = NO | US Soft Launch B2B Mode)

### TC-NEG-01: Direct URL Navigation Interception & Redirect
- **Objective**: Verify that direct attempts to navigate to `/customer/account/create` are strictly blocked.
- **Pre-conditions**:
  1. Scope set to **USA Website**.
  2. `Allow Customer to Create Account from the Frontend` = **`No`**.
- **Test Steps**:
  1. Open private browser window.
  2. Enter `https://mcstaging2.globewest.com/customer/account/create` in address bar and hit Enter.
- **Expected Results**:
  - Server issues HTTP 302 redirect.
  - User is immediately landed on `https://mcstaging2.globewest.com/customer/account/login/`.
  - The registration form is never rendered in the DOM.

---

### TC-NEG-02: Direct HTTP POST Rejection to `/customer/account/createpost`
- **Objective**: Verify that bypass attempts via raw POST data do not create database accounts.
- **Pre-conditions**: Setting is `No` on USA Website.
- **Test Steps**:
  1. Send direct HTTP POST to `https://mcstaging2.globewest.com/customer/account/createpost` containing valid form fields: `firstname`, `lastname`, `email=neg.bypass@example.com`, `password`.
  2. Inspect HTTP response.
  3. Search Magento Admin ➔ `Customers > All Customers` for `neg.bypass@example.com`.
- **Expected Results**:
  - Response is redirected to `/customer/account/login/`.
  - Admin Customer Grid displays **"We couldn't find any records" (0 records found)**.
  - Zero database records are created.

---

### TC-NEG-03: Header Login Popup Strips Registration Links
- **Objective**: Verify that header login flyout contains zero account registration elements.
- **Pre-conditions**: Setting is `No` on USA Website.
- **Test Steps**:
  1. Visit `https://mcstaging2.globewest.com/`.
  2. Click "👤 Login" button.
  3. Inspect popup DOM (`.od-auth-popup`).
- **Expected Results**:
  - Section "Don't have an account? / Create An Account" is completely removed.
  - Zero `<a>` tags with `href*="account/create"` exist in the popup.
  - Only `Email Address`, `Password`, `I forgot?`, and `Sign In` button render.

---

### TC-NEG-04: Login Page Conceals "Create an Account" Button (Defect Verification)
- **Objective**: Verify that login page does not display registration buttons or dead copy.
- **Pre-conditions**: Setting is `No` on USA Website.
- **Test Steps**:
  1. Navigate to `https://mcstaging2.globewest.com/customer/account/login/`.
  2. Inspect right-hand column (`.right-auth-block`).
- **Expected Results**:
  - `[ CREATE AN ACCOUNT ]` button is completely hidden.
  - Defect Check: Paragraph *"Create a web account with GlobeWest to check out faster..."* must NOT remain as orphaned text. Entire `.b2c-customer-register` container should be hidden.

---

### TC-NEG-05: Overdose Ajax Signup API Rejection
- **Objective**: Verify that `POST /od_theme/account/signup` rejects all signup attempts.
- **Pre-conditions**: Setting is `No` on USA Website.
- **Test Steps**:
  1. Execute POST request to `/od_theme/account/signup` with payload `email=test@example.com&password=Password123!`.
- **Expected Results**:
  - Response status: 200.
  - JSON body strictly equals:
    ```json
    {
      "success": 0,
      "message": "Customer registration is already disabled."
    }
    ```

---

### TC-NEG-06: Online Booking Guest Save API Rejection
- **Objective**: Verify that `POST /online_booking/customer/save` prevents unauthenticated guest account creation.
- **Pre-conditions**: Setting is `No` on USA Website.
- **Test Steps**:
  1. Execute POST request to `/online_booking/customer/save` with guest details.
- **Expected Results**:
  - JSON body returns:
    ```json
    {
      "status": "error",
      "text": "Account registration is not available. Please sign in to an existing account to continue.",
      "timify_customer_id": ""
    }
    ```

---

### TC-NEG-07: Malformed / SQL / Script Injection Payload to `/createpost`
- **Objective**: Verify that sending invalid, corrupted, or malicious POST bodies to the disabled endpoint does not trigger PHP fatal errors or leaks.
- **Pre-conditions**: Setting is `No` on USA Website.
- **Test Steps**:
  1. Send POST to `/customer/account/createpost` with missing required keys, empty strings, and special characters.
- **Expected Results**:
  - Endpoint safely redirects to `/customer/account/login/`.
  - No 500 Internal Server Error, PHP stack trace, or Magento error report number is exposed to the client.

---

### TC-NEG-08: Customer Group Integrity Verification
- **Objective**: Verify that a guest cannot bypass registration to gain unauthorized access to Trade pricing or customer dashboards.
- **Pre-conditions**: Setting is `No` on USA Website.
- **Test Steps**:
  1. Attempt to browse B2B Trade products and PLP pages without logging into an approved trade account.
- **Expected Results**:
  - Wholesale/Trade pricing remains strictly masked ("Trade Login Required / Unpriced").
  - The only permitted registration path is the B2B Trade Application (`/gwcustomer/trade/create`).
