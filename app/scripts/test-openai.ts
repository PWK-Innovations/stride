import { config } from "dotenv";
import OpenAI from "openai";
import { createLogger } from "../lib/logger";

config({ path: ".env.local" });

const logger = createLogger("test:openai");

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    logger.error("Missing OPENAI_API_KEY in .env.local");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: 'Say "test successful"' }],
    max_tokens: 10,
  });

  const message = response.choices[0]?.message?.content || "";

  if (!message) {
    logger.error("Empty response from OpenAI");
    process.exit(1);
  }

  logger.info("OpenAI connection successful", { response: message });
}

main();
