# Phase 10: Integrations & Web Chatbot - Implementation Plan

**Date:** 2026-04-01
**Phase:** 10 - Integrations & Web Chatbot
**Status:** Not started
**Parent Plan:** `2026-04-01-high-level-plan-final-stride.md`
**Roadmap:** `2026-04-01-phase-10-integrations-web-chatbot-roadmap.md`
**Previous Phase:** `2026-04-01-phase-9-agentic-ai-plan.md`
**Next Phase:** `2026-04-01-phase-11-beta-launch-plan.md`

---

## Clean Code Principles

This phase adds a second calendar provider (Outlook) and a web-based chatbot interface. Both integrate with existing infrastructure — the multi-provider calendar system and the agentic AI backend. Reuse SSE streaming, agent executor, and conversation persistence from Phase 9. Do not build new abstractions unless existing ones cannot support the new provider or interface.

---

## Goal

Extend Stride's reach by supporting Outlook Calendar alongside Google Calendar and by providing a lightweight web chatbot for users who don't have the desktop widget installed.

---

## Prerequisites

- Phase 9 complete (agentic AI with LangChain agent, SSE streaming, conversation persistence)
- Desktop widget functional and syncing with the web app
- Google Calendar OAuth and event fetching working
- Agent tools (getCalendarEvents, createScheduledBlocks, etc.) operational

---

## 10.1 Outlook Calendar Integration

### Why

Google Calendar covers a large portion of users, but many professionals — especially in corporate and academic environments — rely on Outlook. Supporting a second provider validates the multi-provider architecture and broadens Stride's addressable user base.

### What to Build

- Azure AD app registration with Microsoft OAuth 2.0 (authorization code flow)
- OAuth callback route for Microsoft, following the same pattern as existing Google OAuth
- Multi-provider token storage: `calendar_tokens` table supporting multiple providers per user (provider type, access token, refresh token, expiration)
- Migrate existing Google Calendar tokens into multi-provider schema
- Microsoft Graph API integration to fetch Outlook calendar events (`/me/calendarview`)
- Unified busy-windows list: merge events from all connected providers into a single list for the scheduling agent
- Calendar settings UI: connect/disconnect Google and Outlook, see connection status

### What Not to Do

- Do not build Apple Calendar integration — future work
- Do not cache calendar events locally — fetch on demand
- Do not change the agent's scheduling logic; it receives the same busy-windows format regardless of provider

---

## 10.2 Web Chatbot

### Why

Not all users will install the desktop widget — especially mobile users. A web chatbot gives every user access to the same agentic AI without a separate app. Demonstrates the agent architecture is interface-agnostic.

### What to Build

- Sliding chat panel on the web app dashboard — collapsible side panel or bottom drawer
- Connects to the same SSE streaming endpoint and agent executor used by the desktop widget
- Same conversation persistence: messages stored in `agent_conversations`
- Real-time agent status indicators: thinking, calling tools, streaming response
- Message input with send button and Enter-to-send
- Scrollable message history with user/agent visual distinction
- Mobile-responsive: full-screen overlay or bottom sheet on mobile

### What Not to Do

- Do not build a separate agent or conversation history — shares everything with the widget
- Do not over-design; match the existing olive design system
- Do not add voice input in this phase — text only

---

## 10.3 Additional Integrations (If Validated)

### Validation Gate

Do not start building unless at least 2-3 users have specifically requested it. If no demand is validated, skip entirely.

### What to Build (If Validated)

- Todoist task import: OAuth, fetch active tasks, import into Stride with mapped fields
- Slack notifications: incoming webhook posting schedule summaries and reminders

---

## Deliverable

Outlook Calendar supported. Web chatbot provides agent access on all platforms. Additional integrations built only if validated by user feedback.

---

## Acceptance Criteria

- Users can connect Outlook Calendar via Microsoft OAuth
- Outlook events appear in unified busy-windows list
- Google Calendar has no regressions after multi-provider migration
- Web chatbot streams agent responses in real time
- Conversation history shared between web chatbot and desktop widget
- Web chatbot responsive on mobile
- Existing tests pass (`npm run test:all`)
