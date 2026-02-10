# Google Calendar API Reference for Stride

Quick reference for integrating Google Calendar in Stride.

**Last updated:** 2026-02-09  
**Official docs:** https://developers.google.com/calendar/api/v3/reference

---

## Overview

The Google Calendar API is a RESTful API for accessing and manipulating calendar data. For Stride, we use it to:
1. Fetch user's calendar events (busy windows)
2. Identify free time slots for scheduling tasks

**Base URL:** `https://www.googleapis.com/calendar/v3`

---

## Authentication (OAuth 2.0)

Stride uses **OAuth 2.0** to access user calendars. Tokens are stored per user in Supabase.

### OAuth Flow

1. **Redirect user to Google consent screen:**
   ```
   https://accounts.google.com/o/oauth2/v2/auth?
     client_id=YOUR_CLIENT_ID&
     redirect_uri=YOUR_REDIRECT_URI&
     response_type=code&
     scope=https://www.googleapis.com/auth/calendar.readonly&
     access_type=offline&
     prompt=consent
   ```

2. **Exchange authorization code for tokens:**
   ```bash
   POST https://oauth2.googleapis.com/token
   Content-Type: application/x-www-form-urlencoded
   
   code=AUTHORIZATION_CODE&
   client_id=YOUR_CLIENT_ID&
   client_secret=YOUR_CLIENT_SECRET&
   redirect_uri=YOUR_REDIRECT_URI&
   grant_type=authorization_code
   ```

3. **Store tokens in Supabase:**
   - `access_token` (expires in 1 hour)
   - `refresh_token` (use to get new access tokens)
   - `expires_at` (timestamp)

4. **Refresh access token when expired:**
   ```bash
   POST https://oauth2.googleapis.com/token
   Content-Type: application/x-www-form-urlencoded
   
   refresh_token=REFRESH_TOKEN&
   client_id=YOUR_CLIENT_ID&
   client_secret=YOUR_CLIENT_SECRET&
   grant_type=refresh_token
   ```

### Required Scope

For Stride (read-only calendar access):
```
https://www.googleapis.com/auth/calendar.readonly
```

---

## Key Resources

### 1. CalendarList

List all calendars on the user's account.

**Endpoint:** `GET /users/me/calendarList`

```javascript
// Example: List user's calendars
const response = await fetch(
  'https://www.googleapis.com/calendar/v3/users/me/calendarList',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const data = await response.json();
// data.items = array of calendars
```

**Response:**
```json
{
  "items": [
    {
      "id": "primary",
      "summary": "John Doe",
      "primary": true,
      "timeZone": "America/New_York"
    },
    {
      "id": "work@example.com",
      "summary": "Work Calendar",
      "timeZone": "America/New_York"
    }
  ]
}
```

### 2. Events

Fetch events from a calendar.

**Endpoint:** `GET /calendars/{calendarId}/events`

**Key parameters:**
- `timeMin` (RFC3339 timestamp): Lower bound for event start time
- `timeMax` (RFC3339 timestamp): Upper bound for event start time
- `singleEvents=true`: Expand recurring events into instances
- `orderBy=startTime`: Sort by start time (requires `singleEvents=true`)

```javascript
// Example: Fetch today's events
const today = new Date();
const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString();
const timeMax = new Date(today.setHours(23, 59, 59, 999)).toISOString();

const response = await fetch(
  `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
  `timeMin=${encodeURIComponent(timeMin)}&` +
  `timeMax=${encodeURIComponent(timeMax)}&` +
  `singleEvents=true&` +
  `orderBy=startTime`,
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const data = await response.json();
// data.items = array of events
```

**Response (event object):**
```json
{
  "id": "event123",
  "summary": "Team Meeting",
  "start": {
    "dateTime": "2026-02-09T10:00:00-05:00",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "2026-02-09T11:00:00-05:00",
    "timeZone": "America/New_York"
  },
  "status": "confirmed"
}
```

**All-day events:**
```json
{
  "summary": "Birthday",
  "start": {
    "date": "2026-02-09"
  },
  "end": {
    "date": "2026-02-10"
  }
}
```

### 3. FreeBusy

Query free/busy information for multiple calendars (faster than fetching all events).

**Endpoint:** `POST /freeBusy`

```javascript
// Example: Check free/busy for today
const response = await fetch(
  'https://www.googleapis.com/calendar/v3/freeBusy',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timeMin: '2026-02-09T00:00:00Z',
      timeMax: '2026-02-09T23:59:59Z',
      items: [
        { id: 'primary' },
        { id: 'work@example.com' }
      ]
    })
  }
);

