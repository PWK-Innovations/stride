# Unit 7: Building AI Agents

**Subtitle:** From using agents to programming them

## What We'll Cover Today

1. Why Build Agents? From user to creator
2. The ReAct Pattern in Code - Implementing Reasoning + Acting
3. LangChain Fundamentals - Tools, agents, and the execution loop
4. Building Your First Tools - Calculator and web search
5. Important Concepts & Gotchas - Error handling and common pitfalls
6. Homework - Start building your agent

## Learning Objectives

After this unit, you should be able to:

1. Build an agent from scratch using the ReAct pattern (Think -> Act -> Observe)
2. Create custom tools with proper names, descriptions, and Zod schemas
3. Wire tools into an agent using LangChain's `createAgent`
4. Build a two-tool agent with calculator and web search

> "Today you go from using agents to building them. This is where it gets fun."

---

## Part 1: Why Build Agents?

### From User to Creator

Previous units covered learning to use AI agents:
- Claude Code and Cursor as pre-built agents
- MCP tools as pre-built extensions
- Sub-agents as pre-built orchestration

Today: Learn to build agents from scratch.

### Single-Shot vs Agent-Powered

**Single-Shot (most apps today):**
- One prompt -> structured JSON back -> display result
- Examples: Generate a schedule, extract data from an image, produce an analysis

