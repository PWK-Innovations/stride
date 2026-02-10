# Stride Setup Instructions

## Phase 0: Foundation - Setup Complete ✓

The Next.js app is initialized with:
- TypeScript and Tailwind CSS
- Oatmeal-olive-instrument theme (olive palette, Instrument Serif, Inter fonts)
- Project structure (app/, components/, lib/, types/)
- Supabase and OpenAI SDK installed
- Integration smoke test routes

## Next Steps

### 1. Set up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. Go to Project Settings → Database and copy your service role key (keep this secret!)
5. Update `.env.local` with your Supabase credentials

### 2. Create Database Tables

1. Go to Supabase SQL Editor
2. Copy the contents of `lib/supabase/schema.sql`
3. Run the SQL to create tables and RLS policies

### 3. Set up OpenAI API

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add it to `.env.local`

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3001/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env.local`

### 5. Test Integrations

Once all credentials are in `.env.local`, test the smoke tests:

```bash
# Supabase test
curl http://localhost:3001/api/test/supabase

# OpenAI test
curl http://localhost:3001/api/test/openai

# Google OAuth test (open in browser)
open http://localhost:3001/api/auth/google
```

## Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## What's Next

- **Phase 1**: Task CRUD, Calendar integration, AI scheduling, "Build my day"
- **Phase 2**: Timeline UI, PWA setup, notifications
