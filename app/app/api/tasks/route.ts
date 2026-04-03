import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/api-auth';
import { friendlyMessage } from '@/lib/errors/friendlyMessage';
import { createLogger } from '@/lib/logger';

const logger = createLogger('api:tasks');

// GET /api/tasks - List user's tasks
export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const { user, supabase } = auth;

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    logger.error("Failed to list tasks", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: friendlyMessage(error) },
      { status: 500 },
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const { user, supabase } = auth;

    const body = await request.json();
    const { title, notes, duration_minutes, photo_url } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title,
        notes: notes || null,
        duration_minutes: duration_minutes || 30,
        photo_url: photo_url || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: unknown) {
    logger.error("Failed to create task", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: friendlyMessage(error) },
      { status: 500 },
    );
  }
}
