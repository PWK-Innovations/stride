import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchTodaysEvents } from '@/lib/google/fetchTodaysEvents';
import { parseBusyWindows } from '@/lib/google/parseBusyWindows';
import { buildSchedulePrompt } from '@/lib/openai/buildSchedulePrompt';
import { callSchedulingEngine } from '@/lib/openai/callSchedulingEngine';
import { refreshAccessToken } from '@/lib/google/refreshAccessToken';
import { friendlyMessage } from '@/lib/errors/friendlyMessage';
import { createLogger } from '@/lib/logger';

const logger = createLogger("api:schedule");

export async function POST() {
  try {
    const supabase = await createClient();

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

    // 4. Fetch tasks + calendar events in parallel
    const [tasksResult, events] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', user.id),
      fetchTodaysEvents(accessToken),
    ]);

    if (tasksResult.error) {
      return NextResponse.json(
        { error: friendlyMessage(tasksResult.error) },
        { status: 500 },
      );
    }

    const tasks = tasksResult.data;

    if (!tasks || tasks.length === 0) {
      return NextResponse.json(
        { error: friendlyMessage('No tasks to schedule') },
        { status: 400 },
      );
    }

    const busyWindows = parseBusyWindows(events);

    // 6. Build prompt and call OpenAI
    const prompt = buildSchedulePrompt({ tasks, busyWindows });
    const schedule = await callSchedulingEngine(prompt);

    // 7. Validate AI output — filter to only real task IDs
    const taskIds = new Set(tasks.map((t) => t.id));
    const validBlocks = schedule.scheduled_blocks.filter((block) =>
      taskIds.has(block.task_id),
    );
    const invalidBlockIds = schedule.scheduled_blocks
      .filter((block) => !taskIds.has(block.task_id))
      .map((block) => block.task_id);

    if (invalidBlockIds.length > 0) {
      logger.warn("AI returned invalid task IDs, filtered out", {
        invalidIds: invalidBlockIds,
      });
    }

    const validOverflow = schedule.overflow.filter((id) => taskIds.has(id));

    // 8. Delete existing scheduled blocks for today
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

    // 9. Insert new scheduled blocks
    if (validBlocks.length > 0) {
      const blocksToInsert = validBlocks.map((block) => {
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
          { error: friendlyMessage(insertError) },
          { status: 500 },
        );
      }
    }

    // 10. Return schedule
    return NextResponse.json({
      scheduled_blocks: validBlocks,
      overflow: validOverflow,
      busy_windows: busyWindows,
    });
  } catch (error: unknown) {
    const raw = error instanceof Error ? error.message : String(error);
    logger.error("Build schedule failed", { error: raw });
    return NextResponse.json(
      { error: friendlyMessage(error) },
      { status: 500 },
    );
  }
}
