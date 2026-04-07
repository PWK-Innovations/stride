import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase/api-auth';
import { friendlyMessage } from '@/lib/errors/friendlyMessage';
import { createLogger } from '@/lib/logger';

const logger = createLogger('api:tasks:delete');

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const { user, supabase } = auth;

    // Delete associated scheduled blocks first
    const { error: blockError } = await supabase
      .from('scheduled_blocks')
      .delete()
      .eq('task_id', id)
      .eq('user_id', user.id);

    if (blockError) {
      logger.warn("Failed to delete scheduled blocks for task", { taskId: id, error: blockError.message });
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error("Failed to delete task", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: friendlyMessage(error) },
      { status: 500 },
    );
  }
}
