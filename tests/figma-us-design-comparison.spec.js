// @ts-check
/**
 * Figma Design vs Live US Staging PLP — Visual Parity Comparison
 * ---------------------------------------------------------------
 * Runs HEADED so the user can complete the Figma / Overdose SSO login
 * interactively. Uses ONE persistent browser tab:
 *   1. Opens the Figma design frame and auto-fills the Overdose email.
 *   2. After the FIRST successful login, the session is SAVED so future
 *      runs start already logged in (no manual email entry).
 *   3. Once the canvas renders, captures the design at Desktop THEN Mobile.
 *   4. Captures the live US staging PLP at the same two viewports.
 *   5. Stitches labelled side-by-side PNGs via Python PIL.
 *
 * Run (headed — interact with the Figma tab that opens):
 *   FIGMA_WAIT_MS=300000 npx playwright test tests/figma-us-design-comparison.spec.js \
 *     --project=desktop-chrome --headed --timeout=600000
 */
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FIGMA_URL = process.env.FIGMA_URL ||
  'https://www.figma.com/design/oSBa3EMR3goI0vM1tXCdTk/Globewest-USA---External?node-id=2571-60635&t=WSDzrWIopvYgASuZ-0';

// Overdose SSO email auto-filled into the Figma sign-in form. This is the ONLY
// email this script will ever use — no other address is ever typed.
const FIGMA_EMAIL = process.env.FIGMA_EMAIL || 'deepali.londhe@overdose.digital';

const PLP_URL = process.env.PLP_URL || 'https://mcstaging2.globewest.com/indoor';
const OUT_DIR = path.resolve(__dirname, '../Comparison before and After snapshout');

// Persisted login state. After the first successful Figma login we save cookies
// here so subsequent runs are already logged in (the email field is auto-filled
// only when no saved session exists yet).
const AUTH_STATE_FILE = path.resolve(__dirname, '../.figma-auth-state.json');

// Figma canvas / design-frame selectors (any match = design visible, not a login wall)
const FIGMA_CANVAS_SELECTORS = [
  '.canvasContainer',
  '[data-testid="canvas"]',
  '.canvas',
  '.design-canvas-container',
  '[data-type="scene"]',
  '.frame',
  'button:has-text("Continue to editor")',
  '[data-testid="openbtn"]',
];

// How long to hold the Figma tab open for the user to finish SSO, before giving up.
const FIGMA_WAIT_MS = Number(process.env.FIGMA_WAIT_MS || 300_000);

// Candidate viewports used by the QA matrix.
const VIEWPORTS = [
  { label: 'Desktop', width: 1920, height: 1080 },
  { label: 'Mobile', width: 393, height: 851 },
];

// Reuse a saved Figma login across runs when one exists (avoids re-entering email).
if (fs.existsSync(AUTH_STATE_FILE)) {
  test.use({ storageState: AUTH_STATE_FILE });
  console.log(`[Auth] Using saved Figma session: ${AUTH_STATE_FILE}`);
} else {
  console.log('[Auth] No saved Figma session yet — a one-time login will be needed.');
}

