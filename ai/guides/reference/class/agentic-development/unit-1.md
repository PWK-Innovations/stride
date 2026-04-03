# Unit 1: Generative AI Fundamentals

**Generative AI Fundamentals & How Agents Work**
Agentic Development Course
"Understanding the technology before using it"

---

## Agenda

1. What is Generative AI? (GPT, tokens, training)
2. Fun Exercises (Creative generation)
3. From Autocomplete to Agents (ReAct framework)
4. Lab (Hands-on experimentation)

---

## Part 1: What is Generative AI?

### Understanding AI Training

Two short videos explaining how AI learns:

- **Part 1: ML Basics (genetic breeding)** — https://youtube.com/watch?v=R9OHn5ZF4Uo
- **Part 2: Recursive Neural Networks** — https://youtube.com/watch?v=wvWpdrfoEv0

### A Brief History of Generative AI

| Year | Milestone |
|------|-----------|
| 1957 | Perceptron — First trainable neural network |
| 1961 | ELIZA — First chatbot (early generative AI) |
| 1979 | Neocognitron — First deep learning neural network |
| 1989 | Backpropagation — Deep learning becomes practical |
| 1997 | LSTM — Long short-term memory for speech recognition |

Source: dataversity.net/articles/a-brief-history-of-generative-ai

### The Modern Era of Generative AI

| Year | Breakthrough |
|------|-------------|
| 2014 | GANs — Generate realistic images, video, audio |
| 2017 | Transformers — "Attention Is All You Need" paper |
| 2022 | ChatGPT — LLMs go mainstream |
| 2023+ | Agentic AI — Systems that plan and take actions |

"Most of what we call 'AI' today happened in the last 10 years"

### GPT = ?

- **G** — Generative (Creates new content)
- **P** — Pre-trained (Learned from massive data before you use it)
- **T** — Transformer (The architecture that made this possible, 2017)

### The Core Insight: "World's Best Autocomplete"

- At its heart: predicting "what word comes next"
- Trained on billions of text examples
- Does prediction SO well it _appears_ intelligent
- Not "thinking" — pattern matching at unprecedented scale

### How Generative AI Works (Interactive)

Interactive demonstration: https://ig.ft.com/generative-ai/

### How Training Works

1. Feed billions of text examples (books, websites, code, conversations)
2. Learn to predict next token (given previous tokens)
3. Scale up (more data + more parameters = emergent capabilities)
4. Fine-tune for conversation (RLHF — Reinforcement Learning from Human Feedback)

### Key Concept: Tokens

Tokens are not the same as words. Tokens are subword pieces (~4 characters average).

| Text | Tokens |
|------|--------|
| "hello" | 1 token |
| "uncomfortable" | ["un", "comfort", "able"] = 3 tokens |

Code often has more tokens per line than English.

**Why it matters:** You pay per token, and limits are measured in tokens.

### Key Concept: Context Window

The context window is the model's "working memory." It includes:

- System prompt
- Conversation history
- Your current message
- Documents/code

Model capacities:

- Claude: ~200K tokens
- GPT-4: ~128K tokens
- Gemini 1.5: ~1M tokens

### Key Concept: Temperature

| Level | Range | Usage |
|-------|-------|-------|
| Deterministic | 0 | Lower for code/facts |
| Balanced | 0.5 | |
| Creative | 1.0 | Higher for creative writing |

### Key Concept: Hallucinations

**Why AI makes things up:**

- Model generates _plausible_ next tokens
- Plausible does not equal true
- Confident prediction does not equal factual information

**Always verify important outputs.**

### The Jagged Frontier of AI

Key Insights:

- **Superhuman at unexpected tasks** — Medical diagnosis, complex math, sophisticated code
- **Struggles with "simple" tasks** — Visual puzzles, counting, physical reasoning
- **Jaggedness doesn't match intuition** — Passes bar exam, fails at basic visual tasks
- **Creates collaboration opportunities** — Humans fill AI gaps, AI amplifies human strengths

Source: Ethan Mollick, "The Shape of AI"

### The Equation of Agentic Work

Key Factors:

1. **Human Baseline Time** — How long would this take YOU to do?
2. **Probability of Success** — How likely is AI to succeed? Remember the jagged frontier.
3. **AI Process Time** — Agents run in background while you work on other things.

**Management skills** become your superpower with AI agents.

Source: Ethan Mollick, "Management as AI Superpower"

---

## Part 2: Fun Generative Exercises

"These aren't just games — they reveal how the model works"

### Exercise: The Dinosaur Rewrite

```
Take this news article: [paste any recent news]

Rewrite it so that a dinosaur is somehow
centrally involved in the incident.

Keep the same journalistic tone and structure.
```

### Exercise: The Tone Dial

**Original email:**
"The project deadline was missed again. This is unacceptable. We need to discuss this."

Rewrite in five variations across a spectrum:

1. Furious
2. Frustrated
3. Neutral
4. Understanding
5. Gracious

### Exercise: Format Juggling

**Input:**
"John Smith is a 34-year-old software engineer from Seattle. He earns $150,000 at TechCorp..."

Transform into these output formats:

- JSON
- YAML
- Bullet points
- SQL INSERT
- Haiku
- Movie trailer