const data = await response.json();
```

**Response:**
```json
{
  "calendars": {
    "primary": {
      "busy": [
        {
          "start": "2026-02-09T10:00:00Z",
          "end": "2026-02-09T11:00:00Z"
        },
        {
          "start": "2026-02-09T14:00:00Z",
          "end": "2026-02-09T15:30:00Z"
        }
      ]
    }
  }
}
```

---

## Stride-Specific Use Cases

### 1. Fetch Today's Busy Windows

For scheduling engine: get all busy time slots for today.

```javascript
async function getTodaysBusyWindows(accessToken, calendarId = 'primary') {
  const today = new Date();
  const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const timeMax = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
    `timeMin=${encodeURIComponent(timeMin)}&` +
    `timeMax=${encodeURIComponent(timeMax)}&` +
    `singleEvents=true&` +
    `orderBy=startTime`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );

  const data = await response.json();
  
  // Extract busy windows
  const busyWindows = data.items
    .filter(event => event.start.dateTime && event.end.dateTime) // Skip all-day events
    .map(event => ({
      start: new Date(event.start.dateTime),
      end: new Date(event.end.dateTime),
      summary: event.summary
    }));

  return busyWindows;
}
```

### 2. Calculate Free Time Slots

Given busy windows and working hours, calculate free slots.

```javascript
function calculateFreeSlots(busyWindows, workingHours = { start: 9, end: 17 }) {
  const today = new Date();
  const workStart = new Date(today.setHours(workingHours.start, 0, 0, 0));
  const workEnd = new Date(today.setHours(workingHours.end, 0, 0, 0));

  // Sort busy windows by start time
  const sorted = busyWindows.sort((a, b) => a.start - b.start);

  const freeSlots = [];
  let currentTime = workStart;

  for (const busy of sorted) {
    if (busy.start > currentTime) {
      // Free slot before this busy window
      freeSlots.push({
        start: currentTime,
        end: busy.start,
        durationMinutes: (busy.start - currentTime) / 60000
      });
    }
    currentTime = new Date(Math.max(currentTime, busy.end));
  }

  // Free slot after last busy window
  if (currentTime < workEnd) {
    freeSlots.push({
      start: currentTime,
      end: workEnd,
      durationMinutes: (workEnd - currentTime) / 60000
    });
  }

  return freeSlots;
}
```

### 3. Handle Token Refresh

Automatically refresh expired access tokens.

```javascript
async function getValidAccessToken(user) {
  // Check if token is expired
  if (new Date() >= new Date(user.token_expires_at)) {
    // Refresh token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: user.refresh_token,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();
    
    // Update user's tokens in Supabase
    await supabase
      .from('profiles')
      .update({
        access_token: data.access_token,
        token_expires_at: new Date(Date.now() + data.expires_in * 1000)
      })
      .eq('id', user.id);

    return data.access_token;
  }

  return user.access_token;
}
```

---

## Error Handling

Common errors and how to handle them:

| Status Code | Error | Solution |
|-------------|-------|----------|
| `401` | Invalid credentials | Refresh access token |
| `403` | Insufficient permissions | Check OAuth scope |
| `404` | Calendar not found | Verify calendar ID |
| `429` | Rate limit exceeded | Implement exponential backoff |
| `500` | Server error | Retry with backoff |

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.ok) {
      return response.json();
    }
    
    if (response.status === 401) {
      // Token expired - refresh and retry
      options.headers.Authorization = `Bearer ${await refreshToken()}`;
      continue;
    }
    
    if (response.status === 429 || response.status >= 500) {
      // Rate limit or server error - retry with backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      continue;
    }
    
    throw new Error(`API error: ${response.status}`);
  }
  
  throw new Error('Max retries exceeded');
}
```

---

## Rate Limits

- **Queries per day:** 1,000,000 (per project)
- **Queries per 100 seconds per user:** 500

**Best practices:**
- Use `freeBusy` endpoint instead of fetching all events when possible
- Cache calendar data (but Stride MVP doesn't cache for simplicity)
- Implement exponential backoff for retries

---

## Time Zones

**Important:** Always handle time zones correctly.

- Events have `timeZone` in `start` and `end` objects
- Use `dateTime` (RFC3339) for timed events
- Use `date` (YYYY-MM-DD) for all-day events

```javascript
// Convert event time to user's local time
const eventStart = new Date(event.start.dateTime);
const localTime = eventStart.toLocaleString('en-US', {
  timeZone: event.start.timeZone || 'America/New_York'
});
```

---

## Best Practices for Stride

1. **Store tokens securely** in Supabase (never in client-side code).
2. **Refresh tokens proactively** before they expire (check `expires_at`).
3. **Handle all-day events** separately (they use `date` instead of `dateTime`).
4. **Use `singleEvents=true`** to expand recurring events.
5. **Implement retry logic** for rate limits and transient errors.
6. **Respect user privacy**: read-only scope, clear data usage policy.
7. **Test with multiple calendars** (primary + work/personal).

---

## Resources

- **Official docs:** https://developers.google.com/calendar/api/v3/reference
- **OAuth 2.0 guide:** https://developers.google.com/identity/protocols/oauth2
- **Quickstart:** https://developers.google.com/calendar/api/quickstart/nodejs
- **Events resource:** https://developers.google.com/calendar/api/v3/reference/events
- **FreeBusy query:** https://developers.google.com/calendar/api/v3/reference/freebusy/query
