#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $(basename "$0") [--help]"
  echo ""
  echo "Runs the Next.js production build and reports success/failure as JSON."
  echo "  stdout: JSON result  { ok: bool, duration_ms: number, error?: string }"
  echo "  exit 0 on success, 1 on build failure"
  exit 0
fi

cd "$APP_DIR"

start_ms=$(date +%s%3N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1000))')

if output=$(npm run build 2>&1); then
  end_ms=$(date +%s%3N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1000))')
  duration=$(( end_ms - start_ms ))
  echo "{\"ok\":true,\"duration_ms\":${duration}}"
  exit 0
else
  end_ms=$(date +%s%3N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1000))')
  duration=$(( end_ms - start_ms ))
  # Escape the output for JSON (replace newlines, quotes)
  escaped=$(echo "$output" | tail -20 | tr '\n' ' ' | sed 's/"/\\"/g')
  echo "{\"ok\":false,\"duration_ms\":${duration},\"error\":\"${escaped}\"}"
  exit 1
fi
