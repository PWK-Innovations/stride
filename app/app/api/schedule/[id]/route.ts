import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/api-auth";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api:schedule:update");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { start_time, end_time } = body;

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
