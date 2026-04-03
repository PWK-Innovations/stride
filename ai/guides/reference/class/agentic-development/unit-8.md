# Unit 8: RAG & Multi-Tool Agents

## What We'll Cover Today

1. Quick Recap - What we built last time
2. RAG & Embeddings - Give your agent a knowledge base
3. Multi-Tool Agents - Chaining tools together
4. Conversation Memory - Multi-turn context
5. Beyond LangChain - Other frameworks
6. Production Considerations - Costs, debugging, security
7. Your Agent Project - Adding RAG and finishing up

## Learning Objectives

- Implement RAG -- embed documents, vector search, semantic retrieval
- Build a multi-tool chatbot that picks the right tool for each question
- Add conversation memory to maintain context across turns
- Evaluate when to use an agent vs. a single LLM call

> "Today you complete the picture: agents with knowledge, multi-tool reasoning, and memory."

## Unit 7 Recap

- Define tools with `tool()` -- function + name/description + Zod schema
- Create a ReAct agent with `createReactAgent` from LangChain
- Build a calculator tool and a web search tool
- Handle errors in tools (return messages, never throw)

## Part 1: RAG & Embeddings

### What is RAG?

RAG = Retrieval-Augmented Generation

"Give the agent access to YOUR documents -- company docs, course notes, API references, anything."

### Embeddings Concept

Embeddings convert text into vectors capturing meaning. Similar text clusters together in vector space.

```
"king"    → [0.21, -0.45, 0.89, 0.12, ...]
"queen"   → [0.19, -0.42, 0.91, 0.15, ...]   ← similar!
"banana"  → [0.82, 0.33, -0.11, 0.67, ...]   ← different!
```

Key Insight: "Similar meanings -> similar vectors -> we can search by meaning, not just keywords."

### Embeddings Implementation

```javascript
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",  // Fast and cheap
});

const vector = await embeddings.embedQuery("What is photosynthesis?");
// → [0.021, -0.045, 0.089, ...] (1536 numbers)
```

Important Note: "Anthropic doesn't offer an embeddings model, so you'll need an OpenAI API key for this part regardless of which chat model you use. Alternatively, look into Voyage AI (recommended by Anthropic) or a free local option."

### Building the Vector Store

```javascript
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

// Create in-memory vector store
const vectorStore = new MemoryVectorStore(embeddings);

// Add your documents
await vectorStore.addDocuments([
  {
    pageContent: "Our API rate limit is 100 requests per minute...",
    metadata: { source: "api-docs.md", topic: "rate-limits" },
  },
  {
    pageContent: "Authentication uses JWT tokens with 24h expiry...",
    metadata: { source: "auth-docs.md", topic: "authentication" },
  },
  // ... add as many documents as you want
]);
```

### Loading Documents

Option 1: Create a `documents.ts` file with your content as an array of objects.

Option 2: Use LangChain's `DirectoryLoader`:

```javascript
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

const loader = new DirectoryLoader("./docs", {
  ".txt": (path) => new TextLoader(path),
});
const docs = await loader.load();
await vectorStore.addDocuments(docs);
```

### The RAG Tool

```javascript
const knowledgeBase = tool(
  async ({ query }) => {
    // Semantic search — finds documents by MEANING
    const results = await vectorStore.similaritySearch(query, 3);

    if (results.length === 0) {
      return "No relevant documents found.";
    }

    return results
      .map((doc, i) =>
        `[${i + 1}] (Source: ${doc.metadata.source})\n${doc.pageContent}`
      )
      .join("\n\n");
  },
  {
    name: "knowledge_base",
    description:
      "Search the documentation knowledge base using semantic " +
      "search. Use this to find information from our docs " +
      "about APIs, authentication, configuration, etc.",
    schema: z.object({
      query: z.string().describe(
        "Natural language query about the documentation"
      ),
    }),
  }
);
```

### RAG Approach Comparison

