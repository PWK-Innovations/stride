#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $(basename "$0") [--help]"
  echo ""
  echo "Starts the Next.js production server (npm start)."
  echo "Requires a prior build (run build.sh first)."
  echo "  exit 0 on clean shutdown, 1 on failure"
  exit 0
fi

cd "$APP_DIR"

echo '{"event":"starting","mode":"production"}' >&2
exec npm start
