# OpenAI API Reference for Stride

Quick reference for using OpenAI API in Stride's scheduling engine.

**Last updated:** 2026-02-09  
**Official docs:** https://platform.openai.com/docs/api-reference

---

## Authentication

```bash
# Set API key in environment
export OPENAI_API_KEY="sk-..."

# Use in requests (Bearer token)
Authorization: Bearer $OPENAI_API_KEY
```

**Important:** Never expose API key in client-side code. Keep it server-side only (Next.js API routes).

---

## Responses API (Recommended)

The **Responses API** is OpenAI's recommended API for all new projects. Use this for Stride's scheduling engine.

### Basic Text Generation

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.2",
  input: "Your prompt here"
});

console.log(response.output_text);
```

### With Instructions (High-Priority Directives)

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  reasoning: { effort: "low" },
  instructions: "You are a scheduling assistant. Always prioritize tasks with deadlines.",
  input: "Schedule these tasks: [task list]"
});
```

### Message Roles

Use different roles for different levels of authority:

- **`developer`**: System instructions (highest priority)
- **`user`**: End-user input (lower priority than developer)
- **`assistant`**: Model-generated messages

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  input: [
    {
      role: "developer",
      content: "You are a scheduling assistant. Format output as JSON."
    },
    {
      role: "user",
      content: "Schedule my tasks for today."
    }
  ]
});
```

---

## Structured Outputs (JSON)

For Stride's scheduling engine, use **Structured Outputs** to ensure the AI returns valid JSON (e.g., scheduled blocks).

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  instructions: "Return a schedule as JSON.",
  input: "Schedule these tasks: Task A (30min), Task B (1hr)",
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "schedule",
      schema: {
        type: "object",
        properties: {
          scheduled_blocks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                task_id: { type: "string" },
                start_time: { type: "string" },
                end_time: { type: "string" },
                duration_minutes: { type: "number" }
              },
              required: ["task_id", "start_time", "end_time"]
            }
          },
          overflow: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["scheduled_blocks", "overflow"]
      }
    }
  }
});

const schedule = JSON.parse(response.output_text);
```

---

## Multi-Modal Input (Photos)

For Stride's photo-to-task feature, send images to the API:

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  input: [
    {
      role: "user",
      content: [
        { type: "text", text: "Extract tasks from this image." },
        {
          type: "image_url",
          image_url: {
            url: "https://example.com/whiteboard.jpg"
            // or: url: "data:image/jpeg;base64,..."
          }
        }
      ]
    }
  ]
});
```

---

## Reusable Prompts (Dashboard)

Create reusable prompts in the OpenAI dashboard and reference them by ID:

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  prompt: {
    id: "pmpt_abc123",
    version: "2",
    variables: {
      user_name: "Jane Doe",
      task_list: "Task A, Task B, Task C"
    }
  }
});
```

**Benefits:**
- Edit prompts without changing code
- Version control for prompts
- A/B test different prompt versions

---

## Models for Stride

- **`gpt-5.2`**: Latest, fastest, most capable (recommended for scheduling)
- **`gpt-5`**: Reasoning model (use for complex scheduling logic)
- **`gpt-4o`**: Older, still capable (fallback if needed)

**Pricing:** Check https://platform.openai.com/docs/pricing

---

## Rate Limits

Check response headers for rate limit info:
- `x-ratelimit-limit-requests`
- `x-ratelimit-remaining-requests`
- `x-ratelimit-reset-requests`

**Best practice:** Implement exponential backoff for retries.

---

## Error Handling

```javascript
try {
  const response = await client.responses.create({...});
} catch (error) {
  if (error.status === 429) {
    // Rate limit exceeded - retry with backoff
  } else if (error.status === 500) {
    // Server error - retry
  } else {
    // Other error - log and handle
    console.error(error);
  }
}
```

---

## Stride-Specific Use Cases

### 1. Schedule Construction

**Input:** Tasks (title, duration, priority) + calendar busy windows + working hours  
**Output:** Scheduled blocks (start/end times) + overflow list

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  instructions: "You are a scheduling assistant. Place tasks into free time slots. Return JSON.",
  input: `
    Tasks: ${JSON.stringify(tasks)}
    Busy windows: ${JSON.stringify(busyWindows)}
    Working hours: 9am-5pm
    
    Place tasks into free slots. Return JSON with scheduled_blocks and overflow.
  `,
  response_format: { type: "json_schema", json_schema: scheduleSchema }
});
```

### 2. Photo-to-Task (OCR + Parsing)

**Input:** Image of whiteboard/syllabus/handwritten notes  
**Output:** Extracted tasks with titles and deadlines

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  input: [
    {
      role: "user",
      content: [
        { type: "text", text: "Extract tasks from this image. Return JSON with task titles and deadlines." },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }
  ],
  response_format: { type: "json_schema", json_schema: tasksSchema }
});
```

### 3. Dynamic Re-scheduling

**Input:** Current schedule + "task finished" or "running late" event  
**Output:** Updated schedule with remaining tasks re-placed

```javascript
const response = await client.responses.create({
  model: "gpt-5",
  instructions: "Re-schedule remaining tasks. User finished Task A early. Move remaining tasks to fill the gap.",
  input: `
    Current schedule: ${JSON.stringify(currentSchedule)}
    Event: User finished Task A at 10:30am (30 minutes early)
    Remaining tasks: ${JSON.stringify(remainingTasks)}
    
    Re-schedule remaining tasks. Return updated schedule as JSON.
  `,
  response_format: { type: "json_schema", json_schema: scheduleSchema }
});
```

---

## Best Practices for Stride

1. **Use Structured Outputs** for all scheduling responses (ensures valid JSON).
2. **Pin model versions** in production (e.g., `gpt-5-2025-08-07`) for consistency.
3. **Keep API key server-side** (Next.js API routes only; never in client).
4. **Implement retries** with exponential backoff for rate limits and transient errors.
5. **Log request IDs** (`x-request-id` header) for debugging with OpenAI support.
6. **Use reusable prompts** in dashboard for easier iteration and A/B testing.
7. **Monitor costs** via OpenAI dashboard; set up usage alerts.

---

## Resources

- **Official docs:** https://platform.openai.com/docs/api-reference
- **Responses API guide:** https://platform.openai.com/docs/guides/text
- **Structured Outputs:** https://platform.openai.com/docs/guides/structured-outputs
- **Pricing:** https://platform.openai.com/docs/pricing
- **Rate limits:** https://platform.openai.com/docs/guides/rate-limits