| Approach | Best For | Trade-offs |
|----------|----------|------------|
| **In-memory** (today) | Prototypes, small datasets (<10K docs) | Fast, no setup; lost on restart |
| **Pinecone / Weaviate** | Production, large datasets | Persistent, scalable; costs money |
| **ChromaDB** | Local development | Persistent, free; single machine |
| **PostgreSQL + pgvector** | If you already use Postgres | Integrated; requires Postgres |

"For homework: In-memory is perfect. Load your docs at startup, search them during conversation."

## Part 2: Multi-Tool Agents

### Architecture

The LLM reads tool descriptions and decides which tool(s) to call for each question.

### Multi-Tool Reasoning Example 1

**Question:** "How much does the starter plan cost per year?"

The agent chains two tools:
- RAG for the fact
- Calculator for the math

"You don't have to tell it to do this."

### Multi-Tool Reasoning Example 2

Campus event budget app:

```
Question: "How much would it cost to cater 3 club events this month?"

Step 1: knowledge_base("catering pricing options")
  → "Basic pizza package: $85/event. Sandwich platter: $120/event."

Step 2: calculator("85 * 3")
  → "255"

Final answer: "The basic pizza package for 3 events would be $255.
  The sandwich platter option would be $360 (3 × $120)."
```

"The agent chained RAG (pricing knowledge) + calculator (cost math) -- same multi-tool pattern."

## Part 3: Conversation Memory

### Adding Conversation Memory

```javascript
// Maintain message history across turns
let messageHistory = [];

async function chat(userMessage) {
  messageHistory.push({
    role: "user",
    content: userMessage,
  });

  const result = await agent.invoke({
    messages: messageHistory,
  });

  const assistantMessage =
    result.messages[result.messages.length - 1];

  messageHistory.push({
    role: "assistant",
    content: assistantMessage.content,
  });

  return assistantMessage.content;
}

// Multi-turn conversation
await chat("What does the starter plan cost?");
await chat("And what's that per year?");  // Remembers context!
```

### Conversation Memory Caveats

"This is a naive implementation -- the message array grows without limit. In production, you'd truncate or summarize history to stay within context window limits."

"This simplified version only stores the final response. For tool-using agents, you may want to preserve the full message history including tool calls for better context."

## Part 4: Beyond LangChain

### Other Agent Frameworks

| Framework | Language | Best For |
|-----------|----------|----------|
| **LangChain** (this course) | Python + JS/TS | Broadest ecosystem, most tutorials |
| **Mastra** | TypeScript only | TS-native DX, built-in production features |
| **CrewAI** | Python | Multi-agent teams with defined roles |
| **OpenAI Agents SDK** | Python | Simple agents, OpenAI-only (vendor locked) |

Key Insight: "They all implement the same ReAct loop under the hood. Learn one well, understand the patterns -- switching frameworks is straightforward."

"For this course: We use LangChain (broadest ecosystem). Explore others on your own."

## Part 5: Production Considerations

### Token Costs and Iteration Limits

"Every iteration = another LLM API call = more tokens = more cost"

| Scenario | Typical Iterations | Cost Impact |
|----------|-------------------|-------------|
| Simple calculation | 1-2 | Low |
| Web search + answer | 2-3 | Medium |
| Multi-tool chain | 3-5 | Higher |
| Agent stuck in loop | 10+ | Expensive! |

### Controlling Iterations

```javascript
const agent = createReactAgent({
  model: new ChatAnthropic({ model: "claude-haiku-3-5" }),
  tools: tools,
});

// Limit iterations when invoking
const result = await agent.invoke(
  { messages },
  { recursionLimit: 10 }  // Prevent infinite loops
);
```

### Security Considerations

From Dev Unit 4 -- still applies here:

- Never hardcode API keys -- use environment variables
- Validate tool inputs -- especially for calculator
- Sanitize user input -- prevent prompt injection through tools
- Audit tool outputs -- don't blindly trust web search results

### Unsafe vs. Safe Code

```javascript
// ❌ Dangerous — eval executes arbitrary code
const result = eval(userExpression);

// ❌ Function() is also unsafe for untrusted input (as we noted in Unit 7)

// ✅ Use a proper math library in production
import { evaluate } from "mathjs";
const result = evaluate(expression);  // Only does math, nothing else
```

