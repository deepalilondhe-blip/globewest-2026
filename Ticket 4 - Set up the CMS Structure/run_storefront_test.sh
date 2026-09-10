#!/usr/bin/env bash
# One-click runner for Storefront Flow with Visual Highlighting
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_DIR="$WORKSPACE_ROOT/GlobeWest 2026"

echo "============================================================"
echo "🌟 Running US Storefront Functional Test with Visual Highlighting"
echo "============================================================"

cd "$PROJECT_DIR"
npx playwright test tests/ticket4-us-cms-structure.spec.js -g "TC-US-CMS-04-to-12" --project=desktop-chrome --headed "$@"
