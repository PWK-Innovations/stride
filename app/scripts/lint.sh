#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $(basename "$0") [--help]"
  echo ""
  echo "Runs ESLint on the codebase and reports results as JSON."
  echo "  stdout: JSON result  { ok: bool, error?: string }"
  echo "  exit 0 on success, 1 on lint errors"
  exit 0
fi

cd "$APP_DIR"

if output=$(npm run lint 2>&1); then
  echo '{"ok":true}'
  exit 0
else
  escaped=$(echo "$output" | tail -30 | tr '\n' ' ' | sed 's/"/\\"/g')
  echo "{\"ok\":false,\"error\":\"${escaped}\"}"
  exit 1
fi
