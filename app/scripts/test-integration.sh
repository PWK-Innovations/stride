#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
COOKIE_FILE="$SCRIPT_DIR/.test-cookies"
BASE_URL="${TEST_BASE_URL:-http://localhost:3000}"
STATUS_FILE=$(mktemp)
BODY_FILE=$(mktemp)
trap 'rm -f "$STATUS_FILE" "$BODY_FILE"' EXIT

# --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $(basename "$0") [--help]"
  echo ""
  echo "Runs integration tests against a running Stride dev server."
  echo "Authenticates via Supabase, then tests all API endpoints."
  echo ""
  echo "  env: TEST_BASE_URL (default: http://localhost:3000)"
  echo "  stdout: JSON  { ok: bool, passed: number, failed: number, results: [...] }"
  echo "  exit 0 if all tests pass, 1 if any fail"
  exit 0
fi

cd "$APP_DIR"

# ─── Helpers ────────────────────────────────────────────────────────────────

passed=0
failed=0
results=()

assert() {
  local name="$1"
  local expected_status="$2"
  local actual_status="$3"
  local body="$4"
  local check_body="${5:-}"

  local ok=true

  if [[ "$actual_status" != "$expected_status" ]]; then
    ok=false
  fi

  if [[ -n "$check_body" && "$body" != *"$check_body"* ]]; then
    ok=false
  fi

  if $ok; then
    passed=$((passed + 1))
    results+=("{\"name\":\"${name}\",\"ok\":true,\"status\":${actual_status}}")
  else
    failed=$((failed + 1))
    local escaped_body
    escaped_body=$(echo "$body" | head -1 | cut -c1-200 | sed 's/"/\\"/g' | tr '\n' ' ')
    results+=("{\"name\":\"${name}\",\"ok\":false,\"status\":${actual_status},\"expected_status\":${expected_status},\"body\":\"${escaped_body}\"}")
  fi
}

# Curl wrappers write body to BODY_FILE, status to STATUS_FILE
# Caller reads: body=$(cat "$BODY_FILE"); status=$(cat "$STATUS_FILE")
do_get() {
  local url="$1"
  local cookies="${2:-}"
  if [[ -n "$cookies" ]]; then
    curl -s -o "$BODY_FILE" -w "%{http_code}" -b "$cookies" "$url" > "$STATUS_FILE"
  else
    curl -s -o "$BODY_FILE" -w "%{http_code}" "$url" > "$STATUS_FILE"
  fi
}

do_post() {
  local url="$1"
  local data="$2"
  local cookies="${3:-}"
  if [[ -n "$cookies" ]]; then
    curl -s -o "$BODY_FILE" -w "%{http_code}" -X POST -H "Content-Type: application/json" -b "$cookies" -d "$data" "$url" > "$STATUS_FILE"
  else
    curl -s -o "$BODY_FILE" -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url" > "$STATUS_FILE"
  fi
}

do_delete() {
  local url="$1"
  local cookies="$2"
  curl -s -o "$BODY_FILE" -w "%{http_code}" -X DELETE -b "$cookies" "$url" > "$STATUS_FILE"
}

do_patch() {
  local url="$1"
  local data="$2"
  local cookies="$3"
  curl -s -o "$BODY_FILE" -w "%{http_code}" -X PATCH -H "Content-Type: application/json" -b "$cookies" -d "$data" "$url" > "$STATUS_FILE"
}

read_result() {
  body=$(cat "$BODY_FILE")
  status=$(cat "$STATUS_FILE")
}

# ─── Step 0: Check server is running ───────────────────────────────────────

echo '{"event":"starting","base_url":"'"$BASE_URL"'"}' >&2

do_get "$BASE_URL/"
read_result

if [[ "$status" != "200" ]]; then
  echo "{\"ok\":false,\"error\":\"Server not running at ${BASE_URL} (status: ${status})\"}"
  exit 1
fi

# ─── Step 1: Authenticate ──────────────────────────────────────────────────

echo '{"event":"authenticating"}' >&2

