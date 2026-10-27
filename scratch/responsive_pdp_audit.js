const { chromium } = require('/home/deepali/My Projects/Deepali/New Tracking URL/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT_DIR = '/home/deepali/My Projects/Deepali/GlobeWest 2026 (2)/scratch/responsive_audit_results';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const BREAKPOINTS = [
  { name: 'desktop_1440', width: 1440, height: 900, isMobile: false },
  { name: 'laptop_1024', width: 1024, height: 768, isMobile: false },
  { name: 'tablet_768', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'mobile_414', width: 414, height: 896, isMobile: true, hasTouch: true },
  { name: 'mobile_375', width: 375, height: 812, isMobile: true, hasTouch: true }
];

const URLS = [
  {
    name: 'Leon_Side_Table',
    url: 'https://mcstaging2.globewest.com/leon-side-table-powder-blue-lto-leon-x-powder-blue'
  },
  {
    name: 'Amari_Planter',
    url: 'https://mcstaging2.globewest.com/amari-oasis-large-planter-wheat-dec-amar-oas-plt-lg-wheat'
  }
];

(async () => {
  console.log('🚀 Starting Comprehensive Responsive PDP Audit across viewports...');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const auditFindings = [];

  for (const bp of BREAKPOINTS) {
    console.log(`\n======================================================`);
    console.log(`📱 Testing Viewport: ${bp.name} (${bp.width}x${bp.height})`);
    console.log(`======================================================`);

    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      isMobile: bp.isMobile,
      hasTouch: bp.hasTouch || false,
      userAgent: bp.isMobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    for (const item of URLS) {
      console.log(`Navigating to ${item.name} (${item.url})...`);
      try {
        await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await page.waitForTimeout(4000);

        const screenshotPath = path.join(OUT_DIR, `${item.name}_${bp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Deep Responsive Inspection
        const responsiveIssues = await page.evaluate((bpInfo) => {
          const issues = [];

          // 1. Check for horizontal overflow (causing unwanted horizontal scroll)
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          if (docWidth > winWidth + 2) {
            issues.push({
              type: 'HORIZONTAL_OVERFLOW',
              detail: `Page has horizontal overflow: scrollWidth (${docWidth}px) > viewport (${winWidth}px) by ${docWidth - winWidth}px`
            });
          }

          // 2. Check Floating Social Share collision
          const socialBar = document.querySelector('.mp_social_share_float, .a2a_kit');
          if (socialBar) {
            const sRect = socialBar.getBoundingClientRect();
            // Check if floating bar overlaps any clickable swatches, buttons, or add to cart
            const swatches = Array.from(document.querySelectorAll('.swatch-option, .swatch-attribute-options div'));
            for (const sw of swatches) {
              const swRect = sw.getBoundingClientRect();
              const overlap = !(sRect.right < swRect.left || sRect.left > swRect.right || sRect.bottom < swRect.top || sRect.top > swRect.bottom);
              if (overlap) {
                issues.push({
                  type: 'FLOATING_SHARE_COLLISION',
                  detail: `Floating social share widget overlaps swatch option (${sw.getAttribute('aria-label') || sw.innerText || 'swatch'})`
                });
              }
            }

            // Check if overlapping Add to Cart
            const atc = document.querySelector('#product-addtocart-button');
            if (atc) {
              const atcRect = atc.getBoundingClientRect();
              const overlapATC = !(sRect.right < atcRect.left || sRect.left > atcRect.right || sRect.bottom < atcRect.top || sRect.top > atcRect.bottom);
              if (overlapATC) {
                issues.push({
                  type: 'FLOATING_SHARE_ATC_COLLISION',
                  detail: `Floating social share widget overlaps [Add to Cart] button`
                });
              }
            }
          }

          // 3. Check Add to Cart and Qty Layout
          const qtyInput = document.querySelector('input.input-text.qty, #qty');
          const atcBtn = document.querySelector('#product-addtocart-button');
          if (qtyInput && atcBtn) {
            const qRect = qtyInput.getBoundingClientRect();
            const aRect = atcBtn.getBoundingClientRect();
            // Check if qty and button wrap or overflow
            const container = atcBtn.closest('.box-tocart, .fieldset');
            const cWidth = container ? container.getBoundingClientRect().width : winWidth;
            if (aRect.right > winWidth) {
              issues.push({
                type: 'ATC_BUTTON_OVERFLOW',
                detail: `Add to Cart button right edge (${aRect.right}px) overflows viewport (${winWidth}px)`
              });
            }
          }

          // 4. Check Swatch wrapping and spacing
          const swatchContainer = document.querySelector('.swatch-attribute-options');
          if (swatchContainer) {
            const swList = Array.from(swatchContainer.querySelectorAll('.swatch-option'));
            if (swList.length > 0) {
              const firstSw = swList[0].getBoundingClientRect();
              const lastSw = swList[swList.length - 1].getBoundingClientRect();
              if (lastSw.right > winWidth) {
                issues.push({
                  type: 'SWATCH_OVERFLOW',
                  detail: `Color swatches container overflows viewport right edge`
                });
              }
            }
          }

          // 5. Check Navigation / Header Hamburger
          if (bpInfo.width < 1024) {
            const hamburger = document.querySelector('.nav-toggle, [data-action="toggle-nav"], button.action.nav-toggle');
            if (!hamburger || !hamburger.offsetParent) {
              issues.push({
                type: 'MISSING_HAMBURGER_MENU',
                detail: `Mobile hamburger navigation button is missing or hidden at ${bpInfo.width}px`
              });
            }
          }

          // 6. Check Gallery / Carousel behavior
          const mainImage = document.querySelector('.fotorama__stage__frame.fotorama__active, .gallery-placeholder img, .product-media img');
          const gallery = document.querySelector('.fotorama, .product.media');
          if (gallery) {
            const gRect = gallery.getBoundingClientRect();
            if (gRect.width > winWidth) {
              issues.push({
                type: 'GALLERY_OVERFLOW',
                detail: `Product media gallery width (${gRect.width}px) exceeds viewport (${winWidth}px)`
              });
            }
          }

          // 7. Check Alternative Products section
          const altSection = document.querySelector('.alternative-products, .block.related');
          if (altSection) {
            const cards = Array.from(altSection.querySelectorAll('.product-item, .item'));
            const brokenCards = cards.filter(c => c.querySelector('img[src*="placeholder"], img[src*="Coming Soon"]'));
            if (brokenCards.length > 0) {
              issues.push({
                type: 'PLACEHOLDER_IMAGES',
                detail: `${brokenCards.length} alternative product card(s) use placeholder "Coming Soon" images`
              });
            }
          }

          // 8. Check Breadcrumbs wrapping
          const breadcrumbs = document.querySelector('.breadcrumbs');
          if (breadcrumbs) {
            const bRect = breadcrumbs.getBoundingClientRect();
            if (bRect.width > winWidth + 5) {
              issues.push({
                type: 'BREADCRUMBS_OVERFLOW',
                detail: `Breadcrumbs container overflows viewport`
              });
            }
          }

          // 9. Inspect Tabs / Specifications Table
          const specTable = document.querySelector('.additional-attributes, table.data.table.additional-attributes, #product-attribute-specs-table');
          const specTab = document.querySelector('#tab-label-additional, [aria-controls="additional"], .specifications-tab');
          if (specTable) {
            const tRect = specTable.getBoundingClientRect();
            if (tRect.width > winWidth + 5) {
              issues.push({
                type: 'SPEC_TABLE_OVERFLOW',
                detail: `Specifications table width (${tRect.width}px) overflows screen (${winWidth}px) without responsive scroll wrapper`
              });
            }
          }

          // 10. California Prop 65 Presence Check
          const hasProp65 = document.body.innerText.includes('P65Warnings.ca.gov') || document.body.innerText.includes('Proposition 65') || document.body.innerText.includes('Di(2-ethylhexyl)phthalate');
          if (!hasProp65) {
            issues.push({
              type: 'MISSING_PROP_65_WARNING',
              detail: `Mandatory California Proposition 65 warning box is missing`
            });
          }

          // 11. Australian English Leaks Check
          const bodyText = document.body.innerText;
          const leaks = [];
          if (bodyText.includes('Customisation')) leaks.push('Customisation');
          if (bodyText.includes('COLOUR:')) leaks.push('COLOUR:');
          if (bodyText.includes('Help Centre')) leaks.push('Help Centre');
          if (bodyText.includes('After Sales Enquiries')) leaks.push('After Sales Enquiries');
          if (bodyText.includes('PRODUCT WEIGHT (KG)')) leaks.push('Metric KG units in specs');
          if (bodyText.includes('AUSTRALIAN OWNED & RUN')) leaks.push('AUSTRALIAN OWNED & RUN footer badge');

          if (leaks.length > 0) {
            issues.push({
              type: 'AUSTRALIAN_LOCALIZATION_LEAKS',
              detail: `AU copy/branding detected on US storefront: ${leaks.join(', ')}`
            });
          }

          return issues;
        }, bp);

        auditFindings.push({
          viewport: bp.name,
          width: bp.width,
          product: item.name,
          issues: responsiveIssues
        });

        console.log(`Results for ${item.name} at ${bp.name}: found ${responsiveIssues.length} issues.`);
        responsiveIssues.forEach(iss => console.log(`  - [${iss.type}] ${iss.detail}`));

      } catch (err) {
        console.error(`Error auditing ${item.name} at ${bp.name}:`, err.message);
      }
    }

    await context.close();
  }

  await browser.close();

  // Save report JSON
  const reportJsonPath = path.join(OUT_DIR, 'responsive_audit_summary.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify(auditFindings, null, 2));
  console.log(`\n Audit complete! Summary saved to: ${reportJsonPath}`);
})();
