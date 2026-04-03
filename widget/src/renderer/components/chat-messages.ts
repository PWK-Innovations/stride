import { createLogger } from "../logger";

const logger = createLogger("ChatMessages");

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTypingIndicator(): string {
  return `
    <div class="message message-assistant message-fade-in">
      <div class="typing-dots">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    </div>
  `;
}

function buildMessage(message: ChatMessage): string {
  if (message.typing) {
    return buildTypingIndicator();
  }

  const roleClass = message.role === "user" ? "message-user" : "message-assistant";
  const content = escapeHtml(message.content).replace(/\n/g, "<br>");

  return `
    <div class="message ${roleClass} message-fade-in">
      <div class="message-content">${content}</div>
    </div>
  `;
}

export function buildChatMessages(messages: ChatMessage[]): string {
  logger.debug("Built chat messages", { count: messages.length });

  const messageHtml = messages.map(buildMessage).join("");

  return `
    <div class="chat-area" id="chat-messages">
      ${messageHtml}
    </div>
  `;
}

export function scrollToBottom(): void {
  const container = document.getElementById("chat-messages");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}