**Agent-Powered (what you're building):**
- Decides which tool to use -> calls it -> reasons about result -> decides next step
- Example scheduling app: agent calls `check_calendar` -> `find_open_slot` -> `create_block`
- Example data extraction: agent retrieves similar records to resolve ambiguous inputs

**Key difference:** Single-shot = you do the thinking. Agents = the AI does the thinking.

> "Not every feature needs an agent. Ask: 'What task will this handle better than a single prompt?' If you can't answer clearly, a single LLM call is the right choice."

### Why Does This Matter?

**As an Agent User:**
- Use tools someone else made
- Limited to existing workflows
- Depend on platform features
- Consume AI products

**As an Agent Builder:**
- Create custom tools for any API or system
- Design any reasoning workflow
- Build exactly what you need
- Create AI products

The shift is from operating the forklift to building forklifts.

### What You Already Know

From Dev Unit 1:
- LLMs are "world's best autocomplete"
- Agents = LLM + Tools + Reasoning Loop
- ReAct: Think -> Act -> Observe -> Repeat

Today we turn that theory into running code.

---

## Part 2: The ReAct Pattern in Code

### Quick Refresher

In Dev Unit 1, you learned:
- LLMs are "world's best autocomplete" -- predicting likely next tokens
- **Agents** = LLM + Tools + Reasoning Loop
- **ReAct**: Think -> Act -> Observe -> Repeat

Today we turn that theory into running code. Same concepts, real implementation.

### How Tool Calling Works

**Step 1:** You send a message + tool definitions to the LLM

```javascript
// You tell the model: "Here are tools you can use"
const tools = [
  {
    name: "calculator",
    description: "Evaluate math expressions",
    schema: { expression: "string" }
  },
  {
    name: "web_search",
    description: "Search the web",
    schema: { query: "string" }
  }
];
```

**Step 2:** Model decides -- respond with text OR request a tool call

```javascript
// User asks: "What is 1523 * 456?"

// Model returns (NOT text — a structured tool call):
{
  "tool_calls": [{
    "name": "calculator",
    "arguments": { "expression": "1523 * 456" }
  }]
}
```

**Step 3:** Your code executes the tool, returns the result

**Step 4:** Model sees the result, decides if it needs more tools or can answer

### The Agent Loop (Pseudocode)

```
function runAgent(userMessage, tools):
    messages = [userMessage]

    while true:
        response = llm.call(messages, tools)

        if response.hasToolCalls:
            for each toolCall in response.toolCalls:
                result = execute(toolCall)
                messages.append(result)
        else:
            return response.text   // Final answer!
```

> "This is the core of every agent framework. LangChain just makes it robust, with error handling, streaming, and state management."

---

## Part 3: LangChain Fundamentals

### What is LangChain?

- **The dominant agent framework** -- 90M+ monthly downloads
- Available in **Python** and **JavaScript/TypeScript**
- Provides abstractions for models, tools, agents, memory, and more
- We'll use **LangChain.js** (TypeScript)

**Key packages:**

```
langchain               — Main package (createAgent)
@langchain/anthropic    — Claude model integration
@langchain/openai       — OpenAI model integration (alternative)
@langchain/langgraph    — Agent graph execution engine
@langchain/core         — Tool definitions, prompts
@langchain/classic      — Vector stores (in-memory, etc.)
```

> "Older tutorials may reference `createReactAgent` from `@langchain/langgraph/prebuilt`. This still works but the modern API uses `createAgent` from `langchain`."

### Installing LangChain

```bash
# Core packages
npm install langchain @langchain/anthropic @langchain/openai @langchain/langgraph @langchain/core

# For homework tools
npm install @langchain/tavily          # Web search
npm install @langchain/classic         # In-memory vector store

# Schema validation
npm install zod

# Environment (use ONE of these model providers)
export ANTHROPIC_API_KEY="your-key-here"  # If using Claude
export OPENAI_API_KEY="your-key-here"     # If using OpenAI
export TAVILY_API_KEY="your-key-here"
```

### Your First Tool

```javascript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const greetingTool = tool(
  ({ name }) => {
    return `Hello, ${name}! Welcome to BYU.`;
  },
  {
    name: "greeting",
    description: "Greet a person by name",
    schema: z.object({
      name: z.string().describe("The person's name"),
    }),
  }
);
```

Three parts: Function, name + description, schema (Zod).

### Anatomy of a Tool

A tool consists of three parts:
1. **Function** -- the logic that runs when the tool is called
2. **Description** -- tells the LLM when this tool should be used
3. **Schema** -- defines the input parameters using Zod

> "The description is the most important part. It tells the LLM when this tool should be used."

### Good vs Bad Tool Descriptions

**Example 1:**

```
Bad:  "Searches the web"

Good: "Search the web for current information that is not
       available in your training data, such as recent events,
       current prices, or real-time data"
```

**Example 2:**

```
Bad:  "Does math"

Good: "Evaluate mathematical expressions. Use this for any
       arithmetic, percentages, or calculations where
       precision matters"
```

> "Think of it as instructions for a coworker: When should they use this tool vs. figure it out themselves?"

**Scheduling app example:**

```
Bad:  "Handles scheduling"

Good: "Find available time slots in the user's calendar between
       their existing events. Use when the user needs to schedule
       a new task and you need to know what times are open."
```

### Creating a ReAct Agent

```javascript
import { ChatAnthropic } from "@langchain/anthropic";
// Or: import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";

// 1. Choose your model
const model = new ChatAnthropic({
  model: "claude-sonnet-4-5",
  temperature: 0,
});
// Or: const model = new ChatOpenAI({ model: "gpt-4o", temperature: 0 });

// 2. Define your tools (we'll build real ones next)
const tools = [greetingTool, calculatorTool, searchTool];

// 3. Create the agent
const agent = createAgent({
  model: model,
  tools: tools,
});
```

> "That's it. LangChain handles the ReAct loop, tool routing, and state management."

### Running the Agent

```javascript
// Simple invocation
const result = await agent.invoke({
  messages: [{ role: "user", content: "What is 42 * 58?" }],
});

console.log(result.messages[result.messages.length - 1].content);
// → "42 × 58 = 2,436"
```

**What happened behind the scenes:**
1. Model saw the question + available tools
2. Model chose `calculator` tool with `"42 * 58"`
3. Agent executed the tool -> got `2436`
4. Model saw the result -> generated a human-friendly answer

### Streaming Agent Output

```javascript
// Stream for real-time UI updates
const stream = await agent.stream({
  messages: [{ role: "user", content: "What is 42 * 58?" }],
});

for await (const chunk of stream) {
  // See each step as it happens
  console.log("Step:", JSON.stringify(chunk, null, 2));
}
```

> "In a chatbot UI, users see the agent 'thinking' in real time instead of waiting for the final answer."

### The LangGraph State Machine

Under the hood, `createAgent` builds a graph: `__start__` -> LLM -> Tools/End.

The **conditional edge** checks: did the model return tool calls? If yes -> execute tools -> loop back. If no -> done.

---

## Part 4: Building Your First Tools

### Tool 1: Calculator

```javascript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const calculator = tool(
  ({ expression }) => {
    try {
      // Safely evaluate mathematical expressions
      const result = Function(
        '"use strict"; return (' + expression + ")"
      )();

      if (!isFinite(result)) {
        return "Error: Result is infinity or NaN";
      }
      return String(result);
    } catch (error) {
      return `Error: ${error.message}`;
    }
  },
  {
    name: "calculator",
    description:
      "Evaluate mathematical expressions. Use this for any " +
      "arithmetic, percentages, or calculations where precision " +
      "matters. Input should be a valid JS math expression " +
      "like '2 + 2' or 'Math.sqrt(16)' or '0.15 * 200'.",
    schema: z.object({
      expression: z.string().describe(
        "A JavaScript math expression to evaluate"
      ),
    }),
  }
);
```

### Calculator: Key Design Decisions

**Why `Function()` instead of `eval()`?**
- Runs in strict mode -- but still NOT safe for untrusted input
- No access to enclosing scope variables
- This is a toy for learning. In production, use a proper math parser (e.g., `mathjs`) -- `Function()` can still execute arbitrary JavaScript

**Why return strings, not numbers?**
- Tools always return strings to the LLM
- The LLM formats the result for the user

**Why catch errors?**
- Return error messages, don't throw
- The LLM can interpret the error and try again or explain the issue

### Tool 2: Web Search (Tavily)

```javascript
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const webSearch = tool(
  async ({ query }) => {
    const tavily = new TavilySearch({
      maxResults: 3,
    });
    const results = await tavily.invoke({ query });

    // Format results for the LLM
    if (Array.isArray(results)) {
      return results
        .map((r) => `**${r.title}**\n${r.content}\nURL: ${r.url}`)
        .join("\n\n---\n\n");
    }
    return String(results);
  },
  {
    name: "web_search",
    description:
      "Search the web for current information. Use when you " +
      "need up-to-date data not in your training data: news, " +
      "current events, prices, recent releases, etc.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);
```

### Why Tavily?

| Feature | Tavily | Raw Google API |
|---------|--------|----------------|
| **Designed for** | LLM agents | Humans |
| **Returns** | Structured content + metadata | Links + snippets |
| **Relevance** | Optimized for AI consumption | Generic ranking |
| **Setup** | One API key | Complex OAuth |
| **Free tier** | 1,000 searches/month | Limited |

> "Tavily is purpose-built for agent tool use -- the results are pre-structured for LLMs to consume effectively."

---

## Part 5: Important Concepts & Gotchas

### Error Handling in Tools

**Bad -- throws, crashes the agent loop:**

```javascript
const badTool = tool(
  ({ expression }) => {
    return eval(expression);  // Could throw!
  },
  { ... }
);
```

**Good -- returns error message, agent can adapt:**

```javascript
const goodTool = tool(
  ({ expression }) => {
    try {
      const result = Function(
        '"use strict"; return (' + expression + ')'
      )();
      return String(result);
    } catch (error) {
      return `Error: ${error.message}.
Try a simpler expression.`;
    }
  },
  { ... }
);
```

> "The LLM can read the error message and try a different approach."

### Common Pitfalls

| Pitfall | Symptom | Fix |
|---------|---------|-----|
| Vague tool descriptions | Agent picks wrong tool | Be specific about WHEN to use each tool |
| No error handling | Agent crashes on bad input | Always try/catch in tools |
| Too many tools | Agent confused, slow | Start with 3-5 tools max |
| No iteration limit | Infinite loops, high cost | Set recursion/iteration limits |
| Forgetting async | Tool hangs or fails | Web/RAG tools must be `async` |

---

## Part 6: Your Individual Agent Project

### What You're Building

A **mini version of your term project** -- done individually. Practice the full agentic development workflow on your own.

This is a **two-part homework spanning Units 7 and 8**.

**Components:**
1. **Calculator tool** -- evaluates mathematical expressions
2. **Web search tool** -- searches the web using Tavily (or similar)
3. **RAG tool** -- in-memory vector search over a documentation set (Unit 8)
4. **Web UI** -- a chat interface for interacting with your agent
5. **Conversation memory** -- multi-turn context (Unit 8)
6. **Streaming responses** -- recommended, makes the UI dramatically better

The web UI is the expectation, not a terminal app. With development tools, scaffolding an Express server with a chat page should be straightforward. Terminal fallback is acceptable but not the target.

### API Keys & Costs

| Service | Free Tier | Sign Up |
|---------|-----------|---------|
| **Anthropic** | $5 credit for new accounts | console.anthropic.com |
| **OpenAI** (alternative) | $5 credit for new accounts | platform.openai.com |
| **Tavily** | 1,000 searches/month | tavily.com |

**Estimated homework cost:** $2-5 total (use `claude-haiku-3-5` or `gpt-4o-mini` to minimize costs)

### How You Build This

> "This is a software development project. Build it the way you've been taught."

Your repo should demonstrate:
- Same infrastructure and process standards as your term project
- Repos will be reviewed -- not just whether the chatbot works, but how you built it

**Key packages:** `langchain`, `@langchain/anthropic` (or `@langchain/openai`), `@langchain/langgraph`, `@langchain/core`, `@langchain/tavily`, `zod`

**For Unit 8's RAG portion:** `@langchain/classic` and an embeddings provider

No starter template on purpose. Students should use their development tools to scaffold this -- that's the point.

### What We'll Look For in Your Repo

Same expectations as your term project -- smaller scope, individual accountability.

| Rubric Area | What This Means for Your Agent Project |
|-------------|----------------------------------------|
| **PRD & Document-Driven Dev** | Brief PRD (what it does, tools, problem it solves). Roadmap. Development driven by documents, not ad-hoc prompting. |
| **AI Dev Infrastructure** | `aiDocs/` with `context.md`, `.gitignore` configured, no secrets committed. AI tools can orient from your context file. |
| **Phase-by-Phase Implementation** | Roadmap with phases checked off. Git history showing incremental progress -- not one giant commit. Multi-session workflow. |
| **Structured Logging & Debugging** | Structured logging (not just `console.log`). `scripts/` folder with `test.sh`. Proper exit codes. Test-log-fix loops. |

### Phase 1 Goals (This Unit)

- Set up your project with proper infrastructure (repo structure, `aiDocs/`, PRD, roadmap)
- Build and test your first two tools (calculator + web search)
- Create the agent and verify it routes questions to the right tool
- Begin your web UI
- Push your progress with meaningful, incremental commits

---

## Before Next Time

1. **Get your project set up** with proper infrastructure
2. **Get your first two tools working** (calculator + web search)
3. **Push your progress** with incremental commits
4. **Come ready for Unit 8** -- we'll cover RAG, conversation memory, and finalizing your deliverables

## Key Takeaways

1. **Agents = LLM + Tools + Loop** -- Now you can build the loop yourself
2. **Tools are just functions with metadata** -- Name, description, and schema
3. **Tool descriptions drive behavior** -- The LLM reads them to decide what to call
4. **LangChain is the ecosystem leader** -- `createAgent` handles the ReAct loop
5. **Error handling is critical** -- Tools should never throw; return error messages instead
6. **Build it the right way** -- This project uses the same development process as your term project

### Next: RAG, Multi-Tool Agents & Your Assignment
