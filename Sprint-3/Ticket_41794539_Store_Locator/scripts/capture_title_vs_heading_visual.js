const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_DIR = path.resolve(__dirname, '..');
const COMPARISON_DIR = path.join(BASE_DIR, 'comparison');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox'] });
  
  // Create page with custom HTML explaining the difference visually
  const page = await browser.newPage({ viewport: { width: 1200, height: 950 } });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 30px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background: #f1f5f9;
        color: #1e293b;
      }
      .container {
        max-width: 1100px;
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        overflow: hidden;
        border: 1px solid #cbd5e1;
      }
      .header {
        background: #0f172a;
        color: white;
        padding: 24px 30px;
      }
      .header h1 { margin: 0 0 8px 0; font-size: 24px; }
      .header p { margin: 0; color: #94a3b8; font-size: 15px; }

      .content { padding: 30px; }

      .concept-box {
        background: #eff6ff;
        border: 2px solid #3b82f6;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 25px;
        font-size: 15px;
        line-height: 1.6;
      }

      /* Mock Browser Window */
      .browser-window {
        border: 2px solid #94a3b8;
        border-radius: 8px;
        overflow: hidden;
        background: white;
        margin-bottom: 30px;
      }
      .browser-top-bar {
        background: #e2e8f0;
        padding: 34px 16px 0 16px;
        display: flex;
        align-items: flex-end;
        gap: 8px;
        border-bottom: 1px solid #cbd5e1;
      }
      .tab {
        padding: 8px 16px;
        border-radius: 8px 8px 0 0;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .tab-normal {
        background: #cbd5e1;
        color: #334155;
      }
      .tab-buggy {
        background: #fee2e2;
        color: #991b1b;
        border: 2px dashed #ef4444;
        border-bottom: none;
      }
      .address-bar {
        background: white;
        padding: 8px 16px;
        border-bottom: 1px solid #e2e8f0;
        font-family: monospace;
        font-size: 13px;
        color: #64748b;
      }
      .webpage-body {
        padding: 30px;
        background: #fafafa;
        position: relative;
      }
      .webpage-h1 {
        font-family: serif;
        font-size: 32px;
        letter-spacing: 2px;
        margin-bottom: 12px;
        color: #111;
      }

      .pointer-callout {
        position: absolute;
        background: #ef4444;
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
      }
      .arrow-up {
        width: 0; 
        height: 0; 
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #ef4444;
        position: absolute;
        top: -8px;
        left: 20px;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 20px;
      }
      .card {
        border-radius: 8px;
        padding: 20px;
      }
      .card-good {
        background: #f0fdf4;
        border: 1px solid #86efac;
      }
      .card-bad {
        background: #fef2f2;
        border: 1px solid #fca5a5;
      }
      .card h3 { margin-top: 0; margin-bottom: 10px; font-size: 16px; }
      .code-pill {
        background: #1e293b;
        color: #38bdf8;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Understanding the Defect: What Does "HTML Format / Title" Mean?</h1>
        <p>Why people get confused: Difference between Visible Heading (on page) vs. Browser Tab Title (in code)</p>
      </div>

      <div class="content">
        <div class="concept-box">
          <strong>💡 The Simple Truth:</strong><br>
          When you open a website, there are <strong>TWO DIFFERENT TITLES</strong>:<br>
          1. <strong>The Heading on the page body:</strong> The big letters you read with your eyes on the screen (e.g. <code>&lt;h1&gt;FIND A STOCKIST&lt;/h1&gt;</code>). This is working fine!<br>
          2. <strong>The Browser Tab Title in HTML code:</strong> The name that appears on the <strong>top tab of your browser window</strong> (e.g. <code>&lt;title&gt;...&lt;/title&gt;</code>). <strong>THIS is what is completely empty and missing!</strong>
        </div>

        <h3>Look at this Real Browser Window Diagram:</h3>

        <div class="browser-window">
          <!-- Top Tabs -->
          <div class="browser-top-bar">
            <!-- Normal Tab -->
            <div class="tab tab-normal">
              🌐 About Us | GlobeWest &nbsp; ✕
            </div>
            <!-- Buggy Tab -->
            <div class="tab tab-buggy" style="position: relative;">
              🌐 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✕
              <div style="position: absolute; top: -28px; left: 10px; background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; white-space: nowrap;">
                🔴 DEFECT HERE: TAB NAME IS TOTALLY BLANK!
              </div>
            </div>
          </div>

          <!-- URL Bar -->
          <div class="address-bar">
            🔒 https://mcstaging2.globewest.com/locator
          </div>

          <!-- Webpage Screen Body -->
          <div class="webpage-body">
            <div class="webpage-h1">FIND A STOCKIST</div>
            <p style="color: #475569; margin-bottom: 20px;">GlobeWest is stocked at some of Australia's finest furniture...</p>

            <div style="background: #e2e8f0; height: 120px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #64748b;">
              [ Map & Search Section ]
            </div>

            <!-- Callout on H1 -->
            <div style="position: absolute; top: 20px; right: 30px; background: #16a34a; color: white; padding: 8px 14px; border-radius: 6px; font-size: 13px;">
              ✅ <strong>VISIBLE HEADING (H1):</strong><br>
              This is visible on screen. It is NOT empty.
            </div>
          </div>
        </div>

        <div class="comparison-grid">
          <div class="card card-good">
            <h3 style="color: #166534;">✅ What HTML Code SHOULD Look Like:</h3>
            <p style="font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">Inside the HTML &lt;head&gt; code:</p>
            <div style="background: #1e293b; color: #a7f3d0; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px;">
              &lt;title&gt;Find a Stockist | GlobeWest&lt;/title&gt;
            </div>
            <p style="font-size: 13px; color: #15803d; margin-top: 8px;">
              • The browser tab displays: <em>"Find a Stockist | GlobeWest"</em>.<br>
              • Analytics tools know what page the customer is viewing.
            </p>
          </div>

          <div class="card card-bad">
            <h3 style="color: #991b1b;">❌ What US Staging Code ACTUALLY Looks Like:</h3>
            <p style="font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">Inside the HTML &lt;head&gt; code right now:</p>
            <div style="background: #1e293b; color: #fca5a5; padding: 10px; border-radius: 6px; font-family: monospace; font-size: 13px;">
              &lt;title&gt;&lt;/title&gt;
            </div>
            <p style="font-size: 13px; color: #b91c1c; margin-top: 8px;">
              • The browser tab has ZERO words inside.<br>
              • Google Analytics tracking crashes with error: <em>"'Title' must not be empty"</em>.
            </p>
          </div>
        </div>

      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(htmlContent);
  await page.waitForTimeout(1000);

  const outPath = path.join(COMPARISON_DIR, 'EXPLANATION_HTML_TITLE_VS_HEADING.png');
  await page.screenshot({ path: outPath, fullPage: true });

  console.log('Saved visual explanation to:', outPath);
  await browser.close();
})();