### Exercise: The Accordion

**Start with:** "The server crashed."

- Expand: Incident report (1 paragraph)
- Expand: Post-mortem (3 paragraphs)
- Compress: Tweet (280 chars)
- Compress: Single emoji

---

## Part 3: From Autocomplete to Agents

"The conceptual leap that changes everything"

### The Limitation

**LLMs can only produce text.**

- Cannot browse the web
- Cannot run code
- Cannot read files
- Cannot call APIs

"All talk, no action"

### The Solution: Tools

Give the LLM ability to **request actions**.

Flow:

1. User: "What's the weather in Seattle?"
2. LLM thinks: "I need weather data..."
3. LLM outputs: `{"tool": "get_weather", "location": "Seattle"}`
4. System executes: `{"temp": 52, "condition": "rainy"}`
5. LLM responds: "It's 52 degrees F and rainy in Seattle."

### The ReAct Framework

**Reasoning + Acting**

The loop: THINK (Reason about task) --> ACT (Tool call) --> OBSERVE (See result) --> REPEAT

### Why ReAct Works

1. **Explicit reasoning** — Prevents rushing to wrong actions
2. **Observation step** — Allows course correction
3. **Loop continues** — Until task is complete
4. **More reliable** — Than single-shot generation

### Activity: Be the LLM

**Roles:**

- **1 student = The LLM** — Reads prompt, generates response
- **1 student = Tool Executor** — Runs tools, returns results

**LLM outputs either:**
- `TOOL: [name], INPUT: [value]`
- `ANSWER: [response]`

### Walkthrough Round 1: Prompt to LLM

```
SYSTEM:
You are a helpful assistant. Follow this loop:
1. THINK out loud about what you need to do
2. ACT by calling a tool if needed
3. OBSERVE the result
4. REPEAT until you can answer

Tools: calculator(expression), web_search(query)

USER:
What is the square root of 65536?
```

### Walkthrough Round 1: LLM Response

```
[LLM reasoning]

TOOL: calculator
INPUT: sqrt(65536)
```

_Tool Executor runs the calculation._

**Tool Result:** `256`

### Walkthrough Round 2: Prompt to LLM

The full conversation context is fed back to the LLM, including the original system prompt, the user question, the LLM's first reasoning and tool call, and the tool result of 256.

```
SYSTEM:
You are a helpful assistant. Follow this loop:
1. THINK out loud about what you need to do
2. ACT by calling a tool if needed
3. OBSERVE the result
4. REPEAT until you can answer

Tools: calculator(expression), web_search(query)

USER:
What is the square root of 65536?

A:
[LLM's reasoning from Round 1]
TOOL: calculator
INPUT: sqrt(65536)

TOOL RESULT:
256
```

### Walkthrough Round 2: LLM Response

```
[LLM reasoning]

ANSWER: The square root of 65536 is 256.
```

### What Makes an "Agent"

The formula:

- LLM ("the brain")
- \+ Tools ("the hands")
- \+ Reasoning Loop ("the process")
- = Autonomous Agent

### Common Agent Tools

| Tool Type | Examples |
|-----------|----------|
| File system | Read, write, search files |
| Web | Fetch pages, search |
| Code execution | Run scripts, tests |
| APIs | External services |
| Browser | Playwright for web interaction |

### Why Agents Matter for Development

| Before | After |
|--------|-------|
| AI _suggests_ code | AI **reads** your code |
| You run tests | AI **runs** your tests |
| You research libraries | AI **researches** for you |
| You fix issues | AI **fixes** and verifies |

"Transforms AI from 'assistant' to 'autonomous developer'"

---

## Part 4: Lab Time

"Put these concepts into practice"

### Lab Exercises

1. **Token Exploration** (5 min)
   - Use a tokenizer to explore how text splits
   - https://platform.openai.com/tokenizer

2. **Creative Generation** (10 min)
   - Rewrite your project description in 3 styles
   - Or: Technical concept as children's story / rap / news

3. **Agent Thinking** (5-10 min)
   - Write out ReAct steps for researching a library

---

## Key Takeaways

1. **LLMs = sophisticated autocomplete** — Predicting tokens, not "thinking"
2. **Tokens are not words** — Understanding tokens helps efficiency
3. **Agents = LLM + tools + loop** — What makes AI useful for dev
4. **ReAct: Think --> Act --> Observe --> Repeat** — The foundational agent pattern
5. **Always verify** — Hallucinations happen

---

## Homework

- Read: **"Management as AI Superpower"** — oneusefulthing.org
- Think: What would you want an AI agent to **research for your project?**

**Next time:** Ideation & Planning with AI — brainstorming, market research, PRDs

---

## Resources

- **OpenAI Tokenizer** — https://platform.openai.com/tokenizer
- **Claude Documentation** — https://docs.anthropic.com
- **ReAct Paper** — https://arxiv.org/abs/2210.03629
- **Management as AI Superpower** — https://oneusefulthing.org/p/management-as-ai-superpower
- **How Generative AI Works (FT Interactive)** — https://ig.ft.com/generative-ai/
- **History of Generative AI** — https://dataversity.net/articles/a-brief-history-of-generative-ai
