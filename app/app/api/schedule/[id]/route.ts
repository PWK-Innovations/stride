import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/api-auth";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:schedule:block");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { start_time, end_time, cascade } = body;

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "start_time and end_time are required" },
        { status: 400 },
      );
    }

    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const { user, supabase } = auth;

    // Verify the block belongs to the user
    const { data: block, error: fetchError } = await supabase
      .from("scheduled_blocks")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    if (block.user_id !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Validate time range
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    if (startDate >= endDate) {
      return NextResponse.json({ error: "start_time must be before end_time" }, { status: 400 });
    }

    // Check for conflicts with other blocks
    const { data: overlapping } = await supabase
      .from("scheduled_blocks")
      .select("id, title, start_time, end_time")
      .eq("user_id", user.id)
      .neq("id", id)
      .lt("start_time", end_time)
      .gt("end_time", start_time)
      .order("start_time", { ascending: true });

    if (overlapping && overlapping.length > 0) {
      if (!cascade) {
        return NextResponse.json(
          { error: "Time slot conflicts with: " + overlapping.map((b) => b.title).join(", ") },
          { status: 409 },
        );
      }

      // Cascade mode: push overlapping blocks forward
      const BREAK_MS = 10 * 60_000;
      let cursor = endDate.getTime() + BREAK_MS;

      for (const ob of overlapping) {
        const obStart = new Date(ob.start_time).getTime();
        const obEnd = new Date(ob.end_time).getTime();
        const duration = obEnd - obStart;

        // Only push forward if the block actually needs to move
        if (obStart < cursor) {
          const newStart = new Date(cursor);
          const newEnd = new Date(cursor + duration);

          const { error: cascadeError } = await supabase
            .from("scheduled_blocks")
            .update({ start_time: newStart.toISOString(), end_time: newEnd.toISOString() })
            .eq("id", ob.id);

          if (cascadeError) {
            logger.error("Failed to cascade-move block", { blockId: ob.id, error: cascadeError.message });
          }

          cursor = newEnd.getTime() + BREAK_MS;
        } else {
          cursor = obEnd + BREAK_MS;
        }
      }

      logger.info("Cascade-pushed blocks forward", { count: overlapping.length });
    }

    const { error: updateError } = await supabase
      .from("scheduled_blocks")
      .update({ start_time, end_time })
      .eq("id", id);

    if (updateError) {
      logger.error("Failed to update block", { userId: user.id, blockId: id, error: updateError.message });
      return NextResponse.json(
        { error: "Failed to update block" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error("Unexpected error updating block", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json(
      { error: "Failed to update block" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const { user, supabase } = auth;

    const { data: block, error: fetchError } = await supabase
      .from("scheduled_blocks")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    if (block.user_id !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("scheduled_blocks")
      .delete()
      .eq("id", id);

    if (deleteError) {
      logger.error("Failed to delete block", { userId: user.id, blockId: id, error: deleteError.message });
      return NextResponse.json({ error: "Failed to delete block" }, { status: 500 });
    }

    logger.info("Block deleted", { userId: user.id, blockId: id });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    logger.error("Unexpected error deleting block", { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: "Failed to delete block" }, { status: 500 });
  }
}
