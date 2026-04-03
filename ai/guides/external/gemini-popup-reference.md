# Gemini Popup Design Reference

**Purpose:** Design reference for Stride's full-mode chat UI, inspired by Google Gemini's floating popup assistant.

---

## Layout Structure

Gemini's popup is a compact chatbot window that floats over the user's workspace. It has a clear vertical stack:

1. **Header** — branding, minimize/close buttons, drag handle
2. **Chat area** — scrollable message list
3. **Suggestion chips** — contextual quick-actions (shown in empty state and after responses)
4. **Input bar** — text field with send button at the bottom

---

## Visual Design Patterns

### Window

- Fixed dimensions (~380x600px), rounded corners (12px)
- Dark background with subtle border
- Drop shadow for floating effect
- No user-resizable edges — fixed size

### Header

- Left: product name/logo
- Right: minimize and close icons
- Entire header is a drag region
- Thin bottom border separating from content

### Chat Messages

- **User messages:** Right-aligned, colored bubble (Gemini uses blue; Stride uses olive), rounded corners, white text
- **Assistant messages:** Left-aligned, darker card background, rounded corners, standard text color
- Messages have subtle padding (12-16px) and margin between them (8px)
- Timestamps are optional — Gemini often omits them for compactness

### Suggestion Chips

- Horizontal row of rounded pill buttons
- Appear below the last assistant message or in the empty state
- Light border, muted text, hover effect
- Clicking a chip sends it as a user message
- Examples: "Summarize this page", "Help me write", "What can you do?"

### Input Bar

- Rounded text field spanning the width
- Send button (arrow icon) on the right side, inside the field
- Placeholder text: "Ask me anything..."
- Enter to submit, Shift+Enter for newline (optional)
- Subtle top border or shadow separating from chat area

### Typing Indicator

- Three animated dots in an assistant bubble
- Appears while processing
- Replaced by the actual response when ready

---

## Interaction Patterns

### Empty State

- Welcome message from assistant ("Hi! How can I help?")
- Suggestion chips shown prominently
- No scroll needed — everything fits in view

### Conversation Flow

1. User types or clicks a chip
2. User message appears immediately (right-aligned)
3. Typing indicator appears (left-aligned)
4. Assistant response replaces indicator (left-aligned)
5. New suggestion chips appear below response
6. Chat auto-scrolls to bottom

### Mode Switching (Stride-specific)

- Gemini doesn't have a compressed mode, but Stride does
- Compress button in header shrinks to pill view
- Expand button in pill opens full chat view
- Chat history preserved across mode switches

---

## Stride Adaptations

| Gemini Pattern | Stride Adaptation |
|---|---|
| Blue user bubbles | Olive user bubbles (design system) |
| White background | Dark theme (#1a1a1a background) |
| Google branding | "Stride" wordmark in header |
| Web-embedded popup | Electron floating window |
| AI-powered responses | Client-side command parsing (Phase 8), AI agent (Phase 9) |
| No compressed mode | Compressed pill mode for passive glancing |
| Always-visible chips | Chips in empty state + after responses |

---

## Key Dimensions (Stride Full Mode)

- Window: 380 x 620px
- Border radius: 12px
- Header height: 48px
- Task bar height: 56px
- Chat area: flex-grow (fills remaining space)
- Chip row height: ~44px
- Input bar height: 56px
- Message bubble padding: 12px 16px
- Message bubble border-radius: 16px (user), 16px (assistant, with 4px top-left)
- Chip border-radius: 20px
- Input field border-radius: 24px
