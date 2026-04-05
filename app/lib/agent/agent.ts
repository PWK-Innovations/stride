import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";
import { schedulingModel } from "./model";
import { getSchedulingSystemPrompt } from "./system-prompt";
import { createGetTaskListTool } from "./tools/get-task-list";
import { createGetCalendarEventsTool } from "./tools/get-calendar-events";
import { createScheduledBlocksTool } from "./tools/create-scheduled-blocks";
import { createCheckConflictsTool } from "./tools/check-conflicts";
import { createUpdateTaskTool } from "./tools/update-task";
import { createCreateTaskTool } from "./tools/create-task";
import { createLogger } from "@/lib/logger";
import type { SupabaseClient } from "@supabase/supabase-js";

const logger = createLogger("agent");

/** Max number of agent reasoning iterations before stopping. */
export const AGENT_RECURSION_LIMIT = 10;

export function createSchedulingAgent(
  supabase: SupabaseClient,
  userId: string,
  timezone: string,
) {
  const tools = [
    createGetTaskListTool(supabase, userId),
    createGetCalendarEventsTool(supabase, userId, timezone),
    createScheduledBlocksTool(supabase, userId, timezone),
    createCheckConflictsTool(supabase, userId, timezone),
    createUpdateTaskTool(supabase, userId),
    createCreateTaskTool(supabase, userId),
  ];

  const agent = createReactAgent({
    llm: schedulingModel,
    tools,
    messageModifier: new SystemMessage(getSchedulingSystemPrompt(timezone)),
  });

  logger.info("Scheduling agent created", { userId, toolCount: tools.length });
  return agent;
}
