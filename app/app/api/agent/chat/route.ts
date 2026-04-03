import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/api-auth";
import { createSchedulingAgent, AGENT_RECURSION_LIMIT } from "@/lib/agent/agent";
import { loadConversation, saveMessage } from "@/lib/agent/memory";
import { HumanMessage } from "@langchain/core/messages";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:agent:chat");

export async function POST(req: NextRequest) {
  try {
    const authResult = await getAuthenticatedUser(req);
    if ("error" in authResult) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { user, supabase } = authResult;

    const { message, timezone = "UTC" } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: "message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // Load conversation history
    const history = await loadConversation(supabase, user.id, today);
    history.push(new HumanMessage(message));

    // Save user message
    await saveMessage(supabase, user.id, today, "user", message);

    // Create agent
    const agent = createSchedulingAgent(supabase, user.id, timezone);

    // Stream response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = agent.streamEvents(
            { messages: history },
            { version: "v2", recursionLimit: AGENT_RECURSION_LIMIT },
          );

          for await (const event of stream) {
            if (event.event === "on_tool_end") {
              const toolName = event.name ?? "unknown";
              logger.info("Tool completed", { tool: toolName, userId: user.id });
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "tool", name: toolName })}\n\n`,
                ),
              );
            }

            if (event.event === "on_chat_model_stream") {
              const chunk = event.data?.chunk;
              if (!chunk) continue;

              const content = chunk.content;
              if (typeof content === "string" && content.length > 0) {
                fullResponse += content;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "text", content })}\n\n`,
                  ),
                );
              } else if (Array.isArray(content)) {
                for (const block of content) {
                  if (block.type === "text" && block.text) {
                    fullResponse += block.text;
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "text", content: block.text })}\n\n`,
                      ),
                    );
                  }
                }
              }
            }
          }

          // Save assistant response
          await saveMessage(supabase, user.id, today, "assistant", fullResponse);

          logger.info("Agent response complete", {
            userId: user.id,
            responseLength: fullResponse.length,
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`),
          );
          controller.close();
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Stream error";
          logger.error("Agent stream error", {
            error: errorMessage,
            userId: user.id,
          });
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", content: errorMessage })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    logger.error("Agent chat error", { error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
