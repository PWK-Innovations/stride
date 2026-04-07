import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getAuthenticatedUser } from "@/lib/supabase/api-auth";
import { transcribeAudio } from "@/lib/openai/transcribeAudio";
import { createSchedulingAgent, AGENT_RECURSION_LIMIT } from "@/lib/agent/agent";
import { loadConversation, saveMessage } from "@/lib/agent/memory";
import { HumanMessage } from "@langchain/core/messages";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:agent:chat-audio");

const ALLOWED_TYPES = [
  "audio/webm",
  "audio/mp4",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/x-m4a",
];
const MAX_SIZE = 25 * 1024 * 1024; // 25 MB (Whisper API limit)

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

    const formData = await req.formData();
    const audio = formData.get("audio");
    const timezone = (formData.get("timezone") as string) || "UTC";

    if (!audio || !(audio instanceof File)) {
      return new Response(JSON.stringify({ error: "No audio provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseType = audio.type.split(";")[0].trim();
    if (!ALLOWED_TYPES.includes(baseType)) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Allowed: WebM, MP4, MP3, WAV, OGG, M4A" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (audio.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 25 MB" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    logger.info("Processing audio chat", {
      userId: user.id,
      fileType: audio.type,
      fileSize: audio.size,
    });

    // Transcribe audio
    const transcription = await transcribeAudio(audio);

    if (!transcription || !transcription.trim()) {
      return new Response(
        JSON.stringify({ error: "Could not understand the audio. Please try again." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    logger.info("Audio transcribed", {
      userId: user.id,
      transcriptionLength: transcription.length,
    });

    const today = new Date().toISOString().split("T")[0];

    // Load minimal history for voice — voice commands are mostly self-contained.
    // Too much history causes the agent to use stale schedule data from old messages.
    const history = await loadConversation(supabase, user.id, today, 4);
    history.push(new HumanMessage(transcription));

    // Save user message
    await saveMessage(supabase, user.id, today, "user", transcription);

    // Create agent
    const agent = createSchedulingAgent(supabase, user.id, timezone);

    // Stream response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const readable = new ReadableStream({
      async start(controller) {
        try {
          // Send transcription event first
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "transcription", content: transcription })}\n\n`,
            ),
          );

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

          logger.info("Agent audio response complete", {
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
          Sentry.captureException(error, {
            tags: { component: "agent", phase: "audio-stream" },
            extra: { userId: user.id },
          });
          logger.error("Agent audio stream error", {
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
    Sentry.captureException(error, {
      tags: { component: "agent", phase: "audio-request" },
    });
    logger.error("Agent audio chat error", { error: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
