# Phase 10: Integrations & Web Chatbot - Roadmap

**Date:** 2026-04-01
**Phase:** 10 - Integrations & Web Chatbot
**Status:** Not started
**Plan:** `2026-04-01-phase-10-integrations-web-chatbot-plan.md`
**Previous Phase:** `2026-04-01-phase-9-agentic-ai-roadmap.md`

---

## Tasks

### 10.1 Outlook Calendar Integration

- [ ] Register Azure AD application (client ID, client secret, redirect URI)
- [ ] Add Microsoft OAuth env vars to `.env.example`
- [ ] Create/extend `calendar_tokens` table for multi-provider storage
- [ ] Migrate existing Google Calendar tokens into multi-provider schema
- [ ] Implement Microsoft OAuth authorization route (`/api/auth/microsoft`)
- [ ] Implement Microsoft OAuth callback route (`/api/auth/microsoft/callback`)
- [ ] Implement token refresh logic for Microsoft tokens
- [ ] Create Microsoft Graph API client to fetch Outlook events (`/me/calendarview`)
- [ ] Build unified calendar event fetcher — merge all providers into single busy-windows list
- [ ] Update agent tool `getCalendarEvents` to use unified fetcher
- [ ] Build calendar settings UI — connect/disconnect providers, show status
- [ ] Add structured logging to all new OAuth and calendar routes
- [ ] Test Outlook OAuth flow end-to-end
- [ ] Test "Build my day" with Outlook events in busy-windows list
- [ ] Test mixed Google + Outlook events merge correctly

### 10.2 Web Chatbot

- [ ] Design chat panel layout — side panel (desktop), full-screen overlay (mobile)
- [ ] Build `ChatPanel` component with message list, input, send button
- [ ] Connect to existing SSE streaming endpoint
- [ ] Load conversation history from `agent_conversations` on panel open
- [ ] Display real-time agent status indicators
- [ ] Render user/agent messages with visual distinction
- [ ] Implement Enter-to-send, Shift+Enter for newline
- [ ] Add open/close toggle on dashboard
- [ ] Follow olive design system
- [ ] Test mobile responsiveness
- [ ] Verify conversation persistence shared with desktop widget
- [ ] Add structured logging for chat interactions
- [ ] Test agent interaction end-to-end through web chatbot
- [ ] Test schedule changes via chatbot reflect in timeline

### 10.3 Additional Integrations (If Validated)

- [ ] Review customer feedback — determine if Todoist or Slack requested by 2+ users
- [ ] If Todoist validated: implement OAuth and task import
- [ ] If Slack validated: implement incoming webhook for schedule summaries
- [ ] If no integrations validated, document decision and skip to Phase 11

---

## Acceptance Criteria

- [ ] All 10.1 and 10.2 tasks complete
- [ ] Outlook OAuth works end-to-end
- [ ] Unified busy-windows includes all connected providers
- [ ] Google Calendar has no regressions
- [ ] Web chatbot streams responses in real time
- [ ] Conversation history shared between chatbot and widget
- [ ] `npm run test:all` passes
- [ ] `aiDocs/changelog.md` updated
- [ ] Roadmap tasks checked off

---

## Next Phase

**Phase 11:** Beta Launch (`2026-04-01-phase-11-beta-launch-roadmap.md`)
