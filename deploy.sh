#!/usr/bin/env bash
# Manual deploy trigger. The actual build + deploy pipeline lives in
# .github/workflows/deploy-api.yml (push to `main` also triggers it).
# This script only starts that workflow and watches it, so there is a
# single deploy path to maintain.
set -euo pipefail

REPO="nikhilsahni7/packtok-latest"
WORKFLOW="deploy-api.yml"

command -v gh >/dev/null || { echo "GitHub CLI (gh) is required: https://cli.github.com"; exit 1; }

echo "Triggering ${WORKFLOW} on ${REPO} (main)..."
gh workflow run "$WORKFLOW" --repo "$REPO" --ref main

# Give Actions a moment to register the run, then watch the newest one.
sleep 5
RUN_ID="$(gh run list --repo "$REPO" --workflow "$WORKFLOW" --limit 1 --json databaseId -q '.[0].databaseId')"
echo "Watching run ${RUN_ID}: https://github.com/${REPO}/actions/runs/${RUN_ID}"
gh run watch "$RUN_ID" --repo "$REPO" --exit-status

echo "Deploy complete. Health: https://api.packtok.com/api/v1/healthcheck"