### Troubleshooting Guide

| Error | Cause | Fix |
|-------|-------|-----|
| `API_KEY not set` | Missing env variable | `export ANTHROPIC_API_KEY="..."` or `export OPENAI_API_KEY="sk-..."` |
| `Tool not found` | Typo in tool name | Check tool `name` matches exactly |
| Agent returns text instead of calling tool | Bad tool description | Make description more specific about WHEN to use |
| `RateLimitError` | Too many API calls | Add delays, use `claude-haiku-3-5`, reduce `maxResults` |
| RAG returns no results | Documents not loaded | Verify `addDocuments()` was `await`ed |
| `TypeError: Cannot read properties` | Forgot `async`/`await` | Web and RAG tools MUST be `async` |

## Part 6: Your Agent Project

### Target by Deadline

"Here's what we're working toward over the next two weeks:"

- A working agent with calculator and web search tools
- Repo with `context.md`, PRD, and roadmap
- A web UI in progress (or at minimum a working terminal interface)
- Incremental git history showing your development process
- Logging that shows which tool was called, arguments passed, and results returned

"You have two weeks -- focus on getting the agent working first, then layer in the infrastructure."

### What to Add Now

**Add a RAG tool:**
- Choose a document set (project docs, course notes, a library's docs, a company FAQ)
- Create at least 5 documents with meaningful content
- Use OpenAI embeddings (or Voyage AI) + in-memory vector store
- Build a `knowledge_base` tool that returns relevant documents with source attribution

**Add conversation memory:**
- Maintain a message history array across turns
- Pass the full history to the agent on each invocation
- Verify multi-turn conversations work (follow-up questions that reference earlier context)

**Complete your web UI** -- your agent should be usable through a simple chat web page, not just a terminal.

**Continue updating your roadmap and committing incrementally** as you add these features.

### Deliverables

1. **A repo that demonstrates your development process** -- `context.md`, `.gitignore`, PRD, roadmap with phases checked off, logging that shows which tool was called, arguments passed, and results returned, incremental git history

2. **Working agent** -- three tools (calculator, web search, RAG with 5+ real docs) with conversation memory, accessible through a web UI

3. **README.md** -- explaining your agent, what tools it has, and how to run it

4. **Demo** -- a 2-minute screen capture showing your web UI with at least 2-3 of your agent's tools/features

### Stretch Goals (Optional)

1. **Add streaming** -- show responses in real time in your web UI; dramatically improves the user experience

2. **Add a 4th tool** -- file reader, database query, or API call to a service you use

3. **Persistent vector store** -- use ChromaDB or a hosted vector DB so documents survive restarts

4. **Connect to your project** -- Identify one feature in a project you've built that would benefit from an agent pattern (tool calling, RAG, or multi-step reasoning). Write a ~1 page proposal: what the agent would do, what tools it would need, and why it's better than a single LLM call.

## Key Takeaways

1. **RAG gives agents YOUR knowledge** -- Embeddings + vector search + any document set
2. **Multi-tool chaining is automatic** -- The agent reasons about which tools to call and in what order
3. **Agent frameworks share the same patterns** -- LangChain, Mastra, CrewAI all implement the same ReAct loop
4. **Not every feature needs an agent** -- Set a clear hypothesis before building one
5. **The full picture: Agents = LLM + Tools + Loop + Knowledge** -- You can now build all of it

## Resources

- [Anthropic Docs](https://docs.anthropic.com)
- [LangChain + Anthropic](https://docs.langchain.com/oss/javascript/integrations/chat/anthropic)
- [LangChain.js Docs](https://js.langchain.com)
- [LangChain Agents](https://docs.langchain.com/oss/javascript/langchain/agents)
- [LangGraph (ReAct)](https://langchain-ai.github.io/langgraphjs)
- [Tavily (Web Search)](https://tavily.com)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Mastra Docs](https://mastra.ai/docs)
- [Zod (Schemas)](https://zod.dev)
- [ReAct Paper](https://arxiv.org/abs/2210.03629)

## Final Message

"Now go build something amazing."

"You have two weeks -- start today."
