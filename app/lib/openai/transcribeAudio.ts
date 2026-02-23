import { openai } from "./client";
import { createLogger } from "@/lib/logger";

const logger = createLogger("openai:whisper");

export async function transcribeAudio(file: File): Promise<string> {
  logger.info("Transcribing audio", {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });

  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file,
  });

  const text = response.text.trim();
  logger.info(`Transcription complete: ${text.length} characters`);
  return text;
}
