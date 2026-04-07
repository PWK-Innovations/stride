import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/lib/logger";

const logger = createLogger("agent:memory");

interface StoredMessage {
  role: "user" | "assistant";
  content: string;
}

export async function loadConversation(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  maxMessages?: number,
): Promise<BaseMessage[]> {
  logger.info("Loading conversation", { userId, date });

  const { data, error } = await supabase
    .from("agent_conversations")
    .select("messages")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (error || !data) {
    logger.info("No existing conversation found", { userId, date });
    return [];
  }

  const messages = data.messages as StoredMessage[];

  // Keep only recent messages to prevent stale schedule data from confusing the agent.
  // Old assistant responses may reference tasks/times that no longer exist.
  const MAX_HISTORY_MESSAGES = maxMessages ?? 10;
  const trimmed = messages.length > MAX_HISTORY_MESSAGES
    ? messages.slice(-MAX_HISTORY_MESSAGES)
    : messages;

  const baseMessages: BaseMessage[] = trimmed.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    }
    // Strip schedule data from assistant history to prevent stale time references.
    // The agent must always call getScheduledBlocks for current times.
    let cleaned = msg.content;
    // Strip numbered schedule lists: "1. **Task** - 3:20 PM..."
    cleaned = cleaned.replace(
      /(\d+\.\s+\*\*.*?\*\*\s*[-–]\s*\d{1,2}:\d{2}\s*(AM|PM).*\n?)+/gi,
      "[schedule omitted]\n",
    );
    // Strip inline schedule references: "scheduled from **5:00 PM to 5:30 PM**"
    cleaned = cleaned.replace(
      /scheduled\s+from\s+\*{0,2}\d{1,2}:\d{2}\s*(AM|PM)\*{0,2}\s*(to|-|–)\s*\*{0,2}\d{1,2}:\d{2}\s*(AM|PM)\*{0,2}/gi,
      "[time omitted]",
    );
    return new AIMessage(cleaned);
  });

  logger.info("Conversation loaded", {
    userId,
    date,
    totalMessages: messages.length,
    loadedMessages: baseMessages.length,
  });
  return baseMessages;
}

export async function saveMessage(
  supabase: SupabaseClient,
  userId: string,
  date: string,
  role: "user" | "assistant",
  content: string,
): Promise<void> {
  logger.info("Saving message", { userId, date, role });

  const newMessage: StoredMessage = { role, content };

  // Try to fetch existing conversation
  const { data: existing } = await supabase
    .from("agent_conversations")
    .select("id, messages")
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  if (existing) {
    // Append to existing messages array
    const messages = existing.messages as StoredMessage[];
    messages.push(newMessage);

    const { error } = await supabase
      .from("agent_conversations")
      .update({ messages })
      .eq("id", existing.id);

    if (error) {
      logger.error("Failed to update conversation", { error: error.message });
      return;
    }
  } else {
    // Create new conversation row
    const { error } = await supabase
      .from("agent_conversations")
      .insert({
        user_id: userId,
        date,
        messages: [newMessage],
      });

    if (error) {
      logger.error("Failed to create conversation", { error: error.message });
      return;
    }
  }

  logger.info("Message saved", { userId, date, role });
}
