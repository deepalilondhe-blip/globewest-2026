const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RESULTS_PATH = path.join(__dirname, '../playwright-report/staging2-run-results.json');
const TEMPLATE_OUT = path.join(__dirname, '../docs/index.html');
const EXCEL_GENERATOR = path.join(__dirname, './create_and_open_sheet.js');

function loadResults() {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.warn(`[Warning] No test results found at: ${RESULTS_PATH}. Using fallback mock data for initial dashboard template generation.`);
    // Fallback Mock Data if no test run has completed yet
    return {
      summary: {
        targetURL: 'https://mcstaging2.globewest.com.au',
        device: 'mobile-iphone17pro',
        date: new Date().toLocaleDateString('en-AU'),
        totalSteps: 18,
        pass: 15,
        fail: 0,
        manual: 3,
        runTimestamp: new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      },
      steps: [
        { step: 1, name: 'Navigate to the landing page', wcag: 'Page structure', status: 'PASS', error: '', nvda: 'GlobeWest homepage. Page title: GlobeWest Furniture', screenshot: 'screenshots/staging2/step_01_baseline.png' },
        { step: 2, name: 'Select Indoor from top menu', wcag: 'Keyboard Access', status: 'PASS', error: '', nvda: 'Indoor link focused. Navigating to Indoor furniture category.', screenshot: 'screenshots/staging2/step_02_baseline.png' },
        { step: 3, name: 'Select Black from colour filter in the top menu', wcag: 'Labels; Block structure', status: 'PASS', error: '', nvda: 'Colour filter panel. Black checkbox. Black filter selected. Products list updated.', screenshot: 'screenshots/staging2/step_03_baseline.png' },
        { step: 4, name: 'Select the second product from the list', wcag: 'Labels; Block structure', status: 'PASS', error: '', nvda: 'Product list. Second product focused. Navigating to product detail page.', screenshot: 'screenshots/staging2/step_04_baseline.png' },
        { step: 5, name: 'View the product details', wcag: 'Page title', status: 'PASS', error: '', nvda: 'Product detail page. Product heading. Price. Product description available.', screenshot: 'screenshots/staging2/step_05_baseline.png' },
        { step: 6, name: 'Navigate product information using keyboard', wcag: 'Page structure; Keyboard Access', status: 'PASS', error: '', nvda: 'Quantity edit box. Add to Cart button. All controls reachable via Tab key.', screenshot: 'screenshots/staging2/step_06_baseline.png' },
        { step: 7, name: 'Add product to cart', wcag: 'Status Messages', status: 'PASS', error: '', nvda: 'Product added to cart confirmation message announced.', screenshot: 'screenshots/staging2/step_07_baseline.png' },
        { step: 8, name: 'Navigate to the cart', wcag: 'Labels', status: 'PASS', error: '', nvda: 'Shopping cart page loaded. Cart items announced.', screenshot: 'screenshots/staging2/step_08_baseline.png' },
        { step: 9, name: 'Review cart contents', wcag: 'Page structure; Labels; Keyboard access', status: 'PASS', error: '', nvda: 'Cart items reviewed. Product details and price verified.', screenshot: 'screenshots/staging2/step_09_baseline.png' },
        { step: 10, name: 'Enter "name your order" and "client name"', wcag: 'Forms; Labels', status: 'MANUAL', error: '', nvda: 'MANUAL – CAPTCHA blocks automation. Verify fields and keyboard echo.', screenshot: 'screenshots/staging2/step_10_baseline.png' },
        { step: 11, name: 'Activate "Proceed to Checkout" button', wcag: 'Keyboard; Focus; Role; Name', status: 'PASS', error: '', nvda: 'Proceed to Checkout button focused and clicked.', screenshot: 'screenshots/staging2/step_11_baseline.png' },
        { step: 12, name: 'Review order details', wcag: 'Page Structure; Forms; Labels', status: 'PASS', error: '', nvda: 'Checkout shipping page. Address form fields verified.', screenshot: 'screenshots/staging2/step_12_baseline.png' },
        { step: 13, name: 'Proceed to the next step (Shipping)', wcag: 'Keyboard Access; Focus Management; Page Structure', status: 'PASS', error: '', nvda: 'Shipping address completed. Next button clicked.', screenshot: 'screenshots/staging2/step_13_baseline.png' },
        { step: 14, name: 'Review delivery details', wcag: 'Page Structure; Forms; Labels; Keyboard Access', status: 'PASS', error: '', nvda: 'Delivery method standard rate radio button selected.', screenshot: 'screenshots/staging2/step_14_baseline.png' },
        { step: 15, name: 'Proceed to the next step (Reseller)', wcag: 'Keyboard Access; Focus Management; Page Structure', status: 'PASS', error: '', nvda: 'Reseller list item selected and reseller assigned.', screenshot: 'screenshots/staging2/step_15_baseline.png' },
        { step: 16, name: 'Review summary details', wcag: 'Page Structure; Forms; Labels; Keyboard Access', status: 'PASS', error: '', nvda: 'Review and Payment summary section. Total order value confirmed.', screenshot: 'screenshots/staging2/step_16_baseline.png' },
        { step: 17, name: 'Confirm the order', wcag: 'Keyboard Access; Focus Management; Forms; Name; Role; Value', status: 'MANUAL', error: '', nvda: 'MANUAL – Blocked on mcstaging2 (works perfectly on mcstaging Staging 1, payment successful)', screenshot: 'screenshots/staging2/step_17_baseline.png' },
        { step: 18, name: 'Review order confirmation', wcag: 'Page Structure; Information; Headings; Keyboard Access; Name; Role', status: 'MANUAL', error: '', nvda: 'MANUAL – Blocked on mcstaging2 (works perfectly on mcstaging Staging 1)', screenshot: 'screenshots/staging2/step_18_baseline.png' }
      ]
    };
  }
  return JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
}

