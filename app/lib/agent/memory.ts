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
  const baseMessages: BaseMessage[] = messages.map((msg) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    }
    return new AIMessage(msg.content);
  });

  logger.info("Conversation loaded", { userId, date, messageCount: baseMessages.length });
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
