#!/bin/bash
# ============================================================
# RUN PLP CROSS-STOREFRONT COMPARISON TEST IN HEADED MODE
# ============================================================
cd "$(dirname "$0")/../GlobeWest 2026" || exit 1
echo "🚀 Running PLP Page Cross-Storefront Comparison (US vs AU) in Headed Mode..."
npx playwright test tests/plp-us-vs-au-comparison.spec.js --project=desktop-chrome --headed
