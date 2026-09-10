#!/usr/bin/env bash
# Runner for Ticket 4: Set up the CMS Structure
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_DIR="$WORKSPACE_ROOT/GlobeWest 2026"

echo "============================================================"
echo "🚀 Running Ticket 4: Set up the CMS Structure QA Suite"
echo "============================================================"

cd "$PROJECT_DIR"
npx playwright test tests/ticket4-us-cms-structure.spec.js --project=desktop-chrome "$@"