test.describe('US Figma Design vs Live Staging PLP Visual Comparison', () => {
  test('Persistent Figma session: capture Desktop + Mobile comparisons', async ({ page }) => {
    // Keep the browser session in a single tab so one Figma login covers all captures.
    await page.setViewportSize({ width: 1920, height: 1080 });

    // ---------------- STEP 1: Open Figma & wait for the user to log in ---------------
    await page.goto(FIGMA_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(2500);

    async function prefillIfLoginWall() {
      // Throttle: don't hammer the login page with re-fills/clicks.
      if (Date.now() - lastEmailFillTime < 5000) return;

      // The email used for Figma SSO must be exactly the Overdose email provided.
      const emailInput = page.locator(
        'input[type="email"], input[name="email"], input#email, [placeholder*="mail"], [autocomplete="username"]'
      ).first();
      if (await emailInput.isVisible({ timeout: 1500 }).catch(() => false)) {
        lastEmailFillTime = Date.now();
        console.warn('==============================================================');
        console.warn(`Figma login needed → auto-entering email: ${FIGMA_EMAIL}`);
        console.warn('In the browser window, finish with EITHER:');
        console.warn('  (a) your Overdose password + MFA, or');
        console.warn('  (b) click "Continue with Google" / SSO button.');
        console.warn('==============================================================');
        try {
          await emailInput.fill(FIGMA_EMAIL);
          await page.waitForTimeout(600);
          const cta = page.locator(
            'button:has-text("Continue"), button:has-text("Continue with SAML"), button:has-text("Next"), [data-testid*="continue"], [data-testid*="sso"]'
          ).first();
          if (await cta.isVisible({ timeout: 1200 }).catch(() => false)) {
            await cta.click({ noWaitAfter: true });
          } else {
            await emailInput.press('Enter');
          }
        } catch (e) {
          console.warn(`[Figma] Prefill attempt failed: ${e.message}`);
        }
      }
    }

    let lastEmailFillTime = 0;
    // Auto-fill the email if a login wall is shown.
    await prefillIfLoginWall();

    let canvasFound = false;
    let lastTitle = '';
    let lastUrl = '';
    const deadline = Date.now() + FIGMA_WAIT_MS;
    while (Date.now() < deadline && !canvasFound) {
      for (const sel of FIGMA_CANVAS_SELECTORS) {
        const loc = page.locator(sel).first();
        if (await loc.isVisible({ timeout: 1200 }).catch(() => false)) {
          canvasFound = true;
          break;
        }
      }
      lastTitle = await page.title();
      lastUrl = page.url();
      // Robust fallback: logged-in + design loaded when title has the file name
      // and the URL is a node deep-link (no /login).
      if (!canvasFound &&
          /Globewest/i.test(lastTitle) &&
          /node-id=/.test(lastUrl) &&
          !/\/login|\/account|signin|sign-in/i.test(lastUrl)) {
        canvasFound = true;
        break;
      }
      if (!canvasFound) {
        // Re-fill the email (throttled) in case the login form reappeared,
        // then wait quietly for the user to finish the flow.
        await prefillIfLoginWall();
        await page.waitForTimeout(2000);
        if (Date.now() % 15000 < 2000) {
          console.log(`[Figma wait] title="${lastTitle}" url=${lastUrl} — awaiting your login/SSO …`);
        }
      }
    }

    console.log(`[Figma] canvasDetected=${canvasFound} title="${lastTitle}" url=${lastUrl}`);
    if (!canvasFound) {
      console.warn('[Figma] Design canvas not detected after wait — capturing whatever is on screen.');
    } else {
      console.log('[Figma] Canvas detected — design is loaded.');
      // Save the authenticated session so the NEXT run skips login entirely.
      try {
        const state = await page.context().storageState();
        fs.writeFileSync(AUTH_STATE_FILE, JSON.stringify(state, null, 2));
        console.log(`[Auth] Figma session saved → future runs will reuse it: ${AUTH_STATE_FILE}`);
      } catch (e) {
        console.warn(`[Auth] Could not save session state: ${e.message}`);
      }
    }
    await page.bringToFront();
    await page.waitForTimeout(2000);

    // ---------------- ZOOM-TO-FIT the selected frame (node-id) ----------------
    // Deep-linked nodes are auto-selected; "Shift+1" fits the selection to the
    // viewport so the design frame fills the screenshot.
    try {
      // Click once on the canvas centre to ensure Figma canvas has focus.
      await page.mouse.click(960, 540);
      await page.waitForTimeout(800);
      await page.keyboard.press('Shift+1');
      await page.waitForTimeout(1500);
      await page.keyboard.press('Shift+1'); // repeat to be safe
      await page.waitForTimeout(1500);
      console.log('[Figma] Zoom-to-fit applied (Shift+1).');
    } catch (e) {
      console.warn(`[Figma] Zoom-to-fit failed: ${e.message}`);
    }
    await page.waitForTimeout(1500);
// ---------------- STEP 2: Capture Figma at each viewport, then live PLP -----------
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(2500);
      const figmaShot = await page.screenshot({ fullPage: false });
      await test.info().attach(`Figma-${vp.label}`, { body: figmaShot, contentType: 'image/png' });
      const figmaPng = path.join(OUT_DIR, `figma-plp-${vp.label}-${vp.width}x${vp.height}.png`);
      fs.writeFileSync(figmaPng, figmaShot);

      await page.goto(PLP_URL, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      await page.waitForTimeout(3000);
      for (const sel of ['a#lpclose', '[data-role="closeBtn"]', '.action-close', '#btn-cookie-allow']) {
        const btn = page.locator(sel).first();
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await btn.click({ noWaitAfter: true });
        }
      }
      await page.waitForTimeout(1500);

      const liveShot = await page.screenshot({ fullPage: false });
      await test.info().attach(`Live-PLP-${vp.label}`, { body: liveShot, contentType: 'image/png' });
      const livePng = path.join(OUT_DIR, `live-plp-${vp.label}-${vp.width}x${vp.height}.png`);
      fs.writeFileSync(livePng, liveShot);

      const outPng = path.join(OUT_DIR, `Figma_vs_Live_${vp.label}_${vp.width}x${vp.height}.png`);
      stitchSideBySide(figmaPng, livePng, outPng, `FIGMA · ${vp.label}`, `LIVE · ${PLP_URL} · ${vp.label}`);
      console.log(`[Compare] Side-by-side written: ${outPng}`);
    }

    // Sanity: at least one comparison file must exist.
    const anyOutput = VIEWPORTS.some(v =>
      fs.existsSync(path.join(OUT_DIR, `Figma_vs_Live_${v.label}_${v.width}x${v.height}.png`)));
    expect(anyOutput).toBe(true);
  });
});

