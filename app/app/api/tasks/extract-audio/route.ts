import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transcribeAudio } from "@/lib/openai/transcribeAudio";
import { extractTasksFromText } from "@/lib/openai/extractTasksFromText";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:extract-audio");

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof File)) {
      return NextResponse.json(
        { error: "No audio provided" },
        { status: 400 },
      );
    }

    const baseType = audio.type.split(";")[0].trim();
    if (!ALLOWED_TYPES.includes(baseType)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: WebM, MP4, MP3, WAV, OGG, M4A" },
        { status: 400 },
      );
    }

    if (audio.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 25 MB" },
        { status: 400 },
      );
    }

    logger.info("Extracting tasks from audio", {
      userId: user.id,
      fileType: audio.type,
      fileSize: audio.size,
    });

    const transcription = await transcribeAudio(audio);

    if (!transcription) {
      return NextResponse.json({ tasks: [], transcription: "" });
    }

    const tasks = await extractTasksFromText(transcription);

    return NextResponse.json({ tasks, transcription });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    logger.error("Audio extraction failed", { error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