auth_result=$("$SCRIPT_DIR/auth-helper.sh")
auth_ok=$(echo "$auth_result" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ok',False))" 2>/dev/null)

if [[ "$auth_ok" != "True" ]]; then
  echo "{\"ok\":false,\"error\":\"Auth failed: ${auth_result}\"}"
  exit 1
fi

echo '{"event":"authenticated"}' >&2

# ─── Section A: Public / Smoke Tests ───────────────────────────────────────

echo '{"event":"section","name":"public_smoke"}' >&2

do_get "$BASE_URL/"
read_result
assert "GET / landing page" 200 "$status" "$body"

do_get "$BASE_URL/api/test/supabase"
read_result
assert "GET /api/test/supabase" 200 "$status" "$body" "success"

do_get "$BASE_URL/api/test/openai"
read_result
assert "GET /api/test/openai" 200 "$status" "$body" "success"

# ─── Section B: Auth Guard Tests (no cookies) ─────────────────────────────

echo '{"event":"section","name":"auth_guards"}' >&2

do_get "$BASE_URL/api/profile"
read_result
assert "GET /api/profile no auth → 401" 401 "$status" "$body" "Not authenticated"

do_get "$BASE_URL/api/tasks"
read_result
assert "GET /api/tasks no auth → 401" 401 "$status" "$body" "Not authenticated"

do_get "$BASE_URL/api/schedule"
read_result
assert "GET /api/schedule no auth → 401" 401 "$status" "$body" "Not authenticated"

# ─── Section C: Profile ────────────────────────────────────────────────────

echo '{"event":"section","name":"profile"}' >&2

do_get "$BASE_URL/api/profile" "$COOKIE_FILE"
read_result
assert "GET /api/profile (authed)" 200 "$status" "$body" "googleConnected"

# ─── Section D: Task CRUD ──────────────────────────────────────────────────

echo '{"event":"section","name":"task_crud"}' >&2

# Create a valid task
do_post "$BASE_URL/api/tasks" '{"title":"CLI Integration Test Task","notes":"Automated","duration_minutes":25}' "$COOKIE_FILE"
read_result
assert "POST /api/tasks create valid" 201 "$status" "$body" "task"

task_id=$(echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin).get('task',{}).get('id',''))" 2>/dev/null || echo "")

# Create with missing title
do_post "$BASE_URL/api/tasks" '{"notes":"no title"}' "$COOKIE_FILE"
read_result
assert "POST /api/tasks missing title → 400" 400 "$status" "$body" "Title is required"

# Create with empty title
do_post "$BASE_URL/api/tasks" '{"title":"","notes":"empty"}' "$COOKIE_FILE"
read_result
assert "POST /api/tasks empty title → 400" 400 "$status" "$body" "Title is required"

# List tasks (should include our created task)
do_get "$BASE_URL/api/tasks" "$COOKIE_FILE"
read_result
assert "GET /api/tasks list" 200 "$status" "$body" "tasks"

# Verify created task appears in list
if [[ -n "$task_id" && "$body" == *"$task_id"* ]]; then
  passed=$((passed + 1))
  results+=('{"name":"GET /api/tasks contains created task","ok":true,"status":200}')
else
  failed=$((failed + 1))
  results+=('{"name":"GET /api/tasks contains created task","ok":false,"status":200,"body":"task_id not found in response"}')
fi

# Delete the created task
if [[ -n "$task_id" ]]; then
  do_delete "$BASE_URL/api/tasks/$task_id" "$COOKIE_FILE"
  read_result
  assert "DELETE /api/tasks/[id] valid" 200 "$status" "$body" "success"
fi

# Verify task is gone
do_get "$BASE_URL/api/tasks" "$COOKIE_FILE"
read_result
if [[ -n "$task_id" && "$body" != *"$task_id"* ]]; then
  passed=$((passed + 1))
  results+=('{"name":"GET /api/tasks task deleted","ok":true,"status":200}')
else
  failed=$((failed + 1))
  results+=('{"name":"GET /api/tasks task deleted","ok":false,"status":200,"body":"task_id still present after delete"}')
fi

# ─── Section E: Schedule ───────────────────────────────────────────────────

echo '{"event":"section","name":"schedule"}' >&2

do_get "$BASE_URL/api/schedule?timezone=America/New_York" "$COOKIE_FILE"
read_result
assert "GET /api/schedule with timezone" 200 "$status" "$body" "scheduled_blocks"

# Build schedule (should fail — no Google Calendar)
do_post "$BASE_URL/api/schedule/build" '{"timezone":"America/New_York"}' "$COOKIE_FILE"
read_result
assert "POST /api/schedule/build no Google → 400" 400 "$status" "$body" "Google Calendar not connected"

# Patch nonexistent block
do_patch "$BASE_URL/api/schedule/00000000-0000-0000-0000-000000000000" \
  '{"start_time":"2026-02-24T09:00:00Z","end_time":"2026-02-24T10:00:00Z"}' "$COOKIE_FILE"
read_result
assert "PATCH /api/schedule/[invalid-id] → 404" 404 "$status" "$body" "not found"

# Patch with missing fields
do_patch "$BASE_URL/api/schedule/00000000-0000-0000-0000-000000000000" \
  '{"start_time":"2026-02-24T09:00:00Z"}' "$COOKIE_FILE"
read_result
assert "PATCH /api/schedule missing end_time → 400" 400 "$status" "$body" "required"

# ─── Output Results ────────────────────────────────────────────────────────

total=$((passed + failed))
results_json=$(printf '%s,' "${results[@]}" | sed 's/,$//')

if [[ $failed -eq 0 ]]; then
  echo "{\"ok\":true,\"passed\":${passed},\"failed\":0,\"total\":${total},\"results\":[${results_json}]}"
  exit 0
else
  echo "{\"ok\":false,\"passed\":${passed},\"failed\":${failed},\"total\":${total},\"results\":[${results_json}]}"
  exit 1
fi