/**
 * Build a labelled side-by-side comparison image using Python PIL (available).
 * Synchronous so the canvas only finishes once the PNG exists.
 * @param {string} leftPng
 * @param {string} rightPng
 * @param {string} outPng
 * @param {string} leftLabel
 * @param {string} rightLabel
 */
function stitchSideBySide(leftPng, rightPng, outPng, leftLabel, rightLabel) {
  const script = `
import sys
from PIL import Image, ImageDraw

left = Image.open(sys.argv[1]).convert('RGB')
right = Image.open(sys.argv[2]).convert('RGB')
leftLabel = sys.argv[4]
rightLabel = sys.argv[5]

target_h = 1600

def fit(img):
    scale = target_h / img.height
    return img.resize((max(1, round(img.width * scale)), target_h), Image.LANCZOS)

left = fit(left)
right = fit(right)
gap = 24
pad = 40
label_h = 64
w = pad + left.width + gap + right.width + pad
h = label_h + max(left.height, right.height) + pad
canvas = Image.new('RGB', (w, h), 'white')
canvas.paste(left, (pad, label_h))
canvas.paste(right, (pad + left.width + gap, label_h))

d = ImageDraw.Draw(canvas)
d.rectangle([0, 0, w - 1, label_h - 1], fill=(31, 31, 36))
d.rectangle([pad + left.width + gap // 2, 0, pad + left.width + gap // 2 + 1, h - 1], fill=(230, 60, 60))
for label, cx in ((leftLabel, pad + left.width // 2),
                  (rightLabel, pad + left.width + gap + right.width // 2)):
    d.text((cx, label_h // 2), label, fill=(255, 255, 255), anchor='mm')

canvas.save(sys.argv[3])
print('OK')
`;
  const helper = path.join(OUT_DIR, '_figma_stitch_helper.py');
  fs.writeFileSync(helper, script);
  try {
    execFileSync('python3', [helper, leftPng, rightPng, outPng, leftLabel, rightLabel], { stdio: 'ignore' });
    console.log(`[Compare] PIL stitch completed: ${outPng}`);
  } catch (err) {
    console.warn(`[Compare] PIL stitch failed: ${err.message}; individual PNGs still saved.`);
  }
}