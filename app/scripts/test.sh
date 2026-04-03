#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

# --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $(basename "$0") [--help]"
  echo ""
  echo "Sources .testEnvVars, runs all unit/integration test scripts (test:all)."
  echo "  stdout: JSON result  { ok: bool, tests: string[], error?: string }"
  echo "  exit 0 on success, 1 on test failure"
  exit 0
fi

cd "$APP_DIR"

# Source test environment variables
if [[ -f .testEnvVars ]]; then
  # shellcheck disable=SC1091
  source .testEnvVars
else
  echo '{"ok":false,"error":".testEnvVars not found"}'
  exit 2
fi

tests=("test:supabase" "test:openai" "test:google" "test:schedule")
passed=()
failed=()

for t in "${tests[@]}"; do
  if npm run "$t" >/dev/null 2>&1; then
    passed+=("$t")
  else
    failed+=("$t")
  fi
done

# Build JSON arrays
passed_json=$(printf '"%s",' "${passed[@]}" | sed 's/,$//')
failed_json=$(printf '"%s",' "${failed[@]}" | sed 's/,$//')

if [[ ${#failed[@]} -eq 0 ]]; then
  echo "{\"ok\":true,\"passed\":[${passed_json}],\"failed\":[]}"
  exit 0
else
  echo "{\"ok\":false,\"passed\":[${passed_json}],\"failed\":[${failed_json}]}"
  exit 1
fi
