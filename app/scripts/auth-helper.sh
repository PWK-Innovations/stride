#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
COOKIE_FILE="$SCRIPT_DIR/.test-cookies"

# --help / -h
if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: $(basename "$0") [--help]"
  echo ""
  echo "Creates (or re-uses) a test user via Supabase Auth REST API,"
  echo "then saves session cookies to scripts/.test-cookies for use with curl."
  echo ""
  echo "Requires .testEnvVars in the app directory."
  echo "  stdout: JSON  { ok: bool, email: string, user_id: string }"
  echo "  exit 0 on success, 1 on failure"
  exit 0
fi

cd "$APP_DIR"

# Source environment
if [[ -f .testEnvVars ]]; then
  # shellcheck disable=SC1091
  source .testEnvVars
else
  echo '{"ok":false,"error":".testEnvVars not found"}' >&2
  exit 1
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}"
# Extract project ref from Supabase URL (e.g. https://xxxx.supabase.co → xxxx)
PROJECT_REF=$(echo "$SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co.*|\1|')
STABLE_EMAIL="${TEST_USER_EMAIL:-stride-ci-test@test.local}"
TEST_PASSWORD="${TEST_USER_PASSWORD:-TestPassword1234}"
COOKIE_NAME="sb-${PROJECT_REF}-auth-token"

# Try sign-in first, then fall back to signup
response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/token?grant_type=password" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${STABLE_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")

access_token=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")

if [[ -z "$access_token" ]]; then
  # Sign up new user
  response=$(curl -s -X POST "${SUPABASE_URL}/auth/v1/signup" \
    -H "apikey: ${ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${STABLE_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")

  access_token=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")

  if [[ -z "$access_token" ]]; then
    escaped=$(echo "$response" | tr '\n' ' ' | sed 's/"/\\"/g')
    echo "{\"ok\":false,\"error\":\"Auth failed: ${escaped}\"}"
    exit 1
  fi
fi

# Extract fields from response
user_id=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('id',''))" 2>/dev/null)
user_email=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('email',''))" 2>/dev/null)

# Build the cookie value: base64url-encoded session JSON
# @supabase/ssr stores cookies as: sb-<ref>-auth-token.0 = base64-<base64url(session)>
session_b64=$(python3 -c "
import base64, json, sys
session = json.loads(sys.stdin.read())
# Only keep the fields the SSR library needs
slim = {
    'access_token': session['access_token'],
    'refresh_token': session['refresh_token'],
    'token_type': session.get('token_type', 'bearer'),
    'expires_in': session.get('expires_in', 3600),
    'expires_at': session.get('expires_at', 0),
    'user': session.get('user', {})
}
val = base64.urlsafe_b64encode(json.dumps(slim).encode()).decode().rstrip('=')
print(val)
" <<< "$response" 2>/dev/null)

# Write cookie file in Netscape/curl format
cat > "$COOKIE_FILE" << COOKIES
# Netscape HTTP Cookie File
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# User: ${user_email}
localhost	FALSE	/	FALSE	0	${COOKIE_NAME}.0	base64-${session_b64}
COOKIES

echo "{\"ok\":true,\"email\":\"${user_email}\",\"user_id\":\"${user_id}\",\"cookie_file\":\"${COOKIE_FILE}\"}"
