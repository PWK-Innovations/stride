import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { fetchTodaysEvents } from '@/lib/google/fetchTodaysEvents';
import { parseBusyWindows } from '@/lib/google/parseBusyWindows';
import { buildSchedulePrompt } from '@/lib/openai/buildSchedulePrompt';
import { callSchedulingEngine } from '@/lib/openai/callSchedulingEngine';
import { refreshAccessToken } from '@/lib/google/refreshAccessToken';

export async function POST() {
  try {
    // 1. Authenticate user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Get user's profile with Google tokens
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (!profile.google_access_token || !profile.google_refresh_token) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 400 }
      );
    }

    // 3. Check if token is expired and refresh if needed
    let accessToken = profile.google_access_token;
    const expiresAt = new Date(profile.google_token_expires_at);
    const now = new Date();

    if (now >= expiresAt) {
      const tokens = await refreshAccessToken(profile.google_refresh_token);
      accessToken = tokens.access_token;

      // Update tokens in database
      const newExpiresAt = new Date(now.getTime() + tokens.expires_in * 1000);
      await supabase
        .from('profiles')
        .update({
          google_access_token: accessToken,
          google_token_expires_at: newExpiresAt.toISOString(),
        })
        .eq('id', user.id);
    }

    // 4. Fetch user's tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id);

    if (tasksError) {
      return NextResponse.json({ error: tasksError.message }, { status: 500 });
    }

    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: 'No tasks to schedule' },
        { status: 400 }
      );
    }

    // 5. Fetch today's calendar events
    const events = await fetchTodaysEvents(accessToken);
    const busyWindows = parseBusyWindows(events);

    // 6. Build prompt and call OpenAI
    const prompt = buildSchedulePrompt({ tasks, busyWindows });
    const schedule = await callSchedulingEngine(prompt);

    // 7. Delete existing scheduled blocks for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    await supabase
      .from('scheduled_blocks')
      .delete()
      .eq('user_id', user.id)
      .gte('start_time', startOfDay.toISOString())
      .lte('start_time', endOfDay.toISOString());

    // 8. Insert new scheduled blocks
    if (schedule.scheduled_blocks.length > 0) {
      const blocksToInsert = schedule.scheduled_blocks.map((block) => {
        const task = tasks.find((t) => t.id === block.task_id);
        return {
          user_id: user.id,
          task_id: block.task_id,
          start_time: block.start_time,
          end_time: block.end_time,
          title: task?.title || 'Unknown task',
          source: 'ai' as const,
        };
      });

      const { error: insertError } = await supabase
        .from('scheduled_blocks')
        .insert(blocksToInsert);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    // 9. Return schedule
    return NextResponse.json({
      scheduled_blocks: schedule.scheduled_blocks,
      overflow: schedule.overflow,
      busy_windows: busyWindows,
    });
  } catch (error: any) {
    console.error('Build schedule error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
