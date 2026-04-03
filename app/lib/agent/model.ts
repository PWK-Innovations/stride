import { ChatOpenAI } from "@langchain/openai";

export const schedulingModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});