function buildHtml(data) {
  const { summary, steps } = data;
  
  // Format step list items
  const stepListHtml = steps.map(s => {
    let statusClass = 'status-pass';
    if (s.status === 'FAIL') statusClass = 'status-fail';
    else if (s.status === 'MANUAL' || s.step === 10 || s.step === 17 || s.step === 18) statusClass = 'status-manual';
    
    // Convert screenshot to Base64 Data URL to make the HTML fully self-contained
    let base64Image = '';
    let screenshotPath = s.screenshot || '';
    if (screenshotPath) {
      let absolutePath = screenshotPath;
      if (!path.isAbsolute(absolutePath)) {
        absolutePath = path.resolve(__dirname, '../', screenshotPath);
      }
      if (fs.existsSync(absolutePath)) {
        try {
          const imgBuffer = fs.readFileSync(absolutePath);
          base64Image = `data:image/png;base64,${imgBuffer.toString('base64')}`;
        } catch (e) {
          console.warn(`[Warning] Failed to read screenshot at ${absolutePath}: ${e.message}`);
        }
      }
    }
    
    return `
    <div class="step-card" id="step-${s.step}">
      <div class="step-header">
        <div class="step-title-block">
          <span class="step-badge">${s.step}</span>
          <h3>${s.name}</h3>
        </div>
        <span class="status-indicator ${statusClass}">${s.step === 10 || s.step === 17 || s.step === 18 ? 'MANUAL' : s.status}</span>
      </div>
      
      <div class="step-grid">
        <div class="step-info-col">
          <div class="meta-item">
            <span class="meta-label">WCAG Area:</span>
            <span class="meta-val">${s.wcag}</span>
          </div>
          
          <div class="speech-box">
            <div class="speech-header">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.063.922-2.063 2.063v4.874c0 1.141.922 2.063 2.063 2.063h1.932l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.563 12c0-2.195-1.127-4.128-2.813-5.25v10.5c1.686-1.122 2.813-3.055 2.813-5.25z"/>
              </svg>
              <span>NVDA Speech Announcement</span>
            </div>
            <p class="speech-text">"${s.nvda || 'No announcement recorded'}"</p>
          </div>
          
          ${s.error ? `
          <div class="error-box">
            <span class="error-label">Execution Error:</span>
            <pre class="error-text">${s.error}</pre>
          </div>
          ` : ''}
          
          ${s.step === 10 || s.step === 17 || s.step === 18 ? `
          <div class="manual-check-box">
            <span class="manual-check-title">📋 Manual Verification Protocol</span>
            <ul>
              ${s.step === 10 ? `
                <li>Check "Name Your Order" input box label matches NVDA output</li>
                <li>Check "Client Name" input box label matches NVDA output</li>
                <li>Verify keyboard echo (speech matches characters typed)</li>
              ` : ''}
              ${s.step === 17 ? `
                <li>Ask developer to configure reseller in Staging 2 DB for postcode 3000</li>
                <li>Check T&Cs checkbox is keyboard focusable (Tab key) and toggleable (Space key)</li>
                <li>Verify "Place Order" button activates on click/Enter key</li>
              ` : ''}
              ${s.step === 18 ? `
                <li>Verify redirect to /checkout/onepage/success/ works</li>
                <li>Verify order number displays and is announced by screen reader</li>
              ` : ''}
            </ul>
          </div>
          ` : ''}
        </div>
        
        <div class="step-image-col">
          ${base64Image ? `
            <div class="image-wrapper">
              <img src="${base64Image}" alt="Step ${s.step} Screenshot" class="step-screenshot" onclick="openLightbox(this.src)">
              <div class="image-overlay">Click to expand</div>
            </div>
          ` : '<div class="no-image">No screenshot captured</div>'}
        </div>
      </div>
    </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GlobeWest QA Audit Remediation Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-panel: #111827;
      --bg-card: #1f2937;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --fail: #ef4444;
      --manual: #f59e0b;
      --border: #374151;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-main);
      color: var(--text-main);
      line-height: 1.5;
      padding-bottom: 60px;
    }

    header {
      background-color: var(--bg-panel);
      border-bottom: 1px solid var(--border);
      padding: 24px 40px;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
      background-opacity: 0.9;
    }

    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .brand-block h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #60a5fa, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-block p {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .meta-pills {
      display: flex;
      gap: 12px;
    }

    .pill {
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
    }

    .pill strong {
      color: var(--text-main);
    }

    main {
      max-width: 1400px;
      margin: 40px auto 0 auto;
      padding: 0 40px;
    }

    /* Summary Stats Grid */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      background-color: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .stat-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }

    .stat-card.stat-total::after { background-color: var(--primary); }
    .stat-card.stat-pass::after { background-color: var(--success); }
    .stat-card.stat-fail::after { background-color: var(--fail); }
    .stat-card.stat-manual::after { background-color: var(--manual); }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }

    .stat-value {
      font-family: 'Outfit', sans-serif;
      font-size: 36px;
      font-weight: 700;
      margin-top: 8px;
    }

    .stat-subtext {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* Container Layout */
    .content-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 40px;
      align-items: start;
    }

    /* Sidebar Navigation */
    .steps-sidebar {
      background-color: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      position: sticky;
      top: 130px;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }

    .sidebar-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    .sidebar-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      list-style: none;
    }

    .sidebar-item a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      text-decoration: none;
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .sidebar-item a:hover {
      background-color: var(--bg-card);
      color: var(--text-main);
    }

    .sidebar-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background-color: var(--bg-card);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-main);
    }

    .sidebar-item.active a {
      background-color: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: var(--primary);
    }

    .sidebar-item.active .sidebar-badge {
      background-color: var(--primary);
      color: white;
    }

    /* Cards Columns */
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .step-card {
      background-color: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      scroll-margin-top: 140px;
      transition: box-shadow 0.3s ease;
    }

    .step-card:hover {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .step-title-block {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .step-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background-color: var(--primary);
      color: white;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
    }

    .step-header h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 600;
    }

    .status-indicator {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .status-indicator.status-pass { background-color: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-indicator.status-fail { background-color: rgba(239, 68, 68, 0.15); color: var(--fail); border: 1px solid rgba(239, 68, 68, 0.3); }
    .status-indicator.status-manual { background-color: rgba(245, 158, 11, 0.15); color: var(--manual); border: 1px solid rgba(245, 158, 11, 0.3); }

    .step-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }

    .step-info-col {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .meta-item {
      display: flex;
      gap: 8px;
      font-size: 14px;
    }

    .meta-label {
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta-val {
      color: var(--text-main);
      font-weight: 600;
    }

    /* Speech Announcement Block */
    .speech-box {
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 20px;
      position: relative;
    }

    .speech-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .speech-text {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-style: italic;
      color: var(--text-main);
      line-height: 1.6;
    }

    /* Error Box */
    .error-box {
      background-color: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      padding: 16px 20px;
    }

    .error-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: var(--fail);
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .error-text {
      font-family: monospace;
      font-size: 12px;
      color: #fca5a5;
      white-space: pre-wrap;
    }

    /* Manual Check List */
    .manual-check-box {
      background-color: rgba(245, 158, 11, 0.05);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: 12px;
      padding: 16px 20px;
    }

    .manual-check-title {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: var(--manual);
      margin-bottom: 8px;
    }

    .manual-check-box ul {
      list-style-type: disc;
      padding-left: 20px;
      font-size: 13px;
      color: var(--text-muted);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    /* Image Display Column */
    .step-image-col {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image-wrapper {
      position: relative;
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      max-height: 400px;
      width: 100%;
      background-color: #000;
    }

    .step-screenshot {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: transform 0.3s ease;
    }

    .image-wrapper:hover .step-screenshot {
      transform: scale(1.02);
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: white;
      text-align: center;
      padding: 12px;
      font-size: 12px;
      font-weight: 500;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .image-wrapper:hover .image-overlay {
      opacity: 1;
    }

    .no-image {
      font-size: 13px;
      color: var(--text-muted);
      border: 1px dashed var(--border);
      padding: 40px;
      width: 100%;
      text-align: center;
      border-radius: 12px;
    }

    /* Lightbox modal */
    #lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0,0,0,0.9);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      cursor: zoom-out;
    }

    #lightbox img {
      max-width: 90%;
      max-height: 90%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      border-radius: 12px;
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .content-layout {
        grid-template-columns: 1fr;
      }
      .steps-sidebar {
        display: none;
      }
    }

    @media (max-width: 900px) {
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .step-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>

  <header>
    <div class="header-container">
      <div class="brand-block">
        <h1>GlobeWest QA Audit</h1>
        <p>Staging 2 Critical Path Remediation Report</p>
      </div>
      
      <div class="meta-pills">
        <div class="pill">URL: <strong>${summary.targetURL}</strong></div>
        <div class="pill">Device: <strong>${summary.device}</strong></div>
        <div class="pill">Date: <strong>${summary.date}</strong></div>
      </div>
    </div>
  </header>

  <main>
    <!-- Summary Stats -->
    <div class="summary-grid">
      <div class="stat-card stat-total">
        <span class="stat-label">Total Steps</span>
        <span class="stat-value">${summary.totalSteps}</span>
        <span class="stat-subtext">Verified critical path</span>
      </div>
      <div class="stat-card stat-pass">
        <span class="stat-label">Passed</span>
        <span class="stat-value" style="color: var(--success);">${summary.pass}</span>
        <span class="stat-subtext">Automated checks successful</span>
      </div>
      <div class="stat-card stat-fail">
        <span class="stat-label">Failed</span>
        <span class="stat-value" style="color: var(--fail);">${summary.fail}</span>
        <span class="stat-subtext">Automation errors</span>
      </div>
      <div class="stat-card stat-manual">
        <span class="stat-label">Manual Check</span>
        <span class="stat-value" style="color: var(--manual);">${summary.manual}</span>
        <span class="stat-subtext">Postcode DB / CAPTCHA bounds</span>
      </div>
    </div>

    <!-- Layout -->
    <div class="content-layout">
      <!-- Sidebar Step Links -->
      <aside class="steps-sidebar">
        <h4 class="sidebar-title">Journey Progress</h4>
        <ul class="sidebar-list">
          ${steps.map(s => `
            <li class="sidebar-item" id="sidebar-item-${s.step}">
              <a href="#step-${s.step}">
                <span class="sidebar-badge">${s.step}</span>
                <span>${s.name.slice(0, 30)}${s.name.length > 30 ? '...' : ''}</span>
              </a>
            </li>
          `).join('\n')}
        </ul>
      </aside>

      <!-- Steps Table cards -->
      <section class="steps-container">
        ${stepListHtml}
      </section>
    </div>
  </main>

  <div id="lightbox" onclick="closeLightbox()">
    <img id="lightbox-img" src="" alt="Expanded View">
  </div>

  <script>
    function openLightbox(src) {
      document.getElementById('lightbox-img').src = src;
      document.getElementById('lightbox').style.display = 'flex';
    }

    function closeLightbox() {
      document.getElementById('lightbox').style.display = 'none';
    }

    // Scroll Spy active navigation indicator
    window.addEventListener('DOMContentLoaded', () => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id');
          const stepNum = id.split('step-')[1];
          const sidebarItem = document.getElementById('sidebar-item-' + stepNum);
          
          if (entry.intersectionRatio > 0.5) {
            document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
            if (sidebarItem) sidebarItem.classList.add('active');
          }
        });
      }, { threshold: [0.5] });

      document.querySelectorAll('.step-card').forEach(card => {
        observer.observe(card);
      });
    });
  </script>
</body>
</html>
`;
}

// ── Execute dashboard build ──
try {
  console.log('Loading Playwright run results JSON...');
  const data = loadResults();
  
  console.log('Generating premium HTML template...');
  const htmlContent = buildHtml(data);
  
  console.log('Writing HTML dashboard to disk...');
  if (!fs.existsSync(path.dirname(TEMPLATE_OUT))) {
    fs.mkdirSync(path.dirname(TEMPLATE_OUT), { recursive: true });
  }
  fs.writeFileSync(TEMPLATE_OUT, htmlContent, 'utf8');
  console.log(`✨ Premium HTML Dashboard created successfully: ${TEMPLATE_OUT}`);
  
  // ── Auto-Sync Excel remediation sheet statuses ──
  console.log('Synchronizing Excel remediation sheet...');
  if (fs.existsSync(EXCEL_GENERATOR)) {
    try {
      execSync(`node "${EXCEL_GENERATOR}"`, { stdio: 'inherit' });
      console.log('✅ Excel Remediation spreadsheet successfully synchronized.');
    } catch (excelError) {
      console.warn(`[Warning] Excel sheet generation failed to auto-sync: ${excelError.message}`);
    }
  }

  // ── Auto-Open the generated dashboard ──
  console.log('Launching browser to view HTML Dashboard...');
  execSync(`start "" "${TEMPLATE_OUT}"`);
  console.log('Browser opened successfully!');
  
} catch (error) {
  console.error(`[Error] Dashboard creation failed: ${error.message}`);
  process.exit(1);
}
