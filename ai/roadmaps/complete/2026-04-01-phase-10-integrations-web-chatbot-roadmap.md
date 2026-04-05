# Phase 10: Integrations & Web Chatbot - Roadmap

**Date:** 2026-04-01
**Phase:** 10 - Integrations & Web Chatbot
**Status:** Complete
**Plan:** `2026-04-01-phase-10-integrations-web-chatbot-plan.md`
**Previous Phase:** `2026-04-01-phase-9-agentic-ai-roadmap.md`

---

## Tasks

### 10.1 Outlook Calendar Integration

- [x] Register Azure AD application (client ID, client secret, redirect URI)
- [x] Add Microsoft OAuth env vars to `.env.example`
- [x] Create/extend `calendar_tokens` table for multi-provider storage
- [x] Migrate existing Google Calendar tokens into multi-provider schema
- [x] Implement Microsoft OAuth authorization route (`/api/auth/microsoft`)
- [x] Implement Microsoft OAuth callback route (`/api/auth/microsoft/callback`)
- [x] Implement token refresh logic for Microsoft tokens
- [x] Create Microsoft Graph API client to fetch Outlook events (`/me/calendarview`)
- [x] Build unified calendar event fetcher — merge all providers into single busy-windows list
- [x] Update agent tool `getCalendarEvents` to use unified fetcher
- [x] Build calendar settings UI — connect/disconnect providers, show status
- [x] Add structured logging to all new OAuth and calendar routes
- [x] Test Outlook OAuth flow end-to-end
- [x] Test "Build my day" with Outlook events in busy-windows list
- [x] Test mixed Google + Outlook events merge correctly

### 10.2 Web Chatbot

- [x] Design chat panel layout — side panel (desktop), full-screen overlay (mobile)
- [x] Build `ChatPanel` component with message list, input, send button
- [x] Connect to existing SSE streaming endpoint
- [x] Load conversation history from `agent_conversations` on panel open
- [x] Display real-time agent status indicators
- [x] Render user/agent messages with visual distinction
- [x] Implement Enter-to-send, Shift+Enter for newline
- [x] Add open/close toggle on dashboard
- [x] Follow olive design system
- [x] Test mobile responsiveness
- [x] Verify conversation persistence shared with desktop widget
- [x] Add structured logging for chat interactions
- [x] Verify agent endpoint (built in Phase 9) works from web chatbot context
- [x] Test agent interaction end-to-end through web chatbot
- [x] Test schedule changes via chatbot reflect in timeline

### 10.3 Additional Integrations (If Validated)

- [x] Review customer feedback — determine if Todoist or Slack requested by 2+ users
- [ ] ~~If Todoist validated: implement OAuth and task import~~ (skipped — no user demand)
- [ ] ~~If Slack validated: implement incoming webhook for schedule summaries~~ (skipped — no user demand)
- [x] If no integrations validated, document decision and skip to Phase 11

---

## Acceptance Criteria

- [x] All 10.1 and 10.2 tasks complete
- [x] Outlook OAuth works end-to-end
- [x] Unified busy-windows includes all connected providers
- [x] Google Calendar has no regressions
- [x] Web chatbot streams responses in real time
- [x] Conversation history shared between chatbot and widget
- [x] `npm run test:all` passes
- [x] `aiDocs/changelog.md` updated
- [x] Roadmap tasks checked off

---

## Next Phase

**Phase 11:** Beta Launch (`2026-04-01-phase-11-beta-launch-roadmap.md`)
