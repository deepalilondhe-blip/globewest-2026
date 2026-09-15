#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT_DIR="$(dirname "$DIR")"
GW_DIR="$ROOT_DIR/GlobeWest 2026"

echo "============================================================"
echo "🚀 Running Ticket 5: US Header & Mega Menu Audit (HEADED MODE)"
echo "   Target:   https://mcstaging2.globewest.com"
echo "   Baseline: https://mcstaging2.globewest.com.au"
echo "============================================================"

cd "$GW_DIR"
npx playwright test tests/ticket5-us-header-comparison.spec.js --project=desktop-chrome --headed || true

echo ""
echo "🎨 Generating Side-by-Side Red (US) / Green (AU) Comparison Images..."
python3 "$DIR/scripts/generate_header_comparison.py"

echo ""
echo "📊 Generating Excel Test Cases & Reports..."
node "$DIR/scripts/generate_ticket5_xlsx.js"

echo ""
echo "============================================================"
echo "✅ All Ticket 5 Header tests, comparisons & reports complete!"
echo "   Comparison Images: $DIR/comparison"
echo "   Test Cases:        $DIR/Ticket5_Header_TestCases.xlsx"
echo "============================================================"
