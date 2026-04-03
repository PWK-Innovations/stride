# Supabase API Reference (for Stride)

Quick reference for Supabase JS client usage in our Next.js app. Covers auth, database, storage, and OAuth.

---

## Setup

### Install

```bash
npm install @supabase/supabase-js
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<your-project-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

### Initialize Client

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
```

### Server-Side Client (Next.js App Router)

```typescript
// lib/supabase/server.ts
import { createClient } from "@/lib/supabase/server";

async function getData() {
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select();
  return data;
}
```

### Client Options

```typescript
const supabase = createClient(url, key, {
  db: { schema: "public" },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

---

## Authentication

### Sign Up (Email/Password)

```typescript
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "secure-password",
  options: {
    data: { first_name: "John" }, // optional metadata
  },
});
```

If "Confirm email" is enabled, `user` is returned but `session` is null. If disabled, both are returned.

### Sign In (Email/Password)

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "secure-password",
});
```

### Sign In with OAuth (Google)

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: "https://yourapp.com/auth/callback",
    scopes: "https://www.googleapis.com/auth/calendar.readonly",
  },
});
```

> **Stride note:** We request the `calendar.readonly` scope here so Google Calendar access is granted during the same OAuth flow as login. One auth step, two features.

### Capture Provider Tokens (for Google Calendar)

Register this listener immediately after creating the client to capture the Google OAuth token:

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.provider_token) {
    window.localStorage.setItem("oauth_provider_token", session.provider_token);
  }
  if (session?.provider_refresh_token) {
    window.localStorage.setItem("oauth_provider_refresh_token", session.provider_refresh_token);
  }
  if (event === "SIGNED_OUT") {
    window.localStorage.removeItem("oauth_provider_token");
    window.localStorage.removeItem("oauth_provider_refresh_token");
  }
});
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current Session / User

```typescript
const { data: { session } } = await supabase.auth.getSession();
const { data: { user } } = await supabase.auth.getUser();
```

### Listen to Auth State Changes

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  // event: "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED" | etc.
  console.log(event, session);
});
```

---

## Database (PostgreSQL)

### Select (Read)

```typescript
// All rows
const { data, error } = await supabase.from("tasks").select();

// Specific columns
const { data, error } = await supabase.from("tasks").select("id, title, duration");

// With related table (join)
const { data, error } = await supabase
  .from("tasks")
  .select(`
    id, title,
    scheduled_blocks (
      start_time, end_time
    )
  `);

// With count only
const { count, error } = await supabase
  .from("tasks")
  .select("*", { count: "exact", head: true });
```

> Default max: 1,000 rows per query.

### Filters

```typescript
// Equality
.eq("user_id", userId)
.neq("status", "deleted")

// Comparison
.gt("duration", 30)
.gte("priority", 1)
.lt("duration", 120)
.lte("priority", 3)

// Pattern matching
.like("title", "%meeting%")
.ilike("title", "%MEETING%")  // case-insensitive

// In list
.in("status", ["pending", "in_progress"])

// Combine with or
.or("status.eq.pending,status.eq.in_progress")
```

### Modifiers

```typescript
// Order
.order("created_at", { ascending: false })

// Limit
.limit(10)

// Pagination
.range(0, 9)  // first 10 rows

// Single row
.single()       // error if not exactly 1 row
.maybeSingle()  // null if 0 rows, error if >1
```

### Insert (Create)

```typescript
// Single row
const { error } = await supabase
  .from("tasks")
  .insert({ title: "Review PR", duration: 30, user_id: userId });

// Multiple rows
const { error } = await supabase
  .from("tasks")
  .insert([
    { title: "Review PR", duration: 30, user_id: userId },
    { title: "Write tests", duration: 60, user_id: userId },
  ]);

// Insert and return the new row
const { data, error } = await supabase
  .from("tasks")
  .insert({ title: "Review PR", duration: 30, user_id: userId })
  .select();
```

### Update

```typescript
const { error } = await supabase
  .from("tasks")
  .update({ status: "completed" })
  .eq("id", taskId);

// Update and return
const { data, error } = await supabase
  .from("tasks")
  .update({ status: "completed" })
  .eq("id", taskId)
  .select();
```

### Upsert (Insert or Update)

```typescript
const { data, error } = await supabase
  .from("tasks")
  .upsert({ id: taskId, title: "Updated title", duration: 45 })
  .select();
```

### Delete

```typescript
const { error } = await supabase
  .from("tasks")
  .delete()
  .eq("id", taskId);
```

---

## Storage (for Task Photos)

### Upload a File

```typescript
const { data, error } = await supabase.storage
  .from("task-photos")
  .upload("user123/photo1.png", file, {
    cacheControl: "3600",
    contentType: "image/png",
    upsert: false,
  });
```

> Path format: `folder/subfolder/filename.ext`

### Download a File

```typescript
const { data, error } = await supabase.storage
  .from("task-photos")
  .download("user123/photo1.png");
```

### Get Public URL

```typescript
const { data } = supabase.storage
  .from("task-photos")
  .getPublicUrl("user123/photo1.png");

// data.publicUrl → use in <img> tags
```

### Create a Signed URL (Temporary Access)

```typescript
const { data, error } = await supabase.storage
  .from("task-photos")
  .createSignedUrl("user123/photo1.png", 3600); // expires in 1 hour
```

### List Files

```typescript
const { data, error } = await supabase.storage
  .from("task-photos")
  .list("user123", {
    limit: 100,
    offset: 0,
  });
```

### Delete Files

```typescript
const { error } = await supabase.storage
  .from("task-photos")
  .remove(["user123/photo1.png", "user123/photo2.png"]);
```

---

## Row Level Security (RLS)

All tables should have RLS enabled. Example policies for our tasks table:

```sql
-- Users can only read their own tasks
create policy "Users read own tasks"
on public.tasks for select
using (auth.uid() = user_id);

-- Users can only insert their own tasks
create policy "Users insert own tasks"
on public.tasks for insert
with check (auth.uid() = user_id);

-- Users can only update their own tasks
create policy "Users update own tasks"
on public.tasks for update
using (auth.uid() = user_id);

-- Users can only delete their own tasks
create policy "Users delete own tasks"
on public.tasks for delete
using (auth.uid() = user_id);
```

---

## Stride-Specific Patterns

### Google OAuth + Calendar in One Flow

Use `signInWithOAuth` with Google and request `calendar.readonly` scope. This gives us both auth and calendar access in a single user action. Store the `provider_token` to call the Google Calendar API.

### Task Photo Upload Flow

1. User attaches photo → upload to Supabase Storage (`task-photos` bucket)
2. Get the public URL or signed URL
3. Store the URL on the task row in the `tasks` table
4. When building the schedule, pass photo URLs to OpenAI for context

### Typical Query: Get Today's Tasks for a User

```typescript
const { data: tasks, error } = await supabase
  .from("tasks")
  .select("*")
  .eq("user_id", userId)
  .eq("date", today)
  .order("created_at", { ascending: true });
```

---

## Resources

- [Supabase JS Docs](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase + Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
