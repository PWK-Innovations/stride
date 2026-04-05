# Outlook Calendar Integration — Azure AD Setup Guide

## 1. Create Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** (formerly Azure Active Directory)
2. **App registrations** → **New registration**
3. Fill in:
   - **Name:** `Stride`
   - **Supported account types:** "Accounts in any organizational directory and personal Microsoft accounts" (for broadest coverage)
   - **Redirect URI:** Select "Web" → `http://localhost:3000/api/auth/microsoft/callback`
4. Click **Register**
5. Copy the **Application (client) ID** — this is your `MICROSOFT_CLIENT_ID`

## 2. Create Client Secret

1. In your app registration → **Certificates & secrets** → **New client secret**
2. Description: `Stride dev secret`
3. Expiry: 24 months
4. Click **Add**
5. Copy the **Value** immediately (it won't be shown again) — this is your `MICROSOFT_CLIENT_SECRET`

## 3. Configure API Permissions

1. In your app registration → **API permissions** → **Add a permission**
2. Select **Microsoft Graph** → **Delegated permissions**
3. Search and add:
   - `Calendars.Read` — read user's calendar events
   - `User.Read` — read user's basic profile (usually added by default)
4. Click **Add permissions**
5. You do NOT need admin consent for these scopes with personal/work accounts

## 4. Set Environment Variables

Add to your `.env.local`:

```
MICROSOFT_CLIENT_ID=your-application-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret-value
MICROSOFT_REDIRECT_URI=http://localhost:3000/api/auth/microsoft/callback
```

For production, update the redirect URI to your Vercel domain and add it in Azure Portal under **Authentication** → **Redirect URIs**.

## 5. Verify

Once env vars are set, let Claude Code know and we'll implement:
- OAuth authorization route (`/api/auth/microsoft`)
- OAuth callback route (`/api/auth/microsoft/callback`)
- Token refresh logic
- Microsoft Graph API client for calendar events
- Unified busy-windows merger
- Calendar settings UI

## Notes

- Microsoft OAuth uses authorization code flow (same pattern as Google)
- Tokens are short-lived (1 hour), refresh tokens last 90 days
- Calendar events are fetched via Microsoft Graph API: `GET /me/calendarview?startDateTime=...&endDateTime=...`
- No need for a paid Azure subscription — free tier covers OAuth and Graph API
